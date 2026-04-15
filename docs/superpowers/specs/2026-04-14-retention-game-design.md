# Retention Game — Design Spec
Date: 2026-04-14

## Overview
A cognitive training mini-game for the CHITTA app that trains short-term memory through a show → delay → recall loop. Integrated into the existing `src/games/` system as the 6th game type.

---

## Data Model

### New type in `src/games/types.ts`
```typescript
export interface RetentionConfig extends GameBase {
  type: 'retention'
  pool: Array<{ id: string; label: string }>
}
```
- `pool` — 12 items the game samples from. The game manages level/difficulty internally.
- Added to `GameConfig` union: `| RetentionConfig`

### Sample data (`dsa-dummy.ts`)
12 DSA concept labels drawn from the existing DSA syllabus.

---

## Game State Machine

```
show → delay → recall → result → (next round | GameWinScreen after 5 rounds)
```

### Phases

| Phase   | Duration                          | Description |
|---------|-----------------------------------|-------------|
| `show`  | 4000ms → 2000ms (−200ms/level)    | N items displayed as `CognitiveItem` cards in a grid. Countdown progress bar at bottom. |
| `delay` | 1000ms → 5000ms (+800ms/level)    | Blank screen. Three animated pulsing dots. No items visible. |
| `recall`| User-paced                        | Full pool (12 items) shown as tappable `CognitiveItem` cards. Auto-submits once user has tapped exactly N items. |
| `result`| 2000ms                            | Same pool visible. Correct selections highlighted green, wrong selections red, missed items with a dim border. Then auto-advances. |

### Items shown per round
`itemCount = Math.min(3 + level - 1, 8)` — starts at 3, adds 1 per level, caps at 8.

### Difficulty scaling per level
| Level | Items shown | Show time | Delay time |
|-------|-------------|-----------|------------|
| 1     | 3           | 4000ms    | 1000ms     |
| 2     | 4           | 3800ms    | 1800ms     |
| 3     | 5           | 3600ms    | 2600ms     |
| 4     | 6           | 3400ms    | 3400ms     |
| 5     | 7           | 3200ms    | 4200ms     |

---

## Scoring
- **Per round:** `Math.round((correctSelections / itemsShown) × 100)`
- **Final score:** Average of all 5 round scores (0–100)
- **Guesses:** Total taps made across all recall phases
- Result fed into existing `GameWinScreen` component

---

## Component Structure

### `src/games/components/RetentionGame.tsx`
Single file (~200 lines). Four inline sub-components:

- **`ShowPhase`** — Renders items grid using `CognitiveItem` (disabled, no tap). Progress bar counts down show time.
- **`DelayPhase`** — Three pulsing dots. No game content visible.
- **`RecallPhase`** — Full pool as tappable `CognitiveItem` grid. Selected items get a highlighted ring. Tapping a selected item deselects it. Auto-submits when `selectedIds.length === itemCount`.
- **`ResultPhase`** — Pool grid with color-coded feedback: green (correct), red (wrong), neutral (unselected correct = missed). Auto-advances after 2s.

Top-level state:
```typescript
phase:       'show' | 'delay' | 'recall' | 'result'
level:       number           // 1–5
round:       number           // 1–5
items:       string[]         // ids of items shown this round
selectedIds: string[]         // ids tapped during recall
roundScores: number[]         // per-round scores
```

### Other files
| File | Change |
|------|--------|
| `src/games/types.ts` | Add `RetentionConfig`, add to `GameConfig` union |
| `src/games/GameRunner.tsx` | Add `case 'retention': return <RetentionGame config={config} />` |
| `src/games/GamesScreen.tsx` | Add 6th entry: label "Memory", tagline "What did you see?", Brain icon, teal `#2DD4BF` bg |
| `src/games/data/dsa-dummy.ts` | Add `dsaRetention: RetentionConfig` with 12-item pool |

---

## Visual Design
- Follows CHITTA design system: `#F7F6F3` background, white cards, `#E8E5DF` borders
- Fonts: Plus Jakarta Sans (headings), Inter (body)
- Icons: Lucide only — `Brain` for game card
- `CognitiveItem` used for both show and recall phases
- Phase label shown at top center (e.g. "MEMORISE", "WAIT...", "RECALL")
- Haptics: `ImpactStyle.Light` on tap, `ImpactStyle.Heavy` on correct match
- No emojis in UI chrome

---

## Out of Scope
- Sound effects
- Image-based items
- Order-based (sequence) recall
- Persistent leaderboard / cross-session stats
