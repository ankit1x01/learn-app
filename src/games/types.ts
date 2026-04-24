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
  entities: Array<{
    id: string
    name: string
    color: string          // CSS hsl color
    facts: string[]        // correct fact texts
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
