/**
 * Canonical reasons why a table ended.
 * Used by endTable() call sites and displayed on the frontend.
 */
export const TableEndReasons = {
  /** One player won all chips — normal game conclusion */
  GAME_COMPLETE: 'game_complete',

  /** Not enough players with chips to start the next hand (players left/disconnected) */
  INSUFFICIENT_PLAYERS: 'insufficient_players',

  /** All WebSocket connections dropped past the grace period (running tables only) */
  ABANDONED: 'abandoned',

  /** An admin manually stopped the table */
  ADMIN_STOPPED: 'admin_stopped',

  /**
   * A waiting table did not reach minPlayersToStart within the configured TTL.
   * Agents receiving this reason should call auto-join again to be seated at a fresh table.
   */
  WAITING_TIMEOUT: 'waiting_timeout',

  /**
   * A waiting table had seated agents whose sessions all expired without any
   * live WebSocket connection, so it was collected. Same remediation as
   * waiting_timeout: call auto-join again.
   */
  SEATS_STALE: 'seats_stale',
} as const

export type TableEndReason = (typeof TableEndReasons)[keyof typeof TableEndReasons]

/** Human-friendly labels for display on the frontend and in agent CLI output. */
export const TableEndReasonLabels: Record<string, string> = {
  [TableEndReasons.GAME_COMPLETE]: 'Game complete',
  [TableEndReasons.INSUFFICIENT_PLAYERS]: 'Insufficient players',
  [TableEndReasons.ABANDONED]: 'Table abandoned',
  [TableEndReasons.ADMIN_STOPPED]: 'Stopped by admin',
  [TableEndReasons.WAITING_TIMEOUT]: 'Waiting lobby timed out before enough players joined',
  [TableEndReasons.SEATS_STALE]: 'Seated agents disconnected before the game started',
}

/**
 * True if the given reason is one of the waiting-lobby collection reasons —
 * clients receiving these should transparently retry auto-join rather than
 * surface an error to the operator.
 */
export function isWaitingLobbyReason(reason: string | undefined | null): boolean {
  return reason === TableEndReasons.WAITING_TIMEOUT || reason === TableEndReasons.SEATS_STALE
}
