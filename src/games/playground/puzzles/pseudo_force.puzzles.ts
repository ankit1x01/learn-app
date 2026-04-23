import { PuzzleConfig } from '../types'

export const PSEUDO_FORCE_PUZZLES: PuzzleConfig[] = [
  {
    id: 'pseudo_jee_main_001',
    complexity: 'jee_main',
    question: 'A mass m hangs from the ceiling of an elevator accelerating upward at 3 m/s². Find the tension in the string in terms of mg.',
    given: { mass: 1, accel_up: 3, g: 10 },
    find: ['tension'],
    answer: { tension: 13 },
    tolerance: 1,
    hints: [
      'In the elevator frame, a pseudo force ma acts downward.',
      'T = mg + ma = m(g+a).',
      'T = m(10+3) = 13m Newtons.'
    ],
    formula: 'T = m(g+a)',
    units: { tension: 'N' }
  },
  {
    id: 'pseudo_jee_adv_001',
    complexity: 'jee_advanced',
    question: 'A train moves with constant acceleration "a". A boy standing in the train throws a ball forward at 10 m/s at 60° to horizontal. He has to move forward by 1.15 m inside the train to catch it back at the same height. Find acceleration "a" (g=10 m/s², √3=1.732).',
    given: { v0: 10, angle: 60, dist_train: 1.15, g: 10 },
    find: ['accel'],
    answer: { accel: 5 },
    tolerance: 2,
    hints: [
      'Time of flight T = 2v₀sinθ / g = 2 * 10 * sin60° / 10 = √3 seconds.',
      'Horizontal distance covered by ball w.r.t ground = v₀cosθ * T = 10 * 0.5 * √3 = 5√3 m.',
      'Horizontal distance covered by boy w.r.t ground = Distance by train + 1.15 = 0.5 * a * T² + 1.15.',
      'Distance ball = Distance boy → 5√3 = 0.5 * a * (√3)² + 1.15.',
      '5 * 1.732 = 1.5a + 1.15 → 8.66 = 1.5a + 1.15 → 7.51 = 1.5a → a ≈ 5 m/s².'
    ],
    formula: 'x_ball = x_boy',
    units: { accel: 'm/s²' }
  }
]
