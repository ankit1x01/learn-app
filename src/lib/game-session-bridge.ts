/**
 * Bridge between Learning Games and Session items.
 * Converts game challenges into SessionItems for study sessions.
 */

import type { SessionItem, Queue, Concept } from '@/core/types';

/**
 * Game types that can be mixed into sessions for variety and engagement.
 * Each type tracks performance for spaced repetition.
 */
export type GameType = 'ghana-patha' | 'distractor-training' | 'morning-recall' | 'stress-mode';

export interface GameChallenge {
  id: string;
  type: GameType;
  conceptId: string;
  concept: Concept;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number; // seconds
  description: string;
}

/**
 * Extended SessionItem that can hold either a Concept, Quiz, or Game challenge.
 */
export interface SessionItemWithGame extends Omit<SessionItem, 'concept'> {
  concept?: Concept;
  game?: GameChallenge;
  type: 'concept' | 'quiz' | 'game';
}

/**
 * Game performance tracking for FSRS updates.
 */
export interface GamePerformance {
  gameType: GameType;
  conceptId: string;
  completed: boolean;
  timeMs: number;
  accuracy?: number; // 0-1 for tasks with measurable accuracy
  date: number;
}

/**
 * Create a game challenge from a concept.
 */
export function createGameChallenge(
  concept: Concept,
  type: GameType,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): GameChallenge {
  const descriptions: Record<GameType, string> = {
    'ghana-patha': 'Verbalize the pattern: state the key insight + complexity',
    'distractor-training': 'Identify the correct concept among distractors',
    'morning-recall': 'Quick recall: remember this concept from your recent studies',
    'stress-mode': 'Rapid fire: answer quickly without overthinking',
  };

  return {
    id: `${type}_${concept.id}_${Date.now()}`,
    type,
    conceptId: concept.id,
    concept,
    difficulty,
    description: descriptions[type],
    timeLimit: type === 'ghana-patha' ? 15 : type === 'stress-mode' ? 5 : undefined,
  };
}

/**
 * Convert a game challenge into a session-compatible format.
 */
export function gameToSessionItem(challenge: GameChallenge): SessionItemWithGame {
  return {
    type: 'game',
    game: challenge,
    queue: 'challenge',
    retrievability: 0.5,
  };
}

/**
 * Generate suitable games for a session based on concept pool.
 * Selects concepts and assigns game types based on difficulty and stage.
 */
export function generateGamesForSession(
  concepts: Concept[],
  count: number = 3
): GameChallenge[] {
  const games: GameChallenge[] = [];
  const selected = new Set<string>();

  // Automatic concepts → Ghana Patha (verbalization challenge)
  const automatic = concepts.filter(c => c.stage === 'Automatic' && !selected.has(c.id));
  for (let i = 0; i < Math.min(count / 3, automatic.length); i++) {
    games.push(createGameChallenge(automatic[i], 'ghana-patha', 'easy'));
    selected.add(automatic[i].id);
  }

  // Conscious concepts → Morning Recall (quick practice)
  const conscious = concepts.filter(c => c.stage === 'Conscious' && !selected.has(c.id));
  for (let i = 0; i < Math.min(count / 3, conscious.length); i++) {
    games.push(createGameChallenge(conscious[i], 'morning-recall', 'medium'));
    selected.add(conscious[i].id);
  }

  // Mixed difficulty → Distractor Training (concept discrimination)
  const mixed = concepts.filter(c => !selected.has(c.id));
  for (let i = 0; i < Math.min(count / 3, mixed.length); i++) {
    const difficulty = mixed[i].difficulty > 0.7 ? 'hard' : 'medium';
    games.push(createGameChallenge(mixed[i], 'distractor-training', difficulty));
    selected.add(mixed[i].id);
  }

  return games.slice(0, count);
}

/**
 * Mix game challenges into a session at a specified ratio.
 */
export function mixGamesIntoSession(
  sessionItems: SessionItem[],
  gameItems: SessionItemWithGame[],
  gameRatio: number = 0.1 // 10% games by default
): SessionItemWithGame[] {
  if (gameItems.length === 0) {
    return sessionItems.map(item => ({ ...item, type: 'concept' as const }));
  }

  const gameSlots = Math.max(1, Math.floor(sessionItems.length * gameRatio));
  const gamesToAdd = gameItems.slice(0, gameSlots);

  const mixed: SessionItemWithGame[] = [
    ...sessionItems.map(item => ({ ...item, type: 'concept' as const })),
    ...gamesToAdd,
  ];

  // Spread games throughout session
  return spreadGamesEvenly(mixed);
}

/**
 * Spread game items evenly throughout the session to avoid clustering.
 */
function spreadGamesEvenly(items: SessionItemWithGame[]): SessionItemWithGame[] {
  const gameCount = items.filter(i => i.type === 'game').length;
  if (gameCount === 0) return items;

  const result = [...items];
  const spacing = Math.floor(result.length / (gameCount + 1));

  // Extract all games
  const games = result.filter(i => i.type === 'game');
  const nonGames = result.filter(i => i.type !== 'game');

  // Redistribute: insert games at regular intervals
  const redistributed: SessionItemWithGame[] = [];
  for (let i = 0; i < nonGames.length; i++) {
    redistributed.push(nonGames[i]);
    if ((i + 1) % spacing === 0 && games.length > 0) {
      redistributed.push(games.shift()!);
    }
  }

  // Add any remaining games at the end
  redistributed.push(...games);

  return redistributed;
}

/**
 * Track game performance in localStorage for FSRS updates.
 */
export function saveGamePerformance(performance: GamePerformance): void {
  const stored = JSON.parse(localStorage.getItem('game_performance') || '[]');
  stored.push(performance);
  localStorage.setItem('game_performance', JSON.stringify(stored));
}

/**
 * Retrieve all game performance records.
 */
export function getGamePerformanceHistory(): GamePerformance[] {
  return JSON.parse(localStorage.getItem('game_performance') || '[]');
}

/**
 * Get recent game performance for a specific concept (last 7 days).
 */
export function getConceptGamePerformance(conceptId: string): GamePerformance[] {
  const all = getGamePerformanceHistory();
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return all.filter(p => p.conceptId === conceptId && p.date > sevenDaysAgo);
}

/**
 * Calculate success rate from game performances.
 */
export function calculateGameSuccessRate(performances: GamePerformance[]): number {
  if (performances.length === 0) return 0.5;
  const completed = performances.filter(p => p.completed).length;
  return completed / performances.length;
}
