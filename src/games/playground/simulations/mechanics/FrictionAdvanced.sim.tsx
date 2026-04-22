import { useCallback } from 'react'
import Matter from 'matter-js'
import { SimProps } from '../../types'
import { MatterEngine } from '../../engines/MatterEngine'

export function FrictionAdvancedSim(props: SimProps) {
  const { controls } = props
  const mu_s  = controls['mu_s']  ?? 0.5   // static friction
  const mu_k  = controls['mu_k']  ?? 0.3   // kinetic friction
  const force  = controls['force'] ?? 12   // applied horizontal force (N)
  const mass   = controls['mass']  ?? 4    // kg

  const setup = useCallback((
    engine: Matter.Engine,
    render: Matter.Render,
    canvas: HTMLCanvasElement
  ) => {
    const W = canvas.clientWidth  || 380
    const H = canvas.clientHeight || 300

    engine.gravity.y = 1

    // Ground with friction
    const ground = Matter.Bodies.rectangle(W / 2, H - 20, W, 40, {
      isStatic: true,
      friction: mu_k,
      frictionStatic: mu_s,
      render: { fillStyle: '#CAC4D0' },
      label: 'ground',
    })

    const blockSize = Math.sqrt(mass) * 16 + 14
    const block = Matter.Bodies.rectangle(80, H - 40 - blockSize / 2, blockSize, blockSize, {
      mass,
      friction: mu_k,
      frictionStatic: mu_s,
      frictionAir: 0.001,
      render: { fillStyle: '#F43F5E' },
      label: 'block',
    })

    const g = 9.81
    const maxStaticF = mu_s * mass * g
    const forceMag   = force   // N
    const isSliding  = forceMag > maxStaticF

    const applyForce = Matter.Events.on(engine, 'beforeUpdate', () => {
      if (isSliding) {
        Matter.Body.applyForce(block, block.position, { x: forceMag * 0.001, y: 0 })
      }
    })

    // After each render frame, draw the force arrow and friction state label on top
    const afterRender = Matter.Events.on(render, 'afterRender', () => {
      const ctx = render.context
      if (!ctx) return

      // Block position (updated each frame by Matter)
      const bx = block.position.x
      const by = block.position.y

      // Arrow: scale length with force magnitude (max arrow = 80 px at 2× max static force)
      const maxDisplayForce = maxStaticF * 2
      const arrowLen = Math.min(80, (forceMag / Math.max(maxDisplayForce, 1)) * 80)
      const arrowOpacity = Math.min(1, 0.3 + (forceMag / Math.max(maxDisplayForce, 1)) * 0.7)

      ctx.save()
      ctx.globalAlpha = arrowOpacity
      ctx.strokeStyle = '#6750A4'
      ctx.fillStyle   = '#6750A4'
      ctx.lineWidth   = 3

      const arrowStartX = bx - blockSize / 2 - 4
      const arrowEndX   = arrowStartX - arrowLen
      const arrowY      = by

      ctx.beginPath()
      ctx.moveTo(arrowStartX, arrowY)
      ctx.lineTo(arrowEndX, arrowY)
      ctx.stroke()

      // Arrowhead
      ctx.beginPath()
      ctx.moveTo(arrowEndX, arrowY)
      ctx.lineTo(arrowEndX + 8, arrowY - 5)
      ctx.lineTo(arrowEndX + 8, arrowY + 5)
      ctx.closePath()
      ctx.fill()

      ctx.globalAlpha = 1

      // Force label above arrow
      const fs = Math.max(10, Math.round(Math.min(W, H) * 0.04))
      ctx.font = `bold ${fs}px 'Roboto', sans-serif`
      ctx.textAlign = 'center'
      ctx.fillStyle = '#6750A4'
      ctx.fillText(`F=${forceMag.toFixed(1)}N`, (arrowStartX + arrowEndX) / 2, arrowY - 10)

      // STATIC / SLIDING label
      const labelText = isSliding ? 'SLIDING' : 'STATIC'
      const labelColor = isSliding ? '#B3261E' : '#10B981'
      const labelFs = Math.max(11, Math.round(Math.min(W, H) * 0.045))

      ctx.font = `bold ${labelFs}px 'Roboto', sans-serif`
      ctx.fillStyle = labelColor
      ctx.textAlign = 'center'
      ctx.fillText(labelText, bx, by - blockSize / 2 - 10)

      // Friction force label (opposing direction)
      const frictionMag = isSliding ? mu_k * mass * g : Math.min(forceMag, maxStaticF)
      ctx.font = `${Math.max(9, fs - 2)}px 'Roboto', sans-serif`
      ctx.fillStyle = '#49454F'
      ctx.textAlign = 'center'
      ctx.fillText(`f=${frictionMag.toFixed(1)}N`, bx + blockSize / 2 + 30, by + 4)

      ctx.restore()
    })

    Matter.World.add(engine.world, [ground, block])

    return () => {
      Matter.Events.off(engine, 'beforeUpdate', applyForce)
      Matter.Events.off(render, 'afterRender', afterRender)
      Matter.World.clear(engine.world, false)
    }
  }, [mu_s, mu_k, force, mass])

  return <MatterEngine {...props} setup={setup} />
}
