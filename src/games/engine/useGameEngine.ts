/**
 * useGameEngine — shared game loop hook.
 * Handles timer, score, streak, lives, difficulty, and FSRS result emission.
 * Every game primitive uses this instead of rolling its own state.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import type { GameResult } from '../types'

export interface GameEngineOptions {
  totalItems: number
  timeLimit?: number          // seconds; undefined = untimed
  lives?: number              // undefined = infinite
  difficulty?: 1 | 2 | 3
  onComplete: (result: GameResult) => void
  gameType: GameResult['gameType']
}

export interface GameEngineState {
  score: number
  streak: number
  bestStreak: number
  timeLeft: number | null
  lives: number | null
  isComplete: boolean
  isPaused: boolean
  correctCount: number
  wrongCount: number
  hintsUsed: number
  level: number
}

export function useGameEngine(options: GameEngineOptions) {
  const {
    totalItems,
    timeLimit,
    lives: initialLives,
    difficulty = 1,
    onComplete,
    gameType,
  } = options

  const startTimeRef = useRef(Date.now())
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [state, setState] = useState<GameEngineState>({
    score: 0,
    streak: 0,
    bestStreak: 0,
    timeLeft: timeLimit ?? null,
    lives: initialLives ?? null,
    isComplete: false,
    isPaused: false,
    correctCount: 0,
    wrongCount: 0,
    hintsUsed: 0,
    level: difficulty,
  })

  // ── Timer ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (timeLimit == null || state.isComplete || state.isPaused) return

    tickRef.current = setInterval(() => {
      setState(prev => {
        if (prev.timeLeft == null || prev.timeLeft <= 1) {
          clearInterval(tickRef.current!)
          // Time's up — auto complete
          const result: GameResult = {
            gameType,
            score: prev.score,
            guesses: prev.correctCount + prev.wrongCount,
            hintsUsed: prev.hintsUsed,
            timeMs: Date.now() - startTimeRef.current,
          }
          onComplete(result)
          return { ...prev, timeLeft: 0, isComplete: true }
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 }
      })
    }, 1000)

    return () => {
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [timeLimit, state.isComplete, state.isPaused])

  // ── Actions ──────────────────────────────────────────────────────────────

  const onCorrect = useCallback((responseTimeMs = 1000) => {
    setState(prev => {
      const newStreak = prev.streak + 1
      const speedBonus = Math.max(0, Math.floor((3000 - responseTimeMs) / 100))
      const streakBonus = newStreak >= 5 ? 5 : newStreak >= 3 ? 2 : 0
      const basePoints = 10
      const points = basePoints + speedBonus + streakBonus

      const newCorrect = prev.correctCount + 1
      const isLast = newCorrect >= totalItems

      const next: GameEngineState = {
        ...prev,
        score: Math.min(100, prev.score + points),
        streak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        correctCount: newCorrect,
        isComplete: isLast,
      }

      if (isLast) {
        if (tickRef.current) clearInterval(tickRef.current)
        const result: GameResult = {
          gameType,
          score: next.score,
          guesses: next.correctCount + next.wrongCount,
          hintsUsed: next.hintsUsed,
          timeMs: Date.now() - startTimeRef.current,
        }
        // defer so state settles first
        setTimeout(() => onComplete(result), 100)
      }

      return next
    })
  }, [totalItems, gameType, onComplete])

  const onWrong = useCallback(() => {
    setState(prev => {
      const newLives = prev.lives != null ? prev.lives - 1 : null
      const isGameOver = newLives != null && newLives <= 0

      if (isGameOver) {
        if (tickRef.current) clearInterval(tickRef.current)
        const result: GameResult = {
          gameType,
          score: prev.score,
          guesses: prev.correctCount + prev.wrongCount + 1,
          hintsUsed: prev.hintsUsed,
          timeMs: Date.now() - startTimeRef.current,
        }
        setTimeout(() => onComplete(result), 100)
      }

      return {
        ...prev,
        streak: 0,
        wrongCount: prev.wrongCount + 1,
        lives: newLives,
        isComplete: isGameOver,
      }
    })
  }, [gameType, onComplete])

  const onHint = useCallback(() => {
    setState(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }))
  }, [])

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: true }))
  }, [])

  const resume = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: false }))
  }, [])

  return { ...state, onCorrect, onWrong, onHint, pause, resume }
}
