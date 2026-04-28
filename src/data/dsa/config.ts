import type { SyllabusConfig } from '../../core/types';
import { DSA_CONCEPTS } from './concepts';

/**
 * DSA Problem-Solving Methodologies — Syllabus Configuration
 * Source: Striver A2Z DSA Sheet (dsa_data.json)
 *
 * Target: FAANG/MAANG interview readiness
 * Total problems: 454 (across 5 categories)
 * "Exam": a typical FAANG interview loop (5 rounds × 2 DSA problems = 10 problems)
 */
export const dsaConfig: SyllabusConfig = {
  id: 'dsa_faang',
  name: 'Smriti',
  studentName: 'Tejaswini',
  examDate: '2026-10-01',
  daysRemaining: 178,
  targetScoreLabel: '10/10 problems',
  examScoreTarget: 8, // solving 8/10 problems = strong pass

  subjects: [
    {
      name: 'Foundations',
      weight: 0.08,
      totalConcepts: 38,
      examQuestions: 1,
      color: 'text-[#94A3B8]',
      bgColor: 'bg-[#94A3B8]/10',
      barColor: 'bg-[#94A3B8]',
      icon: 'layers',
      encodingTip: 'Type it out, run it, and verify the output. The feedback loop is the lesson — no passive reading.',
    },
    {
      name: 'Arrays & Search',
      weight: 0.25,
      totalConcepts: 84,
      examQuestions: 3,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      barColor: 'bg-primary',
      icon: 'grid_view',
      encodingTip: 'Code the template from scratch without reference. Then identify the exact trigger condition for this pattern.',
    },
    {
      name: 'Strings & Data Structures',
      weight: 0.25,
      totalConcepts: 119,
      examQuestions: 2,
      color: 'text-[#0E7490]',
      bgColor: 'bg-[#ECFEFF]',
      barColor: 'bg-[#38BDF8]',
      icon: 'link',
      encodingTip: 'Draw the structure. Trace pointer/index movements step by step on paper before writing a single line of code.',
    },
    {
      name: 'Trees & Graphs',
      weight: 0.25,
      totalConcepts: 132,
      examQuestions: 2,
      color: 'text-[#15803D]',
      bgColor: 'bg-[#F0FDF4]',
      barColor: 'bg-[#15803D]',
      icon: 'account_tree',
      encodingTip: 'Draw the tree or graph first. Run BFS or DFS by hand on a 5-node example before touching code.',
    },
    {
      name: 'DP & Greedy',
      weight: 0.17,
      totalConcepts: 81,
      examQuestions: 2,
      color: 'text-[#B45309]',
      bgColor: 'bg-[#FFFBEB]',
      barColor: 'bg-tertiary',
      icon: 'bolt',
      encodingTip: 'Define state → write recurrence → identify base case — all in plain English before writing code. DP is design, not implementation.',
    },
  ],

  concepts: DSA_CONCEPTS,

  sessionComposition: {
    review:    0.35, // problems with R < 85% (approach fading)
    new:       0.30, // unseen problems (by frequency tier)
    strengthen: 0.25, // conscious but not due
    challenge:  0.10, // automatic patterns (keep sharp)
  },

  // Fresh start — all problems are unseen
  globalStats: {
    'Foundations':               { auto: 0, conscious: 0, fragile: 0, unseen: 38  },
    'Arrays & Search':           { auto: 0, conscious: 0, fragile: 0, unseen: 84  },
    'Strings & Data Structures': { auto: 0, conscious: 0, fragile: 0, unseen: 119 },
    'Trees & Graphs':            { auto: 0, conscious: 0, fragile: 0, unseen: 132 },
    'DP & Greedy':               { auto: 0, conscious: 0, fragile: 0, unseen: 81  },
  },

  scoring: {
    correct: 1,   // solved cleanly
    wrong:   0,   // couldn't solve
    skip:    0,
  },
};
