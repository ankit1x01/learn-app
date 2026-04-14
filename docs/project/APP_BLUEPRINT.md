# CHITTA — App Blueprint
> Single source of truth. Read this at the start of every session.
> Updated: 2026-04-11

---

## What This App Is

**CHITTA** — AI-powered learning engine for competitive exam prep.
Built on FSRS spaced repetition + 9 neuroscience layers + 10 Vedic learning techniques.
Currently configured for: **DSA/FAANG interviews + IT Placement (India)**.
Architecture is exam-agnostic — swap `src/syllabus/index.ts` to run any exam.

---

## Tech Stack

| Layer | What |
|---|---|
| UI | React 19 + TypeScript, Vite, Tailwind CSS 4, Motion (framer) |
| AI | Google Gemini API via `@google/genai` (key injected at build via Vite define) |
| Storage | Capacitor Preferences (key-value) + Capacitor Filesystem (images) — 100% offline |
| Platform | Mobile-first SPA, runs in browser + Capacitor Android/iOS |
| No backend | All logic runs client-side |

---

## File Structure

```
src/
  App.tsx                    ← All core screens + main app state (1400 lines)
  main.tsx                   ← Entry point
  index.css                  ← Dark theme, glass-card, CSS vars

  core/                      ← Pure engine — no React, no UI
    types.ts                 ← All types (Concept, SessionItem, SyllabusConfig, etc.)
    fsrs.ts                  ← FSRS algorithm + neuroscience multipliers
    metacognition.ts         ← Confidence calibration + fatigue detection
    scheduler.ts             ← Time-of-day, RIF, morning recall, forgetting curve
    session-builder.ts       ← Builds sessions from concept pool
    index.ts                 ← Re-exports everything from core/

  db/
    store.ts                 ← Capacitor persistence (load/save concept states)
    useConceptStore.ts       ← React hook — merges DB state with static concepts

  screens/                   ← Standalone screen components
    EliteHub.tsx             ← Hub for advanced practice modes
    GhanaPatha.tsx           ← 15s hard-cutoff recall (Automatic/ExamReady only)
    StressMode.tsx           ← Random timer, auto-submit, pressure simulation
    DistractorTraining.tsx   ← Wrong-option elimination practice
    ErrorDashboard.tsx       ← Error cluster analysis by chapter
    MockTest.tsx             ← 45-minute interview simulation (10 problems)
    PreExamProtocol.tsx      ← Pre-exam day protocol
    TopicsBank.tsx           ← Full concept search + notes + images

  components/
    ContentSheet.tsx         ← Bottom sheet for content display
    PatternRecogniser.tsx    ← Pattern recognition component
    SharePromptSheet.tsx     ← Share sheet

  plugins/
    LlmPlugin.ts             ← Gemini API wrapper

  syllabus/
    index.ts                 ← Registry — change ACTIVE_SYLLABUS_ID here
    dsa/
      config.ts              ← DSA syllabus config (454 concepts, 5 subjects)
      concepts.ts            ← 454 enriched DSA concepts
    itplacement/
      config.ts              ← IT Placement config (271 concepts)
      concepts.ts            ← 271 enriched IT Placement concepts

scripts/
  enrich-concepts.mjs        ← Data enrichment script (already run — do not re-run)

docs/                        ← Research specs — read before implementing
  NEUROSCIENCE_IMPLEMENTATION_PLAN.md
  VEDIC_LEARNING_SYSTEM.md
  VEDIC_2WEEK_PLAN.md
  AI_EXAM_APP_BLUEPRINT.md
  UNCONSCIOUS_MASTERY_ALGORITHM.md
```

---

## All Screens — What Each Does + How to Use

### Core Learning Flow (in order)

#### 1. Dashboard (`screen = 'dashboard'`)
**What:** Home screen. Chitta Score ring, mastery breakdown (Automatic/Conscious/Fading), subject progress bars, exam readiness estimate, time-of-day study nudge.
**How to reach:** BottomNav Home tab, or after SessionComplete
**Key data shown:**
- Chitta Score = total Automatic concepts
- Exam readiness = estimated correct answers given current mastery
- Time nudge = `getTimeOfDayNudge(hour)` — tells student what to study now
- Days remaining to exam
**Leads to:** LiveSession (Start Session button), EliteHub (Pro tab), Topics (Topics tab), ChittaMap (Map tab)

#### 2. LiveSession (`screen = 'session'`)
**What:** Main MCQ session. Shows questions from the session pool, tracks confidence, response time, pre-test flag, retrievability.
**How to reach:** Dashboard → Start Session, BottomNav Session tab
**Neuroscience layers active:**
- Layer 2: Confidence widget (tap 🤔/🧩/⚡ BEFORE options appear)
- Layer 3: PRE-TEST badge on 40% of new concepts
- Layer 8: responseTimeMs tracked per question
- Layer 9: stakesFact shown for new/strengthen queue items
**Flow:** Tap confidence → options appear → select → confirm → Next → ConceptEncoding
**Known gap:** responseTimeMs tracked but NOT fed to detectCognitiveFatigue

#### 3. ConceptEncoding (`screen = 'encoding'`)
**What:** After answering a new concept — student encodes at depth they choose.
**How to reach:** LiveSession → Next (on new concept)
**Neuroscience layers active:**
- Layer 1: Encoding depth selector (Just read ×1.0 / Own words ×1.6 / Connected ×2.4)
**What it does:** Calls `getInitialStabilityWithEncoding(depth)` → saves `encodingDepth` + `stability` to concept
**Leads to:** ChittaMap
**Known gap:** encodingDepth not persisted to Capacitor DB (lost on refresh — see BUGS.md)

#### 4. ChittaMap (`screen = 'map'`)
**What:** Visual network of all concepts with connections.
**How to reach:** ConceptEncoding, BottomNav Map tab
**Leads to:** MorningRecall (from node click)

#### 5. MorningRecall (`screen = 'recall'`)
**What:** Morning spaced repetition session. Uses `getMorningRecallSet` to surface concepts studied 6–14h ago.
**How to reach:** ChittaMap → recall, BottomNav (via map)
**Neuroscience active:** Layer 7 — sleep consolidation pathway
**Known gap:** Falls back to isDue concepts when no morning set exists (common since lastStudiedAt rarely set)

#### 6. SessionComplete (`screen = 'complete'`)
**What:** Post-session analytics. Shows session stats, next review times.
**How to reach:** LiveSession after all questions answered

---

### Advanced Practice Modes (accessed via EliteHub)

#### 7. EliteHub (`screen = 'elite'`)
**What:** Hub screen listing all advanced practice modes with unlock conditions.
**How to reach:** BottomNav Pro tab
**Modes listed:** GhanaPatha, StressMode, DistractorTraining, ErrorDashboard, MockTest, PreExamProtocol

#### 8. GhanaPatha (`screen = 'ghana'`)
**What:** 15-second hard-cutoff recall drill for Automatic/ExamReady concepts only.
**Science:** Vedic Ghana-patha — hard time pressure forces automatic recall
**How it works:**
- Pool: concepts with stage = Automatic or ExamReady
- Timer: 15 seconds, auto-submit on timeout
- Rate: Clean (fast correct) / Partial (slow correct) / Fail
- Clean + fast (>5s left) 3× in a row → concept advances to ExamReady
- Stability updates: Clean+fast ×2.0, Clean ×1.5, Partial ×0.8, Fail → reset to 1
**Chapter prompts:** Hard-coded per chapter (state template + complexity)

#### 9. StressMode (`screen = 'stress'`)
**What:** Random timer (10–30s), auto-submit on timeout. All non-Unseen concepts.
**Science:** Cortisol inoculation — trains recall under pressure
**How it works:** Random time limit per question, 8 rotating recall prompts, rate clean/partial/fail

#### 10. DistractorTraining (`screen = 'distractor'`)
**What:** Pre-built elimination questions. See a wrong statement, identify why it's wrong.
**Science:** Vedic Neti-Neti — learn by elimination, builds inhibitory memory traces
**How it works:** Hard-coded `DISTRACTOR_BANK` of 20+ questions. Shows concept, wrong answer, 4 possible "why wrong" explanations — pick the correct reason.
**Known gap:** Standalone — not triggered automatically from LiveSession wrong answers

#### 11. ErrorDashboard (`screen = 'errors'`)
**What:** Clusters concepts by chapter error rate. Shows root cause + remedy per cluster.
**How it works:** Derives clusters from difficulty > 0.5 or stage = Fragile. Shows pattern, root cause, remedy.

#### 12. MockTest (`screen = 'mock'`)
**What:** 45-minute timed interview simulation. 10 problems, 5 subjects in order.
**How it works:** Picks 2 problems per subject (priority: Trees & Graphs first). Timer counts down. Rate: Clean / Hint / Stuck per problem.

#### 13. PreExamProtocol (`screen = 'preexam'`)
**What:** Day-of-exam preparation protocol. Checklist + mental state preparation.

#### 14. TopicsBank (`screen = 'topics'`)
**What:** Full searchable concept bank. Every concept with stage badge, notes, images.
**How to reach:** BottomNav Topics tab, Dashboard subject click
**Features:** Search by name/chapter/subject, add personal notes, attach images (Capacitor Filesystem), mark read

---

## Core Engine — Functions Reference

### `src/core/fsrs.ts`
| Function | What it does |
|---|---|
| `calculateR(stability, daysSince)` | R = e^(-t/S) — retrievability 0–1 |
| `isDue(concept)` | true when R < 0.85 |
| `updateStabilityOnSuccess(S, R, confidence?)` | New S after correct. confidence=1 → ×1.3 bonus |
| `updateStabilityOnFailure(S)` | Resets to max(1, S×0.3) |
| `updateDifficulty(D, correct)` | Correct → −0.08, Wrong → +0.15 |
| `advanceStage(stage)` | Unseen→Fragile→Conscious→Automatic→ExamReady |
| `regressStage(stage)` | ExamReady→Automatic→Conscious→Fragile→Unseen |
| `getNextReviewDays(S)` | S × ln(1/0.85) |
| `getEncodingMultiplier(depth)` | shallow=1.0, own-words=1.6, connected=2.4 |
| `getInitialStabilityWithEncoding(depth)` | INITIAL['Fragile'] × encoding multiplier |
| `getPredictionErrorMultiplier(hadPreTestError)` | true → 1.5x, false → 1.0x |

### `src/core/metacognition.ts`
| Function | What it does |
|---|---|
| `updateMetacogAccuracy(concept, confidence, correct)` | EWMA: 0.8×old + 0.2×matchScore |
| `detectOverconfidence(concept)` | metacogAccuracy < 0.5 after history |
| `getCalibrationReport(concepts)` | Per-subject over/underconfidence report |
| `detectCognitiveFatigue(recentItems)` | fresh/tiring/fatigued from response times |
| `getAdaptiveSessionLength(fatigue, base)` | fresh=20, tiring=15, fatigued=10 |

### `src/core/scheduler.ts`
| Function | What it does |
|---|---|
| `getDueToday(concepts)` | R < 0.85, sorted by urgency |
| `getDueSoon(concepts, days)` | Concepts due within N days |
| `getForgettingCurve(concept, days)` | R values for next N days |
| `estimateCorrect(stats, total, examQ)` | Predicted exam score given mastery |
| `getTimeOptimizedComposition(hour)` | Session ratios for 6 time bands |
| `getTimeOfDayNudge(hour)` | Human-readable study direction |
| `applyRIFAdjustment(concepts)` | Boosts urgency of RIF-suppressed concepts |
| `getMorningRecallSet(concepts, max)` | Concepts studied 6–14h ago (Fragile/Conscious) |
| `getPreSleepReviewSet(concepts, max)` | stakesTier=1, Fragile/Conscious, not studied in 4h |

### `src/core/session-builder.ts`
| Function | What it does |
|---|---|
| `buildSession(config, totalQ, hour?, fatigue?)` | Builds session pool with all 9 layers |

Session composition: `review(35%) + new(30%) + strengthen(25%) + challenge(10%)`
— Overridden by `getTimeOptimizedComposition(hour)` if hour is provided
— `applyRIFAdjustment` applied before sorting review queue
— 40% of new items marked `isPreTest: true`
— `pairRelatedConcepts` runs last (synaptic tagging)

---

## Data Model — Concept Fields

```ts
// Core FSRS
id, name, subject, chapter, unit, pyqTier (1-4)
stage: 'Unseen' | 'Fragile' | 'Conscious' | 'Automatic' | 'ExamReady'
stability: number      // days memory lasts
difficulty: number     // 0–1, per-student hardness
lastTested: number     // days since tested (-1 = never)
nextReview: number     // days until due

// Neuroscience (from implementation plan)
encodingDepth?         // 'shallow' | 'own-words' | 'connected'
metacogAccuracy?       // 0–1 EWMA confidence calibration
overconfidenceFlag?    // true when accuracy < 0.5
predictionErrorHistory? // { date, preTestWrong }[]
relatedIds?            // mechanistically related concept IDs
competingIds?          // RIF competitors
interferenceScore?     // 0–1 suppression strength
lastStudiedAt?         // Unix ms timestamp
stakesTier?            // 1 | 2 | 3 (1 = highest priority)
stakesFact?            // visceral real-world consequence string
```

**Data enrichment status (run 2026-04-11):**
- stakesTier: all 725 concepts
- stakesFact: 102 concepts
- relatedIds: 88 concepts
- competingIds + interferenceScore: 42 concepts

---

## Active Syllabi

| ID | Name | Concepts | Subjects |
|---|---|---|---|
| `dsa_faang` | DSA — Problem Solving | 454 | Foundations, Arrays & Search, Strings & DS, Trees & Graphs, DP & Greedy |
| `it_placement_india` | IT Placement India | 271 | (see itplacement/config.ts) |

**Currently active:** `it_placement_india` (change in `src/syllabus/index.ts`)

---

## Neuroscience Layers — Implementation Status

| Layer | Science | Engine | UI | Notes |
|---|---|---|---|---|
| 1 — Encoding Depth | Craik & Lockhart | ✅ fsrs.ts | ✅ ConceptEncoding | encodingDepth not persisted to DB |
| 2 — Metacognition | EWMA confidence | ✅ metacognition.ts | ✅ Confidence widget | updateMetacogAccuracy never called |
| 3 — Prediction Error | Pre-test +50% | ✅ fsrs.ts | ✅ PRE-TEST badge | bonus not applied on answer |
| 4 — Time of Day | LC-NE cortisol | ✅ scheduler.ts | ✅ Dashboard nudge | 4–6 AM window missing |
| 5 — Synaptic Tagging | relatedIds pairing | ✅ session-builder.ts | — | invisible, works in engine |
| 6 — RIF Adjustment | interferenceScore | ✅ scheduler.ts | — | invisible, works in engine |
| 7 — Sleep Recall | NREM replay | ✅ scheduler.ts | ✅ MorningRecall | lastStudiedAt rarely set |
| 8 — Cognitive Load | Response timer | ✅ metacognition.ts | ✅ timer tracked | fatigue not fed to session length |
| 9 — Emotional Tagging | stakesFact | ✅ data enriched | ✅ LiveSession | working |

---

## Vedic Techniques — Implementation Status

| Technique | Vedic Term | Status |
|---|---|---|
| Multi-path retrieval | Ghana-patha | ⏳ Pending (GhanaPatha screen is timed recall, not mode rotation) |
| Forced questioning | Mananam | ⏳ Pending |
| Absorption pause | Nididhyasanam | ⏳ Pending |
| Pre-session check | Pancha Kosha | ⏳ Pending |
| Metacognitive score | Viveka | ⏳ Pending (computed, not shown) |
| Time window | Brahma Muhurta | ⏳ Pending (4–6 AM missing) |
| Error elimination | Neti-Neti | 🔶 Partial (DistractorTraining exists, standalone) |
| Teach-back | Satsang | ⏳ Pending |
| Groove depth | Samskara | ⏳ Pending |
| Discomfort mode | Tapas | 🔶 Partial (StressMode exists, no FSRS integration) |

---

## Navigation Map

```
BottomNav
  Home → Dashboard
  Session → LiveSession → ConceptEncoding → ChittaMap → MorningRecall
  Topics → TopicsBank
  Map → ChittaMap
  Pro → EliteHub → GhanaPatha / StressMode / DistractorTraining
                 → ErrorDashboard / MockTest / PreExamProtocol
```

---

## Known Bugs
See `BUGS.md` for full list.

**Critical:**
- Neuroscience fields (encodingDepth, metacogAccuracy, predictionErrorHistory, relatedIds, etc.) not persisted to Capacitor DB — lost on app refresh
- `updateMetacogAccuracy` never called — confidence calibration doesn't update
- `detectCognitiveFatigue` never called — session length never adapts

**Minor:**
- Streak count hardcoded to 7 (Dashboard)
- MorningRecall always falls back to isDue set (lastStudiedAt never set)
- `getPreSleepReviewSet` exists but no entry point in UI

---

## Research Pipeline (how to add new science)

```
1. Write docs/TOPIC.md
   — Mechanism (not summary), effect size, minimum viable implementation
   — CHITTA implementation section (types + functions + screen)
   — FSRS effect (stability multiplier or difficulty delta)

2. Add fields to src/core/types.ts only
   — Run tsc — zero errors before any UI work

3. Add engine functions to fsrs.ts / scheduler.ts / metacognition.ts
   — Pure functions only, no React

4. Build screen in src/screens/ in isolation

5. Wire into App.tsx (Screen type + render line + navigation)

6. Update BUILD_STATE.md
```
