import { getActiveSyllabus } from '../data';
import type { SyllabusConfig, SubjectConfig, SubjectStats, Concept } from '../core/types';

export const CONFIG: SyllabusConfig = getActiveSyllabus();

export const getSubject = (name: string): SubjectConfig | undefined =>
  CONFIG.subjects.find(s => s.name === name);
export const subjectColor  = (name: string) => getSubject(name)?.color   ?? 'text-[#6B7280]';
export const subjectBg     = (name: string) => getSubject(name)?.bgColor ?? 'bg-[var(--color-surface-container)]';
export const subjectBar    = (name: string) => getSubject(name)?.barColor ?? 'bg-[var(--color-surface-container)]';
export const subjectIcon   = (name: string) => getSubject(name)?.icon    ?? 'menu_book';
export const totalConcepts = CONFIG.subjects.reduce((s, x) => s + x.totalConcepts, 0);
export const totalExamQ    = CONFIG.subjects.reduce((s, x) => s + x.examQuestions, 0);

export const QUEUE_LABELS: Record<import('../core/types').Queue, { label: string; color: string; bg: string }> = {
  review:    { label: 'DUE REVIEW',  color: 'text-[#B91C1C]',    bg: 'bg-[#FEF2F2]'    },
  new:       { label: 'NEW',         color: 'text-primary',  bg: 'bg-primary/10'  },
  strengthen: { label: 'STRENGTHEN', color: 'text-[#0E7490]', bg: 'bg-[#ECFEFF]' },
  challenge:  { label: 'CHALLENGE',  color: 'text-[#7C3AED]', bg: 'bg-[#F5F3FF]' },
};

export const RATINGS = [
  { id: 'clean',   label: 'Solved Clean',      sub: 'No hesitation, correct approach', outcome: 'correct' as const, icon: 'check_circle' },
  { id: 'hints',   label: 'Needed a Hint',      sub: 'Right idea, minor gaps',          outcome: 'partial' as const, icon: 'pending' },
  { id: 'stuck',   label: 'Got Stuck',          sub: 'Couldn\'t complete in time',       outcome: 'wrong'   as const, icon: 'error' },
  { id: 'unseen',  label: 'Never Seen This',    sub: 'First encounter with pattern',     outcome: 'wrong'   as const, icon: 'cancel' },
];

export const examReadiness = (s: { auto: number; conscious: number; fragile: number; unseen: number }, totalConcepts: number, totalQ: number): number => {
  const pCorrect = (s.auto * 0.92 + s.conscious * 0.62 + s.fragile * 0.30 + s.unseen * 0.22) / totalConcepts;
  return Math.round(pCorrect * totalQ);
};

export const computeGlobalStats = (concepts: Concept[]): Record<string, SubjectStats> => {
  const stats: Record<string, SubjectStats> = {};
  for (const c of concepts) {
    if (!stats[c.subject]) stats[c.subject] = { auto: 0, conscious: 0, fragile: 0, unseen: 0 };
    if (c.stage === 'Automatic' || c.stage === 'ExamReady') stats[c.subject].auto++;
    else if (c.stage === 'Conscious') stats[c.subject].conscious++;
    else if (c.stage === 'Fragile') stats[c.subject].fragile++;
    else stats[c.subject].unseen++;
  }
  return stats;
};
