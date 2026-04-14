/**
 * Session Builder — exam-agnostic.
 * Builds a study session from a concept pool using the syllabus config ratios.
 *
 * Session composition (from SyllabusConfig.sessionComposition):
 *   review    — due concepts, lowest R first (most urgent)
 *   new       — unseen concepts, lowest pyqTier first (highest exam frequency)
 *   strengthen — conscious but not yet due (keep building)
 *   challenge  — automatic concepts (prevent decay of mastered items)
 *
 * Subject interleaving: weighted by SubjectConfig.weight.
 * Never shows 2 concepts from the same subject in a row.
 */

import type { SessionItem, SyllabusConfig, Queue, FatigueLevel, SessionComposition } from './types';
import { calculateR, isDue } from './fsrs';
import { getTimeOptimizedComposition, applyRIFAdjustment } from './scheduler';
import { getAdaptiveSessionLength } from './metacognition';

// ─── Session Builder ──────────────────────────────────────────────────────────

/**
 * Build a study session from the concept pool.
 *
 * @param config       Syllabus config (concepts + composition ratios)
 * @param totalQ       Base session length (default 20); may be reduced by fatigue
 * @param hour         Current hour of day (0–23); enables time-of-day composition
 * @param fatigueLevel Detected fatigue level; reduces session length when tiring/fatigued
 */
export const buildSession = (
  config: SyllabusConfig,
  totalQ: number = 20,
  hour?: number,
  fatigueLevel?: FatigueLevel
): SessionItem[] => {
  // Layer 8 — Adaptive session length based on fatigue
  const adaptedQ = fatigueLevel ? getAdaptiveSessionLength(fatigueLevel, totalQ) : totalQ;

  // Layer 4 — Time-of-day composition override; fall back to config defaults
  const comp: SessionComposition = hour !== undefined
    ? getTimeOptimizedComposition(hour)
    : config.sessionComposition;

  const concepts = config.concepts;

  // Layer 6 — Apply RIF adjustment before sorting the review queue
  const rifAdjusted = applyRIFAdjustment(concepts);

  // Bucket concepts by queue type
  const due = rifAdjusted
    .filter(c => c.stage !== 'Unseen' && isDue(c))
    .sort((a, b) => calculateR(a.stability, a.lastTested) - calculateR(b.stability, b.lastTested));

  const newConcepts = concepts
    .filter(c => c.stage === 'Unseen')
    .sort((a, b) => a.pyqTier - b.pyqTier); // Tier 1 (highest frequency) first

  const strengthen = concepts
    .filter(c => c.stage === 'Conscious' && !isDue(c));

  const challenge = concepts
    .filter(c => c.stage === 'Automatic' || c.stage === 'ExamReady');

  // Calculate slots per queue
  const slots = {
    review:     Math.floor(adaptedQ * comp.review),
    new:        Math.floor(adaptedQ * comp.new),
    strengthen: Math.floor(adaptedQ * comp.strengthen),
    challenge:  adaptedQ
      - Math.floor(adaptedQ * comp.review)
      - Math.floor(adaptedQ * comp.new)
      - Math.floor(adaptedQ * comp.strengthen),
  };

  // Layer 3 — Mark ~40% of new-queue items as pre-tests
  const newItems = newConcepts.slice(0, slots.new);
  const preTestCount = Math.round(newItems.length * 0.4);

  // Fill pool
  const pool: SessionItem[] = [
    ...due.slice(0, slots.review).map(c => ({
      concept: c,
      queue: 'review' as Queue,
      retrievability: calculateR(c.stability, c.lastTested),
    })),
    ...newItems.map((c, i) => ({
      concept: c,
      queue: 'new' as Queue,
      retrievability: 0,
      isPreTest: i < preTestCount,   // first 40% of new items are pre-tests
    })),
    ...strengthen.slice(0, slots.strengthen).map(c => ({
      concept: c,
      queue: 'strengthen' as Queue,
      retrievability: calculateR(c.stability, c.lastTested),
    })),
    ...challenge.slice(0, slots.challenge).map(c => ({
      concept: c,
      queue: 'challenge' as Queue,
      retrievability: calculateR(c.stability, c.lastTested),
    })),
  ];

  // Interleave by subject weight — never 2 same subject in a row
  const interleaved = interleaveByWeight(pool, config);

  // Layer 5 — Pair related concepts within ~3 positions for synaptic tagging
  return pairRelatedConcepts(interleaved);
};

// ─── Layer 5: Synaptic Tagging — Related Concept Pairing ─────────────────────

/**
 * After interleaving, ensure mechanistically related concepts appear within
 * 3 positions of each other.
 *
 * Science: Synaptic tagging (STC) — two related learning events within ~2h
 * mutually reinforce each other's consolidation by 30–40%.
 */
const pairRelatedConcepts = (session: SessionItem[]): SessionItem[] => {
  const result = [...session];
  const sessionIdSet = new Set(result.map(item => item.concept.id));

  for (let i = 0; i < result.length; i++) {
    const relatedIds = result[i].concept.relatedIds;
    if (!relatedIds || relatedIds.length === 0) continue;

    for (const relatedId of relatedIds) {
      if (!sessionIdSet.has(relatedId)) continue; // not in this session

      const relatedIdx = result.findIndex((r, idx) => idx > i && r.concept.id === relatedId);
      if (relatedIdx === -1) continue; // already before current position

      const targetIdx = Math.min(i + 3, result.length - 1);
      if (relatedIdx > targetIdx) {
        const [removed] = result.splice(relatedIdx, 1);
        result.splice(targetIdx, 0, removed);
      }
      break; // only pair one related concept per item
    }
  }

  return result;
};

// ─── Subject Interleaving ─────────────────────────────────────────────────────

/**
 * Reorders session items so subjects are interleaved by weight.
 * e.g. Bio 50% / Chem 25% / Phys 25% → Bio appears roughly every other question.
 */
const interleaveByWeight = (
  pool: SessionItem[],
  config: SyllabusConfig
): SessionItem[] => {
  const interleaved: SessionItem[] = [];
  let lastSubject: string | null = null;

  // Build subject priority queue based on weights
  const subjectWeights: Record<string, number> = {};
  for (const s of config.subjects) {
    subjectWeights[s.name] = s.weight;
  }

  const remaining = [...pool];

  while (interleaved.length < pool.length && remaining.length > 0) {
    // Prefer: different subject from last, highest-weight subject
    let best = -1;
    let bestScore = -Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const item = remaining[i];
      const sameAsLast = item.concept.subject === lastSubject;
      const weight = subjectWeights[item.concept.subject] ?? 0.1;
      // Score: penalize same-as-last, reward by weight
      const score = (sameAsLast ? -10 : 0) + weight;
      if (score > bestScore) {
        bestScore = score;
        best = i;
      }
    }

    if (best === -1) best = 0;
    interleaved.push(remaining[best]);
    lastSubject = remaining[best].concept.subject;
    remaining.splice(best, 1);
  }

  return interleaved;
};
