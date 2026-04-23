import { useCallback, useEffect, useRef } from 'react'
import Matter from 'matter-js'
import { SimProps } from '../../types'
import { MatterEngine } from '../../engines/MatterEngine'

const G_SCALE = 0.001
const M_SCALE = 4

export function ProjectileSim(props: SimProps) {
  const { controls, onControlChange } = props
  const angle  = controls['angle']  ?? 45
  const speed  = controls['speed']  ?? 20
  const height = controls['height'] ?? 0

  // Keep a ref to latest values so event handlers don't go stale
  const ctrlRef = useRef({ angle, speed, height })
  useEffect(() => { ctrlRef.current = { angle, speed, height } }, [angle, speed, height])

  const setup = useCallback((
    engine: Matter.Engine,
    render: Matter.Render,
    canvas: HTMLCanvasElement
  ) => {
    const W = canvas.clientWidth  || 380
    const H = canvas.clientHeight || 300
    const groundY    = H - 40
    const platformH  = height * M_SCALE
    const launchX    = 40
    const launchY    = groundY - platformH - 8

    engine.gravity.y = 9.81 * G_SCALE

    // ── Static bodies ───────────────────────────────────────────────────────
    const ground = Matter.Bodies.rectangle(W / 2, groundY + 20, W, 40, {
      isStatic: true,
      render: { fillStyle: '#CAC4D0' },
      label: 'ground',
    })
    const platformBody = Matter.Bodies.rectangle(launchX, groundY - platformH / 2, 20, Math.max(platformH, 2), {
      isStatic: true,
      render: { fillStyle: '#6750A4' },
      label: 'platform',
    })

    // ── Ball ────────────────────────────────────────────────────────────────
    const rad = (angle * Math.PI) / 180
    const vx  = Math.cos(rad) * speed * M_SCALE * 0.06
    const vy  = -Math.sin(rad) * speed * M_SCALE * 0.06
    const ball = Matter.Bodies.circle(launchX, launchY, 8, {
      restitution: 0, friction: 0, frictionAir: 0,
      render: { fillStyle: '#F43F5E' },
      label: 'ball',
    })
    Matter.Body.setVelocity(ball, { x: vx, y: vy })

    // ── Trajectory dots ─────────────────────────────────────────────────────
    const dots: Matter.Body[] = []
    for (let t = 0; t < 3; t += 0.15) {
      const tx = launchX + Math.cos(rad) * speed * M_SCALE * 0.06 * t * 60
      const ty = launchY + (-Math.sin(rad) * speed * M_SCALE * 0.06 * t * 60) + 0.5 * 9.81 * G_SCALE * 3600 * t * t
      if (ty > groundY) break
      const dot = Matter.Bodies.circle(tx, ty, 2, {
        isStatic: true, isSensor: true,
        render: { fillStyle: '#6750A460' },
        collisionFilter: { mask: 0 },
        label: 'dot',
      })
      dots.push(dot)
    }

    Matter.World.add(engine.world, [ground, platformBody, ball, ...dots])

    // ── Overlay: velocity arrow + peak/land markers ─────────────────────────
    const drawOverlay = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const cW  = canvas.width
      const cH  = canvas.height
      const dpr = window.devicePixelRatio || 1

      const cur       = ctrlRef.current
      const radCur    = (cur.angle * Math.PI) / 180
      const lX        = launchX * dpr
      const gY_css    = (cH / dpr) - 40
      const lY_css    = gY_css - cur.height * M_SCALE - 8
      const lY        = lY_css * dpr

      // Pixel-space physics
      const gPix = 9.81 * G_SCALE * 3600
      const vxPix = Math.cos(radCur) * cur.speed * M_SCALE * 0.06 * 60
      const vyPix = -Math.sin(radCur) * cur.speed * M_SCALE * 0.06 * 60

      const tPeak = vyPix !== 0 ? -vyPix / gPix : 0
      const peakX_css = launchX + vxPix * tPeak
      const peakY_css = lY_css + vyPix * tPeak + 0.5 * gPix * tPeak * tPeak

      const disc    = vyPix * vyPix - 4 * 0.5 * gPix * (lY_css - gY_css)
      const tLand   = disc >= 0 ? (-vyPix + Math.sqrt(disc)) / gPix : null
      const landX   = tLand !== null ? launchX + vxPix * tLand : null

      ctx.save()
      ctx.resetTransform()

      // Peak marker
      if (tPeak > 0 && peakX_css * dpr < cW && peakY_css > 0) {
        const px = peakX_css * dpr
        const py = peakY_css * dpr
        ctx.fillStyle = '#10B981'
        ctx.beginPath(); ctx.arc(px, py, 5 * dpr, 0, Math.PI * 2); ctx.fill()
        const lfs = Math.max(9, 11) * dpr
        ctx.fillStyle = '#10B981'
        ctx.font = `bold ${lfs}px 'Roboto', sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText('H', px, py - 7 * dpr)
      }

      // Landing marker
      if (landX !== null && landX * dpr < cW) {
        const lx = landX * dpr
        const ly = gY_css * dpr
        ctx.fillStyle = '#F59E0B'
        ctx.beginPath(); ctx.arc(lx, ly, 5 * dpr, 0, Math.PI * 2); ctx.fill()
        const lfs = Math.max(9, 11) * dpr
        ctx.fillStyle = '#F59E0B'
        ctx.font = `bold ${lfs}px 'Roboto', sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText('R', lx, ly + 13 * dpr)
      }

      // ── Interactive velocity arrow ───────────────────────────────────────
      const arrowLen = Math.min(60, 40 + cur.speed * 0.8) * dpr  // scales with speed
      const tipX = lX + Math.cos(radCur) * arrowLen
      const tipY = lY - Math.sin(radCur) * arrowLen

      // Shaft
      ctx.strokeStyle = 'rgba(103, 80, 164, 0.9)'
      ctx.lineWidth   = 2.5 * dpr
      ctx.lineCap     = 'round'
      ctx.beginPath(); ctx.moveTo(lX, lY); ctx.lineTo(tipX, tipY); ctx.stroke()

      // Arrowhead
      const headLen = 10 * dpr
      const aAngle  = Math.atan2(tipY - lY, tipX - lX)
      ctx.fillStyle = 'rgba(103, 80, 164, 0.9)'
      ctx.beginPath()
      ctx.moveTo(tipX, tipY)
      ctx.lineTo(tipX - headLen * Math.cos(aAngle - 0.4), tipY - headLen * Math.sin(aAngle - 0.4))
      ctx.lineTo(tipX - headLen * Math.cos(aAngle + 0.4), tipY - headLen * Math.sin(aAngle + 0.4))
      ctx.closePath(); ctx.fill()

      // Drag handle circle (larger touch target)
      ctx.strokeStyle = 'rgba(103, 80, 164, 0.6)'
      ctx.lineWidth   = 1.5 * dpr
      ctx.fillStyle   = 'rgba(103, 80, 164, 0.18)'
      ctx.beginPath(); ctx.arc(tipX, tipY, 10 * dpr, 0, Math.PI * 2)
      ctx.fill(); ctx.stroke()

      // Angle arc hint
      ctx.strokeStyle = 'rgba(103, 80, 164, 0.3)'
      ctx.lineWidth   = 1 * dpr
      ctx.beginPath()
      ctx.arc(lX, lY, 20 * dpr, -radCur, 0)
      ctx.stroke()

      ctx.restore()
    }

    Matter.Events.on(render, 'afterRender', drawOverlay)

    // ── Drag interaction ─────────────────────────────────────────────────────
    // Returns (css-space) tip position from current controls
    const getTip = () => {
      const cur = ctrlRef.current
      const r   = (cur.angle * Math.PI) / 180
      const gYc = canvas.clientHeight - 40
      const lYc = gYc - cur.height * M_SCALE - 8
      const arrowLen = Math.min(60, 40 + cur.speed * 0.8)
      return {
        tipX: launchX + Math.cos(r) * arrowLen,
        tipY: lYc - Math.sin(r) * arrowLen,
        lXc: launchX,
        lYc,
      }
    }

    let dragging = false

    const onPointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const cx   = e.clientX - rect.left
      const cy   = e.clientY - rect.top
      const { tipX, tipY } = getTip()
      const dist = Math.hypot(cx - tipX, cy - tipY)
      if (dist < 22) {   // 22 css-px touch target
        dragging = true
        canvas.setPointerCapture(e.pointerId)
        e.preventDefault()
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      const cx   = e.clientX - rect.left
      const cy   = e.clientY - rect.top
      const { lXc, lYc } = getTip()

      const dx = cx - lXc
      const dy = cy - lYc  // positive = downward in CSS

      // Angle: atan2 flipped because canvas Y is down
      let newAngle = Math.round(Math.atan2(-dy, dx) * 180 / Math.PI)
      newAngle = Math.max(10, Math.min(80, newAngle))

      // Speed: distance from launch point (map 20-100px → 5-50 m/s)
      const dist = Math.hypot(dx, dy)
      let newSpeed = Math.round(5 + (dist - 20) * (45 / 80))
      newSpeed = Math.max(5, Math.min(50, newSpeed))

      onControlChange?.('angle', newAngle)
      onControlChange?.('speed', newSpeed)
    }

    const onPointerUp = (e: PointerEvent) => {
      dragging = false
      canvas.releasePointerCapture(e.pointerId)
    }

    canvas.style.touchAction = 'none'
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup',   onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)

    return () => {
      Matter.Events.off(render, 'afterRender', drawOverlay)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup',   onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      Matter.World.clear(engine.world, false)
    }
  }, [angle, speed, height, onControlChange])

  return <MatterEngine {...props} setup={setup} />
}
