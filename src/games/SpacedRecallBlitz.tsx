import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useConceptStore } from '../db/useConceptStore'
import { CONFIG } from '../lib/config'
import { buildSession } from '../core/session-builder'
import {
  advanceStage, regressStage,
  updateStabilityOnSuccess, updateStabilityOnFailure,
  updateDifficulty, getNextReviewDays, calculateR,
} from '../core/fsrs'
import type { SessionItem } from '../core/types'

const ROUND_SECONDS = 60

const RATINGS = [
  { id: 'again', label: 'Again',   points: 0,  combo: false, color: '#DC2626', bg: '#FEF2F2', icon: 'close' },
  { id: 'hard',  label: 'Hard',    points: 30, combo: false, color: '#D97706', bg: '#FFFBEB', icon: 'sentiment_dissatisfied' },
  { id: 'good',  label: 'Good',    points: 80, combo: true,  color: '#059669', bg: '#ECFDF5', icon: 'check' },
  { id: 'easy',  label: 'Easy',    points: 120, combo: true, color: '#6750A4', bg: '#F5F3FF', icon: 'bolt' },
] as const

type RatingId = typeof RATINGS[number]['id']

interface Props {
  onBack: () => void
}

export function SpacedRecallBlitz({ onBack }: Props) {
  const { concepts, onUpdateConcept, dbReady } = useConceptStore(CONFIG.concepts)

  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready')
  const [queueIndex, setQueueIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS)
  const [totalRated, setTotalRated] = useState(0)
  const [goodCount, setGoodCount] = useState(0)
  const [againCount, setAgainCount] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const queue: SessionItem[] = useMemo(() => {
    if (!dbReady) return []
    return buildSession({ ...CONFIG, concepts }, 50, new Date().getHours())
  }, [dbReady]) // eslint-disable-line react-hooks/exhaustive-deps

  const currentItem = queue[queueIndex]

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const endRound = useCallback(() => {
    stopTimer()
    setPhase('done')
  }, [stopTimer])

  useEffect(() => {
    return stopTimer
  }, [stopTimer])

  const handleStart = () => {
    setPhase('playing')
    setTimeLeft(ROUND_SECONDS)
    setScore(0)
    setCombo(0)
    setMaxCombo(0)
    setQueueIndex(0)
    setTotalRated(0)
    setGoodCount(0)
    setAgainCount(0)
    setIsFlipped(false)

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          endRound()
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  const handleRate = (ratingId: RatingId) => {
    if (!currentItem) return
    const rating = RATINGS.find(r => r.id === ratingId)!
    const { concept } = currentItem
    const R = calculateR(concept.stability, concept.lastTested)

    const isCorrect = ratingId === 'good' || ratingId === 'easy'
    const isAgain   = ratingId === 'again'

    // FSRS update
    const newStage      = isCorrect ? advanceStage(concept.stage) : isAgain ? regressStage(concept.stage) : concept.stage
    const newStability  = isCorrect
      ? updateStabilityOnSuccess(concept.stability, R, null)
      : isAgain
        ? updateStabilityOnFailure(concept.stability)
        : Math.max(1, Math.round(concept.stability * 0.9 * 10) / 10)
    const newDifficulty = updateDifficulty(concept.difficulty, isCorrect)

    onUpdateConcept(concept.id, {
      stage:       newStage,
      stability:   newStability,
      difficulty:  newDifficulty,
      lastTested:  0,
      nextReview:  getNextReviewDays(newStability),
      lastStudiedAt: Date.now(),
    })

    // Scoring
    const newCombo = rating.combo ? combo + 1 : 0
    const multiplier = rating.combo ? 1 + Math.min(newCombo - 1, 9) * 0.1 : 1
    const points = Math.round(rating.points * multiplier)

    setCombo(newCombo)
    setMaxCombo(m => Math.max(m, newCombo))
    setScore(s => s + points)
    setTotalRated(t => t + 1)
    if (isCorrect) setGoodCount(g => g + 1)
    if (isAgain)   setAgainCount(a => a + 1)

    // Advance or end
    if (queueIndex + 1 >= queue.length) {
      endRound()
    } else {
      setQueueIndex(q => q + 1)
      setIsFlipped(false)
    }
  }

  const accuracy = totalRated > 0 ? Math.round((goodCount / totalRated) * 100) : 0
  const timerPct = (timeLeft / ROUND_SECONDS) * 100
  const timerColor = timeLeft > 20 ? '#059669' : timeLeft > 10 ? '#D97706' : '#DC2626'

  // ── Ready ──────────────────────────────────────────────────────────────────
  if (phase === 'ready') {
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto" style={{ background: 'var(--color-background)' }}>
        <div className="flex items-center gap-3 px-4 pt-5 pb-3">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl"
            style={{ background: 'var(--color-surface-container)' }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--color-on-surface)' }}>arrow_back</span>
          </button>
          <h1 className="text-[18px] font-black" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
            Recall Blitz
          </h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-24 h-24 rounded-3xl flex items-center justify-center"
            style={{ background: 'var(--color-primary-container)' }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 52, color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>
              bolt
            </span>
          </motion.div>

          {/* Title & description */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="text-center"
          >
            <p className="text-[28px] font-black leading-tight mb-2" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui', letterSpacing: '-0.02em' }}>
              60-Second Sprint
            </p>
            <p className="text-[14px] leading-relaxed" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>
              Concepts flash one by one. Tap to reveal — then rate your recall. Chain Good/Easy answers to multiply your score.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="flex gap-4 w-full"
          >
            {[
              { label: 'Queue', value: dbReady ? queue.length.toString() : '—', icon: 'stack' },
              { label: 'Timer', value: '60s', icon: 'timer' },
              { label: 'FSRS Live', value: 'On', icon: 'memory' },
            ].map(s => (
              <div
                key={s.label}
                className="flex-1 flex flex-col items-center p-3 rounded-2xl gap-1"
                style={{ background: 'var(--color-surface-container)' }}
              >
                <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>
                  {s.icon}
                </span>
                <p className="text-[16px] font-black" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>{s.value}</p>
                <p className="text-[10px]" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Rating guide */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="w-full grid grid-cols-2 gap-2"
          >
            {RATINGS.map(r => (
              <div key={r.id} className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: r.bg }}>
                <span className="material-symbols-rounded" style={{ fontSize: 16, color: r.color, fontVariationSettings: "'FILL' 1" }}>{r.icon}</span>
                <div>
                  <p className="text-[12px] font-bold" style={{ color: r.color, fontFamily: 'Plus Jakarta Sans, system-ui' }}>{r.label}</p>
                  <p className="text-[10px]" style={{ color: r.color, opacity: 0.7, fontFamily: 'Inter, system-ui' }}>+{r.points} pts{r.combo ? ' × combo' : ''}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Start button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={handleStart}
            disabled={!dbReady || queue.length === 0}
            className="w-full py-4 rounded-2xl font-black text-[17px] disabled:opacity-40"
            style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)', fontFamily: 'Plus Jakarta Sans, system-ui' }}
          >
            {!dbReady ? 'Loading…' : queue.length === 0 ? 'No concepts due' : 'Start Round'}
          </motion.button>
        </div>
      </div>
    )
  }

  // ── Done ───────────────────────────────────────────────────────────────────
  if (phase === 'done') {
    const grade = accuracy >= 80 ? { label: 'Excellent', color: '#059669', bg: '#ECFDF5', icon: 'workspace_premium' }
      : accuracy >= 60 ? { label: 'Good', color: '#6750A4', bg: '#F5F3FF', icon: 'thumb_up' }
      : accuracy >= 40 ? { label: 'Keep Going', color: '#D97706', bg: '#FFFBEB', icon: 'trending_up' }
      : { label: 'Keep Practicing', color: '#DC2626', bg: '#FEF2F2', icon: 'fitness_center' }

    return (
      <div className="flex flex-col h-screen max-w-md mx-auto" style={{ background: 'var(--color-background)' }}>
        <div className="flex items-center gap-3 px-4 pt-5 pb-3">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: 'var(--color-surface-container)' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--color-on-surface)' }}>arrow_back</span>
          </button>
          <h1 className="text-[18px] font-black" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Round Complete</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
          {/* Grade badge */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-28 h-28 rounded-3xl flex items-center justify-center"
            style={{ background: grade.bg }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 60, color: grade.color, fontVariationSettings: "'FILL' 1" }}>
              {grade.icon}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-center"
          >
            <p className="text-[32px] font-black" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui', letterSpacing: '-0.02em' }}>
              {score.toLocaleString()}
            </p>
            <p className="text-[14px] font-bold mt-1" style={{ color: grade.color, fontFamily: 'Inter, system-ui' }}>{grade.label}</p>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="w-full grid grid-cols-2 gap-3"
          >
            {[
              { label: 'Accuracy', value: `${accuracy}%`, icon: 'target', color: '#6750A4' },
              { label: 'Best Combo', value: `×${maxCombo}`, icon: 'local_fire_department', color: '#D97706' },
              { label: 'Reviewed', value: totalRated.toString(), icon: 'done_all', color: '#059669' },
              { label: 'Needs Work', value: againCount.toString(), icon: 'replay', color: '#DC2626' },
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full flex gap-3"
          >
            <button
              onClick={onBack}
              className="flex-1 py-3.5 rounded-2xl font-bold text-[15px]"
              style={{ background: 'var(--color-surface-container)', color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}
            >
              Done
            </button>
            <button
              onClick={handleStart}
              className="flex-1 py-3.5 rounded-2xl font-bold text-[15px]"
              style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)', fontFamily: 'Plus Jakarta Sans, system-ui' }}
            >
              Play Again
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  // ── Playing ────────────────────────────────────────────────────────────────
  if (!currentItem) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>Loading…</p>
      </div>
    )
  }

  const { concept, queue: conceptQueue } = currentItem
  const qLabel = { review: 'DUE', new: 'NEW', strengthen: 'STRENGTHEN', challenge: 'CHALLENGE' }[conceptQueue]

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto" style={{ background: 'var(--color-background)' }}>

      {/* Timer bar */}
      <div className="h-1.5 w-full" style={{ background: 'var(--color-surface-container)' }}>
        <motion.div
          className="h-full"
          style={{ background: timerColor, width: `${timerPct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={endRound}
          className="w-9 h-9 flex items-center justify-center rounded-xl"
          style={{ background: 'var(--color-surface-container)' }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 18, color: 'var(--color-on-surface)' }}>close</span>
        </button>

        {/* Timer */}
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-rounded" style={{ fontSize: 16, color: timerColor, fontVariationSettings: "'FILL' 1" }}>timer</span>
          <span className="text-[16px] font-black tabular-nums" style={{ color: timerColor, fontFamily: 'Plus Jakarta Sans, system-ui' }}>
            {timeLeft}s
          </span>
        </div>

        {/* Score + Combo */}
        <div className="flex items-center gap-2">
          {combo >= 2 && (
            <AnimatePresence>
              <motion.div
                key={combo}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-0.5 px-2 py-0.5 rounded-full"
                style={{ background: '#FFFBEB' }}
              >
                <span className="material-symbols-rounded" style={{ fontSize: 12, color: '#D97706', fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                <span className="text-[12px] font-black" style={{ color: '#D97706', fontFamily: 'Plus Jakarta Sans, system-ui' }}>×{combo}</span>
              </motion.div>
            </AnimatePresence>
          )}
          <span className="text-[18px] font-black tabular-nums" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
            {score.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-1 px-4 pb-2">
        <span className="text-[11px]" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>
          {queueIndex + 1} / {queue.length}
        </span>
      </div>

      {/* Concept card */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={queueIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {/* Queue badge */}
            <div className="flex items-center justify-center mb-4">
              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide"
                style={{
                  background: conceptQueue === 'review' ? '#FEF2F2' : conceptQueue === 'new' ? '#F5F3FF' : conceptQueue === 'challenge' ? '#F3EDFF' : '#ECFEFF',
                  color: conceptQueue === 'review' ? '#B91C1C' : conceptQueue === 'new' ? '#6750A4' : conceptQueue === 'challenge' ? '#7C3AED' : '#0E7490',
                  fontFamily: 'Inter, system-ui',
                }}
              >
                {qLabel}
              </span>
            </div>

            {/* Front card: concept name */}
            <div
              className="w-full rounded-3xl p-6 text-center"
              style={{ background: 'var(--color-surface-container)', minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>
                {concept.subject} · {concept.chapter}
              </p>
              <p className="text-[22px] font-black leading-tight" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui', letterSpacing: '-0.01em' }}>
                {concept.name}
              </p>

              {!isFlipped && (
                <motion.button
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  onClick={() => setIsFlipped(true)}
                  className="mt-3 px-5 py-2 rounded-xl text-[13px] font-bold"
                  style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)', fontFamily: 'Plus Jakarta Sans, system-ui' }}
                >
                  I recall this
                </motion.button>
              )}
            </div>

            {/* Stage indicator */}
            <div className="flex justify-center mt-3">
              <span className="text-[11px]" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>
                Stage: <strong>{concept.stage}</strong> · S={concept.stability.toFixed(1)}d
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Rating buttons */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="px-4 pb-8 grid grid-cols-4 gap-2"
          >
            {RATINGS.map(r => (
              <motion.button
                key={r.id}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleRate(r.id)}
                className="flex flex-col items-center py-3 rounded-2xl gap-1"
                style={{ background: r.bg }}
              >
                <span className="material-symbols-rounded" style={{ fontSize: 22, color: r.color, fontVariationSettings: "'FILL' 1" }}>{r.icon}</span>
                <span className="text-[12px] font-bold" style={{ color: r.color, fontFamily: 'Plus Jakarta Sans, system-ui' }}>{r.label}</span>
                <span className="text-[10px]" style={{ color: r.color, opacity: 0.7, fontFamily: 'Inter, system-ui' }}>+{r.points}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip prompt when not yet flipped */}
      {!isFlipped && (
        <div className="px-4 pb-8">
          <button
            onClick={() => handleRate('again')}
            className="w-full py-3 rounded-2xl text-[13px] font-medium"
            style={{ background: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}
          >
            Don't know — skip
          </button>
        </div>
      )}
    </div>
  )
}
