import { useCallback } from 'react'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'
import { SimProps } from '../../types'

// YDSE — Young's Double Slit Experiment
// β (fringe width) = λD / d
// y_n = n·λD/d  (bright)
// y_n = (n+0.5)·λD/d (dark)

export function YDSESim(props: SimProps) {
  const { controls } = props
  const d      = (controls['d']  ?? 1.0) * 1e-3   // slit separation mm → m
  const lambda = (controls['lam'] ?? 600) * 1e-9   // wavelength nm → m
  const D      = (controls['D']  ?? 1.5)            // screen distance m

  const beta = lambda * D / d   // fringe width in metres

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, _dt) => {
    ctx.clearRect(0, 0, W, H)

    // --- Background sky ---
    ctx.fillStyle = '#0d0d1a'
    ctx.fillRect(0, 0, W, H)

    const slitX   = Math.min(W, H) * (0.25 * 1.5)
    const screenX = Math.min(W, H) * (0.85 * 1.5)
    const cy      = H / 2

    // --- Slit barrier ---
    ctx.fillStyle = '#3a3a5c'
    ctx.fillRect(slitX - 6, 0, 12, H)
    // slit gaps
    const slitGap = 18
    ctx.clearRect(slitX - 6, cy - slitGap - 4, 12, 8)
    ctx.clearRect(slitX - 6, cy + slitGap - 4, 12, 8)
    ctx.fillStyle = '#0d0d1a'
    ctx.fillRect(slitX - 6, cy - slitGap - 4, 12, 8)
    ctx.fillRect(slitX - 6, cy + slitGap - 4, 12, 8)

    // --- Screen ---
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(screenX, 0, 10, H)

    // --- Intensity pattern on screen ---
    // Determine how many fringes fit in view
    // We map y_pixels to y_metres: scale = beta / 40 (40 px per fringe)
    const pixelsPerFringe = Math.min(80, Math.max(12, (H * 0.35) / 3))
    const metersPerPixel  = beta / pixelsPerFringe

    for (let py = 0; py < H; py++) {
      const yMetre = (py - cy) * metersPerPixel
      // Ideal double-slit intensity: I = I₀ cos²(π·d·y / λD)
      const phase     = (Math.PI * d * yMetre) / (lambda * D)
      const intensity = Math.cos(phase) ** 2

      // Convert wavelength to RGB
      const [r, g, b] = wavelengthToRgb(lambda * 1e9)
      ctx.fillStyle = `rgba(${r},${g},${b},${(intensity * 0.95).toFixed(3)})`
      ctx.fillRect(screenX, py, 10, 1)
    }

    // --- Ray lines from slits ---
    ctx.globalAlpha = 0.12
    const [r, g, b] = wavelengthToRgb(lambda * 1e9)
    ctx.strokeStyle = `rgb(${r},${g},${b})`
    ctx.lineWidth = 1
    for (let py = 0; py < H; py += 4) {
      const yMetre    = (py - cy) * (beta / pixelsPerFringe)
      const phase     = (Math.PI * d * yMetre) / (lambda * D)
      const intensity = Math.cos(phase) ** 2
      if (intensity < 0.5) continue
      // top slit → point
      ctx.beginPath()
      ctx.moveTo(slitX + 6, cy - slitGap)
      ctx.lineTo(screenX, py)
      ctx.stroke()
      // bottom slit → point
      ctx.beginPath()
      ctx.moveTo(slitX + 6, cy + slitGap)
      ctx.lineTo(screenX, py)
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    // --- Labels ---
    const fs = Math.max(10, Math.round(Math.min(W, H) * (0.034 * 1.5)))
    ctx.fillStyle = '#e0ddf6'
    ctx.font = `bold ${fs}px 'Inter', sans-serif`
    ctx.fillText(`λ = ${(lambda * 1e9).toFixed(0)} nm`, 8, fs + 4)
    ctx.fillText(`d = ${(d * 1e3).toFixed(1)} mm`, 8, fs * 2 + 8)
    ctx.fillText(`D = ${D.toFixed(1)} m`, 8, fs * 3 + 12)
    ctx.fillText(`β = ${(beta * 1e3).toFixed(2)} mm`, 8, fs * 4 + 16)

    // fringe markers with order labels (n = -3 to +3)
    const fringeFs = Math.max(9, Math.round(Math.min(W, H) * (0.028 * 1.5)))
    ctx.setLineDash([3, 3])
    ctx.strokeStyle = '#ffffff30'
    ctx.lineWidth = 1
    for (let n = -3; n <= 3; n++) {
      const py = cy + n * pixelsPerFringe
      if (py < 0 || py > H) continue
      ctx.beginPath()
      ctx.moveTo(screenX, py)
      ctx.lineTo(screenX + 10, py)
      ctx.stroke()
      // label ALL orders including n=0 (central bright)
      ctx.fillStyle = n === 0 ? '#ffffffcc' : '#ffffff80'
      ctx.font = `${fringeFs}px 'Inter', sans-serif`
      ctx.fillText(`n=${n}`, screenX + 14, py + 4)
    }
    ctx.setLineDash([])

    // --- Path difference info panel ---
    // At n=1 bright fringe: Δ = λ (by definition)
    const deltaAt1 = lambda  // Δ = d·y₁/D = d·(λD/d)/D = λ
    const panelX = 8, panelY = H - 52, panelW = Math.max(180, W * 0.38), panelH = 44
    ctx.fillStyle = 'rgba(21,10,50,0.72)'
    ctx.beginPath()
    ctx.roundRect(panelX, panelY, panelW, panelH, 6)
    ctx.fill()
    const infoFs = Math.max(9, Math.round(Math.min(W, H) * (0.026 * 1.5)))
    ctx.fillStyle = '#e0ddf6'
    ctx.font = `${infoFs}px 'Inter', sans-serif`
    ctx.textAlign = 'left'
    ctx.fillText(`Path diff  Δ = d·y / D`, panelX + 8, panelY + infoFs + 4)
    ctx.fillStyle = '#a78bfa'
    ctx.fillText(`At n=1:  Δ = λ = ${(deltaAt1 * 1e9).toFixed(0)} nm`, panelX + 8, panelY + infoFs * 2 + 8)
  }, [d, lambda, D, beta])

  return <CanvasEngine {...props} draw={draw} deps={[d, lambda, D]} />
}

// Convert optical wavelength (nm) to RGB
function wavelengthToRgb(nm: number): [number, number, number] {
  if (nm < 380) return [148, 0, 211]
  if (nm < 440) {
    const t = (nm - 380) / 60
    return [Math.round(148 * (1 - t)), 0, 211]
  }
  if (nm < 490) {
    const t = (nm - 440) / 50
    return [0, Math.round(255 * t), 255]
  }
  if (nm < 510) {
    const t = (nm - 490) / 20
    return [0, 255, Math.round(255 * (1 - t))]
  }
  if (nm < 580) {
    const t = (nm - 510) / 70
    return [Math.round(255 * t), 255, 0]
  }
  if (nm < 645) {
    const t = (nm - 580) / 65
    return [255, Math.round(255 * (1 - t)), 0]
  }
  if (nm <= 700) return [255, 0, 0]
  return [255, 0, 0]
}
