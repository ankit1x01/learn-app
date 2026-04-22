import { PuzzleConfig } from '../types'

export const SPRING_MASS_PUZZLES: PuzzleConfig[] = [
  // BOARD
  {
    id: 'spr_board_001',
    complexity: 'board',
    question: 'A spring of k = 200 N/m has a 0.5 kg mass attached. Find the time period of oscillation.',
    given: { k: 200, mass: 0.5 },
    find: ['period'],
    answer: { period: 0.314 },
    tolerance: 3,
    hints: ['T = 2π√(m/k)', 'T = 2π√(0.5/200)', 'T = 2π × 0.05 ≈ 0.314 s'],
    formula: 'T = 2π√(m/k)',
    units: { period: 's' }
  },
  {
    id: 'spr_board_002',
    complexity: 'board',
    question: 'A mass on a spring oscillates with amplitude 5 cm. Spring constant k = 100 N/m, mass = 0.25 kg. Find maximum speed.',
    given: { amplitude: 0.05, k: 100, mass: 0.25 },
    find: ['max_speed'],
    answer: { max_speed: 1 },
    tolerance: 3,
    hints: ['ω = √(k/m) = √400 = 20 rad/s', 'v_max = ωA', 'v_max = 20 × 0.05 = 1 m/s'],
    formula: 'v_max = ω·A = A√(k/m)',
    units: { max_speed: 'm/s' }
  },
  {
    id: 'spr_board_003',
    complexity: 'board',
    question: 'Two springs k₁=100 N/m and k₂=200 N/m are connected in series. Find the effective spring constant.',
    given: { k1: 100, k2: 200 },
    find: ['k_eff'],
    answer: { k_eff: 66.67 },
    tolerance: 3,
    hints: ['Series: 1/k_eff = 1/k₁ + 1/k₂', '1/k_eff = 1/100 + 1/200 = 3/200', 'k_eff = 200/3 ≈ 66.67 N/m'],
    formula: '1/k_eff = 1/k₁ + 1/k₂',
    units: { k_eff: 'N/m' }
  },
  // JEE MAIN
  {
    id: 'spr_jee_main_001',
    complexity: 'jee_main',
    question: 'A 1 kg mass on a spring (k=400 N/m) is displaced 10 cm from equilibrium and released. Find (a) frequency and (b) total energy.',
    given: { mass: 1, k: 400, amplitude: 0.1 },
    find: ['frequency', 'total_energy'],
    answer: { frequency: 3.18, total_energy: 2 },
    tolerance: 2,
    hints: ['ω = √(k/m) = 20 rad/s, f = ω/2π ≈ 3.18 Hz', 'E = ½kA² = ½×400×0.01 = 2 J', ''],
    formula: 'f = (1/2π)√(k/m),  E = ½kA²',
    units: { frequency: 'Hz', total_energy: 'J' }
  },
  {
    id: 'spr_jee_main_002',
    complexity: 'jee_main',
    question: 'A spring-mass system (k=500 N/m, m=2 kg) oscillates. At x=3 cm from equilibrium, speed is 2 m/s. Find amplitude.',
    given: { k: 500, mass: 2, x: 0.03, speed_at_x: 2 },
    find: ['amplitude'],
    answer: { amplitude: 0.1 },
    tolerance: 2,
    hints: ['Energy conservation: ½mv² + ½kx² = ½kA²', '½×2×4 + ½×500×0.0009 = ½×500×A²', '4 + 0.225 = 250A² → A² ≈ 0.017 → A ≈ 0.1 m'],
    formula: 'A = √(v²/ω² + x²)',
    units: { amplitude: 'm' }
  },
  {
    id: 'spr_jee_main_003',
    complexity: 'jee_main',
    question: 'A vertical spring (k=200 N/m) is compressed 5 cm and a 0.5 kg mass is placed on it. It is released. Find max height the mass rises above the release point.',
    given: { k: 200, compression: 0.05, mass: 0.5, g: 10 },
    find: ['max_height'],
    answer: { max_height: 0.1 },
    tolerance: 3,
    hints: ['PE_spring = ½kx² = ½×200×0.0025 = 0.25 J', 'At max height h: mgh = PE_spring (all converts)', 'h = 0.25/(0.5×10) = 0.05 m above natural length — but released from compressed, so h = x + 0.05 = 0.10 m'],
    formula: '½kx² = mg(x + h_extra)',
    units: { max_height: 'm' }
  },
  // JEE ADVANCED
  {
    id: 'spr_jee_adv_001',
    complexity: 'jee_advanced',
    question: 'Two masses m₁=1 kg and m₂=3 kg are connected by a spring (k=300 N/m) on a frictionless surface. m₁ is given velocity 4 m/s. Find (a) velocity of centre of mass and (b) maximum compression of the spring.',
    given: { m1: 1, m2: 3, k: 300, u1: 4, u2: 0 },
    find: ['v_cm', 'max_compression'],
    answer: { v_cm: 1, max_compression: 0.115 },
    tolerance: 2,
    hints: [
      'v_cm = m₁u₁/(m₁+m₂) = 4/4 = 1 m/s',
      'In CM frame: KE_rel = ½μ(u_rel)² where μ=m₁m₂/(m₁+m₂)=0.75 kg, u_rel=4',
      'At max compression: KE_rel → ½kx²  →  ½×0.75×16 = ½×300×x²  →  x=0.115 m'
    ],
    formula: 'v_cm = Σmv/Σm;  ½μ(Δv)² = ½kx_max²',
    units: { v_cm: 'm/s', max_compression: 'm' }
  },
  {
    id: 'spr_jee_adv_002',
    complexity: 'jee_advanced',
    question: 'A spring (k=1000 N/m) connects two blocks on a frictionless surface: m₁=1 kg (left) and m₂=4 kg (right). System is at rest. m₁ is given impulse J=10 N·s. Find (a) initial velocity of m₁ and (b) maximum extension of spring.',
    given: { k: 1000, m1: 1, m2: 4, impulse: 10 },
    find: ['v_initial_m1', 'max_extension'],
    answer: { v_initial_m1: 10, max_extension: 0.283 },
    tolerance: 2,
    hints: [
      'v_initial = J/m₁ = 10/1 = 10 m/s',
      'v_cm = J/(m₁+m₂) = 10/5 = 2 m/s',
      'KE in CM frame = ½μ×(10−0)² where μ=0.8 kg → max ext = √(2×KE_cm/k) = √(0.8×100/1000) = 0.283 m'
    ],
    formula: 'v₀=J/m;  max_ext=√(μ(v_rel)²/k)',
    units: { v_initial_m1: 'm/s', max_extension: 'm' }
  },
  {
    id: 'spr_jee_adv_003',
    complexity: 'jee_advanced',
    question: 'A block of 2 kg on a frictionless surface is attached to a spring (k=800 N/m) fixed to a wall. The block collides with a 2 kg block coming at 4 m/s (perfectly inelastic). Find the amplitude of the resulting oscillation.',
    given: { k: 800, m_attached: 2, m_bullet: 2, u_bullet: 4 },
    find: ['amplitude'],
    answer: { amplitude: 0.1 },
    tolerance: 2,
    hints: [
      'Inelastic collision: v = m×u/(m+M) = 2×4/4 = 2 m/s',
      'New mass on spring = 4 kg',
      'E = ½×4×4 = 8 J = ½×800×A²  →  A² = 0.02  →  A = 0.141 m'
    ],
    formula: 'v_combined=m·u/(m+M);  A=v_combined√(M_total/k)',
    units: { amplitude: 'm' }
  }
]
