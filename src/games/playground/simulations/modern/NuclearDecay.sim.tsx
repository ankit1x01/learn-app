import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

type Nucleus = { x: number; y: number; active: boolean }
type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string }

// Real isotope data — decay constants are scaled for visual distinctiveness
// Real half-lives shown on canvas as labels only
const ISOTOPES = [
  { name: 'Carbon-14',     symbol: '¹⁴C',  halfLifeDisplay: 't½ = 5730 yr',  lambda: 0.05,  color: '#6750A4' },
  { name: 'Iodine-131',    symbol: '¹³¹I', halfLifeDisplay: 't½ = 8 days',   lambda: 0.15,  color: '#0891b2' },
  { name: 'Uranium-238',   symbol: '²³⁸U', halfLifeDisplay: 't½ = 4.5×10⁹ yr', lambda: 0.005, color: '#15803d' },
  { name: 'Polonium-214',  symbol: '²¹⁴Po',halfLifeDisplay: 't½ = 164 μs',   lambda: 0.8,   color: '#dc2626' },
  { name: 'Cobalt-60',     symbol: '⁶⁰Co', halfLifeDisplay: 't½ = 5.27 yr',  lambda: 0.3,   color: '#d97706' },
]

/**
 * Nuclear Decay Simulation
 * Visualizes probabilistic decay of individual nuclei and the resulting decay curve.
 * Isotope selector wires real isotope names + half-lives with distinct visual decay rates.
 */
export function NuclearDecaySim(props: SimProps) {
  const { controls, isPlaying } = props

  const N0          = controls?.N0 ?? 1000
  const isotopeIdx  = Math.round(Math.max(0, Math.min(4, controls?.isotope ?? 0)))
  const isotope     = ISOTOPES[isotopeIdx]
  const lambda      = isotope.lambda

  const nucleiRef    = useRef<Nucleus[]>([])
  const particlesRef = useRef<Particle[]>([])
  const graphPoints  = useRef<{t: number, N: number}[]>([])
  const tRef         = useRef(0)

  // Reset when isotope or N0 changes (track previous values)
  const prevIsoRef = useRef(isotopeIdx)
  const prevN0Ref  = useRef(N0)
  const needReset  = prevIsoRef.current !== isotopeIdx || prevN0Ref.current !== N0
  if (needReset) {
    prevIsoRef.current = isotopeIdx
    prevN0Ref.current  = N0
    tRef.current        = 0
    graphPoints.current = []
    particlesRef.current = []
    nucleiRef.current   = []  // cleared — will be rebuilt in draw
  }

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    const scale = Math.min(W, H)
    const cx = W / 2, cy = H * 0.4

    // Initialize/Reset
    if (!isPlaying) {
      tRef.current = 0
      graphPoints.current = []
      particlesRef.current = []
      if (nucleiRef.current.length !== N0) {
        nucleiRef.current = Array.from({ length: N0 }, () => ({
          x: (Math.random() - 0.5) * scale * 0.6,
          y: (Math.random() - 0.5) * scale * 0.6,
          active: true
        }))
      } else {
        nucleiRef.current.forEach(n => { n.active = true })
      }
    }

    // Also re-initialize if nuclei array is empty (after isotope reset)
    if (nucleiRef.current.length === 0) {
      nucleiRef.current = Array.from({ length: N0 }, () => ({
        x: (Math.random() - 0.5) * scale * 0.6,
        y: (Math.random() - 0.5) * scale * 0.6,
        active: true
      }))
    }

    const pDecay = 1 - Math.exp(-lambda * dt)
    let activeCount = 0

    if (isPlaying) {
      tRef.current += dt
      nucleiRef.current.forEach(n => {
        if (n.active) {
          if (Math.random() < pDecay) {
            n.active = false
            for (let i = 0; i < 3; i++) {
              const ang = Math.random() * Math.PI * 2
              const spd = 50 + Math.random() * 100
              particlesRef.current.push({
                x: cx + n.x, y: cy + n.y,
                vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
                life: 0.5 + Math.random() * 0.5,
                color: Math.random() > 0.5 ? isotope.color : '#F9AB00'
              })
            }
          } else {
            activeCount++
          }
        }
      })

      if (graphPoints.current.length === 0 || tRef.current - graphPoints.current[graphPoints.current.length - 1].t > 0.1) {
        graphPoints.current.push({ t: tRef.current, N: activeCount })
        if (graphPoints.current.length > 300) graphPoints.current.shift()
      }
    } else {
      activeCount = N0
    }

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    const primary = isotope.color
    const fontSmall = Math.max(10, Math.round(scale * 0.025))

    // --- Container ---
    ctx.strokeStyle = '#CAC4D0'; ctx.setLineDash([5, 5]); ctx.lineWidth = 2
    ctx.strokeRect(cx - scale * 0.35, cy - scale * 0.35, scale * 0.7, scale * 0.7)
    ctx.setLineDash([])

    // --- Draw Nuclei ---
    ctx.fillStyle = primary
    nucleiRef.current.forEach(n => {
      if (n.active) {
        ctx.beginPath(); ctx.arc(cx + n.x, cy + n.y, 2, 0, Math.PI * 2); ctx.fill()
      }
    })
    ctx.fillStyle = '#EADDFF'
    nucleiRef.current.forEach(n => {
      if (!n.active) {
        ctx.beginPath(); ctx.arc(cx + n.x, cy + n.y, 1.5, 0, Math.PI * 2); ctx.fill()
      }
    })

    // --- Particles ---
    particlesRef.current.forEach(p => {
      p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt
      ctx.globalAlpha = Math.max(0, p.life)
      ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill()
    })
    ctx.globalAlpha = 1
    particlesRef.current = particlesRef.current.filter(p => p.life > 0)

    // --- Graph ---
    const gx = W * 0.1, gy = H * 0.9, gw = W * 0.8, gh = scale * 0.2
    ctx.strokeStyle = '#CAC4D0'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(gx, gy - gh); ctx.lineTo(gx, gy); ctx.lineTo(gx + gw, gy); ctx.stroke()
    if (graphPoints.current.length > 1) {
      ctx.strokeStyle = primary; ctx.lineWidth = 2; ctx.beginPath()
      graphPoints.current.forEach((p, i) => {
        const x = gx + (i / 300) * gw
        const y = gy - (p.N / N0) * gh
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      }); ctx.stroke()
    }
    ctx.fillStyle = primary
    ctx.font = `${fontSmall}px 'Roboto', sans-serif`
    ctx.textAlign = 'left'
    ctx.fillText('Nuclei N(t) vs Time', gx, gy - gh - 5)

    // --- Isotope label on canvas ---
    const labelFs = Math.max(12, Math.round(scale * 0.038))
    ctx.fillStyle = primary
    ctx.font = `bold ${labelFs}px 'Roboto', sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText(`${isotope.symbol}  ${isotope.name}`, W / 2, 26)
    ctx.font = `${Math.max(10, labelFs - 4)}px 'Roboto', sans-serif`
    ctx.fillStyle = '#49454F'
    ctx.fillText(isotope.halfLifeDisplay, W / 2, 26 + labelFs)
    ctx.textAlign = 'left'

    // Info Panel
    const panelW = scale * 0.3
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.beginPath(); ctx.roundRect(W - panelW - 20, 60, panelW, scale * 0.18, 12); ctx.fill()
    ctx.strokeStyle = '#CAC4D0'; ctx.lineWidth = 1; ctx.stroke()
    ctx.fillStyle = primary
    ctx.font = `bold ${Math.max(12, Math.round(scale * 0.035))}px 'Roboto', sans-serif`
    ctx.fillText(`N: ${activeCount}`, W - panelW + 10, 90)
    ctx.font = `${fontSmall}px 'Roboto', sans-serif`
    ctx.fillStyle = '#49454F'
    ctx.fillText(`t: ${tRef.current.toFixed(1)} s`, W - panelW + 10, 90 + fontSmall + 4)
    ctx.fillText(`t½ (sim): ${(Math.log(2) / lambda).toFixed(2)} s`, W - panelW + 10, 90 + (fontSmall + 4) * 2)
    ctx.fillText(`λ = ${lambda} s⁻¹`, W - panelW + 10, 90 + (fontSmall + 4) * 3)

  }, [N0, isotopeIdx, lambda, isPlaying, isotope])

  return <CanvasEngine {...props} draw={draw} deps={[N0, isotopeIdx, lambda, isPlaying]} animated />
}
