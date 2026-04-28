// src/games/components/Links.tsx
import { useState, useRef } from 'react'
import { motion, useAnimation, PanInfo } from 'motion/react'

import { LinksConfig, GameResult } from '../types'
import { GameWinScreen } from './GameWinScreen'

interface Props { config: LinksConfig }

const DECK_COLORS = ['#FBB35C', '#64C5D0', '#F194B4', '#A78BFA', '#4ADE80', '#60A5FA']

function DraggableDeckCard({ card, color, index, total, onAttemptPlace }: any) {
  const controls = useAnimation()
  
  async function handleDragEnd(_: any, info: PanInfo) {
    const slot = document.getElementById('links-center-slot')?.getBoundingClientRect()
    
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
      whileTap={{ scale: 1.05, zIndex: 50, boxShadow: '0 10px 0 #111' }}
      className="absolute inset-0 flex items-center justify-center px-4 cursor-grab active:cursor-grabbing bg-white transition-all transform origin-bottom"
      style={{
        background: color,
        border: '3px solid #111',
        borderRadius: '16px',
        boxShadow: '0 6px 0 #111',
        zIndex: 10
      }}
    >
      <p className="text-[15px] font-black text-center" style={{ color: '#111', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
        {card?.label}
      </p>
      <span className="absolute bottom-2 right-3 text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.5)', fontFamily: 'Inter, system-ui' }}>
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
    feedback === 'correct' ? '#111' :
    feedback === 'wrong'   ? '#EF4444' :
    '#111'

  const centerBg =
    feedback === 'correct' ? '#64C5D0' :
    feedback === 'wrong'   ? '#F194B4' :
    '#FFFFFF'

  return (
    <div className="flex flex-col h-full" style={{ background: '#F9F6F0' }}>
      {/* Sub-header */}
      <div className="px-4 py-3 bg-white border-b-2 border-[#111]">
        <p className="text-[12px] font-bold uppercase tracking-wider text-[#111] mb-1" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>
          {config.subject} · {config.theme}
        </p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-[16px] font-black text-[#111]" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>
            Round {roundIndex + 1} of {config.rounds.length}
          </p>
          <div className="flex gap-1.5 border-2 border-[#111] rounded-full px-2 py-1 bg-[#F9F6F0]">
            {config.rounds.map((r, i) => (
              <div
                key={r.cardId}
                className="w-3 h-3 rounded-full border border-[#111]"
                style={{
                  background: i < completedRounds ? '#64C5D0' : i === roundIndex ? '#111' : '#FFFFFF',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* SVG attribute web */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-4" style={{ background: '#F9F6F0' }}>
        {/* Web container — relative box */}
        <div className="relative w-full rounded-3xl" style={{ height: 340, maxWidth: 340, background: '#EDE8DD', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          
          <div className="relative w-full h-full max-w-[280px]">
            {/* SVG pipes layer (underneath) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 280 300"
              preserveAspectRatio="xMidYMid meet"
              style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            >
              {/* Thick black outlines for pipes */}
              {/* top pipe */}
              <line x1="140" y1="150" x2="140" y2="40" stroke="#111" strokeWidth="32" strokeLinecap="round" />
              {/* bottom pipe */}
              <line x1="140" y1="150" x2="140" y2="260" stroke="#111" strokeWidth="32" strokeLinecap="round" />
              {/* left pipe */}
              <line x1="140" y1="150" x2="40" y2="150" stroke="#111" strokeWidth="32" strokeLinecap="round" />
              {/* right pipe */}
              <line x1="140" y1="150" x2="240" y2="150" stroke="#111" strokeWidth="32" strokeLinecap="round" />

              {/* Inner filled pipes */}
              {/* top pipe inner */}
              <line x1="140" y1="150" x2="140" y2="40" stroke="#FBB35C" strokeWidth="26" strokeLinecap="round" />
              {/* bottom pipe inner */}
              <line x1="140" y1="150" x2="140" y2="260" stroke="#F194B4" strokeWidth="26" strokeLinecap="round" />
              {/* left pipe inner */}
              <line x1="140" y1="150" x2="40" y2="150" stroke="#64C5D0" strokeWidth="26" strokeLinecap="round" />
              {/* right pipe inner */}
              <line x1="140" y1="150" x2="240" y2="150" stroke="#FBB35C" strokeWidth="26" strokeLinecap="round" />
            </svg>

            {/* Top attribute */}
            <div className="absolute" style={{ top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
              <AttributePill label={top} />
            </div>

            {/* Left attribute */}
            <div className="absolute" style={{ top: '50%', left: 0, transform: 'translateY(-50%)', zIndex: 1 }}>
              <AttributePill label={left} />
            </div>

            {/* Center card slot (The circular placeholder or placed card) */}
            <div id="links-center-slot" className="absolute rounded-full" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 90, height: 90, zIndex: 2 }}>
              <div
                className="w-full h-full flex items-center justify-center transition-all duration-300"
                style={{
                  background: currentCard && feedback === 'correct' ? cardColor : centerBg,
                  border: `3px solid ${centerBorder}`,
                  borderRadius: currentCard && feedback === 'correct' ? '16px' : '50%',
                  width: currentCard && feedback === 'correct' ? '108px' : '90px',
                  height: currentCard && feedback === 'correct' ? '136px' : '90px',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: feedback === 'correct'
                    ? '0 6px 0 #111'
                    : 'none',
                }}
              >
                {currentCard && feedback === 'correct' && (
                  <div className="text-center px-3">
                    <p
                      className="text-[14px] font-black leading-snug"
                      style={{ color: '#111', fontFamily: 'Plus Jakarta Sans, system-ui' }}
                    >
                      {currentCard.label}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right attribute */}
            <div className="absolute" style={{ top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 1 }}>
              <AttributePill label={right} />
            </div>

            {/* Bottom attribute */}
            <div className="absolute" style={{ bottom: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
              <AttributePill label={bottom} />
            </div>
            
            {/* Hint button over board */}
            <div className="absolute bottom-[-10px] right-[-10px] z-10 hidden">
               {/* Using hidden for now, rendering below board instead */}
            </div>
          </div>
        </div>

        {/* Hint Action / Banner */}
        <div className="w-full max-w-[340px] mt-4 flex items-center justify-between">
          {round.hints && revealedHints > 0 ? (
            <div
              className="flex-1 rounded-full px-4 py-2"
              style={{ background: '#FFFBEB', border: '2px solid #FBB35C', boxShadow: '0 4px 0 #FBB35C' }}
            >
              <p className="text-[13px] font-bold text-[#111] text-center" style={{ fontFamily: 'Inter, system-ui' }}>
                Hint: {round.hints[revealedHints - 1]}
              </p>
            </div>
          ) : (
            <div className="flex-1" />
          )}

          <button
            onClick={handleHint}
            disabled={!round.hints || revealedHints >= (round.hints?.length ?? 0)}
            className="flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full text-[15px] font-bold disabled:opacity-50 active:translate-y-1 transition-transform ml-2 bg-white"
            style={{ color: '#111', fontFamily: 'Plus Jakarta Sans, system-ui', border: '3px solid #111', boxShadow: '0 4px 0 #111' }}
          >
            Hint
          </button>
        </div>
      </div>

      <div className="px-4 pb-6 pt-4 bg-white border-t-2 border-[#111]">
        <p className="text-[12px] font-bold uppercase tracking-wider text-[#111] mb-3 text-center" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>
          Card deck ({availableCards.length} cards left)
        </p>

        {/* Deck navigator */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setDeckIndex(i => (i - 1 + availableCards.length) % availableCards.length)}
            className="w-14 h-14 flex items-center justify-center rounded-2xl active:translate-y-1 transition-transform"
            style={{ background: '#F9F6F0', border: '3px solid #111', boxShadow: '0 6px 0 #111' }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 24, color: "#111" }}>chevron_left</span>
          </button>

          {/* Card with stacked depth effect */}
          <div className="flex-1 relative h-16">
            {/* Stack shadows */}
            {availableCards.length > 2 && (
              <div
                className="absolute inset-0 rounded-[16px]"
                style={{
                  background: DECK_COLORS[(deckIndex + 2) % DECK_COLORS.length],
                  transform: 'rotate(5.5deg) scale(0.9)',
                  border: '3px solid #111',
                  boxShadow: '0 4px 0 #111',
                }}
              />
            )}
            {availableCards.length > 1 && (
              <div
                className="absolute inset-0 rounded-[16px]"
                style={{
                  background: DECK_COLORS[(deckIndex + 1) % DECK_COLORS.length],
                  transform: 'rotate(2.5deg) scale(0.95)',
                  border: '3px solid #111',
                  boxShadow: '0 5px 0 #111',
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
            className="w-14 h-14 flex items-center justify-center rounded-2xl active:translate-y-1 transition-transform"
            style={{ background: '#F9F6F0', border: '3px solid #111', boxShadow: '0 6px 0 #111' }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 24, color: "#111" }}>chevron_right</span>
          </button>
        </div>

        {/* Action buttons mapped to mechanics block */}
        <div className="flex gap-3">
          {/* Replace Hint button, it was moved above. Now just show empty space or prompt */}
          <div className="flex-1 flex items-center justify-center rounded-2xl border-3 border-dashed border-[#111] bg-[#EDE8DD] py-2">
            <span className="text-[13px] font-black tracking-tight" style={{ color: '#111', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
              DRAG CARD TO EMPTY SPOT
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function AttributePill({ label }: { label: string }) {
  // Randomly assign one of the flat colors for static nodes, but keep deterministic
  const charCode = label.charCodeAt(0) || 0
  const bgColors = ['#FBB35C', '#64C5D0', '#F194B4', '#A78BFA']
  const bgColor = bgColors[charCode % bgColors.length]
  
  return (
    <div
      className="rounded-2xl px-3 py-3"
      style={{
        background: bgColor,
        border: '3px solid #111',
        boxShadow: '0 6px 0 #111',
        width: 90,
        height: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <p
        className="text-[12px] font-black text-[#111] leading-tight text-center"
        style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}
      >
        {label}
      </p>
    </div>
  )
}
