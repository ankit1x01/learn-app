# Vedic Learning System — 2-Week Implementation Plan

## Current State

### Core Engine (complete)
- FSRS full algorithm (R, S, D, stage progression)
- 9 neuroscience layers in engine code: encoding depth, metacognition, prediction error,
  time-of-day composition, synaptic tagging, RIF adjustment, sleep/recall sets,
  fatigue detection, emotional tagging
- 725 concepts enriched with stakesTier / stakesFact (102) / relatedIds (88) / competingIds (42)

### Screens Live (14 screens)

| Screen | What it does |
|---|---|
| Dashboard | Chitta Score, subject progress, time-of-day nudge |
| LiveSession | MCQ + confidence widget + pre-test badge + stakesFact |
| ConceptEncoding | Encoding depth selector (×1.0 / ×1.6 / ×2.4) |
| ChittaMap | Concept graph visualization |
| MorningRecall | Sleep-optimized recall set |
| SessionComplete | Post-session analytics |
| EliteHub | Hub for advanced modes |
| GhanaPatha | 15s hard cutoff timed recall (Automatic concepts) |
| StressMode | Random timer, auto-submit, cortisol simulation |
| DistractorTraining | Wrong-option elimination practice |
| ErrorDashboard | Error cluster analysis by chapter |
| MockTest | 45-minute interview simulation |
| PreExamProtocol | Pre-exam day protocol |
| TopicsBank | Full concept search |

### What's Missing from Vedic System

| Gap | Why it matters |
|---|---|
| Brahma Muhurta (4–6 AM window) | Scheduler starts at 6 AM; best encoding window unrecognised |
| Mananam forced questioning | No interrogation phase after encoding — Shravanam only |
| Nididhyasanam pause screen | No consolidation rest; biggest gap vs. highest ROI |
| Pancha Kosha pre-session check | No body/breath/mind state input; session blind to student state |
| Viveka score on Dashboard | metacogAccuracy computed in engine but never shown |
| Tapas mode | StressMode exists but not integrated as FSRS-linked session toggle |
| Neti-Neti post-error flow | DistractorTraining is standalone; wrong answers in LiveSession have no follow-up |
| Samskara depth composite | No groove score; `src/core/samskara.ts` not created |
| Satsang teach-back | No Conscious → Automatic gate; Feynman technique absent |
| Multi-path retrieval modes | All questions forward-only; no reverse / lateral / connection modes |

---

## Week 1 — Engine + Quick Wins

### Day 1 — Brahma Muhurta + Viveka Surface
**Files:** `src/core/scheduler.ts`, `src/App.tsx` (Dashboard section)

- Add `04:00–06:00` band to `getTimeOptimizedComposition`: new=0.55, review=0.20, strengthen=0.15, challenge=0.10
- Add `22:00+` band: new=0.00, review=0.60, strengthen=0.25, challenge=0.15 (pre-sleep only)
- Add `getBrahmaMuhurtaSet(concepts): Concept[]` — returns Unseen + stakesTier=1, sorted by pyqTier
- Dashboard nudge updated to handle 4 AM case: *"Brahma Muhurta window — best encoding window of the day"*
- Dashboard: add Viveka ring (dual ring alongside Chitta Score) surfacing existing `metacogAccuracy`

---

### Day 2 — Nididhyasanam Pause Screen
**Files:** `src/screens/NididhyasanamPause.tsx`, `src/core/types.ts`, `src/App.tsx`

- New screen: 60s dark screen, single ambient pulse animation
- Prompt: *"Close your eyes. Recall what you just learned. No checking."*
- After 60s: free-recall text field — student types 1–3 things they remember
- That free-recall IS the consolidation event
- Add `nididhyasanamCount: number` to `Concept`
- Trigger logic:
  - After every 5 new concepts in LiveSession → navigate to Nididhyasanam → return to session
  - After MorningRecall session ends
  - After any session with 3+ new concepts introduced
- FSRS effect: each nididhyasanam event reduces lastTested decay rate by 15% for touched concepts

---

### Day 3 — Pancha Kosha Pre-Session Check
**Files:** `src/screens/KoshaCheck.tsx`, `src/core/types.ts`, `src/App.tsx`, `src/core/session-builder.ts`

- New `PreSessionState` type:
  ```ts
  interface PreSessionState {
    bodyEnergy: 1 | 2 | 3 | 4 | 5;
    mentalClarity: 1 | 2 | 3 | 4 | 5;   // 1=clear, 5=chaotic
    motivationLevel: 1 | 2 | 3;
  }
  ```
- New screen: 5 taps, ~30 seconds total
  - Tap 1 — Body: "Physical energy right now?" (1–5)
  - Tap 2 — Breath: "3 deep breaths. Done?" (checkbox — mandatory pause)
  - Tap 3 — Mind: "Mental noise level?" (1–5)
  - Tap 4 — Focus: "Can you focus for 20 minutes?" (yes/no)
  - Tap 5 — Why: "Why does this session matter?" (3 options to tap)
- Flow: Dashboard → KoshaCheck → LiveSession
- Session builder adjusts composition based on state:
  - mentalClarity ≥ 4 → review=0.60, new=0.10, strengthen=0.20, challenge=0.10
  - motivationLevel = 1 → add stakesFact display on every question regardless of queue

---

### Day 4 — Mananam Forced Questioning
**Files:** `src/screens/MananamPhase.tsx`, `src/core/types.ts`, `src/App.tsx`

- New screen shown after ConceptEncoding, before navigating back to session
- 3 fixed templated questions (not graded — just forced generation):
  1. *"Why is this true? What mechanism causes it?"*
  2. *"Where does this break? Name one exception or edge case."*
  3. *"What already-known concept does this connect to?"*
- Student types brief answers; empty allowed but a 5s minimum per field enforced
- Add `mananaScore: number` to `Concept` — engagement rate (0–1 EWMA, 1.0 = always engages)
- FSRS effect: mananaScore > 0.7 → encoding depth multiplier gets ×1.1 bonus on initial stability
- Flow: LiveSession → ConceptEncoding → MananamPhase → LiveSession (next concept)

---

### Day 5 — Tapas Mode Integration
**Files:** `src/App.tsx` (session start modal), `src/core/types.ts`, `src/core/fsrs.ts`

- Session start modal (shown before KoshaCheck): Normal / Tapas toggle
- Tapas constraints:
  - 45s timer per question (not unlimited)
  - No hints, no partial reveals
  - R threshold lowered to 0.65 (concepts shown earlier = harder retrieval)
  - Only Conscious and Automatic concepts eligible
- FSRS effect: Tapas + correct answer → stability boost ×1.4 (norepinephrine effect)
- Add `tapasSessionCount: number` to `Concept` — how many times reviewed in Tapas mode
- Tapas streak on SessionComplete: shows "Tapas tolerance: X%" of sessions in hard mode

---

### Days 6–7 — Samskara Depth Composite Score
**Files:** `src/core/samskara.ts` (new), `src/core/index.ts`, `src/screens/TopicsBank.tsx`, `src/App.tsx`

- New file `src/core/samskara.ts`:
  ```ts
  export const calculateSamskaraDepth = (concept: Concept): number =>
    (concept.stability / 90) * 0.40
    + (concept.metacogAccuracy ?? 0.5) * 0.20
    + (concept.retrievalModesCleared?.length ?? 0) / 4 * 0.20
    + encodingDepthScore(concept.encodingDepth) * 0.10
    + Math.min(1, (concept.nididhyasanamCount ?? 0) / 5) * 0.10;
  ```
- Export from `src/core/index.ts`
- TopicsBank: groove depth bar on each concept card (thin / medium / deep visual)
- Dashboard: "Fragile Mastery" warning section — Automatic concepts with SamskaraDepth < 0.4
- SessionComplete: "Samskara deepened for X concepts this session"

---

## Week 2 — Advanced Features

### Days 8–9 — Multi-Path Retrieval Modes (Ghana-patha)
**Files:** `src/core/types.ts`, `src/core/session-builder.ts`, `src/App.tsx` (LiveSession)

- Add to `types.ts`:
  ```ts
  export type RetrievalMode = 'forward' | 'reverse' | 'lateral' | 'connection';
  ```
- Add `retrievalModesCleared: RetrievalMode[]` to `Concept`
- Session builder: picks the least-cleared mode for each concept
- LiveSession renders differently per mode:

  | Mode | What student sees | What they answer |
  |---|---|---|
  | forward | Concept name | What it does / definition |
  | reverse | Definition / mechanism | Name the concept |
  | lateral | Concept name | Real-world failure case |
  | connection | "How does X connect to Y?" | Mechanism linking the two (uses relatedIds) |

- Concept advances to Automatic only when ≥ 3 modes cleared (not just correct count)
- Mode badge shown on question card (e.g. "REVERSE MODE")

---

### Days 10–11 — Neti-Neti Post-Error Elimination
**Files:** `src/screens/NetiAnalysis.tsx`, `src/core/types.ts`, `src/App.tsx` (LiveSession)

- After any wrong answer in LiveSession, before `handleNext`: show NetiAnalysis overlay
- Overlay presents: *"Your answer was [X]. Why was it wrong?"*
- 3 options: one correct reason, two plausible-but-wrong reasons
- Correct elimination:
  - `netiAnalysisCount++` on concept
  - difficulty decreases 20% faster on next success
- Wrong elimination (picked wrong reason):
  - Concept flagged — goes back to review queue
  - Brief explanation shown: *"That's not why. The real reason: [correct reason]"*
- Add `netiAnalysisCount: number` to `Concept`
- FSRS effect: `netiAnalysisCount > 2` → difficulty delta on correct answer increased to −0.12 (vs −0.08 default)

---

### Days 12–13 — Satsang Teach-Back (LLM-Gated)
**Files:** `src/screens/TeachBack.tsx`, `src/core/types.ts`, `src/App.tsx`, `src/plugins/LlmPlugin.ts`

- Gate: when a concept would advance Conscious → Automatic, intercept → require teach-back first
- New screen:
  - Prompt: *"Explain [concept] as if teaching a 16-year-old. 3–5 sentences."*
  - Text input (or voice if browser supports)
- Gemini API evaluates against 3 criteria:
  - Did student cover the core mechanism?
  - Did student use an analogy or real-world example?
  - Did student identify an edge case or failure mode?
- Response to student: *"✓ Mechanism clear. ✗ No analogy. ✗ No edge case. Revise."*
- On pass (≥2/3): concept advances; `teachBackQuality` saved
- FSRS effect: `teachBackQuality = 'deep'` (3/3) → stability ×2.0 on next review cycle
- Add to `Concept`:
  ```ts
  teachBackAttempts?: number;
  teachBackQuality?: 'incomplete' | 'surface' | 'deep';
  ```

---

### Day 14 — Integration, Types, Polish
**Files:** `src/core/types.ts`, `src/App.tsx`, `src/screens/EliteHub.tsx`, `src/screens/SessionComplete.tsx`

- Add all new fields to `Concept` in one clean pass:
  ```ts
  nididhyasanamCount?: number;
  mananaScore?: number;
  tapasSessionCount?: number;
  retrievalModesCleared?: RetrievalMode[];
  netiAnalysisCount?: number;
  teachBackAttempts?: number;
  teachBackQuality?: 'incomplete' | 'surface' | 'deep';
  ```
- Wire all new screens into App.tsx `Screen` type
- EliteHub: add Tapas, Teach-back, and Nididhyasanam as visible mode cards
- SessionComplete: show Samskara depth delta + retrieval modes cleared this session
- Run `npx tsc --noEmit --skipLibCheck` — zero errors

---

## Sprint Summary

| Day | Feature | Vedic Technique | Effort |
|---|---|---|---|
| 1 | Brahma Muhurta window + Viveka ring | Brahma Muhurta + Viveka | 2h |
| 2 | Nididhyasanam 60s rest screen | Nididhyasanam | 2h |
| 3 | Pancha Kosha pre-session check | Pancha Kosha | 2h |
| 4 | Mananam 3-question forced interrogation | Mananam | 3h |
| 5 | Tapas mode toggle with FSRS ×1.4 | Tapas | 2h |
| 6–7 | Samskara depth composite + groove viz | Samskara | 3h |
| 8–9 | Multi-path retrieval (4 modes) | Ghana-patha | 5h |
| 10–11 | Neti-Neti post-error elimination | Neti-Neti | 4h |
| 12–13 | Satsang teach-back (LLM-gated) | Satsang | 5h |
| 14 | Integration, type cleanup, polish | — | 3h |

**Total: ~31 hours across 10 features. All 10 Vedic techniques live.**

---

## The Complete Vedic Learning Cycle After Implementation

```
Brahma Muhurta (4–6 AM)
  ↓
Pancha Kosha check (30s — body / breath / mind / focus / why)
  ↓
KoshaCheck adjusts session composition
  ↓
[Tapas toggle — Normal or Hard mode]
  ↓
LiveSession — question in selected RetrievalMode
  ↓
  [Wrong answer] → Neti-Neti overlay: "Why were you wrong?"
  [Correct] → confidence + responseTime recorded → Viveka updated
  ↓
Every 5 new concepts → Nididhyasanam pause (60s rest + free recall)
  ↓
ConceptEncoding → encoding depth selected
  ↓
MananamPhase → 3 forced questions (why / where breaks / connects to)
  ↓
[Conscious → Automatic transition] → TeachBack gate (Satsang)
  ↓
SessionComplete → Samskara depth delta shown
  ↓
Pre-sleep: high-stakes review set (stakesTier=1, feeds NREM replay)
  ↓
Morning: MorningRecall uses last night's pre-sleep set
  ↓
[Cycle repeats — Samskara groove deepens]
```
