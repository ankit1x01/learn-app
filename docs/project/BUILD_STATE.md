# BUILD STATE
> Update this at the end of every session.
> Last updated: 2026-04-11 — **M3 Expressive design system fully implemented**

---

## Material Design 3 Status ✅ COMPLETE

**All screens updated with M3 color tokens:**
- ✅ Core tokens in `src/index.css` (@theme block with all M3 colors/shapes/durations/elevations)
- ✅ DESIGN_SYSTEM.md rewritten (authoritative single source of truth)
- ✅ Motion presets in `src/lib/m3-motion.ts` (6 Framer Motion spring presets with M3 physics)
- ✅ BottomNav, ContentSheet, TierBadge, StatusBar (components fully M3-compliant)
- ✅ Dashboard, DemoSession, ChittaMap, ErrorDashboard (core screens M3-tokenized)
- ✅ TopicsBank, SessionComplete, CourseDashboard (mid-tier screens M3-tokenized)
- ✅ EliteHub, LiveSession, ConceptEncoding, MorningRecall (all major screens M3-tokenized)
- ✅ Global App.tsx background (var(--color-background))
- ✅ Primary color migrated: #2563EB (old blue) → #6750A4 (Focus Violet)
- ✅ All subject colors mapped to M3 tokens (Physics/Chemistry/Biology/CS)
- ✅ All stage colors updated (Automatic→success, Conscious→warning, Fragile→error, etc.)

**Production build**: ✅ ZERO errors, zero TypeScript errors, zero lint warnings

---

## Active Syllabus
`it_placement_india` — change in `src/syllabus/index.ts`

---

## Screens

| Screen | State | Location | Notes |
|---|---|---|---|
| Dashboard | ✅ DONE | App.tsx:202 | Chitta Score ring, mastery bars, time nudge, subject readiness |
| LiveSession | ✅ DONE | App.tsx:529 | MCQ + confidence widget + PRE-TEST badge + stakesFact |
| ConceptEncoding | ✅ DONE | App.tsx:841 | Encoding depth selector (×1.0/1.6/2.4) |
| ChittaMap | ✅ DONE | App.tsx:985 | Concept network visualization |
| MorningRecall | ✅ DONE | App.tsx:1138 | Uses getMorningRecallSet; falls back to isDue |
| SessionComplete | ✅ DONE | App.tsx:1221 | Post-session stats |
| EliteHub | ✅ DONE | screens/EliteHub.tsx | Hub for advanced modes |
| GhanaPatha | ✅ DONE | screens/GhanaPatha.tsx | 15s timer, Automatic/ExamReady only |
| StressMode | ✅ DONE | screens/StressMode.tsx | Random timer, all non-Unseen |
| DistractorTraining | ✅ DONE | screens/DistractorTraining.tsx | Hard-coded distractor bank |
| ErrorDashboard | ✅ DONE | screens/ErrorDashboard.tsx | Cluster analysis from difficulty scores |
| MockTest | ✅ DONE | screens/MockTest.tsx | 45min, 10 problems |
| PreExamProtocol | ✅ DONE | screens/PreExamProtocol.tsx | Day-of-exam checklist |
| TopicsBank | ✅ DONE | screens/TopicsBank.tsx | Search + notes + images |
| KoshaCheck | ⏳ NOT BUILT | — | Pre-session 5-tap state check |
| NididhyasanamPause | ⏳ NOT BUILT | — | 60s rest screen after 5 new concepts |
| MananamPhase | ⏳ NOT BUILT | — | 3 forced questions after ConceptEncoding |
| NetiAnalysis | ⏳ NOT BUILT | — | Post-error elimination overlay |
| TeachBack | ⏳ NOT BUILT | — | Conscious→Automatic gate, LLM-graded |

---

## Core Engine

| File | State | What's inside |
|---|---|---|
| types.ts | ✅ DONE | All types including 9 neuroscience field groups |
| fsrs.ts | ✅ DONE | FSRS + encoding multiplier + prediction error |
| metacognition.ts | ✅ DONE | EWMA calibration + fatigue detection |
| scheduler.ts | ✅ DONE | Time-of-day (6 bands) + RIF + morning/presleep sets |
| session-builder.ts | ✅ DONE | Full session build with all layers |
| samskara.ts | ⏳ NOT BUILT | Composite groove depth score |

---

## Neuroscience Layers

| Layer | Engine | Wired in UI | Gap |
|---|---|---|---|
| 1 Encoding Depth | ✅ | ✅ ConceptEncoding | encodingDepth not persisted to DB |
| 2 Metacognition | ✅ | ✅ confidence widget shown | updateMetacogAccuracy NEVER CALLED |
| 3 Prediction Error | ✅ | ✅ PRE-TEST badge | bonus not applied when recording answer |
| 4 Time of Day | ✅ | ✅ dashboard nudge | 4–6 AM Brahma Muhurta band missing |
| 5 Synaptic Tagging | ✅ | — engine only | working silently |
| 6 RIF | ✅ | — engine only | working silently |
| 7 Sleep Recall | ✅ | ✅ MorningRecall | lastStudiedAt never set → always falls back |
| 8 Cognitive Load | ✅ | ✅ responseTimeMs tracked | detectCognitiveFatigue NEVER CALLED |
| 9 Emotional Tagging | ✅ | ✅ stakesFact in LiveSession | working |

---

## Data

| Dataset | State | Details |
|---|---|---|
| DSA concepts | ✅ ENRICHED | 454 concepts, all stakesTier set |
| IT Placement concepts | ✅ ENRICHED | 271 concepts, all stakesTier set |
| stakesFact | ✅ | 102 concepts |
| relatedIds | ✅ | 88 concepts |
| competingIds + interferenceScore | ✅ | 42 concepts |

---

## Storage / Persistence

| What | Persisted | Not Persisted |
|---|---|---|
| stage, stability, difficulty, lastTested, queue | ✅ Capacitor Preferences | — |
| encodingDepth | ❌ LOST ON REFRESH | needs store.ts update |
| metacogAccuracy, overconfidenceFlag | ❌ LOST ON REFRESH | needs store.ts update |
| predictionErrorHistory | ❌ LOST ON REFRESH | needs store.ts update |
| lastStudiedAt | ❌ LOST ON REFRESH | needs store.ts update |
| relatedIds, competingIds, interferenceScore | — static data, no need to persist | — |
| User notes | ✅ Capacitor Preferences | — |
| Images | ✅ Capacitor Filesystem | — |

---

## What Works End-to-End Right Now

```
Dashboard → LiveSession (confidence tap → options → answer)
         → ConceptEncoding (depth selector → saves stability)
         → ChittaMap
         → MorningRecall (usually falls back to isDue, not true morning set)
         → SessionComplete

EliteHub → GhanaPatha (fully working, 15s timer, ExamReady progression)
         → StressMode (fully working, random timer)
         → DistractorTraining (fully working, static bank)
         → ErrorDashboard (fully working, derived from difficulty)
         → MockTest (fully working, 45min simulation)
         → PreExamProtocol (fully working)

TopicsBank → search + notes + images (fully working)
```

---

## What Does NOT Work Yet

1. **Neuroscience field persistence** — encodingDepth, metacogAccuracy, lastStudiedAt lost on refresh
2. **Confidence calibration update** — widget shows but updateMetacogAccuracy never called
3. **Fatigue detection** — responseTimeMs tracked but never fed to detectCognitiveFatigue
4. **Prediction error bonus** — PRE-TEST badge shown but +50% stability never applied
5. **Pre-sleep review** — getPreSleepReviewSet exists, no UI entry point
6. **4–6 AM Brahma Muhurta window** — scheduler starts at 6 AM
7. **Streak count** — hardcoded to 7 in Dashboard
8. **All Vedic screens** — KoshaCheck, Nididhyasanam, MananamPhase, NetiAnalysis, TeachBack not built

---

## Next Session: Pick Up Here

**Priority 1 — Fix the data loss bug first (30min)**
File: `src/db/store.ts` + `src/db/useConceptStore.ts`
Add these fields to `ConceptState` and save/load them:
- encodingDepth, metacogAccuracy, overconfidenceFlag, lastStudiedAt

**Priority 2 — Wire metacognition (30min)**
File: `src/App.tsx` (handleNext in LiveSession)
Call `updateMetacogAccuracy(concept, confidence, wasCorrect)` when answer confirmed
Save result via onUpdateConcept

**Priority 3 — Wire fatigue detection (30min)**
File: `src/App.tsx` (buildSession call)
Collect responseTimeMs history, call detectCognitiveFatigue, pass fatigueLevel to buildSession

**Then continue Vedic 2-week plan** — see `docs/VEDIC_2WEEK_PLAN.md`
