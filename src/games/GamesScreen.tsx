// src/games/GamesScreen.tsx
import { useState } from 'react'
import { Shuffle, Clock, Link2, Sword, ChevronLeft, Hand, Brain, Headphones, Target } from 'lucide-react'
import { GameRunner } from './GameRunner'
import { GameConfig } from './types'
import { dsaThisOrThat, dsaChrono, dsaLinks, dsaKnockout, dsaBalloonTap, dsaRetention, dsaAudioLecture, dsaBubbleMatch } from './data/dsa-dummy'

type Tab = 'this-or-that' | 'chrono' | 'links' | 'knockout' | 'balloon-tap' | 'retention' | 'audio-lecture' | 'bubble-match'

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
}

interface Props {
  onBack: () => void
}

export function GamesScreen({ onBack }: Props) {
  const [selectedGame, setSelectedGame] = useState<Tab | null>(null)

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
            <GameRunner key={selectedGame} config={CONFIGS[selectedGame]} />
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
          const Icon = game.icon
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
          )
        })}
      </div>

      <p
        className="text-center text-[12px] pb-6"
        style={{ color: '#A8A29E', fontFamily: 'Inter, system-ui' }}
      >
        Tap any game to play · DSA edition
      </p>
    </div>
  )
}
