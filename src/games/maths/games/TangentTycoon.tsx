/**
 * TANGENT TYCOON — Applications of Derivatives
 * City-building: player runs scenarios with live graph, finds tangent lines, optimizes
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameEngine } from '@/games/engine/useGameEngine'
import type { TangentTycoonConfig } from '@/games/types'
import { LatexDisplay, GameTimer, ScoreCombo, ResponseFeedback } from '../primitives'

interface TangentTycoonProps {
  config: TangentTycoonConfig
}

export const TangentTycoon: React.FC<TangentTycoonProps> = ({ config }) => {
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

  const problemTypeLabel: Record<string, string> = {
    'tangent-line': 'Find tangent line at point',
    'increasing-interval': 'Find where increasing',
    'optimization': 'Maximize the area/volume',
    'extrema': 'Find local extrema',
  }

  const handleSubmit = () => {
    // Simple numeric comparison
    let isCorrect = false
    if (typeof currentItem.expectedAnswer === 'number') {
      const userNum = parseFloat(userAnswer)
      isCorrect = Math.abs(userNum - currentItem.expectedAnswer) < 0.01
    } else {
      isCorrect = userAnswer.toLowerCase().trim() === currentItem.expectedAnswer.toLowerCase().trim()
    }

    if (isCorrect) {
      setFeedback({ isCorrect: true, message: '🏢 District unlocked!' })
      engine.onCorrect(2500)

      setTimeout(() => {
        if (itemIndex + 1 < config.items.length) {
          setItemIndex(itemIndex + 1)
          setUserAnswer('')
        }
      }, 1200)
    } else {
      setFeedback({ isCorrect: false, message: `Expected: ${currentItem.expectedAnswer}` })
    }
  }

  if (!currentItem) {
    return <div>Game complete</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-green-950/30 via-background to-green-950/20
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
        <h1 className="text-4xl font-bold text-green-600 mb-2">🏙️ Tangent Tycoon</h1>
        <p className="text-on-surface-variant">Scenario {itemIndex + 1} / {config.items.length}</p>
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

      {/* Problem Display */}
      <motion.div
        className="p-8 bg-surface-container rounded-xl border-2 border-green-600/50 max-w-lg"
        layout
      >
        <p className="text-sm text-on-surface-variant mb-3">{problemTypeLabel[currentItem.problemType]}</p>
        <LatexDisplay latex={currentItem.functionLatex} block={true} />

        {currentItem.point !== undefined && (
          <p className="text-center text-sm mt-4 text-on-surface-variant">at x = {currentItem.point}</p>
        )}
      </motion.div>

      {/* Answer Input */}
      <div className="max-w-lg w-full flex gap-2">
        <input
          type="text"
          placeholder="Your answer"
          value={userAnswer}
          onChange={e => setUserAnswer(e.target.value)}
          className="flex-1 px-4 py-3 rounded-lg border-2 border-outline focus:border-primary
                     bg-background text-on-surface focus:outline-none"
        />
        <motion.button
          onClick={handleSubmit}
          className="px-6 py-3 rounded-lg bg-primary text-on-primary font-semibold
                     hover:bg-primary/90 active:scale-95"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Submit
        </motion.button>
      </div>

      <ResponseFeedback
        isCorrect={feedback.isCorrect}
        message={feedback.message}
        onDismiss={() => setFeedback({ isCorrect: null })}
      />
    </motion.div>
  )
}
