import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/**
 * Self Inductance (RL Circuit) Simulation
 * Visualizes current growth I(t) and magnetic energy storage.
 */
export function SelfInductanceSim(props: SimProps) {
  const { controls, isPlaying } = props

  const V = controls?.V ?? 12
  const R = controls?.R ?? 10
  const L = controls?.L ?? 0.5
  const tau = L / R

  const startTimeRef = useRef<number | null>(null)
  const graphPoints = useRef<{t: number, I: number}[]>([])

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    const scale = Math.min(W, H)
    
    if (!isPlaying) {
      startTimeRef.current = null
      graphPoints.current = []
    } else if (startTimeRef.current === null) {
      startTimeRef.current = performance.now()
    }

    const elapsed = startTimeRef.current ? (performance.now() - startTimeRef.current) / 1000 : 0
    const I = (V / R) * (1 - Math.exp(-elapsed / tau))
    const U = 0.5 * L * I * I
    const Imax = V / R

    if (isPlaying && elapsed < 10) {
      if (graphPoints.current.length === 0 || elapsed - graphPoints.current[graphPoints.current.length-1].t > 0.05) {
        graphPoints.current.push({t: elapsed, I})
      }
    }

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    const primary = '#6750A4'
    const fontSmall = Math.max(10, Math.round(scale * 0.025))

    // --- Circuit Layout ---
    const cx = W / 2, cy = H * 0.35
    const cW = scale * 0.6, cH = scale * 0.3
    const left = cx - cW / 2, right = cx + cW / 2
    const top = cy - cH / 2, bottom = cy + cH / 2

    ctx.strokeStyle = '#49454F'
    ctx.lineWidth = 2
    
    // Wires
    ctx.beginPath()
    ctx.moveTo(left, cy - 20); ctx.lineTo(left, top); ctx.lineTo(cx - scale * 0.1, top) // Battery to Resistor
    ctx.moveTo(cx + scale * 0.1, top); ctx.lineTo(right, top); ctx.lineTo(right, cy - 20) // Inductor to loop back
    ctx.moveTo(left, cy + 20); ctx.lineTo(left, bottom); ctx.lineTo(right, bottom); ctx.lineTo(right, cy + 20)
    ctx.stroke()

    // Battery
    ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(left - 10, cy - 8); ctx.lineTo(left + 10, cy - 8); ctx.stroke()
    ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(left - 5, cy + 8); ctx.lineTo(left + 5, cy + 8); ctx.stroke()
    ctx.fillStyle = primary; ctx.font = `bold ${fontSmall}px 'Roboto', sans-serif`
    ctx.textAlign = 'right'; ctx.fillText(`${V}V`, left - 15, cy + 5)

    // Resistor
    const rW = scale * 0.1, rH = scale * 0.04
    ctx.fillStyle = primary
    ctx.beginPath(); ctx.roundRect(cx - scale * 0.2, top - rH/2, rW, rH, 4); ctx.fill()
    ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.fillText('R', cx - scale * 0.15, top + 5)

    // Inductor (Helix)
    const iX = cx + scale * 0.05, iY = top
    const iLoops = 8, iLoopW = scale * 0.02, iLoopH = scale * 0.06
    ctx.strokeStyle = primary; ctx.lineWidth = 3; ctx.beginPath()
    ctx.moveTo(iX, iY)
    for(let i=0; i<iLoops; i++) {
      ctx.bezierCurveTo(iX + i*iLoopW + iLoopW, iY - iLoopH, iX + i*iLoopW + iLoopW, iY + iLoopH, iX + (i+1)*iLoopW, iY)
    }
    ctx.stroke()

    // Magnetic Field Lines (Arrows)
    if (I > 0.01) {
      ctx.strokeStyle = 'rgba(0, 97, 164, 0.4)'
      ctx.lineWidth = 1
      const fY = top - 5
      for(let j=0; j<3; j++) {
        const offset = (j-1)*10
        ctx.beginPath(); ctx.moveTo(iX - 10, fY + offset); ctx.lineTo(iX + iLoops*iLoopW + 10, fY + offset); ctx.stroke()
        // Arrow head
        const ax = iX + iLoops*iLoopW + 10
        ctx.beginPath(); ctx.moveTo(ax, fY+offset); ctx.lineTo(ax-5, fY+offset-3); ctx.lineTo(ax-5, fY+offset+3); ctx.fill()
      }
    }

    // --- Graph Area ---
    const gX = cx - scale * 0.35, gY = H * 0.85
    const gW = scale * 0.7, gH = scale * 0.3
    
    ctx.strokeStyle = '#CAC4D0'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(gX, gY - gH); ctx.lineTo(gX, gY); ctx.lineTo(gX + gW, gY); ctx.stroke()
    
    ctx.fillStyle = '#958DA5'; ctx.font = `${fontSmall-2}px 'Roboto', sans-serif`
    ctx.fillText('Time (s)', gX + gW, gY + 15); ctx.textAlign = 'right'
    ctx.fillText('Current I(A)', gX - 5, gY - gH)

    if (graphPoints.current.length > 1) {
      ctx.strokeStyle = primary; ctx.lineWidth = 2.5; ctx.beginPath()
      graphPoints.current.forEach((p, idx) => {
        const px = gX + (p.t / 5) * gW
        const py = gY - (p.I / (V/R * 1.2)) * gH
        if (idx === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py)
      })
      ctx.stroke()
    }

    // Info Panel
    const panelW = scale * 0.3
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.beginPath(); ctx.roundRect(W - panelW - 20, 20, panelW, scale * 0.15, 12); ctx.fill()
    ctx.strokeStyle = '#CAC4D0'; ctx.lineWidth = 1; ctx.stroke()
    ctx.fillStyle = primary; ctx.textAlign = 'left'
    ctx.font = `bold ${Math.max(12, Math.round(scale * 0.035))}px 'Roboto', sans-serif`
    ctx.fillText(`I: ${I.toFixed(2)} A`, W - panelW + 5, 50)
    ctx.font = `${fontSmall}px 'Roboto', sans-serif`
    ctx.fillText(`τ: ${tau.toFixed(3)} s`, W - panelW + 5, 75)
    ctx.fillText(`Energy: ${U.toFixed(3)} J`, W - panelW + 5, 100)

  }, [V, R, L, tau, isPlaying])

  return <CanvasEngine {...props} draw={draw} deps={[V, R, L, isPlaying]} animated />
}