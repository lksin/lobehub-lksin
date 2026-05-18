import { type AIChatModelCard, LOBE_DEFAULT_MODEL_LIST } from 'model-bank';

import type { ChatCompletionTool } from '../types/chat';
import { AgentRuntimeErrorType } from '../types/error';
import { AgentRuntimeError } from './createError';

// ---------------------------------------------------------------------------
// Custom error class — modelled after ContextExceededPreFlightError so the
// existing error-handling pipeline (openaiCompatibleFactory / RouterRuntime)
// can catch and surface it as a structured chat error.
// ---------------------------------------------------------------------------

export const TOOL_LIMIT_ERROR_TYPE = 'ToolLimitExceeded' as const;

export class ToolLimitExceededError extends Error {
  readonly type = TOOL_LIMIT_ERROR_TYPE;
  readonly provider: string;
  readonly model: string;
  readonly toolCount: number;
  readonly maxToolCount?: number;
  readonly toolPayloadBytes: number;
  readonly maxToolPayloadBytes?: number;

  constructor(params: {
    maxToolCount?: number;
    maxToolPayloadBytes?: number;
    model: string;
    provider: string;
    toolCount: number;
    toolPayloadBytes: number;
  }) {
    const { provider, model, toolCount, maxToolCount, toolPayloadBytes, maxToolPayloadBytes } =
      params;

    const parts: string[] = [];
    if (maxToolCount !== undefined && toolCount > maxToolCount) {
      parts.push(
        `工具数量 (${toolCount}) 超过模型 ${provider}/${model} 的上限 (${maxToolCount})。`,
      );
    }
    if (
      maxToolPayloadBytes !== undefined &&
      toolPayloadBytes > maxToolPayloadBytes
    ) {
      const kb = Math.round(toolPayloadBytes / 1024);
      const maxKb = Math.round(maxToolPayloadBytes / 1024);
      parts.push(
        `工具 payload 大小 (${kb} KB) 超过模型 ${provider}/${model} 的上限 (${maxKb} KB)。`,
      );
    }
    parts.push('请减少 MCP server 数量，或切换到无此限制的模型。');

    super(parts.join(' '));
    this.name = 'ToolLimitExceededError';
    this.provider = provider;
    this.model = model;
    this.toolCount = toolCount;
    this.maxToolCount = maxToolCount;
    this.toolPayloadBytes = toolPayloadBytes;
    this.maxToolPayloadBytes = maxToolPayloadBytes;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Resolve the model card that matches `modelId` and `providerId` from the
 * built-in model registry. Returns `undefined` when no entry is found (e.g.
 * for custom / remote models).
 */
function resolveModelCard(
  modelId: string,
  providerId: string,
): AIChatModelCard | undefined {
  return LOBE_DEFAULT_MODEL_LIST.find(
    (m) => m.id === modelId && m.providerId === providerId,
  ) as AIChatModelCard | undefined;
}

/**
 * Compute the approximate byte length of the serialised tools array.
 * We use `JSON.stringify` because that's what most HTTP adapters do when
 * posting to upstream providers.
 */
function measureToolPayloadBytes(tools: ChatCompletionTool[]): number {
  return new TextEncoder().encode(JSON.stringify(tools)).length;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface ValidateToolLimitsParams {
  model: string;
  provider: string;
  tools: ChatCompletionTool[];
}

/**
 * Validate that the given tools array does not exceed provider / model limits
 * declared in the model registry (`maxToolCount`, `maxToolPayloadBytes`).
 *
 * - When limits are violated a `ToolLimitExceededError` is thrown.
 * - When the model is not found in the built-in registry the check is
 *   silently skipped (we don't want to block custom / remote models).
 * - When the model card carries neither `maxToolCount` nor
 *   `maxToolPayloadBytes` the check is also skipped.
 */
export function validateToolLimits({
  model,
  provider,
  tools,
}: ValidateToolLimitsParams): void {
  if (!tools || tools.length === 0) return;

  const modelCard = resolveModelCard(model, provider);
  if (!modelCard) return;

  const { maxToolCount, maxToolPayloadBytes } = modelCard;
  if (maxToolCount === undefined && maxToolPayloadBytes === undefined) return;

  const toolPayloadBytes = maxToolPayloadBytes !== undefined
    ? measureToolPayloadBytes(tools)
    : 0;

  const countExceeded = maxToolCount !== undefined && tools.length > maxToolCount;
  const sizeExceeded =
    maxToolPayloadBytes !== undefined && toolPayloadBytes > maxToolPayloadBytes;

  if (!countExceeded && !sizeExceeded) return;

  throw new ToolLimitExceededError({
    maxToolCount,
    maxToolPayloadBytes,
    model,
    provider,
    toolCount: tools.length,
    toolPayloadBytes,
  });
}

/**
 * Convenience wrapper that throws an `AgentRuntimeError` so the caller
 * doesn't need to import the error class directly.
 */
export function assertToolLimits(params: ValidateToolLimitsParams): void {
  try {
    validateToolLimits(params);
  } catch (error) {
    if (error instanceof ToolLimitExceededError) {
      // AgentRuntimeError.chat() composes a ChatCompletionErrorPayload; throwing
      // it lets the runtime's error handler (createErrorResult) surface a
      // structured llm_error event to the caller.
      throw AgentRuntimeError.chat({
        endpoint: undefined,
        error: {
          maxToolCount: error.maxToolCount,
          maxToolPayloadBytes: error.maxToolPayloadBytes,
          message: error.message,
          toolCount: error.toolCount,
          toolPayloadBytes: error.toolPayloadBytes,
        },
        errorType: AgentRuntimeErrorType.ExceededToolLimit,
        provider: params.provider,
      });
    }
    throw error;
  }
}
