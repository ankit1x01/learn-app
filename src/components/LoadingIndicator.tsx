import { motion } from 'motion/react';
import { m3SpatialDefault } from '../lib/m3-motion';

export interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  fullscreen?: boolean;
  message?: string;
}

/**
 * M3 Expressive Loading Indicator (circular spinner)
 * Used for short-wait operations and full-screen loading states
 */
export function LoadingIndicator({ size = 'md', fullscreen = false, message }: LoadingIndicatorProps) {
  const sizeMap = {
    sm: { outer: 32, inner: 28, width: 3 },
    md: { outer: 48, inner: 42, width: 4 },
    lg: { outer: 64, inner: 56, width: 5 },
  };

  const dim = sizeMap[size];

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      <svg width={dim.outer} height={dim.outer} viewBox={`0 0 ${dim.outer} ${dim.outer}`}>
        {/* Background track */}
        <circle
          cx={dim.outer / 2}
          cy={dim.outer / 2}
          r={dim.inner / 2}
          fill="none"
          stroke="var(--color-on-surface)"
          strokeWidth={dim.width}
          opacity="0.12"
        />

        {/* Animated spinner */}
        <motion.circle
          cx={dim.outer / 2}
          cy={dim.outer / 2}
          r={dim.inner / 2}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={dim.width}
          strokeDasharray={`${(dim.inner / 2) * Math.PI * 0.75} ${(dim.inner / 2) * Math.PI}`}
          strokeLinecap="round"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ transformOrigin: `${dim.outer / 2}px ${dim.outer / 2}px` }}
        />
      </svg>
      {message && <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{message}</p>}
    </div>
  );

  if (fullscreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={m3SpatialDefault}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: 'rgba(0, 0, 0, 0.32)' }}
      >
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          {spinnerContent}
        </div>
      </motion.div>
    );
  }

  return spinnerContent;
}
