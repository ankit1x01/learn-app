/**
 * HapticPatterns — named vibration patterns via @capacitor/haptics.
 * Each pattern has a semantic name so games never call raw haptic APIs.
 */

import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'

export const HapticPatterns = {
  /** Short light tap — correct answer, item placed */
  correct() {
    Haptics.impact({ style: ImpactStyle.Light }).catch(() => {})
  },

  /** Double medium tap — wrong answer */
  wrong() {
    Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {})
    setTimeout(() => Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {}), 120)
  },

  /** Heavy single thud — big mistake, life lost */
  heavyWrong() {
    Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => {})
  },

  /** Success notification — level complete */
  levelUp() {
    Haptics.notification({ type: NotificationType.Success }).catch(() => {})
  },

  /** Warning notification — time running low */
  warning() {
    Haptics.notification({ type: NotificationType.Warning }).catch(() => {})
  },

  /** Error notification — game over */
  gameOver() {
    Haptics.notification({ type: NotificationType.Error }).catch(() => {})
  },

  /** Micro tick — timer pulse every second */
  tick() {
    Haptics.impact({ style: ImpactStyle.Light }).catch(() => {})
  },

  /** Rapid ascending taps — streak building (count = streak length) */
  streak(count: number) {
    const taps = Math.min(count, 5)
    let delay = 0
    for (let i = 0; i < taps; i++) {
      setTimeout(
        () => Haptics.impact({ style: ImpactStyle.Light }).catch(() => {}),
        delay,
      )
      delay += 80 - i * 10 // gets faster with each tap
    }
  },

  /** Drag pickup — item lifted */
  pickup() {
    Haptics.impact({ style: ImpactStyle.Light }).catch(() => {})
  },

  /** Drag drop — item placed in zone */
  drop() {
    Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {})
  },

  /** Rejected drop — wrong zone */
  reject() {
    Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => {})
    setTimeout(() => Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {}), 100)
  },
}
