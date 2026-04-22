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
    _render: Matter.Render,
    canvas: HTMLCanvasElement
  ) => {
    const W = canvas.clientWidth  || 380
    const H = canvas.clientHeight || 300

    engine.gravity.y = 1

    const rad      = (angleDeg * Math.PI) / 180
    const rampLen  = Math.min(W * 0.7, 260)
    const rampH    = rampLen * Math.tan(rad)

    const rampCx = W * 0.45
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

    return () => { Matter.World.clear(engine.world, false) }
  }, [angleDeg, mu, mass])

  return <MatterEngine {...props} setup={setup} />
}
