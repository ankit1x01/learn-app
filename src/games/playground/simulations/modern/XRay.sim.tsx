import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/**
 * X-Ray Production Simulation
 * Visualizes the Coolidge tube principle and the intensity spectrum.
 */
export function XRaySim(props: SimProps) {
  const { controls, isPlaying } = props

  const V_kv = controls?.V ?? 50
  const Z = controls?.Z ?? 74 // Tungsten default
  const I_ma = controls?.I ?? 5

  const tRef = useRef(0)
  const h = 6.626e-34, c = 3e8, e = 1.602e-19
  
  const V = V_kv * 1000
  const lambdaMin = (h * c) / (e * V)
  const lambdaMin_pm = lambdaMin * 1e12

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    const scale = Math.min(W, H)
    const cx = W / 2, cy = H * 0.3

    if (isPlaying) tRef.current += dt

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'; ctx.fillRect(0, 0, W, H)

    const primary = '#6750A4', accent = '#B3261E', fontSmall = Math.max(10, Math.round(scale * 0.025))

    // --- Coolidge Tube ---
    const tW = scale * 0.5, tH = scale * 0.15
    ctx.strokeStyle = '#958DA5'; ctx.lineWidth = 4
    ctx.beginPath(); ctx.roundRect(cx - tW/2, cy - tH/2, tW, tH, 40); ctx.stroke()
    
    // Anode (Target)
    ctx.fillStyle = '#CAC4D0'; ctx.beginPath()
    ctx.moveTo(cx + tW/4, cy - tH/3); ctx.lineTo(cx + tW/4 + 10, cy - tH/3); ctx.lineTo(cx + tW/4 - 10, cy + tH/3); ctx.lineTo(cx + tW/4 - 20, cy + tH/3); ctx.fill()
    ctx.strokeStyle = '#49454F'; ctx.lineWidth = 1; ctx.stroke()
    
    // Filament
    ctx.strokeStyle = '#F9AB00'; ctx.lineWidth = 3; ctx.beginPath()
    ctx.moveTo(cx - tW/3, cy - 10); ctx.bezierCurveTo(cx-tW/3-10, cy, cx-tW/3-10, cy+10, cx-tW/3, cy+10); ctx.stroke()

    // Electrons
    if (isPlaying) {
      ctx.fillStyle = '#1E88E5'
      for(let i=0; i<8; i++) {
        const offset = (tRef.current * 300 + i * 40) % (tW*0.5)
        ctx.beginPath(); ctx.arc(cx - tW/3 + offset, cy + (Math.sin(offset/10))*5, 3, 0, Math.PI*2); ctx.fill()
      }
      // X-Ray Waves
      ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.globalAlpha = 0.6
      for(let i=0; i<5; i++) {
        const ang = -Math.PI/6 + (Math.random())*Math.PI/3
        const lx = cx + tW/4, ly = cy
        ctx.beginPath(); ctx.moveTo(lx, ly)
        for(let j=0; j<15; j++) {
          ctx.lineTo(lx + Math.cos(ang)*j*10, ly + Math.sin(ang)*j*10 + Math.sin(j*2 - tRef.current*20)*8)
        }
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }

    // --- Spectrum Graph ---
    const gx = W * 0.1, gy = H * 0.9, gw = W * 0.8, gh = scale * 0.35
    ctx.strokeStyle = '#49454F'; ctx.lineWidth = 2; ctx.beginPath()
    ctx.moveTo(gx, gy - gh); ctx.lineTo(gx, gy); ctx.lineTo(gx + gw, gy); ctx.stroke()
    
    // Continuous Spectrum
    const maxL = lambdaMin_pm * 6
    ctx.strokeStyle = primary; ctx.lineWidth = 3; ctx.beginPath()
    for(let l=lambdaMin_pm; l<maxL; l+=0.5) {
      const x = gx + ((l - lambdaMin_pm) / (maxL - lambdaMin_pm)) * gw
      const intensity = (1/lambdaMin_pm - 1/l) / (l*l) * 5e5 * I_ma * Z
      const y = gy - Math.min(gh*0.8, intensity)
      if (l === lambdaMin_pm) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Characteristic Peaks — Moseley's law with Rydberg constant
    // K-alpha (n=2→1): 1/λ = R_H*(Z-1)²*(3/4)  →  λ = 4/(3*R_H*(Z-1)²)
    // K-beta  (n=3→1): 1/λ = R_H*(Z-1)²*(8/9)  →  λ = 9/(8*R_H*(Z-1)²)
    const R_H = 1.097e7 // m^-1 (Rydberg constant)
    const Ka = (4 / (3 * R_H * (Z-1) * (Z-1))) * 1e12 // convert m → pm
    const Kb = (9 / (8 * R_H * (Z-1) * (Z-1))) * 1e12
    const drawPeak = (l: number, label: string) => {
      if (l < lambdaMin_pm || l > maxL) return
      const x = gx + ((l - lambdaMin_pm) / (maxL - lambdaMin_pm)) * gw
      ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x, gy - gh*0.9); ctx.stroke()
      ctx.fillStyle = accent; ctx.font = `italic ${fontSmall-2}px Roboto`; ctx.fillText(label, x + 2, gy - gh*0.9)
    }
    drawPeak(Ka, 'Kα'); drawPeak(Kb, 'Kβ')

    ctx.fillStyle = primary; ctx.font = `${fontSmall}px 'Roboto', sans-serif`; ctx.textAlign='left'
    ctx.fillText('Intensity I(λ) vs Wavelength λ', gx, gy - gh - 10)

    // Info Panel
    const panelW = scale * 0.35
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; ctx.beginPath(); ctx.roundRect(W - panelW - 20, 20, panelW, scale * 0.15, 12); ctx.fill()
    ctx.strokeStyle = '#CAC4D0'; ctx.lineWidth = 1; ctx.stroke()
    ctx.fillStyle = primary; ctx.font = `bold ${Math.max(12, Math.round(scale * 0.035))}px 'Roboto', sans-serif`
    ctx.fillText(`λmin: ${lambdaMin_pm.toFixed(1)} pm`, W - panelW + 10, 50)
    ctx.font = `${fontSmall}px 'Roboto', sans-serif`
    ctx.fillText(`Voltage: ${V_kv} kV`, W - panelW + 10, 75)
    ctx.fillText(`Target Z: ${Z}`, W - panelW + 10, 100)

  }, [V_kv, Z, I_ma, isPlaying])

  return <CanvasEngine {...props} draw={draw} deps={[V_kv, Z, I_ma, isPlaying]} animated />
}