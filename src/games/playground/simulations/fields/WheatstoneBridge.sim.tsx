import { useCallback } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/**
 * Wheatstone Bridge Simulation
 * Visualizes a balanced/unbalanced bridge circuit.
 */
export function WheatstoneBridgeSim(props: SimProps) {
  const { controls } = props

  const P = controls?.P ?? 100
  const Q = controls?.Q ?? 100
  const R = controls?.R ?? 100
  const S = controls?.S ?? 105
  const V = controls?.V ?? 12

  // --- Physics ---
  const Vb = V * (Q / (P + Q))
  const Vd = V * (S / (R + S))
  const deltaV = Vb - Vd
  const isBalanced = Math.abs(deltaV) < 0.05

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, t) => {
    const scale = Math.min(W, H)
    const cx = W / 2
    const cy = H / 2
    const size = scale * 0.22

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    const primary = '#6750A4'
    const accent = '#0061A4'
    const fontSmall = Math.max(10, Math.round(scale * 0.025))

    // Diamond Points
    const A = { x: cx, y: cy - size }     // top
    const B = { x: cx + size, y: cy }     // right
    const C = { x: cx, y: cy + size }     // bottom
    const D = { x: cx - size, y: cy }     // left

    // --- Wire Drawing Helper ---
    const drawWire = (p1: {x:number, y:number}, p2: {x:number, y:number}, label?: string) => {
      ctx.strokeStyle = '#49454F'
      ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke()

      // Animated Current Dots
      ctx.setLineDash([4, 8])
      ctx.lineDashOffset = -t * 40
      ctx.strokeStyle = accent
      ctx.stroke()
      ctx.setLineDash([])

      if (label) {
        ctx.fillStyle = primary
        ctx.font = `bold ${fontSmall}px 'Roboto', sans-serif`
        ctx.fillText(label, (p1.x + p2.x)/2 + 15, (p1.y + p2.y)/2)
      }
    }

    // Bridge arms
    drawWire(A, B, `P=${P}Ω`)
    drawWire(B, C, `Q=${Q}Ω`)
    drawWire(A, D, `R=${R}Ω`)
    drawWire(D, C, `S=${S}Ω`)

    // Galvanometer branch
    ctx.strokeStyle = '#49454F'
    ctx.beginPath(); ctx.moveTo(B.x, B.y); ctx.lineTo(D.x, D.y); ctx.stroke()
    
    // Galvanometer circle
    const gRadius = scale * 0.06
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath(); ctx.arc(cx, cy, gRadius, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = primary; ctx.lineWidth = 2; ctx.stroke()

    // Needle
    const maxDeflection = Math.PI / 3
    const angle = Math.max(-1, Math.min(1, deltaV * 2)) * maxDeflection
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(angle)
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -gRadius + 5)
    ctx.strokeStyle = isBalanced ? '#2E7D32' : '#B3261E'
    ctx.lineWidth = 3; ctx.stroke()
    ctx.restore()
    
    ctx.fillStyle = primary
    ctx.font = `bold ${fontSmall}px 'Roboto', sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText('G', cx, cy + gRadius + 15)

    // External Circuit (Battery)
    const batY = H * 0.9
    ctx.strokeStyle = '#49454F'
    ctx.beginPath()
    ctx.moveTo(A.x, A.y); ctx.lineTo(A.x - size * 1.5, A.y); ctx.lineTo(A.x - size * 1.5, batY); ctx.lineTo(cx - 10, batY)
    ctx.moveTo(C.x, C.y); ctx.lineTo(C.x + size * 1.5, C.y); ctx.lineTo(C.x + size * 1.5, batY); ctx.lineTo(cx + 10, batY)
    ctx.stroke()
    
    // Battery symbol
    ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx - 10, batY - 10); ctx.lineTo(cx - 10, batY + 10); ctx.stroke()
    ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx + 10, batY - 5); ctx.lineTo(cx + 10, batY + 5); ctx.stroke()
    ctx.fillText(`${V}V`, cx, batY + 25)

    // Balanced Badge
    if (isBalanced) {
      ctx.fillStyle = '#2E7D32'
      ctx.font = `bold ${Math.max(12, Math.round(scale * 0.04))}px 'Roboto', sans-serif`
      ctx.fillText('✓ BALANCED', cx, cy - gRadius - 20)
    }

    // Info Panel
    const panelW = scale * 0.3
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.beginPath(); ctx.roundRect(W - panelW - 20, 20, panelW, scale * 0.15, 12); ctx.fill()
    ctx.strokeStyle = '#CAC4D0'; ctx.lineWidth = 1; ctx.stroke()
    ctx.fillStyle = primary; ctx.textAlign = 'left'
    ctx.font = `${fontSmall}px 'Roboto', sans-serif`
    ctx.fillText(`Vb = ${Vb.toFixed(2)} V`, W - panelW + 5, 45)
    ctx.fillText(`Vd = ${Vd.toFixed(2)} V`, W - panelW + 5, 70)
    ctx.fillStyle = isBalanced ? '#2E7D32' : '#B3261E'
    ctx.fillText(`ΔV = ${deltaV.toFixed(2)} V`, W - panelW + 5, 95)

  }, [P, Q, R, S, V, deltaV, isBalanced])

  return <CanvasEngine {...props} draw={draw} deps={[P, Q, R, S, V]} animated />
}