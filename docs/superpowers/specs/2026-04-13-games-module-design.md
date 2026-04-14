# Games Module Design
**Date:** 2026-04-13  
**Status:** Approved

---

## What We're Building

A standalone, config-driven games module at `src/games/`. Four game modes. Pass a `GameConfig` object → get a fully functional game UI. No coupling to FSRS or any subject-specific logic. Works for DSA, NEET Biology, Chemistry, Physics — any domain.

---

## Architecture

### Entry Point
```tsx
<GameRunner config={config} />
```
Reads `config.type` and renders the correct game component. `onComplete` callback returns a `GameResult` (score, guesses, hintsUsed, timeMs).

### File Structure
```
src/games/
  types.ts                  ← GameConfig union + GameResult
  GameRunner.tsx            ← dispatcher
  GamesScreen.tsx           ← demo screen (4 tabs, one per game)
  data/
    dsa-dummy.ts            ← DSA dummy configs for all 4 games
  components/
    ThisOrThat/
      index.tsx
      useThisOrThat.ts
    Chrono/
      index.tsx
      useChrono.ts
    Links/
      index.tsx
      useLinks.ts
    Knockout/
      index.tsx
      useKnockout.ts
```

---

## Data Structures

```ts
interface GameBase {
  theme: string
  subject: string
  onComplete?: (result: GameResult) => void
}

interface GameResult {
  gameType: GameConfig['type']
  score: number       // 0–100
  guesses: number
  hintsUsed: number
  timeMs: number
}

// This or That — drag cards to correct column
interface ThisOrThatConfig extends GameBase {
  type: 'this-or-that'
  columnA: { label: string; description: string }
  columnB: { label: string; description: string }
  cards: Array<{ id: string; label: string; image?: string; correct: 'A' | 'B' }>
}

// Chrono — arrange events in order
interface ChronoConfig extends GameBase {
  type: 'chrono'
  events: Array<{
    id: string
    label: string
    dateLabel: string
    sortKey: number
    image?: string
    factoid?: string
  }>
}

// Links — match a card to 4 attributes
interface LinksConfig extends GameBase {
  type: 'links'
  cards: Array<{ id: string; label: string; image?: string }>
  rounds: Array<{
    cardId: string
    attributes: [string, string, string, string]
    hints?: string[]
  }>
}

// Knockout — binary head-to-head comparison
interface KnockoutConfig extends GameBase {
  type: 'knockout'
  question: string
  subtitle?: string
  cards: Array<{ id: string; label: string; image?: string }>
  answers: Record<string, string>  // "id1_vs_id2" → winner id
}

export type GameConfig = ThisOrThatConfig | ChronoConfig | LinksConfig | KnockoutConfig
```

---

## DSA Dummy Data

### This or That — Stack vs Queue
- Column A: Stack (LIFO) | Column B: Queue (FIFO)
- Cards: LIFO, FIFO, Push/Pop ops, Enqueue/Dequeue ops, Browser back button, Printer spooler, DFS traversal, BFS traversal, Recursion call frames, Cashier line

### Chrono — Sorting Algorithm History
- Merge Sort invented (1945, sortKey: 1945)
- Bubble Sort described (1956, sortKey: 1956)
- Quicksort invented (1959, sortKey: 1959)
- Heapsort invented (1964, sortKey: 1964)
- Timsort created (2002, sortKey: 2002)

### Links — Data Structure Properties
- Cards: Binary Search Tree, Hash Table, Min Heap, Linked List
- Round 1 (BST): O(log n) average search | Left < root < right | In-order gives sorted output | Can degrade to O(n)
- Round 2 (Hash Table): O(1) average lookup | Uses key-value pairs | Handles collisions | Load factor matters

### Knockout — "Which is faster on average?"
- Bubble Sort vs Merge Sort → Merge Sort wins
- Linear Search vs Binary Search → Binary Search wins
- Insertion Sort vs Quick Sort → Quick Sort wins

---

## UI Design

Follows CHITTA design system exactly:
- Background: `#F7F6F3`, Cards: `#FFFFFF`, Border: `#E8E5DF`
- Font: Plus Jakarta Sans (headings) + Inter (content)
- Colors: existing semantic palette (green=correct, red=wrong, blue=primary)
- No emojis in UI chrome — Lucide icons only
- Animations: 120–200ms, physics-based (no celebration effects)

### GamesScreen layout
- Header: theme title + subject badge
- Tab bar: 4 game mode tabs (icons + labels)
- Game area: full remaining height
- Win state: score card with guesses + hints used + "Play again" CTA

---

## Constraints

- Zero FSRS coupling — games module has no imports from `src/core/`
- Zero subject coupling — all data comes from config
- `onComplete` is optional — games work standalone
- Each game must work with 0 images (image field always optional)
