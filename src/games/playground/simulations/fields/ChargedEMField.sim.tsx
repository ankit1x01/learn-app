import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/**
 * Charged Particle in E & B Field (Combo)
 * Visualizes Lorentz force: F = q(E + v x B)
 */
export function ChargedEMFieldSim(props: SimProps) {
  const { controls, isPlaying } = props

  const E = controls?.E ?? 10      // Electric field (vertical)
  const B = controls?.B ?? 1       // Magnetic field (z-axis)
  const q = (controls?.q ?? 1) * 1e-6 // Convert μC to C (scaling)
  const v0 = controls?.v0 ?? 50    // Initial velocity
  const m = 1e-5 // Small mass for visible acceleration

  const posRef = useRef({ x: 0, y: 0 })
  const velRef = useRef({ x: v0, y: 0 })
  const trailRef = useRef<{ x: number; y: number }[]>([])

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    const scale = Math.min(W, H)
    const cx = W * 0.2 // Start from left
    const cy = H / 2

    if (!isPlaying) {
      posRef.current = { x: 0, y: 0 }
      velRef.current = { x: v0, y: 0 }
      trailRef.current = []
    }

    if (isPlaying) {
      const vx = velRef.current.x
      const vy = velRef.current.y

      // Lorentz acceleration (a = q/m * (E + v x B))
      // vx component: ax = (q * vy * B) / m
      // vy component: ay = (q * E - q * vx * B) / m
      const ax = (q * vy * B) / m
      const ay = (q * E - q * vx * B) / m

      velRef.current.x += ax * dt
      velRef.current.y += ay * dt

      // Scaling for visualization
      const visualScale = 2 
      posRef.current.x += velRef.current.x * dt * visualScale
      posRef.current.y += velRef.current.y * dt * visualScale

      trailRef.current.push({ ...posRef.current })
      if (trailRef.current.length > 300) trailRef.current.shift()
    }

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    const fontSmall = Math.max(10, Math.round(scale * 0.025))
    const primary = '#6750A4'
    const secondary = '#958DA5'

    // --- Background Field Lines ---
    ctx.strokeStyle = '#EADDFF'
    ctx.lineWidth = 1
    const step = scale * 0.12
    for (let x = 0; x < W; x += step) {
      for (let y = 0; y < H; y += step) {
        // E-field arrows
        if (Math.abs(E) > 0) {
          const dir = E > 0 ? 1 : -1
          ctx.beginPath()
          ctx.moveTo(x, y - dir * 10)
          ctx.lineTo(x, y + dir * 10)
          ctx.stroke()
        }
        // B-field dots/crosses
        if (Math.abs(B) > 0) {
          ctx.fillStyle = '#F4F4F9'
          ctx.font = `${fontSmall}px 'Roboto', sans-serif`
          ctx.fillText(B > 0 ? '×' : '•', x + step/2, y + step/2)
        }
      }
    }

    // --- Trajectory ---
    if (trailRef.current.length > 1) {
      ctx.beginPath()
      ctx.setLineDash([5, 5])
      ctx.strokeStyle = primary
      ctx.globalAlpha = 0.4
      ctx.moveTo(cx + trailRef.current[0].x, cy + trailRef.current[0].y)
      for (let i = 1; i < trailRef.current.length; i++) {
        ctx.lineTo(cx + trailRef.current[i].x, cy + trailRef.current[i].y)
      }
      ctx.stroke()
      ctx.setLineDash([])
      ctx.globalAlpha = 1
    }

    // --- Particle ---
    const px = cx + posRef.current.x
    const py = cy + posRef.current.y
    const particleColor = q > 0 ? '#B3261E' : (q < 0 ? '#0061A4' : secondary)

    ctx.shadowBlur = 15
    ctx.shadowColor = particleColor
    ctx.fillStyle = particleColor
    ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2); ctx.fill()
    ctx.shadowBlur = 0

    // --- Info Panel ---
    const panelW = scale * 0.35
    const panelH = scale * 0.15
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.beginPath(); ctx.roundRect(W - panelW - 20, 20, panelW, panelH, 12); ctx.fill()
    ctx.strokeStyle = '#CAC4D0'
    ctx.lineWidth = 1; ctx.stroke()

    ctx.fillStyle = primary
    ctx.textAlign = 'left'
    ctx.font = `bold ${Math.max(12, Math.round(scale * 0.035))}px 'Roboto', sans-serif`
    ctx.fillText(`v: ${Math.sqrt(velRef.current.x**2 + velRef.current.y**2).toFixed(1)} m/s`, W - panelW + 5, 50)
    ctx.font = `${fontSmall}px 'Roboto', sans-serif`
    ctx.fillText(`Force: ${(Math.abs(q)*Math.sqrt(E**2 + (velRef.current.x*B)**2)).toFixed(6)} N`, W - panelW + 5, 75)

  }, [E, B, q, v0, isPlaying])

  return <CanvasEngine {...props} draw={draw} deps={[E, B, q, v0, isPlaying]} animated />
}