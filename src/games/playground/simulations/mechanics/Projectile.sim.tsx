import { useCallback } from 'react'
import Matter from 'matter-js'
import { SimProps } from '../../types'
import { MatterEngine } from '../../engines/MatterEngine'

const G_SCALE = 0.001
const M_SCALE = 4

export function ProjectileSim(props: SimProps) {
  const { controls, isPlaying } = props
  const angle = controls['angle'] ?? 45
  const speed = controls['speed'] ?? 20
  const height = controls['height'] ?? 0

  const setup = useCallback((
    engine: Matter.Engine,
    _render: Matter.Render,
    canvas: HTMLCanvasElement
  ) => {
    const W = canvas.clientWidth || 380
    const H = canvas.clientHeight || 300
    const groundY = H - 40

    engine.gravity.y = 9.81 * G_SCALE

    const ground = Matter.Bodies.rectangle(W / 2, groundY + 20, W, 40, {
      isStatic: true,
      render: { fillStyle: '#CAC4D0' },
      label: 'ground',
    })

    const platformH = height * M_SCALE
    const platformBody = Matter.Bodies.rectangle(40, groundY - platformH / 2, 20, Math.max(platformH, 2), {
      isStatic: true,
      render: { fillStyle: '#6750A4' },
      label: 'platform',
    })

    const rad = (angle * Math.PI) / 180
    const vx = Math.cos(rad) * speed * M_SCALE * 0.06
    const vy = -Math.sin(rad) * speed * M_SCALE * 0.06
    const ballY = groundY - platformH - 8
    const ball = Matter.Bodies.circle(40, ballY, 8, {
      restitution: 0,
      friction: 0,
      frictionAir: 0,
      render: { fillStyle: '#F43F5E' },
      label: 'ball',
    })
    Matter.Body.setVelocity(ball, { x: vx, y: vy })

    const dots: Matter.Body[] = []
    for (let t = 0; t < 3; t += 0.15) {
      const tx = 40 + Math.cos(rad) * speed * M_SCALE * 0.06 * t * 60
      const ty = ballY + (-Math.sin(rad) * speed * M_SCALE * 0.06 * t * 60) + 0.5 * 9.81 * G_SCALE * 3600 * t * t
      if (ty > groundY) break
      const dot = Matter.Bodies.circle(tx, ty, 2, {
        isStatic: true,
        isSensor: true,
        render: { fillStyle: '#6750A460' },
        collisionFilter: { mask: 0 },
        label: 'dot',
      })
      dots.push(dot)
    }

    Matter.World.add(engine.world, [ground, platformBody, ball, ...dots])

    if (!isPlaying) {
      Matter.Runner.stop(Matter.Runner.create())
    }

    return () => {
      Matter.World.clear(engine.world, false)
    }
  }, [angle, speed, height, isPlaying])

  return <MatterEngine {...props} setup={setup} />
}
