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
