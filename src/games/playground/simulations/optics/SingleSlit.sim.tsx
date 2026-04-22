import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

export function SingleSlitSim(props: SimProps) {
  const { controls } = props
  const a   = controls['a']   ?? 0.2
  const lam = controls['lam'] ?? 600
  const D   = controls['D']   ?? 1.0
  const sinc2 = (x: number) => x === 0 ? 1 : Math.pow(Math.sin(x) / x, 2)
  const beta  = (y: number) => Math.PI * a * 1e-3 * y / (lam * 1e-9 * D)

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H) => {
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#0D1117'; ctx.fillRect(0, 0, W, H)
    // yRange in metres: show ±3 first-minima widths so the pattern always fits.
    // First minimum at y_min = λ_m * D / a_m.
    const y_min_m = (lam * 1e-9 * D) / (a * 1e-3)
    const screenX = Math.min(W, H) * (0.7 * 1.5), scrH = H * 0.85, scrY = H * 0.075, yRange = Math.max(y_min_m * 6, 1e-4), STEPS = 400
    ctx.fillStyle = '#374151'
    ctx.fillRect(Math.min(W, H) * (0.25 * 1.5), 0, 6, H * 0.42); ctx.fillRect(Math.min(W, H) * (0.25 * 1.5), H * 0.58, 6, H)
    for (let i = 0; i <= STEPS; i++) {
      const y = yRange * (i / STEPS - 0.5), I = sinc2(beta(y))
      const wc = lam < 470 ? '138,43,226' : lam < 530 ? '0,0,255' : lam < 580 ? '0,200,0' : lam < 620 ? '255,165,0' : '255,0,0'
      ctx.fillStyle = `rgba(${wc},${I * 0.9})`
      ctx.fillRect(screenX, scrY + (i / STEPS) * scrH, 28, scrH / STEPS + 1)
    }
    ctx.strokeStyle = '#6750A4'; ctx.lineWidth = 2; ctx.beginPath()
    for (let i = 0; i <= STEPS; i++) {
      const y = yRange * (i / STEPS - 0.5), I = sinc2(beta(y))
      const px2 = Math.min(W, H) * (0.4 * 1.5) + I * Math.min(W, H) * (0.26 * 1.5), py2 = scrY + (i / STEPS) * scrH
      i === 0 ? ctx.moveTo(px2, py2) : ctx.lineTo(px2, py2)
    }
    ctx.stroke()
    const fs = Math.max(9, Math.round(Math.min(W, H) * (0.026 * 1.5)))
    ctx.fillStyle = '#E6EDF3'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'left'
    ctx.fillText(`a=${a}mm  λ=${lam}nm  D=${D}m`, 8, 18)
    const minima = (lam * 1e-9 * D) / (a * 1e-3)
    ctx.fillText(`1st min: y = ±${(minima * 1000).toFixed(1)} mm`, 8, 34)
  }, [a, lam, D, sinc2, beta])
  return <CanvasEngine {...props} draw={draw} deps={[a, lam, D]} />
}
