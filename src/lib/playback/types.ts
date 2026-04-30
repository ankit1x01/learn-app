/**
 * Playback Engine Types — State machine and callbacks for timeline-driven game orchestration
 * Adapted from OpenMAIC for CHITTA's game simulations
 */

export type EngineMode = 'idle' | 'playing' | 'paused' | 'completed';

export interface PlaybackEngineCallbacks {
  // Lifecycle
  onModeChange?: (mode: EngineMode) => void;
  onSceneChange?: (sceneId: string) => void;
  onComplete?: () => void;

  // Audio/Speech
  onSpeechStart?: (text: string) => void;
  onSpeechEnd?: () => void;

  // Playback control (optional — for UI pause/resume icons)
  getPlaybackSpeed?: () => number;

  // Progress persistence
  onProgress?: (snapshot: PlaybackSnapshot) => void;
}

/**
 * Serializable snapshot of playback position.
 * Used to resume a game from where it left off.
 */
export interface PlaybackSnapshot {
  sceneIndex: number;
  actionIndex: number;
  sceneId?: string;
  timestamp?: number; // Client-side wallclock at snapshot time
}
