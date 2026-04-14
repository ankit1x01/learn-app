// src/games/components/Knockout.tsx
import { useState, useRef } from 'react'
import { Trophy, CheckCircle } from 'lucide-react'
import { KnockoutConfig, GameResult } from '../types'
import { GameWinScreen } from './GameWinScreen'

interface Props { config: KnockoutConfig }

interface Matchup {
  cardA: { id: string; label: string }
  cardB: { id: string; label: string }
}

function buildBracket(cards: KnockoutConfig['cards']): Matchup[] {
  const matchups: Matchup[] = []
  for (let i = 0; i + 1 < cards.length; i += 2) {
    matchups.push({ cardA: cards[i], cardB: cards[i + 1] })
  }
  return matchups
}

// Pairs of card face colors — each matchup gets its own color pair
const CARD_COLOR_PAIRS = [
  ['#4ADE80', '#A78BFA'],
  ['#60A5FA', '#FCD34D'],
  ['#F472B6', '#2DD4BF'],
  ['#FB923C', '#818CF8'],
]

export function Knockout({ config }: Props) {
  if (config.cards.length % 2 !== 0) {
    console.warn('Knockout: cards array has an odd length. The last card will not appear in the bracket.')
  }

  const startTime = useRef(Date.now())
  const [roundCards, setRoundCards] = useState(config.cards)
  const [matchupIndex, setMatchupIndex] = useState(0)
  const [totalGuesses, setTotalGuesses] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [result, setResult] = useState<GameResult | null>(null)
  const [roundWinners, setRoundWinners] = useState<string[]>([])
  const [roundLabel, setRoundLabel] = useState(1)

  const matchups = buildBracket(roundCards)
  const currentMatchup = matchups[matchupIndex]

  function getCorrectWinner(a: string, b: string): string {
    const key1 = `${a}_vs_${b}`
    const key2 = `${b}_vs_${a}`
    return config.answers[key1] ?? config.answers[key2] ?? a
  }

  function handlePick(pickedId: string) {
    if (selected) return
    setSelected(pickedId)
    setTotalGuesses(g => g + 1)

    const correctWinner = getCorrectWinner(currentMatchup.cardA.id, currentMatchup.cardB.id)
    const isCorrect = pickedId === correctWinner

    setTimeout(() => {
      const newWinners = [...roundWinners, correctWinner]
      const nextMatchup = matchupIndex + 1

      if (nextMatchup >= matchups.length) {
        if (newWinners.length === 1) {
          const finalResult: GameResult = {
            gameType: 'knockout',
            score: isCorrect ? 100 : 60,
            guesses: totalGuesses + 1,
            hintsUsed: 0,
            timeMs: Date.now() - startTime.current,
          }
          config.onComplete?.(finalResult)
          setResult(finalResult)
        } else {
          const nextRoundCards = newWinners
            .map(id => roundCards.find(c => c.id === id))
            .filter((c): c is { id: string; label: string } => c !== undefined)
          setRoundCards(nextRoundCards)
          setMatchupIndex(0)
          setRoundWinners([])
          setSelected(null)
          setRoundLabel(l => l + 1)
        }
      } else {
        setRoundWinners(newWinners)
        setMatchupIndex(nextMatchup)
        setSelected(null)
      }
    }, 900)
  }

  function handleReset() {
    setRoundCards(config.cards)
    setMatchupIndex(0)
    setTotalGuesses(0)
    setSelected(null)
    setResult(null)
    setRoundWinners([])
    setRoundLabel(1)
    startTime.current = Date.now()
  }

  if (result) return <GameWinScreen result={result} onPlayAgain={handleReset} />
  if (!currentMatchup) return null

  const correctWinner = getCorrectWinner(currentMatchup.cardA.id, currentMatchup.cardB.id)
  const colorPair = CARD_COLOR_PAIRS[matchupIndex % CARD_COLOR_PAIRS.length]

  return (
    // Full orange background — signature Knockout look
    <div className="flex flex-col h-full" style={{ background: '#EA580C' }}>
      {/* Header on orange */}
      <div className="px-5 pt-5 pb-3">
        <p
          className="text-[11px] font-semibold uppercase tracking-widest text-center"
          style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Plus Jakarta Sans, system-ui' }}
        >
          Round {roundLabel} · Match {matchupIndex + 1} of {matchups.length}
        </p>
        <h2
          className="text-[22px] font-black text-white text-center mt-1 leading-snug"
          style={{ fontFamily: 'Plus Jakarta Sans, system-ui', letterSpacing: '-0.02em' }}
        >
          {config.question}
        </h2>
        {config.subtitle && (
          <p
            className="text-[13px] text-center mt-1.5"
            style={{ color: 'rgba(255,255,255,0.70)', fontFamily: 'Inter, system-ui' }}
          >
            {config.subtitle}
          </p>
        )}
      </div>

      {/* Cards arena */}
      <div className="flex-1 flex items-center justify-center px-5">
        <div className="flex gap-4 w-full max-w-xs">
          {([
            { card: currentMatchup.cardA, color: colorPair[0] },
            { card: currentMatchup.cardB, color: colorPair[1] },
          ] as const).map(({ card, color }) => {
            const isSelected = selected === card.id
            const isCorrect = selected !== null && card.id === correctWinner
            const isWrong = selected !== null && isSelected && card.id !== correctWinner

            return (
              <button
                key={card.id}
                onClick={() => handlePick(card.id)}
                disabled={selected !== null}
                className="flex-1 flex flex-col items-center justify-center transition-all duration-200 relative"
                style={{
                  aspectRatio: '3/4',
                  outline: 'none',
                  transform: isSelected && !isCorrect ? 'scale(0.95)' : 'scale(1)',
                }}
              >
                {/* Stack layers (depth effect from Learned app) */}
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: 'rgba(0,0,0,0.20)',
                    transform: 'translateY(8px) rotate(2deg)',
                    borderRadius: 24,
                  }}
                />
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: 'rgba(0,0,0,0.12)',
                    transform: 'translateY(4px) rotate(1deg)',
                    borderRadius: 24,
                  }}
                />

                {/* Main card face */}
                <div
                  className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center px-4"
                  style={{
                    background: isCorrect ? '#F0FDF4' : isWrong ? '#FEF2F2' : color,
                    borderRadius: 24,
                    boxShadow: isCorrect
                      ? '0 0 0 3px #22C55E'
                      : isWrong
                      ? '0 0 0 3px #EF4444'
                      : '0 4px 0 rgba(0,0,0,0.22)',
                    transition: 'all 0.2s',
                  }}
                >
                  {isCorrect && (
                    <CheckCircle size={24} color="#16A34A" style={{ marginBottom: 8 }} />
                  )}
                  {isWrong && (
                    <Trophy size={20} color="#DC2626" style={{ marginBottom: 8, opacity: 0.5 }} />
                  )}
                  <p
                    className="text-[16px] font-black text-center leading-snug"
                    style={{
                      color: isCorrect ? '#166534' : isWrong ? '#B91C1C' : 'rgba(0,0,0,0.72)',
                      fontFamily: 'Plus Jakarta Sans, system-ui',
                    }}
                  >
                    {card.label}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* VS badge — centred absolutely */}
        <div
          className="absolute z-10 w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.20)',
            border: '2px solid rgba(255,255,255,0.35)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <span
            className="text-[12px] font-black text-white"
            style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}
          >
            vs
          </span>
        </div>
      </div>

      {/* Footer on orange */}
      <div className="px-5 py-5">
        <p
          className="text-center text-[13px]"
          style={{ color: 'rgba(255,255,255,0.60)', fontFamily: 'Inter, system-ui' }}
        >
          Tap the faster one
        </p>
      </div>
    </div>
  )
}
