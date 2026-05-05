/**
 * 3D ARCHITECT — 3D Geometry
 * Building scene: compute distances, angles, and geometric properties in 3D
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameEngine } from '@/games/engine/useGameEngine'
import type { ThreeDArchitectConfig } from '@/games/types'
import { GameTimer, ScoreCombo, ResponseFeedback } from '../primitives'

interface ThreeDArchitectProps {
  config: ThreeDArchitectConfig
}

const problemLabels: Record<string, string> = {
  'direction-cosines': 'Find direction cosines',
  'angle-between-lines': 'Find angle between lines',
  'distance-point-plane': 'Find distance from point to plane',
  'skew-lines': 'Find distance between skew lines',
}

export const ThreeDArchitect: React.FC<ThreeDArchitectProps> = ({ config }) => {
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
    let isCorrect = false

    if (typeof currentItem.expectedAnswer === 'number') {
      const userNum = parseFloat(userAnswer)
      isCorrect = Math.abs(userNum - currentItem.expectedAnswer) < 0.01
    } else {
      isCorrect = userAnswer.toLowerCase().trim() === currentItem.expectedAnswer.toLowerCase().trim()
    }

    if (isCorrect) {
      setFeedback({ isCorrect: true, message: '✅ Structure sound!' })
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
      className="min-h-screen bg-gradient-to-br from-cyan-950/30 via-background to-cyan-950/20
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
        <h1 className="text-4xl font-bold text-cyan-600 mb-2">🏛️ 3D Architect</h1>
        <p className="text-on-surface-variant">Structure {itemIndex + 1} / {config.items.length}</p>
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
        className="p-8 bg-surface-container rounded-xl border-2 border-cyan-600/50 max-w-lg"
        layout
      >
        <p className="text-sm text-on-surface-variant mb-4">{problemLabels[currentItem.problemType]}</p>

        <div className="space-y-3 font-mono text-sm">
          {currentItem.point && (
            <div>
              <p className="text-on-surface-variant">Point:</p>
              <p>P = ({currentItem.point[0]}, {currentItem.point[1]}, {currentItem.point[2]})</p>
            </div>
          )}

          {currentItem.line && (
            <div>
              <p className="text-on-surface-variant">Line:</p>
              <p>
                A = ({currentItem.line.pointA[0]}, {currentItem.line.pointA[1]}, {currentItem.line.pointA[2]})
              </p>
              <p>
                B = ({currentItem.line.pointB[0]}, {currentItem.line.pointB[1]}, {currentItem.line.pointB[2]})
              </p>
            </div>
          )}

          {currentItem.plane && (
            <div>
              <p className="text-on-surface-variant">Plane:</p>
              <p>
                {currentItem.plane.a}x + {currentItem.plane.b}y + {currentItem.plane.c}z + {currentItem.plane.d} = 0
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Answer Input */}
      <div className="max-w-lg w-full flex gap-2">
        <input
          type="text"
          placeholder="Answer"
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
          Check
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
