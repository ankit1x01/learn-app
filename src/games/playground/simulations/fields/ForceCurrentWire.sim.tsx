import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/**
 * Force on Current-Carrying Wire Simulation
 * Visualizes F = I (L x B) with a rotatable wire in a uniform B-field.
 */
export function ForceCurrentWireSim(props: SimProps) {
  const { controls, isPlaying } = props

  const I = controls?.I ?? 5
  const B = controls?.B ?? 0.5
  const theta_deg = controls?.theta ?? 90
  const theta = (theta_deg * Math.PI) / 180
  const L = 2.0 // Length of wire in meters (visual units)

  const Force = I * L * B * Math.sin(theta)
  const tRef = useRef(0)

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    const scale = Math.min(W, H)
    const cx = W / 2, cy = H / 2
    
    if (isPlaying) tRef.current += dt
    const t = tRef.current

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    const primary = '#6750A4'
    const secondary = '#B3261E'
    const fontSmall = Math.max(10, Math.round(scale * 0.025))

    // --- B-Field Grid (Into Screen) ---
    const grid = scale * 0.08
    ctx.strokeStyle = `rgba(103, 80, 164, ${B * 0.3})`
    ctx.lineWidth = 1
    for(let x=grid/2; x<W; x+=grid) {
      for(let y=grid/2; y<H; y+=grid) {
        ctx.beginPath()
        ctx.moveTo(x-3, y-3); ctx.lineTo(x+3, y+3)
        ctx.moveTo(x+3, y-3); ctx.lineTo(x-3, y+3)
        ctx.stroke()
      }
    }

    // --- Wire Rendering ---
    const wLen = scale * 0.4
    // Wire direction is along theta in the XY plane
    // But Force formula usually has B in Z-direction.
    // If wire is at angle theta in XY plane, L = (cos theta, sin theta, 0)
    // B = (0, 0, -B_val) (into screen)
    // F = I (L x B) = I [ (cos t, sin t, 0) x (0, 0, -B) ]
    // F = I [ (sin t * -B - 0), (0 - cos t * -B), (0) ]
    // F = I [ -B sin t, B cos t, 0 ]
    
    const wx = Math.cos(theta) * wLen/2
    const wy = Math.sin(theta) * wLen/2
    
    ctx.strokeStyle = primary; ctx.lineWidth = 6; ctx.lineCap = 'round'
    ctx.beginPath(); ctx.moveTo(cx - wx, cy - wy); ctx.lineTo(cx + wx, cy + wy); ctx.stroke()

    // Current animation
    if (isPlaying && I > 0) {
      const dotCount = 5
      ctx.fillStyle = '#D0BCFF'
      for(let i=0; i<dotCount; i++) {
        const p = ((t * 2 + i/dotCount) % 1.0) * 2 - 1
        ctx.beginPath(); ctx.arc(cx + wx*p, cy + wy*p, 3, 0, Math.PI*2); ctx.fill()
      }
    }

    // --- Force Vector (Red) ---
    if (Math.abs(Force) > 0.01) {
      const fX = -Math.sin(theta) // Direction of force X
      const fY = Math.cos(theta)  // Direction of force Y
      const fLen = (Force / 20) * scale * 0.3 // Scaled for visibility
      
      ctx.strokeStyle = secondary; ctx.lineWidth = 4; ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + fX * fLen, cy + fY * fLen)
      ctx.stroke()
      
      // Arrowhead
      const head = 8
      const ex = cx + fX * fLen, ey = cy + fY * fLen
      ctx.fillStyle = secondary
      ctx.beginPath(); ctx.moveTo(ex, ey)
      ctx.lineTo(ex - fX*head - fY*head, ey - fY*head + fX*head)
      ctx.lineTo(ex - fX*head + fY*head, ey - fY*head - fX*head)
      ctx.fill()
      
      ctx.fillStyle = secondary; ctx.font = `bold ${fontSmall}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
      ctx.fillText(`Force F`, cx + fX * fLen, cy + fY * fLen - 15)
    }

    // Info Panel
    const panelW = scale * 0.3
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.beginPath(); ctx.roundRect(W - panelW - 20, 20, panelW, scale * 0.15, 12); ctx.fill()
    ctx.strokeStyle = '#CAC4D0'; ctx.lineWidth = 1; ctx.stroke()
    ctx.fillStyle = primary; ctx.textAlign = 'left'
    ctx.font = `bold ${Math.max(12, Math.round(scale * 0.035))}px 'Roboto', sans-serif`
    ctx.fillText(`F = ${Force.toFixed(2)} N`, W - panelW + 5, 50)
    ctx.font = `${fontSmall}px 'Roboto', sans-serif`
    ctx.fillText(`Current: ${I} A`, W - panelW + 5, 75)
    ctx.fillText(`B-Field: ${B} T`, W - panelW + 5, 100)
    ctx.fillText(`Angle: ${theta_deg}°`, W - panelW + 5, 125)

  }, [I, B, theta, Force, isPlaying])

  return <CanvasEngine {...props} draw={draw} deps={[I, B, theta, isPlaying]} animated />
}
