import { useCallback } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/** Gauss Law — field lines through a Gaussian surface around charges */
export function GaussSphereSim(props: SimProps) {
  const { controls } = props
  const Q  = controls['Q'] ?? 2   // µC
  const r  = controls['r'] ?? 0.1 // m (sphere radius)

  const eps0 = 8.854e-12
  const E = (Q * 1e-6) / (4 * Math.PI * eps0 * r * r)   // V/m
  const flux = (Q * 1e-6) / eps0

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H) => {
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'; ctx.fillRect(0, 0, W, H)
    const cx = Math.min(W, H) * (0.45 * 1.5), cy = H * 0.47, fs = Math.max(10, Math.round(Math.min(W, H) * (0.028 * 1.5)))
    const surfR = Math.min(W, H) * 0.32
    const chargeR = 10

    // Gaussian surface
    ctx.strokeStyle = '#6750A4'; ctx.lineWidth = 2; ctx.setLineDash([6, 4])
    ctx.beginPath(); ctx.arc(cx, cy, surfR, 0, Math.PI * 2); ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = '#6750A410'
    ctx.beginPath(); ctx.arc(cx, cy, surfR, 0, Math.PI * 2); ctx.fill()

    // Charge
    const positive = Q > 0
    const chargeGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, chargeR)
    chargeGrad.addColorStop(0, positive ? '#FEE2E2' : '#DBEAFE')
    chargeGrad.addColorStop(1, positive ? '#F43F5E' : '#3B82F6')
    ctx.fillStyle = chargeGrad
    ctx.beginPath(); ctx.arc(cx, cy, chargeR, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#FFF'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(positive ? '+' : '−', cx, cy + 5)
    ctx.fillStyle = '#49454F'; ctx.font = `${fs}px 'Roboto', sans-serif`
    ctx.fillText(`Q=${Q}µC`, cx, cy + chargeR + fs + 4)

    // Field lines radiating out
    const nLines = 12
    for (let i = 0; i < nLines; i++) {
      const angle = (i / nLines) * 2 * Math.PI
      const ex = cx + surfR * 1.1 * Math.cos(angle)
      const ey = cy + surfR * 1.1 * Math.sin(angle)
      ctx.strokeStyle = positive ? '#F43F5E' : '#3B82F6'; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.moveTo(cx + chargeR * Math.cos(angle), cy + chargeR * Math.sin(angle))
      ctx.lineTo(ex, ey); ctx.stroke()
      // Arrowhead
      ctx.fillStyle = positive ? '#F43F5E' : '#3B82F6'
      const dir = positive ? 1 : -1
      ctx.beginPath()
      ctx.moveTo(ex, ey)
      ctx.lineTo(ex - dir * 8 * Math.cos(angle - 0.4), ey - dir * 8 * Math.sin(angle - 0.4))
      ctx.lineTo(ex - dir * 8 * Math.cos(angle + 0.4), ey - dir * 8 * Math.sin(angle + 0.4))
      ctx.closePath(); ctx.fill()
    }

    // Labels
    ctx.fillStyle = '#6750A4'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText('Gaussian Surface (r)', cx, cy - surfR - 10)

    // Info panel
    const infoX = Math.min(W, H) * (0.72 * 1.5), infoY = H * 0.18, infoW = Math.min(W, H) * (0.24 * 1.5)
    const rows = [
      { l: 'Q',     v: `${Q} µC`                        },
      { l: 'r',     v: `${r} m`                         },
      { l: 'E',     v: `${(E / 1000).toFixed(1)} kV/m`  },
      { l: 'Φ',     v: `${(flux).toExponential(2)} Nm²/C` },
    ]
    ctx.fillStyle = '#EADDFF'
    ctx.beginPath(); ctx.roundRect(infoX, infoY, infoW, rows.length * (fs + 8) + 14, 10); ctx.fill()
    rows.forEach(({ l, v }, i) => {
      const ry = infoY + 12 + i * (fs + 8) + fs * 0.85
      ctx.fillStyle = '#49454F'; ctx.font = `${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'left'; ctx.fillText(l, infoX + 8, ry)
      ctx.fillStyle = '#6750A4'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'right'; ctx.fillText(v, infoX + infoW - 6, ry)
    })

    ctx.fillStyle = '#EADDFF'
    ctx.beginPath(); ctx.roundRect(8, H - 28, W - 16, 22, 6); ctx.fill()
    ctx.fillStyle = '#21005D'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(`∮E·dA = Q/ε₀ = ${flux.toExponential(2)} Vm  |  E = ${(E / 1000).toFixed(1)} kV/m`, W / 2, H - 12)
  }, [Q, r, E, flux])

  return <CanvasEngine {...props} draw={draw} deps={[Q, r]} />
}
