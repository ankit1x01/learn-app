import { useCallback } from 'react'
import Matter from 'matter-js'
import { SimProps } from '../../types'
import { MatterEngine } from '../../engines/MatterEngine'

const PIXELS_PER_METER = 60

export function PendulumSim(props: SimProps) {
  const { controls } = props
  const length = controls['length'] ?? 1.2       // metres
  const angle  = controls['angle']  ?? 25        // degrees

  const setup = useCallback((
    engine: Matter.Engine,
    _render: Matter.Render,
    canvas: HTMLCanvasElement
  ) => {
    const W = canvas.clientWidth || 380
    const H = canvas.clientHeight || 300

    engine.gravity.y = 1          // matter default = 1 g

    const pivotX = W / 2
    const pivotY = 60

    const pixLen = length * PIXELS_PER_METER
    const rad    = (angle * Math.PI) / 180
    const bobX   = pivotX + pixLen * Math.sin(rad)
    const bobY   = pivotY + pixLen * Math.cos(rad)

    const pivot = Matter.Bodies.circle(pivotX, pivotY, 6, {
      isStatic: true,
      render: { fillStyle: '#6750A4' },
      label: 'pivot',
    })

    const bob = Matter.Bodies.circle(bobX, bobY, 14, {
      restitution: 0,
      frictionAir: 0.003,
      render: { fillStyle: '#F43F5E' },
      label: 'bob',
    })

    const rod = Matter.Constraint.create({
      bodyA: pivot,
      bodyB: bob,
      length: pixLen,
      stiffness: 1,
      damping: 0,
      render: {
        strokeStyle: '#CAC4D0',
        lineWidth: 2,
        anchors: false,
      },
    })

    // Equilibrium marker
    const eqLine = Matter.Bodies.rectangle(pivotX, pivotY + pixLen / 2, 2, pixLen, {
      isStatic: true,
      isSensor: true,
      render: { fillStyle: '#CAC4D040', strokeStyle: '#00000000' },
      collisionFilter: { mask: 0 },
    })

    Matter.World.add(engine.world, [pivot, bob, rod, eqLine])

    return () => { Matter.World.clear(engine.world, false) }
  }, [length, angle])

  return <MatterEngine {...props} setup={setup} />
}
