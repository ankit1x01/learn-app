import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/**
 * Bernoulli's Theorem — Horizontal pipe with varying cross-section.
 * Shows velocity, pressure, and total head at different sections.
 */
export function BernoulliSim(props: SimProps) {
  const { controls, isPlaying } = props
  const v1    = controls['v1']    ?? 2     // velocity in wide section (m/s)
  const A1    = controls['A1']    ?? 0.04  // area wide section (m²)
  const rho   = controls['rho']   ?? 1000  // fluid density (kg/m³)
  const P1_kPa= controls['P1']    ?? 150   // inlet pressure (kPa)

  const g     = 9.81
  const P1    = P1_kPa * 1000

  // Continuity: A1v1 = A2v2
  const A2    = A1 * 0.4       // narrow section
  const v2    = (A1 * v1) / A2 // continuity equation
  // Bernoulli: P1 + ½ρv1² = P2 + ½ρv2²
  const P2    = P1 + 0.5 * rho * (v1 * v1 - v2 * v2)

  const particleRef = useRef<{ x: number; y: number; speed: number }[]>([])

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    const pipeY  = H * 0.42
    const h1     = 60   // half-height of wide section
    const h2     = 24   // half-height of narrow section
    const x0     = Math.min(W, H) * (0.06 * 1.5)
    const x1     = Math.min(W, H) * (0.35 * 1.5)   // start of taper
    const x2     = Math.min(W, H) * (0.52 * 1.5)   // end of taper / start of narrow
    const x3     = W - Math.min(W, H) * (0.06 * 1.5)  // end

    // ── Pipe shape ──
    const drawPipe = () => {
      ctx.beginPath()
      // Top wall
      ctx.moveTo(x0, pipeY - h1)
      ctx.lineTo(x1, pipeY - h1)
      ctx.lineTo(x2, pipeY - h2)
      ctx.lineTo(x3, pipeY - h2)
      // Bottom wall (reverse)
      ctx.lineTo(x3, pipeY + h2)
      ctx.lineTo(x2, pipeY + h2)
      ctx.lineTo(x1, pipeY + h1)
      ctx.lineTo(x0, pipeY + h1)
      ctx.closePath()
    }

    // Fill pipe with water
    ctx.save()
    drawPipe()
    ctx.clip()
    const waterGrad = ctx.createLinearGradient(x0, pipeY, x3, pipeY)
    waterGrad.addColorStop(0, '#93C5FD80')
    waterGrad.addColorStop(1, '#1D4ED880')
    ctx.fillStyle = waterGrad
    ctx.fillRect(0, 0, W, H)
    ctx.restore()

    // Pipe border
    ctx.strokeStyle = '#1C1B1F'
    ctx.lineWidth = 2.5
    drawPipe()
    ctx.stroke()

    // ── Animated particles ──
    if (particleRef.current.length === 0) {
      for (let i = 0; i < 20; i++) {
        particleRef.current.push({
          x: x0 + Math.random() * (x3 - x0),
          y: pipeY + (Math.random() * 2 - 1) * h2 * 0.8,
          speed: v1,
        })
      }
    }

    if (isPlaying) {
      particleRef.current.forEach(p => {
        // Speed up through narrow section
        const inNarrow = p.x > x2 && p.x < x3
        p.speed = inNarrow ? v2 * 22 : v1 * 22
        p.x += p.speed * dt
        if (p.x > x3) {
          p.x = x0 + 4
          p.y = pipeY + (Math.random() * 2 - 1) * h1 * 0.8
        }
        // Constrain y within pipe at current x
        const h = p.x < x1 ? h1 : p.x < x2 ? h1 + (h2 - h1) * ((p.x - x1) / (x2 - x1)) : h2
        p.y = Math.max(pipeY - h + 4, Math.min(pipeY + h - 4, p.y))
      })
    }

    particleRef.current.forEach(p => {
      ctx.fillStyle = '#BFDBFE'
      ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill()
    })

    // ── Pressure bars (Manometer style) ──
    const drawManometer = (x: number, P: number, v: number, label: string) => {
      const barMaxH = 90
      const barH    = Math.min(barMaxH, (P / (P1 + 1)) * barMaxH)
      const barX    = x - 10
      const baseY   = pipeY + h2 + 80

      ctx.strokeStyle = '#CAC4D0'
      ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.moveTo(x, pipeY - h2); ctx.lineTo(x, pipeY + h2); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(x, pipeY + h2); ctx.lineTo(x, baseY - barH); ctx.stroke()

      ctx.fillStyle = '#3B82F6'
      ctx.fillRect(barX, baseY - barH, 20, barH)
      ctx.strokeStyle = '#1D4ED8'
      ctx.lineWidth = 1
      ctx.strokeRect(barX, baseY - barMaxH, 20, barMaxH)

      const fs = Math.max(9, Math.round(Math.min(W, H) * (0.026 * 1.5)))
      ctx.fillStyle = '#1C1B1F'
      ctx.font = `bold ${fs}px 'Roboto', sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText(label, x, baseY + 14)
      ctx.fillStyle = '#1D4ED8'
      ctx.font = `${fs}px 'Roboto', sans-serif`
      ctx.fillText(`P=${(P / 1000).toFixed(1)}kPa`, x, baseY + 26)
      ctx.fillStyle = '#6750A4'
      ctx.fillText(`v=${v.toFixed(1)}m/s`, x, baseY + 38)
    }

    drawManometer(x0 + (x1 - x0) * 0.5, P1, v1, 'Section 1')
    drawManometer(x2 + (x3 - x2) * 0.5, Math.max(0, P2), v2, 'Section 2')

    // ── Bernoulli equation label ──
    const fs = Math.max(10, Math.round(Math.min(W, H) * (0.028 * 1.5)))
    ctx.fillStyle = '#EADDFF'
    ctx.beginPath(); ctx.roundRect(x0, 6, Math.min(W, H) * (0.92 * 1.5), 30, 8); ctx.fill()
    ctx.fillStyle = '#21005D'
    ctx.font = `bold ${fs}px 'Roboto', sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText(
      `P + ½ρv² = const   |   v₂ = ${v2.toFixed(2)} m/s   |   P₂ = ${(P2 / 1000).toFixed(1)} kPa`,
      W / 2, 25
    )
  }, [v1, A1, rho, P1, A2, v2, P2, isPlaying])

  particleRef.current = []

  return <CanvasEngine {...props} draw={draw} deps={[v1, A1, rho, P1_kPa, isPlaying]} animated />
}
