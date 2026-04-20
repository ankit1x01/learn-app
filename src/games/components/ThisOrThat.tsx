// src/games/components/ThisOrThat.tsx
import { useState, useRef, useEffect, memo, useCallback, useMemo } from "react";
import { motion, useAnimation, PanInfo } from "motion/react";
import { ArrowLeft, Info, Layers } from "lucide-react";
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { ThisOrThatConfig, GameResult } from "../types";
import { GameWinScreen } from "./GameWinScreen";

interface Props {
  config: ThisOrThatConfig;
}

type Assignment = "A" | "B" | null;

// Vivid card palette — each card gets a unique solid color like the reference
const CARD_PALETTE = [
  "#FBBF24", // yellow/orange
  "#60A5FA", // blue
  "#A78BFA", // purple
  "#34D399", // green
  "#F472B6", // pink
  "#FCD34D", // yellow
  "#2DD4BF", // teal
  "#F87171", // coral
  "#818CF8", // indigo
];

interface CardState {
  id: string;
  label: string;
  correct: "A" | "B";
  assigned: Assignment;
  status: "idle" | "correct" | "wrong";
  color: string;
}

function calcScore(cards: CardState[], guesses: number) {
  const correct = cards.filter((c) => c.status === "correct").length;
  const base = Math.round((correct / cards.length) * 100);
  const penalty = Math.max(0, (guesses - 1) * 10);
  return Math.max(0, base - penalty);
}

const DraggableCard = memo(function DraggableCard({ card, assign, isTop, depth, total }: any) {
  const controls = useAnimation();
  const cardRef = useRef<HTMLDivElement>(null);

  // Stack styling constraints (Fanned out to the right)
  const scale = 1;
  const translateY = isTop ? 0 : depth * -1;
  const translateX = isTop ? 0 : depth * 1;
  const rotate = isTop ? 0 : depth * 2;
  const opacity = 1;

  async function handleDragEnd(_: any, info: PanInfo) {
    if (!isTop) return;

    const colA = document.getElementById("col-A")?.getBoundingClientRect();
    const colB = document.getElementById("col-B")?.getBoundingClientRect();

    const dropX = info.point.x;
    const dropY = info.point.y;

    const isInside = (rect: DOMRect | undefined) => {
      if (!rect) return false;
      // Slight padding tolerance
      return (
        dropX >= rect.left - 20 &&
        dropX <= rect.right + 20 &&
        dropY >= rect.top - 20 &&
        dropY <= rect.bottom + 20
      );
    };

    if (isInside(colA)) {
      assign(card.id, "A");
      Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
    } else if (isInside(colB)) {
      assign(card.id, "B");
      Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
    } else {
      controls.start({ x: translateX, y: translateY, scale, rotate, opacity, transition: { type: "spring", stiffness: 300, damping: 25 } });
      Haptics.vibrate().catch(() => {});
    }
  }

  if (depth > 5) return null; // Show up to 6 cards in the fan

  return (
    <motion.div
      ref={cardRef}
      drag={isTop}
      dragSnapToOrigin
      dragElastic={0.6}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ scale, y: translateY, x: translateX, rotate, opacity }}
      whileHover={isTop ? { scale: 1.01 } : undefined}
      whileDrag={{
        scale: 1.03,
        rotate: isTop ? (Math.random() > 0.5 ? 1 : -1) : 0,
        zIndex: 50,
        boxShadow: "0 12px 24px -4px rgba(0, 0, 0, 0.12)",
      }}
      className={`absolute w-full h-[220px] rounded-[24px] overflow-hidden ${isTop ? "cursor-grab active:cursor-grabbing" : ""}`}
      style={{
        background: card.color,
        boxShadow: "none",
        border: "2px solid #000",
        touchAction: "none",
        transformOrigin: "bottom left",
        zIndex: total - depth,
      }}
    >
      {/* Top Left Label */}
      {isTop && (
        <div className="absolute top-4 left-5 pr-4">
          <span
            className="text-[20px] font-black tracking-tight text-left block"
            style={{
              color: "#000",
              fontFamily: "Plus Jakarta Sans, system-ui",
              letterSpacing: "-0.01em"
            }}
          >
            {card.label}
          </span>
        </div>
      )}
    </motion.div>
  );
});

export function ThisOrThat({ config }: Props) {
  const startTime = useRef(Date.now());
  const [cards, setCards] = useState<CardState[]>(
    config.cards.slice(0, 10).map((c, i) => ({
      ...c,
      assigned: null,
      status: "idle" as const,
      color: CARD_PALETTE[i % CARD_PALETTE.length],
    })),
  );
  const [guesses, setGuesses] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);

  const unassigned = useMemo(() => cards.filter(
    (c) => c.status !== "correct" && c.assigned === null,
  ), [cards]);

  const assign = useCallback((id: string, col: "A" | "B") => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, assigned: col, status: "idle" } : c,
      ),
    );
  }, []);

  const handleCheck = useCallback(() => {
    setGuesses((g) => g + 1);

    let mistakesCount = 0;

    setCards((prev) => {
      const updated = prev.map((c) => {
        if (c.status === "correct") return c;
        if (c.assigned === c.correct) return { ...c, status: "correct" as const };
        mistakesCount++;
        return { ...c, status: "wrong" as const };
      });

      if (mistakesCount === 0) {
        Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => {});
      } else {
        Haptics.notification({ type: 'ERROR' as any }).catch(() => {});
      }

      // Schedule reset for wrongs
      setTimeout(() => {
        setCards((current) => {
          const reset = current.map((c) =>
            c.status === "wrong"
              ? { ...c, status: "idle" as const, assigned: null }
              : c,
          );

          const allCorrect = reset.every((c) => c.status === "correct");
          if (allCorrect) {
            const finalResult: GameResult = {
              gameType: "this-or-that",
              score: calcScore(reset, guesses + 1),
              guesses: guesses + 1,
              hintsUsed,
              timeMs: Date.now() - startTime.current,
            };
            config.onComplete?.(finalResult);
            setResult(finalResult);
          }
          return reset;
        });
      }, 900);

      return updated;
    });
  }, [guesses, hintsUsed, config]);

  // Auto-check when all cards have been assigned
  // (Disabled) User must explicitly tap "Guess" like in original screenshot

  const handleHint = useCallback(() => {
    const unset = cards.find(
      (c) => c.assigned === null && c.status !== "correct",
    );
    if (!unset) return;
    setHintsUsed((h) => h + 1);
    assign(unset.id, unset.correct);
  }, [cards, assign]);

  function handleReset() {
    setCards(
      config.cards.slice(0, 10).map((c, i) => ({
        ...c,
        assigned: null,
        status: "idle" as const,
        color: CARD_PALETTE[i % CARD_PALETTE.length],
      })),
    );
    setGuesses(0);
    setHintsUsed(0);
    setResult(null);
    startTime.current = Date.now();
  }

  if (result) return <GameWinScreen result={result} onPlayAgain={handleReset} />;

  // Render Grid-based Placeholders and placed cards for a given column (2 items per row)
  const renderColumnItems = (colId: "A" | "B") => {
    const assignedCards = cards.filter(c => c.assigned === colId);
    
    return (
      <div className="absolute inset-x-0 inset-y-0 overflow-visible pointer-events-none px-2">
        {/* Render placeholder shapes in the background faintly */}
        {Array.from({ length: Math.max(6, Math.min(10, config.cards.length)) }).map((_, i) => {
           const row = Math.floor(i / 2);
           const col = i % 2;
           return (
           <div 
             key={`slot-${i}`} 
             className="absolute rounded-[12px] shrink-0"
             style={{ 
               width: 'calc(50% - 10px)',
               height: '90px',
               top: row * 100 + 16, 
               left: col === 0 ? '8px' : 'auto',
               right: col === 1 ? '8px' : 'auto',
               background: 'transparent',
               border: '1.5px solid rgba(0,0,0,0.05)',
               zIndex: 0
             }} 
           />
        )})}

        {/* Render actual assigned cards in the foreground */}
        {assignedCards.map((c, i) => {
          const row = Math.floor(i / 2);
          const col = i % 2;
          return (
          <motion.div
            key={c.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              x: c.status === "wrong" ? [-5, 5, -5, 5, 0] : 0, // Shake if wrong
            }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.5 }}
            className="absolute rounded-[12px] overflow-hidden"
            style={{ 
              width: 'calc(50% - 10px)',
              height: '90px',
              background: c.color,
              top: row * 100 + 16,
              left: col === 0 ? '8px' : 'auto',
              right: col === 1 ? '8px' : 'auto',
              zIndex: i + 1,
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
              pointerEvents: "auto",
            }}
            drag
            dragSnapToOrigin
            dragElastic={0.6}
            onDragEnd={(_, info) => {
              // Allows picking a card back up from a column and putting it in another column
              const dropX = info.point.x;
              const colTarget = document.getElementById(colId === "A" ? "col-B" : "col-A")?.getBoundingClientRect();
              
              if (colTarget && dropX >= colTarget.left && dropX <= colTarget.right) {
                assign(c.id, colId === "A" ? "B" : "A");
              }
            }}
            whileDrag={{
              scale: 1.05,
              zIndex: 50,
              boxShadow: "0 12px 24px -4px rgba(0, 0, 0, 0.1)",
            }}
          >
             <div className="absolute top-2 left-2 pr-2">
               <span className="text-[13px] font-bold text-black leading-tight text-left block" style={{ fontFamily: "Plus Jakarta Sans, system-ui", letterSpacing: "-0.01em" }}>
                 {c.label}
               </span>
             </div>
          </motion.div>
        )})}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden" style={{ background: "#FDFCFB" }}>
      {/* Header Titles */}
      <div className="flex justify-between items-start px-6 pt-6 pb-4">
        <div className="flex-1">
          <h1 className="text-[28px] font-black text-[#1C1917] leading-tight" style={{ fontFamily: "Plus Jakarta Sans, system-ui", letterSpacing: "-0.02em" }}>
            {config.columnA.label}
          </h1>
          <p className="text-[12px] font-medium text-[#44403C] mt-0.5 leading-tight">
            {config.columnA.description}
          </p>
        </div>
        <div className="flex-1 text-right">
          <h1 className="text-[28px] font-black text-[#1C1917] leading-tight" style={{ fontFamily: "Plus Jakarta Sans, system-ui", letterSpacing: "-0.02em" }}>
            {config.columnB.label}
          </h1>
          <p className="text-[12px] font-medium text-[#44403C] mt-0.5 leading-tight">
            {config.columnB.description}
          </p>
        </div>
      </div>

      {/* Drop Zone Columns */}
      <div className="flex gap-4 px-4 flex-1 min-h-0 mb-2 z-0 relative">
        {/* Column A */}
        <div
          id="col-A"
          className="flex-1 relative rounded-[16px] overflow-y-auto overflow-x-hidden"
          style={{ background: "#EBE8E3" }}
        >
          {renderColumnItems("A")}
        </div>

        {/* Column B */}
        <div
          id="col-B"
          className="flex-1 relative rounded-[16px] overflow-y-auto overflow-x-hidden"
          style={{ background: "#EBE8E3" }}
        >
          {renderColumnItems("B")}
        </div>
      </div>

      {/* Spacing & Counter */}
      {unassigned.length > 0 && (
        <div className="flex justify-center items-center gap-1.5 mt-2 mb-2 text-[#1C1917] font-black">
          <Layers size={16} strokeWidth={2.5} />
          <span className="text-[15px]">{unassigned.length}</span>
        </div>
      )}

      {/* Card Stack / Guess Button Area (shifted down so cards are half cut off) */}
      <div className="relative flex justify-center h-[140px] px-6 items-end mt-4">
        {unassigned.length > 0 ? (
          <div className="relative w-[130px] h-[200px] flex justify-center translate-y-[60px]">
            {[...unassigned].reverse().map((card, index) => {
              const isTop = index === unassigned.length - 1;
              const depth = unassigned.length - 1 - index;
              return (
                <DraggableCard
                  key={card.id}
                  card={card}
                  isTop={isTop}
                  depth={depth}
                  total={unassigned.length}
                  assign={assign}
                />
              );
            })}
          </div>
        ) : (
          <div className="w-full flex gap-4 items-center mb-6">
            <button
              onClick={handleCheck}
              className="flex-1 h-[60px] bg-[#1C1917] rounded-[30px] flex items-center justify-center relative active:scale-95 transition-transform"
            >
              <span className="text-white font-bold text-[18px]" style={{ fontFamily: "Plus Jakarta Sans, system-ui", letterSpacing: "-0.01em" }}>
                Guess
              </span>
              <div 
                className="absolute -top-1.5 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center font-black text-xs"
                style={{ border: "2px solid #1C1917", color: "#1C1917" }}
              >
                {Math.max(0, 5 - guesses)}
              </div>
            </button>

            <button
              onClick={handleHint}
              className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center relative active:scale-95 transition-transform shrink-0"
              style={{
                border: "2px solid #1C1917",
              }}
            >
              <span className="font-bold text-[#1C1917] text-[15px]" style={{ fontFamily: "Plus Jakarta Sans, system-ui", letterSpacing: "-0.01em" }}>
                Hint
              </span>
              <div 
                className="absolute -top-1.5 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center font-black text-xs"
                style={{ border: "2px solid #1C1917", color: "#1C1917" }}
              >
                {3 - hintsUsed}
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
