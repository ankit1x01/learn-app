/**
 * Derived Playback State — Pure function computing high-level game state
 * Centralizes all "what's happening now?" logic for consistent UI updates
 */

import type { EngineMode } from './types';

export type GamePlaybackPhase = 'idle' | 'playing' | 'paused' | 'completed';

export interface GamePlaybackView {
  phase: GamePlaybackPhase;
  isPlaying: boolean;
  canResume: boolean;
  canPause: boolean;
}

/**
 * Map engine mode to high-level game state
 */
export function computeGamePlaybackView(engineMode: EngineMode): GamePlaybackView {
  let phase: GamePlaybackPhase;
  let isPlaying: boolean;
  let canResume: boolean;
  let canPause: boolean;

  switch (engineMode) {
    case 'playing':
      phase = 'playing';
      isPlaying = true;
      canResume = false;
      canPause = true;
      break;

    case 'paused':
      phase = 'paused';
      isPlaying = false;
      canResume = true;
      canPause = false;
      break;

    case 'completed':
      phase = 'completed';
      isPlaying = false;
      canResume = false;
      canPause = false;
      break;

    case 'idle':
    default:
      phase = 'idle';
      isPlaying = false;
      canResume = false;
      canPause = false;
      break;
  }

  return {
    phase,
    isPlaying,
    canResume,
    canPause,
  };
}
