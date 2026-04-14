# CHITTA — Design System
> Every visual decision in this app must follow this document.
> Grounded in cognitive science + study psychology. Inspired by Super Kalam's clarity.

---

## Why Design Matters for a Study App

Students use CHITTA for hours daily. Bad design causes:
- **Eye strain** → shorter study sessions
- **Cognitive overload** → worse retention
- **Visual anxiety** → reduced confidence before exams
- **Lost focus** → distraction from content

Good design is invisible — the student only sees the concept, not the UI.

---

## 1. Theme: Warm Light

The app uses a **warm off-white light theme**. Not dark. Not pure cold white.

**Why warm?**
- Pure white (#FFF) reflects too much light — causes eye strain in long sessions
- Dark themes strain eyes in daylight (where most students study)
- Warm off-white (#F7F6F3) mimics paper — proven to reduce reading fatigue
- Kalam uses a cool-light base — we go slightly warmer for NEET's long study hours

```
Page background:      #F7F6F3   ← warm paper tone
Card background:      #FFFFFF   ← pure white (max contrast for content)
Surface variant:      #F0EEE9   ← slightly darker warm gray for inner zones
Input background:     #F7F6F3
Bottom nav:           #FFFFFF   border-top: 1px solid #E8E5DF
```

---

## 2. Colors

### Text Colors
These must pass WCAG AA contrast (4.5:1 minimum).

```
Ink (headings):       #1C1917   ← warm near-black, not pure #000
Body text:            #292524   ← slightly softer, still very readable
Secondary text:       #78716C   ← warm medium gray
Placeholder / muted:  #A8A29E   ← light gray, for metadata only
Disabled:             #D6D3D1
```

**Rule: Never put text below `#78716C` on a white background for anything a student must read.**

### Brand / Functional Colors

| Color | Hex | Psychology | Use in app |
|-------|-----|-----------|-----------|
| **Focus Blue** | `#2563EB` | Trust, calm, concentration | Primary CTA, active nav, links |
| **Mastery Green** | `#15803D` | Growth, achievement, safety | Correct answers, mastered stage |
| **Review Amber** | `#B45309` | Attention without panic | Due for review, timers, warnings |
| **Error Red** | `#B91C1C` | Only for wrong answers | Wrong answer state — not dominant |
| **Excellence Purple** | `#6D28D9` | Premium, top achievement | ExamReady badge, top streaks only |

**No neon. No electric tones. Every color above is a deep, desaturated professional shade.**

### Tinted Backgrounds (for colored cards/banners)
```
Blue tint:    background #EFF6FF,  border #BFDBFE,  text #1D4ED8
Green tint:   background #F0FDF4,  border #BBF7D0,  text #166534
Amber tint:   background #FFFBEB,  border #FDE68A,  text #92400E
Red tint:     background #FEF2F2,  border #FECACA,  text #991B1B
Purple tint:  background #F5F3FF,  border #DDD6FE,  text #5B21B6
```

### What to NEVER use
```
❌ #7B6FFF — neon purple (current app)
❌ #00D97E — neon green (current app)
❌ #06080E — dark background
❌ Any color with full saturation (HSL saturation > 85%)
❌ gradient text / shimmer text
❌ text-shadow glows
❌ rgba overlay stacking (3+ layers on one element)
```

---

## 3. Typography

### Font Stack
```
UI font (headings, labels, buttons):  "Plus Jakarta Sans", system-ui, sans-serif
Content font (questions, body text):  "Inter", system-ui, sans-serif
Numbers / stats:                       "Inter", tabular-nums, system-ui, sans-serif
```

**Why Plus Jakarta Sans for UI?**
It is widely used in edtech (Byju's, Unacademy competitors). Rounded but not childish. Excellent at 13–20px range. Friendly and motivating — important for students who are stressed.

**Why Inter for content?**
Inter was designed for screen reading. At 15–16px with proper line-height, it is among the most readable fonts for long-form text and question statements.

### Add to index.css
```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
```

### Type Scale

| Role | Font | Size | Weight | Line-height | Color |
|------|------|------|--------|------------|-------|
| Page Title | Plus Jakarta Sans | 20px | 700 | 1.3 | #1C1917 |
| Card Heading | Plus Jakarta Sans | 17px | 700 | 1.35 | #1C1917 |
| Section Header | Plus Jakarta Sans | 15px | 600 | 1.4 | #1C1917 |
| **Question Text** | **Inter** | **16px** | **500** | **1.75** | **#1C1917** |
| **Answer Option** | **Inter** | **15px** | **400** | **1.6** | **#292524** |
| Body / Description | Inter | 15px | 400 | 1.65 | #292524 |
| Label / Meta | Plus Jakarta Sans | 13px | 500 | 1.4 | #78716C |
| Caption | Inter | 12px | 400 | 1.5 | #A8A29E |
| Big Stat Number | Inter | 36–44px | 700 | 1.1 | #1C1917 or accent |
| Badge | Plus Jakarta Sans | 11px | 600 | 1 | varies |

### Critical Rules
- **Question and answer text must use Inter at minimum 15px** — these are the most read elements
- **Line-height for question text: 1.7–1.8** — students need air between lines to parse complex statements
- **No text below 12px anywhere in the app**
- **No uppercase labels with heavy tracking** — use normal case at 13px instead
- **No negative letter-spacing on body text** — hurts reading speed
- Stat numbers: use `font-variant-numeric: tabular-nums` so digits align in progress tables

---

## 4. Spacing System

The unit is 4px. Always use multiples of 4.

### Page Layout
```
Horizontal padding:    px-4 (16px sides)
Max content width:     max-w-md mx-auto (390px effective)
Top padding:           pt-4 below header
Bottom padding:        pb-28 above nav (safe area)
Section gap:           mt-6 (24px) between major sections
```

### Card Spacing
```
Standard card padding:      p-4 (16px)
Content-heavy card:         p-5 (20px)
Question card:              p-5 (20px) — needs more room
List row (with icon):       px-4 py-3.5
Between cards:              gap-3 (12px) or gap-4 (16px)
```

### Typography Spacing
```
Heading to body:            mb-2 (8px)
Body paragraph to paragraph: mb-3 (12px)
Section header to content:  mb-3 (12px)
Label above a group:        mb-2 (8px)
Between list items:         gap-0 with divider OR gap-3
```

---

## 5. Cards

### Standard Card
The workhorse. Used for everything.
```css
background: #FFFFFF;
border: 1px solid #E8E5DF;
border-radius: 14px;
box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
padding: 16px;
```
No blur. No gradient fill. No shimmer. Just clean white.

### Question Card (Session screen)
Maximum readability. Zero decoration.
```css
background: #FFFFFF;
border: none;
border-radius: 0;  /* or 14px if floating */
padding: 20px;
/* Optionally a thin left accent border: */
border-left: 3px solid #2563EB;
padding-left: 17px;
```

### Answer Option Card
```css
background: #FFFFFF;
border: 1.5px solid #E8E5DF;
border-radius: 10px;
padding: 14px 16px;
font-size: 15px;
line-height: 1.6;
color: #292524;
cursor: pointer;
transition: border-color 120ms, background 120ms;
```
States:
- **Default**: border `#E8E5DF`, bg white
- **Selected**: border `#2563EB`, bg `#EFF6FF`
- **Correct**: border `#15803D`, bg `#F0FDF4`, text `#166534`
- **Wrong**: border `#B91C1C`, bg `#FEF2F2`, text `#991B1B`

### Tinted Info Card (nudges, tips, warnings)
```css
/* Use the tinted backgrounds from section 2 */
border-radius: 12px;
padding: 14px 16px;
```

### Section Container (groups related items)
```css
background: #FFFFFF;
border: 1px solid #E8E5DF;
border-radius: 14px;
overflow: hidden;
/* Children are list rows with dividers between them */
```

---

## 6. List Rows

Used in Topics, Subjects, Settings screens.

```
Height:           min 56px (touch target)
Padding:          px-4 py-3.5
Left icon:        40×40px, border-radius 10px, bg #F0EEE9
Icon color:       match subject/category color (muted, not neon)
Title:            15px, weight 600, #1C1917
Subtitle:         13px, #78716C
Right chevron:    16px, #A8A29E
Divider:          1px solid #F3F0EB (between rows, not after last)
```

**Category section labels above row groups:**
```
font-size: 12px
font-weight: 600
color: #category-accent (e.g. #B45309 for physics, #15803D for bio)
margin-bottom: 8px
margin-top: 20px
text-transform: uppercase
letter-spacing: 0.05em  (small, readable — not 0.25em)
```

---

## 7. Buttons

### Primary CTA
```css
background: #2563EB;
color: #FFFFFF;
border-radius: 12px;
padding: 15px 24px;
font-family: "Plus Jakarta Sans";
font-size: 15px;
font-weight: 700;
width: 100%;
box-shadow: 0 2px 8px rgba(37,99,235,0.28);
transition: all 120ms;
letter-spacing: 0.01em;
```
Hover: `background #1D4ED8`
Active: `transform scale(0.98)`, `box-shadow none`
**No pulse. No shimmer sweep. No glow rings.**

### Secondary (Outline)
```css
background: transparent;
border: 1.5px solid #2563EB;
color: #2563EB;
border-radius: 12px;
padding: 13px 24px;
font-size: 15px;
font-weight: 600;
```

### Destructive / Neutral
```css
background: #F0EEE9;
color: #78716C;
border-radius: 12px;
padding: 13px 24px;
font-size: 15px;
font-weight: 600;
border: none;
```

### Icon Button (back, close, action)
```css
width: 40px; height: 40px;
border-radius: 10px;
background: #F0EEE9;
color: #292524;
display: flex; align-items: center; justify-content: center;
```

---

## 8. Progress Bars

**Track:**
```css
height: 6px;
background: #E8E5DF;
border-radius: 999px;
overflow: hidden;
```

**Fill colors (semantic, not decorative):**
```
Mastered / Automatic:   #15803D  (deep green)
Learning / Conscious:   #2563EB  (blue)
Needs Review / Fragile: #B45309  (amber)
Unseen:                 (empty — just the track)
```

**For session progress bar (top of screen):**
```css
height: 4px;
background: #E8E5DF;
fill: #2563EB;
/* Shows how far through current session */
```

---

## 9. Badges & Tags

```css
border-radius: 999px;
padding: 3px 10px;
font-family: "Plus Jakarta Sans";
font-size: 11px;
font-weight: 700;
display: inline-flex; align-items: center; gap: 4px;
```

| Stage | Background | Text | Border |
|-------|-----------|------|--------|
| ExamReady | `#F5F3FF` | `#6D28D9` | `#DDD6FE` |
| Automatic | `#F0FDF4` | `#166534` | `#BBF7D0` |
| Conscious | `#EFF6FF` | `#1D4ED8` | `#BFDBFE` |
| Fragile | `#FFFBEB` | `#92400E` | `#FDE68A` |
| Unseen | `#F3F0EB` | `#78716C` | `#E8E5DF` |
| Streak | `#FFF7ED` | `#B45309` | — |
| FREE | `#F0FDF4` | `#15803D` | — |
| NEW | `#EFF6FF` | `#2563EB` | — |
| MAINS | `#FEF2F2` | `#B91C1C` | — |

---

## 10. Navigation Bar

```css
background: #FFFFFF;
border-top: 1px solid #E8E5DF;
height: 60px;
padding-bottom: env(safe-area-inset-bottom);
```

Tab item:
- Icon: 22px
- Label: 11px, Plus Jakarta Sans, weight 500
- Inactive: icon + label both `#A8A29E`
- Active: icon + label both `#2563EB`
- Active indicator: 2px top border on the icon column in `#2563EB` (like Kalam) OR just the blue color

No glow. No animated background pill. No elevation.

---

## 11. Page Header

**Screen with back navigation:**
```
[← icon button]    Screen Title (centered)    [optional action]
height: 52px
border-bottom: 1px solid #F0EEE9
title: 17px, Plus Jakarta Sans, weight 700, #1C1917
```

**Home screen (no back):**
```
[avatar or app icon]    [greeting + name]    [streak pill] [countdown pill]
No border-bottom
padding-top: 16px padding-bottom: 8px
```

---

## 12. Session / Question Screen Layout

This is the most critical screen. Maximum clarity.

```
─────────────────────────────
Progress bar (4px, full width, blue fill)
─────────────────────────────
[X close]         Q 3/20         [timer in green pill]
─────────────────────────────
[Queue badge: REVIEW / NEW / STRENGTHEN]

Question text
16px Inter, line-height 1.75, color #1C1917
─────────────────────────────
Answer options (white cards, 1.5px border)
  [A]  Option text
  [B]  Option text
  [C]  Option text
  [D]  Option text
─────────────────────────────
[Next / Confirm button — fixed at bottom]
─────────────────────────────
```

Rules for question screens:
- **White background — no tint, no texture**
- Question text: Inter 16px, weight 500, line-height 1.75
- No ambient decorations of any kind
- Answer letters (A, B, C, D): small gray pill on left, 12px, `#A8A29E`
- After answer revealed: only the selected option changes color — others stay neutral

---

## 13. Stats & Numbers

Big numbers on dashboard must be readable at a glance:

```
Stat number:     Inter 700, 36–44px, color = semantic accent
Stat label:      Plus Jakarta Sans 12px, weight 500, #78716C
Stat card:       white, border, rounded-xl, padding 16px, text-center
```

Do not put multiple big numbers fighting for attention. Maximum 3 hero stats at a time.

Progress ring:
```
Track stroke:    #E8E5DF, width 8
Fill stroke:     semantic color (green for mastered)
Center text:     Inter 700 28px, #1C1917
Sub-center:      Inter 400 12px, #A8A29E
```

---

## 14. Animations

**Philosophy:** Motion should feel like physics, not celebration. Study apps need calm, not excitement.

| Event | Animation | Duration |
|-------|-----------|----------|
| Screen enter | `opacity 0→1` + `translateY 10px→0` | 200ms ease-out |
| Card list stagger | delay: `index × 40ms` max 160ms total | 200ms |
| Answer select | border-color + background shift | 120ms |
| Correct answer reveal | green border fade in | 150ms |
| Wrong answer reveal | red border fade in | 150ms |
| Button press | `scale 0.97` | 100ms |
| Progress bar fill | `width` transition | 600ms ease-out |
| Page exit | `opacity 1→0` | 150ms |

**Permanently remove:**
- `pulse-cta` on buttons
- `animate-streak-bounce`
- `shimmer-text` on names/headings
- `animate-float` on icons
- `card-shimmer` sweep overlays
- `glow-pulse` opacity animation
- `spin-slow`
- All `box-shadow` glow rings (e.g. `0 0 24px rgba(...)`)

---

## 15. Subject / Category Color System

Each subject gets a **muted, professional accent** — not neon.

| Subject | Accent | Light bg | Use |
|---------|--------|----------|-----|
| Physics | `#1D4ED8` (deep blue) | `#EFF6FF` | icon bg, progress bar |
| Chemistry | `#7C3AED` (deep purple) | `#F5F3FF` | icon bg, progress bar |
| Biology | `#166534` (forest green) | `#F0FDF4` | icon bg, progress bar |
| DSA / CS | `#0E7490` (teal) | `#ECFEFF` | icon bg, progress bar |

---

## 16. Core CSS Variables (update src/index.css)

```css
@theme {
  --font-ui:      "Plus Jakarta Sans", system-ui, sans-serif;
  --font-body:    "Inter", system-ui, sans-serif;

  --color-background:          #F7F6F3;
  --color-surface:             #FFFFFF;
  --color-surface-variant:     #F0EEE9;
  --color-border:              #E8E5DF;

  --color-primary:             #2563EB;
  --color-primary-container:   #EFF6FF;
  --color-primary-border:      #BFDBFE;

  --color-success:             #15803D;
  --color-success-container:   #F0FDF4;

  --color-warning:             #B45309;
  --color-warning-container:   #FFFBEB;

  --color-error:               #B91C1C;
  --color-error-container:     #FEF2F2;

  --color-excellence:          #6D28D9;
  --color-excellence-container:#F5F3FF;

  --color-on-surface:          #1C1917;
  --color-on-surface-2:        #292524;
  --color-on-surface-variant:  #78716C;
  --color-on-surface-muted:    #A8A29E;
}
```

---

## 17. Glass Morphism — Removed Entirely

Replace every `glass-card` and `glass-card-premium` class with:

```css
.card {
  background: #FFFFFF;
  border: 1px solid #E8E5DF;
  border-radius: 14px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
```

No `backdrop-filter`. No `background: rgba(255,255,255,0.04)`. These create illegible, muddy surfaces.

---

## 18. Quick Reference Cheatsheet

```
─────────────────── COLORS ───────────────────
Page bg:      #F7F6F3     Card bg:    #FFFFFF
Border:       #E8E5DF     Surface:    #F0EEE9
Ink:          #1C1917     Body:       #292524
Muted:        #78716C     Ghost:      #A8A29E

Primary:      #2563EB     Primary bg: #EFF6FF
Success:      #15803D     Success bg: #F0FDF4
Warning:      #B45309     Warning bg: #FFFBEB
Error:        #B91C1C     Error bg:   #FEF2F2
Excellence:   #6D28D9     Excel. bg:  #F5F3FF

─────────────────── TYPE ─────────────────────
UI font:      Plus Jakarta Sans
Content font: Inter
Question:     Inter 16px / line-height 1.75
Body:         Inter 15px / line-height 1.65
Label:        Plus Jakarta Sans 13px / 500
Min size:     12px (absolute floor)

─────────────────── LAYOUT ───────────────────
Page padding: px-4
Section gap:  mt-6
Card:         p-4, rounded-[14px], border #E8E5DF
Button:       p-[15px], rounded-xl, Plus Jakarta Sans 700 15px
List row:     px-4 py-3.5, min-h-[56px]
```
