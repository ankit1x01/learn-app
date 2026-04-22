import { PuzzleConfig, PlaygroundResult } from '../types'

interface Props {
  result: PlaygroundResult
  puzzle: PuzzleConfig
  onNext: () => void
  onRetry: () => void
}

export function ResultModal({ result, puzzle, onNext, onRetry }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50 px-4 pb-6">
      <div
        className="w-full max-w-md bg-[var(--color-surface)] rounded-[var(--radius-m3-2xl)] p-6 flex flex-col gap-4"
        style={{ boxShadow: 'var(--shadow-elevation-3)' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-rounded text-4xl"
            style={{
              fontSize: 40,
              color: result.correct ? 'var(--color-tertiary)' : 'var(--color-error)',
              fontVariationSettings: "'FILL' 1"
            }}
          >
            {result.correct ? 'check_circle' : 'cancel'}
          </span>
          <div>
            <p className="text-lg font-bold text-[var(--color-on-surface)]">
              {result.correct ? 'Correct!' : 'Not quite'}
            </p>
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              Score: {result.score}/100 · {(result.timeTaken / 1000).toFixed(1)}s · {result.hintsUsed} hint{result.hintsUsed !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Formula reveal */}
        <div className="bg-[var(--color-surface-container)] rounded-[var(--radius-m3-lg)] px-4 py-3">
          <p className="text-[10px] font-bold text-[var(--color-outline)] uppercase tracking-wide mb-1">Formula</p>
          <p className="text-sm font-medium text-[var(--color-on-surface)] font-mono">{puzzle.formula}</p>
        </div>

        {/* Correct answers */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(puzzle.answer).map(([k, v]) => (
            <div
              key={k}
              className="bg-[var(--color-secondary-container)] px-3 py-1 rounded-full"
            >
              <span className="text-xs font-medium text-[var(--color-on-secondary-container)]">
                {k.replace(/_/g, ' ')} = {v} {puzzle.units[k] ?? ''}
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 py-3 rounded-[var(--radius-m3-lg)] border border-[var(--color-outline)] text-sm font-medium text-[var(--color-on-surface-variant)]"
          >
            Retry
          </button>
          <button
            onClick={onNext}
            className="flex-1 py-3 rounded-[var(--radius-m3-lg)] text-sm font-bold text-white"
            style={{ background: 'var(--color-primary)' }}
          >
            Next Puzzle
          </button>
        </div>
      </div>
    </div>
  )
}
