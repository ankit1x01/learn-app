import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

export function RigidBodyRotationSim(props: SimProps) {
  const { controls, isPlaying } = props
  const torque = controls['torque'] ?? 20   // N·m
  const I      = controls['I']      ?? 5    // moment of inertia kg·m²
  const mu_k   = controls['mu_k']   ?? 0.05 // rotational damping proxy

  const timeRef  = useRef(0)
  const stateRef = useRef({ omega: 0, theta: 0 })

  const alpha = torque / I  // angular acceleration rad/s²

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    if (isPlaying) {
      const s = stateRef.current
      s.omega += (alpha - mu_k * s.omega) * dt
      s.theta += s.omega * dt
    }

    const { omega, theta } = stateRef.current

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    const cx = Math.min(W, H) * (0.42 * 1.5)
    const cy = H * 0.5
    const R  = Math.min(W, H) * 0.28

    // ── Disk ──
    const diskGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R)
    diskGrad.addColorStop(0, '#EADDFF')
    diskGrad.addColorStop(1, '#6750A4')
    ctx.fillStyle = diskGrad
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(theta)
    ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill()

    // Spokes to show rotation
    ctx.strokeStyle = '#FFFFFF60'
    ctx.lineWidth = 2
    for (let i = 0; i < 4; i++) {
      const ang = (i * Math.PI) / 2
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(R * Math.cos(ang), R * Math.sin(ang)); ctx.stroke()
    }

    // Red mark (like a paint mark to see rotation)
    ctx.fillStyle = '#F43F5E'
    ctx.beginPath(); ctx.arc(R * 0.7, 0, 5, 0, Math.PI * 2); ctx.fill()

    ctx.restore()

    // Pivot
    ctx.fillStyle = '#1C1B1F'
    ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill()

    // Torque arrow (curved)
    ctx.strokeStyle = '#F59E0B'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.arc(cx, cy, R + 14, -Math.PI * 0.2, Math.PI * 0.8, false)
    ctx.stroke()
    // Arrowhead
    const endAng = Math.PI * 0.8
    const ax = cx + (R + 14) * Math.cos(endAng)
    const ay = cy + (R + 14) * Math.sin(endAng)
    ctx.fillStyle = '#F59E0B'
    ctx.beginPath()
    ctx.moveTo(ax, ay)
    ctx.lineTo(ax - 10 * Math.cos(endAng - 0.5), ay - 10 * Math.sin(endAng - 0.5))
    ctx.lineTo(ax - 10 * Math.cos(endAng + 0.5), ay - 10 * Math.sin(endAng + 0.5))
    ctx.closePath(); ctx.fill()

    // ── Info panel (right side) ──
    const px = cx + R + 38
    const py = cy - 80
    const fs = Math.max(10, Math.round(Math.min(W, H) * (0.028 * 1.5)))
    const ke = 0.5 * I * omega * omega

    const rows = [
      { label: 'τ (torque)',       value: `${torque.toFixed(1)} N·m`   },
      { label: 'I (inertia)',      value: `${I.toFixed(1)} kg·m²`      },
      { label: 'α = τ/I',         value: `${alpha.toFixed(2)} rad/s²`  },
      { label: 'ω(t) = αt',       value: `${omega.toFixed(2)} rad/s`   },
      { label: 'θ (angle)',        value: `${((theta % (2 * Math.PI)) * 180 / Math.PI).toFixed(1)}°` },
      { label: 'KE = ½Iω²',       value: `${ke.toFixed(2)} J`         },
    ]

    const panelH = rows.length * (fs + 10) + 28  // extra room for heading
    ctx.fillStyle = '#F4EFF4'
    ctx.beginPath()
    ctx.roundRect(px - 8, py - 4, W - px - 2, panelH, 10)
    ctx.fill()

    // Governing formula header — τ = Iα
    const headFs = Math.max(12, Math.round(Math.min(W, H) * (0.032 * 1.5)))
    ctx.fillStyle = '#F59E0B'
    ctx.font = `bold ${headFs}px 'Roboto', sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText('τ = Iα', px + (W - px - 10) / 2, py + headFs - 2)

    // Divider
    ctx.strokeStyle = '#CAC4D0'; ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(px - 4, py + headFs + 4)
    ctx.lineTo(W - 6, py + headFs + 4)
    ctx.stroke()

    rows.forEach(({ label, value }, i) => {
      const ry = py + headFs + 10 + i * (fs + 10) + fs
      ctx.fillStyle = '#49454F'
      ctx.font = `${fs}px 'Roboto', sans-serif`
      ctx.textAlign = 'left'
      ctx.fillText(label, px, ry)
      ctx.fillStyle = '#6750A4'
      ctx.font = `bold ${fs}px 'Roboto', sans-serif`
      ctx.textAlign = 'right'
      ctx.fillText(value, W - 6, ry)
    })
  }, [torque, I, mu_k, alpha, isPlaying])

  // Reset on control change
  stateRef.current = { omega: 0, theta: 0 }
  timeRef.current  = 0

  return <CanvasEngine {...props} draw={draw} deps={[torque, I, mu_k, isPlaying]} animated />
}
