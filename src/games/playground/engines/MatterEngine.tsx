import { useEffect, useRef } from 'react'
import Matter from 'matter-js'
import { SimProps } from '../types'

export interface MatterEngineProps extends SimProps {
  setup: (
    engine: Matter.Engine,
    render: Matter.Render,
    canvas: HTMLCanvasElement
  ) => () => void
}

export function MatterEngine({
  setup, controls, puzzle, isPlaying, onReset, onControlChange, viewOffset,
}: MatterEngineProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const engineRef  = useRef<Matter.Engine | null>(null)
  const renderRef  = useRef<Matter.Render | null>(null)
  const runnerRef  = useRef<Matter.Runner | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  // ── Mount: create engine, render, runner ───────────────────────────────────
  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas  = canvasRef.current
    if (!wrapper || !canvas) return

    const dpr = window.devicePixelRatio || 1
    // Read ACTUAL layout dimensions from the wrapper div (always > 0 after mount)
    const W = wrapper.clientWidth  || 380
    const H = wrapper.clientHeight || 300

    // Pre-set physical pixel buffer BEFORE Matter.js touches the canvas.
    // canvas.width/height = physical pixels; style stays fluid via CSS.
    canvas.width  = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)

    const engine = Matter.Engine.create({ gravity: { y: 1 } })
    const render = Matter.Render.create({
      canvas,
      engine,
      options: {
        width:      W,
        height:     H,
        // Pass dpr so Matter.js scales its internal context correctly,
        // but it will also override canvas.style.width/height to fixed px.
        pixelRatio: dpr,
        wireframes: false,
        background: 'var(--color-surface-container-low, #f4eff4)',
      },
    })

    // Matter.js setPixelRatio writes inline style="width:Wpx; height:Hpx".
    // Override back to fluid CSS so the canvas always matches its container
    // pixel-perfectly regardless of zoom / actual layout width.
    canvas.style.width  = '100%'
    canvas.style.height = '100%'

    const runner = Matter.Runner.create()
    engineRef.current = engine
    renderRef.current = render
    runnerRef.current = runner

    Matter.Render.run(render)

    return () => {
      cleanupRef.current?.()
      Matter.Runner.stop(runner)
      Matter.Render.stop(render)
      Matter.Engine.clear(engine)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Re-run world setup whenever controls change ─────────────────────────────
  useEffect(() => {
    const engine = engineRef.current
    const render = renderRef.current
    const canvas = canvasRef.current
    if (!engine || !render || !canvas) return
    cleanupRef.current?.()
    cleanupRef.current = setup(engine, render, canvas)
  }, [setup])

  // ── Play / Pause ────────────────────────────────────────────────────────────
  useEffect(() => {
    const runner = runnerRef.current
    const engine = engineRef.current
    if (!runner || !engine) return
    if (isPlaying) Matter.Runner.run(runner, engine)
    else           Matter.Runner.stop(runner)
  }, [isPlaying])

  // ── Camera pan via viewOffset ───────────────────────────────────────────────
  useEffect(() => {
    const render = renderRef.current
    if (!render) return
    const W  = render.options.width  || 380
    const H  = render.options.height || 300
    const ox = viewOffset?.x ?? 0
    const oy = viewOffset?.y ?? 0
    Matter.Render.lookAt(render, {
      min: { x: ox,     y: oy     },
      max: { x: ox + W, y: oy + H },
    })
  }, [viewOffset])

  // suppress unused-var warnings
  void controls; void puzzle; void onReset; void onControlChange

  return (
    // Wrapper div is the source of truth for layout dimensions.
    // The canvas is layered inside at 100%×100% via inline style.
    <div
      ref={wrapperRef}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      <canvas
        ref={canvasRef}
        className="rounded-[var(--radius-m3-lg)]"
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  )
}
