/**
 * ScenarioMapper — reads a puzzle's `given` data and maps it to
 * appropriate simulation control values and scenario mode flags.
 * 
 * This allows any simulation to automatically configure itself
 * to match the parameters described in the active puzzle question.
 */

import { PuzzleConfig } from './types'

export interface ScenarioPreset {
  /** Override values to apply to simulation controls */
  controls: Record<string, number>
  /** Human readable label for the scenario type */
  scenarioLabel: string
  /** Icon for the scenario badge */
  scenarioIcon: string
}

// ─── Projectile Motion Scenarios ─────────────────────────────────────────────
function mapProjectileScenario(puzzle: PuzzleConfig): ScenarioPreset {
  const g = puzzle.given
  const q = puzzle.question.toLowerCase()
  
  const base: Record<string, number> = {}
  
  // Speed
  if (g['speed_ms']) base['speed'] = Math.min(50, g['speed_ms'])
  if (g['u_ms'] || g['v0_ms']) base['speed'] = Math.min(50, g['u_ms'] || g['v0_ms'])
  
  // Angle from horizontal
  if (g['angle_deg']) base['angle'] = Math.max(10, Math.min(80, g['angle_deg']))
  
  // Initial height (projectile off a cliff)
  if (g['height_m']) base['height'] = Math.min(40, g['height_m'])
  
  // Gravity override
  if (g['g_ms2'] && g['g_ms2'] !== 9.81) {
    // Can't directly set g in controls, but flag it
  }
  
  // ── Scenario detection ────────────────────────────────────────────────────
  
  // Inclined plane scenario
  if (q.includes('slope') || q.includes('incline') || q.includes('inclined')) {
    const slopeAngle = g['angle_deg'] || 30
    base['ground_angle'] = -Math.min(45, slopeAngle) // negative = uphill slope
    // Launch angle above slope → convert to absolute
    // Typically: θ_abs = slope_angle + launch_angle_above_slope
    // We can't do this perfectly without two angle values, so use 90° as visual default
    base['angle'] = 60 // reasonable default above slope
    return {
      controls: base,
      scenarioLabel: 'Inclined Plane Launch',
      scenarioIcon: 'change_history',
    }
  }
  
  // Vertical throw + dropped object meeting scenario
  if (q.includes('dropped') && (q.includes('meet') || q.includes('same time') || q.includes('simultaneously'))) {
    const h = g['height_m'] || 40
    base['angle'] = 90
    base['drop_target'] = 1
    base['target_height'] = Math.min(100, h)
    return {
      controls: base,
      scenarioLabel: 'A↑ meets B↓',
      scenarioIcon: 'swap_vert',
    }
  }
  
  // Explosion / splitting at peak
  if (q.includes('explod') || q.includes('split') || q.includes('break') || q.includes('fragment')) {
    base['explode_peak'] = 1
    return {
      controls: base,
      scenarioLabel: 'Explosion at Peak',
      scenarioIcon: 'local_fire_department',
    }
  }
  
  // Drag / viscous medium
  if (q.includes('viscous') || q.includes('drag') || q.includes('resistance') || q.includes('medium')) {
    base['drag_coeff'] = 0.5
    return {
      controls: base,
      scenarioLabel: 'Air Resistance',
      scenarioIcon: 'air',
    }
  }
  
  // Horizontal throw (angle = 0 from horizontal)
  if (q.includes('horizontal') && (q.includes('thrown') || q.includes('projected') || q.includes('dropped'))) {
    base['angle'] = 0
    if (g['height_m']) base['height'] = Math.min(40, g['height_m'])
    return {
      controls: base,
      scenarioLabel: 'Horizontal Throw',
      scenarioIcon: 'trending_flat',
    }
  }
  
  // Complementary angles (same range, e.g. 30° and 60°)
  if (q.includes('same range') || q.includes('complementary')) {
    base['angle'] = 30
    return {
      controls: base,
      scenarioLabel: 'Complementary Angles',
      scenarioIcon: 'join_inner',
    }
  }
  
  // Max range (optimal 45°)
  if (q.includes('maximum range') || q.includes('max range')) {
    base['angle'] = 45
    return {
      controls: base,
      scenarioLabel: 'Max Range (45°)',
      scenarioIcon: 'north_east',
    }
  }
  
  // Max height
  if (q.includes('maximum height') || q.includes('max height')) {
    base['angle'] = 90
    return {
      controls: base,
      scenarioLabel: 'Max Height (90°)',
      scenarioIcon: 'vertical_align_top',
    }
  }
  
  return {
    controls: base,
    scenarioLabel: 'Standard Projectile',
    scenarioIcon: 'sports_baseball',
  }
}

// ─── Topic-based scenario dispatchers ─────────────────────────────────────────
const TOPIC_MAPPERS: Record<string, (p: PuzzleConfig) => ScenarioPreset> = {
  projectile: mapProjectileScenario,
}

/**
 * Returns a scenario preset for the given simulation type and puzzle.
 * Falls back to using puzzle.given values directly as control overrides.
 */
export function getScenarioPreset(simType: string, puzzle: PuzzleConfig | null): ScenarioPreset {
  if (!puzzle) return { controls: {}, scenarioLabel: 'Free Play', scenarioIcon: 'settings' }
  
  const mapper = TOPIC_MAPPERS[simType]
  if (mapper) return mapper(puzzle)
  
  // Generic fallback: try to map common given fields to generic control names
  const controls: Record<string, number> = {}
  const g = puzzle.given
  
  if (g['speed_ms']) controls['speed'] = g['speed_ms']
  if (g['angle_deg']) controls['angle'] = g['angle_deg']
  if (g['height_m']) controls['height'] = g['height_m']
  if (g['mass_kg']) controls['mass'] = g['mass_kg']
  if (g['length_m']) controls['length'] = g['length_m']
  if (g['radius_m']) controls['radius'] = g['radius_m']
  if (g['frequency_hz']) controls['frequency'] = g['frequency_hz']
  if (g['voltage_v']) controls['V'] = g['voltage_v']
  if (g['resistance_ohm']) controls['R'] = g['resistance_ohm']
  if (g['current_a']) controls['I'] = g['current_a']
  if (g['charge_uc']) controls['Q'] = g['charge_uc']
  if (g['temp_k']) controls['T'] = g['temp_k']
  if (g['pressure_pa']) controls['P'] = g['pressure_pa']
  if (g['force_n']) controls['F'] = g['force_n']
  
  return { controls, scenarioLabel: 'From Question', scenarioIcon: 'auto_fix_high' }
}
