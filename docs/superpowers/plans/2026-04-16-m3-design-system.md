# M3 Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the full Material Design 3 (M3) Expressive design system across every component and screen in the CHITTA app, switching primary from blue (#2563EB) to M3 Focus Violet (#6750A4), correcting spring presets, shape scale, and surface token hierarchy.

**Architecture:** Foundation layer first (CSS tokens + motion presets), then shared components (BottomNav, ContentSheet, badges), then core screens (Dashboard, DemoSession), then all remaining screens. Each task is self-contained — apply M3 tokens, correct shape radii, replace hardcoded colors with CSS variables.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4 (via @theme in index.css), motion/react (Framer Motion v12), Lucide React icons, M3 Expressive springs.

**M3 Primary Color:** `#6750A4` (Focus Violet) — this is the M3 Baseline default and maps perfectly to CHITTA's "intelligence + trust" brand.

**Spring Conversion (M3 damping ratio → Framer Motion absolute damping):**
Formula: `damping = damping_ratio × 2 × √stiffness`

| Preset | Stiffness | Damping Ratio | FM Damping |
|---|---|---|---|
| Expressive Default Spatial | 380 | 0.8 | 31 |
| Expressive Fast Spatial | 800 | 0.6 | 34 |
| Expressive Slow Spatial | 200 | 0.8 | 23 |
| Expressive Default Effects | 1600 | 1.0 | 80 |
| Expressive Fast Effects | 3200 | 1.0 | 113 |
| Expressive Slow Effects | 800 | 1.0 | 57 |

---

## Task 1: Foundation — Update CSS Design Tokens (src/index.css)

**Files:**
- Modify: `src/index.css`

Changes needed:
1. Fix shape scale: `--radius-m3-md` must be 12px (M3 spec = 12dp, not 16dp); `--radius-m3-xl` must be 28px (not 32dp)
2. Add full M3 surface container hierarchy (5 levels)
3. Add missing color roles (on-primary-container, secondary, on-secondary, secondary-container, on-secondary-container)
4. Add M3 typography CSS variables for the full type scale
5. Add M3 spacing tokens (4dp grid)
6. Add M3 duration tokens
7. Fix `.btn-primary` to use `var(--color-primary)` instead of hardcoded `#2563EB`
8. Fix `.btn-primary` border-radius to pill (9999px) per M3 filled button spec
9. Add new utility classes: `.surface-container-low`, `.surface-container`, `.surface-container-high`

- [ ] **Step 1: Fix shape scale tokens and add surface containers**

Replace the `@theme` block in `src/index.css` with:

```css
@theme {
  --font-ui:      "Roboto", system-ui, sans-serif;
  --font-body:    "Roboto", system-ui, sans-serif;

  /* ── M3 Shape Scale (exact dp values) ── */
  --radius-m3-none:  0px;
  --radius-m3-xs:    4px;     /* Extra Small */
  --radius-m3-sm:    8px;     /* Small */
  --radius-m3-md:    12px;    /* Medium — 12dp spec (was 16, incorrect) */
  --radius-m3-lg:    16px;    /* Large */
  --radius-m3-xl:    28px;    /* Extra Large — 28dp spec (was 32, incorrect) */
  --radius-m3-2xl:   48px;    /* Extra Extra Large */
  --radius-m3-full:  9999px;  /* Full / Pill */

  /* ── M3 Core Easing ── */
  --ease-m3-standard:              cubic-bezier(0.2, 0.0, 0, 1.0);
  --ease-m3-standard-accelerate:   cubic-bezier(0.3, 0.0, 1, 1.0);
  --ease-m3-standard-decelerate:   cubic-bezier(0.0, 0.0, 0, 1.0);
  --ease-m3-emphasized:            cubic-bezier(0.2, 0.0, 0, 1.0);
  --ease-m3-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1.0);
  --ease-m3-emphasized-accelerate: cubic-bezier(0.3, 0.0, 0.8, 0.15);

  /* ── M3 Duration Tokens ── */
  --duration-short1: 50ms;
  --duration-short2: 100ms;
  --duration-short3: 150ms;
  --duration-short4: 200ms;
  --duration-medium1: 250ms;
  --duration-medium2: 300ms;
  --duration-medium3: 350ms;
  --duration-medium4: 400ms;
  --duration-long1: 450ms;
  --duration-long2: 500ms;
  --duration-long3: 550ms;
  --duration-long4: 600ms;

  /* ── M3 Spacing (4dp grid) ── */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-14: 56px;
  --space-16: 64px;

  /* ── M3 Elevations (Shadows) ── */
  --shadow-elevation-0: none;
  --shadow-elevation-1: 0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15);
  --shadow-elevation-2: 0px 1px 2px 0px rgba(0,0,0,0.3), 0px 2px 6px 2px rgba(0,0,0,0.15);
  --shadow-elevation-3: 0px 1px 3px 0px rgba(0,0,0,0.3), 0px 4px 8px 3px rgba(0,0,0,0.15);
  --shadow-elevation-4: 0px 2px 3px 0px rgba(0,0,0,0.3), 0px 6px 10px 4px rgba(0,0,0,0.15);
  --shadow-elevation-5: 0px 4px 4px 0px rgba(0,0,0,0.3), 0px 8px 12px 6px rgba(0,0,0,0.15);

  /* ── M3 Background & Surface ── */
  --color-background:                  #FFFBFE;
  --color-on-background:               #1C1B1F;
  --color-surface:                     #FFFBFE;
  --color-on-surface:                  #1C1B1F;
  --color-surface-variant:             #E7E0EC;
  --color-on-surface-variant:          #49454F;

  /* M3 Surface Container Family (replaces opacity overlay model) */
  --color-surface-container-lowest:    #FFFFFF;
  --color-surface-container-low:       #F7F2FA;
  --color-surface-container:           #F3EDF7;
  --color-surface-container-high:      #ECE6F0;
  --color-surface-container-highest:   #E6E0E9;

  --color-surface-dim:                 #DED8E1;
  --color-surface-bright:              #FDFBFF;

  /* ── M3 Outline ── */
  --color-border:                      #CAC4D0;  /* Outline Variant */
  --color-outline:                     #79747E;  /* Outline */

  /* ── M3 Primary (Focus Violet) ── */
  --color-primary:                     #6750A4;
  --color-on-primary:                  #FFFFFF;
  --color-primary-container:           #EADDFF;
  --color-on-primary-container:        #21005D;
  --color-primary-border:              #D0BCFF;
  --color-inverse-primary:             #D0BCFF;

  /* ── M3 Secondary ── */
  --color-secondary:                   #625B71;
  --color-on-secondary:                #FFFFFF;
  --color-secondary-container:         #E8DEF8;
  --color-on-secondary-container:      #1D192B;

  /* ── M3 Tertiary (Excellence) ── */
  --color-excellence:                  #7D5260;
  --color-on-excellence:               #FFFFFF;
  --color-excellence-container:        #FFD8E4;
  --color-on-excellence-container:     #31111D;

  /* ── M3 Error ── */
  --color-error:                       #B3261E;
  --color-on-error:                    #FFFFFF;
  --color-error-container:             #F9DEDC;
  --color-on-error-container:          #410E0B;

  /* ── Semantic Extensions (CHITTA-specific) ── */
  --color-success:                     #146C2E;
  --color-on-success:                  #FFFFFF;
  --color-success-container:           #C4F6C7;
  --color-on-success-container:        #064215;
  --color-warning:                     #8C5000;
  --color-on-warning:                  #FFFFFF;
  --color-warning-container:           #FFDCBB;
  --color-on-warning-container:        #4A2800;

  /* ── M3 Text Hierarchy (aliases for clarity) ── */
  --color-on-surface-2:                #322F35;
  --color-on-surface-muted:            #79747E;

  /* ── Scrim ── */
  --color-scrim:                       rgba(0,0,0,0.32);
}
```

- [ ] **Step 2: Fix .btn-primary and add surface utilities in @layer components**

Replace the `@layer components` block:

```css
@layer components {

  /* ── Card: M3 Filled Card (Surface Container Highest, Level 0) ── */
  .card {
    background: var(--color-surface-container-lowest);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-m3-md);
    box-shadow: var(--shadow-elevation-0);
  }

  /* ── Card Elevated: M3 Elevated Card (Surface, Level 1) ── */
  .card-elevated {
    background: var(--color-surface-container-low);
    border-radius: var(--radius-m3-md);
    box-shadow: var(--shadow-elevation-1);
  }

  /* ── Card Outlined: M3 Outlined Card ── */
  .card-outlined {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-m3-md);
    box-shadow: var(--shadow-elevation-0);
  }

  /* ── Primary Filled Button (M3 spec: Full radius pill, 40dp height) ── */
  .btn-primary {
    height: 40px;
    padding: 0 24px;
    border-radius: var(--radius-m3-full);
    font-family: var(--font-ui);
    font-weight: 500;
    font-size: 14px;
    letter-spacing: 0.1px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background var(--duration-short4) var(--ease-m3-standard),
                box-shadow var(--duration-short4) var(--ease-m3-standard),
                transform var(--duration-short3) var(--ease-m3-standard);
    background: var(--color-primary);
    color: var(--color-on-primary);
    border: none;
    cursor: pointer;
    box-shadow: var(--shadow-elevation-0);
  }
  .btn-primary:hover  {
    background: color-mix(in srgb, var(--color-primary) 92%, var(--color-on-primary) 8%);
    box-shadow: var(--shadow-elevation-1);
  }
  .btn-primary:active { transform: scale(0.98); box-shadow: var(--shadow-elevation-0); }

  /* Full-width variant for bottom CTAs */
  .btn-primary-full {
    width: 100%;
    height: 56px;
    padding: 0 24px;
    border-radius: var(--radius-m3-full);
    font-family: var(--font-ui);
    font-weight: 500;
    font-size: 16px;
    letter-spacing: 0.1px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: var(--color-primary);
    color: var(--color-on-primary);
    border: none;
    cursor: pointer;
    box-shadow: var(--shadow-elevation-0);
    transition: background var(--duration-short4) var(--ease-m3-standard),
                box-shadow var(--duration-short4) var(--ease-m3-standard),
                transform var(--duration-short3) var(--ease-m3-standard);
  }
  .btn-primary-full:hover  {
    background: color-mix(in srgb, var(--color-primary) 92%, var(--color-on-primary) 8%);
    box-shadow: var(--shadow-elevation-1);
  }
  .btn-primary-full:active { transform: scale(0.98); }

  /* ── Filled Tonal Button (Secondary Container) ── */
  .btn-tonal {
    height: 40px;
    padding: 0 24px;
    border-radius: var(--radius-m3-full);
    font-family: var(--font-ui);
    font-weight: 500;
    font-size: 14px;
    letter-spacing: 0.1px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: var(--color-secondary-container);
    color: var(--color-on-secondary-container);
    border: none;
    cursor: pointer;
    transition: background var(--duration-short4) var(--ease-m3-standard);
  }

  /* ── Outlined Button ── */
  .btn-outlined {
    height: 40px;
    padding: 0 24px;
    border-radius: var(--radius-m3-full);
    font-family: var(--font-ui);
    font-weight: 500;
    font-size: 14px;
    letter-spacing: 0.1px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: transparent;
    color: var(--color-primary);
    border: 1px solid var(--color-border);
    cursor: pointer;
    transition: background var(--duration-short4) var(--ease-m3-standard);
  }
  .btn-outlined:hover {
    background: color-mix(in srgb, var(--color-primary) 8%, transparent);
  }

  /* ── Text Button ── */
  .btn-text {
    height: 40px;
    padding: 0 12px;
    border-radius: var(--radius-m3-full);
    font-family: var(--font-ui);
    font-weight: 500;
    font-size: 14px;
    letter-spacing: 0.1px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: transparent;
    color: var(--color-primary);
    border: none;
    cursor: pointer;
    transition: background var(--duration-short4) var(--ease-m3-standard);
  }
  .btn-text:hover {
    background: color-mix(in srgb, var(--color-primary) 8%, transparent);
  }

  /* ── Icon Button ── */
  .btn-icon {
    width: 40px; height: 40px;
    border-radius: var(--radius-m3-full);
    background: transparent;
    color: var(--color-on-surface-variant);
    border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: background var(--duration-short3) var(--ease-m3-standard);
  }
  .btn-icon:hover {
    background: color-mix(in srgb, var(--color-on-surface) 8%, transparent);
  }

  /* ── Subject cards hover ── */
  .subject-card {
    transition: box-shadow var(--duration-medium1) var(--ease-m3-standard),
                border-color var(--duration-medium1) var(--ease-m3-standard);
  }
  .subject-card:hover {
    box-shadow: var(--shadow-elevation-2);
    border-color: var(--color-primary-border);
  }

  /* ── Banner shimmer — no-op ── */
  .banner-shimmer { position: relative; }
}
```

- [ ] **Step 3: Verify build passes**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint
```
Expected: zero TypeScript errors.

- [ ] **Step 4: Commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && git add src/index.css && git commit -m "feat: update M3 design tokens — correct shape scale, surface containers, violet primary"
```

---

## Task 2: Foundation — Correct M3 Expressive Spring Presets (src/lib/m3-motion.ts)

**Files:**
- Modify: `src/lib/m3-motion.ts`

Current values are wrong (they were custom guesses, not M3 spec). Replace with the official M3 Expressive spring values converted to Framer Motion's absolute damping format.

- [ ] **Step 1: Replace m3-motion.ts with correct M3 Expressive presets**

```typescript
/**
 * M3 Expressive Spring Presets for Framer Motion
 *
 * Source: M3 Expressive Motion Theming spec
 * https://m3.material.io/blog/m3-expressive-motion-theming
 *
 * Conversion: FM damping = damping_ratio × 2 × √stiffness
 *
 * SPATIAL springs: animate position, size, shape — overshoot allowed
 * EFFECTS springs: animate opacity, color, blur — NO overshoot (critically damped)
 *
 * Two schemes:
 *   EXPRESSIVE: playful, allows bounce (use for interactive elements)
 *   STANDARD: subtle, professional (use for content transitions)
 */

// ── Expressive Scheme (recommended for CHITTA) ──────────────────────────────

/** Default spring for modals, cards, expanding elements */
export const m3SpatialDefault = {
  type: "spring" as const,
  stiffness: 380,
  damping: 31,   // ratio 0.8
  mass: 1,
};

/** Fast spring for icon state changes, toggles, micro-interactions */
export const m3SpatialFast = {
  type: "spring" as const,
  stiffness: 800,
  damping: 34,   // ratio 0.6 — bouncy, instant feel
  mass: 1,
};

/** Slow spring for full-screen transitions, large containers */
export const m3SpatialSlow = {
  type: "spring" as const,
  stiffness: 200,
  damping: 23,   // ratio 0.8
  mass: 1,
};

/**
 * Effects spring: opacity, color, blur, filter animations
 * MUST be critically damped (ratio = 1.0) — no overshoot on color/opacity
 */
export const m3EffectsEase = {
  type: "spring" as const,
  stiffness: 1600,
  damping: 80,   // ratio 1.0 — critically damped
  mass: 1,
};

export const m3EffectsFast = {
  type: "spring" as const,
  stiffness: 3200,
  damping: 113,  // ratio 1.0 — critically damped
  mass: 1,
};

export const m3EffectsSlow = {
  type: "spring" as const,
  stiffness: 800,
  damping: 57,   // ratio 1.0 — critically damped
  mass: 1,
};

// ── Standard Scheme (less expressive, for subtle transitions) ───────────────

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

// ── Duration shorthands (for non-spring transitions) ────────────────────────

export const M3Duration = {
  short1: 0.050,
  short2: 0.100,
  short3: 0.150,
  short4: 0.200,
  medium1: 0.250,
  medium2: 0.300,
  medium3: 0.350,
  medium4: 0.400,
  long1: 0.450,
  long2: 0.500,
  long3: 0.550,
  long4: 0.600,
} as const;
```

- [ ] **Step 2: Verify lint passes**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint
```
Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && git add src/lib/m3-motion.ts && git commit -m "feat: correct M3 Expressive spring presets with proper damping conversion"
```

---

## Task 3: Update DESIGN_SYSTEM.md

**Files:**
- Modify: `DESIGN_SYSTEM.md`

Replace the entire document with a clean, consistent, authoritative M3-aligned guide. Resolves conflicts (Roboto vs Jakarta+Inter, #6750A4 vs #2563EB, wrong shape values). See the full new document content in the implementation below.

- [ ] **Step 1: Rewrite DESIGN_SYSTEM.md**

Replace the full file content with this authoritative spec:

```markdown
# CHITTA — Design System
> Every visual decision in this app must follow this document.
> Grounded in M3 Expressive + cognitive science study psychology.
> Single source of truth — resolve any conflict in favor of this document.

---

## 1. Theme: Material Design 3 (M3) Expressive Light

**Font:** Roboto (M3 official)
**Primary:** #6750A4 (Focus Violet — M3 baseline default)
**Background:** #FFFBFE (M3 Background)

### Why M3 Expressive?
- Standardized contrast, accessibility baked in
- Spring physics feel alive on mobile
- Shape tension draws attention to critical elements

---

## 2. Color System

### M3 Color Roles (Baseline Light Theme)

| Role | CSS Variable | Hex |
|------|-------------|-----|
| Primary | `--color-primary` | `#6750A4` |
| On Primary | `--color-on-primary` | `#FFFFFF` |
| Primary Container | `--color-primary-container` | `#EADDFF` |
| On Primary Container | `--color-on-primary-container` | `#21005D` |
| Secondary | `--color-secondary` | `#625B71` |
| On Secondary | `--color-on-secondary` | `#FFFFFF` |
| Secondary Container | `--color-secondary-container` | `#E8DEF8` |
| On Secondary Container | `--color-on-secondary-container` | `#1D192B` |
| Tertiary (Excellence) | `--color-excellence` | `#7D5260` |
| On Tertiary | `--color-on-excellence` | `#FFFFFF` |
| Tertiary Container | `--color-excellence-container` | `#FFD8E4` |
| On Tertiary Container | `--color-on-excellence-container` | `#31111D` |
| Error | `--color-error` | `#B3261E` |
| On Error | `--color-on-error` | `#FFFFFF` |
| Error Container | `--color-error-container` | `#F9DEDC` |
| On Error Container | `--color-on-error-container` | `#410E0B` |
| Background | `--color-background` | `#FFFBFE` |
| On Background | `--color-on-background` | `#1C1B1F` |
| Surface | `--color-surface` | `#FFFBFE` |
| On Surface | `--color-on-surface` | `#1C1B1F` |
| Surface Variant | `--color-surface-variant` | `#E7E0EC` |
| On Surface Variant | `--color-on-surface-variant` | `#49454F` |
| Outline | `--color-outline` | `#79747E` |
| Outline Variant | `--color-border` | `#CAC4D0` |

### M3 Surface Container Family
Use these instead of opacity overlays for elevation:

| Level | CSS Variable | Hex | Use |
|-------|-------------|-----|-----|
| Lowest | `--color-surface-container-lowest` | `#FFFFFF` | Cards, dialogs |
| Low | `--color-surface-container-low` | `#F7F2FA` | Cards (elevated) |
| Default | `--color-surface-container` | `#F3EDF7` | Navigation drawer |
| High | `--color-surface-container-high` | `#ECE6F0` | Nav bar, menus |
| Highest | `--color-surface-container-highest` | `#E6E0E9` | Chips, tooltip |

### CHITTA Semantic Extensions

| Role | Variable | Hex | Use |
|------|---------|-----|-----|
| Success | `--color-success` | `#146C2E` | Correct answers, mastered stage |
| Success Container | `--color-success-container` | `#C4F6C7` | Correct state background |
| Warning | `--color-warning` | `#8C5000` | Due for review, timers |
| Warning Container | `--color-warning-container` | `#FFDCBB` | Warning state background |

### Never Use
```
❌ #2563EB — Tailwind blue (old primary)
❌ #7B6FFF — neon purple
❌ #00D97E — neon green
❌ rgba() overlay stacking (3+ layers)
❌ backdrop-filter blur
```

---

## 3. Typography

**Font family: Roboto** (single font, all weights)

```css
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
```

### M3 Type Scale

| Role | Size | Weight | Line Height | Letter Spacing | Use in CHITTA |
|------|------|--------|-------------|----------------|---------------|
| Display Large | 57px | 400 | 64px | -0.25px | Hero numbers only |
| Display Medium | 45px | 400 | 52px | 0 | — |
| Display Small | 36px | 400 | 44px | 0 | Stat ring center |
| Headline Large | 32px | 400 | 40px | 0 | — |
| Headline Medium | 28px | 400 | 36px | 0 | — |
| Headline Small | 24px | 400 | 32px | 0 | Screen titles |
| Title Large | 22px | 400 | 28px | 0 | Card headings |
| **Title Medium** | **16px** | **500** | **24px** | **+0.15px** | **Section labels** |
| Title Small | 14px | 500 | 20px | +0.1px | List item titles |
| **Body Large** | **16px** | **400** | **24px** | **+0.5px** | **Question text** |
| **Body Medium** | **14px** | **400** | **20px** | **+0.25px** | **Answer options** |
| Body Small | 12px | 400 | 16px | +0.4px | Captions |
| **Label Large** | **14px** | **500** | **20px** | **+0.1px** | **Buttons** |
| Label Medium | 12px | 500 | 16px | +0.5px | Chips, badges |
| Label Small | 11px | 500 | 16px | +0.5px | Smallest labels |

**Question text rule:** Use Body Large + line-height 1.75 for comprehension.
**Absolute minimum:** 11px (Label Small). Never below.

---

## 4. Shape System

| Token | Variable | Value | Use |
|-------|---------|-------|-----|
| None | `--radius-m3-none` | 0px | — |
| Extra Small | `--radius-m3-xs` | 4px | Small chips, badges |
| Small | `--radius-m3-sm` | 8px | Chips, assist chips |
| **Medium** | **`--radius-m3-md`** | **12px** | **Cards (standard)** |
| Large | `--radius-m3-lg` | 16px | FAB (small), text fields |
| **Extra Large** | **`--radius-m3-xl`** | **28px** | **Dialogs, bottom sheets** |
| Extra Extra Large | `--radius-m3-2xl` | 48px | Hero banners |
| Full / Pill | `--radius-m3-full` | 9999px | Buttons, nav indicator |

---

## 5. Elevation

M3 uses **tonal surface color** (not shadows) as the primary elevation signal in light mode. Shadows provide secondary depth.

| Level | dp | Surface Container | Shadow | Use |
|-------|-----|-------------------|--------|-----|
| Level 0 | 0 | `surface-container-lowest` (#FFFFFF) | none | Cards, backgrounds |
| Level 1 | 1dp | `surface-container-low` (#F7F2FA) | `--shadow-elevation-1` | Elevated cards, text fields |
| Level 2 | 3dp | `surface-container` (#F3EDF7) | `--shadow-elevation-2` | Nav drawer, menus |
| Level 3 | 6dp | `surface-container-high` (#ECE6F0) | `--shadow-elevation-3` | FAB, dialogs |
| Level 4 | 8dp | `surface-container-high` | `--shadow-elevation-4` | Nav bar |
| Level 5 | 12dp | `surface-container-highest` (#E6E0E9) | `--shadow-elevation-5` | Navigation drawers |

---

## 6. Spacing (4dp Grid)

All spacing must be multiples of 4px.

| Token | Value | Tailwind |
|-------|-------|---------|
| `--space-1` | 4px | `p-1`, `gap-1` |
| `--space-2` | 8px | `p-2`, `gap-2` |
| `--space-3` | 12px | `p-3`, `gap-3` |
| `--space-4` | 16px | `p-4`, `gap-4` |
| `--space-6` | 24px | `p-6`, `gap-6` |
| `--space-8` | 32px | `p-8` |
| `--space-12` | 48px | `p-12` |
| `--space-14` | 56px | min-height for touch targets |

**Touch target minimum: 48px height** (WCAG). Use 56px for primary actions.

---

## 7. Motion

### M3 Expressive Springs (src/lib/m3-motion.ts)

| Preset | Stiffness | FM Damping | Use |
|--------|-----------|-----------|-----|
| `m3SpatialDefault` | 380 | 31 | Modals, expanding cards, bottom sheets |
| `m3SpatialFast` | 800 | 34 | Nav indicator, toggles, icon fills |
| `m3SpatialSlow` | 200 | 23 | Full-screen transitions |
| `m3EffectsEase` | 1600 | 80 | Opacity, color fades — **no bounce** |
| `m3EffectsFast` | 3200 | 113 | Instant opacity changes |
| `m3EffectsSlow` | 800 | 57 | Slow color transitions |

**Rule: SPATIAL = position/size/shape (bounce OK). EFFECTS = opacity/color (NO bounce).**

### Screen Transitions
| Event | Spring | Notes |
|-------|--------|-------|
| Screen enter | `opacity 0→1` + `translateY 12px→0`, `m3EffectsEase` | 200ms |
| Card stagger | index × 40ms delay, max 160ms total | |
| Answer select | border + bg change | `m3EffectsFast` |
| Correct reveal | green border fade | `m3EffectsEase` |
| Wrong reveal | red border fade | `m3EffectsEase` |
| Button press | `scale 0.97` | 100ms |
| Progress fill | width transition | 600ms ease-out |
| Bottom sheet open | `translateY 100%→0`, `m3SpatialDefault` | |
| Nav indicator | `layoutId` shared layout | `m3SpatialFast` |

### Permanently Banned
```
❌ pulse-cta       ❌ animate-streak-bounce
❌ shimmer-text    ❌ animate-float
❌ card-shimmer    ❌ glow-pulse
❌ spin-slow       ❌ box-shadow glow rings (0 0 24px rgba...)
```

---

## 8. Components

### Cards
| Type | Class | Radius | Elevation | Border |
|------|-------|--------|-----------|--------|
| Standard | `.card` | `--radius-m3-md` (12px) | Level 0 | 1px `--color-border` |
| Elevated | `.card-elevated` | `--radius-m3-md` | Level 1 | none |
| Outlined | `.card-outlined` | `--radius-m3-md` | Level 0 | 1px `--color-border` |

Internal padding: `--space-4` (16px) all sides.

### Buttons
| Type | Class | Height | Radius | Background | Label |
|------|-------|--------|--------|------------|-------|
| Filled | `.btn-primary` | 40px | Full | `--color-primary` | Label Large |
| Filled Full Width | `.btn-primary-full` | 56px | Full | `--color-primary` | 16px/500 |
| Filled Tonal | `.btn-tonal` | 40px | Full | `--color-secondary-container` | Label Large |
| Outlined | `.btn-outlined` | 40px | Full | transparent | Label Large |
| Text | `.btn-text` | 40px | Full | transparent | Label Large |
| Icon | `.btn-icon` | 40px × 40px | Full | transparent | — |

### Navigation Bar (M3 spec)
```
Height: 80px
Background: --color-surface-container-high
Border-top: 1px solid --color-border
Active indicator: 64px × 32px pill, --color-primary-container fill
Icon: 24dp, filled on active (FILL=1), outline inactive (FILL=0)
Label: 12px (Label Medium), weight 700 active / 500 inactive
Destinations: 5 (CHITTA: Home, Session, Topics, Map, Pro)
```

### Dialogs
```
Corner radius: --radius-m3-xl (28px)
Background: --color-surface-container-high
Elevation: Level 3
Scrim: rgba(0,0,0,0.32)
Header padding: 24px
Body padding: 16px top, 24px horizontal
Button area: 24px all sides
```

### Bottom Sheet (Modal)
```
Top corner radius: --radius-m3-xl (28px), bottom 0
Background: --color-surface-container-low
Handle: 32px × 4px, centered, top 22px, --color-surface-variant fill
Scrim: rgba(0,0,0,0.32)
Elevation: Level 1
```

### Answer Option Cards (DemoSession / Session)
```
Default:   border 1.5px --color-border, bg white
Selected:  border 2px --color-primary, bg --color-primary-container
Correct:   border 2px --color-success, bg --color-success-container
Wrong:     border 2px --color-error, bg --color-error-container
Radius:    --radius-m3-sm (8px)
Padding:   14px 16px
Font:      14px (Body Medium), line-height 1.6
```

---

## 9. Icons

**Library: Lucide React only** — `lucide-react` package.

```tsx
import { Home, BookOpen, Map, BarChart2, Zap } from 'lucide-react';
// Size: 20-24px. Stroke-width: 1.5 (default). Color: CSS variable.
```

**No emojis** in nav bars, buttons, badges, headers, cards, or any interactive element.
Emojis are only acceptable inside static data config files as content.

---

## 10. Quick Reference

```
COLORS
Background:    #FFFBFE   Surface:     #FFFFFF
Border:        #CAC4D0   Outline:     #79747E
On-surface:    #1C1B1F   On-variant:  #49454F

Primary:       #6750A4   P-container: #EADDFF
Success:       #146C2E   S-container: #C4F6C7
Warning:       #8C5000   W-container: #FFDCBB
Error:         #B3261E   E-container: #F9DEDC
Excellence:    #7D5260   X-container: #FFD8E4

SHAPE
xs=4px  sm=8px  md=12px  lg=16px  xl=28px  2xl=48px  full=9999px

TYPOGRAPHY
Body Large:    16px/400/lh24/ls+0.5px  — question text
Body Medium:   14px/400/lh20/ls+0.25px — answer options
Label Large:   14px/500/lh20/ls+0.1px  — buttons
Label Medium:  12px/500/lh16/ls+0.5px  — chips, badges

MOTION
Spatial:  m3SpatialDefault (380/31) | Fast (800/34) | Slow (200/23)
Effects:  m3EffectsEase (1600/80) — NO bounce on color/opacity
```
```

- [ ] **Step 2: Commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && git add DESIGN_SYSTEM.md && git commit -m "docs: rewrite DESIGN_SYSTEM.md — authoritative M3 Expressive spec, resolve all conflicts"
```

---

## Task 4: Component — BottomNav.tsx

**Files:**
- Modify: `src/components/BottomNav.tsx`

Current issues:
1. Uses `material-symbols-rounded` web font icons — must switch to Lucide React (per CLAUDE.md)
2. Active color uses `--color-on-surface` but M3 nav bar active icon should use `--color-on-secondary-container` (inside active indicator) or just keep it visible
3. Background should be `--color-surface-container-high` (Level 4 = nav bar)
4. Active indicator should fill with `--color-secondary-container`

- [ ] **Step 1: Rewrite BottomNav.tsx**

```tsx
import React from 'react';
import { motion } from 'motion/react';
import { Home, Timer, BookOpen, GitBranch, Zap } from 'lucide-react';
import type { Screen } from '../types';
import { m3SpatialFast } from '../lib/m3-motion';

const navItems: { id: Screen; Icon: React.ElementType; label: string }[] = [
  { id: 'dashboard', Icon: Home,       label: 'Home'    },
  { id: 'session',   Icon: Timer,      label: 'Session' },
  { id: 'topics',    Icon: BookOpen,   label: 'Topics'  },
  { id: 'map',       Icon: GitBranch,  label: 'Map'     },
  { id: 'elite',     Icon: Zap,        label: 'Pro'     },
];

export const BottomNav = ({
  current,
  setScreen,
}: {
  current: Screen;
  setScreen: (s: Screen) => void;
}) => {
  return (
    <nav
      className="fixed bottom-0 left-0 w-full z-50 border-t"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        background: 'var(--color-surface-container-high)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="max-w-md mx-auto flex justify-around items-center h-[80px] px-2">
        {navItems.map(({ id, Icon, label }) => {
          const active = current === id;
          return (
            <button
              key={id}
              onClick={() => setScreen(id)}
              className="relative flex flex-col items-center gap-1 py-2 w-16"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              {/* M3 Active Indicator Pill: 64×32px */}
              <div className="relative w-16 h-8 flex items-center justify-center">
                {active && (
                  <motion.div
                    layoutId="nav-indicator-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'var(--color-secondary-container)' }}
                    transition={m3SpatialFast}
                  />
                )}
                <Icon
                  size={24}
                  strokeWidth={active ? 2 : 1.5}
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    color: active
                      ? 'var(--color-on-secondary-container)'
                      : 'var(--color-on-surface-variant)',
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: '12px',
                  fontFamily: 'var(--font-ui)',
                  fontWeight: active ? 700 : 500,
                  color: active
                    ? 'var(--color-on-surface)'
                    : 'var(--color-on-surface-variant)',
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
```

- [ ] **Step 2: Verify build**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint
```

- [ ] **Step 3: Commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && git add src/components/BottomNav.tsx && git commit -m "feat: BottomNav — switch to Lucide icons, M3 nav bar spec, secondary-container indicator"
```

---

## Task 5: Component — ContentSheet.tsx (Bottom Sheet)

**Files:**
- Modify: `src/components/ContentSheet.tsx`

Current issues:
1. No M3 drag handle indicator at top
2. Top corners should be `--radius-m3-xl` (28px), bottom 0
3. Background should be `--color-surface-container-low`
4. Any hardcoded colors need updating

- [ ] **Step 1: Read the full file**

Read `src/components/ContentSheet.tsx` (full file) to see all hardcoded colors.

- [ ] **Step 2: Apply M3 bottom sheet spec to the outer container**

Find the `<motion.div` that wraps the sheet content and update its style:

```tsx
// Replace the outer container div styles with:
style={{
  background: 'var(--color-surface-container-low)',
  borderRadius: '28px 28px 0 0',  // --radius-m3-xl top only
  // ... keep existing width/position styles
}}
```

Add the drag handle at the very top inside the sheet:
```tsx
{/* M3 Bottom Sheet Handle */}
<div
  className="flex justify-center pt-3 pb-1"
  style={{ flexShrink: 0 }}
>
  <div
    style={{
      width: 32,
      height: 4,
      borderRadius: 9999,
      background: 'var(--color-surface-variant)',
    }}
  />
</div>
```

- [ ] **Step 3: Replace any hardcoded button/color styles with CSS variables**

Audit the file for `#` hex values and replace with appropriate CSS vars:
- `#6750A4` or `#2563EB` → `var(--color-primary)`
- white backgrounds → `var(--color-surface-container-lowest)`
- gray borders → `var(--color-border)`
- text colors → `var(--color-on-surface)` or `var(--color-on-surface-variant)`

- [ ] **Step 4: Verify and commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint && git add src/components/ContentSheet.tsx && git commit -m "feat: ContentSheet — M3 bottom sheet spec, drag handle, surface-container-low bg"
```

---

## Task 6: Component — TierBadge.tsx

**Files:**
- Modify: `src/components/TierBadge.tsx`

- [ ] **Step 1: Read the full file**

Read `src/components/TierBadge.tsx` to see all hardcoded colors.

- [ ] **Step 2: Replace hardcoded stage colors with M3 CSS variables**

Map stage → M3 roles:
```
ExamReady  → bg --color-excellence-container,    text --color-on-excellence-container
Automatic  → bg --color-success-container,       text --color-on-success-container
Conscious  → bg --color-primary-container,       text --color-on-primary-container
Fragile    → bg --color-warning-container,       text --color-on-warning-container
Unseen     → bg --color-surface-container-high,  text --color-on-surface-variant
```

Border-radius: `var(--radius-m3-full)` (pill).
Font: Label Medium (12px, weight 500, letter-spacing 0.5px).

- [ ] **Step 3: Verify and commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint && git add src/components/TierBadge.tsx && git commit -m "feat: TierBadge — M3 color roles, pill shape token"
```

---

## Task 7: Component — StatusBar.tsx

**Files:**
- Modify: `src/components/StatusBar.tsx`

- [ ] **Step 1: Read the full file**

Read `src/components/StatusBar.tsx`.

- [ ] **Step 2: Apply M3 tokens**

Replace all hardcoded hex colors with CSS variables. Background should use `var(--color-surface-container-high)`. Progress fill should use `var(--color-primary)`.

- [ ] **Step 3: Verify and commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint && git add src/components/StatusBar.tsx && git commit -m "feat: StatusBar — M3 color variables"
```

---

## Task 8: Component — SharePromptSheet.tsx

**Files:**
- Modify: `src/components/SharePromptSheet.tsx`

- [ ] **Step 1: Read, audit, and apply M3 tokens**

Read `src/components/SharePromptSheet.tsx`. Apply bottom sheet spec (28px top radius, surface-container-low bg, drag handle). Replace hardcoded colors with CSS vars.

- [ ] **Step 2: Verify and commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint && git add src/components/SharePromptSheet.tsx && git commit -m "feat: SharePromptSheet — M3 bottom sheet spec"
```

---

## Task 9: Component — PatternRecogniser.tsx

**Files:**
- Modify: `src/components/PatternRecogniser.tsx`

- [ ] **Step 1: Read, audit, and apply M3 tokens**

Read `src/components/PatternRecogniser.tsx`. Replace hardcoded hex colors. Apply card spec (12px radius, surface-container-lowest). Replace `m3SpatialDefault` references to ensure they use updated spring values.

- [ ] **Step 2: Verify and commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint && git add src/components/PatternRecogniser.tsx && git commit -m "feat: PatternRecogniser — M3 color tokens"
```

---

## Task 10: Screen — Dashboard.tsx

**Files:**
- Modify: `src/screens/Dashboard.tsx`

Current issues:
1. `const JKS = "'Plus Jakarta Sans', system-ui, sans-serif"` — hardcoded font, replace with `'var(--font-ui)'`
2. Any hardcoded `#2563EB`, `#1D4ED8` blue values → `var(--color-primary)` / `var(--color-primary-container)`
3. Stat cards should use M3 surface container hierarchy
4. Subject cards background should use `var(--color-surface-container-lowest)`

- [ ] **Step 1: Read the full Dashboard.tsx**

Read `src/screens/Dashboard.tsx` (all lines).

- [ ] **Step 2: Remove hardcoded JKS font constant**

Find and replace:
```tsx
const JKS = "'Plus Jakarta Sans', system-ui, sans-serif";
```
Remove this line. Replace all usages `style={{ fontFamily: JKS }}` with `style={{ fontFamily: 'var(--font-ui)' }}`.

- [ ] **Step 3: Audit and replace blue primary colors**

Search for `#2563EB`, `#1D4ED8`, `#EFF6FF`, `#BFDBFE` and replace:
- `#2563EB` → `var(--color-primary)`
- `#1D4ED8` → `color-mix(in srgb, var(--color-primary) 90%, black)`
- `#EFF6FF` → `var(--color-primary-container)`
- `#BFDBFE` → `var(--color-primary-border)`

- [ ] **Step 4: Update motion imports to use new presets**

Ensure `m3SpatialFast`, `m3EffectsEase` from `'../lib/m3-motion'` — these are already correct after Task 2.

- [ ] **Step 5: Verify and commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint && git add src/screens/Dashboard.tsx && git commit -m "feat: Dashboard — M3 violet primary tokens, remove hardcoded font"
```

---

## Task 11: Screen — DemoSession.tsx

**Files:**
- Modify: `src/screens/DemoSession.tsx`

Current issues:
1. Same `const JKS` font constant
2. Answer option card colors likely use blue primary
3. CTA button styles may be hardcoded
4. Progress bar fill color

- [ ] **Step 1: Read the full DemoSession.tsx**

Read `src/screens/DemoSession.tsx` (full file — it may be 400+ lines).

- [ ] **Step 2: Replace JKS font and audit hardcoded colors**

Same pattern as Task 10. Find `const JKS` and remove it. Replace all hardcoded blues and grays with CSS variables.

- [ ] **Step 3: Apply M3 answer card spec**

Answer option cards must use:
```tsx
style={{
  background: 'var(--color-surface-container-lowest)',
  border: `1.5px solid var(--color-border)`,
  borderRadius: 'var(--radius-m3-sm)',  // 8px
  padding: '14px 16px',
  fontSize: '14px',  // Body Medium
  lineHeight: '1.6',
  color: 'var(--color-on-surface)',
}}
// Selected state:
border: `2px solid var(--color-primary)`,
background: 'var(--color-primary-container)',
// Correct state:
border: `2px solid var(--color-success)`,
background: 'var(--color-success-container)',
// Wrong state:
border: `2px solid var(--color-error)`,
background: 'var(--color-error-container)',
```

- [ ] **Step 4: Apply M3 button spec to CTAs**

Bottom CTA buttons: use `.btn-primary-full` class OR apply inline:
```tsx
style={{
  background: 'var(--color-primary)',
  color: 'var(--color-on-primary)',
  borderRadius: 'var(--radius-m3-full)',
  height: '56px',
  // ...
}}
```

- [ ] **Step 5: Verify and commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint && git add src/screens/DemoSession.tsx && git commit -m "feat: DemoSession — M3 answer cards, violet CTA, M3 button spec"
```

---

## Task 12: Screen — SessionComplete.tsx

**Files:**
- Modify: `src/screens/SessionComplete.tsx`

- [ ] **Step 1: Read, audit, and apply M3 tokens**

Read `src/screens/SessionComplete.tsx`. Replace hardcoded colors. Streak/achievement badges should use `var(--color-excellence-container)` + `var(--color-on-excellence-container)`. CTA buttons → M3 spec.

- [ ] **Step 2: Verify and commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint && git add src/screens/SessionComplete.tsx && git commit -m "feat: SessionComplete — M3 colors, excellence badge tokens"
```

---

## Task 13: Screen — TopicsBank.tsx

**Files:**
- Modify: `src/screens/TopicsBank.tsx`

- [ ] **Step 1: Read, audit, and apply M3 tokens**

Read `src/screens/TopicsBank.tsx`. List rows should have min-height 56px, padding `var(--space-4)` horizontal. Section labels: Label Medium (12px, 500 weight, `var(--color-on-surface-variant)`, uppercase, ls 0.05em). Cards: `.card` class.

- [ ] **Step 2: Verify and commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint && git add src/screens/TopicsBank.tsx && git commit -m "feat: TopicsBank — M3 list rows, section labels, card tokens"
```

---

## Task 14: Screen — ChittaMap.tsx

**Files:**
- Modify: `src/screens/ChittaMap.tsx`

- [ ] **Step 1: Read, audit, and apply M3 tokens**

Read `src/screens/ChittaMap.tsx`. Replace hardcoded hex colors with CSS variables. Node/concept cards should use M3 surface containers. Connection lines: `var(--color-border)`.

- [ ] **Step 2: Verify and commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint && git add src/screens/ChittaMap.tsx && git commit -m "feat: ChittaMap — M3 color tokens"
```

---

## Task 15: Screen — CourseDashboard.tsx

**Files:**
- Modify: `src/screens/CourseDashboard.tsx`

- [ ] **Step 1: Read, audit, and apply M3 tokens**

Read `src/screens/CourseDashboard.tsx`. Progress bars: fill `var(--color-primary)`, track `var(--color-surface-variant)`. CTA → M3 pill button. Cards → `.card` class.

- [ ] **Step 2: Verify and commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint && git add src/screens/CourseDashboard.tsx && git commit -m "feat: CourseDashboard — M3 tokens"
```

---

## Task 16: Screen — EliteHub.tsx

**Files:**
- Modify: `src/screens/EliteHub.tsx`

- [ ] **Step 1: Read, audit, and apply M3 tokens**

Read `src/screens/EliteHub.tsx`. Premium/Pro elements should use `var(--color-excellence)` + `var(--color-excellence-container)`. Replace blue accent colors with violet primary.

- [ ] **Step 2: Verify and commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint && git add src/screens/EliteHub.tsx && git commit -m "feat: EliteHub — M3 excellence/tertiary tokens for Pro elements"
```

---

## Task 17: Screen — LiveSession.tsx

**Files:**
- Modify: `src/screens/LiveSession.tsx`

- [ ] **Step 1: Read, audit, and apply M3 tokens**

Read `src/screens/LiveSession.tsx`. Session screen layout: white background, answer cards with M3 spec, timer chips use `var(--color-success-container)`, CTA buttons M3 pill spec.

- [ ] **Step 2: Verify and commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint && git add src/screens/LiveSession.tsx && git commit -m "feat: LiveSession — M3 session layout tokens"
```

---

## Task 18: Screen — StressMode.tsx

**Files:**
- Modify: `src/screens/StressMode.tsx`

- [ ] **Step 1: Read, audit, and apply M3 tokens**

Read `src/screens/StressMode.tsx`. High-pressure elements: use warning tokens (`var(--color-warning)`, `var(--color-warning-container)`). Timers: warning-container bg. CTA: M3 pill.

- [ ] **Step 2: Verify and commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint && git add src/screens/StressMode.tsx && git commit -m "feat: StressMode — M3 warning tokens for pressure UI"
```

---

## Task 19: Screen — MorningRecall.tsx

**Files:**
- Modify: `src/screens/MorningRecall.tsx`

- [ ] **Step 1: Read, audit, and apply M3 tokens**

Read `src/screens/MorningRecall.tsx`. Apply M3 card spec, color tokens, button spec.

- [ ] **Step 2: Verify and commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint && git add src/screens/MorningRecall.tsx && git commit -m "feat: MorningRecall — M3 tokens"
```

---

## Task 20: Screen — MockTest.tsx

**Files:**
- Modify: `src/screens/MockTest.tsx`

- [ ] **Step 1: Read, audit, and apply M3 tokens**

Read `src/screens/MockTest.tsx`. Same as DemoSession pattern: answer cards, timer, progress, CTA buttons.

- [ ] **Step 2: Verify and commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint && git add src/screens/MockTest.tsx && git commit -m "feat: MockTest — M3 tokens"
```

---

## Task 21: Screen — GhanaPatha.tsx

**Files:**
- Modify: `src/screens/GhanaPatha.tsx`

- [ ] **Step 1: Read, audit, and apply M3 tokens**

Read `src/screens/GhanaPatha.tsx`. Apply M3 color tokens throughout.

- [ ] **Step 2: Verify and commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint && git add src/screens/GhanaPatha.tsx && git commit -m "feat: GhanaPatha — M3 tokens"
```

---

## Task 22: Screen — ErrorDashboard.tsx

**Files:**
- Modify: `src/screens/ErrorDashboard.tsx`

- [ ] **Step 1: Read, audit, and apply M3 tokens**

Read `src/screens/ErrorDashboard.tsx`. Error state cards: `var(--color-error-container)` + `var(--color-on-error-container)`.

- [ ] **Step 2: Verify and commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint && git add src/screens/ErrorDashboard.tsx && git commit -m "feat: ErrorDashboard — M3 error tokens"
```

---

## Task 23: Screen — DistractorTraining.tsx

**Files:**
- Modify: `src/screens/DistractorTraining.tsx`

- [ ] **Step 1: Read, audit, and apply M3 tokens**

Read `src/screens/DistractorTraining.tsx`. Apply M3 answer card spec and color tokens.

- [ ] **Step 2: Verify and commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint && git add src/screens/DistractorTraining.tsx && git commit -m "feat: DistractorTraining — M3 tokens"
```

---

## Task 24: Screen — CourseLesson.tsx

**Files:**
- Modify: `src/screens/CourseLesson.tsx`

- [ ] **Step 1: Read, audit, and apply M3 tokens**

Read `src/screens/CourseLesson.tsx`. Content cards: `.card` class. Prose text: `.prose` utility. Progress: `var(--color-primary)` fill.

- [ ] **Step 2: Verify and commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint && git add src/screens/CourseLesson.tsx && git commit -m "feat: CourseLesson — M3 tokens, prose utility"
```

---

## Task 25: Screen — ConceptEncoding.tsx

**Files:**
- Modify: `src/screens/ConceptEncoding.tsx`

- [ ] **Step 1: Read, audit, and apply M3 tokens**

Read `src/screens/ConceptEncoding.tsx`. Apply M3 tokens throughout.

- [ ] **Step 2: Verify and commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint && git add src/screens/ConceptEncoding.tsx && git commit -m "feat: ConceptEncoding — M3 tokens"
```

---

## Task 26: Screen — PreExamProtocol.tsx

**Files:**
- Modify: `src/screens/PreExamProtocol.tsx`

- [ ] **Step 1: Read, audit, and apply M3 tokens**

Read `src/screens/PreExamProtocol.tsx`. Checklist items: M3 card spec. CTA: M3 pill button. Status chips: use appropriate semantic containers.

- [ ] **Step 2: Verify and commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint && git add src/screens/PreExamProtocol.tsx && git commit -m "feat: PreExamProtocol — M3 tokens"
```

---

## Task 27: Games — GamesScreen.tsx + GameRunner.tsx

**Files:**
- Modify: `src/games/GamesScreen.tsx`
- Modify: `src/games/GameRunner.tsx`

- [ ] **Step 1: Read and audit both files**

Read `src/games/GamesScreen.tsx` and `src/games/GameRunner.tsx`.

- [ ] **Step 2: Apply M3 tokens**

Game cards: `.card-elevated` class. Game header/toolbar: `var(--color-surface-container-high)`. CTAs: M3 pill button spec.

- [ ] **Step 3: Verify and commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint && git add src/games/GamesScreen.tsx src/games/GameRunner.tsx && git commit -m "feat: Games screens — M3 tokens"
```

---

## Task 28: Games — Individual Game Components

**Files:**
- Modify: `src/games/components/Knockout.tsx`
- Modify: `src/games/components/Chrono.tsx`
- Modify: `src/games/components/Links.tsx`
- Modify: `src/games/components/CognitiveItem.tsx`
- Modify: `src/games/components/GameWinScreen.tsx`
- Modify: `src/games/components/BalloonTapGame.tsx`
- Modify: `src/games/components/RetentionGame.tsx`
- Modify: `src/games/components/AudioLectureGame.tsx`
- Modify: `src/games/components/BubbleMatchGame.tsx`
- Modify: `src/games/components/ThisOrThat.tsx`

- [ ] **Step 1: Batch read and audit all game components**

Read each file. For each one, identify hardcoded hex colors and replace with M3 CSS variables.

Common patterns in games:
- Score/win: `var(--color-success)` / `var(--color-success-container)`
- Correct: `var(--color-success)`, wrong: `var(--color-error)`
- Primary accent: `var(--color-primary)`
- Card backgrounds: `var(--color-surface-container-lowest)`
- GameWinScreen excellence elements: `var(--color-excellence)` / `var(--color-excellence-container)`

- [ ] **Step 2: Verify and commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint && git add src/games/components/ && git commit -m "feat: game components — M3 color tokens throughout"
```

---

## Task 29: Final Build Verification

**Files:**
- None modified

- [ ] **Step 1: Full lint check**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run lint
```
Expected: zero TypeScript errors.

- [ ] **Step 2: Production build**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run build
```
Expected: successful build, no errors.

- [ ] **Step 3: Start dev server and visual check**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && npm run dev
```
Open http://localhost:3000. Verify:
- [ ] Background is #FFFBFE (near-white, not warm gray)
- [ ] Nav active indicator is violet-tinted pill (secondary-container = #E8DEF8)
- [ ] Active nav icon is dark (on-secondary-container = #1D192B)
- [ ] Dashboard CTAs are violet (#6750A4), not blue
- [ ] Cards have 12px radius (not 16px)
- [ ] Correct answer state is green (success-container)
- [ ] Wrong answer state is red (error-container)
- [ ] Selected answer state is violet (primary-container = #EADDFF)

- [ ] **Step 4: Final commit**

```bash
cd "C:\Users\Ankit\Desktop\learn app" && git add -A && git commit -m "feat: complete M3 Expressive design system — violet primary, correct tokens throughout"
```
