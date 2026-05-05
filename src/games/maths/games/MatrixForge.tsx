/**
 * MATRIX FORGE — Matrices
 * Core loop: blacksmith forge theme. Player drops matrix elements into mould via cell-by-cell typing.
 * Mechanics: Element-by-element entry with partial credit; Sparks (gems) on fast correct cells.
 * FSRS: Each operation × dimension combo is a micro-skill.
 */

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGameEngine } from '@/games/engine/useGameEngine'
import type { MatrixForgeConfig } from '@/games/types'
import {
  LatexDisplay,
  GameTimer,
  ScoreCombo,
  MatrixGrid,
  ResponseFeedback,
} from '../primitives'

interface MatrixForgeProps {
  config: MatrixForgeConfig
}

export const MatrixForge: React.FC<MatrixForgeProps> = ({ config }) => {
  const [itemIndex, setItemIndex] = useState(0)
  const [userMatrix, setUserMatrix] = useState<number[][]>([])
  const [feedback, setFeedback] = useState<{ isCorrect: boolean | null; message?: string }>({
    isCorrect: null,
  })
  const [completedCells, setCompletedCells] = useState(0)
  const cellResponseTimeRef = useRef<Record<string, number>>({})
  const cellStartTimeRef = useRef<Record<string, number>>({})

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

  // Initialize user matrix with empty values
  useEffect(() => {
    if (currentItem) {
      const rows = currentItem.expectedResult.length
      const cols = currentItem.expectedResult[0]?.length || 0
      setUserMatrix(Array(rows).fill(null).map(() => Array(cols).fill(0)))
      setCompletedCells(0)
      cellResponseTimeRef.current = {}
      cellStartTimeRef.current = {}
    }
  }, [itemIndex, currentItem])

  const handleCellChange = (row: number, col: number, value: number) => {
    const cellKey = `${row}-${col}`

    // Start timer on first interaction
    if (!cellStartTimeRef.current[cellKey]) {
      cellStartTimeRef.current[cellKey] = Date.now()
    }

    const newMatrix = userMatrix.map(r => [...r])
    newMatrix[row][col] = value

    setUserMatrix(newMatrix)

    // Check cell correctness
    const isCorrect = value === currentItem.expectedResult[row][col]
    if (isCorrect) {
      const responseTime = Date.now() - cellStartTimeRef.current[cellKey]
      cellResponseTimeRef.current[cellKey] = responseTime

      setCompletedCells(prev => prev + 1)
      setFeedback({ isCorrect: true, message: responseTime < 1500 ? '✨ Spark!' : 'Locked' })

      // Check if all cells done
      const totalCells = currentItem.expectedResult.reduce((sum, row) => sum + row.length, 0)
      if (completedCells + 1 >= totalCells) {
        // Calculate average response time
        const avgResponseTime = Object.values(cellResponseTimeRef.current).reduce((a, b) => a + b, 0) / totalCells
        engine.onCorrect(avgResponseTime)

        // Move to next item after brief delay
        setTimeout(() => {
          if (itemIndex + 1 < config.items.length) {
            setItemIndex(itemIndex + 1)
          }
        }, 1200)
      }
    } else {
      setFeedback({ isCorrect: false, message: 'Try again' })
    }
  }

  if (!currentItem) {
    return <div>Game complete</div>
  }

  const operationLabel = {
    add: '+',
    subtract: '−',
    multiply: '×',
    transpose: 'Tᵀ',
    inverse: 'A⁻¹',
    decompose: 'Decompose',
  }[currentItem.operation]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-surface via-background to-surface-container
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
        <h1 className="text-4xl font-bold text-primary mb-2">⚒️ Matrix Forge</h1>
        <p className="text-on-surface-variant">Operation: {operationLabel}</p>
      </div>

      {/* Timer & Score */}
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

      {/* Matrices Display */}
      <div className="flex gap-8 items-center">
        {/* Input Matrix A */}
        <div className="text-center">
          <p className="text-sm text-on-surface-variant mb-2">Matrix A</p>
          <MatrixGrid matrix={currentItem.matrixA} cellWidth="50px" />
        </div>

        {currentItem.matrixB && (
          <>
            <span className="text-3xl text-primary">{operationLabel}</span>
            <div className="text-center">
              <p className="text-sm text-on-surface-variant mb-2">Matrix B</p>
              <MatrixGrid matrix={currentItem.matrixB} cellWidth="50px" />
            </div>
          </>
        )}
      </div>

      {/* User Entry Grid */}
      <div className="text-center">
        <p className="text-sm text-on-surface-variant mb-4">
          Drop elements into the forge ({completedCells}/{currentItem.cellsToFill})
        </p>
        <MatrixGrid
          matrix={userMatrix}
          editable={true}
          onCellChange={handleCellChange}
          highlightCells={userMatrix
            .map((row, r) => row.map((cell, c) => (cell === currentItem.expectedResult[r][c] ? [r, c] : null)))
            .flat()
            .filter((x): x is [number, number] => x !== null)}
        />
      </div>

      {/* Progress */}
      <div className="text-center">
        <div className="inline-block px-4 py-2 rounded-lg bg-surface-container">
          <p className="text-sm text-on-surface-variant">Progress</p>
          <p className="text-2xl font-bold text-primary">
            {completedCells} / {currentItem.cellsToFill}
          </p>
        </div>
      </div>

      <ResponseFeedback
        isCorrect={feedback.isCorrect}
        message={feedback.message}
        onDismiss={() => setFeedback({ isCorrect: null })}
      />
    </motion.div>
  )
}
