export interface TwinPair {
  id: string
  subject: 'Physics' | 'Chemistry' | 'Maths'
  topic: string
  questionA: { source: string; text: string }
  questionB: { source: string; text: string }
  sameConcept: boolean
  conceptName?: string
  distinguishingFeature?: string
  explanation: string
  similarity: number
}

export const TWIN_PAIRS: TwinPair[] = [
  // ── SAME CONCEPT PAIRS ────────────────────────────────────────────────────
  {
    id: 'p1',
    subject: 'Physics',
    topic: 'Ray Optics',
    questionA: {
      source: 'JEE Advanced 2023 P1 Q9',
      text: 'A concave mirror of focal length 15 cm has an object placed 45 cm in front of it. Find the distance of the image from the mirror.',
    },
    questionB: {
      source: 'JEE Advanced 2025 P2 Q6',
      text: 'An object is placed 30 cm from a concave mirror of radius of curvature 20 cm. Find the image distance.',
    },
    sameConcept: true,
    conceptName: 'Mirror Formula (1/v + 1/u = 1/f)',
    explanation: 'Both use the mirror formula. Q1: f=15, u=45 → v=22.5 cm. Q2: f=10, u=30 → v=15 cm. Identical approach, different numbers.',
    similarity: 0.771,
  },
  {
    id: 'm1',
    subject: 'Maths',
    topic: '3D Geometry',
    questionA: {
      source: 'JEE Advanced 2024 P1 Q3',
      text: 'A line makes equal angles with all three coordinate axes. What angle does it make with the x-axis?',
    },
    questionB: {
      source: 'JEE Advanced 2025 P1 Q5',
      text: 'A line has direction ratios (1, 1, 1). Find the angle it makes with the z-axis.',
    },
    sameConcept: true,
    conceptName: 'Direction Cosines (l² + m² + n² = 1)',
    explanation: 'Both use direction cosines. Equal angles → l=m=n=1/√3 → θ = cos⁻¹(1/√3) ≈ 54.7°. Same formula, same answer.',
    similarity: 0.808,
  },
  {
    id: 'c1',
    subject: 'Chemistry',
    topic: 'Organic Reactions',
    questionA: {
      source: 'JEE Advanced 2023 P2',
      text: 'In the reaction of 2-bromobutane with KOH/alcohol, the major product is: (A) but-1-ene  (B) but-2-ene  (C) 1-butanol  (D) 2-butanol',
    },
    questionB: {
      source: 'JEE Advanced 2024 P1',
      text: '2-bromo-2-methylbutane with KOH/alcohol gives predominantly: (A) 2-methylbut-1-ene  (B) 2-methylbut-2-ene  (C) 3-methylbut-1-ene  (D) pent-1-ene',
    },
    sameConcept: true,
    conceptName: "Zaitsev's Rule (most substituted alkene is major product)",
    explanation: "Both are elimination reactions with KOH/alcohol. Zaitsev's rule gives more substituted (stable) alkene. Ans: (B) for both.",
    similarity: 0.847,
  },
  {
    id: 'p2',
    subject: 'Physics',
    topic: 'Projectile Motion',
    questionA: {
      source: 'JEE Advanced 2022 P1',
      text: 'A ball is thrown at 30° above horizontal with speed 20 m/s. Find the horizontal range. (g = 10 m/s²)',
    },
    questionB: {
      source: 'JEE Advanced 2024 P2',
      text: 'A projectile is launched at 60° to the horizontal with initial velocity 10√2 m/s. Find the range on level ground. (g = 10 m/s²)',
    },
    sameConcept: true,
    conceptName: 'Projectile Range (R = u²sin2θ / g)',
    explanation: 'Both use R = u²sin2θ/g. Q1: R = 400×sin60°/10 = 20√3 m. Q2: R = 200×sin120°/10 = 10√3 m. Same formula.',
    similarity: 0.79,
  },
  {
    id: 'c2',
    subject: 'Chemistry',
    topic: 'Electrochemistry',
    questionA: {
      source: 'JEE Advanced 2022 P2',
      text: 'For a cell Zn|Zn²⁺(0.1M)||Cu²⁺(1M)|Cu, E°cell = 1.10 V. Calculate Ecell at 298K. (RT/F = 0.025 V)',
    },
    questionB: {
      source: 'JEE Advanced 2023 P1',
      text: 'For the cell Mg|Mg²⁺(0.01M)||Ag⁺(0.1M)|Ag, E°cell = 3.17 V. Find Ecell. (RT/F = 0.025 V, log2 = 0.30)',
    },
    sameConcept: true,
    conceptName: 'Nernst Equation (E = E° – 0.0591/n × logQ)',
    explanation: 'Both use the Nernst equation with given E° and concentrations. Same approach: calculate reaction quotient Q, plug into Nernst.',
    similarity: 0.82,
  },
  {
    id: 'm2',
    subject: 'Maths',
    topic: 'Integral Calculus',
    questionA: {
      source: 'JEE Advanced 2023 P2',
      text: 'Evaluate: ∫₀^(π/2) sin²x dx',
    },
    questionB: {
      source: 'JEE Advanced 2024 P1',
      text: 'Find the value of: ∫₀^(π/2) cos²x dx',
    },
    sameConcept: true,
    conceptName: 'Reduction Formula (∫sin²x = ∫cos²x = π/4 over [0, π/2])',
    explanation: 'Both equal π/4. Use the identity sin²x = (1-cos2x)/2 or the symmetry: ∫sin²x = ∫cos²x over [0,π/2].',
    similarity: 0.95,
  },

  // ── DIFFERENT CONCEPT PAIRS (interference traps) ─────────────────────────
  {
    id: 'p3',
    subject: 'Physics',
    topic: 'Electrostatics',
    questionA: {
      source: 'JEE Advanced 2022 P1',
      text: 'A point charge q is placed at distance r. Find the electric field E at that point.',
    },
    questionB: {
      source: 'JEE Advanced 2023 P2',
      text: 'A point charge q is placed at distance r. Find the electric potential V at that point.',
    },
    sameConcept: false,
    distinguishingFeature: 'E = kq/r² (inverse square, vector) vs V = kq/r (inverse, scalar)',
    explanation: 'Looks like the same setup but asks different things. E ∝ 1/r², V ∝ 1/r. Electric field is a vector — direction matters. Potential is a scalar — no direction. Common mistake: using wrong formula.',
    similarity: 0.68,
  },
  {
    id: 'c3',
    subject: 'Chemistry',
    topic: 'Chemical Kinetics',
    questionA: {
      source: 'JEE Advanced 2024 P1',
      text: 'For the reaction A → B, the rate of reaction doubles when concentration of A is doubled. The rate constant at 300K is 0.05 s⁻¹. Find the rate when [A] = 0.2 M.',
    },
    questionB: {
      source: 'JEE Advanced 2024 P2',
      text: 'For A → B, the rate constant doubles every 10°C. If k = 0.05 s⁻¹ at 300K, find k at 310K.',
    },
    sameConcept: false,
    distinguishingFeature: 'Rate = k[A]ⁿ (changes with [A]) vs k = Ae^(-Ea/RT) (changes with temperature)',
    explanation: "Q1 tests rate law — rate depends on concentration. Q2 tests Arrhenius — k depends on temperature. Both start with k = 0.05 but ask fundamentally different things. Students confuse 'rate' and 'rate constant'.",
    similarity: 0.71,
  },
  {
    id: 'm3',
    subject: 'Maths',
    topic: 'Differential Calculus',
    questionA: {
      source: 'JEE Advanced 2023 P1',
      text: 'Find the point where f(x) = x³ – 3x has a local maximum.',
    },
    questionB: {
      source: 'JEE Advanced 2025 P1',
      text: 'Find the point of inflection of f(x) = x³ – 3x.',
    },
    sameConcept: false,
    distinguishingFeature: "Local maxima: f'=0 AND f''<0 at x=−1. Inflection: f''=0 at x=0.",
    explanation: "Both start with f'(x) = 3x² – 3 = 0 → x = ±1. But maxima needs f'' = 6x < 0 → x = −1. Inflection needs f'' = 0 → x = 0. Different condition, different answer.",
    similarity: 0.73,
  },
  {
    id: 'p4',
    subject: 'Physics',
    topic: 'Mechanics',
    questionA: {
      source: 'JEE Advanced 2022 P2',
      text: 'A force of 10 N acts on a 2 kg block for 3 seconds. Find the impulse delivered to the block.',
    },
    questionB: {
      source: 'JEE Advanced 2023 P1',
      text: 'A force of 10 N moves a 2 kg block through 3 metres. Find the work done on the block.',
    },
    sameConcept: false,
    distinguishingFeature: 'Impulse = F × t = 30 N·s (changes momentum) vs Work = F × d = 30 J (changes kinetic energy)',
    explanation: 'Both compute F × (something) = 30, but units and physical meaning differ completely. Impulse = Δ(mv), Work = ΔKE. Classic trap: same numbers, fundamentally different concepts.',
    similarity: 0.69,
  },
  {
    id: 'm4',
    subject: 'Maths',
    topic: 'Sequences & Series',
    questionA: {
      source: 'JEE Advanced 2024 P2',
      text: 'Find the sum of the arithmetic series: 2 + 5 + 8 + … + 50.',
    },
    questionB: {
      source: 'JEE Advanced 2025 P2',
      text: 'Find the sum of the geometric series: 2 + 6 + 18 + … + 1458.',
    },
    sameConcept: false,
    distinguishingFeature: 'AP sum: Sn = n/2(a+l) vs GP sum: Sn = a(rⁿ−1)/(r−1)',
    explanation: 'Both ask for sum of a series. AP: constant difference (d=3), use Sn = n/2(a+l). GP: constant ratio (r=3), use Sn = a(rⁿ−1)/(r−1). Same question format, completely different formulas.',
    similarity: 0.67,
  },
  {
    id: 'c4',
    subject: 'Chemistry',
    topic: 'Atomic Structure',
    questionA: {
      source: 'JEE Advanced 2023 P1',
      text: 'An electron in hydrogen atom transitions from n=3 to n=2. Find the wavelength of emitted radiation using Rydberg formula.',
    },
    questionB: {
      source: 'JEE Advanced 2024 P1',
      text: 'An electron in hydrogen atom transitions from n=2 to n=3. Find the energy absorbed.',
    },
    sameConcept: false,
    distinguishingFeature: 'n=3→2 is emission (light released, negative ΔE) vs n=2→3 is absorption (light absorbed, positive ΔE)',
    explanation: 'Same transition, opposite direction. Q1: emission → wavelength of emitted photon. Q2: absorption → energy absorbed. ΔE = 13.6(1/n₁² − 1/n₂²) eV — sign and direction determine emission vs absorption.',
    similarity: 0.72,
  },
]
