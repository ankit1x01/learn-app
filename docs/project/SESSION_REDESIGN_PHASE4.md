# Session Redesign — Phase 4: Active Learning Loop

**Status:** Planning  
**Priority:** Critical — Core learning effectiveness  
**Blocking:** All other feature work until approved

---

## Problem: Current Session is Passive

**Current Flow:**
```
Show question → Select answer → Show feedback → Move on
```

**Issues:**
- ❌ No active recall (brain doesn't encode)
- ❌ No prediction (no mistake learning)
- ❌ No struggle (too smooth, low retention)
- ❌ Mistakes not tracked or repeated
- ❌ No Socratic feedback (just explanation)
- ❌ Concepts isolated (no connections)

**Result:** User watches, doesn't think. Low retention.

---

## Solution: Prediction-First Learning Loop

**New Flow:**

### Stage 1: Concept Brief (10-15 seconds)
```
[Concept name] [Subject badge]
─────────────────────
[Visual: concept diagram or key insight]

Definition snippet (1 sentence)
Key trigger conditions
```

### Stage 2: PREDICT (Active Recall)
```
Before seeing content:

❓ "What will happen when...?"
   A) Option A
   B) Option B
   C) Option C
   D) Option D

⏱️ Track prediction time + user confidence
```

**Why:** Brain must predict before seeing answer. Mistake = deep learning.

### Stage 3: QUESTION (Challenge)
```
[Full MCQ or challenge question]

Show actual content/diagram/simulation
User selects answer + confidence level
```

**Track:**
- Response time
- Confidence level
- Hesitation indicators

### Stage 4: FEEDBACK (Socratic)
```
If CORRECT:
  ✓ Right! [Explanation]
  → Why this option is correct
  → Common mistake (what students pick)
  → Next concept to learn

If WRONG:
  ✗ Not quite. [Explanation]
  → Why this is wrong
  → Why your choice seemed right
  → Key concept you missed
  → Visual/simulation showing correct answer
```

### Stage 5: MISTAKE ENGINE
```
Track:
  • Wrong answer
  • Prediction error (prediction ≠ actual)
  • Confidence mismatch (confident but wrong)
  • Response time (hesitation)

Mark for repetition:
  • Weak concepts flagged
  • Move to "review soon" queue
  • Increase difficulty next time
```

### Stage 6: REINFORCEMENT
```
Connection to other concepts:
  "This relates to: Circular Motion → Torque"
  
Socratic question for next session:
  "If you change the mass, what happens?"
```

---

## Proposed Session Structure

**Session = 20 concepts per day (FSRS-scheduled)**

### Step 1: FSRS Determines Topic
```
FSRS Scheduler:
  → Due today? (R < 0.85)
  → Time of day?
  → Fatigue level?
  
Output: [Concept1, Concept2, Concept3, ...]
        [Stage: Fragile, Conscious, Automatic]
```

### Step 2-4: Per Concept Loop
**Each concept slot includes:**

1. **Concept Brief** (5-10s)
   - Name, subject badge, definition
   - Key trigger conditions
   - Visual diagram

2. **Prediction MCQ** (Active Recall)
   - "What happens when...?"
   - User predicts before seeing full content
   - Tracks prediction time + confidence

3. **Main MCQs** (2-3 questions)
   - Different angles on same concept
   - Increasing difficulty
   - Track response time + confidence

4. **Game with Topic Data** (Interactive practice)
   - Game populated with concept-specific data
   - Example: "Projectile Motion" game shows actual parabolic trajectories
   - Example: "Circular Motion" game tracks centripetal forces
   - Not generic games — **contextualized to the concept**
   - Track game score + time taken

5. **Enhanced Feedback** (Socratic)
   - Why correct/incorrect
   - Connection to related concepts
   - Prediction error analysis
   - Confidence calibration

6. **Mistake Tracking** (Invisible)
   - Log wrong answers
   - Flag for repetition
   - Increase difficulty next time

**Total per concept:** ~3-4 minutes (concept brief + 2-3 MCQs + 1 game + feedback)

**Session composition:**
- **40%** Review (due, spaced)
- **30%** New concepts
- **20%** Strengthening (conscious → automatic)
- **10%** Challenge (mixing multiple concepts)

**Total session time:** 60-80 minutes (20 concepts × 3-4 min each)

---

## Implementation Breakdown

### Phase 4.1: FSRS Topic Selection
- Display which topic FSRS selected
- Show: Topic name, stage (Fragile/Conscious/Automatic), why selected
- Concept brief + visual
- Sets context for all downstream MCQs and games

### Phase 4.2: Prediction Screen
- New component: `ConceptPrediction.tsx`
- Shows brief + prediction MCQ
- Tracks prediction time + confidence
- User predicts before seeing actual question

### Phase 4.3: MCQ Flow
- Modify `LiveSession.tsx` to show 2-3 MCQs per concept
- Different angles on same concept
- Increasing difficulty
- Track confidence + response time

### Phase 4.4: Game Integration (CRITICAL)
- **New:** `ConceptGameRunner.tsx` component
- Game selection: Pick game type relevant to concept
  - Example: "Circular Motion" → PhysicsPlayground type=circular_motion
  - Example: "Projectile Motion" → PhysicsPlayground type=projectile
  - Example: "Chemistry Equations" → EquationBalancer
- **Data Population:** Pass concept data to game
  ```ts
  <ConceptGameRunner
    concept={concept}
    gameType="physics_simulation"
    popups={{ forces: true, velocity: true }}
  />
  ```
- Track game performance: score, time, mistakes
- Auto-advance on completion

### Phase 4.5: Enhanced Feedback
- New component: `SocraticFeedback.tsx`
- Show why correct/incorrect
- Show common student mistakes
- Prediction error analysis
- Connect to related concepts
- Socratic follow-up question (optional)

### Phase 4.6: Mistake Engine
- Extend `Concept` type with `mistakeLog`
- Track: 
  - Wrong answers
  - Prediction errors (predicted ≠ actual)
  - Confidence mismatches (confident but wrong)
  - Game failures
- Flag for repetition in next session

### Phase 4.7: Dynamic Difficulty
- After wrong answer: increase difficulty next time
- MCQ difficulty levels: Easy → Medium → Hard
- Game difficulty: Simple parameter setup → Complex scenarios

### Phase 4.8: Session Composition
- Rewrite session builder to include:
  - FSRS picks topics
  - For each topic: brief + 2-3 MCQs + 1 game
  - Feedback + mistake log
  - Totals 20 concepts, ~60-80 min session

---

## Screens to Create/Modify

| Component | Type | Purpose |
|---|---|---|
| `ConceptPrediction.tsx` | NEW | Prediction MCQ before main question |
| `ConceptGameRunner.tsx` | NEW | Embed game with concept-specific data |
| `SocraticFeedback.tsx` | NEW | Enhanced feedback with connections + follow-ups |
| `LiveSession.tsx` | MODIFY | Orchestrate new flow: brief → predict → MCQs → game → feedback |
| `ConceptEncoding.tsx` | MODIFY | Integrate game-based encoding (optional) |
| `core/session-builder.ts` | MODIFY | Build session with concept brief + 2-3 MCQs + 1 game per concept |
| `core/fsrs.ts` | MODIFY | Track mistake logs, adjust difficulty based on performance |
| `core/types.ts` | MODIFY | Add `mistakeLog[]`, `predictionError`, `gameDifficulty` fields |
| `lib/game-concept-mapper.ts` | NEW | Map concepts → game types with parameter population |

---

## Expected Learning Impact

With predict-first + game integration:

| Metric | Current | Proposed |
|---|---|---|
| Active Recall | ❌ None | ✅ 100% (predict + MCQs + game) |
| Interactive Practice | ❌ Isolated games | ✅ Contextualized per topic |
| Mistake Tracking | ❌ None | ✅ Logged + repeated next session |
| Learning Time/Item | ~15s | ~3-4 min (concept + MCQs + game + feedback) |
| Retention Rate | ~40% | ~75%+ (prediction + practice + feedback loop) |
| Concept Connections | ❌ None | ✅ Shown in feedback + related concepts |
| Brain Engagement | Low (watching) | High (predicting → answering → practicing → feedback) |
| Struggle/Friction | ❌ None | ✅ Intentional (leads to growth) |

---

## Acceptance Criteria

- ✅ Prediction MCQ appears before main question
- ✅ Feedback shows "why correct" + "why wrong"
- ✅ Mistake log tracked in localStorage
- ✅ Weak concepts repeat within session
- ✅ No increase in session duration (same 20 items/day, more thinking)
- ✅ Mobile responsive at all breakpoints
- ✅ Zero TypeScript errors

---

## Implementation Priority

**Phase 4.1: FSRS Topic Display** (Foundation)
- Show which concept FSRS selected
- Concept brief + visual
- Why selected (spaced repetition reason)

**Phase 4.2: Prediction Screen** (Core Loop)
- Prediction MCQ before main question
- Track prediction accuracy + time
- Active recall activation

**Phase 4.3: Multi-MCQ Flow** (Depth)
- 2-3 MCQs per concept (different angles)
- Increasing difficulty
- Track all responses

**Phase 4.4: Game Runner with Data** (CRITICAL)
- Create concept → game type mapper
- Populate game with topic-specific data
- Embed in session flow
- Auto-advance on completion

**Phase 4.5: Socratic Feedback** (Engagement)
- Why correct/incorrect
- Show common mistakes
- Predict error analysis
- Connection to related concepts

**Phase 4.6: Mistake Engine** (Repetition)
- Track wrong answers + prediction errors
- Flag for next session
- Adjust difficulty dynamically

---

## Example 1: AI Engineering Course Flow (Prompt Engineering)

```
1️⃣ FSRS picks: "LLM Mastery > Prompt Engineering" (Fragile, due today)
   Why: Last tested 3 days ago, R=0.78 (due for review)

2️⃣ Concept Brief (10s)
   From: AI Engineering Course Phase 11 → Prompt Engineering lesson
   
   📖 Concept: "Chain-of-Thought Prompting"
   📌 Definition: Asking the LLM to show reasoning step-by-step
   📊 Subject: LLM Mastery (Purple badge)
   
   Key trigger: "When to use: complex reasoning, math, multi-step logic"
   Stake: "Chain-of-thought improved GPT-4 math accuracy from 35% → 92%"
   
3️⃣ Prediction (15s)
   ❓ "What happens if you ask GPT-4: 'Think step by step' on a multi-step problem?"
   A) Model gives faster but less accurate answer
   B) Model shows reasoning and improves accuracy
   C) Model uses more tokens but same accuracy
   D) No difference
   [User predicts BEFORE seeing evidence]
   
4️⃣ MCQ 1 (20s) — From quiz-content.ts pre-quiz
   "Which is correct about chain-of-thought prompting?"
   [Real quiz question from AI Engineering curriculum]
   
5️⃣ MCQ 2 (20s) — From quiz-content.ts post-quiz
   "In what scenarios should you NOT use chain-of-thought?"
   [Different angle on same concept]
   
6️⃣ Game: Prompt Engineering Challenge (2-3 min)
   🎮 Challenge Type: "Fix the Prompt"
   
   Given:
   ❌ Bad prompt: "Solve: 5 + 3 × 2"
   (GPT response: "5 + 3 × 2 = 16" ← WRONG)
   
   Your task: Rewrite prompt with chain-of-thought
   ✏️ User edits prompt → Sends to Gemini API → Evaluates output
   ✅ Good prompt: "Solve step by step: 5 + 3 × 2"
   (Gemini response: "Step 1: 3×2=6. Step 2: 5+6=11" ← CORRECT)
   
   Score: Accuracy + Token efficiency
   Result: 90/100
   
7️⃣ Feedback (30s auto-advance)
   ✓ Prediction CORRECT! CoT improves accuracy
   ✓ MCQ 1: Right! (Shows understanding of when to use)
   ✗ MCQ 2 was wrong: You forgot about simple facts (no CoT needed)
   🎮 Game score: Excellent! Understood prompt structure
   
   🔗 Related concepts:
      → "Few-Shot Prompting" (similar technique)
      → "Structured Output" (JSON mode for CoT)
      → "Token Optimization" (CoT costs more tokens)
   
   ❓ Socratic follow-up:
      "If your model generates 2x more tokens with CoT, how would you optimize cost?"
   
8️⃣ Mistake Log (invisible)
   Log: {
     prediction: true,
     correct: [mcq_1],
     wrong: [mcq_2],
     gameScore: 90,
     gameType: "prompt_fix",
     responseTime: 1240ms
   }
   → Flag MCQ 2 for repetition in 2 days
   → Next session: Increase difficulty (multi-step reasoning test)
```

---

## Example 2: AI Engineering Course Flow (RAG Chunking)

```
1️⃣ FSRS picks: "RAG & Knowledge > Chunking Strategy" (Conscious, reinforce)
   Why: Last tested 1 week ago, R=0.92 (high confidence, but reinforce before forgetting)

2️⃣ Concept Brief (10s)
   📖 Concept: "Semantic Chunking vs Fixed-Size Chunking"
   📌 Stakes: "Bad chunking is the #1 reason RAG apps hallucinate"
   📊 Subject: RAG & Knowledge Systems (Pink badge)

3️⃣ Prediction (15s)
   ❓ "A RAG system chunks a PDF by fixed 512-token windows. What problem occurs?"
   A) Chunks are always semantically complete
   B) Chunks might split important concepts across boundaries → incomplete context
   C) Chunking is faster but less accurate
   D) No difference if you use a good vector DB
   
4️⃣ MCQ 1 (20s)
   "When retrieving chunks from a vector DB, how does chunking strategy affect accuracy?"
   [From ai-engineering/quiz-content.ts]
   
5️⃣ MCQ 2 (20s)
   "Compare semantic chunking vs hierarchical chunking. Which scales better?"
   [Different angle on same concept]
   
6️⃣ Game: RAG Chunking Evaluator (2-3 min)
   🎮 Challenge Type: "Chunk the Document"
   
   Given: PDF with 3 sections:
   - Company History
   - Product Features
   - Pricing Table
   
   Your task: Chunk the document to optimize RAG accuracy
   
   Options:
   A) 512-token fixed windows (simple)
   B) Semantic boundaries (paragraph/section breaks)
   C) Hierarchical: Section → Subsection → Paragraph
   
   Evaluation:
   - Query 1: "What features does product X have?"
      - Fixed chunks: ❌ Retrieves pricing data (wrong chunk)
      - Semantic chunks: ✓ Retrieves feature section (correct)
      - Hierarchical: ✓✓ Retrieves exact subsection (best)
   
   - Query 2: "Is product available in Europe?"
      - Fixed chunks: ❌ Misses context
      - Semantic chunks: ✓ Gets context
      - Hierarchical: ✓✓ Gets all relevant context + parent section
   
   User selects chunking strategy → System evaluates → Shows results
   Score: 95/100 (chose hierarchical)
   
7️⃣ Feedback
   ✓ Prediction CORRECT!
   ✓ MCQs all correct
   🎮 Game: Excellent! You understood tradeoffs
   
   💡 Insight: At scale, semantic chunking adds cost but prevents hallucinations worth $10K+ in customer support
   
   🔗 Related:
      → "Vector DB Selection" (affects chunking strategy)
      → "Embedding Quality" (if embeddings are bad, chunking won't help)
      → "Hybrid Search" (BM25 + semantic can work with simpler chunks)
   
8️⃣ Mistake Log
   Log: {
     prediction: true,
     allCorrect: true,
     gameScore: 95,
     gameType: "rag_chunking_eval",
     responseTime: 1820ms
   }
   → Mark as MASTERED (can graduate to harder concept)
   → No repetition needed (R > 0.9)
```

---

## Current AI Engineering Data Mapping

**What exists:**
- ✅ 80 concepts in `src/data/ai_engineer/concepts.ts`
- ✅ Quiz content in `src/data/ai_engineering/quiz-content.ts` (pre + post questions)
- ✅ Course lessons in phases (markdown + code examples)
- ✅ Concept relationships (relatedIds, competingIds)
- ✅ Stakes/emotional motivation for each concept
- ✅ **Existing games:** Physics simulations, Math arcade, Chemistry arcade, Memory games, Shape slicer, etc.

**Mapping: AI Concepts → Existing Games**

| AI Concept | Existing Game | Usage |
|---|---|---|
| **Linear Algebra** | MathArcade | Matrix operations, vector visualization |
| **Probability & Statistics** | MathArcade | Distribution visualization, sampling |
| **Python Data Structures** | SpacedRecallBlitz | Memory game for list/dict/set operations |
| **Sorting Algorithms** | GameRunner + SpacedRecallBlitz | Visualize sorting steps |
| **Graph Theory** | MathArcade (if available) | Network visualization |
| **Calculus (Optimization)** | PhysicsPlayground | Gradient descent visualization |
| **Signal Processing** | PhysicsPlayground (waves) | Standing waves, frequency analysis |
| *Most NLP/LLM/RAG concepts* | ❌ No relevant game | Show MCQ + feedback only |

**Strategy:** 
- If concept has a related game → Show it as interactive practice
- If no game exists → Show MCQ + rich feedback (acceptable for AI theory)
- Don't force games for concepts that don't have them

**What needs to be added:**
- 🟡 Concept → Game mapper: `lib/concept-game-mapper.ts`
- 🟡 Game launcher wrapper that detects when to embed game in session
- 🟡 Optional: Populate game with concept-specific parameters where possible

---

## Simplified Session Flow (Using Existing Games)

**If concept HAS a related game:**
```
Concept → Predict → MCQs → [GAME] → Feedback → Logging
```

**If concept HAS NO game:**
```
Concept → Predict → MCQs → [RICH FEEDBACK] → Logging
(No game, but feedback is more detailed: why correct, connections, Socratic Q)
```

---

## Example 1: AI Engineering with Game (Linear Algebra)

```
1️⃣ FSRS: "Core Foundations > Linear Algebra" (Fragile, due today)

2️⃣ Concept Brief (10s)
   📖 Concept: "Matrix Multiplication and Vector Spaces"
   📌 Stakes: "Without linear algebra, you cannot understand embeddings"
   
3️⃣ Prediction (15s)
   ❓ "If matrix A is 3×4 and matrix B is 4×2, what's the shape of A×B?"
   A) 3×2   B) 4×4   C) Undefined   D) 3×4
   
4️⃣ MCQs (40s)
   - MCQ 1: Matrix multiplication rules
   - MCQ 2: Real-world use case (embedding transformation)
   
5️⃣ Game: MathArcade (2-3 min)
   🎮 "Matrix Challenge" from MathArcade
   [User practices matrix operations interactively]
   [Visual verification of results]
   Score: 85/100
   
6️⃣ Feedback (30s)
   ✓ Prediction correct!
   ✓ MCQ 1-2 correct
   🎮 Game: Good! Minor mistakes on edge cases
   
   🔗 Next: "Embeddings Fundamentals" (uses matrix math)
   
7️⃣ Mistake Log + FSRS Update
   Performance: 3/3 correct + game 85/100 → Increase stability
```

---

## Example 2: AI Engineering WITHOUT Game (Prompt Engineering)

```
1️⃣ FSRS: "LLM Mastery > Chain-of-Thought Prompting" (Fragile, due today)

2️⃣ Concept Brief (10s)
   📖 Concept: "Chain-of-Thought Prompting"
   📌 Stakes: "CoT improved GPT-4 from 35% → 92% on math"
   
3️⃣ Prediction (15s)
   ❓ "What happens with 'think step by step'?"
   A) Faster but less accurate
   B) Slower but more accurate
   C) No difference
   D) Only works for GPT-4
   
4️⃣ MCQs (40s)
   - MCQ 1: When to use CoT
   - MCQ 2: Cost-accuracy tradeoff
   
5️⃣ Game: ❌ NONE
   [This concept has no related existing game]
   
6️⃣ Rich Feedback (60s)
   ✓ Prediction correct! Here's WHY:
   
   📊 Evidence from research:
   - GPT-3 math: 35% accuracy
   - GPT-3 + CoT: 78% accuracy
   - GPT-4 + CoT: 92% accuracy
   
   ❌ Common mistake: Thinking CoT = always better
   Reality: CoT costs 3-5x more tokens
   When to use: Complex reasoning, multi-step logic
   When NOT: Simple facts, classification
   
   🔗 Related concepts:
   → "Few-Shot Learning" (similar technique)
   → "Token Optimization" (cost awareness)
   → "Structured Output" (JSON mode with CoT)
   
   ❓ Socratic: "If your app costs $50K/month on API calls, how would you reduce tokens while keeping quality?"
   
7️⃣ Mistake Log + FSRS Update
   Performance: 2/2 correct → No game penalty
```

---

## Implementation Plan (Using Existing Games)

**Phase 4.1: Concept Display + Prediction**
- Show FSRS-selected concept from course lesson
- Show prediction MCQ
- Show 2-3 quiz MCQs from quiz-content.ts

**Phase 4.2: Concept → Game Mapper**
- Create `lib/concept-game-mapper.ts`
- Map AI concepts to existing games:
  ```ts
  const conceptGameMap: Record<string, { gameId: string; gameType: string }> = {
    'ai_cf_4': { gameId: 'math-arcade', gameType: 'matrix_ops' },     // Linear Algebra
    'ai_mldl_3': { gameId: 'math-arcade', gameType: 'statistics' },   // Evaluation Metrics
    // Most AI concepts: undefined (no game)
  };
  ```

**Phase 4.3: Conditional Game Rendering**
- If `conceptGameMap[conceptId]` exists → Show game
- If not → Show rich feedback with connections + Socratic Q

**Phase 4.4: Socratic Feedback**
- Show detailed explanation (why correct/wrong)
- Show related concepts
- Show real-world stakes
- Ask Socratic follow-up question

**Phase 4.5: Mistake Logging + FSRS Update**
- Track: correct/wrong MCQs, game performance (if played)
- Update FSRS stability/difficulty
- Flag weak concepts for repetition

---

## Session Composition (20 concepts/day)

```
Per concept: 5-15 minutes depending on game availability

- With game: ~8-10 min (brief + predict + MCQs + game + feedback)
- Without game: ~5-8 min (brief + predict + MCQs + rich feedback)

Example 20-concept session:
- 5 concepts WITH games (math, algorithms, etc.) = 40-50 min
- 15 concepts WITHOUT games (LLM theory, RAG, agents) = 75-120 min
Total: ~2 hours per session

Balanced mix ensures:
✅ Interactive practice when relevant
✅ Deep theoretical learning when needed
✅ No forcing games where they don't fit
```

---

## Success Criteria

- ✅ FSRS picks concept + shows brief from course lesson
- ✅ Prediction MCQ appears before quiz questions
- ✅ 2-3 quiz MCQs shown per concept
- ✅ Existing game shown IF mapped to concept
- ✅ Rich feedback with connections + Socratic Q when NO game
- ✅ Mistakes logged + repetition scheduled
- ✅ Mobile responsive at all breakpoints
- ✅ Zero TypeScript errors
- ✅ Session time: 1.5-2.5 hours for 20 concepts

---

## Success Criteria

- ✅ FSRS selects topic + shows brief
- ✅ Prediction MCQ appears before content
- ✅ 2-3 MCQs shown per concept
- ✅ Game embedded with **concept data populated**
- ✅ Socratic feedback shows connections
- ✅ Mistakes logged + repeated next session
- ✅ Total time per concept: 3-4 minutes
- ✅ Session: 20 concepts × 3-4 min = 60-80 min
- ✅ Mobile responsive
- ✅ Zero TypeScript errors
