import type { SyllabusConfig } from '../../core/types';

export const schoolMathsConfig: SyllabusConfig = {
  id: 'school_maths',
  name: 'Mathematics',
  studentName: 'Student',
  subjects: [
    {
      name: 'Maths',
      weight: 1,
      totalConcepts: 1265,
      examQuestions: 0,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      barColor: 'bg-primary',
      icon: 'calculate',
      encodingTip: 'Review class formulas',
    },
  ],
  concepts: [],
  sessionComposition: { review: 0.3, new: 0.4, strengthen: 0.2, challenge: 0.1 },
  globalStats: {
    'Maths': { auto: 0, conscious: 0, fragile: 0, unseen: 1265 },
  },
};
