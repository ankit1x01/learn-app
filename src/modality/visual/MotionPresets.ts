/**
 * MotionPresets — named Framer Motion animation variants.
 * Import these into any game primitive instead of writing
 * animation objects inline. Changing here fixes all games.
 */

import type { Variants, Transition } from 'motion/react'

// ─── Feedback flashes ────────────────────────────────────────────────────────

export const correctFlash: Variants = {
  idle: { scale: 1, backgroundColor: 'var(--color-idle, #ffffff)' },
  flash: {
    scale: [1, 1.08, 1],
    backgroundColor: ['#ffffff', '#DCFCE7', '#ffffff'],
    transition: { duration: 0.35, ease: 'easeOut' },
  },
}

export const wrongShake: Variants = {
  idle: { x: 0, backgroundColor: 'var(--color-idle, #ffffff)' },
  shake: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    backgroundColor: ['#ffffff', '#FEE2E2', '#ffffff'],
    transition: { duration: 0.45, ease: 'easeInOut' },
  },
}

// ─── Card entrance/exit ──────────────────────────────────────────────────────

export const cardEntrance: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 28 },
  },
  exit: {
    opacity: 0, y: -16, scale: 0.95,
    transition: { duration: 0.18 },
  },
}

export const cardPop: Variants = {
  idle: { scale: 1 },
  pop: {
    scale: [1, 1.12, 0.96, 1.04, 1],
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

// ─── Drag states ─────────────────────────────────────────────────────────────

export const draggableItem: Variants = {
  idle: { scale: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  dragging: {
    scale: 1.06,
    boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
    zIndex: 50,
  },
}

export const dropZoneHighlight: Variants = {
  idle: { borderColor: '#E8E5DF', backgroundColor: '#FAFAF9' },
  active: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
    scale: 1.02,
    transition: { duration: 0.15 },
  },
  accepted: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
    scale: [1.02, 1.05, 1],
    transition: { duration: 0.3 },
  },
  rejected: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
    x: [0, -4, 4, -3, 3, 0],
    transition: { duration: 0.3 },
  },
}

// ─── Timer bar ───────────────────────────────────────────────────────────────

export const timerBarTransition: Transition = {
  duration: 1,
  ease: 'linear',
}

// ─── Score pop ───────────────────────────────────────────────────────────────

export const scorePopUp: Variants = {
  hidden: { opacity: 0, y: 0, scale: 0.8 },
  visible: {
    opacity: [0, 1, 1, 0],
    y: [0, -20, -30, -40],
    scale: [0.8, 1.1, 1.0, 0.9],
    transition: { duration: 0.9, ease: 'easeOut' },
  },
}

// ─── Stagger container ───────────────────────────────────────────────────────

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
}

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 380, damping: 26 },
  },
}
