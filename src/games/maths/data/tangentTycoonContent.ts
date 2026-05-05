import type { TangentTycoonConfig } from '@/games/types'

export const tangentTycoonContent: TangentTycoonConfig = {
  type: 'tangent-tycoon',
  theme: 'city',
  subject: 'mathematics',
  items: [
    {
      id: 'tangent-tycoon-1',
      skillId: 'tangent_line_at_point',
      problemType: 'tangent-line',
      functionLatex: 'y = x^2',
      point: 1,
      expectedAnswer: 'y = 2x - 1',
      timeLimit: 40,
    },
    {
      id: 'tangent-tycoon-2',
      skillId: 'increasing_interval',
      problemType: 'increasing-interval',
      functionLatex: 'y = x^3 - 3x',
      expectedAnswer: 'x < -1 or x > 1',
      timeLimit: 45,
    },
    {
      id: 'tangent-tycoon-3',
      skillId: 'optimization_area',
      problemType: 'optimization',
      functionLatex: 'A(x) = x(10 - x)',
      expectedAnswer: 5,
      timeLimit: 50,
    },
    {
      id: 'tangent-tycoon-4',
      skillId: 'local_extrema',
      problemType: 'extrema',
      functionLatex: 'y = x^3 - 3x^2 + 2',
      expectedAnswer: 'max at x=0, min at x=2',
      timeLimit: 50,
    },
    {
      id: 'tangent-tycoon-5',
      skillId: 'tangent_line_cubic',
      problemType: 'tangent-line',
      functionLatex: 'y = x^3',
      point: 2,
      expectedAnswer: 'y = 12x - 16',
      timeLimit: 45,
    },
  ],
}
