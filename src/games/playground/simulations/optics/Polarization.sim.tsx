import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

export function PolarizationSim(props: SimProps) {
  const { controls, isPlaying } = props
  const theta = controls['theta'] ?? 45
  const I0 = controls['I0'] ?? 100
  const tRad = theta * Math.PI / 180
  const I_out = I0 * Math.cos(tRad) ** 2
  const phaseRef = useRef(0)

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    if (isPlaying) phaseRef.current += dt * 2
    const t = phaseRef.current
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0D1117'; ctx.fillRect(0, 0, W, H)
    const cy = H / 2, fs = Math.max(9, Math.round(Math.min(W, H) * (0.026 * 1.5)))
    ctx.strokeStyle = '#FDE68A30'; ctx.lineWidth = 8
    ctx.beginPath(); ctx.moveTo(Math.min(W, H) * (0.05 * 1.5), cy); ctx.lineTo(Math.min(W, H) * (0.95 * 1.5), cy); ctx.stroke()
    const stages = [
      { x: Math.min(W, H) * (0.22 * 1.5), label: 'Unpolarized' }, { x: Math.min(W, H) * (0.5 * 1.5), label: 'Polarizer (0°)' },
      { x: Math.min(W, H) * (0.75 * 1.5), label: `Analyzer (${theta}°)` },
    ]
    stages.forEach(({ x, label }) => {
      ctx.fillStyle = '#1F2937'
      ctx.beginPath(); ctx.roundRect(x - 16, cy - 40, 32, 80, 4); ctx.fill()
      ctx.strokeStyle = '#6750A4'; ctx.lineWidth = 2
      ctx.beginPath(); ctx.roundRect(x - 16, cy - 40, 32, 80, 4); ctx.stroke()
      ctx.fillStyle = '#94A3B8'; ctx.font = `${Math.max(8, fs - 1)}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
      ctx.fillText(label, x, cy + 54)
    })
    // Vibrations
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 6 + t * 0.5
      ctx.strokeStyle = '#FDE68A60'; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.moveTo(Math.min(W, H) * (0.35 * 1.5) - 20 * Math.cos(a), cy - 20 * Math.sin(a))
      ctx.lineTo(Math.min(W, H) * (0.35 * 1.5) + 20 * Math.cos(a), cy + 20 * Math.sin(a)); ctx.stroke()
    }
    ctx.strokeStyle = '#FDE68A'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(Math.min(W, H) * (0.62 * 1.5) - 22, cy); ctx.lineTo(Math.min(W, H) * (0.62 * 1.5) + 22, cy); ctx.stroke()
    const outLen = I_out / I0 * 22
    ctx.strokeStyle = '#10B981'; ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(Math.min(W, H) * (0.87 * 1.5) - outLen * Math.cos(tRad), cy - outLen * Math.sin(tRad))
    ctx.lineTo(Math.min(W, H) * (0.87 * 1.5) + outLen * Math.cos(tRad), cy + outLen * Math.sin(tRad)); ctx.stroke()
    ctx.fillStyle = '#10B981'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(`I = ${I_out.toFixed(1)}`, Math.min(W, H) * (0.87 * 1.5), cy + 24)
    ctx.fillStyle = '#13202F'; ctx.beginPath(); ctx.roundRect(8, 8, W - 16, 28, 8); ctx.fill()
    ctx.fillStyle = '#E6EDF3'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(`Malus's Law: I = I₀cos²θ = ${I0}×cos²(${theta}°) = ${I_out.toFixed(1)}`, W / 2, 24)
  }, [theta, I0, tRad, I_out, isPlaying])

  return <CanvasEngine {...props} draw={draw} deps={[theta, I0, isPlaying]} animated />
}
