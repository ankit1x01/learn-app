import { Preferences } from '@capacitor/preferences';

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
    options?: { forceGenerate?: boolean }
  ): Promise<GameContent | null> {
    if (!this.initialized) return null;

    // Check bundled content first
    const bundled = this.bundledContent.get(gameType);
    if (bundled) {
      const found = bundled.find(c => c.conceptId === conceptId);
      if (found) return found;
    }

    // Check localStorage cache
    const cacheKey = `game_content_${conceptId}_${gameType}`;
    const cached = await Preferences.get({ key: cacheKey });
    if (cached.value && !options?.forceGenerate) {
      try {
        return JSON.parse(cached.value);
      } catch {
        // Cache corrupted, continue
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
