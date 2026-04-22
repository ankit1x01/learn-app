import { useCallback } from 'react'
import Matter from 'matter-js'
import { SimProps } from '../../types'
import { MatterEngine } from '../../engines/MatterEngine'

const PPM = 50 // pixels per metre

export function RollingSim(props: SimProps) {
  const { controls } = props
  const angleDeg = controls['angle'] ?? 30
  const radius   = controls['radius'] ?? 0.15  // metres
  const mass     = controls['mass']   ?? 2     // kg

  const setup = useCallback((
    engine: Matter.Engine,
    _render: Matter.Render,
    canvas: HTMLCanvasElement
  ) => {
    const W = canvas.clientWidth  || 380
    const H = canvas.clientHeight || 300

    engine.gravity.y = 1

    const rad     = (angleDeg * Math.PI) / 180
    const rampLen = Math.min(Math.min(W, H) * (0.72 * 1.5), 270)
    const rampH   = rampLen * Math.tan(rad)
    const rampCx  = Math.min(W, H) * (0.44 * 1.5)
    const rampCy  = H - 50 - rampH / 2

    // Inclined ramp
    const ramp = Matter.Bodies.rectangle(rampCx, rampCy, rampLen, 10, {
      isStatic: true,
      angle: -rad,
      friction: 1,
      render: { fillStyle: '#6750A4' },
      label: 'ramp',
    })

    // Ground
    const ground = Matter.Bodies.rectangle(W / 2, H - 20, W, 40, {
      isStatic: true,
      friction: 1,
      render: { fillStyle: '#CAC4D0' },
    })

    // Rolling cylinder (circle in 2D approximates a cylinder cross-section)
    const pixR  = radius * PPM
    const topX  = rampCx + (rampLen * 0.4) * Math.cos(rad)
    const topY  = rampCy - (rampLen * 0.4) * Math.sin(rad) - pixR - 5

    const cylinder = Matter.Bodies.circle(topX, topY, pixR, {
      mass,
      friction: 1,
      frictionAir: 0.002,
      restitution: 0,
      // Moment of inertia for solid cylinder = ½mr²; Matter handles rotational physics
      render: { fillStyle: '#F43F5E' },
      label: 'cylinder',
    })

    // Centre-dot to visualise rotation
    const dot = Matter.Bodies.circle(topX, topY, 2, {
      isStatic: false,
      collisionFilter: { mask: 0 },
      isSensor: true,
      render: { fillStyle: '#FFFFFF' },
      label: 'dot',
    })

    Matter.World.add(engine.world, [ramp, ground, cylinder, dot])

    // Sync dot with cylinder each tick
    const sync = Matter.Events.on(engine, 'afterUpdate', () => {
      Matter.Body.setPosition(dot, cylinder.position)
      Matter.Body.setAngle(dot, cylinder.angle)
    })

    return () => {
      Matter.Events.off(engine, 'afterUpdate', sync)
      Matter.World.clear(engine.world, false)
    }
  }, [angleDeg, radius, mass])

  return <MatterEngine {...props} setup={setup} />
}
