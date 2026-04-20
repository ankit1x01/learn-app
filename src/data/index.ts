/**
 * Syllabus Registry
 * Add a new exam here to make it available in the app.
 *
 * Usage:
 *   import { getActiveSyllabus } from './syllabus';
 *   const config = getActiveSyllabus(); // returns active config
 */

import type { SyllabusConfig } from '../core/types';
import { dsaConfig } from './dsa/config';
import { itPlacementConfig } from './itplacement/config';
import { aiEngineerConfig } from './ai_engineer/config';

// Registry of all available syllabi
export const SYLLABUS_REGISTRY: Record<string, SyllabusConfig> = {
  dsa_faang:          dsaConfig,
  it_placement_india: itPlacementConfig,
  ai_engineer:        aiEngineerConfig,
};

// ─── Active Syllabus ──────────────────────────────────────────────────────────
// Change this ID to switch the entire app to a different exam.
// Switch back to 'dsa_faang' to restore the DSA syllabus.

const ACTIVE_SYLLABUS_ID = 'it_placement_india';


export const getActiveSyllabus = (): SyllabusConfig => {
  const config = SYLLABUS_REGISTRY[ACTIVE_SYLLABUS_ID];
  if (!config) throw new Error(`Syllabus '${ACTIVE_SYLLABUS_ID}' not found in registry`);
  return config;
};

export const getSyllabus = (id: string): SyllabusConfig => {
  const config = SYLLABUS_REGISTRY[id];
  if (!config) throw new Error(`Syllabus '${id}' not found in registry`);
  return config;
};
