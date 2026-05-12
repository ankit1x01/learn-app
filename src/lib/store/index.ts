export { useSettingsStore } from './settings';
export { useCanvasStore } from './canvas';
export { useWhiteboardHistoryStore } from './whiteboard-history';

// Stub for useStageStore used by whiteboard components
import { create } from 'zustand';

interface StageState {
  stageId: string | null;
  mode: string;
  elements: unknown[];
  [key: string]: unknown;
}

export const useStageStore = create<StageState>(() => ({
  stageId: null,
  mode: 'autonomous',
  elements: [],
}));
