export const VOXCPM_TTS_PROVIDER_ID = 'voxcpm-tts' as const;
export const VOXCPM_MODEL_ID = 'voxcpm-v1';
export const VOXCPM_VLLM_MODEL_ID = 'voxcpm-vllm';
export const DEFAULT_VOXCPM_BACKEND = 'cloud';
export const VOXCPM_AUTO_VOICE = 'auto';
export const VOXCPM_AUTO_VOICE_ID = 'auto';

export interface VoxCPMProviderOptions {
  backend?: string;
  referenceAudio?: string;
}

export interface VoxCPMVoicePromptContext {
  text: string;
  voice: string;
}

export function normalizeVoxCPMBackend(backend?: string): string {
  return backend ?? DEFAULT_VOXCPM_BACKEND;
}

export function getVoxCPMProfileVoiceId(profileId: string): string {
  return `voxcpm-${profileId}`;
}

export function getVoxCPMProfileIdFromVoiceId(voiceId: string): string {
  return voiceId.replace('voxcpm-', '');
}

export function buildAutoVoxCPMVoicePrompt(_context: VoxCPMVoicePromptContext): string {
  return '';
}

export function voxCPMBackendSupportsReferenceAudio(_backend: string): boolean {
  return false;
}

export async function playVoxCPM(
  _text: string,
  _voice: string,
  _apiKey?: string,
): Promise<void> {
  const utterance = new SpeechSynthesisUtterance(_text);
  window.speechSynthesis.speak(utterance);
}
