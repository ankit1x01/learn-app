import { lazy } from 'react'
import { SimulationType, Engine, PuzzleConfig, ControlDef } from './types'
import { PROJECTILE_PUZZLES } from './puzzles/projectile.puzzles'
import { COLLISION_PUZZLES } from './puzzles/collision.puzzles'
import { SPRING_MASS_PUZZLES } from './puzzles/spring_mass.puzzles'
import { ELECTRIC_FIELD_PUZZLES } from './puzzles/electric_field.puzzles'
import { PENDULUM_PUZZLES } from './puzzles/pendulum.puzzles'
import { INCLINED_PLANE_PUZZLES } from './puzzles/inclined_plane.puzzles'
import { YDSE_PUZZLES } from './puzzles/ydse.puzzles'
import { ATWOOD_PUZZLES } from './puzzles/atwood.puzzles'
import { MIRROR_PUZZLES } from './puzzles/mirror.puzzles'
import { LENS_PUZZLES } from './puzzles/lens.puzzles'
import { BOHR_PUZZLES } from './puzzles/bohr_atom.puzzles'

export interface SimulationPlugin {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.LazyExoticComponent<React.ComponentType<any>>
  engine: Engine
  conceptId: string
  puzzles: PuzzleConfig[]
  defaultControls: ControlDef[]
  label: string
  icon: string
}

const Stub = lazy(() => import('./simulations/Stub.sim').then(m => ({ default: m.StubSim })))
const Projectile = lazy(() => import('./simulations/mechanics/Projectile.sim').then(m => ({ default: m.ProjectileSim })))
const CollisionElastic = lazy(() => import('./simulations/mechanics/CollisionElastic.sim').then(m => ({ default: m.CollisionElasticSim })))
const SpringMass = lazy(() => import('./simulations/mechanics/SpringMass.sim').then(m => ({ default: m.SpringMassSim })))
const ElectricField = lazy(() => import('./simulations/fields/ElectricField.sim').then(m => ({ default: m.ElectricFieldSim })))
const Pendulum = lazy(() => import('./simulations/mechanics/Pendulum.sim').then(m => ({ default: m.PendulumSim })))
const InclinedPlane = lazy(() => import('./simulations/mechanics/InclinedPlane.sim').then(m => ({ default: m.InclinedPlaneSim })))
const AtwoodMachine = lazy(() => import('./simulations/mechanics/AtwoodMachine.sim').then(m => ({ default: m.AtwoodMachineSim })))
const YDSE = lazy(() => import('./simulations/optics/YDSE.sim').then(m => ({ default: m.YDSESim })))
const MirrorRay = lazy(() => import('./simulations/optics/MirrorRay.sim').then(m => ({ default: m.MirrorRaySim })))
const LensRay = lazy(() => import('./simulations/optics/LensRay.sim').then(m => ({ default: m.LensRaySim })))
const BohrAtom = lazy(() => import('./simulations/modern/BohrAtom.sim').then(m => ({ default: m.BohrAtomSim })))

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
    component: CollisionElastic,
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
      { id: 'q3', label: 'Charge 3', min: -5, max: 5, step: 0.5, unit: 'μC', default: 0  },
      { id: 'q4', label: 'Charge 4', min: -5, max: 5, step: 0.5, unit: 'μC', default: 0  },
    ],
  },
  pendulum: {
    component: Pendulum,
    engine: 'matter',
    conceptId: 'oscillations_simple_pendulum',
    puzzles: PENDULUM_PUZZLES,
    label: 'Simple Pendulum',
    icon: 'pace',
    defaultControls: [
      { id: 'length', label: 'Length',       min: 0.5, max: 2.5, step: 0.1, unit: 'm', default: 1.2 },
      { id: 'angle',  label: 'Release Angle',min: 5,   max: 60,  step: 5,   unit: '°', default: 25  },
    ],
  },
  atwood_machine: {
    component: AtwoodMachine,
    engine: 'matter',
    conceptId: 'laws_of_motion_atwood',
    puzzles: ATWOOD_PUZZLES,
    label: 'Atwood Machine',
    icon: 'balance',
    defaultControls: [
      { id: 'm1', label: 'Mass 1', min: 1, max: 10, step: 0.5, unit: 'kg', default: 3 },
      { id: 'm2', label: 'Mass 2', min: 1, max: 10, step: 0.5, unit: 'kg', default: 5 },
    ],
  },
  rolling:        { component: Stub, engine: 'stub', conceptId: 'rotation_rolling_motion', puzzles: NO_PUZZLES, label: 'Rolling Motion',  icon: 'radio_button_unchecked', defaultControls: NO_CONTROLS },
  inclined_plane: {
    component: InclinedPlane,
    engine: 'matter',
    conceptId: 'laws_of_motion_inclined_plane',
    puzzles: INCLINED_PLANE_PUZZLES,
    label: 'Inclined Plane',
    icon: 'change_history',
    defaultControls: [
      { id: 'angle', label: 'Angle',     min: 10, max: 70, step: 5,   unit: '°',  default: 30  },
      { id: 'mu',   label: 'Friction μ', min: 0,  max: 1,  step: 0.05,unit: '',   default: 0.3 },
      { id: 'mass', label: 'Mass',       min: 1,  max: 10, step: 0.5, unit: 'kg', default: 2   },
    ],
  },
  circular_motion: { component: Stub, engine: 'stub', conceptId: 'kinematics_circular_motion', puzzles: NO_PUZZLES, label: 'Circular Motion', icon: 'sync', defaultControls: NO_CONTROLS },
  orbit:             { component: Stub, engine: 'stub', conceptId: 'gravitation_orbital_motion',         puzzles: NO_PUZZLES, label: 'Orbital Motion',       icon: 'public',                 defaultControls: NO_CONTROLS },
  capacitor:         { component: Stub, engine: 'stub', conceptId: 'electrostatics_capacitor',           puzzles: NO_PUZZLES, label: 'Capacitor',            icon: 'developer_board',        defaultControls: NO_CONTROLS },
  gauss_sphere:      { component: Stub, engine: 'stub', conceptId: 'electrostatics_gauss_law',           puzzles: NO_PUZZLES, label: "Gauss's Law",          icon: 'target',                 defaultControls: NO_CONTROLS },
  magnetic_force:    { component: Stub, engine: 'stub', conceptId: 'magnetism_lorentz_force',            puzzles: NO_PUZZLES, label: 'Magnetic Force',       icon: 'north',                  defaultControls: NO_CONTROLS },
  biot_savart:       { component: Stub, engine: 'stub', conceptId: 'magnetism_biot_savart',              puzzles: NO_PUZZLES, label: 'Biot–Savart',          icon: 'waves',                  defaultControls: NO_CONTROLS },
  solenoid:          { component: Stub, engine: 'stub', conceptId: 'magnetism_solenoid',                 puzzles: NO_PUZZLES, label: 'Solenoid',             icon: 'view_column',            defaultControls: NO_CONTROLS },
  lcr_circuit:       { component: Stub, engine: 'stub', conceptId: 'alternating_current_lcr_resonance',  puzzles: NO_PUZZLES, label: 'LCR Circuit',          icon: 'electric_meter',         defaultControls: NO_CONTROLS },
  em_wave:           { component: Stub, engine: 'stub', conceptId: 'em_waves_propagation',               puzzles: NO_PUZZLES, label: 'EM Wave',              icon: 'air',                    defaultControls: NO_CONTROLS },
  bohr_atom: {
    component: BohrAtom,
    engine: 'canvas',
    conceptId: 'atoms_bohr_model',
    puzzles: BOHR_PUZZLES,
    label: 'Bohr Atom',
    icon: 'hub',
    defaultControls: [
      { id: 'n', label: 'Orbit n', min: 1, max: 5, step: 1, unit: '', default: 1 },
    ],
  },
  photoelectric:     { component: Stub, engine: 'stub', conceptId: 'dual_nature_photoelectric',          puzzles: NO_PUZZLES, label: 'Photoelectric Effect', icon: 'light_mode',             defaultControls: NO_CONTROLS },
  mirror_ray: {
    component: MirrorRay,
    engine: 'canvas',
    conceptId: 'optics_mirror_formula',
    puzzles: MIRROR_PUZZLES,
    label: 'Mirror Ray Diagram',
    icon: 'brightness_low',
    defaultControls: [
      { id: 'f',    label: 'Focal length |f|', min: 5,  max: 40, step: 5,  unit: 'cm', default: 15 },
      { id: 'u',    label: 'Object dist. |u|', min: 5,  max: 60, step: 5,  unit: 'cm', default: 30 },
      { id: 'type', label: 'Type (0=concave, 1=convex)', min: 0, max: 1, step: 1, unit: '', default: 0 },
    ],
  },
  lens_ray: {
    component: LensRay,
    engine: 'canvas',
    conceptId: 'optics_lens_formula',
    puzzles: LENS_PUZZLES,
    label: 'Lens Ray Diagram',
    icon: 'lens_blur',
    defaultControls: [
      { id: 'f',    label: 'Focal length |f|', min: 5,  max: 60, step: 5,  unit: 'cm', default: 20 },
      { id: 'u',    label: 'Object dist. |u|', min: 10, max: 80, step: 5,  unit: 'cm', default: 40 },
      { id: 'type', label: 'Type (0=convex, 1=concave)', min: 0, max: 1, step: 1, unit: '', default: 0 },
    ],
  },
  prism:             { component: Stub, engine: 'stub', conceptId: 'optics_prism_dispersion',            puzzles: NO_PUZZLES, label: 'Prism Dispersion',     icon: 'flare',                  defaultControls: NO_CONTROLS },
  ydse: {
    component: YDSE,
    engine: 'canvas',
    conceptId: 'wave_optics_ydse',
    puzzles: YDSE_PUZZLES,
    label: `Young\u2019s Double Slit`,
    icon: 'more_vert',
    defaultControls: [
      { id: 'd',   label: 'Slit sep. d',  min: 0.3, max: 3,   step: 0.1,  unit: 'mm', default: 1.0 },
      { id: 'lam', label: 'Wavelength λ', min: 380, max: 700, step: 10,   unit: 'nm', default: 600 },
      { id: 'D',   label: 'Screen dist.', min: 0.5, max: 3,   step: 0.25, unit: 'm',  default: 1.5 },
    ],
  },
  single_slit: { component: Stub, engine: 'stub', conceptId: 'wave_optics_single_slit', puzzles: NO_PUZZLES, label: 'Single Slit', icon: 'more_vert', defaultControls: NO_CONTROLS },
  standing_wave:     { component: Stub, engine: 'stub', conceptId: 'waves_standing_wave',                puzzles: NO_PUZZLES, label: 'Standing Wave',        icon: 'graphic_eq',             defaultControls: NO_CONTROLS },
}
