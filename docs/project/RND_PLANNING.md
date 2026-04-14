# CHITTA — R&D & Planning Document
### AI-Powered Unconscious Mastery System for NEET 2026

---

## WHAT WE ARE BUILDING

Not another exam app. A **cognitive reprogramming engine**.

| Regular Apps | CHITTA |
|---|---|
| Deliver content | Program the subconscious (Chitta layer) |
| Track study time | Track automaticity — Chitta Score |
| Show videos | Force active retrieval under pressure |
| Anki-level flashcards | Full FSRS + multi-modal encoding pipeline |
| Generic analytics | Per-concept FSRS state + AI error pattern analysis |

**Core Promise:** A student who finishes CHITTA's pipeline doesn't *remember* answers — the answers *appear automatically*.

This is the difference between **Conscious** (can recall with effort) and **Automatic** (answer appears before you think). NEET rewards Automatic. The entire system is engineered to get concepts there.

---

## THE PHILOSOPHICAL FOUNDATION

### The SADHANA Cycle (Vedic Pedagogy)

Every session follows this 2,000-year-old model:

```
Śravaṇa  → Manana → Nididhyāsana → Abhyāsa → Anubhava → Viveka → Vairāgya
(Listen)    (Reflect)  (Internalize)  (Practice) (Experience) (Discern) (Detach)
```

| Stage | Modern Form | App Feature |
|-------|------------|-------------|
| Śravaṇa | Read/watch concept | ConceptEncoding — text + diagram |
| Manana | "Why does this work?" | Elaborative interrogation via AI |
| Nididhyāsana | Teach in own words | Teach-back to AI (graded) |
| Abhyāsa | Repetitive practice | FSRS-scheduled MCQ sessions |
| Anubhava | See result — concept clicked | Stage advancement notification |
| Viveka | What went wrong? | Error pattern dashboard |
| Vairāgya | No ego, just process | Streak system focused on process |

### The Antahkarana Model (Vedantic Mind Architecture)

The system targets the deepest layer of mind:

```
MANAS    (मनस्)   → Surface mind, conscious struggle, working memory
   ↓
BUDDHI   (बुद्धि)  → Intellect, pattern recognition, "aha!" moments
   ↓
AHAMKARA (अहंकार) → Identity: "I am a NEET qualifier"
   ↓
CHITTA   (चित्त)  → Subconscious storage, automaticity ← THE TARGET
```

**Translation to neuroscience:**
- MANAS = Prefrontal cortex (conscious effort)
- BUDDHI = Hippocampus + cortex (pattern recognition)
- AHAMKARA = mPFC self-referential processing
- CHITTA = Basal ganglia + long-term potentiation (automatic behavior)

### The God Mode Learning Loop (GMLL)

Applied to every new concept introduction:

```
INPUT (20-30m) → MODEL (10m) → STRUGGLE (30-60m) → TEST (15m)
→ COMPRESS (5m) → STORE (5m) → REUSE (ongoing)
```

| Stage | Action | Neuroscience |
|-------|--------|-------------|
| INPUT | Read + watch concept | Initial neural encoding |
| MODEL | Draw diagram, build mental map | Spatial + visual memory traces |
| STRUGGLE | Solve MCQs without help | **Myelin growth** — struggle = learning signal |
| TEST | Verify understanding | Testing effect: 50% better retention |
| COMPRESS | Write one-liner rule | Expert chunking |
| STORE | Flashcard + FSRS queue | Memory consolidation |
| REUSE | Answer in mixed session | Transfer learning |

**Key insight:** Struggle is NOT a failure signal. It is the signal of neural rewiring happening.

---

## THE ALGORITHMS

### 1. FSRS Memory Model

Every concept is tracked with 3 parameters at all times:

```
S = Stability       → how long memory lasts (days)
D = Difficulty      → how hard this concept is for this learner (0–1)
R = Retrievability  → probability of recall RIGHT NOW (0–1)

Formula: R(t) = e^(−t / S)
  where t = days since last review

Examples:
  S=1,  t=1d   → R = 37%   (almost forgotten)
  S=7,  t=3d   → R = 65%   (stable)
  S=30, t=10d  → R = 72%   (very stable)
  S=89, t=3d   → R = 97%   (Automatic — Mendelian Inheritance)
```

**FSRS Update Rules (after each answer):**

```
Wrong answer:
  S_new = 1              (reset — memory broken)
  D_new = D + 0.15       (concept harder for this learner)

Correct but slow (> optimal time):
  S_new = S × 1.2        (consolidating, not automatic yet)
  D_new = D − 0.05

Correct and fast:
  S_new = S × 1.5        (strong recall — approaching automatic)
  D_new = D − 0.10
```

**Review trigger:** Concept is DUE when R drops below 85%.

**Target for exam day:** S > 60 days across all Tier 1 concepts = safe even after a 2-month review gap.

### 2. Concept Stage Lifecycle

```
Stage 0: UNSEEN      → not yet introduced
Stage 1: FRAGILE     → seen once, R decays fast (S ≈ 1–3d)
Stage 2: CONSCIOUS   → recall with effort, 5–10 sec (S ≈ 5–20d)
Stage 3: AUTOMATIC   → answer appears instantly (S > 20d) ← CHITTA
```

**Stage transition rules:**
```
0 → 1: First exposure (encoding session completed)
1 → 2: 3+ correct answers + S > 5 days
2 → 3: Correct + fast answer + S > 20 days
3 → 2: Wrong answer on an Automatic concept (regression)
```

### 3. Session Builder Algorithm

Every session is built from 4 queues with fixed proportions:

```
Total session = 35% DUE + 30% NEW + 25% STRENGTHEN + 10% CHALLENGE
```

| Queue | Source | Priority | Purpose |
|-------|--------|----------|---------|
| DUE (35%) | Stage 1/2/3, R < 0.85 | Lowest R first | Prevent forgetting |
| NEW (30%) | Stage 0 (Unseen) | Highest PYQ tier first | Expand coverage |
| STRENGTHEN (25%) | Stage 2, not due | Random within stage | Push toward Automatic |
| CHALLENGE (10%) | Stage 3 (Automatic) | Random | Verify true mastery |

**Subject interleaving (critical):**
```
Biology 50% : Chemistry 25% : Physics 25%
Rule: Never 2 consecutive questions from same subject or same chapter
```

**Why interleaving matters:** Kornell & Bjork (2008) — 43% better retention vs. blocked practice. Forces brain to ask "WHICH pattern applies?" exactly like the real exam does.

### 4. Multi-Modal Encoding Per Stage

A concept becomes Automatic only when encoded in **multiple brain regions simultaneously**:

| Modality | Brain Region | Best For |
|----------|-------------|---------|
| Reading text | Wernicke's area | Definitions, mechanisms |
| Diagrams | Visual cortex + hippocampus | Cycles, structures, processes |
| Audio (TTS) | Auditory cortex | Sequences, mnemonics |
| Writing by hand | Motor + frontal cortex | Formulas, reactions |
| Teaching aloud | Broca's area + PFC | Deep understanding |
| Solving MCQs | Prefrontal cortex | Application + retrieval |

**Encoding sequence per concept:**

```
STAGE 0 → 1  (Day 1, First Exposure)
  - Visual primer: 30-sec diagram
  - Text explanation: 2-min read
  - AI prompt: "In your own words?"
  - 1 example MCQ (observe, don't solve yet)
  - Auto-generate one-liner + flashcard

STAGE 1 → 2  (Day 2–7)
  - Morning recall: blank page recall attempt
  - 3 MCQs under time pressure
  - Teach-back: explain to AI in 60 sec
  - Gap re-encoding (not full concept again)

STAGE 2 → 3  (Week 2–8)
  - Questions served WITHOUT chapter label
  - 15-second timer (exam pace)
  - Mixed with 3 other subjects (interleaved)
  - Application questions: new context, never seen before

STAGE 3 MAINTENANCE
  - Review intervals extend: 30 → 60 → 90 → 180 days
  - Only resurfaces on: wrong answer, or 30 days pre-exam sweep
```

### 5. The 7 Memory Techniques (Applied Every Session)

1. **Spaced Repetition** — FSRS scheduling fights the Ebbinghaus forgetting curve
2. **Active Retrieval** — MCQ before re-reading (Roediger & Karpicke: 50% better retention)
3. **Interleaving** — Never blocked practice (43% better retention at test time)
4. **Elaborative Interrogation** — AI asks "Why?" to connect to prior knowledge
5. **Dual Coding** — Text + diagram always together (Paivio, 1971)
6. **Concrete Examples** — 2 real-world examples per concept auto-generated
7. **Generation Effect** — Fill-in-blank before revealing content (Slamecka & Graf, 1978)

### 6. Chitta Integration Protocol (Daily Cycle)

```
🌅 MORNING — Pratah Smaran (10 min)
  First 20 min after waking, eyes closed
  Ask: "What did I learn yesterday?" WITHOUT notes
  Struggle to recall — this IS the practice
  Then verify gaps only
  → App: MorningRecall screen, blank inputs, self-grade

🌞 STUDY SESSION — Abhyāsa (2–3 hours)
  FSRS-built queue: DUE + NEW + STRENGTHEN + CHALLENGE
  → App: LiveSession → ConceptEncoding (new only) → loop → SessionComplete

🌆 EVENING — Viveka (15 min)
  Explain-back 2 concepts to AI (Feynman test)
  Mistake journal auto-populated
  → App: EveningReview screen (Phase 4)

🌙 PRE-SLEEP — Ratri Sankalpa (5 min)
  3 visual concept cards from today
  Visualize solving — not reading — before sleep
  Theta wave state = maximum hippocampal plasticity
  → App: "Seed Tonight" button → 3 visual cards
```

---

## CURRENT STATE AUDIT (Google Stitch Prototype)

### What Works
- FSRS formula `R = e^(-t/S)` correctly implemented
- Session builder with 35/30/25/10 queue proportions
- Interleaving logic (no 2 same subject in a row)
- Glass morphism UI direction and design language
- Concept data model — solid foundation

### What is Broken or Fake

| Bug | Location | Impact |
|-----|---------|--------|
| Every question shows same hardcoded Krebs Cycle MCQ | `LiveSession` L479 | Entire session feels fake |
| Answering never updates FSRS state — data frozen | No `onAnswer` handler | Core algorithm never runs |
| Routes to Encoding after every answer, not just new | `handleNext()` L436 | Wrong flow for review/strengthen |
| Timer shows static text, never counts down | `LiveSession` L471 | Core UX promise broken |
| Answer reveal always shows "Incorrect" | `confirmed` block L530 | Wrong feedback always |
| MorningRecall inputs are decorative divs | L851–856 | Dead UI, can't type |
| ConceptEncoding content hardcoded to 3 subjects | L645–651 | Wrong context every time |
| 1030 lines in one file | `App.tsx` | Impossible to scale or maintain |
| No persistence — refresh loses all progress | No localStorage | Unusable as a real tool |
| Bottom nav "Profile" maps to SessionComplete | `BottomNav` L223 | Wrong navigation entirely |
| Fragile nodes use `animate-ping` (invisible) | `ChittaMap` L683 | Visual bug |
| Modality selector (Read/Listen/Draw/Quiz) unclickable | `ConceptEncoding` L629 | Dead UI |

### Verdict
The prototype is a **UI mockup** with a correct algorithm underneath but fake data flow throughout. The skeleton is right. The muscles don't exist yet.

---

## DATA MODEL

### Concept (complete — what it needs to be)

```typescript
interface MCQ {
  question: string;
  options: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;       // index of correct option
  explanation: string;            // shown after answer
}

interface Concept {
  id: string;
  name: string;
  subject: 'Physics' | 'Chemistry' | 'Biology';
  chapter: string;
  unit: number;
  pyqTier: 1 | 2 | 3 | 4;       // exam frequency tier

  // FSRS state — updates after every answer
  stage: 'Unseen' | 'Fragile' | 'Conscious' | 'Automatic';
  stability: number;              // S — days
  difficulty: number;             // D — 0 to 1
  lastTested: number;             // days ago
  nextReview: number;             // days until due

  // Content — currently missing from all 33 concepts
  explanation: string;            // 150–200 word explanation
  oneLiner: string;               // the COMPRESS output
  encodingTip: string;            // subject-specific learning tip
  relatedConcepts: string[];      // concept ids for ChittaMap edges

  // MCQ — currently 1 hardcoded globally, needs 1 per concept minimum
  mcq: MCQ;
}
```

### Session State

```typescript
interface SessionAnswer {
  conceptId: string;
  queue: 'review' | 'new' | 'strengthen' | 'challenge';
  selectedOption: number;
  correct: boolean;
  timeTaken: number;              // seconds
  sBefore: number;
  sAfter: number;
  dBefore: number;
  dAfter: number;
}

interface SessionState {
  items: SessionItem[];
  currentIndex: number;
  answers: SessionAnswer[];
  startedAt: number;              // timestamp
}
```

### Student Profile (for persistence)

```typescript
interface StudentProfile {
  name: string;
  examDate: string;               // ISO date
  conceptStates: Record<string, {
    stage: Stage;
    stability: number;
    difficulty: number;
    lastTested: number;
  }>;
  totalSessions: number;
  chittaScore: number;            // count of Automatic concepts
  lastUpdated: number;            // timestamp
}
```

---

## FILE STRUCTURE (target)

```
src/
  data/
    concepts.ts          ← all MOCK_CONCEPTS with real MCQs
    constants.ts         ← NEET_TOTALS, SUBJECT_WEIGHTS, NEET_QUESTIONS
  engine/
    fsrs.ts              ← calculateR, isDue, applyFSRS
    session.ts           ← buildSession, interleaving logic
  components/
    screens/
      Dashboard.tsx
      LiveSession.tsx
      ConceptEncoding.tsx
      ChittaMap.tsx
      MorningRecall.tsx
      SessionComplete.tsx
    ui/
      GlassCard.tsx
      BottomNav.tsx
      StatusBar.tsx
      TierBadge.tsx
  hooks/
    useSession.ts        ← session state + answer handling + FSRS updates
    useTimer.ts          ← countdown timer with useEffect
    usePersistence.ts    ← localStorage read/write for concept states
  App.tsx                ← routing only, ~50 lines
```

---

## FSRS ENGINE (exact implementation)

```typescript
// src/engine/fsrs.ts

export const calculateR = (stability: number, daysSince: number): number => {
  if (daysSince < 0 || stability <= 0) return 0;
  return Math.exp(-daysSince / stability);
};

export const isDue = (c: Concept): boolean =>
  c.stage !== 'Unseen' && calculateR(c.stability, c.lastTested) < 0.85;

export const applyFSRS = (
  concept: Concept,
  correct: boolean,
  responseTime: number   // seconds
): Concept => {
  const s = concept.stability;
  const d = concept.difficulty;
  const optimalTime = concept.subject === 'Biology' ? 30 : 90;

  let sNew: number;
  let dNew: number;

  if (!correct) {
    sNew = 1;
    dNew = Math.min(1, d + 0.15);
  } else if (responseTime > optimalTime) {
    sNew = s * 1.2;
    dNew = Math.max(0, d - 0.05);
  } else {
    sNew = s * 1.5;
    dNew = Math.max(0, d - 0.10);
  }

  // Stage transitions
  let stage = concept.stage;
  if (correct && stage === 'Unseen')    stage = 'Fragile';
  if (correct && stage === 'Fragile'  && sNew > 5)  stage = 'Conscious';
  if (correct && stage === 'Conscious' && sNew > 20) stage = 'Automatic';
  if (!correct && stage === 'Automatic') stage = 'Conscious';
  if (!correct && stage === 'Conscious') stage = 'Fragile';

  return {
    ...concept,
    stability: parseFloat(sNew.toFixed(2)),
    difficulty: parseFloat(dNew.toFixed(2)),
    stage,
    lastTested: 0,
    nextReview: Math.ceil(sNew),
  };
};
```

---

## SESSION HOOK (exact implementation)

```typescript
// src/hooks/useSession.ts

export const useSession = (
  concepts: Concept[],
  setConcepts: React.Dispatch<React.SetStateAction<Concept[]>>
) => {
  const [sessionItems]   = useState(() => buildSession(concepts, 43));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<SessionAnswer[]>([]);

  const currentItem = sessionItems[currentIndex];

  const onAnswer = (selectedOption: number, timeTaken: number) => {
    const { concept, queue } = currentItem;
    const correct = selectedOption === concept.mcq.correct;

    const answer: SessionAnswer = {
      conceptId: concept.id,
      queue,
      selectedOption,
      correct,
      timeTaken,
      sBefore: concept.stability,
      dBefore: concept.difficulty,
      sAfter: 0,
      dAfter: 0,
    };

    // Apply FSRS update
    const updated = applyFSRS(concept, correct, timeTaken);
    answer.sAfter = updated.stability;
    answer.dAfter = updated.difficulty;

    setConcepts(prev =>
      prev.map(c => c.id === concept.id ? updated : c)
    );
    setAnswers(prev => [...prev, answer]);
  };

  const advance = (setScreen: (s: Screen) => void) => {
    const isNew = currentItem.queue === 'new';
    if (isNew) {
      setScreen('encoding');
      return;
    }
    if (currentIndex >= sessionItems.length - 1) {
      setScreen('complete');
      return;
    }
    setCurrentIndex(i => i + 1);
  };

  const afterEncoding = (setScreen: (s: Screen) => void) => {
    if (currentIndex >= sessionItems.length - 1) {
      setScreen('complete');
    } else {
      setCurrentIndex(i => i + 1);
      setScreen('session');
    }
  };

  return { currentItem, currentIndex, sessionItems, answers, onAnswer, advance, afterEncoding };
};
```

---

## TIMER HOOK

```typescript
// src/hooks/useTimer.ts

export const useTimer = (limitSeconds: number, onExpire: () => void) => {
  const [timeLeft, setTimeLeft] = useState(limitSeconds);

  useEffect(() => {
    if (timeLeft <= 0) { onExpire(); return; }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  const reset = () => setTimeLeft(limitSeconds);

  return { timeLeft, reset };
};
```

---

## PHASE BUILD PLAN

### Phase 0 — Foundation (Week 1)
*Fix the base before any new feature*

- [ ] Split `App.tsx` into the target file structure above
- [ ] Add real MCQ to all 33 existing mock concepts
- [ ] Add `explanation`, `oneLiner`, `encodingTip`, `relatedConcepts` to all 33 concepts
- [ ] Implement `applyFSRS()` in `engine/fsrs.ts`
- [ ] Implement `useSession` hook — wire `onAnswer` throughout
- [ ] Add `localStorage` persistence (read on load, write after every answer)
- [ ] Fix `animate-ping` → `animate-pulse` on Fragile nodes in ChittaMap

### Phase 1 — Working Session Loop (Week 2)
*The critical flow that must work end-to-end*

- [ ] `useTimer` hook + real countdown in LiveSession
- [ ] Dynamic question from `concept.mcq` (not hardcoded)
- [ ] Correct/Incorrect based on `selected === concept.mcq.correct`
- [ ] FSRS update on every confirmed answer
- [ ] Routing: `encoding` only when `queue === 'new'`
- [ ] ConceptEncoding: real content from `concept.explanation` + `concept.oneLiner`
- [ ] Modality selector: add `useState` so it's actually interactive
- [ ] MorningRecall: replace decorative divs with `<textarea>` inputs + self-grade buttons
- [ ] Fix BottomNav: `Profile` → new profile screen, not SessionComplete

**The session flow after Phase 1:**
```
Dashboard → [Start Session]
  └─→ LiveSession (real MCQ, real timer, real answer check)
        ├─→ (queue !== 'new') → next question in session
        ├─→ (queue === 'new') → ConceptEncoding (real content)
        │     └─→ [I Understand] → back to LiveSession → next question
        └─→ (last question) → SessionComplete (real stats)
              └─→ [Home] → Dashboard (updated Chitta Score)
```

### Phase 2 — Real Content (Week 3)
*Scale from 33 → 200 concepts*

- [ ] Add all NEET Tier 1 concepts (15+ PYQ frequency) — ~120 concepts
- [ ] Add all NEET Tier 2 concepts — ~80 concepts
- [ ] ChittaMap: SVG lines between `relatedConcepts`
- [ ] ChittaMap: click node → highlight connected nodes
- [ ] GLOBAL_STATS: derive from live concept state (not hardcoded constants)
- [ ] Dashboard exam readiness: recalculate from live concept states

### Phase 3 — AI Integration (Week 4)
*Use the Gemini key that's already wired*

- [ ] Dynamic MCQ generation for concepts without hardcoded MCQs
- [ ] Teach-back grading: student types explanation → Gemini scores 0–3
- [ ] Score maps to FSRS response quality (not binary pass/fail)
- [ ] SessionComplete AI Insight: Gemini analyzes wrong answers → pattern
- [ ] MorningRecall: Gemini explains gaps after reveal

```typescript
// Teach-back prompt pattern
const prompt = `
  Concept: ${concept.name} (${concept.chapter}, NEET ${concept.subject})
  Student explanation: "${studentText}"
  
  Grade on 3 axes (score 0-3 each):
  1. Accuracy: are the facts correct?
  2. Completeness: are key points covered?
  3. Clarity: would another student understand this?
  
  Return JSON: { accuracy: n, completeness: n, clarity: n, feedback: "..." }
`;
```

### Phase 4 — Full Daily Cycle (Week 5+)
*The complete GOD MODE loop, end to end*

- [ ] EveningReview screen: explain-back 2 concepts, mistake journal
- [ ] Pre-sleep Seed screen: 3 visual concept cards (visual, not text)
- [ ] Error Pattern Dashboard: weekly clusters, root cause by concept type
- [ ] Adaptive difficulty: STRENGTHEN queue uses harder question variants
- [ ] Weekly mock test simulation (45+45+90 = 180 questions, 3-hour timer)
- [ ] AI Study Planner: morning recommendation based on FSRS state + exam countdown

---

## NEET CONTENT SCOPE

### Total concepts to cover

| Subject | Tier 1 | Tier 2 | Tier 3 | Tier 4 | Total |
|---------|--------|--------|--------|--------|-------|
| Biology | ~180 | ~200 | ~200 | ~200 | ~780 |
| Chemistry | ~120 | ~140 | ~140 | ~120 | ~520 |
| Physics | ~80 | ~90 | ~90 | ~90 | ~350 |
| **Total** | **~380** | **~430** | **~430** | **~410** | **~1,650** |

### Priority order for content build

```
Sprint 1: All Tier 1 across 3 subjects (~380 concepts with MCQs)
Sprint 2: All Tier 2 (~430 concepts)
Sprint 3: Tier 3 + 4 (~840 concepts)
```

### Exam pattern (NEET 2026)

- 3 hours, 180 MCQs
- Physics: 45Q | Chemistry: 45Q | Biology: 90Q
- Questions appear in random mixed order (not by chapter)
- No negative marking (as of 2024 rules)
- Passing ~120/180 gets a good rank; top rank needs ~165+/180

**Critical implication:** Students must be at Stage 3 (Automatic) for Tier 1 concepts. Conscious-level (Stage 2) knowledge is too slow under exam time pressure.

---

## WHAT MAKES THIS DIFFERENT

### vs. Unacademy / PW / Byju's

```
They deliver: content (videos, notes, PDFs)
We deliver:   cognitive state (FSRS-tracked automaticity per concept)

They measure: hours watched, tests attempted
We measure:   Chitta Score — % of syllabus at Stage 3 (Automatic)

They stop at: Conscious mastery (you can recall with effort)
We target:    Automatic mastery (answer appears before you think)
```

### The Chitta Score is the only metric that matters

```
Day 1:    Consciously struggle with Krebs Cycle (Stage 1/2)
Day 7:    Recalling with some effort (Stage 2)
Day 21:   Appears in answers automatically (Stage 3)
Day 60+:  Part of how you think. In your Chitta.
```

The score board other apps don't have: **"247 concepts are now subconscious. 403 more to Stage 3 by exam day."**

---

## SUCCESS METRICS

### Per concept
- Stage: 0–3 (Unseen → Automatic)
- Stability (S): days memory lasts
- Difficulty (D): how hard for this learner
- Retrievability (R): probability of recall right now

### Per session
- Accuracy: % correct
- Speed: average seconds per question vs. target (Biology 30s, Physics/Chem 90s)
- Chitta delta: how many concepts advanced a stage today

### Per student (the only dashboard that matters)
- **Chitta Score:** X / 1,650 concepts at Automatic
- **Exam readiness:** estimated correct answers today (computed from mastery distribution)
- **Days to target:** at current pace, reach 90% Automatic by [date]

---

## SAMSKARA FORMATION (The Science Behind the App)

Not all practice creates lasting impressions. The formula:

```
Samskara Strength = Attention × Emotion × Repetition × Struggle
```

| Element | What Breaks It | What Builds It |
|---------|---------------|---------------|
| Attention | Phone nearby, tab switching | Single task, timer running |
| Emotion | Boredom, passive reading | Personal meaning, progress visible |
| Repetition | One-time study | FSRS scheduling — right intervals |
| Struggle | Too easy (copy-paste) | Questions at edge of ability |

**Anti-patterns the app must prevent:**
- Passive watching without solving
- Revealing answer before genuine attempt
- Doing only easy (Stage 3) challenge questions
- Studying without retrievability tracking

---

## REFERENCES (Research Backing)

- Ebbinghaus (1885) — Forgetting Curve → spaced repetition necessity
- Roediger & Karpicke (2006) — Testing Effect → retrieval practice > re-reading
- Kornell & Bjork (2008) — Interleaving → 43% better retention
- Paivio (1971) — Dual Coding Theory → text + image = 2 memory traces
- Slamecka & Graf (1978) — Generation Effect → generating > receiving
- Piech et al. (2015) — Deep Knowledge Tracing → LSTM per-concept prediction
- FSRS Algorithm (Tiankai Tu, 2023) — better than Anki SM-2 for retention

---

*Built on: GOD MODE Learning System + OffSec Methodology + Vedic Sādhanā + Cognitive Neuroscience*

*The equation: Consistency × Difficulty × Reflection × Time = Mastery*

*The goal: Knowledge is not something you collect. It is something you BECOME.*
