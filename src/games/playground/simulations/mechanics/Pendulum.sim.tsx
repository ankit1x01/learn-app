import { useCallback } from 'react'
import Matter from 'matter-js'
import { SimProps } from '../../types'
import { MatterEngine } from '../../engines/MatterEngine'

const PIXELS_PER_METER = 60
const G = 9.81

export function PendulumSim(props: SimProps) {
  const { controls } = props
  const length = controls['length'] ?? 1.2       // metres
  const angle  = controls['angle']  ?? 25        // degrees

  // Derived values — computed outside setup so they're fresh on each render call
  const T = 2 * Math.PI * Math.sqrt(length / G)
  const f = 1 / T

  const setup = useCallback((
    engine: Matter.Engine,
    render: Matter.Render,
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

    // Formula overlay — drawn after every Matter.Render frame
    const drawFormula = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const cW = canvas.width
      const cH = canvas.height
      const dpr = window.devicePixelRatio || 1

      // Recompute from current control values captured in closure
      const Tcur = 2 * Math.PI * Math.sqrt(length / G)
      const fcur = 1 / Tcur

      const fs = Math.max(10, Math.round(Math.min(cW, cH) / dpr * 0.038))
      const lineH = fs + 8
      const rows = [
        `T = 2π√(L/g)`,
        `T = ${Tcur.toFixed(2)} s`,
        `f = 1/T = ${fcur.toFixed(2)} Hz`,
        `L = ${length.toFixed(1)} m`,
      ]
      const panelW = 148 * dpr
      const panelH = rows.length * lineH * dpr + 14 * dpr
      const panelX = cW - panelW - 8 * dpr
      const panelY = 8 * dpr

      ctx.save()
      ctx.resetTransform()

      // Panel background
      ctx.fillStyle = 'rgba(28, 27, 31, 0.72)'
      ctx.beginPath()
      ctx.roundRect(panelX, panelY, panelW, panelH, 8 * dpr)
      ctx.fill()

      ctx.font = `${fs * dpr}px 'Roboto', sans-serif`
      ctx.textAlign = 'left'
      rows.forEach((row, i) => {
        const ry = panelY + (12 + i * lineH) * dpr + fs * dpr * 0.85
        if (i === 0) {
          // Formula label in purple tint
          ctx.fillStyle = '#D0BCFF'
          ctx.font = `bold ${fs * dpr}px 'Roboto', sans-serif`
        } else {
          ctx.fillStyle = '#FFFFFF'
          ctx.font = `${fs * dpr}px 'Roboto', sans-serif`
        }
        ctx.fillText(row, panelX + 8 * dpr, ry)
      })

      ctx.restore()
    }

    Matter.Events.on(render, 'afterRender', drawFormula)

    return () => {
      Matter.Events.off(render, 'afterRender', drawFormula)
      Matter.World.clear(engine.world, false)
    }
  }, [length, angle])

  // suppress lint warning — T and f are used for display only
  void T; void f

  return <MatterEngine {...props} setup={setup} />
}
