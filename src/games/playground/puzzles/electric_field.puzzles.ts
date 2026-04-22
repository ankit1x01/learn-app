import { PuzzleConfig } from '../types'

export const ELECTRIC_FIELD_PUZZLES: PuzzleConfig[] = [
  // BOARD
  {
    id: 'ef_board_001',
    complexity: 'board',
    question: 'Two charges +4μC and −4μC are placed 20 cm apart. Find the electric field at the midpoint between them.',
    given: { q1: 4e-6, q2: -4e-6, separation: 0.2 },
    find: ['field_at_midpoint'],
    answer: { field_at_midpoint: 7.2e6 },
    tolerance: 3,
    hints: [
      'At midpoint, r = 0.1 m from each charge',
      'Fields from both charges point in same direction (both point from + to −, i.e. same direction)',
      'E = 2×kq/r² = 2×9×10⁹×4×10⁻⁶/0.01 = 7.2×10⁶ N/C'
    ],
    formula: 'E = kq/r²,  superpose both fields',
    units: { field_at_midpoint: 'N/C' }
  },
  {
    id: 'ef_board_002',
    complexity: 'board',
    question: 'A charge of 5μC experiences a force of 0.1 N in an electric field. Find the electric field strength.',
    given: { charge: 5e-6, force: 0.1 },
    find: ['field'],
    answer: { field: 20000 },
    tolerance: 3,
    hints: ['E = F/q', 'E = 0.1/(5×10⁻⁶)', 'E = 20000 N/C'],
    formula: 'E = F/q',
    units: { field: 'N/C' }
  },
  {
    id: 'ef_board_003',
    complexity: 'board',
    question: 'Find the electric potential at a distance of 30 cm from a charge of +6μC.',
    given: { charge: 6e-6, distance: 0.3 },
    find: ['potential'],
    answer: { potential: 180000 },
    tolerance: 3,
    hints: ['V = kq/r', 'V = 9×10⁹×6×10⁻⁶/0.3', 'V = 180000 V'],
    formula: 'V = kq/r',
    units: { potential: 'V' }
  },
  // JEE MAIN
  {
    id: 'ef_jee_main_001',
    complexity: 'jee_main',
    question: 'Three charges +q are placed at corners of an equilateral triangle of side a. Find the electric field at the centroid.',
    given: { q: 1e-6, a: 0.1 },
    find: ['field_at_centroid'],
    answer: { field_at_centroid: 0 },
    tolerance: 2,
    hints: [
      'Distance from centroid to each vertex = a/√3',
      'Each charge creates a field at centroid pointing away from it',
      'Three equal fields at 120° to each other: vector sum = 0'
    ],
    formula: 'Symmetric configuration: vector sum of equal fields at 120° = 0',
    units: { field_at_centroid: 'N/C' }
  },
  {
    id: 'ef_jee_main_002',
    complexity: 'jee_main',
    question: 'An electric dipole (p = 2×10⁻⁶ C·m) is placed in a uniform field E = 10⁵ N/C. Find the maximum torque on the dipole.',
    given: { dipole_moment: 2e-6, field: 1e5 },
    find: ['max_torque'],
    answer: { max_torque: 0.2 },
    tolerance: 2,
    hints: ['τ = pE sinθ', 'Maximum when θ = 90°: τ_max = pE', 'τ_max = 2×10⁻⁶ × 10⁵ = 0.2 N·m'],
    formula: 'τ_max = pE',
    units: { max_torque: 'N·m' }
  },
  {
    id: 'ef_jee_main_003',
    complexity: 'jee_main',
    question: 'A charge Q is uniformly distributed over a ring of radius R. Find the electric field at a point on the axis at distance x from the centre.',
    given: { Q: 1e-6, R: 0.1, x: 0.1 },
    find: ['field_on_axis'],
    answer: { field_on_axis: 318000 },
    tolerance: 3,
    hints: [
      'E_axis = kQx/(R²+x²)^(3/2)',
      'At x=R: E = kQ×R/(R²+R²)^(3/2) = kQ/(2√2 R²)',
      'E = 9×10⁹×10⁻⁶×0.1/(0.02)^(3/2) ≈ 318000 N/C'
    ],
    formula: 'E = kQx/(R²+x²)^(3/2)',
    units: { field_on_axis: 'N/C' }
  },
  // JEE ADVANCED
  {
    id: 'ef_jee_adv_001',
    complexity: 'jee_advanced',
    question: 'Two charges +Q are fixed on the x-axis at x=+d and x=−d. A test charge −q is displaced a small distance y along y-axis from origin. Show it undergoes SHM and find the time period. (mass = m)',
    given: { Q: 1e-6, d: 0.1, q: 1e-9, mass: 1e-3 },
    find: ['time_period'],
    answer: { time_period: 0.0644 },
    tolerance: 3,
    hints: [
      'Force on −q: F = 2kQq/(d²+y²) × y/√(d²+y²) toward origin (y-component)',
      'For small y: F ≈ 2kQqy/d³ (SHM restoring force)',
      'ω² = 2kQq/(md³) → T = 2π√(md³/2kQq)'
    ],
    formula: 'T = 2π√(md³/2kQq)',
    units: { time_period: 's' }
  },
  {
    id: 'ef_jee_adv_002',
    complexity: 'jee_advanced',
    question: 'A solid sphere of radius R has total charge Q uniformly distributed. Find the ratio of electric field at R/2 (inside) to 2R (outside).',
    given: { R: 0.1, Q: 1e-6 },
    find: ['field_ratio'],
    answer: { field_ratio: 2 },
    tolerance: 2,
    hints: [
      'Inside: E_in = kQr/R³ at r=R/2 → E_in = kQ(R/2)/R³ = kQ/(2R²)',
      'Outside: E_out = kQ/r² at r=2R → E_out = kQ/(4R²)',
      'Ratio = E_in/E_out = kQ/(2R²) ÷ kQ/(4R²) = 2'
    ],
    formula: 'E_inside = kQr/R³,  E_outside = kQ/r²',
    units: { field_ratio: '' }
  },
  {
    id: 'ef_jee_adv_003',
    complexity: 'jee_advanced',
    question: 'A square of side 2a has charges +q at two adjacent corners and −q at the other two. Find the electric field at the centre of the square.',
    given: { q: 1e-6, a: 0.1 },
    find: ['field_at_centre'],
    answer: { field_at_centre: 636396 },
    tolerance: 3,
    hints: [
      'Distance from centre to corner = a√2',
      'Each charge contributes E = kq/(a√2)² = kq/2a² at 45° directions',
      'Two +q create fields pointing away; two −q attract; net field = 2√2 × kq/2a² = kq√2/a² along diagonal'
    ],
    formula: 'Sum field vectors; use symmetry to find net direction',
    units: { field_at_centre: 'N/C' }
  }
]
