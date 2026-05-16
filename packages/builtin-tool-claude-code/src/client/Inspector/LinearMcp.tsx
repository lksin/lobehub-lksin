'use client';

import { inspectorTextStyles, shinyTextStyles } from '@lobechat/shared-tool-ui/styles';
import type { BuiltinInspector, BuiltinInspectorProps } from '@lobechat/types';
import { createStaticStyles, cx } from 'antd-style';
import { CornerLeftUp } from 'lucide-react';
import { memo } from 'react';

export const LINEAR_MCP_PREFIX = 'mcp__claude_ai_Linear__';

// Mirrors the wire names CC emits for the claude.ai Linear MCP server.
export const LINEAR_MCP_TOOL_NAMES = [
  'create_attachment',
  'create_attachment_from_upload',
  'create_issue_label',
  'delete_attachment',
  'delete_comment',
  'delete_customer',
  'delete_customer_need',
  'delete_status_update',
  'extract_images',
  'get_attachment',
  'get_diff',
  'get_diff_threads',
  'get_document',
  'get_initiative',
  'get_issue',
  'get_issue_status',
  'get_milestone',
  'get_project',
  'get_status_updates',
  'get_team',
  'get_user',
  'list_comments',
  'list_customers',
  'list_cycles',
  'list_diffs',
  'list_documents',
  'list_initiatives',
  'list_issue_labels',
  'list_issue_statuses',
  'list_issues',
  'list_milestones',
  'list_project_labels',
  'list_projects',
  'list_teams',
  'list_users',
  'prepare_attachment_upload',
  'save_comment',
  'save_customer',
  'save_customer_need',
  'save_document',
  'save_initiative',
  'save_issue',
  'save_milestone',
  'save_project',
  'save_status_update',
  'search_documentation',
] as const;

const styles = createStaticStyles(({ css, cssVar }) => ({
  chip: css`
    overflow: hidden;
    display: inline-flex;
    flex-shrink: 1;
    align-items: stretch;

    min-width: 0;
    margin-inline-start: 6px;
    border-radius: 999px;

    font-size: 12px;
    line-height: 18px;

    background: ${cssVar.colorFillTertiary};
  `,
  chipAction: css`
    flex-shrink: 0;
    padding-block: 2px;
    padding-inline: 10px;
    color: ${cssVar.colorText};
  `,
  chipDivider: css`
    flex-shrink: 0;
    align-self: stretch;
    width: 1px;
    background: ${cssVar.colorBorderSecondary};
  `,
  chipIcon: css`
    flex-shrink: 0;
    color: ${cssVar.colorTextDescription};
  `,
  chipKey: css`
    color: ${cssVar.colorTextDescription};
  `,
  chipValue: css`
    overflow: hidden;
    display: inline-flex;
    flex-shrink: 1;
    gap: 4px;
    align-items: center;

    min-width: 0;
    padding-block: 2px;
    padding-inline: 10px;

    font-family: ${cssVar.fontFamilyCode};
    color: ${cssVar.colorText};
  `,
  chipValueText: css`
    overflow: hidden;
    min-width: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  icon: css`
    flex-shrink: 0;
    margin-inline-end: 6px;
    color: ${cssVar.colorTextDescription};
  `,
  parentBadge: css`
    display: inline-flex;
    flex-shrink: 0;
    gap: 4px;
    align-items: center;

    margin-inline-start: 6px;
    padding-block: 2px;
    padding-inline: 8px;
    border-radius: 999px;

    font-family: ${cssVar.fontFamilyCode};
    font-size: 12px;
    color: ${cssVar.colorText};

    background: ${cssVar.colorFillQuaternary};
  `,
  parentBadgeIcon: css`
    flex-shrink: 0;
    color: ${cssVar.colorTextDescription};
  `,
  productPrefix: css`
    flex-shrink: 0;

    margin-inline-end: 2px;

    font-size: 13px;
    font-weight: 500;
    color: ${cssVar.colorText};
  `,
}));

const LinearLogomark = memo<{ size?: number }>(({ size = 14 }) => (
  <svg
    aria-hidden="true"
    className={styles.icon}
    height={size}
    viewBox="0 0 100 100"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.22541 61.5228c-.2225-.9485.90748-1.5459 1.59638-.857l36.5217 36.5208c.6889.6892.0915 1.8191-.857 1.5962C20.0696 93.4248 6.4263 79.7822 1.22541 61.5228ZM.00189 46.8083c-.034026.4081.115306.8067.405562 1.0969l51.683 51.683c.2903.2903.6888.4396 1.0969.4056 2.0035-.16708 3.9669-.49328 5.8741-.96868.7361-.18352.9961-1.0903.4607-1.6256L2.5907 40.4732c-.5353-.5354-1.4421-.2754-1.6256.4607-.475415 1.9072-.801574 3.8706-.968613 5.8744ZM4.21462 29.7355c-.16002.3549-.08227.7719.19288 1.047L69.2174 95.5901c.275.2752.6921.353 1.047.193 1.4913-.6716 2.9332-1.43 4.3197-2.275.5025-.3061.5856-1.0023.1674-1.4205L8.31112 25.279c-.41817-.4181-1.11435-.3349-1.42044.1675-.84572 1.3873-1.60473 2.8284-2.27606 4.319ZM12.6963 18.6088c-.3683-.3684-.3923-.9577-.0469-1.3489C21.7846 6.9544 35.1342 0 50 0c27.6142 0 50 22.3858 50 50 0 14.8669-6.9544 28.2155-17.2598 37.3499-.3912.3461-.9805.3214-1.349-.0469L12.6963 18.6088Z"
      fill="currentColor"
    />
  </svg>
));
LinearLogomark.displayName = 'LinearLogomark';

// One-time noun overrides — multi-word suffixes a naive split would mangle.
const NOUN_OVERRIDES: Record<string, string> = {
  customer_need: 'customer need',
  diff_threads: 'diff threads',
  documentation: 'docs',
  issue_label: 'issue label',
  issue_labels: 'issue labels',
  issue_status: 'issue status',
  issue_statuses: 'issue statuses',
  project_labels: 'project labels',
  status_update: 'status update',
  status_updates: 'status updates',
};

interface ParsedTool {
  noun: string;
  verb: 'get' | 'list' | 'save' | 'create' | 'delete' | 'search' | 'extract' | 'prepare' | 'other';
}

const parseToolName = (apiName: string): ParsedTool => {
  const suffix = apiName.startsWith(LINEAR_MCP_PREFIX)
    ? apiName.slice(LINEAR_MCP_PREFIX.length)
    : apiName;

  if (suffix === 'extract_images') return { noun: 'images', verb: 'extract' };
  if (suffix === 'prepare_attachment_upload') return { noun: 'attachment upload', verb: 'prepare' };
  if (suffix === 'search_documentation') return { noun: 'docs', verb: 'search' };

  const underscoreIdx = suffix.indexOf('_');
  if (underscoreIdx <= 0) return { noun: suffix, verb: 'other' };

  const head = suffix.slice(0, underscoreIdx);
  const tail = suffix.slice(underscoreIdx + 1);
  const noun = NOUN_OVERRIDES[tail] ?? tail.replaceAll('_', ' ');

  switch (head) {
    case 'get':
    case 'list':
    case 'save':
    case 'create':
    case 'delete': {
      return { noun, verb: head };
    }
    default: {
      return { noun: suffix.replaceAll('_', ' '), verb: 'other' };
    }
  }
};

const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// args-free verb label; collapsed-summary view doesn't have access to runtime args,
// so `save_*` stays "Save {noun}" rather than guessing Create vs Update.
const staticLabelFor = (parsed: ParsedTool): string => {
  const { verb, noun } = parsed;
  switch (verb) {
    case 'extract': {
      return 'Extract images';
    }
    case 'prepare': {
      return 'Prepare attachment upload';
    }
    case 'search': {
      return 'Search docs';
    }
    case 'other': {
      return capitalize(noun);
    }
    default: {
      return `${capitalize(verb)} ${noun}`;
    }
  }
};

export const formatLinearMcpShortLabel = (apiName: string): string | null => {
  if (!apiName.startsWith(LINEAR_MCP_PREFIX)) return null;
  return `Linear · ${staticLabelFor(parseToolName(apiName))}`;
};

const labelFor = (parsed: ParsedTool, args: Record<string, unknown> | undefined): string => {
  const { verb, noun } = parsed;
  switch (verb) {
    case 'save': {
      const hasId = typeof args?.id === 'string' && (args.id as string).length > 0;
      return `${hasId ? 'Update' : 'Create'} ${noun}`;
    }
    case 'extract': {
      return 'Extract images';
    }
    case 'prepare': {
      return 'Prepare attachment upload';
    }
    case 'search': {
      return 'Search docs';
    }
    case 'other': {
      return capitalize(noun);
    }
    default: {
      return `${capitalize(verb)} ${noun}`;
    }
  }
};

const truncate = (value: string, max = 80): string =>
  value.length > max ? `${value.slice(0, max - 1)}…` : value;

const stringArg = (args: Record<string, unknown> | undefined, key: string): string | undefined => {
  const value = args?.[key];
  if (typeof value === 'string' && value.length > 0) return value;
  if (typeof value === 'number') return String(value);
  return undefined;
};

const PRIORITY_LABEL: Record<number, string> = {
  0: 'None',
  1: 'Urgent',
  2: 'High',
  3: 'Medium',
  4: 'Low',
};

interface Chip {
  iconType?: 'parent';
  key?: string;
  value: string;
}

interface ChipResult {
  parentId?: string;
  primary: Chip | null;
}

const pickPrimaryChip = (parsed: ParsedTool, args: Record<string, unknown>): Chip | null => {
  const { verb } = parsed;

  // Hard cap chip text so very long bodies/queries don't push the rest of the
  // inspector row off-screen; CSS ellipsis was unreliable at deep flex nesting.
  const PRIMARY_MAX = 60;
  const FILTER_MAX = 40;

  if (verb === 'search') {
    const query = stringArg(args, 'query');
    return query ? { value: truncate(query, PRIMARY_MAX) } : null;
  }

  if (verb === 'get' || verb === 'delete') {
    const id = stringArg(args, 'id');
    if (id) return { key: 'id', value: id };
  }

  if (verb === 'save' || verb === 'create') {
    const id = stringArg(args, 'id');
    if (id) return { key: 'id', value: id };
    const title = stringArg(args, 'title') ?? stringArg(args, 'name') ?? stringArg(args, 'body');
    if (title) return { value: truncate(title, PRIMARY_MAX) };
  }

  if (verb === 'list') {
    const query = stringArg(args, 'query');
    if (query) return { key: 'query', value: truncate(query, PRIMARY_MAX) };

    const filterKeys = ['team', 'project', 'assignee', 'state', 'cycle', 'parentId', 'label'];
    for (const key of filterKeys) {
      const value = stringArg(args, key);
      if (value) {
        return key === 'parentId'
          ? { iconType: 'parent', value }
          : { key, value: truncate(value, FILTER_MAX) };
      }
    }
    if (typeof args.priority === 'number') {
      return {
        key: 'priority',
        value: PRIORITY_LABEL[args.priority as number] ?? String(args.priority),
      };
    }
  }

  for (const [key, value] of Object.entries(args)) {
    if (typeof value === 'string' && value.length > 0) {
      return { key, value: truncate(value, PRIMARY_MAX) };
    }
  }
  return null;
};

const pickChip = (parsed: ParsedTool, args: Record<string, unknown> | undefined): ChipResult => {
  if (!args) return { primary: null };
  const primary = pickPrimaryChip(parsed, args);
  const parentId = stringArg(args, 'parentId');
  // Skip the secondary badge when parentId is already the primary chip value
  // (avoid duplicating the same identifier on the row).
  const showParent = parentId && primary?.value !== parentId;
  return { parentId: showParent ? parentId : undefined, primary };
};

const LinearMcpInspectorImpl = memo<BuiltinInspectorProps<Record<string, unknown>>>(
  ({ apiName, args, partialArgs, isArgumentsStreaming, isLoading }) => {
    const effectiveArgs = args ?? partialArgs;
    const parsed = parseToolName(apiName);
    const label = labelFor(parsed, effectiveArgs);
    const { primary, parentId } = pickChip(parsed, effectiveArgs);

    return (
      <div
        className={cx(
          inspectorTextStyles.root,
          (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText,
        )}
      >
        <LinearLogomark />
        <span className={styles.productPrefix}>Linear</span>
        <span className={styles.chip}>
          <span className={styles.chipAction}>{label}</span>
          {primary && (
            <>
              <span className={styles.chipDivider} />
              <span className={styles.chipValue}>
                {primary.iconType === 'parent' ? (
                  <CornerLeftUp className={styles.chipIcon} size={12} />
                ) : (
                  primary.key && <span className={styles.chipKey}>{primary.key}:</span>
                )}
                <span className={styles.chipValueText}>{primary.value}</span>
              </span>
            </>
          )}
        </span>
        {parentId && (
          <span className={styles.parentBadge} title={`parent: ${parentId}`}>
            <CornerLeftUp className={styles.parentBadgeIcon} size={12} />
            <span>{parentId}</span>
          </span>
        )}
      </div>
    );
  },
);
LinearMcpInspectorImpl.displayName = 'ClaudeCodeLinearMcpInspector';

export const LinearMcpInspector = LinearMcpInspectorImpl as unknown as BuiltinInspector;

export const LinearMcpInspectors: Record<string, BuiltinInspector> = Object.fromEntries(
  LINEAR_MCP_TOOL_NAMES.map((tool) => [`${LINEAR_MCP_PREFIX}${tool}`, LinearMcpInspector]),
);
