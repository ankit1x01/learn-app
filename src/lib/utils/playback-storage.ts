/**
 * Playback Storage — Persist playback state to localStorage
 * Simplified for games (no database dependency)
 */

export interface PlaybackSnapshot {
  sceneIndex: number;
  actionIndex: number;
  sceneId?: string;
  timestamp?: number;
}

const PLAYBACK_STORAGE_KEY = (gameId: string) => `playback_${gameId}`;

export async function savePlaybackState(
  gameId: string,
  snapshot: PlaybackSnapshot,
): Promise<void> {
  try {
    localStorage.setItem(PLAYBACK_STORAGE_KEY(gameId), JSON.stringify(snapshot));
  } catch (err) {
    console.warn('[playback-storage] Failed to save state:', err);
  }
}

export async function loadPlaybackState(gameId: string): Promise<PlaybackSnapshot | null> {
  try {
    const stored = localStorage.getItem(PLAYBACK_STORAGE_KEY(gameId));
    return stored ? JSON.parse(stored) : null;
  } catch (err) {
    console.warn('[playback-storage] Failed to load state:', err);
    return null;
  }
}

export async function clearPlaybackState(gameId: string): Promise<void> {
  try {
    localStorage.removeItem(PLAYBACK_STORAGE_KEY(gameId));
  } catch (err) {
    console.warn('[playback-storage] Failed to clear state:', err);
  }
}
