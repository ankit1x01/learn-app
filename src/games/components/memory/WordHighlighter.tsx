import React from "react";
import { motion } from "motion/react";

export interface WordHighlighterProps {
  text: string;
  currentWordIndex: number;
  isPlaying: boolean;
  focusStrength?: number; // optional (0–1)
}

export function WordHighlighter({
  text,
  currentWordIndex,
  isPlaying,
  focusStrength = 0.6,
}: WordHighlighterProps) {
  const words = React.useMemo(() => text.split(/\s+/), [text]);

  return (
    <div className="w-full max-w-5xl mx-auto p-8 bg-surface-container-low rounded-2xl flex items-center justify-center min-h-[140px] overflow-hidden">
      <div className="flex flex-wrap justify-center items-center gap-2 text-center">
        {words.map((word, index) => {
          const distance = Math.abs(index - currentWordIndex);
          const isActive = index === currentWordIndex;

          // 🧠 attention falloff
          const opacity = isActive
            ? 1
            : distance === 1
            ? 0.6
            : 0.25;

          const blur = isActive ? 0 : distance * 1.5;

          const scale = isActive
            ? 1 + focusStrength * 0.3
            : 1 - Math.min(distance * 0.05, 0.2);

          return (
            <motion.span
              key={index}
              animate={{
                scale,
                opacity,
                filter: `blur(${blur}px)`,
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              className={`text-body-large md:text-headline-small font-semibold ${
                isActive ? "text-primary" : "text-on-surface-variant"
              }`}
              style={{
                transformOrigin: "center",
              }}
            >
              {word}
            </motion.span>
          );
        })}
      </div>

      {/* 🎧 pulse glow (active word emphasis) */}
      {isPlaying && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background:
              "radial-gradient(circle at center, rgba(0,229,255,0.15), transparent 70%)",
          }}
        />
      )}
    </div>
  );
}