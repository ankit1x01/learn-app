# Material 3 Expressive Guidelines for CHITTA
> **Integration Guide:** How to blend Google's M3 Expressive update (May 2025) with CHITTA's cognitive-science-based `DESIGN_SYSTEM.md`.

## 1. Core Philosophy: Emotion-Driven but Distraction-Free
M3 Expressive is about designing with emotion, adding vibrant colors, intuitive motion, and flexible typography. For CHITTA (a NEET exam prep app), we must apply these expressive principles carefully to **enhance focus and motivation** without causing cognitive overload or violating our Warm Light theme.

## 2. Shape System & Tension
M3 introduces 35 new shapes and emphasizes "Shape Tension" (mixing round and sharp edges).
*   **Scale Updates**: 
    *   Large: `rounded-2xl` (20dp)
    *   Extra Large: `rounded-3xl` (32dp)
    *   Extra Extra Large: `rounded-[48px]`
*   **Applying Tension**: Mix soft, rounded cards (`rounded-3xl`) with sharply squared-off inner components (`rounded-sm`) to draw attention to critical elements (e.g., the correct answer in a quiz or an FSRS interval change).
*   **Shape Morphing**: Animate borders on interaction. As a user long-presses to reveal a hint, morph from a strictly unified oval to an asymmetric shape. 
*   *Limitation*: Use abstract shapes **sparingly** and only for decorative hero moments (e.g., onboarding, session complete screen).

## 3. Motion Physics (Springs)
M3 Expressive replaces traditional easing with "Springs" driven by Stiffness, Damping, and Initial Velocity.
*   **Spatial Movement (Bouncing)**: Use spatial springs for things moving on the screen (modals, expanding cards). These should overshoot their final value slightly and bounce into place.
    *   *Tailwind implementation*: Use a custom cubic-bezier (e.g., `ease-[cubic-bezier(0.175,0.885,0.32,1.275)]`) or Framer Motion springs (`type: "spring", stiffness: 300, damping: 20`) for bottom sheets and drawers.
*   **Effects Movement (No Bounce)**: Use effect springs for opacity and color fades. These must ease smoothly without overshooting.
*   **Speeds**: 
    *   `Fast`: Buttons, switches, micro-interactions.
    *   `Default`: Bottom sheets, expanded nav rails.
    *   `Slow`: Full-screen transitions.

## 4. Upgraded Components
*   **Toolbars & Split Buttons**: Consolidate repetitive actions (like tags, bookmarking, marking as "doubt") into floating M3 Expressive toolbars. 
*   **Progress Indicators**: Move beyond flat progress bars. Use waveform or thicker, styled progress indicators during study sessions to make "Exp gain" or "Stage advancement" feel more rewarding.
*   **Button Groups**: For selecting confidence levels (e.g., FSRS rating: Again, Hard, Good, Easy), use dynamic button groups that bump and physically react to each other upon selection.

## 5. 2.5D Depth Layering
Make 2D visuals feel 3D by applying differing motion delays or shadow adjustments on each visual layer. In CHITTA, when a user enters "ExamReady" or "God Mode", apply a 2.5D parallax drop shadow to the active question card.

## Implementation Checklist for React+Tailwind

**Extend `tailwind.config.js`:**
```javascript
theme: {
  extend: {
    borderRadius: {
      'm3-lg': '1.25rem',  // 20px
      'm3-xl': '2rem',     // 32px
      'm3-2xl': '3rem',    // 48px
    },
    transitionTimingFunction: {
      'm3-spatial': 'cubic-bezier(0.175, 0.885, 0.32, 1.2)', // Expressive bounce
      'm3-effects': 'cubic-bezier(0.4, 0, 0.2, 1)',          // Smooth color/opacity fade
    }
  }
}
```

**Framer Motion Spring Presets:**
```javascript
export const m3SpatialSpring = {
  type: "spring",
  stiffness: 400,
  damping: 25,
  mass: 1,
};

export const m3EffectsEase = {
  type: "tween",
  ease: [0.4, 0, 0.2, 1],
  duration: 0.2,
};
```