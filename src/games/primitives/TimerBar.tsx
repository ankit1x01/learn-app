/**
 * TimerBar — shared countdown visual used by all timed games.
 * Color shifts: green → yellow → red as time runs low.
 */

import { motion } from 'motion/react'

interface Props {
  timeLeft: number      // current seconds remaining
  totalTime: number     // starting seconds
  onTick?: () => void   // called every second by parent (optional hook)
}

export function TimerBar({ timeLeft, totalTime }: Props) {
  const pct = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0

  const color =
    pct > 50 ? '#22C55E' :
    pct > 25 ? '#F59E0B' :
               '#EF4444'

  return (
    <div className="w-full h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: 'linear' }}
      />
    </div>
  )
}
