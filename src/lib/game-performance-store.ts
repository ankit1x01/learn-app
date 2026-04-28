import { Preferences } from '@capacitor/preferences';
import { v4 as uuid } from 'uuid';

export type GamePerformance = {
  id: string;
  gameContentId: string;
  conceptId: string;
  gameType: string;
  score: number;
  passed: boolean;
  timeSpent: number;
  completedAt: number;
};

class GamePerformanceStoreImpl {
  async save(performance: GamePerformance): Promise<void> {
    const key = `game_perf_${performance.conceptId}`;
    const existing = await Preferences.get({ key });

    let log: GamePerformance[] = [];
    if (existing.value) {
      try {
        log = JSON.parse(existing.value);
      } catch {
        log = [];
      }
    }

    log.push(performance);
    await Preferences.set({
      key,
      value: JSON.stringify(log),
    });
  }

  async getForConcept(conceptId: string): Promise<GamePerformance[]> {
    const key = `game_perf_${conceptId}`;
    const data = await Preferences.get({ key });

    if (!data.value) return [];
    try {
      return JSON.parse(data.value);
    } catch {
      return [];
    }
  }

  async createPerformance(
    gameContentId: string,
    conceptId: string,
    gameType: string,
    score: number,
    timeSpent: number
  ): Promise<GamePerformance> {
    const performance: GamePerformance = {
      id: uuid(),
      gameContentId,
      conceptId,
      gameType,
      score,
      passed: score >= 75,
      timeSpent,
      completedAt: Date.now(),
    };

    await this.save(performance);
    return performance;
  }

  async getLatest(conceptId: string, gameType: string): Promise<GamePerformance | null> {
    const log = await this.getForConcept(conceptId);
    const matching = log.filter(p => p.gameType === gameType);
    return matching.length > 0 ? matching[matching.length - 1] : null;
  }
}

export const gamePerformanceStore = new GamePerformanceStoreImpl();
