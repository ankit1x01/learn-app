/**
 * REFLEX-MATHS Game Launcher
 * Selector for 13 math games with quick preview and difficulty picker
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { listAvailableGames, getGameConfig } from './data'
import {
  MatrixForge,
  IntegralInferno,
  VectorVoyager,
  DomainDuels,
  PrincipalValley,
  DetDetective,
  DerivativeDojo,
  TangentTycoon,
  AreaArchitect,
  DiffEqDescent,
  ThreeDArchitect,
  OptimaOutpost,
  BayesBazaar,
} from './games'
import type { GameConfig } from '@/games/types'

type GameLauncherState = 'select' | 'playing'

export const MathsGameLauncher: React.FC = () => {
  const [state, setCurrentState] = useState<GameLauncherState>('select')
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced' | 'mastery'>('beginner')

  const games = listAvailableGames()

  const handleGameSelect = (gameType: string) => {
    setSelectedGame(gameType)
    setCurrentState('playing')
  }

  const handleGameComplete = () => {
    setCurrentState('select')
    setSelectedGame(null)
  }

  if (state === 'playing' && selectedGame) {
    const config = getGameConfig(selectedGame)
    if (!config) {
      return <div className="text-error">Game not found: {selectedGame}</div>
    }

    // Route to appropriate game component
    const gameConfig = { ...config, onComplete: handleGameComplete }

    switch (selectedGame) {
      case 'matrix-forge':
        return <MatrixForge config={gameConfig as any} />
      case 'integral-inferno':
        return <IntegralInferno config={gameConfig as any} />
      case 'vector-voyager':
        return <VectorVoyager config={gameConfig as any} />
      case 'domain-duels':
        return <DomainDuels config={gameConfig as any} />
      case 'principal-valley':
        return <PrincipalValley config={gameConfig as any} />
      case 'det-detective':
        return <DetDetective config={gameConfig as any} />
      case 'derivative-dojo':
        return <DerivativeDojo config={gameConfig as any} />
      case 'tangent-tycoon':
        return <TangentTycoon config={gameConfig as any} />
      case 'area-architect':
        return <AreaArchitect config={gameConfig as any} />
      case 'diff-eq-descent':
        return <DiffEqDescent config={gameConfig as any} />
      case '3d-architect':
        return <ThreeDArchitect config={gameConfig as any} />
      case 'optima-outpost':
        return <OptimaOutpost config={gameConfig as any} />
      case 'bayes-bazaar':
        return <BayesBazaar config={gameConfig as any} />
      default:
        return <div className="text-error">Game {selectedGame} not implemented</div>
    }
  }

  // Game selection screen
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-background via-surface to-background p-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-3">🧮 REFLEX-MATHS</h1>
          <p className="text-lg text-on-surface-variant">
            13 neuroscience-driven games for Class 12 mathematics automaticity
          </p>
          <p className="text-sm text-on-surface-variant mt-2">
            Micro-skill training via spaced repetition + adaptive difficulty
          </p>
        </div>

        {/* Difficulty Selector */}
        <div className="flex justify-center gap-3 mb-8">
          {(['beginner', 'intermediate', 'advanced', 'mastery'] as const).map(level => (
            <motion.button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                difficulty === level
                  ? 'bg-primary text-on-primary shadow-lg'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, idx) => (
            <motion.button
              key={game.type}
              onClick={() => handleGameSelect(game.type)}
              className="text-left p-6 rounded-xl bg-surface-container hover:bg-surface-container-high
                         border-2 border-outline hover:border-primary transition-all group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(103, 80, 164, 0.2)' }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Icon placeholder */}
              <div className="text-4xl mb-3">
                {['⚒️', '🔥', '🚀', '🎯', '🏔️', '🔍', '🥋', '📈', '⬇️', '🏗️', '🎨', '🎭', '🃏'][idx]}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-primary mb-2 group-hover:translate-x-1 transition-transform">
                {game.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-on-surface-variant mb-4">{game.description}</p>

              {/* Status badge */}
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-success"></span>
                <span className="text-xs text-on-surface-variant">Ready to play</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 rounded-xl bg-surface-container-low border-2 border-outline"
        >
          <h2 className="text-lg font-bold text-primary mb-3">How it works</h2>
          <ul className="space-y-2 text-on-surface-variant">
            <li>✓ Each game targets 1–3 micro-skills from the Class 12 syllabus</li>
            <li>✓ Stimulus → Response cycles in 2–30 seconds train automaticity</li>
            <li>✓ Scores, streaks, and combos sustain engagement via variable-ratio reward</li>
            <li>✓ FSRS scheduling learns your forgetting curve for each micro-skill</li>
            <li>✓ Difficulty adapts: Beginner → Intermediate → Advanced → Mastery</li>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  )
}
