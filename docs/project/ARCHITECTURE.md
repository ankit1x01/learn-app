# CHITTA — Full Architecture Documentation

> Two-layer design: **Core Engine** (exam-agnostic) + **Syllabus Layer** (swappable per exam).  
> Currently loaded: DSA — FAANG Interviews. Swap `syllabus/index.ts` for NEET, JEE, UPSC, etc.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Layer 1 — UI](#layer-1--ui)
3. [Layer 2 — Backend](#layer-2--backend)
4. [Layer 3 — Content](#layer-3--content)
5. [Data Flow](#data-flow)
6. [Content Preparation Guide](#content-preparation-guide)

---

## System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│  UI LAYER  (React + Capacitor Android)                          │
│  Offline-first · Sync on session complete · No loading spinners  │
├──────────────────────────────────────────────────────────────────┤
│  CORE ENGINE  (src/core/)                                        │
│  FSRS · Session Builder · Scheduler · Knowledge Tracing          │
├──────────────────────────────────────────────────────────────────┤
│  SYLLABUS LAYER  (src/syllabus/{exam}/)                          │
│  DSA / NEET / JEE / UPSC — plug-in config + concept data        │
├──────────────────────────────────────────────────────────────────┤
│  BACKEND  (Supabase + Node/Fastify)                              │
│  Auth · Mastery Sync · Session Build · AI Services               │
├──────────────────────────────────────────────────────────────────┤
│  DATA  (PostgreSQL + Redis + pgvector + Object Storage)          │
└──────────────────────────────────────────────────────────────────┘
```

**Core principle:** Concepts are atoms. Exams are filters.  
The same concept `"Two Pointer Technique"` exists once. The exam config sets its weight, target depth, and question style. Switching from DSA to NEET = change one line in `syllabus/index.ts`.

---

## Layer 1 — UI

### Screen Map

| Screen | Purpose |
|---|---|
| `Dashboard` | Daily state, Chitta Score ring, subject progress, start session |
| `LiveSession` | Practice concepts, self-assess (Solved Clean / Hint / Stuck / Unseen) |
| `ConceptEncoding` | Deep-encode a new concept (Read / Draw / Quiz modes) |
| `ChittaMap` | Visual concept graph, filter by category, tap node for FSRS detail |
| `MorningRecall` | Free-recall 5 due concepts — write trigger + template + example |
| `SessionComplete` | Session stats, AI insight, tomorrow preview |
| `EliteHub` | Advanced mode — FAANG ready / 720 target |
| `GhanaPatha` | Deep repetition — recite until automatic |
| `StressMode` | Timed pressure simulation |
| `DistractorTraining` | Wrong-answer pattern training |
| `ErrorDashboard` | All flagged concepts + error patterns |
| `MockTest` | Full exam simulation |
| `PreExamProtocol` | 48hr-before-exam strategy screen |

### What Each Screen Consumes & Produces

| Screen | Reads | Writes |
|---|---|---|
| Dashboard | `SyllabusConfig`, `MasteryRecord[]` | — |
| LiveSession | `SessionItem[]`, `Concept` | `AnswerEvent` (rating + timestamp) |
| ConceptEncoding | `Concept`, `SubjectConfig.encodingTip` | `EncodingEvent` |
| ChittaMap | `Concept[]`, `MasteryRecord[]` | — |
| MorningRecall | `Concept[]` (due, sorted by R) | `RecallEvent` (self-rated) |
| SessionComplete | `Session` summary, `AnswerEvent[]` | triggers backend sync |
| ErrorDashboard | `MistakeRecord[]` | flag / unflag concept |
| MockTest | `Question[]` | `MockResult` |

### UI Data Contract

```typescript
// Minimum data to render any screen
type AppState = {
  config:   SyllabusConfig    // exam name, subjects, session ratios
  mastery:  MasteryRecord[]   // FSRS state per concept
  session:  SessionItem[]     // today's built session
  mistakes: MistakeRecord[]   // flagged wrong answers
}
```

### UI Rules

- **Offline-first** — all rendering works from local state (no spinners during session)
- `MasteryRecord` updates happen locally immediately (optimistic update)
- Sync to backend happens on `SessionComplete` only (batch upload)
- Session is pre-built on app open — never built mid-session
- Subject colors, emojis, encoding tips all come from `SubjectConfig` — nothing hardcoded in UI

### Self-Assessment Ratings (DSA mode)

Since there is no MCQ bank yet, LiveSession uses honest self-assessment:

| Rating | Meaning | FSRS Effect |
|---|---|---|
| Solved Clean | No hesitation, correct approach | S↑ D↓ stage advances |
| Needed a Hint | Right idea, minor gaps | S→ D→ stage holds |
| Got Stuck | Couldn't complete in time | S↓ D↑ stage regresses |
| Never Seen This | First encounter | S=0 D↑ stays Unseen |

---

## Layer 2 — Backend

### Service Architecture

```
API GATEWAY  (REST + WebSocket for AI streaming)
    │
    ├── AuthService       → phone OTP, JWT tokens
    ├── StudentService    → profile, exam selection, settings
    ├── SessionService    → build session using FSRS engine
    ├── MasteryService    → update FSRS state after answer batch
    ├── SchedulerService  → what is due today, forgetting curve
    ├── ContentService    → fetch concepts, questions, explanations
    ├── AIService         → tutor chat, explanations, insights
    └── AnalyticsService  → PostHog event forwarding
```

### Database Schema

```sql
-- Users
CREATE TABLE users (
  id          UUID PRIMARY KEY,
  phone       TEXT UNIQUE NOT NULL,
  name        TEXT,
  exam_id     TEXT,           -- 'dsa_faang' | 'neet_2026' | 'jee_2026'
  exam_date   DATE,
  daily_hours FLOAT DEFAULT 2,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Concept Mastery (FSRS state — one row per student × concept)
CREATE TABLE mastery (
  id            UUID PRIMARY KEY,
  user_id       UUID REFERENCES users(id),
  concept_id    TEXT NOT NULL,      -- e.g. 'p01' (Two Pointer)
  exam_id       TEXT NOT NULL,
  stage         TEXT DEFAULT 'Unseen',
  stability     FLOAT DEFAULT 0,    -- S: days memory lasts
  difficulty    FLOAT DEFAULT 0.5,  -- D: 0–1 per-student hardness
  last_tested   DATE,
  next_due      DATE,
  answer_count  INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  UNIQUE(user_id, concept_id, exam_id)
);

-- Study Sessions
CREATE TABLE sessions (
  id             UUID PRIMARY KEY,
  user_id        UUID REFERENCES users(id),
  exam_id        TEXT,
  started_at     TIMESTAMPTZ,
  completed_at   TIMESTAMPTZ,
  concepts_seen  INT,
  correct_count  INT,
  session_type   TEXT   -- 'daily' | 'recall' | 'mock' | 'stress'
);

-- Individual Answers
CREATE TABLE answers (
  id            UUID PRIMARY KEY,
  session_id    UUID REFERENCES sessions(id),
  user_id       UUID REFERENCES users(id),
  concept_id    TEXT,
  question_id   TEXT,
  rating        TEXT,     -- 'clean' | 'hints' | 'stuck' | 'unseen'
  correct       BOOLEAN,
  time_taken_s  INT,
  answered_at   TIMESTAMPTZ
);

-- Flagged Mistakes
CREATE TABLE mistakes (
  id            UUID PRIMARY KEY,
  user_id       UUID REFERENCES users(id),
  concept_id    TEXT,
  question_id   TEXT,
  error_pattern TEXT,     -- AI-classified: 'edge_case' | 'template' | 'complexity'
  flagged_at    TIMESTAMPTZ,
  resolved      BOOLEAN DEFAULT false
);

-- Concepts (content)
CREATE TABLE concepts (
  id            TEXT PRIMARY KEY,   -- 'p01', 't15', 'd03'
  exam_id       TEXT,
  name          TEXT,
  subject       TEXT,
  chapter       TEXT,
  unit          INT,
  pyq_tier      INT,                -- 1=highest interview frequency
  one_liner     TEXT,
  trigger_rule  TEXT,
  when_not_to   TEXT,
  code_template TEXT,
  explanation   TEXT,
  common_mistakes JSONB,            -- string[]
  embedding     vector(1536),       -- pgvector for RAG
  created_at    TIMESTAMPTZ
);

-- Questions
CREATE TABLE questions (
  id          TEXT PRIMARY KEY,
  concept_id  TEXT REFERENCES concepts(id),
  exam_id     TEXT,
  text        TEXT,
  options     JSONB,      -- [{id, text}]
  correct     TEXT,       -- option id
  explanation TEXT,
  difficulty  INT,        -- 1–5
  source      TEXT,       -- 'leetcode' | 'pyq_2023' | 'ai_generated'
  year        INT,
  created_at  TIMESTAMPTZ
);
```

### API Endpoints

```
AUTH
  POST  /auth/otp/send           send OTP to phone number
  POST  /auth/otp/verify         verify OTP → return JWT

STUDENT
  GET   /student/profile         name, exam, settings
  PUT   /student/profile         update exam, daily hours
  GET   /student/mastery         all MasteryRecords for student

SESSION
  GET   /session/build           build today's session (FSRS engine)
  POST  /session/complete        upload batch AnswerEvents after session

CONTENT
  GET   /concepts/:examId        all concept metadata for exam
  GET   /concepts/:id            single concept with full content
  GET   /questions/:conceptId    questions linked to concept

AI
  POST  /ai/tutor                chat message → streaming response
  POST  /ai/explain/:conceptId   get explanation for concept
  POST  /ai/insight/session      analyze session → error pattern report
  POST  /ai/oneliner/:conceptId  compress concept to one line (Haiku)

ANALYTICS
  POST  /events                  batch PostHog events
```

### Key Flows

#### Session Build (`GET /session/build`)
```
1. Fetch student mastery records from DB
2. Merge with concept list (missing = Unseen)
3. FSRS scheduler:
   - Calculate R = e^(-t/S) for all non-Unseen
   - Bucket → due / new / strengthen / challenge
4. Apply SyllabusConfig.sessionComposition ratios
5. Apply subject weight interleaving (never 2 same in a row)
6. Return SessionItem[] (20 concepts)
```

#### Answer Processing (`POST /session/complete`)
```
For each AnswerEvent:
1. Load current MasteryRecord
2. Run FSRS update:
   correct → updateStabilityOnSuccess, advanceStage, difficulty↓
   wrong   → updateStabilityOnFailure, regressStage, difficulty↑
3. Calculate next_due = today + getNextReviewDays(new_stability)
4. Upsert MasteryRecord
5. If wrong → create MistakeRecord
6. Enqueue async job → AI insight generation
```

### Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React 19 + Vite + Tailwind CSS 4 | Already built |
| Mobile | Capacitor (Android) | Reuses web code |
| Auth | Supabase Auth (phone OTP) | Indian students use phone |
| Database | PostgreSQL via Supabase | Structured student data |
| Cache | Redis | Sessions, streaks, leaderboard |
| Vector DB | pgvector → Pinecone at scale | RAG for AI tutor |
| AI Primary | Gemini 1.5 Pro | API key already configured |
| AI Secondary | Claude Sonnet 4.6 | Better reasoning for tutoring |
| Storage | Cloudflare R2 | Diagrams, videos, PDFs |
| Analytics | PostHog | Learning behavior tracking |

### AI Model Assignments

| Feature | Model | Why |
|---|---|---|
| AI Tutor (chat) | Claude Sonnet 4.6 | Long context, accurate |
| One-liner compression | Claude Haiku 4.5 | Fast, cheap |
| MCQ explanation | Claude Sonnet 4.6 | Reasoning quality |
| Error pattern analysis | Claude Opus 4.6 | Deep reasoning |
| Question generation | Gemini 1.5 Pro | Already integrated |
| Session insight | Claude Haiku 4.5 | Fast, runs after session |

---

## Layer 3 — Content

### Per-Concept Content Package

Every concept needs these assets to be fully functional in the app:

```json
{
  "id": "p01",
  "name": "Two Pointer Technique",
  "subject": "Patterns & Techniques",
  "chapter": "Array Patterns",
  "unit": 1,
  "pyq_tier": 1,

  "one_liner": "Two indices moving toward/away from each other to avoid O(n²)",

  "trigger_rule": "Sorted array + find pair/subarray + O(n) target",
  "when_not_to": "Unsorted array without sort step; when you need all pairs not just one",

  "code_template": "left, right = 0, len(arr) - 1\nwhile left < right:\n    if condition:\n        # record answer\n    elif need_larger:\n        left += 1\n    else:\n        right -= 1",

  "explanation": "150–500 word explanation of why it works + complexity proof",

  "common_mistakes": [
    "Moving both pointers when only one should move",
    "Not handling duplicate values",
    "Forgetting to check left < right boundary"
  ],

  "leetcode_links": [
    { "id": "LC-167", "title": "Two Sum II", "difficulty": 1, "why": "Canonical problem" },
    { "id": "LC-15",  "title": "3Sum",       "difficulty": 2, "why": "Two pointer inside loop" },
    { "id": "LC-11",  "title": "Container With Most Water", "difficulty": 2, "why": "Greedy pointer movement" }
  ],

  "diagram_url": null
}
```

### Content Responsibility Matrix

| Content Type | Who | Volume | Priority |
|---|---|---|---|
| Concept name, tier, chapter | Teacher | 1× per concept | **P0 — needed now** |
| Trigger rule + when NOT to use | Teacher | 1× per concept | **P0** |
| Code template | Teacher | 1× per concept | **P0** |
| LeetCode problem links (3–5) | Teacher curates | 3–5 per concept | **P0** |
| One-liner summary | AI auto-generates | auto | P0 |
| Short explanation (150w) | Teacher draft → AI polish | 1× | P1 |
| Deep explanation (500w) | Teacher draft | 1× | P1 |
| Common mistakes list | Teacher | 3–5 per concept | P1 |
| Diagram / visual | Teacher creates | 1× | P1 |
| AI-generated MCQs | AI + human review | 5–10 per concept | P2 |
| Encoding tip per subject | Teacher (1 per subject) | done | ✓ done |

### What AI Generates Automatically

```
✓ Auto-generated (no teacher needed):
    One-liner summary           (Haiku, from explanation text)
    MCQ wrong options           (3 distractors per question)
    MCQ explanation per answer  (why right, why wrong)
    Error pattern classification (edge_case / template / complexity)
    "Next step" coaching message (after each session answer)
    Daily study plan            (what to study today + why)
    Session insight report      (post-session error analysis)

✗ Must be human-prepared:
    Trigger rules               (AI gets these wrong — too vague)
    Code templates              (correctness is critical)
    "When NOT to use" rules     (requires experience)
    LeetCode problem curation   (requires judgement on quality)
    Common mistakes             (requires teaching experience)
```

### Content Build Plan — DSA (55 concepts)

#### Phase 1 — Metadata Only (needed now, ~14 hours of work)
Each concept needs: `name`, `chapter`, `pyq_tier`, `trigger_rule`, `one_liner`, `3 LeetCode links`

This unlocks:
- Dashboard (subject progress)
- ChittaMap (all nodes visible)
- LiveSession (self-assessment works)
- MorningRecall (concept names shown)

#### Phase 2 — Explanations + Questions (Month 2, ~40 hours)
Add: `explanation`, `code_template`, `common_mistakes`, AI-reviewed MCQs

This unlocks:
- ConceptEncoding (real content shown)
- DistractorTraining (MCQ options)
- ErrorDashboard (error pattern tagging)

#### Phase 3 — Visuals + AI Tutor (Month 3, ~20 hours)
Add: `diagram_url`, `embedding` (vector for RAG)

This unlocks:
- AI Tutor (RAG over real content)
- Visual diagram in ConceptEncoding
- Cross-concept connection in ChittaMap

### DSA Content Template for Teachers

Use this format for each concept in `/docs/content/dsa/`:

```markdown
## [Concept Name]

**ID:** p01  
**Subject:** Patterns & Techniques  
**Chapter:** Array Patterns  
**Tier:** 1 (FAANG asks this every loop)

### One-liner
Two indices moving toward each other to find pairs in O(n).

### When to use (trigger rule)
- Sorted array
- Find pair / triplet / subarray
- Need O(n) time

### When NOT to use
- Unsorted array (sort first adds O(n log n))
- Need index positions of all pairs
- Problem requires nested structure

### Code Template
```python
left, right = 0, len(arr) - 1
while left < right:
    current = arr[left] + arr[right]
    if current == target:
        return [left, right]
    elif current < target:
        left += 1
    else:
        right -= 1
```

### Common Mistakes
1. Moving both pointers instead of one
2. Off-by-one on boundary (left < right vs left <= right)
3. Not handling duplicates in 3Sum variant

### LeetCode Problems
| # | Title | Difficulty | Why this concept |
|---|---|---|---|
| 167 | Two Sum II | Easy | Canonical — sorted array pair |
| 15 | 3Sum | Medium | Two pointer inside for loop |
| 11 | Container With Most Water | Medium | Greedy pointer movement proof |
| 42 | Trapping Rain Water | Hard | Advanced two pointer |
```

---

## Data Flow — End to End

```
App Opens
  → Load SyllabusConfig from syllabus/index.ts  (local, instant)
  → Fetch MasteryRecords from backend            (or localStorage offline)
  → Build Session (FSRS engine)                  (local computation)
  → Render Dashboard

Student studies
  → LiveSession: show concept, student rates self
  → AnswerEvents stored in local state

Session Complete
  → Show SessionComplete screen (local data)
  → Background: POST /session/complete (batch sync)
  → Background: AI generates session insight
  → Next session pre-built for tomorrow

Next day
  → App opens with fresh session
  → Due concepts from yesterday's wrong answers appear first
  → New Tier 1 concepts fill remaining slots
```

---

## Summary — Who Does What

```
TEACHER prepares:
  → Trigger rule, code template, when-not-to-use
  → 3–5 LeetCode problem links per concept
  → Reviews AI-generated MCQs before they go live
  → Creates diagrams for visual concepts (Trees/Graphs)

AI prepares:
  → One-liners, MCQ distractors, answer explanations
  → Error pattern classification after wrong answer
  → Daily study plan + session insight
  → AI tutor responses (RAG over teacher content)
  → Encoding suggestions personalized to weak patterns

BACKEND does:
  → FSRS scheduling (when to show each concept)
  → Session building (composition + subject interleaving)
  → Mastery state updates (after each answer batch)
  → Sync offline state to PostgreSQL

UI does:
  → Show the right concept at the right time
  → Collect honest self-assessment (4 rating buttons)
  → Display Chitta Score + subject breakdown
  → Work fully offline, sync on session complete
  → All exam-specific content from SyllabusConfig — nothing hardcoded
```

---

*Built on GOD MODE Learning System — INPUT → MODEL → STRUGGLE → TEST → COMPRESS → STORE → REUSE*
