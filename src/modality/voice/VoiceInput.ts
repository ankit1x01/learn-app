/**
 * VoiceInput — speech recognition wrapper.
 * Uses Web Speech API (works in Chrome on Android via Capacitor WebView).
 * Falls back gracefully if unavailable.
 */

type VoiceCallback = (transcript: string, confidence: number) => void

class VoiceInputClass {
  private recognition: any = null
  private enabled = false

  isSupported(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  }

  start(onResult: VoiceCallback, onEnd?: () => void) {
    if (!this.isSupported()) return

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    this.recognition = new SR()
    this.recognition.lang = 'en-IN'
    this.recognition.interimResults = false
    this.recognition.maxAlternatives = 1

    this.recognition.onresult = (event: any) => {
      const result = event.results[0][0]
      onResult(result.transcript.trim(), result.confidence)
    }

    this.recognition.onend = () => onEnd?.()
    this.recognition.onerror = () => onEnd?.()

    this.recognition.start()
    this.enabled = true
  }

  stop() {
    this.recognition?.stop()
    this.enabled = false
  }

  isActive() {
    return this.enabled
  }
}

export const VoiceInput = new VoiceInputClass()
