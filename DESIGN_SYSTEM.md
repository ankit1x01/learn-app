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
| `--space-5` | 20px | `p-5` |
| `--space-6` | 24px | `p-6`, `gap-6` |
| `--space-8` | 32px | `p-8` |
| `--space-10` | 40px | `p-10` |
| `--space-12` | 48px | `p-12` |
| `--space-14` | 56px | min-height for touch targets |
| `--space-16` | 64px | `p-16` |

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

**Primary library: Material Symbols Rounded** — Google's official M3 icon font.
Already loaded in `index.html` via Google Fonts CDN.

```tsx
// Usage in JSX — render as <span> with class
<span
  className="material-symbols-rounded"
  style={{
    fontSize: 24,  // 20 | 24 | 40 | 48
    color: 'var(--color-primary)',
    fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
  }}
>
  calculate
</span>
```

### Variable Font Axes
| Axis | Range | Recommended | Effect |
|------|-------|-------------|--------|
| `FILL` | 0–1 | 1 = filled (active), 0 = outline (inactive) | Filled vs outlined |
| `wght` | 100–700 | 400 | Stroke weight |
| `GRAD` | -50–200 | 0 | Grade/contrast |
| `opsz` | 20–48 | match font-size | Optical size |

### Subject Icon Map (CHITTA)
| Subject | Icon name |
|---------|-----------|
| Quantitative Aptitude | `calculate` |
| DSA & Coding | `terminal` |
| Foundations | `layers` |
| Arrays & Search | `data_array` |
| Strings & Data Structures | `link` |
| Trees & Graphs | `account_tree` |
| DP & Greedy | `bolt` |

### Common UI Icons
```
Home         → home
Session      → play_circle
Topics       → menu_book
Map          → map
Pro          → star
Search       → search
Back         → arrow_back
Settings     → settings
Streak/Fire  → local_fire_department
Timer        → timer
Trophy       → emoji_events
Brain/Learn  → neurology
Check        → check_circle
Close        → close
```

**Rule: ZERO EMOJIS.**
- No emojis in nav bars, buttons, badges, headers, cards, or any interactive element.
- No emojis in data files, content strings, or JSON configs.
- No literal arrow characters (←, →, ↑, ↓) in UI text; use Material Symbols.
- Use Material Symbols for all visual metaphors. If an icon is missing, use plain text.
- This rule is absolute and applies to all AI tools and contributors.

> **Note:** Lucide React (`lucide-react`) is still present in some legacy screens.
> Migrate to Material Symbols Rounded on any screen you touch.

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
