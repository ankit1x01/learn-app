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

export function MatterEngine({ setup, controls, puzzle, isPlaying, onReset }: MatterEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const renderRef = useRef<Matter.Render | null>(null)
  const runnerRef = useRef<Matter.Runner | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  // Mount: create engine, render, runner — but start PAUSED
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const engine = Matter.Engine.create({ gravity: { y: 1 } })
    const render = Matter.Render.create({
      canvas,
      engine,
      options: {
        width: canvas.clientWidth || 380,
        height: canvas.clientHeight || 300,
        wireframes: false,
        background: 'var(--color-surface-container-low, #f4eff4)',
      },
    })
    const runner = Matter.Runner.create()

    engineRef.current = engine
    renderRef.current = render
    runnerRef.current = runner

    cleanupRef.current = setup(engine, render, canvas)

    // Always render visually, but start runner paused
    Matter.Render.run(render)
    // Runner starts stopped — isPlaying effect below drives it

    return () => {
      cleanupRef.current?.()
      Matter.Runner.stop(runner)
      Matter.Render.stop(render)
      Matter.Engine.clear(engine)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Play / Pause: drive the runner based on isPlaying prop
  useEffect(() => {
    const runner = runnerRef.current
    const engine = engineRef.current
    if (!runner || !engine) return

    if (isPlaying) {
      Matter.Runner.run(runner, engine)
    } else {
      Matter.Runner.stop(runner)
    }
  }, [isPlaying])

  // suppress unused warnings
  void controls; void puzzle; void onReset

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-[var(--radius-m3-lg)]"
      style={{ display: 'block' }}
    />
  )
}
