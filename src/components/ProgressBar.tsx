import { motion } from 'motion/react';
import { m3EffectsEase } from '../lib/m3-motion';

export interface ProgressBarProps {
  value: number; // 0-100
  variant?: 'linear' | 'indeterminate';
  size?: 'sm' | 'md';
  label?: string;
  position?: 'top' | 'bottom';
}

/**
 * M3 Expressive Progress Bar
 * Used for visible progress or indeterminate waits
 */
export function ProgressBar({ value, variant = 'linear', size = 'md', label, position = 'top' }: ProgressBarProps) {
  const heightMap = {
    sm: 'h-1',
    md: 'h-2',
  };

  const progressBar = (
    <div className={`w-full ${heightMap[size]} rounded-full overflow-hidden`} style={{ background: 'var(--color-on-surface)', opacity: 0.12 }}>
      {variant === 'linear' ? (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={m3EffectsEase}
          className="h-full rounded-full"
          style={{ background: 'var(--color-primary)' }}
        />
      ) : (
        <motion.div
          animate={{
            x: ['0%', '100%', '-100%'],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="h-full w-1/3 rounded-full"
          style={{ background: 'var(--color-primary)' }}
        />
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
      {label && <p className="text-xs font-semibold" style={{ color: 'var(--color-on-surface-variant)' }}>{label}</p>}
      {position === 'top' && progressBar}
      {label && !position && progressBar}
      {position === 'bottom' && progressBar}
    </div>
  );
}

/**
 * Linear progress bar positioned at screen top
 * Can be used for app-level loading states
 */
export function LinearProgressTop({ value, show }: { value: number; show: boolean }) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <ProgressBar value={value} variant="linear" size="sm" position="top" />
    </motion.div>
  );
}
