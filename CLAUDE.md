# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Session Start Ritual (read every new session)

Before doing anything else, read these files in order:
1. `APP_BLUEPRINT.md` — what's built, how every screen works, all functions
2. `BUILD_STATE.md` — current state, what's wired, what's broken
3. `BUGS.md` — open bugs (fix before building new features)
4. `DESIGN_SYSTEM.md` — **all visual decisions must follow this, every session**
5. Relevant `docs/` file if the session involves a new feature

Then confirm: "I've read BUILD_STATE. The current state is X. Starting from Y."

---

## Session End Ritual

Before ending every session:
1. Run `npm run build` — must succeed, zero errors
2. Update `BUILD_STATE.md` — mark completed items, note next session start point
3. Add any new bugs discovered to `BUGS.md`

---

## Commands

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Production build to /dist
npm run preview   # Preview production build
npm run lint      # TypeScript type-check (no emit)
npm run clean     # Remove /dist
```

**Setup:** Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` before running.

## Architecture

**CHITTA** is a single-page React + TypeScript app (Vite) — an AI-powered NEET 2026 exam prep dashboard built around spaced repetition science.

### Tech Stack
- React 19 + TypeScript, Vite, Tailwind CSS 4, Motion (animations)
- Google GenAI SDK (`@google/genai`) for AI tutor features
- No backend — Express is listed but all logic runs client-side; `GEMINI_API_KEY` is injected via `vite.config.ts` as `process.env.GEMINI_API_KEY`

### Core Data Model
Central entity is `Concept` in `src/core/types.ts`.
Core FSRS fields: `stage, stability, difficulty, lastTested, nextReview, pyqTier`
Neuroscience fields: `encodingDepth, metacogAccuracy, predictionErrorHistory, relatedIds, competingIds, interferenceScore, lastStudiedAt, stakesTier, stakesFact`

### FSRS Spaced Repetition Engine
- **Retrievability:** `R = e^(-t/S)` — due when R < 0.85
- **Stages:** Unseen → Fragile → Conscious → Automatic → ExamReady
- **Session composition:** 35% review, 30% new, 25% strengthen, 10% challenge (time-of-day overrides this)

### Active Syllabi
- `dsa_faang` — 454 DSA problems (FAANG interviews)
- `it_placement_india` — 271 concepts (IT campus placement)
Switch in `src/syllabus/index.ts` → `ACTIVE_SYLLABUS_ID`

### Screen Navigation (14 screens)
All screens in `App.tsx` Screen type. Bottom nav: Home / Session / Topics / Map / Pro.
See `APP_BLUEPRINT.md` for full screen descriptions and navigation map.

### Styling
- Light theme (`#F7F6F3` warm off-white background), clean white cards, `#E8E5DF` borders
- Theme variables and `.card`, `.prose`, `.question-text` utilities defined in `src/index.css`
- Layout is mobile-first (max-width: md), optimized for phone use
- Full design spec in `DESIGN_SYSTEM.md` — **must read before any visual changes**

### Icon Rules (IMPORTANT)
- **Use Lucide React icons only** — never use emojis as UI elements
- Lucide provides professional outline icons (e.g. `BookOpen`, `Home`, `Map`, `BarChart2`)
- Emojis are only acceptable inside static data config files (e.g. `encodingTip`, subject `emoji` field in config) where they appear as content, not UI chrome
- No emoji in: nav bars, buttons, badges, headers, cards, status indicators, or any interactive element
- Reference: Super Kalam app uses clean outline icons throughout — match that aesthetic

### Path Alias
`@/*` maps to the project root (`./`) — configured in both `vite.config.ts` and `tsconfig.json`.

### Environment
- `GEMINI_API_KEY` — required, injected at build time via Vite define
- `APP_URL` — optional, Cloud Run service URL for self-referential links
- `DISABLE_HMR=true` — disables Vite HMR (used in Google AI Studio integration)

### Documentation
```
APP_BLUEPRINT.md              ← Centralized app blueprint (screens, functions, data model)
BUILD_STATE.md                ← Current implementation state — update every session
BUGS.md                       ← Open bugs — fix before new features
docs/
  NEUROSCIENCE_IMPLEMENTATION_PLAN.md  ← 9 layers, all implemented
  VEDIC_LEARNING_SYSTEM.md             ← 10 Vedic techniques spec
  VEDIC_2WEEK_PLAN.md                  ← Active 2-week implementation plan
  AI_EXAM_APP_BLUEPRINT.md             ← Original product spec
  UNCONSCIOUS_MASTERY_ALGORITHM.md     ← FSRS details
```

### Research → Code Pipeline
1. Write `docs/TOPIC.md` (mechanism + CHITTA implementation + FSRS effect)
2. Add fields to `src/core/types.ts` only → run tsc
3. Add pure functions to `fsrs.ts` / `scheduler.ts` / `metacognition.ts`
4. Build screen in `src/screens/` in isolation
5. Wire into `App.tsx` (Screen type + render + navigation)
6. Update `BUILD_STATE.md`
