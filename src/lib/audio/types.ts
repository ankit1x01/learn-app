export type BuiltInTTSProviderId =
  | 'openai-tts' | 'azure-tts' | 'glm-tts' | 'qwen-tts'
  | 'voxcpm-tts' | 'doubao-tts' | 'elevenlabs-tts'
  | 'minimax-tts' | 'browser-native-tts';

export type TTSProviderId = BuiltInTTSProviderId | `custom-tts-${string}`;

export interface TTSVoiceInfo {
  id: string;
  name: string;
  language: string;
  localeName?: string;
  gender?: 'male' | 'female' | 'neutral';
  description?: string;
  compatibleModels?: string[];
}

export interface TTSProviderConfig {
  id: TTSProviderId;
  name: string;
  requiresApiKey: boolean;
  defaultBaseUrl?: string;
  icon?: string;
  models: Array<{ id: string; name: string }>;
  defaultModelId: string;
  voices: TTSVoiceInfo[];
  supportedFormats: string[];
  speedRange?: { min: number; max: number; default: number };
}

export interface TTSModelConfig {
  providerId: TTSProviderId;
  modelId?: string;
  apiKey?: string;
  baseUrl?: string;
  voice: string;
  speed?: number;
  format?: string;
  providerOptions?: Record<string, unknown>;
}

export type BuiltInASRProviderId = 'openai-whisper' | 'browser-native' | 'qwen-asr';
export type ASRProviderId = BuiltInASRProviderId | `custom-asr-${string}`;

export interface ASRProviderConfig {
  id: ASRProviderId;
  name: string;
  requiresApiKey: boolean;
  defaultBaseUrl?: string;
  icon?: string;
  models: Array<{ id: string; name: string }>;
  defaultModelId: string;
  supportedLanguages: string[];
  supportedFormats: string[];
}

export interface ASRModelConfig {
  providerId: ASRProviderId;
  modelId?: string;
  apiKey?: string;
  baseUrl?: string;
  language?: string;
}

export function isCustomTTSProvider(id: string): boolean {
  return id.startsWith('custom-tts-');
}
export function isCustomASRProvider(id: string): boolean {
  return id.startsWith('custom-asr-');
}
