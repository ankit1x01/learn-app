import type { DiffEqDescentConfig } from '@/games/types'

export const diffEqDescentContent: DiffEqDescentConfig = {
  type: 'diff-eq-descent',
  theme: 'cave',
  subject: 'mathematics',
  items: [
    {
      id: 'diff-eq-descent-1',
      skillId: 'de_separable_basic',
      equation: '\\frac{dy}{dx} = 2x',
      correctType: 'separable',
      solvingSteps: [{ prompt: 'Integrate both sides', answer: 'y = x^2 + C' }],
      expectedSolution: 'y = x^2 + C',
      timeLimit: 45,
    },
    {
      id: 'diff-eq-descent-2',
      skillId: 'de_linear_firstorder',
      equation: '\\frac{dy}{dx} + 2y = 0',
      correctType: 'linear',
      solvingSteps: [{ prompt: 'Using integrating factor method', answer: 'y = Ce^{-2x}' }],
      expectedSolution: 'y = Ce^{-2x}',
      timeLimit: 50,
    },
    {
      id: 'diff-eq-descent-3',
      skillId: 'de_separable_exponential',
      equation: '\\frac{dy}{dx} = e^x',
      correctType: 'separable',
      solvingSteps: [{ prompt: 'Integrate', answer: 'y = e^x + C' }],
      expectedSolution: 'y = e^x + C',
      timeLimit: 40,
    },
    {
      id: 'diff-eq-descent-4',
      skillId: 'de_homogeneous_check',
      equation: '\\frac{dy}{dx} = \\frac{y}{x}',
      correctType: 'homogeneous',
      solvingSteps: [{ prompt: 'Using y = vx substitution', answer: 'y = Cx' }],
      expectedSolution: 'y = Cx',
      timeLimit: 55,
    },
    {
      id: 'diff-eq-descent-5',
      skillId: 'de_exact_equation',
      equation: '(2x + y)dx + (x + 2y)dy = 0',
      correctType: 'exact',
      solvingSteps: [{ prompt: 'Find potential function', answer: 'x^2 + xy + y^2 = C' }],
      expectedSolution: 'x^2 + xy + y^2 = C',
      timeLimit: 60,
    },
  ],
}
