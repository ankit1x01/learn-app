import { lazy } from 'react'
import { ATWOOD_PUZZLES } from './puzzles/atwood.puzzles'
import { BOHR_PUZZLES } from './puzzles/bohr_atom.puzzles'
import { COLLISION_PUZZLES } from './puzzles/collision.puzzles'
import { ELECTRIC_FIELD_PUZZLES } from './puzzles/electric_field.puzzles'
import {
  BERNOULLI_PUZZLES,
  FLUID_PRESSURE_PUZZLES,
  SURFACE_TENSION_PUZZLES,
  VISCOSITY_PUZZLES,
} from './puzzles/fluids.puzzles'
import {
  CENTER_OF_MASS_PUZZLES,
  FRICTION_ADVANCED_PUZZLES,
  RIGID_BODY_PUZZLES,
} from './puzzles/friction_com_rbd.puzzles'
import { GENERIC_PUZZLES } from './puzzles/generic.puzzles'
import { INCLINED_PLANE_PUZZLES } from './puzzles/inclined_plane.puzzles'
import { LENS_PUZZLES } from './puzzles/lens.puzzles'
import { MIRROR_PUZZLES } from './puzzles/mirror.puzzles'
import { PENDULUM_PUZZLES } from './puzzles/pendulum.puzzles'
import { PROJECTILE_PUZZLES } from './puzzles/projectile.puzzles'
import { ROLLING_PUZZLES } from './puzzles/rolling.puzzles'
import { SPRING_MASS_PUZZLES } from './puzzles/spring_mass.puzzles'
import { WORK_ENERGY_PUZZLES } from './puzzles/work_energy.puzzles'
import { YDSE_PUZZLES } from './puzzles/ydse.puzzles'
import { ControlDef, Engine, PuzzleConfig, SimulationType } from './types'

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

// Previous sims
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
const Rolling = lazy(() => import('./simulations/mechanics/Rolling.sim').then(m => ({ default: m.RollingSim })))
const WorkEnergy = lazy(() => import('./simulations/mechanics/WorkEnergy.sim').then(m => ({ default: m.WorkEnergySim })))
const FrictionAdvanced = lazy(() => import('./simulations/mechanics/FrictionAdvanced.sim').then(m => ({ default: m.FrictionAdvancedSim })))
const CenterOfMass = lazy(() => import('./simulations/mechanics/CenterOfMass.sim').then(m => ({ default: m.CenterOfMassSim })))
const RigidBodyRotation = lazy(() => import('./simulations/mechanics/RigidBodyRotation.sim').then(m => ({ default: m.RigidBodyRotationSim })))
const ConstraintMotion = lazy(() => import('./simulations/mechanics/ConstraintMotion.sim').then(m => ({ default: m.ConstraintMotionSim })))
const RelativeMotion = lazy(() => import('./simulations/mechanics/RelativeMotion.sim').then(m => ({ default: m.RelativeMotionSim })))
const PseudoForce = lazy(() => import('./simulations/mechanics/PseudoForce.sim').then(m => ({ default: m.PseudoForceSim })))
const StressStrain = lazy(() => import('./simulations/mechanics/StressStrain.sim').then(m => ({ default: m.StressStrainSim })))
const FluidPressure = lazy(() => import('./simulations/mechanics/FluidPressure.sim').then(m => ({ default: m.FluidPressureSim })))
const Bernoulli = lazy(() => import('./simulations/mechanics/Bernoulli.sim').then(m => ({ default: m.BernoulliSim })))
const SurfaceTension = lazy(() => import('./simulations/mechanics/SurfaceTension.sim').then(m => ({ default: m.SurfaceTensionSim })))
const Viscosity = lazy(() => import('./simulations/mechanics/Viscosity.sim').then(m => ({ default: m.ViscositySim })))

// Mechanics (newly added)
const PVDiagram = lazy(() => import('./simulations/mechanics/PVDiagram.sim').then(m => ({ default: m.PVDiagramSim })))
const CarnotCycle = lazy(() => import('./simulations/mechanics/CarnotCycle.sim').then(m => ({ default: m.CarnotCycleSim })))
const KineticTheory = lazy(() => import('./simulations/mechanics/KineticTheory.sim').then(m => ({ default: m.KineticTheorySim })))
const Calorimetry = lazy(() => import('./simulations/mechanics/Calorimetry.sim').then(m => ({ default: m.CalorimetrySim })))
const HeatTransfer = lazy(() => import('./simulations/mechanics/HeatTransfer.sim').then(m => ({ default: m.HeatTransferSim })))
const CircularMotion = lazy(() => import('./simulations/mechanics/CircularMotion.sim').then(m => ({ default: m.CircularMotionSim })))
const OrbitalMotion = lazy(() => import('./simulations/mechanics/OrbitalMotion.sim').then(m => ({ default: m.OrbitalMotionSim })))

// Fields
const Capacitor = lazy(() => import('./simulations/fields/Capacitor.sim').then(m => ({ default: m.CapacitorSim })))
const GaussSphere = lazy(() => import('./simulations/fields/GaussSphere.sim').then(m => ({ default: m.GaussSphereSim })))
const RCCircuit = lazy(() => import('./simulations/fields/RCCircuit.sim').then(m => ({ default: m.RCCircuitSim })))
const ChargedParticleMagnetic = lazy(() => import('./simulations/fields/ChargedParticleMagnetic.sim').then(m => ({ default: m.ChargedParticleMagneticSim })))
const LCRCircuit = lazy(() => import('./simulations/fields/LCRCircuit.sim').then(m => ({ default: m.LCRCircuitSim })))
const FaradayInduction = lazy(() => import('./simulations/fields/FaradayInduction.sim').then(m => ({ default: m.FaradayInductionSim })))

// Optics
const StandingWave = lazy(() => import('./simulations/optics/StandingWave.sim').then(m => ({ default: m.StandingWaveSim })))
const Doppler = lazy(() => import('./simulations/optics/Doppler.sim').then(m => ({ default: m.DopplerSim })))
const SingleSlit = lazy(() => import('./simulations/optics/SingleSlit.sim').then(m => ({ default: m.SingleSlitSim })))
const Polarization = lazy(() => import('./simulations/optics/Polarization.sim').then(m => ({ default: m.PolarizationSim })))
const WaveSuperposition = lazy(() => import('./simulations/optics/WaveSuperposition.sim').then(m => ({ default: m.WaveSuperpositionSim })))
const Beats = lazy(() => import('./simulations/optics/Beats.sim').then(m => ({ default: m.BeatsSim })))

// Modern
const Photoelectric = lazy(() => import('./simulations/modern/Photoelectric.sim').then(m => ({ default: m.PhotoelectricSim })))
const RadioactiveDecayGraph = lazy(() => import('./simulations/modern/RadioactiveDecayGraph.sim').then(m => ({ default: m.RadioactiveDecayGraphSim })))

// Misc simple/stub-like implementations
const WheatstoneBridge = lazy(() => import('./simulations/fields/WheatstoneBridge.sim').then(m => ({ default: m.WheatstoneBridgeSim })))
const CurrentElectricity = lazy(() => import('./simulations/fields/CurrentElectricity.sim').then(m => ({ default: m.CurrentElectricitySim })))
const MagneticForce = lazy(() => import('./simulations/MiscSims').then(m => ({ default: m.MagneticForceSim })))
const Prism = lazy(() => import('./simulations/optics/Prism.sim').then(m => ({ default: m.PrismSim })))
const SelfInductance = lazy(() => import('./simulations/fields/SelfInductance.sim').then(m => ({ default: m.SelfInductanceSim })))
const MutualInductance = lazy(() => import('./simulations/fields/MutualInductance.sim').then(m => ({ default: m.MutualInductanceSim })))
const BiotSavart = lazy(() => import('./simulations/fields/BiotSavart.sim').then(m => ({ default: m.BiotSavartSim })))
const Solenoid = lazy(() => import('./simulations/fields/Solenoid.sim').then(m => ({ default: m.SolenoidSim })))
const ForceCurrentWire = lazy(() => import('./simulations/fields/ForceCurrentWire.sim').then(m => ({ default: m.ForceCurrentWireSim })))
const MagneticDipole = lazy(() => import('./simulations/fields/MagneticDipole.sim').then(m => ({ default: m.MagneticDipoleSim })))
const EMWave = lazy(() => import('./simulations/fields/EMWave.sim').then(m => ({ default: m.EMWaveSim })))
const NuclearDecay = lazy(() => import('./simulations/modern/NuclearDecay.sim').then(m => ({ default: m.NuclearDecaySim })))
const XRay = lazy(() => import('./simulations/modern/XRay.sim').then(m => ({ default: m.XRaySim })))
const DeBroglie = lazy(() => import('./simulations/modern/DeBroglie.sim').then(m => ({ default: m.DeBroglieSim })))
const BlockPulleyFriction = lazy(() => import('./simulations/mechanics/BlockPulleyFriction.sim').then(m => ({ default: m.BlockPulleyFrictionSim })))
const ChargedEMField = lazy(() => import('./simulations/fields/ChargedEMField.sim').then(m => ({ default: m.ChargedEMFieldSim })))
const SpringCollisionEnergy = lazy(() => import('./simulations/mechanics/SpringCollisionEnergy.sim').then(m => ({ default: m.SpringCollisionEnergySim })))

const GENERIC_CONTROLS: ControlDef[] = [
  { id: 'dummy', label: 'Tuning Value', min: 0, max: 10, step: 1, unit: '', default: 5 }
]

export const SIMULATION_REGISTRY: Record<SimulationType, SimulationPlugin> = {
  projectile: {
    component: Projectile, engine: 'matter', conceptId: 'kinematics_projectile_motion',
    puzzles: PROJECTILE_PUZZLES, label: 'Projectile Motion', icon: 'sports_baseball',
    defaultControls: [
      { id: 'angle', label: 'Launch Angle', min: 10, max: 80, step: 1, unit: '°', default: 45 },
      { id: 'speed', label: 'Speed', min: 5, max: 50, step: 1, unit: 'm/s', default: 20 },
      { id: 'height', label: 'Height', min: 0, max: 40, step: 1, unit: 'm', default: 0 },
    ],
  },
  collision_elastic: {
    component: CollisionElastic, engine: 'matter', conceptId: 'laws_of_motion_collision_elastic',
    puzzles: COLLISION_PUZZLES, label: 'Elastic Collision', icon: 'circles_ext',
    defaultControls: [
      { id: 'm1', label: 'Mass 1', min: 1, max: 10, step: 0.5, unit: 'kg', default: 2 },
      { id: 'm2', label: 'Mass 2', min: 1, max: 10, step: 0.5, unit: 'kg', default: 2 },
      { id: 'u1', label: 'Velocity 1', min: 1, max: 20, step: 1, unit: 'm/s', default: 6 },
    ],
  },
  collision_inelastic: {
    component: CollisionElastic, engine: 'matter', conceptId: 'laws_of_motion_collision_inelastic',
    puzzles: COLLISION_PUZZLES, label: 'Inelastic Collision', icon: 'merge',
    defaultControls: [
      { id: 'm1', label: 'Mass 1', min: 1, max: 10, step: 0.5, unit: 'kg', default: 3 },
      { id: 'm2', label: 'Mass 2', min: 1, max: 10, step: 0.5, unit: 'kg', default: 2 },
      { id: 'u1', label: 'Velocity 1', min: 1, max: 20, step: 1, unit: 'm/s', default: 8 },
      { id: 'cor', label: 'Restitution', min: 0, max: 1, step: 0.1, unit: '', default: 0.5 },
    ],
  },
  spring_mass: {
    component: SpringMass, engine: 'matter', conceptId: 'oscillations_spring_mass_shm',
    puzzles: SPRING_MASS_PUZZLES, label: 'Spring–Mass SHM', icon: 'compress',
    defaultControls: [
      { id: 'k', label: 'Spring k', min: 50, max: 800, step: 10, unit: 'N/m', default: 200 },
      { id: 'mass', label: 'Mass', min: 0.5, max: 5, step: 0.5, unit: 'kg', default: 1 },
      { id: 'amplitude', label: 'Amplitude', min: 1, max: 15, step: 1, unit: 'cm', default: 8 },
    ],
  },
  electric_field: {
    component: ElectricField, engine: 'three', conceptId: 'electrostatics_electric_field_lines',
    puzzles: ELECTRIC_FIELD_PUZZLES, label: 'Electric Field', icon: 'electric_bolt',
    defaultControls: [
      { id: 'q1', label: 'Charge 1', min: -5, max: 5, step: 0.5, unit: 'μC', default: 2 },
      { id: 'q2', label: 'Charge 2', min: -5, max: 5, step: 0.5, unit: 'μC', default: -2 },
      { id: 'q3', label: 'Charge 3', min: -5, max: 5, step: 0.5, unit: 'μC', default: 0 },
      { id: 'q4', label: 'Charge 4', min: -5, max: 5, step: 0.5, unit: 'μC', default: 0 },
    ],
  },
  pendulum: {
    component: Pendulum, engine: 'matter', conceptId: 'oscillations_simple_pendulum',
    puzzles: PENDULUM_PUZZLES, label: 'Simple Pendulum', icon: 'pace',
    defaultControls: [
      { id: 'length', label: 'Length', min: 0.5, max: 2.5, step: 0.1, unit: 'm', default: 1.2 },
      { id: 'angle', label: 'Release Angle', min: 5, max: 60, step: 5, unit: '°', default: 25 },
    ],
  },
  atwood_machine: {
    component: AtwoodMachine, engine: 'matter', conceptId: 'laws_of_motion_atwood',
    puzzles: ATWOOD_PUZZLES, label: 'Atwood Machine', icon: 'balance',
    defaultControls: [
      { id: 'm1', label: 'Mass 1', min: 1, max: 10, step: 0.5, unit: 'kg', default: 3 },
      { id: 'm2', label: 'Mass 2', min: 1, max: 10, step: 0.5, unit: 'kg', default: 5 },
    ],
  },
  rolling: {
    component: Rolling, engine: 'matter', conceptId: 'rotation_rolling_motion',
    puzzles: ROLLING_PUZZLES, label: 'Rolling Motion', icon: 'radio_button_unchecked',
    defaultControls: [
      { id: 'angle', label: 'Incline Angle', min: 10, max: 60, step: 5, unit: '°', default: 30 },
      { id: 'radius', label: 'Radius', min: 0.05, max: 0.3, step: 0.05, unit: 'm', default: 0.15 },
      { id: 'mass', label: 'Mass', min: 1, max: 10, step: 0.5, unit: 'kg', default: 2 },
    ],
  },
  work_energy_power: {
    component: WorkEnergy, engine: 'canvas', conceptId: 'mechanics_work_energy_power',
    puzzles: WORK_ENERGY_PUZZLES, label: 'Work–Energy–Power', icon: 'bolt',
    defaultControls: [
      { id: 'mass', label: 'Mass', min: 1, max: 10, step: 0.5, unit: 'kg', default: 2 },
      { id: 'height', label: 'Drop Height', min: 1, max: 20, step: 1, unit: 'm', default: 5 },
      { id: 'force', label: 'Applied Force', min: 0, max: 30, step: 1, unit: 'N', default: 10 },
    ],
  },
  friction_advanced: {
    component: FrictionAdvanced, engine: 'matter', conceptId: 'mechanics_friction_advanced',
    puzzles: FRICTION_ADVANCED_PUZZLES, label: 'Friction (Advanced)', icon: 'texture',
    defaultControls: [
      { id: 'mass', label: 'Mass', min: 1, max: 10, step: 0.5, unit: 'kg', default: 4 },
      { id: 'mu_s', label: 'μ_static', min: 0.1, max: 1.0, step: 0.05, unit: '', default: 0.5 },
      { id: 'mu_k', label: 'μ_kinetic', min: 0.05, max: 0.9, step: 0.05, unit: '', default: 0.3 },
      { id: 'force', label: 'Applied Force', min: 0, max: 80, step: 2, unit: 'N', default: 12 },
    ],
  },
  center_of_mass: {
    component: CenterOfMass, engine: 'canvas', conceptId: 'mechanics_center_of_mass',
    puzzles: CENTER_OF_MASS_PUZZLES, label: 'Center of Mass', icon: 'adjust',
    defaultControls: [
      { id: 'm1', label: 'Mass 1', min: 1, max: 10, step: 0.5, unit: 'kg', default: 3 },
      { id: 'm2', label: 'Mass 2', min: 1, max: 10, step: 0.5, unit: 'kg', default: 5 },
      { id: 'm3', label: 'Mass 3', min: 1, max: 10, step: 0.5, unit: 'kg', default: 2 },
      { id: 'm4', label: 'Mass 4', min: 1, max: 10, step: 0.5, unit: 'kg', default: 4 },
    ],
  },
  rigid_body_rotation: {
    component: RigidBodyRotation, engine: 'canvas', conceptId: 'mechanics_rigid_body_rotation',
    puzzles: RIGID_BODY_PUZZLES, label: 'Rigid Body Rotation', icon: 'rotate_right',
    defaultControls: [
      { id: 'torque', label: 'Torque τ', min: 1, max: 100, step: 1, unit: 'N·m', default: 20 },
      { id: 'I', label: 'Moment of Inertia', min: 0.5, max: 20, step: 0.5, unit: 'kg·m²', default: 5 },
      { id: 'mu_k', label: 'Damping', min: 0, max: 0.5, step: 0.01, unit: '', default: 0.05 },
    ],
  },
  constraint_motion: {
    component: ConstraintMotion, engine: 'matter', conceptId: 'mechanics_constraint_motion',
    puzzles: GENERIC_PUZZLES, label: 'Constraint Motion', icon: 'link',
    defaultControls: [
      { id: 'm1', label: 'Mass A (table)', min: 1, max: 10, step: 0.5, unit: 'kg', default: 4 },
      { id: 'm2', label: 'Mass B (hang)', min: 1, max: 10, step: 0.5, unit: 'kg', default: 2 },
    ],
  },
  relative_motion: {
    component: RelativeMotion, engine: 'canvas', conceptId: 'mechanics_relative_motion',
    puzzles: GENERIC_PUZZLES, label: 'Relative Motion', icon: 'compare_arrows',
    defaultControls: [
      { id: 'vA', label: 'Velocity A', min: 0, max: 40, step: 1, unit: 'm/s', default: 15 },
      { id: 'vB', label: 'Velocity B', min: 0, max: 40, step: 1, unit: 'm/s', default: 8 },
    ],
  },
  pseudo_force: {
    component: PseudoForce, engine: 'canvas', conceptId: 'mechanics_pseudo_force',
    puzzles: GENERIC_PUZZLES, label: 'Pseudo Force', icon: 'swap_horiz',
    defaultControls: [
      { id: 'mass', label: 'Mass', min: 1, max: 20, step: 0.5, unit: 'kg', default: 5 },
      { id: 'a_lift', label: 'Elevator Accel.', min: 0, max: 15, step: 0.5, unit: 'm/s²', default: 3 },
    ],
  },
  stress_strain: {
    component: StressStrain, engine: 'canvas', conceptId: 'properties_stress_strain',
    puzzles: GENERIC_PUZZLES, label: 'Stress–Strain', icon: 'expand',
    defaultControls: [
      { id: 'E', label: "Young's Modulus", min: 50000, max: 400000, step: 10000, unit: 'MPa', default: 200000 },
      { id: 'sigma_y', label: 'Yield Stress', min: 100, max: 600, step: 10, unit: 'MPa', default: 250 },
      { id: 'sigma_uts', label: 'UTS', min: 200, max: 800, step: 10, unit: 'MPa', default: 400 },
      { id: 'eps_f', label: 'Fracture Strain', min: 0.05, max: 0.5, step: 0.01, unit: '', default: 0.30 },
    ],
  },
  fluid_pressure: {
    component: FluidPressure, engine: 'canvas', conceptId: 'fluids_pressure_buoyancy',
    puzzles: FLUID_PRESSURE_PUZZLES, label: 'Fluid Pressure & Buoyancy', icon: 'water',
    defaultControls: [
      { id: 'rho_fluid', label: 'Fluid Density', min: 500, max: 2000, step: 50, unit: 'kg/m³', default: 1000 },
      { id: 'rho_obj', label: 'Object Density', min: 200, max: 2000, step: 50, unit: 'kg/m³', default: 800 },
      { id: 'depth', label: 'Fluid Depth', min: 0.5, max: 4, step: 0.1, unit: 'm', default: 1.5 },
    ],
  },
  bernoulli: {
    component: Bernoulli, engine: 'canvas', conceptId: 'fluids_bernoulli',
    puzzles: BERNOULLI_PUZZLES, label: "Bernoulli's Theorem", icon: 'stream',
    defaultControls: [
      { id: 'v1', label: 'Inlet Velocity', min: 0.5, max: 10, step: 0.5, unit: 'm/s', default: 2 },
      { id: 'A1', label: 'Inlet Area', min: 0.01, max: 0.1, step: 0.005, unit: 'm²', default: 0.04 },
      { id: 'rho', label: 'Fluid Density', min: 800, max: 1200, step: 50, unit: 'kg/m³', default: 1000 },
      { id: 'P1', label: 'Inlet Pressure', min: 50, max: 400, step: 10, unit: 'kPa', default: 150 },
    ],
  },
  surface_tension: {
    component: SurfaceTension, engine: 'canvas', conceptId: 'fluids_surface_tension',
    puzzles: SURFACE_TENSION_PUZZLES, label: 'Surface Tension', icon: 'water_drop',
    defaultControls: [
      { id: 'T', label: 'Surface Tension T', min: 0.01, max: 0.15, step: 0.005, unit: 'N/m', default: 0.072 },
      { id: 'R', label: 'Radius R', min: 0.005, max: 0.05, step: 0.005, unit: 'm', default: 0.02 },
    ],
  },
  viscosity: {
    component: Viscosity, engine: 'canvas', conceptId: 'fluids_viscosity_stokes',
    puzzles: VISCOSITY_PUZZLES, label: 'Viscosity & Stokes Law', icon: 'opacity',
    defaultControls: [
      { id: 'eta', label: 'Viscosity η', min: 0.001, max: 2, step: 0.05, unit: 'Pa·s', default: 1.0 },
      { id: 'r', label: 'Sphere Radius', min: 0.001, max: 0.015, step: 0.001, unit: 'm', default: 0.005 },
      { id: 'rho_s', label: 'Sphere Density', min: 1000, max: 10000, step: 100, unit: 'kg/m³', default: 7800 },
      { id: 'rho_f', label: 'Fluid Density', min: 800, max: 1500, step: 50, unit: 'kg/m³', default: 1000 },
    ],
  },
  pv_diagram: { component: PVDiagram, engine: 'canvas', conceptId: 'thermodynamics_pv_diagram', puzzles: GENERIC_PUZZLES, label: 'PV Diagram', icon: 'area_chart', defaultControls: [{ id: 'mode', label: 'Process Type', min: 0, max: 3, step: 1, unit: '', default: 0 }, { id: 'T', label: 'Temperature', min: 300, max: 1000, step: 50, unit: 'K', default: 300 }] },
  carnot_cycle: { component: CarnotCycle, engine: 'canvas', conceptId: 'thermodynamics_carnot_cycle', puzzles: GENERIC_PUZZLES, label: 'Carnot Cycle', icon: 'autorenew', defaultControls: [{ id: 'Th', label: 'T_hot', min: 400, max: 1000, step: 50, unit: 'K', default: 800 }, { id: 'Tc', label: 'T_cold', min: 200, max: 400, step: 20, unit: 'K', default: 300 }] },
  kinetic_theory: { component: KineticTheory, engine: 'canvas', conceptId: 'thermodynamics_kinetic_theory', puzzles: GENERIC_PUZZLES, label: 'Kinetic Theory of Gases', icon: 'bubble_chart', defaultControls: [{ id: 'N', label: 'Molecules', min: 10, max: 200, step: 10, unit: 'molecules', default: 30 }, { id: 'T', label: 'Temperature', min: 100, max: 1000, step: 50, unit: 'K', default: 300 }, { id: 'M', label: 'Molar Mass', min: 0.002, max: 0.1, step: 0.002, unit: 'kg/mol', default: 0.029 }] },
  calorimetry: { component: Calorimetry, engine: 'canvas', conceptId: 'thermodynamics_calorimetry', puzzles: GENERIC_PUZZLES, label: 'Calorimetry', icon: 'device_thermostat', defaultControls: [{ id: 'm1', label: 'Mass 1', min: 0.1, max: 5, step: 0.1, unit: 'kg', default: 0.5 }, { id: 'T1', label: 'Temp 1 (Hot)', min: 50, max: 200, step: 5, unit: '°C', default: 80 }, { id: 'c1', label: 'Heat Cap 1', min: 100, max: 5000, step: 100, unit: 'J/kgK', default: 4200 }, { id: 'm2', label: 'Mass 2', min: 0.1, max: 5, step: 0.1, unit: 'kg', default: 1.0 }, { id: 'T2', label: 'Temp 2 (Cold)', min: 0, max: 50, step: 5, unit: '°C', default: 20 }, { id: 'c2', label: 'Heat Cap 2', min: 100, max: 5000, step: 100, unit: 'J/kgK', default: 900 }] },
  heat_transfer: { component: HeatTransfer, engine: 'canvas', conceptId: 'thermodynamics_heat_transfer', puzzles: GENERIC_PUZZLES, label: 'Heat Transfer', icon: 'local_fire_department', defaultControls: [{ id: 'T_hot', label: 'Hot Temp', min: 50, max: 500, step: 10, unit: '°C', default: 200 }, { id: 'T_cold', label: 'Cold Temp', min: -50, max: 50, step: 5, unit: '°C', default: 25 }, { id: 'k', label: 'Conductivity k', min: 1, max: 400, step: 10, unit: 'W/mK', default: 50 }, { id: 'A', label: 'Area A', min: 0.01, max: 1, step: 0.01, unit: 'm²', default: 0.01 }, { id: 'L', label: 'Length L', min: 0.01, max: 1, step: 0.01, unit: 'm', default: 0.1 }] },
  inclined_plane: { component: InclinedPlane, engine: 'matter', conceptId: 'laws_of_motion_inclined_plane', puzzles: INCLINED_PLANE_PUZZLES, label: 'Inclined Plane', icon: 'change_history', defaultControls: [{ id: 'angle', label: 'Angle', min: 10, max: 70, step: 5, unit: '°', default: 30 }, { id: 'mu', label: 'Friction μ', min: 0, max: 1, step: 0.05, unit: '', default: 0.3 }, { id: 'mass', label: 'Mass', min: 1, max: 10, step: 0.5, unit: 'kg', default: 2 }] },
  circular_motion: { component: CircularMotion, engine: 'canvas', conceptId: 'kinematics_circular_motion', puzzles: GENERIC_PUZZLES, label: 'Circular Motion', icon: 'sync', defaultControls: [{ id: 'mass', label: 'Mass', min: 0.1, max: 5, step: 0.1, unit: 'kg', default: 0.5 }, { id: 'radius', label: 'Radius', min: 0.5, max: 5, step: 0.5, unit: 'm', default: 1.0 }, { id: 'speed', label: 'Speed', min: 1, max: 20, step: 1, unit: 'm/s', default: 3.0 }] },
  orbit: { component: OrbitalMotion, engine: 'canvas', conceptId: 'gravitation_orbital_motion', puzzles: GENERIC_PUZZLES, label: 'Orbital Motion', icon: 'public', defaultControls: [{ id: 'M_star', label: 'Star Mass', min: 1e30, max: 1e31, step: 1e30, unit: 'kg', default: 2e30 }, { id: 'r_orbit', label: 'Orbit Radius', min: 5e10, max: 5e11, step: 1e10, unit: 'm', default: 1.5e11 }, { id: 'ecc', label: 'Eccentricity', min: 0, max: 0.9, step: 0.05, unit: '', default: 0 }] },
  capacitor: { component: Capacitor, engine: 'canvas', conceptId: 'electrostatics_capacitor', puzzles: GENERIC_PUZZLES, label: 'Capacitor', icon: 'developer_board', defaultControls: [{ id: 'V', label: 'Voltage', min: 1, max: 50, step: 1, unit: 'V', default: 12 }, { id: 'd', label: 'Distance', min: 0.001, max: 0.05, step: 0.001, unit: 'm', default: 0.01 }, { id: 'A', label: 'Area', min: 0.01, max: 1, step: 0.01, unit: 'm²', default: 0.04 }, { id: 'k', label: 'Dielectric κ', min: 1, max: 10, step: 0.5, unit: '', default: 1 }] },
  gauss_sphere: { component: GaussSphere, engine: 'canvas', conceptId: 'electrostatics_gauss_law', puzzles: GENERIC_PUZZLES, label: "Gauss's Law", icon: 'target', defaultControls: [{ id: 'Q', label: 'Charge', min: -10, max: 10, step: 1, unit: 'μC', default: 2 }, { id: 'r', label: 'Radius', min: 0.01, max: 0.5, step: 0.01, unit: 'm', default: 0.1 }] },
  current_electricity: { component: CurrentElectricity, engine: 'canvas', conceptId: 'current_electricity_circuits', puzzles: GENERIC_PUZZLES, label: 'Current Electricity', icon: 'cable', defaultControls: [{ id: 'V', label: 'Voltage', min: 1, max: 24, step: 1, unit: 'V', default: 12 }, { id: 'R1', label: 'Resistor 1', min: 1, max: 100, step: 1, unit: 'Ω', default: 4 }, { id: 'R2', label: 'Resistor 2', min: 1, max: 100, step: 1, unit: 'Ω', default: 6 }, { id: 'R3', label: 'Resistor 3', min: 1, max: 100, step: 1, unit: 'Ω', default: 8 }, { id: 'mode', label: 'Circuit Mode', min: 0, max: 1, step: 1, unit: '0/1', default: 0 }] },
  wheatstone_bridge: {
    component: WheatstoneBridge,
    engine: 'canvas',
    conceptId: 'current_electricity_wheatstone',
    puzzles: GENERIC_PUZZLES,
    label: 'Wheatstone Bridge',
    icon: 'device_hub',
    defaultControls: [
      { id: 'P', label: 'Resistor P', min: 1, max: 1000, step: 1, unit: 'Ω', default: 100 },
      { id: 'Q', label: 'Resistor Q', min: 1, max: 1000, step: 1, unit: 'Ω', default: 100 },
      { id: 'R', label: 'Resistor R', min: 1, max: 1000, step: 1, unit: 'Ω', default: 100 },
      { id: 'S', label: 'Resistor S', min: 1, max: 1000, step: 1, unit: 'Ω', default: 105 },
      { id: 'V', label: 'Voltage', min: 1, max: 24, step: 1, unit: 'V', default: 12 },
    ]
  },
  rc_circuit: { component: RCCircuit, engine: 'canvas', conceptId: 'current_electricity_rc_circuit', puzzles: GENERIC_PUZZLES, label: 'RC Circuit', icon: 'electric_meter', defaultControls: [{ id: 'V0', label: 'Voltage', min: 1, max: 24, step: 1, unit: 'V', default: 9 }, { id: 'R', label: 'Resistor', min: 10, max: 10000, step: 10, unit: 'Ω', default: 1000 }, { id: 'C', label: 'Capacitor', min: 10e-6, max: 1000e-6, step: 10e-6, unit: 'F', default: 470e-6 }] },
  magnetic_force: { component: MagneticForce, engine: 'canvas', conceptId: 'magnetism_lorentz_force', puzzles: GENERIC_PUZZLES, label: 'Magnetic Force', icon: 'north', defaultControls: [{ id: 'q', label: 'Charge', min: -5e-19, max: 5e-19, step: 1.6e-19, unit: 'C', default: 1.6e-19 }, { id: 'v', label: 'Speed', min: 1e5, max: 1e7, step: 1e5, unit: 'm/s', default: 1e6 }, { id: 'B', label: 'B-Field', min: 0.1, max: 5, step: 0.1, unit: 'T', default: 0.5 }, { id: 'theta', label: 'Angle', min: 0, max: 180, step: 15, unit: '°', default: 90 }] },
  biot_savart: {
    component: BiotSavart,
    engine: 'canvas',
    conceptId: 'magnetism_biot_savart',
    puzzles: GENERIC_PUZZLES,
    label: 'Biot–Savart Law',
    icon: 'waves',
    defaultControls: [
      { id: 'I', label: 'Current', min: 1, max: 20, step: 1, unit: 'A', default: 10 },
      { id: 'shape', label: 'Wire Shape', min: 0, max: 1, step: 1, unit: '0/1', default: 0 }
    ]
  },
  solenoid: { 
    component: Solenoid, 
    engine: 'canvas', 
    conceptId: 'magnetism_solenoid', 
    puzzles: GENERIC_PUZZLES, 
    label: 'Solenoid', 
    icon: 'view_column', 
    defaultControls: [
      { id: 'I', label: 'Current', min: 1, max: 20, step: 1, unit: 'A', default: 5 },
      { id: 'n', label: 'Turns per m', min: 100, max: 2000, step: 100, unit: 'turns/m', default: 500 }
    ] 
  },
  charged_particle_magnetic: { component: ChargedParticleMagnetic, engine: 'canvas', conceptId: 'magnetism_charged_particle', puzzles: GENERIC_PUZZLES, label: 'Charged Particle in B-field', icon: 'radio_button_checked', defaultControls: [{ id: 'q', label: 'Charge', min: -5e-19, max: 5e-19, step: 1.6e-19, unit: 'C', default: 1.6e-19 }, { id: 'm', label: 'Mass', min: 1e-27, max: 1e-26, step: 1e-27, unit: 'kg', default: 1.67e-27 }, { id: 'v', label: 'Speed', min: 1e5, max: 1e7, step: 1e5, unit: 'm/s', default: 1e6 }, { id: 'B', label: 'B-Field', min: 0.1, max: 5, step: 0.1, unit: 'T', default: 1.0 }] },
  force_current_wire: { 
    component: ForceCurrentWire, 
    engine: 'canvas', 
    conceptId: 'magnetism_force_current_wire', 
    puzzles: GENERIC_PUZZLES, 
    label: 'Force on Current Wire', 
    icon: 'power_input', 
    defaultControls: [
      { id: 'I', label: 'Current', min: 1, max: 20, step: 1, unit: 'A', default: 5 },
      { id: 'B', label: 'B-Field', min: 0.1, max: 2, step: 0.1, unit: 'T', default: 0.5 },
      { id: 'theta', label: 'Angle', min: 0, max: 180, step: 15, unit: '°', default: 90 }
    ] 
  },
  magnetic_dipole: { 
    component: MagneticDipole, 
    engine: 'canvas', 
    conceptId: 'magnetism_dipole', 
    puzzles: GENERIC_PUZZLES, 
    label: 'Magnetic Dipole', 
    icon: 'explore', 
    defaultControls: [
      { id: 'm', label: 'Dipole Moment', min: 1, max: 10, step: 0.5, unit: 'A·m²', default: 5 },
      { id: 'B', label: 'External B', min: 0, max: 1, step: 0.1, unit: 'T', default: 0.2 },
      { id: 'theta', label: 'Initial Angle', min: 0, max: 180, step: 10, unit: '°', default: 30 }
    ] 
  },
  faraday_induction: { 
    component: FaradayInduction, 
    engine: 'canvas', 
    conceptId: 'emi_faraday_lenz', 
    puzzles: GENERIC_PUZZLES, 
    label: 'Faraday Induction', 
    icon: 'electric_bolt', 
    defaultControls: [
      { id: 'N', label: 'Turns', min: 10, max: 1000, step: 10, unit: 'turns', default: 200 },
      { id: 'v', label: 'Magnet Velocity', min: 0.1, max: 2, step: 0.1, unit: 'm/s', default: 0.5 },
      { id: 'mode', label: 'Movement (0=Auto, 1=Manual)', min: 0, max: 1, step: 1, unit: '', default: 0 }
    ] 
  },
  self_inductance: { component: SelfInductance, engine: 'canvas', conceptId: 'emi_self_inductance_rl', puzzles: GENERIC_PUZZLES, label: 'Self Inductance (RL)', icon: 'loop', defaultControls: [{ id: 'L', label: 'Inductance', min: 0.01, max: 1.0, step: 0.01, unit: 'H', default: 0.1 }, { id: 'R', label: 'Resistance', min: 1, max: 100, step: 1, unit: 'Ω', default: 10 }, { id: 'V', label: 'Voltage', min: 1, max: 50, step: 1, unit: 'V', default: 12 }] },
  mutual_inductance: {
    component: MutualInductance,
    engine: 'canvas',
    conceptId: 'emi_mutual_inductance',
    puzzles: GENERIC_PUZZLES,
    label: 'Mutual Inductance',
    icon: 'compare',
    defaultControls: [
      { id: 'f', label: 'AC Frequency', min: 0.1, max: 5, step: 0.1, unit: 'Hz', default: 1 },
      { id: 'N1', label: 'Primary Turns', min: 10, max: 1000, step: 10, unit: 'turns', default: 200 },
      { id: 'N2', label: 'Secondary Turns', min: 10, max: 1000, step: 10, unit: 'turns', default: 400 },
      { id: 'dist', label: 'Coil Distance', min: 0, max: 50, step: 1, unit: 'cm', default: 10 }
    ]
  },
  lcr_circuit: { component: LCRCircuit, engine: 'canvas', conceptId: 'alternating_current_lcr_resonance', puzzles: GENERIC_PUZZLES, label: 'LCR Circuit', icon: 'stacked_line_chart', defaultControls: [{ id: 'V0', label: 'Voltage', min: 1, max: 24, step: 1, unit: 'V', default: 10 }, { id: 'L', label: 'Inductor', min: 0.01, max: 1, step: 0.01, unit: 'H', default: 0.1 }, { id: 'C', label: 'Capacitor', min: 1e-6, max: 1000e-6, step: 1e-6, unit: 'F', default: 100e-6 }, { id: 'R', label: 'Resistor', min: 1, max: 100, step: 1, unit: 'Ω', default: 10 }] },
  em_wave: { 
    component: EMWave, 
    engine: 'canvas', 
    conceptId: 'waves_em_wave', 
    puzzles: GENERIC_PUZZLES, 
    label: 'Electromagnetic Wave', 
    icon: 'settings_input_antenna', 
    defaultControls: [
      { id: 'f', label: 'Frequency', min: 0.1, max: 2, step: 0.1, unit: 'Hz', default: 0.5 },
      { id: 'amp', label: 'Amplitude', min: 10, max: 100, step: 5, unit: 'px', default: 50 },
      { id: 'mode', label: 'View (0=3D, 1=Side)', min: 0, max: 1, step: 1, unit: '', default: 0 }
    ] 
  },
  bohr_atom: { component: BohrAtom, engine: 'canvas', conceptId: 'atoms_bohr_model', puzzles: BOHR_PUZZLES, label: 'Bohr Atom', icon: 'hub', defaultControls: [{ id: 'n', label: 'Orbit n', min: 1, max: 5, step: 1, unit: 'orbit', default: 1 }] },
  photoelectric: { component: Photoelectric, engine: 'canvas', conceptId: 'dual_nature_photoelectric', puzzles: GENERIC_PUZZLES, label: 'Photoelectric Effect', icon: 'light_mode', defaultControls: [{ id: 'lambda', label: 'Wavelength', min: 100, max: 800, step: 10, unit: 'nm', default: 400 }, { id: 'phi', label: 'Work Function', min: 1, max: 6, step: 0.1, unit: 'eV', default: 2.5 }, { id: 'I', label: 'Intensity (rel.)', min: 1, max: 20, step: 1, unit: 'au', default: 5 }] },
  nuclear_decay: { 
    component: NuclearDecay, 
    engine: 'canvas', 
    conceptId: 'nuclei_radioactive_decay', 
    puzzles: GENERIC_PUZZLES, 
    label: 'Nuclear Decay', 
    icon: 'blur_circular', 
    defaultControls: [
      { id: 'N0', label: 'Initial Nuclei', min: 100, max: 2000, step: 100, unit: 'nuclei', default: 1000 },
      { id: 'isotope', label: 'Isotope (0–4)', min: 0, max: 4, step: 1, unit: '', default: 0 }
    ] 
  },
  xray: { 
    component: XRay, 
    engine: 'canvas', 
    conceptId: 'dual_nature_xray', 
    puzzles: GENERIC_PUZZLES, 
    label: 'X-Ray Production', 
    icon: 'ecg', 
    defaultControls: [
      { id: 'V', label: 'Voltage', min: 10, max: 100, step: 5, unit: 'kV', default: 50 },
      { id: 'Z', label: 'Target (Z)', min: 20, max: 80, step: 1, unit: '', default: 74 },
      { id: 'I', label: 'Filament Current', min: 1, max: 10, step: 1, unit: 'mA', default: 5 }
    ] 
  },
  de_broglie: { 
    component: DeBroglie, 
    engine: 'canvas', 
    conceptId: 'dual_nature_de_broglie', 
    puzzles: GENERIC_PUZZLES, 
    label: 'de Broglie Wavelength', 
    icon: 'waves', 
    defaultControls: [
      { id: 'v', label: 'Velocity', min: 100, max: 10000, step: 100, unit: 'm/s', default: 1000 },
      { id: 'm', label: 'Mass', min: 1, max: 10, step: 0.1, unit: 'u', default: 1 },
      { id: 'particle', label: 'Particle (0=Electron, 1=Alpha)', min: 0, max: 1, step: 1, unit: '', default: 0 }
    ] 
  },
  radioactive_decay_graph: { component: RadioactiveDecayGraph, engine: 'canvas', conceptId: 'nuclei_decay_graph_halflife', puzzles: GENERIC_PUZZLES, label: 'Radioactive Decay Graph', icon: 'show_chart', defaultControls: [{ id: 'N0', label: 'Initial N0', min: 100, max: 10000, step: 100, unit: 'nuclei', default: 1000 }, { id: 't12', label: 'Half-Life T½', min: 1, max: 50, step: 1, unit: 's', default: 10 }] },
  mirror_ray: { component: MirrorRay, engine: 'canvas', conceptId: 'optics_mirror_formula', puzzles: MIRROR_PUZZLES, label: 'Mirror Ray Diagram', icon: 'brightness_low', defaultControls: [{ id: 'f', label: 'Focal length |f|', min: 5, max: 40, step: 5, unit: 'cm', default: 15 }, { id: 'u', label: 'Object dist. |u|', min: 5, max: 60, step: 5, unit: 'cm', default: 30 }, { id: 'type', label: 'Type (0=concave, 1=convex)', min: 0, max: 1, step: 1, unit: '', default: 0 }] },
  lens_ray: { component: LensRay, engine: 'canvas', conceptId: 'optics_lens_formula', puzzles: LENS_PUZZLES, label: 'Lens Ray Diagram', icon: 'lens_blur', defaultControls: [{ id: 'f', label: 'Focal length |f|', min: 5, max: 60, step: 5, unit: 'cm', default: 20 }, { id: 'u', label: 'Object dist. |u|', min: 10, max: 80, step: 5, unit: 'cm', default: 40 }, { id: 'type', label: 'Type (0=convex, 1=concave)', min: 0, max: 1, step: 1, unit: '', default: 0 }] },
  prism: {
    component: Prism,
    engine: 'canvas',
    conceptId: 'optics_prism_dispersion',
    puzzles: GENERIC_PUZZLES,
    label: 'Prism Dispersion',
    icon: 'flare',
    defaultControls: [
      { id: 'n', label: 'Refractive n', min: 1.0, max: 2.5, step: 0.05, unit: '', default: 1.5 },
      { id: 'A', label: 'Apex Angle', min: 10, max: 90, step: 5, unit: '°', default: 60 },
      { id: 'angle', label: 'Incident Angle', min: -45, max: 45, step: 1, unit: '°', default: 0 }
    ]
  },
  polarization: { component: Polarization, engine: 'canvas', conceptId: 'wave_optics_polarization', puzzles: GENERIC_PUZZLES, label: 'Polarization', icon: 'filter_polaroid', defaultControls: [{ id: 'theta', label: 'Angle θ', min: 0, max: 360, step: 5, unit: '°', default: 45 }, { id: 'I0', label: 'Intensity', min: 10, max: 200, step: 10, unit: '', default: 100 }] },
  ydse: { component: YDSE, engine: 'canvas', conceptId: 'wave_optics_ydse', puzzles: YDSE_PUZZLES, label: `Young’s Double Slit`, icon: 'more_vert', defaultControls: [{ id: 'd', label: 'Slit sep. d', min: 0.3, max: 3, step: 0.1, unit: 'mm', default: 1.0 }, { id: 'lam', label: 'Wavelength λ', min: 380, max: 700, step: 10, unit: 'nm', default: 600 }, { id: 'D', label: 'Screen dist.', min: 0.5, max: 3, step: 0.25, unit: 'm', default: 1.5 }] },
  single_slit: { component: SingleSlit, engine: 'canvas', conceptId: 'wave_optics_single_slit', puzzles: GENERIC_PUZZLES, label: 'Single Slit', icon: 'more_vert', defaultControls: [{ id: 'a', label: 'Slit Width', min: 0.05, max: 1.0, step: 0.05, unit: 'mm', default: 0.2 }, { id: 'lam', label: 'Wavelength', min: 380, max: 700, step: 10, unit: 'nm', default: 600 }, { id: 'D', label: 'Distance', min: 0.5, max: 5, step: 0.5, unit: 'm', default: 1.0 }] },
  standing_wave: { component: StandingWave, engine: 'canvas', conceptId: 'waves_standing_wave', puzzles: GENERIC_PUZZLES, label: 'Standing Wave', icon: 'graphic_eq', defaultControls: [{ id: 'n', label: 'Harmonic', min: 1, max: 10, step: 1, unit: '', default: 1 }, { id: 'L', label: 'Length', min: 0.5, max: 5, step: 0.1, unit: 'm', default: 1.0 }, { id: 'v', label: 'Wave Speed', min: 10, max: 300, step: 10, unit: 'm/s', default: 100 }, { id: 'A', label: 'Amplitude', min: 0.1, max: 2, step: 0.1, unit: 'm', default: 1 }] },
  superposition: { component: WaveSuperposition, engine: 'canvas', conceptId: 'waves_superposition', puzzles: GENERIC_PUZZLES, label: 'Wave Superposition', icon: 'merge_type', defaultControls: [{ id: 'A1', label: 'Amplitude 1', min: 0.1, max: 5, step: 0.1, unit: '', default: 1 }, { id: 'A2', label: 'Amplitude 2', min: 0.1, max: 5, step: 0.1, unit: '', default: 0.8 }, { id: 'f1', label: 'Freq 1', min: 1, max: 10, step: 0.5, unit: 'Hz', default: 2 }, { id: 'f2', label: 'Freq 2', min: 1, max: 10, step: 0.5, unit: 'Hz', default: 3 }, { id: 'phi', label: 'Phase Shift', min: 0, max: 20, step: 1, unit: 'rad/10', default: 0 }] },
  beats: { component: Beats, engine: 'canvas', conceptId: 'waves_beats', puzzles: GENERIC_PUZZLES, label: 'Beats', icon: 'equalizer', defaultControls: [{ id: 'f1', label: 'Freq 1', min: 100, max: 1000, step: 1, unit: 'Hz', default: 440 }, { id: 'f2', label: 'Freq 2', min: 100, max: 1000, step: 1, unit: 'Hz', default: 444 }, { id: 'A1', label: 'Amp 1', min: 0.1, max: 5, step: 0.1, unit: '', default: 1 }, { id: 'A2', label: 'Amp 2', min: 0.1, max: 5, step: 0.1, unit: '', default: 1 }] },
  doppler: { component: Doppler, engine: 'canvas', conceptId: 'waves_doppler_effect', puzzles: GENERIC_PUZZLES, label: 'Doppler Effect', icon: 'hearing', defaultControls: [{ id: 'f0', label: 'Source Freq', min: 100, max: 1000, step: 10, unit: 'Hz', default: 440 }, { id: 'vs', label: 'Source Speed', min: 0, max: 100, step: 5, unit: 'm/s', default: 30 }, { id: 'v_sound', label: 'Sound Speed', min: 300, max: 400, step: 10, unit: 'm/s', default: 340 }] },

  // Mixed-concept sims — JEE Advanced combo problems
  block_pulley_friction: {
    component: BlockPulleyFriction,
    engine: 'canvas',
    conceptId: 'mixed_block_pulley_friction',
    puzzles: GENERIC_PUZZLES,
    label: 'Block + Pulley + Friction',
    icon: 'account_tree',
    defaultControls: [
      { id: 'm1', label: 'Table Mass m1', min: 1, max: 20, step: 0.5, unit: 'kg', default: 5 },
      { id: 'm2', label: 'Hanging Mass m2', min: 1, max: 20, step: 0.5, unit: 'kg', default: 3 },
      { id: 'mu_k', label: 'Friction coeff. μk', min: 0, max: 1.0, step: 0.01, unit: '', default: 0.2 },
    ]
  },
  charged_em_field: {
    component: ChargedEMField,
    engine: 'canvas',
    conceptId: 'mixed_charged_em_field',
    puzzles: GENERIC_PUZZLES,
    label: 'E + B Field (Combo)',
    icon: 'offline_bolt',
    defaultControls: [
      { id: 'E', label: 'Electric Field E', min: -50, max: 50, step: 1, unit: 'V/m', default: 10 },
      { id: 'B', label: 'Magnetic Field B', min: -5, max: 5, step: 0.1, unit: 'T', default: 1 },
      { id: 'q', label: 'Charge q', min: -5, max: 5, step: 1, unit: 'μC', default: 1 },
      { id: 'v0', label: 'Initial Vel v0', min: 0, max: 100, step: 5, unit: 'm/s', default: 50 },
    ]
  },
  spring_collision_energy: {
    component: SpringCollisionEnergy,
    engine: 'canvas',
    conceptId: 'mixed_spring_collision_energy',
    puzzles: GENERIC_PUZZLES,
    label: 'Spring + Collision + Energy',
    icon: 'compress',
    defaultControls: [
      { id: 'v0', label: 'Initial Velocity', min: 1, max: 20, step: 0.5, unit: 'm/s', default: 5 },
      { id: 'm', label: 'Block Mass', min: 1, max: 10, step: 0.1, unit: 'kg', default: 2 },
      { id: 'k', label: 'Spring Constant', min: 10, max: 500, step: 10, unit: 'N/m', default: 100 },
    ]
  },
}
