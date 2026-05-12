# Universal Cognitive Game Engine
# Template-Based Games for Every Indian Competitive Exam

> Core principle: Separate the game mechanic from the content.
> One game engine. Infinite data packs. Every exam served.

---

## The Architecture

```
┌─────────────────────────────────────────────────────┐
│                  GAME ENGINE LAYER                  │
│  (mechanic, timer, scoring, difficulty, FSRS hook)  │
├─────────────────────────────────────────────────────┤
│                  DATA SCHEMA LAYER                  │
│  (typed slots the game needs — fixed interface)     │
├─────────────────────────────────────────────────────┤
│                 CONTENT PACK LAYER                  │
│  NEET | JEE | UPSC | SSC | CAT | GATE | CLAT | NDA  │
└─────────────────────────────────────────────────────┘
```

**How it works:**
- Build each game engine ONCE
- Define a strict data schema (what content the game needs)
- Create content packs per exam that fill the schema
- The game never knows which exam it's serving

This means:
- 25 games × 8 exam content packs = 200 game-exam combinations
- Adding a new exam = only write content packs, zero new game code
- Improving a game mechanic = improves it for all exams simultaneously

---

## Data Schema Convention

Every game uses this base schema, extended per game type:

```typescript
interface GameDataPack {
  examId: string           // 'neet' | 'jee_adv' | 'upsc' | 'ssc' | 'cat' | 'gate' | 'clat' | 'nda'
  subjectType: SubjectType // see SubjectType enum below
  difficulty: 1 | 2 | 3   // easy / medium / hard
  items: GameItem[]        // game-specific items (schema below per game)
  conceptIds?: string[]    // links back to FSRS concept IDs for score feedback
}

type SubjectType =
  | 'history' | 'geography' | 'polity' | 'economy' | 'science_gk'  // GK family
  | 'physics' | 'chemistry' | 'biology' | 'mathematics'             // Science/Math
  | 'reasoning' | 'english' | 'current_affairs'                     // Aptitude family
  | 'legal' | 'finance' | 'engineering' | 'management'              // Domain-specific
```

---

## Category 1 — Chronology Games

**Cognitive skill:** Sequential memory, temporal ordering, process recall
**Subject types served:** History, Biology (processes), Chemistry (discoveries), Physics (models), Algorithm steps, Constitutional amendments, Five-year plans, Geological eras

---

### Game 1.1 — Timeline Racer

**Mechanic:** Show 5–8 shuffled items. Student drags them into correct chronological order. Timer counts down. Score based on accuracy + speed.

**Data schema:**
```typescript
interface TimelineItem {
  label: string      // "Battle of Plassey" | "Discovery of Penicillin"
  year: number       // 1757 | 1928 (for internal sorting, not shown to student)
  hint?: string      // optional hint shown on wrong answer
  displayYear?: string  // shown AFTER answer: "1757 AD" | "~1928"
}

interface TimelineRacerPack extends GameDataPack {
  items: TimelineItem[]
  showYears: boolean   // false = harder (no year shown, just order)
  era?: string         // label: "Indian Freedom Struggle" | "Atomic Model History"
}
```

**Content pack examples:**

| Exam | Era label | Sample items |
|---|---|---|
| UPSC | Indian Freedom Struggle | Sepoy Mutiny → INC founded → Partition of Bengal → Non-Cooperation → Salt March → Independence |
| UPSC | Constitutional Amendments | 42nd → 44th → 61st → 73rd → 86th → 101st |
| NEET Biology | Cell Theory Timeline | Hooke → Leeuwenhoek → Schleiden → Schwann → Virchow → Watson-Crick |
| JEE Chemistry | Atomic Model History | Dalton → Thomson → Rutherford → Bohr → de Broglie → Schrödinger |
| SSC GK | Prime Ministers of India | Nehru → Shastri → Indira → Rajiv → Vajpayee → Manmohan → Modi |
| GATE CS | Sorting Algorithm History | Bubble → Merge → Quick → Heap → Radix → TimSort |

---

### Game 1.2 — Process Flow Builder

**Mechanic:** Show steps of a biological/chemical/legal process in shuffled order. Student arranges into correct sequence. Wrong placements highlighted with explanation.

**Data schema:**
```typescript
interface ProcessStep {
  stepNumber: number    // correct position
  label: string         // "Transcription" | "Article 368 introduced in Parliament"
  description?: string  // shown after correct placement
}

interface ProcessFlowPack extends GameDataPack {
  processName: string   // "Protein Synthesis" | "Constitutional Amendment Procedure"
  items: ProcessStep[]
  isCyclic: boolean     // true = circular process (Krebs cycle, water cycle)
}
```

**Content pack examples:**

| Exam | Process | Steps |
|---|---|---|
| NEET | Protein Synthesis | DNA unwinds → Transcription → mRNA processing → Translation → Polypeptide folding |
| NEET | Menstrual Cycle | Menstruation → Follicular → Ovulation → Luteal → repeat |
| JEE Chem | Extraction of Aluminium | Bauxite mining → Bayer process → Electrolytic reduction → Refining |
| UPSC | How a Bill becomes Law | Introduced → Committee → Second Reading → Voting → Other house → President assent |
| UPSC | Budget Process | Finance Ministry survey → Cabinet → Parliament → Finance Bill → Enactment |
| SSC GK | Water Cycle | Evaporation → Condensation → Precipitation → Surface runoff → Infiltration |
| GATE CS | Compilation Process | Lexical analysis → Parsing → Semantic analysis → Optimization → Code generation |

---

### Game 1.3 — Date Anchor

**Mechanic:** Show a year. Student must name what happened that year (from a set of 4 choices). OR reverse: show an event, student taps the correct decade/year from a number line.

**Data schema:**
```typescript
interface DateAnchorItem {
  year: string         // "1857" | "1947" | "1984"
  event: string        // "Sepoy Mutiny / First War of Independence"
  wrongOptions: string[] // 3 plausible wrong events from same era
  significance?: string  // why this date matters
}
```

**Content pack examples:**

| Exam | Sample pairs |
|---|---|
| UPSC | 1885 → INC founded, 1919 → Rowlatt Act, 1942 → Quit India, 1950 → Constitution |
| SSC GK | 1969 → Bank Nationalization, 1991 → LPG reforms, 1999 → Kargil war |
| NEET | 1953 → DNA double helix, 1961 → Genetic code cracked, 1996 → Dolly cloned |
| JEE | 1687 → Principia Mathematica, 1905 → Special Relativity, 1927 → Uncertainty principle |
| GATE CS | 1936 → Turing machine, 1945 → Von Neumann architecture, 1969 → ARPANET |

---

## Category 2 — Association Games

**Cognitive skill:** Paired recall, semantic linking, bidirectional memory
**Subject types served:** Formulas, Laws, Named theorems, Scientific discoveries, Legal principles, Economic theories, Vocabulary, Idioms

---

### Game 2.1 — Pair Match Blitz

**Mechanic:** 8 tiles on screen (4 pairs). Student taps two matching tiles to eliminate. Timer running. Wrong tap = tiles shake and return. Finish all pairs before time = win.

**Data schema:**
```typescript
interface PairItem {
  sideA: string    // "Newton's 2nd Law" | "Article 21" | "Krebs Cycle"
  sideB: string    // "F = ma" | "Right to Life" | "Citric Acid Cycle"
  category?: string  // "Physics Laws" | "Fundamental Rights" | "Biochemistry"
}

interface PairMatchPack extends GameDataPack {
  items: PairItem[]   // typically 8–16 pairs per pack
  matchType: 'term-definition' | 'law-formula' | 'person-discovery'
             | 'article-right' | 'element-symbol' | 'word-meaning'
}
```

**Content pack examples:**

| Exam | matchType | Sample pairs |
|---|---|---|
| JEE Physics | law-formula | Ohm's Law ↔ V=IR, Faraday's Law ↔ EMF=−dΦ/dt |
| NEET Bio | term-definition | Mitosis ↔ Cell division for growth, Meiosis ↔ Division for gametes |
| UPSC Polity | article-right | Article 14 ↔ Equality before law, Article 32 ↔ Right to constitutional remedies |
| SSC/IBPS | word-meaning | Ephemeral ↔ Short-lived, Verbose ↔ Using too many words |
| CAT VARC | idiom-meaning | "Burning midnight oil" ↔ Working late, "Bite the bullet" ↔ Endure pain |
| GATE CS | term-definition | Big-O ↔ Upper bound, NP-Hard ↔ At least as hard as NP-complete |
| CLAT | legal-term | Mens Rea ↔ Criminal intent, Habeas Corpus ↔ Produce the body |
| NEET Chem | element-symbol | Gold ↔ Au, Iron ↔ Fe, Tungsten ↔ W, Mercury ↔ Hg |

---

### Game 2.2 — Who Discovered What

**Mechanic:** Show a scientist/thinker name. Student must recall their discovery/law/contribution from 4 options. OR reverse: show the discovery, identify the person.

**Data schema:**
```typescript
interface DiscoveryItem {
  person: string        // "Homi Bhabha" | "C.V. Raman" | "Srinivasa Ramanujan"
  discovery: string     // "Raman Effect" | "Theory of infinite series"
  year?: string
  field: string         // "Physics" | "Mathematics" | "Biology"
  wrongOptions: string[]
  nationality?: string  // useful for UPSC Indian science section
}
```

**Content pack examples:**

| Exam | Focus | Samples |
|---|---|---|
| NEET/JEE | Physics discoveries | Maxwell → EM theory, Planck → Quantum theory, Heisenberg → Uncertainty |
| UPSC | Indian scientists | C.V. Raman → Raman Effect, Homi Bhabha → Nuclear physics, S.N. Bose → Bose-Einstein statistics |
| SSC GK | General science | Fleming → Penicillin, Darwin → Evolution, Pasteur → Germ theory |
| NEET Bio | Cell biology | Hooke → Cells, Schleiden → Plant cell theory, Watson & Crick → DNA |
| GATE CS | CS pioneers | Turing → Computability, Dijkstra → Shortest path, Knuth → TeX/algorithms |

---

### Game 2.3 — Formula Forge

**Mechanic:** Show a concept cue. Student assembles the formula from symbol tiles (drag-and-drop). Timer adds pressure. Wrong symbols snap back.

**Data schema:**
```typescript
interface FormulaItem {
  cue: string           // "Kinetic Energy" | "pH of solution"
  formula: string       // "½mv²" | "−log[H⁺]"
  symbolTiles: string[] // ["½", "m", "v", "v²", "2", "KE", "="] — includes distractors
  unit?: string         // "Joules" | "dimensionless"
  derivationHint?: string  // shown on wrong attempt: "From Work = Force × distance"
}
```

**Content pack examples:**

| Exam | Domain | Formulas |
|---|---|---|
| JEE/NEET Physics | Mechanics | KE = ½mv², PE = mgh, F = ma, p = mv |
| JEE/NEET Chemistry | Physical | pH = −log[H⁺], ΔG = ΔH − TΔS, PV = nRT |
| JEE Maths | Calculus | d/dx(sinx) = cosx, ∫eˣdx = eˣ+C |
| SSC/IBPS Quant | Arithmetic | SI = PRT/100, A = P(1+r/n)^nt |
| GATE CS | Algorithms | T(n) = 2T(n/2) + n → O(n log n) |
| NDA/JEE | Trigonometry | sin²θ + cos²θ = 1, tan θ = sinθ/cosθ |

---

## Category 3 — Classification Games

**Cognitive skill:** Categorical thinking, hierarchical memory, feature-based sorting
**Subject types served:** Biological taxonomy, Periodic table, Parts of speech, Legal categories, Economic sectors, Logical fallacy types, Graph types

---

### Game 3.1 — Sort Storm

**Mechanic:** Items fall from the top (like Tetris). Student taps the correct bucket at the bottom before the item hits the floor. Speed increases each level.

**Data schema:**
```typescript
interface SortItem {
  label: string      // "Amoeba" | "Bryophyta" | "Prokaryote"
  correctBucket: string  // "Protista" | "Plant Kingdom" | "Monera"
  distractorBuckets: string[]  // wrong but plausible buckets
}

interface SortStormPack extends GameDataPack {
  buckets: string[]    // ["Monera", "Protista", "Fungi", "Plantae", "Animalia"]
  items: SortItem[]
  bucketCount: 2 | 3 | 4 | 5  // more buckets = harder
}
```

**Content pack examples:**

| Exam | Buckets | Sample items to sort |
|---|---|---|
| NEET Bio | 5 Kingdoms | Bacteria → Monera, Mushroom → Fungi, Fern → Plantae, Amoeba → Protista |
| NEET Bio | Plant divisions | Moss → Bryophyta, Fern → Pteridophyta, Pine → Gymnosperm, Mango → Angiosperm |
| JEE Chem | Organic reaction types | SN1/SN2/E1/E2/Addition/Elimination/Substitution |
| JEE Chem | Periodic table blocks | Na → s-block, Fe → d-block, C → p-block, Ce → f-block |
| UPSC Economy | Economic sectors | Agriculture → Primary, Manufacturing → Secondary, Banking → Tertiary |
| UPSC Polity | Constitutional articles | Art 12–35 → Fundamental Rights, Art 36–51 → DPSP, Art 52–78 → Executive |
| SSC English | Parts of speech | "Running" (gerund) → Noun, "Running" (participle) → Adjective |
| CAT VARC | Rhetorical devices | "The pen is mightier than the sword" → Metaphor, "She sells seashells" → Alliteration |
| GATE CS | Complexity classes | Sorting → O(n log n), Binary Search → O(log n), Matrix multiply → O(n³) |
| CLAT | Types of law | Murder → Criminal, Contract breach → Civil, Noise ordinance → Administrative |

---

### Game 3.2 — Venn Duel

**Mechanic:** Two overlapping circles shown. Student places items in: Left only / Overlap / Right only. Time limit per item.

**Data schema:**
```typescript
interface VennPack extends GameDataPack {
  circleA: string    // "Arteries" | "Mitosis" | "Renewable Energy"
  circleB: string    // "Veins" | "Meiosis" | "Non-renewable Energy"
  items: {
    label: string
    position: 'A_only' | 'B_only' | 'overlap'
    explanation?: string
  }[]
}
```

**Content pack examples:**

| circleA | circleB | Overlap examples |
|---|---|---|
| Mitosis | Meiosis | DNA replication, Cell division, Chromosomes present |
| Arteries | Veins | Carry blood, Have walls, Present in mammals |
| Plant Cell | Animal Cell | Nucleus, Mitochondria, Cell membrane, Ribosomes |
| JEE Main syllabus | JEE Advanced syllabus | Most topics same; Advanced adds paragraph problems |
| Lok Sabha | Rajya Sabha | Part of Parliament, Can introduce money bills (Lok Sabha only) |
| Renewable Energy | Non-renewable | Energy source, Can generate electricity (overlap) |

---

### Game 3.3 — Odd One Out Blitz

**Mechanic:** Show 4 items. Student identifies the one that doesn't belong to the group. Must also state WHY (tap reason tile). 6 seconds per question.

**Data schema:**
```typescript
interface OddOneOutItem {
  items: [string, string, string, string]  // exactly 4
  oddIndex: 0 | 1 | 2 | 3
  category: string      // what the other 3 share
  reason: string        // why the odd one doesn't belong
  wrongReasons: string[] // plausible but incorrect explanations
}
```

**Content pack examples:**

| Set | Odd one | Reason |
|---|---|---|
| Mitosis / Meiosis / Binary fission / Budding | Meiosis | Only one that produces genetically different cells |
| Article 14 / 19 / 21 / 32 | Article 32 | Others are rights; Art 32 is the remedy for rights violation |
| NaCl / KCl / MgCl₂ / CCl₄ | CCl₄ | Others are ionic; CCl₄ is covalent |
| RAM / ROM / HDD / CPU | CPU | Others are memory/storage; CPU is processor |
| Sitar / Tabla / Veena / Flute | Tabla | Others are string/wind; Tabla is percussion |
| Rupee / Dollar / Euro / Yen | Rupee | Only non-reserve-currency (was — good discussion point) |

---

## Category 4 — Speed Recognition Games

**Cognitive skill:** Processing speed, pattern detection, rapid true/false judgment
**Subject types served:** Statement verification, Number series, Logical sequences, Scientific facts, Current affairs

---

### Game 4.1 — True/False Blitz

**Mechanic:** Statement appears. Student swipes RIGHT (true) or LEFT (false) as fast as possible. No timer per card — continuous stream. Score = correct per minute. One wrong = 2-second freeze penalty.

**Data schema:**
```typescript
interface TrueFalseItem {
  statement: string   // "Photosynthesis occurs in mitochondria"
  isTrue: boolean
  explanation: string  // shown after wrong swipe: "Photosynthesis occurs in chloroplasts"
  trap?: string        // what makes wrong statements believable
}
```

**Content pack examples:**

| Exam | Sample false statements (traps) |
|---|---|
| NEET Bio | "DNA replication occurs in G1 phase" (False — S phase) |
| NEET Bio | "All enzymes are proteins" (False — some are RNA = ribozymes) |
| JEE Physics | "Magnetic force does work on a moving charge" (False — always perpendicular) |
| JEE Chem | "Ionic compounds conduct electricity in solid state" (False — only molten/dissolved) |
| UPSC Polity | "The President can return a Constitutional Amendment Bill" (False — must give assent) |
| UPSC Economy | "RBI is owned by the Government of India" (True — since 1949 nationalization) |
| SSC Reasoning | "All squares are rectangles" (True) |
| CAT | "A statement and its contrapositive are logically equivalent" (True) |

---

### Game 4.2 — Number Sprint

**Mechanic:** Arithmetic problems appear one by one. Student types or taps the answer. No pen — pure mental math. Timer per question. Difficulty adapts based on speed.

**Data schema:**
```typescript
interface NumberSprintItem {
  question: string     // "23% of 400" | "√(169)" | "15² − 14²"
  answer: number
  type: 'percentage' | 'square_root' | 'difference_of_squares' | 'fraction' | 'ratio'
  shortcut?: string    // "Use (a²−b²) = (a+b)(a−b) → 29×1 = 29"
}
```

**Content pack examples:**

| Exam | Type focus | Sample questions |
|---|---|---|
| SSC/IBPS | Percentage | 37.5% of 240 = ?, 18% of 550 = ? |
| SSC/IBPS | Time-Speed-Distance | 60 kmph for 2.5 hours = ? km |
| CAT QA | Number theory | Remainder when 2^100 ÷ 7 = ? |
| JEE | Approximation | sin(89°) ≈ ?, e^0.1 ≈ ? |
| NEET Physics | Unit conversion | 1 eV = ? Joules, 1 AU = ? meters (order of magnitude) |
| NDA Maths | Mental arithmetic | 47 × 53 = ? (use (50−3)(50+3) = 2500−9) |

---

### Game 4.3 — Series Spotter

**Mechanic:** Show a number/letter/symbol series with one blank. Student identifies the pattern and fills the blank. 8 seconds per item.

**Data schema:**
```typescript
interface SeriesItem {
  series: (string | number | null)[]  // null = the blank
  blankIndex: number
  answer: string | number
  patternType: 'arithmetic' | 'geometric' | 'fibonacci' | 'prime' | 'letter_skip' | 'alternating'
  explanation: string   // "Each term multiplied by 3"
  wrongOptions: (string | number)[]
}
```

**Content pack examples:**

| Exam | Pattern type | Sample |
|---|---|---|
| SSC/IBPS Reasoning | Arithmetic | 3, 7, 11, 15, __ → 19 |
| SSC/IBPS Reasoning | Letter series | A, C, F, J, __ → O (skip 1,2,3,4) |
| CAT DILR | Mixed | 2, 3, 5, 8, 13, __ → 21 (Fibonacci) |
| NEET | Biological sequences | Show DNA codon → amino acid (uses genetic code pattern) |
| JEE Maths | Geometric | 1, 2, 4, 8, __, 32 → 16 |

---

## Category 5 — Spatial / Visual Games

**Cognitive skill:** Spatial memory, diagram recognition, label-location binding, map awareness
**Subject types served:** Geography maps, Biology anatomy, Physics circuits, Chemistry structures, Engineering diagrams, Historical maps

---

### Game 5.1 — Label Drop

**Mechanic:** Show a blank diagram. Labels float above. Student drags each label to its correct location on the diagram. Timer adds pressure. Wrong placement snaps back with vibration.

**Data schema:**
```typescript
interface LabelDropPack extends GameDataPack {
  diagramId: string    // reference to SVG/image asset
  diagramName: string  // "Human Heart" | "India Political Map" | "Neuron"
  labels: {
    id: string
    text: string        // "Left ventricle" | "Himalayan range" | "Axon terminal"
    targetZoneId: string  // hotspot ID on the diagram
    hint?: string
  }[]
}
```

**Content pack examples:**

| Exam | Diagram | Labels to place |
|---|---|---|
| NEET Bio | Human Heart | Left/Right ventricle, Aorta, Pulmonary artery/vein, Vena cava, Valves |
| NEET Bio | Plant Cell | Cell wall, Chloroplast, Vacuole, Nucleus, Golgi, Mitochondria |
| NEET Bio | Human Brain | Cerebrum, Cerebellum, Medulla oblongata, Hypothalamus, Pons |
| UPSC/SSC | India Political Map | States, Rivers, Mountain ranges, Passes |
| UPSC Geography | World Map | Ocean currents, Wind belts, Biomes, Tectonic plates |
| JEE Physics | Electric Circuit | Resistor, Capacitor, Inductor, Battery, Switch, Ammeter |
| JEE Physics | Ray Optics | Object, Image, Principal focus, Centre of curvature |
| GATE CS | OS Memory Layout | Stack, Heap, BSS, Data, Text segments |
| NEET Bio | Neuron | Dendrites, Cell body, Axon, Myelin sheath, Node of Ranvier |

---

### Game 5.2 — Map Pin

**Mechanic:** A map is shown (India, World, specific region). A place/feature name appears. Student must tap the correct location on the map within 5 seconds. Accuracy radius shrinks as level increases.

**Data schema:**
```typescript
interface MapPinItem {
  mapId: string        // "india_political" | "world_physical" | "india_rivers"
  targetName: string   // "Tropic of Cancer" | "Krishna River" | "Thar Desert"
  targetCoords: { x: number, y: number }  // normalized 0–1 on map image
  acceptableRadius: number  // how accurate the tap must be
  category: 'river' | 'mountain' | 'state' | 'city' | 'ocean_current' | 'biome'
}
```

**Content pack examples:**

| Exam | Map | Targets |
|---|---|---|
| UPSC | India Rivers | Ganga, Yamuna, Godavari, Krishna, Cauvery, Brahmaputra, Narmada |
| UPSC | India Mountains | Himalayas, Aravallis, Vindhyas, Western/Eastern Ghats, Satpura |
| UPSC | India Political | States, UTs, capitals, international borders |
| UPSC | World Geography | Ocean currents (warm/cold), Wind belts, Major rivers, Biomes |
| SSC GK | India | National parks, Dams, Ports, Important cities |
| NDA | World | Countries, Capitals, Disputed territories |

---

### Game 5.3 — Structure Sketch

**Mechanic:** Show a molecular/structural formula description. Student assembles the structure from building blocks (atoms, bonds). For GATE/JEE: show circuit description, student builds the circuit.

**Data schema:**
```typescript
interface StructureSketchPack extends GameDataPack {
  type: 'molecular' | 'circuit' | 'data_structure' | 'network'
  items: {
    name: string         // "Benzene" | "RC Low-pass filter" | "Binary Search Tree"
    description: string  // text description of the structure
    correctStructureId: string  // reference to correct answer SVG
    buildingBlocks: string[]    // available components
  }[]
}
```

**Content pack examples:**

| Exam | Type | Structures |
|---|---|---|
| JEE Organic | Molecular | Benzene, Naphthalene, Glucose, Amino acids |
| JEE Physics | Circuit | Wheatstone bridge, RC filter, LCR series |
| GATE CS | Data structure | Balanced BST, Min-heap, Adjacency matrix |
| GATE Networks | Network | OSI layers, TCP handshake flow |

---

## Category 6 — Comprehension / Inference Games

**Cognitive skill:** Reading speed, inference extraction, argument analysis, tone detection
**Subject types served:** English RC, Legal reasoning, UPSC Prelims GS passages, CAT VARC, CLAT passages, Economics passages

---

### Game 6.1 — Passage Pulse

**Mechanic:** Show a short passage (100–200 words). Reading timer counts down. When timer hits 0 — passage disappears, question appears. Student must answer from memory + inference. Tests active reading, not passive scanning.

**Data schema:**
```typescript
interface PassagePulsePack extends GameDataPack {
  items: {
    passage: string
    readingTimeSeconds: number   // adaptive: 45–90s based on length
    question: string
    options: [string, string, string, string]
    correctOption: 0 | 1 | 2 | 3
    questionType: 'main_idea' | 'inference' | 'tone' | 'vocabulary_in_context'
                 | 'strengthens' | 'weakens' | 'assumption' | 'fact_vs_opinion'
  }[]
}
```

**Content pack examples:**

| Exam | Passage type | Question type |
|---|---|---|
| CAT VARC | Abstract philosophy/economics | Inference, primary purpose, tone |
| UPSC | Government scheme / Environment / Economy | Fact vs opinion, implication |
| CLAT | Legal scenario + principle | Apply principle to fact, inference |
| SSC/IBPS | General English passage | Vocabulary in context, main idea |
| GATE | Technical abstract (CS paper extract) | Technical inference, purpose |

---

### Game 6.2 — Argument Strength

**Mechanic:** Show a conclusion. Then show 5 statements one by one. For each: student swipes to Strongly Supports / Weakly Supports / Neutral / Weakly Weakens / Strongly Weakens. Points for calibration accuracy.

**Data schema:**
```typescript
interface ArgumentStrengthPack extends GameDataPack {
  items: {
    conclusion: string   // "India should ban single-use plastics immediately"
    statements: {
      text: string
      strength: -2 | -1 | 0 | 1 | 2  // −2=strongly weakens, +2=strongly supports
      explanation: string
    }[]
  }[]
}
```

**Content pack examples:**

| Exam | Conclusion type | Use |
|---|---|---|
| CAT VARC | Business/policy argument | CR questions |
| UPSC Mains | Policy / governance | Essay argument structure |
| CLAT | Legal position | Legal reasoning section |
| SSC/IBPS | General argument | Statements-conclusions questions |

---

### Game 6.3 — Para Jumble Sprint

**Mechanic:** Show 5–6 shuffled sentences. Student drags to correct order. Timer creates pressure. Partial credit for getting some transitions right.

**Data schema:**
```typescript
interface ParaJumblePack extends GameDataPack {
  items: {
    sentences: string[]          // in shuffled order
    correctOrder: number[]       // indices in correct order
    openingSentenceFixed: boolean  // true = first sentence given
    topic?: string               // hint: "Climate change / Indian economy"
  }[]
}
```

**Content pack examples:**

| Exam | Passage topic |
|---|---|
| CAT VARC | Philosophy, economics, science, social commentary |
| SSC/IBPS | General English, descriptive passages |
| UPSC Mains | Policy arguments, current affairs |
| CLAT | Legal arguments, current legal issues |

---

## Category 7 — Metacognitive Games

**Cognitive skill:** Confidence calibration, decision quality, trap detection, skip discipline
**Subject types served:** All exams — this category is exam-agnostic at the mechanic level

---

### Game 7.1 — Skip Simulator

**Mechanic:** Show a full exam-style question. 10-second countdown. Student must decide: ATTEMPT / SKIP / FLAG. No solving. After 10 questions: reveal decision quality + marks simulation.

**Data schema:**
```typescript
interface SkipSimulatorPack extends GameDataPack {
  markingScheme: {
    correct: number    // +3, +4, +1 etc.
    wrong: number      // −1, −0.25, 0 etc.
    unattempted: number  // always 0
  }
  items: {
    question: string
    options?: string[]
    difficulty: 1 | 2 | 3    // easy / medium / hard
    avgSolveTime: number      // seconds — how long students typically take
    avgAccuracy: number       // 0–1 — what % of students get it right
    conceptId?: string        // FSRS link
  }[]
}
```

**Works for every exam** — just swap marking scheme and question bank:

| Exam | Marking scheme | Pack focus |
|---|---|---|
| JEE Advanced | +3/−1 MCQ, +4/−2 multi-correct | Multi-correct trap questions |
| NEET | +4/−1 | Speed-difficult balance |
| SSC CGL | +2/−0.5 | Series/analogy speed questions |
| IBPS PO | +1/−0.25 | Puzzle difficulty estimation |
| UPSC Prelims | +2/−0.66 | Factual certainty calibration |
| CAT | +3/−1 MCQ, +3/0 TITA | DILR vs QA skip strategy |
| CLAT | +1/−0.25 | Legal reasoning trap detection |

---

### Game 7.2 — Confidence Calibrator

**Mechanic:** Before seeing options, student rates confidence: 1 (unsure) / 2 (partial) / 3 (certain). Then sees options and answers. Score rewards calibration: being certain+correct = max, uncertain+wrong = ok, certain+wrong = big penalty.

**Data schema:**
```typescript
interface ConfidenceItem {
  question: string
  options: [string, string, string, string]
  correctOption: 0 | 1 | 2 | 3
  conceptId: string   // FSRS link — feeds metacogAccuracy field
}

// Scoring:
// Certain(3) + Correct  = +10 points
// Partial(2) + Correct  = +6 points
// Unsure(1)  + Correct  = +3 points
// Unsure(1)  + Wrong    = −1 point
// Partial(2) + Wrong    = −3 points
// Certain(3) + Wrong    = −8 points (punishes overconfidence hard)
```

**Universal across all exams** — content pack is just the question bank per exam.

---

### Game 7.3 — Trap Spotter

**Mechanic:** Show a question with one option highlighted. Student must identify WHY that option is a trap — what makes it look right but be wrong. Tap the trap type from 6 tiles.

**Data schema:**
```typescript
type TrapType =
  | 'almost_correct_number'    // answer is close but wrong (9.8 vs 9.81)
  | 'correct_concept_wrong_context'  // right formula, wrong situation
  | 'absolute_word_trap'       // "always" / "never" / "all" — usually false
  | 'reverse_causation'        // A causes B confused with B causes A
  | 'partial_truth'            // true for some cases, not all
  | 'unit_mismatch'            // correct value, wrong unit

interface TrapSpotterItem {
  question: string
  options: string[]
  trapOption: number        // which option is the trap
  trapType: TrapType
  explanation: string
}
```

**Content pack examples:**

| Exam | Trap type | Example |
|---|---|---|
| JEE Physics | unit_mismatch | "Energy = 9.8 J/kg" — correct number but J/kg is specific energy not energy |
| NEET Bio | almost_correct | "Mitochondria is the site of photosynthesis" — almost right organ, wrong process |
| UPSC | absolute_word_trap | "India always follows a non-aligned policy in all international forums" |
| SSC Reasoning | reverse_causation | "All cats are animals, so all animals are cats" |
| CAT VARC | partial_truth | "The author believes technology is harmful" — author says it can be, not always is |
| CLAT Legal | correct_concept_wrong_context | Applying a criminal law principle to a civil case |

---

## Category 8 — Working Memory Games

**Cognitive skill:** Working memory capacity, context holding, multi-track attention, mental compression
**Subject types served:** All multi-step problems, DILR, Seating arrangements, Budget/data sets, Experimental data

---

### Game 8.1 — Sequence Recall

**Mechanic:** Show a sequence of items (words, numbers, symbols, events) one by one. They disappear. Student reconstructs the full sequence from memory by tapping tiles in order.

**Data schema:**
```typescript
interface SequenceRecallPack extends GameDataPack {
  items: {
    sequence: string[]    // ["Krebs Cycle", "ETC", "ATP Synthase"] or [3, 1, 4, 1, 5]
    displayDuration: number  // ms each item is shown
    chunksHint?: string      // "Group as: Steps 1-3 are matrix reactions"
    category: string
  }[]
}
```

**Content pack examples:**

| Exam | Sequence type | Sample |
|---|---|---|
| NEET Bio | Biochemical pathway | Glycolysis steps: Glucose → G6P → F6P → → Pyruvate |
| NEET Bio | Embryology stages | Zygote → Morula → Blastula → Gastrula → Neurula |
| JEE Chem | Reaction mechanism | SN2: nucleophile attacks → transition state → leaving group departs |
| UPSC | Amendment sequence | 42nd → 44th → 52nd → 61st → 73rd → 86th → 101st GST |
| GATE CS | Algorithm steps | QuickSort: pivot → partition → recurse left → recurse right |
| SSC Reasoning | Series | 2, 5, 10, 17, 26 → next 3 |

---

### Game 8.2 — Context Hold

**Mechanic:** Show 3–4 facts about a scenario. Then a distractor task (10 seconds of something else). Then ask a question that requires combining the held facts. Tests active working memory, not passive reading.

**Data schema:**
```typescript
interface ContextHoldPack extends GameDataPack {
  items: {
    facts: string[]      // ["Train A leaves at 6am going 60kmph",
                         //  "Train B leaves at 7am going 80kmph",
                         //  "Distance between stations: 300km"]
    distractorTask: string  // "Count backwards from 20" | "Name 3 elements"
    distractorDuration: number  // seconds
    question: string     // "When do the trains meet?"
    answer: string
    workingRequired: string   // solution steps shown after
  }[]
}
```

**Content pack examples:**

| Exam | Context type | Facts held |
|---|---|---|
| SSC/IBPS Quant | Time-Speed-Distance | Two trains, speeds, departure times → when do they meet? |
| CAT DILR | Tournament | 4 teams, match results, points table → who qualifies? |
| UPSC | Multi-fact GS | Budget figures + scheme names + ministry → which statement is correct? |
| JEE Physics | Multi-step | Block mass, spring constant, initial velocity → find max compression |
| NEET | Genetics | Parent genotypes, trait dominance → probability of offspring phenotype |
| IBPS PO | Seating | 7 people, 4 constraints → who sits opposite whom? |

---

### Game 8.3 — Multi-Track

**Mechanic:** Two parallel streams of information appear simultaneously (split screen). Student must answer questions about BOTH streams. Trains divided attention — the exact cognitive demand of multi-correct JEE questions.

**Data schema:**
```typescript
interface MultiTrackPack extends GameDataPack {
  items: {
    streamA: { content: string, question: string, answer: string }
    streamB: { content: string, question: string, answer: string }
    combinedQuestion?: string  // optional: question that requires BOTH streams
    combinedAnswer?: string
  }[]
}
```

**Content pack examples:**

| Exam | Stream A | Stream B | Combined |
|---|---|---|---|
| JEE Advanced | Physics problem | Maths integration | Both use same substitution technique? |
| UPSC | Economy fact | Polity article | Which policy would this article enable? |
| CAT DILR | Bar chart | Table | What's the ratio in 2019? |
| NEET | Organ A function | Organ B function | Which disease affects both? |

---

## Master Game × Subject Coverage Matrix

```
                  History  Geo  Polity  Eco  Physics  Chem  Bio  Math  Reasoning  English  Legal  CS
────────────────────────────────────────────────────────────────────────────────────────────────────
1.1 Timeline Racer   ✓     ✓              ✓     ✓      ✓     ✓                              ✓    ✓
1.2 Process Flow     ✓                    ✓     ✓      ✓     ✓                              ✓    ✓
1.3 Date Anchor      ✓     ✓     ✓        ✓     ✓             ✓                              ✓
2.1 Pair Match       ✓     ✓     ✓        ✓     ✓      ✓     ✓    ✓      ✓         ✓        ✓    ✓
2.2 Who Discovered   ✓                         ✓      ✓     ✓                                    ✓
2.3 Formula Forge                                     ✓      ✓          ✓                        ✓
3.1 Sort Storm       ✓     ✓     ✓        ✓     ✓      ✓     ✓    ✓      ✓         ✓        ✓    ✓
3.2 Venn Duel        ✓     ✓     ✓        ✓     ✓      ✓     ✓    ✓      ✓                  ✓    ✓
3.3 Odd One Out      ✓     ✓     ✓        ✓     ✓      ✓     ✓    ✓      ✓         ✓        ✓    ✓
4.1 True/False Blitz ✓     ✓     ✓        ✓     ✓      ✓     ✓    ✓      ✓         ✓        ✓    ✓
4.2 Number Sprint                                     ✓             ✓    ✓                        ✓
4.3 Series Spotter                                    ✓             ✓    ✓          ✓
5.1 Label Drop              ✓                         ✓      ✓     ✓                              ✓
5.2 Map Pin                 ✓     ✓
5.3 Structure Sketch                                  ✓      ✓          ✓                         ✓
6.1 Passage Pulse    ✓     ✓     ✓        ✓                                         ✓        ✓
6.2 Argument Strength✓           ✓        ✓                               ✓         ✓        ✓
6.3 Para Jumble                                                             ✓         ✓        ✓
7.1 Skip Simulator   ✓     ✓     ✓        ✓     ✓      ✓     ✓    ✓      ✓         ✓        ✓    ✓
7.2 Confidence Cal   ✓     ✓     ✓        ✓     ✓      ✓     ✓    ✓      ✓         ✓        ✓    ✓
7.3 Trap Spotter     ✓     ✓     ✓        ✓     ✓      ✓     ✓    ✓      ✓         ✓        ✓    ✓
8.1 Sequence Recall  ✓           ✓        ✓     ✓      ✓     ✓    ✓      ✓                  ✓    ✓
8.2 Context Hold                          ✓     ✓             ✓    ✓      ✓                       ✓
8.3 Multi-Track      ✓     ✓     ✓        ✓     ✓      ✓     ✓    ✓      ✓                        ✓
```

---

## Master Game × Exam Coverage Matrix

```
                    NEET  JEE-M  JEE-A  UPSC  SSC  IBPS  CAT  GATE  CLAT  NDA  RRB
─────────────────────────────────────────────────────────────────────────────────────
1.1 Timeline Racer   ✓            ✓      ✓     ✓    ✓          ✓     ✓     ✓    ✓
1.2 Process Flow     ✓     ✓      ✓      ✓                      ✓           ✓
1.3 Date Anchor      ✓            ✓      ✓     ✓    ✓                 ✓          ✓
2.1 Pair Match       ✓     ✓      ✓      ✓     ✓    ✓     ✓    ✓     ✓     ✓    ✓
2.2 Who Discovered   ✓     ✓      ✓      ✓     ✓                ✓                ✓
2.3 Formula Forge    ✓     ✓      ✓            ✓          ✓    ✓           ✓
3.1 Sort Storm       ✓     ✓      ✓      ✓     ✓    ✓     ✓    ✓     ✓     ✓    ✓
3.2 Venn Duel        ✓     ✓      ✓      ✓     ✓    ✓     ✓    ✓     ✓     ✓    ✓
3.3 Odd One Out      ✓     ✓      ✓      ✓     ✓    ✓     ✓    ✓     ✓     ✓    ✓
4.1 True/False Blitz ✓     ✓      ✓      ✓     ✓    ✓     ✓    ✓     ✓     ✓    ✓
4.2 Number Sprint          ✓      ✓            ✓    ✓     ✓         ✓     ✓    ✓
4.3 Series Spotter         ✓             ✓     ✓    ✓     ✓    ✓          ✓    ✓
5.1 Label Drop       ✓     ✓             ✓                      ✓
5.2 Map Pin                              ✓     ✓                           ✓
5.3 Structure Sketch ✓     ✓      ✓                        ✓    ✓
6.1 Passage Pulse    ✓            ✓      ✓     ✓    ✓     ✓          ✓
6.2 Argument Strength              ✓     ✓     ✓    ✓     ✓          ✓
6.3 Para Jumble                    ✓     ✓     ✓    ✓     ✓          ✓
7.1 Skip Simulator   ✓     ✓      ✓      ✓     ✓    ✓     ✓    ✓     ✓     ✓    ✓
7.2 Confidence Cal   ✓     ✓      ✓      ✓     ✓    ✓     ✓    ✓     ✓     ✓    ✓
7.3 Trap Spotter     ✓     ✓      ✓      ✓     ✓    ✓     ✓    ✓     ✓     ✓    ✓
8.1 Sequence Recall  ✓     ✓      ✓      ✓     ✓    ✓          ✓           ✓
8.2 Context Hold     ✓     ✓      ✓      ✓     ✓    ✓     ✓    ✓           ✓    ✓
8.3 Multi-Track      ✓     ✓      ✓      ✓     ✓    ✓     ✓    ✓     ✓     ✓    ✓
```

---

## FSRS Integration Hook (How Games Feed the Learning Engine)

Every game result feeds back into the CHITTA FSRS engine:

```typescript
interface GameResult {
  gameId: string
  packId: string
  itemId: string
  conceptIds: string[]       // which FSRS concepts were tested
  correct: boolean
  responseTimeMs: number     // latency — used in Formula Forge, Formula Sprint
  confidenceRating?: 1|2|3   // used in Confidence Calibrator
  skipDecision?: 'attempt'|'skip'|'flag'  // used in Skip Simulator
}

// On game completion:
// 1. Update concept.lastTested, concept.stage via FSRS
// 2. Update concept.metacogAccuracy if confidence was captured
// 3. Feed responseTimeMs into retrieval speed score
// 4. Update Exam Readiness Score (ERS) across all 5 cognitive layers
```

---

## Build Priority (Which Games to Build First)

```
Phase 1 — Highest ROI, lowest build cost
  True/False Blitz      ← just swipe cards, works for all 11 exams immediately
  Pair Match Blitz      ← tile matching, all exams, rich content
  Odd One Out Blitz     ← simple 4-tile UI, high cognitive value
  Timeline Racer        ← drag-sort, UPSC/History killer game
  Skip Simulator        ← any question bank, immediate metacog value

Phase 2 — Medium build cost, high impact
  Sort Storm            ← falling tiles mechanic, Biology + Classification
  Number Sprint         ← calculator-free math, SSC/IBPS/JEE
  Series Spotter        ← SSC/CAT Reasoning staple
  Process Flow Builder  ← drag-sort variant, NEET Biology
  Confidence Calibrator ← card stack, all exams

Phase 3 — Higher build cost, specialized value
  Label Drop            ← requires diagram assets (SVG hotspots)
  Map Pin               ← requires interactive map (UPSC Geography)
  Formula Forge         ← tile assembly mechanic, JEE/NEET
  Passage Pulse         ← rich text reader, CAT/UPSC/CLAT
  Argument Strength     ← swipe spectrum, CAT/CLAT/UPSC

Phase 4 — Advanced cognitive training
  Derivation Tree Builder ← complex tree UI (from JEE doc)
  Context Hold          ← multi-step, requires distractor system
  Multi-Track           ← split screen, complex state
  Trap Spotter          ← requires curated trap questions
  Structure Sketch      ← requires SVG builder component
```

---

## Content Pack File Structure

```
src/
  games/
    engines/
      TimelineRacer.tsx
      PairMatch.tsx
      SortStorm.tsx
      ...
    schemas/
      types.ts           ← all GameDataPack interfaces
    packs/
      neet/
        timeline_bio.ts
        pairMatch_bio.ts
        sortStorm_kingdoms.ts
        labelDrop_heart.ts
        ...
      jee/
        timeline_physics.ts
        formulaForge_mechanics.ts
        ...
      upsc/
        timeline_freedom.ts
        mapPin_india.ts
        truefalse_polity.ts
        ...
      ssc/
        seriesSpotter_reasoning.ts
        numberSprint_quant.ts
        ...
      cat/
        passagePulse_varc.ts
        argumentStrength.ts
        ...
```

---

*Last updated: 2026-04-17*
*Status: R&D Design Document — Game Engine Architecture*
*Owner: CHITTA Core Team*
