import type { TTSProviderId, TTSVoiceInfo } from './types';

export interface ResolvedVoice {
  providerId: TTSProviderId;
  modelId?: string;
  voiceId: string;
}

export interface ModelVoiceGroup {
  modelId: string;
  modelName: string;
  voices: Array<{ id: string; name: string; language?: string }>;
}

export interface ProviderWithVoices {
  providerId: TTSProviderId;
  providerName: string;
  voices: Array<{ id: string; name: string; language?: string }>;
  modelGroups: ModelVoiceGroup[];
}

export function resolveAgentVoice(
  _agent: unknown,
  agentIndex: number,
  availableProviders: ProviderWithVoices[],
): ResolvedVoice {
  const provider = availableProviders[0];
  return {
    providerId: provider?.providerId ?? 'browser-native-tts',
    voiceId: provider?.voices[agentIndex % (provider?.voices.length || 1)]?.id ?? '',
  };
}

export function getServerVoiceList(
  _providerId: TTSProviderId,
  _ttsProvidersConfig?: Record<string, Record<string, unknown>>,
): string[] {
  return [];
}

export function getAvailableProvidersWithVoices(
  _ttsProvidersConfig: Record<string, unknown>,
  _voxcpmProfiles?: Array<{ id: string; name: string; kind?: string }>,
): ProviderWithVoices[] {
  const voices = window.speechSynthesis?.getVoices?.() ?? [];
  return [{
    providerId: 'browser-native-tts',
    providerName: 'Browser TTS',
    voices: voices.map((v: SpeechSynthesisVoice) => ({ id: v.voiceURI, name: v.name, language: v.lang })),
    modelGroups: [],
  }];
}

export function findVoiceDisplayName(
  _providerId: TTSProviderId,
  voiceId: string,
  _ttsProvidersConfig?: Record<string, Record<string, unknown>>,
): string {
  return voiceId;
}
