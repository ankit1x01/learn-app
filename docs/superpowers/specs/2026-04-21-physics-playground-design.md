# PhysicsPlayground — Design Spec
**Date:** 2026-04-21  
**Status:** Approved for implementation

---

## Problem

Existing physics games (PhysicsSandbox, CoulombsCollider, KinematicsCannon, etc.) are standalone simulators — no unified API, no puzzle layer, no FSRS integration, no shared UI. Adding a new topic requires duplicating all scaffolding. Games don't train towards JEE Advanced level problem-solving.

---

## Solution

A single React component `<PhysicsPlayground type="..." config={...} />` backed by a plugin registry. Each simulation type is one file. The shell, engines, puzzle UI, and measurement overlay are shared across all 26 types.

---

## Architecture

### Shell (PhysicsPlayground.tsx ~80 lines)
- Reads `SIMULATION_REGISTRY[type]` to get `{ component, engine, conceptId, puzzles, defaultControls }`
- Selects puzzle from `config.puzzle` or picks by `config.complexity` from the type's puzzle bank
- Renders: `[ControlPanel | SimulationArea | PuzzlePanel]` layout
- Tracks: `hintsUsed`, `startTime`, `answerInputs`
- On submit: validates answers against `puzzle.answer` within `puzzle.tolerance %`, fires `onResult`

### Engines
| Engine | Technology | Topics |
|---|---|---|
| `MatterEngine` | matter-js 0.20 | projectile, collision, spring_mass, pendulum, atwood, rolling, inclined_plane, circular_motion, orbit |
| `ThreeEngine` | @react-three/fiber + @react-three/rapier | electric_field, capacitor, gauss_sphere, magnetic_force, biot_savart, solenoid, lcr_circuit, em_wave, bohr_atom, photoelectric |
| `CanvasEngine` | SVG/Canvas | mirror_ray, lens_ray, prism, ydse, single_slit, standing_wave |
| `StubEngine` | div placeholder | any unimplemented type |

### Plugin Interface
```typescript
interface SimulationPlugin {
  component: React.LazyExoticComponent<ComponentType<SimProps>>
  engine: 'matter' | 'three' | 'canvas' | 'stub'
  conceptId: string
  puzzles: PuzzleConfig[]
  defaultControls: ControlDef[]
}

interface SimProps {
  controls: Record<string, number>   // current slider values
  puzzle: PuzzleConfig | null
  isPlaying: boolean
  onReset: () => void
}
```

### Puzzle Format
```typescript
interface PuzzleConfig {
  id: string
  complexity: 'board' | 'jee_main' | 'jee_advanced'
  question: string
  given: Record<string, number>
  find: string[]
  answer: Record<string, number>
  tolerance: number                  // % error allowed
  hints: string[]                    // max 3, progressive
  formula: string
  units: Record<string, string>
}
```

### Result Callback
```typescript
onResult?: (r: {
  conceptId: string
  correct: boolean
  timeTaken: number                  // ms
  score: number                      // 0–100
  hintsUsed: number
}) => void
```

Score formula: `100 - (hintsUsed × 15) - (overtime_penalty)`

---

## File Structure

```
src/games/playground/
├── PhysicsPlayground.tsx
├── registry.ts
├── types.ts
├── engines/
│   ├── MatterEngine.tsx
│   ├── ThreeEngine.tsx
│   ├── CanvasEngine.tsx
│   └── StubEngine.tsx
├── ui/
│   ├── PuzzlePanel.tsx
│   ├── ControlPanel.tsx
│   ├── ResultModal.tsx
│   └── MeasurementOverlay.tsx
├── simulations/
│   ├── mechanics/
│   │   ├── Projectile.sim.tsx         ✅ fully built
│   │   ├── CollisionElastic.sim.tsx   ✅ fully built
│   │   ├── SpringMass.sim.tsx         ✅ fully built
│   │   ├── Pendulum.sim.tsx           stub
│   │   ├── AtwoodMachine.sim.tsx      stub
│   │   ├── Rolling.sim.tsx            stub
│   │   ├── InclinedPlane.sim.tsx      stub
│   │   ├── CircularMotion.sim.tsx     stub
│   │   └── Orbit.sim.tsx              stub
│   ├── fields/
│   │   ├── ElectricField.sim.tsx      ✅ fully built
│   │   ├── Capacitor.sim.tsx          stub
│   │   ├── GaussSphere.sim.tsx        stub
│   │   ├── MagneticForce.sim.tsx      stub
│   │   ├── BiotSavart.sim.tsx         stub
│   │   ├── Solenoid.sim.tsx           stub
│   │   ├── LCRCircuit.sim.tsx         stub
│   │   └── EMWave.sim.tsx             stub
│   ├── optics/
│   │   ├── MirrorRay.sim.tsx          stub
│   │   ├── LensRay.sim.tsx            stub
│   │   ├── Prism.sim.tsx              stub
│   │   ├── YDSE.sim.tsx               stub
│   │   └── SingleSlit.sim.tsx         stub
│   └── modern/
│       ├── BohrAtom.sim.tsx           stub
│       └── Photoelectric.sim.tsx      stub
└── puzzles/
    ├── projectile.puzzles.ts          9 puzzles (3×3 complexity)
    ├── collision.puzzles.ts           9 puzzles
    ├── spring_mass.puzzles.ts         9 puzzles
    └── electric_field.puzzles.ts      9 puzzles
```

---

## Fully Built Simulations (4)

### 1. Projectile (Matter.js)
- Cannon at origin, fires ball with `angle` + `speed` controls
- Trajectory arc drawn as dotted line during flight
- Landing marker with measured range
- Force vectors: initial velocity vector, gravity arrow
- JEE Advanced puzzle: cliff height + second launch angle

### 2. Collision Elastic (Matter.js)
- Two balls on frictionless track, adjustable mass + initial velocity
- Before/after momentum and KE displayed
- Coefficient of restitution slider for inelastic variant
- JEE Advanced puzzle: find final velocities given masses and initial speeds

### 3. Spring Mass (Matter.js)
- Block on spring, adjustable k and mass
- Real-time PE/KE energy bar
- Period measurement overlay
- JEE Advanced puzzle: find amplitude given initial velocity at equilibrium

### 4. Electric Field (Three.js)
- Place up to 4 charges, drag to position
- Field line visualization using numerical integration
- Force vector on test charge
- JEE Advanced puzzle: find net force on charge at given position

---

## Puzzle Bank (36 total — 9 per topic × 4 topics)

Each topic has:
- 3 × board complexity
- 3 × jee_main complexity
- 3 × jee_advanced complexity

JEE Advanced distinguishers:
- Multi-part questions (find 2+ quantities)
- Non-standard initial conditions (cliff, medium, combined setups)
- Two valid answers (e.g. two launch angles for same range)
- Requires recognising which formula chain applies

---

## UI Layout

```
┌─────────────────────────────────────┐
│  ← Back    [topic name]    [⚙ Free] │  ← header
├──────────────┬──────────────────────┤
│              │  PUZZLE PANEL        │
│  SIMULATION  │  question text       │
│  (canvas/    │  ─────────────────   │
│   three.js/  │  answer inputs       │
│   matter.js) │  [Hint] [Submit]     │
│              │                      │
├──────────────┤  CONTROLS            │
│ [▶ Play][↺]  │  sliders             │
│ [📏][→F]     │  given values shown  │
└──────────────┴──────────────────────┘
```

Mobile: simulation top, puzzle + controls bottom (scrollable sheet)

---

## Constraints

- React.lazy() on all simulation imports — only active sim loads
- Matter.js engine destroyed on unmount (memory leak prevention)
- Three.js renderer disposed on unmount
- No simulation file imports another simulation file
- Puzzle answers validated client-side only (no backend needed)
- All M3 design tokens — no ad-hoc colors

---

## Out of Scope (this spec)

- AI-generated puzzles (Gemini API) — future spec
- FSRS direct write (uses onResult callback only)
- Multiplayer / competitive mode
- Puzzle authoring UI
