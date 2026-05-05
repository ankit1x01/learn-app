/**
 * DIFF-EQ DESCENT — Differential Equations
 * Spelunking: player classifies DE type, then solves
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameEngine } from '@/games/engine/useGameEngine'
import type { DiffEqDescentConfig } from '@/games/types'
import { LatexDisplay, GameTimer, ScoreCombo, ResponseButtons, ResponseFeedback } from '../primitives'

interface DiffEqDescentProps {
  config: DiffEqDescentConfig
}

export const DiffEqDescent: React.FC<DiffEqDescentProps> = ({ config }) => {
  const [itemIndex, setItemIndex] = useState(0)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [userSolution, setUserSolution] = useState('')
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

  const typeOptions = [
    { id: 'separable', label: 'Separable', icon: 'call_split', shortcut: 's' },
    { id: 'homogeneous', label: 'Homogeneous', icon: 'layers', shortcut: 'h' },
    { id: 'linear', label: 'Linear', icon: 'trending_up', shortcut: 'l' },
    { id: 'exact', label: 'Exact', icon: 'check_circle', shortcut: 'e' },
  ]

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId)
  }

  const handleSubmit = () => {
    const typeCorrect = selectedType === currentItem.correctType
    const solutionCorrect = userSolution.toLowerCase().trim() === currentItem.expectedSolution.toLowerCase().trim()

    const isCorrect = typeCorrect && solutionCorrect

    if (isCorrect) {
      setFeedback({ isCorrect: true, message: '⬇️ Descended!' })
      engine.onCorrect(2500)

      setTimeout(() => {
        if (itemIndex + 1 < config.items.length) {
          setItemIndex(itemIndex + 1)
          setSelectedType(null)
          setUserSolution('')
        }
      }, 1200)
    } else if (!typeCorrect) {
      setFeedback({ isCorrect: false, message: `Type: ${currentItem.correctType}` })
    } else {
      setFeedback({ isCorrect: false, message: `Solution: ${currentItem.expectedSolution}` })
    }
  }

  if (!currentItem) {
    return <div>Game complete</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-slate-950/30 via-background to-slate-950/20
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
        <h1 className="text-4xl font-bold text-slate-600 mb-2">⬇️ Diff-Eq Descent</h1>
        <p className="text-on-surface-variant">Level {itemIndex + 1} / {config.items.length}</p>
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

      {/* Equation */}
      <motion.div
        className="p-6 bg-surface-container rounded-xl border-2 border-slate-600/50"
        layout
      >
        <p className="text-sm text-on-surface-variant mb-2">Classify this DE:</p>
        <LatexDisplay latex={currentItem.equation} block={true} />
      </motion.div>

      {/* Type Selection */}
      <div>
        <p className="text-sm text-on-surface-variant mb-3">Type:</p>
        <ResponseButtons
          options={typeOptions}
          onSelect={handleTypeSelect}
          orientation="grid"
          columns={2}
        />
      </div>

      {/* Solution Input */}
      <div className="max-w-lg w-full">
        <label className="text-sm text-on-surface-variant block mb-2">General solution:</label>
        <input
          type="text"
          placeholder="y = ?"
          value={userSolution}
          onChange={e => setUserSolution(e.target.value)}
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
        Submit
      </motion.button>

      <ResponseFeedback
        isCorrect={feedback.isCorrect}
        message={feedback.message}
        onDismiss={() => setFeedback({ isCorrect: null })}
      />
    </motion.div>
  )
}
