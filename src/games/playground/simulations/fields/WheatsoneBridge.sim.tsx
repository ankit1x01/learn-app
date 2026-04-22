import { useCallback } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/** Wheatstone Bridge — balanced/unbalanced detection */
export function WheatstoneSimComponent(props: SimProps) {
  const { controls } = props
  const P = controls['P'] ?? 10, Q = controls['Q'] ?? 10
  const R3 = controls['R3'] ?? 10, Rx = controls['Rx'] ?? 10
  const V_bat = controls['V'] ?? 6

  const balanced = Math.abs(P / Q - R3 / Rx) < 0.01
  // Galvanometer current (approximation)
  const Ig_proxy = balanced ? 0 : ((P / Q) - (R3 / Rx)) * V_bat * 0.1

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H) => {
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'; ctx.fillRect(0, 0, W, H)

    const cx = W / 2, cy = H * 0.48
    const dx = Math.min(W, H) * (0.22 * 1.5), dy = H * 0.26
    const fs = Math.max(10, Math.round(Math.min(W, H) * (0.026 * 1.5)))

    // Nodes
    const A = { x: cx, y: cy - dy }       // top
    const B = { x: cx - dx, y: cy }       // left
    const C = { x: cx + dx, y: cy }       // right
    const D = { x: cx, y: cy + dy }       // bottom

    // Wires
    ctx.strokeStyle = '#1C1B1F'; ctx.lineWidth = 2
    const wire = (a: {x:number,y:number}, b: {x:number,y:number}) => {
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
    }
    wire(A, B); wire(A, C); wire(B, D); wire(C, D)

    // Galvanometer (middle)
    const gmid = { x: cx, y: cy }
    wire(B, gmid); wire(C, gmid)
    ctx.strokeStyle = balanced ? '#10B981' : '#F43F5E'; ctx.lineWidth = 3
    ctx.beginPath(); ctx.arc(gmid.x, gmid.y, 12, 0, Math.PI * 2); ctx.stroke()
    ctx.fillStyle = balanced ? '#10B981' : '#F43F5E'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText('G', gmid.x, gmid.y + 5)

    // Battery (bottom)
    ctx.strokeStyle = '#6750A4'; ctx.lineWidth = 2.5
    ctx.beginPath(); ctx.moveTo(D.x - 12, D.y); ctx.lineTo(D.x + 12, D.y); ctx.stroke()
    ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(D.x - 6, D.y + 5); ctx.lineTo(D.x + 6, D.y + 5); ctx.stroke()
    ctx.fillStyle = '#6750A4'; ctx.font = `${fs}px 'Roboto', sans-serif`
    ctx.fillText(`${V_bat}V`, D.x, D.y + 20)

    // Resistor labels at wire midpoints
    const label = (a: {x:number,y:number}, b: {x:number,y:number}, txt: string) => {
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
      ctx.fillStyle = '#F4EFF4'
      ctx.beginPath(); ctx.roundRect(mx - 22, my - 10, 44, 20, 4); ctx.fill()
      ctx.fillStyle = '#1C1B1F'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
      ctx.fillText(txt, mx, my + 5)
    }
    label(A, B, `P=${P}Ω`); label(A, C, `Q=${Q}Ω`)
    label(B, D, `R=${R3}Ω`); label(C, D, `Rx=${Rx}Ω`)

    // Balance status
    const status = balanced ? '✓ BALANCED  P/Q = R/Rx' : `✗ UNBALANCED  Ig≈${Ig_proxy.toFixed(2)}A`
    ctx.fillStyle = balanced ? '#10B981' : '#F43F5E'; ctx.font = `bold ${Math.round(fs * 1.1)}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(status, W / 2, H * 0.87)

    ctx.fillStyle = '#EADDFF'
    ctx.beginPath(); ctx.roundRect(8, H - 28, W - 16, 22, 6); ctx.fill()
    ctx.fillStyle = '#21005D'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(`Balance condition: P/Q = R/Rx  →  Rx = QR/P = ${(Q * R3 / P).toFixed(1)} Ω`, W / 2, H - 12)
  }, [P, Q, R3, Rx, V_bat, balanced, Ig_proxy])

  return <CanvasEngine {...props} draw={draw} deps={[P, Q, R3, Rx, V_bat]} />
}
