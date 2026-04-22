// src/games/GamesScreen.tsx
import { useState } from 'react'
import { Shuffle, Clock, Link2, Sword, ChevronLeft, Hand, Brain, Headphones, Target } from 'lucide-react'
import { GameRunner } from './GameRunner'
import { GameConfig } from './types'
import { EquationBalancer } from './EquationBalancer'
import { ParabolaCannon } from './ParabolaCannon'
import { MatrixMorph } from './MatrixMorph'
import { SpacedRecallBlitz } from './SpacedRecallBlitz'
import { TwinOrNot } from './jee/TwinOrNot'
import { InterleavedSprint } from './jee/InterleavedSprint'
import { ConceptRadar } from './jee/ConceptRadar'
import { FormulaFactory } from './jee/FormulaFactory'
import { PressureVault } from './jee/PressureVault'
import { dsaThisOrThat, dsaChrono, dsaLinks, dsaKnockout, dsaBalloonTap, dsaRetention, dsaAudioLecture, dsaBubbleMatch } from './data/dsa-dummy'

type Tab = 'this-or-that' | 'chrono' | 'links' | 'knockout' | 'balloon-tap' | 'retention' | 'audio-lecture' | 'bubble-match' | 'equation-balancer' | 'parabola-cannon' | 'matrix-morph' | 'recall-blitz' | 'twin-or-not' | 'interleaved-sprint' | 'concept-radar' | 'formula-factory' | 'pressure-vault'

interface GameMeta {
  id: Tab
  label: string
  tagline: string
  icon: React.ElementType
  bg: string
  textDark: string
  foldColor: string
}

const GAMES: GameMeta[] = [
  {
    id: 'this-or-that',
    label: 'This or That',
    tagline: 'Pick a side',
    icon: Shuffle,
    bg: '#4ADE80',
    textDark: '#14532D',
    foldColor: 'rgba(0,0,0,0.13)',
  },
  {
    id: 'chrono',
    label: 'Chrono',
    tagline: 'Order events',
    icon: Clock,
    bg: '#FCD34D',
    textDark: '#78350F',
    foldColor: 'rgba(0,0,0,0.10)',
  },
  {
    id: 'links',
    label: 'Links',
    tagline: 'Connect cards',
    icon: Link2,
    bg: '#60A5FA',
    textDark: '#1E3A5F',
    foldColor: 'rgba(0,0,0,0.12)',
  },
  {
    id: 'knockout',
    label: 'Knockout',
    tagline: 'Choose a winner',
    icon: Sword,
    bg: '#FB923C',
    textDark: '#7C2D12',
    foldColor: 'rgba(0,0,0,0.13)',
  },
  {
    id: 'balloon-tap',
    label: 'Balloons',
    tagline: 'Pop the right word',
    icon: Hand,
    bg: '#A78BFA',
    textDark: '#1E1B4B',
    foldColor: 'rgba(0,0,0,0.13)',
  },
  {
    id: 'retention',
    label: 'Memory',
    tagline: 'What did you see?',
    icon: Brain,
    bg: '#2DD4BF',
    textDark: '#134E4A',
    foldColor: 'rgba(0,0,0,0.12)',
  },
  {
    id: 'audio-lecture',
    label: 'Lecture',
    tagline: 'Listen & recall',
    icon: Headphones,
    bg: '#6366F1',
    textDark: '#1E1B4B',
    foldColor: 'rgba(0,0,0,0.13)',
  },
  {
    id: 'bubble-match',
    label: 'Bubble Match',
    tagline: 'Drag & sort facts',
    icon: Target,
    bg: '#F97316',
    textDark: '#431407',
    foldColor: 'rgba(0,0,0,0.13)',
  },
  {
    id: 'equation-balancer',
    label: 'Equations',
    tagline: 'Balance math',
    icon: Brain,
    bg: '#E8DEF8',
    textDark: '#1D192B',
    foldColor: 'rgba(0,0,0,0.13)',
  },
]

const CONFIGS: Record<Tab, GameConfig> = {
  'this-or-that':  dsaThisOrThat,
  chrono:          dsaChrono,
  links:           dsaLinks,
  knockout:        dsaKnockout,
  'balloon-tap':   dsaBalloonTap,
  retention:       dsaRetention,
  'audio-lecture': dsaAudioLecture,
  'bubble-match':  dsaBubbleMatch,
  'equation-balancer': null as any,
  'recall-blitz':       null as any,
  'parabola-cannon':    null as any,
  'matrix-morph':       null as any,
  'twin-or-not':        null as any,
  'interleaved-sprint': null as any,
  'concept-radar':      null as any,
  'formula-factory':    null as any,
  'pressure-vault':     null as any,
}

interface Props {
  onBack: () => void;
  setScreen?: any;
}

export function GamesScreen({ onBack, setScreen }: Props) {
  const [selectedGame, setSelectedGame] = useState<Tab | null>(null)

  // Full-screen games that manage their own layout
  if (selectedGame === 'recall-blitz')       return <SpacedRecallBlitz    onBack={() => setSelectedGame(null)} />
  if (selectedGame === 'twin-or-not')        return <TwinOrNot            onBack={() => setSelectedGame(null)} />
  if (selectedGame === 'interleaved-sprint') return <InterleavedSprint    onBack={() => setSelectedGame(null)} />
  if (selectedGame === 'concept-radar')      return <ConceptRadar         onBack={() => setSelectedGame(null)} />
  if (selectedGame === 'formula-factory')    return <FormulaFactory       onBack={() => setSelectedGame(null)} />
  if (selectedGame === 'pressure-vault')     return <PressureVault        onBack={() => setSelectedGame(null)} />

  if (selectedGame !== null) {
    const game = GAMES.find(g => g.id === selectedGame)!
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto" style={{ background: '#F5F0E8' }}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E3DDD5] bg-white">
          <button
            onClick={() => setSelectedGame(null)}
            className="w-9 h-9 flex items-center justify-center rounded-xl"
            style={{ background: '#F0EEE9' }}
          >
            <ChevronLeft size={20} color="#292524" />
          </button>
          <div className="flex-1">
            <p className="text-[17px] font-black text-[#1C1917]" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>
              {game.label}
            </p>
            <p className="text-[12px] text-[#78716C]" style={{ fontFamily: 'Inter, system-ui' }}>
              DSA · Today's Theme
            </p>
          </div>
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: game.bg }} />
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto" style={{ background: '#F5F0E8' }}>
            {selectedGame === 'equation-balancer' ? (
              <EquationBalancer />
            ) : (
              <GameRunner key={selectedGame} config={CONFIGS[selectedGame]} />
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto" style={{ background: '#F5F0E8' }}>
      {/* Header */}
      <div className="flex items-center px-4 pt-5 pb-2">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-xl"
          style={{ background: 'rgba(0,0,0,0.07)' }}
        >
          <ChevronLeft size={20} color="#292524" />
        </button>
        <div className="flex-1 text-center">
          <p
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: '#9CA3AF', fontFamily: 'Plus Jakarta Sans, system-ui' }}
          >
            Today's Theme
          </p>
          <h1
            className="text-[28px] font-black text-[#1C1917] leading-tight mt-0.5"
            style={{ fontFamily: 'Plus Jakarta Sans, system-ui', letterSpacing: '-0.02em' }}
          >
            DSA Concepts
          </h1>
        </div>
        <div className="w-9" />
      </div>

      {/* 2×2 Game grid */}

      <div className="flex-1 px-4 py-3 mb-10 grid grid-cols-2 gap-3 content-start">
        {GAMES.map(game => {
          const Icon = game.icon as any;
          return (
            <button
              key={game.id}
              onClick={() => setSelectedGame(game.id)}
              className="relative rounded-3xl p-4 flex flex-col justify-between overflow-hidden text-left active:scale-[0.97] transition-transform"
              style={{
                background: game.bg,
                boxShadow: '0 4px 0 rgba(0,0,0,0.18), 0 6px 16px rgba(0,0,0,0.10)',
                aspectRatio: '1',
              }}
            >
              {/* Folded corner effect */}
              <div
                className="absolute top-0 right-0 w-9 h-9 rounded-bl-3xl"
                style={{ background: game.foldColor }}
              />

              {/* Icon */}
              <div className="flex-1 flex items-center justify-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.28)' }}
                >
                  <Icon size={34} color={game.textDark} strokeWidth={1.8} />
                </div>
              </div>

              {/* Label */}
              <div className="mt-2">
                <p
                  className="text-[17px] font-black leading-tight"
                  style={{ color: game.textDark, fontFamily: 'Plus Jakarta Sans, system-ui' }}
                >
                  {game.label}
                </p>
                <p
                  className="text-[12px] font-medium mt-0.5"
                  style={{ color: game.textDark, opacity: 0.65, fontFamily: 'Inter, system-ui' }}
                >
                  {game.tagline}
                </p>
              </div>
            </button>
          );
        })}

        {/* Physics Arcade button */}
        <button
          onClick={() => setScreen?.('physics-arcade')}
          className="relative rounded-3xl p-4 flex flex-col justify-between overflow-hidden text-left active:scale-[0.97] transition-transform"
          style={{ background: '#FFF1F2', boxShadow: '0 4px 0 rgba(0,0,0,0.18), 0 6px 16px rgba(0,0,0,0.10)', aspectRatio: '1' }}
        >
          <div className="absolute top-0 right-0 w-9 h-9 rounded-bl-3xl" style={{ background: 'rgba(244,63,94,0.13)' }} />
          <div className="flex-1 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.28)' }}>
              <span className="material-symbols-rounded" style={{ fontSize: 34, color: '#F43F5E', fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                sports_baseball
              </span>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-[17px] font-black leading-tight" style={{ color: '#F43F5E', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Physics Arcade</p>
            <p className="text-[12px] font-medium mt-0.5" style={{ color: '#F43F5E', opacity: 0.65, fontFamily: 'Inter, system-ui' }}>59 simulations</p>
          </div>
        </button>

        {/* Math Arcade button */}
        <button
          onClick={() => setScreen?.('math-arcade')}
          className="relative rounded-3xl p-4 flex flex-col justify-between overflow-hidden text-left active:scale-[0.97] transition-transform"
          style={{ background: '#F5F3FF', boxShadow: '0 4px 0 rgba(0,0,0,0.18), 0 6px 16px rgba(0,0,0,0.10)', aspectRatio: '1' }}
        >
          <div className="absolute top-0 right-0 w-9 h-9 rounded-bl-3xl" style={{ background: 'rgba(124,58,237,0.13)' }} />
          <div className="flex-1 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.28)' }}>
              <span className="material-symbols-rounded" style={{ fontSize: 34, color: '#7C3AED', fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                functions
              </span>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-[17px] font-black leading-tight" style={{ color: '#7C3AED', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Math Playground</p>
            <p className="text-[12px] font-medium mt-0.5" style={{ color: '#7C3AED', opacity: 0.65, fontFamily: 'Inter, system-ui' }}>20 simulations</p>
          </div>
        </button>

        {/* Chemistry Arcade button */}
        <button
          onClick={() => setScreen?.('chemistry-arcade')}
          className="relative rounded-3xl p-4 flex flex-col justify-between overflow-hidden text-left active:scale-[0.97] transition-transform"
          style={{ background: '#ECFDF5', boxShadow: '0 4px 0 rgba(0,0,0,0.18), 0 6px 16px rgba(0,0,0,0.10)', aspectRatio: '1' }}
        >
          <div className="absolute top-0 right-0 w-9 h-9 rounded-bl-3xl" style={{ background: 'rgba(5,150,105,0.13)' }} />
          <div className="flex-1 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.28)' }}>
              <span className="material-symbols-rounded" style={{ fontSize: 34, color: '#059669', fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                science
              </span>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-[17px] font-black leading-tight" style={{ color: '#059669', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Chemistry Lab</p>
            <p className="text-[12px] font-medium mt-0.5" style={{ color: '#059669', opacity: 0.65, fontFamily: 'Inter, system-ui' }}>18 simulations</p>
          </div>
        </button>

        {/* Recall Blitz button */}
        <button
          onClick={() => setSelectedGame('recall-blitz')}
          className="relative rounded-3xl p-4 flex flex-col justify-between overflow-hidden text-left active:scale-[0.97] transition-transform"
          style={{ background: '#FFF7ED', boxShadow: '0 4px 0 rgba(0,0,0,0.18), 0 6px 16px rgba(0,0,0,0.10)', aspectRatio: '1' }}
        >
          <div className="absolute top-0 right-0 w-9 h-9 rounded-bl-3xl" style={{ background: 'rgba(217,119,6,0.13)' }} />
          <div className="flex-1 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.28)' }}>
              <span className="material-symbols-rounded" style={{ fontSize: 34, color: '#D97706', fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                bolt
              </span>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-[17px] font-black leading-tight" style={{ color: '#D97706', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Recall Blitz</p>
            <p className="text-[12px] font-medium mt-0.5" style={{ color: '#D97706', opacity: 0.65, fontFamily: 'Inter, system-ui' }}>60s FSRS sprint</p>
          </div>
        </button>
      </div>

      {/* JEE Cognitive Games section */}
      <div className="col-span-2 mt-2">
        <p className="text-[11px] font-bold uppercase tracking-widest mb-3 px-1" style={{ color: '#9CA3AF', fontFamily: 'Inter, system-ui' }}>JEE Cognitive Training</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'twin-or-not'        as Tab, label: 'Twin or Not',        tagline: 'Same concept?',      bg: '#ECFEFF', color: '#0891B2', fold: 'rgba(8,145,178,0.13)',  icon: 'compare' },
            { id: 'interleaved-sprint' as Tab, label: 'Interleaved Sprint', tagline: 'Mixed topics blitz', bg: '#ECFDF5', color: '#059669', fold: 'rgba(5,150,105,0.13)',  icon: 'shuffle' },
            { id: 'concept-radar'      as Tab, label: 'Concept Radar',      tagline: 'Classify fast',      bg: '#FFFBEB', color: '#D97706', fold: 'rgba(217,119,6,0.13)', icon: 'radar' },
            { id: 'formula-factory'    as Tab, label: 'Formula Factory',    tagline: 'Fill the blank',     bg: '#F5F3FF', color: '#7C3AED', fold: 'rgba(124,58,237,0.13)', icon: 'calculate' },
            { id: 'pressure-vault'     as Tab, label: 'Pressure Vault',     tagline: 'Beat the ghost',     bg: '#FFF1F2', color: '#DC2626', fold: 'rgba(220,38,38,0.13)', icon: 'lock' },
          ].map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedGame(g.id)}
              className="relative rounded-3xl p-4 flex flex-col justify-between overflow-hidden text-left active:scale-[0.97] transition-transform"
              style={{ background: g.bg, boxShadow: '0 4px 0 rgba(0,0,0,0.18), 0 6px 16px rgba(0,0,0,0.10)', aspectRatio: '1' }}
            >
              <div className="absolute top-0 right-0 w-9 h-9 rounded-bl-3xl" style={{ background: g.fold }} />
              <div className="flex-1 flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.28)' }}>
                  <span className="material-symbols-rounded" style={{ fontSize: 34, color: g.color, fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>{g.icon}</span>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-[16px] font-black leading-tight" style={{ color: g.color, fontFamily: 'Plus Jakarta Sans, system-ui' }}>{g.label}</p>
                <p className="text-[11px] font-medium mt-0.5" style={{ color: g.color, opacity: 0.65, fontFamily: 'Inter, system-ui' }}>{g.tagline}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <p
        className="col-span-2 text-center text-[12px] pb-6 mt-2"
        style={{ color: '#A8A29E', fontFamily: 'Inter, system-ui' }}
      >
        Tap any game to play · DSA edition
      </p>
    </div>
  )
}
