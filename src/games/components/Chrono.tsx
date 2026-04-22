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
  const [placedCount, setPlacedCount] = useState(0)
  const [guesses, setGuesses] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [activeFactoid, setActiveFactoid] = useState<string | null>(null)
  const [result, setResult] = useState<GameResult | null>(null)

  function handleCheck() {
    const newGuesses = guesses + 1
    setGuesses(newGuesses)

    // We only check the placed ones
    const placed = events.slice(0, placedCount)
    const sorted = [...placed].sort((a, b) => a.sortKey - b.sortKey)
    
    let allCorrectSoFar = true
    const updatedPlaced = placed.map((e, i) => {
      const isCorrect = e.sortKey === sorted[i].sortKey
      if (!isCorrect) allCorrectSoFar = false
      return {
        ...e,
        status: isCorrect ? 'correct' as const : 'wrong' as const,
        locked: isCorrect,
      }
    })

    setEvents([...updatedPlaced, ...events.slice(placedCount)])

    const allFinished = allCorrectSoFar && placedCount === events.length

    setTimeout(() => {
      if (allFinished) {
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

  function handleDropToPlace() {
    // When the top deck card is dragged and dropped, we assume they placed it
    // into the timeline. Increment placedCount so it becomes a timeline card.
    if (placedCount < events.length) {
      setPlacedCount(prev => prev + 1)
    }
  }

  function handleReset() {
    setEvents(shuffle(config.events).map(e => ({ ...e, status: 'idle' as const, locked: false })))
    setPlacedCount(0)
    setGuesses(0)
    setHintsUsed(0)
    setActiveFactoid(null)
    setResult(null)
    startTime.current = Date.now()
  }

  if (result) return <GameWinScreen result={result} onPlayAgain={handleReset} />

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: '#F8F7F3' }}>
     

      {/* Timeline Area */}
      <div className="flex-1 relative flex flex-col pt-8 pb-0 overflow-y-auto">
        {/* Left Vertical Line with Before / After */}
        <div className="absolute top-0 bottom-0 flex flex-col items-center justify-between" style={{ left: '26px', zIndex: 0, paddingBottom: '160px' }}>
          <span className="text-[12px] font-medium tracking-wide -rotate-90 origin-center text-[#111] mb-8 whitespace-nowrap mt-4" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>Before</span>
          <div className="flex-1 w-[2px] bg-[#111]" />
          <span className="text-[12px] font-medium tracking-wide -rotate-90 origin-center text-[#111] mt-8 whitespace-nowrap mb-4" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>After</span>
        </div>

        {/* Placed Event Cards & Bottom Card (All inside Reorder.Group for drag & drop) */}
        <Reorder.Group
          values={events.slice(0, placedCount + 1)}
          onReorder={(reorderedActive) => {
            // Keep the hidden items appended to the end unharmed
            setEvents([...reorderedActive, ...events.slice(placedCount + 1)])
          }}
          className="flex flex-col gap-6 relative z-10 w-full pl-[50px] pr-4 min-h-full pb-[60px]"
          axis="y"
        >
          {events.slice(0, placedCount + 1).map((event, i) => {
            const isDeckCard = i === placedCount;
            
            // Render the bottom "To Place" card
            if (isDeckCard) {
              return (
                <Reorder.Item
                  key={event.id}
                  value={event}
                  dragListener={true}
                  onDragEnd={() => handleDropToPlace()}
                  className="cursor-grab active:cursor-grabbing z-20 w-[calc(100%+2rem)] -ml-8 bg-white flex items-stretch shadow-xl mt-auto"
                  style={{
                    border: '2px solid #111',
                    borderRadius: '12px',
                    minHeight: '120px',
                    overflow: 'hidden',
                    marginBottom: '10px'
                  }}
                >
                  {/* Left Thumbnail (Detailed) */}
                  <div 
                    className="w-[100px] shrink-0 border-r-[2px] border-[#111] bg-[#111] flex items-center justify-center overflow-hidden"
                  >
                    <img 
                      src={`https://picsum.photos/seed/${event.id}/200/200`} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Right Content (Detailed) */}
                  <div className="flex-1 flex flex-col justify-center px-4 py-3 bg-white">
                    <p
                      className="text-[16px] font-bold leading-snug mb-1.5"
                      style={{ color: '#111', fontFamily: 'Plus Jakarta Sans, system-ui' }}
                    >
                      {event.label}
                    </p>
                    <p 
                      className="text-[13px] leading-snug" 
                      style={{ color: '#333', fontFamily: 'Inter, system-ui' }}
                    >
                      {event.factoid || "Detailed description showing historical context and more info..."}
                    </p>
                  </div>
                </Reorder.Item>
              );
            }

            // Render standard placed cards
            const cardBg = '#FF99C2'; // Pink background matching image

            return (
              <Reorder.Item
                key={event.id}
                value={event}
                dragListener={false} // Do not allow upper cards to be dragged/reordered
                className="z-10 relative" // removed cursor-grab active:cursor-grabbing
              >
                <div
                  className="w-full flex items-stretch relative"
                  style={{
                    background: cardBg,
                    border: '1.5px solid #111',
                    borderRadius: '10px',
                    minHeight: '74px',
                  }}
                >
                  {/* Left Thumbnail (Compact) */}
                  <div 
                    className="w-[74px] shrink-0 border-r-[1.5px] border-[#111] bg-white flex items-center justify-center overflow-hidden"
                    style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}
                  >
                    <img 
                      src={`https://picsum.photos/seed/${event.id}/150/150`} 
                      alt="" 
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>

                  {/* Right Content */}
                  <div className="flex-1 flex flex-col justify-center px-3 py-2 pr-1 relative">
                    <div className="flex justify-between items-start mb-1">
                      {/* Pill Badge */}
                      <div 
                        className="rounded-[4px] px-2 text-[12px] font-bold inline-block"
                        style={{
                          background: '#FFFFFF',
                          border: '1.5px solid #111',
                          color: '#111',
                          paddingTop: '2px', paddingBottom: '2px'
                        }}
                      >
                        {event.dateLabel}
                      </div>

                      {/* Check Icon */}
                      <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-[#111] bg-transparent flex items-center justify-center mt-0.5 mr-2">
                        <CheckCircle size={12} color="#111" strokeWidth={3} />
                      </div>
                    </div>

                    <p
                      className="text-[14px] font-black leading-tight"
                      style={{ color: '#111', fontFamily: 'Inter, Plus Jakarta Sans, system-ui' }}
                    >
                      {event.label}
                    </p>
                  </div>
                </div>
              </Reorder.Item>
            );
          })}
          
          {/* Bottom Area (The "To Place" card) */}
          {placedCount < events.length ? (
            <div className="fixed bottom-0 left-0 right-0 z-10 pb-2 pt-12 pointer-events-none" style={{ background: 'linear-gradient(to top, #F8F7F3 80%, transparent)' }}>
              <div className="max-w-md mx-auto pointer-events-auto relative px-4 flex justify-between items-end">
                <div className="flex items-center gap-1.5 font-bold text-[14px]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#111"><path d="M4 8h16v12H4z" stroke="#111" strokeWidth="2" strokeLinejoin="round"/><path d="M8 2h16v12" stroke="#111" strokeWidth="2" strokeLinejoin="round" fill="none"/></svg>
                  {events.length - placedCount}
                </div>
                <p className="font-medium text-[16px] text-[#111] translate-y-[-4px]" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>
                  Place on timeline
                </p>
                <div className="w-[22px]"></div> {/* Spacer */}
              </div>
            </div>
          ) : (
            <div className="fixed bottom-0 left-0 right-0 z-10 pb-4 pt-12 flex justify-center bg-gradient-to-t from-[#F8F7F3] via-[#F8F7F3] to-transparent">
              <button
                onClick={handleCheck}
                className="btn-primary w-[90%] max-w-sm py-3 text-[18px] font-bold shadow-lg"
                style={{ borderRadius: '12px' }}
              >
                Check Answers
              </button>
            </div>
          )}
        </Reorder.Group>
      </div>
    </div>
  )

}
