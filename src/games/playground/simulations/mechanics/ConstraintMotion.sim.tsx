import { useCallback } from 'react'
import Matter from 'matter-js'
import { SimProps } from '../../types'
import { MatterEngine } from '../../engines/MatterEngine'

/**
 * Constraint Motion — two blocks connected by a string over a frictionless edge.
 * Block A (mass m1) on a horizontal table, Block B (mass m2) hangs vertically.
 * Classic "modified Atwood on table" constraint.
 */
export function ConstraintMotionSim(props: SimProps) {
  const { controls } = props
  const m1 = controls['m1'] ?? 4   // kg — block on table
  const m2 = controls['m2'] ?? 2   // kg — hanging block

  const setup = useCallback((
    engine: Matter.Engine,
    render: Matter.Render,
    canvas: HTMLCanvasElement
  ) => {
    const W = canvas.clientWidth  || 380
    const H = canvas.clientHeight || 300

    engine.gravity.y = 1

    const tableY = H * 0.38
    const tableH = 10

    // Table surface
    const table = Matter.Bodies.rectangle(Math.min(W, H) * (0.45 * 1.5), tableY, Math.min(W, H) * (0.75 * 1.5), tableH, {
      isStatic: true,
      friction: 0,
      render: { fillStyle: '#6750A4' },
      label: 'table',
    })

    // Block A on table
    const bSizeA = Math.sqrt(m1) * 14 + 10
    const blockA = Matter.Bodies.rectangle(
      Math.min(W, H) * (0.28 * 1.5), tableY - bSizeA / 2 - tableH / 2,
      bSizeA, bSizeA,
      { mass: m1, friction: 0, frictionAir: 0.005, render: { fillStyle: '#F43F5E' }, label: 'A' }
    )

    // Pulley (corner of table — right edge)
    const pulleyX = Math.min(W, H) * (0.82 * 1.5)
    const pulleyY = tableY
    const pulley  = Matter.Bodies.circle(pulleyX, pulleyY, 10, {
      isStatic: true,
      render: { fillStyle: '#CAC4D0' },
      label: 'pulley',
      collisionFilter: { mask: 0 },
    })

    // Block B hanging
    const bSizeB = Math.sqrt(m2) * 14 + 10
    const blockB = Matter.Bodies.rectangle(
      pulleyX, tableY + 60,
      bSizeB, bSizeB,
      { mass: m2, frictionAir: 0.005, render: { fillStyle: '#3B82F6' }, label: 'B', collisionFilter: { mask: 0 } }
    )

    // String A → pulley → B (two constraints)
    const ropeA = Matter.Constraint.create({
      bodyA: blockA, pointA: { x: bSizeA / 2, y: 0 },
      pointB: { x: pulleyX, y: pulleyY },
      stiffness: 0.9, damping: 0.01,
      render: { strokeStyle: '#CAC4D0', lineWidth: 2, anchors: false },
    })
    const ropeB = Matter.Constraint.create({
      pointA: { x: pulleyX, y: pulleyY },
      bodyB: blockB, pointB: { x: 0, y: -bSizeB / 2 },
      stiffness: 0.9, damping: 0.01,
      render: { strokeStyle: '#CAC4D0', lineWidth: 2, anchors: false },
    })

    // Ground
    const ground = Matter.Bodies.rectangle(W / 2, H - 10, W, 20, {
      isStatic: true,
      render: { fillStyle: '#CAC4D0' },
    })

    Matter.World.add(engine.world, [table, blockA, pulley, blockB, ropeA, ropeB, ground])

    // ---- Physics constants for FBD ----
    const g_SI   = 9.81
    const W1     = m1 * g_SI                    // Weight of A (N)
    const W2     = m2 * g_SI                    // Weight of B (N)
    const a_SI   = (m2 * g_SI) / (m1 + m2)     // Acceleration (m/s²) — frictionless
    const T_SI   = (m1 * m2 * g_SI) / (m1 + m2) // Tension (N)
    const PX_PER_N = 3.0                        // 1 N = 3 px

    // Helper: draw an arrow from (x,y) by (dx,dy) with label at tip
    function drawArrow(
      ctx: CanvasRenderingContext2D,
      x: number, y: number,
      dx: number, dy: number,
      label: string,
      color: string,
      fs: number,
    ) {
      const len = Math.sqrt(dx * dx + dy * dy)
      if (len < 4) return
      const angle = Math.atan2(dy, dx)
      const headLen = 8

      ctx.save()
      ctx.strokeStyle = color
      ctx.fillStyle   = color
      ctx.lineWidth   = 2.5

      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + dx, y + dy)
      ctx.stroke()

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

      ctx.font = `bold ${fs}px 'Roboto', sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(label, x + dx + Math.cos(angle) * 16, y + dy + Math.sin(angle) * 16)
      ctx.restore()
    }

    const afterRenderHandler = () => {
      const ctx = render.context as CanvasRenderingContext2D
      const fs  = Math.max(9, Math.round(Math.min(W, H) * 0.032))

      // --- Block A (on table) ---
      const ax = blockA.position.x
      const ay = blockA.position.y

      // Weight: downward (red) — from block centre
      drawArrow(ctx, ax, ay, 0, Math.min(45, W1 * PX_PER_N), `W=${W1.toFixed(1)}N`, '#DC2626', fs)
      // Normal: upward (blue) — from block centre
      drawArrow(ctx, ax, ay, 0, -Math.min(45, W1 * PX_PER_N), `N=${W1.toFixed(1)}N`, '#1D4ED8', fs)
      // Tension: rightward (green) — from right edge toward pulley
      drawArrow(ctx, ax + bSizeA / 2, ay, Math.min(42, T_SI * PX_PER_N), 0, `T=${T_SI.toFixed(1)}N`, '#16A34A', fs)

      // --- Block B (hanging) ---
      const bx = blockB.position.x
      const by = blockB.position.y

      // Weight: downward (red) — from block bottom
      drawArrow(ctx, bx, by + bSizeB / 2, 0, Math.min(45, W2 * PX_PER_N), `W=${W2.toFixed(1)}N`, '#DC2626', fs)
      // Tension: upward (green) — from block top
      drawArrow(ctx, bx, by - bSizeB / 2, 0, -Math.min(42, T_SI * PX_PER_N), `T=${T_SI.toFixed(1)}N`, '#16A34A', fs)

      // --- Formula overlay panel (top-left) ---
      const panelX = 12
      const panelY = 12
      const panelW = Math.min(W * 0.52, 200)
      const panelH = fs * 5.5

      ctx.save()
      ctx.fillStyle = 'rgba(255,255,255,0.92)'
      ctx.beginPath()
      if (ctx.roundRect) {
        ctx.roundRect(panelX, panelY, panelW, panelH, 10)
      } else {
        ctx.rect(panelX, panelY, panelW, panelH)
      }
      ctx.fill()
      ctx.strokeStyle = '#CAC4D0'
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.fillStyle = '#6750A4'
      ctx.font = `bold ${fs}px 'Roboto', sans-serif`
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      const lh = fs * 1.55   // line height
      ctx.fillText(`a = m₂g/(m₁+m₂)`, panelX + 8, panelY + 6)
      ctx.fillText(`  = ${a_SI.toFixed(2)} m/s²`, panelX + 8, panelY + 6 + lh)
      ctx.fillText(`T = m₁m₂g/(m₁+m₂)`, panelX + 8, panelY + 6 + lh * 2)
      ctx.fillText(`  = ${T_SI.toFixed(2)} N`, panelX + 8, panelY + 6 + lh * 3)
      ctx.restore()
    }

    Matter.Events.on(render, 'afterRender', afterRenderHandler)

    return () => {
      Matter.Events.off(render, 'afterRender', afterRenderHandler)
      Matter.World.clear(engine.world, false)
    }
  }, [m1, m2])

  return <MatterEngine {...props} setup={setup} />
}
