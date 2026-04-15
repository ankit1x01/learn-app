import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { BalloonTapConfig } from '../types';

interface Props {
  config: BalloonTapConfig;
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface Balloon {
  id: string;
  text: string;
  pairId: number;
  x: number;     // percent of container width (center anchor)
  y: number;     // percent of container height (0 = top, 100 = bottom)
  speed: number; // percent per second
  selected: boolean;
  color: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const COLORS = [
  '#F87171', '#60A5FA', '#4ADE80', '#FB923C',
  '#A78BFA', '#2DD4BF', '#F472B6', '#FACC15',
];
const MAX_ON_SCREEN = 10;
const MAX_MISSED    = 5;
const BASE_SPEED    = 7;   // % per second at level 1

// ─── Game State (lives in a ref so RAF closures always see fresh data) ───────

interface GameState {
  balloons:   Balloon[];
  selected:   string[];       // up to 2 ids awaiting match
  unmatched:  Set<number>;    // pairIds not yet matched
  score:      number;
  missed:     number;
  level:      number;
  combo:      number;
  running:    boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function BalloonTapGame({ config }: Props) {
  const { pairs, onComplete } = config;

  const containerRef  = useRef<HTMLDivElement>(null);
  const gameRef       = useRef<GameState>({ balloons: [], selected: [], unmatched: new Set(), score: 0, missed: 0, level: 1, combo: 0, running: false });
  const rafRef        = useRef(0);
  const lastTsRef     = useRef(0);
  const lastSpawnTsRef = useRef(0);

  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score,    setScore]    = useState(0);
  const [missed,   setMissed]   = useState(0);
  const [phase,    setPhase]    = useState<'playing' | 'gameover' | 'win'>('playing');
  const [shakeSet, setShakeSet] = useState<Set<string>>(new Set());

  // ── Color helper ──────────────────────────────────────────────────────────
  function colorOf(pairId: number) {
    const idx = pairs.findIndex(p => p.id === pairId);
    return COLORS[idx % COLORS.length];
  }

  // ── Spawn one balloon ─────────────────────────────────────────────────────
  function spawnOne(ts: number) {
    const g = gameRef.current;
    if (g.balloons.length >= MAX_ON_SCREEN) return;
    if (g.unmatched.size === 0) return;

    // Prefer spawning the partner of a lonely balloon already on screen
    const loner = g.balloons.find(b =>
      g.unmatched.has(b.pairId) &&
      !g.balloons.find(b2 => b2 !== b && b2.pairId === b.pairId)
    );

    let pairId: number;
    let text: string;

    if (loner) {
      pairId = loner.pairId;
      const pair = pairs.find(p => p.id === pairId)!;
      text = loner.text === pair.a ? pair.b : pair.a;
    } else {
      // Pick a random unmatched pair that has room on screen
      const eligible = [...g.unmatched].filter(id => {
        const onScreen = g.balloons.filter(b => b.pairId === id);
        return onScreen.length < 2;
      });
      if (eligible.length === 0) return;
      pairId = eligible[Math.floor(Math.random() * eligible.length)];
      const pair = pairs.find(p => p.id === pairId)!;
      const onScreen = g.balloons.filter(b => b.pairId === pairId);
      if (onScreen.length === 1) {
        text = onScreen[0].text === pair.a ? pair.b : pair.a;
      } else {
        text = Math.random() < 0.5 ? pair.a : pair.b;
      }
    }

    const speed = (BASE_SPEED + g.level * 0.8) * (0.85 + Math.random() * 0.3);
    const balloon: Balloon = {
      id:       `${pairId}-${text}-${ts}-${Math.random().toString(36).slice(2)}`,
      text,
      pairId,
      x:        10 + Math.random() * 72,
      y:        110,   // start just below bottom
      speed,
      selected: false,
      color:    colorOf(pairId),
    };

    g.balloons = [...g.balloons, balloon];
    lastSpawnTsRef.current = ts;
  }

  // ── RAF tick ──────────────────────────────────────────────────────────────
  function tick(ts: number) {
    const g = gameRef.current;
    if (!g.running) return;

    const dt = Math.min(ts - lastTsRef.current, 50);
    lastTsRef.current = ts;

    // Move balloons upward
    const moved = g.balloons.map(b => ({ ...b, y: b.y - b.speed * dt / 1000 }));

    // Collect escaped balloons
    let extraMissed = 0;
    const alive = moved.filter(b => {
      if (b.y < -13) { extraMissed++; return false; }
      return true;
    });
    g.balloons = alive;

    if (extraMissed > 0) {
      g.missed += extraMissed;
      setMissed(g.missed);
      Haptics.impact({ style: ImpactStyle.Light });

      if (g.missed >= MAX_MISSED) {
        g.running = false;
        cancelAnimationFrame(rafRef.current);
        setPhase('gameover');
        return;
      }
    }

    // Spawn interval decreases with level
    const spawnInterval = Math.max(600, 1400 - g.level * 100);
    if (ts - lastSpawnTsRef.current > spawnInterval) {
      spawnOne(ts);
    }

    setBalloons([...g.balloons]);
    rafRef.current = requestAnimationFrame(tick);
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const g = gameRef.current;
    g.balloons  = [];
    g.selected  = [];
    g.unmatched = new Set(pairs.map(p => p.id));
    g.score     = 0;
    g.missed    = 0;
    g.level     = 1;
    g.combo     = 0;
    g.running   = true;

    const startTs = performance.now();
    lastTsRef.current     = startTs;
    lastSpawnTsRef.current = startTs - 1400; // immediate first spawn

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      g.running = false;
      cancelAnimationFrame(rafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Tap handler ───────────────────────────────────────────────────────────
  function handleTap(id: string) {
    const g = gameRef.current;
    if (!g.running) return;

    const balloon = g.balloons.find(b => b.id === id);
    if (!balloon || balloon.selected) return;

    // Mark selected
    g.balloons  = g.balloons.map(b => b.id === id ? { ...b, selected: true } : b);
    g.selected  = [...g.selected, id];
    setBalloons([...g.balloons]);
    Haptics.impact({ style: ImpactStyle.Light });

    if (g.selected.length < 2) return;

    // Evaluate pair
    const [id1, id2] = g.selected;
    g.selected = [];
    const b1 = g.balloons.find(b => b.id === id1);
    const b2 = g.balloons.find(b => b.id === id2);

    if (b1 && b2 && b1.pairId === b2.pairId) {
      // ✅ Correct match
      Haptics.impact({ style: ImpactStyle.Heavy });
      g.combo++;
      g.score += 10 + Math.min(g.combo, 5) * 2;
      setScore(g.score);

      // Level up every 2 correct matches
      const matched = pairs.length - g.unmatched.size + 1;
      g.level = Math.min(10, 1 + Math.floor(matched / 2));

      g.unmatched.delete(b1.pairId);
      g.balloons = g.balloons.filter(b => b.id !== id1 && b.id !== id2);
      setBalloons([...g.balloons]);

      // Win check
      if (g.unmatched.size === 0) {
        g.running = false;
        cancelAnimationFrame(rafRef.current);
        setPhase('win');
        onComplete?.({ gameType: 'balloon-tap', score: g.score, guesses: pairs.length, hintsUsed: 0, timeMs: 0 });
      }
    } else {
      // ❌ Wrong match
      g.combo = 0;
      setShakeSet(new Set([id1, id2]));
      setTimeout(() => {
        g.balloons = g.balloons.map(b =>
          b.id === id1 || b.id === id2 ? { ...b, selected: false } : b
        );
        setBalloons([...g.balloons]);
        setShakeSet(new Set());
      }, 500);
    }
  }

  // ── End screens ───────────────────────────────────────────────────────────
  if (phase === 'gameover') {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] gap-3 bg-[#F7F6F3]">
        <p className="text-[48px]" style={{ fontFamily: 'system-ui' }}>💥</p>
        <p className="text-[24px] font-black text-[#292524]" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>Game Over</p>
        <p className="text-[16px] text-[#78716C]">Score: <strong>{score}</strong></p>
      </div>
    );
  }

  if (phase === 'win') {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] gap-3 bg-[#F7F6F3]">
        <p className="text-[48px]" style={{ fontFamily: 'system-ui' }}>🎉</p>
        <p className="text-[24px] font-black text-[#292524]" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>All Matched!</p>
        <p className="text-[16px] text-[#78716C]">Score: <strong>{score}</strong></p>
      </div>
    );
  }

  // ── HUD lives ─────────────────────────────────────────────────────────────
  const hearts = Array.from({ length: MAX_MISSED }, (_, i) => i < MAX_MISSED - missed);

  return (
    <div className="flex flex-col h-full min-h-[500px] bg-[#F7F6F3]" style={{ userSelect: 'none' }}>
      {/* HUD */}
      <div className="flex items-center justify-between px-5 py-3">
        <p className="text-[22px] font-black text-[#292524]" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>
          {score}
        </p>
        <div className="flex gap-1.5">
          {hearts.map((alive, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full transition-colors"
              style={{ background: alive ? '#F87171' : '#E8E5DF' }}
            />
          ))}
        </div>
        <p className="text-[13px] font-semibold text-[#A8A29E]">
          {pairs.length - gameRef.current.unmatched.size}/{pairs.length}
        </p>
      </div>

      {/* Hint */}
      <p className="text-center text-[12px] text-[#A8A29E] pb-1" style={{ fontFamily: 'Inter, system-ui' }}>
        Tap two balloons that belong together
      </p>

      {/* Game area */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden"
        style={{ touchAction: 'none' }}
      >
        {balloons.map(b => (
          <BalloonView
            key={b.id}
            balloon={b}
            shaking={shakeSet.has(b.id)}
            onTap={handleTap}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Balloon visual ──────────────────────────────────────────────────────────

interface BalloonViewProps {
  balloon:  Balloon;
  shaking:  boolean;
  onTap:    (id: string) => void;
}

function BalloonView({ balloon, shaking, onTap }: BalloonViewProps) {
  const fontSize = balloon.text.length > 9 ? 11 : balloon.text.length > 6 ? 12 : 14;

  return (
    <motion.div
      animate={shaking ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{
        position:  'absolute',
        left:      `${balloon.x}%`,
        top:       `${balloon.y}%`,
        transform: 'translateX(-50%)',
        touchAction: 'none',
        cursor:    'pointer',
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        onTap(balloon.id);
      }}
    >
      {/* Body */}
      <div
        style={{
          width:        68,
          height:       76,
          borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
          background:   balloon.selected ? balloon.color : `${balloon.color}bb`,
          border:       balloon.selected ? `3px solid white` : `2px solid ${balloon.color}`,
          boxShadow:    balloon.selected
            ? `0 0 0 3px ${balloon.color}, 0 4px 16px ${balloon.color}66`
            : '0 3px 10px rgba(0,0,0,0.18)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          position:       'relative',
          transition:     'background 0.12s, box-shadow 0.12s',
        }}
      >
        {/* Shine */}
        <div style={{
          position:     'absolute',
          top:          7,
          left:         12,
          width:        18,
          height:       10,
          borderRadius: '50%',
          background:   'rgba(255,255,255,0.5)',
          transform:    'rotate(-30deg)',
        }} />
        <span style={{
          fontFamily: 'Plus Jakarta Sans, system-ui',
          fontWeight: 700,
          fontSize,
          color:      '#292524',
          textAlign:  'center',
          lineHeight: 1.2,
          padding:    '0 6px',
        }}>
          {balloon.text}
        </span>
      </div>

      {/* Knot */}
      <div style={{
        width:        8,
        height:       8,
        borderRadius: '50%',
        background:   balloon.color,
        margin:       '-2px auto 0',
      }} />

      {/* String */}
      <div style={{
        width:      1,
        height:     18,
        background: `${balloon.color}66`,
        margin:     '0 auto',
      }} />
    </motion.div>
  );
}
