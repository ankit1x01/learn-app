/**
 * ActionEngine — Unified execution layer for game/simulation actions
 * Adapted from OpenMAIC for CHITTA's learning games
 *
 * Execution modes:
 * - Fire-and-forget: spotlight, laser, feedback
 * - Synchronous: speech, whiteboard, simulations, checkpoints
 */

import type {
  Action,
  SpotlightAction,
  LaserAction,
  SpeechAction,
  SimulationTriggerAction,
  PhysicsCommandAction,
  Three3DCommandAction,
  CheckpointAction,
  FeedbackAction,
  WidgetSetStateAction,
  WidgetHighlightAction,
  WidgetAnnotationAction,
  WidgetRevealAction,
  WbDrawTextAction,
  WbDrawShapeAction,
  WbDrawLineAction,
} from './action-types';

// ==================== Types ====================

export type WidgetMessageCallback = (type: string, payload: Record<string, unknown>) => void;
export type SimulationCommandCallback = (simulationId: string, command: string, data: Record<string, unknown>) => void;
export type CheckpointCallback = (checkpoint: CheckpointAction) => Promise<boolean>; // Returns true if passed

// ==================== Constants ====================

const EFFECT_AUTO_CLEAR_MS = 5000;
const ANIMATION_DELAY_MS = 300;

// ==================== Helper Functions ====================

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ==================== ActionEngine ====================

export type WhiteboardCallbacks = {
  open?: () => void;
  clear?: () => void;
  drawText?: (text: string, x: number, y: number, color?: string, fontSize?: number) => void;
  drawRect?: (x: number, y: number, w: number, h: number, color?: string) => void;
  drawCircle?: (cx: number, cy: number, r: number, color?: string) => void;
  drawLine?: (x1: number, y1: number, x2: number, y2: number, color?: string) => void;
  drawArrow?: (x1: number, y1: number, x2: number, y2: number, color?: string) => void;
};

export class ActionEngine {
  private widgetMessageCallback: WidgetMessageCallback | null = null;
  private simulationCommandCallback: SimulationCommandCallback | null = null;
  private checkpointCallback: CheckpointCallback | null = null;
  private effectTimer: ReturnType<typeof setTimeout> | null = null;
  private effectCallbacks: {
    setSpotlight?: (effect: any) => void;
    setLaser?: (effect: any) => void;
    setFeedback?: (effect: any) => void;
  } = {};
  private whiteboardCallbacks: WhiteboardCallbacks = {};
  public speechSpeed: number = 1;

  constructor(
    widgetMessageCallback?: WidgetMessageCallback | null,
    simulationCommandCallback?: SimulationCommandCallback | null,
    checkpointCallback?: CheckpointCallback | null,
  ) {
    this.widgetMessageCallback = widgetMessageCallback ?? null;
    this.simulationCommandCallback = simulationCommandCallback ?? null;
    this.checkpointCallback = checkpointCallback ?? null;
  }

  setEffectCallbacks(callbacks: {
    setSpotlight?: (effect: any) => void;
    setLaser?: (effect: any) => void;
    setFeedback?: (effect: any) => void;
  }): void {
    this.effectCallbacks = callbacks;
  }

  setWhiteboardCallbacks(callbacks: WhiteboardCallbacks): void {
    this.whiteboardCallbacks = callbacks;
  }

  /** Set callback for widget iframe messages */
  setWidgetMessageCallback(callback: WidgetMessageCallback | null): void {
    this.widgetMessageCallback = callback;
  }

  /** Set callback for simulation commands */
  setSimulationCommandCallback(callback: SimulationCommandCallback | null): void {
    this.simulationCommandCallback = callback;
  }

  /** Set callback for checkpoints */
  setCheckpointCallback(callback: CheckpointCallback | null): void {
    this.checkpointCallback = callback;
  }

  /** Clean up timers */
  dispose(): void {
    if (this.effectTimer) {
      clearTimeout(this.effectTimer);
      this.effectTimer = null;
    }
  }

  /**
   * Execute a single action.
   * Fire-and-forget actions return immediately.
   * Synchronous actions return a Promise that resolves when complete.
   */
  async execute(action: Action): Promise<void> {
    try {
      switch (action.type) {
        // Fire-and-forget
        case 'spotlight':
          this.executeSpotlight(action as SpotlightAction);
          return;
        case 'laser':
          this.executeLaser(action as LaserAction);
          return;
        case 'feedback':
          this.executeFeedback(action as FeedbackAction);
          return;

        // Synchronous — Speech
        case 'speech':
          return this.executeSpeech(action as SpeechAction);

        // Game-Specific
        case 'simulation_trigger':
          return this.executeSimulationTrigger(action as SimulationTriggerAction);
        case 'physics_command':
          return this.executePhysicsCommand(action as PhysicsCommandAction);
        case '3d_command':
          return this.execute3DCommand(action as Three3DCommandAction);
        case 'checkpoint':
          return this.executeCheckpoint(action as CheckpointAction);

        // Whiteboard
        case 'wb_open':
          this.whiteboardCallbacks.open?.();
          return;
        case 'wb_clear':
          this.whiteboardCallbacks.clear?.();
          return;
        case 'wb_draw_text':
          return this.executeWbDrawText(action as WbDrawTextAction);
        case 'wb_draw_shape':
          return this.executeWbDrawShape(action as WbDrawShapeAction);
        case 'wb_draw_line':
          return this.executeWbDrawLine(action as WbDrawLineAction);

        // Widget actions
        case 'widget_setState':
          return this.executeWidgetSetState(action as WidgetSetStateAction);
        case 'widget_highlight':
          return this.executeWidgetHighlight(action as WidgetHighlightAction);
        case 'widget_annotation':
          return this.executeWidgetAnnotation(action as WidgetAnnotationAction);
        case 'widget_reveal':
          return this.executeWidgetReveal(action as WidgetRevealAction);

        // Unhandled actions (no-op)
        default:
          console.warn(`[ActionEngine] Unhandled action type: ${(action as any).type}`);
          return;
      }
    } catch (error) {
      console.error(`[ActionEngine] Error executing action:`, action, error);
      throw error;
    }
  }

  /** Clear all active visual effects */
  clearEffects(): void {
    if (this.effectTimer) {
      clearTimeout(this.effectTimer);
      this.effectTimer = null;
    }
    // In CHITTA, effects would be cleared via store update
    // TODO: Wire to CHITTA's effect/overlay state management
  }

  // ==================== Fire-and-Forget ====================

  private executeSpotlight(action: SpotlightAction): void {
    console.log(`[ActionEngine] Spotlight on ${action.elementId}, dimOpacity=${action.dimOpacity ?? 0.5}`);

    if (this.effectCallbacks.setSpotlight) {
      this.effectCallbacks.setSpotlight({
        elementId: action.elementId,
        dimOpacity: action.dimOpacity ?? 0.5,
      });

      // Clear after 4 seconds
      setTimeout(() => {
        this.effectCallbacks.setSpotlight?.(null);
      }, 4000);
    }

    this.scheduleEffectClear();
  }

  private executeLaser(action: LaserAction): void {
    console.log(`[ActionEngine] Laser on ${action.elementId}, color=${action.color ?? '#ff0000'}`);

    if (this.effectCallbacks.setLaser) {
      this.effectCallbacks.setLaser({
        elementId: action.elementId,
        color: action.color ?? '#ff0000',
      });

      // Clear after 3 seconds
      setTimeout(() => {
        this.effectCallbacks.setLaser?.(null);
      }, 3000);
    }

    this.scheduleEffectClear();
  }

  private executeFeedback(action: FeedbackAction): void {
    const duration = action.duration ?? 3000;
    console.log(`[ActionEngine] Feedback [${action.type_}]: ${action.message} (${duration}ms)`);

    if (this.effectCallbacks.setFeedback) {
      this.effectCallbacks.setFeedback({
        message: action.message,
        type: action.type_,
        duration,
      });

      // Clear after duration
      setTimeout(() => {
        this.effectCallbacks.setFeedback?.(null);
      }, duration);
    }

    this.scheduleEffectClear();
  }

  // ==================== Synchronous — Speech ====================

  private async executeSpeech(action: SpeechAction): Promise<void> {
    console.log(`[ActionEngine] Speech: ${action.text.substring(0, 50)}...`);

    // Try to use Web Speech API
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && action.text) {
      try {
        const { playBrowserTTS } = await import('@/lib/audio/browser-tts');
        await playBrowserTTS(action.text, { rate: 0.9 * this.speechSpeed });
        return;
      } catch (err) {
        console.warn(`[ActionEngine] Speech synthesis error:`, err);
      }
    }

    // Fallback: delay based on text length estimate
    // Rough estimate: 150ms per character for speech duration
    const estimatedMs = Math.max(Math.min(action.text.length * 50, 60000), 1000);
    await delay(estimatedMs);
  }

  // ==================== Game-Specific Actions ====================

  private async executeSimulationTrigger(action: SimulationTriggerAction): Promise<void> {
    console.log(
      `[ActionEngine] Simulation ${action.simulationId} → ${action.command}`,
      action.parameters ?? {},
    );

    if (this.simulationCommandCallback) {
      this.simulationCommandCallback(action.simulationId, action.command, action.parameters ?? {});
    }

    // Wait for simulation to respond
    await delay(ANIMATION_DELAY_MS);
  }

  private async executePhysicsCommand(action: PhysicsCommandAction): Promise<void> {
    console.log(
      `[ActionEngine] Physics ${action.simulationId} → ${action.command}`,
      action.data,
    );

    if (this.simulationCommandCallback) {
      this.simulationCommandCallback(action.simulationId, action.command, action.data);
    }

    await delay(ANIMATION_DELAY_MS);
  }

  private async execute3DCommand(action: Three3DCommandAction): Promise<void> {
    console.log(
      `[ActionEngine] 3D ${action.sceneId} → ${action.command}`,
      action.data,
    );

    if (this.simulationCommandCallback) {
      this.simulationCommandCallback(action.sceneId, action.command, action.data);
    }

    await delay(ANIMATION_DELAY_MS);
  }

  private async executeCheckpoint(action: CheckpointAction): Promise<void> {
    console.log(`[ActionEngine] Checkpoint: ${action.checkpointId}`, action.prompt);

    if (!this.checkpointCallback) {
      console.warn(`[ActionEngine] No checkpoint callback registered`);
      return;
    }

    // Wait for user to answer/interact
    const passed = await this.checkpointCallback(action);
    console.log(`[ActionEngine] Checkpoint ${action.checkpointId} result: ${passed ? 'PASS' : 'FAIL'}`);
  }

  // ==================== Whiteboard ====================

  private async executeWbDrawText(action: WbDrawTextAction): Promise<void> {
    console.log(`[ActionEngine] Whiteboard draw text: ${action.content.substring(0, 40)}`);
    this.whiteboardCallbacks.drawText?.(
      action.content,
      action.x,
      action.y,
      action.color,
      action.fontSize,
    );
    await delay(300);
  }

  private async executeWbDrawShape(action: WbDrawShapeAction): Promise<void> {
    console.log(`[ActionEngine] Whiteboard draw shape: ${action.shape}`);
    const color = action.fillColor;
    if (action.shape === 'rectangle') {
      this.whiteboardCallbacks.drawRect?.(action.x, action.y, action.width, action.height, color);
    } else if (action.shape === 'circle') {
      this.whiteboardCallbacks.drawCircle?.(action.x + action.width / 2, action.y + action.height / 2, Math.min(action.width, action.height) / 2, color);
    }
    await delay(300);
  }

  private async executeWbDrawLine(action: WbDrawLineAction): Promise<void> {
    console.log(`[ActionEngine] Whiteboard draw line: (${action.startX},${action.startY}) → (${action.endX},${action.endY})`);
    const isArrow = action.points?.[1] === 'arrow';
    if (isArrow) {
      this.whiteboardCallbacks.drawArrow?.(action.startX, action.startY, action.endX, action.endY, action.color);
    } else {
      this.whiteboardCallbacks.drawLine?.(action.startX, action.startY, action.endX, action.endY, action.color);
    }
    await delay(300);
  }

  // ==================== Widget Actions ====================

  private sendWidgetMessage(type: string, payload: Record<string, unknown>): void {
    if (this.widgetMessageCallback) {
      this.widgetMessageCallback(type, payload);
    } else {
      console.warn(`[ActionEngine] Widget message callback not set, cannot send: ${type}`);
    }
  }

  private async executeWidgetSetState(action: WidgetSetStateAction): Promise<void> {
    console.log(`[ActionEngine] Widget setState:`, action.state);
    this.sendWidgetMessage('SET_WIDGET_STATE', { state: action.state });
    await delay(ANIMATION_DELAY_MS);
  }

  private async executeWidgetHighlight(action: WidgetHighlightAction): Promise<void> {
    console.log(`[ActionEngine] Widget highlight: ${action.target}`);
    this.sendWidgetMessage('HIGHLIGHT_ELEMENT', { target: action.target });
    await delay(ANIMATION_DELAY_MS);
  }

  private async executeWidgetAnnotation(action: WidgetAnnotationAction): Promise<void> {
    console.log(`[ActionEngine] Widget annotation: ${action.target}`);
    this.sendWidgetMessage('ANNOTATE_ELEMENT', { target: action.target });
    await delay(ANIMATION_DELAY_MS);
  }

  private async executeWidgetReveal(action: WidgetRevealAction): Promise<void> {
    console.log(`[ActionEngine] Widget reveal: ${action.target}`);
    this.sendWidgetMessage('REVEAL_ELEMENT', { target: action.target });
    await delay(ANIMATION_DELAY_MS);
  }

  // ==================== Private Helpers ====================

  private scheduleEffectClear(): void {
    if (this.effectTimer) {
      clearTimeout(this.effectTimer);
    }
    this.effectTimer = setTimeout(() => {
      this.clearEffects();
      this.effectTimer = null;
    }, EFFECT_AUTO_CLEAR_MS);
  }
}
