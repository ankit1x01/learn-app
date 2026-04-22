# BUILD STATE
> Update this at the end of every session.
> Last updated: 2026-04-22 — **Physics simulation review + SelfInductance syntax fix**

---

## Material Design 3 Status ✅ COMPLETE

**All screens updated with M3 color tokens:**
- ✅ Core tokens in `src/index.css` (@theme block with all M3 colors/shapes/durations/elevations)
- ✅ Shape scale fixed: radius-m3-xl 20px (was 28), radius-m3-2xl 32px (was 48)
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

**M3 Expressive Abstract Shapes:**
- ✅ `src/components/M3Shapes.tsx` with 16 shape components (blob, clover, flower, star, diamond, heart, arch, wave, pill, triangle, circle, 2.5D layered, etc.)
- ✅ `ShapePlaced()` utility for corner positioning + animation support
- ✅ Dashboard integration:
  - Mastery Ring Card: blob (top-left, 8% opacity) + flower (bottom-right, 8% opacity)
  - Exam Readiness Card: clover (bottom-left, 10% opacity, animated)
  - Time-of-Day Nudge: star (bottom-right, 15% opacity, rotating)
- ✅ All shapes use M3 colors with low opacity for subtle visual expression
- ✅ Framer Motion animations: pulsing blobs, rotating stars, floating 2.5D layers

**Production build**: ✅ ZERO errors, zero TypeScript errors, zero lint warnings

---

## Dashboard UX Improvements ✅ COMPLETE

**High-priority design fixes (all 6 implemented):**

1. **Section reorganization** - Move Today's Session after stat pills
   - ✅ Better visual hierarchy
   - ✅ Primary CTA visible without scrolling
   - ✅ New order: Header → Pills → Session → Mastery → Exam → Time → Demo → Games → Courses → Progress

2. **Interactive stat pills** - Convert to buttons with selection state
   - ✅ Clickable with visual feedback (border highlight on active)
   - ✅ Show contextual help messages for empty states
   - ✅ Added selectedPill state tracking
   - ✅ Empty state messages:
     - "Start your first session to earn mastery"
     - "Complete 2 more sessions to learn" 
     - "No concepts due for review yet"

3. **M3 Surface container hierarchy** - Replace flat white backgrounds
   - ✅ Today's Session: surface-container-low (elevated, prominent)
   - ✅ Mastery Ring: surface-lowest (recessed)
   - ✅ Exam Readiness: surface-lowest (recessed)
   - ✅ My Courses: surface-container (neutral)
   - ✅ Subject Progress: surface-container-high (separated)
   - ✅ Creates visual depth without shadows per M3 spec

4. **Exam progress visualization** - Add circular progress ring
   - ✅ SVG circle showing 8/40 with animated stroke
   - ✅ Context messages:
     - "32 more to goal" when below target
     - "✓ Target reached!" when at/above target
   - ✅ Uses M3 success color (green #146C2E)
   - ✅ Replaces text-only display with visual progress

5. **Standardize spacing** - Consistent padding across all cards
   - ✅ All major cards now use p-5 (20px)
   - ✅ Improves visual rhythm and hierarchy

6. **Enhanced messaging** - Contextual copy for empty states
   - ✅ Show hints when pills selected
   - ✅ "2 patterns queued" vs. "No patterns queued. Start fresh?"
   - ✅ Semantic language for action items

**Dashboard shapes and hover interactions (all complete):**
- ✅ How to Learn Anything: flower (top-right, 8%)
- ✅ Subject course buttons: rotated shape cycle (diamond/pill/arch/wave/triangle), subject color at 10% opacity
- ✅ Subject Progress rows: rotated shape cycle (star/triangle/pill/wave/arch), primary color 8% opacity
- ✅ Hover feedback: all cards now have hover:shadow-md hover:-translate-y-1 transition-all
- ✅ Demo Session Banner: interactive hover effects
- ✅ Daily Games button: interactive hover effects
- ✅ All implementations use M3 spring presets for smooth animations

**Premium visual polish (Session 2 - Super Kalam Design Standard):**
- ✅ **Stat pills**: Ripple effect on hover, icon badges (🏆📚⏰), enhanced shadows/glows
- ✅ **Card elevation**: Inset shadows (top highlight) + drop shadows for depth
- ✅ **Gradient overlays**: Success/primary colors at low opacity on all major cards
- ✅ **Start Session button**: Shine effect on hover, smoother shadow transitions
- ✅ **Mastery Ring SVG**: Animated stroke dasharray with stagger delays, motion number reveal
- ✅ **Time-of-Day Nudge**: 
  - Gradient background (success/primary color based on time)
  - Rotating clock icon (360° animation, 20s duration)
  - Enhanced messaging: "💡 Pro tip:" + contextual learning advice
  - Better visual prominence: 1.5px border, stronger shadow
- ✅ **Exam Readiness**: Icon animations on hover, gradient background, improved shadows
- ✅ **All button interactions**: Smooth -translate-y-1 on hover for lifting effect
- ✅ **Spring preset consistency**: All entrance animations use m3SpatialDefault with stagger

**Global loading state management:**
- ✅ `LoadingIndicator` component (sm/md/lg, fullscreen mode, M3 spring animations)
- ✅ `ProgressBar` component (linear/indeterminate modes, sm/md sizes)
- ✅ `LoadingContext` with React Context API (global state, no prop drilling)
- ✅ `LoadingProvider` wrapping entire App.tsx (automatic overlay rendering)
- ✅ Support for progress updates and custom messages
- ✅ M3-compliant colors (primary spinner, on-surface track)
- ✅ Integration examples for all screen types
- ✅ Type-safe configuration (LoadingState interface)

**Usage patterns documented:**
- Pattern 1: Fullscreen spinner for modal operations (< 3 sec)
- Pattern 2: Progress bar for long operations (with percentage)
- Pattern 3: Indeterminate spinner for unknown-duration tasks
- Pattern 4: Batch operations with streaming progress
- Pattern 5: Error handling with automatic cleanup

**Ready for integration in:**
- Dashboard session builder (progress bar)
- LiveSession answer submission (fullscreen spinner)
- ConceptEncoding depth changes (quick spinner)
- TopicsBank data loading (fullscreen spinner)
- SessionComplete multi-phase analysis
- Any async operation across the app

## Topics Screen Hierarchy ✅ COMPLETE

**3-level drill-down: Exam → Subject → Topics**
- ✅ Level 1: Exam picker — 6 exam cards, DSA FAANG + IT Placement tappable, others "Coming Soon"
- ✅ Level 2: Subject picker — reads from SYLLABUS_REGISTRY
- ✅ Level 3: Topic bank — groups → topics → problems + resources, search, tier filter, read/unread
- ✅ Adapter pattern: `src/data/topic-banks/` — add new exams by creating an adapter
- ✅ M3 Expressive slide transitions, Material Symbols Rounded icons, M3 color tokens
- ✅ TopicsBank.tsx kept (no longer routed — can be removed in future cleanup)

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
- Improved AI Engineer Course via Job Ad Deep Research (2026 Trends)
