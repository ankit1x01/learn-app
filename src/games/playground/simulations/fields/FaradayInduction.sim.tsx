import { useCallback, useRef } from 'react'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'
import { SimProps } from '../../types'

export function FaradayInductionSim(props: SimProps) {
  const { controls, isPlaying } = props

  const N = controls?.N ?? 20
  const speed = controls?.speed ?? 1

  const posRef = useRef(0)
  const velRef = useRef(0)
  const prevFluxRef = useRef(0)
  const graphRef = useRef<{ t: number; V: number }[]>([])
  const tRef = useRef(0)

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    const scale = Math.min(W, H)
    const cx = W / 2
    const cy = H * 0.4

    // Reset
    if (!isPlaying) {
      posRef.current = 0
      velRef.current = 0
      prevFluxRef.current = 0
      graphRef.current = []
      tRef.current = 0
    }

    // =========================
    // ===== MOTION ============
    // =========================
    if (isPlaying) {
      tRef.current += dt

      // oscillation
      posRef.current = Math.sin(tRef.current * speed * 2) * scale * 0.2
      velRef.current = Math.cos(tRef.current * speed * 2) * speed * 2
    }

    const x = cx + posRef.current

    // =========================
    // ===== FLUX MODEL ========
    // =========================
    const coilX = cx
    const distance = Math.abs(x - coilX) // distance from magnet to coil centre (px)

    // Dipole field model: B ∝ μ₀·m / (2π·(d²+r²)^(3/2))
    // Flux Φ = B · A  where A = π·r²
    // Using pixel distances for visualization; the 1/(d²+r²)^(3/2) fall-off is physical
    const mu0 = 4 * Math.PI * 1e-7
    // Magnetic dipole moment scaled so flux ≈ 1 Wb·(display) at zero distance
    // Normalization: moment_display = 2π·r_coil³ / (μ₀·π·r_coil²) = 2r_coil/μ₀
    const r_coil_px = scale * 0.04   // Coil radius in pixels (matches loopR below)
    const moment = (2 * r_coil_px) / mu0  // Display-normalised moment
    const denom = Math.pow(Math.sqrt(distance * distance + r_coil_px * r_coil_px), 3)
    const flux = (mu0 * moment / (2 * Math.PI)) / (denom + 1e-9) * (Math.PI * r_coil_px * r_coil_px)

    const dFlux = (flux - prevFluxRef.current) / (dt || 0.016)
    prevFluxRef.current = flux

    const V = -N * dFlux

    // =========================
    // ===== BACKGROUND ========
    // =========================
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    const primary = '#6750A4'
    const red = '#B3261E'
    const blue = '#1E88E5'
    const font = Math.max(10, scale * 0.025)

    // =========================
    // ===== COIL ==============
    // =========================
    const loops = 6
    const loopR = scale * 0.04

    ctx.strokeStyle = primary
    ctx.lineWidth = 2

    for (let i = 0; i < loops; i++) {
      ctx.beginPath()
      ctx.arc(cx, cy + i * 8, loopR, 0, Math.PI * 2)
      ctx.stroke()
    }

    // =========================
    // ===== MAGNET ============
    // =========================
    const mW = scale * 0.08
    const mH = scale * 0.15

    ctx.fillStyle = red
    ctx.fillRect(x - mW / 2, cy - mH / 2, mW / 2, mH)

    ctx.fillStyle = blue
    ctx.fillRect(x, cy - mH / 2, mW / 2, mH)

    // =========================
    // ===== FIELD LINES =======
    // =========================
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'

    for (let i = -2; i <= 2; i++) {
      ctx.beginPath()
      ctx.moveTo(x, cy + i * 20)
      ctx.quadraticCurveTo(cx, cy + i * 40, cx, cy + i * 20)
      ctx.stroke()
    }

    // =========================
    // ===== CURRENT (LENZ) ====
    // =========================
    // Lenz's law: induced current opposes change in flux
    //   V > 0 (flux decreasing — magnet receding): current in CW direction (red)
    //   V < 0 (flux increasing — magnet approaching): current in CCW direction (blue)
    if (Math.abs(V) > 0.01) {
      const lenzColor = V > 0 ? red : blue
      const lenzLabel = V > 0 ? 'I: CW (Lenz)' : 'I: CCW (Lenz)'
      const lenzArcDir = V > 0 // true = clockwise arc

      ctx.strokeStyle = lenzColor
      ctx.lineWidth = 2.5
      // Draw arc showing current direction (3/4 circle with arrowhead)
      const arcR = loopR + 10
      const startAngle = lenzArcDir ? 0 : Math.PI * 2
      const endAngle   = lenzArcDir ? Math.PI * 1.75 : -Math.PI * 1.75
      ctx.beginPath()
      ctx.arc(cx, cy, arcR, startAngle, endAngle, !lenzArcDir)
      ctx.stroke()

      // Arrowhead at end of arc
      const arrowAngle = lenzArcDir ? Math.PI * 1.75 : -Math.PI * 1.75 + Math.PI * 2
      const ax = cx + arcR * Math.cos(arrowAngle)
      const ay = cy + arcR * Math.sin(arrowAngle)
      const tangentAngle = lenzArcDir ? arrowAngle + Math.PI / 2 : arrowAngle - Math.PI / 2
      ctx.beginPath()
      ctx.moveTo(ax, ay)
      ctx.lineTo(ax - 6 * Math.cos(tangentAngle - 0.4), ay - 6 * Math.sin(tangentAngle - 0.4))
      ctx.lineTo(ax - 6 * Math.cos(tangentAngle + 0.4), ay - 6 * Math.sin(tangentAngle + 0.4))
      ctx.closePath()
      ctx.fillStyle = lenzColor
      ctx.fill()

      // Label
      ctx.fillStyle = lenzColor
      ctx.font = `bold ${Math.max(10, scale * 0.025)}px sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText(lenzLabel, cx, cy - loopR - 20)
    }

    // =========================
    // ===== GALVANOMETER ======
    // =========================
    const gx = W * 0.8
    const gy = H * 0.4
    const r = scale * 0.08

    ctx.beginPath()
    ctx.arc(gx, gy, r, 0, Math.PI * 2)
    ctx.strokeStyle = primary
    ctx.stroke()

    const angle = Math.max(-1, Math.min(1, V * 0.01)) * (Math.PI / 4)

    ctx.save()
    ctx.translate(gx, gy)
    ctx.rotate(angle)

    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, -r + 5)
    ctx.strokeStyle = primary
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.restore()

    // =========================
    // ===== GRAPH ============
    // =========================
    if (isPlaying) {
      graphRef.current.push({ t: tRef.current, V })
      if (graphRef.current.length > 300) graphRef.current.shift()
    }

    const gx0 = W * 0.1
    const gy0 = H * 0.7
    const gw = W * 0.8
    const gh = H * 0.25

    ctx.strokeStyle = '#CAC4D0'
    ctx.beginPath()
    ctx.moveTo(gx0, gy0)
    ctx.lineTo(gx0, gy0 + gh)
    ctx.lineTo(gx0 + gw, gy0 + gh)
    ctx.stroke()

    ctx.strokeStyle = primary
    ctx.beginPath()

    graphRef.current.forEach((p, i) => {
      const xg = gx0 + (p.t / 5) * gw
      const yg = gy0 + gh / 2 - (p.V / 50) * (gh / 2)

      if (i === 0) ctx.moveTo(xg, yg)
      else ctx.lineTo(xg, yg)
    })

    ctx.stroke()

    // =========================
    // ===== INFO PANEL ========
    // =========================
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.beginPath()
    ctx.roundRect(W * 0.65, H * 0.05, scale * 0.3, scale * 0.18, 12)
    ctx.fill()

    ctx.strokeStyle = '#CAC4D0'
    ctx.stroke()

    ctx.fillStyle = primary
    ctx.font = `${font}px sans-serif`

    ctx.fillText(`V = ${V.toFixed(2)} V`, W * 0.67, H * 0.1)
    ctx.fillText(`Flux = ${flux.toFixed(3)}`, W * 0.67, H * 0.13)
    ctx.fillText(`Speed = ${speed}`, W * 0.67, H * 0.16)

  }, [N, speed, isPlaying])

  return (
    <CanvasEngine
      {...props}
      draw={draw}
      deps={[N, speed, isPlaying]}
      animated
    />
  )
}