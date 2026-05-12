'use client';

import { motion } from 'framer-motion';

interface LaserOverlayProps {
  elementId: string | null;
  color?: string;
  duration?: number;
}

/**
 * Laser pointer overlay component (adapted from OpenMAIC)
 * Features smooth animation with breathing glow effect
 */
export function LaserOverlay({
  elementId,
  color = '#ff3b30',
  duration: _duration = 3000,
}: LaserOverlayProps) {
  if (!elementId) return null;

  const element = document.getElementById(elementId);
  if (!element) return null;

  const rect = element.getBoundingClientRect();
  const parent = element.parentElement?.getBoundingClientRect();
  if (!parent) return null;

  const centerX = ((rect.left - parent.left + rect.width / 2) / parent.width) * 100;
  const centerY = ((rect.top - parent.top + rect.height / 2) / parent.height) * 100;

  const startPos = {
    x: centerX > 50 ? 105 : -5,
    y: centerY > 50 ? 105 : -5,
  };

  return (
    <motion.div
      key={`laser-${elementId}`}
      initial={{
        opacity: 0,
        left: `${startPos.x}%`,
        top: `${startPos.y}%`,
      }}
      animate={{
        opacity: 1,
        left: `${centerX}%`,
        top: `${centerY}%`,
      }}
      exit={{
        opacity: 0,
        left: `${startPos.x}%`,
        top: `${startPos.y}%`,
        transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
      }}
      transition={{
        left: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        top: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.15 },
      }}
      className="absolute z-[101] pointer-events-none"
      style={{ position: 'absolute' }}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        {/* Ring pulse */}
        <motion.div
          animate={{ scale: [1, 2.8], opacity: [0.6, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'easeOut',
            repeatDelay: 0.3,
          }}
          className="absolute inset-0 rounded-full"
          style={{ border: `1.5px solid ${color}` }}
        />

        {/* Light core */}
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 8px 2px ${color}60`,
          }}
        />
      </div>
    </motion.div>
  );
}
