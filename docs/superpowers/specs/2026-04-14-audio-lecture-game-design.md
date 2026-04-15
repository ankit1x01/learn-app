# Audio Lecture Game — Design Spec

**Date:** 2026-04-14
**Status:** Approved

---

## Overview

A 4-phase audio comprehension game inspired by Elevate's Retention + Synthesis games. Pre-authored passages are read aloud via browser TTS (Web Speech API). The user engages actively during audio (drag-to-fill blanks) and answers MCQ questions after. Integrated as a 7th game tile in the existing GamesScreen.

---

## Game Flow

```
Intro → Active Listening → Post-Audio Q&A → Result
```

### Phase 1 — Intro
- Dark gradient background card
- Lecture title displayed prominently at top
- 3 concept bubbles animate in one-by-one (scale + fade, 300ms stagger)
- Subtitle: "Listen carefully — you'll fill in the blanks"
- Full-width **Play** button at bottom
- Tapping Play transitions to Phase 2

### Phase 2 — Active Listening
- Audio plays via `window.speechSynthesis` at rate 0.85
- Passage text displayed with blank pill slots inline (3–4 blanks)
- Word chips row at bottom: correct answers + 2 distractors, shuffled
- **Drag mechanic**: `onPointerDown` on chip, track position, `onPointerUp` checks overlap with blank slot via `getBoundingClientRect()`
- Correct drop → slot fills green, chip locks in place
- Wrong drop → slot shakes red, chip snaps back
- Progress bar at top tracks audio duration (estimated from word count × avg word ms)
- Audio continues playing during drag interaction
- Phase ends when audio finishes (all blanks need not be filled — score partial credit)

### Phase 3 — Post-Audio Q&A
- 3 MCQ questions shown one at a time
- 4 tap options per question in a 2×2 grid
- Correct → green highlight, auto-advance after 800ms
- Wrong → red highlight, correct answer shown in green, auto-advance after 1200ms
- Round dots indicator at top (●●○ etc.)

### Phase 4 — Result
- Reuses existing `GameWinScreen` component
- Score formula:
  - Blanks score = (correct blanks / total blanks) × 50
  - MCQ score = (correct MCQs / total MCQs) × 50
  - Final = blanks score + MCQ score (0–100)

---

## Data Model

### Type definition (`src/games/types.ts`)

```typescript
export interface AudioLectureConfig extends GameBase {
  type: 'audio-lecture'
  title: string
  concepts: [string, string, string]   // 3 intro bubbles
  passage: string                       // full text TTS reads aloud
  displayPassage: string                // same text with ___ for blanks
  blanks: Array<{
    id: string
    answer: string                      // exact word/phrase that fills this blank
  }>
  // IMPORTANT: order of ___ in displayPassage maps 1:1 to blanks array by index
  chips: string[]                       // draggable chips (answers + 2 distractors); shuffled at runtime in the component
  questions: Array<{
    id: string
    prompt: string
    options: [string, string, string, string]
    answer: string
  }>
}
```

`AudioLectureConfig` is added to the `GameConfig` union type.

### Example data (`src/games/data/dsa-dummy.ts`)

```typescript
export const dsaAudioLecture: AudioLectureConfig = {
  type: 'audio-lecture',
  theme: 'Sorting Algorithm History',
  subject: 'DSA',
  title: 'History of Sorting',
  concepts: ['Merge Sort', 'Quicksort', 'Timsort'],
  passage:
    'In 1945, John von Neumann invented Merge Sort as part of his work on early computers. ' +
    'In 1959, Tony Hoare invented Quicksort at age 25 — it remains the fastest in practice. ' +
    'In 2002, Tim Peters created Timsort, a hybrid algorithm now used in Python and Java.',
  displayPassage:
    'In ___, John von Neumann invented ___ as part of his work on early computers. ' +
    'In 1959, Tony Hoare invented Quicksort at age 25 — it remains the fastest in practice. ' +
    'In 2002, Tim Peters created ___, a hybrid algorithm now used in Python and Java.',
  blanks: [
    { id: 'b1', answer: '1945' },
    { id: 'b2', answer: 'Merge Sort' },
    { id: 'b3', answer: 'Timsort' },
  ],
  chips: ['1945', 'Merge Sort', 'Timsort', '1964', 'Heapsort'],
  questions: [
    {
      id: 'q1',
      prompt: 'Who invented Quicksort?',
      options: ['Tony Hoare', 'Von Neumann', 'Tim Peters', 'J.W.J. Williams'],
      answer: 'Tony Hoare',
    },
    {
      id: 'q2',
      prompt: 'Which language uses Timsort for sorting objects?',
      options: ['Python', 'C', 'Rust', 'Go'],
      answer: 'Python',
    },
    {
      id: 'q3',
      prompt: 'What year was Merge Sort invented?',
      options: ['1945', '1959', '1964', '2002'],
      answer: '1945',
    },
  ],
}
```

---

## Component Architecture

### New file
**`src/games/components/AudioLectureGame.tsx`**
- Root component: `AudioLectureGame({ config })`
- 3 inline sub-components:
  - `IntroPhase` — animated bubbles + Play button
  - `ListeningPhase` — TTS + drag-to-blank UI
  - `QuizPhase` — MCQ one-at-a-time

### Modified files
| File | Change |
|---|---|
| `src/games/types.ts` | Add `AudioLectureConfig`, add to `GameConfig` union |
| `src/games/GameRunner.tsx` | Add `case 'audio-lecture': return <AudioLectureGame config={config} />` |
| `src/games/GamesScreen.tsx` | Add 7th tile: label "Lecture", icon `Headphones`, bg `#6366F1` (indigo), add `Tab` + `CONFIGS` entry |
| `src/games/data/dsa-dummy.ts` | Add `dsaAudioLecture` export |

---

## TTS Implementation

```typescript
// Start audio
const utterance = new SpeechSynthesisUtterance(config.passage)
utterance.rate = 0.85
utterance.onend = () => setPhase('quiz')
window.speechSynthesis.speak(utterance)

// Cleanup on unmount
return () => window.speechSynthesis.cancel()
```

**Progress bar estimation:**
- `durationMs = passage.split(' ').length × 350` (avg ~350ms/word at rate 0.85)
- Animate a `motion.div` from width 100% → 0% over `durationMs` milliseconds
- Same pattern as RetentionGame's ShowPhase countdown bar

---

## Drag Mechanic (ListeningPhase)

```
State:
  blanks: Record<blankId, string | null>   // filled answers
  dragging: { chipId: string; x: number; y: number } | null

Refs:
  slotRefs: Record<blankId, RefObject<HTMLElement>>

onPointerDown(chipId) → set dragging
onPointerMove → update dragging x/y
onPointerUp → 
  find slot whose getBoundingClientRect() contains pointer
  if found and blank not already filled:
    if chip === blank.answer → fill, haptic light
    else → shake slot, return chip, haptic medium
  else → return chip
```

Chips already locked in a slot are hidden from the chips row. Each blank slot renders either the placeholder `___` or the filled chip label.

---

## Scoring

```typescript
const blanksScore = Math.round((correctBlanks / config.blanks.length) * 50)
const mcqScore    = Math.round((correctMCQ    / config.questions.length) * 50)
const total       = blanksScore + mcqScore  // 0–100
```

Passed to `GameWinScreen` via `GameResult`:
```typescript
{
  gameType: 'audio-lecture',
  score: total,
  guesses: totalTaps,
  hintsUsed: 0,
  timeMs: 0,
}
```

---

## Visual Design

- **Intro**: `bg: #1E1B4B` (dark indigo) gradient to `#312E81`, white text
- **Listening**: `bg: #F7F6F3` (matches app warm off-white), inline blank slots styled as pill borders `#6366F1`
- **Quiz**: Same warm off-white, 2×2 option grid with `#E8E5DF` borders, teal correct / red wrong
- **Tile**: `bg: '#6366F1'`, `textDark: '#1E1B4B'`, `foldColor: 'rgba(0,0,0,0.13)'`
- Icon: `Headphones` from lucide-react
