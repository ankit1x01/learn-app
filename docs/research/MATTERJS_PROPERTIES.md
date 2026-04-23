# Matter.js Physics Properties — What to Set for Every Simulation
# Sourced from ALL official examples at github.com/liabru/matter-js/tree/master/examples

---

## GRAVITY

```javascript
// DEFAULT: engine.gravity = { x: 0, y: 1, scale: 0.001 }
// FORMULA: g_eff_per_step = gravity.y × gravity.scale × (1000/delta)²
//          At 60fps (delta=16.67ms): g_eff = gravity.y × 0.001 × 3600

// Official demos use 800×600 — bodies fall 600px under default gravity naturally
// Our canvas 380×260 → scale gravity.y proportionally: 260/600 ≈ 0.43

// RULE: ONLY change gravity.y. NEVER change gravity.scale.

engine.gravity.y = 0.1    // our sims: gentle arc in 260px canvas
//  g_eff = 0.1 × 0.001 × 3600 = 0.36 px/step
//  At 45°, speed=20: peak=19.6 steps (0.33s), Range=277px ✓

// From gravity.js official example:
engine.gravity.y = -1    // ← REVERSE gravity (float upward)

// Zero gravity:
engine.gravity.y = 0
```

---

## VELOCITY

```javascript
// Unit: PIXELS PER PHYSICS STEP (px/step), NOT pixels per second
// From manipulation.js: Body.setVelocity(body, { x: 0, y: -10 }) on 800×600
// From slingshot.js: max rock speed = 45 px/step (Body.setSpeed(rock, 45))

// Our canvas (380×260), V_SCALE = 0.5:
// 20 m/s → vx = 20 × 0.5 × cos(45°) = 7.07 px/step ✓

Body.setVelocity(ball, { x: vx, y: vy })   // sets immediately
Body.setSpeed(body, 45)                     // caps speed magnitude
// velocity.y NEGATIVE = moving UP (screen coords, y increases downward)
```

---

## FRICTION

```javascript
// From friction.js: surfaces with varying friction
// From staticFriction.js: friction prevents sliding on inclines

friction: 0         // ideal projectile, no surface drag (default: 0.1)
friction: 0.0001    // near-frictionless (timescale.js bouncing balls)
friction: 0.1       // standard surface friction
friction: 0.5       // rough surface
friction: 1.0       // very rough (almost no sliding)

// Ground/walls for ideal physics problems:
{ isStatic: true, friction: 0 }   // frictionless ground
```

---

## FRICTION AIR (air resistance / drag)

```javascript
// From airFriction.js official demo:
frictionAir: 0.001   // "very little air resistance" (barely noticeable)
frictionAir: 0.05    // "moderate air resistance"
frictionAir: 0.1     // "heavy air resistance" (noticeable slowdown)

// Applied each step as: velocity *= (1 - frictionAir)
// DEFAULT: 0.01

// For ideal projectile (no drag): frictionAir: 0
// Then control drag via applyForce in beforeUpdate:
Body.applyForce(ball, ball.position, {
    x: -dragCoeff * ball.velocity.x * ball.mass * timeScale * 0.01,
    y: -dragCoeff * ball.velocity.y * ball.mass * timeScale * 0.01,
})
// timeScale = (event.delta || 16.67) / 1000   ← from timescale.js pattern
```

---

## RESTITUTION (bounciness)

```javascript
// From restitution.js: shows range of values
restitution: 0      // no bounce — dead stop (ideal projectile landing)
restitution: 0.3    // low bounce (shrapnel)
restitution: 0.8    // high bounce (from timescale.js — bouncing balls)
restitution: 0.9    // very bouncy (from restitution.js demo)
restitution: 1.0    // perfectly elastic (infinite bouncing)

// RULE: Ground/walls use restitution:0 for JEE problems
//       Ball uses restitution:0 for clean landing
//       Shrapnel uses restitution:0.4 for realistic debris
```

---

## DENSITY / MASS

```javascript
// Default density: 0.001  (mass = area × density)
// Circle radius 8: area = π×64 = 201, mass = 0.201

// From slingshot.js:
density: 0.004    // "rock" — 4× default, heavier projectile

// For JEE problems (ideal point mass): use default density
// Set mass explicitly if needed:
Body.setMass(ball, 1.0)    // 1 kg (arbitrary in pixel-space)
```

---

## COLLISION FILTERING

```javascript
// From collisionFiltering.js:

// Negative group = bodies never collide with same-group bodies
const group = Matter.Body.nextGroup(true)   // returns negative number
body1.collisionFilter = { group }
body2.collisionFilter = { group }
// body1 and body2 ignore each other, but collide with everything else

// Sensor: fires events but zero physics response
{ isSensor: true }

// No collision at all:
{ collisionFilter: { mask: 0 } }   // collides with nothing

// Category + mask for selective collision:
const category1 = 0x0001
const category2 = 0x0002
body1.collisionFilter = { category: category1, mask: category2 }
body2.collisionFilter = { category: category2, mask: category1 }
```

---

## isSTATIC

```javascript
// Static bodies: immovable, immune to gravity and forces
// Use for: ground, walls, platforms, fixed anchors

// Dynamic → Static → Dynamic pattern:
Body.setStatic(body, true)    // freeze
// ... later:
Body.setStatic(body, false)   // unfreeze — RESETS VELOCITY TO ZERO
Body.setVelocity(body, { x: vx, y: vy })   // set AFTER setStatic!

// CRITICAL: setStatic(false) calls setVelocity({0,0}) internally.
// ALWAYS call setVelocity AFTER setStatic(false), not before.
```

---

## FORCE APPLICATION

```javascript
// From events.js and timescale.js — the correct time-scaled force pattern:
Events.on(engine, 'beforeUpdate', function(event) {
    var timeScale = (event.delta || (1000 / 60)) / 1000;
    var forceMagnitude = 0.05 * body.mass * timeScale;
    Body.applyForce(body, body.position, {
        x: forceMagnitude * direction.x,
        y: forceMagnitude * direction.y,
    });
});

// Force units: mass × pixels/step²  (use mass to normalize across body sizes)
// Always scale by timeScale for frame-rate independence
```

---

## EVENTS — Full List

```javascript
// Engine events:
Events.on(engine, 'beforeUpdate', handler)    // before physics tick
Events.on(engine, 'afterUpdate', handler)     // after physics tick
Events.on(engine, 'collisionStart', handler)  // bodies begin touching
Events.on(engine, 'collisionActive', handler) // bodies in contact
Events.on(engine, 'collisionEnd', handler)    // bodies stop touching

// Render events:
Events.on(render, 'beforeRender', handler)    // before canvas clear+draw
Events.on(render, 'afterRender', handler)     // after all bodies drawn (overlay here)

// World events:
Events.on(engine.world, 'afterAdd', handler)   // body added to world
Events.on(engine.world, 'afterRemove', handler)// body removed

// ALWAYS CLEAN UP:
Events.off(engine, 'beforeUpdate', handler)   // in setup() return function
```

---

## TIME SCALING (slow-mo / bullet time)

```javascript
// From timescale.js:
engine.timing.timeScale = 0      // full pause
engine.timing.timeScale = 0.1    // 10% speed (slow-mo)
engine.timing.timeScale = 1      // normal speed (default)
engine.timing.timeScale = 2      // 2× fast-forward

// Smooth tween (from timescale.js):
Events.on(engine, 'afterUpdate', function(event) {
    var timeScale = (event.delta || (1000 / 60)) / 1000;
    engine.timing.timeScale += (target - engine.timing.timeScale) * 12 * timeScale;
});
```

---

## COMPLETE PROPERTY REFERENCE TABLE

| Property | Default | Ideal Projectile | Bouncing Ball | Shrapnel | Ground/Wall |
|---|---|---|---|---|---|
| `isStatic` | `false` | `false` | `false` | `false` | `true` |
| `restitution` | `0` | `0` | `0.8` | `0.4` | `0` |
| `friction` | `0.1` | `0` | `0.0001` | `0` | `0` |
| `frictionAir` | `0.01` | `0` | `0` | `0` | n/a |
| `density` | `0.001` | default | default | default | n/a |
| `isSensor` | `false` | `false` | `false` | `false` | `false` |

---

## OUR SIMULATION CONSTANTS

```javascript
// Verified for 380×260px canvas (see Projectile.sim.tsx)
const GRAVITY_Y = 0.1          // engine.gravity.y
const G_EFF     = 0.36         // = 0.1 × 0.001 × 3600  px/step
const V_SCALE   = 0.5          // m/s → px/step
const M_SCALE   = 4            // height metres → pixels

// Physics at 45°, speed=20 m/s:
// vx = vy = 20 × 0.5 × cos(45°) = 7.07 px/step
// peak_time = 7.07 / 0.36 = 19.6 steps (0.33 seconds) ✓
// range = 2 × 7.07² / 0.36 = 277 px (fits 380px canvas) ✓
// peak_height = 7.07² / (2 × 0.36) = 69 px (fits 260px canvas) ✓

// Trajectory preview (t in seconds):
const gPix  = G_EFF * 3600      // px/s²  = 1296
const vxPix = vx0 * 60          // px/s
const vyPix = vy0 * 60          // px/s
// x(t) = launchX + vxPix * t
// y(t) = launchY + vyPix * t + 0.5 * gPix * t²
```
