/**
 * Unified Action System (Adapted from OpenMAIC)
 *
 * Actions are the sole mechanism for agents/orchestrators to interact with presentations.
 * Two categories:
 * - Fire-and-forget: visual effects on slides (spotlight, laser)
 * - Synchronous: must wait for completion before next action (speech, whiteboard, simulations)
 *
 * Extended for game simulations, physics engines, and interactive learning.
 */

// ==================== Base ====================

export interface ActionBase {
  id: string;
  title?: string;
  description?: string;
  timestamp?: number; // For timeline sync with audio
}

// ==================== Fire-and-forget actions ====================

/** Spotlight — focus on a single element, dim everything else */
export interface SpotlightAction extends ActionBase {
  type: 'spotlight';
  elementId: string;
  dimOpacity?: number; // default 0.5
}

/** Laser — point at an element with a laser effect */
export interface LaserAction extends ActionBase {
  type: 'laser';
  elementId: string;
  color?: string; // default '#ff0000'
}

// ==================== Game-Specific Actions ====================

/** Simulation Trigger — start, pause, resume, reset a simulation */
export interface SimulationTriggerAction extends ActionBase {
  type: 'simulation_trigger';
  simulationId: string;
  command: 'start' | 'pause' | 'resume' | 'reset' | 'stop';
  parameters?: Record<string, unknown>; // Initial conditions, gravity, etc.
}

/** Physics Command — apply force, change gravity, create/destroy bodies */
export interface PhysicsCommandAction extends ActionBase {
  type: 'physics_command';
  simulationId: string;
  command: 'apply_force' | 'apply_impulse' | 'set_velocity' | 'set_gravity' | 'create_body' | 'destroy_body';
  targetBody?: string; // Body ID or selector
  data: Record<string, unknown>; // Force vector, gravity value, mass, etc.
}

/** Three.js Command — camera movement, mesh visibility, lighting changes */
export interface Three3DCommandAction extends ActionBase {
  type: '3d_command';
  sceneId: string;
  command: 'move_camera' | 'rotate_camera' | 'set_target' | 'show_mesh' | 'hide_mesh' | 'animate_mesh' | 'update_lighting';
  target?: string; // Mesh/light name
  data: Record<string, unknown>; // Camera position, animation parameters, etc.
}

/** Checkpoint — pause game/animation for user interaction (answer quiz, complete task) */
export interface CheckpointAction extends ActionBase {
  type: 'checkpoint';
  checkpointId: string;
  prompt?: string; // "Can you predict what happens next?"
  options?: string[]; // Multiple choice
  expectedAnswer?: string | number; // For validation
  allowContinue?: boolean; // Can user skip without answering
}

/** Feedback Message — show success/failure/hint */
export interface FeedbackAction extends ActionBase {
  type: 'feedback';
  message: string;
  type_: 'success' | 'failure' | 'hint' | 'info'; // 'type_' to avoid conflict
  duration?: number; // ms, default 3000
  audio?: string; // Audio URL for TTS
}

// ==================== Synchronous actions (OpenMAIC) ====================

/** Speech — narration/explanation (wait for TTS to finish) */
export interface SpeechAction extends ActionBase {
  type: 'speech';
  text: string;
  audioId?: string;
  audioUrl?: string; // Server-generated TTS audio URL
  voice?: string;
  speed?: number; // default 1.0
}

/** Open whiteboard (wait for animation) */
export interface WbOpenAction extends ActionBase {
  type: 'wb_open';
}

/** Draw text on whiteboard (wait for render) */
export interface WbDrawTextAction extends ActionBase {
  type: 'wb_draw_text';
  elementId?: string;
  content: string;
  x: number;
  y: number;
  width?: number; // default 400
  height?: number; // default 100
  fontSize?: number; // default 18
  color?: string; // default '#333333'
}

/** Draw shape on whiteboard (wait for render) */
export interface WbDrawShapeAction extends ActionBase {
  type: 'wb_draw_shape';
  elementId?: string;
  shape: 'rectangle' | 'circle' | 'triangle';
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor?: string; // default '#5b9bd5'
}

/** Draw chart on whiteboard (wait for render) */
export interface WbDrawChartAction extends ActionBase {
  type: 'wb_draw_chart';
  elementId?: string;
  chartType: 'bar' | 'column' | 'line' | 'pie' | 'ring' | 'area' | 'radar' | 'scatter';
  x: number;
  y: number;
  width: number;
  height: number;
  data: {
    labels: string[];
    legends: string[];
    series: number[][];
  };
  themeColors?: string[];
}

/** Draw LaTeX formula on whiteboard (wait for render) */
export interface WbDrawLatexAction extends ActionBase {
  type: 'wb_draw_latex';
  elementId?: string;
  latex: string;
  x: number;
  y: number;
  width?: number; // default 400
  height?: number; // auto-calculated
  color?: string; // default '#000000'
}

/** Draw table on whiteboard (wait for render) */
export interface WbDrawTableAction extends ActionBase {
  type: 'wb_draw_table';
  elementId?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  data: string[][];
  outline?: { width: number; style: string; color: string };
  theme?: { color: string };
}

/** Draw line/arrow on whiteboard (wait for render) */
export interface WbDrawLineAction extends ActionBase {
  type: 'wb_draw_line';
  elementId?: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color?: string; // default '#333333'
  width?: number; // default 2
  style?: 'solid' | 'dashed'; // default 'solid'
  points?: ['', 'arrow'] | ['arrow', ''] | ['arrow', 'arrow'] | ['', ''];
}

/** Clear all whiteboard elements */
export interface WbClearAction extends ActionBase {
  type: 'wb_clear';
}

/** Delete a specific whiteboard element by ID */
export interface WbDeleteAction extends ActionBase {
  type: 'wb_delete';
  elementId: string;
}

/** Close whiteboard (wait for animation) */
export interface WbCloseAction extends ActionBase {
  type: 'wb_close';
}

/** Draw code block on whiteboard (wait for typing animation) */
export interface WbDrawCodeAction extends ActionBase {
  type: 'wb_draw_code';
  elementId?: string;
  language: string;
  code: string;
  x: number;
  y: number;
  width?: number; // default 500
  height?: number; // default 300
  fileName?: string;
}

/** Edit code block on whiteboard (line-level operations) */
export interface WbEditCodeAction extends ActionBase {
  type: 'wb_edit_code';
  elementId: string;
  operation: 'insert_after' | 'insert_before' | 'delete_lines' | 'replace_lines';
  lineId?: string;
  lineIds?: string[];
  content?: string;
}

/** Play video — start playback of a video element */
export interface PlayVideoAction extends ActionBase {
  type: 'play_video';
  elementId: string;
}

// ==================== Widget Interaction Actions ====================

/** Widget Highlight — highlight an element in a widget iframe */
export interface WidgetHighlightAction extends ActionBase {
  type: 'widget_highlight';
  target: string;
  content?: string;
}

/** Widget SetState — set widget state (e.g., simulation variables) */
export interface WidgetSetStateAction extends ActionBase {
  type: 'widget_setState';
  state: Record<string, unknown>;
  content?: string;
}

/** Widget Annotation — add floating annotation to an element */
export interface WidgetAnnotationAction extends ActionBase {
  type: 'widget_annotation';
  target: string;
  content?: string;
}

/** Widget Reveal — reveal hidden content in widget */
export interface WidgetRevealAction extends ActionBase {
  type: 'widget_reveal';
  target: string;
  content?: string;
}

// ==================== Union type ====================

export type Action =
  | SpotlightAction
  | LaserAction
  | SimulationTriggerAction
  | PhysicsCommandAction
  | Three3DCommandAction
  | CheckpointAction
  | FeedbackAction
  | PlayVideoAction
  | SpeechAction
  | WbOpenAction
  | WbDrawTextAction
  | WbDrawShapeAction
  | WbDrawChartAction
  | WbDrawLatexAction
  | WbDrawTableAction
  | WbDrawLineAction
  | WbClearAction
  | WbDeleteAction
  | WbCloseAction
  | WbDrawCodeAction
  | WbEditCodeAction
  | WidgetHighlightAction
  | WidgetSetStateAction
  | WidgetAnnotationAction
  | WidgetRevealAction;

export type ActionType = Action['type'];

/** Action types that fire immediately without blocking */
export const FIRE_AND_FORGET_ACTIONS: ActionType[] = [
  'spotlight',
  'laser',
  'feedback',
];

/** Action types that must complete before the next action runs */
export const SYNC_ACTIONS: ActionType[] = [
  'speech',
  'play_video',
  'wb_open',
  'wb_draw_text',
  'wb_draw_shape',
  'wb_draw_chart',
  'wb_draw_latex',
  'wb_draw_table',
  'wb_draw_line',
  'wb_draw_code',
  'wb_edit_code',
  'wb_clear',
  'wb_delete',
  'wb_close',
  'simulation_trigger',
  'physics_command',
  '3d_command',
  'checkpoint',
  'widget_highlight',
  'widget_setState',
  'widget_annotation',
  'widget_reveal',
];

// ==================== Canvas utility types ====================

/**
 * Percentage-based geometry (0-100 coordinate system)
 * Used by spotlight/laser overlays for responsive positioning.
 */
export interface PercentageGeometry {
  x: number; // 0-100
  y: number; // 0-100
  w: number; // 0-100
  h: number; // 0-100
  centerX: number; // 0-100
  centerY: number; // 0-100
}
