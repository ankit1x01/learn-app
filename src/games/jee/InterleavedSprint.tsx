import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useConceptStore } from '../../db/useConceptStore'
import { CONFIG } from '../../lib/config'
import { buildSession } from '../../core/session-builder'
import {
  advanceStage, regressStage,
  updateStabilityOnSuccess, updateStabilityOnFailure,
  updateDifficulty, getNextReviewDays, calculateR,
} from '../../core/fsrs'
import type { SessionItem } from '../../core/types'

const ROUND_SECONDS = 60

interface Props {
  onBack: () => void
}

export function InterleavedSprint({ onBack }: Props) {
  const { concepts, onUpdateConcept, dbReady } = useConceptStore(CONFIG.concepts)

  const [phase, setPhase]       = useState<'ready' | 'playing' | 'done'>('ready')
  const [index, setIndex]       = useState(0)
  const [score, setScore]       = useState(0)
  const [combo, setCombo]       = useState(0)
  const [crossCombo, setCrossCombo] = useState(0)  // cross-subject streak
  const [maxCross, setMaxCross] = useState(0)
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS)
  const [isFlipped, setIsFlipped] = useState(false)
  const [subjectFlash, setSubjectFlash] = useState<string | null>(null)
  const [totalRated, setTotalRated] = useState(0)
  const [goodCount, setGoodCount]   = useState(0)
  const prevSubjectRef = useRef<string | null>(null)
  const timerRef       = useRef<ReturnType<typeof setInterval> | null>(null)

  const queue: SessionItem[] = useMemo(() => {
    if (!dbReady) return []
    // Shuffle so subjects interleave naturally
    const session = buildSession({ ...CONFIG, concepts }, 60, new Date().getHours())
    return session.sort(() => Math.random() - 0.5)
  }, [dbReady]) // eslint-disable-line react-hooks/exhaustive-deps

  const current = queue[index]

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }, [])

  const endRound = useCallback(() => { stopTimer(); setPhase('done') }, [stopTimer])
  useEffect(() => stopTimer, [stopTimer])

  const handleStart = () => {
    setPhase('playing')
    setTimeLeft(ROUND_SECONDS)
    setScore(0); setCombo(0); setCrossCombo(0); setMaxCross(0)
    setIndex(0); setTotalRated(0); setGoodCount(0)
    setIsFlipped(false); prevSubjectRef.current = null
    timerRef.current = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { endRound(); return 0 } return t - 1 })
    }, 1000)
  }

  const showSubjectFlash = (subject: string) => {
    setSubjectFlash(subject)
    setTimeout(() => setSubjectFlash(null), 900)
  }

  const handleRate = (ratingId: 'again' | 'hard' | 'good' | 'easy') => {
    if (!current) return
    const { concept } = current
    const R = calculateR(concept.stability, concept.lastTested)
    const isCorrect = ratingId === 'good' || ratingId === 'easy'
    const isAgain   = ratingId === 'again'

    // FSRS update
    const newStage     = isCorrect ? advanceStage(concept.stage) : isAgain ? regressStage(concept.stage) : concept.stage
    const newStability = isCorrect ? updateStabilityOnSuccess(concept.stability, R, null)
      : isAgain ? updateStabilityOnFailure(concept.stability)
      : Math.max(1, Math.round(concept.stability * 0.9 * 10) / 10)
    const newDifficulty = updateDifficulty(concept.difficulty, isCorrect)
    onUpdateConcept(concept.id, {
      stage: newStage, stability: newStability, difficulty: newDifficulty,
      lastTested: 0, nextReview: getNextReviewDays(newStability), lastStudiedAt: Date.now(),
    })

    // Cross-subject bonus: switching subject AND correct = 2× multiplier
    const isCrossSubject = prevSubjectRef.current !== null && prevSubjectRef.current !== concept.subject
    const newCrossCombo  = isCorrect && isCrossSubject ? crossCombo + 1 : isCorrect ? crossCombo : 0
    const newCombo       = isCorrect ? combo + 1 : 0
    const basePoints     = ratingId === 'easy' ? 120 : ratingId === 'good' ? 80 : ratingId === 'hard' ? 30 : 0
    const multiplier     = isCorrect && isCrossSubject ? 1 + newCrossCombo * 0.15 : 1 + Math.min(newCombo, 5) * 0.1

    setScore(s => s + Math.round(basePoints * multiplier))
    setCombo(newCombo)
    setCrossCombo(newCrossCombo)
    setMaxCross(m => Math.max(m, newCrossCombo))
    setTotalRated(t => t + 1)
    if (isCorrect) setGoodCount(g => g + 1)

    showSubjectFlash(concept.subject)
    prevSubjectRef.current = concept.subject

    if (index + 1 >= queue.length) { endRound() }
    else { setIndex(i => i + 1); setIsFlipped(false) }
  }

  const timerPct   = (timeLeft / ROUND_SECONDS) * 100
  const timerColor = timeLeft > 20 ? '#059669' : timeLeft > 10 ? '#D97706' : '#DC2626'
  const accuracy   = totalRated > 0 ? Math.round((goodCount / totalRated) * 100) : 0

  // ── Ready ─────────────────────────────────────────────────────────────────
  if (phase === 'ready') {
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto" style={{ background: 'var(--color-background)' }}>
        <div className="flex items-center gap-3 px-4 pt-5 pb-3">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: 'var(--color-surface-container)' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--color-on-surface)' }}>arrow_back</span>
          </button>
          <h1 className="text-[18px] font-black" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Interleaved Sprint</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-7">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-24 h-24 rounded-3xl flex items-center justify-center" style={{ background: '#ECFDF5' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 52, color: '#059669', fontVariationSettings: "'FILL' 1" }}>shuffle</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-center">
            <p className="text-[26px] font-black leading-tight mb-2" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui', letterSpacing: '-0.02em' }}>No topic labels.</p>
            <p className="text-[14px] leading-relaxed" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>
              Concepts from all subjects mixed randomly. The subject is hidden — you must recall without context cues. Cross-subject streaks multiply your score.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="w-full p-4 rounded-2xl space-y-2" style={{ background: 'var(--color-surface-container)' }}>
            <p className="text-[12px] font-bold" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Cross-Subject Streak Bonus</p>
            {[
              { streak: '×1 switch', bonus: '+15%', color: '#059669' },
              { streak: '×3 switches', bonus: '+45%', color: '#0891B2' },
              { streak: '×5 switches', bonus: '+75%', color: '#7C3AED' },
            ].map(r => (
              <div key={r.streak} className="flex items-center justify-between">
                <span className="text-[12px]" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>{r.streak}</span>
                <span className="text-[12px] font-bold" style={{ color: r.color, fontFamily: 'Inter, system-ui' }}>{r.bonus}</span>
              </div>
            ))}
          </motion.div>
          <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={handleStart} disabled={!dbReady || queue.length === 0}
            className="w-full py-4 rounded-2xl font-black text-[17px] disabled:opacity-40"
            style={{ background: '#059669', color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
            {!dbReady ? 'Loading…' : queue.length === 0 ? 'No concepts' : 'Start Sprint'}
          </motion.button>
        </div>
      </div>
    )
  }

  // ── Done ─────────────────────────────────────────────────────────────────
  if (phase === 'done') {
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto" style={{ background: 'var(--color-background)' }}>
        <div className="flex items-center gap-3 px-4 pt-5 pb-3">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: 'var(--color-surface-container)' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--color-on-surface)' }}>arrow_back</span>
          </button>
          <h1 className="text-[18px] font-black" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Sprint Done</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-28 h-28 rounded-3xl flex items-center justify-center" style={{ background: '#ECFDF5' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 60, color: '#059669', fontVariationSettings: "'FILL' 1" }}>shuffle</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center">
            <p className="text-[36px] font-black" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui', letterSpacing: '-0.02em' }}>{score.toLocaleString()}</p>
            <p className="text-[13px] mt-1" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>Interleaved Score</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full grid grid-cols-2 gap-3">
            {[
              { label: 'Accuracy', value: `${accuracy}%`, icon: 'target', color: '#059669' },
              { label: 'Best Cross Streak', value: `×${maxCross}`, icon: 'sync_alt', color: '#7C3AED' },
              { label: 'Concepts Reviewed', value: totalRated.toString(), icon: 'done_all', color: '#0891B2' },
              { label: 'FSRS Updated', value: totalRated.toString(), icon: 'memory', color: '#D97706' },
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
              style={{ background: '#059669', color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Play Again</button>
          </motion.div>
        </div>
      </div>
    )
  }

  // ── Playing ──────────────────────────────────────────────────────────────
  if (!current) return null

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto" style={{ background: 'var(--color-background)' }}>
      {/* Timer bar */}
      <div className="h-1.5 w-full" style={{ background: 'var(--color-surface-container)' }}>
        <div className="h-full transition-all duration-500" style={{ background: timerColor, width: `${timerPct}%` }} />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={endRound} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: 'var(--color-surface-container)' }}>
          <span className="material-symbols-rounded" style={{ fontSize: 18, color: 'var(--color-on-surface)' }}>close</span>
        </button>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-rounded" style={{ fontSize: 16, color: timerColor, fontVariationSettings: "'FILL' 1" }}>timer</span>
          <span className="text-[16px] font-black tabular-nums" style={{ color: timerColor, fontFamily: 'Plus Jakarta Sans, system-ui' }}>{timeLeft}s</span>
        </div>
        <div className="flex items-center gap-2">
          {crossCombo >= 2 && (
            <motion.div key={crossCombo} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-0.5 px-2 py-0.5 rounded-full" style={{ background: '#F5F3FF' }}>
              <span className="material-symbols-rounded" style={{ fontSize: 12, color: '#7C3AED', fontVariationSettings: "'FILL' 1" }}>sync_alt</span>
              <span className="text-[11px] font-black" style={{ color: '#7C3AED', fontFamily: 'Plus Jakarta Sans, system-ui' }}>×{crossCombo}</span>
            </motion.div>
          )}
          <span className="text-[18px] font-black tabular-nums" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>{score.toLocaleString()}</span>
        </div>
      </div>

      {/* Subject flash overlay */}
      <AnimatePresence>
        {subjectFlash && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full z-10"
            style={{ background: 'var(--color-primary)', pointerEvents: 'none' }}>
            <span className="text-[12px] font-bold" style={{ color: 'var(--color-on-primary)', fontFamily: 'Inter, system-ui' }}>{subjectFlash}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Concept card — subject intentionally hidden */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.div key={index} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }} className="w-full">
            <div className="flex justify-center mb-3">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-bold" style={{ background: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>
                {index + 1} / {queue.length} · subject hidden
              </span>
            </div>
            <div className="w-full p-6 rounded-3xl text-center" style={{ background: 'var(--color-surface-container)', minHeight: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>
                {current.concept.chapter}
              </p>
              <p className="text-[22px] font-black leading-tight" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui', letterSpacing: '-0.01em' }}>
                {current.concept.name}
              </p>
              {!isFlipped && (
                <motion.button initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  onClick={() => setIsFlipped(true)}
                  className="mt-2 px-5 py-2 rounded-xl text-[13px] font-bold"
                  style={{ background: '#059669', color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
                  I recall this
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Rating buttons */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.25 }}
            className="px-4 pb-8 grid grid-cols-4 gap-2">
            {[
              { id: 'again' as const, label: 'Again', pts: 0,   color: '#DC2626', bg: '#FEF2F2', icon: 'close' },
              { id: 'hard'  as const, label: 'Hard',  pts: 30,  color: '#D97706', bg: '#FFFBEB', icon: 'sentiment_dissatisfied' },
              { id: 'good'  as const, label: 'Good',  pts: 80,  color: '#059669', bg: '#ECFDF5', icon: 'check' },
              { id: 'easy'  as const, label: 'Easy',  pts: 120, color: '#6750A4', bg: '#F5F3FF', icon: 'bolt' },
            ].map(r => (
              <motion.button key={r.id} whileTap={{ scale: 0.92 }} onClick={() => handleRate(r.id)}
                className="flex flex-col items-center py-3 rounded-2xl gap-1" style={{ background: r.bg }}>
                <span className="material-symbols-rounded" style={{ fontSize: 22, color: r.color, fontVariationSettings: "'FILL' 1" }}>{r.icon}</span>
                <span className="text-[12px] font-bold" style={{ color: r.color, fontFamily: 'Plus Jakarta Sans, system-ui' }}>{r.label}</span>
                <span className="text-[10px]" style={{ color: r.color, opacity: 0.7, fontFamily: 'Inter, system-ui' }}>+{r.pts}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!isFlipped && (
        <div className="px-4 pb-8">
          <button onClick={() => handleRate('again')} className="w-full py-3 rounded-2xl text-[13px] font-medium"
            style={{ background: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>
            Don't know — skip
          </button>
        </div>
      )}
    </div>
  )
}
