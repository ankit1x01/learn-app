# CHITTA Games Master Blueprint
> 33 Cognitive Training Games — Across NEET, JEE, CAT, UPSC, MPPSC, Aptitude, School (10/11/12)
> Each game targets a specific cognitive bottleneck. Each result feeds the FSRS engine.

---

## Core Principle

> Generic brain training (Elevate, Lumosity) improves working memory in isolation.  
> CHITTA games improve **exam-specific cognitive schemas** — skills that directly transfer to marks.

**Design Rule:** Every game must answer two questions before it gets built:
1. What is the **specific cognitive bottleneck** it removes?
2. How does a game result **update the FSRS engine** (`stability`, `stage`, `nextReview`)?

---

## Cognitive Bottleneck Map (by Exam)

| Exam | Primary Bottleneck | Secondary Bottleneck |
|---|---|---|
| NEET Biology | Visual-spatial memory (diagrams, processes) | Hierarchical classification speed |
| NEET Phy/Chem | Schema recognition + transfer | Interference between similar reactions |
| JEE Advanced | Near→far transfer + metacognitive calibration | Stress-induced working memory collapse |
| CAT | Processing speed × linguistic working memory | Deductive reasoning under data load |
| UPSC / MPPSC | Associative recall across 15,000+ facts | Causal reasoning across domains |
| Aptitude | Abstract pattern recognition speed | Constraint satisfaction (arrangements) |
| School 10/11/12 | Formula automaticity | Graphical interpretation speed |

---

## Section 1 — Universal Games
> Work across ALL exams. Train domain-agnostic cognitive mechanics.

---

### U1 — Confusion Buster
**Cognitive Skill:** Interference Discrimination  
**Exams:** All  
**FSRS Hook:** Wrong answer → boost urgency of both confused concepts

#### Mechanic
Two commonly-confused concepts shown side by side. Student must name the **one thing** that distinguishes them — not describe both, just the differentiator.

> *Mitosis vs Meiosis. DPSP vs Fundamental Rights. Mean vs Median. NaOH vs KOH.*

**Scoring:** Precision score — penalizes vague answers, rewards specific distinguishing facts.

#### Levels
| Level | Confusion Type | Time |
|---|---|---|
| 1 | Obvious pairs (Plant vs Animal cell) | 30s |
| 2 | Subtle pairs (Osmoregulation vs Osmoconformation) | 20s |
| 3 | Triad confusion (3 similar concepts) | 30s |
| 4 | Cross-subject confusion (same word, different meaning) | 20s |

#### Why It Works
**Proactive interference** is when old learning blocks new learning because surface features match. This game directly neutralizes interference by forcing the brain to encode the distinguishing feature — the exact discriminator needed in the exam.

---

### U2 — Interleaved Sprint
**Cognitive Skill:** Context-Switching + Interleaving Effect  
**Exams:** All  
**FSRS Hook:** Each Q treated as an independent retrieval event — updates individual concept records

#### Mechanic
Questions from 3+ different topics/subjects mixed randomly, fast-paced, no warning of topic switch.

> *Biology Q → Polity Q → Chemistry Q → History Q → Maths Q...*

No topic label shown before the question. Student must detect context from question alone.

**Scoring:** Streak bonus — longer correct streaks across topic switches multiply score.

#### Why It Works
Students who practice only blocked (all Bio, then all Chem) develop **context-dependent retrieval** — they can recall in practice but fail when the exam mixes topics. Interleaving is the single highest-evidence desirable difficulty technique in learning science (Kornell & Bjork, 2008).

---

### U3 — Teach-Back
**Cognitive Skill:** Generation Effect + Deep Encoding  
**Exams:** All  
**FSRS Hook:** Successful teach-back → `encodingDepth` upgraded to "connected" (2.4× multiplier)

#### Mechanic
Concept name shown. Student explains it in the simplest possible sentence — as if explaining to a 10-year-old. AI evaluates: clarity, correctness, completeness.

> *"Explain osmosis."*  
> *"Explain Article 21."*  
> *"Explain why integration by parts works."*

**Scoring:** 3 dimensions — Clarity (0–10) / Correctness (0–10) / Depth bonus (+5 if analogy used)

#### Levels
| Level | Task |
|---|---|
| 1 | Define the concept (1 sentence) |
| 2 | Explain the concept + give one example |
| 3 | Explain + connect to 1 related concept |
| 4 | Explain to a child — zero jargon allowed |

#### Why It Works
**The generation effect** — producing information from memory strengthens it 2× more than re-reading it (Slamecka & Graf, 1978). Maps directly to the Vedic **Satsang** (teach-back) technique in CHITTA's research docs.

---

### U4 — Spaced Recall Blitz
**Cognitive Skill:** Retrieval Practice  
**Exams:** All  
**FSRS Hook:** Direct — every answer updates `stability`, `difficulty`, `nextReview`

#### Mechanic
Timed retrieval of concepts scheduled for today by the FSRS engine. No hints. Just the concept name shown — student rates recall quality (Again / Hard / Good / Easy).

But gamified: 60-second sessions, combo multipliers for consecutive Good/Easy ratings, "streak fire" visual when on a run.

**This is the core session mechanic — gamified.**

#### Why It Works
**Retrieval practice** (the testing effect) is the most evidence-backed learning technique in cognitive psychology. This game IS the FSRS review session, just wrapped in game mechanics to increase engagement and reduce friction.

---

### U5 — Odd Squad
**Cognitive Skill:** Category Discrimination  
**Exams:** All  
**FSRS Hook:** Wrong answer → surface the odd-one-out concept as a review item

#### Mechanic
5 items shown. One doesn't belong. Speed-scored.

Modes:
- **Semantic:** 4 mammals + 1 reptile
- **Numerical:** 4 prime numbers + 1 composite
- **Conceptual:** 4 Fundamental Rights + 1 DPSP
- **Visual:** 4 similar molecular structures + 1 different

**Scoring:** Time bonus decays — fast correct answer = high score.

#### Why It Works
Forces precise mental boundary-drawing between concept categories. Prevents the "fuzzy category" problem where students almost-know something but can't distinguish it sharply under pressure.

---

## Section 2 — JEE Advanced Games
> Built on semantic analysis of 324 JEE Advanced questions (2022–2025).  
> Data source: `papers_db.json` + `embeddings_cache.pkl` (all-MiniLM-L6-v2, 384-dim)

---

### J1 — Concept Radar
**Cognitive Skill:** Rapid Schema Recognition  
**Analog:** Elevate "Word Rush"

#### Mechanic
Show a question for N seconds → student taps the topic cluster it belongs to.

Speed + accuracy = schema strength score. Difficulty = time pressure + number of cluster options.

| Level | Display Time | Clusters | Source |
|---|---|---|---|
| 1 | 8s | 3 options | Prototype questions (sim > 0.7 to centroid) |
| 2 | 5s | 5 options | Mid-range questions |
| 3 | 3s | 8 options | Outlier questions (sim 0.3–0.5) |
| 4 | 2s | All 24 clusters | Any question |

#### Why It Works
Builds **chunking** — the brain groups visual features into a single recognizable unit. Chess grandmasters recognize board positions in 0.5s by chunking. This game builds the JEE equivalent.

---

### J2 — Twin or Not
**Cognitive Skill:** Interference Discrimination (Exam-Specific)

#### Mechanic
Two questions from different years shown side-by-side (from cross-year high-similarity pairs, sim > 0.65). Student decides: **Same Concept** or **Different Concept**.

**Known pairs ready:**
- Chemistry Organic Matching Lists: 2023↔2024↔2025 (sim 0.81–0.87)
- Maths 3D Geometry: 2024 P1 Q3 ↔ 2025 P1 Q5 (sim 0.808)
- Physics Concave Mirrors: 2023 P1 Q9 ↔ 2025 P2 Q6 (sim 0.771)

---

### J3 — Concept Sprint
**Cognitive Skill:** Processing Speed + Classification Automaticity

#### Mechanic
Flash a question for N seconds. Student makes 3 taps: Subject → Topic → Question Type.

```
Score = 1000 - (10 × seconds) - (300 × wrong subject) - (200 × wrong topic)
```

---

### J4 — Semantic Ladder
**Cognitive Skill:** Near-to-Far Transfer Learning

#### Mechanic
Start with prototype question (sim > 0.75 to centroid). Each round steps further away (sim decreases). Final round uses a "most unique" question (sim < 0.35). Student identifies the connecting principle across all rounds.

---

### J5 — Topic Forecast
**Cognitive Skill:** Metacognitive Calibration + Strategic Thinking

#### Mechanic
Show 4-year trend graph for a topic. Student bets: how many questions in next year's paper? Compare against AI prediction. Score = calibration gap (smaller gap = higher score).

**Ready data:** 24 topics × 4 years of JEE Advanced trend data.

---

### J6 — Analogy Bridge
**Cognitive Skill:** Structural Analogical Reasoning

#### Mechanic
Show a solved question. Show 4 candidate questions from a related sub-topic. Student picks the structural analog — same solution method, different surface.

*Parabola tangent → Ellipse tangent (discriminant = 0 method)*

---

### J7 — Pressure Vault
**Cognitive Skill:** Stress Inoculation

#### Mechanic
Standard question + visible pressure: 45s countdown / ghost competitor / large red penalty flash on wrong answer. Adaptive difficulty based on accuracy. Stress Score = accuracy under pressure ÷ accuracy without pressure.

---

## Section 3 — NEET Biology Games
> NEET Biology = 50% of paper. ~40% of questions test diagrams, processes, or classification.  
> No other app trains visual-spatial memory for Biology systematically.

---

### N1 — Diagram Dissector ★ Highest Priority
**Cognitive Skill:** Visual-Spatial Memory  
**Exams:** NEET (Biology)  
**FSRS Hook:** Each label = independent concept retrieval event

#### Mechanic
Show a biological diagram with labels removed (cell organelles, nephron, heart chambers, meiosis stages, brain regions, flower parts). Student taps each blank region and labels it from a word bank.

**Levels:**
| Level | Scaffold | Diagram Complexity |
|---|---|---|
| 1 | Full word bank, no time limit | Simple (cell organelles) |
| 2 | Partial word bank | Medium (nephron, heart) |
| 3 | No word bank, type-in | Complex (brain regions, leaf anatomy) |
| 4 | Timed (60s) + no scaffolding | Any diagram |

**Content bank needed:** ~80 NCERT diagrams tagged to chapters.

#### Why It's Critical
Board analysis: ~15 NEET Biology questions per year test diagram identification directly. Students who can label diagrams in under 30s have a structural advantage — all cognitive bandwidth goes to the MCQ options, not diagram recall.

---

### N2 — Process Sequencer
**Cognitive Skill:** Procedural Memory  
**Exams:** NEET (Biology)

#### Mechanic
Steps of a biological process shown jumbled. Student drags to correct order.

**Content bank:** Protein synthesis / Krebs cycle / Calvin cycle / Meiosis I & II stages / Action potential / PCR steps / Immune response cascade.

**Levels:** 4 steps → 6 steps → 8 steps → timed with distractor steps injected.

#### Why It Works
Students know individual steps but sequence them wrongly under pressure (e.g., confusing Meiosis I prophase sub-stages). Procedural memory requires ordered retrieval — a different neural pathway than factual recall.

---

### N3 — Taxonomy Ladder
**Cognitive Skill:** Hierarchical Classification Speed  
**Exams:** NEET (Biology)

#### Mechanic
Show an organism. Student climbs 7 rungs: Kingdom → Phylum → Class → Order → Family → Genus → Species. One wrong rung = restart that level. Timed per rung (5s).

**Content bank:** 50 organisms from NCERT examples (humans, frogs, Amoeba, Funaria, Pinus, etc.)

---

### N4 — Structure Spotter
**Cognitive Skill:** Visual Recognition Under Time Pressure  
**Exams:** NEET (Biology)

#### Mechanic
Flash an image of a biological structure for 3 seconds (microscope view / schematic). Student answers 3 questions: What is it? Where is it found? What does it do?

**Content bank:** EM images and schematics of organelles, tissues, reproductive structures, microorganisms.

---

## Section 4 — CAT Games
> CAT tests processing speed × working memory under linguistic and quantitative load simultaneously.

---

### C1 — RC Radar
**Cognitive Skill:** Reading Speed + Gist Extraction  
**Exams:** CAT, CLAT, Bank PO

#### Mechanic
Flash a 150-word paragraph for N seconds. Remove it. Ask 2 questions: main idea + author's tone/purpose. Student cannot scroll back.

| Level | Reading Time | Question Type |
|---|---|---|
| 1 | 20s | Main idea only |
| 2 | 15s | Main idea + tone |
| 3 | 10s | Main idea + tone + inference |
| 4 | 8s | All above + vocabulary in context |

#### Why It's Critical
CAT RC section has 4 passages × 6 questions = 24 marks. Most CAT failures are slow readers, not poor reasoners. Increasing reading speed from 200 to 300 WPM directly recovers 8–10 minutes in the exam.

---

### C2 — Data Story
**Cognitive Skill:** Data Interpretation Working Memory  
**Exams:** CAT, Bank PO, GMAT

#### Mechanic
Show a table or bar chart for 10 seconds. Remove it. Answer 3 questions from memory — no looking back.

**Levels:** Simple 2-column table → Multi-row table → Combined bar+line chart → Caselet (text-based data)

#### Why It Works
CAT DI requires holding multiple data relationships in working memory while calculating. Students who train this skill develop a "data snapshot" — they remember the table structure even after it's gone.

---

### C3 — Logic Chain
**Cognitive Skill:** Deductive Reasoning Under Load  
**Exams:** CAT, GMAT, Bank PO, UPSC

#### Mechanic
Show a syllogism chain. Student determines what necessarily follows.

| Level | Chain Length | Distractors |
|---|---|---|
| 1 | 2-step | None |
| 2 | 3-step | 1 false conclusion |
| 3 | 4-step | 2 false conclusions |
| 4 | 5-step, some negative premises | Multiple traps |

---

### C4 — Paragraph Jumble
**Cognitive Skill:** Discourse Coherence  
**Exams:** CAT, Bank PO

#### Mechanic
5 sentences shown scrambled. Student arranges into a coherent paragraph. Under 60 seconds. Score decays with time.

**Why It's Critical:** Para Jumble is a guaranteed 4-question CAT section (VARC) and is almost never practiced as a timed speed skill.

---

### C5 — Estimation Flash
**Cognitive Skill:** Numerical Intuition + Approximation  
**Exams:** CAT, Aptitude, JEE

#### Mechanic
Flash a word problem for 5 seconds. Student estimates the answer to the nearest round number — no calculation. Gut feel only.

> *"A train 200m long at 72 km/h crosses a platform 400m long. Roughly how many seconds?"*  
> *Student answers: ~20s / ~30s / ~45s / ~60s*

**Why It Works:** Builds the sanity-check reflex that eliminates trap answers in under 3 seconds. Top CAT scorers eliminate 2 options before calculating.

---

## Section 5 — UPSC / MPPSC Games
> UPSC has the largest content surface of any exam (~15,000 facts across 9 GS areas).  
> The bottleneck is **associative recall** — connecting facts across domains under time pressure.

---

### P1 — Timeline Racer
**Cognitive Skill:** Temporal Anchoring  
**Exams:** UPSC, MPPSC, SSC

#### Mechanic
Historical events shown as cards. Student arranges in chronological order. Speed-scored. Wrong placement costs time.

**Content packs:** Ancient India / Medieval India / Modern India (Freedom Struggle) / Post-Independence / World History / MP History (MPPSC)

**Levels:** 4 events → 6 events → 8 events → 10 events with trap events from different eras mixed in.

---

### P2 — Map Assassin ★ Highest Priority for UPSC
**Cognitive Skill:** Spatial-Geographic Memory  
**Exams:** UPSC, MPPSC, State PSCs

#### Mechanic
Blank outline map shown. Pins dropped at locations. Student identifies each pin.

**Modes:**
- **States & Capitals** (India)
- **Rivers & Tributaries** (Ganga basin, Deccan rivers)
- **Mountain Passes** (Nathu La, Rohtang, Banihal...)
- **National Parks & Wildlife Sanctuaries**
- **Dams & Reservoirs**
- **MP Districts** (MPPSC-specific)
- **World Geography** (countries, straits, seas)

**Levels:** Landmark locations → State boundaries → River courses → District-level (MPPSC)

#### Why It's Critical
Geography = 15–20% of UPSC Prelims. Map questions appear every year. Students who can visualize India's map in their mind answer these in 10 seconds vs 45 seconds.

---

### P3 — Scheme Matcher
**Cognitive Skill:** Associative Memory for Static GK  
**Exams:** UPSC, MPPSC, Bank PO, SSC

#### Mechanic
Government scheme name shown. Student matches 4 attributes:
- Which Ministry?
- Which year launched?
- Target beneficiary group?
- Key distinguishing feature?

**Content bank:** 200 central government schemes + 50 MP state schemes (for MPPSC). Updated annually.

**Levels:** Single attribute → Two attributes → All 4 attributes → Reverse (attribute shown, student names scheme)

---

### P4 — Article Sprint
**Cognitive Skill:** Numbered-Item Recall  
**Exams:** UPSC, MPPSC, Judiciary, Law

#### Mechanic
Constitutional Article number shown → student identifies the right/provision.  
OR: Provision shown → student identifies Article number.

**Content bank:** Articles 12–35 (FRs) / 36–51 (DPSPs) / 52–78 (Executive) / Schedules / Major Amendments (42nd, 44th, 86th...)

**Levels:** Most-tested articles → All FRs/DPSPs → Executive/Judiciary → Schedules → Amendments

---

### P5 — Cause Chain
**Cognitive Skill:** Causal Reasoning  
**Exams:** UPSC Prelims + Mains, MPPSC

#### Mechanic
Historical or policy event shown. Student builds the cause → event → consequence chain by selecting from options in sequence.

> *"Partition of Bengal 1905 → ?"*  
> *"Liberalisation 1991 → ?"*  
> *"Green Revolution → ?"*

**Scoring:** Full chain correct = max score. Partial chains scored proportionally. Chain shown after — students learn the full causal pathway.

---

### P6 — Current Affairs Blitz
**Cognitive Skill:** High-Frequency Associative Recall  
**Exams:** UPSC, MPPSC, Bank PO, SSC

#### Mechanic
News headline shown for 3 seconds. Student tags it across 3 dimensions:
- Which Ministry / Department?
- Which State / Country?
- Which existing scheme / treaty does it relate to?

**Content:** Weekly pack updated from news. Each item tagged to GS syllabus areas (Polity / Economy / Environment / Science & Tech / IR).

**Why It Works:** Current affairs is the highest-frequency forgotten content in UPSC prep. Blitz turns passive reading into active retrieval — dramatically increases retention.

---

## Section 6 — Aptitude Games
> For campus placements, Bank PO, SSC CGL, GATE — any exam with a general aptitude section.

---

### A1 — Pattern Pulse
**Cognitive Skill:** Abstract / Fluid Reasoning  
**Exams:** All aptitude exams, CAT, GRE, GMAT

#### Mechanic
Visual 3×3 matrix shown with the last cell missing. Student completes the pattern. Pure Raven's Progressive Matrices format.

**Levels:** Simple rotation patterns → Color + shape combinations → Rule stacking (3+ rules simultaneously) → Abstract symbol transformations.

#### Why It Works
Fluid intelligence (Gf) — the ability to reason about novel problems — is directly trainable via matrix reasoning. Meta-analyses show 20+ sessions improves Gf scores measurably. This is the purest form of "training intelligence."

---

### A2 — Seating Radar
**Cognitive Skill:** Constraint Satisfaction  
**Exams:** CAT, Bank PO, SSC, Campus Placement

#### Mechanic
Circular or linear arrangement puzzle. Constraints revealed one by one. Student places people/objects in real-time as each constraint arrives.

**Levels:** 4 people, 2 constraints → 6 people, 4 constraints → 8 people, complex constraints → Blood relation + seating combined.

#### Why It Works
Arrangement puzzles test working memory under logical load — the ability to hold partial assignments while processing new constraints. Students who practice this develop a "constraint graph" mental model that makes all arrangement types faster.

---

### A3 — Number Sense
**Cognitive Skill:** Numerical Pattern Automaticity  
**Exams:** All aptitude, CAT QA, Bank PO

#### Mechanic
Number sequence shown for 2 seconds. Student identifies pattern type: arithmetic / geometric / mixed / Fibonacci / prime / square. Then predicts next term.

**Levels:** 5-term simple sequences → 7-term complex → Missing middle term → Two interleaved sequences.

---

## Section 7 — School Games (10th / 11th / 12th)
> NCERT-based. Target: board exams + foundation for competitive exams.

---

### S1 — Formula Factory
**Cognitive Skill:** Formula Automaticity  
**Exams:** 10th / 11th / 12th boards, JEE Foundation, NEET Foundation

#### Mechanic
Formula shown with 1–3 variables blanked out. Student fills in. Timed (5s per blank).

**Content bank:** All NCERT formulas — Physics (kinematics, electrostatics, optics), Chemistry (gas laws, thermochemistry), Maths (calculus, trigonometry, coordinate geometry).

**Levels:** Recall the formula → Identify which variable is missing → Derive units of the missing variable → Apply formula to a 5-second flash problem.

#### Why It Works
Students who have formulas in automatic memory spend zero cognitive load on retrieval — 100% available for solving. This is the foundational automaticity layer before any problem-solving skill matters.

---

### S2 — Graph Reader
**Cognitive Skill:** Graphical Interpretation Speed  
**Exams:** 10th / 11th / 12th, JEE, NEET

#### Mechanic
Flash a graph for 4 seconds. Ask: what type of relationship? What does the slope represent physically? What happens at x=0?

**Content bank:** v-t and s-t graphs (Physics) / Reaction rate graphs (Chemistry) / Supply-demand (Economics) / Trigonometric curves (Maths) / Population growth (Biology).

**Levels:** Graph type identification → Slope interpretation → Intercept meaning → Predict behavior outside the shown range.

---

### S3 — Unit Tracker
**Cognitive Skill:** Dimensional Analysis  
**Exams:** 11th / 12th, JEE Foundation, NEET Foundation

#### Mechanic
Physical quantity shown. Student builds the SI unit from base units (kg, m, s, A, K, mol, cd).

> *"Pressure → kg·m⁻¹·s⁻²"*  
> *"Electric charge → A·s"*

**Levels:** Direct recall → Derive from formula → Identify which option has correct dimensions → Spot the dimensional error in a given equation.

#### Why It Works
Dimensional analysis eliminates an entire class of errors — wrong unit selection, incorrect formula application, impossible answers. Students with this skill automatically filter 1–2 wrong options per question.

---

## FSRS Integration (All Games)

Every game result must update the core engine. The mapping:

| Game Result | FSRS Action |
|---|---|
| Correct answer, fast | `rating = Easy` → stability increases, interval extends |
| Correct answer, slow | `rating = Good` → normal progression |
| Wrong answer | `rating = Again` → concept back to review queue |
| Wrong + confused with another concept | Flag both concepts as `competingIds`, boost both urgency |
| Teach-Back success | `encodingDepth = 'connected'` (2.4× multiplier applied) |
| Diagram Dissector — label correct | Each label = independent concept retrieval event |
| Topic Forecast — calibrated | Update `metacogAccuracy` EWMA |
| Pressure Vault session | Log `stressAccuracyRatio` for fatigue detection |

---

## Build Priority

| Priority | Game | Exam | Reason |
|---|---|---|---|
| 1 | N1 Diagram Dissector | NEET | Highest NEET impact, no competitor has this |
| 2 | J2 Twin or Not | JEE | 11 pairs ready, max differentiation |
| 3 | U2 Interleaved Sprint | All | Highest evidence base, feeds FSRS directly |
| 4 | J1 Concept Radar | JEE | 324 labelled questions ready |
| 5 | P2 Map Assassin | UPSC | Visual, high engagement, no competitor has this |
| 6 | U3 Teach-Back | All | Closes the Satsang Vedic technique gap |
| 7 | C1 RC Radar | CAT | Measurable speed improvement in 2 weeks |
| 8 | U4 Spaced Recall Blitz | All | This IS the FSRS session — gamified |
| 9 | S1 Formula Factory | School | Large TAM (10th/11th/12th = 30M students) |
| 10 | P1 Timeline Racer | UPSC | High engagement, UPSC is premium segment |

---

## Content Pipeline

Each game needs a **content pack** — structured data in JSON.

```
src/games/packs/
├── jee/
│   ├── clusters.json          ← 24 topic clusters + prototype questions
│   ├── pairs.json             ← cross-year similar pairs (cosine > 0.65)
│   └── embeddings_cache.pkl   ← 384-dim vectors for all 324 questions
├── neet/
│   ├── diagrams/              ← SVG diagrams with labelled regions
│   ├── processes.json         ← biological process steps
│   └── taxonomy.json          ← organism classification data
├── upsc/
│   ├── timeline.json          ← historical events with dates
│   ├── map_pins.json          ← geographic features with coordinates
│   ├── schemes.json           ← government schemes with attributes
│   └── articles.json          ← constitutional articles
├── cat/
│   ├── passages.json          ← RC passages with questions
│   └── arrangements.json      ← seating puzzle constraints
├── aptitude/
│   └── matrices.json          ← pattern matrices with rules
└── school/
    ├── formulas.json           ← NCERT formulas by subject/chapter
    └── graphs.json             ← graph types with interpretation questions
```

---

## Game × Exam Coverage Matrix

```
               NEET  JEE  CAT  UPSC MPPSC APT  10th 11th 12th
─────────────────────────────────────────────────────────────
U1 Confusion    ✓    ✓    ✓    ✓    ✓     ✓    ✓    ✓    ✓
U2 Interleaved  ✓    ✓    ✓    ✓    ✓     ✓    ✓    ✓    ✓
U3 Teach-Back   ✓    ✓    ✓    ✓    ✓     ✓    ✓    ✓    ✓
U4 Recall Blitz ✓    ✓    ✓    ✓    ✓     ✓    ✓    ✓    ✓
U5 Odd Squad    ✓    ✓    ✓    ✓    ✓     ✓    ✓    ✓    ✓
J1 Radar             ✓
J2 Twin or Not       ✓
J3 Sprint            ✓
J4 Ladder            ✓
J5 Forecast          ✓
J6 Analogy           ✓
J7 Pressure     ✓    ✓    ✓    ✓    ✓     ✓    ✓    ✓    ✓
N1 Diagram      ✓
N2 Sequencer    ✓                              ✓    ✓    ✓
N3 Taxonomy     ✓                              ✓
N4 Spotter      ✓                              ✓    ✓    ✓
C1 RC Radar          ✓    ✓    ✓    ✓     ✓
C2 Data Story        ✓    ✓    ✓    ✓     ✓
C3 Logic Chain       ✓    ✓    ✓    ✓     ✓
C4 Para Jumble            ✓    ✓    ✓
C5 Estimation        ✓    ✓              ✓         ✓    ✓
P1 Timeline               ✓    ✓    ✓
P2 Map Assassin            ✓    ✓    ✓
P3 Scheme Match            ✓    ✓    ✓    ✓
P4 Article Sprint          ✓    ✓    ✓
P5 Cause Chain             ✓    ✓    ✓
P6 CA Blitz                ✓    ✓    ✓    ✓
A1 Pattern Pulse     ✓    ✓    ✓    ✓     ✓
A2 Seating Radar          ✓    ✓    ✓     ✓
A3 Number Sense      ✓    ✓              ✓         ✓    ✓
S1 Formula Fac  ✓    ✓                        ✓    ✓    ✓
S2 Graph Reader ✓    ✓    ✓                        ✓    ✓
S3 Unit Tracker ✓    ✓                             ✓    ✓
─────────────────────────────────────────────────────────────
Total games    13   16    9   11   10     9    8   11   11
```

---

## What This Unlocks for CHITTA

| Capability | Elevate / Lumosity | CHITTA |
|---|---|---|
| Generic cognitive training | ✓ | ✓ |
| Exam-specific schema training | ✗ | ✓ |
| FSRS integration (mastery tracking) | ✗ | ✓ |
| Diagram / visual memory training | ✗ | ✓ (NEET) |
| Causal / historical reasoning | ✗ | ✓ (UPSC) |
| Stress inoculation | ✗ | ✓ |
| Metacognitive calibration | ✗ | ✓ |
| Content that updates with new exams | ✗ | ✓ (pipeline) |
| Cross-exam interleaving | ✗ | ✓ |

**The moat:** Every game in CHITTA is grounded in actual exam question patterns. The content pipeline means new exam years auto-update game difficulty and pairs. This cannot be replicated without the same data pipeline.

---

*Total games: 33 (5 Universal + 7 JEE + 4 NEET + 5 CAT + 6 UPSC/MPPSC + 3 Aptitude + 3 School)*  
*Exams covered: NEET, JEE Advanced, CAT, UPSC, MPPSC, General Aptitude, Class 10/11/12*  
*Last updated: 2026-04-21*
