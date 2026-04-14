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

export type GameConfig =
  | ThisOrThatConfig
  | ChronoConfig
  | LinksConfig
  | KnockoutConfig
