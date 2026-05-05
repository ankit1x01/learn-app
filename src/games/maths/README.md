# REFLEX-MATHS: Neuroscience-Driven Math Games

Complete game engine and 3 core implementations (Matrix Forge, Integral Inferno, Vector Voyager) for Class 12 mathematics automaticity training via micro-skill spaced repetition.

## Architecture Overview

```
useGameEngine (src/games/engine/)
├── Score tracking (0–100)
├── Streak & combo system
├── Timer management
├── Lives system (optional)
└── onComplete → FSRS update

     ↓

Game Config Type (src/games/types.ts)
├── MatrixForgeConfig
├── IntegralInfernoConfig
├── VectorVoyagerConfig
├── ... (10 more)

     ↓

Game Component (src/games/maths/games/)
├── Stimulus display
├── Response collection
├── Validation logic
├── Feedback animation
└── Primitive components (Timer, Score, Buttons, Grid, Feedback)

     ↓

Game Content (src/games/maths/data/)
├── matrixForgeContent
├── integralInfernoContent
├── vectorVoyagerContent
└── Data registry
```

## Project Structure

```
src/games/maths/
├── primitives/                    # Reusable UI components
│   ├── LatexDisplay.tsx          # KaTeX math rendering
│   ├── GameTimer.tsx             # Countdown with color coding
│   ├── ScoreCombo.tsx            # Score + streak display
│   ├── ResponseButtons.tsx       # Multi-choice taps
│   ├── MatrixGrid.tsx            # Matrix cell editor
│   ├── ResponseFeedback.tsx      # Toast notifications
│   └── index.ts                  # Exports
│
├── games/                         # Game implementations
│   ├── MatrixForge.tsx           # Matrix operations (cell-by-cell)
│   ├── IntegralInferno.tsx       # Integration (technique recognition)
│   ├── VectorVoyager.tsx         # Vectors (3D operations)
│   └── index.ts                  # Exports + game list
│
├── data/                          # Game content & configs
│   ├── matrixForgeContent.ts     # 5 sample items
│   ├── integralInfernoContent.ts # 8 sample items
│   ├── vectorVoyagerContent.ts   # 10 sample items
│   └── index.ts                  # Registry & helpers
│
├── MathsGameLauncher.tsx         # Game selector UI
├── GAME_TEMPLATE.md              # How to build new games
└── README.md                      # This file
```

## Core Games (Implemented)

### 1. **Matrix Forge** ⚒️
**Concept:** Matrices (operations, composition, inversion)

**Core Loop:**
- Player types matrix elements into a "forge mould" cell-by-cell
- Each correct cell "hisses and locks in green"
- Sparks (gems) drop on cells entered in < 1.5s
- Time budget = 12 seconds per cell on average

**Mechanics:**
- Element-by-element entry with partial credit
- Speed bonus for sub-1.5s cells (5 XP)
- Streak bonus (×2 at 5, ×3 at 10, ×4 at 20)
- Total cells = result matrix dimensions (4–9 cells typical)

**Micro-Skills:**
- `matrix_addition_2x2`, `matrix_multiplication_2x2`, `matrix_transpose`, etc.

**Implementation:** `src/games/maths/games/MatrixForge.tsx`

---

### 2. **Integral Inferno** 🔥
**Concept:** Integration (technique recognition, standard forms, multi-step solutions)

**Core Loop:**
- Dungeon room displays integrand (e.g., `∫ f(x) dx`)
- Player taps one of 6 technique runes (Direct, u-Sub, Parts, Partial-F, Trig-ID, Special)
- Rune selection < 2.5s = pattern mastery bonus (×3 XP)
- If correct, optional 1–3 completion steps (fill-in-the-blank)

**Mechanics:**
- Pattern-spotting score: < 2.5s = ⚡ bonus
- Combo system: 3 correct techniques = Mastery Gate
- Completion steps train execution
- Fastest rune-tappers unlock "Mastery Rooms"

**Micro-Skills:**
- `integral_direct_formula_xn`, `integral_usub_polynomial`, `integral_parts_polynomial_exp`, etc.

**Implementation:** `src/games/maths/games/IntegralInferno.tsx`

---

### 3. **Vector Voyager** 🚀
**Concept:** Vectors (magnitude, unit vector, dot product, cross product, projection)

**Core Loop:**
- Spaceship cockpit displays two 3D vectors
- Player computes operation result (dot product, magnitude, etc.)
- Enters answer as scalar or [x, y, z] vector
- For cross product, selects correct octant via right-hand rule

**Mechanics:**
- Numeric input with ±0.01 tolerance for floating-point
- 3D octant selector for spatial encoding
- Drag-based visualization (placeholder for full 3D render)
- Docking bonus on correct answer

**Micro-Skills:**
- `vector_magnitude_basic`, `vector_dot_product_general`, `vector_cross_product_basis`, etc.

**Implementation:** `src/games/maths/games/VectorVoyager.tsx`

---

## Reusable Primitives

All games compose from 6 core primitives:

### `<GameTimer />`
Countdown with color coding (amber < 25%, red < 3s). Auto-animates on critical.
```tsx
<GameTimer timeLeft={engine.timeLeft} totalTime={30} isActive={true} />
```

### `<ScoreCombo />`
Displays score, current streak, best streak. Animates on milestones (5, 10, 20).
```tsx
<ScoreCombo score={engine.score} streak={engine.streak} bestStreak={engine.bestStreak} />
```

### `<ResponseButtons />`
Multi-choice options with keyboard shortcuts. Supports grid or horizontal layout.
```tsx
<ResponseButtons
  options={[{ id: 'a', label: 'Option A', shortcut: 'a' }]}
  onSelect={handleSelect}
  orientation="grid"
  columns={3}
/>
```

### `<MatrixGrid />`
Editable matrix with cell highlighting. Responds to changes in real-time.
```tsx
<MatrixGrid matrix={userMatrix} editable onCellChange={handleCellChange} highlightCells={correctCells} />
```

### `<LatexDisplay />`
KaTeX rendering for math expressions. Inline or block.
```tsx
<LatexDisplay latex="\int x e^x dx" block={true} />
```

### `<ResponseFeedback />`
Toast notification (success/failure) with auto-dismiss.
```tsx
<ResponseFeedback isCorrect={true} message="✅ Correct!" duration={1200} onDismiss={() => setFeedback(null)} />
```

## Building a New Game (10 Remaining)

See `GAME_TEMPLATE.md` for step-by-step. Quick checklist:

1. **Define config type** in `src/games/types.ts`
   ```typescript
   export interface MyGameConfig extends GameBase {
     type: 'my-game'
     items: Array<{ ... }>
   }
   ```

2. **Create component** in `src/games/maths/games/MyGame.tsx`
   ```typescript
   export const MyGame: React.FC<MyGameProps> = ({ config }) => {
     const engine = useGameEngine({ ... })
     // Render stimulus, collect response, validate
     // Call engine.onCorrect() or engine.onWrong()
   }
   ```

3. **Create content** in `src/games/maths/data/myGameContent.ts`
   ```typescript
   export const myGameContent: MyGameConfig = {
     type: 'my-game',
     items: [ ... ]
   }
   ```

4. **Add to registry** in `src/games/maths/data/index.ts`
   ```typescript
   export const REFLEX_MATHS_GAMES: Record<string, GameConfig> = {
     'my-game': myGameContent,
     ...
   }
   ```

5. **Export from games/index.ts** and add route in `MathsGameLauncher.tsx`

## Remaining 10 Games (Stub Types Defined)

All 13 games have config types defined. Implementations pending:

1. ✅ **Matrix Forge** — matrix operations
2. ✅ **Integral Inferno** — integration
3. ✅ **Vector Voyager** — 3D vectors
4. ⏳ **Domain Duels** — relations & functions (arrow diagrams)
5. ⏳ **Principal Valley** — inverse trig (zone picker)
6. ⏳ **Det Detective** — determinants (noir theme)
7. ⏳ **Derivative Dojo** — differentiation (combo system)
8. ⏳ **Tangent Tycoon** — app. of derivatives (optimization)
9. ⏳ **Area Architect** — app. of integrals (region setup)
10. ⏳ **Diff-Eq Descent** — differential equations (type classifier)
11. ⏳ **3D Architect** — 3D geometry (spatial)
12. ⏳ **Optima Outpost** — linear programming (constraint solver)
13. ⏳ **Bayes Bazaar** — probability (tree builder)

## Integration with FSRS

Each game item has a `skillId`:
```typescript
{
  id: 'matrix-mul-2x2',
  skillId: 'matrix_multiplication_2x2',  // ← FSRS micro-skill ID
  ...
}
```

When `onComplete(result)` fires:
1. `GameResult` contains: `score`, `guesses`, `timeMs`
2. Parent component passes to `updateFSRSFromGame(skillId, result)`
3. FSRS updates: stability, difficulty, nextReviewDue

See `src/lib/game-session-bridge.ts` for integration.

## Testing Locally

### Option 1: Game Launcher
```tsx
import { MathsGameLauncher } from '@/games/maths/MathsGameLauncher'

// In your screen or dashboard:
<MathsGameLauncher />
```

### Option 2: Direct Component
```tsx
import { MatrixForge } from '@/games/maths/games'
import { matrixForgeContent } from '@/games/maths/data'

<MatrixForge config={matrixForgeContent} />
```

## Performance Notes

- **Timer:** setInterval at 1s; cleared on unmount
- **Validation:** synchronous, < 100ms
- **Animations:** Framer Motion (GPU)
- **LaTeX:** cached by KaTeX
- **Total bundle impact:** ~80KB (React + Framer + KaTeX + game code)

## Future Enhancements

1. **Phaser 2D canvas** for games with real-time graphics (Domain Duels arrow animations)
2. **Three.js 3D** for Vector Voyager / 3D Architect spatial rendering
3. **Speech synthesis** for problem narration
4. **Leaderboard** integration for streaks and scores
5. **Procedural content generation** via LLM (Gemini)
6. **Accessibility:** keyboard-only mode, screen reader support

## References

- **Neuroscience basis:** See `docs/project/REFLEX-MATHS-GAMES.md` (full spec)
- **FSRS algorithm:** `src/core/fsrs.ts`
- **Spaced repetition:** `src/lib/scheduler.ts`
- **Game session integration:** `src/lib/game-session-bridge.ts`

## File Locations Summary

| What | Where |
|------|-------|
| Game configs (types) | `src/games/types.ts` |
| Engine hook | `src/games/engine/useGameEngine.ts` |
| Primitives | `src/games/maths/primitives/*.tsx` |
| Games (3 implemented) | `src/games/maths/games/*.tsx` |
| Game content | `src/games/maths/data/*Content.ts` |
| Launcher UI | `src/games/maths/MathsGameLauncher.tsx` |
| Build guide | `src/games/maths/GAME_TEMPLATE.md` |
