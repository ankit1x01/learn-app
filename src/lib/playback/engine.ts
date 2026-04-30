/**
 * Playback Engine — Timeline orchestration for game simulations
 * Drives actions from configuration based on audio timeline
 *
 * State machine:
 *
 *            start()
 *   idle ──────────────→ playing
 *     ▲                    │
 *     │                    │ pause()
 *     │                    ▼
 *     │                  paused
 *     │                    │
 *     │                    │ resume()
 *     │                    ▼
 *     │                  playing
 *     │                    │
 *     │                    │ (all actions complete)
 *     └────────────────────┘
 *                    completed
 */

import type { Action, SpeechAction } from '@/lib/action-types';
import type {
  EngineMode,
  PlaybackEngineCallbacks,
  PlaybackSnapshot,
} from './types';
import { ActionEngine } from '@/lib/action-engine';

/**
 * Scene — a sequence of actions to execute in order
 * (adapts OpenMAIC's Scene structure for games)
 */
export interface GameScene {
  id: string;
  actions: Action[];
}

export class PlaybackEngine {
  private scenes: GameScene[] = [];
  private sceneIndex: number = 0;
  private actionIndex: number = 0;
  private mode: EngineMode = 'idle';

  private actionEngine: ActionEngine;
  private callbacks: PlaybackEngineCallbacks;

  // Timers for speech actions without audio
  private speechTimer: ReturnType<typeof setTimeout> | null = null;
  private speechTimerStart: number = 0;
  private speechTimerRemaining: number = 0;

  constructor(
    scenes: GameScene[],
    actionEngine: ActionEngine,
    callbacks: PlaybackEngineCallbacks = {},
  ) {
    this.scenes = scenes;
    this.actionEngine = actionEngine;
    this.callbacks = callbacks;
  }

  // ==================== Public API ====================

  getMode(): EngineMode {
    return this.mode;
  }

  getSnapshot(): PlaybackSnapshot {
    return {
      sceneIndex: this.sceneIndex,
      actionIndex: this.actionIndex,
      sceneId: this.scenes[this.sceneIndex]?.id,
      timestamp: Date.now(),
    };
  }

  restoreFromSnapshot(snapshot: PlaybackSnapshot): void {
    this.sceneIndex = snapshot.sceneIndex;
    this.actionIndex = snapshot.actionIndex;
  }

  /** idle → playing (from beginning) */
  start(): void {
    if (this.mode !== 'idle') {
      console.warn('[PlaybackEngine] Cannot start: not idle, current mode:', this.mode);
      return;
    }

    this.sceneIndex = 0;
    this.actionIndex = 0;
    this.setMode('playing');
    this.processNext();
  }

  /** playing → paused */
  pause(): void {
    if (this.mode !== 'playing') {
      console.warn('[PlaybackEngine] Cannot pause: mode is', this.mode);
      return;
    }

    if (this.speechTimer) {
      this.speechTimerRemaining = Math.max(
        0,
        this.speechTimerRemaining - (Date.now() - this.speechTimerStart),
      );
      clearTimeout(this.speechTimer);
      this.speechTimer = null;
    }

    this.setMode('paused');
  }

  /** paused → playing */
  resume(): void {
    if (this.mode !== 'paused') {
      console.warn('[PlaybackEngine] Cannot resume: not paused, mode is', this.mode);
      return;
    }

    this.setMode('playing');

    if (this.speechTimerRemaining > 0) {
      this.speechTimerStart = Date.now();
      this.speechTimer = setTimeout(() => {
        this.speechTimer = null;
        this.speechTimerRemaining = 0;
        this.callbacks.onSpeechEnd?.();
        if (this.mode === 'playing') this.processNext();
      }, this.speechTimerRemaining);
    } else {
      this.processNext();
    }
  }

  /** → idle, stop all pending actions */
  stop(): void {
    this.setMode('idle');
    this.actionEngine.dispose();
    if (this.speechTimer) {
      clearTimeout(this.speechTimer);
      this.speechTimer = null;
    }
    this.speechTimerRemaining = 0;
    this.sceneIndex = 0;
    this.actionIndex = 0;
  }

  // ==================== Private ====================

  private setMode(mode: EngineMode): void {
    if (this.mode === mode) return;
    this.mode = mode;
    this.callbacks.onModeChange?.(mode);
  }

  /**
   * Get the current action, or null if all scenes are exhausted.
   * Advances sceneIndex automatically when a scene's actions are consumed.
   */
  private getCurrentAction(): { action: Action; sceneId: string } | null {
    while (this.sceneIndex < this.scenes.length) {
      const scene = this.scenes[this.sceneIndex];
      const actions = scene.actions || [];

      if (this.actionIndex < actions.length) {
        return { action: actions[this.actionIndex], sceneId: scene.id };
      }

      // Move to next scene
      this.sceneIndex++;
      this.actionIndex = 0;
    }
    return null;
  }

  /**
   * Core processing loop: consume the next action.
   * Fire-and-forget actions advance immediately.
   * Synchronous actions wait for completion before advancing.
   */
  private async processNext(): Promise<void> {
    if (this.mode !== 'playing') return;

    // Check for scene boundary (fire scene change callback at start of each scene)
    if (this.actionIndex === 0 && this.sceneIndex < this.scenes.length) {
      const scene = this.scenes[this.sceneIndex];
      this.actionEngine.clearEffects();
      this.callbacks.onSceneChange?.(scene.id);
    }

    const current = this.getCurrentAction();
    if (!current) {
      // All scenes complete
      this.actionEngine.clearEffects();
      this.setMode('completed');
      this.callbacks.onComplete?.();
      return;
    }

    const { action } = current;

    // Notify progress BEFORE advancing cursor (so snapshot points at current action)
    this.callbacks.onProgress?.(this.getSnapshot());

    this.actionIndex++;

    switch (action.type) {
      case 'speech': {
        const speechAction = action as SpeechAction;
        this.callbacks.onSpeechStart?.(speechAction.text);

        // Estimate reading time for text without audio
        // CJK: ~150ms/char; Non-CJK: ~240ms/word; Min 2s
        const scheduleReadingTimer = () => {
          const text = speechAction.text;
          const cjkCount = (
            text.match(/[一-鿿㐀-䶿぀-ゟ゠-ヿ가-힯]/g) || []
          ).length;
          const isCJK = cjkCount > text.length * 0.3;
          const speed = this.callbacks.getPlaybackSpeed?.() ?? 1;
          const rawMs = isCJK
            ? Math.max(2000, text.length * 150)
            : Math.max(2000, text.split(/\s+/).filter(Boolean).length * 240);
          const readingMs = rawMs / speed;

          this.speechTimerStart = Date.now();
          this.speechTimerRemaining = readingMs;
          this.speechTimer = setTimeout(() => {
            this.speechTimer = null;
            this.speechTimerRemaining = 0;
            this.callbacks.onSpeechEnd?.();
            if (this.mode === 'playing') this.processNext();
          }, readingMs);
        };

        // No audio support in game engine — just schedule reading timer
        scheduleReadingTimer();
        break;
      }

      case 'spotlight':
      case 'laser':
      case 'feedback': {
        // Fire-and-forget visual effects
        this.actionEngine.execute(action).catch(console.warn);
        // Continue immediately (use queueMicrotask to avoid stack overflow)
        queueMicrotask(() => this.processNext());
        break;
      }

      case 'simulation_trigger':
      case 'physics_command':
      case '3d_command':
      case 'checkpoint':
      case 'wb_draw_text':
      case 'wb_draw_shape':
      case 'widget_highlight':
      case 'widget_setState':
      case 'widget_annotation':
      case 'widget_reveal': {
        // Synchronous actions — await completion, then continue
        this.actionEngine.execute(action).catch(console.warn);
        if (this.mode === 'playing') {
          this.processNext();
        }
        break;
      }

      default:
        // Unknown action, skip
        this.processNext();
        break;
    }
  }
}
