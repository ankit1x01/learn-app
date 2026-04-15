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

// Use coordinate geometry to create a completely circular radial magnetic capture zone
let debugThrottle = 0;

const coordinateGeometryCollision: CollisionDetection = ({
  collisionRect,
  droppableRects,
  droppableContainers,
}) => {
  // Use the collisionRect center because pointer offset could skew geometry if dragged by edges
  if (!collisionRect) return []

  const activeCenterX = collisionRect.left + collisionRect.width / 2
  const activeCenterY = collisionRect.top + collisionRect.height / 2

  // Only log roughly 1 out of every 30 evaluations to prevent browser console freeze
  const isLogTick = debugThrottle++ % 30 === 0;
  
  if (isLogTick) {
    console.log('--- DRAGGING TICK ---')
    console.log(`Active dragged offset: x=${Math.round(activeCenterX)}, y=${Math.round(activeCenterY)}`)
  }

  const collisions = []

  // Compute intersection via pure mathematical distance against visual drop boundaries
  for (const droppable of droppableContainers) {
    // MUST use 'droppableRects' map; droppable.rect.current is unstable in dnd-kit v6+
    const rect = droppableRects.get(droppable.id)
    
    if (!rect) {
      if (isLogTick) console.log(`[${droppable.id}] RECT IS NULL IN MAP!`)
      continue
    }

    const dropCenterX = rect.left + rect.width / 2
    const dropCenterY = rect.top + rect.height / 2

    const dx = activeCenterX - dropCenterX
    const dy = activeCenterY - dropCenterY
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (isLogTick) {
      console.log(`Target [${droppable.id}] => x=${Math.round(dropCenterX)}, y=${Math.round(dropCenterY)} | calculated distance: ${Math.round(distance)}`)
    }

    // The entire Droppable node includes the orbit rings (up to ~250px wide) 
    // To make the snap feel precise to the actual visual circle core, 
    // we set it so you have to bring the dragged bubble close to the visual target.
    // Inner Bubble Radius (46px) + Dragged Concept Radius (41px) = 87px. Added ~30px for magnet feel.
    if (distance <= 120) {
      if (isLogTick) console.log(`>>> SNAP TRIGGERED ON [${droppable.id}] -> distance ${Math.round(distance)} <= 120`)
      collisions.push({
        id: droppable.id,
        data: { droppableContainer: droppable, value: distance },
      })
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
        background: isCorrect ? '#22c55e' : '#ef4444',
        color: '#fff',
        borderRadius: 32,
        padding: '10px 28px',
        fontFamily: 'Plus Jakarta Sans, system-ui',
        fontWeight: 800,
        fontSize: 15,
        boxShadow: `0 4px 20px ${isCorrect ? '#22c55e' : '#ef4444'}88`,
      }}
    >
      {isCorrect ? '✓ Correct!' : '✗ Wrong!'}
    </motion.div>
  )
}

// ─── Win / Game-Over Overlay ──────────────────────────────────────────────

function EndScreen({
  won,
  score,
  lives,
  onRestart,
}: {
  won: boolean
  score: number
  lives: number
  onRestart: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8,5,20,0.92)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
      }}
    >
      <div style={{ fontSize: 64 }}>{won ? '🎉' : '💀'}</div>
      <p
        style={{
          fontFamily: 'Plus Jakarta Sans, system-ui',
          fontWeight: 900,
          fontSize: 32,
          color: won ? '#a78bfa' : '#f87171',
          letterSpacing: '-0.02em',
        }}
      >
        {won ? 'You Won!' : 'Game Over'}
      </p>
      <p style={{ color: '#c4b5fd', fontFamily: 'Inter', fontSize: 18 }}>
        Score: <strong>{score}</strong>
      </p>
      {!won && (
        <p style={{ color: '#9ca3af', fontFamily: 'Inter', fontSize: 15 }}>
          Lives remaining: {lives}
        </p>
      )}
      <button
        onClick={onRestart}
        style={{
          marginTop: 8,
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
const SPAWN_INTERVAL_MS = 900   // delay between concept spawns

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

  const showFeedback = (correct: boolean, text: string) => {
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

    if (concept.belongsTo === overId) {
      // ✅ Correct
      const newScore = score + POINTS_CORRECT
      setScore(newScore)
      setMatched(m => ({
        ...m,
        [overId]: [...(m[overId] || []), { conceptId: concept.id, text: concept.text }],
      }))
      setVisible(v => v.filter(c => c.id !== concept.id))
      flashEntity(overId, 'correct')
      showFeedback(true, concept.text)

      // check win: all matched
      const totalFacts = allConcepts.length
      const totalMatched = Object.values({ ...matched, [overId]: [...(matched[overId] || []), { conceptId: concept.id, text: concept.text }] })
        .flat().length
      if (totalMatched >= totalFacts) {
        setTimeout(() => setGameWon(true), 700)
      }
    } else {
      // ❌ Wrong
      if (navigator.vibrate) navigator.vibrate(100)
      const newLives = lives - 1
      setLives(newLives)
      const newScore = Math.max(0, score - WRONG_PENALTY)
      setScore(newScore)
      flashEntity(overId, 'wrong')
      showFeedback(false, concept.text)
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
    setGameOver(false)
    setGameWon(false)
    setFeedback(null)
    setFlashMap({})
    // re-init
    const initial = Math.min(3, shuffled.length)
    const newVis: Concept[] = []
    for (let i = 0; i < initial; i++) { newVis.push(shuffled[i]); spawnIdx.current = i + 1 }
    setVisible(newVis)
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 22px',
          background: 'rgba(11,8,24,0.85)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setPaused(p => !p)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#9ca3af',
              fontSize: 18,
              padding: 0,
            }}
          >
            ⏸
          </button>
          <span
            style={{
              color: '#e9d5ff',
              fontFamily: 'Plus Jakarta Sans, system-ui',
              fontWeight: 800,
              fontSize: 22,
            }}
          >
            {score}
          </span>
        </div>

        {/* Lives */}
        <div style={{ display: 'flex', gap: 5 }}>
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <span key={i} style={{ fontSize: 17, opacity: i < lives ? 1 : 0.2 }}>
              ❤️
            </span>
          ))}
        </div>
      </div>

      {/* Feedback flash */}
      <AnimatePresence>
        {feedback && (
          <FeedbackFlash key={feedback.text} text={feedback.text} isCorrect={feedback.correct} />
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
