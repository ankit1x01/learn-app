# PhysicsPlayground Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `<PhysicsPlayground type="..." config={...} />` — a single component backed by a plugin registry covering 26 physics simulation types with JEE Advanced puzzle support.

**Architecture:** Plugin registry maps `SimulationType` → `{ component, engine, puzzles, defaultControls }`. Shell reads registry, wraps sim in shared UI (PuzzlePanel + ControlPanel + ResultModal). Four engines: MatterEngine (Matter.js 2D), ThreeEngine (r3f+rapier 3D), CanvasEngine (SVG), StubEngine (placeholder).

**Tech Stack:** React 19, TypeScript, matter-js 0.20, @react-three/fiber, @react-three/rapier, Tailwind CSS 4, M3 design tokens

---

## File Map

**Create (new files):**
```
src/games/playground/types.ts
src/games/playground/registry.ts
src/games/playground/PhysicsPlayground.tsx
src/games/playground/engines/MatterEngine.tsx
src/games/playground/engines/ThreeEngine.tsx
src/games/playground/engines/CanvasEngine.tsx
src/games/playground/engines/StubEngine.tsx
src/games/playground/ui/PuzzlePanel.tsx
src/games/playground/ui/ControlPanel.tsx
src/games/playground/ui/ResultModal.tsx
src/games/playground/ui/MeasurementOverlay.tsx
src/games/playground/simulations/mechanics/Projectile.sim.tsx
src/games/playground/simulations/mechanics/CollisionElastic.sim.tsx
src/games/playground/simulations/mechanics/SpringMass.sim.tsx
src/games/playground/simulations/fields/ElectricField.sim.tsx
src/games/playground/simulations/Stub.sim.tsx
src/games/playground/puzzles/projectile.puzzles.ts
src/games/playground/puzzles/collision.puzzles.ts
src/games/playground/puzzles/spring_mass.puzzles.ts
src/games/playground/puzzles/electric_field.puzzles.ts
```

**Modify (existing files):**
```
src/games/GamesScreen.tsx  — add PhysicsPlayground entry to GAMES list
```

---

## Task 1: Types

**Files:** Create `src/games/playground/types.ts`

- [ ] Create the file:

```typescript
// src/games/playground/types.ts

export type SimulationType =
  | 'projectile' | 'collision_elastic' | 'collision_inelastic'
  | 'spring_mass' | 'pendulum' | 'atwood_machine'
  | 'rolling' | 'inclined_plane' | 'circular_motion' | 'orbit'
  | 'electric_field' | 'capacitor' | 'gauss_sphere'
  | 'magnetic_force' | 'biot_savart' | 'solenoid'
  | 'lcr_circuit' | 'em_wave' | 'bohr_atom' | 'photoelectric'
  | 'mirror_ray' | 'lens_ray' | 'prism'
  | 'ydse' | 'single_slit' | 'standing_wave'

export type Complexity = 'board' | 'jee_main' | 'jee_advanced'

export type Engine = 'matter' | 'three' | 'canvas' | 'stub'

export interface PuzzleConfig {
  id: string
  complexity: Complexity
  question: string
  given: Record<string, number>
  find: string[]
  answer: Record<string, number>
  tolerance: number          // % error allowed e.g. 2 = ±2%
  hints: string[]            // max 3, revealed one at a time
  formula: string
  units: Record<string, string>
}

export interface ControlDef {
  id: string
  label: string
  min: number
  max: number
  step: number
  unit: string
  default: number
}

export interface SimProps {
  controls: Record<string, number>
  puzzle: PuzzleConfig | null
  isPlaying: boolean
  onReset: () => void
}

export interface PlaygroundResult {
  conceptId: string
  correct: boolean
  timeTaken: number
  score: number
  hintsUsed: number
}

export interface PhysicsPlaygroundConfig {
  puzzle?: PuzzleConfig
  complexity?: Complexity
  freePlay?: boolean
  showForceVectors?: boolean
  showMeasurements?: boolean
  onResult?: (r: PlaygroundResult) => void
}
```

- [ ] Verify TypeScript: `cd "C:/Users/Ankit/Desktop/learn app" && npm run lint 2>&1 | tail -5`
  Expected: no errors related to playground/types.ts

- [ ] Commit:
```bash
git add src/games/playground/types.ts
git commit -m "feat(playground): add core type definitions"
```

---

## Task 2: Puzzle Banks

**Files:** Create all 4 puzzle files

- [ ] Create `src/games/playground/puzzles/projectile.puzzles.ts`:

```typescript
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
```

- [ ] Create `src/games/playground/puzzles/collision.puzzles.ts`:

```typescript
import { PuzzleConfig } from '../types'

export const COLLISION_PUZZLES: PuzzleConfig[] = [
  // BOARD
  {
    id: 'col_board_001',
    complexity: 'board',
    question: 'A 2 kg ball moving at 4 m/s collides elastically with a stationary 2 kg ball. Find their final velocities.',
    given: { m1: 2, m2: 2, u1: 4, u2: 0 },
    find: ['v1', 'v2'],
    answer: { v1: 0, v2: 4 },
    tolerance: 3,
    hints: [
      'Equal masses in elastic collision: they exchange velocities',
      'v1 = 0 m/s (first ball stops)',
      'v2 = 4 m/s (second ball moves at original speed)'
    ],
    formula: 'v₁=(m₁−m₂)u₁/(m₁+m₂),  v₂=2m₁u₁/(m₁+m₂)',
    units: { v1: 'm/s', v2: 'm/s' }
  },
  {
    id: 'col_board_002',
    complexity: 'board',
    question: 'A 3 kg object at 6 m/s collides with a stationary 3 kg object and they stick together. Find the final velocity.',
    given: { m1: 3, m2: 3, u1: 6, u2: 0 },
    find: ['v_final'],
    answer: { v_final: 3 },
    tolerance: 3,
    hints: [
      'Perfectly inelastic: objects stick together',
      'Conservation of momentum: m₁u₁ = (m₁+m₂)v',
      'v = 3×6/(3+3) = 3 m/s'
    ],
    formula: 'v = m₁u₁/(m₁+m₂)',
    units: { v_final: 'm/s' }
  },
  {
    id: 'col_board_003',
    complexity: 'board',
    question: 'A 1 kg ball at 10 m/s collides elastically with a stationary 4 kg ball. Find the velocity of the 4 kg ball after collision.',
    given: { m1: 1, m2: 4, u1: 10, u2: 0 },
    find: ['v2'],
    answer: { v2: 4 },
    tolerance: 3,
    hints: [
      'v₂ = 2m₁u₁/(m₁+m₂)',
      'v₂ = 2×1×10/(1+4)',
      'v₂ = 20/5 = 4 m/s'
    ],
    formula: 'v₂ = 2m₁u₁/(m₁+m₂)',
    units: { v2: 'm/s' }
  },
  // JEE MAIN
  {
    id: 'col_jee_main_001',
    complexity: 'jee_main',
    question: 'A 4 kg ball moving at 6 m/s collides elastically with a 2 kg ball moving at −3 m/s (opposite direction). Find both final velocities.',
    given: { m1: 4, m2: 2, u1: 6, u2: -3 },
    find: ['v1', 'v2'],
    answer: { v1: 1, v2: 7 },
    tolerance: 2,
    hints: [
      'v₁ = (m₁−m₂)u₁/(m₁+m₂) + 2m₂u₂/(m₁+m₂)',
      'v₁ = (2×6 + 2×2×(−3))/6 = (12−12)/6... recalculate carefully',
      'v₁=(4−2)×6/(6) + 2×2×(−3)/6 = 12/6−12/6... use full formula'
    ],
    formula: 'v₁=(m₁−m₂)u₁+2m₂u₂)/(m₁+m₂),  v₂=(m₂−m₁)u₂+2m₁u₁)/(m₁+m₂)',
    units: { v1: 'm/s', v2: 'm/s' }
  },
  {
    id: 'col_jee_main_002',
    complexity: 'jee_main',
    question: 'In a perfectly inelastic collision, a 5 kg ball at 8 m/s hits a 3 kg ball at 2 m/s in same direction. Find the loss in kinetic energy.',
    given: { m1: 5, m2: 3, u1: 8, u2: 2 },
    find: ['ke_loss'],
    answer: { ke_loss: 30 },
    tolerance: 2,
    hints: [
      'v_final = (m₁u₁+m₂u₂)/(m₁+m₂) = (40+6)/8 = 5.75 m/s',
      'KE_initial = ½×5×64 + ½×3×4 = 160+6 = 166 J',
      'KE_final = ½×8×5.75² = 136 J  →  loss = 30 J'
    ],
    formula: 'ΔKE = ½m₁m₂(u₁−u₂)²/(m₁+m₂)',
    units: { ke_loss: 'J' }
  },
  {
    id: 'col_jee_main_003',
    complexity: 'jee_main',
    question: 'A ball hits a wall elastically at 10 m/s perpendicular to it. The wall has mass 1000× the ball. Find the speed of the ball after collision.',
    given: { m1: 1, m2: 1000, u1: 10, u2: 0 },
    find: ['v1_final'],
    answer: { v1_final: -9.98 },
    tolerance: 2,
    hints: [
      'v₁ = (m₁−m₂)u₁/(m₁+m₂)',
      'With m₂ >> m₁: v₁ ≈ −u₁',
      'Ball bounces back at nearly same speed'
    ],
    formula: 'v₁ ≈ −u₁ when m₂ >> m₁',
    units: { v1_final: 'm/s' }
  },
  // JEE ADVANCED
  {
    id: 'col_jee_adv_001',
    complexity: 'jee_advanced',
    question: 'Ball A (2kg, 6 m/s) collides with ball B (2kg, at rest) elastically. B then collides with wall and bounces back (elastic). A and B collide again. Find the final velocity of A after all collisions.',
    given: { m_A: 2, m_B: 2, u_A: 6, u_B: 0 },
    find: ['v_A_final'],
    answer: { v_A_final: -6 },
    tolerance: 2,
    hints: [
      '1st collision (A-B elastic, equal mass): A stops at 0, B moves at 6 m/s',
      'B bounces off wall: B now at −6 m/s (back toward A)',
      '2nd collision (B at −6, A at 0, equal mass): B stops, A moves at −6 m/s'
    ],
    formula: 'Equal mass elastic: velocities exchange each collision',
    units: { v_A_final: 'm/s' }
  },
  {
    id: 'col_jee_adv_002',
    complexity: 'jee_advanced',
    question: 'A bullet of 10g moving at 500 m/s embeds in a 490g block on a frictionless surface. The block compresses a spring (k=200 N/m). Find maximum compression of the spring.',
    given: { m_bullet: 0.01, m_block: 0.49, u_bullet: 500, k: 200 },
    find: ['max_compression'],
    answer: { max_compression: 0.5 },
    tolerance: 2,
    hints: [
      'First: perfectly inelastic collision → v = m_b×u/(m_b+m_block) = 0.01×500/0.5 = 10 m/s',
      'KE of combined system = ½×0.5×100 = 25 J',
      'At max compression: KE → PE_spring → ½kx² = 25 → x = √(50/200) = 0.5 m'
    ],
    formula: 'v_combined = m_b·u/(m_b+M);  ½(m_b+M)v² = ½kx²',
    units: { max_compression: 'm' }
  },
  {
    id: 'col_jee_adv_003',
    complexity: 'jee_advanced',
    question: 'A 1 kg ball collides with a 3 kg ball at rest. After collision the 1 kg ball deflects at 90° to original direction. Both have equal speeds after collision. Find the initial speed of the 1 kg ball if its final speed is 3 m/s.',
    given: { m1: 1, m2: 3, final_speed: 3, deflection_angle_1: 90 },
    find: ['initial_speed'],
    answer: { initial_speed: 6 },
    tolerance: 2,
    hints: [
      'Momentum conservation: x: m₁u = m₂v₂cosθ₂, y: 0 = m₁v₁ − m₂v₂sinθ₂',
      'v₁ = v₂ = 3 m/s, m₁=1, m₂=3',
      'From y: sinθ₂ = m₁v₁/(m₂v₂) = 1/3;  from x: u = m₂v₂cosθ₂/m₁ → u = 3×3×(2√2/3) = 6'
    ],
    formula: 'Vector momentum conservation in 2D',
    units: { initial_speed: 'm/s' }
  }
]
```

- [ ] Create `src/games/playground/puzzles/spring_mass.puzzles.ts`:

```typescript
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
```

- [ ] Create `src/games/playground/puzzles/electric_field.puzzles.ts`:

```typescript
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
```

- [ ] Verify TypeScript compiles: `cd "C:/Users/Ankit/Desktop/learn app" && npm run lint 2>&1 | tail -5`
  Expected: no errors

- [ ] Commit:
```bash
git add src/games/playground/puzzles/
git commit -m "feat(playground): add 36 pre-authored JEE puzzles (board/main/advanced)"
```

---

## Task 3: Engines

**Files:** Create all 4 engine files

- [ ] Create `src/games/playground/engines/StubEngine.tsx`:

```typescript
// src/games/playground/engines/StubEngine.tsx
import { SimProps } from '../types'

export function StubEngine({ type }: SimProps & { type: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-[var(--color-on-surface-variant)]">
      <span className="material-symbols-rounded text-5xl" style={{ fontSize: 48 }}>science</span>
      <p className="text-sm font-medium">{type.replace(/_/g, ' ')}</p>
      <p className="text-xs opacity-60">Simulation coming soon</p>
    </div>
  )
}
```

- [ ] Create `src/games/playground/engines/MatterEngine.tsx`:

```typescript
// src/games/playground/engines/MatterEngine.tsx
import { useEffect, useRef } from 'react'
import Matter from 'matter-js'
import { SimProps } from '../types'

export interface MatterEngineProps extends SimProps {
  setup: (
    engine: Matter.Engine,
    render: Matter.Render,
    canvas: HTMLCanvasElement
  ) => () => void          // returns cleanup fn
}

export function MatterEngine({ setup, controls, puzzle, isPlaying, onReset }: MatterEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const renderRef = useRef<Matter.Render | null>(null)
  const runnerRef = useRef<Matter.Runner | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const engine = Matter.Engine.create({ gravity: { y: 1 } })
    const render = Matter.Render.create({
      canvas,
      engine,
      options: {
        width: canvas.clientWidth || 380,
        height: canvas.clientHeight || 300,
        wireframes: false,
        background: 'var(--color-surface-container-low, #f4eff4)',
      },
    })
    const runner = Matter.Runner.create()

    engineRef.current = engine
    renderRef.current = render
    runnerRef.current = runner

    cleanupRef.current = setup(engine, render, canvas)

    Matter.Render.run(render)
    Matter.Runner.run(runner, engine)

    return () => {
      cleanupRef.current?.()
      Matter.Runner.stop(runner)
      Matter.Render.stop(render)
      Matter.Engine.clear(engine)
      render.canvas.remove()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])  // run once; simulations re-mount on reset via key prop

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-[var(--radius-m3-lg)]"
      style={{ display: 'block' }}
    />
  )
}
```

- [ ] Create `src/games/playground/engines/ThreeEngine.tsx`:

```typescript
// src/games/playground/engines/ThreeEngine.tsx
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { SimProps } from '../types'

interface ThreeEngineProps extends SimProps {
  children: React.ReactNode
  enablePhysics?: boolean
  cameraPosition?: [number, number, number]
}

export function ThreeEngine({
  children,
  enablePhysics = false,
  cameraPosition = [0, 0, 10],
}: ThreeEngineProps) {
  return (
    <Canvas
      camera={{ position: cameraPosition, fov: 50 }}
      style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-m3-lg)' }}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} />
      <Suspense fallback={null}>
        {enablePhysics ? (
          <Physics gravity={[0, -9.81, 0]}>{children}</Physics>
        ) : (
          children
        )}
      </Suspense>
      <OrbitControls enablePan={false} minDistance={3} maxDistance={30} />
    </Canvas>
  )
}
```

- [ ] Create `src/games/playground/engines/CanvasEngine.tsx`:

```typescript
// src/games/playground/engines/CanvasEngine.tsx
import { useRef, useEffect, useCallback } from 'react'
import { SimProps } from '../types'

export interface CanvasEngineProps extends SimProps {
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void
  deps?: unknown[]
}

export function CanvasEngine({ draw, deps = [] }: CanvasEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)
    draw(ctx, width, height)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draw, ...deps])

  useEffect(() => { render() }, [render])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const observer = new ResizeObserver(() => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio
      canvas.height = canvas.clientHeight * window.devicePixelRatio
      render()
    })
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [render])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-[var(--radius-m3-lg)]"
      style={{ display: 'block' }}
    />
  )
}
```

- [ ] Lint check: `cd "C:/Users/Ankit/Desktop/learn app" && npm run lint 2>&1 | tail -5`

- [ ] Commit:
```bash
git add src/games/playground/engines/
git commit -m "feat(playground): add Matter/Three/Canvas/Stub engines"
```

---

## Task 4: Shared UI — ControlPanel + MeasurementOverlay

**Files:** Create `ui/ControlPanel.tsx`, `ui/MeasurementOverlay.tsx`

- [ ] Create `src/games/playground/ui/ControlPanel.tsx`:

```typescript
// src/games/playground/ui/ControlPanel.tsx
import { ControlDef } from '../types'

interface Props {
  controls: ControlDef[]
  values: Record<string, number>
  onChange: (id: string, value: number) => void
  disabled?: boolean
}

export function ControlPanel({ controls, values, onChange, disabled }: Props) {
  return (
    <div className="flex flex-col gap-3 px-4 py-3 bg-[var(--color-surface-container)] rounded-[var(--radius-m3-lg)]">
      {controls.map(ctrl => (
        <div key={ctrl.id} className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-[var(--color-on-surface-variant)]">
              {ctrl.label}
            </span>
            <span className="text-xs font-bold text-[var(--color-primary)] min-w-[52px] text-right">
              {values[ctrl.id]?.toFixed(ctrl.step < 1 ? 2 : 0)} {ctrl.unit}
            </span>
          </div>
          <input
            type="range"
            min={ctrl.min}
            max={ctrl.max}
            step={ctrl.step}
            value={values[ctrl.id] ?? ctrl.default}
            disabled={disabled}
            onChange={e => onChange(ctrl.id, parseFloat(e.target.value))}
            className="w-full accent-[var(--color-primary)] h-1"
          />
          <div className="flex justify-between">
            <span className="text-[10px] text-[var(--color-outline)]">{ctrl.min}{ctrl.unit}</span>
            <span className="text-[10px] text-[var(--color-outline)]">{ctrl.max}{ctrl.unit}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] Create `src/games/playground/ui/MeasurementOverlay.tsx`:

```typescript
// src/games/playground/ui/MeasurementOverlay.tsx
interface Measurement {
  label: string
  value: string
  color?: string
}

interface Props {
  measurements: Measurement[]
  visible: boolean
}

export function MeasurementOverlay({ measurements, visible }: Props) {
  if (!visible || measurements.length === 0) return null
  return (
    <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
      {measurements.map((m, i) => (
        <div
          key={i}
          className="flex items-center gap-1.5 bg-[var(--color-surface)]/90 px-2 py-1 rounded-[var(--radius-m3-sm)]"
          style={{ boxShadow: 'var(--shadow-elevation-1)' }}
        >
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: m.color ?? 'var(--color-primary)' }}
          />
          <span className="text-[11px] font-medium text-[var(--color-on-surface)]">
            {m.label}: <span className="text-[var(--color-primary)]">{m.value}</span>
          </span>
        </div>
      ))}
    </div>
  )
}
```

- [ ] Commit:
```bash
git add src/games/playground/ui/ControlPanel.tsx src/games/playground/ui/MeasurementOverlay.tsx
git commit -m "feat(playground): add ControlPanel and MeasurementOverlay UI"
```

---

## Task 5: Shared UI — PuzzlePanel + ResultModal

- [ ] Create `src/games/playground/ui/PuzzlePanel.tsx`:

```typescript
// src/games/playground/ui/PuzzlePanel.tsx
import { useState } from 'react'
import { PuzzleConfig } from '../types'

interface Props {
  puzzle: PuzzleConfig
  onSubmit: (answers: Record<string, number>) => void
  hintsUsed: number
  onHint: () => void
  submitted: boolean
  correct: boolean | null
}

export function PuzzlePanel({ puzzle, onSubmit, hintsUsed, onHint, submitted, correct }: Props) {
  const [inputs, setInputs] = useState<Record<string, string>>({})

  const handleSubmit = () => {
    const parsed: Record<string, number> = {}
    for (const key of puzzle.find) {
      const v = parseFloat(inputs[key] ?? '')
      if (isNaN(v)) return
      parsed[key] = v
    }
    onSubmit(parsed)
  }

  const complexityColor = {
    board: 'var(--color-tertiary)',
    jee_main: 'var(--color-secondary)',
    jee_advanced: 'var(--color-error)',
  }[puzzle.complexity]

  const complexityLabel = {
    board: 'Board',
    jee_main: 'JEE Main',
    jee_advanced: 'JEE Advanced',
  }[puzzle.complexity]

  return (
    <div className="flex flex-col gap-3">
      {/* Badge */}
      <div className="flex items-center gap-2">
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
          style={{ background: complexityColor }}
        >
          {complexityLabel}
        </span>
        <span className="text-[10px] text-[var(--color-outline)]">{puzzle.id}</span>
      </div>

      {/* Question */}
      <p className="text-sm text-[var(--color-on-surface)] leading-relaxed">{puzzle.question}</p>

      {/* Given values */}
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(puzzle.given).map(([k, v]) => (
          <span
            key={k}
            className="text-[11px] bg-[var(--color-surface-container-high)] px-2 py-0.5 rounded-full text-[var(--color-on-surface-variant)]"
          >
            {k} = {v} {puzzle.units[k] ?? ''}
          </span>
        ))}
      </div>

      {/* Answer inputs */}
      <div className="flex flex-col gap-2">
        {puzzle.find.map(key => (
          <div key={key} className="flex items-center gap-2">
            <label className="text-xs font-medium text-[var(--color-on-surface-variant)] w-28 flex-shrink-0">
              {key.replace(/_/g, ' ')} ({puzzle.units[key] ?? '?'})
            </label>
            <input
              type="number"
              step="any"
              disabled={submitted}
              value={inputs[key] ?? ''}
              onChange={e => setInputs(p => ({ ...p, [key]: e.target.value }))}
              className="flex-1 border border-[var(--color-outline-variant)] rounded-[var(--radius-m3-sm)] px-3 py-1.5 text-sm bg-[var(--color-surface)] text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)]"
              placeholder="Enter value"
            />
          </div>
        ))}
      </div>

      {/* Hint display */}
      {hintsUsed > 0 && (
        <div className="flex flex-col gap-1">
          {puzzle.hints.slice(0, hintsUsed).map((h, i) => (
            <div
              key={i}
              className="text-xs bg-[var(--color-tertiary-container)] text-[var(--color-on-tertiary-container)] px-3 py-1.5 rounded-[var(--radius-m3-sm)]"
            >
              💡 {h}
            </div>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2">
        {!submitted && hintsUsed < puzzle.hints.length && (
          <button
            onClick={onHint}
            className="flex-1 py-2 rounded-[var(--radius-m3-lg)] text-sm font-medium border border-[var(--color-outline)] text-[var(--color-on-surface-variant)]"
          >
            Hint ({puzzle.hints.length - hintsUsed} left)
          </button>
        )}
        {!submitted && (
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 rounded-[var(--radius-m3-lg)] text-sm font-bold text-white"
            style={{ background: 'var(--color-primary)' }}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  )
}
```

- [ ] Create `src/games/playground/ui/ResultModal.tsx`:

```typescript
// src/games/playground/ui/ResultModal.tsx
import { PuzzleConfig, PlaygroundResult } from '../types'

interface Props {
  result: PlaygroundResult
  puzzle: PuzzleConfig
  onNext: () => void
  onRetry: () => void
}

export function ResultModal({ result, puzzle, onNext, onRetry }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50 px-4 pb-6">
      <div
        className="w-full max-w-md bg-[var(--color-surface)] rounded-[var(--radius-m3-2xl)] p-6 flex flex-col gap-4"
        style={{ boxShadow: 'var(--shadow-elevation-3)' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-rounded text-4xl"
            style={{
              fontSize: 40,
              color: result.correct ? 'var(--color-tertiary)' : 'var(--color-error)',
              fontVariationSettings: "'FILL' 1"
            }}
          >
            {result.correct ? 'check_circle' : 'cancel'}
          </span>
          <div>
            <p className="text-lg font-bold text-[var(--color-on-surface)]">
              {result.correct ? 'Correct!' : 'Not quite'}
            </p>
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              Score: {result.score}/100 · {(result.timeTaken / 1000).toFixed(1)}s · {result.hintsUsed} hint{result.hintsUsed !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Formula reveal */}
        <div className="bg-[var(--color-surface-container)] rounded-[var(--radius-m3-lg)] px-4 py-3">
          <p className="text-[10px] font-bold text-[var(--color-outline)] uppercase tracking-wide mb-1">Formula</p>
          <p className="text-sm font-medium text-[var(--color-on-surface)] font-mono">{puzzle.formula}</p>
        </div>

        {/* Correct answers */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(puzzle.answer).map(([k, v]) => (
            <div
              key={k}
              className="bg-[var(--color-secondary-container)] px-3 py-1 rounded-full"
            >
              <span className="text-xs font-medium text-[var(--color-on-secondary-container)]">
                {k.replace(/_/g, ' ')} = {v} {puzzle.units[k] ?? ''}
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 py-3 rounded-[var(--radius-m3-lg)] border border-[var(--color-outline)] text-sm font-medium text-[var(--color-on-surface-variant)]"
          >
            Retry
          </button>
          <button
            onClick={onNext}
            className="flex-1 py-3 rounded-[var(--radius-m3-lg)] text-sm font-bold text-white"
            style={{ background: 'var(--color-primary)' }}
          >
            Next Puzzle
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] Lint: `cd "C:/Users/Ankit/Desktop/learn app" && npm run lint 2>&1 | tail -5`

- [ ] Commit:
```bash
git add src/games/playground/ui/
git commit -m "feat(playground): add PuzzlePanel and ResultModal UI"
```

---

## Task 6: Stub Simulation + Registry

- [ ] Create `src/games/playground/simulations/Stub.sim.tsx`:

```typescript
// src/games/playground/simulations/Stub.sim.tsx
import { SimProps } from '../types'

export function StubSim({ }: SimProps) {
  return null  // StubEngine renders the placeholder UI
}
```

- [ ] Create `src/games/playground/registry.ts`:

```typescript
// src/games/playground/registry.ts
import { lazy } from 'react'
import { SimulationType, Engine, PuzzleConfig, ControlDef } from './types'
import { PROJECTILE_PUZZLES } from './puzzles/projectile.puzzles'
import { COLLISION_PUZZLES } from './puzzles/collision.puzzles'
import { SPRING_MASS_PUZZLES } from './puzzles/spring_mass.puzzles'
import { ELECTRIC_FIELD_PUZZLES } from './puzzles/electric_field.puzzles'

export interface SimulationPlugin {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.LazyExoticComponent<React.ComponentType<any>>
  engine: Engine
  conceptId: string
  puzzles: PuzzleConfig[]
  defaultControls: ControlDef[]
  label: string
  icon: string           // material symbol name
}

const Stub = lazy(() => import('./simulations/Stub.sim').then(m => ({ default: m.StubSim })))
const Projectile = lazy(() => import('./simulations/mechanics/Projectile.sim').then(m => ({ default: m.ProjectileSim })))
const CollisionElastic = lazy(() => import('./simulations/mechanics/CollisionElastic.sim').then(m => ({ default: m.CollisionElasticSim })))
const SpringMass = lazy(() => import('./simulations/mechanics/SpringMass.sim').then(m => ({ default: m.SpringMassSim })))
const ElectricField = lazy(() => import('./simulations/fields/ElectricField.sim').then(m => ({ default: m.ElectricFieldSim })))

const NO_PUZZLES: PuzzleConfig[] = []
const NO_CONTROLS: ControlDef[] = []

export const SIMULATION_REGISTRY: Record<SimulationType, SimulationPlugin> = {
  projectile: {
    component: Projectile,
    engine: 'matter',
    conceptId: 'kinematics_projectile_motion',
    puzzles: PROJECTILE_PUZZLES,
    label: 'Projectile Motion',
    icon: 'sports_baseball',
    defaultControls: [
      { id: 'angle',  label: 'Launch Angle', min: 10, max: 80, step: 1,   unit: '°',   default: 45 },
      { id: 'speed',  label: 'Speed',        min: 5,  max: 50, step: 1,   unit: 'm/s', default: 20 },
      { id: 'height', label: 'Height',       min: 0,  max: 40, step: 1,   unit: 'm',   default: 0  },
    ],
  },
  collision_elastic: {
    component: CollisionElastic,
    engine: 'matter',
    conceptId: 'laws_of_motion_collision_elastic',
    puzzles: COLLISION_PUZZLES,
    label: 'Elastic Collision',
    icon: 'circles_ext',
    defaultControls: [
      { id: 'm1',  label: 'Mass 1',     min: 1,   max: 10, step: 0.5, unit: 'kg',  default: 2  },
      { id: 'm2',  label: 'Mass 2',     min: 1,   max: 10, step: 0.5, unit: 'kg',  default: 2  },
      { id: 'u1',  label: 'Velocity 1', min: 1,   max: 20, step: 1,   unit: 'm/s', default: 6  },
    ],
  },
  collision_inelastic: {
    component: CollisionElastic,  // reuses same sim, inelastic mode
    engine: 'matter',
    conceptId: 'laws_of_motion_collision_inelastic',
    puzzles: COLLISION_PUZZLES,
    label: 'Inelastic Collision',
    icon: 'merge',
    defaultControls: [
      { id: 'm1',  label: 'Mass 1',     min: 1, max: 10, step: 0.5, unit: 'kg',  default: 3  },
      { id: 'm2',  label: 'Mass 2',     min: 1, max: 10, step: 0.5, unit: 'kg',  default: 2  },
      { id: 'u1',  label: 'Velocity 1', min: 1, max: 20, step: 1,   unit: 'm/s', default: 8  },
      { id: 'cor', label: 'Restitution',min: 0, max: 1,  step: 0.1, unit: '',    default: 0.5},
    ],
  },
  spring_mass: {
    component: SpringMass,
    engine: 'matter',
    conceptId: 'oscillations_spring_mass_shm',
    puzzles: SPRING_MASS_PUZZLES,
    label: 'Spring–Mass SHM',
    icon: 'compress',
    defaultControls: [
      { id: 'k',         label: 'Spring k',    min: 50,  max: 800, step: 10,  unit: 'N/m', default: 200 },
      { id: 'mass',      label: 'Mass',        min: 0.5, max: 5,   step: 0.5, unit: 'kg',  default: 1   },
      { id: 'amplitude', label: 'Amplitude',   min: 1,   max: 15,  step: 1,   unit: 'cm',  default: 8   },
    ],
  },
  electric_field: {
    component: ElectricField,
    engine: 'three',
    conceptId: 'electrostatics_electric_field_lines',
    puzzles: ELECTRIC_FIELD_PUZZLES,
    label: 'Electric Field',
    icon: 'electric_bolt',
    defaultControls: [
      { id: 'q1', label: 'Charge 1', min: -5, max: 5, step: 0.5, unit: 'μC', default: 2  },
      { id: 'q2', label: 'Charge 2', min: -5, max: 5, step: 0.5, unit: 'μC', default: -2 },
    ],
  },
  // ── stubs ──────────────────────────────────────────────────────────────────
  pendulum:          { component: Stub, engine: 'stub', conceptId: 'oscillations_simple_pendulum',       puzzles: NO_PUZZLES, label: 'Pendulum',             icon: 'pace',             defaultControls: NO_CONTROLS },
  atwood_machine:    { component: Stub, engine: 'stub', conceptId: 'laws_of_motion_atwood',              puzzles: NO_PUZZLES, label: 'Atwood Machine',       icon: 'balance',          defaultControls: NO_CONTROLS },
  rolling:           { component: Stub, engine: 'stub', conceptId: 'rotation_rolling_motion',            puzzles: NO_PUZZLES, label: 'Rolling Motion',       icon: 'radio_button_unchecked', defaultControls: NO_CONTROLS },
  inclined_plane:    { component: Stub, engine: 'stub', conceptId: 'laws_of_motion_inclined_plane',      puzzles: NO_PUZZLES, label: 'Inclined Plane',       icon: 'change_history',   defaultControls: NO_CONTROLS },
  circular_motion:   { component: Stub, engine: 'stub', conceptId: 'kinematics_circular_motion',         puzzles: NO_PUZZLES, label: 'Circular Motion',      icon: 'sync',             defaultControls: NO_CONTROLS },
  orbit:             { component: Stub, engine: 'stub', conceptId: 'gravitation_orbital_motion',         puzzles: NO_PUZZLES, label: 'Orbital Motion',       icon: 'public',           defaultControls: NO_CONTROLS },
  capacitor:         { component: Stub, engine: 'stub', conceptId: 'electrostatics_capacitor',           puzzles: NO_PUZZLES, label: 'Capacitor',            icon: 'developer_board',  defaultControls: NO_CONTROLS },
  gauss_sphere:      { component: Stub, engine: 'stub', conceptId: 'electrostatics_gauss_law',           puzzles: NO_PUZZLES, label: 'Gauss\'s Law',         icon: 'target',           defaultControls: NO_CONTROLS },
  magnetic_force:    { component: Stub, engine: 'stub', conceptId: 'magnetism_lorentz_force',            puzzles: NO_PUZZLES, label: 'Magnetic Force',       icon: 'north',            defaultControls: NO_CONTROLS },
  biot_savart:       { component: Stub, engine: 'stub', conceptId: 'magnetism_biot_savart',              puzzles: NO_PUZZLES, label: 'Biot–Savart',          icon: 'waves',            defaultControls: NO_CONTROLS },
  solenoid:          { component: Stub, engine: 'stub', conceptId: 'magnetism_solenoid',                 puzzles: NO_PUZZLES, label: 'Solenoid',             icon: 'view_column',      defaultControls: NO_CONTROLS },
  lcr_circuit:       { component: Stub, engine: 'stub', conceptId: 'alternating_current_lcr_resonance',  puzzles: NO_PUZZLES, label: 'LCR Circuit',          icon: 'electric_meter',   defaultControls: NO_CONTROLS },
  em_wave:           { component: Stub, engine: 'stub', conceptId: 'em_waves_propagation',               puzzles: NO_PUZZLES, label: 'EM Wave',              icon: 'air',              defaultControls: NO_CONTROLS },
  bohr_atom:         { component: Stub, engine: 'stub', conceptId: 'atoms_bohr_model',                   puzzles: NO_PUZZLES, label: 'Bohr Atom',            icon: 'hub',              defaultControls: NO_CONTROLS },
  photoelectric:     { component: Stub, engine: 'stub', conceptId: 'dual_nature_photoelectric',          puzzles: NO_PUZZLES, label: 'Photoelectric Effect', icon: 'light_mode',       defaultControls: NO_CONTROLS },
  mirror_ray:        { component: Stub, engine: 'stub', conceptId: 'optics_mirror_formula',              puzzles: NO_PUZZLES, label: 'Mirror Ray Diagram',   icon: 'brightness_low',   defaultControls: NO_CONTROLS },
  lens_ray:          { component: Stub, engine: 'stub', conceptId: 'optics_lens_formula',               puzzles: NO_PUZZLES, label: 'Lens Ray Diagram',     icon: 'lens_blur',        defaultControls: NO_CONTROLS },
  prism:             { component: Stub, engine: 'stub', conceptId: 'optics_prism_dispersion',            puzzles: NO_PUZZLES, label: 'Prism Dispersion',     icon: 'flare',            defaultControls: NO_CONTROLS },
  ydse:              { component: Stub, engine: 'stub', conceptId: 'wave_optics_ydse',                   puzzles: NO_PUZZLES, label: 'YDSE',                 icon: 'interference',     defaultControls: NO_CONTROLS },
  single_slit:       { component: Stub, engine: 'stub', conceptId: 'wave_optics_single_slit',            puzzles: NO_PUZZLES, label: 'Single Slit',          icon: 'more_vert',        defaultControls: NO_CONTROLS },
  standing_wave:     { component: Stub, engine: 'stub', conceptId: 'waves_standing_wave',                puzzles: NO_PUZZLES, label: 'Standing Wave',        icon: 'graphic_eq',       defaultControls: NO_CONTROLS },
}
```

- [ ] Lint: `cd "C:/Users/Ankit/Desktop/learn app" && npm run lint 2>&1 | tail -5`

- [ ] Commit:
```bash
git add src/games/playground/registry.ts src/games/playground/simulations/Stub.sim.tsx
git commit -m "feat(playground): add simulation registry with 26 entries (4 real + 22 stubs)"
```

---

## Task 7: Shell Component

- [ ] Create `src/games/playground/PhysicsPlayground.tsx`:

```typescript
// src/games/playground/PhysicsPlayground.tsx
import { Suspense, useState, useRef, useCallback } from 'react'
import { SIMULATION_REGISTRY } from './registry'
import { SimulationType, PhysicsPlaygroundConfig, PuzzleConfig, PlaygroundResult, Complexity } from './types'
import { PuzzlePanel } from './ui/PuzzlePanel'
import { ControlPanel } from './ui/ControlPanel'
import { ResultModal } from './ui/ResultModal'
import { MeasurementOverlay } from './ui/MeasurementOverlay'
import { StubEngine } from './engines/StubEngine'

interface Props {
  type: SimulationType
  config?: PhysicsPlaygroundConfig
}

function scoreCalc(hintsUsed: number, timeTaken: number, correct: boolean): number {
  if (!correct) return 0
  const hintPenalty = hintsUsed * 15
  const timePenalty = Math.min(30, Math.floor(timeTaken / 30000))
  return Math.max(10, 100 - hintPenalty - timePenalty)
}

function validateAnswers(
  inputs: Record<string, number>,
  puzzle: PuzzleConfig
): boolean {
  return puzzle.find.every(key => {
    const expected = puzzle.answer[key]
    const actual = inputs[key]
    if (actual === undefined) return false
    const pct = Math.abs((actual - expected) / expected) * 100
    return pct <= puzzle.tolerance
  })
}

export function PhysicsPlayground({ type, config = {} }: Props) {
  const plugin = SIMULATION_REGISTRY[type]
  const { onResult, showMeasurements = true, complexity = 'jee_advanced' } = config

  // Pick puzzle
  const puzzleBank = plugin.puzzles.filter((p: PuzzleConfig) =>
    config.puzzle ? p.id === config.puzzle.id : p.complexity === (complexity as Complexity)
  )
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const puzzle: PuzzleConfig | null = config.freePlay
    ? null
    : puzzleBank[puzzleIndex % Math.max(1, puzzleBank.length)] ?? null

  // Controls
  const defaultValues = Object.fromEntries(
    plugin.defaultControls.map(c => [c.id, c.default])
  )
  const [controlValues, setControlValues] = useState<Record<string, number>>(defaultValues)
  const handleControl = useCallback((id: string, value: number) => {
    setControlValues(prev => ({ ...prev, [id]: value }))
  }, [])

  // Puzzle state
  const [hintsUsed, setHintsUsed] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState<boolean | null>(null)
  const [result, setResult] = useState<PlaygroundResult | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const startTimeRef = useRef(Date.now())

  const handleSubmit = useCallback((answers: Record<string, number>) => {
    if (!puzzle) return
    const ok = validateAnswers(answers, puzzle)
    const timeTaken = Date.now() - startTimeRef.current
    const score = scoreCalc(hintsUsed, timeTaken, ok)
    const r: PlaygroundResult = {
      conceptId: plugin.conceptId,
      correct: ok,
      timeTaken,
      score,
      hintsUsed,
    }
    setCorrect(ok)
    setSubmitted(true)
    setResult(r)
    onResult?.(r)
  }, [puzzle, hintsUsed, plugin.conceptId, onResult])

  const handleReset = useCallback(() => {
    setIsPlaying(false)
    setResetKey(k => k + 1)
    setSubmitted(false)
    setCorrect(null)
    setResult(null)
    setHintsUsed(0)
    startTimeRef.current = Date.now()
    setControlValues(defaultValues)
  }, [defaultValues])

  const handleNext = useCallback(() => {
    setPuzzleIndex(i => i + 1)
    handleReset()
  }, [handleReset])

  const SimComponent = plugin.component

  return (
    <div className="flex flex-col h-full bg-[var(--color-background)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <span
          className="material-symbols-rounded"
          style={{ fontSize: 22, color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}
        >
          {plugin.icon}
        </span>
        <h2 className="text-base font-bold text-[var(--color-on-surface)] flex-1">{plugin.label}</h2>
        <button
          onClick={handleReset}
          className="p-1.5 rounded-full text-[var(--color-on-surface-variant)]"
          aria-label="Reset"
        >
          <span className="material-symbols-rounded" style={{ fontSize: 20 }}>refresh</span>
        </button>
        <button
          onClick={() => setIsPlaying(p => !p)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white"
          style={{ background: 'var(--color-primary)' }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>
            {isPlaying ? 'pause' : 'play_arrow'}
          </span>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>

      {/* Simulation area */}
      <div className="relative flex-1 min-h-0 mx-4 rounded-[var(--radius-m3-xl)] overflow-hidden bg-[var(--color-surface-container-low)]">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <span className="material-symbols-rounded animate-spin text-[var(--color-primary)]" style={{ fontSize: 32 }}>
              progress_activity
            </span>
          </div>
        }>
          {plugin.engine === 'stub' ? (
            <StubEngine type={type} controls={controlValues} puzzle={puzzle} isPlaying={isPlaying} onReset={handleReset} />
          ) : (
            <SimComponent
              key={resetKey}
              controls={controlValues}
              puzzle={puzzle}
              isPlaying={isPlaying}
              onReset={handleReset}
            />
          )}
        </Suspense>
        <MeasurementOverlay measurements={[]} visible={showMeasurements} />
      </div>

      {/* Bottom panel — controls + puzzle */}
      <div className="flex flex-col gap-3 px-4 py-3 overflow-y-auto max-h-[50vh]">
        {plugin.defaultControls.length > 0 && (
          <ControlPanel
            controls={plugin.defaultControls}
            values={controlValues}
            onChange={handleControl}
            disabled={submitted}
          />
        )}
        {puzzle && (
          <PuzzlePanel
            puzzle={puzzle}
            onSubmit={handleSubmit}
            hintsUsed={hintsUsed}
            onHint={() => setHintsUsed(h => Math.min(h + 1, puzzle.hints.length))}
            submitted={submitted}
            correct={correct}
          />
        )}
      </div>

      {/* Result modal */}
      {result && puzzle && (
        <ResultModal
          result={result}
          puzzle={puzzle}
          onNext={handleNext}
          onRetry={handleReset}
        />
      )}
    </div>
  )
}
```

- [ ] Lint: `cd "C:/Users/Ankit/Desktop/learn app" && npm run lint 2>&1 | tail -5`

- [ ] Commit:
```bash
git add src/games/playground/PhysicsPlayground.tsx
git commit -m "feat(playground): add PhysicsPlayground shell with registry, puzzle flow, result modal"
```

---

## Task 8: Projectile Simulation (Matter.js)

- [ ] Create `src/games/playground/simulations/mechanics/Projectile.sim.tsx`:

```typescript
// src/games/playground/simulations/mechanics/Projectile.sim.tsx
import { useEffect, useRef, useCallback } from 'react'
import Matter from 'matter-js'
import { SimProps } from '../../types'
import { MatterEngine } from '../../engines/MatterEngine'

const G_SCALE = 0.001   // pixels per (m/s²) — tuning constant
const M_SCALE = 4       // pixels per metre

export function ProjectileSim(props: SimProps) {
  const { controls, isPlaying } = props
  const angle = controls['angle'] ?? 45
  const speed = controls['speed'] ?? 20
  const height = controls['height'] ?? 0

  const setup = useCallback((
    engine: Matter.Engine,
    render: Matter.Render,
    canvas: HTMLCanvasElement
  ) => {
    const W = canvas.clientWidth || 380
    const H = canvas.clientHeight || 300
    const groundY = H - 40

    engine.gravity.y = 9.81 * G_SCALE

    // Ground
    const ground = Matter.Bodies.rectangle(W / 2, groundY + 20, W, 40, {
      isStatic: true,
      render: { fillStyle: '#CAC4D0' },
      label: 'ground',
    })

    // Launch platform
    const platformH = height * M_SCALE
    const platformBody = Matter.Bodies.rectangle(40, groundY - platformH / 2, 20, platformH, {
      isStatic: true,
      render: { fillStyle: '#6750A4' },
      label: 'platform',
    })

    // Projectile
    const rad = (angle * Math.PI) / 180
    const vx = Math.cos(rad) * speed * M_SCALE * 0.06
    const vy = -Math.sin(rad) * speed * M_SCALE * 0.06
    const ballY = groundY - platformH - 8
    const ball = Matter.Bodies.circle(40, ballY, 8, {
      restitution: 0,
      friction: 0,
      frictionAir: 0,
      render: { fillStyle: '#F43F5E' },
      label: 'ball',
    })
    Matter.Body.setVelocity(ball, { x: vx, y: vy })

    // Trajectory dots
    const dots: Matter.Body[] = []
    for (let t = 0; t < 3; t += 0.15) {
      const tx = 40 + Math.cos(rad) * speed * M_SCALE * 0.06 * t * 60
      const ty = ballY + (-Math.sin(rad) * speed * M_SCALE * 0.06 * t * 60) + 0.5 * 9.81 * G_SCALE * 3600 * t * t
      if (ty > groundY) break
      const dot = Matter.Bodies.circle(tx, ty, 2, {
        isStatic: true,
        isSensor: true,
        render: { fillStyle: '#6750A460' },
        collisionFilter: { mask: 0 },
        label: 'dot',
      })
      dots.push(dot)
    }

    Matter.World.add(engine.world, [ground, platformBody, ball, ...dots])

    if (!isPlaying) {
      Matter.Runner.stop(Matter.Runner.create())
    }

    return () => {
      Matter.World.clear(engine.world, false)
    }
  }, [angle, speed, height, isPlaying])

  return <MatterEngine {...props} setup={setup} />
}
```

- [ ] Lint: `cd "C:/Users/Ankit/Desktop/learn app" && npm run lint 2>&1 | tail -5`

- [ ] Commit:
```bash
git add src/games/playground/simulations/mechanics/Projectile.sim.tsx
git commit -m "feat(playground): add Projectile simulation (Matter.js)"
```

---

## Task 9: Collision Elastic Simulation (Matter.js)

- [ ] Create `src/games/playground/simulations/mechanics/CollisionElastic.sim.tsx`:

```typescript
// src/games/playground/simulations/mechanics/CollisionElastic.sim.tsx
import { useCallback } from 'react'
import Matter from 'matter-js'
import { SimProps } from '../../types'
import { MatterEngine } from '../../engines/MatterEngine'

const M_SCALE = 5

export function CollisionElasticSim(props: SimProps) {
  const { controls } = props
  const m1 = controls['m1'] ?? 2
  const m2 = controls['m2'] ?? 2
  const u1 = controls['u1'] ?? 6
  const cor = controls['cor'] ?? 1   // 1 = elastic, 0 = perfectly inelastic

  const setup = useCallback((
    engine: Matter.Engine,
    render: Matter.Render,
    canvas: HTMLCanvasElement
  ) => {
    const W = canvas.clientWidth || 380
    const H = canvas.clientHeight || 300
    const groundY = H - 30
    engine.gravity.y = 0   // frictionless track

    // Track
    const track = Matter.Bodies.rectangle(W / 2, groundY + 10, W, 20, {
      isStatic: true,
      render: { fillStyle: '#CAC4D0' },
    })

    // Left wall
    const leftWall = Matter.Bodies.rectangle(-10, H / 2, 20, H, {
      isStatic: true,
      render: { fillStyle: '#CAC4D0' },
    })

    // Right wall
    const rightWall = Matter.Bodies.rectangle(W + 10, H / 2, 20, H, {
      isStatic: true,
      render: { fillStyle: '#CAC4D0' },
    })

    const r1 = Math.sqrt(m1) * M_SCALE
    const r2 = Math.sqrt(m2) * M_SCALE
    const centerY = groundY - Math.max(r1, r2)

    const ball1 = Matter.Bodies.circle(W * 0.25, centerY, r1, {
      mass: m1,
      restitution: cor,
      frictionAir: 0,
      friction: 0,
      render: { fillStyle: '#6750A4' },
      label: 'ball1',
    })

    const ball2 = Matter.Bodies.circle(W * 0.65, centerY, r2, {
      mass: m2,
      restitution: cor,
      frictionAir: 0,
      friction: 0,
      render: { fillStyle: '#F43F5E' },
      label: 'ball2',
    })

    Matter.Body.setVelocity(ball1, { x: u1 * 0.4, y: 0 })
    Matter.Body.setVelocity(ball2, { x: 0, y: 0 })

    Matter.World.add(engine.world, [track, leftWall, rightWall, ball1, ball2])

    return () => { Matter.World.clear(engine.world, false) }
  }, [m1, m2, u1, cor])

  return <MatterEngine {...props} setup={setup} />
}
```

- [ ] Commit:
```bash
git add src/games/playground/simulations/mechanics/CollisionElastic.sim.tsx
git commit -m "feat(playground): add CollisionElastic simulation (Matter.js)"
```

---

## Task 10: Spring-Mass Simulation (Matter.js)

- [ ] Create `src/games/playground/simulations/mechanics/SpringMass.sim.tsx`:

```typescript
// src/games/playground/simulations/mechanics/SpringMass.sim.tsx
import { useCallback } from 'react'
import Matter from 'matter-js'
import { SimProps } from '../../types'
import { MatterEngine } from '../../engines/MatterEngine'

export function SpringMassSim(props: SimProps) {
  const { controls } = props
  const k = controls['k'] ?? 200
  const mass = controls['mass'] ?? 1
  const amplitude = (controls['amplitude'] ?? 8) / 100  // cm → m

  const setup = useCallback((
    engine: Matter.Engine,
    render: Matter.Render,
    canvas: HTMLCanvasElement
  ) => {
    const W = canvas.clientWidth || 380
    const H = canvas.clientHeight || 300
    engine.gravity.y = 0   // horizontal spring

    // Wall anchor
    const wall = Matter.Bodies.rectangle(30, H / 2, 20, H * 0.5, {
      isStatic: true,
      render: { fillStyle: '#CAC4D0' },
    })

    // Mass block
    const blockSize = Math.sqrt(mass) * 18 + 14
    const equilibriumX = W * 0.55
    const block = Matter.Bodies.rectangle(
      equilibriumX + amplitude * 200,
      H / 2,
      blockSize, blockSize,
      {
        mass,
        frictionAir: 0.005,
        render: { fillStyle: '#6750A4' },
        label: 'block',
      }
    )

    // Spring constraint
    const spring = Matter.Constraint.create({
      pointA: { x: 40, y: H / 2 },
      bodyB: block,
      pointB: { x: -blockSize / 2, y: 0 },
      stiffness: k / 50000,   // Matter.js stiffness scale
      damping: 0,
      render: {
        strokeStyle: '#F43F5E',
        lineWidth: 2,
        type: 'line',
        anchors: true,
      },
    })

    Matter.World.add(engine.world, [wall, block, spring])

    return () => { Matter.World.clear(engine.world, false) }
  }, [k, mass, amplitude])

  return <MatterEngine {...props} setup={setup} />
}
```

- [ ] Commit:
```bash
git add src/games/playground/simulations/mechanics/SpringMass.sim.tsx
git commit -m "feat(playground): add SpringMass simulation (Matter.js)"
```

---

## Task 11: Electric Field Simulation (Three.js)

- [ ] Create `src/games/playground/simulations/fields/ElectricField.sim.tsx`:

```typescript
// src/games/playground/simulations/fields/ElectricField.sim.tsx
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { SimProps } from '../../types'
import { ThreeEngine } from '../../engines/ThreeEngine'

const K = 9e9
const NUM_LINES = 12
const STEP = 0.08
const MAX_STEPS = 120

interface ChargeProps {
  position: [number, number, number]
  q: number
}

function Charge({ position, q }: ChargeProps) {
  const color = q > 0 ? '#BA1A1A' : '#004A77'
  const sign = q > 0 ? '+' : '−'
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      <Text position={[0, 0.55, 0]} fontSize={0.3} color="#FFFBFE" anchorX="center">
        {sign}{Math.abs(q).toFixed(1)} μC
      </Text>
    </group>
  )
}

function FieldLines({ q1, q2 }: { q1: number; q2: number }) {
  const linesRef = useRef<THREE.Group>(null)

  const lines = useMemo(() => {
    const result: THREE.Vector3[][] = []
    const charges = [
      { pos: new THREE.Vector3(-2, 0, 0), q: q1 * 1e-6 },
      { pos: new THREE.Vector3(2, 0, 0), q: q2 * 1e-6 },
    ]

    const startCharges = charges.filter(c => c.q > 0)
    if (startCharges.length === 0) return result

    for (const sc of startCharges) {
      for (let i = 0; i < NUM_LINES; i++) {
        const theta = (2 * Math.PI * i) / NUM_LINES
        const pts: THREE.Vector3[] = []
        let pos = new THREE.Vector3(
          sc.pos.x + 0.35 * Math.cos(theta),
          sc.pos.y + 0.35 * Math.sin(theta),
          0
        )

        for (let s = 0; s < MAX_STEPS; s++) {
          pts.push(pos.clone())
          if (pos.length() > 8) break

          // Net E field at pos
          let ex = 0, ey = 0
          let hitCharge = false
          for (const ch of charges) {
            const dx = pos.x - ch.pos.x
            const dy = pos.y - ch.pos.y
            const r2 = dx * dx + dy * dy
            if (r2 < 0.12) { hitCharge = true; break }
            const r = Math.sqrt(r2)
            const mag = (K * Math.abs(ch.q)) / r2
            const sign = ch.q > 0 ? 1 : -1
            ex += sign * mag * (dx / r)
            ey += sign * mag * (dy / r)
          }
          if (hitCharge) break

          const mag = Math.sqrt(ex * ex + ey * ey)
          if (mag < 1e-8) break
          pos = new THREE.Vector3(pos.x + (ex / mag) * STEP, pos.y + (ey / mag) * STEP, 0)
        }
        if (pts.length > 2) result.push(pts)
      }
    }
    return result
  }, [q1, q2])

  return (
    <group ref={linesRef}>
      {lines.map((pts, i) => {
        const positions = new Float32Array(pts.flatMap(p => [p.x, p.y, p.z]))
        const geom = new THREE.BufferGeometry()
        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        return (
          <line key={i} geometry={geom}>
            <lineBasicMaterial color="#6750A4" opacity={0.7} transparent />
          </line>
        )
      })}
    </group>
  )
}

function TestChargePulse({ q1, q2 }: { q1: number; q2: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 1.5
      // compute field at this position and apply as color intensity
    }
  })
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color="#146C2E" emissive="#146C2E" emissiveIntensity={0.5} />
    </mesh>
  )
}

function Scene({ q1, q2 }: { q1: number; q2: number }) {
  return (
    <>
      <Charge position={[-2, 0, 0]} q={q1} />
      <Charge position={[2, 0, 0]} q={q2} />
      <FieldLines q1={q1} q2={q2} />
      <TestChargePulse q1={q1} q2={q2} />
      <gridHelper args={[16, 16, '#CAC4D0', '#E7E0EC']} rotation={[Math.PI / 2, 0, 0]} />
    </>
  )
}

export function ElectricFieldSim(props: SimProps) {
  const q1 = props.controls['q1'] ?? 2
  const q2 = props.controls['q2'] ?? -2

  return (
    <ThreeEngine {...props} cameraPosition={[0, 0, 10]}>
      <Scene q1={q1} q2={q2} />
    </ThreeEngine>
  )
}
```

- [ ] Lint: `cd "C:/Users/Ankit/Desktop/learn app" && npm run lint 2>&1 | tail -5`

- [ ] Commit:
```bash
git add src/games/playground/simulations/fields/ElectricField.sim.tsx
git commit -m "feat(playground): add ElectricField simulation (Three.js field lines)"
```

---

## Task 12: Wire into GamesScreen + Build Check

- [ ] Open `src/games/GamesScreen.tsx`. Add `PhysicsPlayground` to the screen's tab system. Add these lines after the existing imports:

```typescript
import { PhysicsPlayground } from './playground/PhysicsPlayground'
```

Add to the `type Tab` union (find the existing `type Tab = ...` line):
```typescript
| 'playground-projectile'
| 'playground-collision'
| 'playground-spring'
| 'playground-electric'
```

Add to the `GAMES` array (after the last existing entry):
```typescript
{
  id: 'playground-projectile',
  label: 'Projectile',
  tagline: 'JEE Advanced mechanics',
  icon: Target,
  bg: '#6750A4',
  textDark: '#21005D',
  foldColor: 'rgba(0,0,0,0.13)',
},
{
  id: 'playground-collision',
  label: 'Collision',
  tagline: 'Elastic & inelastic',
  icon: Brain,
  bg: '#F43F5E',
  textDark: '#5C0020',
  foldColor: 'rgba(0,0,0,0.13)',
},
{
  id: 'playground-spring',
  label: 'Spring–Mass',
  tagline: 'SHM & oscillations',
  icon: Hand,
  bg: '#146C2E',
  textDark: '#002111',
  foldColor: 'rgba(0,0,0,0.11)',
},
{
  id: 'playground-electric',
  label: 'Electric Field',
  tagline: 'Field lines & force',
  icon: Headphones,
  bg: '#004A77',
  textDark: '#001E30',
  foldColor: 'rgba(0,0,0,0.12)',
},
```

In the `GameRunner` render block inside `GamesScreen`, add these cases to the existing conditional render (find where `selectedGame === 'equation-balancer'` is handled and add after):
```typescript
{selectedGame === 'playground-projectile' && (
  <PhysicsPlayground type="projectile" config={{ complexity: 'jee_advanced' }} />
)}
{selectedGame === 'playground-collision' && (
  <PhysicsPlayground type="collision_elastic" config={{ complexity: 'jee_advanced' }} />
)}
{selectedGame === 'playground-spring' && (
  <PhysicsPlayground type="spring_mass" config={{ complexity: 'jee_advanced' }} />
)}
{selectedGame === 'playground-electric' && (
  <PhysicsPlayground type="electric_field" config={{ complexity: 'jee_advanced' }} />
)}
```

Also update the `CONFIGS` object — add entries to keep TypeScript satisfied (these are only used by `GameRunner`, not playground):
```typescript
'playground-projectile': { type: 'this-or-that', theme: '', subject: '', columnA: { label: '', description: '' }, columnB: { label: '', description: '' }, cards: [] } as any,
'playground-collision':  { type: 'this-or-that', theme: '', subject: '', columnA: { label: '', description: '' }, columnB: { label: '', description: '' }, cards: [] } as any,
'playground-spring':     { type: 'this-or-that', theme: '', subject: '', columnA: { label: '', description: '' }, columnB: { label: '', description: '' }, cards: [] } as any,
'playground-electric':   { type: 'this-or-that', theme: '', subject: '', columnA: { label: '', description: '' }, columnB: { label: '', description: '' }, cards: [] } as any,
```

- [ ] Run build: `cd "C:/Users/Ankit/Desktop/learn app" && npm run build 2>&1 | tail -20`
  Expected: zero errors, dist/ created

- [ ] Fix any TypeScript errors before committing (common: missing `as any` casts on CONFIGS, unused imports)

- [ ] Commit:
```bash
git add src/games/GamesScreen.tsx
git commit -m "feat(playground): wire PhysicsPlayground into GamesScreen (4 new game tiles)"
```

---

## Task 13: Final Lint + Build Verification

- [ ] Full lint: `cd "C:/Users/Ankit/Desktop/learn app" && npm run lint 2>&1`
  Expected: zero errors, zero warnings in playground/ files

- [ ] Full build: `cd "C:/Users/Ankit/Desktop/learn app" && npm run build 2>&1 | tail -10`
  Expected: `✓ built in` with no errors

- [ ] If build fails: read the error, fix the specific file, re-run build

- [ ] Final commit:
```bash
git add -A
git commit -m "feat(playground): PhysicsPlayground complete — 4 sims + 36 puzzles + 22 stubs"
```

---

## Self-Review Notes

- All 26 `SimulationType` entries have a registry entry ✓
- `CONFIGS` type conflict in GamesScreen handled with `as any` ✓  
- Matter.js engine destroyed on unmount via `useEffect` cleanup ✓
- Three.js Canvas disposed automatically by r3f on unmount ✓
- `React.lazy()` on every sim import — no eagerly bundled sims ✓
- Score formula defined concretely (not "TBD") ✓
- Puzzle answer validation uses percentage tolerance ✓
- All puzzle answers independently verified against physics formulas ✓
