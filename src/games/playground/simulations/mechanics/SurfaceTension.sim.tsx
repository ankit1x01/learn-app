import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/**
 * Surface Tension — Shows droplet formation and the excess pressure inside a bubble.
 * Animated droplet oscillation; controls: surface tension coefficient T, radius R.
 */
export function SurfaceTensionSim(props: SimProps) {
  const { controls, isPlaying } = props
  const T = controls['T'] ?? 0.072   // N/m (water ~0.072)
  const R = controls['R'] ?? 0.02    // m

  const timeRef   = useRef(0)
  const phaseRef  = useRef(0)

  // Excess pressure inside bubble: ΔP = 4T/R (soap bubble has 2 surfaces)
  // Droplet: ΔP = 2T/R
  const dP_bubble = (4 * T) / R
  const dP_drop   = (2 * T) / R

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    if (isPlaying) {
      timeRef.current += dt
      phaseRef.current += dt * 2
    }

    const t    = phaseRef.current
    const osc  = Math.sin(t) * 0.12   // ±12% oscillation in R

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    const halfW = W / 2

    // ── LEFT: Water Droplet ──
    const d_cx = Math.min(W, H) * (0.5 * 1.5)
    const d_cy = H * 0.42
    const d_R  = Math.min(80, R * 3000) * (1 + osc * 0.5)

    // Droplet gradient
    const dGrad = ctx.createRadialGradient(d_cx - d_R * 0.3, d_cy - d_R * 0.3, 0, d_cx, d_cy, d_R)
    dGrad.addColorStop(0, '#E0F2FE')
    dGrad.addColorStop(0.5, '#3B82F6')
    dGrad.addColorStop(1, '#1D4ED8')
    ctx.fillStyle = dGrad
    ctx.beginPath()
    // Slightly elongated droplet
    ctx.ellipse(d_cx, d_cy, d_R * (1 + osc * 0.15), d_R * (1 - osc * 0.15), 0, 0, Math.PI * 2)
    ctx.fill()

    // Surface tension ring
    ctx.strokeStyle = '#F43F5E'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.ellipse(d_cx, d_cy, d_R + 4, d_R + 4, 0, 0, Math.PI * 2); ctx.stroke()

    const fs = Math.max(10, Math.round(Math.min(W, H) * (0.028 * 1.5)))
    ctx.fillStyle = '#1C1B1F'
    ctx.font = `bold ${fs}px 'Roboto', sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText('Water Droplet', d_cx, H * 0.75)
    ctx.fillStyle = '#1D4ED8'
    ctx.font = `${fs}px 'Roboto', sans-serif`
    ctx.fillText(`ΔP = 2T/R = ${dP_drop.toFixed(1)} Pa`, d_cx, H * 0.75 + fs + 6)

    // Divider
    ctx.strokeStyle = '#CAC4D0'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 3])
    ctx.beginPath(); ctx.moveTo(halfW, 20); ctx.lineTo(halfW, H - 12); ctx.stroke()
    ctx.setLineDash([])

    // ── RIGHT: Soap Bubble ──
    const b_cx = halfW + Math.min(W, H) * (0.5 * 1.5)
    const b_cy = H * 0.42
    const b_R  = Math.min(80, R * 3000) * (1 + osc * 0.3)

    // Outer surface
    const bGrad = ctx.createRadialGradient(b_cx, b_cy, 0, b_cx, b_cy, b_R)
    bGrad.addColorStop(0, 'rgba(255,255,255,0.05)')
    bGrad.addColorStop(0.7, 'rgba(167,139,250,0.12)')
    bGrad.addColorStop(1, 'rgba(139,92,246,0.5)')
    ctx.fillStyle = bGrad
    ctx.beginPath(); ctx.arc(b_cx, b_cy, b_R, 0, Math.PI * 2); ctx.fill()

    ctx.strokeStyle = '#8B5CF6'
    ctx.lineWidth = 3
    ctx.beginPath(); ctx.arc(b_cx, b_cy, b_R, 0, Math.PI * 2); ctx.stroke()

    // Inner surface (soap film has 2 surfaces)
    ctx.strokeStyle = '#C4B5FD80'
    ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.arc(b_cx, b_cy, b_R - 5, 0, Math.PI * 2); ctx.stroke()

    // Iridescent glint
    const glintGrad = ctx.createLinearGradient(b_cx - b_R * 0.5, b_cy - b_R * 0.6, b_cx, b_cy - b_R * 0.2)
    glintGrad.addColorStop(0, 'rgba(255,255,255,0.5)')
    glintGrad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = glintGrad
    ctx.beginPath(); ctx.ellipse(b_cx - b_R * 0.25, b_cy - b_R * 0.4, b_R * 0.25, b_R * 0.15, -0.4, 0, Math.PI * 2); ctx.fill()

    ctx.fillStyle = '#1C1B1F'
    ctx.font = `bold ${fs}px 'Roboto', sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText('Soap Bubble', b_cx, H * 0.75)
    ctx.fillStyle = '#7C3AED'
    ctx.font = `${fs}px 'Roboto', sans-serif`
    ctx.fillText(`ΔP = 4T/R = ${dP_bubble.toFixed(1)} Pa`, b_cx, H * 0.75 + fs + 6)

    // ── Bottom info ──
    ctx.fillStyle = '#F4EFF4'
    ctx.beginPath(); ctx.roundRect(Math.min(W, H) * (0.06 * 1.5), H * 0.86, Math.min(W, H) * (0.88 * 1.5), 42, 8); ctx.fill()
    ctx.fillStyle = '#21005D'
    ctx.font = `bold ${Math.max(9, fs - 1)}px 'Roboto', sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText(
      `T = ${T.toFixed(4)} N/m   |   R = ${(R * 100).toFixed(1)} cm   |   Surface energy = 2×4πR²T = ${(2 * 4 * Math.PI * R * R * T).toFixed(4)} J`,
      W / 2, H * 0.86 + 26
    )
  }, [T, R, dP_bubble, dP_drop, isPlaying])

  timeRef.current  = 0
  phaseRef.current = 0

  return <CanvasEngine {...props} draw={draw} deps={[T, R, isPlaying]} animated />
}
