import type { SyllabusConfig } from '../../core/types';
import { AI_CONCEPTS } from './concepts';

export const aiEngineerConfig: SyllabusConfig = {
  id: 'ai_engineer',
  name: 'AI Engineer Pro',
  studentName: 'Job Seeker',
  examDate: '2026-12-01',
  daysRemaining: 180,
  targetScoreLabel: 'Job Ready',
  examScoreTarget: 95,

  subjects: [
    { name: 'Core Foundations (Python, Math, SQL)', weight: 0.15, totalConcepts: 6, examQuestions: 15, color: 'text-[#3B82F6]', bgColor: 'bg-[#3B82F6]/10', barColor: 'bg-[#3B82F6]', emoji: '🐍', encodingTip: 'Data structures, NumPy, Pandas, SQL & System Design.' },
    { name: 'Machine Learning', weight: 0.15, totalConcepts: 5, examQuestions: 15, color: 'text-[#10B981]', bgColor: 'bg-[#10B981]/10', barColor: 'bg-[#10B981]', emoji: '🤖', encodingTip: 'Understand loss functions, XGBoost, PCA & Eval metrics.' },
    { name: 'Deep Learning & PyTorch', weight: 0.15, totalConcepts: 4, examQuestions: 15, color: 'text-[#8B5CF6]', bgColor: 'bg-[#8B5CF6]/10', barColor: 'bg-[#8B5CF6]', emoji: '🧠', encodingTip: 'Code CNNs/RNNs from scratch. Map out tensor shapes.' },
    { name: 'Generative AI & LLMs (RAG, Agents)', weight: 0.35, totalConcepts: 7, examQuestions: 35, color: 'text-[#EC4899]', bgColor: 'bg-[#EC4899]/10', barColor: 'bg-[#EC4899]', emoji: '✨', encodingTip: 'OpenAI API, RAG, Vector DBs, LangChain & Agents.' },
    { name: 'MLOps & Deployment', weight: 0.20, totalConcepts: 5, examQuestions: 20, color: 'text-[#F59E0B]', bgColor: 'bg-[#F59E0B]/10', barColor: 'bg-[#F59E0B]', emoji: '🚀', encodingTip: 'Docker, FastAPI, AWS/GCP, K8s, CI/CD pipelines.' }
  ],

  concepts: AI_CONCEPTS,

  sessionComposition: { review: 0.35, new: 0.30, strengthen: 0.25, challenge: 0.10 },
  globalStats: {
    'Core Foundations (Python, Math, SQL)': { auto: 0, conscious: 0, fragile: 0, unseen: 6 },
    'Machine Learning': { auto: 0, conscious: 0, fragile: 0, unseen: 5 },
    'Deep Learning & PyTorch': { auto: 0, conscious: 0, fragile: 0, unseen: 4 },
    'Generative AI & LLMs (RAG, Agents)': { auto: 0, conscious: 0, fragile: 0, unseen: 7 },
    'MLOps & Deployment': { auto: 0, conscious: 0, fragile: 0, unseen: 5 }
  },
  scoring: { correct: 4, wrong: -1, skip: 0 }
};
