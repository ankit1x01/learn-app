/**
 * Scheduler — exam-agnostic.
 * Answers: what does this student need to study today, and why?
 *
 * Uses FSRS retrievability to surface the most urgent concepts
 * and projects forgetting curves into the future.
 */

import type { Concept, SyllabusConfig, SubjectStats, SessionComposition } from './types';
import { calculateR, isDue, RECALL_THRESHOLD, daysSinceStudied } from './fsrs';

// ─── Due Today ────────────────────────────────────────────────────────────────

/** All concepts currently below recall threshold (due for review) */
export const getDueToday = (concepts: Concept[]): Concept[] =>
  concepts.filter(isDue).sort((a, b) =>
    calculateR(a.stability, a.lastTested) - calculateR(b.stability, b.lastTested)
  );

/** How many concepts will become due in the next N days */
export const getDueSoon = (concepts: Concept[], withinDays: number): Concept[] => {
  const futureMs = withinDays * 24 * 60 * 60 * 1000;
  return concepts.filter(c => {
    if (c.stage === 'Unseen') return false;
    // Simulate lastTested as if it were futureMs further in the past
    const simulatedLastTested = c.lastTested > 0 ? c.lastTested - futureMs : c.lastTested;
    return calculateR(c.stability, simulatedLastTested) < RECALL_THRESHOLD;
  });
};

// ─── Forgetting Curve ─────────────────────────────────────────────────────────

/** Retrievability at each day in the future for a concept */
export const getForgettingCurve = (
  concept: Concept,
  days: number = 30
): { day: number; r: number }[] => {
  const dayMs = 24 * 60 * 60 * 1000;
  return Array.from({ length: days }, (_, i) => ({
    day: i,
    // Simulate concept as if studied (i) days ago by back-shifting lastTested
    r: calculateR(concept.stability, concept.lastTested > 0
      ? concept.lastTested - i * dayMs
      : -1),
  }));
};

// ─── Exam Readiness ───────────────────────────────────────────────────────────

/**
 * Estimate correct answers for a subject given current mastery.
 * Based on empirical P(correct) per stage:
 *   Automatic  → 92% correct
 *   Conscious  → 62% correct
 *   Fragile    → 30% correct
 *   Unseen     → 22% correct (guessing + partial knowledge)
 */
export const estimateCorrect = (
  stats: SubjectStats,
  totalConcepts: number,
  examQuestions: number
): number => {
  const pCorrect =
    (stats.auto * 0.92 + stats.conscious * 0.62 + stats.fragile * 0.30 + stats.unseen * 0.22)
    / totalConcepts;
  return Math.round(pCorrect * examQuestions);
};

/** Total estimated correct answers across all subjects */
export const totalExamReadiness = (config: SyllabusConfig): number => {
  return config.subjects.reduce((total, subject) => {
    const stats = config.globalStats[subject.name];
    if (!stats) return total;
    return total + estimateCorrect(stats, subject.totalConcepts, subject.examQuestions);
  }, 0);
};

/** Per-subject readiness breakdown */
export const subjectReadiness = (
  config: SyllabusConfig
): { name: string; correct: number; total: number }[] =>
  config.subjects.map(subject => ({
    name: subject.name,
    correct: estimateCorrect(
      config.globalStats[subject.name] ?? { auto: 0, conscious: 0, fragile: 0, unseen: subject.totalConcepts },
      subject.totalConcepts,
      subject.examQuestions
    ),
    total: subject.examQuestions,
  }));

// ─── Chitta Score ─────────────────────────────────────────────────────────────

/** Total automatic concepts across all subjects (the "Chitta Score") */
export const chittaScore = (config: SyllabusConfig): number =>
  Object.values(config.globalStats).reduce((sum, s) => sum + s.auto, 0);

/** Total concepts across all subjects */
export const totalConcepts = (config: SyllabusConfig): number =>
  config.subjects.reduce((sum, s) => sum + s.totalConcepts, 0);

// ─── Layer 4: Time-of-Day Composition ────────────────────────────────────────

/**
 * Returns session composition ratios optimised for the current hour of day.
 *
 * Science: LC-NE system gates memory encoding.
 *   06–09h  Cortisol peak → best for new material (hippocampal encoding capacity high)
 *   09–12h  Sustained focus → default ratios
 *   12–14h  Post-lunch dip → shift to review
 *   14–17h  Alertness trough → mostly review, minimal new
 *   17–20h  Second wind → balanced with more challenge
 *   20–23h  Pre-sleep window → review + challenge only; new material minimal
 */
export const getTimeOptimizedComposition = (hour: number): SessionComposition => {
  if (hour >= 6  && hour < 9)  return { new: 0.45, review: 0.25, strengthen: 0.20, challenge: 0.10 };
  if (hour >= 9  && hour < 12) return { new: 0.35, review: 0.30, strengthen: 0.25, challenge: 0.10 };
  if (hour >= 12 && hour < 14) return { new: 0.15, review: 0.45, strengthen: 0.30, challenge: 0.10 };
  if (hour >= 14 && hour < 17) return { new: 0.10, review: 0.50, strengthen: 0.30, challenge: 0.10 };
  if (hour >= 17 && hour < 20) return { new: 0.25, review: 0.30, strengthen: 0.30, challenge: 0.15 };
  // 20–23h and all other hours (late night / very early)
  return { new: 0.05, review: 0.55, strengthen: 0.25, challenge: 0.15 };
};

/**
 * Returns a human-readable label for the current session focus.
 * Used for the "Now is a good time for…" dashboard nudge.
 */
export const getTimeOfDayNudge = (hour: number): string => {
  if (hour >= 6  && hour < 9)  return 'new concepts — your brain is primed for encoding';
  if (hour >= 9  && hour < 12) return 'deep study — sustained focus window';
  if (hour >= 12 && hour < 14) return 'light review — post-lunch, keep it easy';
  if (hour >= 14 && hour < 17) return 'review only — alertness is low, avoid new material';
  if (hour >= 17 && hour < 20) return 'balanced review + challenge';
  return 'pre-sleep review — what you study now gets replayed tonight';
};

// ─── Layer 6: Retrieval-Induced Forgetting Adjustment ─────────────────────────

/**
 * Adjust effective lastTested for concepts being suppressed by recently-reviewed
 * competitors (Retrieval-Induced Forgetting).
 *
 * Science: Practicing concept A actively suppresses competing concept B.
 * Strategy: surface suppressed concepts slightly earlier than FSRS alone suggests.
 *
 * Returns cloned concepts with adjusted lastTested — does NOT mutate originals.
 */
export const applyRIFAdjustment = (concepts: Concept[]): Concept[] => {
  const now = Date.now();
  const twoDaysMs = 2 * 24 * 60 * 60 * 1000;

  return concepts.map(concept => {
    if (!concept.competingIds || concept.competingIds.length === 0) return concept;

    const activeCompetitors = concepts.filter(c =>
      concept.competingIds!.includes(c.id) &&
      c.lastStudiedAt !== undefined &&
      c.lastStudiedAt > now - twoDaysMs
    );

    if (activeCompetitors.length === 0) return concept;

    const interferenceScore = concept.interferenceScore ?? 0.3;
    // Shift lastTested earlier (further in the past) → concept appears more overdue → surfaces earlier
    // We reduce the timestamp by interferenceScore * 0.5 days expressed in ms
    const shiftMs = interferenceScore * 0.5 * 24 * 60 * 60 * 1000;
    return { ...concept, lastTested: concept.lastTested - shiftMs };
  });
};

// ─── Layer 7: Sleep-Optimised Recall Sets ────────────────────────────────────

/**
 * Returns concepts for the Morning Recall session.
 *
 * Science: Hippocampal replay during NREM sleep preferentially consolidates
 * the last material studied before sleep. Morning free recall (first 20 min)
 * engages the same hippocampal→neocortex transfer pathway.
 *
 * Selects concepts that:
 *   1. Were last studied 6–14h ago (studied last night, before sleep)
 *   2. Are Fragile or Conscious (most benefit from consolidation)
 *   3. Sorted by stakesTier ASC (exam-critical first), then R ASC (most urgent)
 */
export const getMorningRecallSet = (
  concepts: Concept[],
  maxItems: number = 10
): Concept[] => {
  const now = Date.now();
  const sixHoursAgo      = now - 6  * 60 * 60 * 1000;
  const fourteenHoursAgo = now - 14 * 60 * 60 * 1000;

  return concepts
    .filter(c =>
      c.lastStudiedAt !== undefined &&
      c.lastStudiedAt >= fourteenHoursAgo &&
      c.lastStudiedAt <= sixHoursAgo &&
      (c.stage === 'Fragile' || c.stage === 'Conscious')
    )
    .sort((a, b) => {
      const tierDiff = (a.stakesTier ?? 3) - (b.stakesTier ?? 3);
      if (tierDiff !== 0) return tierDiff;
      return calculateR(a.stability, a.lastTested) - calculateR(b.stability, b.lastTested);
    })
    .slice(0, maxItems);
};

/**
 * Returns concepts for the Pre-Sleep Review session (20–22h window).
 *
 * Science: Material studied in the pre-sleep window gets maximum NREM replay time.
 * Focus on high-stakes Fragile/Conscious concepts not studied in the last 4h
 * (avoid massed repetition).
 */
export const getPreSleepReviewSet = (
  concepts: Concept[],
  maxItems: number = 8
): Concept[] => {
  const now = Date.now();
  const fourHoursAgo = now - 4 * 60 * 60 * 1000;

  return concepts
    .filter(c =>
      (c.stage === 'Fragile' || c.stage === 'Conscious') &&
      c.stakesTier === 1 &&
      (c.lastStudiedAt === undefined || c.lastStudiedAt < fourHoursAgo)
    )
    .sort((a, b) => calculateR(a.stability, a.lastTested) - calculateR(b.stability, b.lastTested))
    .slice(0, maxItems);
};
