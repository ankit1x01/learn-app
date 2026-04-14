# AI-Powered Competitive Exam App Blueprint
### NEET / JEE / MPPSC / UPSC — Built on GOD MODE Learning System

---

## Core Philosophy → Product Mapping

Your GOD MODE Loop maps directly to product features:

| GMLL Stage   | Feature                                      |
| ------------ | -------------------------------------------- |
| INPUT        | Smart Chapter Reader + AI Explainer          |
| MODEL        | Mind Map Generator + Concept Visualizer      |
| STRUGGLE     | Adaptive MCQ Engine (no hints, timed)        |
| TEST         | Mini Mock + Concept Check                    |
| COMPRESS     | AI One-Liner Summary Generator               |
| STORE        | Personal Playbook + Flashcard Deck           |
| REUSE        | Cross-chapter Connection Engine              |

---

## App Flow — Student Journey

### Onboarding

```
1. Select exam: NEET / JEE / MPPSC / UPSC
2. Select target year + hours/day available
3. Diagnostic test (40 MCQs, 30 min)
   └── AI maps: strong topics / weak topics / knowledge gaps
4. Generate personalized 6-month roadmap
```

---

### Daily Cycle (mirrors GOD MODE Index)

```
🌅 MORNING (10 min)
├── "Yesterday's Recall" — 5 blanked flashcards
├── AI identifies gaps from yesterday's session
└── Today's priority topic shown

🌞 STUDY SESSION
├── 25 min: Smart Reader (INPUT)
│   ├── NCERT/standard text, AI-annotated
│   ├── Hover for AI explanation
│   └── Auto-highlight exam-frequency words
├── 5 min: Mind Map / Concept Diagram (MODEL)
│   └── AI generates, student edits
├── 30 min: Practice MCQs — STRUGGLE mode
│   ├── No hints for first 60 sec
│   ├── Difficulty adapts to accuracy
│   └── Wrong answers flagged for Chitta layer
├── 5 min: Compress — AI + student writes one-liner
└── 5 min: Add to Playbook

🌆 EVENING (15 min)
├── Explain-back challenge (student types/speaks, AI grades)
├── Playbook update
└── Mistake journal auto-populated from session

🌙 PRE-SLEEP (5 min)
├── 3 key patterns from today (visual cards)
└── "Seed" notification next morning
```

---

## UI Screens

### Screen 1: Dashboard
- Daily streak + energy score
- Today's schedule (Morning / Session / Evening blocks)
- Weak topic radar chart (subject-wise)
- "Continue where you left off" card
- Leaderboard (optional, opt-in)

### Screen 2: Smart Reader
- Clean PDF-like reader
- Tap any concept → AI explainer popup
- Highlight → auto-creates flashcard
- Side panel: related PYQ (Previous Year Questions)
- Audio mode: TTS with pace control

### Screen 3: Practice Arena
- Timer (exam-style pressure)
- Difficulty badge: Foundation / Exam-Level / Killer
- Post-answer: Explanation + "Where in syllabus"
- Add to Mistake Journal (one tap)
- Pattern tag: e.g., "Krebs Cycle — oxidation reaction"

### Screen 4: Playbook (Personal)
- Student-written one-liners per topic
- AI suggests edits for clarity
- Tag by exam relevance (NEET / JEE / MPPSC / UPSC)
- Spaced repetition queue auto-built from this

### Screen 5: Mock Tests
- Full-length exam simulation
- Sectional mocks
- PYQ mode (year-filtered)
- Post-test: AI generates "Error Pattern Report"
- Compare to topper benchmark

### Screen 6: AI Tutor (Chat)
- Ask anything about syllabus
- "Explain like I'm 10" mode
- "Connect this to another topic" mode
- Exam strategy advisor

### Screen 7: Progress
- SADHANA cycle completion % daily
- Forgetting curve projection per topic
- Neuroplasticity score (gamified depth metric)
- Chitta layer health (how many topics are "subconscious")

---

## Backend Data to Prepare

### A. Structured Content Database

```
/content
├── /neet
│   ├── /physics     → chapters → subtopics → concepts
│   ├── /chemistry   → (same)
│   └── /biology     → (same)
├── /jee
│   ├── /physics
│   ├── /chemistry
│   └── /maths
├── /upsc
│   ├── /prelims     → GS1 / GS2 / GS3 / GS4 / CSAT
│   └── /mains
└── /mppsc           → same structure as UPSC
```

Each concept node:

```json
{
  "id": "bio_cell_krebs",
  "exam_tags": ["NEET"],
  "chapter": "Respiration",
  "concept": "Krebs Cycle",
  "text": "...",
  "one_liner": "Krebs cycle = 8-step acetyl-CoA oxidation → 1 ATP + 3 NADH + 1 FADH2",
  "pyq_count": 23,
  "difficulty": "medium",
  "common_mistakes": ["..."],
  "related_concepts": ["ETC", "Glycolysis"],
  "vector_embedding": []
}
```

### B. Question Bank

```
/questions
├── pyq/          ← 20+ years, all exams
├── curated/      ← topic-wise, difficulty-tagged
└── ai_generated/ ← LLM-generated, human-reviewed
```

Each question:

```json
{
  "id": "q_001",
  "text": "...",
  "options": ["A", "B", "C", "D"],
  "correct": "B",
  "explanation": "...",
  "concept_ids": ["bio_cell_krebs"],
  "exam": "NEET",
  "year": 2023,
  "difficulty": 3,
  "pattern_type": "application"
}
```

### C. Student Data (per user)

```
/users/{uid}
├── profile/          ← exam, target date, daily hours
├── sessions/         ← timestamped study events
├── flashcards/       ← custom + auto-generated
├── playbook/         ← their one-liners
├── mistakes/         ← wrong answers + pattern tags
├── concept_mastery/  ← SM-2 / FSRS spaced rep scores per concept
└── chitta_layer/     ← "subconscious" tagged concepts
```

---

## AI Architecture — RAG + LLMs + Agentic AI

### A. RAG Pipeline

Used for: AI Tutor, concept explanations, cross-topic linking

```
1. Chunk all NCERT/standard content → 500-token chunks
2. Embed with:
   - text-embedding-3-large (OpenAI)
   - embedding-001 (Google Gemini)
   - BGE-M3 (open source option)
3. Store in vector DB: Pinecone / Weaviate / pgvector
4. Query flow:
   Student asks: "Explain Krebs cycle in context of NEET"
   → Embed query
   → Retrieve top-5 relevant chunks
   → Inject into Claude/GPT-4o prompt with exam context
   → Stream response back
```

### B. LLMs — Feature by Feature

| Feature                  | Best Model           | Why                       |
| ------------------------ | -------------------- | ------------------------- |
| AI Tutor (chat)          | Claude Sonnet 4.6    | Long context, accurate    |
| One-liner compression    | Claude Haiku 4.5     | Fast, cheap               |
| MCQ explanation          | Claude Sonnet 4.6    | Reasoning quality         |
| Mind map generation      | GPT-4o               | Structured JSON output    |
| Error pattern analysis   | Claude Opus 4.6      | Deep reasoning            |
| Voice tutor (TTS)        | ElevenLabs / Google  | Natural Hindi + English   |
| Explain-back grading     | Claude Sonnet 4.6    | Rubric-based grading      |

### C. Agentic AI — The "Exam Strategist" Agents

#### Agent 1: Study Planner

```
Tools available:
- get_student_weak_topics()
- get_exam_date_countdown()
- get_pyq_frequency_by_topic()
- get_forgetting_curve_status()
- get_available_study_hours_today()

Runs every morning, produces:
"Today study X → high-frequency topic, you're weak here
 Revise Y     → due for spaced rep today
 Skip Z       → you're strong + low exam weight"
```

#### Agent 2: Error Pattern Analyzer

```
After every mock test:
- Clusters wrong answers by concept type
- Identifies root cause:
    conceptual gap / calculation error / silly mistake
- Prescribes specific 20-min remedy session
```

#### Agent 3: Adaptive Difficulty Engine

```
- Uses student's last 50 answers per topic
- Applies IRT (Item Response Theory) model
- Selects next question at θ+0.3 difficulty
  (slightly above current ability = flow state)
```

### D. Latest AI Research to Apply

#### 1. FSRS Spaced Repetition Algorithm (2023)
- Replace Anki's SM-2 with FSRS for flashcard scheduling
- Better retention prediction, fewer reviews needed

#### 2. Graph RAG (Microsoft, 2024)
- Connect concepts as knowledge graph
- Example: "Krebs Cycle → ETC → tested together in PYQ 67%"
- Enables multi-hop reasoning across topics

#### 3. Deep Knowledge Tracing (Stanford)
- LSTM model predicts P(correct) per concept per student
- Enables truly personalized difficulty selection
- Paper: Piech et al., "Deep Knowledge Tracing"

#### 4. Multimodal Learning
- GPT-4o / Gemini 1.5 Pro vision
- Student uploads handwritten notes → AI extracts and adds to Playbook
- Diagram recognition for biology/chemistry

#### 5. Socratic Tutoring
- Inspired by Khanmigo (Khan Academy)
- AI never gives answer directly
- Asks guiding questions → forces STRUGGLE (GOD MODE principle)

#### 6. Emotion-Aware Adaptation
- Monitor answer speed + error rate → detect frustration
- Suggest break or easier warmup question
- Prevents cognitive overload (your Cognitive Load principle)

#### 7. Retrieval Practice > Re-reading (Roediger & Karpicke, 2006)
- Morning recall is non-negotiable
- Higher product priority than new content delivery
- Students who test themselves retain 50% more

---

## Tech Stack

| Layer        | Technology                             |
| ------------ | -------------------------------------- |
| Frontend     | Next.js 15 (App Router) — SSR for SEO |
| Mobile       | React Native / Expo                    |
| Backend      | Node.js + Fastify OR Python FastAPI    |
| Database     | PostgreSQL (user data)                 |
| Cache        | Redis (sessions, leaderboard)          |
| Vector DB    | pgvector (start) → Pinecone (scale)    |
| AI Primary   | Claude API (Anthropic)                 |
| AI Fallback  | OpenAI GPT-4o                          |
| Auth         | Supabase Auth                          |
| Storage      | Cloudflare R2 (PDFs, images)           |
| Queue        | BullMQ (spaced rep jobs, AI jobs)      |
| Analytics    | PostHog (learning behavior tracking)   |
| Search       | Typesense (fast concept search)        |

---

## MVP Build Priority

```
Week 1-2:   Core reader + question bank (NEET only)
Week 3-4:   Adaptive MCQ engine + spaced repetition
Week 5-6:   AI tutor with RAG
Week 7-8:   Mock test + error pattern report
Week 9-10:  Morning recall + Playbook
Week 11+:   Agentic planner + full GOD MODE daily cycle
```

---

## Key Differentiator

Generic platforms (Unacademy, PW, Byju's) deliver content.

This app delivers **cognitive transformation**.

The Chitta Layer — tracking how many concepts move from
**"practiced" → "automatic"** — is what no competitor has.
Make that progress visible. Students will feel themselves becoming different.

```
Day 1:    Consciously struggle with Krebs Cycle
Day 7:    Recalling it with effort
Day 21:   It appears in answers automatically
Day 60+:  It's part of how you think
```

> The system programs the student's Chitta, not just their marks.

---

_Built on GOD MODE Learning System + OffSec Methodology + Vedic Sādhanā + Cognitive Science_

_Consistency × Difficulty × Reflection × Time = Mastery_
