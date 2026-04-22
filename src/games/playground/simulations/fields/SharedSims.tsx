/**
 * Remaining simulations — each is a standalone canvas-based interactive.
 * They all follow the SimProps → CanvasEngine pattern.
 */
import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

// ──────────────────────────────────────────────────────
// Current Electricity (Ohm's Law + Series/Parallel)
// ──────────────────────────────────────────────────────
export function CurrentElectricitySim(props: SimProps) {
  const { controls } = props
  const V  = controls['V']  ?? 12
  const R1 = controls['R1'] ?? 4
  const R2 = controls['R2'] ?? 6
  const R3 = controls['R3'] ?? 8
  const mode = Math.round(controls['mode'] ?? 0) // 0=series, 1=parallel

  const R_eff = mode === 0
    ? R1 + R2 + R3
    : 1 / (1/R1 + 1/R2 + 1/R3)
  const I_total = V / R_eff

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H) => {
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'; ctx.fillRect(0, 0, W, H)
    const fs = Math.max(10, Math.round(Math.min(W, H) * (0.028 * 1.5)))

    const modeStr = mode === 0 ? 'Series' : 'Parallel'
    ctx.fillStyle = '#6750A4'; ctx.font = `bold ${fs + 4}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(`${modeStr} Circuit`, W / 2, 32)

    // Draw simple circuit schematic
    const cx = W / 2, wireY = H * 0.4
    const boxW = 52, boxH = 28

    if (mode === 0) {
      // Series
      const positions = [cx - 120, cx, cx + 120]
      const Rs = [R1, R2, R3]
      positions.forEach((px2, i) => {
        ctx.fillStyle = '#F59E0B'
        ctx.beginPath(); ctx.roundRect(px2 - boxW/2, wireY - boxH/2, boxW, boxH, 4); ctx.fill()
        ctx.fillStyle = '#1C1B1F'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
        ctx.fillText(`R${i+1}=${Rs[i]}Ω`, px2, wireY + 4)
        // wires
        if (i < 2) {
          ctx.strokeStyle = '#1C1B1F'; ctx.lineWidth = 2
          ctx.beginPath(); ctx.moveTo(px2 + boxW/2, wireY); ctx.lineTo(positions[i+1] - boxW/2, wireY); ctx.stroke()
        }
      })
      ctx.strokeStyle = '#1C1B1F'; ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(positions[0] - boxW/2 - 20, wireY)
      ctx.lineTo(positions[0] - boxW/2, wireY)
      ctx.moveTo(positions[2] + boxW/2, wireY)
      ctx.lineTo(positions[2] + boxW/2 + 20, wireY)
      ctx.stroke()
    } else {
      // Parallel
      const wireTop = wireY - 50, wireBot = wireY + 50
      const Rs = [R1, R2, R3], xs = [-80, 0, 80]
      ctx.strokeStyle = '#1C1B1F'; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(cx - 140, wireTop); ctx.lineTo(cx + 140, wireTop); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx - 140, wireBot); ctx.lineTo(cx + 140, wireBot); ctx.stroke()
      xs.forEach((off, i) => {
        const px2 = cx + off
        ctx.strokeStyle = '#1C1B1F'; ctx.lineWidth = 2
        ctx.beginPath(); ctx.moveTo(px2, wireTop); ctx.lineTo(px2, wireTop + 12); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(px2, wireBot - 12); ctx.lineTo(px2, wireBot); ctx.stroke()
        ctx.fillStyle = '#F59E0B'
        ctx.beginPath(); ctx.roundRect(px2 - boxW/2, wireTop + 12, boxW, wireBot - wireTop - 24, 4); ctx.fill()
        ctx.fillStyle = '#1C1B1F'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
        ctx.fillText(`${Rs[i]}Ω`, px2, (wireTop + wireBot) / 2 + 4)
      })
    }

    // Battery
    ctx.fillStyle = '#6750A4'; ctx.font = `bold ${fs + 1}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(`⚡ ${V}V`, Math.min(W, H) * (0.12 * 1.5), wireY + 4)

    // Info
    const rows = [
      { l: mode === 0 ? 'R_eff = R1+R2+R3' : '1/R_eff = Σ(1/Rᵢ)',  v: `${R_eff.toFixed(2)} Ω` },
      { l: 'V',     v: `${V} V`                  },
      { l: 'I',     v: `${I_total.toFixed(3)} A` },
      { l: 'P',     v: `${(V * I_total).toFixed(2)} W` },
    ]
    ctx.fillStyle = '#EADDFF'
    ctx.beginPath(); ctx.roundRect(Math.min(W, H) * (0.06 * 1.5), H * 0.68, Math.min(W, H) * (0.88 * 1.5), rows.length * (fs + 8) + 14, 10); ctx.fill()
    rows.forEach(({ l, v }, i) => {
      const ry = H * 0.68 + 12 + i * (fs + 8) + fs * 0.85
      ctx.fillStyle = '#49454F'; ctx.font = `${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'left'; ctx.fillText(l, Math.min(W, H) * (0.1 * 1.5), ry)
      ctx.fillStyle = '#6750A4'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'right'; ctx.fillText(v, Math.min(W, H) * (0.9 * 1.5), ry)
    })
  }, [V, R1, R2, R3, mode, R_eff, I_total])

  return <CanvasEngine {...props} draw={draw} deps={[V, R1, R2, R3, mode]} />
}

// ──────────────────────────────────────────────────────
// Magnetic Force (F = qv×B)
// ──────────────────────────────────────────────────────
export function MagneticForceSim(props: SimProps) {
  const { controls } = props
  const q  = controls['q']  ?? 1.6e-19  // C
  const v2 = controls['v']  ?? 1e6      // m/s
  const B  = controls['B']  ?? 0.5      // T
  const theta = controls['theta'] ?? 90 // degrees

  const rad = theta * Math.PI / 180
  const F   = Math.abs(q) * v2 * B * Math.sin(rad)

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H) => {
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'; ctx.fillRect(0, 0, W, H)
    const fs = Math.max(10, Math.round(Math.min(W, H) * (0.028 * 1.5)))
    const cx = W / 2, cy = H / 2 - 20

    // B field dots (out of page)
    ctx.fillStyle = '#1D4ED820'
    for (let ix = 0; ix < 7; ix++) for (let iy = 0; iy < 5; iy++) {
      const bx = Math.min(W, H) * (0.06 * 1.5) + ix * Math.min(W, H) * (0.13 * 1.5), by = H * 0.1 + iy * H * 0.18
      ctx.fillStyle = '#1D4ED840'
      ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#60A5FA80'; ctx.font = `${Math.max(8, fs)}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
      ctx.fillText('•', bx, by + 4)
    }
    ctx.fillStyle = '#60A5FA'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'right'
    ctx.fillText(`B=${B}T (out of page)`, W - 8, 18)

    // Charge + velocity arrow
    ctx.fillStyle = '#F43F5E'
    ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#FFF'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(q > 0 ? '+' : '−', cx, cy + 4)

    const vAngle = rad
    const vLen = 60
    ctx.strokeStyle = '#F43F5E'; ctx.lineWidth = 2.5
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + vLen * Math.cos(vAngle), cy - vLen * Math.sin(vAngle)); ctx.stroke()
    ctx.fillStyle = '#F43F5E'; ctx.font = `${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'left'
    ctx.fillText(`v=${(v2/1e6).toFixed(1)}×10⁶`, cx + vLen * Math.cos(vAngle) + 4, cy - vLen * Math.sin(vAngle))

    // Force arrow (perpendicular, using F = qv×B direction)
    const fAngle = vAngle + Math.PI / 2 * (q > 0 ? 1 : -1)
    const fLen   = Math.min(80, F * 5e14)
    ctx.strokeStyle = '#10B981'; ctx.lineWidth = 2.5
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + fLen * Math.cos(fAngle), cy - fLen * Math.sin(fAngle)); ctx.stroke()
    ctx.fillStyle = '#10B981'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(`F=${F.toExponential(2)}N`, cx + fLen * Math.cos(fAngle), cy - fLen * Math.sin(fAngle) - 8)

    ctx.fillStyle = '#EADDFF'
    ctx.beginPath(); ctx.roundRect(8, H - 28, W - 16, 22, 6); ctx.fill()
    ctx.fillStyle = '#21005D'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(`F = qvBsinθ = ${F.toExponential(3)} N  |  θ = ${theta}°`, W / 2, H - 12)
  }, [q, v2, B, theta, F])

  return <CanvasEngine {...props} draw={draw} deps={[q, v2, B, theta]} />
}

// ──────────────────────────────────────────────────────
// Wave Superposition
// ──────────────────────────────────────────────────────
export function WaveSuperpositionSim(props: SimProps) {
  const { controls, isPlaying } = props
  const A1  = controls['A1'] ?? 1, A2 = controls['A2'] ?? 0.8
  const f1  = controls['f1'] ?? 2,  f2 = controls['f2'] ?? 3
  const phi = controls['phi'] ?? 0   // phase diff radians×10 (display unit)

  const phiRad = phi * Math.PI / 10
  const timeRef = useRef(0)

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    if (isPlaying) timeRef.current += dt * 0.5
    const t = timeRef.current

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'; ctx.fillRect(0, 0, W, H)
    const padX = 20, gH = (H - 60) / 3 - 8, fs = Math.max(10, Math.round(Math.min(W, H) * (0.026 * 1.5)))

    const waves = [
      { fn: (x: number) => A1 * Math.sin(2 * Math.PI * f1 * x - t), color: '#6750A4', label: `y₁ A=${A1} f=${f1}` },
      { fn: (x: number) => A2 * Math.sin(2 * Math.PI * f2 * x - t + phiRad), color: '#F43F5E', label: `y₂ A=${A2} f=${f2}` },
      { fn: (x: number) => A1 * Math.sin(2 * Math.PI * f1 * x - t) + A2 * Math.sin(2 * Math.PI * f2 * x - t + phiRad),
        color: '#10B981', label: 'y₁ + y₂ (resultant)' },
    ]
    const Amax = A1 + A2 + 0.01

    waves.forEach(({ fn, color, label }, ri) => {
      const gY = 28 + ri * (gH + 12)
      const mid = gY + gH / 2
      ctx.fillStyle = '#F4EFF4'; ctx.beginPath(); ctx.roundRect(padX, gY, W - padX * 2, gH, 6); ctx.fill()
      ctx.strokeStyle = color; ctx.lineWidth = 2
      ctx.beginPath()
      for (let i = 0; i <= 400; i++) {
        const x = i / 400
        const px2 = padX + x * (W - padX * 2)
        const py2 = mid - (fn(x) / Amax) * (gH / 2 - 4)
        i === 0 ? ctx.moveTo(px2, py2) : ctx.lineTo(px2, py2)
      }
      ctx.stroke()
      ctx.fillStyle = color; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'left'
      ctx.fillText(label, padX + 6, gY + 14)
    })
    ctx.fillStyle = '#EADDFF'
    ctx.beginPath(); ctx.roundRect(8, H - 28, W - 16, 22, 6); ctx.fill()
    ctx.fillStyle = '#21005D'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(`Principle of Superposition  |  φ = ${(phiRad * 180 / Math.PI).toFixed(0)}°`, W / 2, H - 12)
  }, [A1, A2, f1, f2, phiRad, isPlaying])

  timeRef.current = 0
  return <CanvasEngine {...props} draw={draw} deps={[A1, A2, f1, f2, phi, isPlaying]} animated />
}

// ──────────────────────────────────────────────────────
// Prism Dispersion
// ──────────────────────────────────────────────────────
export function PrismSim(props: SimProps) {
  const { controls } = props
  const n_glass = controls['n'] ?? 1.5   // refractive index
  const angle_A = controls['A'] ?? 60   // prism apex angle degrees

  const rad_A = angle_A * Math.PI / 180
  // Minimum deviation: D_min = 2*arcsin(n*sin(A/2)) - A
  const sinDm = n_glass * Math.sin(rad_A / 2)
  const D_min = sinDm <= 1 ? (2 * Math.asin(sinDm) - rad_A) * 180 / Math.PI : NaN

  const COLORS = ['#EF4444','#F97316','#EAB308','#22C55E','#3B82F6','#8B5CF6','#EC4899']
  const lambdas = [700, 620, 580, 530, 470, 430, 380]

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H) => {
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#0D1117'; ctx.fillRect(0, 0, W, H)
    const fs = Math.max(10, Math.round(Math.min(W, H) * (0.026 * 1.5)))

    // Prism
    const px = Math.min(W, H) * (0.42 * 1.5), py = H * 0.12
    const pw = Math.min(W, H) * (0.28 * 1.5), ph = H * 0.72
    const apex = { x: px + pw / 2, y: py }
    const bL   = { x: px,          y: py + ph }
    const bR   = { x: px + pw,     y: py + ph }

    const prismGrad = ctx.createLinearGradient(px, py, px + pw, py + ph)
    prismGrad.addColorStop(0, '#1E293B90')
    prismGrad.addColorStop(1, '#334155A0')
    ctx.fillStyle = prismGrad
    ctx.beginPath(); ctx.moveTo(apex.x, apex.y); ctx.lineTo(bL.x, bL.y); ctx.lineTo(bR.x, bR.y); ctx.closePath(); ctx.fill()
    ctx.strokeStyle = '#94A3B8'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(apex.x, apex.y); ctx.lineTo(bL.x, bL.y); ctx.lineTo(bR.x, bR.y); ctx.closePath(); ctx.stroke()

    // Incident white ray
    const inY = py + ph * 0.5
    const inX1 = px * 0.6, inX2 = px + pw * 0.2
    ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 3
    ctx.beginPath(); ctx.moveTo(inX1, inY); ctx.lineTo(inX2, inY); ctx.stroke()

    // Dispersed rays
    const refX = px + pw * 0.8
    COLORS.forEach((color, i) => {
      const lam = lambdas[i]
      // Cauchy dispersion: n(λ) ≈ n_glass + 0.01*(700-λ)/300
      const ni  = n_glass + 0.015 * (700 - lam) / 300
      const sinOut = ni * Math.sin(Math.PI / 6)
      const thetaOut = sinOut <= 1 ? Math.asin(sinOut) : Math.PI / 3
      const angle = thetaOut + (i - 3) * 0.04
      const len = Math.min(W, H) * (0.22 * 1.5)
      ctx.strokeStyle = color; ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(refX, inY)
      ctx.lineTo(refX + len * Math.cos(angle), inY + len * Math.sin(angle) - (i - 3) * 4)
      ctx.stroke()
    })

    // Info
    ctx.fillStyle = '#13202F'
    ctx.beginPath(); ctx.roundRect(8, 8, 175, 56, 8); ctx.fill()
    ctx.fillStyle = '#E6EDF3'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'left'
    ctx.fillText(`n = ${n_glass.toFixed(2)}  |  A = ${angle_A}°`, 14, 28)
    ctx.fillText(`D_min ≈ ${isNaN(D_min) ? 'N/A' : D_min.toFixed(1) + '°'}`, 14, 48)
    ctx.fillStyle = '#8B949E'; ctx.font = `${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText('White light dispersed by prism (VIBGYOR)', W / 2, H - 10)
  }, [n_glass, angle_A, D_min])

  return <CanvasEngine {...props} draw={draw} deps={[n_glass, angle_A]} />
}
