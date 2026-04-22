# Physics Simulation Review
> Generated: 2026-04-22 | Covers all 65 simulation files across 4 categories

---

## Severity Legend
- 🔴 **CRITICAL** — Wrong physics formula / crash-level bug
- 🟠 **HIGH** — Significant physics approximation error or broken feature
- 🟡 **MEDIUM** — Missing key physics, misleading UI, minor formula issue
- 🟢 **LOW** — Polish / completeness gap

---

## Category 1: Mechanics (28 files)

### 🔴 Critical

#### WorkEnergy.sim.tsx
- **Bug:** `Applied Force` control exists in UI but is **never used in physics**. Only gravity drives the simulation. The `W_applied` readout always shows zero — actively misleading students.
- **Fix:** Wire force parameter into `F_net = m*g + F_applied` and recompute work correctly, or remove the control entirely.

#### AtwoodMachine.sim.tsx
- **Bug:** Block motion does NOT follow Atwood machine acceleration formula `a = (m₂−m₁)g / (m₁+m₂)`. Blocks move based on arbitrary mass-ratio position init, not real physics.
- **Fix:** Compute `a` from the formula, apply it as constant acceleration to both blocks via physics engine or manual integration. Show tension `T = m₁m₂·2g/(m₁+m₂)`.

---

### 🟠 High

#### FrictionAdvanced.sim.tsx
- Force arrow visualization is created but set to `opacity: 0` — completely invisible. Adds no value.
- Static vs kinetic friction transition has no visual "switch" moment label ("Now sliding!").

#### PVDiagram.sim.tsx
- Isochoric process line is drawn at hardcoded `P0 * 2` instead of being derived from the temperature change. Breaks physical meaning.
- Work done W = ∫P dV not calculated or shown for any process.

#### SpringCollisionEnergy.sim.tsx
- Velocity update uses `dt * pxPerMeter` scaling — units are inconsistent (pixels are not meters).
- `velocity = -velocity` reset logic fires every frame, may cause jitter.
- Total mechanical energy (KE + PE) not shown; can't verify conservation.

#### StressStrain.sim.tsx
- Plastic deformation region uses `σ ∝ √(ε)` — an arbitrary curve, not a real material model.
- `eps_uts` calculation uses hardcoded `0.45` factor with no physical derivation.

---

### 🟡 Medium

| File | Issue |
|------|-------|
| **Pendulum.sim.tsx** | `frictionAir = 0.003` applied — ideal pendulum should have zero damping. T = 2π√(L/g) formula not shown on canvas. |
| **SpringMass.sim.tsx** | No ω, T, or energy bar (KE+PE) display. Amplitude range `0–8%` is arbitrary with no unit label. |
| **Projectile.sim.tsx** | No velocity/acceleration vectors. No range or max-height readout. Magic scaling constant `0.06`. |
| **Rolling.sim.tsx** | Centre-dot for rotation visualisation exists but isn't visible in render. No v = ωr constraint verification. |
| **CenterOfMass.sim.tsx** | Only 4 particles hardcoded. No momentum display. Scaling multiplies by 10 then divides — confusing. |
| **ConstraintMotion.sim.tsx** | Acceleration formula `a = m₂g/(m₁+m₂)` not shown. No friction limit comparison. |
| **Bernoulli.sim.tsx** | Bernoulli constant not calculated. Particle speed uses magic number `22` for narrow-section scaling. |
| **KineticTheory.sim.tsx** | Pressure formula `P ∝ nT` used but not displayed. Molecular collisions not modelled. |
| **CarnotCycle.sim.tsx** | Per-stroke work and Q_H, Q_C heat flows not shown despite being key exam quantities. |
| **HeatTransfer.sim.tsx** | Convection coefficient `h = 25 W/m²K` hardcoded with no label or explanation. |
| **RelativeMotion.sim.tsx** | Relative acceleration not shown. No reference-frame transformation explanation. |
| **BlockPulleyFriction.sim.tsx** | Tension formula `T = m₂(g−a)` not displayed. Equilibrium case has no force balance equation. |

---

### 🟢 Low / Good (reference implementations)

`CircularMotion`, `OrbitalMotion`, `Bernoulli`, `FluidPressure`, `Viscosity`, `Calorimetry`, `PseudoForce` are the best-implemented sims — use them as templates for style and info-panel completeness.

---

## Category 2: Electromagnetic Fields (18 files)

### 🔴 Critical

#### ChargedEMField.sim.tsx
- **Bug (lines 40–41):** Lorentz force cross-product is wrong.
  - Current: `ay = (q * E - q * vx * B) / m`
  - Correct: `ay = q * (Ey - vx * Bz) / m` with proper coordinate decomposition
  - The E-field and magnetic force terms are mixed in a dimensionally inconsistent way.
- No right-hand rule visualisation.

#### MutualInductance.sim.tsx
- **Bug (line 23):** Coupling coefficient `k = 1 / (1 + d_cm * 0.1)` is entirely made up — no physical basis.
- **Bug (line 23):** `M = k * (N1 * N2 * 1e-6)` missing all geometric factors and μ₀. Correct: `M = μ₀ · N₁N₂ · A / l`.
- Secondary voltage multiplied by 1000 "for visibility" without physical justification.

---

### 🟠 High

#### BiotSavart.sim.tsx
- Field magnitude arrows are uniform — doesn't show the `1/r²` distance decay fundamental to Biot-Savart law.
- Heatmap shows opacity variation but not true magnitude scaling.
- Loop cross-section field calculation (line 65) is linear superposition, ignoring distance dependence.

#### ForceCurrentWire.sim.tsx
- Force direction uses hardcoded `-sin` / `+cos` values (lines 77–78) — only valid for one wire orientation, not general.
- `F = ILB sinθ` angle-dependence is not visualised; force doesn't scale with sin(θ).

#### FaradayInduction.sim.tsx
- Flux model (line 51) uses a **Gaussian function** instead of a dipole or solenoid field model — physically unjustified.
- Lenz's law direction (induced current opposing flux change) not shown.
- Galvanometer colour (red/blue) doesn't encode actual current direction from Lenz's law.

---

### 🟡 Medium

| File | Issue |
|------|-------|
| **ChargedParticleMagnetic.sim.tsx** | `phaseRef.current = 0` resets on every render (line 101) — breaks continuous animation. No helical motion (v∥B case). |
| **LCRCircuit.sim.tsx** | Phasor diagram missing impedance vector decomposition (R, X_L, X_C components). No Q-factor/bandwidth display. Same phase-reset bug as above. |
| **CurrentElectricity.sim.tsx** | Wire dashes don't show current direction with arrows. `deps` array missing `normSpeed`. Power per resistor not shown in parallel mode. |
| **MagneticDipole.sim.tsx** | Negative torque sign defined in line 30, recalculated positive in line 50 — confusing convention mixing. No damping explanation. |
| **EMWave.sim.tsx** | E/B amplitude ratio not enforced (physically must be `E = c·B`). No Poynting vector. 3D perspective confusing without axis labels. |
| **SelfInductance.sim.tsx** | Back-EMF `ε = −L di/dt` not shown as a separate visualised effect. `startTimeRef` check could fail on reset. |
| **Solenoid.sim.tsx** | No fringing field at coil ends. Field animation (dashes) doesn't correspond to any physical quantity. |
| **Capacitor.sim.tsx** | No charging animation. No dielectric polarisation visualisation. No ε–field relationship shown. |
| **RCCircuit.sim.tsx** | `timeRef.current = 0; histRef.current = []` resets unconditionally on every render (line 127). Current curve not shown (only voltage). |
| **GaussSphere.sim.tsx** | Correct — no critical issues. |
| **WheatstoneBridge.sim.tsx** | Time parameter `t` passed to draw but unused. |

---

### 🟢 Duplicate File
`WheatsoneBridge.sim.tsx` AND `WheatstoneBridge.sim.tsx` both exist with nearly identical functionality but different variable names (R/S vs R3/Rx). One should be deleted. Keep the correctly-spelled `WheatstoneBridge.sim.tsx`.

---

## Category 3: Optics & Waves (10 files)

### 🔴 Critical

#### Prism.sim.tsx
- **Bug:** Normal vector handling is mathematically inconsistent throughout.
  - Face normals (lines 61–63) stored as scalar angle values but used as if they were direction angles in subtraction arithmetic.
  - Line 87: `theta1 = angleInc - normal1` mixes angle of incidence with a normal direction — conceptually wrong.
  - Line 90: Snell's law applied with this corrupted angle — refracted ray direction is incorrect.
- **Bug:** Ray-hit detection only checks left face (line 85); doesn't handle all geometries.
- Missing: minimum deviation condition, deviation angle `δ = (i₁ + e₂) − A`, TIR feedback, refractive index dispersion explanation.
- No incident angle control exposed in UI (`angle ?? 0` fallback but no slider).

#### Polarization.sim.tsx
- **Bug (line 53):** `phaseRef.current = 0` is placed after the return statement — resets phase every frame. The animation always restarts, making the wave appear frozen or glitching.
- **Fix:** Remove or move this line to a proper reset handler (e.g., inside a `useEffect` cleanup or button handler).

---

### 🟠 High

#### Doppler.sim.tsx
- Unit mismatch: `vs * dt * 0.002` (line 21–22) mixes m/s with milliseconds — dimensionally inconsistent.
- Wavefront radius (line 43) includes unexplained `× 1.5` factor.
- Only source-moving case; observer-moving case (different formula) not shown.

#### SingleSlit.sim.tsx
- `beta = π·a·y / (λ·D)` (line 11) has unit inconsistency: `a` in mm, `y` in unknown units, `λ` in nm, `D` in m — formula will give wrong values.
- Central maximum width formula `W = 2λD/a` not shown. Only 1st minimum labelled.

---

### 🟡 Medium

| File | Issue |
|------|-------|
| **YDSE.sim.tsx** | Path difference `Δ = d·y/D` not shown. Order of interference `n` not labelled per fringe. Arbitrary 40px scaling factor (line 47). |
| **WaveSuperposition.sim.tsx** | Resultant amplitude always uses `A₁ + A₂` max — doesn't vary with phase. Phase control units unclear (tenths of π). No phasor diagram. |
| **Beats.sim.tsx** | Beat envelope `A(t) = 2A₀cos(π·f_beat·t)` not visualised. `dt × 0.05` arbitrary. Window may be too small for low f_beat. |
| **StandingWave.sim.tsx** | Nodal positions lack numerical labels. No multi-mode superposition demo. Otherwise well-implemented — good reference. |
| **LensRay.sim.tsx** | Only 2 of 3 standard rays drawn (missing through-focal-point ray). No power P = 1/f (diopters) shown. |
| **MirrorRay.sim.tsx** | Focal length `f` shown without sign — should display `+f` or `−f` to match convention. Magnification inversion edge case. |

---

## Category 4: Modern Physics (6 files)

### 🔴 Critical

#### XRay.sim.tsx
- **Bug (lines 86–87):** Moseley's law implementation is wrong.
  - Current: `Ka = 1216 / ((Z−1)²) × 100` — formula inverted (λ ∝ 1/(Z−σ)² should give characteristic frequency, not wavelength this way)
  - Constants 1216 and 1026 are arbitrary with no derivation from the Rydberg constant.
  - Correct approach: `ν = R·c·(Z−σ)²·(1/n₁² − 1/n₂²)` then `λ = c/ν`.
- Continuous spectrum intensity (line 79) uses magic constant `5e5` with no derivation from Kramers' formula.
- No distinction between bremsstrahlung and characteristic radiation in the visualisation.

#### BohrAtom.sim.tsx
- **Bug (line 101):** `SERIES.find(s => s.n1 + 1 === n2)` — series identification logic is incorrect. Lyman series has `n1 = 1` (transitions TO n=1), but the condition `n1+1 === n2` would match e.g. Balmer for n=2→3, not 3→2.
- Lyman series transitions never shown (line 96 only draws arrows for `n2 > 1` targeting ground state).

#### Photoelectric.sim.tsx
- **Bug (lines 41, 114):** Ejected electron velocity is **hardcoded** to 80–140 px/frame, independent of `KE_max = hf − φ`. Students see no change in electron speed even when photon energy doubles.
- `particlesRef.current = []` and `timeRef.current = 0` reset on every render (line 114) — causes flickering.

---

### 🟠 High

#### DeBroglie.sim.tsx
- Mass control labelled in atomic mass units "u" but code uses `m = 9.11e-31 kg` (electron mass hardcoded) — control has no effect.
- `omega = k * velocity * 1e-6` (line 40) — dimensionally incorrect. Wave frequency should be `ω = E/ℏ = mv²/(2ℏ)`.
- Default velocity 1000 m/s unrealistic for electrons (typical Bohr orbit: ~2.2×10⁶ m/s).

#### NuclearDecay.sim.tsx
- "Isotope" control declared in registry but **never read in the simulation** — dead UI.
- Decay types (α/β/γ) shown visually but not differentiated in physics or labelled.
- No binding energy or mass defect visualisation.

---

### 🟡 Medium

| File | Issue |
|------|-------|
| **RadioactiveDecayGraph.sim.tsx** | Activity `A = λN` shown in panel but not plotted as separate graph. No branching ratio or decay mode distinction. Otherwise best-implemented modern sim. |
| **BohrAtom.sim.tsx** | No photon emission animation on transition. Electron stays at selected orbit indefinitely — no ground-state decay. No Lyman/Balmer/Paschen series legend. |

---

## Missing Simulations (NEET/JEE Topics with No Coverage)

### Modern Physics Gaps
| Topic | NEET Weight | Status |
|-------|-------------|--------|
| Rutherford Scattering | High | ❌ Missing |
| Compton Effect | Medium | ❌ Missing |
| Binding Energy & Mass Defect | High | ❌ Missing |
| Nuclear Fission / Fusion | High | ❌ Missing |
| Alpha / Beta / Gamma decay details | High | ❌ Only shown visually in NuclearDecay |
| Semiconductors / p-n junction | High | ❌ Missing |
| Energy Bands in Solids | Medium | ❌ Missing |
| Pair Production / Annihilation | Low | ❌ Missing |

### Mechanics Gaps
| Topic | Status |
|-------|--------|
| Simple Harmonic Motion — phase plots | ❌ Missing |
| Resonance (mechanical) | ❌ Missing |
| Moment of Inertia comparison (ring vs disc vs sphere) | ❌ Missing |

### Optics Gaps
| Topic | Status |
|-------|--------|
| Total Internal Reflection (critical angle explorer) | ❌ Missing |
| Optical Fibre | ❌ Missing |
| Interference in thin films | ❌ Missing |

---

## Priority Fix List (ordered)

| Priority | File | Fix |
|----------|------|-----|
| 1 | `WorkEnergy.sim.tsx` | Wire force control into physics or remove it |
| 2 | `AtwoodMachine.sim.tsx` | Implement correct `a = (m₂−m₁)g/(m₁+m₂)` |
| 3 | `ChargedEMField.sim.tsx` | Fix Lorentz force cross-product (lines 40–41) |
| 4 | `Prism.sim.tsx` | Rewrite Snell's law with proper normal vectors |
| 5 | `Polarization.sim.tsx` | Remove phase reset at line 53 |
| 6 | `XRay.sim.tsx` | Implement correct Moseley's law |
| 7 | `BohrAtom.sim.tsx` | Fix series identification logic (line 101) |
| 8 | `Photoelectric.sim.tsx` | Make electron velocity ∝ KE_max; fix render reset |
| 9 | `MutualInductance.sim.tsx` | Use proper M = μ₀N₁N₂A/l formula |
| 10 | `DeBroglie.sim.tsx` | Fix mass control units and omega calculation |
| 11 | `BiotSavart.sim.tsx` | Add 1/r² field magnitude scaling |
| 12 | `FaradayInduction.sim.tsx` | Replace Gaussian flux with dipole field model; add Lenz's law |
| 13 | `WheatsoneBridge.sim.tsx` (typo) | Delete duplicate; keep `WheatstoneBridge.sim.tsx` |
| 14 | `SingleSlit.sim.tsx` | Fix unit consistency in beta calculation |
| 15 | `Doppler.sim.tsx` | Fix unit mismatch in wavefront calculation |

---

## Cross-Cutting Improvements

1. **Formula display:** All sims should show the governing equation(s) on canvas. Best examples: `CircularMotion`, `Viscosity`, `PseudoForce`.
2. **Units on all controls:** Every slider/input should show units (m, kg, N, Hz, etc.). Currently inconsistent.
3. **Force diagrams:** Mechanics sims (Inclined, Pulley, Atwood) should draw free-body diagrams with labelled vectors.
4. **Energy conservation:** All mechanical sims should show a KE + PE bar or total-energy readout.
5. **Sign conventions:** Mirror/lens sims need explicit sign convention reminder (+/− for object/image distance).
6. **Phase reset anti-pattern:** Multiple sims use `ref = 0` inside the render/draw function. This should always be in a `useEffect` or reset handler. Files affected: `ChargedParticleMagnetic`, `LCRCircuit`, `Polarization`, `RCCircuit`.
