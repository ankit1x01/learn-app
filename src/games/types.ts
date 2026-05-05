// src/games/types.ts

export interface GameResult {
  gameType: GameConfig['type']
  score: number       // 0–100
  guesses: number
  hintsUsed: number
  timeMs: number
}

interface GameBase {
  theme: string
  subject: string
  onComplete?: (result: GameResult) => void
}

export interface ThisOrThatConfig extends GameBase {
  type: 'this-or-that'
  columnA: { label: string; description: string }
  columnB: { label: string; description: string }
  cards: Array<{ id: string; label: string; correct: 'A' | 'B' }>
}

export interface ChronoConfig extends GameBase {
  type: 'chrono'
  events: Array<{
    id: string
    label: string
    dateLabel: string
    sortKey: number
    factoid?: string
  }>
}

type AttributeClues = [string, string, string, string]

export interface LinksConfig extends GameBase {
  type: 'links'
  cards: Array<{ id: string; label: string }>
  rounds: Array<{
    cardId: string
    attributes: AttributeClues
    hints?: string[]
  }>
}

export interface KnockoutConfig extends GameBase {
  type: 'knockout'
  question: string
  subtitle?: string
  cards: Array<{ id: string; label: string }>
  answers: Record<string, string>
}

export interface BalloonTapConfig extends GameBase {
  type: 'balloon-tap'
  pairs: Array<{ id: number; a: string; b: string }>
}

export interface RetentionConfig extends GameBase {
  type: 'retention'
  pool: Array<{ id: string; label: string }>
}

export interface BubbleMatchConfig extends GameBase {
  type: 'bubble-match'
  audioSrc?: string
  entities: Array<{
    id: string
    name: string
    color: string          // CSS hsl color
    facts: string[] | Array<{ text: string; spawnTimeMs: number }>
  }>
}

export interface AudioLectureConfig extends GameBase {
  type: 'audio-lecture'
  title: string
  concepts: [string, string, string]
  passage: string         // full text TTS reads aloud
  displayPassage: string  // same text with ___ where blanks are; order of ___ maps 1:1 to blanks array by index
  blanks: Array<{
    id: string
    answer: string        // exact word/phrase that fills this blank
  }>
  chips: string[]         // draggable chips (answers + 2 distractors); shuffled at runtime in the component
  questions: Array<{
    id: string
    prompt: string
    options: [string, string, string, string]
    answer: string
  }>
}

export interface MemoryAttentionConfig extends GameBase {
  type: 'memory-attention'
  audioUrl: string
  topics: Array<{ id: string; label: string; position: 'bottom' | 'side' }>
  timeline: Array<{ timestamp: number; factId: string; label: string; targetTopicId: string }>
}

export interface MemoryNameRecallConfig extends GameBase {
  type: 'memory-name-recall'
  people: Array<{ id: string; name: string; detail: string; faceUrl: string }>
  mnemonicPairs: Array<{ name: string; mnemonic: string }>
}

export interface MemoryRetentionConfig extends GameBase {
  type: 'memory-retention'
  audioUrl: string
  questions: Array<{ id: string; prompt: string; options: string[]; answer: string; difficulty: 'low' | 'high' }>
}

export interface MemorySequencingConfig extends GameBase {
  type: 'memory-sequencing'
  audioUrl: string
  events: Array<{ id: string; label: string; order: number }>
}

export interface MemorySynthesisConfig extends GameBase {
  type: 'memory-synthesis'
  premises: Array<{ id: string; text: string }>
  conclusion: { text: string; isValid: boolean }
  question: string
}

export interface MemoryVisualizationConfig extends GameBase {
  type: 'memory-visualization'
  items: Array<{ id: string; label: string; description: string; imageUrl?: string }>
}
export interface MemoryTeachBackConfig extends GameBase {
  type: 'memory-teach-back'
  concept: string
  prompt: string
  persona: string
  requiredKeywords: string[]
}
export interface MemoryInversionConfig extends GameBase {
  type: 'memory-inversion'
  statements: Array<{ id: string; text: string; isTrap: boolean; explanation: string }>
}

// ═══════════════════════════════════════════════════════════════════════════
// REFLEX-MATHS: 13 Class 12 Mathematics Games (Neuroscience-Driven Microskills)
// ═══════════════════════════════════════════════════════════════════════════

/** Micro-skill item: single stimulus → response unit for FSRS tracking */
export interface MicroSkillItem {
  id: string
  skillName: string         // e.g., "spot u-sub cue", "bijection recognition"
  skillId: string           // canonical ID for FSRS tracking
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mastery'
  timeLimit: number         // seconds
  stimulus: string          // LaTeX or descriptive text
}

// 1. DOMAIN DUELS — Relations & Functions (arrow diagram classification)
export interface DomainDuelsConfig extends GameBase {
  type: 'domain-duels'
  items: Array<{
    id: string
    skillId: string
    diagram: { setA: string[]; setB: string[]; mappings: Array<[string, string]> }
    correctAnswer: 'injective' | 'surjective' | 'bijective' | 'neither'
    timeLimit: number
  }>
  totalWaves: number
  bossWaveInterval: number
}

// 2. PRINCIPAL VALLEY — Inverse Trig Functions (range zone identification)
export interface PrincipalValleyConfig extends GameBase {
  type: 'principal-valley'
  items: Array<{
    id: string
    skillId: string
    expression: string      // LaTeX: e.g., "cos^{-1}(-1/2)"
    correctZone: 'sin-inv' | 'cos-inv' | 'tan-inv' | 'cot-inv' | 'sec-inv' | 'cosec-inv'
    correctAngle: number    // radians: π/3, etc.
    timeLimit: number
  }>
}

// 3. MATRIX FORGE — Matrices (cell-by-cell entry for operations)
export interface MatrixForgeConfig extends GameBase {
  type: 'matrix-forge'
  items: Array<{
    id: string
    skillId: string
    operation: 'add' | 'subtract' | 'multiply' | 'transpose' | 'inverse' | 'decompose'
    matrixA: number[][]
    matrixB?: number[][]
    expectedResult: number[][]
    timeLimit: number
    cellsToFill: number
  }>
}

// 4. DET DETECTIVE — Determinants (cofactor expansion with shortcuts)
export interface DetDetectiveConfig extends GameBase {
  type: 'det-detective'
  items: Array<{
    id: string
    skillId: string
    matrix: number[][]
    correctDeterminant: number
    shortcutHint?: string   // e.g., "row of zeros", "equal rows"
    expansionMethod: 'ad-bc' | 'cofactor' | 'row-ops'
    timeLimit: number
  }>
}

// 5. DERIVATIVE DOJO — Continuity & Differentiability (combo rule execution)
export interface DerivativeDojoConfig extends GameBase {
  type: 'derivative-dojo'
  items: Array<{
    id: string
    skillId: string
    functionLatex: string
    rulesNeeded: Array<'chain' | 'product' | 'quotient' | 'log-diff' | 'implicit'>
    expectedDerivative: string
    comboReward: boolean
    timeLimit: number
  }>
}

// 6. TANGENT TYCOON — Applications of Derivatives (tangent line, optimization)
export interface TangentTycoonConfig extends GameBase {
  type: 'tangent-tycoon'
  items: Array<{
    id: string
    skillId: string
    problemType: 'tangent-line' | 'increasing-interval' | 'optimization' | 'extrema'
    functionLatex: string
    point?: number
    expectedAnswer: string | number
    timeLimit: number
  }>
}

// 7. INTEGRAL INFERNO — Integration (technique rune selection + completion)
export interface IntegralInfernoConfig extends GameBase {
  type: 'integral-inferno'
  items: Array<{
    id: string
    skillId: string
    integrand: string       // LaTeX: e.g., "∫ x e^x dx"
    correctTechnique: 'direct' | 'u-sub' | 'parts' | 'partial-fractions' | 'trig-id' | 'special-form'
    completionSteps?: Array<{ prompt: string; answer: string }> // fill-in-the-blank steps
    expectedAntiderivative: string
    timeLimit: number
    patternScore: boolean   // bonus if rune tapped in <2.5s
  }>
}

// 8. AREA ARCHITECT — Applications of Integrals (region setup + integration)
export interface AreaArchitectConfig extends GameBase {
  type: 'area-architect'
  items: Array<{
    id: string
    skillId: string
    curves: Array<{ equation: string; label: string }>
    integrationVariable: 'x' | 'y'
    bounds: [number, number]
    expectedArea: number
    timeLimit: number
  }>
}

// 9. DIFF-EQ DESCENT — Differential Equations (type classification + solving)
export interface DiffEqDescentConfig extends GameBase {
  type: 'diff-eq-descent'
  items: Array<{
    id: string
    skillId: string
    equation: string
    correctType: 'separable' | 'homogeneous' | 'linear' | 'exact'
    solvingSteps?: Array<{ prompt: string; answer: string }>
    expectedSolution: string
    timeLimit: number
  }>
}

// 10. VECTOR VOYAGER — Vectors (3D dot/cross product, projections)
export interface VectorVoyagerConfig extends GameBase {
  type: 'vector-voyager'
  items: Array<{
    id: string
    skillId: string
    operation: 'magnitude' | 'unit-vector' | 'dot-product' | 'cross-product' | 'projection'
    vectorA: [number, number, number]
    vectorB?: [number, number, number]
    expectedResult: number | [number, number, number]
    timeLimit: number
    is3D: boolean
  }>
}

// 11. 3D ARCHITECT — 3D Geometry (line/plane equations, distances)
export interface ThreeDArchitectConfig extends GameBase {
  type: '3d-architect'
  items: Array<{
    id: string
    skillId: string
    problemType: 'direction-cosines' | 'angle-between-lines' | 'distance-point-plane' | 'skew-lines'
    point?: [number, number, number]
    line?: { pointA: [number, number, number]; pointB: [number, number, number] }
    plane?: { a: number; b: number; c: number; d: number }
    expectedAnswer: number | string
    timeLimit: number
  }>
}

// 12. OPTIMA OUTPOST — Linear Programming (constraint setup + corner evaluation)
export interface OptimaOutpostConfig extends GameBase {
  type: 'optima-outpost'
  items: Array<{
    id: string
    skillId: string
    problemDescription: string
    constraints: Array<{ inequality: string; label: string }>
    objective: string
    feasibleCorners: Array<[number, number]>
    optimalAnswer: number
    timeLimit: number
  }>
}

// 13. BAYES BAZAAR — Probability (strategy classification + tree building)
export interface BayesBazaarConfig extends GameBase {
  type: 'bayes-bazaar'
  items: Array<{
    id: string
    skillId: string
    scenario: string
    correctStrategy: 'direct' | 'conditional' | 'total-probability' | 'bayes'
    givenInfo: Record<string, any>
    expectedProbability: number
    timeLimit: number
  }>
}

export type GameConfig =
  | ThisOrThatConfig
  | ChronoConfig
  | LinksConfig
  | KnockoutConfig
  | BalloonTapConfig
  | RetentionConfig
  | AudioLectureConfig
  | BubbleMatchConfig
  | MemoryAttentionConfig
  | MemoryNameRecallConfig
  | MemoryRetentionConfig
  | MemorySequencingConfig
  | MemorySynthesisConfig
  | MemoryVisualizationConfig
  | MemoryTeachBackConfig
  | MemoryInversionConfig
  | DomainDuelsConfig
  | PrincipalValleyConfig
  | MatrixForgeConfig
  | DetDetectiveConfig
  | DerivativeDojoConfig
  | TangentTycoonConfig
  | IntegralInfernoConfig
  | AreaArchitectConfig
  | DiffEqDescentConfig
  | VectorVoyagerConfig
  | ThreeDArchitectConfig
  | OptimaOutpostConfig
  | BayesBazaarConfig
