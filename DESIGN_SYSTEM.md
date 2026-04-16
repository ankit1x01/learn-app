# CHITTA — Design System
> Every visual decision in this app must follow this document.
> Grounded in M3 Expressive + cognitive science study psychology.
> **Single source of truth** — resolve any conflict in favor of this document.

---

## Why Design Matters for a Study App

Students use CHITTA for hours daily. Bad design causes:
- **Eye strain** → shorter study sessions
- **Cognitive overload** → worse retention
- **Visual anxiety** → reduced confidence before exams

Good design is invisible — the student only sees the concept, not the UI.

---

## 1. Theme: Material Design 3 (M3) Expressive Light

**Font:** Roboto (M3 official — single font family, all weights)
**Primary:** `#6750A4` Focus Violet — M3 Baseline default, signals intelligence + trust
**Background:** `#FFFBFE` — M3 standard background (near-white, subtly warm)

### Why M3 Expressive?
- Standardized contrast ratios guarantee readability without fatigue
- Spring physics animations feel alive on mobile, not janky
- Shape tension draws attention to critical UI elements
- Full accessibility baked in (WCAG AA contrast by default)

---

## 2. Color System

### M3 Color Roles (Baseline Light Theme)

All CSS variables are defined in `src/index.css @theme`.

| Role | CSS Variable | Hex | Notes |
|------|-------------|-----|-------|
| Primary | `--color-primary` | `#6750A4` | Focus Violet — main CTA, active nav |
| On Primary | `--color-on-primary` | `#FFFFFF` | Text/icon on primary bg |
| Primary Container | `--color-primary-container` | `#EADDFF` | Selected answer bg, tinted cards |
| On Primary Container | `--color-on-primary-container` | `#21005D` | Text on primary-container |
| Secondary | `--color-secondary` | `#625B71` | Secondary actions |
| On Secondary | `--color-on-secondary` | `#FFFFFF` | |
| Secondary Container | `--color-secondary-container` | `#E8DEF8` | Nav active indicator fill |
| On Secondary Container | `--color-on-secondary-container` | `#1D192B` | Nav active icon color |
| Tertiary (Excellence) | `--color-excellence` | `#7D5260` | Top achievement, ExamReady |
| On Tertiary | `--color-on-excellence` | `#FFFFFF` | |
| Tertiary Container | `--color-excellence-container` | `#FFD8E4` | Excellence badge bg |
| On Tertiary Container | `--color-on-excellence-container` | `#31111D` | Excellence badge text |
| Error | `--color-error` | `#B3261E` | Wrong answers only |
| On Error | `--color-on-error` | `#FFFFFF` | |
| Error Container | `--color-error-container` | `#F9DEDC` | Wrong answer card bg |
| On Error Container | `--color-on-error-container` | `#410E0B` | Wrong answer card text |
| Background | `--color-background` | `#FFFBFE` | Page background |
| Surface | `--color-surface` | `#FFFBFE` | Card surface |
| On Surface | `--color-on-surface` | `#1C1B1F` | Primary text |
| Surface Variant | `--color-surface-variant` | `#E7E0EC` | Dividers, sheet handles |
| On Surface Variant | `--color-on-surface-variant` | `#49454F` | Secondary text, inactive icons |
| Outline | `--color-outline` | `#79747E` | Input borders, muted text |
| Outline Variant | `--color-border` | `#CAC4D0` | Card borders, dividers |

### M3 Surface Container Family
Use these instead of opacity overlays for elevation tinting:

| Level | CSS Variable | Hex | Use |
|-------|-------------|-----|-----|
| Lowest | `--color-surface-container-lowest` | `#FFFFFF` | Cards, dialogs, elevated surfaces |
| Low | `--color-surface-container-low` | `#F7F2FA` | Elevated cards, bottom sheets |
| Default | `--color-surface-container` | `#F3EDF7` | Navigation drawer |
| High | `--color-surface-container-high` | `#ECE6F0` | Navigation bar, app bar |
| Highest | `--color-surface-container-highest` | `#E6E0E9` | Chips, tooltips |

### CHITTA Semantic Extensions

| Role | Variable | Hex | Use |
|------|---------|-----|-----|
| Success | `--color-success` | `#146C2E` | Correct answers, mastered stage, green progress |
| On Success | `--color-on-success` | `#FFFFFF` | |
| Success Container | `--color-success-container` | `#C4F6C7` | Correct answer card bg |
| On Success Container | `--color-on-success-container` | `#064215` | Correct answer card text |
| Warning | `--color-warning` | `#8C5000` | Due for review, timers, countdowns |
| On Warning | `--color-on-warning` | `#FFFFFF` | |
| Warning Container | `--color-warning-container` | `#FFDCBB` | Warning card bg, streak badge bg |
| On Warning Container | `--color-on-warning-container` | `#4A2800` | Warning card text |

### Subject Accent Colors (CHITTA-specific)

| Subject | Variable | Hex | Container |
|---------|---------|-----|-----------|
| Physics | `--color-subject-physics` | `#1D4ED8` | `--color-subject-physics-container` `#EFF6FF` |
| Chemistry | `--color-subject-chemistry` | `#6D28D9` | `--color-subject-chemistry-container` `#F5F3FF` |
| Biology | `--color-subject-biology` | `#166534` | `--color-subject-biology-container` `#F0FDF4` |
| CS / DSA | `--color-subject-cs` | `#0E7490` | `--color-subject-cs-container` `#ECFEFF` |

### Never Use
```
❌ #2563EB — old Tailwind blue primary
❌ #7B6FFF — neon purple
❌ #00D97E — neon green
❌ #06080E — dark background
❌ rgba() overlay stacking (3+ layers on one element)
❌ backdrop-filter blur — creates muddy surfaces
❌ box-shadow glow rings — 0 0 24px rgba(...)
```

---

## 3. Typography

**Single font family: Roboto** — M3 official, designed for these exact proportions.

```css
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
```

### M3 Type Scale

| Role | Size | Weight | Line Height | Letter Spacing | CHITTA Use |
|------|------|--------|-------------|----------------|-----------|
| Display Large | 57px | 400 | 64px | -0.25px | Hero stat numbers |
| Display Medium | 45px | 400 | 52px | 0 | — |
| Display Small | 36px | 400 | 44px | 0 | Ring center stats |
| Headline Large | 32px | 400 | 40px | 0 | — |
| Headline Medium | 28px | 400 | 36px | 0 | — |
| Headline Small | 24px | 400 | 32px | 0 | Screen titles |
| Title Large | 22px | 400 | 28px | 0 | Card headings |
| **Title Medium** | **16px** | **500** | **24px** | **+0.15px** | **Section labels** |
| Title Small | 14px | 500 | 20px | +0.1px | List item titles |
| **Body Large** | **16px** | **400** | **24px** | **+0.5px** | **Question text** |
| **Body Medium** | **14px** | **400** | **20px** | **+0.25px** | **Answer options, body** |
| Body Small | 12px | 400 | 16px | +0.4px | Captions |
| **Label Large** | **14px** | **500** | **20px** | **+0.1px** | **Button labels** |
| Label Medium | 12px | 500 | 16px | +0.5px | Chips, badges |
| Label Small | 11px | 500 | 16px | +0.5px | Smallest labels |

**Critical rules:**
- Question text: Body Large + line-height 1.75 minimum (comprehension requires air)
- Answer options: Body Medium (14px), line-height 1.6
- **Absolute floor: 11px** — never smaller
- Use `font-variant-numeric: tabular-nums` for progress numbers/stats

---

## 4. Shape System

All corner radii are defined as `--radius-m3-*` CSS variables.

| Level | Token | Value | Use |
|-------|-------|-------|-----|
| None | `--radius-m3-none` | 0px | — |
| Extra Small | `--radius-m3-xs` | 4px | Tiny badge indicators |
| Small | `--radius-m3-sm` | 8px | Answer option cards, chips |
| **Medium** | **`--radius-m3-md`** | **12px** | **Standard cards** |
| Large | `--radius-m3-lg` | 16px | FAB (small), large chips |
| **Extra Large** | **`--radius-m3-xl`** | **28px** | **Dialogs, bottom sheets (top corners)** |
| Extra Extra Large | `--radius-m3-2xl` | 48px | Hero banners, onboarding |
| Full / Pill | `--radius-m3-full` | 9999px | **All buttons**, nav indicator, badges |

**Shape tension:** Mix `--radius-m3-xl` (28px) containers with `--radius-m3-sm` (8px) inner cards to draw attention to critical elements.

---

## 5. Elevation

M3 uses **tonal surface color** as the primary elevation signal in light mode. Shadows add secondary depth.

| Level | dp | Surface Container | Shadow Token | Use |
|-------|-----|-------------------|-------------|-----|
| Level 0 | 0 | `surface-container-lowest` (#FFFFFF) | `--shadow-elevation-0` (none) | Filled cards, page |
| Level 1 | 1dp | `surface-container-low` (#F7F2FA) | `--shadow-elevation-1` | Elevated cards, text fields |
| Level 2 | 3dp | `surface-container` (#F3EDF7) | `--shadow-elevation-2` | Menus, tooltips |
| Level 3 | 6dp | `surface-container-high` (#ECE6F0) | `--shadow-elevation-3` | FAB, dialogs |
| Level 4 | 8dp | `surface-container-high` | `--shadow-elevation-4` | Nav bar |
| Level 5 | 12dp | `surface-container-highest` (#E6E0E9) | `--shadow-elevation-5` | Navigation drawers |

---

## 6. Spacing (4dp Grid)

All spacing must be multiples of 4px. Use Tailwind classes or `--space-*` tokens.

| Token | Value | Tailwind |
|-------|-------|---------|
| `--space-1` | 4px | `p-1`, `gap-1` |
| `--space-2` | 8px | `p-2`, `gap-2` |
| `--space-3` | 12px | `p-3`, `gap-3` |
| `--space-4` | 16px | `p-4`, `gap-4` ← most common |
| `--space-6` | 24px | `p-6`, `gap-6` |
| `--space-8` | 32px | `p-8` |
| `--space-12` | 48px | `p-12` |
| `--space-14` | 56px | min-height for touch targets |

**Touch target minimum: 48px** (WCAG). Primary action buttons: 56px.

---

## 7. Motion

### M3 Expressive Spring Presets (`src/lib/m3-motion.ts`)

| Export | Stiffness | FM Damping | Use |
|--------|-----------|-----------|-----|
| `m3SpatialDefault` | 380 | 31 | Modals, expanding cards, bottom sheets |
| `m3SpatialFast` | 800 | 34 | Nav indicator pill, icon toggles |
| `m3SpatialSlow` | 200 | 23 | Full-screen transitions |
| `m3EffectsEase` | 1600 | 80 | Opacity, color fades — **no bounce** |
| `m3EffectsFast` | 3200 | 113 | Instant opacity/color changes |
| `m3EffectsSlow` | 800 | 57 | Slow color transitions |

**Rule: SPATIAL = position/size/shape (bounce OK). EFFECTS = opacity/color (NO bounce, critically damped).**

### Screen Transitions

| Event | Motion | Duration |
|-------|--------|----------|
| Screen enter | `opacity 0→1` + `translateY 12px→0` | `m3EffectsEase` |
| Card stagger | delay: `index × 40ms`, max 160ms total | |
| Answer select | border + bg color change | `m3EffectsFast` |
| Correct reveal | green border + bg fade | `m3EffectsEase` |
| Wrong reveal | red border + bg fade | `m3EffectsEase` |
| Button press | `scale(0.97)` | 100ms |
| Progress bar fill | width transition | 600ms ease-out |
| Bottom sheet open | `translateY 100%→0` | `m3SpatialDefault` |
| Nav indicator | `layoutId` shared layout | `m3SpatialFast` |

### Permanently Banned Animations
```
❌ pulse-cta              ❌ animate-streak-bounce
❌ shimmer-text           ❌ animate-float
❌ card-shimmer           ❌ glow-pulse
❌ spin-slow              ❌ All box-shadow glow rings
```

---

## 8. Components

### Cards

| Class | Radius | Elevation | Background | Border |
|-------|--------|-----------|------------|--------|
| `.card` | 12px | Level 0 | `surface-container-lowest` | 1px `--color-border` |
| `.card-elevated` | 12px | Level 1 | `surface-container-low` | none |
| `.card-outlined` | 12px | Level 0 | `surface` | 1px `--color-border` |

Padding: 16px (`--space-4`) all sides.

### Buttons

| Class | Height | Radius | Background | Text |
|-------|--------|--------|------------|------|
| `.btn-primary` | 40px | Full (pill) | `--color-primary` | `--color-on-primary` |
| `.btn-primary-full` | 56px | Full (pill) | `--color-primary` | `--color-on-primary` |
| `.btn-tonal` | 40px | Full (pill) | `--color-secondary-container` | `--color-on-secondary-container` |
| `.btn-outlined` | 40px | Full (pill) | transparent | `--color-primary` |
| `.btn-text` | 40px | Full (pill) | transparent | `--color-primary` |
| `.btn-icon` | 40×40px | Full (pill) | transparent | `--color-on-surface-variant` |

Font: Label Large (14px, weight 500, letter-spacing +0.1px). `.btn-primary-full` uses 16px/500.

### Navigation Bar (M3 spec)

```
Height:           80px
Background:       --color-surface-container-high (#ECE6F0)
Border-top:       1px solid --color-border
Active indicator: 64×32px pill, --color-secondary-container fill
Active icon:      color-on-secondary-container, strokeWidth 2
Inactive icon:    color-on-surface-variant, strokeWidth 1.5
Label:            12px (Label Medium), weight 700 active / 500 inactive
Icon library:     Lucide React only
```

### Dialogs

```
Corner radius:    --radius-m3-xl (28px)
Background:       --color-surface-container-high
Elevation:        Level 3
Scrim:            rgba(0,0,0,0.32)
Header padding:   24px top, 24px horizontal
Body padding:     16px top, 24px horizontal
Button area:      24px all sides
```

### Bottom Sheet (Modal)

```
Top corners:      --radius-m3-xl (28px), bottom corners: 0
Background:       --color-surface-container-low
Handle:           32×4px pill, centered, 22px from top, --color-surface-variant
Scrim:            rgba(0,0,0,0.32)
Elevation:        Level 1
```

### Answer Option Cards (Session/DemoSession)

```
Default:   border 1.5px solid --color-border,    bg white
Selected:  border 2px solid --color-primary,     bg --color-primary-container
Correct:   border 2px solid --color-success,     bg --color-success-container
Wrong:     border 2px solid --color-error,       bg --color-error-container
Radius:    --radius-m3-sm (8px)
Padding:   14px 16px
Font:      14px (Body Medium), weight 400, line-height 1.6
```

### Progress Bars

```
Track:      height 6px, bg --color-surface-variant, radius --radius-m3-full
Fill:
  Mastered:       --color-success
  Learning:       --color-primary
  Needs Review:   --color-warning

Session bar (top of screen):
  height 4px, fill --color-primary
```

### Badges & Stage Labels

| Stage | Background | Text |
|-------|-----------|------|
| ExamReady | `--color-excellence-container` | `--color-on-excellence-container` |
| Automatic | `--color-success-container` | `--color-on-success-container` |
| Conscious | `--color-primary-container` | `--color-on-primary-container` |
| Fragile | `--color-warning-container` | `--color-on-warning-container` |
| Unseen | `--color-surface-container-high` | `--color-on-surface-variant` |

All badges: `border-radius: --radius-m3-full`, Label Medium (12px/500/ls+0.5px).

---

## 9. Icons

**Library: Lucide React only** — `import { Home, ... } from 'lucide-react'`

```tsx
<Home size={24} strokeWidth={1.5} />          // inactive
<Home size={24} strokeWidth={2} />             // active
```

**Never use:**
- Material Symbols web font
- Emojis in nav bars, buttons, badges, headers, cards, or interactive elements

Emojis are acceptable only inside static data config files (e.g. subject `emoji` field) as content.

---

## 10. Session / Question Screen Layout

Maximum clarity. No decoration.

```
─────────────────────────────────
Progress bar (4px, full width, --color-primary fill)
─────────────────────────────────
[← close]      Q 3/20      [timer chip: success-container]
─────────────────────────────────
[Badge: REVIEW / NEW / STRENGTHEN]

Question text
16px Roboto, weight 500, line-height 1.75, color --color-on-surface
─────────────────────────────────
Answer options (white cards, 1.5px border, 8px radius)
  [A]  Option text  ← letter in surface-variant pill
  [B]  Option text
  [C]  Option text
  [D]  Option text
─────────────────────────────────
[CTA button — .btn-primary-full, fixed at bottom, 16px margin]
─────────────────────────────────
```

Rules:
- **Background: --color-background** — no tint, no texture
- Answer letters (A–D): small `surface-variant` pill, 11px, `on-surface-variant`
- After answer revealed: only selected option changes — others stay neutral

---

## 11. Quick Reference Cheatsheet

```
─────────────── COLORS ────────────────
Background:  #FFFBFE    Surface:     #FFFFFF
Border:      #CAC4D0    Outline:     #79747E
On-surface:  #1C1B1F    On-variant:  #49454F

Primary:     #6750A4    P-container: #EADDFF
Success:     #146C2E    S-container: #C4F6C7
Warning:     #8C5000    W-container: #FFDCBB
Error:       #B3261E    E-container: #F9DEDC
Excellence:  #7D5260    X-container: #FFD8E4

Nav active:  secondary-container #E8DEF8

─────────────── SHAPE ─────────────────
xs=4px  sm=8px  md=12px  lg=16px
xl=28px  2xl=48px  full=9999px

─────────────── TYPOGRAPHY ────────────
Body Large:   16px/400/lh1.75/ls+0.5px  ← questions
Body Medium:  14px/400/lh1.6/ls+0.25px  ← options, body
Label Large:  14px/500/lh20/ls+0.1px    ← buttons
Label Medium: 12px/500/lh16/ls+0.5px    ← chips, badges
Min size:     11px (absolute floor)

─────────────── MOTION ────────────────
Spatial:  m3SpatialDefault (380/31) | Fast (800/34) | Slow (200/23)
Effects:  m3EffectsEase (1600/80)   ← NO bounce on color/opacity

─────────────── LAYOUT ────────────────
Page padding:    px-4 (16px)
Section gap:     mt-6 (24px)
Card:            p-4, radius 12px, border --color-border
Button:          height 40-56px, radius 9999px, Roboto 14-16px/500
List row:        px-4 py-3.5, min-h-[56px]
Touch target:    min 48px, primary actions 56px
```
