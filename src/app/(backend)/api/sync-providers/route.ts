import { type NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';
import { getServerDBConfig } from '@/config/db';
import { getServerDB } from '@/database/core/db-adaptor';
import { aiProviders } from '@/database/schemas/aiInfra';
import { KeyVaultsGateKeeper } from '@/server/modules/KeyVaultsEncrypt';

export const runtime = 'nodejs';

interface V2Provider {
  api_key: string;
  base_url: string;
  id: string;
  name: string;
  sdk_type?: string;
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { V2_API_URL, V2_LOBE_SHARED_SECRET, V2_USER_ID } = getServerDBConfig();
  if (!V2_API_URL || !V2_LOBE_SHARED_SECRET || !V2_USER_ID) {
    return NextResponse.json({ error: 'v2 sync not configured' }, { status: 503 });
  }

  const userId = session.user.id;

  let providers: V2Provider[];
  try {
    const resp = await fetch(`${V2_API_URL}/api/lobe/providers/${V2_USER_ID}`, {
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
    }),
  );

  return NextResponse.json({ synced: providers.length });
}
