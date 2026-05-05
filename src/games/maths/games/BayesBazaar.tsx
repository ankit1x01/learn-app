/**
 * BAYES BAZAAR — Probability
 * Indian market: tree-builder for Bayes' theorem and conditional probability
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameEngine } from '@/games/engine/useGameEngine'
import type { BayesBazaarConfig } from '@/games/types'
import { GameTimer, ScoreCombo, ResponseButtons, ResponseFeedback } from '../primitives'

interface BayesBazaarProps {
  config: BayesBazaarConfig
}

export const BayesBazaar: React.FC<BayesBazaarProps> = ({ config }) => {
  const [itemIndex, setItemIndex] = useState(0)
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null)
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

  const strategyOptions = [
    { id: 'direct', label: 'Direct', icon: 'call_split', shortcut: 'd' },
    { id: 'conditional', label: 'Conditional', icon: 'filter_alt', shortcut: 'c' },
    { id: 'total-probability', label: 'Total Prob', icon: 'layers', shortcut: 't' },
    { id: 'bayes', label: 'Bayes', icon: 'psychology', shortcut: 'b' },
  ]

  const handleSubmit = () => {
    const strategyCorrect = selectedStrategy === currentItem.correctStrategy
    const answerCorrect = Math.abs(parseFloat(userAnswer) - currentItem.expectedProbability) < 0.001

    const isCorrect = strategyCorrect && answerCorrect

    if (isCorrect) {
      setFeedback({ isCorrect: true, message: '🎉 Probability unlocked!' })
      engine.onCorrect(2500)

      setTimeout(() => {
        if (itemIndex + 1 < config.items.length) {
          setItemIndex(itemIndex + 1)
          setSelectedStrategy(null)
          setUserAnswer('')
        }
      }, 1200)
    } else if (!strategyCorrect) {
      setFeedback({ isCorrect: false, message: `Strategy: ${currentItem.correctStrategy}` })
    } else {
      setFeedback({ isCorrect: false, message: `P = ${currentItem.expectedProbability.toFixed(3)}` })
    }
  }

  if (!currentItem) {
    return <div>Game complete</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-rose-950/30 via-background to-rose-950/20
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
        <h1 className="text-4xl font-bold text-rose-600 mb-2">🃏 Bayes Bazaar</h1>
        <p className="text-on-surface-variant">Stall {itemIndex + 1} / {config.items.length}</p>
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

      {/* Scenario */}
      <motion.div
        className="p-6 bg-surface-container rounded-xl border-2 border-rose-600/50 max-w-lg"
        layout
      >
        <p className="text-sm mb-4">{currentItem.scenario}</p>

        <div className="text-xs text-on-surface-variant space-y-1">
          {Object.entries(currentItem.givenInfo).map(([key, value]) => (
            <p key={key}>
              {key}: {value}
            </p>
          ))}
        </div>
      </motion.div>

      {/* Strategy Selection */}
      <div>
        <p className="text-sm text-on-surface-variant mb-3">Choose strategy:</p>
        <ResponseButtons
          options={strategyOptions}
          onSelect={setSelectedStrategy}
          orientation="grid"
          columns={2}
        />
      </div>

      {/* Probability Answer */}
      <div className="max-w-lg w-full flex gap-2">
        <input
          type="text"
          placeholder="P(A|B) = ?"
          value={userAnswer}
          onChange={e => setUserAnswer(e.target.value)}
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
          Solve
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
