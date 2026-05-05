/**
 * DERIVATIVE DOJO — Continuity & Differentiability
 * Martial arts theme: player chains differentiation rules (combo system)
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameEngine } from '@/games/engine/useGameEngine'
import type { DerivativeDojoConfig } from '@/games/types'
import { LatexDisplay, GameTimer, ScoreCombo, ResponseButtons, ResponseFeedback } from '../primitives'

interface DerivativeDojoProps {
  config: DerivativeDojoConfig
}

export const DerivativeDojo: React.FC<DerivativeDojoProps> = ({ config }) => {
  const [itemIndex, setItemIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [selectedRules, setSelectedRules] = useState<string[]>([])
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

  const ruleOptions = [
    { id: 'chain', label: 'Chain', icon: 'link', shortcut: 'c' },
    { id: 'product', label: 'Product', icon: 'close', shortcut: 'p' },
    { id: 'quotient', label: 'Quotient', icon: 'functions', shortcut: 'q' },
    { id: 'log-diff', label: 'Log Diff', icon: 'description', shortcut: 'l' },
    { id: 'implicit', label: 'Implicit', icon: 'more_horiz', shortcut: 'i' },
  ]

  const handleRuleSelect = (ruleId: string) => {
    setSelectedRules(prev =>
      prev.includes(ruleId) ? prev.filter(r => r !== ruleId) : [...prev, ruleId],
    )
  }

  const handleSubmit = () => {
    // Validate: check if selected rules are superset of needed rules
    const hasAllRules = currentItem.rulesNeeded.every(rule => selectedRules.includes(rule))
    const answerMatches = userAnswer.toLowerCase().trim() === currentItem.expectedDerivative.toLowerCase().trim()

    const isCorrect = hasAllRules && answerMatches

    if (isCorrect) {
      const comboBonus = currentItem.comboReward ? ' ⚡ Perfect combo!' : ''
      setFeedback({ isCorrect: true, message: `✅ Kata complete!${comboBonus}` })
      engine.onCorrect(2000)

      setTimeout(() => {
        if (itemIndex + 1 < config.items.length) {
          setItemIndex(itemIndex + 1)
          setUserAnswer('')
          setSelectedRules([])
        }
      }, 1200)
    } else if (!hasAllRules) {
      setFeedback({ isCorrect: false, message: `Need: ${currentItem.rulesNeeded.join(', ')}` })
    } else {
      setFeedback({ isCorrect: false, message: `Check: dy/dx = ${currentItem.expectedDerivative}` })
    }
  }

  if (!currentItem) {
    return <div>Game complete</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-red-950/30 via-background to-red-950/20
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
        <h1 className="text-4xl font-bold text-red-600 mb-2">🥋 Derivative Dojo</h1>
        <p className="text-on-surface-variant">Kata {itemIndex + 1} / {config.items.length}</p>
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

      {/* Function Display */}
      <motion.div
        className="p-6 bg-surface-container rounded-xl border-2 border-red-600/50"
        layout
      >
        <p className="text-sm text-on-surface-variant mb-2">Find dy/dx:</p>
        <LatexDisplay latex={currentItem.functionLatex} block={true} />
      </motion.div>

      {/* Rule Selection */}
      <div className="max-w-lg">
        <p className="text-sm text-on-surface-variant mb-3 text-center">Select rules needed:</p>
        <ResponseButtons
          options={ruleOptions}
          onSelect={handleRuleSelect}
          orientation="grid"
          columns={5}
        />
      </div>

      {/* Answer Input */}
      <div className="max-w-lg w-full">
        <input
          type="text"
          placeholder="dy/dx = ?"
          value={userAnswer}
          onChange={e => setUserAnswer(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border-2 border-outline focus:border-primary
                     bg-background text-on-surface focus:outline-none font-mono"
        />
      </div>

      {/* Submit */}
      <motion.button
        onClick={handleSubmit}
        className="px-8 py-3 rounded-lg bg-primary text-on-primary font-semibold
                   hover:bg-primary/90 active:scale-95"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Submit Kata
      </motion.button>

      <ResponseFeedback
        isCorrect={feedback.isCorrect}
        message={feedback.message}
        onDismiss={() => setFeedback({ isCorrect: null })}
      />
    </motion.div>
  )
}
