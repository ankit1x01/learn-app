/**
 * Game Integration Examples
 * Shows how to use GameContentStore and GamePerformanceStore in game components
 */

import { gameContentStore } from './game-content-store';
import { gamePerformanceStore } from './game-performance-store';
import { updateFSRSFromGamePerformance } from '../core/fsrs';
import type { Concept } from '../core/types';

/**
 * Example 1: Render a memory game with content
 */
export async function renderMemoryGame(concept: Concept) {
  // Get memory game content (bundled or generated)
  const content = await gameContentStore.getGameContent('memory', 'memory', {
    concept, // Pass concept for auto-generation if needed
  });

  if (!content) {
    console.log('No content available - game cannot start');
    return;
  }

  // Use content.content to render the game
  const items = content.content.items;
  console.log(`Starting memory game with ${items.length} items:`);
  items.forEach((item: any) => {
    console.log(`  - ${item.name}: ${item.definition}`);
  });

  // Game plays... user attempts/masters
  const userScore = 85; // Example score from game
  const timeSpent = 45000; // ms

  // Record performance
  const performance = await gamePerformanceStore.createPerformance(
    content.id,
    concept.id,
    'memory',
    userScore,
    timeSpent
  );

  console.log(`Performance saved: ${performance.passed ? 'Passed' : 'Failed'}`);

  // Update concept FSRS
  const updated = updateFSRSFromGamePerformance(
    concept.stage as any,
    concept.stability,
    concept.difficulty,
    performance.score
  );

  console.log(`FSRS Updated: ${concept.stage} → ${updated.stage}`);
  console.log(`Next review: ${updated.nextReviewDays} days`);

  return { performance, updated };
}

/**
 * Example 2: Challenge game with fallback
 */
export async function renderChallengeGame(concept: Concept) {
  // Try bundled first, then generate
  let content = await gameContentStore.getGameContent('cs_002', 'challenge');

  if (!content) {
    console.log('Bundled content not found, attempting to generate...');
    content = await gameContentStore.getGameContent('challenge', 'challenge', {
      concept,
    });
  }

  if (!content) {
    console.log('Failed to get or generate content');
    return null;
  }

  // Display challenge
  console.log(`Challenge: ${content.content.question}`);
  content.content.options.forEach((opt: string, i: number) => {
    console.log(`  ${String.fromCharCode(65 + i)}) ${opt}`);
  });

  // Game plays... user selects answer
  const userSelectedIndex = 1; // Example
  const correct = userSelectedIndex === content.content.correctIndex;
  const score = correct ? 100 : 0;

  // Save performance
  await gamePerformanceStore.createPerformance(
    content.id,
    concept.id,
    'challenge',
    score,
    20000
  );

  if (correct) {
    console.log(`✓ Correct! ${content.content.explanation}`);
  } else {
    console.log(`✗ Wrong. ${content.content.explanation}`);
  }

  return { correct, score };
}

/**
 * Example 3: Check what content is available
 */
export async function checkAvailableContent() {
  const memoryItems = await gameContentStore.loadAllContentForGameType('memory');
  const challengeItems = await gameContentStore.loadAllContentForGameType('challenge');
  const simulationItems = await gameContentStore.loadAllContentForGameType(
    'simulation'
  );

  console.log('Available Game Content:');
  console.log(`  Memory games: ${memoryItems.length} items`);
  memoryItems.forEach(item => {
    console.log(`    - ${item.id}: ${item.conceptId}`);
  });

  console.log(`  Challenge games: ${challengeItems.length} items`);
  challengeItems.forEach(item => {
    console.log(`    - ${item.id}: ${item.conceptId}`);
  });

  console.log(`  Simulation games: ${simulationItems.length} items`);
  simulationItems.forEach(item => {
    console.log(`    - ${item.id}: ${item.conceptId}`);
  });

  return {
    memory: memoryItems.length,
    challenge: challengeItems.length,
    simulation: simulationItems.length,
  };
}

/**
 * Example 4: Get performance history for a concept
 */
export async function getPerformanceHistory(conceptId: string) {
  const performances = await gamePerformanceStore.getForConcept(conceptId);

  if (performances.length === 0) {
    console.log(`No performance history for ${conceptId}`);
    return null;
  }

  console.log(`Performance history for ${conceptId}:`);
  let totalScore = 0;
  performances.forEach((perf, i) => {
    console.log(
      `  ${i + 1}. ${perf.gameType} - Score: ${perf.score}% (${perf.timeSpent}ms)`
    );
    totalScore += perf.score;
  });

  const averageScore = Math.round(totalScore / performances.length);
  console.log(`Average score: ${averageScore}%`);

  return {
    count: performances.length,
    averageScore,
    performances,
  };
}

/**
 * Example 5: Force regenerate content for a concept
 */
export async function regenerateContent(
  conceptId: string,
  gameType: string,
  concept: Concept
) {
  console.log(`Regenerating ${gameType} content for ${concept.name}...`);

  const content = await gameContentStore.getGameContent(gameType, gameType, {
    forceGenerate: true,
    concept,
  });

  if (content) {
    console.log(`✓ Generated new ${gameType} content`);
    console.log(`  ID: ${content.id}`);
    console.log(`  Source: ${content.source}`);
    return content;
  } else {
    console.log(`✗ Generation failed`);
    return null;
  }
}

// Export for browser testing
if (typeof window !== 'undefined') {
  (window as any).gameExamples = {
    renderMemoryGame,
    renderChallengeGame,
    checkAvailableContent,
    getPerformanceHistory,
    regenerateContent,
  };
}
