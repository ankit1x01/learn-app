/**
 * DET DETECTIVE — Determinants
 * Noir detective scene: player spots properties, expands along best row, computes minors
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameEngine } from '@/games/engine/useGameEngine'
import type { DetDetectiveConfig } from '@/games/types'
import { GameTimer, ScoreCombo, MatrixGrid, ResponseFeedback } from '../primitives'

interface DetDetectiveProps {
  config: DetDetectiveConfig
}

export const DetDetective: React.FC<DetDetectiveProps> = ({ config }) => {
  const [itemIndex, setItemIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState<{ isCorrect: boolean | null; message?: string }>({
    isCorrect: null,
  })

  const currentItem = config.items[itemIndex]

  const engine = useGameEngine({
    totalItems: config.items.length,
    timeLimit: currentItem?.timeLimit,
    difficulty: 1,
    gameType: config.type,
    onComplete: (result) => {
      config.onComplete?.(result)
    },
  })

  const handleSubmit = () => {
    const userDet = parseFloat(userAnswer)
    const isCorrect = Math.abs(userDet - currentItem.correctDeterminant) < 0.01

    if (isCorrect) {
      setFeedback({ isCorrect: true, message: '🔍 Case solved!' })
      engine.onCorrect(2500)

      setTimeout(() => {
        if (itemIndex + 1 < config.items.length) {
          setItemIndex(itemIndex + 1)
          setUserAnswer('')
        }
      }, 1200)
    } else {
      setFeedback({
        isCorrect: false,
        message: `Expected: ${currentItem.correctDeterminant}`,
      })
    }
  }

  if (!currentItem) {
    return <div>Game complete</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-950/50 via-background to-gray-900/30
                 flex flex-col items-start justify-start gap-4 p-4"
    >
      {/* Back Button */}
      <button
        onClick={() => config.onComplete?.({ gameType: config.type, score: engine.score, guesses: 0, hintsUsed: 0, timeMs: 0 })}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container active:scale-95 transition-transform"
      >
        <span className="material-symbols-rounded">chevron_left</span>
      </button>

      <div className="w-full text-center mt-4">
        <h1 className="text-4xl font-bold text-gray-600 mb-2">🔍 Det Detective</h1>
        <p className="text-on-surface-variant text-sm">Case {itemIndex + 1} / {config.items.length}</p>
      </div>

      <div className="flex gap-12">
        <GameTimer
          timeLeft={engine.timeLeft}
          totalTime={currentItem.timeLimit}
          isActive={!engine.isPaused && !engine.isComplete}
        />
        <ScoreCombo
          score={engine.score}
          streak={engine.streak}
          bestStreak={engine.bestStreak}
        />
      </div>

      {/* Matrix Display */}
      <motion.div
        className="p-8 bg-surface-container rounded-xl border-2 border-gray-600/50"
        layout
      >
        <p className="text-sm text-on-surface-variant mb-4 text-center">Find the determinant:</p>
        <MatrixGrid matrix={currentItem.matrix} cellWidth="60px" />

        {currentItem.shortcutHint && (
          <motion.p
            className="text-xs text-warning mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            💡 Hint: {currentItem.shortcutHint}
          </motion.p>
        )}
      </motion.div>

      {/* Answer Input */}
      <div className="max-w-xs w-full">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="det(A) = ?"
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg border-2 border-outline focus:border-primary
                       bg-background text-on-surface focus:outline-none font-mono text-lg"
          />
          <motion.button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-lg bg-primary text-on-primary font-semibold
                       hover:bg-primary/90 active:scale-95"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Solve
          </motion.button>
        </div>
      </div>

      <ResponseFeedback
        isCorrect={feedback.isCorrect}
        message={feedback.message}
        onDismiss={() => setFeedback({ isCorrect: null })}
      />
    </motion.div>
  )
}
