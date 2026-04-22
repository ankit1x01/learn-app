import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/**
 * Magnetic Dipole Simulation
 * Visualizes torque and oscillation of a magnetic dipole in a uniform B-field.
 */
export function MagneticDipoleSim(props: SimProps) {
  const { controls, isPlaying } = props

  const m = controls?.m ?? 5
  const B = controls?.B ?? 0.2
  const theta0_deg = controls?.theta ?? 30
  const theta0 = (theta0_deg * Math.PI) / 180

  const thetaRef = useRef(theta0)
  const omegaRef = useRef(0)
  const tRef = useRef(0)
  const graphPoints = useRef<{t: number, U: number}[]>([])

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    const scale = Math.min(W, H)
    const cx = W / 2, cy = H / 2

    if (isPlaying) {
      tRef.current += dt
      // Physics: Torque = -m * B * sin(theta)
      // alpha = torque / I (assuming I=1)
      const torque = -m * B * Math.sin(thetaRef.current)
      const damping = -0.15 * omegaRef.current // Add slight damping
      const alpha = (torque + damping)
      
      omegaRef.current += alpha * dt
      thetaRef.current += omegaRef.current * dt

      if (graphPoints.current.length === 0 || tRef.current - graphPoints.current[graphPoints.current.length-1].t > 0.05) {
        graphPoints.current.push({ t: tRef.current, U: -m * B * Math.cos(thetaRef.current) })
        if (graphPoints.current.length > 200) graphPoints.current.shift()
      }
    } else {
      thetaRef.current = theta0
      omegaRef.current = 0
      tRef.current = 0
      graphPoints.current = []
    }

    const currentTheta = thetaRef.current
    const U = -m * B * Math.cos(currentTheta)
    const torque = m * B * Math.sin(currentTheta)

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    const primary = '#6750A4'
    const north = '#B3261E'
    const south = '#1E88E5'
    const fontSmall = Math.max(10, Math.round(scale * 0.025))

    // --- External B-Field (Background Arrows) ---
    ctx.strokeStyle = 'rgba(0, 97, 164, 0.15)'; ctx.lineWidth = 1
    const grid = scale * 0.1
    for(let x=grid/2; x<W; x+=grid) {
      for(let y=grid/2; y<H; y+=grid) {
        ctx.beginPath(); ctx.moveTo(x-10, y); ctx.lineTo(x+10, y)
        ctx.lineTo(x+6, y-3); ctx.moveTo(x+10, y); ctx.lineTo(x+6, y+3); ctx.stroke()
      }
    }

    // --- Magnet Rendering ---
    const mL = scale * 0.3, mW = scale * 0.06
    ctx.save()
    ctx.translate(cx, cy); ctx.rotate(currentTheta)
    
    // Draw Bar with Rounded Ends
    ctx.beginPath(); ctx.roundRect(-mL/2, -mW/2, mL, mW, mW/2); ctx.clip()
    
    // North Half
    ctx.fillStyle = north; ctx.fillRect(0, -mW/2, mL/2, mW)
    ctx.fillStyle = '#FFFFFF'; ctx.font = `bold ${mW*0.6}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText('N', mL/4, mW*0.2)
    
    // South Half
    ctx.fillStyle = south; ctx.fillRect(-mL/2, -mW/2, mL/2, mW)
    ctx.fillStyle = '#FFFFFF'; ctx.fillText('S', -mL/4, mW*0.2)
    
    ctx.restore()

    // --- Potential Energy Graph ---
    const gx = W * 0.1, gy = H * 0.85
    const gw = W * 0.8, gh = scale * 0.25
    ctx.strokeStyle = '#CAC4D0'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(gx, gy - gh/2); ctx.lineTo(gx + gw, gy - gh/2) // Zero line
    ctx.moveTo(gx, gy - gh); ctx.lineTo(gx, gy); ctx.lineTo(gx + gw, gy); ctx.stroke()

    if (graphPoints.current.length > 1) {
      ctx.strokeStyle = primary; ctx.lineWidth = 2; ctx.beginPath()
      const maxU = Math.max(m * B, 0.1)
      graphPoints.current.forEach((p, i) => {
        const x = gx + (i / 200) * gw
        const y = gy - gh/2 - (p.U / maxU) * (gh/2)
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      }); ctx.stroke()
    }
    ctx.fillStyle = primary; ctx.font = `${fontSmall}px 'Roboto', sans-serif`; ctx.textAlign = 'left'
    ctx.fillText('Potential Energy U(θ)', gx, gy - gh - 5)

    // Info Panel
    const panelW = scale * 0.32
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.beginPath(); ctx.roundRect(W - panelW - 20, 20, panelW, scale * 0.15, 12); ctx.fill()
    ctx.strokeStyle = '#CAC4D0'; ctx.lineWidth = 1; ctx.stroke()
    ctx.fillStyle = primary; ctx.textAlign = 'left'
    ctx.font = `bold ${Math.max(12, Math.round(scale * 0.035))}px 'Roboto', sans-serif`
    ctx.fillText(`τ: ${torque.toFixed(2)} Nm`, W - panelW + 10, 50)
    ctx.font = `${fontSmall}px 'Roboto', sans-serif`
    ctx.fillText(`U: ${U.toFixed(2)} J`, W - panelW + 10, 75)
    ctx.fillText(`θ: ${(currentTheta * 180 / Math.PI).toFixed(1)}°`, W - panelW + 10, 100)

  }, [m, B, theta0, isPlaying])

  return <CanvasEngine {...props} draw={draw} deps={[m, B, theta0, isPlaying]} animated />
}