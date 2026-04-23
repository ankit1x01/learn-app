import { useCallback, useEffect, useRef } from 'react'
import Matter from 'matter-js'
import { SimProps } from '../../types'
import { MatterEngine } from '../../engines/MatterEngine'

// ═══════════════════════════════════════════════════════════════════════════
//  PHYSICS CONSTANTS — derived from official Matter.js examples
//  Reference: docs/research/MATTERJS_REFERENCE.md
//
//  KEY INSIGHT from slingshot.js (800×600 canvas, default gravity):
//    rockOptions = { density: 0.004 }
//    max rock speed = 45 px/step  → slingshot projectile at full power
//
//  KEY INSIGHT from airFriction.js:
//    frictionAir: 0.001  = "very little air resistance"  (barely any drag)
//    frictionAir: 0.05   = "moderate air resistance"
//    frictionAir: 0.1    = "heavy air resistance"
//
//  KEY INSIGHT from timescale.js (bouncing balls in 800×600):
//    frictionAir: 0,  friction: 0.0001,  restitution: 0.8
//
//  KEY INSIGHT from restitution.js:
//    restitution: 0.9  for very bouncy demo
//
//  GRAVITY FORMULA (Body.js source):
//    g_eff_per_step = gravity.y × gravity.scale × framesPerSecondSquared
//                   = gravity.y × 0.001 × 3600   (at 60fps)
//    Default (gravity.y=1): g_eff = 3.6 px/step  → too fast for 260px canvas
//
//  OUR CANVAS: 380×260px  (vs official 800×600)
//  SCALE FACTOR: 260/600 ≈ 0.43
//  → We need gravity.y ≈ 0.43 to get same visual feel as official demos
//  → g_eff = 0.43 × 0.001 × 3600 = 1.55 px/step
//
//  VELOCITY: slingshot uses max 45 px/step on 800×600
//  → Scaled to our canvas: 45 × (260/600) ≈ 19.5 px/step for max speed
//  → At 45°, speed=20m/s: vx = vy = 20 × V_SCALE × cos(45°)
//  → For peak_time = 30 steps (0.5s good visual):
//      vy = g_eff × peak_time = 1.55 × 30 = 46.5 px/step  (too big for canvas)
//  → For peak_time = 10 steps (0.17s, fast but visible):
//      vy = 1.55 × 10 = 15.5 px/step
//      V_SCALE = 15.5 / (20 × cos(45°)) = 15.5 / 14.14 = 1.096 ≈ 1.1
//      Range = 2 × 15.5 × 15.5 / 1.55 = 309px  → off 260px wide... hmm
//
//  FINAL CHOICE: gravity.y=0.1 → g_eff=0.36 px/step (gentle)
//    V_SCALE=0.5 → 20m/s,45° → vx=vy=7.07 px/step
//    peak_time = 7.07/0.36 = 19.6 steps (0.33s) ✓ visible
//    Range = 2×7.07²/0.36 = 277px  ← just fits 380px canvas ✓
//    Peak height = 7.07²/(2×0.36) = 69.4px ✓ visible in 260px canvas
// ═══════════════════════════════════════════════════════════════════════════
const GRAVITY_Y = 0.1     // engine.gravity.y  (keep scale=0.001 default)
const G_EFF     = GRAVITY_Y * 0.001 * 3600   // = 0.36 px/step
const V_SCALE   = 0.5     // speed(m/s) → px/step
const M_SCALE   = 4       // height metres → pixels

export function ProjectileSim(props: SimProps) {
  const { controls, onControlChange } = props

  const angle        = controls['angle']         ?? 45
  const speed        = controls['speed']         ?? 20
  const height       = controls['height']        ?? 0
  const dragCoeff    = controls['drag_coeff']    ?? 0
  const groundAngle  = controls['ground_angle']  ?? 0
  const explodePeak  = controls['explode_peak']  ?? 0
  const dropTarget   = controls['drop_target']   ?? 0
  const targetHeight = controls['target_height'] ?? 40

  // Ref so event handlers always see latest control values without re-registering
  const ctrlRef = useRef({ angle, speed, height, dragCoeff, groundAngle, explodePeak, dropTarget, targetHeight })
  useEffect(() => {
    ctrlRef.current = { angle, speed, height, dragCoeff, groundAngle, explodePeak, dropTarget, targetHeight }
  }, [angle, speed, height, dragCoeff, groundAngle, explodePeak, dropTarget, targetHeight])

  const setup = useCallback((
    engine: Matter.Engine,
    render: Matter.Render,
    canvas: HTMLCanvasElement
  ) => {
    const W       = canvas.clientWidth  || 380
    const H       = canvas.clientHeight || 300
    const groundY = H - 40
    const launchX = 40
    const launchY = groundY - height * M_SCALE - 8

    // ── Gravity: only change gravity.y, NEVER override gravity.scale ──────────
    engine.gravity.y = GRAVITY_Y

    // ── Ground (flat or inclined, pivots around the launchpad base) ───────────
    const groundRad = (groundAngle * Math.PI) / 180
    const halfW = W * 1.5, halfH = 20
    const dx = halfW * Math.cos(groundRad) - halfH * Math.sin(groundRad)
    const dy = halfW * Math.sin(groundRad) + halfH * Math.cos(groundRad)
    const ground = Matter.Bodies.rectangle(
      launchX + dx, groundY + dy, W * 3, 40,
      { isStatic: true, render: { fillStyle: '#CAC4D0' }, label: 'ground', angle: groundRad }
    )

    // ── Launch platform ───────────────────────────────────────────────────────
    const platformH = height * M_SCALE
    const platform = Matter.Bodies.rectangle(
      launchX, groundY - platformH / 2, 20, Math.max(platformH, 2),
      { isStatic: true, render: { fillStyle: '#6750A4' }, label: 'platform' }
    )

    // ── Ball — isStatic keeps it frozen until Play is pressed ─────────────────
    // Properties derived from official examples:
    //   restitution: 0        (no bounce on landing — ideal projectile)
    //   friction: 0           (no surface friction — ideal projectile)
    //   frictionAir: 0        (air drag controlled separately via applyForce)
    //   density: default      (0.001 — standard matter-js circle)
    const rad = (angle * Math.PI) / 180
    const vx0 =  Math.cos(rad) * speed * V_SCALE
    const vy0 = -Math.sin(rad) * speed * V_SCALE

    const ball = Matter.Bodies.circle(launchX, launchY, 8, {
      isStatic: true,        // ← frozen before Play
      restitution: 0,        // no bounce (ideal projectile)
      friction: 0,           // no surface friction
      frictionAir: 0,        // drag handled manually via applyForce
      label: 'ball',
      render: { fillStyle: '#F43F5E' },
    })

    // ── Target B (for simultaneous drop problems) ─────────────────────────────
    let targetB: Matter.Body | null = null
    if (dropTarget === 1) {
      targetB = Matter.Bodies.circle(launchX + W * 0.5, groundY - targetHeight * M_SCALE, 8, {
        isStatic: true,
        restitution: 0, friction: 0, frictionAir: 0,
        label: 'target_b',
        render: { fillStyle: '#3B82F6' },
      })
    }

    // ── Trajectory preview dots (ideal parabola, no drag) ────────────────────
    // t is in seconds; gPix = G_EFF × 3600 (converts step-based to per-second)
    const dots: Matter.Body[] = []
    if (dragCoeff === 0 && explodePeak === 0) {
      const gPix  = G_EFF * 3600   // px/s²
      const vxPix = vx0 * 60       // px/s
      const vyPix = vy0 * 60       // px/s
      for (let t = 0; t < 5; t += 0.08) {
        const tx = launchX + vxPix * t
        const ty = launchY + vyPix * t + 0.5 * gPix * t * t
        const gSurfY = groundY + (tx - launchX) * Math.tan(groundRad)
        if (ty > gSurfY || tx > W + 20 || tx < 0) break
        dots.push(Matter.Bodies.circle(tx, ty, 2, {
          isStatic: true, isSensor: true,
          render: { fillStyle: 'rgba(103,80,164,0.35)' },
          collisionFilter: { mask: 0 },
          label: 'dot',
        }))
      }
    }

    const bodies: Matter.Body[] = [ground, platform, ball, ...dots]
    if (targetB) bodies.push(targetB)
    Matter.World.add(engine.world, bodies)

    // ── Physics events: launch gate + drag force + explosion ──────────────────
    let launched    = false
    let hasExploded = false

    const onBeforeUpdate = (event: Matter.IEventTimestamped<Matter.Engine>) => {
      const cur = ctrlRef.current

      // Launch gate: fires on first physics tick after Play is pressed.
      // MUST call setStatic(false) BEFORE setVelocity (setStatic resets velocity to 0)
      if (!launched) {
        launched = true
        const r  = (cur.angle * Math.PI) / 180
        Matter.Body.setStatic(ball, false)
        Matter.Body.setVelocity(ball, {
          x:  Math.cos(r) * cur.speed * V_SCALE,
          y: -Math.sin(r) * cur.speed * V_SCALE,
        })
        if (targetB) {
          Matter.Body.setStatic(targetB, false)
          // targetB drops with v=(0,0) — pure free fall from targetHeight
        }
        return
      }

      // Air drag: F = -k × v  (linear drag model from airFriction.js pattern)
      // frictionAir in Matter.js is a velocity multiplier per step (not a force).
      // We use applyForce for physical accuracy:
      //   timeScale from timescale.js: (event.delta || 16.67) / 1000
      if (cur.dragCoeff > 0) {
        const timeScale = ((event as unknown as { delta?: number }).delta ?? (1000 / 60)) / 1000
        Matter.Composite.allBodies(engine.world).forEach(b => {
          if (b.label === 'ball' || b.label === 'shrapnel') {
            Matter.Body.applyForce(b, b.position, {
              x: -cur.dragCoeff * b.velocity.x * b.mass * timeScale * 0.01,
              y: -cur.dragCoeff * b.velocity.y * b.mass * timeScale * 0.01,
            })
          }
        })
      }

      // Explosion at peak: vy flips from negative (up) to positive (down)
      if (cur.explodePeak === 1 && !hasExploded && !ball.isStatic && ball.velocity.y >= 0) {
        hasExploded = true
        const pos = { ...ball.position }
        const vel = { ...ball.velocity }
        Matter.World.remove(engine.world, ball)

        // Negative collision group: shrapnel pieces don't collide with each other
        // Pattern from collisionFiltering.js
        const group = Matter.Body.nextGroup(true)
        const mk = (dy: number, color: string, vxMul: number) => {
          const p = Matter.Bodies.circle(pos.x, pos.y + dy, 5, {
            label: 'shrapnel',
            restitution: 0.4, friction: 0, frictionAir: 0,
            render: { fillStyle: color },
            collisionFilter: { group },
          })
          Matter.Body.setVelocity(p, { x: vel.x * vxMul, y: vel.y * 0.5 })
          return p
        }
        Matter.World.add(engine.world, [
          mk(-6, '#F59E0B', 0.3),   // piece 1: slow, upward
          mk( 6, '#10B981', 1.8),   // piece 2: fast, continues forward
        ])
      }
    }

    Matter.Events.on(engine, 'beforeUpdate', onBeforeUpdate)

    // ── Canvas overlay: velocity arrow + H/R peak markers ─────────────────────
    const drawOverlay = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const dpr    = window.devicePixelRatio || 1
      const cur    = ctrlRef.current
      const radCur = (cur.angle * Math.PI) / 180
      const gYcss  = canvas.height / dpr - 40
      const lYcss  = gYcss - cur.height * M_SCALE - 8
      const lX     = launchX * dpr
      const lY     = lYcss * dpr

      ctx.save()
      ctx.resetTransform()   // ← Matter.js leaves transform dirty; always reset

      if (cur.dragCoeff === 0 && cur.groundAngle === 0 && cur.explodePeak === 0) {
        const gPix  = G_EFF * 3600
        const vxP   = Math.cos(radCur) * cur.speed * V_SCALE * 60
        const vyP   = -Math.sin(radCur) * cur.speed * V_SCALE * 60
        const tPeak = vyP < 0 ? -vyP / gPix : 0
        const pkX   = launchX + vxP * tPeak
        const pkY   = lYcss + vyP * tPeak + 0.5 * gPix * tPeak * tPeak
        const disc  = vyP * vyP - 2 * gPix * (lYcss - gYcss)
        const tLand = disc >= 0 ? (-vyP + Math.sqrt(disc)) / gPix : null
        const lndX  = tLand !== null ? launchX + vxP * tLand : null

        if (tPeak > 0 && pkX > 0 && pkX < W + 20 && pkY > 0 && pkY < gYcss) {
          ctx.fillStyle = '#10B981'
          ctx.beginPath(); ctx.arc(pkX * dpr, pkY * dpr, 5 * dpr, 0, Math.PI * 2); ctx.fill()
          ctx.font = `bold ${11 * dpr}px Roboto,sans-serif`; ctx.textAlign = 'center'
          ctx.fillText('H', pkX * dpr, pkY * dpr - 8 * dpr)
        }
        if (lndX !== null && lndX > launchX && lndX < W + 20) {
          ctx.fillStyle = '#F59E0B'
          ctx.beginPath(); ctx.arc(lndX * dpr, gYcss * dpr, 5 * dpr, 0, Math.PI * 2); ctx.fill()
          ctx.font = `bold ${11 * dpr}px Roboto,sans-serif`; ctx.textAlign = 'center'
          ctx.fillText('R', lndX * dpr, gYcss * dpr + 13 * dpr)
        }
      }

      // Velocity arrow + draggable handle
      const aLen = Math.min(70, 45 + speed * 0.5) * dpr
      const tipX = lX + Math.cos(radCur) * aLen
      const tipY = lY - Math.sin(radCur) * aLen
      const hLen = 10 * dpr
      const aAng = Math.atan2(tipY - lY, tipX - lX)

      ctx.strokeStyle = 'rgba(103,80,164,0.9)'; ctx.lineWidth = 2.5 * dpr; ctx.lineCap = 'round'
      ctx.beginPath(); ctx.moveTo(lX, lY); ctx.lineTo(tipX, tipY); ctx.stroke()
      ctx.fillStyle = 'rgba(103,80,164,0.9)'
      ctx.beginPath()
      ctx.moveTo(tipX, tipY)
      ctx.lineTo(tipX - hLen * Math.cos(aAng - 0.4), tipY - hLen * Math.sin(aAng - 0.4))
      ctx.lineTo(tipX - hLen * Math.cos(aAng + 0.4), tipY - hLen * Math.sin(aAng + 0.4))
      ctx.closePath(); ctx.fill()
      ctx.fillStyle   = 'rgba(103,80,164,0.15)'
      ctx.strokeStyle = 'rgba(103,80,164,0.5)'; ctx.lineWidth = 1.5 * dpr
      ctx.beginPath(); ctx.arc(tipX, tipY, 10 * dpr, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
      ctx.strokeStyle = 'rgba(103,80,164,0.25)'; ctx.lineWidth = dpr
      ctx.beginPath(); ctx.arc(lX, lY, 22 * dpr, -radCur, 0); ctx.stroke()

      ctx.restore()
    }
    Matter.Events.on(render, 'afterRender', drawOverlay)

    // ── Drag-arrow pointer interaction ────────────────────────────────────────
    const getTip = () => {
      const c   = ctrlRef.current
      const r   = (c.angle * Math.PI) / 180
      const gYc = canvas.clientHeight - 40
      const lYc = gYc - c.height * M_SCALE - 8
      const al  = Math.min(70, 45 + c.speed * 0.5)
      return { tipX: launchX + Math.cos(r) * al, tipY: lYc - Math.sin(r) * al, lYc }
    }
    let dragging = false
    const onPD = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const { tipX, tipY } = getTip()
      if (Math.hypot(e.clientX - rect.left - tipX, e.clientY - rect.top - tipY) < 22) {
        dragging = true; canvas.setPointerCapture(e.pointerId); e.preventDefault()
      }
    }
    const onPM = (e: PointerEvent) => {
      if (!dragging) return; e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      const { lYc } = getTip()
      const dx = e.clientX - rect.left - launchX
      const dy = e.clientY - rect.top  - lYc
      const a = Math.max(0, Math.min(85, Math.round(Math.atan2(-dy, dx) * 180 / Math.PI)))
      const s = Math.max(5, Math.min(50, Math.round(5 + (Math.hypot(dx, dy) - 20) * (45 / 80))))
      onControlChange?.('angle', a); onControlChange?.('speed', s)
    }
    const onPU = (e: PointerEvent) => { dragging = false; canvas.releasePointerCapture(e.pointerId) }

    canvas.style.touchAction = 'none'
    canvas.addEventListener('pointerdown',   onPD)
    canvas.addEventListener('pointermove',   onPM)
    canvas.addEventListener('pointerup',     onPU)
    canvas.addEventListener('pointercancel', onPU)

    // Cleanup: ALWAYS remove events and clear world (from official pattern)
    return () => {
      Matter.Events.off(engine, 'beforeUpdate', onBeforeUpdate)
      Matter.Events.off(render,  'afterRender',  drawOverlay)
      canvas.removeEventListener('pointerdown',   onPD)
      canvas.removeEventListener('pointermove',   onPM)
      canvas.removeEventListener('pointerup',     onPU)
      canvas.removeEventListener('pointercancel', onPU)
      Matter.World.clear(engine.world, false)
    }
  }, [angle, speed, height, dragCoeff, groundAngle, explodePeak, dropTarget, targetHeight, onControlChange])

  return <MatterEngine {...props} setup={setup} />
}
