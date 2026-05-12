export type StageAPI = {
  scene: Record<string, unknown>;
  navigation: Record<string, unknown>;
  element: Record<string, unknown>;
  canvas: Record<string, unknown>;
  whiteboard: Record<string, unknown>;
  mode: Record<string, unknown>;
  stage: Record<string, unknown>;
};

export function createStageAPI(_store: unknown): StageAPI {
  return {
    scene: {},
    navigation: {},
    element: {},
    canvas: {},
    whiteboard: {},
    mode: {},
    stage: {},
  };
}

export function generateId() { return Math.random().toString(36).slice(2); }
export function validateSceneId(_id: string): boolean { return true; }
export function getScene(_store: unknown, _id: string) { return null; }
export function createDefaultContent() { return {}; }
export function createDefaultSlideContent() { return {}; }
export function createDefaultQuizContent() { return {}; }
export function createDefaultInteractiveContent() { return {}; }
export function createDefaultPBLContent() { return {}; }
