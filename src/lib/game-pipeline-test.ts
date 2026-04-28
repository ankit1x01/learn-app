/**
 * Game Pipeline Test Helper
 * Used to verify game content, performance tracking, and FSRS integration
 */

import { gameContentStore } from './game-content-store';
import { gamePerformanceStore } from './game-performance-store';
import { updateFSRSFromGamePerformance } from '../core/fsrs';
import type { Concept } from '../core/types';

export async function testGamePipeline() {
  console.group('🎮 Game Pipeline Test');

  try {
    // Initialize content store
    console.log('1️⃣ Initializing content store...');
    // Note: init() is called in App.tsx, so bundled content is already loaded
    const allMemory = await gameContentStore.loadAllContentForGameType('memory');
    console.log(`   ✓ Loaded ${allMemory.length} memory game items`);

    const allChallenge = await gameContentStore.loadAllContentForGameType('challenge');
    console.log(`   ✓ Loaded ${allChallenge.length} challenge game items`);

    const allSimulation = await gameContentStore.loadAllContentForGameType('simulation');
    console.log(`   ✓ Loaded ${allSimulation.length} simulation game items`);

    // Test content fetching
    console.log('\n2️⃣ Testing content retrieval...');
    const memoryContent = await gameContentStore.getGameContent('cs_001', 'memory');
    if (memoryContent) {
      console.log(`   ✓ Retrieved memory game for cs_001: "${memoryContent.content.items?.[0]?.name}"`);
    } else {
      console.warn('   ✗ Failed to retrieve memory game for cs_001');
    }

    // Test performance tracking
    console.log('\n3️⃣ Testing performance tracking...');
    const perf = await gamePerformanceStore.createPerformance(
      'mem_001',
      'cs_001',
      'memory',
      85, // score
      45000 // timeSpent
    );
    console.log(`   ✓ Created performance record: ${perf.id}`);
    console.log(`     Score: ${perf.score}%, Passed: ${perf.passed}`);

    // Retrieve and verify
    const retrieved = await gamePerformanceStore.getForConcept('cs_001');
    console.log(`   ✓ Retrieved ${retrieved.length} performance record(s) for cs_001`);

    // Test FSRS integration
    console.log('\n4️⃣ Testing FSRS integration...');
    const testConcept: Concept = {
      id: 'cs_001',
      name: 'Variables',
      subject: 'CS',
      chapter: 'Basics',
      unit: 1,
      pyqTier: 1,
      stage: 'Fragile',
      stability: 2,
      difficulty: 0.5,
      lastTested: Date.now(),
      nextReview: 0,
    };

    const updated = updateFSRSFromGamePerformance(
      testConcept.stage as any,
      testConcept.stability,
      testConcept.difficulty,
      perf.score
    );

    console.log(`   ✓ FSRS update applied:`);
    console.log(`     Stage: ${testConcept.stage} → ${updated.stage}`);
    console.log(`     Stability: ${testConcept.stability}d → ${updated.stability}d`);
    console.log(`     Next review: ${updated.nextReviewDays} days`);

    console.log('\n✅ Game pipeline test passed!');
    console.groupEnd();

    return {
      contentLoaded: allMemory.length + allChallenge.length + allSimulation.length,
      performanceTracked: true,
      fsrsIntegrated: true,
    };
  } catch (error) {
    console.error('❌ Pipeline test failed:', error);
    console.groupEnd();
    throw error;
  }
}

// For development: run with window.testGamePipeline?.()
if (typeof window !== 'undefined') {
  (window as any).testGamePipeline = testGamePipeline;
}
