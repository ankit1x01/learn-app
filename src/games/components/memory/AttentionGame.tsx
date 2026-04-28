// src/games/components/memory/AttentionGame.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import type { CollisionDetection } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'motion/react';
import { MemoryAttentionConfig } from '../../types';

// ─── Custom Math Geometry Config (From Bubble Match) ───────────────────────

const coordinateGeometryCollision: CollisionDetection = ({
  collisionRect,
  droppableRects,
  droppableContainers,
}) => {
  if (!collisionRect) return [];

  const activeCenterX = collisionRect.left + collisionRect.width / 2;
  const activeCenterY = collisionRect.top + collisionRect.height / 2;

  const collisions = [];

  for (const droppable of droppableContainers) {
    const rect = droppableRects.get(droppable.id);
    if (!rect) continue;

    const dropCenterX = rect.left + rect.width / 2;
    const dropCenterY = rect.top + rect.height / 2;

    const dx = activeCenterX - dropCenterX;
    const dy = activeCenterY - dropCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= 120) {
      collisions.push({
        id: droppable.id,
        data: { droppableContainer: droppable, value: distance },
      });
    }
  }

  return collisions.sort((a, b) => a.data.value - b.data.value);
};

// ─── UI Components (Adapted from Bubble Match) ─────────────────────────────

interface FactNodeProps {
  fact: any;
  isDragging?: boolean;
}

function FactNodeChip({ fact, isDragging }: FactNodeProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: fact.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transform ? 'transform 150ms ease-out' : undefined,
    zIndex: isDragging ? 999 : 1,
    opacity: isDragging ? 0.9 : 1,
    position: 'absolute' as const,
    left: '50%',
    top: '50%',
  };
  
  const dim = isDragging ? 90 : 82;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="touch-none select-none">
      <motion.div
        animate={{ 
          scale: isDragging ? 1.05 : 1,
          x: `calc(-50% + ${fact.driftX}px)`, 
          y: `calc(-50% + ${fact.driftY}px)`
        }}
        transition={isDragging ? { type: 'spring', stiffness: 300, damping: 20 } : { duration: 15, ease: "linear" }}
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
          {fact.label}
        </span>
      </motion.div>
    </div>
  );
}

function TopicBubble({ topic, matched, flashState, color }: any) {
  const { setNodeRef, isOver } = useDroppable({ id: topic.id });

  const BASE = 92;
  const RING_W = 28;
  const baseScale = 1 + matched.length * 0.07;
  const bubbleSize = BASE * baseScale;

  const cx = bubbleSize / 2 + RING_W;
  const r = bubbleSize / 2 + RING_W / 2;
  const svgSize = cx * 2;

  const pathData = `
    M ${cx}, ${cx - r}
    A ${r}, ${r} 0 1, 1 ${cx}, ${cx + r}
    A ${r}, ${r} 0 1, 1 ${cx}, ${cx - r}
  `;

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
            ? `0 0 40px 12px ${color}55`
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
        <svg width={svgSize} height={svgSize} style={{ position: 'absolute', zIndex: 1, pointerEvents: 'none' }}>
          <defs>
            <path id={`circlePath-${topic.id}`} d={pathData} fill="none" />
          </defs>
          
          {matched.length > 0 && (
            <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={RING_W} opacity={0.35} />
          )}

          <text fill="#f0e8ff" fontSize={12} fontFamily="Inter, system-ui" fontWeight={600} letterSpacing={0.5}>
            {matched.map((mf: any, i: number) => {
              const startOffset = `${(i * 100) / Math.max(matched.length, 1)}%`;
              return (
                <textPath key={mf.id} href={`#circlePath-${topic.id}`} startOffset={startOffset} textAnchor={matched.length <= 1 ? "middle" : "start"}>
                  {matched.length <= 1 ? mf.label : ` • ${mf.label}`}
                </textPath>
              );
            })}
          </text>
        </svg>

        <div
          style={{
            width: bubbleSize,
            height: bubbleSize,
            borderRadius: '50%',
            background: color,
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
            {topic.label}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function AttentionGame({ config }: { config: MemoryAttentionConfig }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [activeFacts, setActiveFacts] = useState<any[]>([]);
  const [matched, setMatched] = useState<Record<string, any[]>>({});
  const [score, setScore] = useState(0);
  const [latencies, setLatencies] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [flashMap, setFlashMap] = useState<Record<string, 'idle' | 'correct' | 'wrong'>>({});
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const processedTimelineIds = useRef<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 0, tolerance: 5 } })
  );

  const topicColors = ['#FCD34D', '#60A5FA', '#F472B6', '#34D399'];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const time = audio.currentTime;
      setCurrentTime(time);

      config.timeline.forEach(item => {
        if (time >= item.timestamp && !processedTimelineIds.current.has(item.factId)) {
          processedTimelineIds.current.add(item.factId);
          spawnFact(item);
        }
      });

      // Cleanup missed facts (nodes that take too long to sort)
      setActiveFacts(prev => {
        const missed = prev.filter(f => time - f.spawnTime > 10);
        if (missed.length > 0) {
          // penalize score or trigger an animation here if desired
        }
        return prev.filter(f => time - f.spawnTime <= 10);
      });
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, [config.timeline]);

  const spawnFact = (item: typeof config.timeline[0]) => {
    const angle = Math.random() * Math.PI * 2;
    const driftDist = 150 + Math.random() * 150;
    
    setActiveFacts(prev => [...prev, {
      id: `${item.factId}-${Date.now()}`,
      factId: item.factId,
      label: item.label,
      targetTopicId: item.targetTopicId,
      driftX: Math.cos(angle) * driftDist,
      driftY: Math.sin(angle) * driftDist,
      spawnTime: audioRef.current?.currentTime || 0,
    }]);
  };

  const flashEntity = (entityId: string, state: 'correct' | 'wrong') => {
    setFlashMap(m => ({ ...m, [entityId]: state }));
    setTimeout(() => setFlashMap(m => ({ ...m, [entityId]: 'idle' })), 600);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const overId = String(over.id);
    const fact = activeFacts.find(f => f.id === String(active.id));
    if (!fact) return;

    const latency = (audioRef.current?.currentTime || 0) - fact.spawnTime;

    if (fact.targetTopicId === overId) {
      // Base points + speed bonus
      const speedBonus = latency < 2 ? 50 : latency < 5 ? 20 : 0;
      setScore(s => s + 100 + speedBonus);
      setLatencies(prev => [...prev, latency]);
      
      setMatched(m => ({
        ...m,
        [overId]: [...(m[overId] || []), fact],
      }));
      setActiveFacts(v => v.filter(f => f.id !== fact.id));
      flashEntity(overId, 'correct');
    } else {
      setScore(s => Math.max(0, s - 50));
      flashEntity(overId, 'wrong');
    }
  };

  const topicPositions: Record<number, { top: string; left: string }> = {
    0: { top: '25%', left: '50%' },
    1: { top: '75%', left: '30%' },
    2: { top: '75%', left: '70%' },
    3: { top: '50%', left: '15%' },
  };

  return (
    <div style={{ background: '#0b0818', minHeight: '100vh', position: 'relative', overflow: 'hidden', fontFamily: 'Inter, system-ui', userSelect: 'none' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'center', padding: '14px 22px', background: 'rgba(11,8,24,0.85)', backdropFilter: 'blur(8px)' }}>
        <audio ref={audioRef} src={config.audioUrl} controls style={{ height: '36px' }} />
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={coordinateGeometryCollision}>
        <div style={{ position: 'relative', height: '100vh', width: '100%', maxWidth: 800, margin: '0 auto', paddingTop: 80 }}>
          
          {config.topics.map((topic, i) => {
            const pos = topicPositions[i] ?? { top: '50%', left: '50%' };
            return (
              <div key={topic.id} style={{ position: 'absolute', ...pos, transform: 'translate(-50%,-50%)' }}>
                <TopicBubble
                  topic={topic}
                  matched={matched[topic.id] || []}
                  flashState={flashMap[topic.id] || 'idle'}
                  color={topicColors[i % topicColors.length]}
                />
              </div>
            );
          })}

          <AnimatePresence>
            {activeFacts.map((fact) => (
              <motion.div key={fact.id} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
                <FactNodeChip fact={fact} isDragging={fact.id === activeId} />
              </motion.div>
            ))}
          </AnimatePresence>

        </div>
      </DndContext>

      {/* HUD Overlay */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        pointerEvents: 'none',
        zIndex: 200,
        background: 'linear-gradient(to top, rgba(11,8,24,0.9), transparent)',
      }}>
        <div style={{ color: '#e0d6f5', fontFamily: 'Plus Jakarta Sans, system-ui', fontWeight: 800, fontSize: 18 }}>
          Score: {score}
        </div>
        <div style={{ color: '#9ca3af', fontFamily: 'Inter, system-ui', fontWeight: 500, fontSize: 14 }}>
          Avg Latency: {latencies.length > 0 ? (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2) : 0}s
        </div>
      </div>
    </div>
  );
}
