import { useCallback } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/**
 * Stress–Strain — Interactive stress-strain curve for a material.
 * Shows elastic region, plastic region, yield point, UTS, fracture point.
 */
export function StressStrainSim(props: SimProps) {
  const { controls } = props
  const E      = controls['E']      ?? 200e3   // Young's modulus (MPa → use kN/mm² scale)
  const sigma_y = controls['sigma_y'] ?? 250    // Yield stress MPa
  const sigma_uts= controls['sigma_uts'] ?? 400  // UTS MPa
  const epsilon_f= controls['eps_f'] ?? 0.30    // Fracture strain

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H) => {
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    const padL = 72, padB = 52, padT = 40, padR = 24
    const gW = W - padL - padR
    const gH = H - padT - padB
    const ox = padL, oy = H - padB

    // Axes
    ctx.strokeStyle = '#1C1B1F'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + gW, oy); ctx.stroke()  // x
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox, oy - gH); ctx.stroke()  // y

    // Axis labels
    const fs = Math.max(10, Math.round(Math.min(W, H) * (0.028 * 1.5)))
    ctx.fillStyle = '#1C1B1F'
    ctx.font = `${fs}px 'Roboto', sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText('Strain ε', ox + gW / 2, oy + 38)
    ctx.save()
    ctx.translate(padL - 44, oy - gH / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('Stress σ (MPa)', 0, 0)
    ctx.restore()

    // Tick labels
    const sigMax = sigma_uts * 1.15
    const epsMax = epsilon_f * 1.12

    for (let i = 0; i <= 5; i++) {
      const sv = (sigMax * i / 5).toFixed(0)
      const sy = oy - (sigMax * i / 5 / sigMax) * gH
      ctx.fillStyle = '#49454F'
      ctx.font = `${Math.max(9, fs - 1)}px 'Roboto', sans-serif`
      ctx.textAlign = 'right'
      ctx.fillText(sv, ox - 5, sy + 4)
      ctx.strokeStyle = '#CAC4D040'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(ox, sy); ctx.lineTo(ox + gW, sy); ctx.stroke()

      const ev = (epsMax * i / 5 * 100).toFixed(1) + '%'
      const ex = ox + (epsMax * i / 5 / epsMax) * gW
      ctx.fillStyle = '#49454F'
      ctx.textAlign = 'center'
      ctx.fillText(ev, ex, oy + 16)
    }

    // ── Stress-Strain Curve ──
    // Key strain points
    const eps_y = sigma_y / E                // yield strain (elastic limit)
    const eps_uts = eps_y + (epsilon_f - eps_y) * 0.45   // ~ where UTS occurs

    const toX = (eps: number) => ox + (eps / epsMax) * gW
    const toY = (sig: number) => oy - (sig / sigMax) * gH

    ctx.lineWidth = 3
    ctx.strokeStyle = '#6750A4'
    ctx.beginPath()

    // Elastic linear region
    ctx.moveTo(toX(0), toY(0))
    ctx.lineTo(toX(eps_y), toY(sigma_y))

    // Plastic yielding (gentle knee)
    const steps = 80
    for (let i = 0; i <= steps; i++) {
      const frac = i / steps
      const eps  = eps_y + frac * (eps_uts - eps_y)
      // Smooth plastic region: starts at sigma_y, rises to sigma_uts with sqrt curve
      const sig  = sigma_y + (sigma_uts - sigma_y) * Math.sqrt(frac)
      ctx.lineTo(toX(eps), toY(sig))
    }
    // Necking and fracture (fall)
    for (let i = 0; i <= 30; i++) {
      const frac = i / 30
      const eps  = eps_uts + frac * (epsilon_f - eps_uts)
      const sig  = sigma_uts - (sigma_uts - sigma_y * 0.6) * (frac * frac)
      ctx.lineTo(toX(eps), toY(sig))
    }
    ctx.stroke()

    // ── Key point markers ──
    const keyPts = [
      { eps: eps_y,       sig: sigma_y,     label: `Yield\n${sigma_y} MPa`,  color: '#10B981' },
      { eps: eps_uts,     sig: sigma_uts,   label: `UTS\n${sigma_uts} MPa`,  color: '#F59E0B' },
      { eps: epsilon_f,   sig: sigma_y*0.6, label: `Fracture`,               color: '#F43F5E' },
    ]
    keyPts.forEach(({ eps, sig, label, color }) => {
      const px = toX(eps), py = toY(sig)
      ctx.fillStyle = color
      ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill()
      // dashed lines
      ctx.strokeStyle = color + '80'
      ctx.lineWidth = 1
      ctx.setLineDash([3, 3])
      ctx.beginPath(); ctx.moveTo(ox, py); ctx.lineTo(px, py); ctx.moveTo(px, oy); ctx.lineTo(px, py); ctx.stroke()
      ctx.setLineDash([])
      // label
      ctx.fillStyle = color
      ctx.font = `bold ${Math.max(9, fs - 1)}px 'Roboto', sans-serif`
      if (px - ox < 30) {
        ctx.textAlign = 'left'
        label.split('\n').forEach((ln, i) => ctx.fillText(ln, px + 8, py - 4 - i * 14))
      } else {
        ctx.textAlign = 'center'
        label.split('\n').forEach((ln, i) => ctx.fillText(ln, px, py - 12 - i * 14))
      }
    })

    // Region labels
    const elasticMid = toX(eps_y / 2)
    ctx.fillStyle = '#6750A440'
    ctx.fillRect(ox, oy - gH, toX(eps_y) - ox, gH)
    ctx.fillStyle = '#6750A4'
    ctx.font = `bold ${Math.max(9, fs - 2)}px 'Roboto', sans-serif`
    if (toX(eps_y) - ox < 40) {
      ctx.textAlign = 'left'
      ctx.fillText('Elastic', toX(eps_y) + 4, oy - gH * 0.85)
    } else {
      ctx.textAlign = 'center'
      ctx.fillText('Elastic', elasticMid, oy - gH * 0.85)
    }

    // E label
    ctx.fillStyle = '#3B82F6'
    ctx.font = `${fs}px 'Roboto', sans-serif`
    ctx.textAlign = 'left'
    ctx.fillText(`E = ${(E / 1000).toFixed(0)} GPa`, toX(eps_y) + 8, toY(sigma_y * 0.5) + 4)
  }, [E, sigma_y, sigma_uts, epsilon_f])

  return <CanvasEngine {...props} draw={draw} deps={[E, sigma_y, sigma_uts, epsilon_f]} />
}
