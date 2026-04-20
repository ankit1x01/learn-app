/**
 * Core engine types — 100% exam-agnostic.
 * No references to NEET, JEE, Biology, Physics, etc.
 * Swap SyllabusConfig to run the same engine for any exam.
 */

// ─── Mastery Stages ───────────────────────────────────────────────────────────

export type Stage = 'Unseen' | 'Fragile' | 'Conscious' | 'Automatic' | 'ExamReady';
export type Queue = 'review' | 'new' | 'strengthen' | 'challenge';

// ─── Neuroscience Layer Types ─────────────────────────────────────────────────

/** Layer 1 — Levels of processing (Craik & Lockhart) */
export type EncodingDepth = 'shallow' | 'own-words' | 'connected';

/** Layer 8 — Cognitive load / fatigue detection */
export type FatigueLevel = 'fresh' | 'tiring' | 'fatigued';

/** Session composition ratios — must sum to 1 */
export interface SessionComposition {
  review: number;
  new: number;
  strengthen: number;
  challenge: number;
}

// ─── Concept (atomic learning unit) ─────────────────────────────────────────

export interface Concept {
  id: string;
  name: string;
  subject: string;      // generic string — set by syllabus layer
  chapter: string;
  unit: number;
    tags?: string[];
  pyqTier: 1 | 2 | 3 | 4;  // exam frequency: 1=highest
  stage: Stage;
  stability: number;    // S: days this memory lasts (FSRS)
  difficulty: number;   // D: 0–1, this student's hardness for this concept
  lastTested: number;   // days since last tested; -1 = never
  nextReview: number;   // days until next due

  // ── Layer 1: Encoding Depth ──────────────────────────────────────────────
  encodingDepth?: EncodingDepth;

  // ── Layer 2: Metacognition & Confidence Calibration ─────────────────────
  metacogAccuracy?: number;       // 0–1 EWMA: how well stated confidence matches outcome
  overconfidenceFlag?: boolean;   // true when accuracy < 0.5 AND avg confidence > 2.0

  // ── Layer 3: Prediction Error / Pre-testing ──────────────────────────────
  predictionErrorHistory?: { date: number; preTestWrong: boolean }[];

  // ── Layer 5: Synaptic Tagging & Capture ──────────────────────────────────
  relatedIds?: string[];          // concept IDs mechanistically related (pair within 2h)

  // ── Layer 6: Retrieval-Induced Forgetting ────────────────────────────────
  competingIds?: string[];        // concepts that interfere with recall of this one
  interferenceScore?: number;     // 0–1, how much this concept is suppressed by competitors

  // ── Layer 7: Sleep & Morning Recall ─────────────────────────────────────
  lastStudiedAt?: number;         // Unix timestamp (ms) of last study event
  stakesTier?: 1 | 2 | 3;        // derived from pyqTier; 1 = highest exam priority

  // ── Layer 9: Emotional Tagging / Stakes Framing ──────────────────────────
  stakesFact?: string;            // one-sentence real-world consequence for this concept
}

export interface SessionItem {
  concept: Concept;
  queue: Queue;
  retrievability: number; // R = e^(-t/S), 0–1

  // ── Layer 2: Metacognition ───────────────────────────────────────────────
  statedConfidence?: 1 | 2 | 3 | null;   // filled before answer shown; 1=unsure 2=partial 3=certain

  // ── Layer 3: Pre-testing ─────────────────────────────────────────────────
  isPreTest?: boolean;     // true = question shown BEFORE concept explanation

  // ── Layer 8: Cognitive Load ──────────────────────────────────────────────
  responseTimeMs?: number; // how long the student took to answer
}

// ─── Subject Configuration ───────────────────────────────────────────────────

export interface SubjectConfig {
  name: string;
  weight: number;         // interleaving weight in session (all weights must sum to 1)
  totalConcepts: number;  // total concepts this subject has in this exam
  examQuestions: number;  // how many questions this subject gets in the exam
  color: string;          // Tailwind text class e.g. 'text-emerald-400'
  bgColor: string;        // Tailwind bg class e.g. 'bg-emerald-400/10'
  barColor: string;       // Tailwind solid bg e.g. 'bg-emerald-400'
  emoji: string;          // display emoji e.g. '🧬'
  encodingTip: string;    // shown to student during ConceptEncoding phase
}

// ─── Per-Subject Mastery Snapshot ────────────────────────────────────────────

export interface SubjectStats {
  auto: number;
  conscious: number;
  fragile: number;
  unseen: number;
}

// ─── Syllabus Configuration (the plug-in contract) ───────────────────────────

/**
 * Everything the core engine needs to run for any exam.
 * NEET, JEE, UPSC, CAT, GATE — all implement this interface.
 *
 * Adding a new exam = implement SyllabusConfig + provide concepts.
 * Zero changes to src/core/.
 */
export interface SyllabusConfig {
  id: string;             // e.g. 'neet_2026'
  name: string;           // e.g. 'NEET UG 2026'
  studentName: string;
  examDate?: string;      // ISO date e.g. '2026-05-03'
  daysRemaining?: number;
  targetScoreLabel?: string;   // e.g. '720/720'
  examScoreTarget?: number;    // e.g. 120 correct out of 180

  subjects: SubjectConfig[];
  concepts: Concept[];

  /** Session composition ratios — must sum to 1 */
  sessionComposition: SessionComposition;

  /** Current mastery snapshot — keyed by subject name */
  globalStats: Record<string, SubjectStats>;

  /** Exam scoring rules */
  scoring?: {
    correct: number;      // e.g. +4
    wrong: number;        // e.g. -1
    skip: number;         // e.g. 0
  };
}

