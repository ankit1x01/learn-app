/**
 * PRINCIPAL VALLEY — Inverse Trigonometric Functions
 * Color-coded zones (ranges) with angle selector on protractor
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameEngine } from '@/games/engine/useGameEngine'
import type { PrincipalValleyConfig } from '@/games/types'
import { LatexDisplay, GameTimer, ScoreCombo, ResponseFeedback } from '../primitives'

interface PrincipalValleyProps {
  config: PrincipalValleyConfig
}

const zoneColors: Record<string, string> = {
  'sin-inv': 'bg-blue-500',
  'cos-inv': 'bg-red-500',
  'tan-inv': 'bg-green-500',
  'cot-inv': 'bg-yellow-500',
  'sec-inv': 'bg-indigo-500',
  'cosec-inv': 'bg-pink-500',
}

const zoneRanges: Record<string, string> = {
  'sin-inv': '[-π/2, π/2]',
  'cos-inv': '[0, π]',
  'tan-inv': '(-π/2, π/2)',
  'cot-inv': '(0, π)',
  'sec-inv': '[0, π]',
  'cosec-inv': '[-π/2, π/2]',
}

export const PrincipalValley: React.FC<PrincipalValleyProps> = ({ config }) => {
  const [itemIndex, setItemIndex] = useState(0)
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [selectedAngle, setSelectedAngle] = useState<number | null>(null)
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

  const handleZoneSelect = (zone: string) => {
    setSelectedZone(zone)
  }

  const handleAngleSelect = (angle: number) => {
    setSelectedAngle(angle)

    // Check if both zone and angle are correct
    if (zone === currentItem.correctZone && Math.abs(angle - currentItem.correctAngle) < 0.01) {
      setFeedback({ isCorrect: true, message: '✅ Principal value correct!' })
      engine.onCorrect(2000)

      setTimeout(() => {
        if (itemIndex + 1 < config.items.length) {
          setItemIndex(itemIndex + 1)
          setSelectedZone(null)
          setSelectedAngle(null)
        }
      }, 1200)
    } else if (zone !== currentItem.correctZone) {
      setFeedback({ isCorrect: false, message: 'Check the range constraint' })
    } else {
      setFeedback({ isCorrect: false, message: 'Check the angle value' })
    }
  }

  if (!currentItem) {
    return <div>Game complete</div>
  }

  const zone = selectedZone || currentItem.correctZone

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-950/30 via-background to-blue-950/20
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
        <h1 className="text-4xl font-bold text-blue-600 mb-2">🏔️ Principal Valley</h1>
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

      {/* Expression */}
      <motion.div
        className="p-6 bg-surface-container rounded-xl border-2 border-blue-600/50"
        layout
      >
        <p className="text-sm text-on-surface-variant mb-2">Find the principal value:</p>
        <LatexDisplay latex={currentItem.expression} block={true} />
      </motion.div>

      {/* Zone Selector */}
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(zoneColors).map(([zoneId, color]) => (
          <motion.button
            key={zoneId}
            onClick={() => handleZoneSelect(zoneId)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedZone === zoneId
                ? `${color} text-white border-white`
                : `${color}/30 text-on-surface border-${color}/50`
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <p className="text-xs font-semibold">{zoneId.split('-')[0].toUpperCase()}⁻¹</p>
            <p className="text-xs">{zoneRanges[zoneId]}</p>
          </motion.button>
        ))}
      </div>

      {/* Angle Protractor */}
      {selectedZone && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-surface-container rounded-xl border-2 border-blue-600/50"
        >
          <p className="text-sm text-on-surface-variant mb-4">Select angle in {zoneRanges[selectedZone]}</p>

          {/* Simple angle picker (0 to π) */}
          <div className="flex gap-2 flex-wrap justify-center">
            {[0, Math.PI / 6, Math.PI / 4, Math.PI / 3, Math.PI / 2, (2 * Math.PI) / 3, Math.PI].map(angle => (
              <motion.button
                key={angle}
                onClick={() => handleAngleSelect(angle)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  selectedAngle === angle
                    ? 'border-primary bg-primary/10'
                    : 'border-outline bg-surface'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-xs font-mono">
                  {angle === 0 ? '0' : angle === Math.PI / 6 ? 'π/6' : angle === Math.PI / 4 ? 'π/4' : angle === Math.PI / 3 ? 'π/3' : angle === Math.PI / 2 ? 'π/2' : angle === (2 * Math.PI) / 3 ? '2π/3' : 'π'}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      <ResponseFeedback
        isCorrect={feedback.isCorrect}
        message={feedback.message}
        onDismiss={() => setFeedback({ isCorrect: null })}
      />
    </motion.div>
  )
}
