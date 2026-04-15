import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { CognitiveItem } from './CognitiveItem'
import { GameWinScreen } from './GameWinScreen'
import { RetentionConfig, GameResult } from '../types'

interface Props {
  config: RetentionConfig
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TOTAL_ROUNDS = 5

/** One color per pool slot (pool max = 12). */
const PALETTE = [
  { bg: '#60A5FA', shadow: '#2563EB' },
  { bg: '#4ADE80', shadow: '#16A34A' },
  { bg: '#FB923C', shadow: '#EA580C' },
  { bg: '#A78BFA', shadow: '#7C3AED' },
  { bg: '#F472B6', shadow: '#DB2777' },
  { bg: '#2DD4BF', shadow: '#0D9488' },
  { bg: '#FACC15', shadow: '#CA8A04' },
  { bg: '#F87171', shadow: '#DC2626' },
  { bg: '#34D399', shadow: '#059669' },
  { bg: '#818CF8', shadow: '#4338CA' },
  { bg: '#FCA5A5', shadow: '#EF4444' },
  { bg: '#86EFAC', shadow: '#22C55E' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

interface PoolItem { id: string; label: string }
type Phase = 'show' | 'delay' | 'recall' | 'result'

/** Show duration decreases with level: 4000ms → 2000ms */
function showMs(level: number)   { return Math.max(2000, 4000 - (level - 1) * 200) }
/** Delay duration increases with level: 1000ms → 5000ms */
function delayMs(level: number)  { return Math.min(1000 + (level - 1) * 800, 5000) }
/** Items shown per round: round 1 → 3, round 2 → 4, …, cap 8 */
function countFor(round: number) { return Math.min(2 + round, 8) }

function pickRandom(pool: PoolItem[], count: number): PoolItem[] {
  return [...pool].sort(() => Math.random() - 0.5).slice(0, count)
}

function palettFor(pool: PoolItem[], id: string) {
  const idx = pool.findIndex(p => p.id === id)
  return PALETTE[idx % PALETTE.length]
}

// ─── Root component ───────────────────────────────────────────────────────────

export function RetentionGame({ config }: Props) {
  const { pool, onComplete } = config

  const [round,        setRound]        = useState(1)
  const [phase,        setPhase]        = useState<Phase>('show')
  const [items,        setItems]        = useState<PoolItem[]>(() => pickRandom(pool, countFor(1)))
  const [selectedIds,  setSelectedIds]  = useState<string[]>([])
  const [roundScores,  setRoundScores]  = useState<number[]>([])
  const [totalGuesses, setTotalGuesses] = useState(0)
  const [finalResult,  setFinalResult]  = useState<GameResult | null>(null)

  // ── Phase handlers ─────────────────────────────────────────────────────────

  function handleRecallComplete(selected: string[], guesses: number) {
    const correct = selected.filter(id => items.some(i => i.id === id)).length
    const score   = Math.round((correct / items.length) * 100)
    setRoundScores(prev => [...prev, score])
    setTotalGuesses(prev => prev + guesses)
    setSelectedIds(selected)
    setPhase('result')
  }

  function handleResultComplete() {
    // roundScores is fresh here because ResultPhase uses a ref for this callback
    const allScores = roundScores
    if (round >= TOTAL_ROUNDS) {
      const avg = Math.round(allScores.reduce((a, b) => a + b, 0) / Math.max(allScores.length, 1))
      const result: GameResult = {
        gameType:  'retention',
        score:     avg,
        guesses:   totalGuesses,
        hintsUsed: 0,
        timeMs:    0,
      }
      setFinalResult(result)
      onComplete?.(result)
    } else {
      const next = round + 1
      setRound(next)
      setItems(pickRandom(pool, countFor(next)))
      setSelectedIds([])
      setPhase('show')
    }
  }

  // ── Win screen ─────────────────────────────────────────────────────────────

  if (finalResult) {
    return (
      <GameWinScreen
        result={finalResult}
        onPlayAgain={() => {
          setRound(1)
          setItems(pickRandom(pool, countFor(1)))
          setSelectedIds([])
          setRoundScores([])
          setTotalGuesses(0)
          setFinalResult(null)
          setPhase('show')
        }}
      />
    )
  }

  // ── HUD + Phase render ─────────────────────────────────────────────────────

  const phaseLabel: Record<Phase, string> = {
    show:   'MEMORISE',
    delay:  'WAIT...',
    recall: 'RECALL',
    result: 'RESULT',
  }

  const avgScore = roundScores.length > 0
    ? Math.round(roundScores.reduce((a, b) => a + b, 0) / roundScores.length)
    : null

  return (
    <div className="flex flex-col min-h-[600px] bg-[#F7F6F3]" style={{ userSelect: 'none' }}>
      {/* HUD */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <p className="text-[13px] font-semibold text-[#A8A29E]" style={{ fontFamily: 'Inter, system-ui' }}>
          Round {round}/{TOTAL_ROUNDS}
        </p>
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-colors duration-300"
              style={{ background: i < round ? '#2DD4BF' : '#E8E5DF' }}
            />
          ))}
        </div>
        <p className="text-[13px] font-semibold text-[#A8A29E]" style={{ fontFamily: 'Inter, system-ui' }}>
          {avgScore !== null ? `${avgScore}%` : '—'}
        </p>
      </div>

      {/* Phase label */}
      <p
        className="text-center text-[11px] font-bold tracking-[0.2em] text-[#A8A29E] mb-4"
        style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}
      >
        {phaseLabel[phase]}
      </p>

      {/* Phase content */}
      {phase === 'show' && (
        <ShowPhase
          items={items}
          pool={pool}
          duration={showMs(round)}
          onComplete={() => setPhase('delay')}
        />
      )}
      {phase === 'delay' && (
        <DelayPhase
          duration={delayMs(round)}
          onComplete={() => setPhase('recall')}
        />
      )}
      {phase === 'recall' && (
        <RecallPhase
          pool={pool}
          targetCount={items.length}
          onComplete={handleRecallComplete}
        />
      )}
      {phase === 'result' && (
        <ResultPhase
          pool={pool}
          items={items}
          selectedIds={selectedIds}
          onComplete={handleResultComplete}
        />
      )}
    </div>
  )
}

// ─── ShowPhase ────────────────────────────────────────────────────────────────

interface ShowPhaseProps {
  items:      PoolItem[]
  pool:       PoolItem[]
  duration:   number
  onComplete: () => void
}

function ShowPhase({ items, pool, duration, onComplete }: ShowPhaseProps) {
  useEffect(() => {
    const t = setTimeout(onComplete, duration)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col flex-1 px-5 gap-5">
      {/* Countdown bar */}
      <div className="h-1 bg-[#E8E5DF] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: '#2DD4BF' }}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      </div>
      {/* Items */}
      <div className="flex flex-wrap gap-3 justify-center">
        {items.map(item => {
          const { bg, shadow } = palettFor(pool, item.id)
          return (
            <CognitiveItem key={item.id} id={item.id} color={bg} shadowColor={shadow} disabled>
              <span style={{ fontFamily: 'Plus Jakarta Sans, system-ui', fontSize: 15 }}>
                {item.label}
              </span>
            </CognitiveItem>
          )
        })}
      </div>
    </div>
  )
}

// ─── DelayPhase ───────────────────────────────────────────────────────────────

function DelayPhase({ duration, onComplete }: { duration: number; onComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(onComplete, duration)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-1 items-center justify-center gap-4 min-h-[300px]">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-3 h-3 rounded-full"
          style={{ background: '#C8C4BE' }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// ─── RecallPhase ──────────────────────────────────────────────────────────────

interface RecallPhaseProps {
  pool:        PoolItem[]
  targetCount: number
  onComplete:  (selected: string[], guesses: number) => void
}

function RecallPhase({ pool, targetCount, onComplete }: RecallPhaseProps) {
  const [selected, setSelected] = useState<string[]>([])
  const [guesses,  setGuesses]  = useState(0)

  function handleTap(id: string) {
    Haptics.impact({ style: ImpactStyle.Light }).catch(() => {})

    // Deselect if already selected
    if (selected.includes(id)) {
      setSelected(s => s.filter(x => x !== id))
      return
    }

    const nextSelected = [...selected, id]
    const nextGuesses  = guesses + 1

    if (nextSelected.length === targetCount) {
      onComplete(nextSelected, nextGuesses)
    } else {
      setSelected(nextSelected)
      setGuesses(nextGuesses)
    }
  }

  const remaining = targetCount - selected.length

  return (
    <div className="flex flex-col flex-1 px-5 gap-4">
      <p
        className="text-center text-[13px] text-[#78716C]"
        style={{ fontFamily: 'Inter, system-ui' }}
      >
        Select <strong>{targetCount}</strong> items you saw ·{' '}
        <span style={{ color: remaining === 0 ? '#2DD4BF' : '#78716C' }}>
          {remaining} remaining
        </span>
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        {pool.map(item => {
          const isSelected = selected.includes(item.id)
          const { bg, shadow } = isSelected
            ? palettFor(pool, item.id)
            : { bg: '#D6D3D1', shadow: '#A8A29E' }
          return (
            <CognitiveItem
              key={item.id}
              id={item.id}
              color={bg}
              shadowColor={shadow}
              onClick={() => handleTap(item.id)}
            >
              <span style={{ fontFamily: 'Plus Jakarta Sans, system-ui', fontSize: 15 }}>
                {item.label}
              </span>
            </CognitiveItem>
          )
        })}
      </div>
    </div>
  )
}

// ─── ResultPhase ──────────────────────────────────────────────────────────────

interface ResultPhaseProps {
  pool:        PoolItem[]
  items:       PoolItem[]
  selectedIds: string[]
  onComplete:  () => void
}

function ResultPhase({ pool, items, selectedIds, onComplete }: ResultPhaseProps) {
  // Ref ensures the 2s timeout always calls the latest onComplete (which has
  // fresh roundScores/totalGuesses from the parent's latest render).
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => {})
    const t = setTimeout(() => onCompleteRef.current(), 2000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex flex-col flex-1 px-5 gap-4">
      <div className="flex flex-wrap gap-3 justify-center">
        {pool.map(item => {
          const wasShown    = items.some(i => i.id === item.id)
          const wasSelected = selectedIds.includes(item.id)

          let bg: string, shadow: string
          if      (wasShown && wasSelected)  { bg = '#4ADE80'; shadow = '#16A34A' } // correct
          else if (!wasShown && wasSelected) { bg = '#F87171'; shadow = '#DC2626' } // wrong
          else if (wasShown && !wasSelected) { bg = '#FCD34D'; shadow = '#CA8A04' } // missed
          else                              { bg = '#E7E5E4'; shadow = '#D6D3D1' } // neutral

          return (
            <CognitiveItem key={item.id} id={item.id} color={bg} shadowColor={shadow} disabled>
              <span style={{ fontFamily: 'Plus Jakarta Sans, system-ui', fontSize: 15 }}>
                {item.label}
              </span>
            </CognitiveItem>
          )
        })}
      </div>
    </div>
  )
}
