/**
 * Scenario Performance Integration
 * Tracks scenario completion and updates FSRS for linked concepts
 */

import type { ScenarioName } from './teaching-scenarios';
import { getCurriculumEntry } from './curriculum-mapping';

export interface ScenarioPerformance {
  scenarioId: ScenarioName;
  completedAt: number; // timestamp
  duration: number; // milliseconds
  checkpointsPassed: number;
  checkpointsTotal: number;
  score: number; // 0-100
  conceptIds: string[]; // which concepts were covered
}

/**
 * Record scenario completion
 * Returns performance record suitable for gamePerformanceStore
 */
export function recordScenarioCompletion(
  scenarioId: ScenarioName,
  duration: number,
  checkpointsPassed: number,
  checkpointsTotal: number,
): ScenarioPerformance | null {
  const entry = getCurriculumEntry(scenarioId);
  if (!entry) return null;

  // Calculate score: checkpoints passed + time bonus
  const checkpointScore = (checkpointsPassed / checkpointsTotal) * 80;
  const timeBonus = Math.max(0, 20 - Math.floor(duration / 30)); // Bonus for speed
  const score = Math.min(100, Math.round(checkpointScore + timeBonus));

  return {
    scenarioId,
    completedAt: Date.now(),
    duration,
    checkpointsPassed,
    checkpointsTotal,
    score,
    conceptIds: entry.conceptIds,
  };
}

/**
 * Convert scenario performance to game performance format
 * For compatibility with existing gamePerformanceStore
 */
export function toGamePerformance(performance: ScenarioPerformance) {
  const entry = getCurriculumEntry(performance.scenarioId);
  if (!entry) return null;

  return {
    gameContentId: performance.scenarioId,
    conceptId: performance.conceptIds[0] || performance.scenarioId,
    gameType: 'scenario' as const,
    score: performance.score,
    timeSpent: performance.duration,
    metadata: {
      checkpointsPassed: performance.checkpointsPassed,
      checkpointsTotal: performance.checkpointsTotal,
      allConceptIds: performance.conceptIds,
      subject: entry.subject,
    },
  };
}

/**
 * Storage key for scenario completions
 */
export function getScenarioStorageKey(scenarioId: ScenarioName): string {
  return `scenario_perf_${scenarioId}`;
}

/**
 * Save scenario performance to localStorage
 */
export function saveScenarioPerformance(performance: ScenarioPerformance): void {
  try {
    const key = getScenarioStorageKey(performance.scenarioId);
    localStorage.setItem(key, JSON.stringify(performance));
    console.log(`[ScenarioPerformance] Saved: ${performance.scenarioId}`);
  } catch (err) {
    console.warn('[ScenarioPerformance] Failed to save:', err);
  }
}

/**
 * Load scenario performance from localStorage
 */
export function loadScenarioPerformance(scenarioId: ScenarioName): ScenarioPerformance | null {
  try {
    const key = getScenarioStorageKey(scenarioId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch (err) {
    console.warn('[ScenarioPerformance] Failed to load:', err);
    return null;
  }
}

/**
 * Get all scenario completions
 */
export function getAllScenarioPerformances(): ScenarioPerformance[] {
  const performances: ScenarioPerformance[] = [];
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('scenario_perf_')) {
        const stored = localStorage.getItem(key);
        if (stored) {
          performances.push(JSON.parse(stored));
        }
      }
    });
  } catch (err) {
    console.warn('[ScenarioPerformance] Failed to load all:', err);
  }
  return performances;
}

/**
 * Calculate mastery for a concept across all scenario completions
 * Returns percentage of checkpoints passed on average
 */
export function calculateConceptMastery(conceptId: string): number {
  const performances = getAllScenarioPerformances();
  const relevant = performances.filter((p) => {
    const entry = getCurriculumEntry(p.scenarioId);
    return entry?.conceptIds.includes(conceptId);
  });

  if (relevant.length === 0) return 0;

  const avgCheckpointScore = relevant.reduce((sum, p) => {
    return sum + (p.checkpointsPassed / p.checkpointsTotal) * 100;
  }, 0) / relevant.length;

  return Math.round(avgCheckpointScore);
}
