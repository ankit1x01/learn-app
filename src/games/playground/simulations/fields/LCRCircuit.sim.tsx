import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/** LCR Circuit — resonance curve with animated current phasor */
export function LCRCircuitSim(props: SimProps) {
  const { controls, isPlaying } = props
  const L   = controls['L']   ?? 0.1     // H
  const C2  = controls['C']   ?? 100e-6  // F
  const R2  = controls['R']   ?? 10      // Ω
  const V0  = controls['V0']  ?? 10      // V peak

  const omega0 = 1 / Math.sqrt(L * C2)   // resonance angular freq
  const f0     = omega0 / (2 * Math.PI)   // Hz
  const Q_fac  = (1 / R2) * Math.sqrt(L / C2)  // quality factor

  const phaseRef = useRef(0)

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    if (isPlaying) phaseRef.current += 2 * Math.PI * f0 * dt * 0.5

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'; ctx.fillRect(0, 0, W, H)

    const fs = Math.max(9, Math.round(Math.min(W, H) * (0.026 * 1.5)))

    // ── Left: Resonance curve ──
    const gX = Math.min(W, H) * (0.06 * 1.5), gY = H * 0.08, gW = Math.min(W, H) * (0.52 * 1.5), gH = H * 0.74
    ctx.fillStyle = '#F4EFF4'
    ctx.beginPath(); ctx.roundRect(gX, gY, gW, gH, 8); ctx.fill()

    // Axes
    ctx.strokeStyle = '#CAC4D0'; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(gX + 8, gY + gH - 8); ctx.lineTo(gX + gW - 4, gY + gH - 8); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(gX + 8, gY + gH - 8); ctx.lineTo(gX + 8, gY + 8); ctx.stroke()
    ctx.fillStyle = '#49454F'; ctx.font = `${fs}px 'Roboto', sans-serif`
    ctx.textAlign = 'center'; ctx.fillText('Frequency f (Hz)', gX + gW / 2, gY + gH + 12)
    ctx.save(); ctx.translate(gX - 4, gY + gH / 2); ctx.rotate(-Math.PI / 2)
    ctx.fillText('Current I (A)', 0, 0); ctx.restore()

    // Resonance curve Z = sqrt(R²+(ωL-1/ωC)²), I=V/Z
    const fMin = f0 * 0.2, fMax = f0 * 3
    let Imax2 = V0 / R2
    ctx.strokeStyle = '#6750A4'; ctx.lineWidth = 2.5
    ctx.beginPath()
    for (let i = 0; i <= 200; i++) {
      const f = fMin + (fMax - fMin) * i / 200
      const w = 2 * Math.PI * f
      const Z = Math.sqrt(R2 * R2 + Math.pow(w * L - 1 / (w * C2), 2))
      const I = V0 / Z
      const gx2 = gX + 8 + ((f - fMin) / (fMax - fMin)) * (gW - 12)
      const gy2 = gY + gH - 8 - (I / Imax2) * (gH - 20)
      i === 0 ? ctx.moveTo(gx2, gy2) : ctx.lineTo(gx2, gy2)
    }
    ctx.stroke()

    // f0 dashed line
    const f0X = gX + 8 + ((f0 - fMin) / (fMax - fMin)) * (gW - 12)
    ctx.strokeStyle = '#F43F5E'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3])
    ctx.beginPath(); ctx.moveTo(f0X, gY + gH - 8); ctx.lineTo(f0X, gY + 8); ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = '#F43F5E'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(`f₀=${f0.toFixed(1)}Hz`, f0X, gY + 18)

    // ── Right: Info panel ──
    const px = gX + gW + 14, pw = W - px - 8, py = gY
    const rows = [
      { l: 'L',    v: `${(L * 1000).toFixed(0)} mH`     },
      { l: 'C',    v: `${(C2 * 1e6).toFixed(0)} µF`      },
      { l: 'R',    v: `${R2} Ω`                           },
      { l: 'f₀',   v: `${f0.toFixed(1)} Hz`              },
      { l: 'Q',    v: `${Q_fac.toFixed(1)}`               },
      { l: 'I_max',v: `${Imax2.toFixed(2)} A`             },
    ]
    ctx.fillStyle = '#EADDFF'
    ctx.beginPath(); ctx.roundRect(px, py, pw, rows.length * (fs + 8) + 14, 10); ctx.fill()
    rows.forEach(({ l, v }, i) => {
      const ry = py + 12 + i * (fs + 8) + fs * 0.85
      ctx.fillStyle = '#49454F'; ctx.font = `${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'left'; ctx.fillText(l, px + 8, ry)
      ctx.fillStyle = '#6750A4'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'right'; ctx.fillText(v, px + pw - 6, ry)
    })

    // ── Phasor / Impedance vector diagram ──
    // Compute impedance components at resonance frequency ω₀
    const phasW = pw - 8, phasH = gH * 0.46
    const phasX = px, phasY = gY + rows.length * (fs + 8) + 24
    ctx.fillStyle = '#F4EFF4'
    ctx.beginPath(); ctx.roundRect(phasX, phasY, phasW, phasH, 8); ctx.fill()

    ctx.fillStyle = '#49454F'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText('Phasor Diagram', phasX + phasW / 2, phasY + fs + 2)

    // Origin at centre of the box
    const pcx = phasX + phasW / 2, pcy = phasY + phasH * 0.55
    // Scale: map max(R, X_L, X_C) → ~38% of half-box-width
    const XL  = omega0 * L          // inductive reactance Ω
    const XC  = 1 / (omega0 * C2)   // capacitive reactance Ω
    const Xnet = XL - XC            // net reactance
    const Ztot = Math.sqrt(R2 * R2 + Xnet * Xnet)
    const maxVal = Math.max(R2, XL, XC, Ztot, 1e-9)
    const scale2 = Math.min(phasW * 0.38, phasH * 0.38) / maxVal

    // Helper: draw arrow with filled arrowhead
    const drawArrow = (x1: number, y1: number, x2: number, y2: number, color: string) => {
      const dx = x2 - x1, dy = y2 - y1
      const len = Math.sqrt(dx * dx + dy * dy)
      if (len < 1) return
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.fillStyle = color
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
      // arrowhead
      const ux = dx / len, uy = dy / len
      const hlen = Math.min(7, len * 0.35)
      ctx.beginPath()
      ctx.moveTo(x2, y2)
      ctx.lineTo(x2 - hlen * (ux - 0.45 * uy), y2 - hlen * (uy + 0.45 * ux))
      ctx.lineTo(x2 - hlen * (ux + 0.45 * uy), y2 - hlen * (uy - 0.45 * ux))
      ctx.closePath(); ctx.fill()
    }

    // V_R: horizontal right, proportional to R (blue)
    const vrX = pcx + R2  * scale2, vrY = pcy
    // V_L: vertical up from tip of V_R, proportional to X_L (red)
    const vlX = vrX,                vlY = pcy - XL * scale2
    // V_C: vertical down from tip of V_R, proportional to X_C (green)
    const vcX = vrX,                vcY = pcy + XC * scale2
    // V_total: from origin to (V_R + V_net) diagonal (white/primary)
    const vtX = pcx + R2  * scale2, vtY = pcy - Xnet * scale2

    // Draw axes (dashed reference)
    ctx.strokeStyle = '#CAC4D0'; ctx.lineWidth = 1; ctx.setLineDash([3, 3])
    ctx.beginPath(); ctx.moveTo(phasX + 6, pcy); ctx.lineTo(phasX + phasW - 6, pcy); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(pcx, phasY + fs + 8); ctx.lineTo(pcx, phasY + phasH - 4); ctx.stroke()
    ctx.setLineDash([])

    // V_R arrow (blue)
    drawArrow(pcx, pcy, vrX, vrY, '#1E88E5')
    ctx.fillStyle = '#1E88E5'; ctx.font = `${fs - 1}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText('V_R', (pcx + vrX) / 2, pcy - 5)

    // V_L arrow — from tip of V_R upward (red)
    drawArrow(vrX, pcy, vlX, vlY, '#B3261E')
    ctx.fillStyle = '#B3261E'; ctx.font = `${fs - 1}px 'Roboto', sans-serif`; ctx.textAlign = 'left'
    ctx.fillText('V_L', vlX + 4, (pcy + vlY) / 2)

    // V_C arrow — from tip of V_R downward (green)
    drawArrow(vrX, pcy, vcX, vcY, '#2E7D32')
    ctx.fillStyle = '#2E7D32'; ctx.font = `${fs - 1}px 'Roboto', sans-serif`; ctx.textAlign = 'left'
    ctx.fillText('V_C', vcX + 4, (pcy + vcY) / 2)

    // V_total arrow — origin to resultant tip (primary purple)
    drawArrow(pcx, pcy, vtX, vtY, '#6750A4')
    ctx.fillStyle = '#6750A4'; ctx.font = `bold ${fs - 1}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    const labelOff = vtY < pcy ? -6 : 6
    ctx.fillText('V', vtX + 6, vtY + labelOff)

    // Phase angle arc label
    const phiAngle = Math.atan2(-(Xnet * scale2), R2 * scale2)
    if (Math.abs(phiAngle) > 0.05) {
      ctx.strokeStyle = '#6750A4'; ctx.lineWidth = 1; ctx.setLineDash([2, 2])
      ctx.beginPath(); ctx.arc(pcx, pcy, R2 * scale2 * 0.35, 0, phiAngle, phiAngle > 0); ctx.stroke()
      ctx.setLineDash([])
    }
    ctx.fillStyle = '#49454F'; ctx.font = `${fs - 1}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(`φ=${(Math.atan2(Xnet, R2) * 180 / Math.PI).toFixed(1)}°`, phasX + phasW / 2, phasY + phasH - 4)

    ctx.fillStyle = '#EADDFF'
    ctx.beginPath(); ctx.roundRect(8, H - 30, W - 16, 24, 6); ctx.fill()
    ctx.fillStyle = '#21005D'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(`ω₀ = 1/√(LC) = ${omega0.toFixed(1)} rad/s  |  Q = ${Q_fac.toFixed(1)}`, W / 2, H - 14)
  }, [L, C2, R2, V0, omega0, f0, Q_fac, isPlaying])

  return <CanvasEngine {...props} draw={draw} deps={[L, C2, R2, V0, isPlaying]} animated />
}
