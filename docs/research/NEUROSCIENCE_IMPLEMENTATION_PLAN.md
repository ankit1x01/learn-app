# Neuroscience Implementation Plan

Mapping every evidence-backed learning technique to specific files and changes in the CHITTA engine.
No code is changed yet — this is the blueprint.

---

## What Is Already Implemented

| Technique | Where | Notes |
|---|---|---|
| FSRS spaced repetition (R = e^(-t/S)) | `src/core/fsrs.ts` | Core algorithm, working |
| Subject interleaving (50/25/25) | `src/core/session-builder.ts` | Enforced per session |
| Desirable difficulty (harder recall = bigger stability boost) | `fsrs.ts:updateStabilityOnSuccess` | `boost = e^(0.1*(1-R))` |
| Stage-based mastery progression | `fsrs.ts:advanceStage / regressStage` | 5 stages |
| Forgetting curve projection | `scheduler.ts:getForgettingCurve` | Per-concept |
| Session queue composition (review/new/strengthen/challenge) | `session-builder.ts:buildSession` | 35/30/25/10 |
| Per-concept difficulty tracking | `fsrs.ts:updateDifficulty` | Asymmetric delta |

---

## What Is Missing — Grouped by Neuroscience Layer

---

### Layer 1 — Encoding Depth

**Science:** Levels of processing (Craik & Lockhart). Semantic/self-referential encoding produces 3-4x more durable traces than shallow reading. Initial stability should be weighted by how deeply the concept was encoded.

**Gap:** Every new concept starts with the same fixed initial stability (`INITIAL_STABILITY['Fragile'] = 2`), regardless of how the student encoded it.

#### Implementation

**`src/core/types.ts`** — add to `Concept`:
```
encodingDepth: 'shallow' | 'own-words' | 'connected'
```
- `shallow` — student just read the card (default)
- `own-words` — student wrote a personal explanation (ConceptEncoding screen)
- `connected` — student linked it to another concept they already know

**`src/core/fsrs.ts`** — new function:
```
getEncodingMultiplier(depth: EncodingDepth): number
  shallow   → 1.0
  own-words → 1.6
  connected → 2.4
```
Used to multiply `INITIAL_STABILITY['Fragile']` when a concept is first seen.

**`src/screens/ConceptEncoding.tsx`** (or `App.tsx`) — the encoding UI needs to capture which depth level the student reached, then pass it to the concept state on save.

---

### Layer 2 — Metacognition & Confidence Calibration

**Science:** Judgments of Learning (JOL) immediately after studying are inflated (fluency illusion). Forced confidence ratings before answering — then comparing to actual result — trains accurate self-monitoring (anterior prefrontal cortex). Dunning-Kruger detection: students with high confidence + low accuracy need to be flagged and given harder pre-tests.

**Gap:** No confidence signal exists anywhere in the engine. The system treats all correct answers equally, whether the student was certain or guessing.

#### Implementation

**`src/core/types.ts`** — add to `Concept`:
```
metacogAccuracy: number   // 0–1, running EWMA of (stated confidence matched actual)
overconfidenceFlag: boolean
```

Add to `SessionItem`:
```
statedConfidence: 1 | 2 | 3 | null   // filled before answer shown; 1=unsure 2=partial 3=certain
```

**`src/core/metacognition.ts`** — new file, functions:
```
updateMetacogAccuracy(concept, statedConfidence, wasCorrect): number
  // EWMA: new = 0.8 * old + 0.2 * match_score
  // match_score: confident+correct=1.0, unsure+wrong=1.0, confident+wrong=0.0, unsure+correct=0.5

detectOverconfidence(concept): boolean
  // flag if metacogAccuracy < 0.5 AND average statedConfidence > 2.0

getCalibrationReport(concepts[]): CalibrationReport
  // returns per-subject overconfidence/underconfidence breakdown
```

**`src/core/fsrs.ts`** — modify `updateStabilityOnSuccess`:
```
// Existing: boost = e^(0.1*(1-R))
// Add: if statedConfidence=1 and correct → "underconfidence bonus" → boost *= 1.3
// Add: if statedConfidence=3 and correct → normal boost (no extra signal)
// Rationale: uncertainty + success = desirable difficulty signal → stronger trace
```

**Session UI** — before showing MCQ options, show a 3-tap confidence widget. This is a UI change in the session screen, not in core.

---

### Layer 3 — Prediction Error & Pre-testing

**Science:** When an outcome violates expectation, dopaminergic neurons fire → norepinephrine → stronger LTP. Getting an answer wrong *before* seeing the correct one produces a bigger dopamine signal than getting it right. Pre-testing (attempting questions before learning content) outperforms read-first by ~20% on delayed recall.

**Gap:** New concepts (`stage='Unseen'`) are always introduced with content first, then tested. The pre-test effect is never exploited.

#### Implementation

**`src/core/types.ts`** — add to `SessionItem`:
```
isPreTest: boolean   // true = question shown BEFORE concept explanation
```

**`src/core/session-builder.ts`** — in `buildSession`, mark ~40% of `new` queue items as `isPreTest: true`.

**`src/core/fsrs.ts`** — new function:
```
updateStabilityWithPredictionError(stability, wasPreTest, wasCorrect): number
  // if isPreTest && !wasCorrect → "prediction error bonus"
  //   stability on subsequent correct answer gets +50% boost
  //   rationale: the wrong attempt + correction = maximum dopamine signal
```

**`src/core/types.ts`** — add to `Concept`:
```
predictionErrorHistory: { date: number; preTestWrong: boolean }[]
```

The session UI needs to detect `isPreTest=true` and show the question before revealing the concept explanation.

---

### Layer 4 — Time-of-Day Optimization (Cortisol & LC-NE System)

**Science:** Locus coeruleus norepinephrine (LC-NE) system gates memory encoding. Morning cortisol spike (6-9am) primes hippocampal encoding capacity — best window for new concepts. Afternoon alertness trough (2-4pm) is worst for new material but fine for review. Pre-sleep input gets preferentially replayed during NREM sharp-wave ripples.

**Gap:** Session composition is fixed (35/30/25/10). It does not vary by time of day.

#### Implementation

**`src/core/scheduler.ts`** — new function:
```
getTimeOptimizedComposition(hour: number): SessionComposition
  06–09h (cortisol peak)     → new=45%, review=25%, strengthen=20%, challenge=10%
  09–12h (sustained focus)   → new=35%, review=30%, strengthen=25%, challenge=10%  (default)
  12–14h (post-lunch)        → new=15%, review=45%, strengthen=30%, challenge=10%
  14–17h (alertness trough)  → new=10%, review=50%, strengthen=30%, challenge=10%
  17–20h (second wind)       → new=25%, review=30%, strengthen=30%, challenge=15%
  20–23h (pre-sleep window)  → new=5%,  review=55%, strengthen=25%, challenge=15%
```

**`src/core/session-builder.ts`** — pass `hour` into `buildSession`, use `getTimeOptimizedComposition` instead of reading from `config.sessionComposition` directly.

**Dashboard UI** — show a "Now is a good time for [new concepts / review / challenge]" nudge based on current hour.

---

### Layer 5 — Synaptic Tagging & Capture (STC) — Related Concept Pairing

**Science:** Learning creates a synaptic "tag" that persists ~2h. A second learning event within that window can capture and strengthen both tags simultaneously. Studying two *related* concepts within a single 2h session produces 30-40% better retention of both compared to studying them in separate sessions.

**Gap:** Session builder treats all concepts independently. No concept-to-concept relationship exists in the data model.

#### Implementation

**`src/core/types.ts`** — add to `Concept`:
```
relatedIds: string[]   // concept IDs that are mechanistically related
```

**`src/core/session-builder.ts`** — new function:
```
pairRelatedConcepts(pool: SessionItem[]): SessionItem[]
  // After interleaving, scan for concepts that have relatedIds
  // If concept A is in the session and concept B (relatedId of A) is also in the pool,
  // insert B within the next 3 positions after A
  // This ensures both tags are created within the same ~20-min window
```

**Syllabus data** (`src/syllabus/*/concepts.ts`) — `relatedIds` must be populated. For NEET: Mitosis ↔ Meiosis, Glycolysis ↔ Krebs Cycle, Laws of Motion ↔ Work-Energy Theorem, etc.

---

### Layer 6 — Retrieval-Induced Forgetting (RIF) — Strategic Suppression

**Science:** Practicing concept A actively suppresses competing concept B (same category, similar cues) via inhibitory mechanisms. This can be exploited: deliberately practice high-priority concepts frequently to suppress competing lower-priority concepts that cause interference at retrieval time.

**Gap:** All concepts in a chapter are treated as independent. No interference modeling exists.

#### Implementation

**`src/core/types.ts`** — add to `Concept`:
```
competingIds: string[]   // concepts that interfere with retrieval of this concept
interferenceScore: number  // 0–1, how much this concept is being suppressed by competitors
```

**`src/core/scheduler.ts`** — new function:
```
applyRIFAdjustment(concepts: Concept[]): Concept[]
  // For each concept C:
  //   find all concepts that list C in their competingIds AND have been reviewed recently
  //   increase C's effective lastTested by (interferenceScore * 0.5 days)
  //   → C gets surfaced for review slightly earlier than FSRS alone would suggest
  //   rationale: counteract the suppression effect before it causes real forgetting
```

**`src/core/session-builder.ts`** — when filling the `review` queue, call `applyRIFAdjustment` before sorting by R.

---

### Layer 7 — Sleep & Morning Recall Optimization

**Science:** Hippocampal replay during NREM sleep preferentially consolidates the last material studied before sleep and material associated with high emotional/stakes tagging. Morning free recall (first 20 min, no input) engages the same hippocampal-to-neocortex transfer pathway.

**Gap:** No time-of-study tracking. Morning recall screen exists architecturally but has no algorithm for selecting *which* concepts to recall.

#### Implementation

**`src/core/types.ts`** — add to `Concept`:
```
lastStudiedAt: number   // Unix timestamp (ms), not just day count
stakesTier: 1 | 2 | 3  // derived from pyqTier; tier 1 = highest stakes
```

**`src/core/scheduler.ts`** — new function:
```
getMorningRecallSet(concepts: Concept[], maxItems: number = 10): Concept[]
  // Return concepts matching ALL of these:
  //   1. lastStudiedAt was between 6h and 14h ago (studied last night)
  //   2. stage is Fragile or Conscious (not yet consolidated)
  //   3. Sort by stakesTier ASC (highest priority first), then by R ASC
  //   → These are the exact concepts the hippocampus replayed last night
```

**`src/core/scheduler.ts`** — new function:
```
getPreSleepReviewSet(concepts: Concept[], maxItems: number = 8): Concept[]
  // Return concepts to study in the 20–22h window:
  //   1. stage Fragile or Conscious (most benefit from replay)
  //   2. stakesTier = 1 (highest exam priority)
  //   3. NOT studied in the last 4h (avoid massed repetition)
  //   → These get maximum NREM replay time
```

---

### Layer 8 — Cognitive Load Management

**Science:** Working memory holds ~4 chunks for ~20s. Extraneous load (poor presentation, too many options, interruptions) competes with germane load (schema formation). Session length and question density should adapt to detected cognitive fatigue.

**Gap:** Session length is fixed at 20 questions regardless of student state. No cognitive load signal exists.

#### Implementation

**`src/core/types.ts`** — add to `SessionItem`:
```
responseTimeMs: number   // how long student took to answer
```

**`src/core/metacognition.ts`** — add:
```
detectCognitiveFatigue(recentItems: SessionItem[]): FatigueLevel
  // Inputs: response times + accuracy over last 5 questions
  // Signal: response time increasing + accuracy dropping = fatigue
  // Returns: 'fresh' | 'tiring' | 'fatigued'

getAdaptiveSessionLength(fatigue: FatigueLevel, baseLength: number): number
  fresh    → baseLength (20)
  tiring   → baseLength * 0.75 (15)
  fatigued → baseLength * 0.5  (10) + recommend break
```

**`src/core/session-builder.ts`** — accept `fatigueLevel` param, call `getAdaptiveSessionLength`.

---

### Layer 9 — Emotional Tagging / Stakes Framing

**Science:** Amygdala modulates hippocampal consolidation via norepinephrine. Attaching stakes/survival framing to dry facts boosts consolidation. The effect is proportional to perceived relevance — "this will be on the exam" is weak; "this is why patients die in ICUs" is strong.

**Gap:** Concepts are presented neutrally. No stakes context is surfaced during encoding.

#### Implementation

**`src/core/types.ts`** — add to `Concept`:
```
stakesFact: string   // one sentence of real-world consequence
                     // e.g. "Incorrect sodium balance causes fatal cerebral edema"
```

**Session UI** — when `queue='new'` or `queue='strengthen'`, show `stakesFact` below the concept name before revealing the MCQ options.

**Syllabus data** — `stakesFact` must be authored for each concept. High pyqTier concepts should have compelling, visceral stakes facts.

---

## Implementation Priority Order

| Priority | Layer | Effect Size | Effort |
|---|---|---|---|
| 1 | Confidence rating (Layer 2) | High | Low — UI widget + 2 type fields |
| 2 | Time-of-day composition (Layer 4) | High | Low — pure logic, no data changes |
| 3 | Morning recall set algorithm (Layer 7) | High | Low — new scheduler function |
| 4 | Encoding depth multiplier (Layer 1) | Medium-High | Medium — UI capture + FSRS change |
| 5 | Pre-sleep review set (Layer 7) | Medium | Low — new scheduler function |
| 6 | Pre-testing flag (Layer 3) | Medium | Medium — session builder + UI flow |
| 7 | Response time / fatigue (Layer 8) | Medium | Medium — timing in session UI |
| 8 | Related concept pairing (Layer 5) | Medium | High — data authoring heavy |
| 9 | RIF adjustment (Layer 6) | Medium | High — data authoring heavy |
| 10 | Stakes framing (Layer 9) | Medium | High — content authoring heavy |

---

## File Change Summary

| File | Change Type | Layers |
|---|---|---|
| `src/core/types.ts` | Extend interfaces | 1,2,3,4,5,6,7,8,9 |
| `src/core/fsrs.ts` | New functions, modify existing | 1,2,3 |
| `src/core/session-builder.ts` | Modify buildSession, new helpers | 4,5,6,8 |
| `src/core/scheduler.ts` | New functions | 4,6,7 |
| `src/core/metacognition.ts` | New file | 2,8 |
| `src/syllabus/*/concepts.ts` | Data authoring | 5,6,9 |
| Session screen UI | Confidence widget, response timer, pre-test flow | 2,3,8,9 |
| Morning recall screen | Use new `getMorningRecallSet` | 7 |
| Dashboard UI | Time-of-day nudge | 4 |

---

## What This Does NOT Change

- The FSRS formula itself (`R = e^(-t/S)`) — it stays as is
- The 5-stage mastery model — unchanged
- The session composition ratios as defaults — time-of-day is additive, not a replacement
- The interleaving algorithm — STC pairing is a post-processing step after interleaving
- Storage schema (`src/db/store.ts`) — new fields use the existing `ConceptState` shape with optional additions
