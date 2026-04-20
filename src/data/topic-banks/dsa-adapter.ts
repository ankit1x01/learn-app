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
