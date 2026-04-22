import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

// Bohr model constants
// r_n = n² × a₀   (a₀ = 0.529 Å)
// E_n = −13.6/n² eV

const SERIES = [
  { n1: 1, color: '#a78bfa' },  // Lyman
  { n1: 2, color: '#38bdf8' },  // Balmer
  { n1: 3, color: '#fb923c' },  // Paschen
]

export function BohrAtomSim(props: SimProps) {
  const { controls } = props
  const nElectron = Math.round(controls['n'] ?? 1)

  const timeRef = useRef(0)

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    timeRef.current += dt
    const t = timeRef.current

    ctx.clearRect(0, 0, W, H)

    const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.55)
    bg.addColorStop(0, '#0d1117')
    bg.addColorStop(1, '#010409')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    const cx = W / 2
    const cy = H / 2
    const MAX_ORBITS = 5
    const maxR = Math.min(W, H) * 0.43
    const r1 = maxR / (MAX_ORBITS * MAX_ORBITS)

    // ── Orbits ──
    for (let n = 1; n <= MAX_ORBITS; n++) {
      const r = r1 * n * n
      ctx.strokeStyle = n === nElectron ? '#6750A480' : '#30363d'
      ctx.lineWidth   = n === nElectron ? 1.5 : 0.8
      ctx.setLineDash([3, 4])
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])

      // Energy label
      const eV = (-13.6 / (n * n)).toFixed(2)
      ctx.fillStyle = '#8b949e'
      ctx.font = `${Math.max(9, Math.round(W * 0.022))}px Inter, system-ui`
      ctx.textAlign = 'left'
      ctx.fillText(`n=${n}  ${eV}eV`, cx + r + 4, cy + 4)
    }

    // ── Nucleus ──
    const nGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 14)
    nGrad.addColorStop(0, '#fde68a')
    nGrad.addColorStop(0.6, '#f59e0b')
    nGrad.addColorStop(1, '#b45309')
    ctx.fillStyle = nGrad
    ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#fef3c7'
    ctx.font = `bold ${Math.round(W * 0.032)}px Inter, system-ui`
    ctx.textAlign = 'center'
    ctx.fillText('+', cx, cy + 5)
    ctx.textAlign = 'left'

    // ── Electron ──
    const orbitR = r1 * nElectron * nElectron
    const omega  = 2.5 / (nElectron * nElectron * nElectron)
    const angle  = t * omega
    const ex = cx + orbitR * Math.cos(angle)
    const ey = cy + orbitR * Math.sin(angle)

    // Trail
    for (let i = 1; i <= 8; i++) {
      const ta = angle - i * 0.18
      const tx = cx + orbitR * Math.cos(ta)
      const ty = cy + orbitR * Math.sin(ta)
      ctx.fillStyle = `rgba(56,189,248,${(0.06 * (9 - i)).toFixed(2)})`
      ctx.beginPath(); ctx.arc(tx, ty, Math.max(1, 5 - i * 0.4), 0, Math.PI * 2); ctx.fill()
    }

    const eGrad = ctx.createRadialGradient(ex, ey, 0, ex, ey, 7)
    eGrad.addColorStop(0, '#e0f2fe')
    eGrad.addColorStop(0.5, '#38bdf8')
    eGrad.addColorStop(1, '#0284c7')
    ctx.fillStyle = eGrad
    ctx.beginPath(); ctx.arc(ex, ey, 7, 0, Math.PI * 2); ctx.fill()

    // ── Transition arrows ──
    if (nElectron > 1) {
      for (let n2 = nElectron; n2 >= 2; n2--) {
        const n1 = n2 - 1
        const RH = 1.097e7
        const lambdaNm = 1e9 / (RH * (1 / (n1 * n1) - 1 / (n2 * n2)))
        const series   = SERIES.find(s => s.n1 + 1 === n2) ?? { color: '#8b949e' }
        const r_n1 = r1 * n1 * n1
        const r_n2 = r1 * n2 * n2
        const footA = -Math.PI * 0.3 - n2 * 0.25
        const x1 = cx + r_n2 * Math.cos(footA)
        const y1 = cy + r_n2 * Math.sin(footA)
        const x2 = cx + r_n1 * Math.cos(footA)
        const y2 = cy + r_n1 * Math.sin(footA)

        ctx.strokeStyle = series.color + 'cc'
        ctx.lineWidth = 1.5
        ctx.setLineDash([2, 3])
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
        ctx.setLineDash([])

        // Arrowhead
        const ang = Math.atan2(y2 - y1, x2 - x1)
        ctx.fillStyle = series.color
        ctx.beginPath()
        ctx.moveTo(x2, y2)
        ctx.lineTo(x2 - 8 * Math.cos(ang - 0.4), y2 - 8 * Math.sin(ang - 0.4))
        ctx.lineTo(x2 - 8 * Math.cos(ang + 0.4), y2 - 8 * Math.sin(ang + 0.4))
        ctx.closePath(); ctx.fill()

        ctx.fillStyle = series.color
        ctx.font = `${Math.max(9, Math.round(W * 0.022))}px Inter, system-ui`
        ctx.textAlign = 'left'
        ctx.fillText(`${lambdaNm.toFixed(0)} nm`, (x1 + x2) / 2 + 5, (y1 + y2) / 2 - 3)
      }
    }

    // ── Info ──
    ctx.fillStyle = '#8b949e'
    ctx.font = `${Math.max(10, Math.round(W * 0.026))}px Inter, system-ui`
    ctx.textAlign = 'left'
    ctx.fillText(`n = ${nElectron}`, 10, 22)
    ctx.fillText(`E = ${(-13.6 / (nElectron * nElectron)).toFixed(2)} eV`, 10, 42)
    ctx.fillText(`r = ${(nElectron * nElectron * 0.529).toFixed(2)} Å`, 10, 62)
  }, [nElectron])

  return <CanvasEngine {...props} draw={draw} deps={[nElectron]} animated />
}
