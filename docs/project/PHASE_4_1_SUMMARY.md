# Phase 4.1 Complete: Prediction MCQ + Regular MCQ Flow

**Status:** ✅ Core foundation built  
**Files Created:** 3  
**Files Modified:** 3  

---

## What Was Built

### New Components & Libraries

1. **`src/lib/prediction-generator.ts`**
   - `generatePredictionMCQ(concept)` — Creates prediction questions
   - Template-based generation with 3 fallback templates
   - Returns: `{ id, conceptId, question, options, correct, explanation }`

2. **`src/components/ConceptBrief.tsx`**
   - Shows concept metadata before prediction
   - Displays: name, subject badge, stage, stakes fact, tags
   - Primes learner context

3. **`src/screens/ConceptPrediction.tsx`**
   - Prediction MCQ screen
   - User selects answer before seeing main question
   - Tracks prediction time (ms)
   - Clean, focused UI with material design

### Modified Components

4. **`src/core/types.ts`** — Added to `SessionItem`:
   ```ts
   predictionMCQ?: { id, question, options, correct }
   predictionAccuracy?: boolean      // true if correct
   predictionTimeMs?: number         // time to predict
   ```

5. **`src/core/session-builder.ts`** — All session items now get prediction MCQs:
   - Imports `generatePredictionMCQ`
   - Adds `predictionMCQ` to every concept item
   - Works for all queues: review, new, strengthen, challenge

6. **`src/screens/LiveSession.tsx`** — Integrated prediction flow:
   - Added state: `showingPrediction`, `predictionAnswered`, `predictionTimeMs`
   - Handler: `handlePredictionAnswered()` tracks prediction accuracy
   - Conditional render: Show `ConceptPrediction` if prediction MCQ exists
   - Records prediction to `predictionErrorHistory` in FSRS

---

## Session Flow (Prediction → MCQ)

```
User starts session
    ↓
FSRS picks concept (e.g., "Linear Algebra")
    ↓
[Optional: ConceptBrief shown]
    ↓
[NEW] ConceptPrediction screen
    Question: "When would you use Linear Algebra?"
    User predicts → Time tracked → Accuracy stored
    ↓
[Main MCQ flow begins]
    Regular MCQs shown
    User answers with confidence
    FSRS updates stability/difficulty
    ↓
Next item OR SessionComplete
```

---

## Data Flow

### 1. Session Building
```ts
buildSession(config, 20, hour, fatigue)
  ↓
Creates 20 SessionItems with:
  - concept: Concept
  - queue: 'review' | 'new' | 'strengthen' | 'challenge'
  - predictionMCQ: { id, question, options, correct }
```

### 2. Prediction Phase
```ts
ConceptPrediction component:
  - Shows: concept brief + prediction question
  - User selects answer + confirms
  - onNext() called with (userChoice, predictionTime)
    ↓
handlePredictionAnswered():
  - Check: userChoice === predictionMCQ.correct
  - Store: predictionAccuracy, predictionTimeMs
  - Update concept's predictionErrorHistory
  - Flag for FSRS analysis
```

### 3. Main MCQ Phase
```ts
Regular MCQ flow continues:
  - User answers main question + confidence
  - FSRS updates: stage, stability, difficulty
  - Next question or completion
```

---

## Prediction Error Tracking

Predictions are recorded in `concept.predictionErrorHistory`:

```ts
predictionErrorHistory: [
  { date: 1714396800000, preTestWrong: true },  // Wrong prediction
  { date: 1714310400000, preTestWrong: false }, // Correct prediction
]
```

This enables:
- ✅ Identifying concepts where predictions fail (knowledge gaps)
- ✅ Learning science: Pre-testing effect size analysis
- ✅ Adaptive difficulty: Increase challenge for prediction failures
- ✅ Mistake tracking: Core learning loop requirement

---

## What's Next (Phase 4.2+)

**Phase 4.2: Quiz Integration** (Currently paused)
- Fetch additional MCQs from `quiz-content.ts`
- Show 2-3 MCQs per concept (different angles)
- Increase depth and practice

**Phase 4.3: Game Integration** (When ready)
- Map concepts → existing games
- Show game if available
- Skip game if no match (acceptable)

**Phase 4.4: Rich Feedback**
- Show why answer correct/incorrect
- Display related concepts
- Socratic follow-up questions

**Phase 4.5: Mistake Logging & FSRS**
- Track all mistakes, predict errors, confidence mismatches
- Adjust FSRS difficulty/stability
- Mark concepts for repetition

---

## Testing the Flow

**To test prediction MCQ:**

1. Start a session from Dashboard
2. First question will show ConceptPrediction screen
3. Make a prediction
4. See regular MCQ flow after

**Observable behaviors:**
- ✅ Prediction question shown before main MCQ
- ✅ Prediction time tracked (should be ~5-15 sec)
- ✅ After prediction, regular MCQ appears
- ✅ Prediction accuracy logged to browser console (optional: add toast)
- ✅ Session continues normally after prediction

---

## Code Quality

- ✅ TypeScript: Zero errors
- ✅ Type safety: All SessionItem fields properly typed
- ✅ Backwards compatible: Old sessions without predictionMCQ still work
- ✅ Performance: Prediction generation happens at build time (session-builder)
- ✅ Mobile responsive: ConceptBrief and ConceptPrediction use mobile-first layout

---

## Acceptance Criteria (Phase 4.1)

- ✅ Prediction MCQ generated for all concepts
- ✅ Prediction shown before main question
- ✅ Prediction accuracy tracked
- ✅ Prediction time measured
- ✅ Data stored in SessionItem
- ✅ Mobile responsive
- ✅ Zero TypeScript errors
- ✅ Ready for quiz + feedback integration
