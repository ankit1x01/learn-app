export type ChemSimulationType =
  // Gases & States of Matter
  | 'gas_laws' | 'maxwell_boltzmann' | 'phase_diagram'
  // Atomic Structure
  | 'atomic_orbital' | 'energy_levels'
  // Equilibrium
  | 'chemical_equilibrium' | 'titration_curve' | 'buffer_solution'
  // Kinetics
  | 'reaction_kinetics' | 'arrhenius'
  // Electrochemistry
  | 'electrochemical_cell' | 'electrolysis'
  // Solutions & Thermochemistry
  | 'colligative_properties' | 'hess_law'
  // Structure & Bonding
  | 'crystal_structure' | 'vsepr_geometry' | 'molecular_orbital' | 'periodic_trends'

export interface ChemSimulationPlugin {
  engine: 'canvas' | 'stub'
  conceptId: string
  label: string
  icon: string
  category: string
}
