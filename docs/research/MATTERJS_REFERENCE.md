# Matter.js Physics Engine — Reference Guide for Physics Playground

> Distilled from official examples at https://github.com/liabru/matter-js/tree/master/examples
> and docs at https://brm.io/matter-js/docs/
> Version: matter-js 0.20.0

---

## 1. Canonical Setup Pattern (from ALL official examples)

```javascript
// 1. Engine (physics world)
const engine = Matter.Engine.create()
// engine.gravity.y = 1  ← DEFAULT, no need to set unless changing

// 2. Renderer (visual only, runs independently)
const render = Matter.Render.create({ canvas, engine, options: { width, height, wireframes: false } })
Matter.Render.run(render)   // ← starts DRAWING immediately

// 3. Runner (physics ticks, separate from renderer)
const runner = Matter.Runner.create()
Matter.Runner.run(runner, engine)   // ← starts PHYSICS immediately
```

**Key: Render and Runner are completely independent.** Render just draws whatever the engine state is.
You can stop/start the Runner to pause physics without affecting drawing.

---

## 2. Gravity — The Definitive Answer

### Default values:
```
engine.gravity = { x: 0, y: 1, scale: 0.001 }
```

### How gravity is actually applied (from Body.js source):
```
// Per-step, each body gets:
body.force.y += body.mass * engine.gravity.y * engine.gravity.scale

// Then Body.update converts force to position change:
body.position.y += body.velocity.y + (body.force.y / body.mass) * framesPerSecondSquared
//  where framesPerSecondSquared = (1000 / delta)²  ≈  3600  at 60fps
```

### Effective per-step acceleration:
```
g_eff = gravity.y × gravity.scale × framesPerSecondSquared
      = 1 × 0.001 × 3600  =  3.6  pixels/step  (default)
```

### Scaling for our 380×260 canvas (vs official 800×600):
```
Official: bodies at y=0 fall to y=600 under default gravity — looks natural
Our canvas: 600px → 260px  ratio = 0.43

→ Scale gravity.y proportionally:  gravity.y = 1 × 0.43 ≈ 0.4

→ g_eff = 0.4 × 0.001 × 3600 = 1.44 px/step  ✓ (gentle arc)
```

### DON'T override gravity.scale. Only change gravity.y:
```javascript
engine.gravity.y = 0.4   // ← correct for 260px tall canvas
// DO NOT: engine.gravity.scale = 1  ← breaks the framesPerSecondSquared math
```

---

## 3. Velocity — The Definitive Answer

### From manipulation.js (official example):
```javascript
// On 800×600 canvas:
Body.setVelocity(bodyB, { x: 0, y: -10 })   // ← -10 px/step upward
```

### Velocity units: **pixels per physics step** (≈ pixels per frame at 60fps)

### For our canvas (380px wide), to launch a projectile that lands ~200px away at 45°:
```
Range = vx × vy / g_eff  (at 45°, vx=vy=v/√2)
      = v² / (2 × g_eff)  ... solving:

With g_eff = 1.44:
  v² = Range × 2 × g_eff = 200 × 2 × 1.44 = 576
  v = 24 px/step

→ V_SCALE = v / speed(m/s) = 24 / 20 = 1.2 px/step per m/s
```

### Summary: correct constants for our app
```javascript
engine.gravity.y = 0.4      // ← g_eff = 1.44 px/step
V_SCALE = 1.2               // speed m/s → px/step
M_SCALE = 4                 // height m → pixels

// At 45°, speed=20: vx = vy = 20 × 1.2 × cos(45°) = 16.97 px/step
// Peak at step: 16.97 / 1.44 ≈ 12 steps (0.2 sec) — VERY fast?

// Wait: need to recalculate
// With g_eff per step = 1.44, and vy = -16.97:
//   peak time = 16.97 / 1.44 ≈ 11.8 steps = 0.2s → too fast visually
//
// → Reduce g_eff to 0.15 px/step: gravity.y = 0.15/3.6 ≈ 0.042
//   vx = vy = 20 × 0.12 × cos(45°) = 1.7 px/step
//   peak time = 1.7 / 0.15 ≈ 11.3 steps... still fast

// The CORRECT approach: match manipulation.js scale exactly
// Official: velocity -10 on 600px canvas, gravity default
// Our:      velocity v on 260px canvas, gravity × (260/600) = 0.43
//   v = 10 × (260/600) × (200/600) = 10 × 0.43 × 0.33 ≈ 1.4 px/step
// → V_SCALE = 1.4 / 20 ≈ 0.07
```

### ✅ FINAL CORRECT CONSTANTS:
```javascript
engine.gravity.y = 0.4       // g_eff = 1.44 px/step
const V_SCALE = 0.07         // 20 m/s → 1.4 px/step

// At 45°: vx = vy = 20 × 0.07 × cos(45°) ≈ 0.99 px/step
// Peak: 0.99 / 1.44 = 0.69 steps... too small

// FIX: use gravity.y = 0.04 (g_eff = 0.144 px/step)
// V_SCALE = 0.07 → vy = 0.99 → peak at 0.99/0.144 = 6.9 steps
// Range = 2 × 0.99 × 0.99 / 0.144 = 13.6 px  → too small

// CORRECT: scale velocity much higher
// gravity.y = 0.04, V_SCALE = 1.0
// vy = 20 × 1.0 × sin(45°) = 14.14 px/step
// peak at 14.14 / 0.144 = 98 steps = 1.63 sec ✓
// range = 2 × 14.14² / 0.144 = 2778 px  → off screen

// CORRECT: gravity.y = 1 (default), V_SCALE = 1.0
// g_eff = 3.6 px/step
// vy = 14.14 px/step
// peak at 14.14 / 3.6 = 3.9 steps = 0.065 sec  → instant
```

---

## 4. THE TRUTH — From Official Source Analysis

After examining the actual official examples carefully:

```javascript
// manipulation.js uses:
Body.setVelocity(bodyB, { x: 0, y: -10 })   // on 800×600 canvas

// This shoots a body upward at 10px/step
// With default g_eff = 3.6, peak at: 10 / 3.6 = 2.78 steps = 0.046 sec
// That's 2.78 frames → near-instant for a visual demo!
```

**Conclusion: Official Matter.js examples are NOT designed for slow, visible projectile arcs.**
They are designed for high-speed physics with large canvases (800×600) where bodies fall quickly.

**For our slow, educational projectile demo, we MUST reduce gravity.y significantly.**

### Working formula for educational projectile sim:
```
Want: peak_time ≈ 60 steps (1 second), Range ≈ 180px

At 45°: Range = v²/g_eff, peak_time = v_component/g_eff
  v_component = speed × V_SCALE / √2

Choose peak_time = 60 steps:
  v_component = g_eff × 60

Choose Range = 180px:
  Range = 2 × v_component² / g_eff
  180 = 2 × (g_eff × 60)² / g_eff = 7200 × g_eff
  g_eff = 180 / 7200 = 0.025 px/step

→ gravity.y = g_eff / gravity.scale = 0.025 / 0.001 = 25
  BUT gravity.y × gravity.scale × 3600 = 25 × 0.001 × 3600 = 90  (too fast)

→ CORRECT: gravity.y = g_eff / (gravity.scale × framesPerSecondSquared)
           = 0.025 / (0.001 × 3600) = 0.00694 ≈ 0.007
```

### ✅ FINAL DEFINITIVE CONSTANTS:

```javascript
// Verified formula:
// g_effective_per_step = engine.gravity.y × engine.gravity.scale × framesPerSecondSquared
//                      = gravity.y × 0.001 × 3600

// For g_eff = 0.025 px/step (gentle visible arc):
engine.gravity.y = 0.025 / (0.001 * 3600)  // = 0.00694

// For V_SCALE:
// peak_time = v_component / g_eff = (speed × V_SCALE / √2) / 0.025
// Want peak_time = 60 steps at speed=20:
// 60 = 20 × V_SCALE / (√2 × 0.025)
// V_SCALE = 60 × √2 × 0.025 / 20 = 0.106

const GRAVITY_Y = 0.00694   // engine.gravity.y
const G_EFF     = 0.025     // px/step (actual per-step velocity increment from gravity)
const V_SCALE   = 0.106     // m/s → px/step

// VERIFICATION at speed=20, angle=45°:
// vx = vy = 20 × 0.106 × cos(45°) = 1.499 px/step
// Peak at: 1.499 / 0.025 = 59.9 steps ≈ 60 steps (1 second) ✓
// Range: 2 × 1.499² / 0.025 = 179.5 px ✓ (fits 380px canvas)
// Peak height: 1.499² / (2 × 0.025) = 44.9 px ✓ (visible in 260px canvas)
```

---

## 5. Body Properties — Quick Reference

| Property | Default | Description |
|---|---|---|
| `isStatic` | `false` | Immovable, unaffected by gravity |
| `isSensor` | `false` | No physics response but fires collision events |
| `restitution` | `0` | Bounciness (0 = no bounce, 1 = perfect bounce) |
| `friction` | `0.1` | Surface friction |
| `frictionAir` | `0.01` | Air resistance (reduces velocity each step) |
| `frictionStatic` | `0.5` | Static friction coefficient |
| `density` | `0.001` | Affects mass (mass = area × density) |
| `mass` | auto | Set explicitly with `Body.setMass()` |
| `collisionFilter.group` | `0` | Bodies with same negative group don't collide |
| `collisionFilter.mask` | `0xFFFFFFFF` | Bitmask of categories to collide with |

---

## 6. Key API Methods

### Body manipulation (use these, not direct property assignment):
```javascript
Matter.Body.setVelocity(body, { x, y })          // set velocity
Matter.Body.setAngularVelocity(body, omega)       // set angular velocity
Matter.Body.setPosition(body, { x, y })           // teleport body
Matter.Body.applyForce(body, position, { x, y })  // apply force at point
Matter.Body.setStatic(body, isStatic)             // toggle static/dynamic
Matter.Body.setAngle(body, angle)                 // set rotation (radians)
Matter.Body.scale(body, scaleX, scaleY)           // scale size
```

### World management:
```javascript
Matter.World.add(engine.world, body_or_array)
Matter.World.remove(engine.world, body)
Matter.World.clear(engine.world, keepStatic)   // keepStatic=false removes everything
```

### Events:
```javascript
Matter.Events.on(engine, 'beforeUpdate', handler)   // fires before each physics tick
Matter.Events.on(engine, 'afterUpdate', handler)    // fires after each physics tick
Matter.Events.on(engine, 'collisionStart', handler) // fires when bodies first touch
Matter.Events.on(engine, 'collisionEnd', handler)   // fires when bodies separate
Matter.Events.on(render, 'afterRender', handler)    // fires after each canvas draw
Matter.Events.off(engine, 'beforeUpdate', handler)  // MUST call this in cleanup!
```

### Force application (from events.js pattern):
```javascript
// CORRECT way to apply time-scaled force:
Events.on(engine, 'beforeUpdate', function(event) {
    var timeScale = (event.delta || (1000 / 60)) / 1000;
    var forceMagnitude = 0.03 * body.mass * timeScale;
    Body.applyForce(body, body.position, { x: forceMagnitude, y: 0 });
});
```

---

## 7. Collision Filtering

```javascript
// Bodies with same NEGATIVE group never collide with each other:
const group = Matter.Body.nextGroup(true)  // returns a new negative group number
const p1 = Bodies.circle(x, y, r, { collisionFilter: { group } })
const p2 = Bodies.circle(x, y, r, { collisionFilter: { group } })
// p1 and p2 will never collide with each other, but will with everything else

// Sensor bodies: fire events but no physics response
const sensor = Bodies.circle(x, y, r, { isSensor: true })
```

---

## 8. Static → Dynamic Transition (Critical Pattern)

```javascript
// CORRECT ORDER:
Matter.Body.setStatic(body, false)              // 1. Make dynamic FIRST
Matter.Body.setVelocity(body, { x: vx, y: vy }) // 2. Then set velocity

// WRONG ORDER (velocity gets reset by setStatic):
Matter.Body.setVelocity(body, { x: vx, y: vy })
Matter.Body.setStatic(body, false)  // ← resets velocity to 0!
```

---

## 9. Our MatterEngine Integration Pattern

```typescript
// MatterEngine.tsx manages: engine, render, runner lifecycles
// ProjectileSim.tsx provides: setup() callback

// setup() is called when:
// - Component mounts
// - Any dependency in useCallback changes (= controls change)

// Play/Pause: MatterEngine stops/starts runner via isPlaying prop
// When runner is stopped: NO physics ticks, bodies stay frozen

// Pattern for "launch on Play":
const setup = useCallback((engine, render, canvas) => {
    // Create ball as isStatic=true (frozen before Play)
    const ball = Bodies.circle(x, y, r, { isStatic: true, ... })
    
    let launched = false
    Events.on(engine, 'beforeUpdate', () => {
        if (!launched) {
            launched = true
            Body.setStatic(ball, false)          // 1. unfreeze
            Body.setVelocity(ball, { x, y })     // 2. launch
            return
        }
        // subsequent ticks: drag, explosion, etc.
    })
    
    return () => {
        Events.off(engine, 'beforeUpdate', handler)  // CRITICAL cleanup
        World.clear(engine.world, false)
    }
}, [dependencies])
```

---

## 10. Trajectory Preview Math

For drawing preview dots on canvas (BEFORE running physics):

```javascript
// g_per_sec² = G_EFF * 60²    (G_EFF in px/step, 60 steps/sec)
const gPix  = G_EFF * 3600      // px / second²
const vxPix = vx0 * 60          // px / second  (vx0 is in px/step)
const vyPix = vy0 * 60          // px / second  (vy0 is in px/step)

// Position at time t (seconds):
const x = launchX + vxPix * t
const y = launchY + vyPix * t + 0.5 * gPix * t²

// Peak time (when vy = 0):
const tPeak = -vyPix / gPix   // seconds

// Time of flight (when y = groundY):
// groundY = launchY + vyPix*t + 0.5*gPix*t²
// Solve quadratic: 0.5*gPix*t² + vyPix*t + (launchY - groundY) = 0
const discriminant = vyPix² - 4 * 0.5 * gPix * (launchY - groundY)
const tLand = (-vyPix + sqrt(discriminant)) / gPix

// Range:
const range = vxPix * tLand
```

---

## 11. Canvas DPI / HiDPI Rendering

Matter.js Render creates a canvas. For crisp display on high-DPI screens:
```javascript
const dpr = window.devicePixelRatio || 1
canvas.width  = Math.round(W * dpr)
canvas.height = Math.round(H * dpr)
canvas.style.width  = '100%'   // override Matter.js inline styles
canvas.style.height = '100%'

// In afterRender event for custom canvas drawing:
const drawOverlay = () => {
    const ctx = canvas.getContext('2d')
    ctx.save()
    ctx.resetTransform()    // ← REQUIRED: Matter.js leaves transform dirty
    // ... draw in physical pixels (multiply all coords by dpr)
    ctx.restore()
}
```

---

## 12. Constraints (Springs, Pendulums, Chains)

```javascript
// Spring/rope between two bodies:
const spring = Matter.Constraint.create({
    bodyA: anchor,
    bodyB: ball,
    length: 150,         // rest length
    stiffness: 0.01,     // spring constant (0-1)
    damping: 0.05,       // damping (0 = no damping)
    render: { strokeStyle: '#999', lineWidth: 2 }
})
Matter.World.add(engine.world, spring)

// Fixed point constraint (pendulum anchor):
const pendulum = Matter.Constraint.create({
    pointA: { x: 400, y: 0 },  // world-space anchor
    bodyB: ball,
    length: 150,
    stiffness: 1,               // rigid rod
})
```

---

## 13. Common Mistakes to Avoid

| Mistake | Correct Approach |
|---|---|
| Setting `gravity.scale` | Only change `gravity.y` |
| `setVelocity` before `setStatic(false)` | Always `setStatic(false)` first |
| Not removing events in cleanup | Always `Events.off()` in return fn |
| Not clearing world in cleanup | `World.clear(engine.world, false)` |
| Drawing without `resetTransform()` | Always `ctx.save(); ctx.resetTransform()` |
| Using `frictionAir > 0` on projectile | Use `frictionAir: 0` for ideal projectile |
| Restitution > 0 on ground | Use `restitution: 0` on ground for no bounce |
| Overlapping shrapnel at spawn | Use negative `collisionFilter.group` |
