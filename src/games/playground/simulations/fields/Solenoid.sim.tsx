import { useCallback, useRef } from 'react'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'
import { SimProps } from '../../types'

export function SolenoidSim(props: SimProps) {
  const { controls, isPlaying } = props

  const I = controls?.I ?? 5
  const n = controls?.n ?? 500

  const mu0 = 4 * Math.PI * 1e-7
  const B_T = mu0 * n * I
  const B_mT = B_T * 1000

  const tRef = useRef(0)

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    const scale = Math.min(W, H)
    const cx = W / 2, cy = H / 2

    // ---- Time update ----
    if (isPlaying) {
      tRef.current += dt * 2 // speed boost
    }
    const t = tRef.current

    // ---- Background ----
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    const primary = '#6750A4'
    const fieldColor = 'rgba(0, 97, 164, 0.5)'
    const fontSmall = Math.max(10, Math.round(scale * 0.025))

    // ---- Solenoid geometry ----
    const sW = scale * 0.6
    const sH = scale * 0.1
    const loops = 15
    const lStep = sW / loops
    const left = cx - sW / 2

    // =========================
    // ===== FIELD LINES =======
    // =========================

    const fieldStrength = Math.abs(n * I)
    const lineCount = Math.min(8, Math.floor(fieldStrength / 300) + 2)

    ctx.strokeStyle = fieldColor
    ctx.lineWidth = 1.5

    // ---- Inside (uniform field) ----
    for (let j = 0; j < lineCount; j++) {
      const yOff = (j - lineCount / 2) * (scale * 0.02)

      ctx.setLineDash([10, 6])
      ctx.lineDashOffset = -t * fieldStrength * 0.002

      ctx.beginPath()
      ctx.moveTo(left - 20, cy + yOff)
      ctx.lineTo(left + sW + 20, cy + yOff)
      ctx.stroke()
    }

    ctx.setLineDash([])

    // ---- Outside (return loops) ----
    for (let j = 0; j < lineCount; j++) {
      const spread = sH + 20 + j * 15

      ctx.beginPath()
      ctx.ellipse(cx, cy, sW / 2 + 40, spread, 0, 0, Math.PI, true)
      ctx.stroke()

      ctx.beginPath()
      ctx.ellipse(cx, cy, sW / 2 + 40, spread, 0, 0, Math.PI, false)
      ctx.stroke()
    }

    // =========================
    // ===== HELIX (COIL) ======
    // =========================

    // Back wires
    ctx.strokeStyle = '#49454F'
    ctx.lineWidth = 2
    ctx.beginPath()

    for (let i = 0; i < loops; i++) {
      const x = left + i * lStep
      ctx.moveTo(x, cy - sH / 2)
      ctx.lineTo(x + lStep * 0.5, cy + sH / 2)
    }

    ctx.stroke()

    // Front wires + current animation
    ctx.strokeStyle = primary
    ctx.lineWidth = 4
    ctx.beginPath()

    for (let i = 0; i < loops; i++) {
      const x = left + i * lStep

      ctx.moveTo(x + lStep * 0.5, cy + sH / 2)
      ctx.lineTo(x + lStep, cy - sH / 2)

      // moving charge dots
      const dotX = x + lStep * 0.75
      const dotY = cy + Math.sin(t * 5 + i) * sH * 0.4

      ctx.fillStyle = primary
      ctx.beginPath()
      ctx.arc(dotX, dotY, 2.5, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.stroke()

    // =========================
    // ===== INFO PANEL ========
    // =========================

    const panelW = scale * 0.3

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.beginPath()
    ctx.roundRect(W - panelW - 20, 20, panelW, scale * 0.15, 12)
    ctx.fill()

    ctx.strokeStyle = '#CAC4D0'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.fillStyle = primary
    ctx.textAlign = 'left'

    ctx.font = `bold ${Math.max(12, Math.round(scale * 0.035))}px 'Roboto', sans-serif`
    ctx.fillText(`B: ${B_mT.toFixed(3)} mT`, W - panelW + 5, 50)

    ctx.font = `${fontSmall}px 'Roboto', sans-serif`
    ctx.fillText(`Current: ${I} A`, W - panelW + 5, 75)
    ctx.fillText(`n: ${n} turns/m`, W - panelW + 5, 100)

  }, [I, n, B_mT, isPlaying])

  return (
    <CanvasEngine
      {...props}
      draw={draw}
      deps={[I, n, isPlaying]}
      animated
    />
  )
}