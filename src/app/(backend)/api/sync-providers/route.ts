import { type NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';
import { getServerDBConfig } from '@/config/db';
import { getServerDB } from '@/database/core/db-adaptor';
import { aiModels, aiProviders } from '@/database/schemas/aiInfra';
import { KeyVaultsGateKeeper } from '@/server/modules/KeyVaultsEncrypt';

export const runtime = 'nodejs';

interface V2Provider {
  api_key: string;
  base_url: string;
  id: string;
  name: string;
  sdk_type?: string;
}

interface OpenAIModel {
  id: string;
  object?: string;
  owned_by?: string;
}

async function fetchProviderModels(baseUrl: string, apiKey: string): Promise<OpenAIModel[]> {
  try {
    const resp = await fetch(`${baseUrl}/models`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(10_000),
    });
    if (!resp.ok) return [];
    const data = await resp.json();
    return Array.isArray(data?.data) ? data.data : [];
  } catch {
    return [];
  }
}

/**
 * Look up the V2 integer user ID for a given email address.
 * V2 endpoint: GET /api/lobe/users/by-email/:email
 * Returns { id: number } on success, null if not found.
 */
async function lookupV2UserId(
  v2ApiUrl: string,
  sharedSecret: string,
  email: string,
): Promise<number | null> {
  try {
    const resp = await fetch(
      `${v2ApiUrl}/api/lobe/users/by-email/${encodeURIComponent(email)}`,
      { headers: { 'X-Lobe-Secret': sharedSecret } },
    );
    if (!resp.ok) return null;
    const data = await resp.json();
    return typeof data?.id === 'number' ? data.id : null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { V2_API_URL, V2_LOBE_SHARED_SECRET } = getServerDBConfig();
  if (!V2_API_URL || !V2_LOBE_SHARED_SECRET) {
    return NextResponse.json({ error: 'v2 sync not configured' }, { status: 503 });
  }

  const userId = session.user.id;
  const email = session.user.email;

  if (!email) {
    return NextResponse.json({ error: 'User email not available' }, { status: 400 });
  }

  // Resolve the current user's V2 integer ID via email — each user gets their own providers
  const v2UserId = await lookupV2UserId(V2_API_URL, V2_LOBE_SHARED_SECRET, email);
  if (!v2UserId) {
    // User not found in V2 system; skip sync gracefully
    return NextResponse.json({ synced: 0 });
  }

  let providers: V2Provider[];
  try {
    const resp = await fetch(`${V2_API_URL}/api/lobe/providers/${v2UserId}`, {
      headers: { 'X-Lobe-Secret': V2_LOBE_SHARED_SECRET },
    });

    if (!resp.ok) {
      return NextResponse.json({ error: 'v2 API error', status: resp.status }, { status: 502 });
    }

    const data = await resp.json();
    providers = data.providers ?? [];
  } catch {
    return NextResponse.json({ error: 'Failed to reach v2 API' }, { status: 502 });
  }

  if (providers.length === 0) {
    return NextResponse.json({ synced: 0 });
  }

  const db = await getServerDB();
  const gateKeeper = await KeyVaultsGateKeeper.initWithEnvKey();

  await Promise.all(
    providers.map(async (p) => {
      const keyVaultsJson = JSON.stringify({
        apiKey: p.api_key,
        ...(p.base_url ? { baseURL: p.base_url } : {}),
      });
      const encryptedKeyVaults = await gateKeeper.encrypt(keyVaultsJson);

      await db
        .insert(aiProviders)
        .values({
          enabled: true,
          id: p.id,
          keyVaults: encryptedKeyVaults,
          name: p.name,
          source: 'custom',
          updatedAt: new Date(),
          userId,
        })
        .onConflictDoUpdate({
          set: {
            enabled: true,
            keyVaults: encryptedKeyVaults,
            name: p.name,
            updatedAt: new Date(),
          },
          target: [aiProviders.id, aiProviders.userId],
        });

      // Auto-fetch and enable all models for this provider
      if (p.base_url && p.api_key) {
        const remoteModels = await fetchProviderModels(p.base_url, p.api_key);
        if (remoteModels.length > 0) {
          const now = new Date();
          const records = remoteModels.map((m) => ({
            enabled: true,
            id: m.id,
            providerId: p.id,
            source: 'remote' as const,
            type: 'chat' as const,
            updatedAt: now,
            userId,
          }));

          await db
            .insert(aiModels)
            .values(records)
            .onConflictDoUpdate({
              set: { enabled: true, updatedAt: now },
              target: [aiModels.id, aiModels.providerId, aiModels.userId],
            });
        }
      }
    }),
  );

  return NextResponse.json({ synced: providers.length });
}
