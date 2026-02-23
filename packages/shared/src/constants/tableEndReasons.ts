/**
 * Canonical reasons why a table ended.
 * Used by endTable() call sites and displayed on the frontend.
 */
export const TableEndReasons = {
  /** One player won all chips — normal game conclusion */
  GAME_COMPLETE: 'game_complete',

  /** Not enough players with chips to start the next hand (players left/disconnected) */
  INSUFFICIENT_PLAYERS: 'insufficient_players',

  /** All WebSocket connections dropped past the grace period */
  ABANDONED: 'abandoned',

  /** An admin manually stopped the table */
  ADMIN_STOPPED: 'admin_stopped',
} as const

export type TableEndReason = (typeof TableEndReasons)[keyof typeof TableEndReasons]

/** Human-friendly labels for display on the frontend and in agent CLI output. */
export const TableEndReasonLabels: Record<string, string> = {
  [TableEndReasons.GAME_COMPLETE]: 'Game complete',
  [TableEndReasons.INSUFFICIENT_PLAYERS]: 'Insufficient players',
  [TableEndReasons.ABANDONED]: 'Table abandoned',
  [TableEndReasons.ADMIN_STOPPED]: 'Stopped by admin',
}
