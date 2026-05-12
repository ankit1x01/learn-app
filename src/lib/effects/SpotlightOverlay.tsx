'use client';

import { useRef, useState, useLayoutEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpotlightRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface SpotlightOverlayProps {
  elementId: string | null;
  dimness?: number;
}

/**
 * Spotlight overlay component (adapted from OpenMAIC)
 * Uses SVG mask for professional spotlight effect with smooth animations
 */
export function SpotlightOverlay({ elementId, dimness = 0.7 }: SpotlightOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<SpotlightRect | null>(null);

  const measure = useCallback(() => {
    if (!elementId || !containerRef.current) {
      setRect(null);
      return;
    }

    const domElement = document.getElementById(elementId);
    if (!domElement) {
      setRect(null);
      return;
    }

    const contentEl = domElement.querySelector('.element-content') || domElement;
    const containerRect = containerRef.current.getBoundingClientRect();
    const targetRect = contentEl.getBoundingClientRect();

    if (containerRect.width === 0 || containerRect.height === 0) {
      setRect(null);
      return;
    }

    // Convert to percentage coordinates
    setRect({
      x: ((targetRect.left - containerRect.left) / containerRect.width) * 100,
      y: ((targetRect.top - containerRect.top) / containerRect.height) * 100,
      w: (targetRect.width / containerRect.width) * 100,
      h: (targetRect.height / containerRect.height) * 100,
    });
  }, [elementId]);

  useLayoutEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const active = !!elementId && !!rect;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-[100] pointer-events-none overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {active && rect && (
          <motion.div
            key={`spotlight-${elementId}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0"
            >
              <defs>
                <mask id={`mask-${elementId}`}>
                  <rect x="0" y="0" width="100" height="100" fill="white" />
                  <motion.rect
                    fill="black"
                    initial={{
                      x: rect.x - 8,
                      y: rect.y - 8,
                      width: rect.w + 16,
                      height: rect.h + 16,
                      rx: 4,
                    }}
                    animate={{
                      x: rect.x - 0.4,
                      y: rect.y - 0.6,
                      width: rect.w + 0.8,
                      height: rect.h + 1.2,
                      rx: 1,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                </mask>
              </defs>

              <rect
                width="100"
                height="100"
                fill={`rgba(0,0,0,${dimness})`}
                mask={`url(#mask-${elementId})`}
              />

              <motion.rect
                initial={{
                  x: rect.x - 4,
                  y: rect.y - 4,
                  width: rect.w + 8,
                  height: rect.h + 8,
                  opacity: 0,
                  rx: 2,
                }}
                animate={{
                  x: rect.x - 0.4,
                  y: rect.y - 0.6,
                  width: rect.w + 0.8,
                  height: rect.h + 1.2,
                  opacity: 1,
                  rx: 1,
                }}
                fill="none"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1.2"
                style={{ vectorEffect: 'non-scaling-stroke' } as React.CSSProperties}
                transition={{
                  duration: 0.5,
                  delay: 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
