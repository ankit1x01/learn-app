import { useCallback } from 'react'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'
import { SimProps } from '../../types'

// Lens formula: 1/v - 1/u = 1/f  (using Cartesian sign convention)
// Object always to left → u negative
// Convex lens: f positive
// Concave lens: f negative

export function LensRaySim(props: SimProps) {
  const { controls } = props
  const fAbs = controls['f']    ?? 20   // |focal length| cm
  const uAbs = controls['u']    ?? 40   // |object distance| cm
  const type = controls['type'] ?? 0    // 0 = convex, 1 = concave

  const f = type === 1 ? -fAbs : +fAbs
  const u = -uAbs

  // Lens formula: 1/v = 1/f + 1/u
  const v = 1 / (1 / f + 1 / u)
  const m = v / u      // magnification

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, _dt) => {
    ctx.clearRect(0, 0, W, H)

    ctx.fillStyle = '#0d1117'
    ctx.fillRect(0, 0, W, H)

    const SCALE  = W / 130
    const lensX  = W * 0.5
    const axisY  = H * 0.5
    const lensH  = Math.min(H * 0.42, 90)

    // ── Principal axis ──
    ctx.strokeStyle = '#30363d'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath(); ctx.moveTo(0, axisY); ctx.lineTo(W, axisY); ctx.stroke()
    ctx.setLineDash([])

    // ── Lens ──
    const lensColor = type === 1 ? '#38BDF8' : '#A78BFA'
    ctx.strokeStyle = lensColor
    ctx.lineWidth = 3
    // Convex: biconvex shape; Concave: biconcave
    ctx.beginPath()
    ctx.moveTo(lensX, axisY - lensH)
    ctx.lineTo(lensX, axisY + lensH)
    ctx.stroke()
    // side curves hint
    const bow = type === 1 ? 10 : -10
    ctx.strokeStyle = lensColor + '80'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(lensX, axisY - lensH)
    ctx.quadraticCurveTo(lensX + bow, axisY, lensX, axisY + lensH)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(lensX, axisY - lensH)
    ctx.quadraticCurveTo(lensX - bow, axisY, lensX, axisY + lensH)
    ctx.stroke()

    // ── Object arrow ──
    const objX = lensX + u * SCALE
    const objH = 50
    if (objX > 14) {
      drawArrow(ctx, objX, axisY, objX, axisY - objH, '#4ADE80', 2)
      ctx.fillStyle = '#4ADE80'
      ctx.font = `${Math.round(W * 0.026)}px Inter, system-ui`
      ctx.fillText('O', objX - 12, axisY - objH - 5)
    }

    // ── Rays from object tip ──
    if (isFinite(v) && Math.abs(v) < 130) {
      const imgX = lensX + v * SCALE
      const imgH = -m * objH
      const isReal = v > 0

      // Ray 1: parallel to axis → through F2
      const f2X = lensX + f * SCALE
      ctx.strokeStyle = '#FA8231'
      ctx.lineWidth = 1.2
      ctx.setLineDash([3, 2])
      ctx.beginPath()
      ctx.moveTo(objX, axisY - objH)
      ctx.lineTo(lensX, axisY - objH)
      ctx.lineTo(isReal ? Math.min(imgX, W) : Math.max(imgX, 0), axisY - imgH)
      ctx.stroke()

      // Ray 2: through optical centre (straight)
      ctx.strokeStyle = '#F43F5E'
      ctx.beginPath()
      ctx.moveTo(objX, axisY - objH)
      ctx.lineTo(lensX, axisY)
      ctx.lineTo(isReal ? Math.min(imgX, W) : Math.max(imgX, 0), axisY - imgH)
      ctx.stroke()
      ctx.setLineDash([])

      // ── Image arrow ──
      if (imgX > 14 && imgX < W - 14) {
        const clr = isReal ? '#FACC15' : '#C084FC'
        drawArrow(ctx, imgX, axisY, imgX, axisY - imgH, clr, 2)
        ctx.fillStyle = clr
        ctx.font = `${Math.round(W * 0.026)}px Inter, system-ui`
        ctx.fillText(isReal ? 'I (real)' : 'I (virt)', imgX + 4, axisY - imgH - 5)
      }

      // Focal points
      const fLabelFs = Math.max(10, Math.round(W * 0.032))
      if (f2X > 14 && f2X < W - 14) {
        ctx.fillStyle = '#FB923C'
        ctx.beginPath(); ctx.arc(f2X, axisY, 4, 0, Math.PI * 2); ctx.fill()
        ctx.font = `${fLabelFs}px Inter, system-ui`
        ctx.fillText('F₂', f2X + 5, axisY + 16)
      }
      const f1X = lensX - f * SCALE
      if (f1X > 14 && f1X < W - 14) {
        ctx.fillStyle = '#FB923C'
        ctx.beginPath(); ctx.arc(f1X, axisY, 4, 0, Math.PI * 2); ctx.fill()
        ctx.font = `${fLabelFs}px Inter, system-ui`
        ctx.fillText('F₁', f1X + 5, axisY + 16)
      }
    }

    // ── Info ──
    const lines = [
      `${type === 1 ? 'Concave' : 'Convex'} lens`,
      `f = ${type === 1 ? '-' : '+'}${fAbs} cm`,
      `u = −${uAbs} cm`,
      `v = ${isFinite(v) ? v.toFixed(1) : '∞'} cm`,
      `m = ${isFinite(v) ? m.toFixed(2) : '∞'}`,
    ]
    const fs = Math.max(10, Math.round(W * 0.032))
    ctx.fillStyle = '#8b949e'
    ctx.font = `${fs}px Inter, system-ui`
    ctx.setLineDash([])
    lines.forEach((l, i) => ctx.fillText(l, 8, 20 + i * (fs + 5)))
  }, [f, u, v, m, fAbs, uAbs, type])

  return <CanvasEngine {...props} draw={draw} deps={[f, u, v, type]} />
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  color: string, width: number
) {
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = width
  ctx.setLineDash([])
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const hs = 8
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - hs * Math.cos(angle - 0.4), y2 - hs * Math.sin(angle - 0.4))
  ctx.lineTo(x2 - hs * Math.cos(angle + 0.4), y2 - hs * Math.sin(angle + 0.4))
  ctx.closePath()
  ctx.fill()
}
