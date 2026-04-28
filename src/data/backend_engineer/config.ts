import type { SyllabusConfig } from '../../core/types';
import { BACKEND_CONCEPTS } from './concepts';

export const backendEngineerConfig: SyllabusConfig = {
  id: 'backend_engineer',
  name: 'Backend Lead / Architect',
  studentName: 'Senior DEV',
  examDate: '2026-12-01',
  daysRemaining: 180,
  targetScoreLabel: 'Lead Ready',
  examScoreTarget: 95,

  subjects: [
    { name: 'Core Language & Frameworks', weight: 0.15, totalConcepts: 6, examQuestions: 15, color: 'text-[#10B981]', bgColor: 'bg-[#10B981]/10', barColor: 'bg-[#10B981]', icon: 'code', encodingTip: 'Node.js, Python, Java, Go & API Design.' },
    { name: 'System Design & Architecture', weight: 0.25, totalConcepts: 7, examQuestions: 25, color: 'text-[#8B5CF6]', bgColor: 'bg-[#8B5CF6]/10', barColor: 'bg-[#8B5CF6]', icon: 'architecture', encodingTip: 'Microservices, CAP Theorem, gRPC & HLD/LLD.' },
    { name: 'Databases & Distributed Data', weight: 0.20, totalConcepts: 6, examQuestions: 20, color: 'text-[#3B82F6]', bgColor: 'bg-[#3B82F6]/10', barColor: 'bg-[#3B82F6]', icon: 'database', encodingTip: 'SQL, NoSQL, Redis, Sharding & Consistency.' },
    { name: 'Infrastructure & DevOps', weight: 0.25, totalConcepts: 7, examQuestions: 25, color: 'text-[#F59E0B]', bgColor: 'bg-[#F59E0B]/10', barColor: 'bg-[#F59E0B]', icon: 'cloud', encodingTip: 'Kubernetes, Docker, Terraform & CI/CD.' },
    { name: 'Leadership & Observability', weight: 0.15, totalConcepts: 5, examQuestions: 15, color: 'text-[#EC4899]', bgColor: 'bg-[#EC4899]/10', barColor: 'bg-[#EC4899]', icon: 'monitoring', encodingTip: 'Tracing, Mentorship, Tech Roadmap & Tradeoffs.' }
  ],

  concepts: BACKEND_CONCEPTS,

  sessionComposition: { review: 0.35, new: 0.30, strengthen: 0.25, challenge: 0.10 },
  globalStats: {
    'Core Language & Frameworks': { auto: 0, conscious: 0, fragile: 0, unseen: 6 },
    'System Design & Architecture': { auto: 0, conscious: 0, fragile: 0, unseen: 7 },
    'Databases & Distributed Data': { auto: 0, conscious: 0, fragile: 0, unseen: 6 },
    'Infrastructure & DevOps': { auto: 0, conscious: 0, fragile: 0, unseen: 7 },
    'Leadership & Observability': { auto: 0, conscious: 0, fragile: 0, unseen: 5 }
  },
  scoring: { correct: 4, wrong: -1, skip: 0 }
};
