import { create } from 'zustand';

export interface SpotlightOptions {
  radius?: number;
  dimness?: number;
  transition?: number;
}

export interface HighlightOverlayOptions {
  color?: string;
  opacity?: number;
  borderWidth?: number;
  animated?: boolean;
}

export interface LaserOptions {
  color?: string;
  duration?: number;
}

interface CanvasState {
  spotlight: SpotlightOptions | null;
  laser: LaserOptions | null;
  highlightOverlay: HighlightOverlayOptions | null;
  setSpotlight: (opts: SpotlightOptions | null) => void;
  setLaser: (opts: LaserOptions | null) => void;
  setHighlightOverlay: (opts: HighlightOverlayOptions | null) => void;
  clearEffects: () => void;
  [key: string]: unknown;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  spotlight: null,
  laser: null,
  highlightOverlay: null,
  setSpotlight: (opts) => set({ spotlight: opts }),
  setLaser: (opts) => set({ laser: opts }),
  setHighlightOverlay: (opts) => set({ highlightOverlay: opts }),
  clearEffects: () => set({ spotlight: null, laser: null, highlightOverlay: null }),
}));
