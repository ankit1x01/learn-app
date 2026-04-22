import { useCallback, useRef } from 'react'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'
import { SimProps } from '../../types'

export function EMWaveSim(props: SimProps) {
  const { controls, isPlaying } = props

  const E0 = controls?.E0 ?? 50
  const B0 = controls?.B0 ?? 50
  const freq = controls?.freq ?? 1
  const wavelength = controls?.lambda ?? 200

  const tRef = useRef(0)

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    const scale = Math.min(W, H)

    if (isPlaying) tRef.current += dt * freq
    const t = tRef.current

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    const cx = W * 0.2
    const cy = H * 0.5

    const primary = '#6750A4'
    const blue = '#1E88E5'
    const red = '#B3261E'
    const font = Math.max(10, scale * 0.025)

    const k = (2 * Math.PI) / wavelength
    const omega = 2 * Math.PI * freq

    // =========================
    // ===== 3D PROJECTION =====
    // =========================
    const project = (x: number, y: number, z: number) => {
      const perspective = 400
      const factor = perspective / (perspective + z)
      return {
        x: cx + x * factor,
        y: cy - y * factor
      }
    }

    // =========================
    // ===== ENVELOPES =========
    // =========================
    ctx.lineWidth = 2

    // Electric Field (vertical plane)
    ctx.strokeStyle = blue
    ctx.globalAlpha = 0.7
    ctx.beginPath()

    for (let x = 0; x < W * 0.6; x += 5) {
      const phase = k * x - omega * t
      const Ey = E0 * Math.sin(phase)

      const p = project(x, Ey, 0)

      if (x === 0) ctx.moveTo(p.x, p.y)
      else ctx.lineTo(p.x, p.y)
    }

    ctx.stroke()

    // Magnetic Field (horizontal depth)
    ctx.strokeStyle = red
    ctx.beginPath()

    for (let x = 0; x < W * 0.6; x += 5) {
      const phase = k * x - omega * t
      const Bz = B0 * Math.sin(phase)

      const p = project(x, 0, Bz)

      if (x === 0) ctx.moveTo(p.x, p.y)
      else ctx.lineTo(p.x, p.y)
    }

    ctx.stroke()
    ctx.globalAlpha = 1

    // =========================
    // ===== VECTOR ARROWS =====
    // =========================
    const step = 60

    for (let x = 0; x < W * 0.6; x += step) {
      const phase = k * x - omega * t

      const Ey = E0 * Math.sin(phase)
      const Bz = B0 * Math.sin(phase)

      // Electric vector
      const p1 = project(x, 0, 0)
      const p2 = project(x, Ey, 0)

      ctx.strokeStyle = blue
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.stroke()

      // Magnetic vector
      const p3 = project(x, 0, Bz)

      ctx.strokeStyle = red
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p3.x, p3.y)
      ctx.stroke()
    }

    // =========================
    // ===== AXIS ============
    // =========================
    ctx.strokeStyle = primary
    ctx.lineWidth = 2

    ctx.beginPath()
    const axisStart = project(0, 0, 0)
    const axisEnd = project(W * 0.6, 0, 0)
    ctx.moveTo(axisStart.x, axisStart.y)
    ctx.lineTo(axisEnd.x, axisEnd.y)
    ctx.stroke()

    // =========================
    // ===== INFO PANEL ========
    // =========================
    const panelW = scale * 0.35

    ctx.fillStyle = 'rgba(255,255,255,0.95)'
    ctx.beginPath()
    ctx.roundRect(W - panelW - 20, 20, panelW, scale * 0.18, 12)
    ctx.fill()

    ctx.strokeStyle = '#CAC4D0'
    ctx.stroke()

    ctx.fillStyle = primary
    ctx.font = `${font}px 'Roboto', sans-serif`

    const phaseNow = (-omega * t) % (2 * Math.PI)

    // Show physically correct E = c·B relationship (E and B drawn same visual size,
    // but the label makes the ratio explicit)
    ctx.fillText(`E = c·B  (c = 3×10⁸ m/s)`, W - panelW + 10, 45)
    ctx.fillText(`Phase: ${phaseNow.toFixed(2)} rad`, W - panelW + 10, 68)
    ctx.fillText(`f: ${freq} Hz`, W - panelW + 10, 91)

    // Labels
    ctx.fillStyle = blue
    ctx.fillText('E-field (Vertical)', 20, 30)

    ctx.fillStyle = red
    ctx.fillText('B-field (Depth)', 20, 50)

    // =========================
    // ===== POYNTING VECTOR ===
    // =========================
    // Draw a labeled arrow along the propagation axis (x-direction = wave travel)
    const axEnd = project(W * 0.6, 0, 0)
    const axMid = project(W * 0.3, 0, 0)

    // Arrow body (slightly above the axis so it is visible)
    const sPy = axMid.y - Math.max(12, scale * 0.04)
    const sEx = axEnd.x - 4
    const sMx = axMid.x

    ctx.strokeStyle = '#F59E0B'   // amber – distinct from E (blue) and B (red)
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(sMx, sPy)
    ctx.lineTo(sEx, sPy)
    ctx.stroke()

    // Arrowhead
    const ah = 7
    ctx.fillStyle = '#F59E0B'
    ctx.beginPath()
    ctx.moveTo(sEx + ah, sPy)
    ctx.lineTo(sEx - ah * 0.6, sPy - ah * 0.5)
    ctx.lineTo(sEx - ah * 0.6, sPy + ah * 0.5)
    ctx.closePath()
    ctx.fill()

    // Label
    ctx.fillStyle = '#F59E0B'
    ctx.font = `${Math.max(9, font * 0.85)}px 'Roboto', sans-serif`
    ctx.textAlign = 'left'
    ctx.fillText('S = E×B/μ₀  (energy flow)', sMx + 4, sPy - 5)

  }, [E0, B0, freq, wavelength, isPlaying])

  return (
    <CanvasEngine
      {...props}
      draw={draw}
      deps={[E0, B0, freq, wavelength, isPlaying]}
      animated
    />
  )
}