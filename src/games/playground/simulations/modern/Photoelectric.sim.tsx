import { useCallback, useEffect, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/** Photoelectric Effect — photons hitting metal, electrons ejected, stopping potential */
export function PhotoelectricSim(props: SimProps) {
  const { controls, isPlaying } = props
  const lambda_nm  = controls['lambda'] ?? 400   // nm wavelength
  const phi_eV     = controls['phi']    ?? 2.5   // eV work function
  const intensity  = controls['I']      ?? 5     // photons per frame

  const h  = 6.626e-34, c_light = 3e8, eV = 1.6e-19
  const E_photon_eV = (h * c_light / (lambda_nm * 1e-9)) / eV
  const KE_max_eV   = Math.max(0, E_photon_eV - phi_eV)
  const V_stop      = KE_max_eV   // in volts
  const ejected     = KE_max_eV > 0

  type Photon = { x: number; y: number; vx: number; vy: number; alive: boolean; isElectron: boolean }
  const particlesRef = useRef<Photon[]>([])
  const timeRef = useRef(0)

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    if (isPlaying) {
      timeRef.current += dt
      // Spawn photons
      if (Math.random() < intensity * dt * 3) {
        particlesRef.current.push({
          x: Math.min(W, H) * (0.06 * 1.5), y: H * 0.3 + (Math.random() - 0.5) * H * 0.25,
          vx: 160, vy: 0, alive: true, isElectron: false,
        })
      }
      // Move
      particlesRef.current.forEach(p => {
        p.x += p.vx * dt; p.y += p.vy * dt
        if (!p.isElectron && p.x > Math.min(W, H) * (0.5 * 1.5)) {
          // Hit metal
          p.alive = false
          if (ejected) {
            // Speed scales with sqrt(KE_max): v_px = BASE_SPEED + SCALE * sqrt(KE_max_eV)
            const BASE_SPEED = 40, SCALE = 30
            const speed = BASE_SPEED + SCALE * Math.sqrt(KE_max_eV)
            particlesRef.current.push({
              x: Math.min(W, H) * (0.5 * 1.5), y: p.y,
              vx: speed, vy: (Math.random() - 0.5) * speed * 0.8,
              alive: true, isElectron: true,
            })
          }
        }
        if (p.isElectron && (p.x > Math.min(W, H) * (0.92 * 1.5) || p.y < 0 || p.y > H)) p.alive = false
      })
      particlesRef.current = particlesRef.current.filter(p => p.alive).slice(-80)
    }

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#0D1117'; ctx.fillRect(0, 0, W, H)

    // Metal plate
    const metalX = Math.min(W, H) * (0.5 * 1.5)
    const metalGrad = ctx.createLinearGradient(metalX, 0, metalX + 16, 0)
    metalGrad.addColorStop(0, '#475569'); metalGrad.addColorStop(1, '#94A3B8')
    ctx.fillStyle = metalGrad
    ctx.fillRect(metalX, H * 0.08, 20, H * 0.84)
    ctx.strokeStyle = '#E2E8F0'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.rect(metalX, H * 0.08, 20, H * 0.84); ctx.stroke()

    // Metal label
    const fs = Math.max(9, Math.round(Math.min(W, H) * (0.026 * 1.5)))
    ctx.fillStyle = '#94A3B8'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText('Metal', metalX + 10, H * 0.06)
    ctx.fillText(`φ=${phi_eV}eV`, metalX + 10, H * 0.06 + fs + 2)

    // Photons
    particlesRef.current.filter(p => !p.isElectron).forEach(p => {
      const wavelengthColor = lambda_nm < 450 ? '#8B5CF6' : lambda_nm < 495 ? '#3B82F6' : lambda_nm < 570 ? '#10B981' : lambda_nm < 620 ? '#F59E0B' : '#F43F5E'
      ctx.fillStyle = wavelengthColor
      ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill()
      // Wave wiggles
      ctx.strokeStyle = wavelengthColor + '60'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(p.x - 10, p.y); ctx.lineTo(p.x, p.y); ctx.stroke()
    })

    // Electrons
    particlesRef.current.filter(p => p.isElectron).forEach(p => {
      ctx.fillStyle = '#FDE68A'
      ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#FFFBFE'; ctx.font = `8px 'Roboto', sans-serif`; ctx.textAlign = 'center'
      ctx.fillText('e⁻', p.x, p.y + 3)
    })

    // Light source
    ctx.fillStyle = '#FEF3C7'
    ctx.beginPath(); ctx.arc(Math.min(W, H) * (0.06 * 1.5), H * 0.3, 16, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#F59E0B'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText('hν', Math.min(W, H) * (0.06 * 1.5), H * 0.3 + 4)
    ctx.fillText(`λ=${lambda_nm}nm`, Math.min(W, H) * (0.06 * 1.5), H * 0.3 + 28)

    // Info panel
    const rows = [
      { l: 'E_photon', v: `${E_photon_eV.toFixed(2)} eV`,          c: '#FDE68A' },
      { l: 'φ (work)',  v: `${phi_eV.toFixed(2)} eV`,               c: '#94A3B8' },
      { l: 'KE_max',   v: ejected ? `${KE_max_eV.toFixed(2)} eV` : 'No emission — below φ', c: ejected ? '#10B981' : '#F43F5E' },
      { l: 'V_stop',   v: `${V_stop.toFixed(2)} V`,                 c: '#60A5FA' },
      { l: 'Ejected?', v: ejected ? '✓ YES' : '✗ NO',             c: ejected ? '#10B981' : '#F43F5E' },
    ]
    ctx.fillStyle = '#13202F'
    ctx.beginPath(); ctx.roundRect(Math.min(W, H) * (0.58 * 1.5), H * 0.1, Math.min(W, H) * (0.38 * 1.5), rows.length * (fs + 8) + 14, 8); ctx.fill()
    rows.forEach(({ l, v, c }, i) => {
      const ry = H * 0.1 + 12 + i * (fs + 8) + fs * 0.85
      ctx.fillStyle = '#8B949E'; ctx.font = `${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'left'; ctx.fillText(l, Math.min(W, H) * (0.58 * 1.5) + 8, ry)
      ctx.fillStyle = c; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'right'; ctx.fillText(v, Math.min(W, H) * (0.96 * 1.5) - 4, ry)
    })

    ctx.fillStyle = '#8B949E'; ctx.font = `${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(`KE_max = hν − φ = ${E_photon_eV.toFixed(2)} − ${phi_eV} = ${KE_max_eV.toFixed(2)} eV`, W / 2, H - 10)
  }, [lambda_nm, phi_eV, intensity, E_photon_eV, KE_max_eV, V_stop, ejected, isPlaying])

  // Reset particles only when wavelength or work function changes (not on every render)
  useEffect(() => {
    particlesRef.current = []
    timeRef.current = 0
  }, [lambda_nm, phi_eV])

  return <CanvasEngine {...props} draw={draw} deps={[lambda_nm, phi_eV, intensity, isPlaying]} animated />
}
