import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/** Orbital Motion — planet orbiting a star under gravity, shows Kepler's laws */
export function OrbitalMotionSim(props: SimProps) {
  const { controls, isPlaying } = props
  const M_star  = controls['M_star']  ?? 2e30   // kg (solar mass scale)
  const r_orbit = controls['r_orbit'] ?? 1.5e11 // m (AU scale)
  const ecc     = controls['ecc']     ?? 0      // eccentricity 0=circle

  const G = 6.674e-11
  const v_orb = Math.sqrt(G * M_star / r_orbit)           // m/s at perihelion
  const T_orb = 2 * Math.PI * r_orbit / v_orb             // period s
  const a_semi = r_orbit / (1 - ecc)                      // semi-major axis

  const phaseRef = useRef(0)

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    if (isPlaying) phaseRef.current += (2 * Math.PI / Math.max(T_orb / 1e7, 1)) * dt * 60

    const phase = phaseRef.current
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#0D1117'; ctx.fillRect(0, 0, W, H)

    // Stars background
    for (let i = 0; i < 60; i++) {
      const sx = (i * 137.5 * W / 100) % W, sy = (i * 97.3 * H / 100) % H
      ctx.fillStyle = `rgba(255,255,255,${0.3 + (i % 3) * 0.2})`
      ctx.beginPath(); ctx.arc(sx, sy, 0.8, 0, Math.PI * 2); ctx.fill()
    }

    const cx = W / 2, cy = H / 2
    const SCALE = Math.min(W, H) * 0.36 / (a_semi * (1 + ecc))
    const a_px  = a_semi * SCALE
    const b_px  = a_semi * Math.sqrt(1 - ecc * ecc) * SCALE
    const focus_px = ecc * a_px   // focus offset from centre

    // Orbit ellipse
    ctx.strokeStyle = '#6750A440'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3])
    ctx.beginPath(); ctx.ellipse(cx - focus_px, cy, a_px, b_px, 0, 0, Math.PI * 2); ctx.stroke()
    ctx.setLineDash([])

    // Star (at focus)
    const starGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 22)
    starGrad.addColorStop(0, '#FEF3C7'); starGrad.addColorStop(0.5, '#F59E0B'); starGrad.addColorStop(1, '#B45309')
    ctx.fillStyle = starGrad
    ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI * 2); ctx.fill()

    // Planet position (Keplerian: parametric ellipse)
    const px_planet = (cx - focus_px) + a_px * Math.cos(phase)
    const py_planet = cy + b_px * Math.sin(phase)

    // Trail
    const TRAIL = 40
    for (let i = 1; i <= TRAIL; i++) {
      const pa = phase - i * 0.05
      const tx = (cx - focus_px) + a_px * Math.cos(pa)
      const ty = cy + b_px * Math.sin(pa)
      ctx.fillStyle = `rgba(99,102,241,${(TRAIL - i) / TRAIL * 0.5})`
      ctx.beginPath(); ctx.arc(tx, ty, 3, 0, Math.PI * 2); ctx.fill()
    }

    // Planet
    const pGrad = ctx.createRadialGradient(px_planet - 3, py_planet - 3, 0, px_planet, py_planet, 9)
    pGrad.addColorStop(0, '#A5B4FC'); pGrad.addColorStop(1, '#4338CA')
    ctx.fillStyle = pGrad
    ctx.beginPath(); ctx.arc(px_planet, py_planet, 9, 0, Math.PI * 2); ctx.fill()

    // Radius vector line (for equal areas law)
    ctx.strokeStyle = '#10B98160'; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px_planet, py_planet); ctx.stroke()

    // Info panel
    const fs = Math.max(9, Math.round(Math.min(W, H) * (0.026 * 1.5)))
    const rows = [
      { l: 'M_star',   v: `${(M_star / 2e30).toFixed(1)} M☉`     },
      { l: 'r_orbit',  v: `${(r_orbit / 1.5e11).toFixed(2)} AU`   },
      { l: 'v_orb',    v: `${(v_orb / 1000).toFixed(1)} km/s`     },
      { l: 'T',        v: `${(T_orb / 3.15e7).toFixed(2)} yr`     },
      { l: 'ecc',      v: `${ecc.toFixed(2)}`                       },
    ]
    ctx.fillStyle = '#13202F'
    ctx.beginPath(); ctx.roundRect(8, 8, 145, rows.length * (fs + 7) + 14, 8); ctx.fill()
    rows.forEach(({ l, v }, i) => {
      const ry = 10 + 12 + i * (fs + 7) + fs * 0.85
      ctx.fillStyle = '#8B949E'; ctx.font = `${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'left'; ctx.fillText(l, 16, ry)
      ctx.fillStyle = '#E6EDF3'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'right'; ctx.fillText(v, 150, ry)
    })

    // Formula panel (bottom-right)
    const v_km  = (v_orb / 1000).toFixed(1)
    const T_days = (T_orb / 86400).toFixed(1)
    const formulaRows = [
      `v = √(GM/r) = ${v_km} km/s`,
      `T = 2πr/v  = ${T_days} days`,
      `T² ∝ r³  (Kepler's 3rd)`,
    ]
    const fW = 220, fH = formulaRows.length * (fs + 8) + 16
    const fX = W - fW - 8, fY = H - fH - 8
    ctx.fillStyle = '#13202F'
    ctx.beginPath(); ctx.roundRect(fX, fY, fW, fH, 8); ctx.fill()
    formulaRows.forEach((row, i) => {
      ctx.fillStyle = i < 2 ? '#E6EDF3' : '#8B949E'
      ctx.font = `${i < 2 ? 'bold ' : ''}${fs}px 'Roboto', sans-serif`
      ctx.textAlign = 'left'
      ctx.fillText(row, fX + 10, fY + 14 + i * (fs + 8) + fs * 0.85)
    })

    // Kepler label
    ctx.fillStyle = '#8B949E'; ctx.font = `${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText("Kepler's 2nd: equal areas in equal times", W / 2, H - 10)
  }, [M_star, r_orbit, ecc, v_orb, T_orb, a_semi, isPlaying])

  phaseRef.current = 0
  return <CanvasEngine {...props} draw={draw} deps={[M_star, r_orbit, ecc, isPlaying]} animated />
}
