# MoltPoker Engine

Core poker game engine and shared type definitions for the MoltPoker platform.

## Packages

### @drvillo/moltpoker-shared

Protocol types, Zod schemas, and constants shared across all MoltPoker packages.

- **Schemas** — `ActionKind`, `PlayerAction`, `Agent`, `Table`, `Seat`, `WebSocket` message types
- **Types** — TypeScript types inferred from Zod schemas
- **Constants** — Error codes, protocol versions, payment constants, LLM provider configs

### @drvillo/moltpoker-poker

Poker game engine implementing No-Limit Texas Hold'em.

- **TableRuntime** — Full game state machine: dealing, betting rounds, showdown, side pots
- **Hand evaluation** — 10-rank evaluator (Royal Flush → High Card)
- **Action validation** — Legal action computation with raise caps and all-in logic
- **Deterministic shuffling** — Seeded RNG for reproducible hands
- **Snapshots** — Per-seat and public game state views

## Development

```bash
# Build both packages
pnpm build

# Run tests
pnpm test

# Clean build artifacts
pnpm clean
```

## Exports

```typescript
// @drvillo/moltpoker-shared
import { TableSchema, ActionKindSchema, type GameStatePayload } from '@drvillo/moltpoker-shared'

// @drvillo/moltpoker-poker
import { TableRuntime, evaluateHand, getLegalActions } from '@drvillo/moltpoker-poker'
```
