import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/** PV Diagram — draws Isothermal, Adiabatic, Isobaric, Isochoric processes on a live P-V canvas */
export function PVDiagramSim(props: SimProps) {
  const { controls } = props
  const n        = controls['n']        ?? 1     // moles
  const T        = controls['T']        ?? 300   // temperature K (initial)
  const gamma    = controls['gamma']    ?? 1.4   // Cp/Cv (air)
  const tempRatio = controls['tempRatio'] ?? 2.0  // T2/T1 for isochoric (Gay-Lussac's law)

  // Axes: V from 0.001 to 0.05 m³, P from 0 to 400 kPa
  const V_MIN = 0.001, V_MAX = 0.05
  const P_MAX = 4e5,   P_MIN = 0
  const R     = 8.314

  const processRef = useRef<'isothermal'|'adiabatic'|'isobaric'|'isochoric'>('isothermal')

  // pick process from control
  const procIdx = Math.round(controls['process'] ?? 0) % 4
  const PROCS: Array<'isothermal'|'adiabatic'|'isobaric'|'isochoric'> = ['isothermal','adiabatic','isobaric','isochoric']
  processRef.current = PROCS[procIdx]

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H) => {
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    const padL = 60, padB = 52, padT = 36, padR = 20
    const gW = W - padL - padR
    const gH = H - padT - padB
    const ox = padL, oy = H - padB

    const toX = (v: number) => ox + ((v - V_MIN) / (V_MAX - V_MIN)) * gW
    const toY = (p: number) => oy - ((p - P_MIN) / (P_MAX - P_MIN)) * gH

    // Grid
    ctx.strokeStyle = '#CAC4D020'
    ctx.lineWidth = 1
    for (let i = 1; i <= 5; i++) {
      const gy = oy - (i / 5) * gH
      ctx.beginPath(); ctx.moveTo(ox, gy); ctx.lineTo(ox + gW, gy); ctx.stroke()
      const gx = ox + (i / 5) * gW
      ctx.beginPath(); ctx.moveTo(gx, oy); ctx.lineTo(gx, oy - gH); ctx.stroke()
    }

    // Axes
    ctx.strokeStyle = '#1C1B1F'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + gW, oy); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox, oy - gH); ctx.stroke()

    const fs = Math.max(9, Math.round(Math.min(W, H) * (0.026 * 1.5)))
    ctx.fillStyle = '#49454F'; ctx.font = `${fs}px 'Roboto', sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText('Volume V (m³)', ox + gW / 2, oy + 38)
    ctx.save(); ctx.translate(14, oy - gH / 2); ctx.rotate(-Math.PI / 2)
    ctx.fillText('Pressure P (Pa)', 0, 0); ctx.restore()

    // Tick labels
    for (let i = 0; i <= 5; i++) {
      const v = V_MIN + (V_MAX - V_MIN) * i / 5
      const p = P_MIN + (P_MAX - P_MIN) * i / 5
      ctx.textAlign = 'center'
      ctx.fillText((v * 1000).toFixed(1) + 'L', toX(v), oy + 16)
      ctx.textAlign = 'right'
      ctx.fillText((p / 1000).toFixed(0) + 'k', ox - 4, toY(p) + 4)
    }

    // ── Draw all four processes from a fixed start state ──
    const V0 = 0.01  // m³ start volume
    const P0 = n * R * T / V0  // start pressure

    const allProcs = [
      { key: 'isothermal', label: 'Isothermal (PV=const)', color: '#6750A4',
        fn: (v: number) => n * R * T / v },
      { key: 'adiabatic', label: 'Adiabatic (PV^γ=const)', color: '#F43F5E',
        fn: (v: number) => P0 * Math.pow(V0 / v, gamma) },
      { key: 'isobaric', label: 'Isobaric (P=const)', color: '#10B981',
        fn: (_v: number) => P0 },
      { key: 'isochoric', label: 'Isochoric (V=const)', color: '#F59E0B',
        fn: (_v: number) => P0 * tempRatio },  // Gay-Lussac: P2/P1 = T2/T1
    ]

    allProcs.forEach(({ key, label, color, fn }) => {
      const isActive = key === processRef.current
      ctx.strokeStyle = isActive ? color : color + '40'
      ctx.lineWidth   = isActive ? 3 : 1.5
      ctx.setLineDash(isActive ? [] : [4, 4])
      ctx.beginPath()

      if (key === 'isochoric') {
        // Vertical line at V0: P changes from P0 to P0*tempRatio (Gay-Lussac's law)
        const P2_isochoric = P0 * tempRatio
        ctx.moveTo(toX(V0), toY(P0))
        ctx.lineTo(toX(V0), toY(Math.min(P2_isochoric, P_MAX)))
      } else if (key === 'isobaric') {
        // Horizontal line
        ctx.moveTo(toX(V0), toY(P0))
        ctx.lineTo(toX(V_MAX), toY(P0))
      } else {
        // Curve
        const steps = 120
        for (let i = 0; i <= steps; i++) {
          const v = V0 + (V_MAX - V0) * i / steps
          const p = fn(v)
          if (p < P_MIN || p > P_MAX) continue
          i === 0 ? ctx.moveTo(toX(v), toY(p)) : ctx.lineTo(toX(v), toY(p))
        }
      }
      ctx.stroke()
      ctx.setLineDash([])

      if (isActive) {
        // Legend chip
        ctx.fillStyle = color + '22'
        ctx.beginPath(); ctx.roundRect(ox, oy - gH - 2, Math.min(W, H) * (0.88 * 1.5), 20, 6); ctx.fill()
        ctx.fillStyle = color
        ctx.font = `bold ${fs}px 'Roboto', sans-serif`
        ctx.textAlign = 'left'
        ctx.fillText(label, ox + 8, oy - gH + 13)

        // Isochoric: draw "W = 0 (no work done)" label mid-line
        if (key === 'isochoric') {
          const P2_label = Math.min(P0 * tempRatio, P_MAX)
          const midY = toY((P0 + P2_label) / 2)
          ctx.font = `italic ${fs}px 'Roboto', sans-serif`
          ctx.fillStyle = '#F59E0B'
          ctx.textAlign = 'left'
          ctx.fillText('W = 0', toX(V0) + 6, midY)
        }
      }
    })

    // Start dot
    if (P0 <= P_MAX) {
      ctx.fillStyle = '#1C1B1F'
      ctx.beginPath(); ctx.arc(toX(V0), toY(P0), 5, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#49454F'; ctx.font = `${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'left'
      ctx.fillText(`(V₀,P₀)`, toX(V0) + 8, toY(P0) - 6)
    }

    // Info panel — show T1, T2 (= T1×tempRatio) and moles
    const T2 = T * tempRatio
    ctx.fillStyle = '#EADDFF'
    ctx.beginPath(); ctx.roundRect(ox + gW - 130, padT + 4, 126, 58, 8); ctx.fill()
    ctx.fillStyle = '#21005D'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'left'
    ctx.fillText(`n = ${n} mol`, ox + gW - 122, padT + 18)
    ctx.fillText(`T₁ = ${T} K`, ox + gW - 122, padT + 33)
    ctx.fillText(`T₂ = ${T2.toFixed(0)} K`, ox + gW - 122, padT + 48)
  }, [n, T, gamma, tempRatio, procIdx, V_MIN, V_MAX, P_MAX, P_MIN, R])

  return <CanvasEngine {...props} draw={draw} deps={[n, T, gamma, tempRatio, procIdx]} />
}
