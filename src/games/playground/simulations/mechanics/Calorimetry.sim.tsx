import { useCallback } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/** Calorimetry — two objects reach thermal equilibrium; shows final T and heat exchanged */
export function CalorimetrySim(props: SimProps) {
  const { controls } = props
  const m1 = controls['m1'] ?? 0.5    // kg
  const T1 = controls['T1'] ?? 80     // °C  (hot)
  const c1 = controls['c1'] ?? 4200   // J/(kg·K) water
  const m2 = controls['m2'] ?? 1.0    // kg
  const T2 = controls['T2'] ?? 20     // °C  (cold)
  const c2 = controls['c2'] ?? 900    // J/(kg·K) aluminium

  // T_final = (m1c1T1 + m2c2T2)/(m1c1 + m2c2)
  const T_f = (m1 * c1 * T1 + m2 * c2 * T2) / (m1 * c1 + m2 * c2)
  const Q   = m1 * c1 * (T1 - T_f)   // heat lost by body 1

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H) => {
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'; ctx.fillRect(0, 0, W, H)

    const fs = Math.max(10, Math.round(Math.min(W, H) * (0.03 * 1.5)))
    const pad = Math.min(W, H) * (0.07 * 1.5)

    // Thermometer helper
    const drawThermometer = (cx: number, cy: number, T_now: number, label: string, color: string) => {
      const tubeH = H * 0.42, tubeW = 16, bulbR = 14
      const minT = 0, maxT = 100
      const fillFrac = Math.max(0, Math.min(1, (T_now - minT) / (maxT - minT)))
      const fillH = fillFrac * tubeH

      // Tube outline
      ctx.strokeStyle = '#1C1B1F'; ctx.lineWidth = 2
      ctx.beginPath(); ctx.roundRect(cx - tubeW / 2, cy - tubeH, tubeW, tubeH, tubeW / 2); ctx.stroke()
      // Fill
      ctx.fillStyle = color
      ctx.beginPath(); ctx.roundRect(cx - tubeW / 2 + 3, cy - fillH + 2, tubeW - 6, fillH, tubeW / 2 - 3); ctx.fill()
      // Bulb
      const bulbGrad = ctx.createRadialGradient(cx, cy + bulbR * 0.3, 0, cx, cy, bulbR)
      bulbGrad.addColorStop(0, color + 'cc')
      bulbGrad.addColorStop(1, color)
      ctx.fillStyle = bulbGrad
      ctx.beginPath(); ctx.arc(cx, cy, bulbR, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = '#1C1B1F'; ctx.lineWidth = 2
      ctx.beginPath(); ctx.arc(cx, cy, bulbR, 0, Math.PI * 2); ctx.stroke()

      // T label
      ctx.fillStyle = '#1C1B1F'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
      ctx.fillText(label, cx, cy + bulbR + fs + 4)
      ctx.fillStyle = color; ctx.font = `bold ${Math.round(fs * 1.1)}px 'Roboto', sans-serif`
      ctx.fillText(`${T_now.toFixed(1)}°C`, cx, cy - tubeH - 8)

      // Tick marks
      for (let i = 0; i <= 4; i++) {
        const ty = cy - (i / 4) * tubeH
        const tv = (i / 4) * 100
        ctx.strokeStyle = '#CAC4D0'; ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(cx + tubeW / 2, ty); ctx.lineTo(cx + tubeW / 2 + 6, ty); ctx.stroke()
        ctx.fillStyle = '#79747E'; ctx.font = `${Math.max(8, fs - 2)}px 'Roboto', sans-serif`; ctx.textAlign = 'left'
        ctx.fillText(`${tv}°`, cx + tubeW / 2 + 8, ty + 4)
      }
    }

    const cx1 = Math.min(W, H) * (0.22 * 1.5), cx2 = Math.min(W, H) * (0.78 * 1.5), midX = W / 2
    const baseY = H * 0.72

    drawThermometer(cx1, baseY, T1, `Body 1  m=${m1}kg`, '#F43F5E')
    drawThermometer(cx2, baseY, T2, `Body 2  m=${m2}kg`, '#3B82F6')

    // Equilibrium arrow
    ctx.strokeStyle = '#6750A4'; ctx.lineWidth = 2.5
    ctx.beginPath(); ctx.moveTo(cx1 + 20, baseY - H * 0.2); ctx.lineTo(cx2 - 20, baseY - H * 0.2); ctx.stroke()
    // Arrowhead
    ctx.fillStyle = '#6750A4'
    ctx.beginPath(); ctx.moveTo(cx2 - 20, baseY - H * 0.2)
    ctx.lineTo(cx2 - 32, baseY - H * 0.2 - 6); ctx.lineTo(cx2 - 32, baseY - H * 0.2 + 6); ctx.closePath(); ctx.fill()
    ctx.fillStyle = '#6750A4'; ctx.font = `${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(`Heat Q = ${Q.toFixed(1)} J`, midX, baseY - H * 0.2 - 10)

    // Final T panel
    ctx.fillStyle = '#EADDFF'
    ctx.beginPath(); ctx.roundRect(pad, H * 0.82, W - pad * 2, H * 0.14, 10); ctx.fill()
    ctx.fillStyle = '#21005D'; ctx.font = `bold ${Math.round(fs * 1.1)}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(`T_final = (m₁c₁T₁ + m₂c₂T₂) / (m₁c₁ + m₂c₂) = ${T_f.toFixed(2)}°C`, W / 2, H * 0.82 + H * 0.08)
  }, [m1, T1, c1, m2, T2, c2, T_f, Q])

  return <CanvasEngine {...props} draw={draw} deps={[m1, T1, c1, m2, T2, c2]} />
}
