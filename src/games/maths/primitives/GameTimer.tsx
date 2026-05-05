import React from 'react'
import { motion } from 'framer-motion'

interface GameTimerProps {
  timeLeft: number | null
  totalTime: number
  isActive: boolean
}

export const GameTimer: React.FC<GameTimerProps> = ({ timeLeft, totalTime, isActive }) => {
  if (timeLeft === null) return null

  const percentage = (timeLeft / totalTime) * 100
  const isLow = timeLeft < totalTime * 0.25
  const isCritical = timeLeft < 3

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className={`text-3xl font-bold tabular-nums ${
          isCritical ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-on-surface'
        }`}
        animate={{ scale: isCritical ? [1, 1.1, 1] : 1 }}
        transition={{ duration: 0.5, repeat: isCritical ? Infinity : 0 }}
      >
        {Math.ceil(timeLeft)}s
      </motion.div>

      {/* Progress bar */}
      <div className="w-32 h-2 bg-surface-container rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${
            isCritical ? 'bg-error' : isLow ? 'bg-warning' : 'bg-primary'
          }`}
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </div>
  )
}
