/**
 * AudioEngine — procedural sound using Web Audio API.
 * No audio files needed. All tones generated in-browser.
 * Singleton: one AudioContext shared across all games.
 */

type SoundName = 'correct' | 'wrong' | 'levelUp' | 'complete' | 'tick' | 'streak'

class AudioEngineClass {
  private ctx: AudioContext | null = null
  private enabled = true

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    // Resume if suspended (browser autoplay policy)
    if (this.ctx.state === 'suspended') this.ctx.resume()
    return this.ctx
  }

  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    gain = 0.3,
    startOffset = 0,
  ) {
    if (!this.enabled) return
    try {
      const ctx = this.getCtx()
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc.type = type
      osc.frequency.setValueAtTime(frequency, ctx.currentTime + startOffset)

      gainNode.gain.setValueAtTime(0, ctx.currentTime + startOffset)
      gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + startOffset + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + startOffset + duration,
      )

      osc.start(ctx.currentTime + startOffset)
      osc.stop(ctx.currentTime + startOffset + duration)
    } catch (_) {
      // Fail silently — audio is enhancement, not core
    }
  }

  play(sound: SoundName, streakCount = 1) {
    if (!this.enabled) return
    switch (sound) {
      case 'correct':
        // Short ascending two-tone: C5 → E5
        this.playTone(523, 0.12, 'sine', 0.25, 0)
        this.playTone(659, 0.15, 'sine', 0.25, 0.1)
        break

      case 'wrong':
        // Low descending: E4 → C4
        this.playTone(330, 0.12, 'sine', 0.2, 0)
        this.playTone(262, 0.2, 'sine', 0.2, 0.1)
        break

      case 'levelUp':
        // Rising arpeggio: C5 → E5 → G5 → C6
        this.playTone(523, 0.1, 'sine', 0.25, 0)
        this.playTone(659, 0.1, 'sine', 0.25, 0.1)
        this.playTone(784, 0.1, 'sine', 0.25, 0.2)
        this.playTone(1047, 0.2, 'sine', 0.3, 0.3)
        break

      case 'complete':
        // Full chord strum: C major
        this.playTone(523, 0.4, 'sine', 0.2, 0)
        this.playTone(659, 0.4, 'sine', 0.2, 0.05)
        this.playTone(784, 0.5, 'sine', 0.2, 0.1)
        this.playTone(1047, 0.6, 'sine', 0.2, 0.15)
        break

      case 'tick':
        // Sharp click
        this.playTone(800, 0.04, 'square', 0.1, 0)
        break

      case 'streak':
        // Escalate pitch with streak count (caps at 7)
        const semitones = Math.min(streakCount - 1, 6)
        const baseFreq = 523 * Math.pow(2, semitones / 12)
        this.playTone(baseFreq, 0.12, 'sine', 0.25, 0)
        this.playTone(baseFreq * 1.25, 0.15, 'sine', 0.25, 0.1)
        break
    }
  }

  setEnabled(val: boolean) {
    this.enabled = val
  }

  isEnabled() {
    return this.enabled
  }
}

export const AudioEngine = new AudioEngineClass()
