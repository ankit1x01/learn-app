import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/** Carnot Cycle — animated PV diagram showing all 4 strokes and live efficiency readout */
export function CarnotCycleSim(props: SimProps) {
  const { controls, isPlaying } = props
  const T_H = controls['T_H'] ?? 600   // Hot reservoir K
  const T_C = controls['T_C'] ?? 300   // Cold reservoir K

  const efficiency = 1 - T_C / T_H
  const phaseRef   = useRef(0)

  // Cycle params (in reduced units)
  const V1 = 0.010, V2 = 0.022, V3 = 0.045, V4 = 0.020
  const P1 = 400000, gamma = 1.4
  const R = 8.314, n = 1
  const P2 = P1 * Math.pow(V1 / V2, gamma)
  const P3 = n * R * T_C / V3
  const P4 = P3 * Math.pow(V3 / V4, gamma)

  const V_MIN = 0.005, V_MAX = 0.055, P_MIN = 0, P_MAX = 500000

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    if (isPlaying) phaseRef.current = (phaseRef.current + dt * 0.4) % 1
    const phase = phaseRef.current

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'; ctx.fillRect(0, 0, W, H)

    const padL = 60, padB = 52, padT = 36, padR = 20
    const gW = W - padL - padR, gH = H - padT - padB
    const ox = padL, oy = H - padB

    const toX = (v: number) => ox + ((v - V_MIN) / (V_MAX - V_MIN)) * gW
    const toY = (p: number) => oy - ((p - P_MIN) / (P_MAX - P_MIN)) * gH

    // Axes
    ctx.strokeStyle = '#1C1B1F'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + gW, oy); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox, oy - gH); ctx.stroke()

    const fs = Math.max(9, Math.round(Math.min(W, H) * (0.026 * 1.5)))
    ctx.fillStyle = '#49454F'; ctx.font = `${fs}px 'Roboto', sans-serif`
    ctx.textAlign = 'center'; ctx.fillText('Volume V (m³)', ox + gW / 2, oy + 38)
    ctx.save(); ctx.translate(14, oy - gH / 2); ctx.rotate(-Math.PI / 2)
    ctx.fillText('Pressure P (Pa)', 0, 0); ctx.restore()

    const strokes = [
      { label: '1→2 Isothermal Expansion (T_H)', color: '#F43F5E',
        pts: (t: number) => { const v = V1 + (V2 - V1) * t; return { v, p: n * R * T_H / v } } },
      { label: '2→3 Adiabatic Expansion', color: '#F59E0B',
        pts: (t: number) => { const v = V2 + (V3 - V2) * t; return { v, p: P2 * Math.pow(V2 / v, gamma) } } },
      { label: '3→4 Isothermal Compression (T_C)', color: '#3B82F6',
        pts: (t: number) => { const v = V3 + (V4 - V3) * t; return { v, p: n * R * T_C / v } } },
      { label: '4→1 Adiabatic Compression', color: '#10B981',
        pts: (t: number) => { const v = V4 + (V1 - V4) * t; return { v, p: P4 * Math.pow(V4 / v, gamma) } } },
    ]

    // Draw full closed loop
    ctx.strokeStyle = '#6750A440'; ctx.lineWidth = 2
    ctx.beginPath()
    const STEPS = 60
    strokes.forEach((s, si) => {
      for (let i = 0; i <= STEPS; i++) {
        const { v, p } = s.pts(i / STEPS)
        const px = toX(v), py = toY(p)
        si === 0 && i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
      }
    })
    ctx.closePath(); ctx.stroke()

    // Fill loop area
    ctx.fillStyle = '#6750A412'
    ctx.fill()

    // Draw animated stroke highlight
    const sIdx = Math.floor(phase * 4)
    const sT   = (phase * 4) % 1
    const s    = strokes[sIdx]
    ctx.strokeStyle = s.color; ctx.lineWidth = 3
    ctx.beginPath()
    for (let i = 0; i <= Math.round(sT * STEPS); i++) {
      const { v, p } = s.pts(i / STEPS)
      i === 0 ? ctx.moveTo(toX(v), toY(p)) : ctx.lineTo(toX(v), toY(p))
    }
    ctx.stroke()

    // Moving dot
    const { v: dv, p: dp } = s.pts(sT)
    ctx.fillStyle = s.color
    ctx.beginPath(); ctx.arc(toX(dv), toY(dp), 7, 0, Math.PI * 2); ctx.fill()

    // Vertex labels
    const verts = [
      { v: V1, p: n * R * T_H / V1, label: '1' },
      { v: V2, p: P2,               label: '2' },
      { v: V3, p: P3,               label: '3' },
      { v: V4, p: P4,               label: '4' },
    ]
    ctx.fillStyle = '#1C1B1F'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    verts.forEach(({ v, p, label }) => {
      ctx.beginPath(); ctx.arc(toX(v), toY(p), 4, 0, Math.PI * 2); ctx.fill()
      ctx.fillText(label, toX(v), toY(p) - 8)
    })

    // Thermodynamic quantities (normalized: Q_H = 1 unit)
    const eta    = efficiency
    const W_net  = eta           // W_net = η × Q_H  (normalized)
    const Q_H_n  = 1.0
    const Q_C_n  = 1 - eta       // Q_C = Q_H - W_net

    // Info panel — expanded to fit all rows
    const panelRows = [
      { l: 'T_H',           v: `${T_H} K`,                         col: '#21005D' },
      { l: 'T_C',           v: `${T_C} K`,                         col: '#21005D' },
      { l: 'η = 1−T_C/T_H', v: `${(eta * 100).toFixed(1)}%`,       col: '#6750A4' },
      { l: 'Q_H (absorbed)', v: `${Q_H_n.toFixed(2)} (norm)`,      col: '#F43F5E' },
      { l: 'W = η·Q_H',     v: `${W_net.toFixed(3)} (norm)`,       col: '#10B981' },
      { l: 'Q_C = Q_H−W',   v: `${Q_C_n.toFixed(3)} (norm)`,      col: '#3B82F6' },
    ]
    const panelH = panelRows.length * (fs + 7) + 14
    ctx.fillStyle = '#EADDFF'
    ctx.beginPath(); ctx.roundRect(ox + gW - 165, padT + 2, 160, panelH, 8); ctx.fill()
    panelRows.forEach(({ l, v, col }, i) => {
      const ry = padT + 2 + (i + 1) * (fs + 7)
      ctx.fillStyle = col; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'left'
      ctx.fillText(`${l} = `, ox + gW - 158, ry)
      ctx.textAlign = 'right'
      ctx.fillText(v, ox + gW - 10, ry)
    })

    // Stroke label
    ctx.fillStyle = s.color; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(s.label, W / 2, H - 6)
  }, [T_H, T_C, efficiency, isPlaying, V1, V2, V3, V4, P1, P2, P3, P4, n, gamma])

  phaseRef.current = 0
  return <CanvasEngine {...props} draw={draw} deps={[T_H, T_C, isPlaying]} animated />
}
