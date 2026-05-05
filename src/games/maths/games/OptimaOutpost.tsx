/**
 * OPTIMA OUTPOST — Linear Programming
 * Trading post: translate constraints, find corner points, optimize
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameEngine } from '@/games/engine/useGameEngine'
import type { OptimaOutpostConfig } from '@/games/types'
import { GameTimer, ScoreCombo, ResponseFeedback } from '../primitives'

interface OptimaOutpostProps {
  config: OptimaOutpostConfig
}

export const OptimaOutpost: React.FC<OptimaOutpostProps> = ({ config }) => {
  const [itemIndex, setItemIndex] = useState(0)
  const [constraints, setConstraints] = useState<string[]>([])
  const [objective, setObjective] = useState('')
  const [optimalValue, setOptimalValue] = useState('')
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
    const optimalCorrect = Math.abs(parseFloat(optimalValue) - currentItem.optimalAnswer) < 0.01

    if (optimalCorrect) {
      setFeedback({ isCorrect: true, message: '🏴 Trade complete!' })
      engine.onCorrect(2500)

      setTimeout(() => {
        if (itemIndex + 1 < config.items.length) {
          setItemIndex(itemIndex + 1)
          setConstraints([])
          setObjective('')
          setOptimalValue('')
        }
      }, 1200)
    } else {
      setFeedback({ isCorrect: false, message: `Max value: ${currentItem.optimalAnswer}` })
    }
  }

  if (!currentItem) {
    return <div>Game complete</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-orange-950/30 via-background to-orange-950/20
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
        <h1 className="text-4xl font-bold text-orange-600 mb-2">🎭 Optima Outpost</h1>
        <p className="text-on-surface-variant">Trade {itemIndex + 1} / {config.items.length}</p>
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

      {/* Problem Description */}
      <motion.div
        className="p-6 bg-surface-container rounded-xl border-2 border-orange-600/50 max-w-lg"
        layout
      >
        <p className="text-sm mb-4">{currentItem.problemDescription}</p>

        <div className="space-y-3 font-mono text-sm">
          <div>
            <p className="text-on-surface-variant mb-1">Constraints:</p>
            {currentItem.constraints.map((constraint, idx) => (
              <p key={idx}>{constraint.inequality}</p>
            ))}
          </div>
          <div>
            <p className="text-on-surface-variant">Objective:</p>
            <p>Maximize Z = {currentItem.objective}</p>
          </div>
        </div>
      </motion.div>

      {/* Corner Points Reference */}
      <motion.div
        className="p-4 bg-surface-container-low rounded-lg text-xs text-on-surface-variant max-w-lg"
        layout
      >
        <p className="font-semibold mb-2">Feasible corner points:</p>
        <div className="grid grid-cols-2 gap-1 font-mono">
          {currentItem.feasibleCorners.map((corner, idx) => (
            <p key={idx}>
              ({corner[0]}, {corner[1]})
            </p>
          ))}
        </div>
      </motion.div>

      {/* Optimal Value Input */}
      <div className="max-w-lg w-full flex gap-2">
        <input
          type="text"
          placeholder="Maximum Z = ?"
          value={optimalValue}
          onChange={e => setOptimalValue(e.target.value)}
          className="flex-1 px-4 py-3 rounded-lg border-2 border-outline focus:border-primary
                     bg-background text-on-surface focus:outline-none font-mono"
        />
        <motion.button
          onClick={handleSubmit}
          className="px-6 py-3 rounded-lg bg-primary text-on-primary font-semibold
                     hover:bg-primary/90 active:scale-95"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Optimize
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
