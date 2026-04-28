/**
 * ScoreDisplay — streak + score header used by all games.
 */

import { motion, AnimatePresence } from 'motion/react'


interface Props {
  score: number
  streak: number
  lives?: number | null
  timeLeft?: number | null
}

export function ScoreDisplay({ score, streak, lives, timeLeft }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-2">
      {/* Score */}
      <div className="text-sm font-bold text-[var(--color-on-surface)]" style={{ fontFamily: 'Inter, system-ui' }}>
        {score}<span className="text-[var(--color-border)] font-normal text-xs">/100</span>
      </div>

      {/* Streak */}
      <AnimatePresence>
        {streak >= 2 && (
          <motion.div
            key={streak}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            className="flex items-center gap-1 bg-[#FEF3C7] px-2.5 py-1 rounded-full"
          >
            <span className="material-symbols-rounded text-[#F59E0B]" style={{ fontSize: 13 }}>local_fire_department</span>
            <span className="text-xs font-bold text-[#92400E]">{streak}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lives or Timer */}
      <div className="text-sm font-medium text-[var(--color-on-surface-variant)]" style={{ fontFamily: 'Inter, system-ui' }}>
        {lives != null && (
          <span>{'❤️'.repeat(Math.max(0, lives))}</span>
        )}
        {timeLeft != null && (
          <span className={timeLeft <= 10 ? 'text-[#EF4444] font-bold' : ''}>
            {timeLeft}s
          </span>
        )}
      </div>
    </div>
  )
}
