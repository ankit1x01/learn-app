import { useCallback, useRef } from 'react'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'
import { SimProps } from '../../types'

/**
 * Mutual Inductance Simulation
 * Visualizes Faraday's Law through two coupled solenoids.
 */
export function MutualInductanceSim(props: SimProps) {
  const { controls, isPlaying } = props

  const f = controls?.f ?? 1
  const N1 = controls?.N1 ?? 200
  const N2 = controls?.N2 ?? 400
  const d_cm = controls?.dist ?? 10
  const V0 = 12 // Primary Amplitude

  const tRef = useRef(0)
  const graphPoints = useRef<{ t: number, I1: number, V2: number }[]>([])

  // Physically grounded mutual inductance
  // Coil geometry defaults: radius r = 0.05 m, length l = 0.1 m
  const mu0 = 4 * Math.PI * 1e-7          // H/m
  const r_coil = 0.05                      // 5 cm coil radius
  const l_coil = 0.1                       // 10 cm coil length
  const A_coil = Math.PI * r_coil * r_coil // Cross-section area m²
  const d_m = d_cm / 100                   // distance in metres
  // Coupling coefficient: k ∝ 1/(1+(d/r)³) — physical near-field decay
  const k = 1 / (1 + Math.pow(d_m / r_coil, 3))
  // M = μ₀ * N1 * N2 * A / l * k  (coaxial solenoid formula)
  const M = mu0 * N1 * N2 * A_coil / l_coil * k

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    const scale = Math.min(W, H)

    if (isPlaying) {
      tRef.current += dt
      if (tRef.current < 10) {
        const I1 = (V0 / 10) * Math.sin(2 * Math.PI * f * tRef.current)
        const dI1dt = (V0 / 10) * 2 * Math.PI * f * Math.cos(2 * Math.PI * f * tRef.current)
        const V2 = -M * dI1dt * 1000 // Multiplier for visibility

        if (graphPoints.current.length === 0 || tRef.current - graphPoints.current[graphPoints.current.length - 1].t > 0.03) {
          graphPoints.current.push({ t: tRef.current, I1, V2 })
        }
      }
    } else {
      tRef.current = 0
      graphPoints.current = []
    }

    const t = tRef.current
    const I1 = (V0 / 10) * Math.sin(2 * Math.PI * f * t)
    const V2 = -M * (V0 / 10) * 2 * Math.PI * f * Math.cos(2 * Math.PI * f * t) * 1000

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    const primary = '#6750A4'
    const secondary = '#B3261E'
    const blue = '#1E88E5'
    const fontSmall = Math.max(10, Math.round(scale * 0.025))

    // --- Coil Rendering ---
    const cx = W / 2, cy = H * 0.35
    const coilW = scale * 0.15, coilH = scale * 0.06
    const spacing = d_cm * scale * 0.005

    const pX = cx - spacing - coilW, sX = cx + spacing

    const drawCoil = (x: number, y: number, color: string, label: string) => {
      const loops = 10, lStep = coilW / loops
      ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.beginPath()
      ctx.moveTo(x, y)
      for (let i = 0; i < loops; i++) {
        ctx.bezierCurveTo(x + i * lStep + lStep, y - coilH, x + i * lStep + lStep, y + coilH, x + (i + 1) * lStep, y)
      }
      ctx.stroke()
      ctx.fillStyle = color; ctx.font = `bold ${fontSmall}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
      ctx.fillText(label, x + coilW / 2, y + coilH + 15)
    }

    drawCoil(pX, cy, primary, 'Primary (Source)')
    drawCoil(sX, cy, secondary, 'Secondary (Induced)')

    // --- Oscillating Flux Lines ---
    if (Math.abs(I1) > 0.01) {
      ctx.strokeStyle = `rgba(0, 97, 164, ${Math.abs(I1) * 0.5})`
      ctx.lineWidth = 1
      for (let j = 0; j < 5; j++) {
        const offY = (j - 2) * 12
        ctx.beginPath()
        ctx.moveTo(pX + coilW, cy + offY)
        ctx.quadraticCurveTo(cx, cy + offY - 40 * k, sX, cy + offY)
        ctx.stroke()
      }
    }

    // --- Oscilloscope Graph ---
    const gX = cx - scale * 0.4, gY = H * 0.85
    const gW = scale * 0.8, gH = scale * 0.3

    ctx.strokeStyle = '#CAC4D0'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(gX, gY - gH / 2); ctx.lineTo(gX + gW, gY - gH / 2) // Zero line
    ctx.moveTo(gX, gY - gH); ctx.lineTo(gX, gY); ctx.lineTo(gX + gW, gY); ctx.stroke()

    if (graphPoints.current.length > 1) {
      // Primary I (Blue)
      ctx.strokeStyle = blue; ctx.lineWidth = 2; ctx.beginPath()
      graphPoints.current.forEach((p, idx) => {
        const px = gX + (p.t / 4) * gW; const py = gY - gH / 2 - (p.I1 / 2) * gH
        if (idx === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py)
      }); ctx.stroke()

      // Secondary V (Red)
      ctx.strokeStyle = secondary; ctx.lineWidth = 2; ctx.beginPath()
      graphPoints.current.forEach((p, idx) => {
        const px = gX + (p.t / 4) * gW; const py = gY - gH / 2 - (p.V2 / 5) * gH
        if (idx === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py)
      }); ctx.stroke()
    }

    // Info Panel
    const panelW = scale * 0.3
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.beginPath(); ctx.roundRect(W - panelW - 20, 20, panelW, scale * 0.2, 12); ctx.fill()
    ctx.strokeStyle = '#CAC4D0'; ctx.lineWidth = 1; ctx.stroke()
    ctx.fillStyle = primary; ctx.textAlign = 'left'
    ctx.font = `bold ${Math.max(12, Math.round(scale * 0.035))}px 'Roboto', sans-serif`
    ctx.fillText(`V₂ (Induced): ${V2.toFixed(2)} V`, W - panelW + 5, 50)
    ctx.font = `${fontSmall}px 'Roboto', sans-serif`
    ctx.fillText(`Coupling k: ${k.toFixed(3)}`, W - panelW + 5, 75)
    const M_display = M * 1e6 >= 1 ? `${(M * 1e6).toFixed(2)} μH` : `${(M * 1e3).toFixed(4)} mH`
    ctx.fillText(`M: ${M_display}`, W - panelW + 5, 95)
    ctx.fillStyle = blue; ctx.fillText(`I₁ (Primary)`, W - panelW + 5, 100)
    ctx.fillStyle = secondary; ctx.fillText(`V₂ (Secondary)`, W - panelW + 5, 125)

  }, [f, N1, N2, d_cm, k, M, isPlaying])

  return <CanvasEngine {...props} draw={draw} deps={[f, N1, N2, d_cm, isPlaying]} animated />
}