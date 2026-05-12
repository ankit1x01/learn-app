/**
 * Cross-platform TTS (Text-to-Speech) utility
 * Uses Capacitor native TTS on Android/iOS, falls back to Web Speech API on web
 */

import { Capacitor, Platform } from '@capacitor/core';

interface TTSOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

interface TTSState {
  isPlaying: boolean;
  onEnd?: () => void;
  onBoundary?: (event: { charIndex: number; totalChars: number }) => void;
  onError?: (error: Error) => void;
  currentUtterance?: SpeechSynthesisUtterance;
}

const ttsState: TTSState = {
  isPlaying: false,
};

/**
 * Check if native TTS (Capacitor) is available
 */
function isNativeSupported(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('TextToSpeech');
}

/**
 * Check if browser Web Speech API is available
 */
function isBrowserSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Stop any currently playing TTS
 */
export async function stopTTS(): Promise<void> {
  ttsState.isPlaying = false;

  if (isNativeSupported()) {
    try {
      const { TextToSpeech } = await import('@capacitor-community/text-to-speech');
      await TextToSpeech.stop();
    } catch (err) {
      console.error('[TTS] Error stopping native TTS:', err);
    }
  } else if (isBrowserSupported()) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Speak text using native TTS (Android/iOS via Capacitor)
 */
async function speakNative(text: string, options: TTSOptions = {}): Promise<void> {
  try {
    const { TextToSpeech } = await import('@capacitor-community/text-to-speech');

    ttsState.isPlaying = true;

    await TextToSpeech.speak({
      text,
      lang: options.lang || 'en-US',
      rate: options.rate ? 1 / options.rate : 1.0, // Capacitor uses inverse rate
      pitch: options.pitch || 1.0,
      volume: options.volume || 1.0,
    });

    ttsState.isPlaying = false;
    ttsState.onEnd?.();
  } catch (err) {
    ttsState.isPlaying = false;
    const error = err instanceof Error ? err : new Error(String(err));
    ttsState.onError?.(error);
    throw error;
  }
}

/**
 * Speak text using Web Speech API (browser)
 */
function speakBrowser(text: string, options: TTSOptions = {}): void {
  if (!isBrowserSupported()) {
    throw new Error('Web Speech API not available');
  }

  // Cancel any existing utterance
  window.speechSynthesis.cancel();

  ttsState.isPlaying = true;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options.lang || 'en-US';
  utterance.rate = options.rate || 1.0;
  utterance.pitch = options.pitch || 1.0;
  utterance.volume = options.volume !== undefined ? options.volume : 1.0;

  ttsState.currentUtterance = utterance;

  // Boundary event fires on word/sentence boundaries
  // Useful for syncing animations with speech progress
  utterance.onboundary = (event) => {
    if (ttsState.onBoundary) {
      ttsState.onBoundary({
        charIndex: event.charIndex,
        totalChars: text.length,
      });
    }
  };

  utterance.onend = () => {
    ttsState.isPlaying = false;
    ttsState.onEnd?.();
  };

  utterance.onerror = (event) => {
    ttsState.isPlaying = false;
    const error = new Error(`TTS error: ${event.error}`);
    ttsState.onError?.(error);
  };

  window.speechSynthesis.speak(utterance);
}

/**
 * Main TTS function - automatically uses native or browser TTS
 * @param text - Text to speak
 * @param options - TTS options (rate, pitch, volume, lang)
 * @param callbacks - Callbacks for events (onEnd, onBoundary, onError)
 */
export async function speak(
  text: string,
  options: TTSOptions = {},
  callbacks?: {
    onEnd?: () => void;
    onBoundary?: (event: { charIndex: number; totalChars: number }) => void;
    onError?: (error: Error) => void;
  },
): Promise<void> {
  // Set up callbacks
  ttsState.onEnd = callbacks?.onEnd;
  ttsState.onBoundary = callbacks?.onBoundary;
  ttsState.onError = callbacks?.onError;

  try {
    if (isNativeSupported()) {
      // Use native TTS on Android/iOS
      console.log('[TTS] Using native TTS (Capacitor)');
      await speakNative(text, options);
    } else if (isBrowserSupported()) {
      // Use Web Speech API in browser
      console.log('[TTS] Using browser Web Speech API');
      speakBrowser(text, options);
    } else {
      throw new Error('No TTS implementation available');
    }
  } catch (err) {
    ttsState.isPlaying = false;
    const error = err instanceof Error ? err : new Error(String(err));
    ttsState.onError?.(error);
    throw error;
  }
}

/**
 * Check if TTS is currently playing
 */
export function isPlaying(): boolean {
  return ttsState.isPlaying;
}

/**
 * Get the current TTS platform (for debugging/logging)
 */
export function getTTSPlatform(): 'native' | 'browser' | 'none' {
  if (isNativeSupported()) {
    return 'native';
  }
  if (isBrowserSupported()) {
    return 'browser';
  }
  return 'none';
}
