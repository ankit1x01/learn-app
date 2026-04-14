# CHITTA — Remaining Tasks
> Last updated: 2026-04-12

---

## ✅ Done This Session

| # | Task | File |
|---|------|------|
| 1 | Wire FSRS ratings → `onUpdateConcept` in `handleNext` | `LiveSession.tsx` |
| 2 | Layer 2 — `updateMetacogAccuracy` + `detectOverconfidence` called on every answer | `LiveSession.tsx` |
| 3 | Layer 3 — Prediction error bonus (+50% stability) applied on correct after prior failure | `LiveSession.tsx` |
| 4 | Layer 3 — `predictionErrorHistory` updated for pre-test items | `LiveSession.tsx` |
| 5 | `lastStudiedAt` set on every answer (fixes MorningRecall fallback) | `LiveSession.tsx` |
| 6 | `nextReview` and `lastTested` updated on every answer | `LiveSession.tsx` |

---

## 🔴 Critical Bugs (fix before new features)

### BUG-001 — Neuroscience fields still lost on refresh
**File:** `src/db/useConceptStore.ts`
**Problem:** `ConceptState` in `store.ts` has the fields, but `useConceptStore` merge block does not load/merge `encodingDepth` from DB on mount. The `saveConceptState` call in `onUpdateConcept` does save them (fields are in `ConceptState` interface) — but the `loadConceptStates` merge in `useEffect` only reads the 5 base fields.
**Fix:** Verify the merge block in `useConceptStore.ts` (lines 42–47) correctly picks up `encodingDepth` from `saved`. It does use spread — confirm all fields are in `ConceptState` and being set.
**Status:** Partially fixed — `store.ts` has the fields; double-check merge in `useConceptStore.ts`.

### BUG-004 — `detectCognitiveFatigue` never called
**File:** `src/screens/LiveSession.tsx`
**Problem:** `responseTimeMs` is tracked per-question but never accumulated into a history array. `detectCognitiveFatigue` and `getAdaptiveSessionLength` are imported but never called. Session length never adapts.
**Fix:**
1. Collect answered items with their `responseTimeMs` into a ref array inside `LiveSession`.
2. After each answer, call `detectCognitiveFatigue(answeredItems)` → get `fatigueLevel`.
3. Show a fatigue warning banner when `fatigueLevel === 'fatigued'`.
4. (Optional) pass `fatigueLevel` back to `App.tsx` to shorten next session.

### BUG-006 — Streak count hardcoded to 7
**File:** `src/screens/Dashboard.tsx`
**Problem:** Streak badge always shows "7 day streak". Not real data.
**Fix:** Store daily session timestamps in Capacitor Preferences. Compute consecutive days from today backwards.

### BUG-008 — `daysRemaining` hardcoded in config
**File:** `src/data/itplacement/config.ts` (line 29)
**Problem:** `daysRemaining: 113` goes stale every day.
**Fix:** Compute from `examDate`:
```ts
daysRemaining: Math.ceil((new Date('2026-08-01').getTime() - Date.now()) / 86_400_000),
```

---

## 🟡 Missing Features (core product)

### FEAT-001 — FSRS 4.5 full implementation
**File:** `src/core/fsrs-v45.ts` (create new)
**What:** Replace simplified FSRS with the 17-parameter FSRS 4.5 model.
- `w` vector (17 weights, default Anki values)
- `D₀(G)` initial difficulty from first grade
- Full `D'`, `S'`, `R` formulas per spec
- `fsrs45_schedule(concept, grade)` → `{ newD, newS, nextReview }`
**Why:** Current model is a simplified approximation. FSRS 4.5 is calibrated on 20M+ reviews.

### FEAT-002 — MCQ support (architecture)
**File:** `src/core/types.ts`, `src/screens/LiveSession.tsx`
**What:** Add `MCQ` and `ConceptContent` interfaces. Wire a conditional MCQ display branch in `LiveSession` (no content yet — show self-assessment for non-MCQ concepts).
```ts
interface MCQ {
  question: string;
  options:  [string, string, string, string];
  correct:  0 | 1 | 2 | 3;
  explanation: string;
}
interface ConceptContent {
  mcq?: MCQ;
  theory?: string;
}
```

### FEAT-003 — Pre-sleep review entry point
**File:** `src/screens/Dashboard.tsx`
**What:** Show a "Pre-Sleep Review" card between 20:00–23:00 that calls `getPreSleepReviewSet(concepts)` and navigates to a filtered session.
**Why:** `getPreSleepReviewSet` exists in `scheduler.ts` but has no UI trigger. Layer 7 NREM consolidation is unused.

### FEAT-004 — 4–6 AM Brahma Muhurta session band
**File:** `src/core/scheduler.ts`
**What:** Add time band `[4, 6]` with composition `{ new: 0.5, review: 0.3, strengthen: 0.2, challenge: 0 }` (peak neuroplasticity window).
**Current:** Earliest band starts at 6 AM.

---

## 🟢 Vedic Screens (new builds)

### SCREEN-001 — KoshaCheck
Pre-session 5-tap mental state check (Physical / Emotional / Energy / Focus / Clarity).
Maps state → session mode recommendation.

### SCREEN-002 — NididhyasanamPause
60-second eyes-closed rest screen after every 5 new concepts.
Triggers BDNF protein synthesis window (post-novelty rest).

### SCREEN-003 — MananamPhase
3 forced recall questions immediately after `ConceptEncoding`.
Tests: "Explain in own words / Find one real-world use / What would confuse a classmate?"

### SCREEN-004 — NetiAnalysis
Post-error elimination overlay: after a wrong answer, show 2 similar concepts and ask which one this is NOT.
Trains discrimination, reduces interference.

### SCREEN-005 — TeachBack
Conscious→Automatic gate. Student types explanation, Gemini grades it (0–100).
If score ≥ 80 → stage advances to Automatic.

---

## 📦 Infrastructure

### INFRA-001 — Dynamic `daysRemaining` in config
Computed, not hardcoded. (See BUG-008 above.)

### INFRA-002 — Streak tracking
Persist daily session timestamps, compute real streak. (See BUG-006 above.)

### INFRA-003 — Code-split large bundle
**Problem:** `index.js` is 1,159 kB. Vite warns on every build.
**Fix:** Dynamic `import()` for heavy screens (MockTest, DistractorTraining, ErrorDashboard, TopicsBank).

---

## 🗂️ Order of Attack (suggested)

```
1. BUG-008  daysRemaining computed          (5 min, 1 line)
2. BUG-004  fatigue detection wired         (30 min)
3. BUG-006  streak count real               (45 min)
4. FEAT-003 pre-sleep review entry          (30 min)
5. FEAT-004 Brahma Muhurta band             (10 min)
6. FEAT-002 MCQ architecture                (45 min)
7. FEAT-001 FSRS 4.5                        (2–3 hr)
8. SCREEN-001 KoshaCheck                    (1 hr)
9. SCREEN-002 NididhyasanamPause            (45 min)
10. SCREEN-003 MananamPhase                 (1 hr)
11. SCREEN-004 NetiAnalysis                 (1 hr)
12. SCREEN-005 TeachBack + Gemini grading   (2 hr)
13. INFRA-003 bundle splitting              (1 hr)
```
