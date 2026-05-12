/**
 * Browser TTS (Text-to-Speech) utilities - adapted from OpenMAIC
 * Provides reliable speech synthesis with voice loading and language detection
 */

const VOICES_LOAD_TIMEOUT_MS = 2000;
const CJK_LANG_THRESHOLD = 0.3;

function inferLang(text: string): string {
  const cjkCount = (text.match(/[一-鿿㐀-䶿]/g) || []).length;
  const ratio = text.length > 0 ? cjkCount / text.length : 0;
  return ratio > CJK_LANG_THRESHOLD ? 'zh-CN' : 'en-US';
}

export async function ensureVoicesLoaded(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return [];
  }

  const initialVoices = window.speechSynthesis.getVoices();
  if (initialVoices.length > 0) {
    return initialVoices;
  }

  return new Promise<SpeechSynthesisVoice[]>((resolve) => {
    let settled = false;
    let timeoutId: number | null = null;

    const cleanup = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };

    const finish = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(window.speechSynthesis.getVoices());
    };

    const handleVoicesChanged = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        finish();
      }
    };

    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    timeoutId = window.setTimeout(finish, VOICES_LOAD_TIMEOUT_MS);
  });
}

export function resolveBrowserVoice(
  voices: SpeechSynthesisVoice[],
  voiceNameOrLang: string,
  text: string,
): { voice: SpeechSynthesisVoice | null; lang: string } {
  const target = voiceNameOrLang.trim();
  const matchedVoice =
    target && target !== 'default'
      ? voices.find((voice) => voice.voiceURI === target || voice.name === target || voice.lang === target) || null
      : null;

  return {
    voice: matchedVoice,
    lang: matchedVoice?.lang || inferLang(text),
  };
}

export async function playBrowserTTS(text: string, options?: { rate?: number; pitch?: number }): Promise<void> {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('[TTS] Browser TTS not available');
    return;
  }

  try {
    const voices = await ensureVoicesLoaded();
    const { voice, lang } = resolveBrowserVoice(voices, 'en-US', text);

    return new Promise<void>((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      if (voice) utterance.voice = voice;
      utterance.lang = lang;
      utterance.rate = options?.rate ?? 0.9;
      utterance.pitch = options?.pitch ?? 1;

      let settled = false;
      const cleanup = () => {
        window.speechSynthesis.cancel();
      };

      const finish = (error?: Error) => {
        if (settled) return;
        settled = true;
        cleanup();
        if (error) reject(error);
        else resolve();
      };

      utterance.onend = () => finish();
      utterance.onerror = (event) => finish(new Error(`TTS error: ${event.error}`));

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);

      // Timeout after 120 seconds
      setTimeout(() => finish(), 120000);
    });
  } catch (error) {
    console.error('[TTS] Error playing speech:', error);
    throw error;
  }
}
