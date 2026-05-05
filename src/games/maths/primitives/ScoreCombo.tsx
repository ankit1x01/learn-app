import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ScoreComboProps {
  score: number
  streak: number
  bestStreak: number
  onComboMilestone?: (milestone: number) => void
}

export const ScoreCombo: React.FC<ScoreComboProps> = ({ score, streak, bestStreak, onComboMilestone }) => {
  // Trigger milestone animations
  React.useEffect(() => {
    if (streak === 5 || streak === 10 || streak === 20) {
      onComboMilestone?.(streak)
    }
  }, [streak, onComboMilestone])

  const comboMultiplier =
    streak >= 20 ? 4 : streak >= 10 ? 3 : streak >= 5 ? 2 : streak >= 3 ? 1.5 : 1

  return (
    <div className="flex gap-6 items-center justify-center">
      {/* Score */}
      <motion.div
        className="text-center"
        layout
      >
        <div className="text-sm text-on-surface-variant">Score</div>
        <motion.div
          className="text-3xl font-bold text-primary"
          key={score}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {score}
        </motion.div>
      </motion.div>

      {/* Streak */}
      <AnimatePresence mode="wait">
        {streak > 0 && (
          <motion.div
            key={streak}
            className="text-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-sm text-on-surface-variant">Streak</div>
            <div className="flex items-center justify-center gap-1">
              <motion.div
                className="text-3xl font-bold text-success"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.4 }}
              >
                {streak}
              </motion.div>
              {comboMultiplier > 1 && (
                <motion.span
                  className="text-sm font-semibold text-success"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  ×{comboMultiplier.toFixed(1)}
                </motion.span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Best Streak */}
      <div className="text-center">
        <div className="text-xs text-on-surface-variant">Best</div>
        <div className="text-xl font-semibold text-on-surface">{bestStreak}</div>
      </div>
    </div>
  )
}
