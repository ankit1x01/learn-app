import { Preferences } from '@capacitor/preferences';
import { generateGameContent } from './game-content-generator';
import type { Concept } from '@/core/types';

export type GameContentData = {
  id: string;
  conceptId: string;
  content: Record<string, any>;
  correctAnswer?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  source: 'preauthored' | 'generated';
  createdAt: number;
};

export type GameContentMetadata = {
  gameType: string;
  requiredFields: string[];
  expectedDuration: number;
};

export type GameContent = GameContentData & {
  metadata: GameContentMetadata;
};

type ContentStore = Map<string, GameContent[]>;

class GameContentStoreImpl {
  private bundledContent: ContentStore = new Map();
  private initialized = false;

  async init(bundledData: Record<string, GameContent[]>): Promise<void> {
    for (const [gameType, contents] of Object.entries(bundledData)) {
      this.bundledContent.set(gameType, contents);
    }
    this.initialized = true;
  }

  async getGameContent(
    conceptId: string,
    gameType: string,
    options?: { forceGenerate?: boolean; concept?: Concept }
  ): Promise<GameContent | null> {
    if (!this.initialized) return null;

    // Check bundled content first (unless forcing generation)
    if (!options?.forceGenerate) {
      const bundled = this.bundledContent.get(gameType);
      if (bundled) {
        const found = bundled.find(c => c.conceptId === conceptId);
        if (found) return found;
      }

      // Check localStorage cache
      const cacheKey = `game_content_${conceptId}_${gameType}`;
      const cached = await Preferences.get({ key: cacheKey });
      if (cached.value) {
        try {
          return JSON.parse(cached.value);
        } catch {
          // Cache corrupted, continue
        }
      }
    }

    // If concept provided, try to generate
    if (options?.concept) {
      try {
        const generated = await generateGameContent(options.concept, gameType);
        if (generated) {
          await this.cacheGameContent(generated);
          return generated;
        }
      } catch (error) {
        console.warn(`Generation failed for ${gameType}:`, error);
      }
    }

    return null;
  }

  async loadAllContentForGameType(gameType: string): Promise<GameContent[]> {
    if (!this.initialized) return [];
    return this.bundledContent.get(gameType) ?? [];
  }

  async cacheGameContent(content: GameContent): Promise<void> {
    const cacheKey = `game_content_${content.conceptId}_${content.metadata.gameType}`;
    await Preferences.set({
      key: cacheKey,
      value: JSON.stringify(content),
    });
  }

  hasContent(conceptId: string, gameType: string): boolean {
    const bundled = this.bundledContent.get(gameType);
    if (bundled) {
      return bundled.some(c => c.conceptId === conceptId);
    }
    return false;
  }
}

export const gameContentStore = new GameContentStoreImpl();
