import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

export function AtwoodMachineSim(props: SimProps) {
  const { controls, isPlaying } = props
  const m1 = controls['m1'] ?? 3   // kg
  const m2 = controls['m2'] ?? 5   // kg

  const g = 9.81

  // Correct Atwood formula:  a = (m2 - m1)*g / (m1 + m2)
  // Positive a → m2 falls, m1 rises
  const a = (m2 - m1) * g / (m1 + m2)
  const T = 2 * m1 * m2 * g / (m1 + m2)

  // State: displacement from equilibrium start (metres, positive = m2 moved down)
  const stateRef = useRef({ s: 0, v: 0 })

  const PPM = 30   // pixels per metre

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    if (isPlaying) {
      const s = stateRef.current
      s.v += a * dt
      s.s += s.v * dt
      // Clamp so blocks don't fly off screen (max travel = 3 m)
      const maxS = 3
      if (s.s >  maxS) { s.s =  maxS; s.v = 0 }
      if (s.s < -maxS) { s.s = -maxS; s.v = 0 }
    }

    const { s } = stateRef.current

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    const pulleyX = W / 2
    const pulleyY = 36
    const pulleyR = 18

    // ── Pulley ──
    ctx.beginPath()
    ctx.arc(pulleyX, pulleyY, pulleyR, 0, Math.PI * 2)
    ctx.fillStyle = '#6750A4'
    ctx.fill()
    // pulley axle dot
    ctx.beginPath()
    ctx.arc(pulleyX, pulleyY, 5, 0, Math.PI * 2)
    ctx.fillStyle = '#EADDFF'
    ctx.fill()

    // Ceiling support
    ctx.fillStyle = '#CAC4D0'
    ctx.fillRect(pulleyX - 4, 0, 8, pulleyY - pulleyR)

    // Block dimensions
    const bW = 40
    const bH = (h: number) => 28 + h * 4   // taller block = heavier mass

    // Rope attachment points on pulley bottom
    const leftRopeX  = pulleyX - pulleyR * 0.7
    const rightRopeX = pulleyX + pulleyR * 0.7
    const ropeTopY   = pulleyY + pulleyR

    // Starting Y centres (equilibrium — mid-height of canvas)
    const midY = (H + pulleyY) / 2

    // m1 rises by s*PPM, m2 falls by s*PPM
    const b1Y = midY - s * PPM     // block 1 centre y
    const b2Y = midY + s * PPM     // block 2 centre y

    const b1H = bH(m1)
    const b2H = bH(m2)

    // ── Ropes ──
    ctx.strokeStyle = '#79747E'
    ctx.lineWidth = 2

    // Left rope: pulley → block1 top
    ctx.beginPath()
    ctx.moveTo(leftRopeX, ropeTopY)
    ctx.lineTo(leftRopeX, b1Y - b1H / 2)
    ctx.stroke()

    // Right rope: pulley → block2 top
    ctx.beginPath()
    ctx.moveTo(rightRopeX, ropeTopY)
    ctx.lineTo(rightRopeX, b2Y - b2H / 2)
    ctx.stroke()

    // ── Block 1 (m1, red) — rises when m2 > m1 ──
    ctx.fillStyle = '#F43F5E'
    ctx.beginPath()
    ctx.roundRect(leftRopeX - bW / 2, b1Y - b1H / 2, bW, b1H, 4)
    ctx.fill()
    ctx.fillStyle = '#FFFFFF'
    ctx.font = `bold ${Math.max(10, Math.round(W * 0.035))}px 'Roboto', sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText(`m₁`, leftRopeX, b1Y - 2)
    ctx.font = `${Math.max(9, Math.round(W * 0.03))}px 'Roboto', sans-serif`
    ctx.fillText(`${m1} kg`, leftRopeX, b1Y + 12)

    // ── Block 2 (m2, blue) — falls when m2 > m1 ──
    ctx.fillStyle = '#3B82F6'
    ctx.beginPath()
    ctx.roundRect(rightRopeX - bW / 2, b2Y - b2H / 2, bW, b2H, 4)
    ctx.fill()
    ctx.fillStyle = '#FFFFFF'
    ctx.font = `bold ${Math.max(10, Math.round(W * 0.035))}px 'Roboto', sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText(`m₂`, rightRopeX, b2Y - 2)
    ctx.font = `${Math.max(9, Math.round(W * 0.03))}px 'Roboto', sans-serif`
    ctx.fillText(`${m2} kg`, rightRopeX, b2Y + 12)

    // ── Info panel ──
    const panelX = 10
    const panelY = H - 72
    ctx.fillStyle = 'rgba(103,80,164,0.10)'
    ctx.beginPath()
    ctx.roundRect(panelX, panelY, 170, 62, 8)
    ctx.fill()

    ctx.fillStyle = '#49454F'
    ctx.font = `${Math.max(10, Math.round(W * 0.032))}px 'Roboto', sans-serif`
    ctx.textAlign = 'left'

    const aLabel = Math.abs(a) < 0.001
      ? 'a = 0 (equilibrium)'
      : `a = ${Math.abs(a).toFixed(2)} m/s²`
    ctx.fillText(aLabel, panelX + 10, panelY + 20)
    ctx.fillText(`T = ${T.toFixed(1)} N`, panelX + 10, panelY + 38)
    ctx.fillText(`v = ${Math.abs(stateRef.current.v).toFixed(2)} m/s`, panelX + 10, panelY + 56)
  }, [m1, m2, a, T, isPlaying])

  // Reset state whenever controls change
  stateRef.current = { s: 0, v: 0 }

  return <CanvasEngine {...props} draw={draw} deps={[m1, m2, isPlaying]} animated />
}
