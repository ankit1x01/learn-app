import type { SyllabusConfig } from '../../core/types';
import { SENIOR_FS_CONCEPTS } from './concepts';

export const seniorFsConfig: SyllabusConfig = {
  id: 'senior_fs',
  name: 'Full Stack Masterclass',
  studentName: 'Student',
  examDate: '2026-12-01',
  daysRemaining: 180,
  targetScoreLabel: 'Full Stack Expert',
  examScoreTarget: 95,

  subjects: [
    { name: 'Phase 1: Web & JS/TS Foundations', weight: 0.15, totalConcepts: 20, examQuestions: 15, color: 'text-[#F7DF1E]', bgColor: 'bg-[#F7DF1E]/10', barColor: 'bg-[#F7DF1E]', emoji: '🟨', encodingTip: 'Master the primitives first: DOM, Event Loop, Closures.' },
    { name: 'Phase 2: Frontend Mastery (React & Angular)', weight: 0.25, totalConcepts: 25, examQuestions: 25, color: 'text-[#61DAFB]', bgColor: 'bg-[#61DAFB]/10', barColor: 'bg-[#61DAFB]', emoji: '⚛️', encodingTip: 'Understand component lifecycles, hooks, and state management.' },
    { name: 'Phase 3: Backend & APIs (Node.js)', weight: 0.20, totalConcepts: 20, examQuestions: 20, color: 'text-[#68A063]', bgColor: 'bg-[#68A063]/10', barColor: 'bg-[#68A063]', emoji: '🟩', encodingTip: 'Express, REST, GraphQL, Authentication.' },
    { name: 'Phase 4: Databases & Caching', weight: 0.20, totalConcepts: 20, examQuestions: 20, color: 'text-[#336791]', bgColor: 'bg-[#336791]/10', barColor: 'bg-[#336791]', emoji: '💾', encodingTip: 'SQL vs NoSQL, Indexing, and Redis.' },
    { name: 'Phase 5: Architect & System Design', weight: 0.20, totalConcepts: 15, examQuestions: 20, color: 'text-[#8B5CF6]', bgColor: 'bg-[#8B5CF6]/10', barColor: 'bg-[#8B5CF6]', emoji: '🏗️', encodingTip: 'Docker, AWS, Microservices, CAP Theorem.' }
  ],

  concepts: SENIOR_FS_CONCEPTS,

  sessionComposition: { review: 0.35, new: 0.30, strengthen: 0.25, challenge: 0.10 },
  globalStats: {
    'Phase 1: Web & JS/TS Foundations': { auto: 0, conscious: 0, fragile: 0, unseen: 20 },
    'Phase 2: Frontend Mastery (React & Angular)': { auto: 0, conscious: 0, fragile: 0, unseen: 25 },
    'Phase 3: Backend & APIs (Node.js)': { auto: 0, conscious: 0, fragile: 0, unseen: 20 },
    'Phase 4: Databases & Caching': { auto: 0, conscious: 0, fragile: 0, unseen: 20 },
    'Phase 5: Architect & System Design': { auto: 0, conscious: 0, fragile: 0, unseen: 15 }
  },
  scoring: { correct: 4, wrong: -1, skip: 0 }
};
