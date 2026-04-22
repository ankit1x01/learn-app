import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/**
 * Pseudo Force — Block inside an accelerating elevator (non-inertial frame).
 * Shows real forces in ground frame vs pseudo force + real forces in elevator frame.
 */
export function PseudoForceSim(props: SimProps) {
  const { controls, isPlaying } = props
  const mass   = controls['mass']   ?? 5   // kg
  const a_lift = controls['a_lift'] ?? 3   // elevator acceleration m/s²
  const g      = 9.81

  const timeRef  = useRef(0)
  const liftYRef = useRef(0)   // elevator displacement in pixels (upward → negative)

  const N_ground = mass * (g + a_lift)   // Normal force (ground frame)
  const N_pseudo = mass * g              // Apparent weight in elevator frame (feels this)
  // Actually: in elevator frame N = m(g + a_lift), pseudo force = ma_lift downward
  const W_mg     = mass * g
  const F_pseudo = mass * a_lift

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    if (isPlaying) {
      timeRef.current += dt
      // Elevator moves upward continuously; wrap at 150px travel
      liftYRef.current = (liftYRef.current - a_lift * dt * 20) % 150
    }

    const liftY = liftYRef.current
    const t = timeRef.current

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    const halfW = W / 2

    // ── LEFT: Ground (inertial) frame ──
    drawFrame(ctx, 12, 0, halfW - 14, H, '#EADDFF', 'Ground Frame (Inertial)', [
      { label: 'mg', value: W_mg.toFixed(1) + ' N↓', color: '#F43F5E' },
      { label: 'N',  value: N_ground.toFixed(1) + ' N↑', color: '#10B981' },
    ], mass, g, a_lift, liftY, W, H, false)

    // Divider
    ctx.strokeStyle = '#CAC4D0'
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 3])
    ctx.beginPath(); ctx.moveTo(halfW, 24); ctx.lineTo(halfW, H - 8); ctx.stroke()
    ctx.setLineDash([])

    // ── RIGHT: Elevator (non-inertial) frame ──
    drawFrame(ctx, halfW + 2, 0, halfW - 14, H, '#FFF8E1', "Elevator Frame (Non-Inertial)", [
      { label: 'mg',     value: W_mg.toFixed(1) + ' N↓',   color: '#F43F5E' },
      { label: 'F_pseudo', value: F_pseudo.toFixed(1) + ' N↓', color: '#F59E0B' },
      { label: 'N',      value: N_ground.toFixed(1) + ' N↑', color: '#10B981' },
    ], mass, g, a_lift, 0, W, H, true)

    // Time
    ctx.fillStyle = '#79747E'
    ctx.font = `${Math.max(9, Math.round(Math.min(W, H) * (0.026 * 1.5)))}px 'Roboto', sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText(`t = ${t.toFixed(1)} s   |   a_lift = ${a_lift} m/s²`, W / 2, H - 6)
  }, [mass, a_lift, g, N_ground, W_mg, F_pseudo, isPlaying])

  // Reset on control change
  liftYRef.current = 0
  timeRef.current  = 0

  return <CanvasEngine {...props} draw={draw} deps={[mass, a_lift, isPlaying]} animated />
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  x0: number, _y0: number, fw: number, H: number,
  bg: string, title: string,
  forces: { label: string; value: string; color: string }[],
  mass: number, g: number, a_lift: number,
  liftOffset: number,
  W: number, _H: number,
  showPseudo: boolean
) {
  // Background tint
  ctx.fillStyle = bg
  ctx.beginPath(); ctx.roundRect(x0, 10, fw, H - 18, 10); ctx.fill()

  const cx    = x0 + fw / 2
  const baseY = H * 0.68

  // Elevator shaft lines
  ctx.strokeStyle = '#CAC4D080'
  ctx.lineWidth = 1
  ctx.setLineDash([4, 3])
  ctx.beginPath(); ctx.moveTo(x0 + 12, 36); ctx.lineTo(x0 + 12, baseY); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(x0 + fw - 12, 36); ctx.lineTo(x0 + fw - 12, baseY); ctx.stroke()
  ctx.setLineDash([])

  // Elevator car (moving)
  const elevH  = 70
  const elevW  = fw * 0.7
  const elevY0 = showPseudo ? H * 0.34 : H * 0.34 + liftOffset  // only ground frame animates
  ctx.strokeStyle = '#6750A4'
  ctx.lineWidth = 2
  ctx.beginPath(); ctx.roundRect(cx - elevW / 2, elevY0 - elevH, elevW, elevH, 6); ctx.stroke()

  // Floor of elevator
  ctx.fillStyle = '#6750A430'
  ctx.fillRect(cx - elevW / 2, elevY0 - 8, elevW, 8)

  // Person (stick figure)
  const pBase = elevY0 - 10
  const pTop  = pBase - 34
  ctx.strokeStyle = '#1C1B1F'
  ctx.lineWidth = 2
  // Head
  ctx.beginPath(); ctx.arc(cx, pTop - 6, 6, 0, Math.PI * 2); ctx.stroke()
  // Body
  ctx.beginPath(); ctx.moveTo(cx, pTop); ctx.lineTo(cx, pBase - 10); ctx.stroke()
  // Arms
  ctx.beginPath(); ctx.moveTo(cx - 10, pTop + 8); ctx.lineTo(cx + 10, pTop + 8); ctx.stroke()
  // Legs
  ctx.beginPath(); ctx.moveTo(cx, pBase - 10); ctx.lineTo(cx - 7, pBase); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(cx, pBase - 10); ctx.lineTo(cx + 7, pBase); ctx.stroke()

  // Force arrows
  const arrowBaseX = cx + Math.min(W, H) * (0.3 * 1.5)
  const arrowBaseY = elevY0 - elevH / 2
  const arrowScale = Math.max(0.5, Math.min(2, mass * g / 50))

  forces.forEach(({ label, value, color }, i) => {
    const isUp = value.includes('↑')
    const len  = 35 * arrowScale
    const dir  = isUp ? -1 : 1
    const offX = arrowBaseX + (i - (forces.length - 1) / 2) * 45
    const startY = arrowBaseY
    const endY   = startY + dir * len

    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(offX, startY); ctx.lineTo(offX, endY); ctx.stroke()
    // arrowhead
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(offX, endY)
    ctx.lineTo(offX - 5, endY - dir * 8)
    ctx.lineTo(offX + 5, endY - dir * 8)
    ctx.closePath(); ctx.fill()
    // label
    ctx.fillStyle = color
    ctx.font = `bold ${Math.max(8, Math.round(Math.min(W, H) * (0.02 * 1.5)))}px 'Roboto', sans-serif`
    ctx.textAlign = 'center'
    const isPseudo = label === 'F_pseudo'
    ctx.fillText(`${label}=${value}`, offX, endY + dir * 12 + (isUp ? -4 : (isPseudo ? 16 : 4)))
  })

  // Title
  const fs = Math.max(12, Math.round(Math.min(fw, H) * 0.05))
  ctx.fillStyle = '#21005D'
  ctx.font = `bold ${fs}px 'Roboto', sans-serif`
  ctx.textAlign = 'center'
  ctx.fillText(title, cx, 28)

  // Pseudo note
  if (showPseudo) {
    ctx.fillStyle = '#B45309'
    ctx.font = `${Math.max(10, Math.round(Math.min(fw, H) * 0.04))}px 'Roboto', sans-serif`
    ctx.fillText('← F_pseudo = m·a_lift (fictitious)', cx, H * 0.82)
  }
}
