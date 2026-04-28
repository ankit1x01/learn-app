/**
 * Bridge between Quiz component and FSRS spaced repetition engine.
 * Converts quiz performance into FSRS metric updates.
 */

import { updateFSRSFromQuiz } from '@/core/fsrs';
import type { Concept } from '@/core/types';

export interface QuizStats {
  correctCount: number;
  totalCount: number;
  percentage: number;
  difficulty: number;
  stability: number;
}

/**
 * Apply quiz results to a concept's FSRS metrics.
 * Updates stability, difficulty, and stage based on quiz performance.
 *
 * @param concept The concept to update
 * @param quizStats Quiz performance stats
 * @returns Updated concept with new FSRS values
 */
export function applyQuizToFSRS(concept: Concept, quizStats: QuizStats): Partial<Concept> {
  const fsrsUpdate = updateFSRSFromQuiz(
    concept.stage || 'Unseen',
    concept.stability || 0,
    concept.difficulty || 0.5,
    quizStats.percentage,
    quizStats.totalCount
  );

  return {
    stability: fsrsUpdate.stability,
    difficulty: fsrsUpdate.difficulty,
    stage: fsrsUpdate.stage,
    lastTested: Date.now(),
    nextReview: Date.now() + fsrsUpdate.nextReviewDays * 24 * 60 * 60 * 1000,
  };
}

/**
 * Get a human-readable message about FSRS updates.
 */
export function getQuizFeedbackMessage(
  oldStability: number,
  newStability: number,
  percentage: number
): string {
  const stabilityGain = newStability - oldStability;

  if (percentage >= 80) {
    return `Excellent! Stability increased from ${oldStability.toFixed(1)} to ${newStability.toFixed(1)} days (+${stabilityGain.toFixed(1)})`;
  } else if (percentage >= 60) {
    return `Good attempt! Stability at ${newStability.toFixed(1)} days. Review the explanations.`;
  } else {
    return `Keep learning! Stability reset to ${newStability.toFixed(1)} days.`;
  }
}

/**
 * Calculate days until next review.
 */
export function daysUntilNextReview(nextReviewMs: number): number {
  const daysRemaining = (nextReviewMs - Date.now()) / (24 * 60 * 60 * 1000);
  return Math.ceil(Math.max(0, daysRemaining));
}

/**
 * Save quiz stats to localStorage for FSRS integration.
 */
export function saveQuizStatsForFSRS(lessonId: string, quizStats: QuizStats): void {
  const saved = JSON.parse(localStorage.getItem('lessonQuizStats') || '{}');
  saved[lessonId] = {
    ...quizStats,
    timestamp: Date.now(),
  };
  localStorage.setItem('lessonQuizStats', JSON.stringify(saved));
}

/**
 * Get saved quiz stats from localStorage.
 */
export function getQuizStatsFromStorage(lessonId: string): QuizStats | null {
  const saved = JSON.parse(localStorage.getItem('lessonQuizStats') || '{}');
  return saved[lessonId] || null;
}
