import type { SyllabusConfig } from '../../core/types';
import { SENIOR_FS_CONCEPTS } from './concepts';

export const seniorFsConfig: SyllabusConfig = {
  id: 'senior_fs',
  name: 'Senior Full Stack (10 YOE)',
  studentName: 'Architect Candidate',
  examDate: '2026-12-01',
  daysRemaining: 180,
  targetScoreLabel: 'Principal Ready',
  examScoreTarget: 95,

  subjects: [
    { name: 'React 19 & Next.js Architecture', weight: 0.25, totalConcepts: 25, examQuestions: 20, color: 'text-[#61DAFB]', bgColor: 'bg-[#61DAFB]/10', barColor: 'bg-[#61DAFB]', emoji: '⚛️', encodingTip: 'Master Fiber internals & Server Components.' },
    { name: 'Node.js Internals & V8', weight: 0.25, totalConcepts: 25, examQuestions: 20, color: 'text-[#68A063]', bgColor: 'bg-[#68A063]/10', barColor: 'bg-[#68A063]', emoji: '🟩', encodingTip: 'Event loop, IPC, and worker threads deep dive.' },
    { name: 'Angular Enterprise Architecture', weight: 0.15, totalConcepts: 15, examQuestions: 15, color: 'text-[#DD0031]', bgColor: 'bg-[#DD0031]/10', barColor: 'bg-[#DD0031]', emoji: '🅰️', encodingTip: 'Signals, Ivy compiler, and OnPush change detection.' },
    { name: 'Advanced Databases & Storage', weight: 0.20, totalConcepts: 20, examQuestions: 20, color: 'text-[#336791]', bgColor: 'bg-[#336791]/10', barColor: 'bg-[#336791]', emoji: '💾', encodingTip: 'B-Trees, LSM-Trees, MVCC, and Sharding.' },
    { name: 'System Design & Scalability', weight: 0.15, totalConcepts: 15, examQuestions: 25, color: 'text-[#8B5CF6]', bgColor: 'bg-[#8B5CF6]/10', barColor: 'bg-[#8B5CF6]', emoji: '🏗️', encodingTip: 'CAP theorem, microservices, and distributed tracing.' }
  ],

  concepts: SENIOR_FS_CONCEPTS,

  sessionComposition: { review: 0.35, new: 0.30, strengthen: 0.25, challenge: 0.10 },
  globalStats: {
    'React 19 & Next.js Architecture': { auto: 0, conscious: 0, fragile: 0, unseen: 25 },
    'Node.js Internals & V8': { auto: 0, conscious: 0, fragile: 0, unseen: 25 },
    'Angular Enterprise Architecture': { auto: 0, conscious: 0, fragile: 0, unseen: 15 },
    'Advanced Databases & Storage': { auto: 0, conscious: 0, fragile: 0, unseen: 20 },
    'System Design & Scalability': { auto: 0, conscious: 0, fragile: 0, unseen: 15 }
  },
  scoring: { correct: 4, wrong: -1, skip: 0 }
};
