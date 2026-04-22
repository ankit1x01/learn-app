import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/**
 * Biot-Savart Law Simulation
 * Visualizes the magnetic field grid around straight wires and loop cross-sections.
 */
export function BiotSavartSim(props: SimProps) {
  const { controls, isPlaying } = props

  const isLoop = controls?.shape === 1
  const I = controls?.I ?? 10
  const tRef = useRef(0)

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    const scale = Math.min(W, H)
    const cx = W / 2, cy = H / 2

    if (isPlaying) tRef.current += dt
    const t = tRef.current

    // Background
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    const primary = '#6750A4'
    const fontSmall = Math.max(10, Math.round(scale * 0.025))

    // ---- Heatmap Color Helper ----
    const getBiotColor = (mag: number) => {
      const intensity = Math.min(1, mag * 2)
      // Transition from faint purple to vibrant purple/red
      return `rgba(${103 + intensity * 100}, ${80 - intensity * 40}, ${164 - intensity * 50}, ${0.3 + intensity * 0.7})`
    }

    // =========================
    // ===== FIELD GRID ========
    // =========================
    const spacing = scale * 0.06
    const arrowLen = scale * 0.025

    for (let x = spacing / 2; x < W; x += spacing) {
      for (let y = spacing / 2; y < H; y += spacing) {
        let Bx = 0, By = 0, Bmag = 0

        if (!isLoop) {
          // Straight wire (current out of screen): B = μ₀I/(2πr), direction tangential
          const dx = x - cx, dy = y - cy
          const r = Math.sqrt(dx * dx + dy * dy)
          const minDist = 10 // px — prevent division by zero near wire
          const rClamped = Math.max(r, minDist)
          // Direction: tangential (perpendicular to radius vector)
          Bx = -dy / rClamped
          By = dx / rClamped
          // Magnitude scales as 1/r (Biot-Savart for infinite wire)
          Bmag = (I / rClamped) * 1.5
        } else {
          // Circular Loop Cross-section (Two wires: In and Out)
          const R = scale * 0.18
          const dx1 = x - (cx - R), dy1 = y - cy
          const r1 = Math.sqrt(dx1 * dx1 + dy1 * dy1) + 5
          const dx2 = x - (cx + R), dy2 = y - cy
          const r2 = Math.sqrt(dx2 * dx2 + dy2 * dy2) + 5

          // Field is sum of two wires
          const Bx1 = -dy1 / r1, By1 = dx1 / r1
          const Bx2 = dy2 / r2, By2 = -dx2 / r2 // Opposite direction

          Bx = (Bx1 / r1 - Bx2 / r2) * I * 20
          By = (By1 / r1 - By2 / r2) * I * 20
          Bmag = Math.sqrt(Bx * Bx + By * By)
          
          // Normalize for arrow direction
          const bTotal = Bmag + 0.0001
          Bx /= bTotal; By /= bTotal
        }

        // Draw Arrow — length scales as 1/r (Biot-Savart law)
        // For straight wire: r is distance from wire centre
        // For loop: Bmag already encodes relative magnitude
        const color = getBiotColor(Bmag)
        ctx.strokeStyle = color; ctx.lineWidth = 1.5
        // C/max(r, minDist): display constant C=arrowLen*spacing so nearby arrows
        // are full-length and far arrows taper proportionally with distance
        const distFromSource = !isLoop
          ? Math.max(Math.sqrt((x - cx) ** 2 + (y - cy) ** 2), 10)
          : 1 // loop mode uses Bmag directly
        const actualLen = !isLoop
          ? arrowLen * Math.min(1, (spacing * 0.8) / distFromSource)
          : arrowLen * Math.min(1, Bmag * 5)
        const ex = x + Bx * actualLen, ey = y + By * actualLen

        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.stroke()
        const head = 4
        ctx.beginPath(); ctx.moveTo(ex, ey)
        ctx.lineTo(ex - Bx * head - By * head, ey - By * head + Bx * head)
        ctx.lineTo(ex - Bx * head + By * head, ey - By * head - Bx * head)
        ctx.stroke()
      }
    }

    // =========================
    // ===== WIRE VISUALS ======
    // =========================
    ctx.lineWidth = 3; ctx.strokeStyle = primary
    if (!isLoop) {
      ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2); ctx.stroke()
      ctx.fillStyle = primary; ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill()
      ctx.textAlign = 'center'; ctx.font = `${fontSmall}px 'Roboto', sans-serif`
      ctx.fillText('Current ⊙ (Out)', cx, cy + 30)
    } else {
      const R = scale * 0.18
      // Left Wire (Out)
      ctx.beginPath(); ctx.arc(cx - R, cy, 10, 0, Math.PI * 2); ctx.stroke()
      ctx.fillStyle = primary; ctx.beginPath(); ctx.arc(cx - R, cy, 3, 0, Math.PI * 2); ctx.fill()
      // Right Wire (In)
      ctx.beginPath(); ctx.arc(cx + R, cy, 10, 0, Math.PI * 2); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx + R - 5, cy - 5); ctx.lineTo(cx + R + 5, cy + 5)
      ctx.moveTo(cx + R + 5, cy - 5); ctx.lineTo(cx + R - 5, cy + 5); ctx.stroke()
      
      ctx.textAlign = 'center'; ctx.font = `${fontSmall}px 'Roboto', sans-serif`
      ctx.fillText('⊙ Out', cx - R, cy + 30)
      ctx.fillText('⊗ In', cx + R, cy + 30)
    }

    // Info Panel
    const panelW = scale * 0.35
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.beginPath(); ctx.roundRect(20, 20, panelW, scale * 0.12, 12); ctx.fill()
    ctx.strokeStyle = '#CAC4D0'; ctx.lineWidth = 1; ctx.stroke()
    ctx.fillStyle = primary; ctx.textAlign = 'left'
    ctx.font = `bold ${Math.max(12, Math.round(scale * 0.035))}px 'Roboto', sans-serif`
    ctx.fillText('Biot–Savart Law', 35, 50)
    ctx.font = `${fontSmall}px 'Roboto', sans-serif`
    ctx.fillText(`Current: ${I} A`, 35, 75)
    ctx.fillText(`Mode: ${!isLoop ? 'Straight' : 'Loop Cross-section'}`, 35, 95)

  }, [isLoop, I, isPlaying])

  return <CanvasEngine {...props} draw={draw} deps={[isLoop, I, isPlaying]} animated />
}