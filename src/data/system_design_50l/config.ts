import type { SyllabusConfig } from '../../core/types';
import { systemDesign50LConcepts } from './concepts';

export const systemDesign50LConfig: SyllabusConfig = {
  id: 'system_design_50l',
  name: 'System Design (50L+ Bar)',
  studentName: 'Architect',
  examDate: '2026-12-01',
  daysRemaining: 180,
  targetScoreLabel: 'Staff Ready',
  examScoreTarget: 95,

  subjects: [
    { name: 'High-Level Design & Arch', weight: 0.20, totalConcepts: 4, examQuestions: 20, color: 'text-[#2DD4BF]', bgColor: 'bg-[#2DD4BF]/10', barColor: 'bg-[#2DD4BF]', icon: 'architecture', encodingTip: 'Distributed Systems, CAP, Load Balancing, Microservices' },
    { name: 'Low-Level Design & Code', weight: 0.15, totalConcepts: 4, examQuestions: 15, color: 'text-[#A78BFA]', bgColor: 'bg-[#A78BFA]/10', barColor: 'bg-[#A78BFA]', icon: 'code', encodingTip: 'SOLID, Patterns, Concurrency, DDD' },
    { name: 'Data Strategy & Storage', weight: 0.20, totalConcepts: 4, examQuestions: 20, color: 'text-[#F472B6]', bgColor: 'bg-[#F472B6]/10', barColor: 'bg-[#F472B6]', icon: 'database', encodingTip: 'SQL vs NoSQL, Sharding, Replication, Caching' },
    { name: 'Asynchronous & Event-Driven', weight: 0.15, totalConcepts: 3, examQuestions: 15, color: 'text-[#38BDF8]', bgColor: 'bg-[#38BDF8]/10', barColor: 'bg-[#38BDF8]', icon: 'bolt', encodingTip: 'Kafka, RabbitMQ, SQS, Saga, CQRS' },
    { name: 'Advanced Production Eng', weight: 0.15, totalConcepts: 9, examQuestions: 15, color: 'text-[#FB923C]', bgColor: 'bg-[#FB923C]/10', barColor: 'bg-[#FB923C]', icon: 'rocket_launch', encodingTip: 'FinOps, Observability, Security, AI Infra' },
    { name: 'Leadership & Career', weight: 0.15, totalConcepts: 3, examQuestions: 15, color: 'text-[#EC4899]', bgColor: 'bg-[#EC4899]/10', barColor: 'bg-[#EC4899]', icon: 'groups', encodingTip: 'Mentorship, Tech Roadmap, Game Theory' }
  ],

  concepts: systemDesign50LConcepts,

  sessionComposition: { review: 0.35, new: 0.30, strengthen: 0.25, challenge: 0.10 },
  globalStats: {
    'High-Level Design & Arch': { auto: 0, conscious: 0, fragile: 0, unseen: 4 },
    'Low-Level Design & Code': { auto: 0, conscious: 0, fragile: 0, unseen: 4 },
    'Data Strategy & Storage': { auto: 0, conscious: 0, fragile: 0, unseen: 4 },
    'Asynchronous & Event-Driven': { auto: 0, conscious: 0, fragile: 0, unseen: 3 },
    'Advanced Production Eng': { auto: 0, conscious: 0, fragile: 0, unseen: 9 },
    'Leadership & Career': { auto: 0, conscious: 0, fragile: 0, unseen: 3 }
  },
  scoring: { correct: 4, wrong: -1, skip: 0 }
};
