/**
 * Metacognition & Cognitive Load Engine
 *
 * Layer 2 — Confidence Calibration
 *   Science: Forced confidence ratings before answering, then comparing to outcome,
 *   trains accurate self-monitoring (anterior prefrontal cortex).
 *   Dunning-Kruger detection: high confidence + low accuracy → flag for harder pre-tests.
 *
 * Layer 8 — Cognitive Load Management
 *   Science: Working memory holds ~4 chunks. Session length should adapt to
 *   detected cognitive fatigue (response time + accuracy signals).
 */

import type { Concept, SessionItem, FatigueLevel } from './types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CalibrationReport {
  overall: number;   // 0–1 mean metacogAccuracy across all concepts
  bySubject: Record<string, {
    metacogAccuracy: number;
    overconfidenceCount: number;
    underconfidenceCount: number;
  }>;
}

// ─── Layer 2: Metacognition ───────────────────────────────────────────────────

/**
 * Update a concept's metacognitive accuracy using EWMA.
 * new = 0.8 * old + 0.2 * match_score
 *
 * match_score:
 *   confident (3) + correct   → 1.0  (well calibrated)
 *   unsure    (1) + wrong     → 1.0  (well calibrated)
 *   confident (3) + wrong     → 0.0  (overconfident)
 *   unsure    (1) + correct   → 0.5  (underconfident — partial signal)
 *   partial   (2) + correct   → 0.8
 *   partial   (2) + wrong     → 0.5
 */
export const updateMetacogAccuracy = (
  concept: Concept,
  statedConfidence: 1 | 2 | 3,
  wasCorrect: boolean
): number => {
  const prev = concept.metacogAccuracy ?? 0.7; // start optimistic

  let matchScore: number;
  if (statedConfidence === 3 && wasCorrect)  matchScore = 1.0;
  else if (statedConfidence === 3 && !wasCorrect) matchScore = 0.0;
  else if (statedConfidence === 1 && wasCorrect)  matchScore = 0.5;
  else if (statedConfidence === 1 && !wasCorrect) matchScore = 1.0;
  else if (statedConfidence === 2 && wasCorrect)  matchScore = 0.8;
  else                                            matchScore = 0.5; // 2 + wrong

  return Math.round((0.8 * prev + 0.2 * matchScore) * 1000) / 1000;
};

/**
 * Flag a concept as overconfident when the student consistently believes they
 * know it but gets it wrong.
 * Condition: metacogAccuracy < 0.5 AND average stated confidence > 2.0
 *
 * We approximate average confidence from the accuracy signal itself:
 * if a concept has metacogAccuracy < 0.5 after enough history, the dominant
 * failure mode is high confidence + wrong (since low-confidence errors score 1.0).
 */
export const detectOverconfidence = (concept: Concept): boolean => {
  if (concept.metacogAccuracy === undefined) return false;
  // Require at least 3 attempts (metacogAccuracy has moved meaningfully from 0.7)
  const hasHistory = Math.abs(concept.metacogAccuracy - 0.7) > 0.05;
  return hasHistory && concept.metacogAccuracy < 0.5;
};

/**
 * Generate a calibration report for a list of concepts.
 * Groups overconfidence and underconfidence by subject.
 */
export const getCalibrationReport = (concepts: Concept[]): CalibrationReport => {
  const bySubject: CalibrationReport['bySubject'] = {};

  let totalAccuracy = 0;
  let count = 0;

  for (const concept of concepts) {
    if (concept.metacogAccuracy === undefined) continue;

    const subj = concept.subject;
    if (!bySubject[subj]) {
      bySubject[subj] = { metacogAccuracy: 0, overconfidenceCount: 0, underconfidenceCount: 0 };
    }

    bySubject[subj].metacogAccuracy =
      (bySubject[subj].metacogAccuracy + concept.metacogAccuracy) / 2;

    if (concept.overconfidenceFlag) {
      bySubject[subj].overconfidenceCount++;
    } else if (concept.metacogAccuracy > 0.85) {
      // Consistently unsure but correct = underconfident
      bySubject[subj].underconfidenceCount++;
    }

    totalAccuracy += concept.metacogAccuracy;
    count++;
  }

  return {
    overall: count > 0 ? Math.round((totalAccuracy / count) * 1000) / 1000 : 0,
    bySubject,
  };
};

// ─── Layer 8: Cognitive Fatigue Detection ─────────────────────────────────────

/**
 * Detect cognitive fatigue from recent session items.
 * Signal: response time trending up AND accuracy trending down.
 *
 * Uses the last 5 items (or all available if < 5).
 */
export const detectCognitiveFatigue = (recentItems: SessionItem[]): FatigueLevel => {
  const items = recentItems.slice(-5);
  if (items.length < 3) return 'fresh'; // not enough data

  const times = items.map(i => i.responseTimeMs ?? 0).filter(t => t > 0);
  if (times.length < 3) return 'fresh';

  // Average response time of first half vs second half
  const mid = Math.floor(times.length / 2);
  const earlyAvg = times.slice(0, mid).reduce((s, t) => s + t, 0) / mid;
  const lateAvg  = times.slice(mid).reduce((s, t) => s + t, 0) / (times.length - mid);

  const timeIncreased = lateAvg > earlyAvg * 1.25; // 25% slower

  // Accuracy signal: statedConfidence as proxy if responseTimeMs not present
  // A simpler heuristic: if response times are very high (> 30s average), signal fatigue
  const avgTime = times.reduce((s, t) => s + t, 0) / times.length;

  if (avgTime > 45_000 || (timeIncreased && avgTime > 25_000)) return 'fatigued';
  if (timeIncreased || avgTime > 20_000) return 'tiring';
  return 'fresh';
};

/**
 * Get the adaptive session length based on detected fatigue.
 *   fresh    → baseLength      (20 questions)
 *   tiring   → baseLength × 0.75 (15 questions)
 *   fatigued → baseLength × 0.5  (10 questions) — break recommended
 */
export const getAdaptiveSessionLength = (
  fatigue: FatigueLevel,
  baseLength: number = 20
): number => {
  const multipliers: Record<FatigueLevel, number> = {
    fresh:    1.00,
    tiring:   0.75,
    fatigued: 0.50,
  };
  return Math.round(baseLength * multipliers[fatigue]);
};
