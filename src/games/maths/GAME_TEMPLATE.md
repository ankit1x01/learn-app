# REFLEX-MATHS Game Template

All 13 games follow a unified engine pattern using `useGameEngine`. Each game has:

1. **Config Type** (defined in `src/games/types.ts`)
2. **Component** (React + Framer Motion, uses engine hook)
3. **Primitives** (reusable UI: Timer, Score, Buttons, Feedback)

## Architecture

```
GameEngine (useGameEngine)
├── Timer (global or per-item)
├── Score/Combo tracking
├── Lives/Streak logic
└── onComplete callback → FSRS update

Game Component
├── useGameEngine(config)
├── Item state (array iteration)
├── Response validation
├── Feedback display
└── Primitive components
```

## Build Steps for Each Game

### 1. Define Config Type in `src/games/types.ts`

Example pattern (already done for all 13):

```typescript
export interface MyGameConfig extends GameBase {
  type: 'my-game'
  items: Array<{
    id: string
    skillId: string
    stimulus: string           // What to display
    expectedAnswer: unknown    // Validation target
    timeLimit: number
    // ... game-specific fields
  }>
}
```

### 2. Create Game Component `src/games/maths/games/MyGame.tsx`

**Template structure:**

```typescript
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameEngine } from '@/games/engine/useGameEngine'
import type { MyGameConfig } from '@/games/types'
import { GameTimer, ScoreCombo, ResponseButtons, ResponseFeedback } from '../primitives'

interface MyGameProps {
  config: MyGameConfig
}

export const MyGame: React.FC<MyGameProps> = ({ config }) => {
  const [itemIndex, setItemIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState<{ isCorrect: boolean | null; message?: string }>({
    isCorrect: null,
  })

  const currentItem = config.items[itemIndex]

  const engine = useGameEngine({
    totalItems: config.items.length,
    timeLimit: currentItem?.timeLimit,
    difficulty: 1,
    gameType: config.type,
    onComplete: (result) => {
      config.onComplete?.(result)
    },
  })

  const handleSubmit = () => {
    const isCorrect = /* your validation logic */
    
    if (isCorrect) {
      setFeedback({ isCorrect: true })
      engine.onCorrect(responseTime) // Time in ms
      
      // Move to next item
      setTimeout(() => {
        if (itemIndex + 1 < config.items.length) {
          setItemIndex(itemIndex + 1)
          // Reset state
        }
      }, 1200)
    } else {
      setFeedback({ isCorrect: false })
    }
  }

  if (!currentItem) return <div>Game complete</div>

  return (
    <motion.div className="min-h-screen flex flex-col items-center gap-6">
      {/* Header */}
      <h1 className="text-4xl font-bold">Game Name</h1>
      
      {/* Engine UI */}
      <GameTimer timeLeft={engine.timeLeft} totalTime={currentItem.timeLimit} />
      <ScoreCombo score={engine.score} streak={engine.streak} bestStreak={engine.bestStreak} />
      
      {/* Game Content */}
      {/* Display stimulus, collect response, validate */}
      
      {/* Feedback */}
      <ResponseFeedback isCorrect={feedback.isCorrect} onDismiss={() => ...} />
    </motion.div>
  )
}
```

## Reusable Primitives

### GameTimer
```typescript
<GameTimer timeLeft={engine.timeLeft} totalTime={currentItem.timeLimit} isActive={!engine.isPaused} />
```
- Shows countdown with color coding (red < 3s, amber < 25% time)
- Animates on critical

### ScoreCombo
```typescript
<ScoreCombo score={engine.score} streak={engine.streak} bestStreak={engine.bestStreak} />
```
- Shows score, current streak, best streak
- Animates on combo milestones (5, 10, 20)

### ResponseButtons
```typescript
<ResponseButtons
  options={[
    { id: 'a', label: 'Option A', icon: 'check_circle', shortcut: 'a' },
    { id: 'b', label: 'Option B', shortcut: 'b' },
  ]}
  onSelect={handleSelect}
  orientation="grid"
  columns={2}
/>
```
- Multiple choice taps
- Keyboard shortcuts
- Disabled state

### MatrixGrid
```typescript
<MatrixGrid matrix={userMatrix} editable onCellChange={handleCellChange} highlightCells={correctCells} />
```
- Display and edit matrices
- Highlight correct cells
- Respond to value changes

### LatexDisplay
```typescript
<LatexDisplay latex="\int x e^x dx" block={true} />
```
- KaTeX rendering
- Block or inline
- Fallback for invalid LaTeX

### ResponseFeedback
```typescript
<ResponseFeedback isCorrect={true} message="✅ Correct!" duration={1200} onDismiss={() => setFeedback(null)} />
```
- Toast notification
- Auto-dismiss after duration
- Success (green) / Failure (red)

## Implementation Checklist

- [ ] Define game config type in `src/games/types.ts`
- [ ] Add to `GameConfig` union type
- [ ] Create component in `src/games/maths/games/`
- [ ] Use `useGameEngine` hook
- [ ] Implement validation logic
- [ ] Use 2–3 primitives (Timer, Score, Buttons/Grid, Feedback)
- [ ] Handle item iteration
- [ ] Call `engine.onCorrect()` with response time
- [ ] Call `onComplete()` when all items done
- [ ] Export from `src/games/maths/games/index.ts`
- [ ] Add to game launcher/registry

## Validation Patterns

### Multiple Choice
```typescript
const isCorrect = userSelection === currentItem.correctAnswer
```

### Numeric Input
```typescript
const isCorrect = Math.abs(parseFloat(userAnswer) - currentItem.expectedAnswer) < 0.01
```

### Symbolic/LaTeX
```typescript
const isCorrect = userAnswer.toLowerCase() === currentItem.expectedAnswer.toLowerCase()
```

### Vector/Array
```typescript
const isCorrect = userAnswer.every((val, i) => Math.abs(val - expected[i]) < 0.01)
```

## Integration with FSRS

Each `skillId` in the items maps to a micro-skill in FSRS:

```typescript
currentItem.skillId  // e.g., "integrate_u_sub_cue"
```

When `onCorrect()` is called:
1. Score increases
2. Stability/difficulty updated via FSRS
3. Next review due date computed
4. GameResult emitted with `score`, `guesses`, `timeMs`

See `src/lib/game-session-bridge.ts` for FSRS integration.

## Performance Optimization

- Timer updates: use `setInterval` (cleared on unmount or completion)
- Response validation: synchronous (< 100ms)
- Animation: Framer Motion (GPU-accelerated)
- LaTeX: cached by KaTeX
- Image assets: lazy load for simulations

## Testing Each Game

1. Create sample config with 3–5 items
2. Mount component in Storybook or dev page
3. Test timer countdown
4. Test correct/wrong responses
5. Verify FSRS callback fires
6. Check score/streak updates
7. Verify next item loads
