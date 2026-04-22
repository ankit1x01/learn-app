import { useCallback } from 'react'
import Matter from 'matter-js'
import { SimProps } from '../../types'
import { MatterEngine } from '../../engines/MatterEngine'

const M_SCALE = 5

export function CollisionElasticSim(props: SimProps) {
  const { controls } = props
  const m1 = controls['m1'] ?? 2
  const m2 = controls['m2'] ?? 2
  const u1 = controls['u1'] ?? 6
  const cor = controls['cor'] ?? 1

  const setup = useCallback((
    engine: Matter.Engine,
    _render: Matter.Render,
    canvas: HTMLCanvasElement
  ) => {
    const W = canvas.clientWidth || 380
    const H = canvas.clientHeight || 300
    const groundY = H - 30
    engine.gravity.y = 0

    const track = Matter.Bodies.rectangle(W / 2, groundY + 10, W, 20, {
      isStatic: true,
      render: { fillStyle: '#CAC4D0' },
    })

    const leftWall = Matter.Bodies.rectangle(-10, H / 2, 20, H, {
      isStatic: true,
      render: { fillStyle: '#CAC4D0' },
    })

    const rightWall = Matter.Bodies.rectangle(W + 10, H / 2, 20, H, {
      isStatic: true,
      render: { fillStyle: '#CAC4D0' },
    })

    const r1 = Math.sqrt(m1) * M_SCALE
    const r2 = Math.sqrt(m2) * M_SCALE
    const centerY = groundY - Math.max(r1, r2)

    const ball1 = Matter.Bodies.circle(W * 0.25, centerY, r1, {
      mass: m1,
      restitution: cor,
      frictionAir: 0,
      friction: 0,
      render: { fillStyle: '#6750A4' },
      label: 'ball1',
    })

    const ball2 = Matter.Bodies.circle(W * 0.65, centerY, r2, {
      mass: m2,
      restitution: cor,
      frictionAir: 0,
      friction: 0,
      render: { fillStyle: '#F43F5E' },
      label: 'ball2',
    })

    Matter.Body.setVelocity(ball1, { x: u1 * 0.4, y: 0 })
    Matter.Body.setVelocity(ball2, { x: 0, y: 0 })

    Matter.World.add(engine.world, [track, leftWall, rightWall, ball1, ball2])

    return () => { Matter.World.clear(engine.world, false) }
  }, [m1, m2, u1, cor])

  return <MatterEngine {...props} setup={setup} />
}
