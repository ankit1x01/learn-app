import { Suspense, useState, useRef, useCallback, useEffect } from 'react'
import { SIMULATION_REGISTRY } from './registry'
import { SimulationType, PhysicsPlaygroundConfig, PuzzleConfig, PlaygroundResult, Complexity } from './types'
import { PuzzlePanel } from './ui/PuzzlePanel'
import { ControlPanel } from './ui/ControlPanel'
import { ResultModal } from './ui/ResultModal'
import { MeasurementOverlay } from './ui/MeasurementOverlay'
import { StubEngine } from './engines/StubEngine'
import { getScenarioPreset } from './ScenarioMapper'

interface Props {
  type: SimulationType
  config?: PhysicsPlaygroundConfig
  onBack?: () => void
}

function scoreCalc(hintsUsed: number, timeTaken: number, correct: boolean): number {
  if (!correct) return 0
  const hintPenalty = hintsUsed * 15
  const timePenalty = Math.min(30, Math.floor(timeTaken / 30000))
  return Math.max(10, 100 - hintPenalty - timePenalty)
}

function validateAnswers(inputs: Record<string, number>, puzzle: PuzzleConfig): boolean {
  return puzzle.find.every(key => {
    const expected = puzzle.answer[key]
    const actual = inputs[key]
    if (actual === undefined) return false
    const pct = Math.abs((actual - expected) / expected) * 100
    return pct <= puzzle.tolerance
  })
}

export function PhysicsPlayground({ type, config = {}, onBack }: Props) {
  const plugin = SIMULATION_REGISTRY[type]
  const { onResult, showMeasurements = true, complexity = 'jee_advanced' } = config

  const puzzleBank = plugin.puzzles.filter((p: PuzzleConfig) =>
    config.puzzle ? p.id === config.puzzle.id : p.complexity === (complexity as Complexity)
  )
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const puzzle: PuzzleConfig | null = config.freePlay
    ? null
    : puzzleBank[puzzleIndex % Math.max(1, puzzleBank.length)] ?? null

  const defaultValues = Object.fromEntries(
    plugin.defaultControls.map(c => [c.id, c.default])
  )
  const [controlValues, setControlValues] = useState<Record<string, number>>(defaultValues)
  const handleControl = useCallback((id: string, value: number) => {
    setControlValues(prev => ({ ...prev, [id]: value }))
  }, [])

  // ── Auto-apply scenario preset when puzzle changes ────────────────────────
  const [scenarioPreset, setScenarioPreset] = useState<{ label: string; icon: string } | null>(null)
  useEffect(() => {
    if (!puzzle) return
    const preset = getScenarioPreset(type, puzzle)
    if (Object.keys(preset.controls).length > 0) {
      setControlValues(prev => {
        const merged = { ...prev }
        for (const [k, v] of Object.entries(preset.controls)) {
          const def = plugin.defaultControls.find(c => c.id === k)
          if (def) {
            merged[k] = Math.max(def.min, Math.min(def.max, v))
          } else {
            merged[k] = v
          }
        }
        return merged
      })
      setScenarioPreset({ label: preset.scenarioLabel, icon: preset.scenarioIcon })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzle?.id])

  const [hintsUsed, setHintsUsed] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState<boolean | null>(null)
  const [result, setResult] = useState<PlaygroundResult | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const startTimeRef = useRef(Date.now())

  // ── Pan / camera state ───────────────────────────────────────────────────
  const [viewOffset, setViewOffset]   = useState({ x: 0, y: 0 })
  const [isPanMode, setIsPanMode]     = useState(false)
  const [isActuallyPanning, setIsActuallyPanning] = useState(false)
  const panStartRef = useRef<{ cx: number; cy: number; ox: number; oy: number } | null>(null)

  const onPanPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanMode) return
    panStartRef.current = { cx: e.clientX, cy: e.clientY, ox: viewOffset.x, oy: viewOffset.y }
    setIsActuallyPanning(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [isPanMode, viewOffset])

  const onPanPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanMode || !panStartRef.current) return
    const { cx, cy, ox, oy } = panStartRef.current
    setViewOffset({ x: ox - (e.clientX - cx), y: oy - (e.clientY - cy) })
  }, [isPanMode])

  const onPanPointerUp = useCallback(() => {
    panStartRef.current = null
    setIsActuallyPanning(false)
  }, [])

  const handleCenterView = useCallback(() => setViewOffset({ x: 0, y: 0 }), [])

  const handleSubmit = useCallback((answers: Record<string, number>) => {
    if (!puzzle) return
    const ok = validateAnswers(answers, puzzle)
    const timeTaken = Date.now() - startTimeRef.current
    const score = scoreCalc(hintsUsed, timeTaken, ok)
    const r: PlaygroundResult = {
      conceptId: plugin.conceptId,
      correct: ok,
      timeTaken,
      score,
      hintsUsed,
    }
    setCorrect(ok)
    setSubmitted(true)
    setResult(r)
    onResult?.(r)
  }, [puzzle, hintsUsed, plugin.conceptId, onResult])

  const handleReset = useCallback(() => {
    setIsPlaying(false)
    setResetKey(k => k + 1)
    setSubmitted(false)
    setCorrect(null)
    setResult(null)
    setHintsUsed(0)
    startTimeRef.current = Date.now()
    setControlValues(defaultValues)
  }, [defaultValues])

  const handleNext = useCallback(() => {
    setPuzzleIndex(i => i + 1)
    handleReset()
  }, [handleReset])

  const SimComponent = plugin.component

  return (
    <div className="flex flex-col h-full bg-[var(--color-background)] overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center gap-3 px-4 pb-2 shrink-0"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 16px)' }}
      >
        {onBack && (
          <button
            onClick={onBack}
            className="p-1.5 -ml-1.5 rounded-xl hover:bg-[rgba(0,0,0,0.05)] transition-colors"
            aria-label="Back"
          >
            <span className="material-symbols-rounded" style={{ fontSize: 22, color: 'var(--color-on-surface)' }}>
              arrow_back
            </span>
          </button>
        )}
        <span
          className="material-symbols-rounded"
          style={{ fontSize: 22, color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}
        >
          {plugin.icon}
        </span>
        <h2 className="text-base font-bold text-[var(--color-on-surface)] flex-1 flex items-center gap-2">
          {plugin.label}
          {config.freePlay && (
            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] flex items-center gap-1">
              <span className="material-symbols-rounded" style={{ fontSize: 12 }}>settings</span> Free
            </span>
          )}
          {scenarioPreset && !config.freePlay && (
            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] flex items-center gap-1">
              <span className="material-symbols-rounded" style={{ fontSize: 12, fontVariationSettings: "'FILL' 1" }}>{scenarioPreset.icon}</span>
              {scenarioPreset.label}
            </span>
          )}
        </h2>
        <button
          onClick={handleReset}
          className="p-1.5 rounded-full text-[var(--color-on-surface-variant)] hover:bg-[rgba(0,0,0,0.05)] transition-colors"
          aria-label="Reset"
          title="Reset Simulation"
        >
          <span className="material-symbols-rounded" style={{ fontSize: 20 }}>refresh</span>
        </button>
        
        {!config.freePlay && puzzleBank.length > 1 && (
          <button
            onClick={handleNext}
            className="p-1.5 rounded-full text-[var(--color-on-surface-variant)] hover:bg-[rgba(0,0,0,0.05)] transition-colors"
            aria-label="Skip Question"
            title="Skip Question"
          >
            <span className="material-symbols-rounded" style={{ fontSize: 20 }}>skip_next</span>
          </button>
        )}

        <button
          onClick={() => setIsPlaying(p => !p)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white"
          style={{ background: 'var(--color-primary)' }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>
            {isPlaying ? 'pause' : 'play_arrow'}
          </span>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>

      {/* Simulation area */}
      <div
        className="relative flex-1 min-h-0 mx-4 rounded-[var(--radius-m3-xl)] overflow-hidden bg-[var(--color-surface-container-low)]"
        style={{ cursor: isPanMode ? (isActuallyPanning ? 'grabbing' : 'grab') : 'default' }}
        onPointerDown={onPanPointerDown}
        onPointerMove={onPanPointerMove}
        onPointerUp={onPanPointerUp}
        onPointerCancel={onPanPointerUp}
      >
        {/* Pan-mode transparent overlay blocks sim interaction */}
        {isPanMode && (
          <div className="absolute inset-0 z-10" style={{ touchAction: 'none' }} />
        )}

        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <span className="material-symbols-rounded text-[var(--color-primary)]" style={{ fontSize: 32 }}>
              progress_activity
            </span>
          </div>
        }>
          {plugin.engine === 'stub' ? (
            <StubEngine type={type} controls={controlValues} puzzle={puzzle} isPlaying={isPlaying} onReset={handleReset} />
          ) : (
            <SimComponent
              key={resetKey}
              controls={controlValues}
              puzzle={puzzle}
              isPlaying={isPlaying}
              onReset={handleReset}
              onControlChange={handleControl}
              viewOffset={viewOffset}
            />
          )}
        </Suspense>
        <MeasurementOverlay measurements={[]} visible={showMeasurements} />

        {/* Formula overlay */}
        {plugin.formulaRows && (
          <div
            className="absolute top-2 right-2 rounded-xl px-2.5 py-2 flex flex-col gap-1 pointer-events-none z-20"
            style={{ background: 'rgba(28,27,31,0.72)', backdropFilter: 'blur(6px)', minWidth: 170 }}
          >
            {plugin.formulaRows(controlValues).map((row: { label: string; value: string }, i: number) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <span className="text-[11px]" style={{ color: '#D0BCFF', fontFamily: 'Roboto,sans-serif' }}>{row.label}</span>
                <span className="text-[11px] font-bold" style={{ color: '#fff', fontFamily: 'Roboto,sans-serif', minWidth: 52, textAlign: 'right' }}>{row.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Pan controls: toggle + center */}
        <div className="absolute bottom-2 left-2 flex gap-1 z-20">
          <button
            onClick={handleCenterView}
            title="Reset view"
            className="flex items-center justify-center w-8 h-8 rounded-full text-white shadow-md transition-opacity"
            style={{ background: 'rgba(28,27,31,0.7)', backdropFilter: 'blur(4px)', opacity: (viewOffset.x !== 0 || viewOffset.y !== 0) ? 1 : 0.4 }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 16 }}>center_focus_strong</span>
          </button>
          <button
            onClick={() => setIsPanMode(p => !p)}
            title={isPanMode ? 'Exit pan mode' : 'Pan / drag to explore'}
            className="flex items-center justify-center w-8 h-8 rounded-full shadow-md transition-all"
            style={{
              background: isPanMode ? 'var(--color-primary)' : 'rgba(28,27,31,0.7)',
              backdropFilter: 'blur(4px)',
              color: 'white',
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 16 }}>pan_tool</span>
          </button>
        </div>
      </div>

      {/* Bottom panel */}
      <div className="flex flex-col gap-3 px-4 py-3 overflow-y-auto max-h-[42vh]">
        {plugin.defaultControls.length > 0 && (
          <ControlPanel
            controls={plugin.defaultControls}
            values={controlValues}
            onChange={handleControl}
            disabled={submitted}
          />
        )}
        {puzzle && (
          <PuzzlePanel
            puzzle={puzzle}
            onSubmit={handleSubmit}
            hintsUsed={hintsUsed}
            onHint={() => setHintsUsed(h => Math.min(h + 1, puzzle.hints.length))}
            submitted={submitted}
            correct={correct}
          />
        )}
      </div>

      {result && puzzle && (
        <ResultModal
          result={result}
          puzzle={puzzle}
          onNext={handleNext}
          onRetry={handleReset}
        />
      )}
    </div>
  )
}
