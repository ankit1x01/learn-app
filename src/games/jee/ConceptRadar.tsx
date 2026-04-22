import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useConceptStore } from '../../db/useConceptStore'
import { CONFIG } from '../../lib/config'

const LEVELS = [
  { label: 'Level 1', displaySeconds: 8, options: 4, description: 'Easy questions, 8 seconds' },
  { label: 'Level 2', displaySeconds: 5, options: 5, description: 'Medium difficulty, 5 seconds' },
  { label: 'Level 3', displaySeconds: 3, options: 6, description: 'Hard questions, 3 seconds' },
  { label: 'Level 4', displaySeconds: 2, options: 8, description: 'Expert, 2 seconds' },
]

interface RadarCard {
  conceptId: string
  conceptName: string
  correctChapter: string
  options: string[]     // 4–8 chapter names including correct
}

interface Props {
  onBack: () => void
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export function ConceptRadar({ onBack }: Props) {
  const { concepts, dbReady } = useConceptStore(CONFIG.concepts)

  const [phase, setPhase]       = useState<'ready' | 'countdown' | 'answer' | 'result' | 'done'>('ready')
  const [levelIndex, setLevelIndex] = useState(0)
  const [cardIndex, setCardIndex]   = useState(0)
  const [countdown, setCountdown]   = useState(0)
  const [score, setScore]           = useState(0)
  const [correct, setCorrect]       = useState(0)
  const [total, setTotal]           = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const level = LEVELS[levelIndex]

  const cards: RadarCard[] = useMemo(() => {
    if (!dbReady || concepts.length === 0) return []
    const chapters = [...new Set(concepts.map(c => c.chapter))]
    const seen = concepts.filter(c => c.stage !== 'Unseen')
    const pool  = seen.length >= 20 ? seen : concepts
    return shuffle(pool).slice(0, 30).map(c => {
      const wrongChapters = shuffle(chapters.filter(ch => ch !== c.chapter)).slice(0, 7)
      const opts = shuffle([c.chapter, ...wrongChapters]).slice(0, level.options)
      return {
        conceptId: c.id,
        conceptName: c.name,
        correctChapter: c.chapter,
        options: opts.includes(c.chapter) ? opts : [c.chapter, ...opts.slice(0, level.options - 1)].sort(() => Math.random() - 0.5),
      }
    })
  }, [dbReady, levelIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  const card = cards[cardIndex]

  const stopCountdown = () => {
    if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null }
  }

  useEffect(() => stopCountdown, [])

  const startCard = () => {
    setSelectedOption(null)
    setPhase('countdown')
    setCountdown(level.displaySeconds)
    countdownRef.current = setInterval(() => {
      setCountdown(t => {
        if (t <= 1) {
          stopCountdown()
          setPhase('answer')
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  const handleStart = () => {
    setScore(0); setCorrect(0); setTotal(0); setCardIndex(0)
    startCard()
  }

  const handleSelect = (option: string) => {
    if (phase !== 'answer' && phase !== 'countdown') return
    stopCountdown()
    setSelectedOption(option)
    setPhase('result')
    setTotal(t => t + 1)

    if (option === card.correctChapter) {
      const speedBonus = Math.max(0, countdown * 10)  // bonus for remaining time
      const pts = 100 + speedBonus
      setScore(s => s + pts)
      setCorrect(c => c + 1)
    }
  }

  const handleNext = () => {
    if (cardIndex + 1 >= cards.length) {
      setPhase('done')
    } else {
      setCardIndex(i => i + 1)
      startCard()
    }
  }

  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
  const countdownPct = (countdown / level.displaySeconds) * 100

  // ── Ready ─────────────────────────────────────────────────────────────────
  if (phase === 'ready') {
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto" style={{ background: 'var(--color-background)' }}>
        <div className="flex items-center gap-3 px-4 pt-5 pb-3">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: 'var(--color-surface-container)' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--color-on-surface)' }}>arrow_back</span>
          </button>
          <h1 className="text-[18px] font-black" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Concept Radar</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-7">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-24 h-24 rounded-3xl flex items-center justify-center" style={{ background: '#FFFBEB' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 52, color: '#D97706', fontVariationSettings: "'FILL' 1" }}>radar</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-center">
            <p className="text-[26px] font-black leading-tight mb-2" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui', letterSpacing: '-0.02em' }}>Classify in seconds</p>
            <p className="text-[14px] leading-relaxed" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>
              Concept name shown for a countdown. After time's up, tap which topic it belongs to. Builds the mental schemas JEE toppers use.
            </p>
          </motion.div>

          {/* Level selector */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="w-full space-y-2">
            <p className="text-[12px] font-bold px-1" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Select Level</p>
            {LEVELS.map((l, i) => (
              <button key={l.label} onClick={() => setLevelIndex(i)}
                className="w-full flex items-center justify-between p-3 rounded-2xl border"
                style={{
                  background: levelIndex === i ? '#FFFBEB' : 'var(--color-surface-container)',
                  borderColor: levelIndex === i ? '#D97706' : 'transparent',
                }}>
                <span className="text-[13px] font-bold" style={{ color: levelIndex === i ? '#D97706' : 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>{l.label}</span>
                <span className="text-[12px]" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>{l.description}</span>
              </button>
            ))}
          </motion.div>

          <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={handleStart} disabled={!dbReady || cards.length === 0}
            className="w-full py-4 rounded-2xl font-black text-[17px] disabled:opacity-40"
            style={{ background: '#D97706', color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
            {!dbReady ? 'Loading…' : 'Start Radar'}
          </motion.button>
        </div>
      </div>
    )
  }

  // ── Done ─────────────────────────────────────────────────────────────────
  if (phase === 'done') {
    const grade = accuracy >= 80 ? { label: 'Expert Radar', color: '#D97706', icon: 'radar' }
      : accuracy >= 60 ? { label: 'Good Instincts', color: '#059669', icon: 'psychology' }
      : { label: 'Keep Training', color: '#DC2626', icon: 'fitness_center' }
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto" style={{ background: 'var(--color-background)' }}>
        <div className="flex items-center gap-3 px-4 pt-5 pb-3">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: 'var(--color-surface-container)' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--color-on-surface)' }}>arrow_back</span>
          </button>
          <h1 className="text-[18px] font-black" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Radar Complete</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-28 h-28 rounded-3xl flex items-center justify-center" style={{ background: '#FFFBEB' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 60, color: grade.color, fontVariationSettings: "'FILL' 1" }}>{grade.icon}</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center">
            <p className="text-[36px] font-black" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui', letterSpacing: '-0.02em' }}>{score.toLocaleString()}</p>
            <p className="text-[14px] font-bold mt-1" style={{ color: grade.color, fontFamily: 'Inter, system-ui' }}>{grade.label}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="w-full grid grid-cols-2 gap-3">
            {[
              { label: 'Accuracy', value: `${accuracy}%`, icon: 'target', color: '#D97706' },
              { label: 'Classified', value: `${correct}/${total}`, icon: 'check_circle', color: '#059669' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: 'var(--color-surface-container)' }}>
                <span className="material-symbols-rounded" style={{ fontSize: 22, color: s.color, fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                <div>
                  <p className="text-[18px] font-black leading-none" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>{s.value}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>{s.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="w-full flex gap-3">
            <button onClick={onBack} className="flex-1 py-3.5 rounded-2xl font-bold text-[15px]"
              style={{ background: 'var(--color-surface-container)', color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Done</button>
            <button onClick={handleStart} className="flex-1 py-3.5 rounded-2xl font-bold text-[15px]"
              style={{ background: '#D97706', color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Play Again</button>
          </motion.div>
        </div>
      </div>
    )
  }

  // ── Card / Answer / Result ────────────────────────────────────────────────
  if (!card) return null

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto" style={{ background: 'var(--color-background)' }}>
      {/* Countdown bar */}
      <div className="h-2 w-full" style={{ background: 'var(--color-surface-container)' }}>
        <motion.div className="h-full" style={{ background: phase === 'countdown' ? '#D97706' : 'var(--color-surface-container)', width: `${countdownPct}%` }} transition={{ duration: 0.5 }} />
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => { stopCountdown(); setPhase('done') }} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: 'var(--color-surface-container)' }}>
          <span className="material-symbols-rounded" style={{ fontSize: 18, color: 'var(--color-on-surface)' }}>close</span>
        </button>
        <span className="text-[13px] font-bold" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>{cardIndex + 1}/{cards.length} · {level.label}</span>
        <span className="text-[18px] font-black tabular-nums" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>{score.toLocaleString()}</span>
      </div>

      {/* Concept display */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-6">
        <AnimatePresence mode="wait">
          <motion.div key={cardIndex} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.2 }} className="w-full">
            {/* Big countdown */}
            {phase === 'countdown' && (
              <div className="flex justify-center mb-4">
                <motion.div key={countdown} initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#FFFBEB' }}>
                  <span className="text-[28px] font-black" style={{ color: '#D97706', fontFamily: 'Plus Jakarta Sans, system-ui' }}>{countdown}</span>
                </motion.div>
              </div>
            )}

            {/* Concept name */}
            <div className="w-full p-6 rounded-3xl text-center mb-4" style={{ background: 'var(--color-surface-container)', minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="text-[22px] font-black leading-tight" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui', letterSpacing: '-0.01em' }}>
                {card.conceptName}
              </p>
            </div>

            {/* Options (shown after countdown) */}
            {(phase === 'answer' || phase === 'result') && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                className="grid grid-cols-2 gap-2">
                {card.options.map(opt => {
                  const isCorrectOpt  = opt === card.correctChapter
                  const isSelectedOpt = opt === selectedOption
                  let bg = 'var(--color-surface-container)'
                  let textColor = 'var(--color-on-surface)'
                  let borderColor = 'transparent'
                  if (phase === 'result') {
                    if (isCorrectOpt) { bg = '#ECFDF5'; textColor = '#059669'; borderColor = '#059669' }
                    else if (isSelectedOpt) { bg = '#FEF2F2'; textColor = '#DC2626'; borderColor = '#DC2626' }
                  }
                  return (
                    <motion.button key={opt} whileTap={{ scale: 0.95 }} onClick={() => handleSelect(opt)}
                      disabled={phase === 'result'}
                      className="p-3 rounded-2xl text-[12px] font-semibold text-left border"
                      style={{ background: bg, color: textColor, borderColor, fontFamily: 'Inter, system-ui' }}>
                      {isCorrectOpt && phase === 'result' && <span className="material-symbols-rounded mr-1" style={{ fontSize: 12, color: '#059669', fontVariationSettings: "'FILL' 1" }}>check</span>}
                      {opt}
                    </motion.button>
                  )
                })}
              </motion.div>
            )}

            {/* Speed bonus display */}
            {phase === 'result' && selectedOption === card.correctChapter && countdown > 0 && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mt-3">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold" style={{ background: '#FFFBEB', color: '#D97706', fontFamily: 'Inter, system-ui' }}>
                  +{countdown * 10} speed bonus
                </span>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Next button */}
      {phase === 'result' && (
        <div className="px-4 pb-8">
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={handleNext}
            className="w-full py-4 rounded-2xl font-black text-[17px]"
            style={{ background: '#D97706', color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
            {cardIndex + 1 >= cards.length ? 'See Results' : 'Next Concept'}
          </motion.button>
        </div>
      )}
    </div>
  )
}
