/**
 * useModality — master hook that coordinates all sensory channels.
 * Every game primitive calls this instead of raw haptic/audio APIs.
 *
 * Usage:
 *   const m = useModality({ haptic: true, audio: true, tts: true })
 *   m.correct('Mitochondria')   // fires haptic + audio + TTS together
 *   m.wrong()
 *   m.speak('What is the powerhouse of the cell?')
 */

import { useCallback, useRef } from 'react'
import { AudioEngine } from './audio/AudioEngine'
import { TTSEngine } from './audio/TTSEngine'
import { RhythmEngine } from './audio/RhythmEngine'
import { HapticPatterns } from './haptic/HapticPatterns'

export interface ModalityOptions {
  haptic?: boolean   // vibration feedback         (default: true)
  audio?: boolean    // sound effects              (default: true)
  tts?: boolean      // text-to-speech readout     (default: false)
  rhythm?: boolean   // beat/pulse for sequences   (default: false)
}

export function useModality(options: ModalityOptions = {}) {
  const { haptic = true, audio = true, tts = false, rhythm = false } = options
  const streakRef = useRef(0)

  /** Correct answer — all enabled channels fire together */
  const correct = useCallback((label?: string) => {
    streakRef.current += 1
    const streak = streakRef.current

    if (haptic) {
      streak >= 3 ? HapticPatterns.streak(streak) : HapticPatterns.correct()
    }
    if (audio) {
      streak >= 3 ? AudioEngine.play('streak', streak) : AudioEngine.play('correct')
    }
    if (tts && label) {
      TTSEngine.speak(label, { rate: 1.1 })
    }
  }, [haptic, audio, tts])

  /** Wrong answer */
  const wrong = useCallback((label?: string) => {
    streakRef.current = 0

    if (haptic) HapticPatterns.wrong()
    if (audio) AudioEngine.play('wrong')
    if (tts && label) TTSEngine.speak(label, { rate: 0.9 })
  }, [haptic, audio, tts])

  /** Level up / round complete */
  const levelUp = useCallback(() => {
    streakRef.current = 0
    if (haptic) HapticPatterns.levelUp()
    if (audio) AudioEngine.play('levelUp')
  }, [haptic, audio])

  /** Full game complete */
  const complete = useCallback(() => {
    if (haptic) HapticPatterns.levelUp()
    if (audio) AudioEngine.play('complete')
    if (rhythm) RhythmEngine.stop()
  }, [haptic, audio, rhythm])

  /** Timer tick — fires every second when time is low */
  const tick = useCallback(() => {
    if (haptic) HapticPatterns.tick()
    if (audio) AudioEngine.play('tick')
  }, [haptic, audio])

  /** Drag pickup */
  const pickup = useCallback(() => {
    if (haptic) HapticPatterns.pickup()
  }, [haptic])

  /** Drag drop accepted */
  const drop = useCallback(() => {
    if (haptic) HapticPatterns.drop()
    if (audio) AudioEngine.play('correct')
  }, [haptic, audio])

  /** Drag drop rejected */
  const reject = useCallback(() => {
    if (haptic) HapticPatterns.reject()
    if (audio) AudioEngine.play('wrong')
  }, [haptic, audio])

  /** Speak any text aloud */
  const speak = useCallback((text: string, opts?: { rate?: number }) => {
    if (tts) TTSEngine.speak(text, opts)
  }, [tts])

  /** Start rhythm beat */
  const startBeat = useCallback((bpm = 60) => {
    if (rhythm) RhythmEngine.start(bpm)
  }, [rhythm])

  /** Stop rhythm beat */
  const stopBeat = useCallback(() => {
    RhythmEngine.stop()
  }, [])

  /** Play sequence beats — one beat per item label */
  const playSequence = useCallback((
    labels: string[],
    bpm = 80,
    onBeat?: (i: number) => void,
  ) => {
    if (rhythm) RhythmEngine.playSequence(labels, bpm, onBeat)
  }, [rhythm])

  /** Reset streak counter */
  const resetStreak = useCallback(() => {
    streakRef.current = 0
  }, [])

  return {
    correct,
    wrong,
    levelUp,
    complete,
    tick,
    pickup,
    drop,
    reject,
    speak,
    startBeat,
    stopBeat,
    playSequence,
    resetStreak,
    streak: streakRef,
  }
}
