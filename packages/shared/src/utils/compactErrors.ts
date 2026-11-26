/**
 * Compact representation of a validation failure, safe to include in agent-
 * facing `error.fields[]` responses. Keeps the failing field path and a short
 * human-readable message.
 */
export interface CompactFieldError {
  /** Dot-joined JSON path to the offending field, e.g. `"action.amount"`. */
  path: string
  /** Short message, truncated to `MAX_MESSAGE_LENGTH` chars. */
  message: string
}

export const MAX_COMPACT_FIELDS = 5
export const MAX_COMPACT_FIELD_MESSAGE_LENGTH = 120

/**
 * Minimal Zod-issue shape we care about. Accepting a structural type keeps
 * this util dependency-light and portable between server, SDK, and clients.
 */
export interface ZodIssueLike {
  path: ReadonlyArray<string | number>
  message: string
  code?: string
}

/**
 * Convert a list of Zod issues (as produced by `ZodError.issues`) to an
 * agent-facing `fields` array.
 *
 * - Caps the output at `MAX_COMPACT_FIELDS` entries.
 * - Truncates each message at `MAX_COMPACT_FIELD_MESSAGE_LENGTH` chars.
 * - Joins mixed string/number path segments with "." (so array indices appear
 *   as `players.0.stack`).
 * - Returns `[]` for empty/undefined/null input.
 */
export function zodIssuesToCompactFields(
  issues: ReadonlyArray<ZodIssueLike> | undefined | null,
): CompactFieldError[] {
  if (!issues || !Array.isArray(issues) || issues.length === 0) return []

  const out: CompactFieldError[] = []
  for (const issue of issues) {
    if (out.length >= MAX_COMPACT_FIELDS) break
    const path = Array.isArray(issue.path) ? issue.path.map(String).join('.') : ''
    const rawMessage = typeof issue.message === 'string' ? issue.message : ''
    const message =
      rawMessage.length > MAX_COMPACT_FIELD_MESSAGE_LENGTH
        ? rawMessage.slice(0, MAX_COMPACT_FIELD_MESSAGE_LENGTH)
        : rawMessage
    out.push({ path, message })
  }
  return out
}
