import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ResponseFeedbackProps {
  isCorrect: boolean | null
  message?: string
  duration?: number
  onDismiss?: () => void
}

export const ResponseFeedback: React.FC<ResponseFeedbackProps> = ({
  isCorrect,
  message,
  duration = 1200,
  onDismiss,
}) => {
  React.useEffect(() => {
    if (isCorrect !== null && duration > 0) {
      const timer = setTimeout(() => onDismiss?.(), duration)
      return () => clearTimeout(timer)
    }
  }, [isCorrect, duration, onDismiss])

  return (
    <AnimatePresence>
      {isCorrect !== null && (
        <motion.div
          initial={{ scale: 0, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: 20 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className={`
            fixed top-20 left-1/2 -translate-x-1/2
            px-6 py-4 rounded-lg text-white font-semibold
            flex items-center gap-3 shadow-lg
            ${isCorrect ? 'bg-success' : 'bg-error'}
          `}
        >
          <span className="material-symbols-rounded text-2xl">
            {isCorrect ? 'check_circle' : 'cancel'}
          </span>
          <div>
            <div className="font-bold">{isCorrect ? 'Correct!' : 'Incorrect'}</div>
            {message && <div className="text-sm opacity-90">{message}</div>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
