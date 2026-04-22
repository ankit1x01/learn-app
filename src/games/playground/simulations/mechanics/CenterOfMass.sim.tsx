import { useCallback } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

interface Particle {
  x: number   // fractional [0,1]
  m: number   // kg
  color: string
}

const COLORS = ['#6750A4', '#F43F5E', '#10B981', '#F59E0B']

export function CenterOfMassSim(props: SimProps) {
  const { controls } = props
  const m1 = controls['m1'] ?? 3
  const m2 = controls['m2'] ?? 5
  const m3 = controls['m3'] ?? 2
  const m4 = controls['m4'] ?? 4

  const particles: Particle[] = [
    { x: 0.15, m: m1, color: COLORS[0] },
    { x: 0.38, m: m2, color: COLORS[1] },
    { x: 0.60, m: m3, color: COLORS[2] },
    { x: 0.82, m: m4, color: COLORS[3] },
  ]

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H) => {
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    const axisY   = H * 0.55
    const axisX0  = Math.min(W, H) * (0.06 * 1.5)
    const axisLen = Math.min(W, H) * (0.88 * 1.5)

    // Axis line
    ctx.strokeStyle = '#CAC4D0'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(axisX0, axisY); ctx.lineTo(axisX0 + axisLen, axisY); ctx.stroke()

    // Tick marks every 10%
    ctx.strokeStyle = '#CAC4D080'
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      const tx = axisX0 + axisLen * i * 0.1
      ctx.beginPath(); ctx.moveTo(tx, axisY - 6); ctx.lineTo(tx, axisY + 6); ctx.stroke()
      ctx.fillStyle = '#79747E'
      ctx.font = `${Math.max(9, Math.round(Math.min(W, H) * (0.027 * 1.5)))}px 'Roboto', sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText(`${i}`, tx, axisY + 18)
    }

    const totalM = particles.reduce((s, p) => s + p.m, 0)
    const xCOM   = particles.reduce((s, p) => s + p.m * p.x * 10, 0) / totalM  // in units

    // Draw particles
    particles.forEach(({ x, m, color }) => {
      const px  = axisX0 + x * axisLen
      const r   = Math.sqrt(m) * 9 + 6

      const grad = ctx.createRadialGradient(px, axisY - r - 2, 0, px, axisY - r - 2, r)
      grad.addColorStop(0, color + 'cc')
      grad.addColorStop(1, color)
      ctx.fillStyle = grad
      ctx.beginPath(); ctx.arc(px, axisY - r - 2, r, 0, Math.PI * 2); ctx.fill()

      ctx.fillStyle = '#FFFFFF'
      ctx.font = `bold ${Math.max(9, Math.round(Math.min(W, H) * (0.028 * 1.5)))}px 'Roboto', sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText(`${m}kg`, px, axisY - r + 5)

      // vertical line to axis
      ctx.strokeStyle = color + '80'
      ctx.lineWidth = 1.5
      ctx.setLineDash([3, 3])
      ctx.beginPath(); ctx.moveTo(px, axisY - 2); ctx.lineTo(px, axisY - r * 2); ctx.stroke()
      ctx.setLineDash([])
    })

    // COM marker
    const comPx = axisX0 + (xCOM / 10) * axisLen
    ctx.strokeStyle = '#F59E0B'
    ctx.lineWidth   = 2.5
    ctx.setLineDash([4, 3])
    ctx.beginPath(); ctx.moveTo(comPx, axisY - 60); ctx.lineTo(comPx, axisY + 12); ctx.stroke()
    ctx.setLineDash([])

    // COM diamond
    ctx.fillStyle = '#F59E0B'
    ctx.beginPath()
    ctx.moveTo(comPx, axisY + 18)
    ctx.lineTo(comPx - 7, axisY + 10)
    ctx.lineTo(comPx, axisY + 2)
    ctx.lineTo(comPx + 7, axisY + 10)
    ctx.closePath(); ctx.fill()

    // Annotation
    const fs = Math.max(11, Math.round(Math.min(W, H) * (0.032 * 1.5)))
    ctx.fillStyle = '#F59E0B'
    ctx.font = `bold ${fs}px 'Roboto', sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText(`x_cm = ${xCOM.toFixed(2)}`, comPx, axisY - 68)

    // Formula box
    ctx.fillStyle = '#EADDFF'
    ctx.beginPath(); ctx.roundRect(axisX0, 10, Math.min(W, H) * (0.45 * 1.5), 36, 8); ctx.fill()
    ctx.fillStyle = '#21005D'
    ctx.font = `${Math.max(10, Math.round(Math.min(W, H) * (0.028 * 1.5)))}px 'Roboto', sans-serif`
    ctx.textAlign = 'left'
    ctx.fillText(
      `x_cm = Σ(mᵢxᵢ)/Σmᵢ  |  M = ${totalM} kg`,
      axisX0 + 10, 32
    )
  }, [m1, m2, m3, m4, particles])

  return <CanvasEngine {...props} draw={draw} deps={[m1, m2, m3, m4]} />
}
