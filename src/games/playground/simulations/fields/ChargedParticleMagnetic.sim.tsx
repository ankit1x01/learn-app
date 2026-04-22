import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/** Charged Particle in Magnetic Field — circular/helical motion with radius, period readout */
export function ChargedParticleMagneticSim(props: SimProps) {
  const { controls, isPlaying } = props
  const q = controls['q'] ?? 1.6e-19   // C
  const m = controls['m'] ?? 1.67e-27  // kg (proton)
  const B = controls['B'] ?? 1.0       // T
  const v = controls['v'] ?? 1e6       // m/s

  const r_cyc = m * v / (Math.abs(q) * B)   // radius
  const T_cyc = 2 * Math.PI * m / (Math.abs(q) * B)  // period
  const omega  = Math.abs(q) * B / m   // cyclotron freq

  const phaseRef = useRef(0)

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    if (isPlaying) phaseRef.current += omega * dt * 0.5e-7
    const angle = phaseRef.current

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#0D1117'; ctx.fillRect(0, 0, W, H)

    const cx = W / 2, cy = H / 2
    const SCALE = Math.min(W, H) * 0.35
    const pixR  = Math.min(SCALE, SCALE)

    // B-field dots (into page)
    ctx.fillStyle = '#1E3A5F'
    for (let ix = 0; ix < 8; ix++) for (let iy = 0; iy < 6; iy++) {
      const bx = Math.min(W, H) * (0.05 * 1.5) + ix * Math.min(W, H) * (0.12 * 1.5), by = H * 0.1 + iy * H * 0.16
      ctx.fillStyle = '#1D4ED840'
      ctx.beginPath(); ctx.arc(bx, by, 3, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#60A5FA40'
      ctx.fillText('×', bx - 4, by + 4)
    }

    // B label
    ctx.fillStyle = '#60A5FA'; ctx.font = `bold ${Math.max(11, Math.round(Math.min(W, H) * (0.03 * 1.5)))}px 'Roboto', sans-serif`
    ctx.textAlign = 'right'; ctx.fillText(`B = ${B} T (into page)`, W - 8, 20)

    // Orbit circle
    ctx.strokeStyle = '#6750A440'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3])
    ctx.beginPath(); ctx.arc(cx, cy, pixR, 0, Math.PI * 2); ctx.stroke()
    ctx.setLineDash([])

    // Trail
    const TRAIL = 60
    for (let i = 1; i <= TRAIL; i++) {
      const pa = angle - i * 0.07
      const tx = cx + pixR * Math.cos(pa), ty = cy + pixR * Math.sin(pa)
      ctx.fillStyle = `rgba(99,102,241,${(TRAIL - i) / TRAIL * 0.6})`
      ctx.beginPath(); ctx.arc(tx, ty, 3, 0, Math.PI * 2); ctx.fill()
    }

    // Particle
    const px2 = cx + pixR * Math.cos(angle), py2 = cy + pixR * Math.sin(angle)
    const pGrad = ctx.createRadialGradient(px2, py2, 0, px2, py2, 9)
    pGrad.addColorStop(0, '#FDE68A'); pGrad.addColorStop(1, '#F59E0B')
    ctx.fillStyle = pGrad
    ctx.beginPath(); ctx.arc(px2, py2, 9, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#FFF'; ctx.font = `bold 9px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(q > 0 ? '+' : '−', px2, py2 + 4)

    // Velocity arrow
    const vAngle = angle - Math.PI / 2
    ctx.strokeStyle = '#F43F5E'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(px2, py2)
    ctx.lineTo(px2 + 30 * Math.cos(vAngle), py2 + 30 * Math.sin(vAngle)); ctx.stroke()

    // Lorentz force (centripetal)
    const fAngle = Math.atan2(cy - py2, cx - px2)
    ctx.strokeStyle = '#10B981'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(px2, py2)
    ctx.lineTo(px2 + 25 * Math.cos(fAngle), py2 + 25 * Math.sin(fAngle)); ctx.stroke()

    // Info panel
    const fs = Math.max(10, Math.round(Math.min(W, H) * (0.028 * 1.5)))
    const rows = [
      { l: 'q',      v: `${(q / 1.6e-19).toFixed(1)} e`        },
      { l: 'm',      v: `${(m / 1.67e-27).toFixed(2)} mp`       },
      { l: 'v',      v: `${(v / 1e6).toFixed(2)} ×10⁶ m/s`      },
      { l: 'B',      v: `${B} T`                                  },
      { l: 'r',      v: `${(r_cyc * 100).toFixed(2)} cm`         },
      { l: 'T',      v: `${(T_cyc * 1e9).toFixed(2)} ns`         },
    ]
    ctx.fillStyle = '#13202F'
    ctx.beginPath(); ctx.roundRect(8, 30, 155, rows.length * (fs + 7) + 14, 8); ctx.fill()
    rows.forEach(({ l, v: val }, i) => {
      const ry = 30 + 12 + i * (fs + 7) + fs * 0.85
      ctx.fillStyle = '#8B949E'; ctx.font = `${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'left'; ctx.fillText(l, 16, ry)
      ctx.fillStyle = '#E6EDF3'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'right'; ctx.fillText(val, 160, ry)
    })

    ctx.fillStyle = '#8B949E'; ctx.font = `${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(`r = mv/(qB) = ${(r_cyc * 100).toFixed(2)} cm`, W / 2, H - 10)
  }, [q, m, B, v, r_cyc, T_cyc, omega, isPlaying])

  return <CanvasEngine {...props} draw={draw} deps={[q, m, B, v, isPlaying]} animated />
}
