import type { SyllabusConfig, Concept } from '../../core/types';
import { IT_PLACEMENT_CONCEPTS } from './concepts';
import { DSA_CONCEPTS } from '../dsa/concepts';

/**
 * Active syllabus: Quantitative Aptitude + DSA
 *
 * Aptitude — 65 concepts from IT placement bank
 * DSA      — 454 concepts (Striver A2Z, same ones shown in Topics screen)
 */

// Only QA concepts from the IT placement bank
const QA_CONCEPTS: Concept[] = IT_PLACEMENT_CONCEPTS.filter(
  c => c.subject === 'Quantitative Aptitude'
);

// DSA concepts — remap all subject names to "DSA & Coding" so
// the dashboard shows one unified DSA bar instead of 16 sub-topics
const DSA_REMAPPED: Concept[] = DSA_CONCEPTS.map(c => ({
  ...c,
  subject: 'DSA & Coding',
}));

export const itPlacementConfig: SyllabusConfig = {
  id: 'it_placement_india',
  name: 'Smriti',
  studentName: 'Fresher',
  examDate: '2026-08-01',
  daysRemaining: 113,
  targetScoreLabel: '≥80% across all sections',
  examScoreTarget: 40, // 20 aptitude + 20 DSA

  subjects: [
    {
      name: 'Quantitative Aptitude',
      weight: 0.35,
      totalConcepts: 65,
      examQuestions: 20,
      color: 'text-[#F59E0B]',
      bgColor: 'bg-[#F59E0B]/10',
      barColor: 'bg-[#F59E0B]',
      emoji: '📊',
      encodingTip: 'Solve 30–50 questions/week timed (5 min/Q). Use IndiaBix sectional mocks. Target ≥80% accuracy per topic before moving on.',
    },
    {
      name: 'DSA & Coding',
      weight: 0.65,
      totalConcepts: 454,
      examQuestions: 20,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      barColor: 'bg-primary',
      emoji: '💻',
      encodingTip: 'Code the pattern from scratch — no copy-paste. Identify the trigger condition. Time yourself: easy in 10 min, medium in 25 min.',
    },
  ],

  concepts: [...QA_CONCEPTS, ...DSA_REMAPPED],

  sessionComposition: {
    review:    0.30,
    new:       0.40,
    strengthen: 0.20,
    challenge:  0.10,
  },

  globalStats: {
    'Quantitative Aptitude': { auto: 0, conscious: 0, fragile: 0, unseen: 65  },
    'DSA & Coding':          { auto: 0, conscious: 0, fragile: 0, unseen: 454 },
  },

  scoring: {
    correct: 1,
    wrong:   0,
    skip:    0,
  },
};
