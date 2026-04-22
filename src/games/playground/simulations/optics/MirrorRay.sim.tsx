import { useCallback } from 'react'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'
import { SimProps } from '../../types'

// Mirror formula: 1/v + 1/u = 1/f
// Sign convention: distances measured from pole P
// Real object: u negative (in front of mirror)
// Concave mirror: f negative (centre of curvature in front)

export function MirrorRaySim(props: SimProps) {
  const { controls } = props
  const fAbs   = controls['f']    ?? 15   // |focal length| in cm
  const uAbs   = controls['u']    ?? 30   // |object distance| in cm
  const type   = controls['type'] ?? 0    // 0 = concave, 1 = convex

  const f = type === 1 ? +fAbs : -fAbs   // convex: +f, concave: -f
  const u = -uAbs                          // object always in front → negative u

  // Mirror formula: 1/v = 1/f - 1/u
  const vInv = (1 / f) - (1 / u)
  const v = vInv !== 0 ? 1 / vInv : Infinity

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, _dt) => {
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#0d1117'
    ctx.fillRect(0, 0, W, H)

    const SCALE = W / 120          // pixels per cm (120 cm shown)
    const poleX = W * 0.65          // mirror pole x-position
    const axisY = H * 0.5           // principal axis y

    // ── Principal axis ──
    ctx.strokeStyle = '#30363d'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath(); ctx.moveTo(0, axisY); ctx.lineTo(W, axisY); ctx.stroke()
    ctx.setLineDash([])

    // ── Mirror (arc) ──
    const mirrorH = Math.min(H * 0.45, 100)
    ctx.strokeStyle = type === 1 ? '#3B82F6' : '#F43F5E'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(poleX - 8, axisY - mirrorH)
    ctx.quadraticCurveTo(poleX + (type === 1 ? 12 : -12), axisY, poleX - 8, axisY + mirrorH)
    ctx.stroke()

    // Pole label
    ctx.fillStyle = '#8b949e'
    ctx.font = `${Math.max(10, Math.round(W * 0.034))}px Inter, system-ui`
    ctx.fillText('P', poleX + 6, axisY + 18)

    // ── Object arrow ──
    const objX = poleX + u * SCALE       // u is negative, so objX < poleX
    const objH = 55
    if (objX > 20 && objX < poleX) {
      drawArrow(ctx, objX, axisY, objX, axisY - objH, '#4ADE80', 2)
      ctx.fillStyle = '#4ADE80'
      ctx.fillText('O', objX - 14, axisY - objH - 4)
    }

    // ── Image arrow ──
    if (isFinite(v) && Math.abs(v) < 120) {
      const imgX = poleX + v * SCALE
      const m    = v / u                       // magnification
      const imgH = -m * objH                   // negative m → inverted
      const isReal = (type === 0 && v < 0) || (type === 1 && false)
      const clr = isReal ? '#FACC15' : '#A78BFA'
      if (imgX > 14 && imgX < W - 14) {
        drawArrow(ctx, imgX, axisY, imgX, axisY - imgH, clr, 2)
        ctx.fillStyle = clr
        ctx.fillText(isReal ? 'I (real)' : 'I (virt)', imgX + 4, axisY - imgH - 4)
      }
    } else if (!isFinite(v)) {
      ctx.fillStyle = '#FACC15'
      ctx.fillText('Image at ∞', 10, axisY - 60)
    }

    // ── Focal point F ──
    const fX = poleX + f * SCALE
    if (fX > 14 && fX < W - 14) {
      ctx.fillStyle = '#FB923C'
      ctx.beginPath(); ctx.arc(fX, axisY, 4, 0, Math.PI * 2); ctx.fill()
      ctx.fillText('F', fX - 4, axisY + 18)
    }

    // ── Centre of curvature C = 2f ──
    const cX = poleX + 2 * f * SCALE
    if (cX > 14 && cX < W - 14) {
      ctx.fillStyle = '#64748b'
      ctx.beginPath(); ctx.arc(cX, axisY, 3, 0, Math.PI * 2); ctx.fill()
      ctx.fillText('C', cX - 4, axisY + 18)
    }

    // ── Info table ──
    const lines = [
      `${type === 1 ? 'Convex' : 'Concave'} mirror`,
      `f = ${fAbs} cm`,
      `u = −${uAbs} cm`,
      `v = ${isFinite(v) ? v.toFixed(1) : '∞'} cm`,
      `m = ${isFinite(v) ? (v / u).toFixed(2) : '∞'}`,
    ]
    const fs = Math.max(10, Math.round(W * 0.032))
    ctx.fillStyle = '#8b949e'
    ctx.font = `${fs}px Inter, system-ui`
    lines.forEach((l, i) => ctx.fillText(l, 10, 20 + i * (fs + 5)))
  }, [f, u, v, fAbs, uAbs, type])

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
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  // Arrowhead
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const hs = 8
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - hs * Math.cos(angle - 0.4), y2 - hs * Math.sin(angle - 0.4))
  ctx.lineTo(x2 - hs * Math.cos(angle + 0.4), y2 - hs * Math.sin(angle + 0.4))
  ctx.closePath()
  ctx.fill()
}
