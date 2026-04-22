import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/** Beats — superposition of two close frequencies showing beat pattern */
export function BeatsSim(props: SimProps) {
  const { controls, isPlaying } = props
  const f1  = controls['f1'] ?? 440   // Hz
  const f2  = controls['f2'] ?? 444   // Hz
  const A1  = controls['A1'] ?? 1
  const A2  = controls['A2'] ?? 1

  const f_beat = Math.abs(f1 - f2)
  const t_beat = f_beat > 0 ? 1 / f_beat : Infinity

  const timeRef = useRef(0)

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    if (isPlaying) timeRef.current += dt * 0.05
    const t0 = timeRef.current

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'; ctx.fillRect(0, 0, W, H)

    const PAD = 24, gH = (H - PAD * 2) / 3 - 8
    const rows = [
      { label: `Wave 1  f=${f1}Hz`, color: '#6750A4',
        fn: (x: number) => A1 * Math.sin(2 * Math.PI * f1 * (t0 + x)) },
      { label: `Wave 2  f=${f2}Hz`, color: '#F43F5E',
        fn: (x: number) => A2 * Math.sin(2 * Math.PI * f2 * (t0 + x)) },
      { label: `Beats  f_beat=${f_beat.toFixed(1)}Hz`, color: '#10B981',
        fn: (x: number) => A1 * Math.sin(2 * Math.PI * f1 * (t0 + x)) + A2 * Math.sin(2 * Math.PI * f2 * (t0 + x)) },
    ]

    const T_show = 1 / Math.max(Math.min(f1, f2) * 0.02, 0.001)
    const fs = Math.max(10, Math.round(Math.min(W, H) * (0.028 * 1.5)))

    rows.forEach(({ label, color, fn }, ri) => {
      const gY = PAD + ri * (gH + 12)
      ctx.fillStyle = '#F4EFF4'
      ctx.beginPath(); ctx.roundRect(8, gY, W - 16, gH, 6); ctx.fill()

      const mid = gY + gH / 2
      const amp = ri === 2 ? (A1 + A2) : Math.max(A1, A2)

      ctx.strokeStyle = color; ctx.lineWidth = 1.5
      ctx.beginPath()
      for (let i = 0; i <= 400; i++) {
        const x  = (i / 400) * T_show
        const px2 = 16 + (i / 400) * (W - 32)
        const py2 = mid - (fn(x) / amp) * (gH / 2 - 4)
        i === 0 ? ctx.moveTo(px2, py2) : ctx.lineTo(px2, py2)
      }
      ctx.stroke()

      // --- Beat envelope overlay (only on the superposition / beats row) ---
      if (ri === 2 && f_beat > 0) {
        const A_env = A1 + A2
        ctx.setLineDash([6, 4])
        ctx.strokeStyle = '#F59E0B'   // orange/amber, visually distinct
        ctx.lineWidth = 1.8

        // upper envelope: +A_env · |cos(π·f_beat·x)|
        ctx.beginPath()
        for (let i = 0; i <= 400; i++) {
          const x   = (i / 400) * T_show
          const env  = A_env * Math.abs(Math.cos(Math.PI * f_beat * x))
          const px2  = 16 + (i / 400) * (W - 32)
          const py2  = mid - (env / amp) * (gH / 2 - 4)
          i === 0 ? ctx.moveTo(px2, py2) : ctx.lineTo(px2, py2)
        }
        ctx.stroke()

        // lower envelope: -A_env · |cos(π·f_beat·x)|
        ctx.beginPath()
        for (let i = 0; i <= 400; i++) {
          const x   = (i / 400) * T_show
          const env  = A_env * Math.abs(Math.cos(Math.PI * f_beat * x))
          const px2  = 16 + (i / 400) * (W - 32)
          const py2  = mid + (env / amp) * (gH / 2 - 4)
          i === 0 ? ctx.moveTo(px2, py2) : ctx.lineTo(px2, py2)
        }
        ctx.stroke()
        ctx.setLineDash([])
      }

      ctx.fillStyle = color; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'left'
      ctx.fillText(label, 14, gY + 14)
    })

    ctx.fillStyle = '#EADDFF'
    ctx.beginPath(); ctx.roundRect(8, H - 28, W - 16, 22, 6); ctx.fill()
    ctx.fillStyle = '#21005D'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(`f_beat = |f₁−f₂| = ${f_beat.toFixed(1)} Hz  |  T_beat = ${f_beat > 0 ? t_beat.toFixed(3) : '∞'} s`, W / 2, H - 12)
  }, [f1, f2, A1, A2, f_beat, t_beat, isPlaying])

  timeRef.current = 0
  return <CanvasEngine {...props} draw={draw} deps={[f1, f2, A1, A2, isPlaying]} animated />
}
