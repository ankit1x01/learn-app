import type { SyllabusConfig } from '../../core/types';
import { AI_CONCEPTS } from './concepts';

export const aiEngineerConfig: SyllabusConfig = {
  id: 'ai_engineer',
  name: 'AI Engineering',
  studentName: 'Learner',
  examDate: '2026-12-01',
  daysRemaining: 220,
  targetScoreLabel: 'Mastery across ML & AI',
  examScoreTarget: 80,

  subjects: [
    {
      name: 'Machine Learning',
      weight: 0.40,
      totalConcepts: 25,
      examQuestions: 30,
      color: 'text-[#10B981]',
      bgColor: 'bg-[#10B981]/10',
      barColor: 'bg-[#10B981]',
      emoji: '🤖',
      encodingTip: 'Focus on understanding loss functions, gradient descent, and bias-variance tradeoff.',
    },
    {
      name: 'Deep Learning',
      weight: 0.40,
      totalConcepts: 30,
      examQuestions: 30,
      color: 'text-[#8B5CF6]',
      bgColor: 'bg-[#8B5CF6]/10',
      barColor: 'bg-[#8B5CF6]',
      emoji: '🧠',
      encodingTip: 'Code architectures from scratch. Visualize tensor shapes.',
    },
    {
      name: 'Generative AI & LLMs',
      weight: 0.20,
      totalConcepts: 20,
      examQuestions: 20,
      color: 'text-[#EC4899]',
      bgColor: 'bg-[#EC4899]/10',
      barColor: 'bg-[#EC4899]',
      emoji: '✨',
      encodingTip: 'Build intuitions behind self-attention, transformers, and RLHF.',
    },
  ],

  concepts: AI_CONCEPTS,

  sessionComposition: {
    review:    0.35,
    new:       0.30,
    strengthen: 0.25,
    challenge:  0.10,
  },

  globalStats: {
    'Machine Learning':       { auto: 0, conscious: 0, fragile: 0, unseen: 25 },
    'Deep Learning':          { auto: 0, conscious: 0, fragile: 0, unseen: 30 },
    'Generative AI & LLMs':   { auto: 0, conscious: 0, fragile: 0, unseen: 20 },
  },

  scoring: {
    correct: 4,
    wrong:  -1,
    skip:    0,
  },
};
