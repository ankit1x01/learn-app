import { useRef, useEffect, useCallback } from 'react'
import { SimProps } from '../types'

export interface CanvasEngineProps extends SimProps {
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number, dt: number) => void
  deps?: unknown[]
  /** Pass true to run a continuous RAF loop (for animated sims like BohrAtom) */
  animated?: boolean
}

export function CanvasEngine({ draw, deps = [], animated = false, isPlaying }: CanvasEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)
  const lastTRef  = useRef<number>(0)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const render = useCallback((dt = 0) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    // Scale ctx so draw functions work in CSS pixels regardless of DPR
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    draw(ctx, canvas.clientWidth, canvas.clientHeight, dt)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draw, ...deps])

  // Static re-draw on deps change
  useEffect(() => {
    if (!animated) render(0)
  }, [render, animated])

  // Animated RAF loop
  useEffect(() => {
    if (!animated) return
    let running = true

    const loop = (now: number) => {
      if (!running) return
      const dt = lastTRef.current ? Math.min((now - lastTRef.current) / 1000, 0.05) : 0.016
      lastTRef.current = now
      render(dt)
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      running = false
      cancelAnimationFrame(rafRef.current)
    }
  }, [animated, render])

  // Resize observer
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const observer = new ResizeObserver(() => {
      const dpr = window.devicePixelRatio || 1
      canvas.width  = canvas.clientWidth  * dpr
      canvas.height = canvas.clientHeight * dpr
      if (!animated) render(0)
    })
    observer.observe(canvas)
    return () => observer.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [render, animated])

  // suppress unused
  void isPlaying

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-[var(--radius-m3-lg)]"
      style={{ display: 'block' }}
    />
  )
}
