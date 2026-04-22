import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/**
 * Viscosity & Stokes' Law
 * A sphere falling through a viscous fluid reaches terminal velocity.
 * Shows velocity-time graph and force balance (weight, buoyancy, drag).
 */
export function ViscositySim(props: SimProps) {
  const { controls, isPlaying } = props
  const eta    = controls['eta']    ?? 1.0   // dynamic viscosity Pa·s (water=0.001, glycerin~1.5)
  const r      = controls['r']      ?? 0.005 // sphere radius m
  const rho_s  = controls['rho_s']  ?? 7800  // sphere density (steel ≈7800)
  const rho_f  = controls['rho_f']  ?? 1000  // fluid density

  const g      = 9.81
  const V      = (4 / 3) * Math.PI * r * r * r   // volume
  const m      = rho_s * V
  const W_g    = m * g
  const F_B    = rho_f * V * g
  // Terminal velocity via Stokes: 6πηrv = W-F_B → v_t = 2r²(ρ_s-ρ_f)g/(9η)
  const v_t    = (2 * r * r * (rho_s - rho_f) * g) / (9 * eta)

  const timeRef = useRef(0)
  const vRef    = useRef(0)    // current velocity m/s
  const yRef    = useRef(0)    // position m from top of fluid

  // velocity history for graph
  const histRef = useRef<number[]>([])

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    const FLUID_H = 3.0  // m — fluid column
    const PPM     = Math.min((H * 0.55) / FLUID_H, 80)

    if (isPlaying && yRef.current < FLUID_H - r * 2) {
      timeRef.current += dt
      // Net force = W_g - F_B - F_drag
      const F_drag = 6 * Math.PI * eta * r * vRef.current
      const F_net  = W_g - F_B - F_drag
      vRef.current  = Math.max(0, vRef.current + (F_net / m) * dt)
      yRef.current += vRef.current * dt
      histRef.current.push(Math.min(vRef.current, v_t * 1.05))
      if (histRef.current.length > 200) histRef.current.shift()
    }

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    // ── Fluid column (left 40%) ──
    const colX   = Math.min(W, H) * (0.08 * 1.5)
    const colW   = Math.min(W, H) * (0.30 * 1.5)
    const colTop = H * 0.06
    const colBot = colTop + FLUID_H * PPM

    // Fluid bg
    const fluidGrad = ctx.createLinearGradient(colX, colTop, colX, colBot)
    fluidGrad.addColorStop(0, '#FDE68A40')
    fluidGrad.addColorStop(1, '#D97706A0')
    ctx.fillStyle = fluidGrad
    ctx.beginPath(); ctx.roundRect(colX, colTop, colW, FLUID_H * PPM, 6); ctx.fill()
    ctx.strokeStyle = '#1C1B1F'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.roundRect(colX, colTop, colW, FLUID_H * PPM, 6); ctx.stroke()

    // Sphere
    const sphereR = Math.max(5, r * PPM * 60)
    const sphereX = colX + colW / 2
    const sphereY = colTop + yRef.current * PPM + sphereR

    const sGrad = ctx.createRadialGradient(sphereX - sphereR * 0.3, sphereY - sphereR * 0.3, 0, sphereX, sphereY, sphereR)
    sGrad.addColorStop(0, '#E2E8F0')
    sGrad.addColorStop(1, '#475569')
    ctx.fillStyle = sGrad
    ctx.beginPath(); ctx.arc(sphereX, sphereY, sphereR, 0, Math.PI * 2); ctx.fill()

    // Force arrows on sphere
    const atTerm = Math.abs(vRef.current - v_t) < v_t * 0.05
    const fDrag  = 6 * Math.PI * eta * r * vRef.current
    const netF   = W_g - F_B - fDrag
    const arrowScale = 0.5

    // Weight ↓
    drawArrow(ctx, sphereX - 16, sphereY, W_g * arrowScale, '#F43F5E', `W=${W_g.toFixed(3)}N`, true)
    // Buoyancy ↑
    drawArrow(ctx, sphereX, sphereY, -F_B * arrowScale, '#10B981', `Fb=${F_B.toFixed(3)}N`, false)
    // Drag ↑
    drawArrow(ctx, sphereX + 16, sphereY, -fDrag * arrowScale, '#3B82F6', `Fd=${fDrag.toFixed(3)}N`, false)

    // Terminal velocity marker
    if (atTerm) {
      ctx.fillStyle = '#10B981'
      ctx.font = `bold ${Math.max(9, Math.round(Math.min(W, H) * (0.026 * 1.5)))}px 'Roboto', sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText('Terminal!', sphereX, sphereY - sphereR - 10)
    }

    // Ruler on left
    const steps = 6
    for (let i = 0; i <= steps; i++) {
      const ry = colTop + (FLUID_H * i / steps) * PPM
      ctx.strokeStyle = '#1C1B1F60'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(colX - 8, ry); ctx.lineTo(colX, ry); ctx.stroke()
      ctx.fillStyle = '#49454F'
      ctx.font = `${Math.max(8, Math.round(Math.min(W, H) * (0.024 * 1.5)))}px 'Roboto', sans-serif`
      ctx.textAlign = 'right'
      ctx.fillText(`${(FLUID_H * i / steps).toFixed(1)}m`, colX - 10, ry + 4)
    }

    // ── Velocity-Time Graph (right) ──
    const gX  = colX + colW + 28
    const gW  = W - gX - 12
    const gH  = H * 0.5
    const gY  = colTop

    ctx.fillStyle = '#F4EFF4'
    ctx.beginPath(); ctx.roundRect(gX, gY, gW, gH, 8); ctx.fill()

    // Axes
    ctx.strokeStyle = '#CAC4D0'
    ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(gX + 8, gY + gH - 8); ctx.lineTo(gX + gW - 4, gY + gH - 8); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(gX + 8, gY + gH - 8); ctx.lineTo(gX + 8, gY + 6); ctx.stroke()

    const fs = Math.max(9, Math.round(Math.min(W, H) * (0.026 * 1.5)))
    ctx.fillStyle = '#49454F'
    ctx.font = `${fs}px 'Roboto', sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText('t (s)', gX + gW / 2, gY + gH + 12)
    ctx.save(); ctx.translate(gX - 4, gY + gH / 2); ctx.rotate(-Math.PI / 2)
    ctx.fillText('v (m/s)', 0, 0); ctx.restore()

    // vt dashed line
    if (v_t > 0) {
      const vtY = gY + gH - 8 - (Math.min(v_t, v_t * 1.05) / (v_t * 1.1)) * (gH - 20)
      ctx.strokeStyle = '#F59E0B60'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 3])
      ctx.beginPath(); ctx.moveTo(gX + 8, vtY); ctx.lineTo(gX + gW - 4, vtY); ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = '#F59E0B'
      ctx.font = `bold ${fs}px 'Roboto', sans-serif`
      ctx.textAlign = 'right'
      ctx.fillText(`vₜ=${v_t.toFixed(3)}m/s`, gX + gW - 4, vtY - 3)
    }

    // Plot history
    if (histRef.current.length > 1) {
      ctx.strokeStyle = '#6750A4'
      ctx.lineWidth = 2
      ctx.beginPath()
      histRef.current.forEach((v, i) => {
        const px = gX + 8 + (i / 200) * (gW - 12)
        const py = gY + gH - 8 - (v / (v_t * 1.1 || 0.01)) * (gH - 20)
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
      })
      ctx.stroke()
    }

    // ── Info Panel ──
    const rows = [
      { label: 'η (viscosity)',  value: `${eta} Pa·s`          },
      { label: 'r (radius)',     value: `${(r * 1000).toFixed(1)} mm` },
      { label: 'vₜ (terminal)', value: `${v_t.toFixed(4)} m/s` },
      { label: 'v (current)',    value: `${vRef.current.toFixed(4)} m/s` },
      { label: 'F_net',         value: `${netF.toFixed(4)} N`  },
    ]
    const infoY = gY + gH + 18
    ctx.fillStyle = '#EADDFF'
    ctx.beginPath(); ctx.roundRect(gX, infoY, gW, rows.length * (fs + 7) + 12, 8); ctx.fill()
    rows.forEach(({ label, value }, i) => {
      const ry = infoY + 10 + i * (fs + 7) + fs * 0.85
      ctx.fillStyle = '#49454F'
      ctx.font = `${fs}px 'Roboto', sans-serif`
      ctx.textAlign = 'left'
      ctx.fillText(label, gX + 8, ry)
      ctx.fillStyle = '#21005D'
      ctx.font = `bold ${fs}px 'Roboto', sans-serif`
      ctx.textAlign = 'right'
      ctx.fillText(value, gX + gW - 6, ry)
    })
  }, [eta, r, rho_s, rho_f, v_t, W_g, F_B, m, isPlaying])

  vRef.current    = 0
  yRef.current    = 0
  timeRef.current = 0
  histRef.current = []

  return <CanvasEngine {...props} draw={draw} deps={[eta, r, rho_s, rho_f, isPlaying]} animated />
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x: number, fromY: number, magnitude: number,
  color: string, label: string, isDown: boolean
) {
  const len = Math.min(40, Math.max(4, Math.abs(magnitude) * 8))
  const dir = isDown ? 1 : -1
  const toY = fromY + dir * len

  ctx.strokeStyle = color
  ctx.fillStyle   = color
  ctx.lineWidth   = 1.5
  ctx.beginPath(); ctx.moveTo(x, fromY); ctx.lineTo(x, toY); ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x, toY)
  ctx.lineTo(x - 4, toY - dir * 7)
  ctx.lineTo(x + 4, toY - dir * 7)
  ctx.closePath(); ctx.fill()
  ctx.font = `${Math.max(7, 9)}px 'Roboto', sans-serif`
  ctx.textAlign = 'center'
  ctx.fillText(label, x, toY + dir * 11)
}
