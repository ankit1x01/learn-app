import { useCallback, useRef } from 'react'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'
import { SimProps } from '../../types'

export function DeBroglieSim(props: SimProps) {
  const { controls, isPlaying } = props

  // mass control is in atomic mass units (u); 1 u = 1.66e-27 kg
  // electron default: m_e = 9.11e-31 kg ≈ 5.49e-4 u
  const massU = controls?.m ?? 5.49e-4        // atomic mass units
  const mass = massU * 1.66e-27              // kg
  const velocity = controls?.v ?? 1e6         // m/s

  const h = 6.626e-34
  const hbar = 1.055e-34

  const tRef = useRef(0)

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    const scale = Math.min(W, H)

    if (isPlaying) tRef.current += dt
    const t = tRef.current

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    const primary = '#6750A4'
    const font = Math.max(10, scale * 0.025)

    const cy = H * 0.5

    // =========================
    // ===== PHYSICS ===========
    // =========================
    const p = mass * velocity
    const lambda = h / p // meters

    // Visual scaling (VERY important)
    const lambdaVisual = Math.max(10, Math.min(200, lambda * 1e12))

    const k = (2 * Math.PI) / lambdaVisual
    // omega = E/hbar = (0.5*m*v²)/hbar — scaled down for canvas visualization
    const omega = (0.5 * mass * velocity * velocity / hbar) * 1e-30

    // =========================
    // ===== PARTICLE ==========
    // =========================
    const px = (t * velocity * 0.0001) % (W * 0.8) + W * 0.1

    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(px, cy, 6, 0, Math.PI * 2)
    ctx.fill()

    // =========================
    // ===== WAVE PACKET =======
    // =========================
    ctx.strokeStyle = primary
    ctx.lineWidth = 2

    ctx.beginPath()

    const envelopeWidth = scale * 0.3

    for (let x = px - envelopeWidth; x <= px + envelopeWidth; x += 2) {
      const dx = x - px

      // Gaussian envelope
      const envelope = Math.exp(-(dx * dx) / (2 * (envelopeWidth * 0.3) ** 2))

      const y =
        cy +
        envelope *
        Math.sin(k * dx - omega * t) *
        scale *
        0.05

      if (x === px - envelopeWidth) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }

    ctx.stroke()

    // =========================
    // ===== GLOW EFFECT =======
    // =========================
    ctx.globalAlpha = 0.2
    ctx.strokeStyle = primary
    ctx.lineWidth = 6

    ctx.beginPath()
    for (let x = px - envelopeWidth; x <= px + envelopeWidth; x += 4) {
      const dx = x - px
      const envelope = Math.exp(-(dx * dx) / (2 * (envelopeWidth * 0.3) ** 2))
      const y = cy + envelope * Math.sin(k * dx - omega * t) * scale * 0.05
      if (x === px - envelopeWidth) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.globalAlpha = 1

    // =========================
    // ===== INFO PANEL ========
    // =========================
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.beginPath()
    ctx.roundRect(W * 0.65, H * 0.1, scale * 0.3, scale * 0.18, 12)
    ctx.fill()

    ctx.strokeStyle = '#CAC4D0'
    ctx.stroke()

    ctx.fillStyle = primary
    ctx.font = `${font}px sans-serif`

    ctx.fillText(`m = ${mass.toExponential(2)} kg (${massU.toExponential(2)} u)`, W * 0.67, H * 0.15)
    ctx.fillText(`p = ${p.toExponential(2)} kg·m/s`, W * 0.67, H * 0.18)
    ctx.fillText(`λ = ${(lambda * 1e12).toFixed(2)} pm`, W * 0.67, H * 0.21)
    ctx.fillText(`v = ${velocity.toExponential(1)} m/s`, W * 0.67, H * 0.24)

  }, [mass, massU, velocity, hbar, isPlaying])

  return (
    <CanvasEngine
      {...props}
      draw={draw}
      deps={[massU, velocity, isPlaying]}
      animated
    />
  )
}