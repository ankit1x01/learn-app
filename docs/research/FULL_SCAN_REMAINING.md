# CHITTA — Full Document Scan: What Remains + What's Missing
> Scanned: all docs/ files + current BUILD_STATE
> Date: 2026-04-11

---

## THE HONEST PICTURE

Five documents contain proven learning techniques. Three of them have been partially
implemented. Two of them have never been touched in code at all.

```
NEUROSCIENCE_IMPLEMENTATION_PLAN.md  → 9 layers — engine done, UI partial, bugs blocking
VEDIC_LEARNING_SYSTEM.md             → 10 techniques — 2-week plan written, 0 built yet
EXTREME_VEDIC_ALGORITHMS.md          → 10 extreme techniques — NOT IN ANY PLAN YET
GOD_MODE_LEARNING_SYSTEM.md          → 15 sections — maybe 2 partially built
GOD_MODE_CHITTA_LAYER.md             → 10 laws — 1 partially built
RND_PLANNING.md                      → Phase 0-4 plan — Phase 1 done, 2-4 untouched
```

---

## SECTION 1: CRITICAL BUGS — FIX BEFORE BUILDING ANYTHING

These bugs mean the neuroscience layers built over the last month have **zero lasting
effect on the student**. Everything else is on top of a broken foundation.

| Bug | Impact |
|---|---|
| BUG-001: Neuroscience fields not persisted | encodingDepth, metacogAccuracy, predictionErrorHistory, lastStudiedAt — all lost on refresh |
| BUG-002: updateMetacogAccuracy never called | Confidence widget is decoration. Viveka has no data. |
| BUG-003: Prediction error bonus never applied | PRE-TEST badge exists but +50% bonus never fires |
| BUG-004: detectCognitiveFatigue never called | Session length never adapts. Layer 8 is dead. |
| BUG-005: lastStudiedAt never set | MorningRecall is always a fallback. Layer 7 is dead. |

**Fix these first. Estimated: 2 hours.**

---

## SECTION 2: VEDIC 2-WEEK PLAN — REMAINING

From `docs/VEDIC_2WEEK_PLAN.md`. None of these are built yet.

| Day | Feature | Technique | Effort |
|---|---|---|---|
| 1 | Brahma Muhurta 4-6 AM band + Viveka ring on Dashboard | Brahma Muhurta | 2h |
| 2 | Nididhyasanam 60s dark pause screen | Nididhyasanam | 2h |
| 3 | Pancha Kosha pre-session 5-tap check | Pancha Kosha | 2h |
| 4 | Mananam 3 forced questions after encoding | Mananam | 3h |
| 5 | Tapas mode toggle with FSRS ×1.4 | Tapas | 2h |
| 6-7 | Samskara depth composite score + groove viz | Samskara | 3h |
| 8-9 | Multi-path retrieval modes (forward/reverse/lateral/connection) | Ghana-patha | 5h |
| 10-11 | Neti-Neti post-error elimination overlay | Neti-Neti | 4h |
| 12-13 | Satsang teach-back LLM gate (Conscious→Automatic) | Satsang | 5h |
| 14 | Integration, type cleanup, polish | — | 3h |

---

## SECTION 3: EXTREME VEDIC ALGORITHMS — NOT IN ANY PLAN YET

From `docs/EXTREME_VEDIC_ALGORITHMS.md`. This entire document has never been
added to any plan or implementation. It contains the most powerful techniques
in the entire codebase — and none of it is built.

### 3.1 Poorva Paksha — Teach the Wrong Answer First
**Vedic:** Before any concept, the student must master the strongest argument AGAINST it.
Shankaracharya's Brahma Sutras: every sutra starts with the opponent's view, fully presented.

**Neuroscience:** Contrast encoding — wrong belief + why it's wrong = two memory traces.
The error trace acts as a permanent retrieval cue. One of the strongest encodings possible.

**Different from Neti-Neti:** Neti is post-error. Poorva Paksha is PRE-encoding.
Show the misconception BEFORE the concept, not after a wrong answer.

**What's needed:**
```ts
confusionPair?: {
  wrongBelief: string;          // "GCD can be found by trying all divisors"
  whyStudentsThinkThis: string; // "It's the intuitive brute-force approach"
  contrastMechanism: string;    // "Euclidean: gcd(a,b) = gcd(b, a%b)"
}
```
Screen: before ConceptEncoding — "Most students believe: [wrongBelief]. What do YOU think?"
→ student taps agree/disagree → if agreed: show mechanism of failure first, then concept

**Priority: TIER 1 — highest effect size of anything in this list**

---

### 3.2 Flow Engineering (Dharana → Dhyana)
**Vedic:** Patanjali's progression from effortful concentration (Dharana) to effortless
flow (Dhyana). The Rishis engineered this state through precise challenge calibration.

**Neuroscience:** Csikszentmihalyi — flow requires challenge 4% above current skill.
Accuracy 70-85% + response time 15-45s = flow zone.
In flow: prefrontal cortex quiets, norepinephrine peaks, hippocampus encodes maximally.

**What's needed:**
- Track rolling accuracy (last 10 questions)
- Track rolling response time
- Detect flow state: `0.70 ≤ accuracy ≤ 0.85 AND 15s ≤ avgTime ≤ 45s`
- **CRITICAL:** When flow detected → suppress ALL UI noise (no badges, no animations,
  no encouragement messages). The Rishi who interrupted a student in Dharana was
  considered to have committed a serious error.
- Adaptive difficulty: too easy → increase distractor quality; too hard → allow partial reveal

**Priority: TIER 1 — directly improves every session without new screens**

---

### 3.3 Yoga Nidra — Hypnagogic State Installation
**More specific than Nididhyasanam.** Not just a rest pause — a 3-phase protocol.

**Neuroscience:** MIT study (Stickgold & Haar, 2021) — even 30-60 seconds of Stage 1
sleep (theta state) after learning improved retention by 32%.
Mechanism: hippocampus still replaying recent experiences + cortical inhibition partially lifted.

**Protocol (different from Nididhyasanam 60s screen):**
```
Phase 1 — Pratyahara (2 min): pure black screen, app completely silent
Phase 2 — Sankalpa (3 min): 3 concept seeds planted slowly with 20s silence between each
  e.g. "Two Sum. O(n) hash map. Target sum in one pass."
  Not questions — seeds. Pure Shravanam in receptive state.
Phase 3 — Free recall (2 min): "What do you remember?" — student types freely
```
Trigger: after 5+ new concepts in a session, or after any session with 3+ new.
FSRS effect: concepts presented in Yoga Nidra phase → `initialStability *= 1.5`

**Priority: TIER 1 — replaces/upgrades the Nididhyasanam screen**

---

### 3.4 Anusandhana — The Always-On Scheduler
**Vedic:** Guru asked questions at random unexpected moments — during meals, walks, chores.
Called Sthitaprajna — knowledge available in ANY state, not just study state.

**Neuroscience:** Variable ratio reinforcement (the schedule that makes slot machines
addictive). Context-independent memory — encoding across many contexts produces
the most robust memory form. Random-context recall = ×1.2 stability bonus.

**What's needed:**
- Capacitor Push Notifications (already in Capacitor setup)
- Schedule 1-3 micro-tests at genuinely RANDOM times across the day
- Format: plain notification (no color, no animation — the plainness signals "this is real")
→ full screen question → answer → dismiss in 30 seconds
- No session UI, no stats, no encouragement — pure signal

**Priority: TIER 2 — requires Capacitor Push setup, high value when built**

---

### 3.5 Sadhana Chatushtaya — Behavioral Prerequisites Profile
**Vedic:** Shankaracharya's four prerequisites for serious learning:
Viveka (metacognition), Vairagya (non-attachment), Shat Sampat (six instruments),
Mumukshutva (burning desire).
The Guru's first job: assess these, not teach content.

**What's needed — behavioral profile inferred from session history:**
```ts
interface SadhanaProfile {
  shraddha:     number; // FSRS compliance rate — reviews done on schedule
  titiksha:     number; // Tapas acceptance rate
  shama:        number; // session completion rate (starts vs. finishes)
  samadhana:    number; // accuracy variance after a wrong answer (emotional stability)
  mumukshutva:  number; // sessions started without any external trigger
}
```
Adaptive interventions:
- Low shraddha → show forgetting curve: "If you skip today, X concepts will decay by Thursday"
- Low titiksha → never show Tapas mode — build confidence first
- Low shama → shorten sessions to 5 questions, build up
- Low samadhana → after wrong answer, show easiest concept next (not harder)

**Priority: TIER 2 — changes how sessions are personalized**

---

### 3.6 Ritambhara Prajna — Direct Pattern Perception
**Vedic:** Patanjali 1.48-49 — at deep absorption, student perceives patterns directly
without inference. Expert intuition — knowledge that appears before the question is complete.

**Neuroscience:** Pattern completion via sparse coding. Expert answers in <3 seconds
using direct neocortical pattern retrieval — no hippocampal lookup needed.
This is more reliable than stage advancement by accuracy count alone.

**What's needed:**
```ts
patternPerceptionCount?: number; // times answered correctly in < 3 seconds
```
In LiveSession: `if responseTimeMs < 3000 && correct: concept.patternPerceptionCount++`
Gate: `patternPerceptionCount >= 5` → advance to ExamReady (more reliable than score count)

**Fragment test mode:** Show only first 3 words of a question — if answered correctly,
that's pattern completion firing. The hardest possible test. Reserve for ExamReady gate.

**Priority: TIER 1 — one field + one check, huge semantic upgrade to ExamReady**

---

### 3.7 Krama — Prerequisite Sequencing
**Vedic:** Taittirriya Upanishad — the order concepts are introduced determines whether
they can be learned at all. Gurukul never introduced B before A was at Conscious stage.

**Neuroscience:** Cognitive load theory — intrinsic load is non-compressible.
A concept requiring 3 prior concepts will always consume 3 working memory slots.
If those aren't automatized, there's nothing left for the new concept.

**What's needed:**
```ts
prerequisiteIds?: string[];  // IDs of concepts that must be Conscious before this one
```
In session-builder: `KRAMA_READY(concept)` — never include as 'new' if prerequisites not Conscious.
Instead: surface the blocking prerequisite first.
Dashboard message: "Before [Concept C], master [Blocker B]. Today's session focuses on [B]."

**Priority: TIER 2 — needs prerequisiteIds data added to concept files**

---

### 3.8 Mantra Compression — Phonological Anchors
**Vedic:** A mantra is a compressed representation of a complex conceptual network.
Gayatri Mantra (24 syllables) = key to thousands of interconnected concepts.
The student who knows the mantra has a trigger that unlocks the entire cluster.

**Neuroscience:** Phonological loop + encoding specificity (Tulving) — a well-learned
sound pattern is a single chunk, not multiple items. Bypasses declarative system,
hits procedural/implicit memory directly. This is why jingles are remembered for decades.

**What's needed:**
```ts
mantraAnchor?: string; // compressed anchor for concept cluster retrieval
clusterIds?: string[]; // which concepts this mantra represents
```
For concept clusters (Krebs Cycle 8 steps, PCR steps, Newton's 3 laws):
Generate an ACRONYM or RHYTHM anchor → show before cluster introduction
In future sessions: show only the anchor → student must reconstruct full cluster.

**Priority: TIER 2 — needs data for clusters, powerful for multi-step processes**

---

### 3.9 The Guru Function — Master Adaptive Algorithm
**Vedic:** The Guru continuously read the student's complete state vector — breath,
posture, eye movement, pace — and adapted everything in real time.
No modern educational technology does this. All current apps adapt only to accuracy.

**What's needed:**
```ts
type StudentState = 'peak' | 'flow' | 'tiring' | 'fatigued' | 'anxious' | 'overconfident' | 'blocked';
```
State detection from: accuracy trend, velocity trend, koshaState, streakDays, vivekaScore, time of day.

State interventions:
```
peak         → new concepts, Tapas allowed, full Mananam + Nididhyasanam
flow         → do not interrupt, suppress UI noise, let session run longer
tiring       → shift to review queue only, reduce to 5 questions
fatigued     → end session, mandatory Yoga Nidra, no new material
anxious      → reduce difficulty, show easiest available concepts
overconfident→ force Tapas on high-confidence concepts, no encouragement
blocked      → switch retrieval mode, surface Poorva Paksha, then Mananam
```

**Priority: TIER 1 — the unifying intelligence layer that coordinates all other techniques**

---

### 3.10 Transmission / Shakti-pata — Expert Demonstration
**Vedic:** The Guru demonstrates — does not explain — with full embodied presence.
Student's mirror neurons fire, simulating the Guru's neural patterns.

**Neuroscience:** Mirror neurons (Rizzolatti, 1996) + amygdala modulation —
learning in the presence of a trusted expert produces measurably stronger memory traces.

**What's needed:**
- Before high-stakes new concepts: 90-second expert video clip (expert THINKING, not explaining)
  The struggle must be visible — not polished. Expert verbalizes uncertainty + resolution.
- Stakes story: not a statistic — a specific named student who failed this concept.
  "Arjun missed this in NEET 2024 by 1 question. This was it."
- 10-second silence before question appears (simulates Guru sitting with student)

**Priority: TIER 3 — needs video content infrastructure**

---

## SECTION 4: GOD MODE LEARNING SYSTEM — UNTOUCHED TECHNIQUES

From `docs/GOD_MODE_LEARNING_SYSTEM.md`. None of these are in any current plan.

### 4.1 Chunk Compression (Expert Chunking)
After every 5 concepts: "What single label unites these 5 concepts?"
Student must extract the meta-pattern. This is what separates experts from novices.
Beginner sees: "Two Sum, Subarray Sum K, Prefix Sum, Count XOR K" → 4 separate problems
Expert sees: "Hash + complement pattern" → 1 chunk

**Implementation:** After Nididhyasanam pause every 5 concepts, add one compression question.
Add `chunkLabel?: string` to Concept for the cluster they belong to.

### 4.2 Variation Training
After learning any pattern: present 3 variations automatically:
1. Bigger input (n=10⁶ instead of n=10)
2. Constraint twist (find K elements, not 1)
3. Opposite condition (elements NOT matching)

This is distinct from the main MCQ — these are forced generalizations.
FSRS effect: passing all 3 variations → advance to Automatic (more reliable gate)

### 4.3 Speed × Accuracy Cycle
Day A (Accuracy mode): unlimited time, perfect solution, no pressure
Day B (Speed mode): timer counts, cut-off, pressure mode
Current app has no explicit Day A mode — everything has at least implicit time tracking.
Add explicit "Accuracy Day" mode where timer is hidden, hint is available, no judgment.

### 4.4 Desirable Difficulty Display
Show the student their difficulty level explicitly: "This is hard. That's the point."
Research: students who understand WHY learning feels hard (desirable difficulty)
persist longer than students who interpret difficulty as a sign they're not smart.

### 4.5 The Compression Principle
After every study block: "What is the smallest rule that explains ALL of this? Write ONE sentence."
This is the COMPRESS stage of the GMLL loop — currently not in the app at all.
The one-liner goes to a concept's `oneLiner` field and is shown in future sessions.

### 4.6 Mental VM Simulation
Before the MCQ options appear: "Before you look at options — simulate the answer mentally."
A 5-second forced pause before options are revealed.
This forces genuine retrieval, not recognition-based answering.
Currently options appear immediately after confidence tap.

### 4.7 Generation Effect (Slamecka & Graf, 1978)
Show a fill-in-blank BEFORE revealing the full concept.
"Two Sum: use a _____ to find complements in O(n)"
Student generates the word (even if wrong) → dramatically stronger encoding than just reading.
This is BEFORE the MCQ — it's part of the encoding phase, not the testing phase.

---

## SECTION 5: GOD MODE CHITTA LAYER — UNTOUCHED

From `docs/GOD_MODE_CHITTA_LAYER.md`.

### 5.1 No-Reference Practice Mode (Niralamba Abhyāsa)
Close all hints, notes, chapter labels. 25-minute pure memory session.
Currently: chapter label always visible, hints always available.
This mode: concept name only, no chapter, no subject, no hint, no AI.
Pure Chitta recall — the student's brain, the concept, nothing else.

### 5.2 Pre-Sleep Visualization (different from Pre-Sleep Review)
The existing `getPreSleepReviewSet` surfaces concepts for review.
But Ratri Sankalpa is different: not review, but VISUALIZATION of solving.
"See yourself solving this problem effortlessly. Not reading — solving."
3 visual cards with a single image/diagram + the concept name.
Student closes eyes for 30 seconds and visualizes applying it.
The visual + kinesthetic component encodes deeper than text review.

### 5.3 Identity Lock-In (Ahamkara Programming)
At milestone moments (first 10 Automatic concepts, first 50, first 100):
Show an identity statement: "You are now a systems thinker."
Not gamification — this is the Ahamkara update that makes practice automatic.
Research: students who internalize "I am a learner" vs. "I am learning" study 40% more.

### 5.4 The 4-Stage Chitta Integration Display
Student should see which LAYER their knowledge is in:
```
Manas      (Unseen/Fragile)    — Conscious struggle required
Buddhi     (Conscious)          — Pattern recognized with effort
Ahamkara   (Automatic)          — Skill becoming identity
Chitta     (ExamReady)          — Automatic, below conscious
```
Currently shown as stage labels. Could be shown as depth metaphor (surface → deep).

---

## SECTION 6: RND_PLANNING — PHASES 2-4 NOT BUILT

From `docs/RND_PLANNING.md`. Phase 1 complete. Phases 2-4 untouched.

### Phase 2 (not started)
- GLOBAL_STATS derived from live concept state (currently hardcoded initial values — real
  stats are computed but the config initializes at 0. Session stats reflect in-memory
  but the config stats don't auto-update from `useConceptStore`)
- ChittaMap: SVG connecting lines between relatedConcepts (currently no edges shown)
- ChittaMap: click node → highlight connected concepts (no interaction currently)

### Phase 3 — AI Integration (not started)
- Dynamic MCQ generation for concepts without hardcoded MCQs
  (currently every concept shows concept NAME as "question" — there are no actual MCQs in data)
- Teach-back grading via Gemini (scores 3 axes: accuracy, completeness, clarity)
- SessionComplete AI insight: analyze pattern of wrong answers, surface root cause
- MorningRecall: Gemini explains the gap after student reveals

**CRITICAL DISCOVERY:** There are NO actual MCQ questions in the concept data.
Each concept has only `name, subject, chapter, unit, pyqTier, stage, stability, difficulty`.
LiveSession shows the concept name as the "question." This means the entire MCQ
mechanism is cosmetic. **The biggest missing piece in the app is real question content.**

### Phase 4 — Full Daily Cycle (not started)
- Evening Review screen (Viveka — explain 2 concepts, mistake journal)
- Pre-sleep Seed screen with VISUAL concept cards (not text)
- Error Pattern Dashboard (weekly clusters with root cause by concept type)
- Adaptive difficulty — STRENGTHEN queue uses harder question variants
- Weekly mock test (comprehensive, timed)
- AI Study Planner

---

## SECTION 7: NEW RESEARCH TO PURSUE

These are techniques referenced in docs that need deeper R&D before building.

### 7.1 Targeted Memory Reactivation (TMR)
Playing soft cue sounds during sleep linked to concepts studied that evening.
Research (from DEEP_RND_PROMPT.md): reactivating specific memories during sleep
is possible via audio cues. Could be implemented as: play a subtle tone during
pre-sleep review, play same tone as a subtle ambient during Nididhyasanam.
The tone becomes a retrieval cue that fires during sleep.
**R&D needed before building.**

### 7.2 Contextual vs. Decontextual Practice
Current: chapter label always shown during questions.
Research question: hiding chapter/subject forces category retrieval BEFORE item retrieval —
this is the interleaving benefit. Real exam shows no chapter labels.
Should TopicsBank be the only place where chapter context is shown?
Should LiveSession hide subject/chapter after Conscious stage?
**R&D needed — affects core session design.**

### 7.3 Worked Example Effect (Expertise Reversal)
For Unseen concepts: show fully worked solution first (beginner benefit).
For Conscious/Automatic: worked examples HURT — they reduce the cognitive load
that drives learning (expertise reversal effect, Sweller).
Current app shows same format for all stages.
**R&D needed — directly affects ConceptEncoding per stage.**

### 7.4 Prana / Breath Interface
The 4-7-8 or box breathing before session start:
- Reduces cortisol → better hippocampal encoding
- Navy SEAL box breathing before high-stakes performance
- Gurukul: Pranayama before study is mandatory
- Takes 90 seconds. Evidence suggests measurable encoding improvement.
Current Pancha Kosha check (Day 3) has a "3 breaths" checkbox. 
Could be expanded to a proper guided breathing sequence.

### 7.5 Exercise Prompt
From Effective_Learning_Strategy.md: exercise before/after study improves
retention (increases blood flow to hippocampus, fires neurons).
Rodriguez (Scientific American, 2015): exercising AFTER studying boosts recall.
Simple intervention: "Did you exercise today? Even a 10-minute walk?"
Could influence session length and new concept count.

---

## SECTION 8: PRIORITY MATRIX

What to build in what order. Three tiers.

### Tier 1 — Maximum impact, minimum new infrastructure
These use existing patterns, need few new data fields, high evidence base.

| Feature | Source | Time |
|---|---|---|
| Fix 5 critical bugs | BUILD_STATE | 2h |
| Ritambhara Prajna (<3s = patternPerceptionCount) | EXTREME_VEDIC | 30min |
| Flow Engineering (detect flow, suppress UI noise) | EXTREME_VEDIC | 2h |
| Guru Function state classification | EXTREME_VEDIC | 3h |
| Mental VM Simulation (5s pause before options) | GOD_MODE | 30min |
| Generation Effect (fill-in-blank before concept) | RND_PLANNING | 2h |
| Poorva Paksha data + screen | EXTREME_VEDIC | 4h |

### Tier 2 — New screens, new data fields, high value
Continue the 2-week Vedic plan, then:

| Feature | Source | Time |
|---|---|---|
| Brahma Muhurta + Viveka ring | VEDIC_2WEEK | 2h |
| Nididhyasanam → upgrade to Yoga Nidra | VEDIC + EXTREME | 3h |
| Pancha Kosha check | VEDIC_2WEEK | 2h |
| Mananam 3-question phase | VEDIC_2WEEK | 3h |
| Tapas mode | VEDIC_2WEEK | 2h |
| Samskara depth composite | VEDIC_2WEEK | 3h |
| Multi-path retrieval modes | VEDIC_2WEEK | 5h |
| Neti-Neti post-error | VEDIC_2WEEK | 4h |
| Teach-back (Satsang) | VEDIC_2WEEK | 5h |
| Sadhana Chatushtaya profile | EXTREME_VEDIC | 4h |
| Krama prerequisite engine + data | EXTREME_VEDIC | 5h |
| Chunk Compression after 5 concepts | GOD_MODE | 2h |
| Variation Training (3 variants per concept) | GOD_MODE | 3h |

### Tier 3 — Infrastructure, content, or R&D first

| Feature | Source | Blocker |
|---|---|---|
| Real MCQ content per concept | RND_PLANNING | Needs AI generation (Gemini) or manual |
| Dynamic MCQ via Gemini | RND_PLANNING | Needs MCQ infrastructure |
| Anusandhana micro-tests | EXTREME_VEDIC | Needs Capacitor Push Notifications |
| Pre-sleep visualization screen | GOD_MODE_CHITTA | Needs visual cards per concept |
| Mantra compression | EXTREME_VEDIC | Needs cluster data |
| Expert video demonstrations | EXTREME_VEDIC | Needs video content |
| Targeted Memory Reactivation | DEEP_RND | Needs R&D first |
| Contextual vs decontextual practice | DEEP_RND | Needs A/B testing plan |
| Identity lock-in / Ahamkara programming | GOD_MODE_CHITTA | Needs milestone system |

---

## SECTION 9: THE SINGLE BIGGEST MISSING PIECE

Every screen, every algorithm, every technique above operates on one assumption:
**each concept has a real MCQ question.**

Looking at the actual data: `src/syllabus/dsa/concepts.ts` — each concept has
`name, subject, chapter, unit, pyqTier, stage, stability, difficulty, lastTested, nextReview`
and the enriched neuroscience fields.

There are **no questions**. No options. No correct answer index. No explanation.

LiveSession shows the concept NAME in the question card. The "MCQ" options are generated
from a handful of hardcoded rating buttons (Clean/Partial/Fail in some modes).

**This is the Phase 3 prerequisite from RND_PLANNING:**
Use Gemini to generate 1 MCQ per concept (question, 4 options, correct index, explanation).
Store as `concept.mcq: { question, options, correct, explanation }`.

Until this is built, the entire MCQ mechanism is cosmetic — students are rating
their own recall, not answering actual questions.

---

## SUMMARY: THE STACK TO BUILD

```
LAYER 0 (NOW)    — Fix 5 bugs. Without this, Layers 1-9 are cosmetic.

LAYER 1 (WEEK 1) — Quick wins from EXTREME_VEDIC + small GOD_MODE additions
  Ritambhara Prajna, Flow Engineering, Mental VM pause, Generation Effect

LAYER 2 (WEEK 2) — Vedic 2-week plan (already planned, start building)
  KoshaCheck, Nididhyasanam→YogaNidra, Mananam, Tapas, Samskara

LAYER 3 (WEEK 3) — Advanced Extreme Vedic
  Poorva Paksha, Guru Function, Sadhana Profile, Multi-path retrieval

LAYER 4 (WEEK 4) — Content infrastructure
  MCQ generation via Gemini, real question per concept

LAYER 5 (WEEK 5) — Full daily cycle
  EveningReview, PreSleep visualization, Anusandhana, Krama prerequisite

LAYER 6 (ONGOING) — Research → implement
  TMR, Contextual practice, Worked example effect, Exercise prompt
```

---

## RESEARCH GAPS (R&D before building)

These are unanswered questions that should be researched before implementing:

1. **Does hiding chapter labels after Conscious stage improve exam performance?**
   If yes: major change to LiveSession design.

2. **What is the optimal first-exposure sequence for a new concept?**
   (Text → visual → audio → fill-in-blank → MCQ? Or a different order?)
   From RND_PLANNING: specific per-stage encoding sequences exist but not implemented.

3. **How many new concepts per session before working memory saturation?**
   Current: 30% of 20 = 6 new concepts. Research suggests 3-4 may be optimal.

4. **What exactly to show in the last 5 minutes before sleep?**
   Text? Visual? Audio? Questions or answers? How many concepts?

5. **Is the 4-6 AM Brahma Muhurta window supported by chronobiology?**
   Or does it depend on sleep chronotype? (Night owls vs. morning types)

6. **Does Yoga Nidra work via app guidance or require a physical instructor?**
   The MIT study used a specific protocol — does text/audio guidance replicate it?

---

*The Rishis solved a harder problem. They memorized 10,000+ lines of the Vedas perfectly.*
*CHITTA has 1,650 concepts.*
*We are recovering their methods and giving them an AI backbone.*
*Every technique above is either verified by neuroscience or field-tested across centuries.*
*There are no experiments here — only implementations.*
