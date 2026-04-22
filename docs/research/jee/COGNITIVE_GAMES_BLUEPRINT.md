# CHITTA Cognitive Games Blueprint
> JEE-Specific Cognitive Training — Built on Semantic Analysis of 324 Questions (2022–2025)

---

## Why This Is Different from Elevate / Lumosity

Elevate and Lumosity train **generic** cognitive skills — working memory, processing speed, attention. They are domain-agnostic and their games have no transfer to JEE performance.

CHITTA trains **subject-specific cognitive schemas** derived directly from JEE Advanced's own question patterns. The semantic embedding analysis of 4 years × 8 papers × 324 questions gives us labelled, clustered, similarity-ranked data that powers every game below.

**The moat:** Competitors can copy game formats. They cannot replicate games trained on JEE's own question embeddings.

---

## Data Foundation (from `analyze.py`)

| Asset | Count | Used In |
|---|---|---|
| Labelled questions | 324 | All games |
| Topic clusters (8 per subject) | 24 total | Games 1, 3, 6 |
| Cross-year similar pairs (sim > 0.72) | 11 confirmed, ~40 at > 0.65 | Game 2 |
| Most unique / novel questions | 10 identified | Game 4 |
| Topic trend data (2022–2025) | 24 topics × 4 years | Game 5 |
| Semantic embeddings (384-dim) | 324 vectors | All games |

---

## 7 Cognitive Games

---

### Game 1 — Concept Radar
**Cognitive Skill:** Rapid Schema Recognition  
**Elevate Analog:** Word Rush  
**Unconscious Training Goal:** Student stops reading word-by-word and recognizes topic archetypes in <3 seconds

#### How It Works
1. Show a question for 5 seconds
2. Student taps which topic cluster it belongs to (e.g. Coordinate Geometry / Thermodynamics / Organic Reactions)
3. Scoring penalizes hesitation — speed + accuracy = schema strength score
4. Levels increase by showing harder questions (lower average similarity to cluster centroid)

#### Levels
| Level | Display Time | Cluster Options | Question Source |
|---|---|---|---|
| 1 | 8s | 3 options | Prototype questions (sim > 0.7 to centroid) |
| 2 | 5s | 5 options | Mid-range questions |
| 3 | 3s | 8 options (full set) | Outlier questions (sim 0.3–0.5) |
| 4 | 2s | All 24 clusters | Any question |

#### Data Source
- 8 clusters × 3 subjects = 24 labelled categories
- All 324 questions pre-labelled by `analyze.py` cluster assignment
- Centroid embeddings pre-computed for difficulty scoring

#### Why It Works (Neuroscience)
Repeated fast classification builds **chunking** — the brain groups features into a single recognizable unit. Chess grandmasters recognize board positions in 0.5s by chunking, not analysis. This game builds the JEE equivalent.

---

### Game 2 — Twin or Not
**Cognitive Skill:** Interference Discrimination  
**Elevate Analog:** None — CHITTA exclusive  
**Unconscious Training Goal:** Eliminate confusion between surface-similar but conceptually-different problems

#### How It Works
1. Show two questions side-by-side (from cross-year high-similarity pairs)
2. Student decides: **Same Concept** or **Different Concept**
3. If Same → student names the shared principle (free text or multiple choice)
4. If Different → student names the distinguishing feature
5. After answer: show the correct reasoning with both questions annotated

#### Question Sources
| Similarity Score | Pair Type | Game Use |
|---|---|---|
| > 0.80 | Near-identical format, same concept | "Same" training examples |
| 0.72–0.80 | Same domain, different method | Hard "Different" cases |
| 0.65–0.72 | Surface-similar, different concept | Interference traps |

#### Known Pairs (from analysis)
- Chemistry Organic Matching Lists: 2023↔2024↔2025 (sim 0.81–0.87) — same format, different reagents
- Maths 3D Geometry lines: 2024 P1 Q3 ↔ 2025 P1 Q5 (sim 0.808)
- Physics Concave Mirrors: 2023 P1 Q9 ↔ 2025 P2 Q6 (sim 0.771)

#### Why It Works (Neuroscience)
**Proactive interference** is when old learning blocks new learning because they look similar. This game directly targets the interference zones identified by the semantic analysis — the exact places where students lose marks in the real exam.

---

### Game 3 — Concept Sprint
**Cognitive Skill:** Processing Speed + Classification Automaticity  
**Elevate Analog:** Brain Shift (Lumosity)  
**Unconscious Training Goal:** Topic recognition becomes automatic (System 1), freeing working memory for solving

#### How It Works
1. Flash a question for N seconds
2. Student makes 3 sequential taps: Subject → Topic → Question Type
3. Three-tap accuracy + total time = sprint score
4. Wrong tap at any level = restart that question

#### Scoring
```
Base score = 1000
Time penalty = -10 per second taken
Wrong subject = -300
Wrong topic = -200  
Wrong type = -100
Perfect run bonus = +500
```

#### Levels
| Level | Display Time | Topics Available |
|---|---|---|
| Warm-up | 5s | 3 topics, 1 subject |
| Sprint | 3s | 8 topics, 1 subject |
| Advanced | 2s | All topics, all subjects |
| Expert | 1.5s | All topics + distractors |

#### Why It Works (Neuroscience)
Automaticity frees working memory. When topic recognition is automatic, a student's full cognitive bandwidth is available for the actual solution — this is why toppers "have more time" in the exam than average students despite the same clock.

---

### Game 4 — Semantic Ladder
**Cognitive Skill:** Near-to-Far Transfer Learning  
**Elevate Analog:** None — CHITTA exclusive  
**Unconscious Training Goal:** Apply known methods to unfamiliar surface presentations

#### How It Works
1. Start with a **prototype question** (highest cosine similarity to cluster centroid)
2. Each round shows a question *further* from the prototype (decreasing similarity score)
3. After each question, student identifies: "What connects this to the first question?"
4. Final round uses a question from the "Most Unique" list (sim < 0.35)

#### Round Structure
```
Round 1: sim > 0.75  — Nearly identical to prototype
Round 2: sim 0.55–0.75 — Same sub-topic, different setup
Round 3: sim 0.40–0.55 — Same topic, different method needed
Round 4: sim 0.25–0.40 — Surface completely different, deep structure same
Round 5: sim < 0.25  — Far transfer: novel question, same principle
```

#### Why It Works (Neuroscience)
**Transfer-appropriate processing** — learning that spans varied surface forms builds flexible, transferable knowledge. Most students memorize solutions (near-zero transfer). The ladder forces progressive abstraction until the student sees the *principle*, not the *problem*.

---

### Game 5 — Topic Forecast
**Cognitive Skill:** Metacognitive Calibration + Strategic Thinking  
**Elevate Analog:** None — CHITTA exclusive  
**Unconscious Training Goal:** Train students to think *about* the exam, not just *in* the exam

#### How It Works
1. Show trend graph for a topic across 2022–2025 (bar chart, animated reveal)
2. Student places a bet: **0 / 1–2 / 3–5 / 6+ questions** in JEE 2026
3. Confidence slider: Low / Medium / High
4. Reveal: AI prediction based on trend + cyclical analysis + model probability
5. Compare student forecast vs AI forecast — score calibration gap

#### Trend Data Available
| Subject | Topic | Trend (2022→2025) | Pattern |
|---|---|---|---|
| Maths | Complex Numbers | 7→4→1→8 | Oscillating, surged 2025 |
| Maths | Differential Equations | 3→2→5→1 | Volatile |
| Maths | Coord. Geometry | 5→6→7→3 | High baseline, dipped |
| Physics | Thermodynamics | 7→7→4→8 | Core, never disappears |
| Physics | Mechanics | 1→7→9→4 | Peaked 2024, cooling |
| Physics | Magnetism | 0→1→3→4 | Growing, underrepresented |
| Chemistry | Coordination Compounds | 0→8→11→11 | Explosive growth |
| Chemistry | Chemical Equilibrium | 0→5→7→11 | Accelerating |
| Chemistry | Electrochemistry | 0→1→0→1 | Cyclical gap — due |

#### Why It Works (Neuroscience)
**Prediction error learning** — the brain updates beliefs most strongly when predictions are wrong. Making explicit forecasts activates the prefrontal cortex (strategic planning) and creates memorable prediction errors when the AI model differs from student estimates.

---

### Game 6 — Analogy Bridge
**Cognitive Skill:** Structural Analogical Reasoning  
**Elevate Analog:** None — closest is Lumosity's "Evo"  
**Unconscious Training Goal:** See solution *structures*, not just surface problems

#### How It Works
1. Show a solved question (archetype from one sub-topic)
2. Show 4 candidate questions from a *related* sub-topic
3. Student picks: "Which question has the same solution structure?"
4. Reveal: highlight structural parallels (same equation form, same reasoning steps)

#### Example Bridges
```
Parabola tangent condition  →  Ellipse tangent condition
                               (same discriminant = 0 method)

Kirchhoff's loop law         →  Chemical equilibrium constant
                               (same conservation + ratio structure)

Organic: nucleophilic sub.   →  Organic: electrophilic add.
                               (identify: what attacks what, and why)
```

#### Implementation
- Use cosine similarity *within* a subject to find structurally similar questions across sub-topics
- Target pairs with sim 0.45–0.65 (similar structure, different surface)
- Avoid pairs > 0.72 (too obvious — use those for Twin or Not instead)

#### Why It Works (Neuroscience)
**Analogical reasoning** is the core of expert intuition. When a student can map "parabola tangent" to "ellipse tangent" at a structural level, they have built a **schema family** — one mental model that covers an entire class of problems. This is the mechanism behind "JEE intuition."

---

### Game 7 — Pressure Vault
**Cognitive Skill:** Stress Inoculation + Working Memory Under Load  
**Elevate Analog:** None  
**Unconscious Training Goal:** Habituate the stress response so anxiety doesn't collapse working memory in the real exam

#### How It Works
1. Standard question — but with visible pressure elements:
   - 45-second countdown (red when < 15s)
   - Live "ghost" competitor score ticking up
   - Wrong answer flashes a -2 penalty in large red text
2. Difficulty increases with student's accuracy (adaptive)
3. Post-session: "Pressure Score" = accuracy under stress vs accuracy without pressure

#### Stress Calibration Levels
| Level | Timer | Competitor Ghost | Penalty Visibility |
|---|---|---|---|
| Calm | None | None | None |
| Aware | 90s | None | Small |
| Pressure | 45s | Active | Large |
| Vault | 30s | Faster ghost | Full penalty flash |

#### Why It Works (Neuroscience)
**Stress inoculation theory** — repeated controlled exposure to stressors reduces cortisol response over time. JEE failure is frequently not knowledge failure but **working memory collapse under exam anxiety**. This game directly addresses that. Students who train under pressure perform significantly better when actual stakes are high.

---

## The Notes System — Cluster-Anchored Concept Cards

Instead of chapter-wise notes, generate notes organized by **semantic cluster** — the same clusters the games use. This creates a closed training loop: game → note → game.

### Card Format

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COORDINATE GEOMETRY — Conic + Line
Appeared: 21 questions across 2022–2025 (every year)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ARCHETYPE QUESTION
[2024 P1 Q3 — line intersecting parabola, area calculation]

CORE PRINCIPLE
Parametric substitution first → discriminant for tangency → area by integration

SURFACE VARIATIONS SEEN
• Line-parabola intersection area (2022, 2024)
• Tangent from external point (2023)
• Normal chord length (2025)
• Ellipse + line: maximum area of triangle (2024 P2)

KEY TRAP
Students confuse internal vs external point of division
when finding section formula on a chord.

1-LINE ANCHOR
"Any conic + line → parametric sub first, discriminant for touch."

TWIN OR NOT PAIR
Parabola tangent (2022) ↔ Ellipse tangent (2024) — same discriminant method
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Why Cluster-Anchored Notes Work
- Student encounters the concept first in a game → note reinforces the same schema
- "Key Trap" section directly addresses the interference zones from Game 2
- "Twin or Not Pair" creates a link to another note — builds a **concept web**, not a list
- "1-Line Anchor" is designed for retrieval practice (easy to recall, hard to forget)

---

## The Cognitive Stack CHITTA Owns

```
                    Elevate / Lumosity      CHITTA
────────────────────────────────────────────────────────
Working memory      ✓ generic              ✓ JEE-specific
Processing speed    ✓ generic              ✓ topic classification speed
Attention           ✓ generic              ✓ schema-directed attention
Language fluency    ✓ generic              —
────────────────────────────────────────────────────────
Transfer learning   —                      ✓ Game 4 (Semantic Ladder)
Interference ctrl   —                      ✓ Game 2 (Twin or Not)
Metacognition       —                      ✓ Game 5 (Topic Forecast)
Stress inoculation  —                      ✓ Game 7 (Pressure Vault)
Analogical reason   —                      ✓ Game 6 (Analogy Bridge)
Strategic alloc.    —                      ✓ Game 5 + Notes priority scores
────────────────────────────────────────────────────────
```

---

## Build Priority

| Priority | Game | Reason |
|---|---|---|
| 1 | Concept Radar | Data ready (324 labelled), highest daily engagement |
| 2 | Twin or Not | 11 pairs confirmed, highest differentiation from competitors |
| 3 | Concept Sprint | Builds on Radar, adds time pressure layer |
| 4 | Cluster-Anchored Notes | Closes the game→note→game loop |
| 5 | Topic Forecast | Highest novelty, needs trend visualization component |
| 6 | Semantic Ladder | Needs similarity ranking pipeline |
| 7 | Analogy Bridge | Needs sub-topic cross-mapping |
| 8 | Pressure Vault | Needs adaptive difficulty engine |

---

## Implementation Notes

- All games consume data from `papers_db.json` + `embeddings_cache.pkl`
- Cluster labels and similarity scores pre-computed by `analyze.py`
- Game difficulty is a function of cosine similarity to cluster centroid — no manual labelling needed
- New papers (JEE 2026) can be added to `papers_db.json` → re-run `analyze.py` → all games update automatically

---

*Last updated: 2026-04-21*  
*Data source: JEE Advanced 2022–2025, 8 papers, 324 questions*  
*Model: sentence-transformers/all-MiniLM-L6-v2 (384-dim)*
