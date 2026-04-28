# BUGS
> Fix before building new features. One bug fixed > one feature added.

---

## 🔴 Critical (data loss / broken core flow)



## ✅ Fixed

| Bug | Fixed | Description |
|---|---|---|
| BUG-007 — getPreSleepReviewSet has no entry point | 2026-04-28 | Fully implemented PreSleepReview screen with FSRS updates. |
| BUG-004 — detectCognitiveFatigue never called | 2026-04-19 | Evaluates fatigue live in session loop and truncates adaptive session length. |
| BUG-006 — Streak count hardcoded | 2026-04-19 | Moved streak into `store.ts` tracking `firstLogin` against Capacitor Preferences. |
| BUG-008 — daysRemaining hardcoded | 2026-04-19 | Computed dynamically from `CONFIG.examDate` in `Dashboard.tsx`. |
| BUG-001 — Neuroscience fields not persisted | 2026-04-18 | Added fields to `ConceptState` and `useConceptStore`. |
| BUG-002 — updateMetacogAccuracy never called | 2026-04-18 | Triggered internally in `LiveSession.tsx` and tracked locally. |
| BUG-003 — Prediction error bonus never applied | 2026-04-18 | Fired successfully within `onUpdateConcept` payload checks. |
| BUG-005 — lastStudiedAt never set | 2026-04-18 | Native fix merged natively. |
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
