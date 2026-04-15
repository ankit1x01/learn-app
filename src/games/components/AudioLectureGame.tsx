// src/games/components/AudioLectureGame.tsx
import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { GameWinScreen } from './GameWinScreen'
import { AudioLectureConfig, GameResult } from '../types'

interface Props {
  config: AudioLectureConfig
}

type Phase = 'intro' | 'listening' | 'quiz'

// ─── Root ─────────────────────────────────────────────────────────────────────

export function AudioLectureGame({ config }: Props) {
  const [phase,        setPhase]        = useState<Phase>('intro')
  const [correctBlanks, setCorrectBlanks] = useState(0)
  const [totalTaps,    setTotalTaps]    = useState(0)
  const [finalResult,  setFinalResult]  = useState<GameResult | null>(null)

  // Shuffle chips once on mount
  const [chips] = useState(() => [...config.chips].sort(() => Math.random() - 0.5))

  function handleListeningComplete(fills: Record<string, string | null>) {
    const correct = config.blanks.filter(b => fills[b.id] === b.answer).length
    setCorrectBlanks(correct)
    setPhase('quiz')
  }

  function handleQuizComplete(correct: number, taps: number) {
    const newTotalTaps = totalTaps + taps
    setTotalTaps(newTotalTaps)
    const blanksScore = Math.round((correctBlanks / config.blanks.length) * 50)
    const mcqScore    = Math.round((correct / config.questions.length) * 50)
    const total       = blanksScore + mcqScore
    const result: GameResult = {
      gameType:  'audio-lecture',
      score:     total,
      guesses:   newTotalTaps,
      hintsUsed: 0,
      timeMs:    0,
    }
    setFinalResult(result)
    config.onComplete?.(result)
  }

  if (finalResult) {
    return (
      <GameWinScreen
        result={finalResult}
        onPlayAgain={() => {
          setPhase('intro')
          setCorrectBlanks(0)
          setTotalTaps(0)
          setFinalResult(null)
        }}
      />
    )
  }

  return (
    <div className="flex flex-col min-h-[600px]" style={{ background: '#F7F6F3', userSelect: 'none' }}>
      {phase === 'intro'     && <IntroPhase     config={config}              onPlay={() => setPhase('listening')} />}
      {phase === 'listening' && <ListeningPhase config={config} chips={chips} onComplete={handleListeningComplete} />}
      {phase === 'quiz'      && <QuizPhase      questions={config.questions}  onComplete={handleQuizComplete} />}
    </div>
  )
}

// ─── IntroPhase ───────────────────────────────────────────────────────────────

interface IntroPhaseProps {
  config: AudioLectureConfig
  onPlay: () => void
}

function IntroPhase({ config, onPlay }: IntroPhaseProps) {
  return (
    <div
      className="flex flex-col flex-1 min-h-[600px] px-6 pt-10 pb-8 items-center justify-between"
      style={{ background: 'linear-gradient(160deg, #1E1B4B 0%, #312E81 100%)' }}
    >
      {/* Title */}
      <div className="text-center">
        <p
          className="text-[11px] font-bold tracking-[0.2em] text-[#A5B4FC] uppercase mb-2"
          style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}
        >
          Audio Lecture
        </p>
        <h1
          className="text-[28px] font-black text-white leading-tight"
          style={{ fontFamily: 'Plus Jakarta Sans, system-ui', letterSpacing: '-0.02em' }}
        >
          {config.title}
        </h1>
        <p className="text-[13px] text-[#A5B4FC] mt-2" style={{ fontFamily: 'Inter, system-ui' }}>
          Listen carefully — you'll fill in the blanks
        </p>
      </div>

      {/* Concept bubbles */}
      <div className="flex gap-3 flex-wrap justify-center">
        {config.concepts.map((concept, i) => (
          <motion.div
            key={concept}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.3, type: 'spring', stiffness: 260, damping: 20 }}
            className="px-4 py-2 rounded-2xl"
            style={{
              background: 'rgba(165,180,252,0.15)',
              border: '1px solid rgba(165,180,252,0.3)',
            }}
          >
            <span
              className="text-[14px] font-semibold text-[#C7D2FE]"
              style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}
            >
              {concept}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Play button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        onClick={onPlay}
        className="w-full py-4 rounded-2xl text-[17px] font-black text-white"
        style={{
          background: '#6366F1',
          boxShadow: '0 4px 0 #4338CA',
          fontFamily: 'Plus Jakarta Sans, system-ui',
        }}
      >
        Play
      </motion.button>
    </div>
  )
}

// ─── ListeningPhase ───────────────────────────────────────────────────────────

interface ListeningPhaseProps {
  config:     AudioLectureConfig
  chips:      string[]
  onComplete: (fills: Record<string, string | null>) => void
}

function ListeningPhase({ config, chips: initialChips, onComplete }: ListeningPhaseProps) {
  const [fills,      setFills]      = useState<Record<string, string | null>>(
    () => Object.fromEntries(config.blanks.map(b => [b.id, null]))
  )
  const [shaking,    setShaking]    = useState<string | null>(null)
  const [audioEnded, setAudioEnded] = useState(false)
  const [dragging,   setDragging]   = useState<{ chip: string; x: number; y: number } | null>(null)

  const slotRefs      = useRef<Record<string, HTMLElement | null>>({})
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  const fillsRef = useRef(fills)
  fillsRef.current = fills

  const durationMs = config.passage.split(' ').length * 350

  // Start TTS on mount
  useEffect(() => {
    const utterance   = new SpeechSynthesisUtterance(config.passage)
    utterance.rate    = 0.85
    utterance.onend   = () => setAudioEnded(true)
    window.speechSynthesis.speak(utterance)
    return () => window.speechSynthesis.cancel()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Advance to quiz 1.5s after audio ends
  useEffect(() => {
    if (!audioEnded) return
    const t = setTimeout(() => onCompleteRef.current(fillsRef.current), 1500)
    return () => clearTimeout(t)
  }, [audioEnded])

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>, chip: string) {
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging({ chip, x: e.clientX, y: e.clientY })
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return
    setDragging(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null)
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return
    const { chip, x, y } = dragging
    setDragging(null)

    for (const blank of config.blanks) {
      if (fills[blank.id] !== null) continue
      const el = slotRefs.current[blank.id]
      if (!el) continue
      const rect = el.getBoundingClientRect()
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        if (chip === blank.answer) {
          Haptics.impact({ style: ImpactStyle.Light }).catch(() => {})
          setFills(prev => ({ ...prev, [blank.id]: chip }))
        } else {
          Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {})
          setShaking(blank.id)
          setTimeout(() => setShaking(null), 500)
        }
        return
      }
    }
  }

  const parts     = config.displayPassage.split('___')
  const usedChips = new Set(Object.values(fills).filter(Boolean) as string[])

  return (
    <div
      className="flex flex-col flex-1 min-h-[600px] px-5 pt-4 pb-6"
      style={{ background: '#F7F6F3', userSelect: 'none', touchAction: 'none' }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Audio progress bar */}
      <div className="h-1 bg-[#E8E5DF] rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full rounded-full"
          style={{ background: '#6366F1' }}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: durationMs / 1000, ease: 'linear' }}
        />
      </div>

      {/* Phase label */}
      <p
        className="text-center text-[11px] font-bold tracking-[0.2em] text-[#A8A29E] mb-4"
        style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}
      >
        LISTENING
      </p>

      {/* Passage with inline blank slots */}
      <div className="bg-white rounded-2xl p-4 mb-5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <p className="text-[15px] text-[#1C1917] leading-relaxed" style={{ fontFamily: 'Inter, system-ui' }}>
          {parts.map((part, i) => (
            <span key={i}>
              {part}
              {i < config.blanks.length && (
                <motion.span
                  ref={el => { slotRefs.current[config.blanks[i].id] = el }}
                  animate={shaking === config.blanks[i].id ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  className="inline-block mx-1 px-3 py-0.5 rounded-lg text-[14px] font-semibold min-w-[60px] text-center"
                  style={{
                    background: fills[config.blanks[i].id] ? '#EEF2FF' : 'transparent',
                    border:     `2px solid ${fills[config.blanks[i].id] ? '#6366F1' : '#A8A29E'}`,
                    color:      '#6366F1',
                  }}
                >
                  {fills[config.blanks[i].id] ?? '___'}
                </motion.span>
              )}
            </span>
          ))}
        </p>
      </div>

      {/* Draggable chips */}
      <div className="flex flex-wrap gap-2 justify-center">
        {initialChips
          .filter(chip => !usedChips.has(chip))
          .map(chip => (
            <div
              key={chip}
              onPointerDown={e => handlePointerDown(e, chip)}
              className="px-4 py-2 rounded-xl"
              style={{
                background:  '#E0E7FF',
                border:      '2px solid #6366F1',
                touchAction: 'none',
                cursor:      'grab',
              }}
            >
              <span
                className="text-[14px] font-semibold text-[#4338CA]"
                style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}
              >
                {chip}
              </span>
            </div>
          ))}
      </div>

      {/* Drag ghost */}
      {dragging && (
        <div
          className="fixed pointer-events-none z-50 px-4 py-2 rounded-xl"
          style={{
            left:       dragging.x - 40,
            top:        dragging.y - 20,
            background: '#6366F1',
            border:     '2px solid #4338CA',
            opacity:    0.9,
          }}
        >
          <span
            className="text-[14px] font-semibold text-white"
            style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}
          >
            {dragging.chip}
          </span>
        </div>
      )}

      {audioEnded && (
        <p
          className="text-center text-[12px] text-[#6366F1] mt-4"
          style={{ fontFamily: 'Inter, system-ui' }}
        >
          Audio complete · Moving to questions…
        </p>
      )}
    </div>
  )
}

// ─── QuizPhase ────────────────────────────────────────────────────────────────

interface QuizPhaseProps {
  questions:  AudioLectureConfig['questions']
  onComplete: (correct: number, taps: number) => void
}

function QuizPhase({ questions, onComplete }: QuizPhaseProps) {
  const [index,    setIndex]    = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [correct,  setCorrect]  = useState(0)
  const [taps,     setTaps]     = useState(0)

  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  function handleTap(option: string) {
    if (selected !== null) return
    setSelected(option)
    const newTaps    = taps + 1
    setTaps(newTaps)
    const isCorrect  = option === questions[index].answer
    const newCorrect = correct + (isCorrect ? 1 : 0)
    if (isCorrect) {
      Haptics.impact({ style: ImpactStyle.Light }).catch(() => {})
      setCorrect(newCorrect)
    } else {
      Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {})
    }
    const delay = isCorrect ? 800 : 1200
    setTimeout(() => {
      if (index + 1 >= questions.length) {
        onCompleteRef.current(newCorrect, newTaps)
      } else {
        setIndex(prev => prev + 1)
        setSelected(null)
      }
    }, delay)
  }

  const q = questions[index]

  return (
    <div className="flex flex-col flex-1 min-h-[600px] px-5 pt-4 pb-6" style={{ background: '#F7F6F3' }}>
      {/* Round dots */}
      <div className="flex gap-1.5 justify-center mb-4">
        {questions.map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-colors duration-300"
            style={{ background: i <= index ? '#6366F1' : '#E8E5DF' }}
          />
        ))}
      </div>

      {/* Phase label */}
      <p
        className="text-center text-[11px] font-bold tracking-[0.2em] text-[#A8A29E] mb-4"
        style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}
      >
        QUIZ
      </p>

      {/* Question card */}
      <div className="bg-white rounded-2xl p-5 mb-5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <p
          className="text-[16px] font-semibold text-[#1C1917] text-center"
          style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}
        >
          {q.prompt}
        </p>
      </div>

      {/* 2×2 options grid */}
      <div className="grid grid-cols-2 gap-3">
        {q.options.map(option => {
          let bg        = 'white'
          let border    = '#E8E5DF'
          let textColor = '#1C1917'
          if (selected !== null) {
            if (option === q.answer)      { bg = '#DCFCE7'; border = '#16A34A'; textColor = '#15803D' }
            else if (option === selected) { bg = '#FEE2E2'; border = '#DC2626'; textColor = '#DC2626' }
          }
          return (
            <button
              key={option}
              onClick={() => handleTap(option)}
              className="p-4 rounded-2xl text-left transition-colors"
              style={{
                background: bg,
                border:     `2px solid ${border}`,
                boxShadow:  '0 2px 4px rgba(0,0,0,0.06)',
              }}
            >
              <span
                className="text-[14px] font-semibold"
                style={{ color: textColor, fontFamily: 'Plus Jakarta Sans, system-ui' }}
              >
                {option}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
