import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

// Bohr model constants
// r_n = n² × a₀   (a₀ = 0.529 Å)
// E_n = −13.6/n² eV

const SERIES = [
  { n1: 1, color: '#a78bfa' },  // Lyman  (UV → violet/purple)
  { n1: 2, color: '#38bdf8' },  // Balmer (visible)
  { n1: 3, color: '#fb923c' },  // Paschen (IR → dark red/orange)
]

// Photon color by destination series
function photonColor(nLower: number): string {
  if (nLower === 1) return '#c084fc'  // Lyman → UV purple
  if (nLower === 2) return '#38bdf8'  // Balmer → visible blue
  return '#dc2626'                    // Paschen → IR deep red
}

type Photon = { x: number; y: number; vx: number; vy: number; color: string; alpha: number }

export function BohrAtomSim(props: SimProps) {
  const { controls, isPlaying } = props
  const nElectron = Math.round(controls['n'] ?? 1)

  const timeRef        = useRef(0)
  const photonsRef     = useRef<Photon[]>([])
  // Current displayed orbit (may differ from nElectron during auto-decay)
  const currentNRef    = useRef(nElectron)
  // Decay timer: simulation time at which the next auto-decay fires
  const decayFireAtRef = useRef<number>(-1)

  // When the user changes n via the slider, update currentN and reset decay timer
  const prevNRef = useRef(nElectron)
  if (prevNRef.current !== nElectron) {
    prevNRef.current   = nElectron
    currentNRef.current = nElectron
    decayFireAtRef.current = -1  // will be scheduled on next frame
  }

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    timeRef.current += dt
    const t = timeRef.current

    // ── Auto-decay scheduling ──
    if (isPlaying && currentNRef.current > 1) {
      if (decayFireAtRef.current < 0) {
        // Schedule first / next decay: random delay 1.5–3 s
        decayFireAtRef.current = t + 1.5 + Math.random() * 1.5
      } else if (t >= decayFireAtRef.current) {
        // Fire decay: drop one level and emit a photon
        const nFrom = currentNRef.current
        const nTo   = nFrom - 1

        // Emit photon from current electron position
        const orbitR = (Math.min(W, H) * 0.43) / (25) * nFrom * nFrom  // approximate r
        const angle  = t * (2.5 / (nFrom * nFrom * nFrom))
        const ex = W / 2 + orbitR * Math.cos(angle)
        const ey = H / 2 + orbitR * Math.sin(angle)
        const speed = 90 + Math.random() * 60
        const dir   = angle  // photon travels radially outward
        photonsRef.current.push({
          x: ex, y: ey,
          vx: Math.cos(dir) * speed,
          vy: Math.sin(dir) * speed,
          color: photonColor(nTo),
          alpha: 1.0
        })

        currentNRef.current = nTo
        if (nTo > 1) {
          decayFireAtRef.current = t + 1.5 + Math.random() * 1.5
        } else {
          decayFireAtRef.current = -1  // at ground state, stop
        }
      }
    }

    // If not playing, reset decay schedule so it restarts fresh when resumed
    if (!isPlaying) {
      decayFireAtRef.current = -1
    }

    const n = currentNRef.current

    ctx.clearRect(0, 0, W, H)

    const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.min(W, H) * (0.55 * 1.5))
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
    const orbitFs = Math.max(10, Math.round(Math.min(W, H) * (0.028 * 1.5)))
    for (let i = 1; i <= MAX_ORBITS; i++) {
      const r = r1 * i * i
      ctx.strokeStyle = i === n ? '#6750A480' : '#30363d'
      ctx.lineWidth   = i === n ? 1.5 : 0.8
      ctx.setLineDash([3, 4])
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])

      // Energy label
      const eV = (-13.6 / (i * i)).toFixed(2)
      ctx.fillStyle = '#8b949e'
      ctx.font = `${orbitFs}px 'Inter', sans-serif`
      ctx.textAlign = 'left'
      ctx.fillText(`n=${i}  ${eV}eV`, cx + r + 6, cy + orbitFs * 0.4)
    }

    // ── Nucleus ──
    const nGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 14)
    nGrad.addColorStop(0, '#fde68a')
    nGrad.addColorStop(0.6, '#f59e0b')
    nGrad.addColorStop(1, '#b45309')
    ctx.fillStyle = nGrad
    ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#fef3c7'
    ctx.font = `bold ${Math.round(Math.min(W, H) * (0.032 * 1.5))}px 'Inter', sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText('+', cx, cy + 5)
    ctx.textAlign = 'left'

    // ── Electron ──
    const orbitR = r1 * n * n
    const omega  = 2.5 / (n * n * n)
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

    // ── Photon particles ──
    photonsRef.current.forEach(ph => {
      ph.x     += ph.vx * dt
      ph.y     += ph.vy * dt
      ph.alpha -= dt * 0.9   // fade over ~1.1 s

      if (ph.alpha <= 0) return

      // Glow halo
      const glow = ctx.createRadialGradient(ph.x, ph.y, 0, ph.x, ph.y, 7)
      glow.addColorStop(0, ph.color + 'ff')
      glow.addColorStop(0.5, ph.color + '88')
      glow.addColorStop(1, ph.color + '00')
      ctx.globalAlpha = Math.min(1, ph.alpha)
      ctx.fillStyle = glow
      ctx.beginPath(); ctx.arc(ph.x, ph.y, 7, 0, Math.PI * 2); ctx.fill()

      // Bright core dot
      ctx.fillStyle = '#ffffff'
      ctx.beginPath(); ctx.arc(ph.x, ph.y, 2.5, 0, Math.PI * 2); ctx.fill()

      ctx.globalAlpha = 1
    })
    photonsRef.current = photonsRef.current.filter(ph => ph.alpha > 0)

    // ── Transition arrows ──
    // Show all downward transitions from n to n_lower (n_lower = 1..n-1)
    if (n > 1) {
      for (let n_lower = 1; n_lower < n; n_lower++) {
        const n_upper = n
        const RH = 1.097e7
        const lambdaNm = 1e9 / (RH * (1 / (n_lower * n_lower) - 1 / (n_upper * n_upper)))
        const deltaE = 13.6 * (1 / (n_lower * n_lower) - 1 / (n_upper * n_upper))
        const series = SERIES.find(s => s.n1 === n_lower) ?? { color: '#8b949e' }
        const r_upper = r1 * n_upper * n_upper
        const r_lower = r1 * n_lower * n_lower
        const footA = -Math.PI * 0.3 - n_lower * 0.25
        const x1 = cx + r_upper * Math.cos(footA)
        const y1 = cy + r_upper * Math.sin(footA)
        const x2 = cx + r_lower * Math.cos(footA)
        const y2 = cy + r_lower * Math.sin(footA)

        ctx.strokeStyle = series.color + 'cc'
        ctx.lineWidth = 1.5
        ctx.setLineDash([2, 3])
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
        ctx.setLineDash([])

        const ang = Math.atan2(y2 - y1, x2 - x1)
        ctx.fillStyle = series.color
        ctx.beginPath()
        ctx.moveTo(x2, y2)
        ctx.lineTo(x2 - 8 * Math.cos(ang - 0.4), y2 - 8 * Math.sin(ang - 0.4))
        ctx.lineTo(x2 - 8 * Math.cos(ang + 0.4), y2 - 8 * Math.sin(ang + 0.4))
        ctx.closePath(); ctx.fill()

        ctx.fillStyle = series.color
        ctx.font = `${Math.max(10, Math.round(Math.min(W, H) * (0.028 * 1.5)))}px 'Inter', sans-serif`
        ctx.textAlign = 'left'
        ctx.fillText(`${lambdaNm.toFixed(0)} nm  ΔE=${deltaE.toFixed(2)}eV`, (x1 + x2) / 2 + 6, (y1 + y2) / 2 - 4)
      }
    }

    // ── Info ──
    const infoFs = Math.max(10, Math.round(Math.min(W, H) * (0.032 * 1.5)))
    ctx.fillStyle = '#8b949e'
    ctx.font = `${infoFs}px 'Inter', sans-serif`
    ctx.textAlign = 'left'
    ctx.fillText(`n = ${n}`, 10, infoFs + 4)
    ctx.fillText(`E = ${(-13.6 / (n * n)).toFixed(2)} eV`, 10, infoFs * 2 + 10)
    ctx.fillText(`r = ${(n * n * 0.529).toFixed(2)} Å`, 10, infoFs * 3 + 16)

    // Decay hint label
    if (isPlaying && n > 1) {
      ctx.fillStyle = '#6750A4'
      ctx.font = `${Math.max(9, infoFs - 2)}px 'Inter', sans-serif`
      ctx.fillText('auto-decay active', 10, infoFs * 4 + 22)
    }
  }, [nElectron, isPlaying])

  return <CanvasEngine {...props} draw={draw} deps={[nElectron, isPlaying]} animated />
}
