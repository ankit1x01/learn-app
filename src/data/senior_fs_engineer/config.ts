import type { SyllabusConfig } from '../../core/types';
import { SENIOR_FS_CONCEPTS } from './concepts';

export const seniorFsConfig: SyllabusConfig = {
  id: 'senior_fs',
  name: 'Full Stack SDE II / Senior',
  studentName: 'Experienced Dev',
  examDate: '2026-12-01',
  daysRemaining: 180,
  targetScoreLabel: 'Interview Ready (5 YoE)',
  examScoreTarget: 95,

  subjects: [
    { name: 'Advanced Frontend Architecture', weight: 0.20, totalConcepts: 5, examQuestions: 20, color: 'text-[#61DAFB]', bgColor: 'bg-[#61DAFB]/10', barColor: 'bg-[#61DAFB]', icon: 'devices', encodingTip: 'React Fiber, Angular Ivy, Core Vitals, Micro-frontends.' },
    { name: 'Backend Performance & Node.js', weight: 0.20, totalConcepts: 5, examQuestions: 20, color: 'text-[#68A063]', bgColor: 'bg-[#68A063]/10', barColor: 'bg-[#68A063]', icon: 'terminal', encodingTip: 'Event loop concurrency, streams, gRPC, WebSockets.' },
    { name: 'Databases & Distributed Data', weight: 0.20, totalConcepts: 5, examQuestions: 20, color: 'text-[#336791]', bgColor: 'bg-[#336791]/10', barColor: 'bg-[#336791]', icon: 'database', encodingTip: 'Transaction isolation, sharding, Redis eviction.' },
    { name: 'Cloud Native & DevOps', weight: 0.20, totalConcepts: 5, examQuestions: 20, color: 'text-[#F59E0B]', bgColor: 'bg-[#F59E0B]/10', barColor: 'bg-[#F59E0B]', icon: 'cloud', encodingTip: 'Docker, Kubernetes, AWS architecture, CI/CD.' },
    { name: 'System Design & Scalability', weight: 0.20, totalConcepts: 5, examQuestions: 20, color: 'text-[#8B5CF6]', bgColor: 'bg-[#8B5CF6]/10', barColor: 'bg-[#8B5CF6]', icon: 'architecture', encodingTip: 'Microservices, message queues, rate limiting, CAP.' }
  ],

  concepts: SENIOR_FS_CONCEPTS,

  sessionComposition: { review: 0.35, new: 0.30, strengthen: 0.25, challenge: 0.10 },
  globalStats: {
    'Advanced Frontend Architecture': { auto: 0, conscious: 0, fragile: 0, unseen: 5 },
    'Backend Performance & Node.js': { auto: 0, conscious: 0, fragile: 0, unseen: 5 },
    'Databases & Distributed Data': { auto: 0, conscious: 0, fragile: 0, unseen: 5 },
    'Cloud Native & DevOps': { auto: 0, conscious: 0, fragile: 0, unseen: 5 },
    'System Design & Scalability': { auto: 0, conscious: 0, fragile: 0, unseen: 5 }
  },
  scoring: { correct: 4, wrong: -1, skip: 0 }
};
