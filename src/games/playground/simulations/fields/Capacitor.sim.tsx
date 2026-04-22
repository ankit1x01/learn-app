import { useCallback } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/** Capacitor — parallel plate capacitor with charge, E-field lines, energy stored */
export function CapacitorSim(props: SimProps) {
  const { controls } = props
  const V    = controls['V']    ?? 12    // volts
  const d    = controls['d']    ?? 0.01  // plate separation m
  const A    = controls['A']    ?? 0.04  // plate area m²
  const k_di = controls['k']    ?? 1     // dielectric constant

  const eps0 = 8.854e-12
  const C    = k_di * eps0 * A / d       // Farads
  const E    = V / d                     // V/m
  const Q    = C * V                     // Coulombs
  const U    = 0.5 * C * V * V          // Joules

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H) => {
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'; ctx.fillRect(0, 0, W, H)

    const pW = Math.min(W, H) * (0.55 * 1.5), pH = H * 0.1, pGap = Math.min(H * 0.45, d * 8000)
    const px0 = Math.min(W, H) * (0.2 * 1.5), topY = H * 0.22, botY = topY + pGap

    // Plates
    ctx.fillStyle = '#6750A4'
    ctx.beginPath(); ctx.roundRect(px0, topY, pW, pH, 4); ctx.fill()
    ctx.fillStyle = '#3B82F6'
    ctx.beginPath(); ctx.roundRect(px0, botY, pW, pH, 4); ctx.fill()

    // + and − labels
    const fs = Math.max(11, Math.round(Math.min(W, H) * (0.032 * 1.5)))
    ctx.fillStyle = '#FFFFFF'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText('+  +  +  +  +', px0 + pW / 2, topY + pH * 0.7)
    ctx.fillText('−  −  −  −  −', px0 + pW / 2, botY + pH * 0.7)

    // E-field lines
    const nLines = 7
    ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 1.5
    for (let i = 0; i < nLines; i++) {
      const lx = px0 + 20 + i * (pW - 40) / (nLines - 1)
      ctx.beginPath(); ctx.moveTo(lx, topY + pH); ctx.lineTo(lx, botY); ctx.stroke()
      // Arrowhead
      ctx.fillStyle = '#F59E0B'
      const midY = (topY + pH + botY) / 2
      ctx.beginPath(); ctx.moveTo(lx, midY + 6); ctx.lineTo(lx - 4, midY - 2); ctx.lineTo(lx + 4, midY - 2); ctx.closePath(); ctx.fill()
    }

    // E label
    ctx.fillStyle = '#F59E0B'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'right'
    ctx.fillText(`E = ${(E / 1000).toFixed(1)} kV/m`, px0 - 6, (topY + pH + botY) / 2 + 4)

    // Voltage wire
    ctx.strokeStyle = '#1C1B1F'; ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(px0, topY + pH / 2)
    ctx.lineTo(px0 - 30, topY + pH / 2)
    ctx.lineTo(px0 - 30, botY + pH / 2)
    ctx.lineTo(px0, botY + pH / 2)
    ctx.stroke()
    ctx.fillStyle = '#1C1B1F'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(`${V}V`, px0 - 30, (topY + botY) / 2 + 4)

    // Info panel
    const infoX = px0 + pW + 16, infoW = W - infoX - 8, infoY = topY
    const rows = [
      { l: 'C',  v: `${(C * 1e12).toFixed(2)} pF` },
      { l: 'Q',  v: `${(Q * 1e9).toFixed(2)} nC`  },
      { l: 'E',  v: `${(E / 1000).toFixed(1)} kV/m`},
      { l: 'U',  v: `${(U * 1e9).toFixed(2)} nJ`  },
      { l: 'κ',  v: `${k_di}`                      },
    ]
    ctx.fillStyle = '#EADDFF'
    ctx.beginPath(); ctx.roundRect(infoX, infoY, infoW, rows.length * (fs + 8) + 14, 10); ctx.fill()
    rows.forEach(({ l, v }, i) => {
      const ry = infoY + 12 + i * (fs + 8) + fs * 0.85
      ctx.fillStyle = '#49454F'; ctx.font = `${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'left'; ctx.fillText(l, infoX + 8, ry)
      ctx.fillStyle = '#6750A4'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'right'; ctx.fillText(v, infoX + infoW - 6, ry)
    })

    // Bottom formula bar
    ctx.fillStyle = '#EADDFF'
    ctx.beginPath(); ctx.roundRect(8, H - 30, W - 16, 24, 6); ctx.fill()
    ctx.fillStyle = '#21005D'; ctx.font = `bold ${Math.max(9, fs - 1)}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(`C = κε₀A/d = ${(C * 1e12).toFixed(2)} pF  |  U = ½CV² = ${(U * 1e9).toFixed(2)} nJ`, W / 2, H - 14)
  }, [V, d, A, k_di, C, E, Q, U])

  return <CanvasEngine {...props} draw={draw} deps={[V, d, A, k_di]} />
}
