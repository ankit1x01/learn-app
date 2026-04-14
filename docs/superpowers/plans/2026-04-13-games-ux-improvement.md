# Games UX Improvement — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace broken drag mechanics in ThisOrThat and Links with tap-to-assign; add ↑↓ button fallback to Chrono; fix Knockout VS badge positioning.

**Architecture:** Four independent component rewrites/patches — no shared state, no type changes, no new files. Each task is self-contained. Order: Knockout (trivial) → Chrono (additive) → Links (remove drag, add tap grid) → ThisOrThat (full interaction rewrite).

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, motion/react (existing), Lucide React icons

---

## File Map

| File | Change type |
|------|-------------|
| `src/games/components/Knockout.tsx` | One-line fix — add `relative` to flex row |
| `src/games/components/Chrono.tsx` | Additive — wire existing `move()` to ↑↓ buttons |
| `src/games/components/Links.tsx` | Replace `DraggableDeckCard` + deck nav with tap grid |
| `src/games/components/ThisOrThat.tsx` | Rewrite interaction layer; preserve game logic |

**No changes to:** `types.ts`, `GameRunner.tsx`, `GamesScreen.tsx`, `dsa-dummy.ts`, `GameWinScreen.tsx`

---

## Task 1: Fix Knockout VS badge positioning

**Files:**
- Modify: `src/games/components/Knockout.tsx` (line ~140)

The "vs" badge is `position: absolute` but its parent flex row has no `position: relative`, so the badge escapes its container.

- [ ] **Step 1: Apply the fix**

In `src/games/components/Knockout.tsx`, find the cards arena flex row (around line 140):

```tsx
// BEFORE
<div className="flex gap-4 w-full max-w-xs">
```

Change to:

```tsx
// AFTER
<div className="flex gap-4 w-full max-w-xs relative">
```

- [ ] **Step 2: Verify TypeScript**

```bash
npm run lint
```

Expected: 0 errors.

- [ ] **Step 3: Manual check**

Run `npm run dev`, open Games → Knockout. The "vs" badge should now be horizontally centered between the two cards instead of floating to the left of the layout.

- [ ] **Step 4: Commit**

```bash
git add src/games/components/Knockout.tsx
git commit -m "fix: center knockout VS badge by adding relative to card row"
```

---

## Task 2: Add ↑↓ tap buttons to Chrono

**Files:**
- Modify: `src/games/components/Chrono.tsx` (lines 219–229 — the Status icons block)

`ArrowUp` and `ArrowDown` are already imported. The `move(index, direction)` function is already implemented. This task only wires the UI.

- [ ] **Step 1: Replace the Status icons block**

In `src/games/components/Chrono.tsx`, find the `{/* Status icons */}` block inside the `Reorder.Item` render (around line 219):

```tsx
{/* Status icons */}
<div className="flex items-center gap-1.5 flex-shrink-0">
  {event.status === 'correct' && <CheckCircle size={16} color="#16A34A" />}
  {event.factoid && (
    <button
      onPointerDown={(e) => e.stopPropagation()}
      onClick={() => setActiveFactoid(activeFactoid === event.id ? null : event.id)}
      className="w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-black pointer-events-auto"
      style={{ background: '#F0EEE9', color: '#78716C', fontFamily: 'Inter, system-ui' }}
    >
      i
    </button>
  )}
</div>
```

Replace with:

```tsx
{/* Status icons + move buttons */}
<div className="flex items-center gap-1.5 flex-shrink-0 pointer-events-auto">
  {event.status === 'correct' && <CheckCircle size={16} color="#16A34A" />}
  {!event.locked && (
    <div className="flex flex-col gap-0.5">
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => move(i, 'up')}
        disabled={i === 0 || events[i - 1]?.locked}
        className="w-6 h-6 flex items-center justify-center rounded-lg active:translate-y-0.5 transition-transform disabled:opacity-25"
        style={{ background: '#F0EEE9' }}
      >
        <ArrowUp size={11} color="#78716C" />
      </button>
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => move(i, 'down')}
        disabled={i === events.length - 1 || events[i + 1]?.locked}
        className="w-6 h-6 flex items-center justify-center rounded-lg active:translate-y-0.5 transition-transform disabled:opacity-25"
        style={{ background: '#F0EEE9' }}
      >
        <ArrowDown size={11} color="#78716C" />
      </button>
    </div>
  )}
  {event.factoid && (
    <button
      onPointerDown={(e) => e.stopPropagation()}
      onClick={() => setActiveFactoid(activeFactoid === event.id ? null : event.id)}
      className="w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-black pointer-events-auto"
      style={{ background: '#F0EEE9', color: '#78716C', fontFamily: 'Inter, system-ui' }}
    >
      i
    </button>
  )}
</div>
```

- [ ] **Step 2: Verify TypeScript**

```bash
npm run lint
```

Expected: 0 errors.

- [ ] **Step 3: Manual check**

Run `npm run dev`, open Games → Chrono. Each unlocked card should show two small ↑↓ buttons on the right. Tapping them should reorder cards. Locked (correct) cards should have no buttons.

- [ ] **Step 4: Commit**

```bash
git add src/games/components/Chrono.tsx
git commit -m "feat: add up/down tap buttons to Chrono as drag fallback"
```

---

## Task 3: Replace Links drag with tap grid

**Files:**
- Modify: `src/games/components/Links.tsx` — full replacement

Remove: `DraggableDeckCard` component, `deckIndex` state, chevron nav, `motion`/`useAnimation`/`PanInfo` imports.  
Add: tap grid of `availableCards` at the bottom of the layout.

- [ ] **Step 1: Replace the full file**

Replace the entire contents of `src/games/components/Links.tsx` with:

```tsx
// src/games/components/Links.tsx
import { useState, useRef } from 'react'
import { HelpCircle } from 'lucide-react'
import { LinksConfig, GameResult } from '../types'
import { GameWinScreen } from './GameWinScreen'

interface Props { config: LinksConfig }

const DECK_COLORS = ['#FCD34D', '#A78BFA', '#4ADE80', '#60A5FA', '#FB923C', '#F472B6']

export function Links({ config }: Props) {
  const startTime = useRef(Date.now())
  const [roundIndex, setRoundIndex] = useState(0)
  const [guesses, setGuesses] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [revealedHints, setRevealedHints] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [lastAttemptedId, setLastAttemptedId] = useState<string | null>(null)
  const [completedRounds, setCompletedRounds] = useState(0)
  const [result, setResult] = useState<GameResult | null>(null)

  const round = config.rounds[roundIndex]
  const usedIds = config.rounds.slice(0, roundIndex).map(r => r.cardId)
  const availableCards = config.cards.filter(c => !usedIds.includes(c.id))

  function handlePlace(card: { id: string; label: string }) {
    if (feedback !== null) return
    const newGuesses = guesses + 1
    setGuesses(newGuesses)
    setLastAttemptedId(card.id)

    if (card.id === round.cardId) {
      setFeedback('correct')
      setTimeout(() => {
        setFeedback(null)
        setLastAttemptedId(null)
        setRevealedHints(0)
        const nextRound = roundIndex + 1
        const newCompleted = completedRounds + 1
        setCompletedRounds(newCompleted)
        if (nextRound >= config.rounds.length) {
          const score = Math.max(0, 100 - (newGuesses - config.rounds.length) * 15)
          const finalResult: GameResult = {
            gameType: 'links',
            score,
            guesses: newGuesses,
            hintsUsed,
            timeMs: Date.now() - startTime.current,
          }
          config.onComplete?.(finalResult)
          setResult(finalResult)
        } else {
          setRoundIndex(nextRound)
        }
      }, 800)
    } else {
      setFeedback('wrong')
      setTimeout(() => {
        setFeedback(null)
        setLastAttemptedId(null)
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
    setGuesses(0)
    setHintsUsed(0)
    setRevealedHints(0)
    setFeedback(null)
    setLastAttemptedId(null)
    setCompletedRounds(0)
    setResult(null)
    startTime.current = Date.now()
  }

  if (result) return <GameWinScreen result={result} onPlayAgain={handleReset} />

  const [top, left, right, bottom] = round.attributes

  const centerBorder =
    feedback === 'correct' ? '#22C55E' :
    feedback === 'wrong'   ? '#EF4444' :
    '#1C1917'

  const centerBg =
    feedback === 'correct' ? '#F0FDF4' :
    feedback === 'wrong'   ? '#FEF2F2' :
    '#FFFFFF'

  return (
    <div className="flex flex-col h-full" style={{ background: '#F5F0E8' }}>
      {/* Sub-header */}
      <div className="px-4 py-3 border-b border-[#E3DDD5]" style={{ background: 'white' }}>
        <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#9CA3AF', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
          {config.subject} · {config.theme}
        </p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-[15px] font-black text-[#1C1917]" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>
            Round {roundIndex + 1} of {config.rounds.length}
          </p>
          <div className="flex gap-1.5">
            {config.rounds.map((r, i) => (
              <div
                key={r.cardId}
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: i < completedRounds ? '#22C55E' : i === roundIndex ? '#1C1917' : '#D4CFC8',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* SVG attribute web */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-2">
        <div className="relative w-full" style={{ height: 280, maxWidth: 320 }}>
          {/* SVG lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 320 280"
            preserveAspectRatio="xMidYMid meet"
          >
            <line x1="160" y1="135" x2="160" y2="48"  stroke="#D4CFC8" strokeWidth="2" strokeDasharray="4 3" />
            <line x1="145" y1="140" x2="52"  y2="140" stroke="#D4CFC8" strokeWidth="2" strokeDasharray="4 3" />
            <line x1="175" y1="140" x2="268" y2="140" stroke="#D4CFC8" strokeWidth="2" strokeDasharray="4 3" />
            <line x1="160" y1="150" x2="160" y2="232" stroke="#D4CFC8" strokeWidth="2" strokeDasharray="4 3" />
          </svg>

          {/* Top attribute */}
          <div className="absolute" style={{ top: 0, left: '50%', transform: 'translateX(-50%)' }}>
            <AttributePill label={top} />
          </div>

          {/* Left attribute */}
          <div className="absolute" style={{ top: '50%', left: 0, transform: 'translateY(-50%)' }}>
            <AttributePill label={left} />
          </div>

          {/* Center slot */}
          <div
            className="absolute rounded-2xl flex items-center justify-center transition-all duration-200"
            style={{
              top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: 108, height: 120,
              background: centerBg,
              border: `2.5px solid ${centerBorder}`,
              boxShadow: feedback === 'correct'
                ? '0 4px 16px rgba(34,197,94,0.25)'
                : feedback === 'wrong'
                ? '0 4px 16px rgba(239,68,68,0.20)'
                : '0 4px 20px rgba(0,0,0,0.12)',
            }}
          >
            <p
              className="text-[12px] font-black text-center px-2 leading-snug"
              style={{
                color: feedback === 'correct' ? '#16A34A' : feedback === 'wrong' ? '#DC2626' : '#A8A29E',
                fontFamily: 'Plus Jakarta Sans, system-ui',
              }}
            >
              {feedback === null ? 'Tap a card' : lastAttemptedId
                ? availableCards.find(c => c.id === lastAttemptedId)?.label ?? '?'
                : '?'
              }
            </p>
          </div>

          {/* Right attribute */}
          <div className="absolute" style={{ top: '50%', right: 0, transform: 'translateY(-50%)' }}>
            <AttributePill label={right} />
          </div>

          {/* Bottom attribute */}
          <div className="absolute" style={{ bottom: 0, left: '50%', transform: 'translateX(-50%)' }}>
            <AttributePill label={bottom} />
          </div>
        </div>

        {/* Hint banner */}
        {round.hints && revealedHints > 0 && (
          <div
            className="w-full max-w-xs rounded-xl px-3 py-2 mt-2"
            style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}
          >
            <p className="text-[11px] font-bold text-[#92400E] mb-0.5" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>Hint</p>
            <p className="text-[12px] text-[#92400E]" style={{ fontFamily: 'Inter, system-ui' }}>
              {round.hints[revealedHints - 1]}
            </p>
          </div>
        )}
      </div>

      {/* Tap grid + hint button */}
      <div className="px-4 pb-4" style={{ borderTop: '1px solid #E3DDD5' }}>
        <div className="flex items-center justify-between pt-3 pb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#9CA3AF', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
            Tap the matching card
          </p>
          <button
            onClick={handleHint}
            disabled={!round.hints || revealedHints >= (round.hints?.length ?? 0)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[13px] font-bold disabled:opacity-40 active:translate-y-0.5 transition-transform"
            style={{ background: '#F0EEE9', color: '#78716C', fontFamily: 'Plus Jakarta Sans, system-ui', border: '2px solid #E3DDD5', boxShadow: '0 3px 0 #D4CFC8' }}
          >
            <HelpCircle size={13} />
            Hint
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {availableCards.map((card, i) => {
            const isAttempted = lastAttemptedId === card.id
            const isCorrectFlash = isAttempted && feedback === 'correct'
            const isWrongFlash   = isAttempted && feedback === 'wrong'
            return (
              <button
                key={card.id}
                onClick={() => handlePlace(card)}
                disabled={feedback !== null}
                className="py-3 px-4 rounded-2xl text-[14px] font-black text-left active:translate-y-0.5 transition-all disabled:opacity-60"
                style={{
                  background: isCorrectFlash ? '#F0FDF4' : isWrongFlash ? '#FEF2F2' : DECK_COLORS[i % DECK_COLORS.length],
                  border: isCorrectFlash ? '2px solid #22C55E' : isWrongFlash ? '2px solid #EF4444' : '2px solid transparent',
                  boxShadow: isCorrectFlash || isWrongFlash ? 'none' : '0 3px 0 rgba(0,0,0,0.15)',
                  color: isCorrectFlash ? '#166534' : isWrongFlash ? '#B91C1C' : 'rgba(0,0,0,0.72)',
                  fontFamily: 'Plus Jakarta Sans, system-ui',
                }}
              >
                {card.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function AttributePill({ label }: { label: string }) {
  return (
    <div
      className="rounded-2xl px-3 py-2 text-center"
      style={{
        background: '#FFFFFF',
        border: '2px solid #E3DDD5',
        boxShadow: '0 4px 0 #D4CFC8',
        maxWidth: 110,
        minWidth: 80,
      }}
    >
      <p
        className="text-[12px] font-black text-[#292524] leading-tight"
        style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}
      >
        {label}
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npm run lint
```

Expected: 0 errors.

- [ ] **Step 3: Manual check**

Run `npm run dev`, open Games → Links.
- Should see 4 colored tap buttons in a 2-column grid at the bottom (not a drag card)
- Tapping the wrong card should flash red for 600ms
- Tapping the correct card should flash green then advance to the next round
- Hint button should show the hint text above the web
- Completing all rounds should show the GameWinScreen

- [ ] **Step 4: Commit**

```bash
git add src/games/components/Links.tsx
git commit -m "feat: replace Links drag mechanic with tap grid"
```

---

## Task 4: Rewrite ThisOrThat interaction layer

**Files:**
- Modify: `src/games/components/ThisOrThat.tsx` — full replacement

New flow: show one card at a time with two large tap buttons (one per column). Cards placed in a column are shown in stacks and can be tapped to undo. Check button appears when all cards are assigned. Game logic (check, hint, reset, scoring) is preserved.

- [ ] **Step 1: Replace the full file**

Replace the entire contents of `src/games/components/ThisOrThat.tsx` with:

```tsx
// src/games/components/ThisOrThat.tsx
import { useState, useRef } from 'react'
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react'
import { ThisOrThatConfig, GameResult } from '../types'
import { GameWinScreen } from './GameWinScreen'

interface Props { config: ThisOrThatConfig }

const CARD_PALETTE = [
  '#4ADE80', '#FB923C', '#A78BFA', '#FCD34D', '#2DD4BF',
  '#60A5FA', '#F472B6', '#A3E635', '#F87171', '#818CF8',
]

interface CardData {
  id: string
  label: string
  correct: 'A' | 'B'
  color: string
}

export function ThisOrThat({ config }: Props) {
  const startTime = useRef(Date.now())

  const [cards] = useState<CardData[]>(() =>
    config.cards.map((c, i) => ({ ...c, color: CARD_PALETTE[i % CARD_PALETTE.length] }))
  )

  // assignments: cards the user has placed into a column (not yet confirmed correct)
  const [assignments, setAssignments] = useState<Record<string, 'A' | 'B'>>({})
  // confirmed: cards validated as correct — permanently placed
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set())
  // wrongIds: transient — cards just marked wrong during a check cycle
  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set())
  const [guesses, setGuesses] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [result, setResult] = useState<GameResult | null>(null)

  // Cards not yet confirmed correct
  const pendingCards = cards.filter(c => !confirmed.has(c.id))
  // Current card: first pending card with no assignment
  const currentCard = pendingCards.find(c => !(c.id in assignments)) ?? null
  // All pending cards have an assignment → show Check
  const allAssigned = pendingCards.length > 0 && pendingCards.every(c => c.id in assignments)

  // Column display helpers
  const colCards = (col: 'A' | 'B') => ({
    confirmed: cards.filter(c => confirmed.has(c.id) && c.correct === col),
    pending:   cards.filter(c => !confirmed.has(c.id) && assignments[c.id] === col),
  })

  function assign(col: 'A' | 'B') {
    if (!currentCard) return
    setAssignments(prev => ({ ...prev, [currentCard.id]: col }))
  }

  function unassign(id: string) {
    // Only allow unassign of non-confirmed, non-wrong-flashing cards
    if (confirmed.has(id) || wrongIds.has(id)) return
    setAssignments(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  function handleCheck() {
    if (!allAssigned) return
    const newGuesses = guesses + 1
    setGuesses(newGuesses)

    const newConfirmed = new Set(confirmed)
    const newWrong = new Set<string>()

    for (const card of pendingCards) {
      if (assignments[card.id] === card.correct) {
        newConfirmed.add(card.id)
      } else {
        newWrong.add(card.id)
      }
    }

    setWrongIds(newWrong)

    setTimeout(() => {
      setWrongIds(new Set())
      // Remove wrong assignments so they re-enter the queue
      setAssignments(prev => {
        const next = { ...prev }
        newWrong.forEach(id => delete next[id])
        return next
      })
      setConfirmed(newConfirmed)

      if (newConfirmed.size === cards.length) {
        const score = Math.max(0, 100 - (newGuesses - 1) * 15)
        const finalResult: GameResult = {
          gameType: 'this-or-that',
          score,
          guesses: newGuesses,
          hintsUsed,
          timeMs: Date.now() - startTime.current,
        }
        config.onComplete?.(finalResult)
        setResult(finalResult)
      }
    }, 900)
  }

  function handleHint() {
    if (!currentCard) return
    setHintsUsed(h => h + 1)
    setAssignments(prev => ({ ...prev, [currentCard.id]: currentCard.correct }))
  }

  function handleReset() {
    setAssignments({})
    setConfirmed(new Set())
    setWrongIds(new Set())
    setGuesses(0)
    setHintsUsed(0)
    setResult(null)
    startTime.current = Date.now()
  }

  if (result) return <GameWinScreen result={result} onPlayAgain={handleReset} />

  const sortedCount = confirmed.size + Object.keys(assignments).length

  return (
    <div className="flex flex-col h-full" style={{ background: '#F5F0E8' }}>
      {/* Sub-header */}
      <div className="px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#9CA3AF', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
          {config.subject}
        </p>
        <h2 className="text-[20px] font-black text-[#1C1917] mt-0.5" style={{ fontFamily: 'Plus Jakarta Sans, system-ui', letterSpacing: '-0.02em' }}>
          {config.theme}
        </h2>
        {guesses > 0 && (
          <div className="flex gap-1 mt-2">
            {Array.from({ length: guesses }, (_, i) => (
              <div key={i} className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#FEE2E2' }}>
                <XCircle size={10} color="#EF4444" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Column stacks */}
      <div className="grid grid-cols-2 gap-3 px-4">
        {(['A', 'B'] as const).map(col => {
          const cfg = col === 'A' ? config.columnA : config.columnB
          const { confirmed: cfm, pending: pnd } = colCards(col)
          const colAccent = col === 'A' ? '#14532D' : '#3730A3'
          const colBg     = col === 'A' ? '#F0FDF4' : '#EEF2FF'
          const colBorder = col === 'A' ? '#BBF7D0' : '#C7D2FE'

          return (
            <div
              key={col}
              className="rounded-3xl p-3 min-h-[90px]"
              style={{ background: colBg, border: `2.5px solid ${colBorder}`, boxShadow: `0 4px 0 ${colBorder}` }}
            >
              <p className="text-[13px] font-black mb-1" style={{ color: colAccent, fontFamily: 'Plus Jakarta Sans, system-ui' }}>
                {cfg.label}
              </p>
              <div className="flex flex-col gap-1">
                {/* Confirmed correct */}
                {cfm.map(c => (
                  <div
                    key={c.id}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-xl"
                    style={{ background: c.color, boxShadow: '0 2px 0 rgba(0,0,0,0.12)' }}
                  >
                    <CheckCircle size={10} color="rgba(0,0,0,0.45)" />
                    <span className="text-[11px] font-bold leading-tight" style={{ color: 'rgba(0,0,0,0.70)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
                      {c.label}
                    </span>
                  </div>
                ))}
                {/* Pending assigned — tappable to undo */}
                {pnd.map(c => {
                  const isWrong = wrongIds.has(c.id)
                  return (
                    <button
                      key={c.id}
                      onClick={() => unassign(c.id)}
                      disabled={isWrong}
                      className="flex items-center justify-between px-2 py-1.5 rounded-xl text-left transition-all"
                      style={{
                        background: isWrong ? '#FEE2E2' : c.color,
                        border: isWrong ? '1.5px solid #FCA5A5' : 'none',
                        boxShadow: isWrong ? 'none' : '0 2px 0 rgba(0,0,0,0.12)',
                        opacity: isWrong ? 0.8 : 1,
                      }}
                    >
                      <span className="text-[11px] font-bold leading-tight" style={{ color: isWrong ? '#B91C1C' : 'rgba(0,0,0,0.70)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
                        {c.label}
                      </span>
                      {!isWrong && <XCircle size={10} color="rgba(0,0,0,0.35)" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Current card + A/B buttons */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4">
        {currentCard ? (
          <>
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#9CA3AF', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
              {sortedCount} of {cards.length} sorted
            </p>

            {/* The card */}
            <div
              className="w-full max-w-xs rounded-3xl px-6 py-8 flex items-center justify-center"
              style={{
                background: currentCard.color,
                boxShadow: '0 4px 0 rgba(0,0,0,0.18), 0 8px 20px rgba(0,0,0,0.08)',
              }}
            >
              <p
                className="text-[18px] font-black text-center leading-snug"
                style={{ color: 'rgba(0,0,0,0.72)', fontFamily: 'Plus Jakarta Sans, system-ui' }}
              >
                {currentCard.label}
              </p>
            </div>

            {/* A / B tap buttons */}
            <div className="flex gap-3 w-full max-w-xs">
              <button
                onClick={() => assign('A')}
                className="flex-1 py-4 rounded-2xl text-[15px] font-black active:translate-y-1 transition-transform"
                style={{
                  background: '#F0FDF4',
                  color: '#14532D',
                  border: '2px solid #BBF7D0',
                  boxShadow: '0 4px 0 #86EFAC',
                  fontFamily: 'Plus Jakarta Sans, system-ui',
                }}
              >
                {config.columnA.label}
              </button>
              <button
                onClick={() => assign('B')}
                className="flex-1 py-4 rounded-2xl text-[15px] font-black active:translate-y-1 transition-transform"
                style={{
                  background: '#EEF2FF',
                  color: '#3730A3',
                  border: '2px solid #C7D2FE',
                  boxShadow: '0 4px 0 #A5B4FC',
                  fontFamily: 'Plus Jakarta Sans, system-ui',
                }}
              >
                {config.columnB.label}
              </button>
            </div>
          </>
        ) : (
          <p className="text-[15px] font-bold" style={{ color: '#78716C', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
            All sorted — ready to check!
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-4 flex gap-3" style={{ borderTop: '1px solid #E3DDD5' }}>
        <button
          onClick={handleHint}
          disabled={!currentCard}
          className="flex items-center gap-1.5 px-4 py-3 rounded-2xl text-[14px] font-bold disabled:opacity-40 active:translate-y-1 transition-transform"
          style={{ background: '#F0EEE9', color: '#78716C', border: '2px solid #E3DDD5', boxShadow: '0 4px 0 #D4CFC8', fontFamily: 'Plus Jakarta Sans, system-ui' }}
        >
          <HelpCircle size={18} />
          Hint
        </button>
        <button
          onClick={handleCheck}
          disabled={!allAssigned}
          className="flex-1 py-3 rounded-2xl text-[16px] font-black transition-all active:translate-y-1"
          style={{
            background: allAssigned ? '#1C1917' : '#E5E1DC',
            color: allAssigned ? '#FFFFFF' : '#A8A29E',
            fontFamily: 'Plus Jakarta Sans, system-ui',
            boxShadow: allAssigned ? '0 4px 0 #44403C' : '0 4px 0 #D4CFC8',
          }}
        >
          Check
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npm run lint
```

Expected: 0 errors.

- [ ] **Step 3: Manual check — golden path**

Run `npm run dev`, open Games → This or That.
- Should show the first card centered with two large tap buttons ("Stack" / "Queue")
- Tapping a button should move the card to that column's stack and show the next card
- Cards in the column stack should show an × and be tappable to undo (removes from column, re-queues)
- After all 10 cards are placed, "All sorted — ready to check!" message appears and Check button activates
- Tapping Check should validate: correct cards stay (green with ✓), wrong cards flash red and return to queue
- Completing all cards correctly shows GameWinScreen

- [ ] **Step 4: Manual check — hint path**

- Open a fresh game
- Tap Hint — current card should auto-assign to its correct column and move to next card
- Repeat 3× — should work for consecutive cards
- Hint button should be disabled when no `currentCard` (all sorted)

- [ ] **Step 5: Commit**

```bash
git add src/games/components/ThisOrThat.tsx
git commit -m "feat: replace ThisOrThat drag with one-at-a-time tap assign"
```

---

## Task 5: Production build verification

- [ ] **Step 1: Full build**

```bash
npm run build
```

Expected: exits with 0 errors. Dist folder produced.

- [ ] **Step 2: Preview**

```bash
npm run preview
```

Open all 4 games and do a quick smoke test:
- Knockout: VS badge centered between cards ✓
- Chrono: ↑↓ buttons appear on unlocked cards, disabled on locked/edges ✓
- Links: tap grid visible at bottom, no drag card ✓
- ThisOrThat: one card at a time with A/B buttons, no drag ✓

- [ ] **Step 3: Final commit if any stray changes**

```bash
git status
```

If clean, done. If any unstaged tweaks, commit them:

```bash
git add -p
git commit -m "chore: post-build cleanup"
```
