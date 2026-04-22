import { PuzzleConfig } from '../types'

export const GENERIC_PUZZLES: PuzzleConfig[] = [
  {
    id: 'generic-1',
    complexity: 'jee_main',
    question: 'Adjust the controls and find the correct parameters.',
    given: {},
    find: ['result'],
    answer: { result: 100 },
    tolerance: 1,
    hints: ['Observe the simulation carefully.'],
    formula: 'N/A',
    units: { result: 'u' }
  }
]
