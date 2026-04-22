const fs = require('fs')

const path = 'src/games/playground/registry.ts'
let text = fs.readFileSync(path, 'utf8')

// Add GENERIC_PUZZLES import
if (!text.includes('GENERIC_PUZZLES')) {
  text = text.replace(
    "import { PuzzleConfig, ControlDef } from './types'",
    "import { PuzzleConfig, ControlDef } from './types'\nimport { GENERIC_PUZZLES } from './puzzles/generic.puzzles'"
  )
  if (!text.includes('GENERIC_PUZZLES')) {
    // If exact import didn't match, just inject at top
    text = "import { GENERIC_PUZZLES } from './puzzles/generic.puzzles'\n" + text;
  }
}

// Replace all puzzles: NO_PUZZLES with puzzles: GENERIC_PUZZLES
text = text.replace(/puzzles: NO_PUZZLES/g, 'puzzles: GENERIC_PUZZLES')

// Define controls for each key
const controlMappings = {
  pv_diagram: \`[\n      { id: 'mode', label: 'Process Type', min: 0, max: 3, step: 1, unit: '', default: 0 },\n      { id: 'T', label: 'Temperature', min: 300, max: 1000, step: 50, unit: 'K', default: 300 }\n    ]\`,
  carnot_cycle: \`[\n      { id: 'Th', label: 'T_hot', min: 400, max: 1000, step: 50, unit: 'K', default: 800 },\n      { id: 'Tc', label: 'T_cold', min: 200, max: 400, step: 20, unit: 'K', default: 300 }\n    ]\`,
  kinetic_theory: \`[\n      { id: 'N', label: 'Molecules', min: 10, max: 200, step: 10, unit: '', default: 30 },\n      { id: 'T', label: 'Temperature', min: 100, max: 1000, step: 50, unit: 'K', default: 300 },\n      { id: 'M', label: 'Molar Mass', min: 0.002, max: 0.1, step: 0.002, unit: 'kg/mol', default: 0.029 }\n    ]\`,
  calorimetry: \`[\n      { id: 'm1', label: 'Mass 1', min: 0.1, max: 5, step: 0.1, unit: 'kg', default: 0.5 },\n      { id: 'T1', label: 'Temp 1 (Hot)', min: 50, max: 200, step: 5, unit: '°C', default: 80 },\n      { id: 'c1', label: 'Heat Cap 1', min: 100, max: 5000, step: 100, unit: 'J/kgK', default: 4200 },\n      { id: 'm2', label: 'Mass 2', min: 0.1, max: 5, step: 0.1, unit: 'kg', default: 1.0 },\n      { id: 'T2', label: 'Temp 2 (Cold)', min: 0, max: 50, step: 5, unit: '°C', default: 20 },\n      { id: 'c2', label: 'Heat Cap 2', min: 100, max: 5000, step: 100, unit: 'J/kgK', default: 900 }\n    ]\`,
  heat_transfer: \`[\n      { id: 'T_hot', label: 'Hot Temp', min: 50, max: 500, step: 10, unit: '°C', default: 200 },\n      { id: 'T_cold', label: 'Cold Temp', min: -50, max: 50, step: 5, unit: '°C', default: 25 },\n      { id: 'k', label: 'Conductivity k', min: 1, max: 400, step: 10, unit: 'W/mK', default: 50 },\n      { id: 'A', label: 'Area A', min: 0.01, max: 1, step: 0.01, unit: 'm²', default: 0.01 },\n      { id: 'L', label: 'Length L', min: 0.01, max: 1, step: 0.01, unit: 'm', default: 0.1 }\n    ]\`,
  circular_motion: \`[\n      { id: 'mass', label: 'Mass', min: 0.1, max: 5, step: 0.1, unit: 'kg', default: 0.5 },\n      { id: 'radius', label: 'Radius', min: 0.5, max: 5, step: 0.5, unit: 'm', default: 1.0 },\n      { id: 'speed', label: 'Speed', min: 1, max: 20, step: 1, unit: 'm/s', default: 3.0 }\n    ]\`,
  orbit: \`[\n      { id: 'M_star', label: 'Star Mass', min: 1e30, max: 1e31, step: 1e30, unit: 'kg', default: 2e30 },\n      { id: 'r_orbit', label: 'Orbit Radius', min: 5e10, max: 5e11, step: 1e10, unit: 'm', default: 1.5e11 },\n      { id: 'ecc', label: 'Eccentricity', min: 0, max: 0.9, step: 0.05, unit: '', default: 0 }\n    ]\`,
  capacitor: \`[\n      { id: 'V', label: 'Voltage', min: 1, max: 50, step: 1, unit: 'V', default: 12 },\n      { id: 'd', label: 'Distance', min: 0.001, max: 0.05, step: 0.001, unit: 'm', default: 0.01 },\n      { id: 'A', label: 'Area', min: 0.01, max: 1, step: 0.01, unit: 'm²', default: 0.04 },\n      { id: 'k', label: 'Dielectric κ', min: 1, max: 10, step: 0.5, unit: '', default: 1 }\n    ]\`,
  gauss_sphere: \`[\n      { id: 'Q', label: 'Charge', min: -10, max: 10, step: 1, unit: 'μC', default: 2 },\n      { id: 'r', label: 'Radius', min: 0.01, max: 0.5, step: 0.01, unit: 'm', default: 0.1 }\n    ]\`,
  current_electricity: \`[\n      { id: 'V', label: 'Voltage', min: 1, max: 24, step: 1, unit: 'V', default: 12 },\n      { id: 'R1', label: 'Resistor 1', min: 1, max: 100, step: 1, unit: 'Ω', default: 4 },\n      { id: 'R2', label: 'Resistor 2', min: 1, max: 100, step: 1, unit: 'Ω', default: 6 },\n      { id: 'R3', label: 'Resistor 3', min: 1, max: 100, step: 1, unit: 'Ω', default: 8 },\n      { id: 'mode', label: 'Series(0)/Parallel(1)', min: 0, max: 1, step: 1, unit: '', default: 0 }\n    ]\`,
  wheatstone_bridge: \`[\n      { id: 'V', label: 'Voltage', min: 1, max: 24, step: 1, unit: 'V', default: 6 },\n      { id: 'P', label: 'Resistor P', min: 1, max: 100, step: 1, unit: 'Ω', default: 10 },\n      { id: 'Q', label: 'Resistor Q', min: 1, max: 100, step: 1, unit: 'Ω', default: 10 },\n      { id: 'R3', label: 'Resistor R', min: 1, max: 100, step: 1, unit: 'Ω', default: 10 },\n      { id: 'Rx', label: 'Resistor Rx', min: 1, max: 100, step: 1, unit: 'Ω', default: 10 }\n    ]\`,
  rc_circuit: \`[\n      { id: 'V0', label: 'Voltage', min: 1, max: 24, step: 1, unit: 'V', default: 9 },\n      { id: 'R', label: 'Resistor', min: 10, max: 10000, step: 10, unit: 'Ω', default: 1000 },\n      { id: 'C', label: 'Capacitor', min: 10e-6, max: 1000e-6, step: 10e-6, unit: 'F', default: 470e-6 }\n    ]\`,
  magnetic_force: \`[\n      { id: 'q', label: 'Charge', min: -5e-19, max: 5e-19, step: 1.6e-19, unit: 'C', default: 1.6e-19 },\n      { id: 'v', label: 'Speed', min: 1e5, max: 1e7, step: 1e5, unit: 'm/s', default: 1e6 },\n      { id: 'B', label: 'B-Field', min: 0.1, max: 5, step: 0.1, unit: 'T', default: 0.5 },\n      { id: 'theta', label: 'Angle', min: 0, max: 180, step: 15, unit: '°', default: 90 }\n    ]\`,
  charged_particle_magnetic: \`[\n      { id: 'q', label: 'Charge', min: -5e-19, max: 5e-19, step: 1.6e-19, unit: 'C', default: 1.6e-19 },\n      { id: 'm', label: 'Mass', min: 1e-27, max: 1e-26, step: 1e-27, unit: 'kg', default: 1.67e-27 },\n      { id: 'v', label: 'Speed', min: 1e5, max: 1e7, step: 1e5, unit: 'm/s', default: 1e6 },\n      { id: 'B', label: 'B-Field', min: 0.1, max: 5, step: 0.1, unit: 'T', default: 1.0 }\n    ]\`,
  lcr_circuit: \`[\n      { id: 'V0', label: 'Voltage', min: 1, max: 24, step: 1, unit: 'V', default: 10 },\n      { id: 'L', label: 'Inductor', min: 0.01, max: 1, step: 0.01, unit: 'H', default: 0.1 },\n      { id: 'C', label: 'Capacitor', min: 1e-6, max: 1000e-6, step: 1e-6, unit: 'F', default: 100e-6 },\n      { id: 'R', label: 'Resistor', min: 1, max: 100, step: 1, unit: 'Ω', default: 10 }\n    ]\`,
  faraday_induction: \`[\n      { id: 'N', label: 'Turns', min: 10, max: 1000, step: 10, unit: '', default: 200 },\n      { id: 'B', label: 'B-Field', min: 0.1, max: 2, step: 0.1, unit: 'T', default: 0.5 },\n      { id: 'A', label: 'Area', min: 0.01, max: 0.5, step: 0.01, unit: 'm²', default: 0.01 },\n      { id: 'freq', label: 'Frequency', min: 0.1, max: 5, step: 0.1, unit: 'Hz', default: 1 }\n    ]\`,
  standing_wave: \`[\n      { id: 'n', label: 'Harmonic', min: 1, max: 10, step: 1, unit: '', default: 1 },\n      { id: 'L', label: 'Length', min: 0.5, max: 5, step: 0.1, unit: 'm', default: 1.0 },\n      { id: 'v', label: 'Wave Speed', min: 10, max: 300, step: 10, unit: 'm/s', default: 100 },\n      { id: 'A', label: 'Amplitude', min: 0.1, max: 2, step: 0.1, unit: 'm', default: 1 }\n    ]\`,
  doppler: \`[\n      { id: 'f0', label: 'Source Freq', min: 100, max: 1000, step: 10, unit: 'Hz', default: 440 },\n      { id: 'vs', label: 'Source Speed', min: 0, max: 100, step: 5, unit: 'm/s', default: 30 },\n      { id: 'v_sound', label: 'Sound Speed', min: 300, max: 400, step: 10, unit: 'm/s', default: 340 }\n    ]\`,
  single_slit: \`[\n      { id: 'a', label: 'Slit Width', min: 0.05, max: 1.0, step: 0.05, unit: 'mm', default: 0.2 },\n      { id: 'lam', label: 'Wavelength', min: 380, max: 700, step: 10, unit: 'nm', default: 600 },\n      { id: 'D', label: 'Distance', min: 0.5, max: 5, step: 0.5, unit: 'm', default: 1.0 }\n    ]\`,
  polarization: \`[\n      { id: 'theta', label: 'Angle θ', min: 0, max: 360, step: 5, unit: '°', default: 45 },\n      { id: 'I0', label: 'Intensity', min: 10, max: 200, step: 10, unit: '', default: 100 }\n    ]\`,
  superposition: \`[\n      { id: 'A1', label: 'Amplitude 1', min: 0.1, max: 5, step: 0.1, unit: '', default: 1 },\n      { id: 'A2', label: 'Amplitude 2', min: 0.1, max: 5, step: 0.1, unit: '', default: 0.8 },\n      { id: 'f1', label: 'Freq 1', min: 1, max: 10, step: 0.5, unit: 'Hz', default: 2 },\n      { id: 'f2', label: 'Freq 2', min: 1, max: 10, step: 0.5, unit: 'Hz', default: 3 },\n      { id: 'phi', label: 'Phase Shift', min: 0, max: 20, step: 1, unit: 'rad/10', default: 0 }\n    ]\`,
  beats: \`[\n      { id: 'f1', label: 'Freq 1', min: 100, max: 1000, step: 1, unit: 'Hz', default: 440 },\n      { id: 'f2', label: 'Freq 2', min: 100, max: 1000, step: 1, unit: 'Hz', default: 444 },\n      { id: 'A1', label: 'Amp 1', min: 0.1, max: 5, step: 0.1, unit: '', default: 1 },\n      { id: 'A2', label: 'Amp 2', min: 0.1, max: 5, step: 0.1, unit: '', default: 1 }\n    ]\`,
  photoelectric: \`[\n      { id: 'lambda', label: 'Wavelength', min: 100, max: 800, step: 10, unit: 'nm', default: 400 },\n      { id: 'phi', label: 'Work Function', min: 1, max: 6, step: 0.1, unit: 'eV', default: 2.5 },\n      { id: 'I', label: 'Intensity', min: 1, max: 20, step: 1, unit: '', default: 5 }\n    ]\`,
  radioactive_decay_graph: \`[\n      { id: 'N0', label: 'Initial N0', min: 100, max: 10000, step: 100, unit: '', default: 1000 },\n      { id: 't12', label: 'Half-Life T½', min: 1, max: 50, step: 1, unit: 's', default: 10 }\n    ]\`,
  prism: \`[\n      { id: 'n', label: 'Refractive n', min: 1.0, max: 2.5, step: 0.05, unit: '', default: 1.5 },\n      { id: 'A', label: 'Apex Angle', min: 10, max: 90, step: 5, unit: '°', default: 60 }\n    ]\`,
  self_inductance: \`[\n      { id: 'L', label: 'Inductance', min: 0.01, max: 1.0, step: 0.01, unit: 'H', default: 0.1 },\n      { id: 'R', label: 'Resistance', min: 1, max: 100, step: 1, unit: 'Ω', default: 10 },\n      { id: 'V', label: 'Voltage', min: 1, max: 50, step: 1, unit: 'V', default: 12 }\n    ]\`
}

for (const [key, controlsString] of Object.entries(controlMappings)) {
  const regex = new RegExp(\`(\${key}\\s*:\\s*\\{[^}]*defaultControls\\s*:)\\s*NO_CONTROLS\`, 'g')
  text = text.replace(regex, \`$1 \${controlsString}\`)
}

// For anything else still NO_CONTROLS, just give it a dummy param so it's not empty
text = text.replace(/defaultControls: NO_CONTROLS/g, "defaultControls: [{ id: 'dummy', label: 'Placeholder Param', min: 0, max: 10, step: 1, unit: '', default: 5 }]")

fs.writeFileSync(path, text)
console.log('Update Complete.')
