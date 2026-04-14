// src/games/components/Links.tsx
import { useState, useRef } from 'react'
import { motion, useAnimation, PanInfo } from 'motion/react'
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react'
import { LinksConfig, GameResult } from '../types'
import { GameWinScreen } from './GameWinScreen'

interface Props { config: LinksConfig }

const DECK_COLORS = ['#FCD34D', '#A78BFA', '#4ADE80', '#60A5FA', '#FB923C', '#F472B6']


function DraggableDeckCard({ card, color, index, total, onAttemptPlace }: any) {
  const controls = useAnimation()
  
  async function handleDragEnd(_: any, info: PanInfo) {
    const slot = document.getElementById('links-center-slot')?.getBoundingClientRect()
    
    // basic center of screen collision check
    const dropX = info.point.x
    const dropY = info.point.y
    
    const isInside = (rect: DOMRect | undefined) => {
      if (!rect) return false
      return dropX >= rect.left && dropX <= rect.right && dropY >= rect.top && dropY <= rect.bottom
    }
    
    if (isInside(slot)) {
      onAttemptPlace(card)
    } else {
      controls.start({ x: 0, y: 0 })
    }
  }

  return (
    <motion.div
      drag
      dragSnapToOrigin
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      animate={controls}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 1.05, zIndex: 50, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      className="absolute inset-0 rounded-3xl flex items-center justify-center px-4 cursor-grab active:cursor-grabbing border-[2.5px] border-black/5 bg-white transition-all transform origin-bottom"
      style={{
        background: color,
        boxShadow: '0 6px 0 rgba(0,0,0,0.18), 0 8px 16px rgba(0,0,0,0.08)',
        zIndex: 10
      }}
    >
      <p className="text-[15px] font-black text-center" style={{ color: 'rgba(0,0,0,0.72)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
        {card?.label}
      </p>
      <span className="absolute bottom-2 right-3 text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.30)', fontFamily: 'Inter, system-ui' }}>
        {index + 1}/{total}
      </span>
      <div className="absolute top-2 left-0 right-0 flex justify-center opacity-30 pointer-events-none">
        <div className="w-8 h-1 rounded-full bg-black/40" />
      </div>
    </motion.div>
  )
}

export function Links({ config }: Props) {
  const startTime = useRef(Date.now())
  const [roundIndex, setRoundIndex] = useState(0)
  const [deckIndex, setDeckIndex] = useState(0)
  const [guesses, setGuesses] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [revealedHints, setRevealedHints] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [completedRounds, setCompletedRounds] = useState(0)
  const [result, setResult] = useState<GameResult | null>(null)

  const round = config.rounds[roundIndex]
  const usedIds = config.rounds.slice(0, roundIndex).map(r => r.cardId)
  const availableCards = config.cards.filter(c => !usedIds.includes(c.id))
  const currentCard = availableCards[deckIndex % availableCards.length]

  function handlePlace(attemptedCard?: any) {
    const cardToCheck = attemptedCard || currentCard;
    if (!cardToCheck) return
    const newGuesses = guesses + 1
    setGuesses(newGuesses)

    if (cardToCheck.id === round.cardId) {
      setFeedback('correct')
      setTimeout(() => {
        setFeedback(null)
        setRevealedHints(0)
        const nextRound = roundIndex + 1
        const newCompleted = completedRounds + 1
        setCompletedRounds(newCompleted)
        if (nextRound >= config.rounds.length) {
          const score = Math.max(0, 100 - (newGuesses - config.rounds.length) * 15)
          const finalResult: GameResult = {
            gameType: 'links',
            score,
            guesses: newGuesses,
            hintsUsed,
            timeMs: Date.now() - startTime.current,
          }
          config.onComplete?.(finalResult)
          setResult(finalResult)
        } else {
          setRoundIndex(nextRound)
          setDeckIndex(0)
        }
      }, 800)
    } else {
      setFeedback('wrong')
      setTimeout(() => {
        setFeedback(null)
        setDeckIndex(i => (i + 1) % availableCards.length)
      }, 600)
    }
  }

  function handleHint() {
    if (!round.hints || revealedHints >= round.hints.length) return
    setHintsUsed(h => h + 1)
    setRevealedHints(r => r + 1)
  }

  function handleReset() {
    setRoundIndex(0)
    setDeckIndex(0)
    setGuesses(0)
    setHintsUsed(0)
    setRevealedHints(0)
    setFeedback(null)
    setCompletedRounds(0)
    setResult(null)
    startTime.current = Date.now()
  }

  if (result) return <GameWinScreen result={result} onPlayAgain={handleReset} />

  const [top, left, right, bottom] = round.attributes
  const cardColor = DECK_COLORS[deckIndex % DECK_COLORS.length]

  const centerBorder =
    feedback === 'correct' ? '#22C55E' :
    feedback === 'wrong'   ? '#EF4444' :
    '#1C1917'

  const centerBg =
    feedback === 'correct' ? '#F0FDF4' :
    feedback === 'wrong'   ? '#FEF2F2' :
    '#FFFFFF'

  return (
    <div className="flex flex-col h-full" style={{ background: '#F5F0E8' }}>
      {/* Sub-header */}
      <div className="px-4 py-3 border-b border-[#E3DDD5]" style={{ background: 'white' }}>
        <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#9CA3AF', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
          {config.subject} · {config.theme}
        </p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-[15px] font-black text-[#1C1917]" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>
            Round {roundIndex + 1} of {config.rounds.length}
          </p>
          <div className="flex gap-1.5">
            {config.rounds.map((r, i) => (
              <div
                key={r.cardId}
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: i < completedRounds ? '#22C55E' : i === roundIndex ? '#1C1917' : '#D4CFC8',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* SVG attribute web */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
        {/* Web container — relative box, attributes positioned absolutely, SVG lines drawn */}
        <div className="relative w-full" style={{ height: 300, maxWidth: 320 }}>
          {/* SVG lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 320 300"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Line to top */}
            <line x1="160" y1="145" x2="160" y2="52" stroke="#D4CFC8" strokeWidth="2" strokeDasharray="4 3" />
            {/* Line to left */}
            <line x1="145" y1="150" x2="52" y2="150" stroke="#D4CFC8" strokeWidth="2" strokeDasharray="4 3" />
            {/* Line to right */}
            <line x1="175" y1="150" x2="268" y2="150" stroke="#D4CFC8" strokeWidth="2" strokeDasharray="4 3" />
            {/* Line to bottom */}
            <line x1="160" y1="160" x2="160" y2="248" stroke="#D4CFC8" strokeWidth="2" strokeDasharray="4 3" />
          </svg>

          {/* Top attribute */}
          <div className="absolute" style={{ top: 0, left: '50%', transform: 'translateX(-50%)' }}>
            <AttributePill label={top} />
          </div>

          {/* Left attribute */}
          <div className="absolute" style={{ top: '50%', left: 0, transform: 'translateY(-50%)' }}>
            <AttributePill label={left} />
          </div>

          {/* Center card slot */}
          <div id="links-center-slot" className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 108, height: 136, zIndex: 0 }} />
          <div
            className="absolute rounded-2xl flex items-center justify-center transition-all duration-200"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 108,
              height: 136,
              background: centerBg,
              border: `2.5px solid ${centerBorder}`,
              boxShadow: feedback === 'correct'
                ? '0 4px 16px rgba(34,197,94,0.25)'
                : feedback === 'wrong'
                ? '0 4px 16px rgba(239,68,68,0.20)'
                : '0 4px 20px rgba(0,0,0,0.12)',
            }}
          >
            {currentCard && (
              <div className="text-center px-3">
                <p
                  className="text-[13px] font-black leading-snug"
                  style={{
                    color: feedback === 'correct' ? '#16A34A' : feedback === 'wrong' ? '#DC2626' : '#1C1917',
                    fontFamily: 'Plus Jakarta Sans, system-ui',
                  }}
                >
                  {currentCard.label}
                </p>
              </div>
            )}
          </div>

          {/* Right attribute */}
          <div className="absolute" style={{ top: '50%', right: 0, transform: 'translateY(-50%)' }}>
            <AttributePill label={right} />
          </div>

          {/* Bottom attribute */}
          <div className="absolute" style={{ bottom: 0, left: '50%', transform: 'translateX(-50%)' }}>
            <AttributePill label={bottom} />
          </div>
        </div>

        {/* Hint banner */}
        {round.hints && revealedHints > 0 && (
          <div
            className="w-full max-w-xs rounded-xl px-3 py-2 mt-3"
            style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}
          >
            <p className="text-[11px] font-bold text-[#92400E] mb-0.5" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>Hint</p>
            <p className="text-[12px] text-[#92400E]" style={{ fontFamily: 'Inter, system-ui' }}>
              {round.hints[revealedHints - 1]}
            </p>
          </div>
        )}
      </div>

      {/* Deck + actions */}
      <div className="px-4 pb-4" style={{ borderTop: '1px solid #E3DDD5' }}>
        <p className="text-[11px] font-semibold uppercase tracking-wider pt-3 mb-2" style={{ color: '#9CA3AF', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
          Card deck · {availableCards.length} cards
        </p>

        {/* Deck navigator */}
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => setDeckIndex(i => (i - 1 + availableCards.length) % availableCards.length)}
            className="w-12 h-12 flex items-center justify-center rounded-2xl active:translate-y-1 transition-transform"
            style={{ background: '#F0EEE9', border: '2px solid #E3DDD5', boxShadow: '0 4px 0 #D4CFC8' }}
          >
            <ChevronLeft size={20} color="#78716C" />
          </button>

          {/* Card with stacked depth effect */}
          <div className="flex-1 relative" style={{ height: 56 }}>
            {/* Stack shadows */}
            {availableCards.length > 2 && (
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: DECK_COLORS[(deckIndex + 2) % DECK_COLORS.length],
                  transform: 'rotate(5.5deg) scale(0.9)',
                  boxShadow: '0 4px 0 rgba(0,0,0,0.15)',
                }}
              />
            )}
            {availableCards.length > 1 && (
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: DECK_COLORS[(deckIndex + 1) % DECK_COLORS.length],
                  transform: 'rotate(2.5deg) scale(0.95)',
                  boxShadow: '0 4px 0 rgba(0,0,0,0.15)',
                }}
              />
            )}
            {/* Top card (Draggable) */}
            <DraggableDeckCard
              card={currentCard}
              color={cardColor}
              index={deckIndex}
              total={availableCards.length}
              onAttemptPlace={handlePlace}
            />
          </div>

          <button
            onClick={() => setDeckIndex(i => (i + 1) % availableCards.length)}
            className="w-12 h-12 flex items-center justify-center rounded-2xl active:translate-y-1 transition-transform"
            style={{ background: '#F0EEE9', border: '2px solid #E3DDD5', boxShadow: '0 4px 0 #D4CFC8' }}
          >
            <ChevronRight size={20} color="#78716C" />
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleHint}
            disabled={!round.hints || revealedHints >= (round.hints?.length ?? 0)}
            className="flex items-center gap-1.5 px-4 py-3 rounded-2xl text-[14px] font-bold disabled:opacity-40 active:translate-y-1 transition-transform"
            style={{ background: '#F0EEE9', color: '#78716C', fontFamily: 'Plus Jakarta Sans, system-ui', border: '2px solid #E3DDD5', boxShadow: '0 4px 0 #D4CFC8' }}
          >
            <HelpCircle size={15} />
            Hint
          </button>
          <div className="flex-1 flex items-center justify-center rounded-2xl border-2 border-dashed border-[#A8A29E] bg-transparent">
            <span className="text-[13px] font-black tracking-tight" style={{ color: '#A8A29E', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
              DRAG CARD TO CENTER
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function AttributePill({ label }: { label: string }) {
  return (
    <div
      className="rounded-2xl px-3 py-2 text-center"
      style={{
        background: '#FFFFFF',
        border: '2px solid #E3DDD5',
        boxShadow: '0 4px 0 #D4CFC8',
        maxWidth: 110,
        minWidth: 80,
      }}
    >
      <p
        className="text-[12px] font-black text-[#292524] leading-tight"
        style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}
      >
        {label}
      </p>
    </div>
  )
}
