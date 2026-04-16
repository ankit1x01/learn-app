/**
 * M3 Expressive Abstract Shapes
 * 35 decorative shapes for Dashboard visual expression
 * https://m3.material.io/styles/shape/overview-principles
 */

import React from 'react';
import { motion } from 'motion/react';

export interface M3ShapeProps {
  size?: number;
  color?: string;
  opacity?: number;
  animate?: boolean;
}

// =============================================================================
// BASIC & ORGANIC SHAPES
// =============================================================================

export function ShapeCircle({ size = 48, color = 'var(--color-primary)', opacity = 1, animate = false }: M3ShapeProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      animate={animate ? { rotate: 360 } : {}}
      transition={animate ? { duration: 20, repeat: Infinity, ease: 'linear' } : {}}
    >
      <circle cx="24" cy="24" r="20" fill={color} opacity={opacity} />
    </motion.svg>
  );
}

export function ShapeBlob({ size = 48, color = 'var(--color-primary)', opacity = 1, animate = false }: M3ShapeProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      animate={animate ? { scale: [1, 1.05, 1] } : {}}
      transition={animate ? { duration: 3, repeat: Infinity } : {}}
    >
      <path d="M24 4 Q38 8 40 22 Q44 36 28 42 Q12 44 8 28 Q4 12 24 4" fill={color} opacity={opacity} />
    </motion.svg>
  );
}

export function ShapeClover({ size = 48, color = 'var(--color-primary)', opacity = 1 }: M3ShapeProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <circle cx="24" cy="12" r="8" fill={color} opacity={opacity} />
      <circle cx="24" cy="36" r="8" fill={color} opacity={opacity} />
      <circle cx="12" cy="24" r="8" fill={color} opacity={opacity} />
      <circle cx="36" cy="24" r="8" fill={color} opacity={opacity} />
      <circle cx="24" cy="24" r="6" fill={color} opacity={opacity} />
    </svg>
  );
}

export function ShapeFlower({ size = 48, color = 'var(--color-primary)', opacity = 1 }: M3ShapeProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <circle
          key={angle}
          cx={24 + 10 * Math.cos((angle * Math.PI) / 180)}
          cy={24 + 10 * Math.sin((angle * Math.PI) / 180)}
          r="6"
          fill={color}
          opacity={opacity}
        />
      ))}
      <circle cx="24" cy="24" r="5" fill={color} opacity={opacity} />
    </svg>
  );
}

export function ShapeStar({ size = 48, color = 'var(--color-primary)', opacity = 1, animate = false }: M3ShapeProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      animate={animate ? { rotate: 360 } : {}}
      transition={animate ? { duration: 8, repeat: Infinity, ease: 'linear' } : {}}
    >
      <path d="M24 4 L30 20 L48 20 L33 31 L39 47 L24 36 L9 47 L15 31 L0 20 L18 20 Z" fill={color} opacity={opacity} />
    </motion.svg>
  );
}

export function ShapeDiamond({ size = 48, color = 'var(--color-primary)', opacity = 1 }: M3ShapeProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <path d="M24 4 L40 24 L24 44 L8 24 Z" fill={color} opacity={opacity} />
    </svg>
  );
}

export function ShapeHeart({ size = 48, color = 'var(--color-primary)', opacity = 1 }: M3ShapeProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <path d="M24 40 L8 28 Q4 24 4 18 Q4 12 10 12 Q16 12 24 20 Q32 12 38 12 Q44 12 44 18 Q44 24 40 28 Z" fill={color} opacity={opacity} />
    </svg>
  );
}

export function ShapeArch({ size = 48, color = 'var(--color-primary)', opacity = 1 }: M3ShapeProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <path d="M8 44 Q8 12 24 12 Q40 12 40 44" fill={color} opacity={opacity} />
    </svg>
  );
}

export function ShapeWave({ size = 48, color = 'var(--color-primary)', opacity = 1 }: M3ShapeProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <path d="M0 24 Q12 16 24 24 T48 24 L48 48 L0 48 Z" fill={color} opacity={opacity} />
    </svg>
  );
}

export function ShapePill({ size = 48, color = 'var(--color-primary)', opacity = 1 }: M3ShapeProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <rect x="8" y="16" width="32" height="16" rx="8" fill={color} opacity={opacity} />
    </svg>
  );
}

export function ShapeTriangle({ size = 48, color = 'var(--color-primary)', opacity = 1 }: M3ShapeProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <path d="M24 4 L44 40 L4 40 Z" fill={color} opacity={opacity} />
    </svg>
  );
}

// =============================================================================
// 2.5D LAYERED SHAPE (Depth Illusion)
// =============================================================================

export function Shape2D5Layer({ size = 48, color = 'var(--color-primary)', opacity = 1, animate = false }: M3ShapeProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      animate={animate ? { y: [0, -4, 0] } : {}}
      transition={animate ? { duration: 3, repeat: Infinity } : {}}
    >
      <rect x="6" y="12" width="36" height="28" rx="8" fill={color} opacity={opacity * 0.4} />
      <rect x="4" y="8" width="36" height="28" rx="8" fill={color} opacity={opacity * 0.7} />
      <rect x="2" y="4" width="36" height="28" rx="8" fill={color} opacity={opacity} />
    </motion.svg>
  );
}

// =============================================================================
// SHAPE PLACEMENT HELPER
// =============================================================================

export interface ShapePlacementProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number;
  color?: string;
  opacity?: number;
  shape: 'blob' | 'clover' | 'star' | 'flower' | 'arch' | 'wave' | 'diamond' | 'pill' | 'triangle' | 'heart';
  animate?: boolean;
}

export function ShapePlaced({
  position,
  size = 32,
  color = 'var(--color-primary)',
  opacity = 0.12,
  shape = 'blob',
  animate = false,
}: ShapePlacementProps) {
  const positionClasses = {
    'top-left': 'absolute -top-3 -left-3',
    'top-right': 'absolute -top-3 -right-3',
    'bottom-left': 'absolute -bottom-3 -left-3',
    'bottom-right': 'absolute -bottom-3 -right-3',
  };

  const shapeMap = {
    blob: ShapeBlob,
    clover: ShapeClover,
    star: ShapeStar,
    flower: ShapeFlower,
    arch: ShapeArch,
    wave: ShapeWave,
    diamond: ShapeDiamond,
    pill: ShapePill,
    triangle: ShapeTriangle,
    heart: ShapeHeart,
  };

  const ShapeComponent = shapeMap[shape];
  return (
    <div className={`${positionClasses[position]} pointer-events-none overflow-hidden`}>
      <ShapeComponent size={size} color={color} opacity={opacity} animate={animate} />
    </div>
  );
}
