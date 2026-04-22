// src/games/playground/types.ts

export type SimulationType =
  // Mechanics — basics
  | 'projectile' | 'collision_elastic' | 'collision_inelastic'
  | 'spring_mass' | 'pendulum' | 'atwood_machine'
  | 'rolling' | 'inclined_plane' | 'circular_motion' | 'orbit'
  // Mechanics — JEE Advanced level
  | 'work_energy_power' | 'friction_advanced' | 'center_of_mass'
  | 'rigid_body_rotation' | 'constraint_motion'
  | 'relative_motion' | 'pseudo_force'
  // Properties of Matter
  | 'stress_strain'
  // Fluid Mechanics
  | 'fluid_pressure' | 'bernoulli' | 'surface_tension' | 'viscosity'
  // Thermodynamics
  | 'pv_diagram' | 'carnot_cycle' | 'kinetic_theory' | 'calorimetry' | 'heat_transfer'
  // Electrostatics + Circuits
  | 'electric_field' | 'capacitor' | 'gauss_sphere'
  | 'current_electricity' | 'wheatstone_bridge' | 'rc_circuit'
  // Magnetism
  | 'magnetic_force' | 'biot_savart' | 'solenoid'
  | 'charged_particle_magnetic' | 'force_current_wire' | 'magnetic_dipole'
  // Electromagnetic Induction
  | 'faraday_induction' | 'self_inductance' | 'mutual_inductance'
  // AC + EM Waves
  | 'lcr_circuit' | 'em_wave'
  // Waves & Sound
  | 'standing_wave' | 'superposition' | 'beats' | 'doppler'
  // Optics
  | 'mirror_ray' | 'lens_ray' | 'prism' | 'polarization'
  | 'ydse' | 'single_slit'
  // Modern Physics
  | 'bohr_atom' | 'photoelectric' | 'nuclear_decay' | 'xray'
  | 'de_broglie' | 'radioactive_decay_graph'
  // Mixed Concept (JEE Advanced combos)
  | 'block_pulley_friction' | 'charged_em_field' | 'spring_collision_energy'

export type Complexity = 'board' | 'jee_main' | 'jee_advanced'

export type Engine = 'matter' | 'three' | 'canvas' | 'stub'

export interface PuzzleConfig {
  id: string
  complexity: Complexity
  question: string
  given: Record<string, number>
  find: string[]
  answer: Record<string, number>
  tolerance: number
  hints: string[]
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
