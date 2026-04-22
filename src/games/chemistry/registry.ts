import { ChemSimulationType, ChemSimulationPlugin } from './types'

export const CHEM_REGISTRY: Record<ChemSimulationType, ChemSimulationPlugin> = {
  // ── Gases & States of Matter ──────────────────────────────────────────────
  gas_laws:               { engine: 'stub', conceptId: 'pchem_gas_laws_pvnrt',             label: 'Gas Laws (PV=nRT)',          icon: 'bubble_chart',      category: 'Gases & States' },
  maxwell_boltzmann:      { engine: 'stub', conceptId: 'pchem_maxwell_boltzmann',           label: 'Maxwell–Boltzmann Dist.',   icon: 'show_chart',        category: 'Gases & States' },
  phase_diagram:          { engine: 'stub', conceptId: 'pchem_phase_diagram',               label: 'Phase Diagram',             icon: 'area_chart',        category: 'Gases & States' },

  // ── Atomic Structure ──────────────────────────────────────────────────────
  atomic_orbital:         { engine: 'stub', conceptId: 'atomic_orbital_shapes',             label: 'Atomic Orbitals',           icon: 'hub',               category: 'Atomic Structure' },
  energy_levels:          { engine: 'stub', conceptId: 'atomic_hydrogen_spectrum',          label: 'Energy Levels & Spectrum',  icon: 'stacked_line_chart', category: 'Atomic Structure' },

  // ── Equilibrium ───────────────────────────────────────────────────────────
  chemical_equilibrium:   { engine: 'stub', conceptId: 'equilibrium_le_chatelier',          label: 'Chemical Equilibrium',      icon: 'balance',           category: 'Equilibrium' },
  titration_curve:        { engine: 'stub', conceptId: 'ionic_eq_titration',                label: 'Titration Curve',           icon: 'waterfall_chart',   category: 'Equilibrium' },
  buffer_solution:        { engine: 'stub', conceptId: 'ionic_eq_buffer_henderson',        label: 'Buffer Solution',           icon: 'water',             category: 'Equilibrium' },

  // ── Chemical Kinetics ─────────────────────────────────────────────────────
  reaction_kinetics:      { engine: 'stub', conceptId: 'kinetics_rate_law_order',           label: 'Reaction Kinetics',         icon: 'trending_down',     category: 'Kinetics' },
  arrhenius:              { engine: 'stub', conceptId: 'kinetics_arrhenius_equation',       label: 'Arrhenius Equation',        icon: 'local_fire_department', category: 'Kinetics' },

  // ── Electrochemistry ──────────────────────────────────────────────────────
  electrochemical_cell:   { engine: 'stub', conceptId: 'electrochem_galvanic_nernst',      label: 'Electrochemical Cell',      icon: 'electric_bolt',     category: 'Electrochemistry' },
  electrolysis:           { engine: 'stub', conceptId: 'electrochem_electrolysis_faraday', label: 'Electrolysis',              icon: 'bolt',              category: 'Electrochemistry' },

  // ── Solutions & Thermochemistry ───────────────────────────────────────────
  colligative_properties: { engine: 'stub', conceptId: 'solutions_colligative_properties', label: 'Colligative Properties',    icon: 'thermostat',        category: 'Solutions' },
  hess_law:               { engine: 'stub', conceptId: 'thermochem_hess_law',               label: "Hess's Law",                icon: 'account_tree',      category: 'Solutions' },

  // ── Structure & Bonding ───────────────────────────────────────────────────
  crystal_structure:      { engine: 'stub', conceptId: 'solid_state_crystal_structure',    label: 'Crystal Structure',         icon: 'grid_4x4',          category: 'Structure & Bonding' },
  vsepr_geometry:         { engine: 'stub', conceptId: 'bonding_vsepr_geometry',           label: 'VSEPR Geometry',            icon: 'blur_on',           category: 'Structure & Bonding' },
  molecular_orbital:      { engine: 'stub', conceptId: 'bonding_molecular_orbital',        label: 'Molecular Orbital',         icon: 'merge',             category: 'Structure & Bonding' },
  periodic_trends:        { engine: 'stub', conceptId: 'periodic_table_trends',            label: 'Periodic Trends',           icon: 'bar_chart',         category: 'Structure & Bonding' },
}
