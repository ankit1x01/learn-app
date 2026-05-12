import { create } from 'zustand';

export type PlaybackSpeed = 1 | 1.25 | 1.5 | 2;
export const PLAYBACK_SPEEDS: readonly [1, 1.25, 1.5, 2] = [1, 1.25, 1.5, 2];

export interface SettingsState {
  ttsProviderId: string;
  ttsVoice: string;
  playbackSpeed: PlaybackSpeed;
  setTTSProvider: (id: string) => void;
  setTTSVoice: (voice: string) => void;
  setPlaybackSpeed: (speed: PlaybackSpeed) => void;
  [key: string]: unknown;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  ttsProviderId: 'browser-native-tts',
  ttsVoice: '',
  playbackSpeed: 1,
  setTTSProvider: (id) => set({ ttsProviderId: id }),
  setTTSVoice: (voice) => set({ ttsVoice: voice }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
}));

export function promoteLegacyCustomProviderBaseUrls(_state: Partial<SettingsState>) {}
