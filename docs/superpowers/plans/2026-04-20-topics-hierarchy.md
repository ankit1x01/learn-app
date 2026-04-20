# Topics Hierarchy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded DSA TopicsBank with a 3-level drill-down screen: Exam Picker → Subject Picker → Topic Bank, supporting all current and future exams.

**Architecture:** Option C adapter pattern — one `TopicGroup[]` interface, per-exam adapters that map raw data to it, one generic renderer for Level 3. DSA adapter wraps existing `dsa_data.json` with zero data migration. Coming-soon cards for exams without adapters yet.

**Tech Stack:** React 19 + TypeScript, Tailwind CSS 4, motion/react (M3 spring physics from `src/lib/m3-motion.ts`), Material Symbols Rounded icons, existing `SYLLABUS_REGISTRY` from `src/data/index.ts`.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/data/topic-banks/types.ts` | Create | Shared interfaces: `TopicProblem`, `TopicEntry`, `TopicGroup`, `ExamTopicBank` |
| `src/data/topic-banks/exam-registry.ts` | Create | Static list of all 6 exam cards shown on Level 1 |
| `src/data/topic-banks/dsa-adapter.ts` | Create | Maps `dsa_data.json` → `TopicGroup[]`, implements `ExamTopicBank` |
| `src/data/topic-banks/index.ts` | Create | `TOPIC_BANKS` registry: `Record<string, ExamTopicBank>` |
| `src/screens/TopicsScreen.tsx` | Create | 3-level screen: Exam Picker, Subject Picker, Topic Bank |
| `src/App.tsx` | Modify | Swap `TopicsBank` import/render for `TopicsScreen` |
| `src/screens/TopicsBank.tsx` | Keep | Unchanged — legacy, no longer routed to directly |

---

## Task 1: Shared Types

**Files:**
- Create: `src/data/topic-banks/types.ts`

- [ ] **Step 1: Create the file**

```typescript
// src/data/topic-banks/types.ts

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
  icon?: string;        // Material Symbols Rounded name, e.g. 'layers'
  tier?: 1 | 2 | 3;    // Core / Important / Advanced
  accentColor?: string; // CSS var or hex for icon tint
  accentBg?: string;    // CSS var or hex for icon background
}

export interface ExamTopicBank {
  examId: string;
  getGroups: (subjectName: string) => TopicGroup[];
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run lint`
Expected: zero errors

- [ ] **Step 3: Commit**

```bash
git add src/data/topic-banks/types.ts
git commit -m "feat: add topic-banks shared types"
```

---

## Task 2: Exam Display Registry

**Files:**
- Create: `src/data/topic-banks/exam-registry.ts`

- [ ] **Step 1: Create the file**

```typescript
// src/data/topic-banks/exam-registry.ts

export interface ExamCard {
  id: string;
  name: string;
  icon: string;        // Material Symbols Rounded name
  color: string;       // hex accent color
  description: string; // shown as subtitle on card
}

export const EXAM_CARDS: ExamCard[] = [
  {
    id: 'dsa_faang',
    name: 'DSA FAANG',
    icon: 'code',
    color: '#6750A4',
    description: '454 problems · FAANG interviews',
  },
  {
    id: 'it_placement_india',
    name: 'IT Placement',
    icon: 'laptop',
    color: '#0284C7',
    description: '271 concepts · Campus placement',
  },
  {
    id: 'neet_2026',
    name: 'NEET 2026',
    icon: 'science',
    color: '#16A34A',
    description: 'Physics · Chemistry · Biology',
  },
  {
    id: 'iit_jee',
    name: 'IIT JEE',
    icon: 'calculate',
    color: '#EA580C',
    description: 'Maths · Physics · Chemistry',
  },
  {
    id: 'upsc_cse',
    name: 'UPSC CSE',
    icon: 'account_balance',
    color: '#DC2626',
    description: 'GS · CSAT · Optional',
  },
  {
    id: 'mppsc',
    name: 'MPPSC',
    icon: 'location_city',
    color: '#7C3AED',
    description: 'State PCS · MP-specific syllabus',
  },
];
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run lint`
Expected: zero errors

- [ ] **Step 3: Commit**

```bash
git add src/data/topic-banks/exam-registry.ts
git commit -m "feat: add exam display registry for topics screen"
```

---

## Task 3: DSA Adapter

**Files:**
- Create: `src/data/topic-banks/dsa-adapter.ts`

- [ ] **Step 1: Create the adapter**

```typescript
// src/data/topic-banks/dsa-adapter.ts

import type { ExamTopicBank, TopicGroup } from './types';
import rawData from '../dsa_data.json';

// DSA tier mapping (mirrors TopicsBank.tsx GROUP_TIER)
const GROUP_TIER: Record<number, 1 | 2 | 3> = {
  0:1, 1:1, 2:1, 3:1, 9:1, 12:1, 14:1, 15:1,
  4:2, 5:2, 6:2, 7:2, 8:2, 10:2, 11:2, 13:2,
  16:3, 17:3,
};

// Icon + color mapping per group index (mirrors TopicsBank.tsx GROUP_META)
const GROUP_STYLE: Record<number, { icon: string; accentColor: string; accentBg: string }> = {
  0:  { icon: 'layers',        accentColor: 'var(--color-on-surface-variant)', accentBg: 'var(--color-surface-container)' },
  1:  { icon: 'bar_chart',     accentColor: 'var(--color-on-surface-variant)', accentBg: 'var(--color-surface-container)' },
  2:  { icon: 'straighten',    accentColor: 'var(--color-subject-physics)',    accentBg: 'var(--color-subject-physics-container)' },
  3:  { icon: 'search',        accentColor: 'var(--color-subject-physics)',    accentBg: 'var(--color-subject-physics-container)' },
  4:  { icon: 'description',   accentColor: 'var(--color-subject-cs)',         accentBg: 'var(--color-subject-cs-container)' },
  5:  { icon: 'link',          accentColor: 'var(--color-subject-cs)',         accentBg: 'var(--color-subject-cs-container)' },
  6:  { icon: 'refresh',       accentColor: 'var(--color-subject-cs)',         accentBg: 'var(--color-subject-cs-container)' },
  7:  { icon: 'settings',      accentColor: 'var(--color-subject-cs)',         accentBg: 'var(--color-subject-cs-container)' },
  8:  { icon: 'inventory_2',   accentColor: 'var(--color-subject-cs)',         accentBg: 'var(--color-subject-cs-container)' },
  9:  { icon: 'web',           accentColor: 'var(--color-subject-physics)',    accentBg: 'var(--color-subject-physics-container)' },
  10: { icon: 'landscape',     accentColor: 'var(--color-success)',            accentBg: 'var(--color-success-container)' },
  11: { icon: 'lightbulb',     accentColor: '#B45309',                        accentBg: '#FFFBEB' },
  12: { icon: 'park',          accentColor: '#166534',                        accentBg: '#F0FDF4' },
  13: { icon: 'manage_search', accentColor: '#166534',                        accentBg: '#F0FDF4' },
  14: { icon: 'account_tree',  accentColor: '#166534',                        accentBg: '#F0FDF4' },
  15: { icon: 'bolt',          accentColor: '#B45309',                        accentBg: '#FFFBEB' },
  16: { icon: 'eco',           accentColor: '#166534',                        accentBg: '#F0FDF4' },
  17: { icon: 'scroll',        accentColor: '#B45309',                        accentBg: '#FFFBEB' },
};

const DEFAULT_STYLE = { icon: 'layers', accentColor: 'var(--color-primary)', accentBg: 'var(--color-primary-container)' };

interface RawGroup {
  group: string;
  topics: { topic: string; problems: { name: string; link: string; resources: string[]; practices: string[] }[] }[];
}

// DSA has one flat structure — subjectName is ignored (all groups returned for any subject)
const ALL_GROUPS: TopicGroup[] = (rawData as RawGroup[]).map((g, i) => ({
  group: g.group,
  topics: g.topics.map(t => ({
    topic: t.topic,
    problems: t.problems.map(p => ({
      name: p.name,
      link: p.link,
      resources: p.resources,
      practices: p.practices,
    })),
  })),
  icon: (GROUP_STYLE[i] ?? DEFAULT_STYLE).icon,
  tier: GROUP_TIER[i] ?? 2,
  accentColor: (GROUP_STYLE[i] ?? DEFAULT_STYLE).accentColor,
  accentBg: (GROUP_STYLE[i] ?? DEFAULT_STYLE).accentBg,
}));

export const dsaAdapter: ExamTopicBank = {
  examId: 'dsa_faang',
  getGroups: (_subjectName: string) => ALL_GROUPS,
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run lint`
Expected: zero errors

- [ ] **Step 3: Commit**

```bash
git add src/data/topic-banks/dsa-adapter.ts
git commit -m "feat: add DSA topic bank adapter"
```

---

## Task 4: Adapter Registry

**Files:**
- Create: `src/data/topic-banks/index.ts`

- [ ] **Step 1: Create the registry**

```typescript
// src/data/topic-banks/index.ts

export type { TopicProblem, TopicEntry, TopicGroup, ExamTopicBank } from './types';
export { EXAM_CARDS } from './exam-registry';
export type { ExamCard } from './exam-registry';

import type { ExamTopicBank } from './types';
import { dsaAdapter } from './dsa-adapter';

export const TOPIC_BANKS: Record<string, ExamTopicBank> = {
  dsa_faang: dsaAdapter,
  // it_placement_india: itAdapter,  — add when IT topic data is structured
  // neet_2026: neetAdapter,         — add when NEET data is ready
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run lint`
Expected: zero errors

- [ ] **Step 3: Commit**

```bash
git add src/data/topic-banks/index.ts
git commit -m "feat: add topic banks adapter registry"
```

---

## Task 5: TopicsScreen — Level 1 (Exam Picker)

**Files:**
- Create: `src/screens/TopicsScreen.tsx`

- [ ] **Step 1: Create the screen with Level 1 only**

```typescript
// src/screens/TopicsScreen.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EXAM_CARDS, TOPIC_BANKS } from '../data/topic-banks/index';
import type { ExamCard } from '../data/topic-banks/index';
import { SYLLABUS_REGISTRY } from '../data/index';
import type { Screen } from '../types/index';
import { m3SpatialDefault } from '../lib/m3-motion';

interface Props {
  setScreen: (s: Screen) => void;
}

type Level = 'exams' | 'subjects' | 'topics';

export const TopicsScreen: React.FC<Props> = ({ setScreen }) => {
  const [level, setLevel] = useState<Level>('exams');
  const [selectedExam, setSelectedExam] = useState<ExamCard | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1); // 1 = forward, -1 = back

  const navigate = (newLevel: Level, dir: 1 | -1) => {
    setDirection(dir);
    setLevel(newLevel);
  };

  const handleExamSelect = (exam: ExamCard) => {
    if (!TOPIC_BANKS[exam.id]) return; // coming soon — no action
    setSelectedExam(exam);
    navigate('subjects', 1);
  };

  const handleBack = () => {
    if (level === 'subjects') {
      setSelectedExam(null);
      navigate('exams', -1);
    } else if (level === 'topics') {
      setSelectedSubject(null);
      navigate('subjects', -1);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (dir: number) => ({ x: dir * -40, opacity: 0 }),
  };

  return (
    <div className="pt-16 pb-32 max-w-md mx-auto min-h-screen bg-[var(--color-background)]">

      {/* ── Header ── */}
      <div className="sticky top-14 z-30 bg-[var(--color-background)]/95 px-5 pt-4 pb-3 border-b border-[var(--color-outline-variant)]">
        <div className="flex items-center gap-3">
          {level !== 'exams' && (
            <button
              onClick={handleBack}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--color-surface-container)] transition-colors"
            >
              <span className="material-symbols-rounded text-[var(--color-on-surface)]" style={{ fontSize: 22 }}>arrow_back</span>
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold text-[var(--color-on-surface)] leading-tight">
              {level === 'exams' && 'Topics'}
              {level === 'subjects' && selectedExam?.name}
              {level === 'topics' && selectedSubject}
            </h1>
            {level === 'topics' && selectedExam && (
              <p className="text-[12px] text-[var(--color-on-surface-variant)]">{selectedExam.name}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Level content ── */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={level}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={m3SpatialDefault}
          className="px-4 pt-4"
        >
          {/* Level 1 — Exam Picker */}
          {level === 'exams' && (
            <ExamPickerLevel onSelect={handleExamSelect} />
          )}

          {/* Level 2 — Subject Picker */}
          {level === 'subjects' && selectedExam && (
            <SubjectPickerLevel
              exam={selectedExam}
              onSelect={(subject) => {
                setSelectedSubject(subject);
                navigate('topics', 1);
              }}
            />
          )}

          {/* Level 3 — Topic Bank */}
          {level === 'topics' && selectedExam && selectedSubject && (
            <TopicBankLevel
              examId={selectedExam.id}
              subjectName={selectedSubject}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ── Level 1: Exam Picker ──────────────────────────────────────────────────────

const ExamPickerLevel: React.FC<{ onSelect: (exam: ExamCard) => void }> = ({ onSelect }) => (
  <div className="grid grid-cols-2 gap-3">
    {EXAM_CARDS.map(exam => {
      const available = !!TOPIC_BANKS[exam.id];
      return (
        <button
          key={exam.id}
          onClick={() => available && onSelect(exam)}
          className={`relative flex flex-col items-start gap-3 p-4 rounded-[20px] text-left transition-all
            bg-[var(--color-surface-container)]
            ${available ? 'active:scale-95' : 'opacity-60 cursor-default'}`}
        >
          {/* Icon */}
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: exam.color + '20' }}
          >
            <span
              className="material-symbols-rounded"
              style={{ fontSize: 22, color: exam.color, fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
            >
              {exam.icon}
            </span>
          </div>

          {/* Text */}
          <div className="w-full">
            <p className="text-[14px] font-bold text-[var(--color-on-surface)] leading-tight">{exam.name}</p>
            <p className="text-[11px] text-[var(--color-on-surface-variant)] mt-0.5 leading-snug">{exam.description}</p>
          </div>

          {/* Coming soon chip */}
          {!available && (
            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)]">
              Soon
            </span>
          )}
        </button>
      );
    })}
  </div>
);

// ── Level 2: Subject Picker ───────────────────────────────────────────────────

const SubjectPickerLevel: React.FC<{ exam: ExamCard; onSelect: (subject: string) => void }> = ({ exam, onSelect }) => {
  const syllabus = Object.values(
    // Import at module top — done via SYLLABUS_REGISTRY
    {} as Record<string, import('../core/types').SyllabusConfig>
  );
  // Use the registry directly
  const config = (SYLLABUS_REGISTRY as Record<string, import('../core/types').SyllabusConfig>)[exam.id];

  if (!config) return (
    <div className="text-center py-16 text-[var(--color-on-surface-variant)] text-[14px]">
      No subjects found for this exam.
    </div>
  );

  return (
    <div className="space-y-2">
      {config.subjects.map(subject => (
        <button
          key={subject.name}
          onClick={() => onSelect(subject.name)}
          className="w-full flex items-center gap-4 p-4 rounded-[20px] text-left bg-[var(--color-surface-container-low)] active:scale-[0.98] transition-all"
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 ${subject.bgColor}`}>
            {subject.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-[var(--color-on-surface)]">{subject.name}</p>
            <p className="text-[12px] text-[var(--color-on-surface-variant)]">{subject.totalConcepts} topics</p>
          </div>
          <span className="material-symbols-rounded text-[var(--color-on-surface-variant)]" style={{ fontSize: 18 }}>chevron_right</span>
        </button>
      ))}
    </div>
  );
};

// ── Level 3: Topic Bank ───────────────────────────────────────────────────────
// Imported from separate component below — placeholder for Task 7
const TopicBankLevel: React.FC<{ examId: string; subjectName: string }> = ({ examId, subjectName }) => {
  const bank = TOPIC_BANKS[examId];
  if (!bank) return null;
  const groups = bank.getGroups(subjectName);
  return <TopicBankView groups={groups} />;
};

// Placeholder — implemented in Task 7
const TopicBankView: React.FC<{ groups: ReturnType<typeof TOPIC_BANKS[string]['getGroups']> }> = ({ groups }) => (
  <div className="text-center py-16 text-[var(--color-on-surface-variant)] text-[14px]">
    {groups.length} groups — Topic Bank coming in Task 7
  </div>
);
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run lint`
Expected: zero errors (there will be an unused `syllabus` variable — remove that line)

Fix the `SubjectPickerLevel` — the unused variable line `const syllabus = ...` should be deleted. The correct implementation already uses `SYLLABUS_REGISTRY` directly.

Corrected `SubjectPickerLevel`:

```typescript
const SubjectPickerLevel: React.FC<{ exam: ExamCard; onSelect: (subject: string) => void }> = ({ exam, onSelect }) => {
  const config = (SYLLABUS_REGISTRY as Record<string, import('../core/types').SyllabusConfig>)[exam.id];

  if (!config) return (
    <div className="text-center py-16 text-[var(--color-on-surface-variant)] text-[14px]">
      No subjects found for this exam.
    </div>
  );

  return (
    <div className="space-y-2">
      {config.subjects.map(subject => (
        <button
          key={subject.name}
          onClick={() => onSelect(subject.name)}
          className="w-full flex items-center gap-4 p-4 rounded-[20px] text-left bg-[var(--color-surface-container-low)] active:scale-[0.98] transition-all"
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 ${subject.bgColor}`}>
            {subject.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-[var(--color-on-surface)]">{subject.name}</p>
            <p className="text-[12px] text-[var(--color-on-surface-variant)]">{subject.totalConcepts} topics</p>
          </div>
          <span className="material-symbols-rounded text-[var(--color-on-surface-variant)]" style={{ fontSize: 18 }}>chevron_right</span>
        </button>
      ))}
    </div>
  );
};
```

- [ ] **Step 3: Commit**

```bash
git add src/screens/TopicsScreen.tsx
git commit -m "feat: TopicsScreen Level 1 exam picker + Level 2 subject picker"
```

---

## Task 6: Wire TopicsScreen into App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Replace TopicsBank import with TopicsScreen**

In `src/App.tsx`, find:
```typescript
import { TopicsBank }         from './screens/TopicsBank';
```
Replace with:
```typescript
import { TopicsScreen }       from './screens/TopicsScreen';
```

- [ ] **Step 2: Replace the render line**

Find:
```tsx
{screen === 'topics'        && <TopicsBank        setScreen={setScreen} initialSearch={searchQuery} />}
```
Replace with:
```tsx
{screen === 'topics'        && <TopicsScreen       setScreen={setScreen} />}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npm run lint`
Expected: zero errors

- [ ] **Step 4: Verify in browser — Levels 1 and 2 work**

Run: `npm run dev`

Steps to verify:
1. Tap the Topics tab in bottom nav → should see 6 exam cards (DSA FAANG and IT Placement tappable, others show "Soon")
2. Tap "DSA FAANG" → should slide to Level 2 showing 2 subjects (Foundations, Arrays & Search, etc.)
3. Tap back arrow → should slide back to exam picker
4. Tap "NEET 2026" → nothing should happen (coming soon)

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx
git commit -m "feat: wire TopicsScreen into app routing"
```

---

## Task 7: Level 3 — Topic Bank View

**Files:**
- Modify: `src/screens/TopicsScreen.tsx`

- [ ] **Step 1: Add imports at the top of TopicsScreen.tsx**

Add after the existing imports:

```typescript
import { useState, useMemo, useEffect } from 'react';
import { loadTopicsRead, markTopicRead, unmarkTopicRead } from '../db/store';
import type { TopicGroup, TopicEntry, TopicProblem } from '../data/topic-banks/types';
```

Note: `useState`, `useMemo`, `useEffect` are already imported via React — add them to the destructured import instead if needed, or use `React.useState` etc.

- [ ] **Step 2: Replace the placeholder `TopicBankView` component**

Find and replace the entire `TopicBankView` placeholder:

```typescript
// ── Topic Bank View ───────────────────────────────────────────────────────────

const TIER_LABEL: Record<1|2|3, string> = { 1: 'Core', 2: 'Important', 3: 'Advanced' };
const TIER_COLOR: Record<1|2|3, string> = {
  1: 'text-[#B45309] bg-[#FFFBEB]',
  2: 'text-[#1D4ED8] bg-[#EFF6FF]',
  3: 'text-[#6B7280] bg-[#F3F4F6]',
};

const TierPill = ({ tier }: { tier: 1 | 2 | 3 }) => (
  <span className={`px-2 py-0.5 rounded-full text-[12px] font-bold uppercase ${TIER_COLOR[tier]}`}>
    {TIER_LABEL[tier]}
  </span>
);

const TopicBankView: React.FC<{ groups: TopicGroup[] }> = ({ groups }) => {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<1|2|3|0>(0);
  const [openGroups, setOpenGroups] = useState<Set<number>>(new Set());
  const [openTopics, setOpenTopics] = useState<Set<string>>(new Set());
  const [topicsRead, setTopicsRead] = useState<Set<string>>(new Set());
  const [expandedProblem, setExpandedProblem] = useState<string | null>(null);

  useEffect(() => {
    loadTopicsRead().then(s => setTopicsRead(s)).catch(console.error);
  }, []);

  const handleToggleRead = async (key: string) => {
    if (topicsRead.has(key)) {
      await unmarkTopicRead(key);
      setTopicsRead(prev => { const n = new Set(prev); n.delete(key); return n; });
    } else {
      await markTopicRead(key);
      setTopicsRead(prev => new Set([...prev, key]));
    }
  };

  const toggleGroup = (i: number) =>
    setOpenGroups(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });

  const toggleTopic = (key: string) =>
    setOpenTopics(s => { const n = new Set(s); n.has(key) ? n.delete(key) : n.add(key); return n; });

  const q = search.trim().toLowerCase();

  const filtered = useMemo(() => {
    return groups.map((group, gi) => {
      if (tierFilter !== 0 && group.tier !== tierFilter) return null;
      const topics = group.topics.map((topic: TopicEntry) => {
        const problems = topic.problems.filter((p: TopicProblem) =>
          !q || p.name.toLowerCase().includes(q) || topic.topic.toLowerCase().includes(q) || group.group.toLowerCase().includes(q)
        );
        if (problems.length === 0 && q) return null;
        return { ...topic, problems };
      }).filter(Boolean) as (TopicEntry & { problems: TopicProblem[] })[];
      if (topics.length === 0) return null;
      return { group, gi, topics };
    }).filter(Boolean) as { group: TopicGroup; gi: number; topics: (TopicEntry & { problems: TopicProblem[] })[] }[];
  }, [groups, q, tierFilter]);

  const effectiveOpenGroups = useMemo(() => {
    if (q) { const s = new Set<number>(); filtered.forEach(f => s.add(f.gi)); return s; }
    return openGroups;
  }, [q, filtered, openGroups]);

  const effectiveOpenTopics = useMemo(() => {
    if (q) {
      const s = new Set<string>();
      filtered.forEach(f => f.topics.forEach(t => s.add(`${f.gi}-${t.topic}`)));
      return s;
    }
    return openTopics;
  }, [q, filtered, openTopics]);

  const totalVisible = filtered.reduce((s, f) => s + f.topics.reduce((ss, t) => ss + t.problems.length, 0), 0);
  const hasTiers = groups.some(g => g.tier !== undefined);

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" style={{ fontSize: 16 }}>search</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search topics, problems..."
          className="w-full bg-[var(--color-surface-container)] border-0 rounded-2xl pl-10 pr-9 py-3 text-[14px] text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="material-symbols-rounded text-[var(--color-on-surface-variant)]" style={{ fontSize: 16 }}>close</span>
          </button>
        )}
      </div>

      {/* Tier filter pills — only shown if groups have tier data */}
      {hasTiers && (
        <div className="flex gap-2 flex-wrap">
          {([0, 1, 2, 3] as const).map(t => (
            <button
              key={t}
              onClick={() => setTierFilter(prev => prev === t ? 0 : t)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                tierFilter === t
                  ? t === 0 ? 'bg-[var(--color-on-surface)] text-[var(--color-surface)]'
                  : t === 1 ? 'bg-[#B45309] text-white'
                  : t === 2 ? 'bg-[#1D4ED8] text-white'
                  : 'bg-[#6B7280] text-white'
                  : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]'
              }`}
            >
              {t === 0 ? 'All' : t === 1 ? 'Core' : t === 2 ? 'Important' : 'Advanced'}
            </button>
          ))}
          {(q || tierFilter !== 0) && (
            <span className="ml-auto text-[12px] text-[var(--color-on-surface-variant)] self-center">{totalVisible} shown</span>
          )}
        </div>
      )}

      {/* Groups */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-[var(--color-on-surface-variant)] text-[14px]">
          No results for "{search}"
        </div>
      )}

      {filtered.map(({ group, gi, topics }) => {
        const isOpen = effectiveOpenGroups.has(gi);
        const groupProblemCount = topics.reduce((s, t) => s + t.problems.length, 0);
        const accentColor = group.accentColor ?? 'var(--color-primary)';
        const accentBg = group.accentBg ?? 'var(--color-primary-container)';

        return (
          <div key={gi} className="rounded-[20px] overflow-hidden bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]">
            {/* Group header */}
            <button
              onClick={() => toggleGroup(gi)}
              className="w-full flex items-center gap-3 p-4 text-left"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: accentBg }}>
                <span className="material-symbols-rounded" style={{ fontSize: 18, color: accentColor, fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                  {group.icon ?? 'layers'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[14px] text-[var(--color-on-surface)] leading-tight">{group.group}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[12px] text-[var(--color-on-surface-variant)]">
                    {topics.length} topic{topics.length !== 1 ? 's' : ''} · {groupProblemCount} problems
                  </span>
                  {group.tier && <TierPill tier={group.tier} />}
                </div>
              </div>
              <span className="material-symbols-rounded text-[var(--color-on-surface-variant)] shrink-0" style={{ fontSize: 18 }}>
                {isOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {/* Topics */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-[var(--color-outline-variant)]">
                    {topics.map((topic, ti) => {
                      const topicKey = `${gi}-${topic.topic}`;
                      const isTopicOpen = effectiveOpenTopics.has(topicKey);

                      return (
                        <div key={ti} className="border-b border-[var(--color-outline-variant)] last:border-0">
                          <div className="flex items-center">
                            <button
                              onClick={() => toggleTopic(topicKey)}
                              className="flex-1 flex items-center gap-3 px-4 py-3 text-left"
                            >
                              <span className="material-symbols-rounded shrink-0" style={{ fontSize: 14, color: accentColor }}>layers</span>
                              <span className="flex-1 text-[13px] text-[var(--color-on-surface)] font-medium leading-snug">{topic.topic}</span>
                              <span className="text-[12px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{ color: accentColor, backgroundColor: accentBg }}>
                                {topic.problems.length}
                              </span>
                              <span className="material-symbols-rounded text-[var(--color-on-surface-variant)] shrink-0" style={{ fontSize: 14 }}>
                                {isTopicOpen ? 'expand_less' : 'chevron_right'}
                              </span>
                            </button>
                            <button
                              onClick={() => handleToggleRead(topicKey)}
                              className="shrink-0 px-3 py-3"
                              title={topicsRead.has(topicKey) ? 'Mark unread' : 'Mark as read'}
                            >
                              <span className="material-symbols-rounded" style={{ fontSize: 18, color: topicsRead.has(topicKey) ? '#15803D' : 'var(--color-on-surface-variant)', fontVariationSettings: topicsRead.has(topicKey) ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                                check_circle
                              </span>
                            </button>
                          </div>

                          {/* Problems */}
                          <AnimatePresence>
                            {isTopicOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.18 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-8 pr-4 pb-2 space-y-1">
                                  {topic.problems.map((problem, pi) => {
                                    const isExpanded = expandedProblem === `${topicKey}-${pi}`;
                                    return (
                                      <div key={pi} className="rounded-xl overflow-hidden">
                                        <button
                                          onClick={() => setExpandedProblem(isExpanded ? null : `${topicKey}-${pi}`)}
                                          className="w-full flex items-center gap-2 py-2 px-3 text-left bg-[var(--color-surface-container)] rounded-xl"
                                        >
                                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                                          <span className="flex-1 text-[13px] text-[var(--color-on-surface)]">{problem.name}</span>
                                          {problem.link && (
                                            <span className="material-symbols-rounded text-[var(--color-on-surface-variant)]" style={{ fontSize: 14 }}>
                                              {isExpanded ? 'expand_less' : 'expand_more'}
                                            </span>
                                          )}
                                        </button>

                                        {/* Resources */}
                                        {isExpanded && (problem.resources?.length || problem.link) && (
                                          <div className="px-3 pb-2 pt-1 space-y-1 bg-[var(--color-surface-container)]">
                                            {problem.link && (
                                              <a
                                                href={problem.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-[12px] text-[var(--color-primary)] font-medium py-1"
                                              >
                                                <span className="material-symbols-rounded" style={{ fontSize: 14 }}>open_in_new</span>
                                                Problem link
                                              </a>
                                            )}
                                            {problem.resources?.map((r, ri) => (
                                              <a
                                                key={ri}
                                                href={r}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-[12px] text-[var(--color-on-surface-variant)] py-0.5"
                                              >
                                                <span className="material-symbols-rounded" style={{ fontSize: 12 }}>link</span>
                                                <span className="truncate">{new URL(r).hostname.replace('www.', '')}</span>
                                              </a>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npm run lint`
Expected: zero errors

- [ ] **Step 4: Verify in browser — full flow works**

Run: `npm run dev`

Steps to verify:
1. Topics tab → tap "DSA FAANG" → tap "DSA & Coding" (or any subject)
2. Level 3 should show all 18 DSA groups
3. Tap a group → topics expand
4. Tap a topic → problems expand
5. Tap a problem → link + resources appear
6. Tap check circle on a topic → turns green (persists on reload)
7. Type in search bar → groups/topics filter in real time
8. Tap All / Core / Important / Advanced filter pills → filter works
9. Tap back → returns to subject picker
10. Tap back again → returns to exam picker

- [ ] **Step 5: Commit**

```bash
git add src/screens/TopicsScreen.tsx
git commit -m "feat: TopicsScreen Level 3 topic bank with search, filters, read tracking"
```

---

## Task 8: Production Build Verification

**Files:** None

- [ ] **Step 1: Run production build**

Run: `npm run build`
Expected: zero errors, zero TypeScript errors

- [ ] **Step 2: Update BUILD_STATE.md**

Open `docs/project/BUILD_STATE.md` and add under a new section:

```markdown
## Topics Screen Hierarchy ✅ COMPLETE

**3-level drill-down: Exam → Subject → Topics**
- ✅ Level 1: Exam picker — 6 exam cards, DSA FAANG + IT Placement tappable, others "Coming Soon"
- ✅ Level 2: Subject picker — reads from SYLLABUS_REGISTRY
- ✅ Level 3: Topic bank — groups → topics → problems + resources, search, tier filter, read/unread
- ✅ Adapter pattern: `src/data/topic-banks/` — add new exams by creating an adapter
- ✅ M3 Expressive slide transitions, Material Symbols Rounded icons, M3 color tokens
- ✅ TopicsBank.tsx kept (no longer routed — can be removed in future cleanup)
```

- [ ] **Step 3: Final commit**

```bash
git add docs/project/BUILD_STATE.md
git commit -m "docs: update BUILD_STATE — Topics hierarchy complete"
```
