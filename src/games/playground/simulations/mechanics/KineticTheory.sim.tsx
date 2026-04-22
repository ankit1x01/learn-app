import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/** Kinetic Theory of Gases — animated gas molecules with live P, T, KE readouts */
export function KineticTheorySim(props: SimProps) {
  const { controls, isPlaying } = props
  const N   = Math.round(controls['N']   ?? 30)    // number of molecules
  const T   = controls['T']             ?? 300     // temperature K
  const M   = controls['M']             ?? 0.029   // molar mass kg/mol (air)

  const k_B   = 1.38e-23
  const R_gas = 8.314
  const N_A   = 6.022e23
  const m     = M / N_A   // mass per molecule

  // v_rms = sqrt(3kT/m)
  const v_rms = Math.sqrt(3 * k_B * T / m)
  const KE_avg = 1.5 * k_B * T

  type Molecule = { x: number; y: number; vx: number; vy: number; r: number }
  const molsRef = useRef<Molecule[]>([])

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    const BOX = { x: Math.min(W, H) * (0.06 * 1.5), y: H * 0.06, w: Math.min(W, H) * (0.56 * 1.5), h: H * 0.86 }

    // Init / reinit molecules when N or T changes
    if (molsRef.current.length !== N) {
      const scale = Math.min(v_rms * 0.00015, 1.5)
      molsRef.current = Array.from({ length: N }, () => ({
        x: BOX.x + Math.random() * BOX.w,
        y: BOX.y + Math.random() * BOX.h,
        vx: (Math.random() - 0.5) * scale * 200,
        vy: (Math.random() - 0.5) * scale * 200,
        r: 5,
      }))
    }

    if (isPlaying) {
      const speedScale = Math.sqrt(T / 300)
      molsRef.current.forEach(m2 => {
        m2.x += m2.vx * dt * speedScale
        m2.y += m2.vy * dt * speedScale
        if (m2.x - m2.r < BOX.x)          { m2.x = BOX.x + m2.r;          m2.vx = Math.abs(m2.vx) }
        if (m2.x + m2.r > BOX.x + BOX.w)  { m2.x = BOX.x + BOX.w - m2.r; m2.vx = -Math.abs(m2.vx) }
        if (m2.y - m2.r < BOX.y)          { m2.y = BOX.y + m2.r;          m2.vy = Math.abs(m2.vy) }
        if (m2.y + m2.r > BOX.y + BOX.h)  { m2.y = BOX.y + BOX.h - m2.r; m2.vy = -Math.abs(m2.vy) }
      })
    }

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'; ctx.fillRect(0, 0, W, H)

    // Box
    ctx.fillStyle = '#0D1117'
    ctx.beginPath(); ctx.roundRect(BOX.x, BOX.y, BOX.w, BOX.h, 8); ctx.fill()
    ctx.strokeStyle = '#6750A4'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.roundRect(BOX.x, BOX.y, BOX.w, BOX.h, 8); ctx.stroke()

    // Molecules with speed-based colour
    molsRef.current.forEach(mol => {
      const speed = Math.sqrt(mol.vx * mol.vx + mol.vy * mol.vy)
      const hot   = Math.min(1, speed / 300)
      const r = Math.round(255 * hot), b = Math.round(200 * (1 - hot))
      const g = ctx.createRadialGradient(mol.x, mol.y, 0, mol.x, mol.y, mol.r)
      g.addColorStop(0, `rgba(${r},180,${b},1)`)
      g.addColorStop(1, `rgba(${r},80,${b},0.7)`)
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(mol.x, mol.y, mol.r, 0, Math.PI * 2); ctx.fill()
    })

    // ── Maxwell-Boltzmann speed distribution (right panel) ──
    const px  = BOX.x + BOX.w + 16
    const pw  = W - px - 8
    const ph  = BOX.h
    const py2 = BOX.y

    const fs  = Math.max(9, Math.round(Math.min(W, H) * (0.026 * 1.5)))
    ctx.fillStyle = '#F4EFF4'
    ctx.beginPath(); ctx.roundRect(px, py2, pw, ph, 8); ctx.fill()

    // MB curve: f(v) ∝ v² exp(-mv²/2kT)
    const vMax2 = 4 * v_rms
    const fPeak = (v: number) => {
      if (v <= 0) return 0
      return v * v * Math.exp(-m * v * v / (2 * k_B * T))
    }
    // Normalize
    let fmax = 0
    for (let i = 1; i <= 200; i++) fmax = Math.max(fmax, fPeak(vMax2 * i / 200))

    ctx.strokeStyle = '#6750A4'; ctx.lineWidth = 2
    ctx.beginPath()
    for (let i = 0; i <= 200; i++) {
      const v = vMax2 * i / 200
      const f = fPeak(v) / fmax
      const gx = px + 8 + (v / vMax2) * (pw - 16)
      const gy = py2 + ph - 20 - f * (ph - 40)
      i === 0 ? ctx.moveTo(gx, gy) : ctx.lineTo(gx, gy)
    }
    ctx.stroke()

    // v_rms marker
    const vrmsX = px + 8 + (v_rms / vMax2) * (pw - 16)
    ctx.strokeStyle = '#F43F5E'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3])
    ctx.beginPath(); ctx.moveTo(vrmsX, py2 + 20); ctx.lineTo(vrmsX, py2 + ph - 20); ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = '#F43F5E'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText('v_rms', vrmsX, py2 + 16)

    // Derived quantities for display
    const V_box = BOX.w * BOX.h * 1e-4          // canvas area → m² proxy (2-D "volume")
    const P_kPa = (N * k_B * T / V_box) / 1000  // kPa  (P = NkT/V)
    const KE_eV = KE_avg / 1.6e-19              // convert J → eV

    // Info rows — formula labels + live values
    const infoY = py2 + ph * 0.42
    const rows = [
      { l: 'T',                v: `${T} K`                        },
      { l: 'N',                v: `${N}`                          },
      { l: 'P = NkT/V',       v: `${P_kPa.toFixed(2)} kPa`       },
      { l: 'v_rms = √(3kT/m)',v: `${v_rms.toFixed(0)} m/s`       },
      { l: '⟨KE⟩ = 3kT/2',   v: `${KE_eV.toFixed(4)} eV`        },
    ]
    rows.forEach(({ l, v }, i) => {
      const ry = infoY + i * (fs + 7) + fs
      ctx.fillStyle = '#49454F'; ctx.font = `${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'left'
      ctx.fillText(l, px + 8, ry)
      ctx.fillStyle = '#6750A4'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'right'
      ctx.fillText(v, px + pw - 6, ry)
    })

    ctx.fillStyle = '#1C1B1F'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText('Speed Distribution', px + pw / 2, py2 + 14)
  }, [N, T, M, v_rms, KE_avg, m, k_B, isPlaying])

  // Reset molecules on param change
  molsRef.current = []
  return <CanvasEngine {...props} draw={draw} deps={[N, T, M, isPlaying]} animated />
}
