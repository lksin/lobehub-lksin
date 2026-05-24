import { sql } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';
import { getServerDBConfig } from '@/config/db';
import { getServerDB } from '@/database/core/db-adaptor';
import { aiModels, aiProviders } from '@/database/schemas/aiInfra';
import { KeyVaultsGateKeeper } from '@/server/modules/KeyVaultsEncrypt';

export const runtime = 'nodejs';

// ─────────────────────────────────────────────────────────────────────────────
// V2 API contract  (implement these types on your V2 server)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Capability flags for a single model.
 * All fields are optional — omit or set false for unsupported capabilities.
 */
interface V2ModelAbilities {
  /** File upload & analysis (PDF, Word, etc.) */
  files?: boolean;
  /** Tool / function call */
  function_call?: boolean;
  /** Image generation / output */
  image_output?: boolean;
  /** Deep-thinking / chain-of-thought reasoning */
  reasoning?: boolean;
  /** Built-in web search */
  search?: boolean;
  /** Video understanding / recognition */
  video?: boolean;
  /** Image / vision understanding */
  vision?: boolean;
}

/**
 * Single model entry.  Include `models` in the provider payload so Lobe
 * never has to call /models separately.
 */
interface V2Model {
  /** Model ID — must match the id you send to the inference API */
  id: string;
  /** Human-readable name shown in the model selector. Falls back to id. */
  display_name?: string;
  /**
   * Model type.
   * Allowed: "chat" | "embedding" | "tts" | "stt" | "image" | "video" | "realtime" | "text2music"
   * Defaults to "chat".
   */
  type?: 'chat' | 'embedding' | 'image' | 'realtime' | 'stt' | 'text2music' | 'tts' | 'video';
  /** Context window in tokens, e.g. 128000 */
  context_window_tokens?: number;
  /** Capability flags */
  abilities?: V2ModelAbilities;
  /** Release date in YYYY-MM-DD format, e.g. "2024-10-22" */
  released_at?: string;
}

interface V2Provider {
  api_key: string;
  base_url: string;
  id: string;
  name: string;
  sdk_type?: string;
  /**
   * Full model list with capability metadata.
   * When present → used directly, no extra /models fetch.
   * When absent  → falls back to GET {base_url}/models (legacy, no abilities).
   */
  models?: V2Model[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

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

/** Map V2 snake_case ability keys → Lobe camelCase ModelAbilities */
function mapAbilities(a?: V2ModelAbilities): Record<string, boolean> {
  if (!a) return {};
  const out: Record<string, boolean> = {};
  if (a.files !== undefined) out.files = a.files;
  if (a.function_call !== undefined) out.functionCall = a.function_call;
  if (a.image_output !== undefined) out.imageOutput = a.image_output;
  if (a.reasoning !== undefined) out.reasoning = a.reasoning;
  if (a.search !== undefined) out.search = a.search;
  if (a.video !== undefined) out.video = a.video;
  if (a.vision !== undefined) out.vision = a.vision;
  return out;
}

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

// ─────────────────────────────────────────────────────────────────────────────
// Route handler
// ─────────────────────────────────────────────────────────────────────────────

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

  const v2UserId = await lookupV2UserId(V2_API_URL, V2_LOBE_SHARED_SECRET, email);
  if (!v2UserId) {
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

      const now = new Date();

      if (p.models && p.models.length > 0) {
        // ── Rich path: V2 server supplies full model metadata ─────────────────
        const records = p.models.map((m) => ({
          abilities: mapAbilities(m.abilities),
          contextWindowTokens: m.context_window_tokens ?? null,
          displayName: m.display_name ?? null,
          enabled: true,
          id: m.id,
          providerId: p.id,
          releasedAt: m.released_at ?? null,
          source: 'remote' as const,
          type: (m.type ?? 'chat') as typeof aiModels.$inferInsert.type,
          updatedAt: now,
          userId,
        }));

        await db
          .insert(aiModels)
          .values(records)
          .onConflictDoUpdate({
            // Use EXCLUDED pseudo-table so each row gets its own values on conflict
            set: {
              abilities: sql`excluded.abilities`,
              contextWindowTokens: sql`excluded.context_window_tokens`,
              displayName: sql`excluded.display_name`,
              enabled: true,
              releasedAt: sql`excluded.released_at`,
              type: sql`excluded.type`,
              updatedAt: now,
            },
            target: [aiModels.id, aiModels.providerId, aiModels.userId],
          });
      } else if (p.base_url && p.api_key) {
        // ── Legacy path: fall back to /models endpoint (no abilities) ─────────
        const remoteModels = await fetchProviderModels(p.base_url, p.api_key);
        if (remoteModels.length > 0) {
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
