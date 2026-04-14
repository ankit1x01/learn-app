// src/games/components/ThisOrThat.tsx
import { useState, useRef, useEffect } from "react";
import { motion, useAnimation, PanInfo } from "motion/react";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { ThisOrThatConfig, GameResult } from "../types";
import { GameWinScreen } from "./GameWinScreen";

interface Props {
  config: ThisOrThatConfig;
}

type Assignment = "A" | "B" | null;

// Vivid card palette — each card gets a unique colour (Learned-app style)
const CARD_PALETTE = [
  "#4ADE80", // green
  "#FB923C", // orange
  "#A78BFA", // purple
  "#FCD34D", // yellow
  "#2DD4BF", // teal
  "#60A5FA", // blue
  "#F472B6", // pink
  "#A3E635", // lime
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

function DraggableCard({ card, assign, configA, configB }: any) {
  const controls = useAnimation();

  async function handleDragEnd(_: any, info: PanInfo) {
    const colA = document.getElementById("col-A")?.getBoundingClientRect();
    const colB = document.getElementById("col-B")?.getBoundingClientRect();

    const dropX = info.point.x;
    const dropY = info.point.y;

    const isInside = (rect: DOMRect | undefined) => {
      if (!rect) return false;
      return (
        dropX >= rect.left &&
        dropX <= rect.right &&
        dropY >= rect.top &&
        dropY <= rect.bottom
      );
    };

    if (isInside(colA)) {
      assign(card.id, "A");
    } else if (isInside(colB)) {
      assign(card.id, "B");
    } else {
      controls.start({ x: 0, y: 0 });
    }
  }

  return (
    <motion.div
      drag
      dragSnapToOrigin
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      animate={controls}
      whileHover={{ scale: 1.02 }}
      whileDrag={{
        scale: 1.05,
        zIndex: 50,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      className="flex items-center justify-between px-5 py-4 rounded-3xl cursor-grab active:cursor-grabbing relative bg-white border-[2.5px] border-black/5"
      style={{
        background: card.color,
        boxShadow: "0 4px 0 rgba(0,0,0,0.18), 0 8px 16px rgba(0,0,0,0.08)",
        touchAction: "none",
      }}
    >
      <div className="flex flex-col gap-0.5 opacity-40 px-1 py-1 rounded pointer-events-none absolute left-2">
        <div
          className="w-1 h-1 rounded-full"
          style={{ background: "#78716C" }}
        />
        <div
          className="w-1 h-1 rounded-full"
          style={{ background: "#78716C" }}
        />
        <div
          className="w-1 h-1 rounded-full"
          style={{ background: "#78716C" }}
        />
      </div>
      <span
        className="text-[14px] font-bold ml-4 pointer-events-none select-none"
        style={{
          color: "rgba(0,0,0,0.72)",
          fontFamily: "Plus Jakarta Sans, system-ui",
        }}
      >
        {card.label}
      </span>
      <div className="flex gap-2 pointer-events-none opacity-50">
        <span className="text-[10px] font-bold uppercase">Drag up</span>
      </div>
    </motion.div>
  );
}

export function ThisOrThat({ config }: Props) {
  const startTime = useRef(Date.now());
  const [cards, setCards] = useState<CardState[]>(
    config.cards.map((c, i) => ({
      ...c,
      assigned: null,
      status: "idle" as const,
      color: CARD_PALETTE[i % CARD_PALETTE.length],
    })),
  );
  const [guesses, setGuesses] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);

  const unassigned = cards.filter(
    (c) => c.status !== "correct" && c.assigned === null,
  );
  const colA = cards.filter((c) => c.status === "correct" && c.correct === "A");
  const colB = cards.filter((c) => c.status === "correct" && c.correct === "B");
  const pendingA = cards.filter(
    (c) => c.assigned === "A" && c.status !== "correct",
  );
  const pendingB = cards.filter(
    (c) => c.assigned === "B" && c.status !== "correct",
  );

  function assign(id: string, col: "A" | "B") {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, assigned: col, status: "idle" } : c,
      ),
    );
  }

  function handleCheck() {
    const allAssigned = cards
      .filter((c) => c.status !== "correct")
      .every((c) => c.assigned !== null);
    if (!allAssigned) return;

    const newGuesses = guesses + 1;
    setGuesses(newGuesses);

    const updated = cards.map((c) => {
      if (c.status === "correct") return c;
      if (c.assigned === c.correct) return { ...c, status: "correct" as const };
      return { ...c, status: "wrong" as const };
    });

    setCards(updated);

    setTimeout(() => {
      const reset = updated.map((c) =>
        c.status === "wrong"
          ? { ...c, status: "idle" as const, assigned: null }
          : c,
      );
      setCards(reset);

      const allCorrect = reset.every((c) => c.status === "correct");
      if (allCorrect) {
        const finalResult: GameResult = {
          gameType: "this-or-that",
          score: calcScore(reset, newGuesses),
          guesses: newGuesses,
          hintsUsed,
          timeMs: Date.now() - startTime.current,
        };
        config.onComplete?.(finalResult);
        setResult(finalResult);
      }
    }, 900);
  }

  function handleHint() {
    const unset = cards.find(
      (c) => c.assigned === null && c.status !== "correct",
    );
    if (!unset) return;
    setHintsUsed((h) => h + 1);
    assign(unset.id, unset.correct);
  }

  function handleReset() {
    setCards(
      config.cards.map((c, i) => ({
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

  if (result)
    return <GameWinScreen result={result} onPlayAgain={handleReset} />;

  const allPending = cards
    .filter((c) => c.status !== "correct")
    .every((c) => c.assigned !== null);

  return (
    <div className="flex flex-col h-full" style={{ background: "#F5F0E8" }}>
      {/* Sub-header */}
      <div className="px-4 py-3">
        <p
          className="text-[11px] font-semibold uppercase tracking-widest"
          style={{
            color: "#9CA3AF",
            fontFamily: "Plus Jakarta Sans, system-ui",
          }}
        >
          {config.subject}
        </p>
        <h2
          className="text-[20px] font-black text-[#1C1917] mt-0.5"
          style={{
            fontFamily: "Plus Jakarta Sans, system-ui",
            letterSpacing: "-0.02em",
          }}
        >
          {config.theme}
        </h2>
        {/* Attempt dots */}
        {guesses > 0 && (
          <div className="flex gap-1 mt-2">
            {Array.from({ length: guesses }, (_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: "#FEE2E2" }}
              >
                <XCircle size={10} color="#EF4444" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-3 px-4" id="this-that-columns">
        {(["A", "B"] as const).map((col) => {
          const cfg = col === "A" ? config.columnA : config.columnB;
          const correct = col === "A" ? colA : colB;
          const pending = col === "A" ? pendingA : pendingB;
          const colAccent = col === "A" ? "#14532D" : "#3730A3";
          const colBg = col === "A" ? "#F0FDF4" : "#EEF2FF";
          const colBorder = col === "A" ? "#BBF7D0" : "#C7D2FE";

          return (
            <div
              key={col}
              id={`col-${col}`}
              className="rounded-3xl p-4 min-h-[160px] relative transition-transform"
              style={{
                background: colBg,
                border: `2.5px solid ${colBorder}`,
                boxShadow: `0 6px 0 ${colBorder}`,
              }}
            >
              <p
                className="text-[14px] font-black mb-1"
                style={{
                  color: colAccent,
                  fontFamily: "Plus Jakarta Sans, system-ui",
                }}
              >
                {cfg.label}
              </p>
              <p
                className="text-[11px] mb-3"
                style={{
                  color: colAccent,
                  opacity: 0.75,
                  fontFamily: "Inter, system-ui",
                }}
              >
                {cfg.description}
              </p>

              <div className="flex flex-col gap-1.5">
                {/* Confirmed correct */}
                {correct.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl"
                    style={{
                      background: c.color,
                      boxShadow: "0 2px 0 rgba(0,0,0,0.14)",
                    }}
                  >
                    <CheckCircle size={11} color="rgba(0,0,0,0.45)" />
                    <span
                      className="text-[11px] font-bold"
                      style={{
                        color: "rgba(0,0,0,0.70)",
                        fontFamily: "Plus Jakarta Sans, system-ui",
                      }}
                    >
                      {c.label}
                    </span>
                  </div>
                ))}
                {/* Pending assigned */}
                {pending.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between px-2.5 py-2 rounded-xl"
                    style={{
                      background: c.status === "wrong" ? "#FEE2E2" : c.color,
                      border:
                        c.status === "wrong" ? "1.5px solid #FCA5A5" : "none",
                      boxShadow:
                        c.status === "wrong"
                          ? "none"
                          : "0 2px 0 rgba(0,0,0,0.14)",
                      opacity: c.status === "wrong" ? 0.8 : 1,
                    }}
                  >
                    <span
                      className="text-[11px] font-bold"
                      style={{
                        color:
                          c.status === "wrong" ? "#B91C1C" : "rgba(0,0,0,0.70)",
                        fontFamily: "Plus Jakarta Sans, system-ui",
                      }}
                    >
                      {c.label}
                    </span>
                    <button
                      onClick={() => assign(c.id, col === "A" ? "B" : "A")}
                      className="ml-1 opacity-50"
                    >
                      <XCircle size={12} color="#666" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Unassigned pool */}
      <div className="flex-1 overflow-y-auto px-4 pt-3">
        <p
          className="text-[11px] font-semibold uppercase tracking-wider mb-2"
          style={{
            color: "#9CA3AF",
            fontFamily: "Plus Jakarta Sans, system-ui",
          }}
        >
          Unsorted · {unassigned.length} left
        </p>
        <div className="flex flex-col gap-2">
          {unassigned.map((card) => (
            <DraggableCard
              key={card.id}
              card={card}
              assign={assign}
              configA={config.columnA}
              configB={config.columnB}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-4 py-4 flex gap-3"
        style={{ borderTop: "1px solid #E3DDD5" }}
      >
        <button
          onClick={handleHint}
          className="flex items-center gap-1.5 px-4 py-3 rounded-2xl text-[14px] font-bold active:translate-y-1 transition-transform"
          style={{
            background: "#F0EEE9",
            color: "#78716C",
            border: "2px solid #E3DDD5",
            boxShadow: "0 4px 0 #D4CFC8",
            fontFamily: "Plus Jakarta Sans, system-ui",
          }}
        >
          <HelpCircle size={18} />
          Hint
        </button>
        <button
          onClick={handleCheck}
          disabled={!allPending}
          className="flex-1 py-3 rounded-2xl text-[16px] font-black transition-all active:translate-y-1"
          style={{
            background: allPending ? "#1C1917" : "#E5E1DC",
            color: allPending ? "#FFFFFF" : "#A8A29E",
            fontFamily: "Plus Jakarta Sans, system-ui",
            boxShadow: allPending ? "0 4px 0 #44403C" : "0 4px 0 #D4CFC8",
          }}
        >
          Check
        </button>
      </div>
    </div>
  );
}
