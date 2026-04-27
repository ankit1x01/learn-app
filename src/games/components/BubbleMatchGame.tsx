// src/games/components/BubbleMatchGame.tsx
// Bubble Match — drag concept chips onto the correct entity bubble
// Visual style: dark bg, pastel entity bubbles, outline concept chips

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core'
import type { CollisionDetection } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { motion, AnimatePresence } from 'motion/react'
import type { BubbleMatchConfig } from '../types'

// ─── Custom Math Geometry Config ────────────────────────────────────────────

// Circular radial magnetic capture zone via coordinate geometry
const coordinateGeometryCollision: CollisionDetection = ({
  collisionRect,
  droppableRects,
  droppableContainers,
}) => {
  if (!collisionRect) return []
  const activeCenterX = collisionRect.left + collisionRect.width / 2
  const activeCenterY = collisionRect.top + collisionRect.height / 2
  const collisions = []
  for (const droppable of droppableContainers) {
    const rect = droppableRects.get(droppable.id)
    if (!rect) continue
    const dx = activeCenterX - (rect.left + rect.width / 2)
    const dy = activeCenterY - (rect.top + rect.height / 2)
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance <= 120) {
      collisions.push({ id: droppable.id, data: { droppableContainer: droppable, value: distance } })
    }
  }
  return collisions.sort((a, b) => a.data.value - b.data.value)
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface Concept {
  id: string
  text: string
  belongsTo: string // entity id
}

interface MatchedFact {
  conceptId: string
  text: string
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildConcepts(config: BubbleMatchConfig): Concept[] {
  const all: Concept[] = []
  config.entities.forEach(e => {
    e.facts.forEach((fact, fi) => {
      all.push({ id: `${e.id}-f${fi}`, text: fact, belongsTo: e.id })
    })
  })
  return shuffle(all)
}

// ─── Draggable Concept Chip ────────────────────────────────────────────────

interface ConceptChipProps {
  concept: Concept
  isDragging?: boolean
  size?: 'normal' | 'overlay'
}

function ConceptChip({ concept, isDragging }: ConceptChipProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: concept.id })
  
  // Custom drag smoothing applied directly to container natively since DragOverlay is removed
  const style = {
    // This allows exact smooth follow behind the cursor
    transform: CSS.Transform.toString(transform),
    transition: transform ? 'transform 150ms ease-out' : undefined,
    zIndex: isDragging ? 999 : 1,
    opacity: isDragging ? 0.9 : 1,
  }
  const dim = isDragging ? 90 : 82

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="touch-none select-none">
      <motion.div
        // Use a spring for pop-in scaling to interact when dragging
        animate={{ scale: isDragging ? 1.05 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          width: dim,
          height: dim,
          borderRadius: '50%',
          border: isDragging ? '2px solid rgba(200,160,255,0.9)' : '2px solid rgba(180,130,240,0.75)',
          background: isDragging ? 'rgba(28,20,50,0.95)' : 'rgba(15,12,30,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isDragging ? 'grabbing' : 'grab',
          boxShadow: isDragging ? '0 8px 32px rgba(0,0,0,0.6)' : '0 2px 12px rgba(0,0,0,0.4)',
          padding: 10,
        }}
      >
        <span
          style={{
            color: isDragging ? '#f0e8ff' : '#e0d6f5',
            fontSize: isDragging ? 12 : 11,
            fontFamily: 'Inter, system-ui',
            fontWeight: 600,
            textAlign: 'center',
            lineHeight: 1.35,
          }}
        >
          {concept.text}
        </span>
      </motion.div>
    </div>
  )
}

// No separate overlay needed anymore

// ─── Droppable Entity Bubble ───────────────────────────────────────────────

interface EntityBubbleProps {
  entity: { id: string; name: string; color: string }
  matched: MatchedFact[]
  flashState: 'idle' | 'correct' | 'wrong'
}

function EntityBubble({ entity, matched, flashState }: EntityBubbleProps) {
  // Use a SINGLE useDroppable hook to safely bind both isOver state and the DOM ref
  const { setNodeRef, isOver } = useDroppable({ id: entity.id })

  const BASE = 92
  const RING_W = 28
  const baseScale = 1 + matched.length * 0.07
  const bubbleSize = BASE * baseScale

  const cx = bubbleSize / 2 + RING_W
  const r = bubbleSize / 2 + RING_W / 2
  const svgSize = cx * 2

  // SVG Path definition: clockwise circle starting at top center
  const pathData = `
    M ${cx}, ${cx - r}
    A ${r}, ${r} 0 1, 1 ${cx}, ${cx + r}
    A ${r}, ${r} 0 1, 1 ${cx}, ${cx - r}
  `

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'relative',
        width: svgSize,
        height: svgSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        animate={{
          scale: flashState === 'correct' ? 1.15 : isOver ? 1.08 : 1,
          boxShadow: flashState === 'correct'
            ? '0 0 40px rgba(0, 255, 200, 0.8)'
            : flashState === 'wrong'
            ? '0 0 40px rgba(239, 68, 68, 0.8)'
            : isOver
            ? `0 0 40px 12px ${entity.color}55`
            : `0 4px 24px rgba(0,0,0,0.5)`,
          x: flashState === 'wrong' ? [-10, 10, -8, 8, -5, 5, 0] : 0,
        }}
        transition={flashState === 'wrong' ? { duration: 0.4 } : { type: 'spring', stiffness: 200, damping: 15 }}
        style={{
          position: 'absolute',
          width: svgSize,
          height: svgSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* The Outer Orbital Track & Text Wrapping */}
        <svg
          width={svgSize}
          height={svgSize}
          style={{ position: 'absolute', zIndex: 1, pointerEvents: 'none' }}
        >
          <defs>
            <path id={`circlePath-${entity.id}`} d={pathData} fill="none" />
          </defs>
          
          {/* Subdued ring acting as matched facts orbit lane */}
          {matched.length > 0 && (
            <circle
              cx={cx}
              cy={cx}
              r={r}
              fill="none"
              stroke={entity.color}
              strokeWidth={RING_W}
              opacity={0.35} 
            />
          )}

          {/* Curved facts mapped uniformly around the path */}
          <text 
            fill="#f0e8ff" 
            fontSize={12} 
            fontFamily="Inter, system-ui" 
            fontWeight={600}
            letterSpacing={0.5}
          >
            {matched.map((mf, i) => {
              const startOffset = `${(i * 100) / Math.max(matched.length, 1)}%`
              return (
                <textPath
                  key={mf.conceptId}
                  href={`#circlePath-${entity.id}`}
                  startOffset={startOffset}
                  textAnchor={matched.length <= 1 ? "middle" : "start"}
                >
                  {matched.length <= 1 ? mf.text : ` • ${mf.text}`}
                </textPath>
              )
            })}
          </text>
        </svg>

        {/* Solid Main Bubble Center */}
        <div
          style={{
            width: bubbleSize,
            height: bubbleSize,
            borderRadius: '50%',
            background: entity.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 2,
            boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.3)',
          }}
        >
          <span
            style={{
              color: 'rgba(28,20,60,0.85)',
              fontSize: 13,
              fontFamily: 'Plus Jakarta Sans, Inter, system-ui',
              fontWeight: 900,
              letterSpacing: '0.06em',
              textAlign: 'center',
            }}
          >
            {entity.name}
          </span>
        </div>
      </motion.div>
    </div>
  )
}

// DroppableEntityWrapper is retired; EntityBubble intrinsically tracks everything

// ─── Feedback Flash ───────────────────────────────────────────────────────

function FeedbackFlash({ text, isCorrect }: { text: string; isCorrect: boolean }) {
  return (
    <motion.div
      key={text + isCorrect}
      initial={{ opacity: 0, y: -20, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        top: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 999,
        background: isCorrect ? 'rgba(34,197,94,0.95)' : 'rgba(239,68,68,0.95)',
        color: '#fff',
        borderRadius: 32,
        padding: '10px 28px',
        fontFamily: 'Plus Jakarta Sans, system-ui',
        fontWeight: 800,
        fontSize: 15,
        boxShadow: `0 4px 20px ${isCorrect ? 'rgba(34,197,94,0.5)' : 'rgba(239,68,68,0.5)'}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      {isCorrect ? '✓ Correct!' : '✗ Wrong!'}
    </motion.div>
  )
}

function StreakBadge({ streak }: { streak: number }) {
  return (
    <motion.div
      initial={{ scale: 0, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0, y: -20, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      style={{
        position: 'fixed',
        top: 120,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 998,
        background: 'linear-gradient(135deg, #f59e0b, #f97316)',
        color: '#fff',
        borderRadius: 24,
        padding: '8px 20px',
        fontFamily: 'Plus Jakarta Sans, system-ui',
        fontWeight: 900,
        fontSize: 14,
        boxShadow: '0 4px 20px rgba(245,158,11,0.5)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      🔥 {streak}x Streak!
    </motion.div>
  )
}

// ─── Win / Game-Over Overlay ──────────────────────────────────────────────

function EndScreen({
  won,
  score,
  lives,
  epq,
  bestStreak,
  accuracy,
  onRestart,
}: {
  won: boolean
  score: number
  lives: number
  epq: number
  bestStreak: number
  accuracy: number
  onRestart: () => void
}) {
  const epqTier = epq >= 4000 ? 'Expert' : epq >= 3000 ? 'Advanced' : epq >= 2000 ? 'Intermediate' : epq >= 1000 ? 'Developing' : 'Beginner'
  const tierColor = epq >= 4000 ? '#a78bfa' : epq >= 3000 ? '#60a5fa' : epq >= 2000 ? '#4ade80' : epq >= 1000 ? '#fcd34d' : '#9ca3af'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8,5,20,0.95)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        backdropFilter: 'blur(12px)',
      }}
    >
      <div style={{ fontSize: 56 }}>{won ? '🎉' : '💀'}</div>
      <p style={{ fontFamily: 'Plus Jakarta Sans, system-ui', fontWeight: 900, fontSize: 28, color: won ? '#a78bfa' : '#f87171', letterSpacing: '-0.02em', margin: 0 }}>
        {won ? 'Brilliant!' : 'Game Over'}
      </p>

      {/* EPQ Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 20,
          padding: '16px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          border: `1px solid ${tierColor}33`,
        }}
      >
        <span style={{ color: '#9ca3af', fontFamily: 'Inter', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Proficiency Quotient</span>
        <span style={{ color: tierColor, fontFamily: 'Plus Jakarta Sans, system-ui', fontWeight: 900, fontSize: 40, lineHeight: 1 }}>{epq.toLocaleString()}</span>
        <span style={{ color: tierColor, fontFamily: 'Inter', fontSize: 13, fontWeight: 700 }}>{epqTier}</span>
      </motion.div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 24, marginTop: 4 }}>
        {[{ label: 'Score', value: score.toString() }, { label: 'Accuracy', value: `${Math.round(accuracy * 100)}%` }, { label: 'Best Streak', value: `${bestStreak}x` }].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ color: '#e9d5ff', fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 18 }}>{s.value}</div>
            <div style={{ color: '#6b7280', fontFamily: 'Inter', fontSize: 11, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <button
        onClick={onRestart}
        style={{
          marginTop: 12,
          background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
          color: '#fff',
          border: 'none',
          borderRadius: 32,
          padding: '14px 48px',
          fontFamily: 'Plus Jakarta Sans, system-ui',
          fontWeight: 800,
          fontSize: 17,
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(124,58,237,0.5)',
        }}
      >
        Play Again
      </button>
    </motion.div>
  )
}

// ─── Main Game Component ───────────────────────────────────────────────────

interface Props {
  config: BubbleMatchConfig
}

const MAX_LIVES = 6
const POINTS_CORRECT = 100
const WRONG_PENALTY = 50
const SPAWN_INTERVAL_MS = 900
const STREAK_BONUS = [0, 0, 0, 50, 80, 120, 180, 250] // bonus at streak 3,4,5,6,7+

export function BubbleMatchGame({ config }: Props) {
  const [allConcepts]       = useState<Concept[]>(() => buildConcepts(config))
  const [visible, setVisible]     = useState<Concept[]>([])
  const [matched, setMatched]     = useState<Record<string, MatchedFact[]>>({})
  const [lives, setLives]         = useState(MAX_LIVES)
  const [score, setScore]         = useState(0)
  const [paused, setPaused]       = useState(false)
  const [activeId, setActiveId]   = useState<string | null>(null)
  const [feedback, setFeedback]   = useState<{ text: string; correct: boolean } | null>(null)
  const [flashMap, setFlashMap]   = useState<Record<string, 'idle' | 'correct' | 'wrong'>>({})
  const [gameOver, setGameOver]   = useState(false)
  const [gameWon, setGameWon]     = useState(false)
  const [streak, setStreak]       = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [totalAttempts, setTotalAttempts] = useState(0)
  const [showStreak, setShowStreak] = useState(false)
  const spawnIdx = useRef(0)
  const spawnTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 0, tolerance: 5 } })
  )

  // Spawn concepts one by one
  const spawnNext = useCallback(() => {
    if (spawnIdx.current >= allConcepts.length) return
    setVisible(v => [...v, allConcepts[spawnIdx.current]])
    spawnIdx.current++
  }, [allConcepts])

  useEffect(() => {
    // Prevent strict mode double-spawning by resetting cleanly
    let isMounted = true
    const initial = Math.min(3, allConcepts.length)
    
    setVisible(allConcepts.slice(0, initial))
    spawnIdx.current = initial

    // Then spawn rest with delay
    const scheduleNext = () => {
      if (!isMounted || spawnIdx.current >= allConcepts.length) return
      
      spawnTimer.current = setTimeout(() => {
        if (!isMounted) return
        const idx = spawnIdx.current
        
        setVisible(v => {
          // Extra safety check to prevent duplicate keys
          if (v.some(c => c.id === allConcepts[idx].id)) return v
          return [...v, allConcepts[idx]]
        })
        
        spawnIdx.current++
        scheduleNext()
      }, SPAWN_INTERVAL_MS)
    }
    
    scheduleNext()
    
    return () => { 
      isMounted = false
      if (spawnTimer.current) clearTimeout(spawnTimer.current) 
    }
  }, [allConcepts])

  const showFeedbackMsg = (correct: boolean, text: string) => {
    setFeedback({ text, correct })
    setTimeout(() => setFeedback(null), 1100)
  }

  const flashEntity = (entityId: string, state: 'correct' | 'wrong') => {
    setFlashMap(m => ({ ...m, [entityId]: state }))
    setTimeout(() => setFlashMap(m => ({ ...m, [entityId]: 'idle' })), 600)
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const overId = String(over.id)
    const concept = allConcepts.find(c => c.id === String(active.id))
    if (!concept) return

    setTotalAttempts(a => a + 1)
    if (concept.belongsTo === overId) {
      // ✅ Correct — streak bonus
      const newStreak = streak + 1
      setStreak(newStreak)
      if (newStreak > bestStreak) setBestStreak(newStreak)
      setTotalCorrect(c => c + 1)
      const bonus = STREAK_BONUS[Math.min(newStreak, STREAK_BONUS.length - 1)]
      const newScore = score + POINTS_CORRECT + bonus
      setScore(newScore)
      if (newStreak >= 3) { setShowStreak(true); setTimeout(() => setShowStreak(false), 1200) }
      setMatched(m => ({
        ...m,
        [overId]: [...(m[overId] || []), { conceptId: concept.id, text: concept.text }],
      }))
      setVisible(v => v.filter(c => c.id !== concept.id))
      flashEntity(overId, 'correct')
      showFeedbackMsg(true, concept.text)

      // check win
      const totalMatched = Object.values({ ...matched, [overId]: [...(matched[overId] || []), { conceptId: concept.id, text: concept.text }] })
        .flat().length
      if (totalMatched >= allConcepts.length) {
        setTimeout(() => setGameWon(true), 700)
      }
    } else {
      // ❌ Wrong — reset streak
      setStreak(0)
      if (navigator.vibrate) navigator.vibrate(100)
      const newLives = lives - 1
      setLives(newLives)
      setScore(Math.max(0, score - WRONG_PENALTY))
      flashEntity(overId, 'wrong')
      showFeedbackMsg(false, concept.text)
      if (newLives <= 0) {
        setTimeout(() => setGameOver(true), 700)
      }
    }
  }

  const restart = () => {
    spawnIdx.current = 0
    if (spawnTimer.current) clearTimeout(spawnTimer.current)
    const shuffled = buildConcepts(config)
    setVisible([])
    setMatched({})
    setLives(MAX_LIVES)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setTotalCorrect(0)
    setTotalAttempts(0)
    setGameOver(false)
    setGameWon(false)
    setFeedback(null)
    setFlashMap({})
    const initial = Math.min(3, shuffled.length)
    const newVis: Concept[] = []
    for (let i = 0; i < initial; i++) { newVis.push(shuffled[i]); spawnIdx.current = i + 1 }
    setVisible(newVis)
  }

  // Progress calculation
  const totalFacts = allConcepts.length
  const matchedCount = Object.values(matched).flat().length
  const progress = totalFacts > 0 ? matchedCount / totalFacts : 0

  // EPQ calculation (0-5000)
  const calcEPQ = () => {
    const accuracy = totalAttempts > 0 ? totalCorrect / totalAttempts : 0
    const completionBonus = gameWon ? 1 : matchedCount / totalFacts
    const streakFactor = Math.min(bestStreak / 5, 1)
    const livesRemaining = lives / MAX_LIVES
    return Math.round(
      5000 * (accuracy * 0.4 + completionBonus * 0.3 + streakFactor * 0.15 + livesRemaining * 0.15)
    )
  }

  // Note: activeConcept is no longer needed for DragOverlay

  // Fixed layout coordinates centered into a visual grouping
  // 3 entities create a centered triangle; up to 5 gracefully distribute
  const entityPositions: Record<number, { top: string; left: string }> = {
    0: { top: '25%', left: '50%' }, // Top Center
    1: { top: '65%', left: '30%' }, // Bottom Left
    2: { top: '65%', left: '70%' }, // Bottom Right
    3: { top: '45%', left: '15%' }, // Far Left
    4: { top: '45%', left: '85%' }, // Far Right
  }

  // Pool area positions for concept chips (bottom grid)
  const conceptPositions: Array<{ x: number; y: number }> = visible.map((_, i) => ({
    x: (i % 3) * 110 + 20,
    y: Math.floor(i / 3) * 110 + 10,
  }))

  return (
    <div
      style={{
        background: '#0b0818',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui',
        userSelect: 'none',
      }}
    >
      {/* HUD */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'rgba(11,8,24,0.85)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 22px' }}>
          {/* Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => setPaused(p => !p)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 18, padding: 0 }}
            >
              ⏸
            </button>
            <span style={{ color: '#e9d5ff', fontFamily: 'Plus Jakarta Sans, system-ui', fontWeight: 800, fontSize: 22 }}>
              {score}
            </span>
            {streak >= 2 && (
              <span style={{ color: '#f59e0b', fontFamily: 'Inter', fontWeight: 700, fontSize: 13 }}>
                🔥{streak}x
              </span>
            )}
          </div>

          {/* Progress + Lives */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#6b7280', fontFamily: 'Inter', fontSize: 12, fontWeight: 500 }}>
              {matchedCount}/{totalFacts}
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              {Array.from({ length: MAX_LIVES }).map((_, i) => (
                <span key={i} style={{ fontSize: 15, opacity: i < lives ? 1 : 0.15, transition: 'opacity 0.3s' }}>
                  ❤️
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', width: '100%' }}>
          <motion.div
            animate={{ width: `${progress * 100}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            style={{ height: '100%', background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', borderRadius: 2 }}
          />
        </div>
      </div>

      {/* Feedback flash */}
      <AnimatePresence>
        {feedback && (
          <FeedbackFlash key={feedback.text} text={feedback.text} isCorrect={feedback.correct} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showStreak && streak >= 3 && (
          <StreakBadge key={`streak-${streak}`} streak={streak} />
        )}
      </AnimatePresence>

      <DndContext 
        sensors={sensors} 
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
        collisionDetection={coordinateGeometryCollision}
      >
        {/* Entity bubbles – unified container bounds */}
        <div
          style={{
            position: 'relative',
            height: '60vh',
            marginTop: 56,
            maxWidth: 800, // Clamp layout stretch on destkops 
            marginLeft: 'auto',
            marginRight: 'auto', 
          }}
        >
          {config.entities.map((entity, i) => {
            const pos = entityPositions[i] ?? { top: '50%', left: '50%' }
            return (
              <div
                key={entity.id}
                style={{
                  position: 'absolute',
                  ...pos,
                  transform: 'translate(-50%,-50%)',
                }}
              >
                <EntityBubble
                  entity={entity}
                  matched={matched[entity.id] || []}
                  flashState={flashMap[entity.id] || 'idle'}
                />
              </div>
            )
          })}
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: 'rgba(255,255,255,0.07)',
            margin: '0 24px',
          }}
        />

        {/* Concept chips pool – bottom area */}
        <div
          style={{
            padding: '18px 20px 32px',
            minHeight: 180,
            position: 'relative',
          }}
        >
          <p
            style={{
              color: '#6b7280',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            Drag to match ↑
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 14,
              justifyContent: 'center',
            }}
          >
            <AnimatePresence>
              {visible.map((concept, idx) => (
                <motion.div
                  key={concept.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ delay: Math.min(idx * 0.1, 0.5), type: 'spring', stiffness: 380, damping: 22 }}
                >
                  <ConceptChip
                    concept={concept}
                    isDragging={concept.id === activeId}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* DragOverlay removed; ConceptChip intrinsically handles its state when dragged */}
      </DndContext>

      {/* End screens */}
      <AnimatePresence>
        {(gameOver || gameWon) && (
          <EndScreen
            won={gameWon}
            score={score}
            lives={lives}
            epq={calcEPQ()}
            bestStreak={bestStreak}
            accuracy={totalAttempts > 0 ? totalCorrect / totalAttempts : 0}
            onRestart={restart}
          />
        )}
      </AnimatePresence>

      {/* Pause overlay */}
      <AnimatePresence>
        {paused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPaused(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(8,5,20,0.88)',
              zIndex: 150,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 52 }}>⏸</span>
            <p style={{ color: '#a78bfa', fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 22 }}>
              Paused
            </p>
            <p style={{ color: '#6b7280', fontSize: 14 }}>Tap to resume</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
