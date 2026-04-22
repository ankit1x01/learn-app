import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/** Radioactive Decay Graph — N(t) = N0·e^(-λt) with live half-life markers */
export function RadioactiveDecayGraphSim(props: SimProps) {
  const { controls, isPlaying } = props
  const N0       = controls['N0']   ?? 1000   // initial atoms
  const t_half   = controls['t12']  ?? 10     // half-life (arbitrary units)
  const lambda   = Math.LN2 / t_half          // decay constant

  const timeRef  = useRef(0)
  const histRef  = useRef<number[]>([N0])

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    const T_MAX = t_half * 6
    if (isPlaying) {
      timeRef.current = Math.min(timeRef.current + dt * t_half * 0.3, T_MAX)
      histRef.current.push(N0 * Math.exp(-lambda * timeRef.current))
      if (histRef.current.length > 300) histRef.current.shift()
    }
    const N_now = N0 * Math.exp(-lambda * timeRef.current)

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'; ctx.fillRect(0, 0, W, H)

    const padL = 60, padB = 50, padT = 36, padR = 20
    const gW = W - padL - padR, gH = H - padT - padB
    const ox = padL, oy = H - padB

    // Grid
    ctx.strokeStyle = '#CAC4D020'; ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const gy = oy - (i / 4) * gH
      ctx.beginPath(); ctx.moveTo(ox, gy); ctx.lineTo(ox + gW, gy); ctx.stroke()
    }

    // Axes
    ctx.strokeStyle = '#1C1B1F'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + gW, oy); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox, oy - gH); ctx.stroke()

    const fs = Math.max(9, Math.round(Math.min(W, H) * (0.026 * 1.5)))
    ctx.fillStyle = '#49454F'; ctx.font = `${fs}px 'Roboto', sans-serif`
    ctx.textAlign = 'center'; ctx.fillText(`Time (× T½=${t_half})`, ox + gW / 2, oy + 36)
    ctx.save(); ctx.translate(14, oy - gH / 2); ctx.rotate(-Math.PI / 2)
    ctx.fillText('N(t) atoms', 0, 0); ctx.restore()

    const toX = (t: number) => ox + (t / T_MAX) * gW
    const toY = (n: number) => oy - (n / N0) * gH

    // Half-life markers
    for (let i = 1; i <= 5; i++) {
      const tx = toX(i * t_half)
      const ny = N0 * Math.pow(0.5, i)
      ctx.strokeStyle = '#F59E0B40'; ctx.lineWidth = 1; ctx.setLineDash([3, 3])
      ctx.beginPath(); ctx.moveTo(tx, oy); ctx.lineTo(tx, toY(ny)); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(ox, toY(ny)); ctx.lineTo(tx, toY(ny)); ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = '#F59E0B'; ctx.font = `${Math.max(8, fs - 1)}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
      ctx.fillText(`N₀/2^${i}`, ox - 2, toY(ny) + 4)
      ctx.fillText(`${i}T½`, tx, oy + 14)
    }

    // Decay curve (theory)
    ctx.strokeStyle = '#6750A480'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4])
    ctx.beginPath()
    for (let i = 0; i <= 200; i++) {
      const t = T_MAX * i / 200
      const n = N0 * Math.exp(-lambda * t)
      i === 0 ? ctx.moveTo(toX(t), toY(n)) : ctx.lineTo(toX(t), toY(n))
    }
    ctx.stroke(); ctx.setLineDash([])

    // Actual history
    if (histRef.current.length > 1) {
      ctx.strokeStyle = '#F43F5E'; ctx.lineWidth = 2.5
      ctx.beginPath()
      histRef.current.forEach((n, i) => {
        const px2 = ox + (i / 300) * gW
        const py2 = toY(Math.max(0, n))
        i === 0 ? ctx.moveTo(px2, py2) : ctx.lineTo(px2, py2)
      })
      ctx.stroke()
    }

    // Current point
    ctx.fillStyle = '#F43F5E'
    ctx.beginPath(); ctx.arc(toX(timeRef.current), toY(Math.max(0, N_now)), 6, 0, Math.PI * 2); ctx.fill()

    // Info panel
    const rows = [
      { l: 'N₀',          v: `${N0}`                         },
      { l: 'T½',          v: `${t_half} units`               },
      { l: 'λ (decay)',   v: `${lambda.toFixed(4)}`           },
      { l: 'N(t)',         v: `${Math.round(N_now)}`          },
      { l: 'Activity',    v: `${Math.round(lambda * N_now)}/s` },
    ]
    ctx.fillStyle = '#EADDFF'
    ctx.beginPath(); ctx.roundRect(ox + gW - 145, padT + 2, 140, rows.length * (fs + 7) + 14, 8); ctx.fill()
    rows.forEach(({ l, v }, i) => {
      const ry = padT + 12 + i * (fs + 7) + fs * 0.85
      ctx.fillStyle = '#49454F'; ctx.font = `${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'left'; ctx.fillText(l, ox + gW - 138, ry)
      ctx.fillStyle = '#6750A4'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'right'; ctx.fillText(v, ox + gW - 6, ry)
    })

    ctx.fillStyle = '#EADDFF'
    ctx.beginPath(); ctx.roundRect(8, H - 28, W - 16, 22, 6); ctx.fill()
    ctx.fillStyle = '#21005D'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(`N(t) = N₀ e^(−λt)  |  T½ = ln2/λ = ${t_half}  |  Activity = λN = ${Math.round(lambda * N_now)}`, W / 2, H - 12)
  }, [N0, t_half, lambda, isPlaying])

  timeRef.current = 0; histRef.current = [N0]
  return <CanvasEngine {...props} draw={draw} deps={[N0, t_half, isPlaying]} animated />
}
