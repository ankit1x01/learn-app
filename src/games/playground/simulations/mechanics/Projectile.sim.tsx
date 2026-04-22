import { useCallback } from 'react'
import Matter from 'matter-js'
import { SimProps } from '../../types'
import { MatterEngine } from '../../engines/MatterEngine'

const G_SCALE = 0.001
const M_SCALE = 4
const G_REAL  = 9.81   // m/s² — used for formula display only

export function ProjectileSim(props: SimProps) {
  const { controls } = props
  const angle  = controls['angle']  ?? 45
  const speed  = controls['speed']  ?? 20
  const height = controls['height'] ?? 0

  const setup = useCallback((
    engine: Matter.Engine,
    render: Matter.Render,
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

    // ── Formula overlay + landmark dots ──────────────────────────────────────
    const drawOverlay = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const cW  = canvas.width
      const cH  = canvas.height
      const dpr = window.devicePixelRatio || 1

      // Real-world values for NEET formulae (using current closure variables)
      const radCur  = (angle * Math.PI) / 180
      const sinA    = Math.sin(radCur)
      const sin2A   = Math.sin(2 * radCur)
      const v0      = speed   // m/s

      // Standard projectile from ground (height = 0 baseline for formulae)
      const R_formula = (v0 * v0 * sin2A) / G_REAL
      const H_formula = (v0 * v0 * sinA * sinA) / (2 * G_REAL)
      const T_formula = (2 * v0 * sinA) / G_REAL

      // ── Canvas-space landmark positions ──────────────────────────────────
      // Simulate with the same physics as the Matter world (pixel space)
      // gPix = 9.81 * G_SCALE * 3600  (per frame² converted to per-second²)
      const gPix = 9.81 * G_SCALE * 3600
      const vxPix = Math.cos(radCur) * speed * M_SCALE * 0.06 * 60
      const vyPix = -Math.sin(radCur) * speed * M_SCALE * 0.06 * 60
      const launchY_px = (cH / dpr) - platformH * dpr / dpr - 40 - platformH - 8

      // Max height time (vy_pix + g*t = 0  →  t = -vyPix/gPix)
      const tPeak = -vyPix / gPix
      const peakX_css = 40 + vxPix * tPeak
      const peakY_css = launchY_px + vyPix * tPeak + 0.5 * gPix * tPeak * tPeak

      // Landing time (solve quadratic: launchY + vy*t + 0.5*g*t^2 = groundY_css)
      const groundY_css = (cH / dpr) - 40
      const launchY_css = groundY_css - platformH - 8
      // 0.5*gPix*t^2 + vyPix*t + (launchY_css - groundY_css) = 0
      const discriminant = vyPix * vyPix - 4 * 0.5 * gPix * (launchY_css - groundY_css)
      const tLand = discriminant >= 0
        ? (-vyPix + Math.sqrt(discriminant)) / (gPix)
        : null
      const landX_css = tLand !== null ? 40 + vxPix * tLand : null

      ctx.save()
      ctx.resetTransform()

      // ── Peak marker ──────────────────────────────────────────────────────
      if (tPeak > 0 && peakX_css * dpr < cW && peakY_css > 0) {
        const px = peakX_css * dpr
        const py = peakY_css * dpr
        ctx.fillStyle = '#10B981'
        ctx.beginPath()
        ctx.arc(px, py, 5 * dpr, 0, Math.PI * 2)
        ctx.fill()
        const labelFs = Math.max(9, Math.round(Math.min(cW, cH) / dpr * 0.032)) * dpr
        ctx.fillStyle = '#10B981'
        ctx.font = `bold ${labelFs}px 'Roboto', sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText('H', px, py - 7 * dpr)
      }

      // ── Landing marker ───────────────────────────────────────────────────
      if (landX_css !== null && landX_css * dpr < cW) {
        const lx = landX_css * dpr
        const ly = groundY_css * dpr
        ctx.fillStyle = '#F59E0B'
        ctx.beginPath()
        ctx.arc(lx, ly, 5 * dpr, 0, Math.PI * 2)
        ctx.fill()
        const labelFs = Math.max(9, Math.round(Math.min(cW, cH) / dpr * 0.032)) * dpr
        ctx.fillStyle = '#F59E0B'
        ctx.font = `bold ${labelFs}px 'Roboto', sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText('R', lx, ly + 13 * dpr)
      }

      // ── Formula panel (bottom-left, avoids trajectory going right) ───────
      const fs = Math.max(10, Math.round(Math.min(cW, cH) / dpr * 0.036))
      const lineH = fs + 7
      const rows = [
        { label: `R = v₀²·sin2θ/g`, value: `${R_formula.toFixed(2)} m`  },
        { label: `H = v₀²·sin²θ/2g`, value: `${H_formula.toFixed(2)} m` },
        { label: `T = 2v₀·sinθ/g`,   value: `${T_formula.toFixed(2)} s` },
      ]
      const valW  = 52 * dpr
      const labelW = 120 * dpr
      const panelW = labelW + valW + 8 * dpr
      const panelH = rows.length * lineH * dpr + 14 * dpr
      const panelX = 6 * dpr
      const panelY = cH - panelH - 44 * dpr   // above the ground strip

      ctx.fillStyle = 'rgba(28, 27, 31, 0.72)'
      ctx.beginPath()
      ctx.roundRect(panelX, panelY, panelW, panelH, 8 * dpr)
      ctx.fill()

      rows.forEach(({ label, value }, i) => {
        const ry = panelY + (12 + i * lineH) * dpr + fs * dpr * 0.85
        ctx.fillStyle = '#D0BCFF'
        ctx.font = `${fs * dpr}px 'Roboto', sans-serif`
        ctx.textAlign = 'left'
        ctx.fillText(label, panelX + 6 * dpr, ry)
        ctx.fillStyle = '#FFFFFF'
        ctx.font = `bold ${fs * dpr}px 'Roboto', sans-serif`
        ctx.textAlign = 'right'
        ctx.fillText(value, panelX + panelW - 6 * dpr, ry)
      })

      ctx.restore()
    }

    Matter.Events.on(render, 'afterRender', drawOverlay)

    return () => {
      Matter.Events.off(render, 'afterRender', drawOverlay)
      Matter.World.clear(engine.world, false)
    }
  }, [angle, speed, height])

  return <MatterEngine {...props} setup={setup} />
}
