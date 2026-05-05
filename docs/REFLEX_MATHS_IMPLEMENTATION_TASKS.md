# REFLEX-MATHS Implementation Tasks

**Status:** Core validation logic complete. Visual mechanics and UX layer needed.
**Current Completion:** ~30% (functional testing framework, incomplete game experiences)

---

## PHASE 1: CORE MECHANICS (Priority: HIGH)

### 1. DOMAIN DUELS
**Current State:** Basic content + validation
**Missing:** Swipe input system, arrow diagram rendering

**Task:** Implement swipe-based response system
```typescript
// Required:
// - Detect 4-direction swipes (UP=injective, RIGHT=surjective, BOTH=bijective, DOWN=neither)
// - Render arrow diagram (set A → set B with drawn mappings)
// - 3-second time window with visual countdown
// - Combo multiplier tracking (×2 @ 5-streak, ×3 @ 10, ×4 @ 20)
```

**Acceptance Criteria:**
- [ ] Swipe detection working on all 4 directions
- [ ] Arrow diagrams render for `diagram: { setA: [], setB: [], mappings: [] }`
- [ ] Combo system displays and multiplies XP
- [ ] Time constraint enforced at 3s

---

### 2. PRINCIPAL VALLEY
**Current State:** Content with angles and expressions
**Missing:** Zone visualization, protractor selector, drag interface

**Task:** Implement zone-based drag + protractor interaction
```typescript
// Required:
// - 6 color-coded zones (sin⁻¹=blue, cos⁻¹=red, tan⁻¹=green, etc.)
// - Drag marker to zone (1.5s feedback)
// - Protractor angle selector within chosen zone
// - Sub-2s answers earn "compass tokens"
// - Principal branch reminder overlay on zone error
```

**Acceptance Criteria:**
- [ ] 6 zones render with NCERT-standard color coding
- [ ] Drag mechanics snap to zone + protractor opens
- [ ] Angle validation against correctZone + correctAngle
- [ ] Compass token reward system active
- [ ] 1.5s reminder overlay on zone-miss

---

### 3. MATRIX FORGE
**Current State:** Cell-by-cell input working
**Missing:** Forge visuals, compatibility enforcement, timeout handler

**Task:** Add matrix operation validation + theme
```typescript
// Required:
// - Multiplication compatibility check (incompatible matrix pairs trigger 2s burn)
// - 90-second timeout → auto-reveal correct matrix + FSRS reschedule
// - Sparks/gems on cells <1.5s response time
// - Blacksmith "forge" visual theme (forge hammer, glowing mould animation)
// - Forge level cosmetic unlocks on mastery
```

**Acceptance Criteria:**
- [ ] Incompatible matrices prevent operation (UI blocks interaction)
- [ ] 90s timeout handler works (auto-reveals, reschedules)
- [ ] Spark particles on fast cells
- [ ] Forge visuals render background
- [ ] Level progression tracking

---

### 4. DET DETECTIVE
**Current State:** Basic determinant computation
**Missing:** Cofactor UI, row-selection, shortcut detection

**Task:** Implement cofactor expansion UI + shortcuts
```typescript
// Required:
// - Row/column selection highlight (prefer zeros for bonus)
// - Drag cofactor signs (+ − +) onto cells
// - Type 3 minor determinants individually
// - Shortcut bonuses: row of zeros (−50% time, +2x XP), equal rows (det=0)
// - Row-ops bonus: detect R₂→R₂−2R₁ patterns before expanding
// - Noir detective theme (magnifying glass, case files)
```

**Acceptance Criteria:**
- [ ] Row/column selector UI renders
- [ ] Cofactor sign drag interface works
- [ ] Minor determinant step-by-step validation
- [ ] Shortcut detection (zero row, equal rows, row-ops)
- [ ] Case-file cosmetic unlocks

---

### 5. DERIVATIVE DOJO
**Current State:** Rule selection UI
**Missing:** Combo chain interface, belt progression, kata unlocks

**Task:** Implement martial-arts combo mechanics
```typescript
// Required:
// - Combo slots (chain → product → quotient, etc.)
// - 2–3 second window per move slot
// - Chain rule = "critical hit" (extra XP, visual flourish)
// - Belt progression (white → yellow → orange → ... → black)
// - Kata unlocks per rule type (exponential katas, trig katas)
// - Sensei bot demo on 3 wrong answers
```

**Acceptance Criteria:**
- [ ] Combo slot UI with timing windows
- [ ] Chain rule detects correct sequence
- [ ] Belt level system persists & displays
- [ ] Kata unlock triggers on mastery
- [ ] Sensei demo animation on 3-fail threshold

---

### 6. TANGENT TYCOON
**Current State:** Problem type selector
**Missing:** Live graph, 3-stage scoring, city theme

**Task:** Implement live graphing + multi-stage scoring
```typescript
// Required:
// - Live graph of function V(x) or f(x)
// - Stage 1: Drag predicted maximum point on graph
// - Stage 2: Type dV/dx = 0 root
// - Stage 3: Classify via second derivative sign
// - Revenue meter ticks during solving (time pressure)
// - City district unlocks (Calculus Quarter, Optimisation Outpost)
```

**Acceptance Criteria:**
- [ ] Graph renders live (use recharts or similar)
- [ ] Draggable maximum point with snap-to-graph
- [ ] 3-stage submission flow
- [ ] Revenue/progress meter animates
- [ ] District unlock system active

---

### 7. INTEGRAL INFERNO
**Current State:** Technique rune selection
**Missing:** **2.5s pattern-tap window, guided steps, Pattern-Drill mini-game**

**Task:** Implement technique recognition speed drill + guided completion
```typescript
// Required:
// - Rune choice in ≤2.5s → ×3 XP pattern-spotting bonus
// - Correct rune → guided-step overlay (1–3 fill-in blanks)
// - 3 wrong techniques in row → Pattern-Drill mini-game (rune-choice only, 60s)
// - Antiderivative collectible cards (album of 30+ standard forms)
// - Boss "definite-integral dragons" (unlocked per technique mastery)
// - Combo system: 3 consecutive correct techniques → "Mastery Gate" open
```

**Acceptance Criteria:**
- [ ] Rune-tap timer enforced at 2.5s (visible countdown)
- [ ] Pattern-spotting bonus multiplier applied correctly
- [ ] Guided-step overlay appears on correct technique
- [ ] Pattern-Drill triggered after 3 wrong (rune-only, no steps)
- [ ] Antiderivative card collection system active
- [ ] Dragon boss mechanics (one per technique)
- [ ] Combo gate opens after 3 consecutive

---

### 8. AREA ARCHITECT
**Current State:** Input fields for bounds, variable, area
**Missing:** Draggable bounds, shading animation, visual theme

**Task:** Implement bound-marker drag + animated region fill
```typescript
// Required:
// - Variable selector (dx/dy) in 1.5s window
// - Draggable lower/upper bound markers that snap to grid (intersection points)
// - Animated shading fills the region between curves as bounds are set
// - Bonus XP for choosing simpler integration variable
// - Drafting board theme (blueprint background, architect tools)
// - Build "architectural wonders" rewards
```

**Acceptance Criteria:**
- [ ] Variable selection timed & displayed
- [ ] Bound-marker drag with grid snapping to intersection points
- [ ] Shading animation fills region smoothly
- [ ] Variable simplicity bonus detected & applied
- [ ] Drafting board visuals render
- [ ] Monument progression tracking

---

### 9. DIFF-EQ DESCENT
**Current State:** Type selector UI
**Missing:** Spelunking theme, 3s rune window, rope rescue cinematic

**Task:** Implement descent-based flow + rescue system
```typescript
// Required:
// - "Ledge" descent (each DE is one ledge, player descends through levels)
// - Type rune choice in 3s window
// - Integrating-factor rune triggers special "glow" animation
// - 3 wrong types → "Rope rescue" cinematic with classification hints
// - Cave-depth unlocks (deeper = harder problems)
// - Fossil collection (each solved DE type = one collectible)
```

**Acceptance Criteria:**
- [ ] Rune-choice timer at 3s with visual countdown
- [ ] Integrating-factor rune animation triggers
- [ ] Rope rescue cinematic plays on 3-fail
- [ ] Cave depth progression unlocks
- [ ] Fossil collection system active

---

### 10. VECTOR VOYAGER
**Current State:** Operation selection + 3D input
**Missing:** 3D spaceship cockpit, octant placement, right-hand animation

**Task:** Implement 3D cockpit + octant positioning
```typescript
// Required:
// - 3D spaceship cockpit environment (Three.js / react-three-fiber)
// - Dot/cross product computation in 6s
// - Result vector drag to correct octant (3D space)
// - Docking mechanic (project a→b, visual docking animation)
// - Asteroid evasion (cross product → normal direction)
// - Right-hand-rule animation (animated 3D hand gesture)
// - Star systems unlocked, ship cosmetics on mastery
```

**Acceptance Criteria:**
- [ ] 3D cockpit renders in React component
- [ ] Octant selector UI (or drag-in-3D interface) works
- [ ] Right-hand rule animation plays on cross-product
- [ ] Docking feedback shows projection visually
- [ ] Asteroid evasion mini-game present
- [ ] Ship cosmetics unlock system

---

### 11. 3D ARCHITECT
**Current State:** Problem type selection
**Missing:** 3D visualization, camera rotation, visual scaffolding

**Task:** Implement 3D scene + camera interaction
```typescript
// Required:
// - 3D building scene (Three.js)
// - Camera rotation via drag (to view skew lines/planes)
// - Shortest-distance formula selection UI
// - Visual scaffolding: computed distance segment drawn in 3D
// - Direction cosines, angles, distances, foot of perpendicular
// - Temple building reward (monuments per problem class)
// - 30–120s per problem depending on difficulty
```

**Acceptance Criteria:**
- [ ] 3D scene renders with geometric objects (lines, planes)
- [ ] Camera drag-rotate working smoothly
- [ ] Formula selection UI context-sensitive
- [ ] Computed segment(s) drawn as visual feedback
- [ ] Monument unlock system active
- [ ] Time budgets enforced per difficulty

---

### 12. OPTIMA OUTPOST
**Current State:** Constraint + corner-point evaluation UI
**Missing:** Trading theme, inequality-card drag, polygon sketching

**Task:** Implement constraint card drag + boundary graphing
```typescript
// Required:
// - Frontier trading-post theme visuals
// - Drag inequality cards to setup pad
// - Sketch feasible polygon by tapping line-intersection points
// - Lights up corner points as they're identified
// - Type Z at each corner, declare optimum
// - Snap-feedback on lines and intersections
// - Boundary-flag mini-game for unbounded regions
// - Trade-route unlocks, "Cargo Crown" badge
```

**Acceptance Criteria:**
- [ ] Inequality card drag-drop to pad
- [ ] Line/intersection tap interface for polygon sketch
// - Corner-point highlighting/lighting system
- [ ] Z evaluation at each corner
- [ ] Boundary-flag mini-game for unbounded detection
- [ ] Trading-post visuals render
- [ ] Badge unlock system active

---

### 13. BAYES BAZAAR
**Current State:** Strategy selector + probability computation
**Missing:** Bazaar theme, tree-builder, independence mini-game, 4s rune window

**Task:** Implement probability-tree UI + mini-game
```typescript
// Required:
// - Bustling Indian bazaar theme (market stalls, vendors)
// - Strategy rune choice in 4s window (Direct/Conditional/TotalProb/Bayes)
// - Tree-builder canvas: drag nodes for P(A), P(B|A), etc.
// - Auto-checks: branch sums = 1, conditional probabilities ∈ [0,1]
// - Independence challenge mini-game (decide independent/dependent in 3s)
// - Stall ownership rewards
// - Collectible JEE probability puzzles
```

**Acceptance Criteria:**
- [ ] Rune-choice timer at 4s with countdown
- [ ] Tree-builder canvas renders with drag nodes
- [ ] Branch-sum validation (sum to 1 check)
- [ ] Independence mini-game triggers appropriately
- [ ] Stall-ownership progression tracking
- [ ] JEE puzzle collection system active

---

## PHASE 2: VISUAL & ANIMATION POLISH

### Global Tasks
- [ ] Add Framer Motion animations to all transitions
- [ ] Implement Material Symbols icons for all UI elements
- [ ] Add sound effects (success chime, error buzz, level-up fanfare)
- [ ] Mobile-responsive layout for all games (48dp+ touch targets)
- [ ] Dark mode support for all themes

### Per-Game Visual Tasks
- [ ] Domain Duels: Animate arrow paths, flash gold on correct
- [ ] Principal Valley: Animate zone borders, angle arc visualization
- [ ] Matrix Forge: Sparking particles on cell completion, hammer swing
- [ ] Det Detective: Magnifying glass focus animation, case-file overlays
- [ ] Derivative Dojo: Combo chain visual feedback, belt-color progression
- [ ] Tangent Tycoon: Live graph curve drawing, district silhouettes
- [ ] Integral Inferno: Dungeon progression, rune glow, dragon boss
- [ ] Area Architect: Blueprint grid, shading animation, building skyline
- [ ] Diff-Eq Descent: Ledge-by-ledge descent animation, rope asset
- [ ] Vector Voyager: Ship banking animations, asteroid particles
- [ ] 3D Architect: Building materials (stone, metal), scaffold reveal
- [ ] Optima Outpost: Wagon movement, cargo loading, flag animations
- [ ] Bayes Bazaar: Market ambient (vendor calls, coins), stall variations

---

## PHASE 3: REWARD & PROGRESSION SYSTEMS

### Global Reward System
- [ ] Gem economy (earning on VR-7, spending on unlocks)
- [ ] Crown system (4 perfect runs = 1 Crown per level)
- [ ] XP tracking + level progression
- [ ] Streak system (consecutive daily missions)
- [ ] Streak Freeze (1 free per week, buyable with gems)

### Per-Game Unlock Systems
- [ ] Domain Duels: Arrow-diagram cosmetics, badge at 200 bijections
- [ ] Principal Valley: Ornamental valleys (Ramanujan Valley, Aryabhata Pass)
- [ ] Matrix Forge: Forge levels, titanium plates, "Master Smith" badges
- [ ] Det Detective: Case files (story of Cramer, Cayley), magnifying glass
- [ ] Derivative Dojo: Belt progression white→black, kata per rule type
- [ ] Tangent Tycoon: City districts (Calculus Quarter, Optimisation Outpost)
- [ ] Integral Inferno: Antiderivative album, dragon boss per technique
- [ ] Area Architect: Architectural wonders, building cosmetics
- [ ] Diff-Eq Descent: Cave depths, fossil collection per type
- [ ] Vector Voyager: Star systems, ship customization
- [ ] 3D Architect: Temple monuments per problem-class
- [ ] Optima Outpost: Trade routes, "Cargo Crown" badge
- [ ] Bayes Bazaar: Stall ownership, JEE puzzle collectibles

---

## PHASE 4: INTEGRATION & TESTING

### Integration Tasks
- [ ] Wire all games into MathsGameLauncher with game-select grid
- [ ] Connect onComplete handlers to FSRS scheduler
- [ ] Implement skill-tracking (skillId → FSRS card mapping)
- [ ] Add performance analytics (response times, error patterns)

### Testing Checklist
- [ ] Unit tests for validation logic (correctness checks per game)
- [ ] Integration tests for score/streak/XP calculation
- [ ] E2E tests for game flow (select → play → complete → return)
- [ ] Performance tests (60fps during animations, <500ms response)
- [ ] Accessibility audit (keyboard nav, screen-reader friendly)

---

## Technical Debt & Cleanup

- [ ] Consolidate duplicate timer/score components into reusable primitives
- [ ] Extract animation constants to shared config file
- [ ] Refactor game-specific validation into pure functions (testable)
- [ ] Move theme colors to DESIGN_SYSTEM.md for consistency
- [ ] Document input-handling patterns (swipe, drag, keyboard shortcut)
- [ ] Optimize KaTeX rendering (memoize, server-side cache)

---

## Estimated Effort

| Phase | Tasks | Effort | Priority |
|---|---|---|---|
| **Phase 1** | 13 games × core mechanics | 20–30 days | HIGH |
| **Phase 2** | Animations + visuals | 10–15 days | HIGH |
| **Phase 3** | Rewards + progression | 7–10 days | MEDIUM |
| **Phase 4** | Integration + testing | 5–7 days | MEDIUM |

**Total:** ~40–60 developer-days for full implementation

---

## File References

- Game components: `src/games/maths/games/*.tsx`
- Content files: `src/games/maths/data/*Content.ts`
- Primitives: `src/games/maths/primitives/*.tsx`
- Types: `src/games/types.ts`
- Spec: `src/games/components/maths/games.md`
- Design system: `DESIGN_SYSTEM.md`

---

**Last Updated:** 2026-05-05
**Status:** Ready for Sonnet/Opus implementation
