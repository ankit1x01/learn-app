import { PuzzleConfig } from '../types'

export const PROJECTILE_PUZZLES: PuzzleConfig[] = [
  // BOARD
  {
    id: 'proj_board_001',
    complexity: 'board',
    question: 'A ball is thrown horizontally at 10 m/s from a height of 20 m. Find (a) time of flight and (b) horizontal range. (g = 10 m/s²)',
    given: { speed: 10, height: 20, angle: 0, g: 10 },
    find: ['time', 'range'],
    answer: { time: 2, range: 20 },
    tolerance: 3,
    hints: [
      'Horizontal and vertical motions are independent',
      'Vertical only: h = ½gt² → solve for t',
      'Horizontal: range = speed × t'
    ],
    formula: 't = √(2h/g),  R = v₀·t',
    units: { time: 's', range: 'm' }
  },
  {
    id: 'proj_board_002',
    complexity: 'board',
    question: 'A projectile is fired at 45° with speed 20 m/s. Find the maximum height. (g = 10 m/s²)',
    given: { speed: 20, angle: 45, g: 10 },
    find: ['max_height'],
    answer: { max_height: 10 },
    tolerance: 3,
    hints: [
      'Vertical component: vᵧ = v sin 45° = 20/√2',
      'At max height, vertical velocity = 0',
      'H = vᵧ²/(2g)'
    ],
    formula: 'H = v²sin²θ / 2g',
    units: { max_height: 'm' }
  },
  {
    id: 'proj_board_003',
    complexity: 'board',
    question: 'A ball is kicked at 30° with speed 30 m/s. Find the total time of flight. (g = 10 m/s²)',
    given: { speed: 30, angle: 30, g: 10 },
    find: ['time_of_flight'],
    answer: { time_of_flight: 3 },
    tolerance: 3,
    hints: [
      'vᵧ = v sinθ = 30 × 0.5 = 15 m/s',
      'Time of flight = 2vᵧ/g',
      'T = 2 × 15 / 10'
    ],
    formula: 'T = 2v sinθ / g',
    units: { time_of_flight: 's' }
  },
  // JEE MAIN
  {
    id: 'proj_jee_main_001',
    complexity: 'jee_main',
    question: 'A projectile is fired at 30° to horizontal with speed 40 m/s. Find (a) maximum height and (b) time to reach it. (g = 10 m/s²)',
    given: { speed: 40, angle: 30, g: 10 },
    find: ['max_height', 'time_to_peak'],
    answer: { max_height: 20, time_to_peak: 2 },
    tolerance: 2,
    hints: [
      'vᵧ = 40 sin30° = 20 m/s',
      'At peak: vertical velocity = 0, so t = vᵧ/g',
      'H = vᵧ²/(2g) = 400/20'
    ],
    formula: 'H = v²sin²θ/2g,  t = v sinθ/g',
    units: { max_height: 'm', time_to_peak: 's' }
  },
  {
    id: 'proj_jee_main_002',
    complexity: 'jee_main',
    question: 'Two balls are projected from the same point at angles 30° and 60° with the same speed. Find the ratio of their ranges.',
    given: { angle1: 30, angle2: 60 },
    find: ['range_ratio'],
    answer: { range_ratio: 1 },
    tolerance: 2,
    hints: [
      'Range R = v²sin2θ/g',
      'sin60° = sin(2×30°) = sin60°',
      'sin120° = sin(2×60°) = sin60°  →  equal ranges'
    ],
    formula: 'R = v²sin2θ/g;  complementary angles give equal range',
    units: { range_ratio: '' }
  },
  {
    id: 'proj_jee_main_003',
    complexity: 'jee_main',
    question: 'A particle is projected with speed 10 m/s at 60°. Find the speed of the particle when it makes 30° with horizontal. (g = 10 m/s²)',
    given: { speed: 10, launch_angle: 60, query_angle: 30, g: 10 },
    find: ['speed_at_angle'],
    answer: { speed_at_angle: 5.77 },
    tolerance: 2,
    hints: [
      'Horizontal component vₓ = v cos60° = 5 m/s (constant)',
      'At angle 30°: vₓ = v·cos30°  →  v = vₓ/cos30°',
      'v = 5/(√3/2) = 10/√3 ≈ 5.77 m/s'
    ],
    formula: 'vₓ = v cosα = constant;  v = vₓ/cosθ',
    units: { speed_at_angle: 'm/s' }
  },
  // JEE ADVANCED
  {
    id: 'proj_jee_adv_001',
    complexity: 'jee_advanced',
    question: 'A particle is projected from the top of a cliff 40 m high at 20 m/s, 30° above horizontal. Find (a) horizontal range from the base of the cliff and (b) the second launch angle at the same speed that hits the same point. (g = 10 m/s²)',
    given: { height: 40, speed: 20, angle: 30, g: 10 },
    find: ['range', 'second_angle'],
    answer: { range: 60.74, second_angle: 71.3 },
    tolerance: 2,
    hints: [
      'Vertical: −40 = 10t − 5t²  (take downward as negative displacement)',
      'Solve 5t² − 10t − 40 = 0 → t = (10 + √(100+800))/10, take positive root',
      'For second angle: same range equation R = v²sin2θ/g has two solutions θ and (90°−θ) only on flat ground — here use numerical/graphical approach'
    ],
    formula: 'y = vᵧt − ½gt²,  x = vₓt',
    units: { range: 'm', second_angle: '°' }
  },
  {
    id: 'proj_jee_adv_002',
    complexity: 'jee_advanced',
    question: 'A ball is thrown from point A on a slope of angle 30° with speed 20 m/s at angle 60° above the slope. Find the range along the slope. (g = 10 m/s²)',
    given: { slope_angle: 30, speed: 20, throw_angle_from_slope: 60, g: 10 },
    find: ['range_along_slope'],
    answer: { range_along_slope: 40 },
    tolerance: 3,
    hints: [
      'Resolve g along and perpendicular to slope: g_along = g sinα, g_perp = g cosα',
      'Effective launch angle from slope = 60°, use range formula with g_perp',
      'R = 2v²sin(θ)cos(θ+α) / (g cos²α)'
    ],
    formula: 'R = 2v²sinθ cos(θ+α) / (g cos²α)',
    units: { range_along_slope: 'm' }
  },
  {
    id: 'proj_jee_adv_003',
    complexity: 'jee_advanced',
    question: 'A particle A is projected vertically upward from ground with speed 20 m/s. Simultaneously particle B is dropped from height H. They meet at t = 2s. Find H and the height at which they meet. (g = 10 m/s²)',
    given: { speed_A: 20, t_meet: 2, g: 10 },
    find: ['H', 'meeting_height'],
    answer: { H: 40, meeting_height: 20 },
    tolerance: 2,
    hints: [
      'A height at t=2: h_A = 20×2 − ½×10×4 = 40−20 = 20 m',
      'B falls: h_B = H − ½×10×4 = H − 20',
      'They meet: h_A = h_B  →  20 = H−20  →  H = 40'
    ],
    formula: 'h_A = v₀t − ½gt²,  h_B = H − ½gt²',
    units: { H: 'm', meeting_height: 'm' }
  }
]
