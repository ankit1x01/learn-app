const fs = require('fs')

const path = 'src/games/playground/registry.ts'
let text = fs.readFileSync(path, 'utf8')

// 1. Add all the lazy imports
const newImports = `
const PVDiagram = lazy(() => import('./simulations/mechanics/PVDiagram.sim').then(m => ({ default: m.PVDiagramSim })))
const CarnotCycle = lazy(() => import('./simulations/mechanics/CarnotCycle.sim').then(m => ({ default: m.CarnotCycleSim })))
const KineticTheory = lazy(() => import('./simulations/mechanics/KineticTheory.sim').then(m => ({ default: m.KineticTheorySim })))
const Calorimetry = lazy(() => import('./simulations/mechanics/Calorimetry.sim').then(m => ({ default: m.CalorimetrySim })))
const HeatTransfer = lazy(() => import('./simulations/mechanics/HeatTransfer.sim').then(m => ({ default: m.HeatTransferSim })))

const CircularMotion = lazy(() => import('./simulations/mechanics/CircularMotion.sim').then(m => ({ default: m.CircularMotionSim })))
const OrbitalMotion = lazy(() => import('./simulations/mechanics/OrbitalMotion.sim').then(m => ({ default: m.OrbitalMotionSim })))

const Capacitor = lazy(() => import('./simulations/fields/Capacitor.sim').then(m => ({ default: m.CapacitorSim })))
const GaussSphere = lazy(() => import('./simulations/fields/GaussSphere.sim').then(m => ({ default: m.GaussSphereSim })))
const RCCircuit = lazy(() => import('./simulations/fields/RCCircuit.sim').then(m => ({ default: m.RCCircuitSim })))
const ChargedParticleMagnetic = lazy(() => import('./simulations/fields/ChargedParticleMagnetic.sim').then(m => ({ default: m.ChargedParticleMagneticSim })))
const LCRCircuit = lazy(() => import('./simulations/fields/LCRCircuit.sim').then(m => ({ default: m.LCRCircuitSim })))
const FaradayInduction = lazy(() => import('./simulations/fields/FaradayInduction.sim').then(m => ({ default: m.FaradayInductionSim })))

const StandingWave = lazy(() => import('./simulations/optics/StandingWave.sim').then(m => ({ default: m.StandingWaveSim })))
const Doppler = lazy(() => import('./simulations/optics/Doppler.sim').then(m => ({ default: m.DopplerSim })))
const SingleSlit = lazy(() => import('./simulations/optics/SingleSlit.sim').then(m => ({ default: m.SingleSlitSim })))
const Polarization = lazy(() => import('./simulations/optics/Polarization.sim').then(m => ({ default: m.PolarizationSim })))
const WaveSuperposition = lazy(() => import('./simulations/optics/WaveSuperposition.sim').then(m => ({ default: m.WaveSuperpositionSim })))
const Beats = lazy(() => import('./simulations/optics/Beats.sim').then(m => ({ default: m.BeatsSim })))

const Photoelectric = lazy(() => import('./simulations/modern/Photoelectric.sim').then(m => ({ default: m.PhotoelectricSim })))
const RadioactiveDecayGraph = lazy(() => import('./simulations/modern/RadioactiveDecayGraph.sim').then(m => ({ default: m.RadioactiveDecayGraphSim })))

const WheatstoneBridge = lazy(() => import('./simulations/MiscSims').then(m => ({ default: m.WheatstoneBridgeSim })))
const CurrentElectricity = lazy(() => import('./simulations/MiscSims').then(m => ({ default: m.CurrentElectricitySim })))
const MagneticForce = lazy(() => import('./simulations/MiscSims').then(m => ({ default: m.MagneticForceSim })))
const Prism = lazy(() => import('./simulations/MiscSims').then(m => ({ default: m.PrismSim })))
const SelfInductance = lazy(() => import('./simulations/MiscSims').then(m => ({ default: m.SelfInductanceSim })))
const MutualInductance = lazy(() => import('./simulations/MiscSims').then(m => ({ default: m.MutualInductanceSim })))
const BiotSavart = lazy(() => import('./simulations/MiscSims').then(m => ({ default: m.BiotSavartSim })))
const Solenoid = lazy(() => import('./simulations/MiscSims').then(m => ({ default: m.SolenoidSim })))
const ForceCurrentWire = lazy(() => import('./simulations/MiscSims').then(m => ({ default: m.ForceCurrentWireSim })))
const MagneticDipole = lazy(() => import('./simulations/MiscSims').then(m => ({ default: m.MagneticDipoleSim })))
const EMWave = lazy(() => import('./simulations/MiscSims').then(m => ({ default: m.EMWaveSim })))
const NuclearDecay = lazy(() => import('./simulations/MiscSims').then(m => ({ default: m.NuclearDecaySim })))
const XRay = lazy(() => import('./simulations/MiscSims').then(m => ({ default: m.XRaySim })))
const DeBroglie = lazy(() => import('./simulations/MiscSims').then(m => ({ default: m.DeBroglieSim })))
const BlockPulleyFriction = lazy(() => import('./simulations/MiscSims').then(m => ({ default: m.BlockPulleyFrictionSim })))
const ChargedEMField = lazy(() => import('./simulations/MiscSims').then(m => ({ default: m.ChargedEMFieldSim })))
const SpringCollisionEnergy = lazy(() => import('./simulations/MiscSims').then(m => ({ default: m.SpringCollisionEnergySim })))
`

text = text.replace(
  'const NO_PUZZLES: PuzzleConfig[] = []',
  newImports + '\nconst NO_PUZZLES: PuzzleConfig[] = []'
)

// 2. Replace engine: 'stub' and component: Stub with appropriate values
const mappings = {
  'pv_diagram': { component: 'PVDiagram', engine: 'canvas' },
  'carnot_cycle': { component: 'CarnotCycle', engine: 'canvas' },
  'kinetic_theory': { component: 'KineticTheory', engine: 'canvas' },
  'calorimetry': { component: 'Calorimetry', engine: 'canvas' },
  'heat_transfer': { component: 'HeatTransfer', engine: 'canvas' },
  'circular_motion': { component: 'CircularMotion', engine: 'canvas' },
  'orbit': { component: 'OrbitalMotion', engine: 'canvas' },
  'capacitor': { component: 'Capacitor', engine: 'canvas' },
  'gauss_sphere': { component: 'GaussSphere', engine: 'canvas' },
  'current_electricity': { component: 'CurrentElectricity', engine: 'canvas' },
  'wheatstone_bridge': { component: 'WheatstoneBridge', engine: 'canvas' },
  'rc_circuit': { component: 'RCCircuit', engine: 'canvas' },
  'magnetic_force': { component: 'MagneticForce', engine: 'canvas' },
  'biot_savart': { component: 'BiotSavart', engine: 'canvas' },
  'solenoid': { component: 'Solenoid', engine: 'canvas' },
  'charged_particle_magnetic': { component: 'ChargedParticleMagnetic', engine: 'canvas' },
  'force_current_wire': { component: 'ForceCurrentWire', engine: 'canvas' },
  'magnetic_dipole': { component: 'MagneticDipole', engine: 'canvas' },
  'faraday_induction': { component: 'FaradayInduction', engine: 'canvas' },
  'self_inductance': { component: 'SelfInductance', engine: 'canvas' },
  'mutual_inductance': { component: 'MutualInductance', engine: 'canvas' },
  'lcr_circuit': { component: 'LCRCircuit', engine: 'canvas' },
  'em_wave': { component: 'EMWave', engine: 'canvas' },
  'photoelectric': { component: 'Photoelectric', engine: 'canvas' },
  'nuclear_decay': { component: 'NuclearDecay', engine: 'canvas' },
  'xray': { component: 'XRay', engine: 'canvas' },
  'de_broglie': { component: 'DeBroglie', engine: 'canvas' },
  'radioactive_decay_graph': { component: 'RadioactiveDecayGraph', engine: 'canvas' },
  'prism': { component: 'Prism', engine: 'canvas' },
  'polarization': { component: 'Polarization', engine: 'canvas' },
  'single_slit': { component: 'SingleSlit', engine: 'canvas' },
  'standing_wave': { component: 'StandingWave', engine: 'canvas' },
  'superposition': { component: 'WaveSuperposition', engine: 'canvas' },
  'beats': { component: 'Beats', engine: 'canvas' },
  'doppler': { component: 'Doppler', engine: 'canvas' },
  'block_pulley_friction': { component: 'BlockPulleyFriction', engine: 'canvas' },
  'charged_em_field': { component: 'ChargedEMField', engine: 'canvas' },
  'spring_collision_energy': { component: 'SpringCollisionEnergy', engine: 'canvas' }
}

for (const [key, mapping] of Object.entries(mappings)) {
  const regex = new RegExp(\`\\b\${key}\\s*:\\s*\\{\\s*component:\\s*Stub,\\s*engine:\\s*'stub'\`, 'g')
  text = text.replace(regex, \`\${key}: { component: \${mapping.component}, engine: '\${mapping.engine}'\`)
}

fs.writeFileSync(path, text)
console.log('Done.')
