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
    render: Matter.Render,
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
    const equilibriumX = Math.min(W, H) * (0.55 * 1.5)
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

    // Formula overlay — drawn after every Matter.Render frame
    const drawFormula = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const cW = canvas.width
      const cH = canvas.height
      const dpr = window.devicePixelRatio || 1

      // Derived values from current closure variables
      const omega = Math.sqrt(k / mass)           // rad/s
      const Tcur  = (2 * Math.PI) / omega         // s
      const fcur  = omega / (2 * Math.PI)         // Hz

      const fs = Math.max(10, Math.round(Math.min(cW, cH) / dpr * 0.038))
      const lineH = fs + 8
      const rows = [
        `ω = √(k/m)`,
        `ω = ${omega.toFixed(2)} rad/s`,
        `T = 2π/ω = ${Tcur.toFixed(2)} s`,
        `f = ω/2π = ${fcur.toFixed(2)} Hz`,
      ]
      const panelW = 158 * dpr
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

      ctx.textAlign = 'left'
      rows.forEach((row, i) => {
        const ry = panelY + (12 + i * lineH) * dpr + fs * dpr * 0.85
        if (i === 0) {
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
  }, [k, mass, amplitude])

  return <MatterEngine {...props} setup={setup} />
}
