import { useState } from 'react'
import { PuzzleConfig } from '../types'

interface Props {
  puzzle: PuzzleConfig
  onSubmit: (answers: Record<string, number>) => void
  hintsUsed: number
  onHint: () => void
  submitted: boolean
  correct: boolean | null
}

export function PuzzlePanel({ puzzle, onSubmit, hintsUsed, onHint, submitted, correct }: Props) {
  const [inputs, setInputs] = useState<Record<string, string>>({})

  const handleSubmit = () => {
    const parsed: Record<string, number> = {}
    for (const key of puzzle.find) {
      const v = parseFloat(inputs[key] ?? '')
      if (isNaN(v)) return
      parsed[key] = v
    }
    onSubmit(parsed)
  }

  const complexityColor = {
    board: 'var(--color-tertiary)',
    jee_main: 'var(--color-secondary)',
    jee_advanced: 'var(--color-error)',
  }[puzzle.complexity]

  const complexityLabel = {
    board: 'Board',
    jee_main: 'JEE Main',
    jee_advanced: 'JEE Advanced',
  }[puzzle.complexity]

  return (
    <div className="flex flex-col gap-3">
      {/* Badge */}
      <div className="flex items-center gap-2">
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
          style={{ background: complexityColor }}
        >
          {complexityLabel}
        </span>
        <span className="text-[10px] text-[var(--color-outline)]">{puzzle.id}</span>
        {submitted && correct !== null && (
          <span
            className="material-symbols-rounded ml-auto"
            style={{
              fontSize: 20,
              color: correct ? 'var(--color-tertiary)' : 'var(--color-error)',
              fontVariationSettings: "'FILL' 1"
            }}
          >
            {correct ? 'check_circle' : 'cancel'}
          </span>
        )}
      </div>

      {/* Question */}
      <p className="text-sm text-[var(--color-on-surface)] leading-relaxed">{puzzle.question}</p>

      {/* Given values */}
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(puzzle.given).map(([k, v]) => (
          <span
            key={k}
            className="text-[11px] bg-[var(--color-surface-container-high)] px-2 py-0.5 rounded-full text-[var(--color-on-surface-variant)]"
          >
            {k} = {v} {puzzle.units[k] ?? ''}
          </span>
        ))}
      </div>

      {/* Answer inputs */}
      <div className="flex flex-col gap-2">
        {puzzle.find.map(key => (
          <div key={key} className="flex items-center gap-2">
            <label className="text-xs font-medium text-[var(--color-on-surface-variant)] w-28 flex-shrink-0">
              {key.replace(/_/g, ' ')} ({puzzle.units[key] ?? '?'})
            </label>
            <input
              type="number"
              step="any"
              disabled={submitted}
              value={inputs[key] ?? ''}
              onChange={e => setInputs(p => ({ ...p, [key]: e.target.value }))}
              className="flex-1 border border-[var(--color-outline-variant)] rounded-[var(--radius-m3-sm)] px-3 py-1.5 text-sm bg-[var(--color-surface)] text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)]"
              placeholder="Enter value"
            />
          </div>
        ))}
      </div>

      {/* Hint display */}
      {hintsUsed > 0 && (
        <div className="flex flex-col gap-1">
          {puzzle.hints.slice(0, hintsUsed).map((h, i) => (
            <div
              key={i}
              className="text-xs bg-[var(--color-tertiary-container)] text-[var(--color-on-tertiary-container)] px-3 py-1.5 rounded-[var(--radius-m3-sm)]"
            >
              {h}
            </div>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2">
        {!submitted && hintsUsed < puzzle.hints.length && (
          <button
            onClick={onHint}
            className="flex-1 py-2 rounded-[var(--radius-m3-lg)] text-sm font-medium border border-[var(--color-outline)] text-[var(--color-on-surface-variant)]"
          >
            Hint ({puzzle.hints.length - hintsUsed} left)
          </button>
        )}
        {!submitted && (
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 rounded-[var(--radius-m3-lg)] text-sm font-bold text-white"
            style={{ background: 'var(--color-primary)' }}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  )
}
