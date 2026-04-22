import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/**
 * Relative Motion — Two objects (A and B) moving in 1D.
 * Shows velocity vectors, relative velocity, and displacement in ground frame and B's frame.
 */
export function RelativeMotionSim(props: SimProps) {
  const { controls, isPlaying } = props
  const vA = controls['vA'] ?? 15   // velocity of A (m/s)
  const vB = controls['vB'] ?? 8    // velocity of B (m/s)

  const timeRef = useRef(0)

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    if (isPlaying) timeRef.current += dt
    const t = Math.min(timeRef.current, 6)

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    const axisY   = H * 0.52
    const axisX0  = Math.min(W, H) * (0.06 * 1.5)
    const axisLen = Math.min(W, H) * (0.88 * 1.5)
    const scale   = axisLen / 120   // 120 m total range

    // Ground axis
    ctx.strokeStyle = '#CAC4D0'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(axisX0, axisY); ctx.lineTo(axisX0 + axisLen, axisY); ctx.stroke()

    // Origin marker
    ctx.fillStyle = '#79747E'
    ctx.font = `${Math.max(9, Math.round(Math.min(W, H) * (0.026 * 1.5)))}px 'Roboto', sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText('O', axisX0, axisY + 16)

    // Positions
    const xA = Math.min(vA * t, 110)
    const xB = Math.min(vB * t, 110)

    const drawObject = (x: number, color: string, label: string, v: number, row: number) => {
      const px = axisX0 + x * scale
      const cy2 = axisY - 24 - row * 52

      // Body
      const grad = ctx.createRadialGradient(px, cy2, 0, px, cy2, 14)
      grad.addColorStop(0, color + 'cc')
      grad.addColorStop(1, color)
      ctx.fillStyle = grad
      ctx.beginPath(); ctx.arc(px, cy2, 14, 0, Math.PI * 2); ctx.fill()

      ctx.fillStyle = '#FFFFFF'
      ctx.font = `bold ${Math.max(11, Math.round(Math.min(W, H) * (0.032 * 1.5)))}px 'Roboto', sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText(label, px, cy2 + 5)

      // Velocity arrow
      const arrowLen = v * 2.5
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(px + 14, cy2); ctx.lineTo(px + 14 + arrowLen, cy2); ctx.stroke()
      // arrowhead
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(px + 14 + arrowLen, cy2)
      ctx.lineTo(px + 14 + arrowLen - 8, cy2 - 4)
      ctx.lineTo(px + 14 + arrowLen - 8, cy2 + 4)
      ctx.closePath(); ctx.fill()

      // velocity label
      ctx.fillStyle = color
      ctx.font = `${Math.max(9, Math.round(Math.min(W, H) * (0.026 * 1.5)))}px 'Roboto', sans-serif`
      ctx.textAlign = 'left'
      ctx.fillText(`v = ${v} m/s`, px + 14 + arrowLen + 4, cy2 + 4)

      // Dashed drop line to axis
      ctx.strokeStyle = color + '60'
      ctx.lineWidth = 1
      ctx.setLineDash([3, 3])
      ctx.beginPath(); ctx.moveTo(px, cy2 + 14); ctx.lineTo(px, axisY); ctx.stroke()
      ctx.setLineDash([])

      // Position label
      const labelY = axisY + 16 + (row * 14)
      ctx.fillStyle = '#49454F'
      ctx.font = `${Math.max(9, Math.round(Math.min(W, H) * (0.026 * 1.5)))}px 'Roboto', sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText(`x${label} = ${x.toFixed(1)} m`, px, labelY)
    }

    drawObject(xA, '#6750A4', 'A', vA, 1)
    drawObject(xB, '#F43F5E', 'B', vB, 0)

    // ── Info panel ──
    const vRel = vA - vB
    const xRel = xA - xB
    const fs   = Math.max(10, Math.round(Math.min(W, H) * (0.028 * 1.5)))

    const rows = [
      { label: 'v_A (ground frame)', value: `${vA} m/s` },
      { label: 'v_B (ground frame)', value: `${vB} m/s` },
      { label: 'v_A/B (rel. to B)',  value: `${vRel.toFixed(1)} m/s` },
      { label: 'x_A − x_B',         value: `${xRel.toFixed(2)} m` },
      { label: 't',                  value: `${t.toFixed(1)} s` },
    ]

    const panelX = axisX0
    const boxHeight = rows.length * (fs + 7) + 14
    const panelY = Math.min(H * 0.73, H - boxHeight - 10)

    ctx.fillStyle = '#EADDFF'
    ctx.beginPath(); ctx.roundRect(panelX, panelY, Math.min(W, H) * (0.94 * 1.5), boxHeight, 10); ctx.fill()

    rows.forEach(({ label, value }, i) => {
      const ry = panelY + 12 + i * (fs + 7) + fs * 0.8
      ctx.fillStyle = '#49454F'
      ctx.font = `${fs}px 'Roboto', sans-serif`
      ctx.textAlign = 'left'
      ctx.fillText(label, panelX + 10, ry)
      ctx.fillStyle = '#21005D'
      ctx.font = `bold ${fs}px 'Roboto', sans-serif`
      ctx.textAlign = 'right'
      ctx.fillText(value, panelX + Math.min(W, H) * (0.94 * 1.5) - 8, ry)
    })
  }, [vA, vB, isPlaying])

  // Reset on control change
  timeRef.current = 0

  return <CanvasEngine {...props} draw={draw} deps={[vA, vB, isPlaying]} animated />
}
