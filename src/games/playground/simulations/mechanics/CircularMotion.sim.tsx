import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/** Circular Motion — object on a string spinning in horizontal circle, centripetal force display */
export function CircularMotionSim(props: SimProps) {
  const { controls, isPlaying } = props
  const mass   = controls['mass']   ?? 0.5   // kg
  const radius = controls['radius'] ?? 1.0   // m
  const speed  = controls['speed']  ?? 3.0   // m/s

  const omega  = speed / radius          // rad/s
  const F_c    = mass * speed * speed / radius  // N centripetal
  const T_period = 2 * Math.PI / omega   // s
  const a_c    = speed * speed / radius   // m/s²

  const phaseRef = useRef(0)

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    if (isPlaying) phaseRef.current += omega * dt
    const angle = phaseRef.current

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'; ctx.fillRect(0, 0, W, H)

    const cx = Math.min(W, H) * (0.42 * 1.5), cy = H * 0.48
    const SCALE = Math.min(W, H) * 0.35 / Math.max(radius, 0.5)
    const pixR  = radius * SCALE

    // Orbit
    ctx.strokeStyle = '#CAC4D0'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4])
    ctx.beginPath(); ctx.arc(cx, cy, pixR, 0, Math.PI * 2); ctx.stroke()
    ctx.setLineDash([])

    // Centre pivot
    ctx.fillStyle = '#1C1B1F'
    ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill()

    // String
    const bx = cx + pixR * Math.cos(angle), by = cy + pixR * Math.sin(angle)
    ctx.strokeStyle = '#6750A4'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(bx, by); ctx.stroke()

    // Object
    const objGrad = ctx.createRadialGradient(bx, by, 0, bx, by, 12)
    objGrad.addColorStop(0, '#EADDFF'); objGrad.addColorStop(1, '#6750A4')
    ctx.fillStyle = objGrad
    ctx.beginPath(); ctx.arc(bx, by, 12, 0, Math.PI * 2); ctx.fill()

    // Velocity arrow (tangent)
    const vAngle = angle + Math.PI / 2
    const vLen   = 35
    ctx.strokeStyle = '#F43F5E'; ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(bx, by)
    ctx.lineTo(bx + Math.cos(vAngle) * vLen, by + Math.sin(vAngle) * vLen)
    ctx.stroke()
    ctx.fillStyle = '#F43F5E'
    ctx.beginPath()
    const vex = bx + Math.cos(vAngle) * vLen, vey = by + Math.sin(vAngle) * vLen
    ctx.moveTo(vex, vey)
    ctx.lineTo(vex - Math.cos(vAngle - 0.4) * 8, vey - Math.sin(vAngle - 0.4) * 8)
    ctx.lineTo(vex - Math.cos(vAngle + 0.4) * 8, vey - Math.sin(vAngle + 0.4) * 8)
    ctx.closePath(); ctx.fill()
    ctx.fillStyle = '#F43F5E'; ctx.font = `bold ${Math.max(9, Math.round(Math.min(W, H) * (0.026 * 1.5)))}px 'Roboto', sans-serif`
    ctx.textAlign = 'left'; ctx.fillText(`v=${speed}m/s`, vex + 4, vey)

    // Centripetal force arrow (towards centre)
    const fcLen = Math.min(45, F_c * 5)
    const fcAngle = Math.atan2(cy - by, cx - bx)
    ctx.strokeStyle = '#10B981'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(bx, by)
    ctx.lineTo(bx + Math.cos(fcAngle) * fcLen, by + Math.sin(fcAngle) * fcLen)
    ctx.stroke()
    ctx.fillStyle = '#10B981'
    const fex = bx + Math.cos(fcAngle) * fcLen, fey = by + Math.sin(fcAngle) * fcLen
    ctx.beginPath(); ctx.moveTo(fex, fey)
    ctx.lineTo(fex - Math.cos(fcAngle - 0.4) * 8, fey - Math.sin(fcAngle - 0.4) * 8)
    ctx.lineTo(fex - Math.cos(fcAngle + 0.4) * 8, fey - Math.sin(fcAngle + 0.4) * 8)
    ctx.closePath(); ctx.fill()

    // Info panel
    const px = cx + pixR + 22, py = cy - 60
    const pw = W - px - 8
    const fs = Math.max(10, Math.round(Math.min(W, H) * (0.028 * 1.5)))
    const rows = [
      { l: 'r',      v: `${radius.toFixed(1)} m`     },
      { l: 'v',      v: `${speed.toFixed(1)} m/s`    },
      { l: 'ω',      v: `${omega.toFixed(2)} rad/s`  },
      { l: 'F_c',    v: `${F_c.toFixed(2)} N`        },
      { l: 'a_c',    v: `${a_c.toFixed(2)} m/s²`     },
      { l: 'T',      v: `${T_period.toFixed(2)} s`   },
    ]
    ctx.fillStyle = '#F4EFF4'
    ctx.beginPath(); ctx.roundRect(px, py, pw, rows.length * (fs + 8) + 14, 10); ctx.fill()
    rows.forEach(({ l, v }, i) => {
      const ry = py + 12 + i * (fs + 8) + fs * 0.85
      ctx.fillStyle = '#49454F'; ctx.font = `${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'left'; ctx.fillText(l, px + 8, ry)
      ctx.fillStyle = '#6750A4'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'right'; ctx.fillText(v, px + pw - 6, ry)
    })

    // Formula
    ctx.fillStyle = '#EADDFF'
    ctx.beginPath(); ctx.roundRect(8, H - 28, W - 16, 22, 6); ctx.fill()
    ctx.fillStyle = '#21005D'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(`F_c = mv²/r = ${F_c.toFixed(2)} N  |  a_c = v²/r = ${a_c.toFixed(2)} m/s²`, W / 2, H - 12)
  }, [mass, radius, speed, omega, F_c, T_period, a_c, isPlaying])

  phaseRef.current = 0
  return <CanvasEngine {...props} draw={draw} deps={[mass, radius, speed, isPlaying]} animated />
}
