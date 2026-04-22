import { useCallback } from 'react'
import Matter from 'matter-js'
import { SimProps } from '../../types'
import { MatterEngine } from '../../engines/MatterEngine'

export function InclinedPlaneSim(props: SimProps) {
  const { controls } = props
  const angleDeg = controls['angle']  ?? 30   // degrees
  const mu       = controls['mu']     ?? 0.3  // coefficient of friction
  const mass     = controls['mass']   ?? 2    // kg

  const setup = useCallback((
    engine: Matter.Engine,
    render: Matter.Render,
    canvas: HTMLCanvasElement
  ) => {
    const W = canvas.clientWidth  || 380
    const H = canvas.clientHeight || 300

    engine.gravity.y = 1

    const rad      = (angleDeg * Math.PI) / 180
    const rampLen  = Math.min(Math.min(W, H) * (0.7 * 1.5), 260)
    const rampH    = rampLen * Math.tan(rad)

    const rampCx = Math.min(W, H) * (0.45 * 1.5)
    const rampCy = H - 50 - rampH / 2

    // Incline body
    const ramp = Matter.Bodies.rectangle(rampCx, rampCy, rampLen, 12, {
      isStatic: true,
      angle: -rad,
      friction: mu,
      render: { fillStyle: '#6750A4' },
      label: 'ramp',
    })

    // Ground
    const ground = Matter.Bodies.rectangle(W / 2, H - 20, W, 40, {
      isStatic: true,
      friction: 0.8,
      render: { fillStyle: '#CAC4D0' },
    })

    // Block (size proportional to mass)
    const blockSize = Math.sqrt(mass) * 14 + 10
    // Place on top of ramp near the upper end
    const blockX = rampCx + (rampLen * 0.25) * Math.cos(rad) - (rampLen * 0.25) * 0.1
    const blockY = rampCy - (rampLen * 0.25) * Math.sin(rad) - blockSize / 2 - 6

    const block = Matter.Bodies.rectangle(blockX, blockY, blockSize, blockSize, {
      mass,
      friction: mu,
      frictionAir: 0.003,
      angle: -rad,
      render: { fillStyle: '#F43F5E' },
      label: 'block',
    })

    Matter.World.add(engine.world, [ramp, ground, block])

    // ---- FBD overlay: drawn each frame after Matter renders ----
    const g = 9.81
    const W_force  = mass * g                   // Weight magnitude (N)
    const N_force  = mass * g * Math.cos(rad)   // Normal magnitude (N)
    const f_max    = mu * N_force               // Max static / kinetic friction (N)
    const F_net    = mass * g * Math.sin(rad)   // Driving force along incline
    const sliding  = F_net > f_max
    const f_actual = sliding ? f_max : F_net    // Friction force actually acting
    const PX_PER_N = 3.5                        // Arrow scale: 1 N → 3.5 px

    // Helper: draw an arrow from (x,y) in direction (dx,dy) with label
    function drawArrow(
      ctx: CanvasRenderingContext2D,
      x: number, y: number,
      dx: number, dy: number,
      label: string,
      color: string,
      fontSize: number,
    ) {
      const len = Math.sqrt(dx * dx + dy * dy)
      if (len < 4) return
      const angle = Math.atan2(dy, dx)
      const headLen = 8

      ctx.save()
      ctx.strokeStyle = color
      ctx.fillStyle   = color
      ctx.lineWidth   = 2.5

      // Shaft
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + dx, y + dy)
      ctx.stroke()

      // Arrowhead
      ctx.beginPath()
      ctx.moveTo(x + dx, y + dy)
      ctx.lineTo(
        x + dx - headLen * Math.cos(angle - Math.PI / 6),
        y + dy - headLen * Math.sin(angle - Math.PI / 6),
      )
      ctx.lineTo(
        x + dx - headLen * Math.cos(angle + Math.PI / 6),
        y + dy - headLen * Math.sin(angle + Math.PI / 6),
      )
      ctx.closePath()
      ctx.fill()

      // Label at arrow tip — offset outward
      const offX = Math.cos(angle) * 14
      const offY = Math.sin(angle) * 14
      ctx.font = `bold ${fontSize}px 'Roboto', sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(label, x + dx + offX, y + dy + offY)
      ctx.restore()
    }

    const afterRenderHandler = () => {
      const ctx = render.context as CanvasRenderingContext2D
      const bx  = block.position.x
      const by  = block.position.y
      const fs  = Math.max(9, Math.round(Math.min(W, H) * 0.03))

      // Weight: straight down (red)
      drawArrow(ctx, bx, by, 0, W_force * PX_PER_N, `mg=${W_force.toFixed(1)}N`, '#DC2626', fs)

      // Normal: perpendicular to incline surface, pointing away from ramp.
      // Incline slopes up-left at angle rad, so the outward normal direction is
      // (sin rad, -cos rad) in canvas coords (x-right, y-down).
      const nx = Math.sin(rad) * N_force * PX_PER_N
      const ny = -Math.cos(rad) * N_force * PX_PER_N
      drawArrow(ctx, bx, by, nx, ny, `N=${N_force.toFixed(1)}N`, '#2563EB', fs)

      // Friction: along incline opposing sliding / tendency.
      // The block tends to slide DOWN the incline, so friction acts UP the incline.
      // Up-incline canvas direction: (cos rad, sin rad) rotated → (+cos rad, -sin rad).
      // But the incline rises toward the LEFT in this scene (ramp angle is negative in
      // Matter coords), so up-incline = (-cos rad, +sin rad) in canvas space.
      const sign = sliding ? 1 : 1   // friction always opposes down-incline tendency
      const fx = sign * Math.cos(rad) * f_actual * PX_PER_N * -1
      const fy = sign * Math.sin(rad) * f_actual * PX_PER_N
      drawArrow(ctx, bx, by, fx, fy, `f=${f_actual.toFixed(1)}N`, '#EA580C', fs)

      // Status label above block
      ctx.save()
      ctx.font = `bold ${fs}px 'Roboto', sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
      ctx.fillStyle = sliding ? '#DC2626' : '#16A34A'
      ctx.fillText(sliding ? 'Sliding' : 'Static', bx, by - blockSize * 0.7)
      ctx.restore()
    }

    Matter.Events.on(render, 'afterRender', afterRenderHandler)

    return () => {
      Matter.Events.off(render, 'afterRender', afterRenderHandler)
      Matter.World.clear(engine.world, false)
    }
  }, [angleDeg, mu, mass])

  return <MatterEngine {...props} setup={setup} />
}
