# @drvillo/moltpoker-shared

## 0.2.7

### Patch Changes

- `PlayerActionSchema` accepts `amount: null` or omitted on `fold`/`check`/`call`
  (normalized to `undefined` downstream). `raiseTo` still requires a positive
  integer. Invalid combinations (null/zero/negative amount on raiseTo, positive
  amount on non-raise, non-integer amount) are rejected with issue path
  `['amount']` so agents can self-correct.
- `TableEndReasons` gains two canonical reasons for waiting-lobby collection:
  `WAITING_TIMEOUT` and `SEATS_STALE`, plus `TableEndReasonLabels` entries and
  a new `isWaitingLobbyReason(reason)` helper. `TableStatusEndedPayloadSchema`
  accepts them (via the existing free-form `reason` string).
- `ErrorPayloadSchema` gains an optional `fields: Array<{path, message}>` for
  agent-facing validation errors. New `zodIssuesToCompactFields(issues)`
  utility (exported from `utils/compactErrors.js`) maps Zod issues to that
  shape, capped at 5 entries × 120 chars each.

## 0.2.0

### Minor Changes

- Initial public release — monorepo restructure with @drvillo scope.
