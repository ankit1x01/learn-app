export async function ensureVoicesLoaded(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) { resolve(voices); return; }
    window.speechSynthesis.onvoiceschanged = () => resolve(window.speechSynthesis.getVoices());
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 2000);
  });
}

export function isBrowserTTSAbortError(err: unknown): boolean {
  return err instanceof Error && err.message.includes('interrupted');
}

export async function playBrowserTTSPreview(text: string, voiceURI?: string): Promise<void> {
  const utterance = new SpeechSynthesisUtterance(text);
  if (voiceURI) {
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.voiceURI === voiceURI);
    if (voice) utterance.voice = voice;
  }
  window.speechSynthesis.speak(utterance);
}

export async function previewBrowserTTS(text: string, voiceURI?: string): Promise<void> {
  return playBrowserTTSPreview(text, voiceURI);
}
