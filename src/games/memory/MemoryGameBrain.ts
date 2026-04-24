// src/games/memory/MemoryGameBrain.ts

/**
 * Adaptive Difficulty (D)
 * Uses a "Staircase Algorithm" targeting a 79.4% accuracy rate.
 * D_next = D_current + 1 (after 3 consecutive correct answers)
 * D_next = D_current - 1 (after 1 incorrect answer)
 */
export class AdaptiveDifficulty {
  private currentDifficulty: number;
  private consecutiveCorrect: number;

  constructor(initialDifficulty: number = 100) {
    this.currentDifficulty = initialDifficulty;
    this.consecutiveCorrect = 0;
  }

  recordAnswer(isCorrect: boolean): number {
    if (isCorrect) {
      this.consecutiveCorrect++;
      if (this.consecutiveCorrect >= 3) {
        this.currentDifficulty = Math.min(this.currentDifficulty + 10, 400); // Scaling D up
        this.consecutiveCorrect = 0;
      }
    } else {
      this.currentDifficulty = Math.max(this.currentDifficulty - 10, 0); // Scaling D down
      this.consecutiveCorrect = 0;
    }
    return this.currentDifficulty;
  }

  getDifficulty(): number {
    return this.currentDifficulty;
  }
}

/**
 * Proficiency Quotient (EPQ)
 * 0–5,000 using a weighted function of Accuracy, Response Time, and Consistency.
 */
export function calculateEPQ(
  accuracy: number, // 0 to 1
  responseTimeMs: number,
  difficulty: number,
  consistency: number // 0 to 1
): number {
  // Normalize response time (e.g., 2000ms is "good", capped at 10000ms)
  const timeFactor = Math.max(0, 1 - responseTimeMs / 10000);
  
  // EPQ = (Accuracy * 0.5 + TimeFactor * 0.3 + Consistency * 0.2) * Difficulty * 12.5
  // (0.5+0.3+0.2) * 400 * 12.5 = 1 * 5000 = 5000
  const weight = (accuracy * 0.5) + (timeFactor * 0.3) + (consistency * 0.2);
  const epq = weight * difficulty * 12.5;
  
  return Math.round(epq);
}
