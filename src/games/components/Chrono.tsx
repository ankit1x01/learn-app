// src/games/components/Chrono.tsx
import { useState, useRef } from 'react'
import { motion, Reorder } from 'motion/react'
import { ArrowUp, ArrowDown, CheckCircle, HelpCircle } from 'lucide-react'
import { ChronoConfig, GameResult } from '../types'
import { GameWinScreen } from './GameWinScreen'

interface Props { config: ChronoConfig }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface EventState {
  id: string
  label: string
  dateLabel: string
  sortKey: number
  factoid?: string
  status: 'idle' | 'correct' | 'wrong'
  locked: boolean
}

export function Chrono({ config }: Props) {
  const startTime = useRef(Date.now())
  const [events, setEvents] = useState<EventState[]>(
    () => shuffle(config.events).map(e => ({ ...e, status: 'idle' as const, locked: false }))
  )
  const [guesses, setGuesses] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [activeFactoid, setActiveFactoid] = useState<string | null>(null)
  const [result, setResult] = useState<GameResult | null>(null)

  function move(index: number, direction: 'up' | 'down') {
    setEvents(prev => {
      const next = [...prev]
      const swap = direction === 'up' ? index - 1 : index + 1
      if (swap < 0 || swap >= next.length) return prev
      if (next[index].locked || next[swap].locked) return prev
      ;[next[index], next[swap]] = [next[swap], next[index]]
      return next
    })
  }

  function handleCheck() {
    const newGuesses = guesses + 1
    setGuesses(newGuesses)

    const sorted = [...events].sort((a, b) => a.sortKey - b.sortKey)
    const updated = events.map((e, i) => ({
      ...e,
      status: e.sortKey === sorted[i].sortKey ? 'correct' as const : 'wrong' as const,
      locked: e.sortKey === sorted[i].sortKey,
    }))
    setEvents(updated)

    const allCorrect = updated.every(e => e.status === 'correct')

    setTimeout(() => {
      if (allCorrect) {
        const score = Math.max(0, 100 - (newGuesses - 1) * 20)
        const finalResult: GameResult = {
          gameType: 'chrono',
          score,
          guesses: newGuesses,
          hintsUsed,
          timeMs: Date.now() - startTime.current,
        }
        config.onComplete?.(finalResult)
        setResult(finalResult)
      } else {
        setEvents(prev =>
          prev.map(e => e.status === 'wrong' ? { ...e, status: 'idle' as const } : e)
        )
      }
    }, 900)
  }

  function handleHint() {
    const sorted = [...events].sort((a, b) => a.sortKey - b.sortKey)
    const correctIndex = events.findIndex((e, i) => !e.locked && sorted[i].id === e.id)
    if (correctIndex === -1) return
    setHintsUsed(h => h + 1)
    setEvents(prev =>
      prev.map((e, i) => i === correctIndex ? { ...e, locked: true, status: 'correct' as const } : e)
    )
  }

  function handleReset() {
    setEvents(shuffle(config.events).map(e => ({ ...e, status: 'idle' as const, locked: false })))
    setGuesses(0)
    setHintsUsed(0)
    setActiveFactoid(null)
    setResult(null)
    startTime.current = Date.now()
  }

  if (result) return <GameWinScreen result={result} onPlayAgain={handleReset} />

  return (
    <div className="flex flex-col h-full" style={{ background: '#F5F0E8' }}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E3DDD5] bg-white">
        <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#9CA3AF', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
          {config.subject}
        </p>
        <h2 className="text-[20px] font-black text-[#1C1917] mt-0.5" style={{ fontFamily: 'Plus Jakarta Sans, system-ui', letterSpacing: '-0.02em' }}>
          {config.theme}
        </h2>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#D97706', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Earliest</span>
            <div className="flex-1 flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-1 rounded-full" style={{ background: '#FDE68A' }} />
              ))}
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#D97706', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Latest</span>
          </div>
          <span className="text-[11px]" style={{ color: '#A8A29E', fontFamily: 'Inter, system-ui' }}>
            {guesses} attempt{guesses !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Timeline list */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="flex gap-3">
          {/* Visual timeline line on the left */}
          <div className="flex flex-col items-center" style={{ width: 24, flexShrink: 0, paddingTop: 16 }}>
            {events.map((event, i) => (
              <div key={event.id} className="flex flex-col items-center flex-1" style={{ minHeight: 72 }}>
                {/* Dot */}
                <div
                  className="w-3 h-3 rounded-full border-2 flex-shrink-0"
                  style={{
                    background: event.status === 'correct' ? '#22C55E' : event.status === 'wrong' ? '#EF4444' : '#D4CFC8',
                    borderColor: event.status === 'correct' ? '#16A34A' : event.status === 'wrong' ? '#DC2626' : '#A8A29E',
                  }}
                />
                {/* Connector line (not after last) */}
                {i < events.length - 1 && (
                  <div
                    className="flex-1 w-0.5 my-1"
                    style={{ background: event.locked ? '#BBF7D0' : '#D4CFC8', minHeight: 20 }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Event cards */}
                    <Reorder.Group
            values={events}
            onReorder={setEvents}
            className="flex-1 flex flex-col gap-2 relative z-10"
            axis="y"
          >
            {events.map((event, i) => (
              <Reorder.Item
                key={event.id}
                value={event}
                dragListener={!event.locked}
                dragControls={undefined}
                whileDrag={{ scale: 1.03, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                className="cursor-grab active:cursor-grabbing z-10 relative"
              >
                <div
                  className="rounded-2xl overflow-hidden transition-colors duration-150"
                  style={{
                    background: event.status === 'correct' ? '#F0FDF4' : event.status === 'wrong' ? '#FEF2F2' : '#FFFFFF',
                    border: event.status === 'correct'
                      ? '2px solid #4ADE80'
                      : event.status === 'wrong'
                      ? '2px solid #F87171'
                      : '2px solid #E3DDD5',
                    boxShadow: event.status === 'correct'
                      ? '0 4px 0 #22C55E'
                      : event.status === 'wrong'
                      ? '0 4px 0 #EF4444'
                      : '0 4px 0 #E3DDD5',
                  }}
                >
                  <div className="flex items-center gap-2 px-3 py-3">
                    {/* Drag Handle Indicator */}
                    <div className="flex flex-col gap-0.5 opacity-40 px-1 py-1 rounded pointer-events-none">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#78716C' }} />
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#78716C' }} />
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#78716C' }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pointer-events-none">
                      {event.locked && (
                        <span
                          className="inline-block text-[10px] font-black px-2 py-0.5 rounded-full mb-1"
                          style={{ background: '#FCD34D', color: '#78350F', fontFamily: 'Plus Jakarta Sans, system-ui' }}
                        >
                          {event.dateLabel}
                        </span>
                      )}
                      <p
                        className="text-[13px] font-semibold leading-snug"
                        style={{
                          color: event.status === 'correct' ? '#166534' : '#1C1917',
                          fontFamily: 'Plus Jakarta Sans, system-ui',
                        }}
                      >
                        {event.label}
                      </p>
                    </div>

                    {/* Status icons */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {event.status === 'correct' && <CheckCircle size={16} color="#16A34A" />}
                      {event.factoid && (
                        <button
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={() => setActiveFactoid(activeFactoid === event.id ? null : event.id)}
                          className="w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-black pointer-events-auto"
                          style={{ background: '#F0EEE9', color: '#78716C', fontFamily: 'Inter, system-ui' }}
                        >
                          i
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Factoid */}
                  {activeFactoid === event.id && event.factoid && (
                    <div className="px-4 pb-3 pointer-events-none">
                      <div className="rounded-xl px-3 py-2" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                        <p className="text-[12px] leading-relaxed" style={{ color: '#92400E', fontFamily: 'Inter, system-ui' }}>
                          {event.factoid}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-4 flex gap-3" style={{ borderTop: '1px solid #E3DDD5' }}>
        <button
          onClick={handleHint}
          className="flex items-center gap-1.5 px-4 py-3 rounded-2xl text-[14px] font-bold active:translate-y-1 transition-transform"
          style={{ background: '#F0EEE9', color: '#78716C', fontFamily: 'Plus Jakarta Sans, system-ui', border: '2px solid #E3DDD5', boxShadow: '0 4px 0 #D4CFC8' }}
        >
          <HelpCircle size={18} />
          Hint
        </button>
        <button
          onClick={handleCheck}
          className="flex-1 py-3 rounded-2xl text-[16px] font-black active:translate-y-1 transition-transform"
          style={{
            background: '#1C1917',
            color: '#FFFFFF',
            fontFamily: 'Plus Jakarta Sans, system-ui',
            boxShadow: '0 4px 0 #44403C',
          }}
        >
          Check Order
        </button>
      </div>
    </div>
  )
}
