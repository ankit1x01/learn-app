# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Session Start Ritual (read every new session)

Before doing anything else, read these files in order:
1. `docs/project/APP_BLUEPRINT.md` — what's built, how every screen works, all functions
2. `docs/project/BUILD_STATE.md` — current state, what's wired, what's broken
3. `docs/project/BUGS.md` — open bugs (fix before building new features)
4. `DESIGN_SYSTEM.md` — **single source of truth for ALL visual decisions**
5. `docs/project/M3_EXPRESSIVE_GUIDELINES.md` — M3 Expressive motion + shape rules
6. Relevant `docs/` file if the session involves a new feature

> **Design rule:** ANY change to UI, layout, color, spacing, motion, or icons MUST reference
> `DESIGN_SYSTEM.md` first. Never use ad-hoc colors or arbitrary spacing.

Then confirm: "I've read BUILD_STATE. The current state is X. Starting from Y."

---

## Session End Ritual

Before ending every session:
1. Run `npm run build` — must succeed, zero errors
2. Update `docs/project/BUILD_STATE.md` — mark completed items, note next session start point
3. Add any new bugs discovered to `docs/project/BUGS.md`

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
- **Theme:** M3 Expressive Light — Background `#FFFBFE`, Primary `#6750A4`, Roboto font
- **Source of truth:** `DESIGN_SYSTEM.md` (colors, typography, shape, elevation, motion, components)
- **Supplementary:** `docs/project/M3_EXPRESSIVE_GUIDELINES.md` (M3 Expressive spring physics + shape tension)
- Theme CSS variables and `.card`, `.btn-primary`, `.question-text` utilities in `src/index.css`
- Layout is mobile-first (max-width: md), optimized for phone use
- **NEVER** use: Tailwind blue `#2563EB`, neon colors, `backdrop-filter blur`, arbitrary `rgba()` stacking
- **Icon library:** Material Symbols Rounded (M3 official) — see Icon System section below

### Icon System (IMPORTANT)
- **Primary: Material Symbols Rounded** — loaded in `index.html`, used via `<span className="material-symbols-rounded">icon_name</span>`
- Set `fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"` for filled/active state
- Set `FILL=0` for inactive/default state
- Full icon map in `DESIGN_SYSTEM.md` Section 9
- **Lucide React is legacy** — still present in some screens; migrate to Material Symbols on any screen you touch
- **No emojis** in any UI element (nav, buttons, badges, cards, headers)
- Emojis only in static data config files (`encodingTip` field, etc.) as text content

### Path Alias
`@/*` maps to the project root (`./`) — configured in both `vite.config.ts` and `tsconfig.json`.

### Environment
- `GEMINI_API_KEY` — required, injected at build time via Vite define
- `APP_URL` — optional, Cloud Run service URL for self-referential links
- `DISABLE_HMR=true` — disables Vite HMR (used in Google AI Studio integration)

### Documentation
```
DESIGN_SYSTEM.md                          ← ★ Visual single source of truth (read every session)
docs/project/
  APP_BLUEPRINT.md                         ← Screens, functions, data model
  BUILD_STATE.md                           ← Current state — update every session
  BUGS.md                                  ← Open bugs — fix before new features
  M3_EXPRESSIVE_GUIDELINES.md             ← M3 Expressive motion + shape rules
  ARCHITECTURE.md                          ← Full system architecture
  RND_PLANNING.md                          ← R&D and future planning
docs/research/
  NEUROSCIENCE_IMPLEMENTATION_PLAN.md     ← 9 neuroscience layers
  UNCONSCIOUS_MASTERY_ALGORITHM.md        ← FSRS algorithm details
  VEDIC_LEARNING_SYSTEM.md               ← 10 Vedic techniques
docs/mppsc/                               ← MPPSC question paper PDFs + pipeline
  mppsc_project_summary.md               ← MPPSC data pipeline overview
```

### Research → Code Pipeline
1. Write `docs/TOPIC.md` (mechanism + CHITTA implementation + FSRS effect)
2. Add fields to `src/core/types.ts` only → run tsc
3. Add pure functions to `fsrs.ts` / `scheduler.ts` / `metacognition.ts`
4. Build screen in `src/screens/` in isolation
5. Wire into `App.tsx` (Screen type + render + navigation)
6. Update `BUILD_STATE.md`
