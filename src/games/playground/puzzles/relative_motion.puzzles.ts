import { PuzzleConfig } from '../types'

export const RELATIVE_MOTION_PUZZLES: PuzzleConfig[] = [
  {
    id: 'rel_jee_adv_001',
    complexity: 'jee_advanced',
    question: 'Airplanes A and B fly at angles 30° and 60° to horizontal. Speed of A is 100√3 m/s. At t=0, B is 500m from A. Observer in A sees B moving perpendicular to A\'s line of motion. If A escapes hit at t=t₀, find t₀.',
    given: { angleA: 30, angleB: 60, speedA: 173.2, dist: 500 },
    find: ['t0'],
    answer: { t0: 5 },
    tolerance: 1,
    hints: [
      'Velocity of B relative to A: V_BA = V_B - V_A',
      'V_BA is perpendicular to V_A means V_BA · V_A = 0',
      'Or resolve velocities along A: V_B cos(60-30) = V_A',
      'V_B cos 30° = V_A → V_B (√3/2) = 100√3 → V_B = 200 m/s',
      'Relative speed along perpendicular = V_B sin 30° = 100 m/s',
      'But wait, the distance is along some line. If it escapes hit, it means the relative velocity component along the initial line of separation must cover the distance.',
      'Actually, if V_BA is perpendicular to V_A, and at t=t0 they meet, then the relative velocity component along AB must be dist/t0.',
      'Correct approach: V_B sin(60-30) is the relative speed. 500 / (200 * 0.5) = 5s.'
    ],
    formula: 't = d / v_rel',
    units: { t0: 's' }
  },
  {
    id: 'rel_jee_adv_002',
    complexity: 'jee_advanced',
    question: 'A rocket moves with constant acceleration 2 m/s² in gravity-free space. A ball is thrown from left end (length 4m) at 0.3 m/s relative to rocket. Another ball is thrown from right end at 0.2 m/s relative to rocket. Find time when they hit each other.',
    given: { accel: 2, length: 4, v1: 0.3, v2: 0.2 },
    find: ['time'],
    answer: { time: 8 },
    tolerance: 1,
    hints: [
      'Inside the rocket, there is a pseudo-acceleration of 2 m/s² backwards.',
      'But both balls experience the SAME pseudo-acceleration.',
      'Relative acceleration between the balls is ZERO.',
      'Relative velocity = 0.3 + 0.2 = 0.5 m/s.',
      'Time = Distance / Relative Velocity = 4 / 0.5 = 8s.'
    ],
    formula: 't = L / (v1 + v2)',
    units: { time: 's' }
  },
  {
    id: 'rel_jee_main_001',
    complexity: 'jee_main',
    question: 'A boat with speed 5 km/hr in still water crosses a river of width 1 km along the shortest path in 15 minutes. Find the river velocity in km/hr.',
    given: { v_boat: 5, width: 1, time_min: 15 },
    find: ['v_river'],
    answer: { v_river: 3 },
    tolerance: 1,
    hints: [
      'Shortest path means the boat moves exactly perpendicular to the banks.',
      'Resultant velocity V_R = Width / Time = 1 km / (15/60 hr) = 4 km/hr.',
      'V_R² = V_boat² - V_river² (Pythagoras)',
      '4² = 5² - V_river² → V_river = √(25 - 16) = 3 km/hr.'
    ],
    formula: 'v_resultant = √(v_boat² - v_river²)',
    units: { v_river: 'km/hr' }
  },
  {
    id: 'rel_jee_adv_003',
    complexity: 'jee_advanced',
    question: 'Four persons K, L, M, N at corners of square side d move with speed v such that K always moves towards L, L towards M, etc. They meet at time t = ?',
    given: { side: 10, speed: 2 },
    find: ['time'],
    answer: { time: 5 },
    tolerance: 1,
    hints: [
      'Relative velocity of K towards L = v - v cos 90° = v.',
      'Distance to be covered = d.',
      'Time = d/v.'
    ],
    formula: 't = d/v',
    units: { time: 's' }
  },
  {
    id: 'rel_jee_adv_004',
    complexity: 'jee_advanced',
    question: 'A person of height 2 m is walking away from a lamp post of height 6 m at 5 km/hr. Find the speed of the tip of the person\'s shadow with respect to the person in km/hr.',
    given: { h_person: 2, h_lamp: 6, v_person: 5 },
    find: ['v_shadow_rel'],
    answer: { v_shadow_rel: 2.5 },
    tolerance: 1,
    hints: [
      'By similar triangles, let x be the distance of person from post and s be the length of shadow.',
      's/2 = (x+s)/6 → 3s = x+s → 2s = x → s = x/2.',
      'Speed of shadow tip w.r.t post = d/dt(x+s) = dx/dt + ds/dt = v + v/2 = 1.5v.',
      'Speed of shadow tip w.r.t person = 1.5v - v = 0.5v.',
      'v_shadow_rel = 0.5 * 5 = 2.5 km/hr.'
    ],
    formula: 'v_tip_rel = v_tip - v_person',
    units: { v_shadow_rel: 'km/hr' }
  }
]
