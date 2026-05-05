// REFLEX-MATHS Game Content Registry

export { matrixForgeContent } from './matrixForgeContent'
export { integralInfernoContent } from './integralInfernoContent'
export { vectorVoyagerContent } from './vectorVoyagerContent'
export { domainDuelsContent } from './domainDuelsContent'
export { principalValleyContent } from './principalValleyContent'
export { detDetectiveContent } from './detDetectiveContent'
export { derivativeDojoContent } from './derivativeDojoContent'
export { tangentTycoonContent } from './tangentTycoonContent'
export { areaArchitectContent } from './areaArchitectContent'
export { diffEqDescentContent } from './diffEqDescentContent'
export { threeDArchitectContent } from './threeDArchitectContent'
export { optimaOutpostContent } from './optimaOutpostContent'
export { bayesBazaarContent } from './bayesBazaarContent'

// Import all game configs
import { matrixForgeContent } from './matrixForgeContent'
import { integralInfernoContent } from './integralInfernoContent'
import { vectorVoyagerContent } from './vectorVoyagerContent'
import { domainDuelsContent } from './domainDuelsContent'
import { principalValleyContent } from './principalValleyContent'
import { detDetectiveContent } from './detDetectiveContent'
import { derivativeDojoContent } from './derivativeDojoContent'
import { tangentTycoonContent } from './tangentTycoonContent'
import { areaArchitectContent } from './areaArchitectContent'
import { diffEqDescentContent } from './diffEqDescentContent'
import { threeDArchitectContent } from './threeDArchitectContent'
import { optimaOutpostContent } from './optimaOutpostContent'
import { bayesBazaarContent } from './bayesBazaarContent'
import type { GameConfig } from '@/games/types'

/**
 * Complete REFLEX-MATHS game registry
 * Maps game type to config + content
 * Note: 10 games have stubs below; TODO: add content files
 */

export const REFLEX_MATHS_GAMES: Record<string, GameConfig> = {
  'domain-duels': domainDuelsContent,
  'principal-valley': principalValleyContent,
  'matrix-forge': matrixForgeContent,
  'det-detective': detDetectiveContent,
  'derivative-dojo': derivativeDojoContent,
  'tangent-tycoon': tangentTycoonContent,
  'integral-inferno': integralInfernoContent,
  'area-architect': areaArchitectContent,
  'diff-eq-descent': diffEqDescentContent,
  'vector-voyager': vectorVoyagerContent,
  '3d-architect': threeDArchitectContent,
  'optima-outpost': optimaOutpostContent,
  'bayes-bazaar': bayesBazaarContent,
}

/**
 * Get game config by type
 */
export function getGameConfig(gameType: string): GameConfig | undefined {
  return REFLEX_MATHS_GAMES[gameType]
}

/**
 * List all available games
 */
export function listAvailableGames(): Array<{ type: string; name: string; description: string }> {
  return [
    // Chapter 1-3: Algebra & Relations
    { type: 'domain-duels', name: 'Domain Duels', description: 'Arrow diagrams: relation classification' },
    { type: 'principal-valley', name: 'Principal Valley', description: 'Landscape: inverse trig range zones' },

    // Chapter 4-5: Matrices & Derivatives
    { type: 'matrix-forge', name: 'Matrix Forge', description: 'Blacksmith forge: cell-by-cell matrix operations' },
    { type: 'det-detective', name: 'Det Detective', description: 'Noir mystery: determinant expansion' },
    { type: 'derivative-dojo', name: 'Derivative Dojo', description: 'Martial arts: differentiation combos' },
    { type: 'tangent-tycoon', name: 'Tangent Tycoon', description: 'City building: derivative applications' },

    // Chapter 6-7: Integration
    { type: 'integral-inferno', name: 'Integral Inferno', description: 'Dungeon crawler: integration technique recognition' },
    { type: 'area-architect', name: 'Area Architect', description: 'Drafting board: integration setup' },

    // Chapter 8-9: Equations & Systems
    { type: 'diff-eq-descent', name: 'Diff-Eq Descent', description: 'Spelunking: differential equation types' },

    // Chapter 10-11: Vectors & 3D
    { type: 'vector-voyager', name: 'Vector Voyager', description: 'Spaceship cockpit: 3D vector operations' },
    { type: '3d-architect', name: '3D Architect', description: '3D building: geometric formulas' },

    // Chapter 12-13: Optimization & Probability
    { type: 'optima-outpost', name: 'Optima Outpost', description: 'Frontier trading: linear programming' },
    { type: 'bayes-bazaar', name: 'Bayes Bazaar', description: 'Indian market: probability strategies' },
  ]
}
