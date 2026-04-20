/**
 * RhythmEngine — beat/pulse patterns using Web Audio API.
 * Used for sequence games and formula rhythm encoding.
 * No Tone.js dependency — uses raw Web Audio for minimal bundle size.
 */

class RhythmEngineClass {
  private ctx: AudioContext | null = null
  private intervalId: ReturnType<typeof setInterval> | null = null
  private enabled = true

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    if (this.ctx.state === 'suspended') this.ctx.resume()
    return this.ctx
  }

  private click(freq = 880, duration = 0.04, gain = 0.15) {
    try {
      const ctx = this.getCtx()
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.connect(g)
      g.connect(ctx.destination)
      osc.frequency.value = freq
      osc.type = 'square'
      g.gain.setValueAtTime(gain, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + duration)
    } catch (_) {}
  }

  /**
   * Start a steady beat at given BPM.
   * accent = true plays a louder click on beat 1 of each bar (4/4)
   */
  start(bpm = 60, accent = true) {
    if (!this.enabled) return
    this.stop()

    let beatCount = 0
    const intervalMs = (60 / bpm) * 1000

    this.intervalId = setInterval(() => {
      const isAccent = accent && beatCount % 4 === 0
      this.click(isAccent ? 1100 : 880, 0.04, isAccent ? 0.25 : 0.12)
      beatCount++
    }, intervalMs)
  }

  /**
   * Play a single rhythmic pattern for a sequence of labels.
   * Each label gets one beat tap — useful for Ghana-patha style encoding.
   */
  playSequence(labels: string[], bpm = 80, onBeat?: (index: number) => void) {
    if (!this.enabled) return
    const intervalMs = (60 / bpm) * 1000
    let i = 0

    const tick = () => {
      if (i >= labels.length) return
      this.click(880, 0.05, 0.2)
      onBeat?.(i)
      i++
      if (i < labels.length) setTimeout(tick, intervalMs)
    }
    tick()
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  setEnabled(val: boolean) {
    this.enabled = val
    if (!val) this.stop()
  }

  isEnabled() {
    return this.enabled
  }
}

export const RhythmEngine = new RhythmEngineClass()
