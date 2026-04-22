import { useCallback, useEffect, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/** RC Circuit — capacitor charging/discharging with live V(t) graph */
export function RCCircuitSim(props: SimProps) {
  const { controls, isPlaying } = props
  const R   = controls['R']   ?? 1000  // Ω
  const C   = controls['C']   ?? 470e-6 // F
  const V0  = controls['V0']  ?? 9      // volts source

  const tau  = R * C  // time constant
  const timeRef = useRef(0)
  const histRef = useRef<number[]>([])
  const charging = useRef(true)

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    if (isPlaying) {
      timeRef.current += dt
      const t = timeRef.current
      const Vc = charging.current
        ? V0 * (1 - Math.exp(-t / tau))
        : V0 * Math.exp(-t / tau)
      histRef.current.push(Vc)
      if (histRef.current.length > 300) histRef.current.shift()
    }
    const t = timeRef.current
    const Vc = charging.current
      ? V0 * (1 - Math.exp(-t / tau))
      : V0 * Math.exp(-t / tau)
    const Ic = Math.abs((V0 - Vc) / R) // approx

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'; ctx.fillRect(0, 0, W, H)

    // ── Circuit diagram (top 38%) ──
    const cH = H * 0.36, cY = 12
    const cW = Math.min(W, H) * (0.86 * 1.5), cX = Math.min(W, H) * (0.07 * 1.5)

    // Wire outline (rectangle)
    ctx.strokeStyle = '#1C1B1F'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.rect(cX, cY, cW, cH); ctx.stroke()

    // Battery (left side)
    const batX = cX, batMid = cY + cH / 2
    ctx.strokeStyle = '#6750A4'; ctx.lineWidth = 3
    ctx.beginPath(); ctx.moveTo(batX - 8, batMid - 12); ctx.lineTo(batX - 8, batMid + 12); ctx.stroke()
    ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(batX - 8, batMid - 6); ctx.lineTo(batX - 8, batMid + 6); ctx.stroke()
    ctx.fillStyle = '#6750A4'; ctx.font = `bold ${Math.max(9, Math.round(Math.min(W, H) * (0.026 * 1.5)))}px 'Roboto', sans-serif`; ctx.textAlign = 'left'
    ctx.fillText(`${V0}V`, cX - 4, batMid - 16)

    // Resistor (top wire)
    const rX = cX + Math.min(W, H) * (0.3 * 1.5), rW = Math.min(W, H) * (0.2 * 1.5), rY = cY, rH = 14
    ctx.fillStyle = '#F59E0B'
    ctx.beginPath(); ctx.roundRect(rX, rY - rH / 2, rW, rH, 3); ctx.fill()
    ctx.fillStyle = '#1C1B1F'; ctx.textAlign = 'center'
    ctx.fillText(`R=${R}Ω`, rX + rW / 2, rY - rH / 2 - 4)

    // Capacitor (right side)
    const capX = cX + cW, capMid2 = cY + cH / 2
    ctx.strokeStyle = '#3B82F6'; ctx.lineWidth = 3
    ctx.beginPath(); ctx.moveTo(capX - 6, capMid2 - 14); ctx.lineTo(capX + 6, capMid2 - 14); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(capX - 6, capMid2 + 14); ctx.lineTo(capX + 6, capMid2 + 14); ctx.stroke()
    ctx.fillStyle = '#3B82F6'; ctx.font = `bold ${Math.max(9, Math.round(Math.min(W, H) * (0.026 * 1.5)))}px 'Roboto', sans-serif`
    ctx.fillText(`C=${(C * 1e6).toFixed(0)}µF`, capX + 14, capMid2)

    // Voltage display on capacitor
    ctx.fillStyle = '#F43F5E'; ctx.font = `bold ${Math.max(11, Math.round(Math.min(W, H) * (0.032 * 1.5)))}px 'Roboto', sans-serif`
    ctx.fillText(`V_C=${Vc.toFixed(2)}V`, capX + 10, cY + cH + 18)

    // τ label
    ctx.fillStyle = '#49454F'; ctx.font = `${Math.max(9, Math.round(Math.min(W, H) * (0.026 * 1.5)))}px 'Roboto', sans-serif`
    ctx.fillText(`τ = RC = ${(tau * 1000).toFixed(1)} ms`, W / 2, cY + cH + 36)

    // ── V(t) Graph ──
    const gX = Math.min(W, H) * (0.06 * 1.5), gY = H * 0.46, gW = Math.min(W, H) * (0.88 * 1.5), gH = H * 0.46

    ctx.fillStyle = '#F4EFF4'
    ctx.beginPath(); ctx.roundRect(gX, gY, gW, gH, 8); ctx.fill()

    // Axes
    ctx.strokeStyle = '#CAC4D0'; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(gX + 8, gY + gH - 8); ctx.lineTo(gX + gW - 4, gY + gH - 8); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(gX + 8, gY + gH - 8); ctx.lineTo(gX + 8, gY + 6); ctx.stroke()

    const fs2 = Math.max(9, Math.round(Math.min(W, H) * (0.026 * 1.5)))
    ctx.fillStyle = '#49454F'; ctx.font = `${fs2}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText('Time →', gX + gW / 2, gY + gH + 12)
    ctx.save(); ctx.translate(gX - 4, gY + gH / 2); ctx.rotate(-Math.PI / 2)
    ctx.fillText('V_C (V)', 0, 0); ctx.restore()

    // τ vertical line
    const tau3 = 3 * tau
    const tauX = gX + 8 + (Math.min(1, tau / tau3)) * (gW - 12)
    ctx.strokeStyle = '#F59E0B60'; ctx.lineWidth = 1; ctx.setLineDash([3, 3])
    ctx.beginPath(); ctx.moveTo(tauX, gY + gH - 8); ctx.lineTo(tauX, gY + 8); ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = '#F59E0B'; ctx.font = `${fs2}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText('τ', tauX, gY + 14)

    // V0 dashed line
    const v0Y = gY + gH - 8 - (V0 / V0) * (gH - 20)
    ctx.strokeStyle = '#6750A430'; ctx.lineWidth = 1; ctx.setLineDash([4, 3])
    ctx.beginPath(); ctx.moveTo(gX + 8, v0Y); ctx.lineTo(gX + gW - 4, v0Y); ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = '#6750A4'; ctx.font = `${fs2}px 'Roboto', sans-serif`; ctx.textAlign = 'right'
    ctx.fillText(`${V0}V`, gX + gW - 4, v0Y - 3)

    // Plot
    if (histRef.current.length > 1) {
      ctx.strokeStyle = '#F43F5E'; ctx.lineWidth = 2
      ctx.beginPath()
      histRef.current.forEach((v, i) => {
        const px2 = gX + 8 + (i / 300) * (gW - 12)
        const py2 = gY + gH - 8 - (v / V0) * (gH - 20)
        i === 0 ? ctx.moveTo(px2, py2) : ctx.lineTo(px2, py2)
      })
      ctx.stroke()
    }

    // I label
    ctx.fillStyle = '#10B981'; ctx.font = `bold ${fs2}px 'Roboto', sans-serif`; ctx.textAlign = 'left'
    ctx.fillText(`I = ${(Ic * 1000).toFixed(2)} mA`, gX + 12, gY + 22)
  }, [R, C, V0, tau, isPlaying, charging])

  useEffect(() => {
    timeRef.current = 0
    histRef.current = []
  }, [R, C, V0])

  return <CanvasEngine {...props} draw={draw} deps={[R, C, V0, isPlaying]} animated />
}
