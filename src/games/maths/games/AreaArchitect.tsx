/**
 * AREA ARCHITECT — Applications of Integrals
 * Drafting board: player sets bounds, chooses integration variable, computes area
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameEngine } from '@/games/engine/useGameEngine'
import type { AreaArchitectConfig } from '@/games/types'
import { GameTimer, ScoreCombo, ResponseButtons, ResponseFeedback } from '../primitives'

interface AreaArchitectProps {
  config: AreaArchitectConfig
}

export const AreaArchitect: React.FC<AreaArchitectProps> = ({ config }) => {
  const [itemIndex, setItemIndex] = useState(0)
  const [integrationVar, setIntegrationVar] = useState<'x' | 'y' | null>(null)
  const [lowerBound, setLowerBound] = useState('')
  const [upperBound, setUpperBound] = useState('')
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
    const varCorrect = integrationVar === currentItem.integrationVariable
    const lowerCorrect = Math.abs(parseFloat(lowerBound) - currentItem.bounds[0]) < 0.01
    const upperCorrect = Math.abs(parseFloat(upperBound) - currentItem.bounds[1]) < 0.01
    const areaCorrect = Math.abs(parseFloat(userAnswer) - currentItem.expectedArea) < 0.01

    const allCorrect = varCorrect && lowerCorrect && upperCorrect && areaCorrect

    if (allCorrect) {
      setFeedback({ isCorrect: true, message: '🏛️ Monument built!' })
      engine.onCorrect(2500)

      setTimeout(() => {
        if (itemIndex + 1 < config.items.length) {
          setItemIndex(itemIndex + 1)
          setIntegrationVar(null)
          setLowerBound('')
          setUpperBound('')
          setUserAnswer('')
        }
      }, 1200)
    } else {
      const errors = []
      if (!varCorrect) errors.push(`Variable: use ${currentItem.integrationVariable}`)
      if (!lowerCorrect) errors.push(`Lower: ${currentItem.bounds[0]}`)
      if (!upperCorrect) errors.push(`Upper: ${currentItem.bounds[1]}`)
      if (!areaCorrect) errors.push(`Area: ${currentItem.expectedArea}`)

      setFeedback({ isCorrect: false, message: errors.join('; ') })
    }
  }

  if (!currentItem) {
    return <div>Game complete</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-amber-950/30 via-background to-amber-950/20
                 flex flex-col items-start justify-start gap-4 p-4"
    >
      {/* Header with back button */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={() => config.onComplete?.({ gameType: config.type, score: engine.score, guesses: 0, hintsUsed: 0, timeMs: 0 })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container active:scale-95 transition-transform"
        >
          <span className="material-symbols-rounded">chevron_left</span>
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold text-amber-600">Area Architect</h1>
          <p className="text-sm text-on-surface-variant">Project {itemIndex + 1} / {config.items.length}</p>
        </div>
        <div className="w-20"></div>
      </div>

      {/* Game content */}
      <div className="w-full flex flex-col items-center justify-center gap-6"
      >

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

      {/* Curves */}
      <motion.div
        className="p-6 bg-surface-container rounded-xl border-2 border-amber-600/50"
        layout
      >
        <p className="text-sm text-on-surface-variant mb-3">Curves bounding the region:</p>
        <div className="space-y-2">
          {currentItem.curves.map((curve, idx) => (
            <p key={idx} className="text-sm">
              {curve.label}: <span className="font-mono">{curve.equation}</span>
            </p>
          ))}
        </div>
      </motion.div>

      {/* Variable Selection */}
      <div>
        <p className="text-sm text-on-surface-variant mb-2">Integrate with respect to:</p>
        <ResponseButtons
          options={[
            { id: 'x', label: 'x', shortcut: 'x' },
            { id: 'y', label: 'y', shortcut: 'y' },
          ]}
          onSelect={setIntegrationVar as any}
          orientation="horizontal"
        />
      </div>

      {/* Bounds */}
      <div className="max-w-lg w-full space-y-3">
        <div className="flex gap-2">
          <label className="text-sm text-on-surface-variant w-16">Lower:</label>
          <input
            type="text"
            placeholder="a"
            value={lowerBound}
            onChange={e => setLowerBound(e.target.value)}
            className="flex-1 px-3 py-2 rounded border-2 border-outline focus:border-primary
                       bg-background text-on-surface focus:outline-none font-mono"
          />
        </div>
        <div className="flex gap-2">
          <label className="text-sm text-on-surface-variant w-16">Upper:</label>
          <input
            type="text"
            placeholder="b"
            value={upperBound}
            onChange={e => setUpperBound(e.target.value)}
            className="flex-1 px-3 py-2 rounded border-2 border-outline focus:border-primary
                       bg-background text-on-surface focus:outline-none font-mono"
          />
        </div>
      </div>

      {/* Area Answer */}
      <div className="max-w-lg w-full flex gap-2">
        <input
          type="text"
          placeholder="Area = ?"
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
          Compute
        </motion.button>
      </div>

      <ResponseFeedback
        isCorrect={feedback.isCorrect}
        message={feedback.message}
        onDismiss={() => setFeedback({ isCorrect: null })}
      />
      </div>
    </motion.div>
  )
}
