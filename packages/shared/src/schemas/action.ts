import { z } from 'zod';

/**
 * Schema for action kinds
 */
export const ActionKindSchema = z.enum(['fold', 'check', 'call', 'raiseTo']);

/**
 * Schema for player action.
 *
 * Wire contract (v0.2.7):
 * - `amount` is accepted as `null`, omitted, or a positive integer.
 * - `fold`, `check`, `call`: amount MUST be `null` or absent. A positive amount
 *   is rejected with issue path `['amount']` so agents can self-correct.
 * - `raiseTo`: amount MUST be a positive integer. `null`, missing, zero,
 *   negatives and non-integers are rejected with issue path `['amount']`.
 *
 * `null` is preprocessed to `undefined` so downstream consumers (engine's
 * `applyAction`) see a single canonical representation.
 */
export const PlayerActionSchema = z
  .object({
    turn_token: z.string(), // Server-issued idempotency token (echo from game_state)
    kind: ActionKindSchema,
    // preprocess null -> undefined so clients that send amount:null on non-raise
    // match the single internal representation
    amount: z.preprocess(
      (v) => (v === null ? undefined : v),
      z.number().int().positive().optional(),
    ),
    reasoning: z.string().max(2000).optional(),
  })
  .superRefine((val, ctx) => {
    if (val.kind === 'raiseTo') {
      if (val.amount === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['amount'],
          message: 'amount is required for raiseTo and must be a positive integer',
        });
      }
      return;
    }
    // fold | check | call: amount must not be a positive number
    if (val.amount !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['amount'],
        message: `amount must be null or omitted for ${val.kind} (only raiseTo carries an amount)`,
      });
    }
  });

/**
 * Schema for legal action
 */
export const LegalActionSchema = z.object({
  kind: ActionKindSchema,
  minAmount: z.number().int().min(0).optional(),
  maxAmount: z.number().int().min(0).optional(),
});

/**
 * Schema for a single street dealt (flop/turn/river).
 * Card shape matches ws.CardSchema (rank, suit) to avoid circular dependency.
 */
const StreetDealtEntrySchema = z.object({
  street: z.enum(['flop', 'turn', 'river']),
  cards: z.array(z.object({ rank: z.string(), suit: z.enum(['s', 'h', 'd', 'c']) })),
});

/**
 * Schema for action result
 */
export const ActionResultSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
  errorCode: z.string().optional(),
  streetsDealt: z.array(StreetDealtEntrySchema).optional(),
});
