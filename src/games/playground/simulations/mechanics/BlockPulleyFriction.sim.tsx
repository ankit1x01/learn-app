import { useCallback, useRef } from 'react'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'
import { SimProps } from '../../types'

/**
 * Block + Pulley + Friction Simulation
 * Setup: Block m1 on table, connected to hanging mass m2.
 */
export function BlockPulleyFrictionSim(props: SimProps) {
  const { controls, isPlaying } = props

  const m1 = controls?.m1 ?? 5
  const m2 = controls?.m2 ?? 3
  const mu = controls?.mu_k ?? 0.2
  const g = 9.81

  const posRef = useRef(0) // Displacement in pixels
  const velRef = useRef(0) // Velocity in pixels/s

  // Physics calculations (m/s^2)
  const f_max = mu * m1 * g
  const driving = m2 * g
  const moving = isPlaying && driving > f_max
  const a = moving ? (driving - f_max) / (m1 + m2) : 0
  const T = moving ? m1 * a + f_max : (isPlaying ? driving : driving) // Simplified T calculation

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    // 1. Update Physics (Pixels)
    // Scale: 1m = 100px for visual clarity
    const pxPerMeter = 60
    if (isPlaying && moving) {
      velRef.current += a * dt * pxPerMeter
      posRef.current += velRef.current * dt

      // Stop condition (limits)
      if (posRef.current > W * 0.45 || posRef.current > H * 0.4) {
        velRef.current = 0
      }
    }

    const displacement = posRef.current

    // 2. Clear & Draw Background
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    const scale = Math.min(W, H)
    const fontSmall = Math.max(10, Math.round(scale * 0.025))
    const fontLarge = Math.max(12, Math.round(scale * 0.035))

    // Colors (M3 roles)
    const tableColor = '#EADDFF'
    const primary = '#6750A4'
    const secondary = '#958DA5'
    const error = '#B3261E'

    // Table
    ctx.fillStyle = tableColor
    ctx.fillRect(W * 0.1, H * 0.6, W * 0.6, 12)

    // Pulley
    const pulleyX = W * 0.7
    const pulleyY = H * 0.6
    ctx.beginPath()
    ctx.arc(pulleyX, pulleyY, scale * 0.03, 0, Math.PI * 2)
    ctx.strokeStyle = primary
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.fillStyle = '#CAC4D0'
    ctx.fill()

    // Block m1 (on table)
    const bSize = scale * 0.1
    const m1x = W * 0.15 + displacement
    const m1y = H * 0.6 - bSize
    ctx.fillStyle = primary
    ctx.beginPath(); ctx.roundRect(m1x, m1y, bSize, bSize, 4); ctx.fill()

    // Label m1
    ctx.fillStyle = '#FFFFFF'
    ctx.font = `bold ${fontSmall}px 'Roboto', sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText(`m1`, m1x + bSize / 2, m1y + bSize / 2 + 5)

    // Block m2 (hanging)
    const m2x = pulleyX + scale * 0.03 - bSize / 2
    const m2y = pulleyY + scale * 0.1 + displacement
    ctx.fillStyle = primary
    ctx.beginPath(); ctx.roundRect(m2x, m2y, bSize, bSize, 4); ctx.fill()

    // Label m2
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText(`m2`, m2x + bSize / 2, m2y + bSize / 2 + 5)

    // String
    ctx.beginPath()
    ctx.strokeStyle = '#49454F'
    ctx.lineWidth = 2
    ctx.moveTo(m1x + bSize, m1y + bSize / 2)
    ctx.lineTo(pulleyX, m1y + bSize / 2) // To top of pulley
    ctx.lineTo(pulleyX + scale * 0.03, pulleyY) // Wrap
    ctx.lineTo(m2x + bSize / 2, m2y) // To m2
    ctx.stroke()

    // ---- Force Vectors ----
    // drawVector: arrow from (x,y) by (dx,dy), label at tip
    const drawVector = (x: number, y: number, dx: number, dy: number, label: string, color: string) => {
      if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return
      const angle = Math.atan2(dy, dx)
      const headLen = 8
      ctx.save()
      ctx.strokeStyle = color
      ctx.fillStyle = color
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(x, y); ctx.lineTo(x + dx, y + dy); ctx.stroke()
      // Arrowhead
      ctx.beginPath()
      ctx.moveTo(x + dx, y + dy)
      ctx.lineTo(x + dx - headLen * Math.cos(angle - Math.PI / 6), y + dy - headLen * Math.sin(angle - Math.PI / 6))
      ctx.lineTo(x + dx - headLen * Math.cos(angle + Math.PI / 6), y + dy - headLen * Math.sin(angle + Math.PI / 6))
      ctx.closePath(); ctx.fill()
      // Label — offset outward from tip
      ctx.font = `bold ${fontSmall}px 'Roboto', sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(label, x + dx + Math.cos(angle) * 16, y + dy + Math.sin(angle) * 16)
      ctx.restore()
    }

    // Arrow scale: 1 N → 2.8 px  (forces are large, keep arrows contained)
    const PX_PER_N = 2.8
    const arrowW  = Math.min(40, m1 * g * PX_PER_N)  // capped for layout
    const arrowN  = Math.min(40, m1 * g * PX_PER_N)
    const arrowF  = Math.min(35, f_max * PX_PER_N)
    const arrowT  = Math.min(38, T   * PX_PER_N)
    const arrowW2 = Math.min(40, m2 * g * PX_PER_N)

    // Centre of m1 block
    const m1cx = m1x + bSize / 2
    const m1cy = m1y + bSize / 2

    // Centre of m2 block
    const m2cx = m2x + bSize / 2
    const m2cy = m2y + bSize / 2

    // --- Forces on Block m1 ---
    // Weight: downward from block centre (red)
    drawVector(m1cx, m1cy, 0, arrowW, `W1=${(m1 * g).toFixed(1)}N`, '#DC2626')
    // Normal: upward from block centre (blue)
    drawVector(m1cx, m1cy, 0, -arrowN, `N=${(m1 * g).toFixed(1)}N`, '#1D4ED8')
    // Tension: rightward from right edge of block (green), toward pulley
    drawVector(m1x + bSize, m1cy, arrowT, 0, `T=${T.toFixed(1)}N`, '#16A34A')
    // Friction: leftward from left edge of block (orange), opposing motion
    drawVector(m1x, m1cy, -arrowF, 0, `f=${f_max.toFixed(1)}N`, '#EA580C')

    // --- Forces on Block m2 ---
    // Weight: downward from block bottom (red)
    drawVector(m2cx, m2y + bSize, 0, arrowW2, `W2=${(m2 * g).toFixed(1)}N`, '#DC2626')
    // Tension: upward from block top (green)
    drawVector(m2cx, m2y, 0, -arrowT, `T=${T.toFixed(1)}N`, '#16A34A')

    // ---- Info Panel ----
    const panelW = scale * 0.35
    const panelH = scale * 0.15
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.beginPath(); ctx.roundRect(W - panelW - 20, 20, panelW, panelH, 12); ctx.fill()
    ctx.strokeStyle = '#CAC4D0'
    ctx.lineWidth = 1; ctx.stroke()

    ctx.fillStyle = primary
    ctx.textAlign = 'left'
    ctx.font = `bold ${fontLarge}px 'Roboto', sans-serif`
    ctx.fillText(`Accel: ${a.toFixed(2)} m/s²`, W - panelW + 5, 50)
    ctx.font = `${fontSmall}px 'Roboto', sans-serif`
    ctx.fillText(`Tension: ${T.toFixed(1)} N`, W - panelW + 5, 75)
    if (!moving && isPlaying) {
      ctx.fillStyle = error
      ctx.fillText(`Equilibrium (f_max > m2g)`, W - panelW + 5, 100)
    }

  }, [m1, m2, mu, a, T, f_max, isPlaying, moving])

  // Reset physics on control change
  if (!isPlaying) {
    posRef.current = 0
    velRef.current = 0
  }

  return <CanvasEngine {...props} draw={draw} deps={[m1, m2, mu, isPlaying]} animated />
}
