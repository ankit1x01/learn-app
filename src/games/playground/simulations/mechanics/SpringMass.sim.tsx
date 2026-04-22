import { useCallback } from 'react'
import Matter from 'matter-js'
import { SimProps } from '../../types'
import { MatterEngine } from '../../engines/MatterEngine'

export function SpringMassSim(props: SimProps) {
  const { controls } = props
  const k = controls['k'] ?? 200
  const mass = controls['mass'] ?? 1
  const amplitude = (controls['amplitude'] ?? 8) / 100

  const setup = useCallback((
    engine: Matter.Engine,
    _render: Matter.Render,
    canvas: HTMLCanvasElement
  ) => {
    const W = canvas.clientWidth || 380
    const H = canvas.clientHeight || 300
    engine.gravity.y = 0

    const wall = Matter.Bodies.rectangle(30, H / 2, 20, H * 0.5, {
      isStatic: true,
      render: { fillStyle: '#CAC4D0' },
    })

    const blockSize = Math.sqrt(mass) * 18 + 14
    const equilibriumX = W * 0.55
    const block = Matter.Bodies.rectangle(
      equilibriumX + amplitude * 200,
      H / 2,
      blockSize, blockSize,
      {
        mass,
        frictionAir: 0.005,
        render: { fillStyle: '#6750A4' },
        label: 'block',
      }
    )

    const spring = Matter.Constraint.create({
      pointA: { x: 40, y: H / 2 },
      bodyB: block,
      pointB: { x: -blockSize / 2, y: 0 },
      stiffness: k / 50000,
      damping: 0,
      render: {
        strokeStyle: '#F43F5E',
        lineWidth: 2,
        type: 'line',
        anchors: true,
      },
    })

    Matter.World.add(engine.world, [wall, block, spring])

    return () => { Matter.World.clear(engine.world, false) }
  }, [k, mass, amplitude])

  return <MatterEngine {...props} setup={setup} />
}
