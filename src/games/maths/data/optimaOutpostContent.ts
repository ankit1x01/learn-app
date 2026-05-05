import type { OptimaOutpostConfig } from '@/games/types'

export const optimaOutpostContent: OptimaOutpostConfig = {
  type: 'optima-outpost',
  theme: 'trading',
  subject: 'mathematics',
  items: [
    {
      id: 'optima-outpost-1',
      skillId: 'lp_basic_feasible_region',
      problemDescription: 'Maximize Z = 3x + 2y subject to x ≤ 4, y ≤ 3, x ≥ 0, y ≥ 0',
      constraints: [
        { inequality: 'x ≤ 4', label: 'x bound' },
        { inequality: 'y ≤ 3', label: 'y bound' },
        { inequality: 'x ≥ 0', label: 'x non-negative' },
        { inequality: 'y ≥ 0', label: 'y non-negative' },
      ],
      objective: '3x + 2y',
      feasibleCorners: [
        [0, 0],
        [4, 0],
        [4, 3],
        [0, 3],
      ],
      optimalAnswer: 18,
      timeLimit: 60,
    },
    {
      id: 'optima-outpost-2',
      skillId: 'lp_with_constraints',
      problemDescription: 'Maximize Z = x + y where x + 2y ≤ 8, 2x + y ≤ 8, x ≥ 0, y ≥ 0',
      constraints: [
        { inequality: 'x + 2y ≤ 8', label: 'constraint 1' },
        { inequality: '2x + y ≤ 8', label: 'constraint 2' },
        { inequality: 'x ≥ 0, y ≥ 0', label: 'non-negative' },
      ],
      objective: 'x + y',
      feasibleCorners: [
        [0, 0],
        [4, 0],
        [0, 4],
        [16 / 3, 16 / 3],
      ],
      optimalAnswer: 32 / 3,
      timeLimit: 70,
    },
    {
      id: 'optima-outpost-3',
      skillId: 'lp_minimize_cost',
      problemDescription: 'Minimize Z = 2x + 3y where x + y ≥ 5, x ≤ 4, y ≤ 3, x ≥ 0, y ≥ 0',
      constraints: [
        { inequality: 'x + y ≥ 5', label: 'minimum sum' },
        { inequality: 'x ≤ 4', label: 'x upper bound' },
        { inequality: 'y ≤ 3', label: 'y upper bound' },
      ],
      objective: '2x + 3y',
      feasibleCorners: [
        [4, 1],
        [4, 3],
        [2, 3],
      ],
      optimalAnswer: 11,
      timeLimit: 65,
    },
    {
      id: 'optima-outpost-4',
      skillId: 'lp_profit_optimization',
      problemDescription: 'Maximize profit Z = 5x + 3y where x + y ≤ 7, 2x + y ≤ 10, x ≥ 0, y ≥ 0',
      constraints: [
        { inequality: 'x + y ≤ 7', label: 'resource 1' },
        { inequality: '2x + y ≤ 10', label: 'resource 2' },
        { inequality: 'x ≥ 0, y ≥ 0', label: 'non-negative' },
      ],
      objective: '5x + 3y',
      feasibleCorners: [
        [0, 0],
        [5, 0],
        [3, 4],
        [0, 7],
      ],
      optimalAnswer: 25,
      timeLimit: 70,
    },
  ],
}
