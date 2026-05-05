/**
 * INTEGRAL INFERNO — Integration
 * Core loop: dungeon crawler. Each room is an integrand. Player taps technique rune (u-sub, parts, etc.)
 * within 2.5s to train pattern recognition, then completes 1–3 fill-in-the-blank steps.
 * Mechanics: Pattern-spotting score (×3 XP if rune tapped in <2.5s); combo system; mastery gate.
 * FSRS: Technique recognition is per-micro-skill; completion steps are bonus.
 */

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameEngine } from '@/games/engine/useGameEngine'
import type { IntegralInfernoConfig } from '@/games/types'
import {
  LatexDisplay,
  GameTimer,
  ScoreCombo,
  ResponseButtons,
  ResponseFeedback,
  type ResponseOption,
} from '../primitives'

interface IntegralInfernoProps {
  config: IntegralInfernoConfig
}

type GamePhase = 'technique-select' | 'completion' | 'result'

export const IntegralInferno: React.FC<IntegralInfernoProps> = ({ config }) => {
  const [itemIndex, setItemIndex] = useState(0)
  const [phase, setPhase] = useState<GamePhase>('technique-select')
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null)
  const [completionAnswers, setCompletionAnswers] = useState<Record<number, string>>({})
  const [techniqueResponseTime, setTechniqueResponseTime] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<{ isCorrect: boolean | null; message?: string }>({
    isCorrect: null,
  })

  const techniqueStartTimeRef = useRef(Date.now())
  const currentItem = config.items[itemIndex]

  const engine = useGameEngine({
    totalItems: config.items.length,
    timeLimit: undefined, // Timed per-rune, not global
    difficulty: 1,
    gameType: config.type,
    onComplete: (result) => {
      config.onComplete?.(result)
    },
  })

  // Reset on item change
  useEffect(() => {
    if (currentItem) {
      setPhase('technique-select')
      setSelectedTechnique(null)
      setCompletionAnswers({})
      setTechniqueResponseTime(null)
      techniqueStartTimeRef.current = Date.now()
    }
  }, [itemIndex, currentItem])

  // Technique rune options
  const techniqueOptions: ResponseOption[] = [
    { id: 'direct', label: 'Direct', icon: 'formula', shortcut: 'd' },
    { id: 'u-sub', label: 'u-Sub', icon: 'subscript', shortcut: 'u' },
    { id: 'parts', label: 'Parts', icon: 'layers', shortcut: 'p' },
    { id: 'partial-fractions', label: 'Partial F.', icon: 'call_split', shortcut: 'f' },
    { id: 'trig-id', label: 'Trig ID', icon: 'functions', shortcut: 't' },
    { id: 'special-form', label: 'Special', icon: 'diamond', shortcut: 's' },
  ]

  const handleTechniqueSelect = (techniqueId: string) => {
    const responseTime = Date.now() - techniqueStartTimeRef.current
    setTechniqueResponseTime(responseTime)
    setSelectedTechnique(techniqueId)

    const isCorrect = techniqueId === currentItem.correctTechnique
    if (isCorrect) {
      const patternBonus = responseTime < 2500 ? 3 : 1
      setFeedback({
        isCorrect: true,
        message: responseTime < 2500 ? '⚡ Pattern mastery!' : 'Technique correct',
      })

      // Apply bonus to score
      engine.onCorrect(responseTime)

      // Move to completion phase if there are steps
      if (currentItem.completionSteps && currentItem.completionSteps.length > 0) {
        setTimeout(() => setPhase('completion'), 800)
      } else {
        // Directly to next item
        setTimeout(() => {
          if (itemIndex + 1 < config.items.length) {
            setItemIndex(itemIndex + 1)
          }
        }, 1200)
      }
    } else {
      setFeedback({
        isCorrect: false,
        message: `Try again. Hint: look for ${currentItem.correctTechnique}`,
      })
    }
  }

  const handleCompletionAnswer = (stepIndex: number, answer: string) => {
    setCompletionAnswers(prev => ({ ...prev, [stepIndex]: answer }))
  }

  const handleCompletionSubmit = () => {
    // Validate all completion answers
    let allCorrect = true
    currentItem.completionSteps?.forEach((step, idx) => {
      const userAnswer = completionAnswers[idx]?.trim().toLowerCase()
      const expected = step.answer.trim().toLowerCase()
      if (userAnswer !== expected) {
        allCorrect = false
      }
    })

    if (allCorrect) {
      setFeedback({ isCorrect: true, message: '✅ Mastery unlocked!' })
      setTimeout(() => {
        if (itemIndex + 1 < config.items.length) {
          setItemIndex(itemIndex + 1)
        }
      }, 1200)
    } else {
      setFeedback({ isCorrect: false, message: 'Review the steps and try again' })
    }
  }

  if (!currentItem) {
    return <div>Game complete</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-orange-950/30 via-background to-red-950/20
                 flex flex-col items-start justify-start gap-4 p-4"
    >
      {/* Back Button */}
      <button
        onClick={() => config.onComplete?.({ gameType: config.type, score: engine.score, guesses: 0, hintsUsed: 0, timeMs: 0 })}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container active:scale-95 transition-transform"
      >
        <span className="material-symbols-rounded">chevron_left</span>
      </button>

      {/* Header */}
      <div className="w-full text-center mt-4">
        <h1 className="text-4xl font-bold text-orange-600 mb-2">🔥 Integral Inferno</h1>
        <p className="text-on-surface-variant">Room {itemIndex + 1} / {config.items.length}</p>
      </div>

      <ScoreCombo
        score={engine.score}
        streak={engine.streak}
        bestStreak={engine.bestStreak}
      />

      {/* Integrand Display */}
      <motion.div
        className="text-center p-6 bg-surface-container rounded-xl border-2 border-orange-600/50"
        layout
      >
        <p className="text-sm text-on-surface-variant mb-3">Integrand</p>
        <LatexDisplay latex={currentItem.integrand} block={true} />
      </motion.div>

      <AnimatePresence mode="wait">
        {phase === 'technique-select' && (
          <motion.div
            key="technique"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-4"
          >
            <p className="text-lg font-semibold">Choose technique (&lt; 2.5s for bonus)</p>
            <ResponseButtons
              options={techniqueOptions}
              onSelect={handleTechniqueSelect}
              orientation="grid"
              columns={3}
            />
          </motion.div>
        )}

        {phase === 'completion' && currentItem.completionSteps && (
          <motion.div
            key="completion"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-lg space-y-4"
          >
            <p className="text-center text-lg font-semibold">Complete the steps</p>
            {currentItem.completionSteps.map((step, idx) => (
              <div key={idx} className="p-4 bg-surface-container rounded-lg">
                <p className="text-sm text-on-surface-variant mb-2">{step.prompt}</p>
                <input
                  type="text"
                  placeholder="Your answer"
                  value={completionAnswers[idx] ?? ''}
                  onChange={e => handleCompletionAnswer(idx, e.target.value)}
                  className="w-full px-3 py-2 rounded border-2 border-outline focus:border-primary
                             bg-background text-on-surface focus:outline-none"
                />
              </div>
            ))}
            <motion.button
              onClick={handleCompletionSubmit}
              className="w-full py-3 rounded-lg bg-primary text-on-primary font-semibold
                         hover:bg-primary/90 active:scale-95"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Submit
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <ResponseFeedback
        isCorrect={feedback.isCorrect}
        message={feedback.message}
        onDismiss={() => setFeedback({ isCorrect: null })}
      />
    </motion.div>
  )
}
