/**
 * FSRS Spaced Repetition Engine
 * Free Spaced Repetition Scheduler (2023) — exam-agnostic implementation.
 *
 * Core formula: R = e^(-t/S)
 *   R = Retrievability (probability of recall right now, 0–1)
 *   t = days since last tested
 *   S = Stability (days memory lasts)
 *
 * A concept is due when R drops below the RECALL_THRESHOLD.
 */

import type { Concept, Stage, EncodingDepth } from './types';

// ─── Constants ────────────────────────────────────────────────────────────────

/** Concept is due for review when retrievability drops below this */
export const RECALL_THRESHOLD = 0.85;

/** Initial stability values (days) per stage after first learning */
const INITIAL_STABILITY: Record<Stage, number> = {
  Unseen:    0,
  Fragile:   2,
  Conscious: 10,
  Automatic: 45,
  ExamReady: 90,
};

// ─── Core Functions ───────────────────────────────────────────────────────────

/** ms per day constant */
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Convert a lastTested Unix timestamp (ms) to elapsed days.
 * lastTested === -1 means never studied → returns a very large number so R ≈ 0.
 */
export const daysSinceStudied = (lastTestedMs: number): number => {
  if (lastTestedMs < 0) return 9999; // never studied
  return Math.max(0, (Date.now() - lastTestedMs) / MS_PER_DAY);
};

/**
 * Calculate current retrievability for a concept.
 * R = e^(-t/S)   where t = elapsed days since last study
 */
export const calculateR = (stability: number, lastTestedMs: number): number => {
  if (stability <= 0) return 0;
  const t = daysSinceStudied(lastTestedMs);
  return Math.exp(-t / stability);
};

/**
 * Returns true if a concept needs review now (R < threshold).
 */
export const isDue = (concept: Concept): boolean => {
  if (concept.stage === 'Unseen') return false;
  return calculateR(concept.stability, concept.lastTested) < RECALL_THRESHOLD;
};

/**
 * Update stability after a correct answer (memory strengthened).
 * New S = S * e^(0.1 * (1 - R))  — bigger boost when recall was harder
 *
 * Layer 2 — Metacognition bonus:
 *   statedConfidence=1 (unsure) + correct → +30% boost
 *   Rationale: uncertainty + success = desirable difficulty → stronger trace
 */
export const updateStabilityOnSuccess = (
  stability: number,
  retrievability: number,
  statedConfidence?: 1 | 2 | 3 | null
): number => {
  const boost = Math.exp(0.1 * (1 - retrievability));
  const confidenceMultiplier = statedConfidence === 1 ? 1.3 : 1.0;
  return Math.round(stability * boost * confidenceMultiplier * 10) / 10;
};

/**
 * Update stability after a wrong answer (memory reset toward fragile).
 * Forgetting reduces stability significantly.
 */
export const updateStabilityOnFailure = (stability: number): number => {
  return Math.max(1, Math.round(stability * 0.3 * 10) / 10);
};

/**
 * Update difficulty after an answer.
 * Correct → difficulty decreases slightly (getting easier for this student)
 * Wrong   → difficulty increases (confirmed hard)
 */
export const updateDifficulty = (difficulty: number, correct: boolean): number => {
  const delta = correct ? -0.08 : +0.15;
  return Math.min(1, Math.max(0, Math.round((difficulty + delta) * 100) / 100));
};

/**
 * Advance stage after a correct answer.
 */
export const advanceStage = (stage: Stage): Stage => {
  const progression: Record<Stage, Stage> = {
    Unseen:    'Fragile',
    Fragile:   'Conscious',
    Conscious: 'Automatic',
    Automatic: 'ExamReady',
    ExamReady: 'ExamReady',
  };
  return progression[stage];
};

/**
 * Regress stage after a wrong answer.
 */
export const regressStage = (stage: Stage): Stage => {
  const regression: Record<Stage, Stage> = {
    Unseen:    'Unseen',
    Fragile:   'Unseen',
    Conscious: 'Fragile',
    Automatic: 'Conscious',
    ExamReady: 'Automatic',
  };
  return regression[stage];
};

/**
 * Calculate days until next review given updated stability.
 * nextReview = S * ln(1 / RECALL_THRESHOLD)
 */
export const getNextReviewDays = (stability: number): number => {
  return Math.round(stability * Math.log(1 / RECALL_THRESHOLD));
};

/**
 * Get initial stability for a concept entering a new stage.
 */
export const getInitialStability = (stage: Stage): number => {
  return INITIAL_STABILITY[stage];
};

// ─── Layer 1: Encoding Depth Multiplier ───────────────────────────────────────

/**
 * Returns a stability multiplier based on how deeply the student encoded the concept.
 * Science: Levels of processing (Craik & Lockhart) — semantic/self-referential
 * encoding produces 3–4× more durable traces than shallow reading.
 */
export const getEncodingMultiplier = (depth: EncodingDepth): number => {
  const multipliers: Record<EncodingDepth, number> = {
    'shallow':   1.0,
    'own-words': 1.6,
    'connected': 2.4,
  };
  return multipliers[depth];
};

/**
 * Get initial stability for a new concept, adjusted for encoding depth.
 * Multiplies INITIAL_STABILITY['Fragile'] by the encoding depth multiplier.
 */
export const getInitialStabilityWithEncoding = (depth: EncodingDepth): number => {
  return Math.round(INITIAL_STABILITY['Fragile'] * getEncodingMultiplier(depth) * 10) / 10;
};

// ─── Layer 3: Prediction Error Bonus ─────────────────────────────────────────

/**
 * Returns a stability multiplier for the prediction error effect.
 * When a student gets a concept wrong on a pre-test and then learns it,
 * the dopamine signal from violated expectation strengthens the subsequent memory trace.
 *
 * Call this when recording a correct answer on a concept that had a prior pre-test failure.
 */
export const getPredictionErrorMultiplier = (hadPriorPreTestError: boolean): number => {
  return hadPriorPreTestError ? 1.5 : 1.0;
};

/**
 * Update stability accounting for the prediction error effect.
 * Named function matching the plan spec.
 *
 * @param stability   Current stability value
 * @param wasPreTest  Whether this item was presented as a pre-test (question before explanation)
 * @param wasCorrect  Whether the student answered correctly
 *
 * Usage pattern:
 *  - wasPreTest && !wasCorrect → prediction error occurred; caller records in predictionErrorHistory;
 *    returns stability unchanged (bonus deferred to next correct encounter)
 *  - wasPreTest && wasCorrect  → student answered right on first exposure; no error signal; no bonus
 *  - !wasPreTest && wasCorrect → normal success with prior pre-test error in history:
 *    caller should pass hadPriorPreTestError=true to getPredictionErrorMultiplier instead
 *
 * For the full bonus on subsequent correct answers, combine with getPredictionErrorMultiplier.
 */
export const updateStabilityWithPredictionError = (
  stability: number,
  wasPreTest: boolean,
  wasCorrect: boolean
): number => {
  if (!wasPreTest) return stability;
  if (!wasCorrect) return stability; // error occurred; bonus applied on subsequent correct answer
  // Pre-test was correct — no prediction error, no special multiplier
  return stability;
};

// ─── Quiz-Based FSRS Updates ──────────────────────────────────────────────────

/**
 * Update FSRS metrics based on quiz performance.
 * Used when student completes AI Engineering course quizzes.
 *
 * @param currentStability Current stability value
 * @param currentDifficulty Current difficulty (0-1)
 * @param percentage Quiz score as percentage (0-100)
 * @param questionCount Total questions answered
 *
 * Returns updated { stability, difficulty, stage } for spaced repetition.
 */
export const updateFSRSFromQuiz = (
  currentStage: Stage,
  currentStability: number,
  currentDifficulty: number,
  percentage: number,
  questionCount: number
) => {
  // Determine if quiz was a success (≥80% threshold)
  const isSuccess = percentage >= 80;
  const retrievability = percentage / 100; // Treat score as proxy for retrieval success

  // Update stability: better performance = stronger memory trace
  let newStability = currentStability;
  if (isSuccess) {
    // Success: boost stability based on confidence (100% correct = highest boost)
    const boost = Math.exp(0.1 * (1 - retrievability));
    newStability = Math.round(currentStability * boost * 10) / 10;
  } else {
    // Failure: reduce stability (memory reset)
    newStability = Math.max(2, Math.round(currentStability * 0.4 * 10) / 10);
  }

  // Update difficulty: correct answers = easier, wrong answers = harder
  const correctCount = Math.round((percentage / 100) * questionCount);
  const incorrectCount = questionCount - correctCount;
  const difficultyDelta = (incorrectCount * 0.1) - (correctCount * 0.05);
  let newDifficulty = Math.min(1, Math.max(0, Math.round((currentDifficulty + difficultyDelta) * 100) / 100));

  // Determine stage advancement based on performance
  // High score = advance, low score = regress
  let stage = currentStage;
  if (percentage >= 80) {
    stage = advanceStage(currentStage);
  } else if (percentage < 60) {
    stage = regressStage(currentStage);
  }

  return {
    stability: newStability,
    difficulty: newDifficulty,
    stage,
    quizScore: percentage,
    nextReviewDays: getNextReviewDays(newStability),
  };
};

export const updateFSRSFromGamePerformance = (
  currentStage: Stage,
  currentStability: number,
  currentDifficulty: number,
  gameScore: number
) => {
  // Simple rule: passed (≥75%) = perfect recall (100%), else failed (0%)
  const percentage = gameScore >= 75 ? 100 : 0;

  // Reuse quiz update logic with fixed questionCount = 1
  return updateFSRSFromQuiz(
    currentStage,
    currentStability,
    currentDifficulty,
    percentage,
    1
  );
};
