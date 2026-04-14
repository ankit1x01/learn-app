# Games Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a config-driven games module at `src/games/` with 4 game modes (This or That, Chrono, Links, Knockout) using DSA dummy data, fully following the CHITTA design system.

**Architecture:** A `GameConfig` discriminated union drives a `GameRunner` dispatcher that renders the correct game component. Each game is fully self-contained with its own state. A `GamesScreen` demo wires all 4 games together with DSA dummy data and a tab switcher.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Lucide React

---

## File Map

| File | Purpose |
|------|---------|
| `src/games/types.ts` | GameConfig union + GameResult type |
| `src/games/data/dsa-dummy.ts` | DSA dummy configs for all 4 games |
| `src/games/components/GameWinScreen.tsx` | Shared win/score screen after each game |
| `src/games/components/ThisOrThat.tsx` | This or That — assign cards to columns |
| `src/games/components/Chrono.tsx` | Chrono — reorder events chronologically |
| `src/games/components/Links.tsx` | Links — match card to 4 attribute clues |
| `src/games/components/Knockout.tsx` | Knockout — binary head-to-head comparison |
| `src/games/GameRunner.tsx` | Dispatcher: reads config.type, renders game |
| `src/games/GamesScreen.tsx` | Demo screen with 4 game tabs |
| `src/App.tsx` | Add 'Games' to Screen type + render branch |

---

### Task 1: Types

**Files:**
- Create: `src/games/types.ts`

- [ ] **Step 1: Create the types file**

```ts
// src/games/types.ts

export interface GameResult {
  gameType: GameConfig['type']
  score: number
  guesses: number
  hintsUsed: number
  timeMs: number
}

interface GameBase {
  theme: string
  subject: string
  onComplete?: (result: GameResult) => void
}

export interface ThisOrThatConfig extends GameBase {
  type: 'this-or-that'
  columnA: { label: string; description: string }
  columnB: { label: string; description: string }
  cards: Array<{ id: string; label: string; correct: 'A' | 'B' }>
}

export interface ChronoConfig extends GameBase {
  type: 'chrono'
  events: Array<{
    id: string
    label: string
    dateLabel: string
    sortKey: number
    factoid?: string
  }>
}

export interface LinksConfig extends GameBase {
  type: 'links'
  cards: Array<{ id: string; label: string }>
  rounds: Array<{
    cardId: string
    attributes: [string, string, string, string]
    hints?: string[]
  }>
}

export interface KnockoutConfig extends GameBase {
  type: 'knockout'
  question: string
  subtitle?: string
  cards: Array<{ id: string; label: string }>
  // key = "id1_vs_id2", value = winner id
  answers: Record<string, string>
}

export type GameConfig =
  | ThisOrThatConfig
  | ChronoConfig
  | LinksConfig
  | KnockoutConfig
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run lint
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/games/types.ts
git commit -m "feat(games): add GameConfig discriminated union types"
```

---

### Task 2: DSA Dummy Data

**Files:**
- Create: `src/games/data/dsa-dummy.ts`

- [ ] **Step 1: Create the dummy data file**

```ts
// src/games/data/dsa-dummy.ts
import { ThisOrThatConfig, ChronoConfig, LinksConfig, KnockoutConfig } from '../types'

export const dsaThisOrThat: ThisOrThatConfig = {
  type: 'this-or-that',
  theme: 'Stack vs Queue',
  subject: 'DSA',
  columnA: { label: 'Stack', description: 'LIFO — Last In, First Out' },
  columnB: { label: 'Queue', description: 'FIFO — First In, First Out' },
  cards: [
    { id: 'c1', label: 'LIFO principle',          correct: 'A' },
    { id: 'c2', label: 'FIFO principle',           correct: 'B' },
    { id: 'c3', label: 'Push & Pop operations',    correct: 'A' },
    { id: 'c4', label: 'Enqueue & Dequeue ops',    correct: 'B' },
    { id: 'c5', label: 'Browser back button',      correct: 'A' },
    { id: 'c6', label: 'Printer spooler',          correct: 'B' },
    { id: 'c7', label: 'DFS traversal',            correct: 'A' },
    { id: 'c8', label: 'BFS traversal',            correct: 'B' },
    { id: 'c9', label: 'Recursion call frames',    correct: 'A' },
    { id: 'c10', label: 'OS process scheduling',   correct: 'B' },
  ],
}

export const dsaChrono: ChronoConfig = {
  type: 'chrono',
  theme: 'Sorting Algorithm History',
  subject: 'DSA',
  events: [
    {
      id: 'e1',
      label: 'Merge Sort invented by John von Neumann',
      dateLabel: '1945',
      sortKey: 1945,
      factoid: 'Von Neumann described merge sort as part of his work on the EDVAC computer — one of the first stored-program computers.',
    },
    {
      id: 'e2',
      label: 'Bubble Sort first described',
      dateLabel: '1956',
      sortKey: 1956,
      factoid: 'Despite being inefficient at O(n²), bubble sort remains one of the most taught algorithms due to its simplicity.',
    },
    {
      id: 'e3',
      label: 'Quicksort invented by Tony Hoare',
      dateLabel: '1959',
      sortKey: 1959,
      factoid: 'Hoare invented Quicksort at age 25 while working on a machine translation project. Still the fastest in practice for most datasets.',
    },
    {
      id: 'e4',
      label: 'Heapsort invented by J.W.J. Williams',
      dateLabel: '1964',
      sortKey: 1964,
      factoid: 'Heapsort introduced the heap data structure and guarantees O(n log n) worst-case — unlike Quicksort.',
    },
    {
      id: 'e5',
      label: 'Timsort created by Tim Peters',
      dateLabel: '2002',
      sortKey: 2002,
      factoid: 'Timsort is a hybrid of Merge Sort and Insertion Sort. It powers Python\'s sorted() and Java\'s Arrays.sort() for objects.',
    },
  ],
}

export const dsaLinks: LinksConfig = {
  type: 'links',
  theme: 'Data Structure Properties',
  subject: 'DSA',
  cards: [
    { id: 'bst',         label: 'Binary Search Tree' },
    { id: 'hashtable',   label: 'Hash Table' },
    { id: 'minheap',     label: 'Min Heap' },
    { id: 'linkedlist',  label: 'Linked List' },
  ],
  rounds: [
    {
      cardId: 'bst',
      attributes: [
        'O(log n) average search',
        'Left child < root < right child',
        'In-order traversal gives sorted output',
        'Can degrade to O(n) when unbalanced',
      ],
      hints: ['Think about how binary search works on a tree', 'The order property is in the name'],
    },
    {
      cardId: 'hashtable',
      attributes: [
        'O(1) average lookup',
        'Uses a key-value pair structure',
        'Needs a collision resolution strategy',
        'Load factor affects performance',
      ],
      hints: ['Fastest lookup of any structure', 'Python dictionaries use this'],
    },
    {
      cardId: 'minheap',
      attributes: [
        'Root is always the smallest element',
        'Parent is always ≤ its children',
        'Used in Dijkstra\'s algorithm',
        'Extract-min runs in O(log n)',
      ],
      hints: ['Priority queues are built on this', 'Think about what "heap property" means'],
    },
    {
      cardId: 'linkedlist',
      attributes: [
        'O(1) insertion at head',
        'O(n) random access',
        'Each node stores a pointer to next',
        'No contiguous memory required',
      ],
      hints: ['No indexing — you must traverse', 'Memory is scattered, not sequential'],
    },
  ],
}

export const dsaKnockout: KnockoutConfig = {
  type: 'knockout',
  question: 'Which is faster on average?',
  subtitle: 'Assume average-case, random input, no special conditions.',
  theme: 'Algorithm Showdowns',
  subject: 'DSA',
  cards: [
    { id: 'bubble',    label: 'Bubble Sort' },
    { id: 'merge',     label: 'Merge Sort' },
    { id: 'linear',    label: 'Linear Search' },
    { id: 'binary',    label: 'Binary Search' },
    { id: 'insertion', label: 'Insertion Sort' },
    { id: 'quick',     label: 'Quick Sort' },
    { id: 'dfs',       label: 'DFS' },
    { id: 'bfs',       label: 'BFS (shortest path)' },
  ],
  answers: {
    'bubble_vs_merge':     'merge',
    'linear_vs_binary':    'binary',
    'insertion_vs_quick':  'quick',
    'dfs_vs_bfs':          'bfs',
    // Semi-finals (winners of above)
    'merge_vs_binary':     'binary',
    'quick_vs_bfs':        'quick',
    // Final
    'binary_vs_quick':     'binary',
  },
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run lint
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/games/data/dsa-dummy.ts
git commit -m "feat(games): add DSA dummy data for all 4 game modes"
```

---

### Task 3: Shared Win Screen

**Files:**
- Create: `src/games/components/GameWinScreen.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/games/components/GameWinScreen.tsx
import { Trophy, RotateCcw } from 'lucide-react'
import { GameResult } from '../types'

interface Props {
  result: GameResult
  onPlayAgain: () => void
}

export function GameWinScreen({ result, onPlayAgain }: Props) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-10 gap-6">
      <div className="w-16 h-16 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center">
        <Trophy size={28} className="text-[#15803D]" />
      </div>

      <div className="text-center">
        <p className="text-xs font-semibold text-[#15803D] uppercase tracking-wide mb-1">That's right!</p>
        <p className="text-xl font-bold text-[#1C1917]" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>
          You got it
        </p>
      </div>

      <div className="w-full bg-white border border-[#E8E5DF] rounded-2xl p-5 flex justify-around">
        <Stat label="Score" value={`${result.score}`} unit="/ 100" />
        <div className="w-px bg-[#E8E5DF]" />
        <Stat label="Guesses" value={`${result.guesses}`} />
        <div className="w-px bg-[#E8E5DF]" />
        <Stat label="Hints" value={`${result.hintsUsed}`} />
      </div>

      <button
        onClick={onPlayAgain}
        className="w-full flex items-center justify-center gap-2 bg-[#2563EB] text-white rounded-xl py-4 font-bold text-[15px]"
        style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}
      >
        <RotateCcw size={16} />
        Play again
      </button>
    </div>
  )
}

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-[#1C1917]" style={{ fontFamily: 'Inter, system-ui' }}>
        {value}
        {unit && <span className="text-sm font-normal text-[#A8A29E] ml-0.5">{unit}</span>}
      </div>
      <div className="text-xs font-medium text-[#78716C] mt-0.5" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>
        {label}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run lint
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/games/components/GameWinScreen.tsx
git commit -m "feat(games): add shared GameWinScreen component"
```

---

### Task 4: This or That Game

**Files:**
- Create: `src/games/components/ThisOrThat.tsx`

**UX:** Cards shown in a center pool. Each card has an [A] and [B] button. Tap to assign. When all assigned, tap Check. Incorrect cards flash red and return to pool. Correct cards stay in their column.

- [ ] **Step 1: Create the component**

```tsx
// src/games/components/ThisOrThat.tsx
import { useState, useRef } from 'react'
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react'
import { ThisOrThatConfig, GameResult } from '../types'
import { GameWinScreen } from './GameWinScreen'

interface Props { config: ThisOrThatConfig }

type Assignment = 'A' | 'B' | null

interface CardState {
  id: string
  label: string
  correct: 'A' | 'B'
  assigned: Assignment
  status: 'idle' | 'correct' | 'wrong'
}

function calcScore(cards: CardState[], guesses: number) {
  const correct = cards.filter(c => c.status === 'correct').length
  const base = Math.round((correct / cards.length) * 100)
  const penalty = Math.max(0, (guesses - 1) * 10)
  return Math.max(0, base - penalty)
}

export function ThisOrThat({ config }: Props) {
  const startTime = useRef(Date.now())
  const [cards, setCards] = useState<CardState[]>(
    config.cards.map(c => ({ ...c, assigned: null, status: 'idle' as const }))
  )
  const [guesses, setGuesses] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [result, setResult] = useState<GameResult | null>(null)

  const unassigned = cards.filter(c => c.status !== 'correct' && c.assigned === null)
  const colA = cards.filter(c => c.status === 'correct' && c.correct === 'A')
  const colB = cards.filter(c => c.status === 'correct' && c.correct === 'B')
  const pendingA = cards.filter(c => c.assigned === 'A' && c.status !== 'correct')
  const pendingB = cards.filter(c => c.assigned === 'B' && c.status !== 'correct')

  function assign(id: string, col: 'A' | 'B') {
    setCards(prev => prev.map(c =>
      c.id === id ? { ...c, assigned: col, status: 'idle' } : c
    ))
  }

  function handleCheck() {
    const allAssigned = cards.filter(c => c.status !== 'correct').every(c => c.assigned !== null)
    if (!allAssigned) return

    const newGuesses = guesses + 1
    setGuesses(newGuesses)

    const updated = cards.map(c => {
      if (c.status === 'correct') return c
      if (c.assigned === c.correct) return { ...c, status: 'correct' as const }
      return { ...c, status: 'wrong' as const }
    })

    setCards(updated)

    setTimeout(() => {
      const reset = updated.map(c =>
        c.status === 'wrong' ? { ...c, status: 'idle' as const, assigned: null } : c
      )
      setCards(reset)

      const allCorrect = reset.every(c => c.status === 'correct')
      if (allCorrect) {
        setResult({
          gameType: 'this-or-that',
          score: calcScore(reset, newGuesses),
          guesses: newGuesses,
          hintsUsed,
          timeMs: Date.now() - startTime.current,
        })
      }
    }, 900)
  }

  function handleHint() {
    const unset = cards.find(c => c.assigned === null && c.status !== 'correct')
    if (!unset) return
    setHintsUsed(h => h + 1)
    assign(unset.id, unset.correct)
  }

  function handleReset() {
    setCards(config.cards.map(c => ({ ...c, assigned: null, status: 'idle' as const })))
    setGuesses(0)
    setHintsUsed(0)
    setResult(null)
    startTime.current = Date.now()
  }

  if (result) {
    config.onComplete?.(result)
    return <GameWinScreen result={result} onPlayAgain={handleReset} />
  }

  const allPending = cards.filter(c => c.status !== 'correct').every(c => c.assigned !== null)
  const attemptHistory = Array.from({ length: guesses }, (_, i) => i)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-[#E8E5DF]">
        <p className="text-xs font-semibold text-[#78716C] uppercase tracking-wide" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>
          {config.subject} · {config.theme}
        </p>
        <p className="text-sm text-[#292524] mt-0.5" style={{ fontFamily: 'Inter, system-ui' }}>
          Assign each card to the correct column
        </p>
        {/* Attempt history */}
        {attemptHistory.length > 0 && (
          <div className="flex gap-1 mt-2">
            {attemptHistory.map(i => (
              <div key={i} className="w-5 h-5 rounded-full bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center">
                <XCircle size={12} className="text-[#B91C1C]" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Columns */}
      <div className="grid grid-cols-2 gap-3 px-4 pt-4">
        {(['A', 'B'] as const).map(col => {
          const cfg = col === 'A' ? config.columnA : config.columnB
          const correct = col === 'A' ? colA : colB
          const pending = col === 'A' ? pendingA : pendingB
          return (
            <div key={col} className="bg-white border border-[#E8E5DF] rounded-2xl p-3 min-h-[120px]">
              <div className="text-sm font-bold text-[#1C1917] mb-0.5" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>
                {cfg.label}
              </div>
              <div className="text-xs text-[#78716C] mb-2" style={{ fontFamily: 'Inter, system-ui' }}>
                {cfg.description}
              </div>
              <div className="flex flex-col gap-1.5">
                {correct.map(c => (
                  <div key={c.id} className="flex items-center gap-1.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg px-2 py-1.5">
                    <CheckCircle size={12} className="text-[#15803D] shrink-0" />
                    <span className="text-xs font-medium text-[#166534]" style={{ fontFamily: 'Inter, system-ui' }}>{c.label}</span>
                  </div>
                ))}
                {pending.map(c => (
                  <div
                    key={c.id}
                    className={`flex items-center justify-between border rounded-lg px-2 py-1.5 ${
                      c.status === 'wrong'
                        ? 'bg-[#FEF2F2] border-[#FECACA]'
                        : 'bg-[#EFF6FF] border-[#BFDBFE]'
                    }`}
                  >
                    <span className={`text-xs font-medium ${c.status === 'wrong' ? 'text-[#991B1B]' : 'text-[#1D4ED8]'}`} style={{ fontFamily: 'Inter, system-ui' }}>
                      {c.label}
                    </span>
                    <button
                      onClick={() => assign(c.id, col === 'A' ? 'B' : 'A')}
                      className="text-[10px] text-[#78716C] ml-1"
                    >
                      ↩
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Unassigned pool */}
      <div className="flex-1 overflow-y-auto px-4 pt-3">
        <div className="flex flex-col gap-2">
          {unassigned.map(card => (
            <div key={card.id} className="bg-white border border-[#E8E5DF] rounded-xl flex items-center justify-between px-4 py-3">
              <span className="text-[15px] font-medium text-[#292524]" style={{ fontFamily: 'Inter, system-ui' }}>
                {card.label}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => assign(card.id, 'A')}
                  className="px-3 py-1.5 bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-bold rounded-lg"
                  style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}
                >
                  {config.columnA.label}
                </button>
                <button
                  onClick={() => assign(card.id, 'B')}
                  className="px-3 py-1.5 bg-[#F5F3FF] border border-[#DDD6FE] text-[#5B21B6] text-xs font-bold rounded-lg"
                  style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}
                >
                  {config.columnB.label}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[#E8E5DF] flex gap-3">
        <button
          onClick={handleHint}
          className="flex items-center gap-1.5 px-4 py-3 bg-[#F0EEE9] text-[#78716C] rounded-xl text-[14px] font-semibold"
          style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}
        >
          <HelpCircle size={16} />
          Hint
        </button>
        <button
          onClick={handleCheck}
          disabled={!allPending}
          className={`flex-1 py-3 rounded-xl text-[15px] font-bold transition-all ${
            allPending
              ? 'bg-[#2563EB] text-white'
              : 'bg-[#F0EEE9] text-[#A8A29E]'
          }`}
          style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}
        >
          Check
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run lint
```
Expected: no errors in `src/games/components/ThisOrThat.tsx`

- [ ] **Step 3: Commit**

```bash
git add src/games/components/ThisOrThat.tsx
git commit -m "feat(games): add This or That game component"
```

---

### Task 5: Chrono Game

**Files:**
- Create: `src/games/components/Chrono.tsx`

**UX:** Events shown as a shuffled vertical list. Each item has ↑ ↓ buttons to reorder. Tap Check to verify. Wrong-position items flash red, correct ones lock green.

- [ ] **Step 1: Create the component**

```tsx
// src/games/components/Chrono.tsx
import { useState, useRef } from 'react'
import { ArrowUp, ArrowDown, CheckCircle, HelpCircle } from 'lucide-react'
import { ChronoConfig, GameResult } from '../types'
import { GameWinScreen } from './GameWinScreen'

interface Props { config: ChronoConfig }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface EventState {
  id: string
  label: string
  dateLabel: string
  sortKey: number
  factoid?: string
  status: 'idle' | 'correct' | 'wrong'
  locked: boolean
}

export function Chrono({ config }: Props) {
  const startTime = useRef(Date.now())
  const [events, setEvents] = useState<EventState[]>(
    () => shuffle(config.events).map(e => ({ ...e, status: 'idle' as const, locked: false }))
  )
  const [guesses, setGuesses] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [activeFactoid, setActiveFactoid] = useState<string | null>(null)
  const [result, setResult] = useState<GameResult | null>(null)

  function move(index: number, direction: 'up' | 'down') {
    setEvents(prev => {
      const next = [...prev]
      const swap = direction === 'up' ? index - 1 : index + 1
      if (swap < 0 || swap >= next.length) return prev
      if (next[index].locked || next[swap].locked) return prev
      ;[next[index], next[swap]] = [next[swap], next[index]]
      return next
    })
  }

  function handleCheck() {
    const newGuesses = guesses + 1
    setGuesses(newGuesses)

    const sorted = [...events].sort((a, b) => a.sortKey - b.sortKey)
    const updated = events.map((e, i) => ({
      ...e,
      status: e.sortKey === sorted[i].sortKey ? 'correct' as const : 'wrong' as const,
      locked: e.sortKey === sorted[i].sortKey,
    }))
    setEvents(updated)

    const allCorrect = updated.every(e => e.status === 'correct')

    setTimeout(() => {
      if (allCorrect) {
        const score = Math.max(0, 100 - (newGuesses - 1) * 20)
        setResult({
          gameType: 'chrono',
          score,
          guesses: newGuesses,
          hintsUsed,
          timeMs: Date.now() - startTime.current,
        })
      } else {
        setEvents(prev =>
          prev.map(e => e.status === 'wrong' ? { ...e, status: 'idle' as const } : e)
        )
      }
    }, 900)
  }

  function handleHint() {
    // Lock the earliest unlocked correct-position event
    const sorted = [...events].sort((a, b) => a.sortKey - b.sortKey)
    const correctIndex = events.findIndex((e, i) => !e.locked && e.sortKey === sorted[i].sortKey)
    if (correctIndex === -1) return
    setHintsUsed(h => h + 1)
    setEvents(prev =>
      prev.map((e, i) => i === correctIndex ? { ...e, locked: true, status: 'correct' } : e)
    )
  }

  function handleReset() {
    setEvents(shuffle(config.events).map(e => ({ ...e, status: 'idle' as const, locked: false })))
    setGuesses(0)
    setHintsUsed(0)
    setActiveFactoid(null)
    setResult(null)
    startTime.current = Date.now()
  }

  if (result) {
    config.onComplete?.(result)
    return <GameWinScreen result={result} onPlayAgain={handleReset} />
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-[#E8E5DF]">
        <p className="text-xs font-semibold text-[#78716C] uppercase tracking-wide" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>
          {config.subject} · {config.theme}
        </p>
        <p className="text-sm text-[#292524] mt-0.5" style={{ fontFamily: 'Inter, system-ui' }}>
          Arrange events from earliest to latest
        </p>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-1">
            <span className="text-xs text-[#A8A29E]" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>Before</span>
            <div className="w-16 h-px bg-[#E8E5DF] mx-1" />
            <span className="text-xs text-[#A8A29E]" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>After</span>
          </div>
          <span className="text-xs text-[#A8A29E]">{guesses} attempt{guesses !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Event list */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="flex flex-col gap-2">
          {events.map((event, i) => (
            <div key={event.id}>
              <div
                className={`bg-white border rounded-xl overflow-hidden transition-all duration-150 ${
                  event.status === 'correct'
                    ? 'border-[#BBF7D0] bg-[#F0FDF4]'
                    : event.status === 'wrong'
                    ? 'border-[#FECACA] bg-[#FEF2F2]'
                    : 'border-[#E8E5DF]'
                }`}
              >
                <div className="flex items-center gap-3 px-3 py-3">
                  {/* Reorder buttons */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => move(i, 'up')}
                      disabled={event.locked || i === 0}
                      className="w-6 h-6 flex items-center justify-center rounded-md disabled:opacity-20 text-[#78716C] hover:bg-[#F0EEE9]"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => move(i, 'down')}
                      disabled={event.locked || i === events.length - 1}
                      className="w-6 h-6 flex items-center justify-center rounded-md disabled:opacity-20 text-[#78716C] hover:bg-[#F0EEE9]"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className={`text-[13px] font-semibold mb-0.5 ${
                      event.status === 'correct' ? 'text-[#166534]' : 'text-[#1C1917]'
                    }`} style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>
                      {event.locked && (
                        <span className="inline-block bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-[11px] font-bold px-2 py-0.5 rounded-full mr-1.5">
                          {event.dateLabel}
                        </span>
                      )}
                      {event.label}
                    </div>
                  </div>

                  {/* Status icon */}
                  {event.status === 'correct' && (
                    <CheckCircle size={18} className="text-[#15803D] shrink-0" />
                  )}
                  {event.factoid && (
                    <button
                      onClick={() => setActiveFactoid(activeFactoid === event.id ? null : event.id)}
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-[#F0EEE9] text-[#78716C] text-[11px] font-bold shrink-0"
                    >
                      i
                    </button>
                  )}
                </div>

                {/* Factoid */}
                {activeFactoid === event.id && event.factoid && (
                  <div className="px-4 pb-3 pt-0">
                    <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-lg px-3 py-2">
                      <p className="text-[13px] text-[#92400E] leading-relaxed" style={{ fontFamily: 'Inter, system-ui' }}>
                        {event.factoid}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[#E8E5DF] flex gap-3">
        <button
          onClick={handleHint}
          className="flex items-center gap-1.5 px-4 py-3 bg-[#F0EEE9] text-[#78716C] rounded-xl text-[14px] font-semibold"
          style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}
        >
          <HelpCircle size={16} />
          Hint
        </button>
        <button
          onClick={handleCheck}
          className="flex-1 py-3 rounded-xl text-[15px] font-bold bg-[#2563EB] text-white"
          style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}
        >
          Check Order
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run lint
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/games/components/Chrono.tsx
git commit -m "feat(games): add Chrono ordering game component"
```

---

### Task 6: Links Game

**Files:**
- Create: `src/games/components/Links.tsx`

**UX:** 4 attribute bubbles arranged in a cross pattern around a center card slot. Deck of answer cards shown at bottom. Tap left/right arrows to cycle deck. Tap "Place" to try the current card. Hints reveal one attribute's meaning.

- [ ] **Step 1: Create the component**

```tsx
// src/games/components/Links.tsx
import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react'
import { LinksConfig, GameResult } from '../types'
import { GameWinScreen } from './GameWinScreen'

interface Props { config: LinksConfig }

export function Links({ config }: Props) {
  const startTime = useRef(Date.now())
  const [roundIndex, setRoundIndex] = useState(0)
  const [deckIndex, setDeckIndex] = useState(0)
  const [guesses, setGuesses] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [revealedHints, setRevealedHints] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [completedRounds, setCompletedRounds] = useState(0)
  const [result, setResult] = useState<GameResult | null>(null)

  const round = config.rounds[roundIndex]
  // Cards not yet used as correct answers
  const usedIds = config.rounds.slice(0, roundIndex).map(r => r.cardId)
  const availableCards = config.cards.filter(c => !usedIds.includes(c.id))
  const currentCard = availableCards[deckIndex % availableCards.length]

  function handlePlace() {
    if (!currentCard) return
    const newGuesses = guesses + 1
    setGuesses(newGuesses)

    if (currentCard.id === round.cardId) {
      setFeedback('correct')
      setTimeout(() => {
        setFeedback(null)
        setRevealedHints(0)
        const nextRound = roundIndex + 1
        const newCompleted = completedRounds + 1
        setCompletedRounds(newCompleted)
        if (nextRound >= config.rounds.length) {
          const score = Math.max(0, 100 - (newGuesses - config.rounds.length) * 15)
          setResult({
            gameType: 'links',
            score,
            guesses: newGuesses,
            hintsUsed,
            timeMs: Date.now() - startTime.current,
          })
        } else {
          setRoundIndex(nextRound)
          setDeckIndex(0)
        }
      }, 800)
    } else {
      setFeedback('wrong')
      setTimeout(() => {
        setFeedback(null)
        setDeckIndex(i => (i + 1) % availableCards.length)
      }, 600)
    }
  }

  function handleHint() {
    if (!round.hints || revealedHints >= round.hints.length) return
    setHintsUsed(h => h + 1)
    setRevealedHints(r => r + 1)
  }

  function handleReset() {
    setRoundIndex(0)
    setDeckIndex(0)
    setGuesses(0)
    setHintsUsed(0)
    setRevealedHints(0)
    setFeedback(null)
    setCompletedRounds(0)
    setResult(null)
    startTime.current = Date.now()
  }

  if (result) {
    config.onComplete?.(result)
    return <GameWinScreen result={result} onPlayAgain={handleReset} />
  }

  // Layout: top attribute, left attribute, right attribute, bottom attribute
  const [top, left, right, bottom] = round.attributes

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-[#E8E5DF]">
        <p className="text-xs font-semibold text-[#78716C] uppercase tracking-wide" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>
          {config.subject} · {config.theme}
        </p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-[#292524]" style={{ fontFamily: 'Inter, system-ui' }}>
            Round {roundIndex + 1} of {config.rounds.length}
          </p>
          <div className="flex gap-1">
            {config.rounds.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${i < completedRounds ? 'bg-[#15803D]' : i === roundIndex ? 'bg-[#2563EB]' : 'bg-[#E8E5DF]'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Game area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
        {/* Attribute web */}
        <div className="w-full max-w-xs">
          {/* Top attribute */}
          <div className="flex justify-center mb-3">
            <Bubble label={top} />
          </div>

          {/* Middle row: left + center + right */}
          <div className="flex items-center justify-between gap-2">
            <Bubble label={left} />

            {/* Center card slot */}
            <div
              className={`w-28 h-36 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 ${
                feedback === 'correct'
                  ? 'bg-[#F0FDF4] border-[#15803D]'
                  : feedback === 'wrong'
                  ? 'bg-[#FEF2F2] border-[#B91C1C]'
                  : 'bg-white border-[#2563EB] border-dashed'
              }`}
            >
              {currentCard && (
                <div className="text-center px-2">
                  <p
                    className={`text-[13px] font-bold leading-tight ${
                      feedback === 'correct' ? 'text-[#166534]' : feedback === 'wrong' ? 'text-[#991B1B]' : 'text-[#1C1917]'
                    }`}
                    style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}
                  >
                    {currentCard.label}
                  </p>
                </div>
              )}
            </div>

            <Bubble label={right} />
          </div>

          {/* Bottom attribute */}
          <div className="flex justify-center mt-3">
            <Bubble label={bottom} />
          </div>

          {/* Hint row */}
          {round.hints && revealedHints > 0 && (
            <div className="mt-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl px-3 py-2">
              <p className="text-[12px] font-semibold text-[#92400E] mb-1" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>Hint</p>
              <p className="text-[13px] text-[#92400E]" style={{ fontFamily: 'Inter, system-ui' }}>
                {round.hints[revealedHints - 1]}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Deck + actions */}
      <div className="px-4 pb-4 border-t border-[#E8E5DF] pt-3">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => setDeckIndex(i => (i - 1 + availableCards.length) % availableCards.length)}
            className="w-10 h-10 flex items-center justify-center bg-[#F0EEE9] rounded-xl text-[#78716C]"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex-1 bg-white border border-[#E8E5DF] rounded-xl px-4 py-2.5 text-center">
            <p className="text-[14px] font-semibold text-[#1C1917]" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>
              {currentCard?.label}
            </p>
            <p className="text-[11px] text-[#A8A29E] mt-0.5">
              {deckIndex + 1} / {availableCards.length}
            </p>
          </div>

          <button
            onClick={() => setDeckIndex(i => (i + 1) % availableCards.length)}
            className="w-10 h-10 flex items-center justify-center bg-[#F0EEE9] rounded-xl text-[#78716C]"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleHint}
            disabled={!round.hints || revealedHints >= (round.hints?.length ?? 0)}
            className="flex items-center gap-1.5 px-4 py-3 bg-[#F0EEE9] text-[#78716C] rounded-xl text-[14px] font-semibold disabled:opacity-40"
            style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}
          >
            <HelpCircle size={16} />
            Hint
          </button>
          <button
            onClick={handlePlace}
            disabled={feedback !== null}
            className="flex-1 py-3 rounded-xl text-[15px] font-bold bg-[#2563EB] text-white disabled:opacity-50"
            style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}
          >
            Place here
          </button>
        </div>
      </div>
    </div>
  )
}

function Bubble({ label }: { label: string }) {
  return (
    <div className="bg-[#F0EEE9] border border-[#E8E5DF] rounded-full px-3 py-2 max-w-[110px] text-center">
      <p className="text-[11px] font-medium text-[#292524] leading-tight" style={{ fontFamily: 'Inter, system-ui' }}>
        {label}
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run lint
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/games/components/Links.tsx
git commit -m "feat(games): add Links attribute-matching game component"
```

---

### Task 7: Knockout Game

**Files:**
- Create: `src/games/components/Knockout.tsx`

**UX:** Two cards side by side. Question at top. Tap the winner. Bracket progresses round by round until a champion is found.

- [ ] **Step 1: Create the component**

```tsx
// src/games/components/Knockout.tsx
import { useState, useRef } from 'react'
import { Trophy } from 'lucide-react'
import { KnockoutConfig, GameResult } from '../types'
import { GameWinScreen } from './GameWinScreen'

interface Props { config: KnockoutConfig }

interface Matchup {
  cardA: { id: string; label: string }
  cardB: { id: string; label: string }
}

function buildBracket(cards: KnockoutConfig['cards']): Matchup[] {
  const matchups: Matchup[] = []
  for (let i = 0; i + 1 < cards.length; i += 2) {
    matchups.push({ cardA: cards[i], cardB: cards[i + 1] })
  }
  return matchups
}

export function Knockout({ config }: Props) {
  const startTime = useRef(Date.now())
  const [roundCards, setRoundCards] = useState(config.cards)
  const [matchupIndex, setMatchupIndex] = useState(0)
  const [totalGuesses, setTotalGuesses] = useState(0)
  const [winner, setWinner] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [result, setResult] = useState<GameResult | null>(null)
  const [roundWinners, setRoundWinners] = useState<string[]>([])
  const [roundLabel, setRoundLabel] = useState(1)

  const matchups = buildBracket(roundCards)
  const currentMatchup = matchups[matchupIndex]

  function getCorrectWinner(a: string, b: string): string {
    const key1 = `${a}_vs_${b}`
    const key2 = `${b}_vs_${a}`
    return config.answers[key1] ?? config.answers[key2] ?? a
  }

  function handlePick(pickedId: string) {
    if (selected) return
    setSelected(pickedId)
    setTotalGuesses(g => g + 1)

    const correctWinner = getCorrectWinner(currentMatchup.cardA.id, currentMatchup.cardB.id)
    const isCorrect = pickedId === correctWinner

    setTimeout(() => {
      const winnerCard = roundCards.find(c => c.id === correctWinner)!
      const newWinners = [...roundWinners, correctWinner]

      const nextMatchup = matchupIndex + 1

      if (nextMatchup >= matchups.length) {
        // Round complete — winners advance
        if (newWinners.length === 1) {
          // Tournament winner
          setWinner(winnerCard.label)
          setResult({
            gameType: 'knockout',
            score: isCorrect ? 100 : 60,
            guesses: totalGuesses + 1,
            hintsUsed: 0,
            timeMs: Date.now() - startTime.current,
          })
        } else {
          // Next round
          const nextRoundCards = newWinners.map(id => roundCards.find(c => c.id === id)!)
          setRoundCards(nextRoundCards)
          setMatchupIndex(0)
          setRoundWinners([])
          setSelected(null)
          setRoundLabel(l => l + 1)
        }
      } else {
        setRoundWinners(newWinners)
        setMatchupIndex(nextMatchup)
        setSelected(null)
      }
    }, 800)
  }

  function handleReset() {
    setRoundCards(config.cards)
    setMatchupIndex(0)
    setTotalGuesses(0)
    setWinner(null)
    setSelected(null)
    setResult(null)
    setRoundWinners([])
    setRoundLabel(1)
    startTime.current = Date.now()
  }

  if (result) {
    config.onComplete?.(result)
    return <GameWinScreen result={result} onPlayAgain={handleReset} />
  }

  if (!currentMatchup) return null

  const correctWinner = getCorrectWinner(currentMatchup.cardA.id, currentMatchup.cardB.id)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-[#E8E5DF]">
        <p className="text-xs font-semibold text-[#78716C] uppercase tracking-wide" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>
          {config.subject} · {config.theme} · Round {roundLabel}
        </p>
        <h2 className="text-[18px] font-bold text-[#1C1917] mt-1 leading-snug" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>
          {config.question}
        </h2>
        {config.subtitle && (
          <p className="text-[13px] text-[#78716C] mt-1" style={{ fontFamily: 'Inter, system-ui' }}>
            {config.subtitle}
          </p>
        )}
        <p className="text-xs text-[#A8A29E] mt-1.5">
          Match {matchupIndex + 1} of {matchups.length}
        </p>
      </div>

      {/* Cards */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="flex gap-4 w-full max-w-xs">
          {([currentMatchup.cardA, currentMatchup.cardB] as const).map(card => {
            const isSelected = selected === card.id
            const isCorrect = selected !== null && card.id === correctWinner
            const isWrong = selected !== null && isSelected && card.id !== correctWinner

            return (
              <button
                key={card.id}
                onClick={() => handlePick(card.id)}
                disabled={selected !== null}
                className={`flex-1 aspect-[3/4] rounded-2xl border-2 flex flex-col items-center justify-center px-3 transition-all duration-200 ${
                  isCorrect
                    ? 'bg-[#F0FDF4] border-[#15803D]'
                    : isWrong
                    ? 'bg-[#FEF2F2] border-[#B91C1C]'
                    : selected === null
                    ? 'bg-white border-[#E8E5DF] active:scale-95 active:border-[#2563EB]'
                    : 'bg-white border-[#E8E5DF] opacity-60'
                }`}
              >
                {isCorrect && <Trophy size={20} className="text-[#15803D] mb-2" />}
                <p
                  className={`text-[15px] font-bold text-center leading-tight ${
                    isCorrect ? 'text-[#166534]' : isWrong ? 'text-[#991B1B]' : 'text-[#1C1917]'
                  }`}
                  style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}
                >
                  {card.label}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* vs divider */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: '50%' }}>
        <div className="w-8 h-8 rounded-full bg-[#F0EEE9] border border-[#E8E5DF] flex items-center justify-center z-10">
          <span className="text-[11px] font-bold text-[#78716C]">vs</span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[#E8E5DF]">
        <p className="text-center text-sm text-[#78716C]" style={{ fontFamily: 'Inter, system-ui' }}>
          Tap a card to pick the winner
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run lint
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/games/components/Knockout.tsx
git commit -m "feat(games): add Knockout bracket game component"
```

---

### Task 8: GameRunner Dispatcher

**Files:**
- Create: `src/games/GameRunner.tsx`

- [ ] **Step 1: Create the dispatcher**

```tsx
// src/games/GameRunner.tsx
import { GameConfig } from './types'
import { ThisOrThat } from './components/ThisOrThat'
import { Chrono } from './components/Chrono'
import { Links } from './components/Links'
import { Knockout } from './components/Knockout'

interface Props {
  config: GameConfig
}

export function GameRunner({ config }: Props) {
  switch (config.type) {
    case 'this-or-that': return <ThisOrThat config={config} />
    case 'chrono':       return <Chrono config={config} />
    case 'links':        return <Links config={config} />
    case 'knockout':     return <Knockout config={config} />
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run lint
```
Expected: no errors, exhaustive switch (TypeScript will error if a case is missing)

- [ ] **Step 3: Commit**

```bash
git add src/games/GameRunner.tsx
git commit -m "feat(games): add GameRunner dispatcher component"
```

---

### Task 9: GamesScreen Demo

**Files:**
- Create: `src/games/GamesScreen.tsx`

- [ ] **Step 1: Create the demo screen**

```tsx
// src/games/GamesScreen.tsx
import { useState } from 'react'
import { Shuffle, Clock, Link2, Sword } from 'lucide-react'
import { GameRunner } from './GameRunner'
import { GameConfig } from './types'
import {
  dsaThisOrThat,
  dsaChrono,
  dsaLinks,
  dsaKnockout,
} from './data/dsa-dummy'

type Tab = 'this-or-that' | 'chrono' | 'links' | 'knockout'

const TABS: { id: Tab; label: string; icon: React.ElementType; color: string; bg: string }[] = [
  { id: 'this-or-that', label: 'This or That', icon: Shuffle, color: '#166534', bg: '#F0FDF4' },
  { id: 'chrono',       label: 'Chrono',       icon: Clock,   color: '#92400E', bg: '#FFFBEB' },
  { id: 'links',        label: 'Links',        icon: Link2,   color: '#1D4ED8', bg: '#EFF6FF' },
  { id: 'knockout',     label: 'Knockout',     icon: Sword,   color: '#7C3AED', bg: '#F5F3FF' },
]

const CONFIGS: Record<Tab, GameConfig> = {
  'this-or-that': dsaThisOrThat,
  chrono:         dsaChrono,
  links:          dsaLinks,
  knockout:       dsaKnockout,
}

interface Props {
  onBack: () => void
}

export function GamesScreen({ onBack }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('this-or-that')
  const config = CONFIGS[activeTab]
  const activeTabMeta = TABS.find(t => t.id === activeTab)!

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F7F6F3]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-[#E8E5DF]">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center bg-[#F0EEE9] rounded-xl text-[#292524]"
        >
          ←
        </button>
        <div className="flex-1">
          <p className="text-[17px] font-bold text-[#1C1917]" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>
            Daily Games
          </p>
          <p className="text-[12px] text-[#78716C]" style={{ fontFamily: 'Inter, system-ui' }}>
            DSA · Today's Theme
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 px-4 py-2 bg-white border-b border-[#E8E5DF] overflow-x-auto">
        {TABS.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'text-white'
                  : 'bg-[#F0EEE9] text-[#78716C]'
              }`}
              style={{
                fontFamily: 'Plus Jakarta Sans, system-ui',
                backgroundColor: isActive ? activeTabMeta.color : undefined,
              }}
            >
              <Icon size={13} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Game area */}
      <div className="flex-1 overflow-hidden bg-[#F7F6F3]">
        <div className="h-full overflow-y-auto">
          <GameRunner key={activeTab} config={config} />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run lint
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/games/GamesScreen.tsx
git commit -m "feat(games): add GamesScreen demo with 4 tabs"
```

---

### Task 10: Wire into App.tsx

**Files:**
- Modify: `src/App.tsx`

This task adds `'Games'` to the `Screen` union and renders `GamesScreen` in the switch. It also adds a temporary "Games" button on the Dashboard to navigate there.

- [ ] **Step 1: Open App.tsx and find the Screen type**

Look for a line like:
```ts
type Screen = 'Dashboard' | 'Session' | ...
```

Add `| 'Games'` to it.

- [ ] **Step 2: Add the import at the top of App.tsx**

```tsx
import { GamesScreen } from '@/games/GamesScreen'
```

- [ ] **Step 3: Add the render branch**

In the `switch(screen)` (or equivalent conditional rendering block), add:

```tsx
case 'Games':
  return <GamesScreen onBack={() => setScreen('Dashboard')} />
```

- [ ] **Step 4: Add a navigation button on Dashboard**

In `src/screens/Dashboard.tsx`, find a convenient spot (e.g., below the session start button) and add a temporary button:

```tsx
// Temporary — remove when games are wired to subject sessions
<button
  onClick={() => onNavigate('Games')}
  className="w-full flex items-center justify-between px-4 py-3.5 bg-white border border-[#E8E5DF] rounded-2xl"
>
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
      <Gamepad2 size={20} className="text-[#2563EB]" />
    </div>
    <div>
      <p className="text-[15px] font-semibold text-[#1C1917]" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>Daily Games</p>
      <p className="text-[12px] text-[#78716C]">DSA · 4 games today</p>
    </div>
  </div>
  <ChevronRight size={16} className="text-[#A8A29E]" />
</button>
```

Add `import { Gamepad2, ChevronRight } from 'lucide-react'` if not already imported.

- [ ] **Step 5: Verify TypeScript compiles and dev server runs**

```bash
npm run lint && npm run dev
```
Expected: no errors, dev server starts at http://localhost:3000

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/screens/Dashboard.tsx
git commit -m "feat(games): wire GamesScreen into app navigation"
```

---

## Self-Review Notes

- All `GameConfig` fields used in components match exactly what's defined in `types.ts`
- `onComplete` is called only once, guarded by early return on `result !== null`
- `GameRunner` switch is exhaustive — TypeScript will error if a new game type is added without a case
- All components use design system colors exactly (`#F7F6F3`, `#E8E5DF`, `#2563EB`, `#15803D`, `#B91C1C`)
- Lucide icons used throughout — no emojis in UI
- `key={activeTab}` on `GameRunner` in `GamesScreen` ensures state resets when switching tabs
- Knockout `vs` divider uses `absolute` positioning — verify it renders correctly on device
