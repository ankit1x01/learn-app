import { useCallback } from 'react'
import Matter from 'matter-js'
import { SimProps } from '../../types'
import { MatterEngine } from '../../engines/MatterEngine'

export function AtwoodMachineSim(props: SimProps) {
  const { controls } = props
  const m1 = controls['m1'] ?? 3   // kg
  const m2 = controls['m2'] ?? 5   // kg

  const setup = useCallback((
    engine: Matter.Engine,
    _render: Matter.Render,
    canvas: HTMLCanvasElement
  ) => {
    const W = canvas.clientWidth  || 380
    const H = canvas.clientHeight || 300

    engine.gravity.y = 1

    const pulleyX = W / 2
    const pulleyY = 40
    const ropeLen = H * 0.55

    // Pulley (visual only — static circle)
    const pulley = Matter.Bodies.circle(pulleyX, pulleyY, 18, {
      isStatic: true,
      render: { fillStyle: '#6750A4' },
      label: 'pulley',
      collisionFilter: { mask: 0 },
    })

    const blockSize = 28
    const b1Y = pulleyY + ropeLen * (m2 / (m1 + m2))
    const b2Y = pulleyY + ropeLen * (m1 / (m1 + m2))

    const block1 = Matter.Bodies.rectangle(pulleyX - 60, b1Y, blockSize, blockSize + m1 * 4, {
      mass: m1,
      frictionAir: 0.015,
      render: { fillStyle: '#F43F5E' },
      label: 'block1',
      collisionFilter: { mask: 0 },
    })

    const block2 = Matter.Bodies.rectangle(pulleyX + 60, b2Y, blockSize, blockSize + m2 * 4, {
      mass: m2,
      frictionAir: 0.015,
      render: { fillStyle: '#3B82F6' },
      label: 'block2',
      collisionFilter: { mask: 0 },
    })

    // String: two constraints, one per block to the pulley centre
    const rope1 = Matter.Constraint.create({
      pointA: { x: pulleyX, y: pulleyY },
      bodyB: block1,
      length: Math.abs(block1.position.y - pulleyY),
      stiffness: 0.98,
      damping: 0.02,
      render: { strokeStyle: '#CAC4D0', lineWidth: 2, anchors: false },
    })

    const rope2 = Matter.Constraint.create({
      pointA: { x: pulleyX, y: pulleyY },
      bodyB: block2,
      length: Math.abs(block2.position.y - pulleyY),
      stiffness: 0.98,
      damping: 0.02,
      render: { strokeStyle: '#CAC4D0', lineWidth: 2, anchors: false },
    })

    Matter.World.add(engine.world, [pulley, block1, block2, rope1, rope2])

    return () => { Matter.World.clear(engine.world, false) }
  }, [m1, m2])

  return <MatterEngine {...props} setup={setup} />
}
