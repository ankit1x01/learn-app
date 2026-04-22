import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/** Standing Wave — animated transverse wave with nodes/antinodes */
export function StandingWaveSim(props: SimProps) {
  const { controls, isPlaying } = props
  const n      = Math.round(controls['n']      ?? 1)   // harmonic number
  const L      = controls['L']      ?? 1.0    // m string length
  const v_wave = controls['v']      ?? 100    // m/s wave speed
  const A      = controls['A']      ?? 1      // amplitude

  const freq    = n * v_wave / (2 * L)        // Hz
  const lambda  = 2 * L / n                   // m
  const k       = 2 * Math.PI / lambda
  const omega   = 2 * Math.PI * freq

  const timeRef = useRef(0)

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    if (isPlaying) timeRef.current += dt
    const t = timeRef.current

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'; ctx.fillRect(0, 0, W, H)

    const padX = Math.min(W, H) * (0.07 * 1.5), waveY = H * 0.48
    const waveW = W - 2 * padX
    const SCALE = Math.min(H * 0.32, 80) * A

    const fs = Math.max(10, Math.round(Math.min(W, H) * (0.028 * 1.5)))

    // String supports
    ctx.fillStyle = '#6750A4'
    ctx.beginPath(); ctx.roundRect(padX - 8, waveY - 16, 8, 32, 3); ctx.fill()
    ctx.beginPath(); ctx.roundRect(padX + waveW, waveY - 16, 8, 32, 3); ctx.fill()

    // Standing wave: y(x,t) = A sin(kx) cos(ωt)
    ctx.lineWidth = 3
    const cosT = Math.cos(omega * t)

    // Draw wave
    ctx.strokeStyle = '#6750A4'
    ctx.beginPath()
    for (let i = 0; i <= 300; i++) {
      const x    = i / 300
      const px2  = padX + x * waveW
      const y    = SCALE * Math.sin(k * x * L) * cosT
      i === 0 ? ctx.moveTo(px2, waveY - y) : ctx.lineTo(px2, waveY - y)
    }
    ctx.stroke()

    // Envelope (max and min)
    ctx.strokeStyle = '#6750A430'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3])
    ctx.beginPath()
    for (let i = 0; i <= 300; i++) {
      const x   = i / 300
      const px2 = padX + x * waveW
      const y   = SCALE * Math.abs(Math.sin(k * x * L))
      i === 0 ? ctx.moveTo(px2, waveY - y) : ctx.lineTo(px2, waveY - y)
    }
    ctx.stroke()
    ctx.beginPath()
    for (let i = 0; i <= 300; i++) {
      const x   = i / 300
      const px2 = padX + x * waveW
      const y   = SCALE * Math.abs(Math.sin(k * x * L))
      i === 0 ? ctx.moveTo(px2, waveY + y) : ctx.lineTo(px2, waveY + y)
    }
    ctx.stroke()
    ctx.setLineDash([])

    // Nodes and Antinodes
    for (let j = 0; j <= n; j++) {
      const nx = padX + (j / n) * waveW
      ctx.fillStyle = '#F43F5E'
      ctx.beginPath(); ctx.arc(nx, waveY, 5, 0, Math.PI * 2); ctx.fill()
      if (j < n) {
        ctx.fillStyle = '#10B981'
        ctx.beginPath(); ctx.arc(padX + ((j + 0.5) / n) * waveW, waveY, 5, 0, Math.PI * 2); ctx.fill()
      }
    }

    // Labels
    ctx.fillStyle = '#F43F5E'; ctx.font = `${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText('● Nodes', padX + Math.min(W, H) * (0.25 * 1.5), H * 0.82)
    ctx.fillStyle = '#10B981'
    ctx.fillText('● Antinodes', padX + Math.min(W, H) * (0.75 * 1.5), H * 0.82)

    // Info panel
    const rows = [
      { l: 'n (harmonic)',  v: `${n}`                    },
      { l: 'L',             v: `${L.toFixed(1)} m`       },
      { l: 'v',             v: `${v_wave} m/s`           },
      { l: 'f',             v: `${freq.toFixed(1)} Hz`   },
      { l: 'λ',             v: `${lambda.toFixed(2)} m`  },
    ]
    const infoX = padX, infoY = H * 0.86
    ctx.fillStyle = '#EADDFF'
    ctx.beginPath(); ctx.roundRect(infoX, infoY, W - infoX * 2, rows.length * (fs + 6) + 10, 8); ctx.fill()
    rows.forEach(({ l, v }, i) => {
      const ry = infoY + 8 + i * (fs + 6) + fs * 0.85
      ctx.fillStyle = '#49454F'; ctx.font = `${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'left'; ctx.fillText(l, infoX + 10, ry)
      ctx.fillStyle = '#6750A4'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'right'; ctx.fillText(v, W - infoX - 8, ry)
    })

    ctx.fillStyle = '#1C1B1F'; ctx.font = `bold ${fs + 1}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(`${n}${n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'} Harmonic  —  Standing Wave`, W / 2, H * 0.12)
  }, [n, L, v_wave, A, freq, lambda, k, omega, isPlaying])

  timeRef.current = 0
  return <CanvasEngine {...props} draw={draw} deps={[n, L, v_wave, A, isPlaying]} animated />
}
