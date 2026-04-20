/**
 * TTSEngine — Text-to-speech using Web Speech API.
 * Falls back to no-op if unavailable (older Android WebViews).
 */

class TTSEngineClass {
  private enabled = true
  private utterance: SpeechSynthesisUtterance | null = null

  speak(text: string, options?: { rate?: number; pitch?: number; lang?: string }) {
    if (!this.enabled) return
    if (!('speechSynthesis' in window)) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const u = new SpeechSynthesisUtterance(text)
    u.rate = options?.rate ?? 0.95
    u.pitch = options?.pitch ?? 1.0
    u.lang = options?.lang ?? 'en-IN'
    u.volume = 0.9

    this.utterance = u
    window.speechSynthesis.speak(u)
  }

  stop() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    this.utterance = null
  }

  setEnabled(val: boolean) {
    this.enabled = val
    if (!val) this.stop()
  }

  isEnabled() {
    return this.enabled
  }
}

export const TTSEngine = new TTSEngineClass()
