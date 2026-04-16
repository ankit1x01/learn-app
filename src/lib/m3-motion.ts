/**
 * M3 Expressive Spring Presets for Framer Motion / motion/react
 *
 * Source: M3 Expressive Motion Theming
 * https://m3.material.io/blog/m3-expressive-motion-theming
 *
 * Conversion: FM damping = damping_ratio × 2 × √stiffness
 *
 * SPATIAL  — animate position, size, shape. Overshoot (bounce) allowed.
 * EFFECTS  — animate opacity, color, blur. MUST be critically damped (no bounce).
 *
 * Two schemes:
 *   EXPRESSIVE — playful, bouncy (default for CHITTA interactive elements)
 *   STANDARD   — subtle, professional (content transitions, background changes)
 */

// ── Expressive Scheme ────────────────────────────────────────────────────────

/** Modals, expanding cards, bottom sheets — default spatial motion */
export const m3SpatialDefault = {
  type: "spring" as const,
  stiffness: 380,
  damping: 31,   // ratio 0.8
  mass: 1,
};

/** Nav indicator, icon fills, toggles — fast, slightly bouncy */
export const m3SpatialFast = {
  type: "spring" as const,
  stiffness: 800,
  damping: 34,   // ratio 0.6 — most expressive
  mass: 1,
};

/** Full-screen transitions, large containers */
export const m3SpatialSlow = {
  type: "spring" as const,
  stiffness: 200,
  damping: 23,   // ratio 0.8
  mass: 1,
};

/**
 * Opacity, color, blur, filter animations.
 * Critically damped (ratio 1.0) — zero overshoot.
 */
export const m3EffectsEase = {
  type: "spring" as const,
  stiffness: 1600,
  damping: 80,   // ratio 1.0
  mass: 1,
};

export const m3EffectsFast = {
  type: "spring" as const,
  stiffness: 3200,
  damping: 113,  // ratio 1.0
  mass: 1,
};

export const m3EffectsSlow = {
  type: "spring" as const,
  stiffness: 800,
  damping: 57,   // ratio 1.0
  mass: 1,
};

// ── Standard Scheme (less expressive) ───────────────────────────────────────

export const m3StandardSpatialDefault = {
  type: "spring" as const,
  stiffness: 700,
  damping: 48,   // ratio 0.9
  mass: 1,
};

export const m3StandardSpatialFast = {
  type: "spring" as const,
  stiffness: 1400,
  damping: 67,   // ratio 0.9
  mass: 1,
};

export const m3StandardSpatialSlow = {
  type: "spring" as const,
  stiffness: 300,
  damping: 31,   // ratio 0.9
  mass: 1,
};

// ── Duration constants (seconds, for non-spring transitions) ────────────────

export const M3Duration = {
  short1:  0.050,
  short2:  0.100,
  short3:  0.150,
  short4:  0.200,
  medium1: 0.250,
  medium2: 0.300,
  medium3: 0.350,
  medium4: 0.400,
  long1:   0.450,
  long2:   0.500,
  long3:   0.550,
  long4:   0.600,
} as const;
