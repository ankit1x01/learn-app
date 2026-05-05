/**
 * DOMAIN DUELS — Relations & Functions
 * Arrow diagrams: check reflexivity, symmetry, transitivity, identify bijections
 */

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGameEngine } from '@/games/engine/useGameEngine'
import type { DomainDuelsConfig } from '@/games/types'
import { GameTimer, ScoreCombo, ResponseButtons, ResponseFeedback } from '../primitives'

interface DomainDuelsProps {
  config: DomainDuelsConfig
}

export const DomainDuels: React.FC<DomainDuelsProps> = ({ config }) => {
  const [itemIndex, setItemIndex] = useState(0)
  const [feedback, setFeedback] = useState<{ isCorrect: boolean | null; message?: string }>({
    isCorrect: null,
  })
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

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

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    const isCorrect = answer === currentItem.correctAnswer

    if (isCorrect) {
      setFeedback({ isCorrect: true, message: '✅ Correct!' })
      engine.onCorrect(1500)

      setTimeout(() => {
        if (itemIndex + 1 < config.items.length) {
          setItemIndex(itemIndex + 1)
          setSelectedAnswer(null)
        }
      }, 1200)
    } else {
      setFeedback({
        isCorrect: false,
        message: `Expected: ${currentItem.correctAnswer}`,
      })
    }
  }

  if (!currentItem) {
    return <div>Game complete</div>
  }

  const answerOptions = [
    { id: 'injective', label: 'Injective', icon: 'call_split', shortcut: 'i' },
    { id: 'surjective', label: 'Surjective', icon: 'filter_alt', shortcut: 's' },
    { id: 'bijective', label: 'Bijective', icon: 'check_circle', shortcut: 'b' },
    { id: 'neither', label: 'Neither', icon: 'cancel', shortcut: 'n' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-950/30 via-background to-purple-950/20
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
        <h1 className="text-4xl font-bold text-purple-600 mb-2">⚔️ Domain Duels</h1>
        <p className="text-on-surface-variant">Problem {itemIndex + 1} / {config.items.length}</p>
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

      {/* Diagram Display */}
      <motion.div
        className="p-8 bg-surface-container rounded-xl border-2 border-purple-600/50 max-w-lg"
        layout
      >
        <p className="text-sm text-on-surface-variant mb-4">Classify this mapping:</p>

        <div className="flex gap-8 justify-center items-center mb-6">
          {/* Set A */}
          <div className="text-center">
            <p className="text-sm font-semibold mb-2">Set A</p>
            <div className="flex flex-col gap-2">
              {currentItem.diagram.setA.map((elem, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm font-bold"
                >
                  {elem}
                </div>
              ))}
            </div>
          </div>

          {/* Arrows */}
          <div className="text-center">
            <p className="text-xs text-on-surface-variant mb-2">Mappings</p>
            <div className="flex flex-col gap-1">
              {currentItem.diagram.mappings.slice(0, 3).map((mapping, idx) => (
                <div key={idx} className="text-xs text-on-surface">
                  {mapping[0]} → {mapping[1]}
                </div>
              ))}
              {currentItem.diagram.mappings.length > 3 && (
                <p className="text-xs text-on-surface-variant">...</p>
              )}
            </div>
          </div>

          {/* Set B */}
          <div className="text-center">
            <p className="text-sm font-semibold mb-2">Set B</p>
            <div className="flex flex-col gap-2">
              {currentItem.diagram.setB.map((elem, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-sm font-bold"
                >
                  {elem}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-sm font-semibold mb-4">Is this mapping...</p>
        <ResponseButtons
          options={answerOptions}
          onSelect={handleAnswer}
          orientation="grid"
          columns={2}
        />
      </motion.div>

      <ResponseFeedback
        isCorrect={feedback.isCorrect}
        message={feedback.message}
        onDismiss={() => setFeedback({ isCorrect: null })}
      />
    </motion.div>
  )
}
