import { useCallback } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/** Heat Transfer — shows Conduction, Convection, Radiation side by side with live Q readouts */
export function HeatTransferSim(props: SimProps) {
  const { controls } = props
  const T_hot  = controls['T_hot']  ?? 200  // °C
  const T_cold = controls['T_cold'] ?? 25   // °C
  const k      = controls['k']      ?? 50   // W/(m·K) thermal conductivity
  const A      = controls['A']      ?? 0.01 // m² cross-section
  const L      = controls['L']      ?? 0.1  // m length (conduction)

  const dT = T_hot - T_cold
  // Fourier: Q/t = kA·ΔT/L
  const Q_cond = k * A * dT / L
  // Newton cooling (h=25 W/m²K): Q/t = hA·ΔT
  const Q_conv = 25 * A * dT
  // Stefan-Boltzmann (ε=0.9): Q = εσA(T_h⁴-T_c⁴)
  const sigma = 5.67e-8
  const Q_rad  = 0.9 * sigma * A * (Math.pow(T_hot + 273, 4) - Math.pow(T_cold + 273, 4))

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H) => {
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'; ctx.fillRect(0, 0, W, H)

    const fs = Math.max(9, Math.round(Math.min(W, H) * (0.026 * 1.5)))
    const colW = W / 3
    const panels = [
      { title: 'Conduction', formula: 'Q = kAΔT/L', Q: Q_cond, unit: 'W', color: '#F43F5E', icon: '≡' },
      { title: 'Convection', formula: 'Q = hAΔT',   Q: Q_conv, unit: 'W', color: '#F59E0B', icon: '⟳' },
      { title: 'Radiation',  formula: 'Q = εσA(T₁⁴−T₂⁴)', Q: Q_rad, unit: 'W', color: '#6750A4', icon: '☀' },
    ]

    panels.forEach(({ title, formula, Q, unit, color, icon }, i) => {
      const px = i * colW + 8, pw = colW - 16

      // Panel bg
      ctx.fillStyle = color + '18'
      ctx.beginPath(); ctx.roundRect(px, 12, pw, H - 24, 10); ctx.fill()
      ctx.strokeStyle = color; ctx.lineWidth = 2
      ctx.beginPath(); ctx.roundRect(px, 12, pw, H - 24, 10); ctx.stroke()

      // Title
      ctx.fillStyle = color; ctx.font = `bold ${fs + 2}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
      ctx.fillText(`${icon} ${title}`, px + pw / 2, 36)

      // Visualisation
      const midX = px + pw / 2, midY = H * 0.42

      if (i === 0) {
        // Rod with temperature gradient
        const rodW = pw * 0.7, rodH = 22
        const grad = ctx.createLinearGradient(midX - rodW / 2, 0, midX + rodW / 2, 0)
        grad.addColorStop(0, '#F43F5E')
        grad.addColorStop(1, '#3B82F6')
        ctx.fillStyle = grad
        ctx.beginPath(); ctx.roundRect(midX - rodW / 2, midY - rodH / 2, rodW, rodH, 4); ctx.fill()
        // Arrows along rod
        for (let j = 1; j <= 4; j++) {
          const ax = midX - rodW / 2 + (j / 5) * rodW
          ctx.strokeStyle = '#FFFFFF80'; ctx.lineWidth = 1.5
          ctx.beginPath(); ctx.moveTo(ax - 8, midY); ctx.lineTo(ax + 8, midY); ctx.stroke()
          ctx.fillStyle = '#FFFFFF80'
          ctx.beginPath(); ctx.moveTo(ax + 8, midY); ctx.lineTo(ax + 2, midY - 4); ctx.lineTo(ax + 2, midY + 4); ctx.closePath(); ctx.fill()
        }
        ctx.fillStyle = '#F43F5E'; ctx.font = `${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
        ctx.fillText(`${T_hot}°C`, midX - rodW / 2, midY + 28)
        ctx.fillStyle = '#3B82F6'
        ctx.fillText(`${T_cold}°C`, midX + rodW / 2, midY + 28)
      } else if (i === 1) {
        // Convection loops
        const cx2 = midX, cy2 = midY
        for (let j = 0; j < 3; j++) {
          const offset = (j - 1) * 28
          ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 2
          ctx.beginPath()
          ctx.ellipse(cx2 + offset, cy2, 10, 28, 0, Math.PI * 0.1, Math.PI * 1.9)
          ctx.stroke()
          // Arrow
          ctx.fillStyle = '#F59E0B'
          ctx.beginPath()
          ctx.moveTo(cx2 + offset, cy2 - 28)
          ctx.lineTo(cx2 + offset - 5, cy2 - 20)
          ctx.lineTo(cx2 + offset + 5, cy2 - 20)
          ctx.closePath(); ctx.fill()
        }
        ctx.fillStyle = '#F43F5E'; ctx.font = `${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
        ctx.fillText(`Hot ${T_hot}°C`, cx2, cy2 + 44)
      } else {
        // Radiation waves
        const sunX = midX, sunY = midY - 20
        ctx.fillStyle = '#F59E0B'
        ctx.beginPath(); ctx.arc(sunX, sunY, 14, 0, Math.PI * 2); ctx.fill()
        for (let j = 0; j < 8; j++) {
          const angle = (j / 8) * Math.PI * 2
          ctx.strokeStyle = '#F59E0B80'; ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(sunX + 16 * Math.cos(angle), sunY + 16 * Math.sin(angle))
          ctx.lineTo(sunX + 26 * Math.cos(angle), sunY + 26 * Math.sin(angle))
          ctx.stroke()
        }
        // Wavy lines going down
        ctx.strokeStyle = '#6750A4'; ctx.lineWidth = 1.5
        for (let j = -2; j <= 2; j++) {
          ctx.beginPath()
          for (let step = 0; step <= 20; step++) {
            const wx = midX + j * 10 + Math.sin(step * 0.5) * 5
            const wy = midY + step * 2.5
            step === 0 ? ctx.moveTo(wx, wy) : ctx.lineTo(wx, wy)
          }
          ctx.stroke()
        }
      }

      // Formula
      ctx.fillStyle = '#49454F'; ctx.font = `${fs - 1}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
      ctx.fillText(formula, px + pw / 2, H * 0.72)

      // Q value
      const qStr = Q > 1000 ? `${(Q / 1000).toFixed(2)} k${unit}` : `${Q.toFixed(2)} ${unit}`
      ctx.fillStyle = color; ctx.font = `bold ${fs + 2}px 'Roboto', sans-serif`
      ctx.fillText(qStr, px + pw / 2, H * 0.84)
      ctx.fillStyle = '#49454F'; ctx.font = `${fs}px 'Roboto', sans-serif`
      ctx.fillText('heat rate', px + pw / 2, H * 0.84 + fs + 4)
    })

    // Bottom bar
    ctx.fillStyle = '#EADDFF'
    ctx.beginPath(); ctx.roundRect(8, H - 28, W - 16, 22, 6); ctx.fill()
    ctx.fillStyle = '#21005D'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(`ΔT = ${dT}°C   |   A = ${A} m²   |   L = ${L} m   |   k = ${k} W/mK`, W / 2, H - 12)
  }, [T_hot, T_cold, k, A, L, dT, Q_cond, Q_conv, Q_rad])

  return <CanvasEngine {...props} draw={draw} deps={[T_hot, T_cold, k, A, L]} />
}
