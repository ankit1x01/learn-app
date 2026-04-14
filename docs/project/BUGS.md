# BUGS
> Fix before building new features. One bug fixed > one feature added.

---

## 🔴 Critical (data loss / broken core flow)

### BUG-001 — Neuroscience fields not persisted to DB
**File:** `src/db/store.ts`, `src/db/useConceptStore.ts`
**Problem:** `ConceptState` in store.ts only saves: `stage, stability, difficulty, lastTested, queue`.
All neuroscience fields lost on refresh: `encodingDepth, metacogAccuracy, overconfidenceFlag, predictionErrorHistory, lastStudiedAt`.
**Fix:** Add fields to `ConceptState`, add to save/load functions, merge in `useConceptStore`.
**Impact:** Encoding depth selection in ConceptEncoding has zero lasting effect.

### BUG-002 — updateMetacogAccuracy never called
**File:** `src/App.tsx` (LiveSession handleNext / answer confirmation)
**Problem:** Confidence widget is shown and confidence state is tracked but `updateMetacogAccuracy(concept, confidence, wasCorrect)` is never called. Layer 2 has zero effect on concept data.
**Fix:** After answer confirmed, call `updateMetacogAccuracy`, save via `onUpdateConcept`.
**Depends on:** BUG-001 fixed first (otherwise update is saved but lost on refresh)

### BUG-003 — Prediction error bonus never applied
**File:** `src/App.tsx` (LiveSession answer handling)
**Problem:** Items are marked `isPreTest: true` in session-builder and the PRE-TEST badge renders, but `getPredictionErrorMultiplier` is never called when recording stability updates.
**Fix:** When recording a correct answer on a concept with prior `predictionErrorHistory` entry (preTestWrong=true), multiply stability boost by 1.5.

### BUG-004 — detectCognitiveFatigue never called
**File:** `src/App.tsx` (session build, or LiveSession)
**Problem:** `responseTimeMs` is tracked per question in LiveSession state but never collected or passed to `detectCognitiveFatigue`. `getAdaptiveSessionLength` is never called. Session length never adapts to fatigue.
**Fix:** Collect responseTimeMs from answered items → call detectCognitiveFatigue → pass fatigueLevel to buildSession.

### BUG-005 — lastStudiedAt never set
**File:** `src/App.tsx` (any answer confirmation)
**Problem:** `getMorningRecallSet` filters on `lastStudiedAt` (must be 6–14h ago). Since `lastStudiedAt` is never set, MorningRecall always falls back to the isDue set. Layer 7 sleep replay pathway is never triggered.
**Fix:** Set `lastStudiedAt: Date.now()` in `onUpdateConcept` call when recording an answer.
**Depends on:** BUG-001 (needs to persist)

---

## 🟡 Minor (wrong data / stale UI)

### BUG-006 — Streak count hardcoded
**File:** `src/App.tsx:241`
**Problem:** Streak badge always shows "7". Not derived from actual usage data.
**Fix:** Track last-session timestamps in Capacitor Preferences. Compute consecutive days.

### BUG-007 — getPreSleepReviewSet has no entry point
**File:** `src/core/scheduler.ts` (function exists, never called)
**Problem:** Pre-sleep review set function correctly identifies high-stakes Fragile/Conscious concepts for NREM seeding, but there's no screen or navigation path that calls it.
**Fix:** Add "Pre-Sleep Review" mode to Dashboard (show between 20:00–22:00 only) or MorningRecall.

### BUG-008 — daysRemaining hardcoded in config
**File:** `src/syllabus/dsa/config.ts:17`, `src/syllabus/itplacement/config.ts`
**Problem:** `daysRemaining: 178` is a static value baked into config. Goes stale immediately.
**Fix:** Compute from `examDate`: `Math.ceil((new Date(examDate).getTime() - Date.now()) / 86400000)`.

---

## ✅ Fixed

| Bug | Fixed | Description |
|---|---|---|
| Options div flex-1 empty space | 2026-04-09 | `hidden` class instead of `opacity-0 pointer-events-none flex-1` |
| Unused allConcepts param in pairRelatedConcepts | 2026-04-09 | Removed param + unused Concept import |
| Missing updateStabilityWithPredictionError | 2026-04-09 | Added named function to fsrs.ts per plan spec |

---

## How to Add a Bug

```md
### BUG-XXX — Short title
**File:** path/to/file.ts:lineNumber
**Problem:** What is wrong. What the user sees or what breaks.
**Fix:** Exactly what needs to change.
**Depends on:** Any other bugs that must be fixed first.
```
