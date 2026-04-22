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

const SECONDS_PER_CARD = 45
const GHOST_PTS_PER_SECOND = 2  // ghost scores 120/min — a tough baseline

interface Props {
  onBack: () => void
}

export function PressureVault({ onBack }: Props) {
  const { concepts, onUpdateConcept, dbReady } = useConceptStore(CONFIG.concepts)

  const [phase, setPhase]     = useState<'ready' | 'playing' | 'done'>('ready')
  const [index, setIndex]     = useState(0)
  const [cardTime, setCardTime] = useState(SECONDS_PER_CARD)
  const [playerScore, setPlayerScore] = useState(0)
  const [ghostScore, setGhostScore]   = useState(0)
  const [isFlipped, setIsFlipped]     = useState(false)
  const [showRedFlash, setShowRedFlash] = useState(false)
  const [totalRated, setTotalRated]   = useState(0)
  const [goodCount, setGoodCount]     = useState(0)
  const [againCount, setAgainCount]   = useState(0)
  const [stressScore, setStressScore] = useState(0)  // accuracy under pressure
  const cardTimerRef  = useRef<ReturnType<typeof setInterval> | null>(null)
  const ghostTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const sessionStartRef = useRef<number>(0)

  const queue: SessionItem[] = useMemo(() => {
    if (!dbReady) return []
    return buildSession({ ...CONFIG, concepts }, 30, new Date().getHours())
  }, [dbReady]) // eslint-disable-line react-hooks/exhaustive-deps

  const current = queue[index]

  const stopTimers = useCallback(() => {
    if (cardTimerRef.current)  { clearInterval(cardTimerRef.current);  cardTimerRef.current  = null }
    if (ghostTimerRef.current) { clearInterval(ghostTimerRef.current); ghostTimerRef.current = null }
  }, [])

  const endGame = useCallback((pScore: number, gScore: number, rated: number, good: number) => {
    stopTimers()
    const stress = rated > 0 ? Math.round((good / rated) * 100) : 0
    setStressScore(stress)
    setPhase('done')
  }, [stopTimers])

  useEffect(() => stopTimers, [stopTimers])

  const startCardTimer = useCallback((onExpire: () => void) => {
    if (cardTimerRef.current) clearInterval(cardTimerRef.current)
    setCardTime(SECONDS_PER_CARD)
    cardTimerRef.current = setInterval(() => {
      setCardTime(t => {
        if (t <= 1) {
          clearInterval(cardTimerRef.current!)
          cardTimerRef.current = null
          onExpire()
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [])

  const handleStart = () => {
    sessionStartRef.current = Date.now()
    setPhase('playing')
    setIndex(0); setPlayerScore(0); setGhostScore(0)
    setTotalRated(0); setGoodCount(0); setAgainCount(0)
    setIsFlipped(false); setShowRedFlash(false)

    // Ghost ticks up every second
    ghostTimerRef.current = setInterval(() => {
      setGhostScore(g => g + GHOST_PTS_PER_SECOND)
    }, 1000)

    startCardTimer(() => {
      // Card expired without rating = forced "Again"
      setShowRedFlash(true)
      setTimeout(() => setShowRedFlash(false), 600)
      setAgainCount(a => a + 1)
      setTotalRated(t => t + 1)
      setIndex(i => {
        if (i + 1 >= queue.length) {
          setPlayerScore(ps => { setGhostScore(gs => { endGame(ps, gs, 1, 0); return gs }); return ps })
        }
        return i + 1
      })
      setIsFlipped(false)
    })
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

    // Scoring — time remaining = under-pressure bonus
    const timeBonus = isCorrect ? cardTime * 3 : 0
    const basePoints = ratingId === 'easy' ? 150 : ratingId === 'good' ? 100 : ratingId === 'hard' ? 50 : 0
    const pts = basePoints + timeBonus

    const newTotalRated = totalRated + 1
    const newGoodCount  = goodCount + (isCorrect ? 1 : 0)
    const newAgainCount = againCount + (isAgain ? 1 : 0)
    const newPlayerScore = playerScore + pts

    setPlayerScore(newPlayerScore)
    setTotalRated(newTotalRated)
    if (isCorrect) setGoodCount(newGoodCount)
    if (isAgain)   setAgainCount(newAgainCount)

    // Red flash on again
    if (isAgain) {
      setShowRedFlash(true)
      setTimeout(() => setShowRedFlash(false), 500)
    }

    const nextIndex = index + 1
    if (nextIndex >= queue.length) {
      stopTimers()
      const stress = Math.round((newGoodCount / newTotalRated) * 100)
      setStressScore(stress)
      setPhase('done')
    } else {
      setIndex(nextIndex)
      setIsFlipped(false)
      startCardTimer(() => {
        setShowRedFlash(true)
        setTimeout(() => setShowRedFlash(false), 600)
        setAgainCount(a => a + 1)
        setTotalRated(t => t + 1)
        setIndex(i => i + 1)
        setIsFlipped(false)
      })
    }
  }

  const cardTimerPct  = (cardTime / SECONDS_PER_CARD) * 100
  const cardTimerColor = cardTime > 20 ? '#6750A4' : cardTime > 10 ? '#D97706' : '#DC2626'
  const isBeatingGhost = playerScore >= ghostScore

  // ── Ready ─────────────────────────────────────────────────────────────────
  if (phase === 'ready') {
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto" style={{ background: 'var(--color-background)' }}>
        <div className="flex items-center gap-3 px-4 pt-5 pb-3">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: 'var(--color-surface-container)' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--color-on-surface)' }}>arrow_back</span>
          </button>
          <h1 className="text-[18px] font-black" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Pressure Vault</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-7">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-24 h-24 rounded-3xl flex items-center justify-center" style={{ background: '#FEF2F2' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 52, color: '#DC2626', fontVariationSettings: "'FILL' 1" }}>lock</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-center">
            <p className="text-[26px] font-black leading-tight mb-2" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui', letterSpacing: '-0.02em' }}>Beat the Ghost</p>
            <p className="text-[14px] leading-relaxed" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>
              45 seconds per concept. A ghost competitor scores continuously — you must recall faster. Wrong answer = red flash + ghost pulls ahead.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="w-full space-y-2 p-4 rounded-2xl" style={{ background: 'var(--color-surface-container)' }}>
            {[
              { icon: 'timer', text: '45s countdown per concept', color: '#DC2626' },
              { icon: 'person', text: 'Ghost scores +2 pts/sec (beat the baseline)', color: '#6750A4' },
              { icon: 'warning', text: 'Timeout = forced "Again" + red flash', color: '#D97706' },
              { icon: 'memory', text: 'FSRS updates live — real consequences', color: '#059669' },
            ].map(r => (
              <div key={r.text} className="flex items-center gap-3">
                <span className="material-symbols-rounded" style={{ fontSize: 16, color: r.color, fontVariationSettings: "'FILL' 1" }}>{r.icon}</span>
                <p className="text-[12px]" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>{r.text}</p>
              </div>
            ))}
          </motion.div>
          <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={handleStart} disabled={!dbReady || queue.length === 0}
            className="w-full py-4 rounded-2xl font-black text-[17px] disabled:opacity-40"
            style={{ background: '#DC2626', color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
            {!dbReady ? 'Loading…' : queue.length === 0 ? 'No concepts' : 'Enter the Vault'}
          </motion.button>
        </div>
      </div>
    )
  }

  // ── Done ──────────────────────────────────────────────────────────────────
  if (phase === 'done') {
    const beatGhost = playerScore > ghostScore
    const stressGrade = stressScore >= 75 ? { label: 'Pressure Proof', color: '#059669', bg: '#ECFDF5', icon: 'workspace_premium' }
      : stressScore >= 55 ? { label: 'Solid Under Pressure', color: '#6750A4', bg: '#F5F3FF', icon: 'thumb_up' }
      : { label: 'Crumbles Under Pressure', color: '#DC2626', bg: '#FEF2F2', icon: 'fitness_center' }
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto" style={{ background: 'var(--color-background)' }}>
        <div className="flex items-center gap-3 px-4 pt-5 pb-3">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: 'var(--color-surface-container)' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--color-on-surface)' }}>arrow_back</span>
          </button>
          <h1 className="text-[18px] font-black" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Vault Cleared</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-28 h-28 rounded-3xl flex items-center justify-center" style={{ background: stressGrade.bg }}>
            <span className="material-symbols-rounded" style={{ fontSize: 60, color: stressGrade.color, fontVariationSettings: "'FILL' 1" }}>{stressGrade.icon}</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center">
            <p className="text-[14px] font-bold" style={{ color: stressGrade.color, fontFamily: 'Inter, system-ui' }}>{stressGrade.label}</p>
          </motion.div>

          {/* You vs Ghost */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="w-full p-4 rounded-2xl" style={{ background: 'var(--color-surface-container)' }}>
            <p className="text-[12px] font-bold mb-3" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Head to Head</p>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-[11px] mb-1" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>You</p>
                <p className="text-[24px] font-black" style={{ color: beatGhost ? '#059669' : '#DC2626', fontFamily: 'Plus Jakarta Sans, system-ui' }}>{playerScore.toLocaleString()}</p>
              </div>
              <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--color-on-surface-variant)' }}>compare</span>
              <div className="flex-1 text-right">
                <p className="text-[11px] mb-1" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>Ghost</p>
                <p className="text-[24px] font-black" style={{ color: beatGhost ? '#DC2626' : '#059669', fontFamily: 'Plus Jakarta Sans, system-ui' }}>{ghostScore.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-[11px] mt-2 text-center font-bold" style={{ color: beatGhost ? '#059669' : '#DC2626', fontFamily: 'Inter, system-ui' }}>
              {beatGhost ? 'You beat the ghost!' : `Ghost won by ${ghostScore - playerScore} pts`}
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="w-full grid grid-cols-3 gap-2">
            {[
              { label: 'Accuracy', value: `${stressScore}%`, icon: 'target', color: stressGrade.color },
              { label: 'Reviewed', value: totalRated.toString(), icon: 'done_all', color: '#6750A4' },
              { label: 'Needed Work', value: againCount.toString(), icon: 'replay', color: '#DC2626' },
            ].map(s => (
              <div key={s.label} className="flex flex-col items-center p-3 rounded-2xl gap-1" style={{ background: 'var(--color-surface-container)' }}>
                <span className="material-symbols-rounded" style={{ fontSize: 20, color: s.color, fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                <p className="text-[16px] font-black" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>{s.value}</p>
                <p className="text-[10px]" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>{s.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="w-full flex gap-3">
            <button onClick={onBack} className="flex-1 py-3.5 rounded-2xl font-bold text-[15px]"
              style={{ background: 'var(--color-surface-container)', color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Done</button>
            <button onClick={handleStart} className="flex-1 py-3.5 rounded-2xl font-bold text-[15px]"
              style={{ background: '#DC2626', color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Try Again</button>
          </motion.div>
        </div>
      </div>
    )
  }

  // ── Playing ───────────────────────────────────────────────────────────────
  if (!current) return null

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto" style={{ background: 'var(--color-background)', position: 'relative' }}>
      {/* Red flash overlay */}
      <AnimatePresence>
        {showRedFlash && (
          <motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
            className="absolute inset-0 z-50 pointer-events-none" style={{ background: '#DC2626' }} />
        )}
      </AnimatePresence>

      {/* Card timer bar */}
      <div className="h-2 w-full" style={{ background: 'var(--color-surface-container)' }}>
        <motion.div className="h-full" style={{ background: cardTimerColor, width: `${cardTimerPct}%` }} transition={{ duration: 0.5 }} />
      </div>

      {/* Header: You vs Ghost */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => { stopTimers(); setPhase('done') }} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: 'var(--color-surface-container)' }}>
          <span className="material-symbols-rounded" style={{ fontSize: 18, color: 'var(--color-on-surface)' }}>close</span>
        </button>

        {/* Score comparison */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px]" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>You</p>
            <p className="text-[16px] font-black tabular-nums" style={{ color: isBeatingGhost ? '#059669' : '#DC2626', fontFamily: 'Plus Jakarta Sans, system-ui' }}>{playerScore}</p>
          </div>
          <span className="material-symbols-rounded" style={{ fontSize: 16, color: 'var(--color-on-surface-variant)' }}>compare</span>
          <div>
            <p className="text-[10px]" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>Ghost</p>
            <p className="text-[16px] font-black tabular-nums" style={{ color: isBeatingGhost ? '#DC2626' : '#059669', fontFamily: 'Plus Jakarta Sans, system-ui' }}>{ghostScore}</p>
          </div>
        </div>

        {/* Card countdown */}
        <div className="flex items-center gap-1">
          <span className="text-[20px] font-black tabular-nums" style={{ color: cardTimerColor, fontFamily: 'Plus Jakarta Sans, system-ui' }}>{cardTime}</span>
          <span className="text-[11px]" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>s</span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex justify-center pb-1">
        <span className="text-[11px]" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>{index + 1} / {queue.length}</span>
      </div>

      {/* Concept card */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.div key={index} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }} className="w-full">
            <div className="w-full p-6 rounded-3xl text-center" style={{ background: 'var(--color-surface-container)', minHeight: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>
                {current.concept.subject} · {current.concept.chapter}
              </p>
              <p className="text-[22px] font-black leading-tight" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui', letterSpacing: '-0.01em' }}>
                {current.concept.name}
              </p>
              {!isFlipped && (
                <motion.button initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  onClick={() => setIsFlipped(true)}
                  className="mt-2 px-5 py-2 rounded-xl text-[13px] font-bold"
                  style={{ background: '#DC2626', color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
                  I recall this
                </motion.button>
              )}
            </div>
            <div className="flex justify-center mt-2">
              <span className="text-[11px]" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>
                Stage: <strong>{current.concept.stage}</strong>
              </span>
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
              { id: 'hard'  as const, label: 'Hard',  pts: 50,  color: '#D97706', bg: '#FFFBEB', icon: 'sentiment_dissatisfied' },
              { id: 'good'  as const, label: 'Good',  pts: 100, color: '#059669', bg: '#ECFDF5', icon: 'check' },
              { id: 'easy'  as const, label: 'Easy',  pts: 150, color: '#6750A4', bg: '#F5F3FF', icon: 'bolt' },
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
            Don't know — skip (counts as Again)
          </button>
        </div>
      )}
    </div>
  )
}
