# Topics Screen — Exam → Subject → Topics Hierarchy

**Date:** 2026-04-20  
**Status:** Approved  
**Scope:** Redesign TopicsBank into a 3-level drill-down browser supporting all current and future exams.

---

## Problem

The current `TopicsBank` screen is hardcoded to DSA (`dsa_data.json`). The app is being built for multiple exams (NEET, IIT JEE, UPSC, MPPSC, DSA, IT Placement). The Topics screen must work for all of them with a consistent UI and extensible data layer.

---

## Solution Overview

Replace the flat `TopicsBank` screen with a 3-level drill-down `TopicsScreen`:

```
Level 1 → Exam Picker     (all exams in registry, coming soon for unavailable)
Level 2 → Subject Picker  (subjects within the chosen exam)
Level 3 → Topic Bank      (topic groups → topics → problems/resources)
```

---

## Screen Structure

### Level 1 — Exam Picker

- Grid of exam cards (2-column)
- Each card shows: exam name, Material Symbols icon, concept/topic count
- If `TOPIC_BANKS[examId]` exists → tappable, navigates to Level 2
- If not → card shows "Coming Soon" chip, non-interactive (same visual weight, slightly muted)
- Header: "Topics" with no back button

### Level 2 — Subject Picker

- Header: back arrow + exam name as breadcrumb
- Grid or vertical list of subject cards
- Each card shows: subject name, emoji, topic count, subject color
- Data source: `SyllabusConfig.subjects[]` from the syllabus registry
- Tapping a subject navigates to Level 3

### Level 3 — Topic Bank

- Header: back arrow + "ExamName / SubjectName" breadcrumb
- Reuses existing TopicsBank UI: groups → topics → problems with links + resources
- Data source: `ExamTopicBank.getGroups(subjectName)` from the adapter registry
- Search bar, read/unread tracking — same as current TopicsBank

### Navigation Transitions

- Drilling deeper: slide-in from right (M3 spring physics)
- Going back: slide-out to right
- Back button at Levels 2 and 3 only

---

## Data Architecture

### Shared Interface (`src/data/topic-banks/types.ts`)

```typescript
export interface TopicProblem {
  name: string;
  link?: string;
  resources?: string[];
  practices?: string[];
}

export interface TopicEntry {
  topic: string;
  problems: TopicProblem[];
}

export interface TopicGroup {
  group: string;
  topics: TopicEntry[];
}

export interface ExamTopicBank {
  examId: string;
  getGroups: (subjectName: string) => TopicGroup[];
}
```

### Exam Display Registry (`src/data/topic-banks/exam-registry.ts`)

Defines what cards appear on Level 1 — independent of whether data exists.

```typescript
export interface ExamCard {
  id: string;
  name: string;
  icon: string;       // Material Symbols Rounded name
  color: string;      // hex, used as accent
  description: string;
}

export const EXAM_CARDS: ExamCard[] = [
  { id: 'dsa_faang',          name: 'DSA FAANG',    icon: 'code',            color: '#6750A4', description: '454 problems · FAANG interviews' },
  { id: 'it_placement_india', name: 'IT Placement',  icon: 'laptop',          color: '#0284C7', description: '271 concepts · Campus placement' },
  { id: 'neet_2026',          name: 'NEET 2026',     icon: 'science',         color: '#16A34A', description: 'Physics · Chemistry · Biology' },
  { id: 'iit_jee',            name: 'IIT JEE',       icon: 'calculate',       color: '#EA580C', description: 'Maths · Physics · Chemistry' },
  { id: 'upsc_cse',           name: 'UPSC CSE',      icon: 'account_balance', color: '#DC2626', description: 'GS · CSAT · Optional' },
  { id: 'mppsc',              name: 'MPPSC',         icon: 'location_city',   color: '#7C3AED', description: 'State PCS · MP-specific syllabus' },
];
```

### Adapter Registry (`src/data/topic-banks/index.ts`)

```typescript
import { dsaAdapter } from './dsa-adapter';

export const TOPIC_BANKS: Record<string, ExamTopicBank> = {
  dsa_faang: dsaAdapter,
  // it_placement_india: itAdapter,  ← add when IT topic data is structured
  // neet_2026: neetAdapter,         ← add when NEET data is ready
};
```

### DSA Adapter (`src/data/topic-banks/dsa-adapter.ts`)

Wraps existing `dsa_data.json`. Since DSA has a single flat structure (not split by subject), `getGroups()` ignores `subjectName` and returns all groups. This is acceptable — DSA FAANG has only one "subject" effectively.

---

## New Files

| File | Purpose |
|------|---------|
| `src/data/topic-banks/types.ts` | Shared `TopicGroup`, `ExamTopicBank` interfaces |
| `src/data/topic-banks/exam-registry.ts` | Exam display config (all 6 exams) |
| `src/data/topic-banks/dsa-adapter.ts` | Wraps `dsa_data.json` → `TopicGroup[]` |
| `src/data/topic-banks/index.ts` | Adapter registry (`TOPIC_BANKS` map) |
| `src/screens/TopicsScreen.tsx` | New 3-level screen component |

## Modified Files

| File | Change |
|------|--------|
| `src/App.tsx` | Route `screen === 'topics'` to `TopicsScreen` instead of `TopicsBank` |
| `src/screens/TopicsBank.tsx` | Keep unchanged — Level 3 reuses its group/topic/problem rendering logic (or extracts it into a shared component) |

---

## Styling

- Follows `DESIGN_SYSTEM.md` — M3 Expressive Light theme
- Exam cards: M3 shape scale (`radius-m3-xl` 20px), surface-container background, colored icon
- Subject cards: subject color accent, emoji, surface-container-low background
- Slide transitions: M3 spring physics from `src/lib/m3-motion.ts`
- Icons: Material Symbols Rounded only — no Lucide, no emojis in UI

---

## Out of Scope

- Adding concept data for NEET, IIT JEE, UPSC, MPPSC (separate future sessions)
- Modifying the FSRS session engine or concept tracking
- Search across all exams simultaneously
