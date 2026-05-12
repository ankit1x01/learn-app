import { create } from 'zustand';

export interface WhiteboardSnapshot {
  elements: unknown[];
  timestamp: number;
  fingerprint: string;
}

interface WhiteboardHistoryState {
  snapshots: WhiteboardSnapshot[];
  maxSnapshots: number;
  pushSnapshot: (elements: unknown[]) => void;
  getSnapshot: (index: number) => WhiteboardSnapshot | null;
  clearHistory: () => void;
}

export const useWhiteboardHistoryStore = create<WhiteboardHistoryState>((set, get) => ({
  snapshots: [],
  maxSnapshots: 50,
  pushSnapshot: (elements) =>
    set((state) => ({
      snapshots: [
        ...state.snapshots.slice(-state.maxSnapshots + 1),
        { elements, timestamp: Date.now(), fingerprint: String(Date.now()) },
      ],
    })),
  getSnapshot: (index) => get().snapshots[index] ?? null,
  clearHistory: () => set({ snapshots: [] }),
}));
