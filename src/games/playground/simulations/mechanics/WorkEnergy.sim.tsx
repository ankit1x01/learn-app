import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

export function WorkEnergySim(props: SimProps) {
  const { controls, isPlaying } = props
  const mass     = controls['mass']     ?? 2    // kg
  const height   = controls['height']   ?? 5    // metres (initial height)
  const applied  = controls['force']    ?? 10   // N (horizontal applied force)

  const timeRef = useRef(0)
  // State: position y (downward from top), velocity
  const stateRef = useRef({ y: 0, v: 0 })

  const g = 9.81
  const maxH = height   // total drop height in metres
  const PPM  = 40       // pixels per metre

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    if (isPlaying) {
      timeRef.current += dt
      const s = stateRef.current
      // Net downward acceleration: gravity pulls down, applied force pushes up
      const a_net = g - applied / mass
      s.v += a_net * dt
      s.y += s.v * dt
      if (s.y >= maxH) { s.y = maxH; s.v = 0 }   // hit ground
    }

    const { y, v } = stateRef.current

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    // ── Ball drop column ──
    const colX  = Math.min(W, H) * (0.25 * 1.5)
    const groundY = H - 48
    const startY  = groundY - maxH * PPM

    // Height shaft
    ctx.strokeStyle = '#CAC4D0'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 4])
    ctx.beginPath(); ctx.moveTo(colX, startY); ctx.lineTo(colX, groundY); ctx.stroke()
    ctx.setLineDash([])

    // Ground line
    ctx.fillStyle = '#CAC4D0'
    ctx.fillRect(colX - 30, groundY, 60, 6)

    // Ball
    const ballY = startY + y * PPM
    const grad  = ctx.createRadialGradient(colX, ballY, 0, colX, ballY, 12)
    grad.addColorStop(0, '#EADDFF')
    grad.addColorStop(1, '#6750A4')
    ctx.fillStyle = grad
    ctx.beginPath(); ctx.arc(colX, ballY, 12, 0, Math.PI * 2); ctx.fill()

    // height label
    const rem = maxH - y
    ctx.fillStyle = '#49454F'
    ctx.font = `bold ${Math.max(10, Math.round(Math.min(W, H) * (0.032 * 1.5)))}px 'Roboto', sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText(`h = ${rem.toFixed(2)} m`, colX, groundY + 24)

    // ── Energy bars ──
    const KE  = 0.5 * mass * v * v
    const PE  = mass * g * (maxH - y)
    const W_applied = -applied * y  // applied force is upward; displacement is downward → negative work
    const TE  = KE + PE

    const maxE  = mass * g * maxH + 1e-6
    const barW  = Math.max(20, (Math.min(W, H) * (0.55 * 1.5) - 40) / 3)
    const barH  = groundY - startY
    const barX0 = colX + 55

    const bars = [
      { label: 'KE', value: KE,  color: '#F43F5E' },
      { label: 'PE', value: PE,  color: '#3B82F6' },
      { label: 'TE', value: TE,  color: '#10B981' },
    ]

    bars.forEach(({ label, value, color }, i) => {
      const bx = barX0 + i * (barW + 12)
      const bh = (value / maxE) * barH
      const by = groundY - bh

      // bar background
      ctx.fillStyle = '#F4EFF4'
      ctx.beginPath()
      ctx.roundRect(bx, startY, barW, barH, 6)
      ctx.fill()

      // bar fill
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.roundRect(bx, by, barW, bh, 6)
      ctx.fill()

      // label
      ctx.fillStyle = '#1C1B1F'
      ctx.font = `bold ${Math.max(10, Math.round(Math.min(W, H) * (0.03 * 1.5)))}px 'Roboto', sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText(label, bx + barW / 2, groundY + 20)
      ctx.fillStyle = '#49454F'
      ctx.font = `${Math.max(9, Math.round(Math.min(W, H) * (0.027 * 1.5)))}px 'Roboto', sans-serif`
      ctx.fillText(`${value.toFixed(1)} J`, bx + barW / 2, groundY + 36)
    })

    // ── Formula panel ──
    const fs2 = Math.max(9, Math.round(Math.min(W, H) * (0.027 * 1.5)))
    const W_gravity = mass * g * y        // mgh fallen so far
    const W_net     = KE                   // W_net = ΔKE (from rest), work-energy theorem
    const formulaLines = [
      { text: `W_gravity = mgh = ${W_gravity.toFixed(1)} J`,  color: '#3B82F6' },
      { text: `W_applied = F·d = ${W_applied.toFixed(1)} J`,  color: '#7965AF' },
      { text: `KE = ½mv²  = ${KE.toFixed(1)} J`,             color: '#F43F5E' },
      { text: `W_net = ΔKE = ${W_net.toFixed(1)} J`,         color: '#10B981' },
    ]
    const fLineH = fs2 + 6
    const fPadX = 10, fPadY = 8
    const fBoxW = 220, fBoxH = formulaLines.length * fLineH + fPadY * 2
    const fBoxX = barX0, fBoxY = startY - fBoxH - 6

    ctx.fillStyle = '#EDE8F5'
    ctx.beginPath(); ctx.roundRect(fBoxX, fBoxY, fBoxW, fBoxH, 6); ctx.fill()

    formulaLines.forEach(({ text, color }, i) => {
      ctx.fillStyle = color
      ctx.font = `bold ${fs2}px 'Roboto', sans-serif`
      ctx.textAlign = 'left'
      ctx.fillText(text, fBoxX + fPadX, fBoxY + fPadY + i * fLineH + fs2 * 0.9)
    })

    // Work-energy theorem note
    ctx.fillStyle = '#49454F'
    ctx.font = `${fs2}px 'Roboto', sans-serif`
    ctx.textAlign = 'left'
    ctx.fillText(`v = ${v.toFixed(2)} m/s`, colX + 18, ballY + 22)
  }, [mass, height, applied, isPlaying, maxH])

  // Reset state on control change
  stateRef.current = { y: 0, v: 0 }
  timeRef.current  = 0

  return <CanvasEngine {...props} draw={draw} deps={[mass, height, applied, isPlaying]} animated />
}
