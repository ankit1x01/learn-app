import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

export function WaveSuperpositionSim(props: SimProps) {
  const { controls, isPlaying } = props
  const A1 = controls['A1'] ?? 1, A2 = controls['A2'] ?? 0.8
  const f1 = controls['f1'] ?? 2, f2 = controls['f2'] ?? 3
  const phi = controls['phi'] ?? 0
  const phiRad = phi * Math.PI / 10
  const timeRef = useRef(0)

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    if (isPlaying) timeRef.current += dt * 0.5
    const t = timeRef.current
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#FFFBFE'; ctx.fillRect(0, 0, W, H)
    const padX = 20, gH = (H - 80) / 3 - 8, fs = Math.max(10, Math.round(Math.min(W, H) * (0.026 * 1.5)))
    const Amax = A1 + A2 + 0.01

    // Phase-aware resultant amplitude: A_res = sqrt(A1²+A2²+2·A1·A2·cos(φ))
    const A_res = Math.sqrt(A1 * A1 + A2 * A2 + 2 * A1 * A2 * Math.cos(phiRad))
    const isConstructive = A_res >= (A1 + A2) * 0.97
    const isDestructive  = A_res <= Math.abs(A1 - A2) * 1.03 + 0.01
    const interferenceLabel = isConstructive ? 'Constructive' : isDestructive ? 'Destructive' : 'Partial'
    const interferenceColor = isConstructive ? '#10B981' : isDestructive ? '#F43F5E' : '#F59E0B'

    const waves = [
      { fn: (x: number) => A1 * Math.sin(2 * Math.PI * f1 * x - t), color: '#6750A4', label: `y₁  A=${A1}  f=${f1}Hz` },
      { fn: (x: number) => A2 * Math.sin(2 * Math.PI * f2 * x - t + phiRad), color: '#F43F5E', label: `y₂  A=${A2}  f=${f2}Hz` },
      { fn: (x: number) => A1 * Math.sin(2 * Math.PI * f1 * x - t) + A2 * Math.sin(2 * Math.PI * f2 * x - t + phiRad), color: '#10B981', label: `y₁+y₂  A_res=${A_res.toFixed(2)}` },
    ]
    waves.forEach(({ fn, color, label }, ri) => {
      const gY = 28 + ri * (gH + 12), mid = gY + gH / 2
      ctx.fillStyle = '#F4EFF4'; ctx.beginPath(); ctx.roundRect(padX, gY, W - padX * 2, gH, 6); ctx.fill()
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath()
      for (let i = 0; i <= 400; i++) {
        const x = i / 400
        i === 0 ? ctx.moveTo(padX + x * (W - padX * 2), mid - (fn(x) / Amax) * (gH / 2 - 4))
                : ctx.lineTo(padX + x * (W - padX * 2), mid - (fn(x) / Amax) * (gH / 2 - 4))
      }
      ctx.stroke()
      ctx.fillStyle = color; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'left'
      ctx.fillText(label, padX + 6, gY + 14)
    })

    // --- Info panel: amplitude + interference type ---
    const phiDeg = (phiRad * 180 / Math.PI).toFixed(0)
    ctx.fillStyle = '#EADDFF'; ctx.beginPath(); ctx.roundRect(8, H - 52, W - 16, 46, 6); ctx.fill()
    ctx.fillStyle = '#21005D'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(`A₁=${A1}  A₂=${A2}  φ=${phiDeg}°  →  A_resultant = ${A_res.toFixed(2)}`, W / 2, H - 34)
    ctx.fillStyle = interferenceColor; ctx.font = `bold ${fs}px 'Roboto', sans-serif`
    ctx.fillText(`${interferenceLabel} Interference`, W / 2, H - 12)
  }, [A1, A2, f1, f2, phiRad, isPlaying])

  timeRef.current = 0
  return <CanvasEngine {...props} draw={draw} deps={[A1, A2, f1, f2, phi, isPlaying]} animated />
}
