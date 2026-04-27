import type { SyllabusConfig } from '../../core/types';
import { AI_CONCEPTS } from './concepts';

export const aiEngineerConfig: SyllabusConfig = {
  id: 'ai_engineer',
  name: 'Lead GenAI Engineer',
  studentName: 'Future AI Lead',
  examDate: '2026-12-01',
  daysRemaining: 220,
  targetScoreLabel: 'Lead-Ready',
  examScoreTarget: 95,

  subjects: [
    { name: 'Core Foundations',           weight: 0.07, totalConcepts: 6,  examQuestions: 7,  color: 'text-[#3B82F6]', bgColor: 'bg-[#3B82F6]/10', barColor: 'bg-[#3B82F6]', emoji: '🐍', encodingTip: 'Python, NumPy, Pandas, SQL, Math & Git.' },
    { name: 'ML & Deep Learning',         weight: 0.08, totalConcepts: 7,  examQuestions: 8,  color: 'text-[#10B981]', bgColor: 'bg-[#10B981]/10', barColor: 'bg-[#10B981]', emoji: '🤖', encodingTip: 'Supervised, Unsupervised, Neural Nets, PyTorch, CNNs & RNNs.' },
    { name: 'NLP & Language Understanding',weight: 0.07, totalConcepts: 6,  examQuestions: 7,  color: 'text-[#06B6D4]', bgColor: 'bg-[#06B6D4]/10', barColor: 'bg-[#06B6D4]', emoji: '📝', encodingTip: 'Tokenization, Embeddings, Transformers & Hugging Face.' },
    { name: 'LLM Mastery',                weight: 0.14, totalConcepts: 10, examQuestions: 14, color: 'text-[#8B5CF6]', bgColor: 'bg-[#8B5CF6]/10', barColor: 'bg-[#8B5CF6]', emoji: '🧠', encodingTip: 'APIs, Prompting, Fine-tuning, RLHF, Quantization & Multimodal.' },
    { name: 'RAG & Knowledge Systems',     weight: 0.15, totalConcepts: 11, examQuestions: 15, color: 'text-[#EC4899]', bgColor: 'bg-[#EC4899]/10', barColor: 'bg-[#EC4899]', emoji: '🔍', encodingTip: 'Embeddings, Vector DBs, Chunking, Advanced RAG & Graph RAG.' },
    { name: 'AI Agents & Automation',      weight: 0.18, totalConcepts: 13, examQuestions: 18, color: 'text-[#F97316]', bgColor: 'bg-[#F97316]/10', barColor: 'bg-[#F97316]', emoji: '⚡', encodingTip: 'ReAct, MCP, Multi-Agent, Memory, Voice AI & Workflows.' },
    { name: 'Production AI & MLOps',       weight: 0.15, totalConcepts: 11, examQuestions: 15, color: 'text-[#F59E0B]', bgColor: 'bg-[#F59E0B]/10', barColor: 'bg-[#F59E0B]', emoji: '🚀', encodingTip: 'FastAPI, Docker, Cloud, Serving, CI/CD & Observability.' },
    { name: 'AI Leadership & Safety',      weight: 0.16, totalConcepts: 12, examQuestions: 16, color: 'text-[#EF4444]', bgColor: 'bg-[#EF4444]/10', barColor: 'bg-[#EF4444]', emoji: '🛡️', encodingTip: 'Evals, Hallucinations, Red Teaming, Architecture & Strategy.' }
  ],

  concepts: AI_CONCEPTS,

  sessionComposition: { review: 0.30, new: 0.30, strengthen: 0.25, challenge: 0.15 },
  globalStats: {
    'Core Foundations':            { auto: 0, conscious: 0, fragile: 0, unseen: 6 },
    'ML & Deep Learning':          { auto: 0, conscious: 0, fragile: 0, unseen: 7 },
    'NLP & Language Understanding': { auto: 0, conscious: 0, fragile: 0, unseen: 6 },
    'LLM Mastery':                 { auto: 0, conscious: 0, fragile: 0, unseen: 10 },
    'RAG & Knowledge Systems':     { auto: 0, conscious: 0, fragile: 0, unseen: 11 },
    'AI Agents & Automation':      { auto: 0, conscious: 0, fragile: 0, unseen: 13 },
    'Production AI & MLOps':       { auto: 0, conscious: 0, fragile: 0, unseen: 11 },
    'AI Leadership & Safety':      { auto: 0, conscious: 0, fragile: 0, unseen: 12 }
  },
  scoring: { correct: 4, wrong: -1, skip: 0 }
};
