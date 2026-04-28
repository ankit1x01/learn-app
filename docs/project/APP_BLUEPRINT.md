# CHITTA — App Blueprint
> Single source of truth. Read this at the start of every session.
> Updated: 2026-04-28

---

## What This App Is

**CHITTA** — AI-powered learning engine for competitive exam prep and upskilling.
Built on FSRS spaced repetition + 9 neuroscience layers + 10 Vedic learning techniques.
Currently configured for: **AI Engineering**.
Architecture is exam-agnostic — swap `src/data/index.ts` to run any exam.

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
  App.tsx                    ← Core routing and state injection (208 lines)
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

  screens/                   ← Standalone screen components (25+ screens)
    EliteHub.tsx             ← Hub for advanced practice modes
    LiveSession.tsx          ← Core MCQ + quiz + game session runner
    PreSleepReview.tsx       ← NREM sleep consolidation
    ... and 20+ more including Arcade games, Course viewers, and Utilities.

  data/                      ← Syllabi and content
    index.ts                 ← Registry — change ACTIVE_SYLLABUS_ID here
    ai_engineer/             ← AI Engineering config
    ai-engineering/          ← AI Engineering markdown docs, quizzes, course index
    ankit/
    backend_engineer/
    course/
    dsa/
    itplacement/
    school_maths/
    senior_fs_engineer/
    system_design_50l/
    topic-banks/

scripts/
  generate-course-index.mjs  ← Generates course metadata
  generate-markdown-content.mjs
  generate-code-content.mjs
  generate-quiz-content.mjs

docs/                        ← Research specs — read before implementing
```

---

## All Screens — What Each Does + How to Use

### Core Learning Flow
1. **Dashboard** (`dashboard`): Home screen. Chitta Score ring, mastery breakdown.
2. **LiveSession** (`session`): Main MCQ/Quiz/Game session. Tracks confidence, FSRS, response time.
3. **ConceptEncoding** (`encoding`): Depth encoding after new concepts.
4. **ChittaMap** (`map`): Visual network of concepts.
5. **MorningRecall** (`recall`): Morning spaced repetition session.
6. **PreSleepReview** (`presleep`): Evening NREM consolidation review.
7. **SessionComplete** (`complete`): Post-session analytics.

### Course & Arcade Views
8. **AIEngineeringCourse** (`ai-engineering`): Phase browser for AI Engineer.
9. **CourseViewer** (`course`): General course viewer.
10. **LessonDetail** (`course-lesson`): Markdown rendering of course content.
11. **PromptPlayground** (`prompt-playground`): Prompt engineering environment.
12. **PhysicsArcade** (`physics-arcade`): Physics mini-games.
13. **MathArcade** (`math-arcade`): Mathematics mini-games.
14. **ChemistryArcade** (`chemistry-arcade`): Chemistry mini-games.
15. **PhysicsSandbox** (`physics-sandbox`), **KinematicsCannon** (`kinematics-cannon`), **CoulombsCollider** (`coulombs-collider`), **ShapeSlicer** (`shape-slicer`), **GamesHub** (`games`), **DemoSession** (`demo-session`).

### Advanced Practice Modes (EliteHub)
16. **EliteHub** (`elite`): Hub screen for advanced modes.
17. **GhanaPatha** (`ghana`): 15-second hard-cutoff recall drill.
18. **StressMode** (`stress`): Random timer auto-submit.
19. **DistractorTraining** (`distractor`): Elimination questions.
20. **ErrorDashboard** (`errors`): Cluster analysis for concept errors.
21. **MockTest** (`mock`): 45-minute simulation.
22. **PreExamProtocol** (`preexam`): Day-of-exam checklist.
23. **TopicsBank** (`topics`): Full searchable concept bank.

---

## Active Syllabi

Currently active: **ai_engineer** (change in `src/data/index.ts`)

---

## Storage / Persistence

| What | Persisted | Not Persisted |
|---|---|---|
| stage, stability, difficulty, lastTested, queue | ✅ Capacitor Preferences | — |
| encodingDepth, metacogAccuracy, overconfidenceFlag, lastStudiedAt, predictionErrorHistory | ✅ Capacitor Preferences | — |
| quiz_stats, game_stats | ✅ Capacitor Preferences | — |
| relatedIds, competingIds, interferenceScore | — static data | — |
| User notes | ✅ Capacitor Preferences | — |
| Images | ✅ Capacitor Filesystem | — |

---

## Known Bugs
See `BUGS.md` for full list.
