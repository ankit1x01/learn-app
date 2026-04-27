import type { CoursePack } from '../../types';

export const COURSE_PACKS: Record<string, CoursePack> = {
  foundation: {
    id: 'foundation',
    name: 'Foundation Course',
    description: 'Anthropic prompt engineering fundamentals',
    chapterCount: 9,
    difficulty: 'beginner',
    icon: 'school',
    color: 'var(--color-primary)',
  },
  patterns: {
    id: 'patterns',
    name: 'Patterns Pack',
    description: 'Real-world techniques & common approaches',
    chapterCount: 5,
    difficulty: 'intermediate',
    icon: 'pattern',
    color: 'var(--color-secondary)',
  },
  advanced: {
    id: 'advanced',
    name: 'Advanced Tactics',
    description: 'Production-grade optimization & strategies',
    chapterCount: 6,
    difficulty: 'advanced',
    icon: 'rocket_launch',
    color: 'var(--color-tertiary)',
  },
  domain: {
    id: 'domain',
    name: 'Domain Strategies',
    description: 'Task-specific approaches',
    chapterCount: 4,
    difficulty: 'intermediate',
    icon: 'target',
    color: 'var(--color-warning)',
  },
};

export const PACK_ORDER = ['foundation', 'patterns', 'advanced', 'domain'] as const;
