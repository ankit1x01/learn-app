# REFLEX-MATHS: A Gamified, Subconscious-Training System for Class 12 Mathematics

## TL;DR
- **The science is settled, the design is the leverage point.** Mathematical automaticity (Dehaene, Bjork, Sweller, Chase & Simon) is built by the same mechanisms typing tutors and chess training exploit: thousands of recognise-pattern → execute-procedure cycles delivered in short, timed, spaced, interleaved bursts under variable-ratio reward — not by long, blocked, untimed problem sets.
- **Thirteen reflex-trainer micro-games, one engine.** Each NCERT Class 12 chapter is expressed as a distinct micro-game (e.g., *Matrix Forge*, *Vector Voyager*, *Integral Inferno*) whose core loop is a 3–7 second stimulus → tap/swipe response cycle, scaffolded across Beginner→Mastery tiers via an Elo/MIRT adaptive engine, with FSRS-scheduled review and a daily 25-minute Mission that interleaves topics.
- **Full implementation stack provided.** Next.js + Phaser 3 hybrid, Zustand for game state + Redux Toolkit/RTK Query for server state, FSRS-6 spaced repetition, multidimensional Elo skill model, LLM-driven question generation with skill-pair prompting (Shah et al., 2024), and a Postgres schema covering users, skills, items, reviews, and Elo updates — designed mobile-first for Indian Class-12 students.

---

## Key Findings

1. **Automaticity is retrieval, not procedure.** Dehaene's neuroimaging shows that fluent arithmetic shifts brain activity from prefrontal-parietal "procedure" networks to left angular-gyrus "retrieval" networks. The same shift must be engineered for every Class 12 micro-skill — from `d/dx(sin⁻¹x)` to `|A·B×C|` — by forcing fast, repeated retrieval rather than re-derivation.
2. **Chunks, not steps, are the unit of expertise.** Chase & Simon and Gobet's chess research shows masters perceive ~50,000–100,000 domain-specific chunks. The system must therefore drill *patterns* (e.g., "sees `∫ f'(x)/f(x) dx`" → reflex "log|f(x)|+C") rather than free-form derivation.
3. **Desirable difficulties beat blocked drill.** Bjork's interleaving and spacing research, replicated by Rohrer & Taylor for math, shows mixed problem-types and spaced retrieval produce 40–70% better long-term retention than mass practice — even though students *feel* less competent during training.
4. **Variable-ratio reward + flow channel = retention.** Duolingo A/B data: streaks raise commitment ~60%, Streak Freeze cuts churn 21%. Variable-ratio reinforcement (Schultz et al.) drives dopaminergic prediction-error signalling that consolidates procedural memory.
5. **FSRS-6 is the current gold standard for spacing.** Across ~700M Anki reviews it outperforms SM-2 for 99.5% of users and needs 20–30% fewer reviews for the same retention; it should be the per-skill scheduler.
6. **Elo / MIRT for live difficulty.** Pelánek (2016) and Klinkenberg et al. (2011) show Elo updates produce robust per-skill ability estimates from sparse practice data — ideal for a 13-topic system where each topic is a "rating dimension."
7. **Phaser-in-React is the proven hybrid.** Phaser 3 (canvas/WebGL) for game scenes, React/Next.js for UI/menus/leaderboards, communicated via an event bus inside `useEffect` hooks; Zustand for ephemeral game state, RTK Query for backend sync.

---

## Details

# PART 1 — NEUROSCIENCE & COGNITIVE SCIENCE BASIS

### 1.1 Pattern recognition loops in math
Chase & Simon's chunking theory (1973), validated across chess, physics, and mathematics (Hinsley et al., 1977; Gobet & Simon, 2000), holds that experts solve problems "forward" by recognising configurations and triggering stored productions ("if I see X, do Y"), whereas novices search backward through declarative rules. In Class 12 math, this translates to: an expert sees `∫ x e^x dx` and instantly fires the "ILATE → integration-by-parts" production; a novice tries to substitute, fails, retries. The system must therefore make **stimulus-response pairing** the fundamental unit, not concept exposition.

### 1.2 Spaced repetition and the forgetting curve
Ebbinghaus (1885) showed ~70% of new information is lost in 24 hours without review. Modern algorithms have evolved:
- **SM-2 (1987)**: rigid, six-grade response, used by classic SuperMemo and pre-2023 Anki.
- **FSRS-6 (2022→)**: 21 trainable parameters fit per-user; uses a power-law forgetting curve with three latent states (Difficulty, Stability, Retrievability). Schedules reviews when retrievability drops below a target (typically 0.9). Beats SM-2 for 99.5% of users in the open-spaced-repetition benchmark of ~350M reviews.
- For procedural math skills (e.g., "differentiate `tan⁻¹x`"), each *micro-skill* is treated as an FSRS card; the "answer" is the correct procedure executed within a target reaction time.

### 1.3 Chunking and Miller's Law
Miller (1956): working memory holds ~7±2 items, but each "item" can be an arbitrarily compressed chunk. Expert mathematicians compress procedures (e.g., `(x²+a²)⁻¹ → (1/a)tan⁻¹(x/a)+C`) into single chunks, freeing working memory for novel structure. The system must drive students from many small, fragile chunks toward fewer, bigger, more reliable ones via repeated successful retrieval.

### 1.4 Dopamine and variable-ratio reinforcement
Schultz's reward-prediction-error work and Berridge & Robinson's incentive-salience theory show that *unpredictable* reward (variable ratio) drives the strongest dopaminergic learning signal. This is why slot machines, Duolingo gem drops, and randomised loot reinforce behaviour. In REFLEX-MATHS, every correct answer earns a *baseline* XP, but **bonus loot drops** (gems, cosmetic unlocks, Streak Freeze tokens) appear on a VR-7 schedule (≈1 in 7 correct answers) — sufficient to sustain habit, restrained enough to avoid frank addiction.

### 1.5 Fast feedback loops — the motor-learning analogy
Implicit-motor-learning research (Maxwell, Masters, Poolton) shows automaticity emerges fastest when feedback is (a) immediate, (b) about *result* (knowledge of results) not *process* (knowledge of performance), and (c) intermittently rather than continuously delivered. The typing-tutor analogue is exact: each keystroke is graded in <100 ms; muscle memory forms over thousands of micro-trials. Math reflexes form the same way when each tap is graded in <500 ms.

### 1.6 Error-based learning, interleaving, desirable difficulties
Bjork's framework: *spacing*, *interleaving*, *varying conditions*, *generation/testing*, and *reduced feedback* feel harder during training but produce dramatically better retention and transfer. Rohrer & Taylor (2007) showed interleaved math practice (mixing volumes of prism/cylinder/cone problems) produced ~2× test scores vs. blocked practice. The system therefore *interleaves* topics within sessions and varies surface forms of identical structures.

### 1.7 Cognitive load (Sweller)
- **Intrinsic load** = inherent complexity of the math (manipulated by the level system).
- **Extraneous load** = irrelevant cognitive cost (eliminated via clean UI, no distracting decoration around active math).
- **Germane load** = effort building schemas (maximised via worked-example→completion-problem→full-problem fading).

The level structure follows the *worked-example effect*: novices see fully worked patterns; intermediates fill in steps (completion problems); advanced learners solve free-form. Element-interactivity is throttled per level.

### 1.8 Implicit vs explicit learning
Systematic review (Kal et al., 2018, PLOS ONE): implicit motor learning produces greater automaticity under dual-task conditions. Translated to math: instruction should under-verbalise rules in advanced levels, lean on examples and correct/incorrect feedback, and reserve explicit declarative coaching for the *introduction* of a chunk only.

### 1.9 Dehaene's number sense and automaticity
Dehaene's *The Number Sense* (1997, rev. 2011) and *How We Learn* (2020) argue that fluent calculation recruits the left angular gyrus (verbal retrieval), while novel computation recruits the bilateral intraparietal sulcus (quantity manipulation). Repeated successful retrieval is what hands the work over to retrieval circuits — exactly what timed-drill micro-games create. Vukovic & Lesaux's longitudinal fMRI work confirms early parietal engagement for arithmetic predicts later behavioural fluency.

---

# PART 2 — THE 13 TOPIC GAMES

For each chapter the schema is: **A** Concept Breakdown → **B** Game → **C** Mapping → **D** Levels → **E** 5-min Session → **F** Subconscious Training mechanism. Game names are themed.

---

## CHAPTER 1 — Relations and Functions
### 🎮 Game: **DOMAIN DUELS**

**A. Micro-skills:** check reflexivity / symmetry / transitivity; classify equivalence relations; recognise injection / surjection / bijection; identify domain-codomain compatibility; compose `f∘g`; spot identity, constant, and one-one mapping signatures.

**B. Game design.**
- **Core loop:** an *arrow diagram* flashes (set A → set B with mappings drawn) for 1.5 s. Player swipes UP=injective, RIGHT=surjective, BOTH=bijective, DOWN=neither — within 3 s. Correct → arrow turns gold, gem; wrong → red shake, correct answer shown for 800 ms.
- **Mechanics:** 60-second rounds, 20-question waves; *Combo Multiplier* (×2 at 5-streak, ×3 at 10, ×4 at 20); *Distractor* monsters (deceptive arrow placements). Boss waves at every 3 minutes test composition `(g∘f)(x)`.
- **Failure system:** No life loss for wrong answer; instead a *re-prompt* appears next round with the same structure, a hint highlighting the violating element. After 3 wrong on the same micro-skill, a 10-second "explainer cinematic" plays.
- **Reward:** XP per correct (10/correct, +bonus for sub-1.5s), gem on VR-7, badge unlock at 200 bijections recognised.

**C. Mapping table:**
| Math concept | Game mechanic |
|---|---|
| Reflexive | Self-loop arrows that must be tapped first |
| Equivalence relation | "Tile-grouping" mini-puzzle: drag tiles into equivalence classes |
| Composition | Two-stage swipe: first map tile from A→B, then B→C |
| Inverse exists ⇔ bijective | Locks/keys metaphor — only bijective maps unlock the chest |

**D. Levels (concrete params):**
- **Beginner (E1–E1500):** sets of size ≤4, only injective/surjective binary check, time 5s, no distractors.
- **Intermediate (1500–1800):** sets ≤6, equivalence-relation tile sort, time 3.5s, 1 distractor.
- **Advanced (1800–2200):** sets ≤8, full bijection check + composition, time 2.5s, multi-distractors, mod-arithmetic equivalence.
- **Mastery (2200+):** abstract relations on infinite sets stated symbolically (e.g., "(a,b)R(c,d) iff ad=bc on Z×Z*"), time 4s, reasoning-chain answers.

**E. 5-minute session:** 0:00–0:30 warmup ×8 simple injective swipes (Elo 1500). 0:30–2:30 wave A: 24 mixed Q's, combo built to ×3. 2:30–2:50 mini-boss "Equivalence Forge": drag 9 tiles into 3 classes mod 3. 2:50–4:30 wave B with composition twist. 4:30–5:00 cool-down: 5 review cards (FSRS resurfaced from past sessions). Score: ~270 XP + 2 gems.

**F. Subconscious training:** By collapsing the verbal "is this injective?" check into a sub-2s swipe, the student's prefrontal verification loop is bypassed. The arrow-pattern itself becomes the chunk; bijection is *seen*, not derived.

---

## CHAPTER 2 — Inverse Trigonometric Functions
### 🎮 Game: **PRINCIPAL VALLEY**

**A. Micro-skills:** know domains/ranges of `sin⁻¹, cos⁻¹, tan⁻¹, cot⁻¹, sec⁻¹, cosec⁻¹`; compute principal values from a memorised value table (`±1/2, ±√2/2, ±√3/2, ±1, ±1/√3, ±√3`); apply identities `sin⁻¹x + cos⁻¹x = π/2`, `tan⁻¹x + tan⁻¹y = tan⁻¹((x+y)/(1−xy))`, double-argument formulas; place answer in correct principal branch.

**B. Game design.**
- **Core loop:** A "valley" landscape with 6 colour-coded zones (one per principal range, e.g., sin⁻¹ zone = `[−π/2, π/2]` shaded blue). An expression flashes (e.g., `cos⁻¹(−1/2)`). Player drags a marker onto the correct zone *and* the correct angle on the in-zone protractor — within 4s.
- **Mechanics:** Wrong-zone = instant red flash; right zone wrong angle = yellow + retry. Combo-streak bonus when 5 consecutive answers land in correct zones.
- **Failure:** Mis-zoned answer triggers a 1.5s "principal-branch reminder" overlay that fades; same item is FSRS-rescheduled to next-day review.
- **Reward:** Gold "compass" tokens for sub-2s answers; unlocks ornamental valleys (Ramanujan Valley, Aryabhata Pass).

**C. Mapping:** Range constraint → spatial zone; identity application → "bridge" between two zones; quadrant sign → colour inversion.

**D. Levels:**
- **Beginner:** simple values from the standard table; time 6s.
- **Intermediate:** negative arguments + reciprocal-function angles; time 4s.
- **Advanced:** identity manipulation (`tan⁻¹(2x/(1−x²)) = 2 tan⁻¹x` recognition); time 3s.
- **Mastery:** chained simplifications, e.g., `cos(2 tan⁻¹(1/7))`, time 5s.

**E. 5-min session:** 8 standard-table sprints → 6 negative-argument trials → identity bridge mini-puzzle (3 questions, each 8s) → 5 chained simplifications. Average 25 questions, target 88% accuracy.

**F. Subconscious training:** The colour-coded *spatial* zones tag the abstract range constraint to a visual region — exploiting the parietal-cortex spatial representation. After ~600 trials the student "sees" `cos⁻¹` as the blue strip from 0 to π *without* recalling the rule.

---

## CHAPTER 3 — Matrices
### 🎮 Game: **MATRIX FORGE**

**A. Micro-skills:** identify order; classify (square, diagonal, scalar, identity, zero, symmetric, skew-symmetric); add, subtract, scalar-multiply; multiply matrices (compatibility check); transpose; recognise (A+B)ᵀ, (AB)ᵀ; invert 2×2 / 3×3; symmetric+skew decomposition; elementary row operations.

**B. Game design.**
- **Core loop:** A blacksmith forge. Two metal "ingots" (matrices) appear. Player taps an *operation hammer* (+, −, ×, T, inv) and **drops the result element-by-element into a glowing mould** within a time budget proportional to the result size (e.g., 2×3 matrix → 12 s).
- **Mechanics:** Each cell typed correctly hisses and locks in green; wrong cell glows red and must be retyped — but partial credit accrues. *Sparks* (gem drops) on cells answered in <1.5s. Multiplication compatibility is enforced: incompatible ingots refuse to fuse and burn 2 s of clock.
- **Failure:** No fail state; matrix must be completed. After 90s timeout the correct matrix is auto-revealed and the item is FSRS-rescheduled.
- **Reward:** Forge level (cosmetic), titanium plates (currency), "Master Smith" badges per micro-skill.

**C. Mapping:** Cell-by-cell typing → forces explicit Σ_k a_{ik}b_{kj} retrieval; transpose → mirror animation across diagonal; elementary row-op → cards labelled R₁→R₁−2R₂.

**D. Levels:**
- **Beginner:** 2×2 add/sub/scalar; 30s budget.
- **Intermediate:** 2×2 multiplication, 3×3 transpose, identity recognition; 25s.
- **Advanced:** 3×3 multiplication, symmetric/skew decomposition, 2×2 inverse via adjugate; 20s.
- **Mastery:** 3×3 inverse via row operations on [A|I], invertibility of singular vs nonsingular discrimination; 60s for inverse, 12s for diagnostics.

**E. 5-minute session:** Two 2×2 multiplications (45s) → one transpose (15s) → one (A+Aᵀ) symmetric decomposition (45s) → one 3×3 determinant-prep multiplication (60s) → one 2×2 inverse (45s) → 30s of "snap" classification (square/diag/scalar). Total ~25 cells correctly typed.

**F. Subconscious training:** Cell-typing turns matrix multiplication from a *conscious sigma-loop* into a *spatial-reach* habit: left row × right column → that cell. After ~200 multiplications, the student no longer "computes" rows×columns; the next cell to fill is *anticipated*.

---

## CHAPTER 4 — Determinants
### 🎮 Game: **DET DETECTIVE**

**A. Micro-skills:** 2×2 ad−bc reflex; 3×3 cofactor expansion; row/column properties (swap → −, common factor → factor out, equal rows → 0, row-add → unchanged); minors and cofactors; adjoint and inverse via 1/|A| · adj(A); area of triangle (½|det|); singularity test; Cramer's rule for systems.

**B. Game design.**
- **Core loop:** A noir detective scene. A "suspect" 3×3 matrix appears with one row faintly highlighted. Player must (a) tap the correct *expansion row/column* (the one with most zeros), (b) drag the cofactor signs (+ − +) onto cells, (c) type three minor determinants, (d) sum. Each step times-out individually.
- **Mechanics:** "Shortcut bonuses" if the player spots a row of zeros, two equal rows, or applies a row-op to create zeros (drag R₂ → R₂−2R₁) before expanding — these halve the computation budget and double XP.
- **Failure:** Wrong sign placement = pop-up pattern reminder; wrong minor = recompute that minor only.
- **Reward:** "Magnifying glass" cosmetics, unlock case files (story of Cramer, Cayley).

**C. Mapping:** Row-property reflex → *spotting* a singular matrix; Cramer → "evidence chart" overlay where Δ, Δ₁, Δ₂, Δ₃ light up.

**D. Levels:**
- **Beginner:** 2×2 ad−bc, time 4s.
- **Intermediate:** 3×3 expansion along chosen row, time 60s; sign-pattern reflex 2s.
- **Advanced:** Use a row-op to create two zeros before expanding; area of triangle from 3 vertices; time 50s.
- **Mastery:** 4×4 by row-reduction; full Cramer 3-variable system; time 90s.

**E. 5-min session:** 6× 2×2 sprints → row-property reflex round (12 cards in 30s) → one full 3×3 with row-op trick → one Cramer system (3 unknowns, 90s) → 30s cool-down on adjoint formula recall.

**F. Subconscious training:** The "spot the easy row" reflex is the chess equivalent of seeing a tactical motif. By rewarding shortcuts time-double, the student internalises *property recognition before computation* — the hallmark of expert determinant solvers.

---

## CHAPTER 5 — Continuity and Differentiability
### 🎮 Game: **DERIVATIVE DOJO**

**A. Micro-skills:** continuity check at a point (LHL = RHL = f(c)); piecewise continuity reasoning; differentiability ⇒ continuity; chain rule; product/quotient rule; logarithmic differentiation; implicit differentiation; parametric forms `dy/dx = (dy/dt)/(dx/dt)`; second derivatives; derivatives of inverse-trig and exponential/log.

**B. Game design.**
- **Core loop:** A martial-arts dojo. A function "opponent" appears written symbolically (e.g., `y = (sin x)^x`). Player must execute a *combo* of differentiation moves: tap "log both sides" → drag to "differentiate implicitly" → produce dy/dx. Each move slot has a 2-3s window. Final answer typed in 6s.
- **Mechanics:** Combos chain into special moves (Chain-Strike, Quotient-Slam, Log-Bomb). Mis-chain = stagger animation, must restart combo. *Critical hits* on perfect timing of chain rule (`d/dx[f(g(x))] = f'(g(x))·g'(x)`).
- **Failure:** A "sensei bot" appears at 3 wrong answers and demonstrates the combo once; item is moved to FSRS next-day queue.
- **Reward:** Belt progression (white→black), kata unlocks (one per derivative class — exponential katas, trigonometric katas).

**C. Mapping:** Each rule = one combat move with a distinct visual/audio signature; chain rule animation literally chains opponents; implicit differentiation = "shadow" function tactic.

**D. Levels:**
- **Beginner:** polynomial + standard trig + exp/log derivatives, single rule, 5s.
- **Intermediate:** chain rule one layer deep + product/quotient, 4s.
- **Advanced:** logarithmic, implicit, parametric; chains of 2–3 rules; 8s.
- **Mastery:** continuity + differentiability at piecewise junctions (find a, b such that f is differentiable at x = c); 30s of structured reasoning.

**E. 5-min session:** 12 single-rule sprints (60s) → 6 chain-rule combos (90s) → 1 logarithmic-differentiation kata (45s) → 1 piecewise-continuity puzzle (60s) → 1 parametric (45s).

**F. Subconscious training:** The combo system trains the *order of operations* of differentiation as a motor sequence (log → differentiate → multiply by y → solve for dy/dx). Within ~400 trials, the student no longer plans the chain; it executes.

---

## CHAPTER 6 — Applications of Derivatives
### 🎮 Game: **TANGENT TYCOON**

**A. Micro-skills:** rate-of-change problems; tangent and normal lines; increasing/decreasing on intervals (sign of f'); local maxima/minima (first and second derivative tests); absolute extrema on closed intervals; concavity and points of inflection; optimisation (max area/volume problems with calculus).

**B. Game design.**
- **Core loop:** A city-building tycoon screen. Player runs scenarios: "design a box of max volume from a 24×24 sheet by cutting squares of side x." A live graph of V(x) is drawn; the player drags x to predicted maximum, then *confirms by typing* dV/dx = 0 root, then second derivative sign.
- **Mechanics:** Three-stage scoring: (1) intuition guess on the graph, (2) algebraic critical-point computation, (3) classification. Bonus for picking the global max not just a local one. Live revenue meter ticks during the puzzle — incentive to be fast *and* accurate.
- **Failure:** Wrong critical point = "construction collapses" animation; system shows worked solution; FSRS reschedule.
- **Reward:** Build city districts (Calculus Quarter, Optimisation Outpost), each unlocked by mastering a sub-skill.

**C. Mapping:** Sign-of-derivative reflex → traffic-light overlay on number line; tangent line → laser pointer dragged to curve.

**D. Levels:**
- **Beginner:** find tangent line at a point; 25s.
- **Intermediate:** find intervals where f is increasing; 40s.
- **Advanced:** standard optimisation (cylinder of max volume in cone, ladder problem); 90s.
- **Mastery:** mixed problems with constraint substitution, multi-variable reduced to single-variable; 120s.

**E. 5-min session:** 1 tangent line (25s) + 1 monotonicity (40s) + 1 box optimisation (90s) + 1 marginal-cost rate problem (60s) + 1 quick second-derivative classification card (15s). Target ~5 problems with 85% correctness.

**F. Subconscious training:** The graph→algebra→classification triple-step burns in the *workflow* itself. Students stop asking "what do I do here?" and reflexively run setup→f'=0→sign-test.

---

## CHAPTER 7 — Integration
### 🎮 Game: **INTEGRAL INFERNO**

**A. Micro-skills (highest-leverage chapter):** standard formula recall (~30 antiderivatives); pattern recognition for substitution (`∫ f'(x)·g(f(x))dx`, `∫ f'(x)/f(x)dx`); integration by parts (ILATE); partial fractions (linear, repeated linear, quadratic); trigonometric integrals; special forms (`1/(x²±a²)`, `1/√(a²−x²)`, `1/√(x²±a²)`, `√(a²−x²)`, etc.); definite integrals + properties (`∫₀^a f(x)dx = ∫₀^a f(a−x)dx`, even/odd, periodicity).

**B. Game design.**
- **Core loop:** A dungeon crawler. Each "room" contains an integrand displayed centrally. Player taps one of six **technique runes** (Direct-Formula, u-Sub, Parts, Partial-Fractions, Trig-Identity, Standard-Special-Form) within 2.5 s. If correct technique, a guided-step overlay appears; player completes 1–3 fill-in blanks. Reward chest at the end.
- **Mechanics:** *Pattern-spotting score* — fastest correct rune choice gets ×3 XP. *Combo system* — 3 consecutive correct technique-spots open a "Mastery Gate." Misidentified technique = correct rune flashes for 1s, item rescheduled.
- **Failure:** Three wrong techniques in a row triggers a 60-second *Pattern-Drill* mini-game with only the rune-choice step (no completion), to retrain the cue→technique mapping.
- **Reward:** Antiderivative cards collected (collectible album of all 30+ standard forms), boss "definite-integral dragons" unlocked.

**C. Mapping (the critical chunking grid):**
| Surface cue | Reflex technique |
|---|---|
| `f'(x)/f(x)` | log\|f(x)\| (u-sub) |
| `e^{ax}·sin(bx)` or `e^{ax}·cos(bx)` | parts twice + algebraic loop |
| `polynomial × ln, sin⁻¹, etc.` | parts (ILATE) |
| `1/(quadratic)` | complete the square → standard arctan/log |
| `√(a²−x²)`, `√(x²±a²)` | trig substitution or standard formula |
| `rational with distinct linear factors` | partial fractions |
| `even powers of sin/cos` | half-angle identity |
| `odd power of sin or cos` | save one factor, sub the other |

**D. Levels:**
- **Beginner:** direct standard-formula room only; 8s per question; 10 antiderivatives in rotation.
- **Intermediate:** add u-sub and parts; 15s; 25 patterns in rotation.
- **Advanced:** full 6-rune choice + partial fractions; 25s; properties of definite integrals.
- **Mastery:** mixed-technique problems where the first move is partial-fractions then sub then a special form; 90s.

**E. 5-min session (canonical, since this is the highest-frequency reflex needed):**
- 0:00–0:30 — six rapid-fire **standard-form-ID** cards, 5s each (e.g., `∫dx/(x²+9)` → tap "arctan rune").
- 0:30–1:30 — 4 u-sub completion problems (`∫ 2x cos(x²)dx` etc.).
- 1:30–2:30 — 3 by-parts problems (xeˣ, x sin x, x²lnx).
- 2:30–3:30 — 2 partial-fractions completion (one repeated linear).
- 3:30–4:00 — 1 definite-integral property puzzle (apply `∫₀^π/2 f(x)/(f(x)+f(π/2−x))dx = π/4`).
- 4:00–5:00 — review boss room + FSRS pop-up cards from prior sessions.

**F. Subconscious training:** The 6-rune classification loop trains the **pattern → procedure** mapping that is the integration expert's core skill. Class 12 students typically fail integration not because they cannot execute by-parts but because they don't *recognise* when to use it. Drilling the rune-tap to <2.5 s collapses the recognition step from a conscious 20-second dither into an automatic glance.

---

## CHAPTER 8 — Applications of Integrals
### 🎮 Game: **AREA ARCHITECT**

**A. Micro-skills:** sketch the region; identify integration variable (x or y) by orientation of strips; set bounds from intersections; area between curves `∫(top − bottom)dx`; area between two intersecting curves; area bounded by a curve and an axis.

**B. Game design.**
- **Core loop:** Architect's drafting board. Two curves are drawn. Player must (1) tap whether to integrate dx or dy (1.5s), (2) drag the lower and upper bound markers to intersections (3s, snapping to grid), (3) type the integrand `top(x)−bottom(x)`, (4) compute the definite integral.
- **Mechanics:** Animated "shaded region" fills as the player sets bounds — visual confirmation. Bonus XP for correctly choosing the simpler integration variable.
- **Failure:** Wrong variable choice → see the alternate integral with extra work, then retry; wrong bounds → highlight true intersections.
- **Reward:** Build architectural wonders (each requires N successful area computations).

**C. Mapping:** Region orientation → variable choice; intersection points → bound-snapping puzzle.

**D. Levels:**
- **Beginner:** area under one curve, x-axis bounds given.
- **Intermediate:** between two curves, intersections to be found algebraically.
- **Advanced:** regions requiring split bounds (curve crosses), variable swap to dy when easier.
- **Mastery:** parametric/polar regions (extension), regions bounded by 3+ curves.

**E. 5-min session:** 1 single-curve area (45s) + 2 between-curves (90s) + 1 split-bound (90s) + 1 dy-integration trick (60s).

**F. Subconscious training:** The drag-bounds-to-intersection mechanic burns in the *visual* representation of the integral as a strip-sweep, exactly the mental model expert problem-solvers use.

---

## CHAPTER 9 — Differential Equations
### 🎮 Game: **DIFF-EQ DESCENT**

**A. Micro-skills:** order/degree identification; classify as variable-separable, homogeneous, linear (`dy/dx + Py = Q`), exact; integrating-factor `e^∫P dx`; solve standard forms; verify a solution; form a DE from a family of curves.

**B. Game design.**
- **Core loop:** Spelunking descent. Each "ledge" is a DE; player taps a *type rune* (separable, homogeneous, linear, exact) within 3s, then performs 2–3 solving steps.
- **Mechanics:** Linear-DE rune triggers an "integrating factor" glow animation; wrong-rune choice causes the ledge to crumble and player retries with hint.
- **Failure:** Three wrong types → "rope rescue" cinematic explains classification cues.
- **Reward:** Cave depths unlocked, fossils (each fossil = a canonical solved DE from the syllabus).

**C. Mapping:** Type recognition → rune; separation of variables → physical "splitting" of the equation into two halves; integrating factor → glowing prefix.

**D. Levels:**
- **Beginner:** order/degree pop quiz; simple separable.
- **Intermediate:** linear with constant coefficients; homogeneous via y = vx.
- **Advanced:** mixed types; word problems (population growth, Newton's cooling).
- **Mastery:** form a DE from a family (e.g., circles passing through origin), Bernoulli reductions.

**E. 5-min session:** 8 type-ID flashes (40s) → 1 separable solve (60s) → 1 linear with IF (90s) → 1 homogeneous (75s) → review card.

**F. Subconscious training:** Forces *classify-before-solve* discipline; students stop the common error of attempting to integrate a linear DE directly.

---

## CHAPTER 10 — Vectors
### 🎮 Game: **VECTOR VOYAGER**

**A. Micro-skills:** vector representation `aî+bĵ+ck̂`; magnitude; unit vector; addition/subtraction (parallelogram/triangle); position vectors; section formula; dot product (definition, `a·b = |a||b|cosθ`, perpendicularity, projection); cross product (definition, magnitude = area, direction by right-hand rule); scalar triple product `[a b c]` (volume); coplanarity test.

**B. Game design.**
- **Core loop:** A 3D space-flight cockpit (rendered with Three.js / Phaser canvas + CSS-3D). Targets appear as 3D vectors. Player must (a) compute dot/cross product within 6 s, (b) drag the resulting vector into the correct octant.
- **Mechanics:** *Dock targets* using projections (project a→b to dock); *Asteroid evasion* using cross product (find normal direction). Right-hand rule trained via on-screen 3D hand gesture animation.
- **Failure:** Wrong cross-product direction → ship "tumbles" but recovers; correct vector ghosted for 1s.
- **Reward:** Star systems unlocked, ship cosmetics.

**C. Mapping:** Dot product → docking force; cross product → torque/orientation; triple product → cargo bay volume.

**D. Levels:**
- **Beginner:** addition, magnitude, unit-vector reflex; 4s.
- **Intermediate:** dot product + perpendicularity check; 8s.
- **Advanced:** cross product + right-hand rule + area of parallelogram; 12s.
- **Mastery:** scalar triple product, coplanarity proofs, projection-based geometry; 30s.

**E. 5-min session:** 6 magnitude/unit sprints → 4 dot products (perpendicularity decisions) → 3 cross products (with octant placement) → 1 triple-product volume check.

**F. Subconscious training:** 3D spatial gameplay recruits parietal-cortex spatial circuits exactly as Lowrie et al. (2018) found correlate with mathematical understanding. Students stop *computing* cross products and start *seeing* them.

---

## CHAPTER 11 — Three-Dimensional Geometry
### 🎮 Game: **3D ARCHITECT**

**A. Micro-skills:** direction cosines/ratios; line equations (vector form `r = a + λb`, Cartesian symmetric form); angle between two lines; coplanar lines; shortest distance between skew lines; plane equations (vector, Cartesian, intercept, normal); angle between two planes; angle between line and plane; distance from a point to a plane; foot of perpendicular.

**B. Game design.**
- **Core loop:** A 3D building scene. Two skew "girders" appear; player rotates camera (drag) to see them, types `b₁ × b₂`, then computes `|(a₂ − a₁)·(b₁×b₂)| / |b₁×b₂|`. Each computation step has 30s.
- **Mechanics:** Visual scaffolding — once shortest-distance segment is computed, it's *drawn* in 3D. Bonus for choosing correct form (vector vs Cartesian) given problem cues.
- **Failure:** Wrong formula choice → highlight cue (line, line+plane, plane+plane); same problem class re-queued in FSRS.
- **Reward:** Build 3D temples; each problem-class has its own monument (Plane Pavilion, Skew Spire).

**C. Mapping:** Each formula maps to a building tool (T-square for distance, compass for angle).

**D. Levels:**
- **Beginner:** direction cosines, point-to-plane distance.
- **Intermediate:** angles between two lines, two planes.
- **Advanced:** shortest distance between skew lines; coplanarity test.
- **Mastery:** image of a point in a plane, foot of perpendicular, line of intersection of two planes.

**E. 5-min session:** 1 direction-cosines sprint (30s) + 1 angle-between-lines (60s) + 1 distance-from-point (60s) + 1 shortest-distance skew (120s) + 30s review.

**F. Subconscious training:** Drag-rotate camera = active spatial manipulation; turns formula-shaped numbers into perceptual objects, drastically reducing the working-memory cost of "imagining" 3D configurations.

---

## CHAPTER 12 — Linear Programming
### 🎮 Game: **OPTIMA OUTPOST**

**A. Micro-skills:** translate a word problem into objective + constraints; graph constraints (`ax+by ≤ c`) on the xy-plane; identify the feasible region (bounded vs unbounded); find corner points by solving pairs of boundary equations; evaluate Z at each corner; handle unbounded cases via the `Z > M` open half-plane test.

**B. Game design.**
- **Core loop:** A frontier-trade outpost. A scenario card appears ("Manufacturer makes A and B, profit ₹40, ₹50, machine constraints..."). Player (1) drags inequality cards onto a setup pad (constraints), (2) sketches the feasible polygon by tapping line intersections (snap-to-grid), (3) lights up corner points, (4) types Z at each corner, (5) declares the optimum.
- **Mechanics:** *Snap-feedback* on lines and intersections; *boundary-flag* mini-game where the player must check the open-half-plane condition for unbounded regions.
- **Failure:** Mis-translated objective re-prompted; mis-located corner re-snapped.
- **Reward:** Trade routes unlocked; "Cargo Crown" for completing a 5-corner LP.

**C. Mapping:** Each step of the corner-point method = a station the cargo wagon visits.

**D. Levels:**
- **Beginner:** 2 constraints, bounded; word problem is given as inequalities.
- **Intermediate:** 3 constraints, requires translation from words.
- **Advanced:** 4+ constraints, unbounded regions, multiple-optimum cases.
- **Mastery:** mixed integer hint problems (where corner is non-integer and you must check feasible integer points).

**E. 5-min session:** 1 word→constraints translation drill (60s) + 1 graphing puzzle (90s) + 1 corner-evaluation sprint (60s) + 1 unbounded-region check (60s) + review.

**F. Subconscious training:** The five-step corner-method workflow is encoded as a single chained ritual; students stop forgetting to evaluate Z at each corner.

---

## CHAPTER 13 — Probability
### 🎮 Game: **BAYES BAZAAR**

**A. Micro-skills:** sample space; conditional probability `P(A|B) = P(A∩B)/P(B)`; multiplication theorem; independence test; total probability; Bayes' theorem; random variables; probability distribution; mean and variance; Bernoulli trials; binomial distribution; expected value calculations.

**B. Game design.**
- **Core loop:** A bustling Indian bazaar. Each "stall" presents a chance scenario (cards, dice, balls in urns, defective bulbs). Player taps a *strategy rune* — Direct, Conditional, Total Probability, Bayes — within 4s, then assembles the formula tree (drag nodes for P(A), P(B|A), etc.) and computes.
- **Mechanics:** *Tree-builder* canvas for total-probability and Bayes problems; auto-checks branch sums = 1. *Independence challenge* mini-game: given two events, decide independent or not in 3s.
- **Failure:** Wrong strategy rune → "stall keeper" hints at the cue ("you are given partial info → conditional"); item FSRS-rescheduled.
- **Reward:** Stall ownership; collectible probability puzzles from JEE archives.

**C. Mapping:** Bayes' tree → physical branching pathway; binomial distribution → bell-curve target shooting.

**D. Levels:**
- **Beginner:** simple sample space + classical probability.
- **Intermediate:** conditional probability, independence checks.
- **Advanced:** total probability and full Bayes problems.
- **Mastery:** binomial distributions with mean/variance + at-least/at-most chains; mixed Bayes-binomial scenarios.

**E. 5-min session:** 6 sample-space sprints → 3 conditional-probability cards → 1 total-probability tree → 1 full Bayes problem → 1 binomial mean/variance.

**F. Subconscious training:** Forces *strategy classification* before computation — the most common Class 12 probability failure mode is jumping to formulas without recognising the problem type.

---

# PART 3 — SYSTEM-LEVEL PLATFORM DESIGN

### 3.1 Skill dependency graph
A directed acyclic graph linking topics:

```
Relations & Functions ─┬─► Inverse Trig Fns ─┐
                       │                       ├─► Continuity & Diff ─► App. of Derivatives ─┐
Matrices ──► Determinants ──► 3D Geometry ◄─┘                                                  │
                                            │                                                  ▼
                                Vectors ─► 3D Geometry ─► Linear Programming                 Integration ─► App. of Integrals ─► Diff. Equations
                                                                                                 ▲
Probability (independent track but feeds into expectation/integration crossover at Mastery) ─────┘
```
Topic locks: a chapter's Beginner tier is unlocked only after prerequisites reach Intermediate Elo. This enforces the curricular dependency without rigid sequencing.

### 3.2 Adaptive difficulty algorithm — Multidimensional Elo (M-Elo)
Each user has a 13-vector skill rating `θ_u = (θ₁,…,θ₁₃)`, each item has a difficulty `b_i` plus a topic vector `w_i` (mostly one-hot, but cross-topic items have multiple components). Update rule per response (Klinkenberg et al. 2011, Pelánek 2016):

```
P(correct) = σ(θ_u · w_i − b_i)
θ_u ← θ_u + K · (correct − P) · w_i
b_i ← b_i − K_b · (correct − P)
```
- `K = 0.4 / (1 + 0.05 · n_user)` — dynamic K to stabilise as data accumulates.
- Initial cold-start: pretrained `b_i` from item-bank pilot data; for users, prior of 1500 with high uncertainty (handled via Bayesian variant of Pelánek's "on-the-fly" estimator).
- Question selection picks items where `P(correct) ∈ [0.65, 0.85]` — the empirically-validated flow channel for adaptive practice (Csikszentmihalyi balance).

### 3.3 Daily training system (25-minute Mission)
Optimised per Khan Academy's "30-min sweet spot" finding and Bjork's interleaving:

| Block | Time | Content |
|---|---|---|
| Warm-up | 3 min | FSRS-due *easy* cards across all 13 topics, fast-tap reflex |
| Focus Topic A | 7 min | Today's primary topic at current Elo |
| Interleave Block | 5 min | 3 random topics (20 questions, mixed) |
| Focus Topic B | 5 min | Secondary topic, slightly above Elo |
| Boss / Cross-topic | 3 min | Mixed-skill puzzle (e.g., area-of-region requiring integration *and* inverse trig) |
| Cool-down | 2 min | Streak XP claim, FSRS pre-due review |

The FSRS queue is the *master* of resurfacing: each micro-skill (e.g., "spot u-sub when seeing f'(x)/f(x)") is its own card.

### 3.4 Streaks, reward economy, and meta-game
- **XP** (raw effort), **Gems** (spendable, VR-7 drop), **Crowns** (mastery markers — earned by 4 perfect runs of an Advanced level), **Streak Days** (consecutive 25-min Missions).
- **Streak Freeze** (Duolingo-tested, churn −21%): 1 free per week, additional purchasable with gems.
- **Leagues** (Bronze→Diamond, weekly XP-based, 30-player groups) — competitive but anonymised by username + avatar to avoid demoralisation.
- **Meta-progression:** A "Math Kingdom" map where each topic is a region; Crowns build monuments; cross-topic "Boss Battles" unlock when *all* component topics reach Advanced.

### 3.5 AI-based personalisation
Per nightly batch:
1. Compute *expected retention* per skill via FSRS — surface skills < 0.85.
2. Compute *Elo gradient* — topics with last-7-day positive slope are reinforced; flat topics get a "Plateau Buster" mini-mission.
3. *LLM coach module* (GPT-class, Llama-instruct fallback) generates a 3-sentence personalised plan: "Today, focus on Integration u-sub recognition (your reaction time has slowed 18% over a week). I've added a Vector triple-product review."
4. *Forgetting-curve respect:* never queue more than 200 reviews/day to avoid review burnout.

### 3.6 Boss battles & cross-topic challenges
Specifically engineered to test integrated chunks:
- **Calculus Colossus:** maximum-area problem requiring derivative + integral + LPP corner-evaluation.
- **3D Sphinx:** plane-of-intersection problem requiring vectors + 3D + matrices (solving 3-variable system).
- **Bayesian Bandit:** chained probability with binomial expectation requiring Bayes + integration of pdf (board+JEE bridge).

### 3.7 Social / competitive elements
- **Friend Streaks** (Duolingo-style mutual-accountability).
- **Class Leaderboards** (school code).
- **Live "Math Royale"** — 50 students, 60 questions, last-correct-standing wins, single-elimination on misses.
- **Asynchronous Duels:** challenge a friend with a 5-question gauntlet at your current Elo.

---

# PART 4 — TECHNICAL IMPLEMENTATION

### 4.1 Stack
- **Frontend:** Next.js 14+ (App Router), React 18, TypeScript. Phaser 3 (canvas/WebGL) for in-game scenes (Matrix Forge cells, Vector Voyager 3D, Integral Inferno dungeon). React owns chrome/menus/leaderboards/HUD.
- **3D for Vectors/3D Geometry:** react-three-fiber on top of Three.js (mounted *inside* a React component, communicating with Phaser via an event bus only when needed).
- **Animation:** Rive (used by Brilliant for streak/badge animations — vector files ~1/100 the size of Lottie).
- **Math rendering:** KaTeX (server-side renderable, fast).
- **Backend:** Node.js (NestJS) + PostgreSQL + Redis (rate-limit, leaderboard sorted-sets) + ClickHouse (event analytics). Worker queue (BullMQ) for nightly FSRS recomputation and LLM generation.
- **AI service:** Microservice wrapping OpenAI/Gemini/Claude with fallback to a fine-tuned Llama-3-8B-Instruct on a math-question dataset; outputs validated by SymPy before storage.

### 4.2 Game-engine choice
| Game | Engine | Reason |
|---|---|---|
| Matrix Forge, Det Detective, Diff-Eq Descent, Bayes Bazaar | React + KaTeX + Framer Motion | Mostly grid+formula UI; React + DOM is sufficient and accessible. |
| Domain Duels, Principal Valley, Tangent Tycoon, Optima Outpost, Area Architect | Phaser 3 (2D canvas) | Real-time animation, particle effects, large sprite count. |
| Derivative Dojo, Integral Inferno | Phaser 3 (sprite combat scenes) | Action gameplay needs 60fps tween/physics. |
| Vector Voyager, 3D Architect | react-three-fiber | True 3D rotation/projection. |

### 4.3 State management
- **Zustand** for in-session game state (current question, combo, timer, animation flags). Selector-based subscriptions avoid unnecessary re-renders during 60fps loops.
- **Redux Toolkit + RTK Query** for user profile, Elo ratings, FSRS queue, item bank — server-synced state with caching, optimistic updates, offline queue.
- **Hybrid pattern (recommended)**: Zustand for ephemeral UI/game, RTK for everything that touches the server.

### 4.4 LLM-driven question generation
Three-stage pipeline:
1. **Skill extraction** (one-time): run Shah et al. (2024) "metacognitive" prompting on the NCERT exercises to extract a canonical list of ~250 micro-skills across the 13 chapters.
2. **Generation prompt template:**
```
SYSTEM: You generate Class 12 CBSE NCERT-style mathematics questions.
USER: Generate one fresh question testing the micro-skill:
  "{skill_id}: {skill_text}"
Constraints:
- Difficulty target: {b_i_target} (Elo scale 1000–2400)
- Surface form must differ from these examples: {3 retrieval examples}
- Provide: (1) question text in LaTeX, (2) numeric/symbolic answer key, (3) step-by-step solution, (4) 3 plausible distractors.
Output strict JSON.
```
3. **Validation:** SymPy executes the answer key; distractors are checked for non-equivalence; a smaller "judge" LLM rates pedagogical clarity. Only items passing all checks enter the bank with provisional `b_i` calibrated via initial student responses (Pliakos et al. 2019, cold-start with ML-augmented IRT).

For *difficult* mastery items, use Shah et al.'s **skill-pair prompting**: ask the model to generate a question requiring two micro-skills together (e.g., "integration by parts AND inverse-trig differentiation").

### 4.5 FSRS-6 implementation
Per item-user pair store `(D, S, R_target=0.9, last_review, lapses)`. Library: `ts-fsrs` (open-source TypeScript implementation of FSRS-6). Per-user parameters trained nightly once user has ≥1000 reviews; defaults used otherwise (validated to outperform SM-2 for 99.5% of users with no tuning).

### 4.6 Real-time performance tracking
Each response logs: `{user_id, item_id, skill_vec, response_ms, correct, hints_used, attempt_n, session_id, timestamp}`. The Elo update and FSRS scheduling run synchronously on response; analytics roll up nightly to ClickHouse.

### 4.7 Database schema (core tables)
```sql
users(id, username, school_code, elo_vec FLOAT[13], streak_days,
      gems INT, crowns INT, freeze_count INT, created_at, last_active);

skills(id, chapter_id, name, prereq_skill_ids INT[], canonical_form TEXT);

items(id, skill_vec FLOAT[13], difficulty FLOAT, latex_question,
      answer_key JSONB, distractors JSONB, source ENUM('llm','curated'),
      validated BOOL, exposure_count INT);

reviews(id, user_id, item_id, response_ms INT, correct BOOL,
        hints_used INT, elo_delta_user FLOAT, elo_delta_item FLOAT,
        fsrs_state JSONB, created_at);

fsrs_cards(user_id, skill_id, D FLOAT, S FLOAT,
           last_review TIMESTAMP, next_due TIMESTAMP,
           lapses INT, review_count INT, PRIMARY KEY(user_id, skill_id));

sessions(id, user_id, started_at, ended_at, xp_earned, gems_earned,
         topics_covered INT[], avg_response_ms INT);

leagues(week_id, league_tier, user_id, weekly_xp, rank);

cross_topic_bosses(id, name, required_skills INT[],
                   unlock_elo_threshold FLOAT[]);
```
Indexes on `(user_id, next_due)` for FSRS retrieval, and a partial index on `reviews(user_id) WHERE created_at > now()-interval '7 days'` for trend computation.

### 4.8 Mobile-first design
- Touch-target ≥48dp; swipe gestures (UP/DOWN/LEFT/RIGHT) primary input wherever possible — much faster than tapping multiple-choice buttons.
- Offline-first: service-worker cache 200 next-due items + 50 fresh items, queued reviews sync on reconnect.
- Network-aware: 3G fallback uses pre-rendered KaTeX SVGs instead of MathML; sprite atlases ≤256 KB per scene.
- Battery-aware: 30 fps mode for >50% battery drain detection.

---

# PART 5 — GAME-MECHANICS RESEARCH SYNTHESIS

### 5.1 Lessons from successful platforms
- **Prodigy (MMORPG-as-math):** narrative wrapper + adaptive ZPD difficulty drives long retention. We borrow: persistent avatar, region-based progression, but reject pay-to-progress mechanics.
- **Brilliant (problem-first interactive):** "no videos, only doing" with custom feedback per answer. We borrow: every screen demands a tap/drag/type, never passive watching.
- **Khan Academy (mastery system):** Familiar→Proficient→Mastered with Course Challenges. We borrow: explicit mastery levels (Crowns) and the 30-min/week threshold.
- **Duolingo (habit engine):** streaks raise commitment ~60%, Streak Freeze cuts churn 21%, XP boosts on streak milestones. We borrow all three plus Friend Streaks.

### 5.2 Reflex-training mechanics from typing tutors
- Drill in *fixed home-row clusters* before mixing — analogue: drill within one technique (e.g., u-sub) for one session before mixing.
- Latency feedback per keystroke — analogue: per-question reaction-time visible, with a personal best tracked per skill.
- Mistakes auto-trigger a focused redrill of the specific letter-pair — analogue: an FSRS "near-instant" review of the same micro-skill 3 questions later.

### 5.3 Chess-training pattern recognition
- Tactics-trainer pattern (chess.com, lichess): show position 1.5–5 s, ask for the tactical motif. Players see ~50 tactics/day and ratings climb predictably with Elo.
- We mirror this with the **rune-tap** mechanic in Integral Inferno, Diff-Eq Descent, and Bayes Bazaar — the *recognition* is trained separately from *execution*, exactly mirroring how chess masters develop chunk libraries.

### 5.4 Speed-math competitions / mental-math training
- Trader-prep platforms (Optiver-style, Tradermath) use fixed time budgets (e.g., 80 questions / 8 min) with negative scoring. The pressure forces retrieval. We import: *time pressure that ramps with mastery, never above 95%-success threshold*.
- Crucial design point from automaticity literature (Bay-Williams & Kling; Rocket Math): **automatic** = correct response within 1 s; **fluent** = correct within 3 s. Different chapters get different thresholds (formula recall: 1.5 s; technique-classification: 2.5 s; multi-step problems: 30–90 s).

### 5.5 Spatial-mechanic best practices for geometric topics
- Lowrie et al. (2018) and Medina-Herrera et al. (2019) — spatial-visualisation training transfers to geometry/calculus achievement. Our 3D Architect and Vector Voyager use camera-rotate, point-snapping, and right-hand-rule animations exactly to recruit those mechanisms.
- GeoGebra-style live manipulables embedded in problems for area/3D/vectors.

---

## How the system rewires the brain (synthesised)

1. **Recognition before execution** — every game begins with a *classify* sub-task (which technique, which type, which formula). This forces students into the cue→production pattern that defines mathematical expertise (Hinsley, Hayes & Simon 1977).
2. **Sub-3-second retrieval pressure** — within the flow channel, never punitive — converts declarative rules into procedural retrieval (Dehaene's parietal→angular-gyrus shift).
3. **Interleaving by default** — each Mission mixes ≥3 topics in the interleave block; each FSRS queue is topic-blind, surfacing whichever skills are ripe.
4. **Spaced retrieval at the micro-skill level** — FSRS-6 schedules each chunk individually; at scale this *is* the Ebbinghaus-defeating mechanism.
5. **Variable-ratio reward + flow + streaks** — sustains the volume of trials needed (typical typing-tutor benchmark: ~10,000 reps to fluency; in math, similar order for full Class 12 fluency over 12–18 months at 25 min/day).
6. **Visual/spatial encoding for geometric topics** — recruits parietal cortex, freeing working memory.
7. **Implicit over explicit at advanced levels** — declarative explanations only at chunk introduction; thereafter, examples + immediate-result feedback only, per the implicit-motor-learning literature.

---

## Caveats

- **The 20–30% FSRS efficiency advantage** over SM-2 is from simulation studies and benchmark log-loss comparisons (Expertium open-spaced-repetition benchmark), not from controlled randomised trials with students; the direction is robust but the exact magnitude in a Class-12 math context is unmeasured.
- **Variable-ratio schedules can cross into harm.** The same dopaminergic mechanism that drives engagement drives gambling pathology. Caps on daily play (e.g., 60-min hard cap), removal of monetisable random rewards, and parental dashboards are essential ethical guardrails.
- **Automaticity has limits.** Fluency in *chunks* does not by itself guarantee deep conceptual understanding (e.g., why integration by parts works), and the system must include — outside the reflex-game core — a "Concept Cinema" track of short conceptual explanations; otherwise students risk being fast-but-shallow on novel transfer items.
- **LLM-generated questions can have errors.** Math LLMs hallucinate, especially on multi-step calculus. The SymPy validation gate is essential; even so, a human-in-the-loop review pipeline (Shah et al. 2024) is recommended for Mastery-tier items.
- **Elo ratings assume stationarity within a session.** During rapid learning, ability changes faster than standard Elo can track; the dynamic-K and Elo-informed growth model (Doebler 2014) help but are not perfect.
- **Mobile network variability in India** means heavy 3D scenes (Vector Voyager, 3D Architect) need explicit "lite" 2D-projection modes to stay playable on entry-level Android devices.
- **Curriculum drift.** NCERT updates the Class 12 syllabus periodically (the most recent CBSE notification merged some exercises in 2024–25); the item bank's `chapter_id` mapping must be versioned to preserve longitudinal learner data.
- **Engagement ≠ learning.** Duolingo's own academic studies show high streaks correlate weakly with measured language proficiency. The system must report *learning outcomes* (mastered skill counts, transfer-test performance) to teachers and parents, not just XP/streak vanity metrics, and should A/B-test every game-design change against an actual transfer test (e.g., a sampled mock CBSE board paper).