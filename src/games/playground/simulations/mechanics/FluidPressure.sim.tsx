import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/**
 * Fluid Pressure & Buoyancy
 * A container of fluid; a block sinks or floats depending on its density vs fluid density.
 * Shows pressure at depth, buoyancy force, weight, and net force.
 */
export function FluidPressureSim(props: SimProps) {
  const { controls, isPlaying } = props
  const rho_fluid = controls['rho_fluid'] ?? 1000  // kg/m³ water
  const rho_obj   = controls['rho_obj']   ?? 800   // kg/m³ object
  const depth_m   = controls['depth']     ?? 1.5   // depth of container (m)
  const g         = 9.81

  const timeRef = useRef(0)
  const blockYRef = useRef(0.1)  // object y fraction from top of fluid surface [0,1]
  const velRef    = useRef(0)

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    const objectH_m  = 0.3   // object height in metres (fixed)
    const objectW_m  = 0.4
    const pixPerM    = Math.min((H * 0.6) / depth_m, 100)

    // ── Physics ──
    const V_obj  = objectH_m * objectW_m * 0.2   // volume (assuming depth 0.2m into page)
    const m_obj  = rho_obj * V_obj
    const W_g    = m_obj * g
    const subFrac = Math.min(1, rho_obj / rho_fluid)  // fraction submerged at equilibrium
    const F_B    = rho_fluid * V_obj * subFrac * g
    const F_net  = F_B - W_g   // positive = floats up

    if (isPlaying) {
      timeRef.current += dt
      const s = blockYRef.current
      const a = F_net / m_obj / pixPerM * 0.5
      velRef.current += a * dt * 60
      velRef.current *= 0.92  // damping
      blockYRef.current = Math.max(0.02, Math.min(0.92, s + velRef.current * dt))
    }

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    // ── Container ──
    const contX  = Math.min(W, H) * (0.15 * 1.5)
    const contW  = Math.min(W, H) * (0.52 * 1.5)
    const contH  = depth_m * pixPerM
    const contY  = H * 0.14

    // Water
    const waterGrad = ctx.createLinearGradient(contX, contY, contX, contY + contH)
    waterGrad.addColorStop(0, '#BFDBFE')
    waterGrad.addColorStop(1, '#1E40AF')
    ctx.fillStyle = waterGrad
    ctx.beginPath(); ctx.roundRect(contX, contY, contW, contH, 4); ctx.fill()

    // Container border
    ctx.strokeStyle = '#1C1B1F'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.roundRect(contX, contY, contW, contH, 4); ctx.stroke()

    // ── Floating / Sinking Object ──
    const objPxH  = objectH_m * pixPerM
    const objPxW  = objectW_m * pixPerM
    const objCx   = contX + contW / 2
    const objY    = contY + blockYRef.current * (contH - objPxH)

    const floats  = rho_obj < rho_fluid
    ctx.fillStyle = floats ? '#F43F5E' : '#6750A4'
    ctx.strokeStyle = '#1C1B1F'
    ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.roundRect(objCx - objPxW / 2, objY, objPxW, objPxH, 4); ctx.fill(); ctx.stroke()

    ctx.fillStyle = '#FFFFFF'
    ctx.font = `bold ${Math.max(9, Math.round(Math.min(W, H) * (0.026 * 1.5)))}px 'Roboto', sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText(`ρ=${rho_obj}`, objCx, objY + objPxH / 2 + 4)

    // Depth ruler on left
    const steps = 5
    for (let i = 0; i <= steps; i++) {
      const frac = i / steps
      const ry   = contY + frac * contH
      const dval = (frac * depth_m).toFixed(1)
      ctx.strokeStyle = '#1C1B1F80'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(contX - 8, ry); ctx.lineTo(contX, ry); ctx.stroke()
      ctx.fillStyle = '#49454F'
      ctx.font = `${Math.max(9, Math.round(Math.min(W, H) * (0.026 * 1.5)))}px 'Roboto', sans-serif`
      ctx.textAlign = 'right'
      ctx.fillText(`${dval}m`, contX - 10, ry + 4)
    }

    // Pressure at object depth
    const objDepth = (blockYRef.current * depth_m) + objectH_m / 2
    const P_gauge  = rho_fluid * g * objDepth
    const P_atm    = 101325
    const P_abs    = P_atm + P_gauge

    // Force arrows on object
    const midY = objY + objPxH / 2
    // Weight (down)
    drawArrow(ctx, objCx - 18, midY, 0, Math.min(40, W_g * 0.8), '#F43F5E', `W=${W_g.toFixed(1)}N`)
    // Buoyancy (up)
    drawArrow(ctx, objCx + 18, midY, 0, -Math.min(40, F_B * 0.8), '#10B981', `Fb=${F_B.toFixed(1)}N`)

    // ── Info Panel (right) ──
    const px  = contX + contW + 16
    const py  = contY
    const fs2 = Math.max(10, Math.round(Math.min(W, H) * (0.028 * 1.5)))
    const pw  = W - px - 4

    const rows = [
      { label: 'ρ_fluid',  value: `${rho_fluid} kg/m³` },
      { label: 'ρ_obj',    value: `${rho_obj} kg/m³` },
      { label: 'P_gauge',  value: `${(P_gauge / 1000).toFixed(2)} kPa` },
      { label: 'P_abs',    value: `${(P_abs / 1000).toFixed(1)} kPa` },
      { label: 'F_B',      value: `${F_B.toFixed(2)} N` },
      { label: 'W',        value: `${W_g.toFixed(2)} N` },
      { label: 'F_net',    value: `${F_net.toFixed(2)} N` },
      { label: floats ? '→ FLOATS' : '→ SINKS', value: '', color: floats ? '#10B981' : '#F43F5E' },
    ]

    ctx.fillStyle = '#F4EFF4'
    ctx.beginPath(); ctx.roundRect(px, py, pw, rows.length * (fs2 + 8) + 14, 10); ctx.fill()

    rows.forEach(({ label, value, color }, i) => {
      const ry = py + 12 + i * (fs2 + 8) + fs2 * 0.85
      ctx.fillStyle = color ?? '#49454F'
      ctx.font = color ? `bold ${fs2}px 'Roboto', sans-serif` : `${fs2}px 'Roboto', sans-serif`
      ctx.textAlign = 'left'
      ctx.fillText(label, px + 8, ry)
      if (value) {
        ctx.fillStyle = '#21005D'
        ctx.font = `bold ${fs2}px 'Roboto', sans-serif`
        ctx.textAlign = 'right'
        ctx.fillText(value, px + pw - 6, ry)
      }
    })
  }, [rho_fluid, rho_obj, depth_m, isPlaying])

  blockYRef.current = 0.1
  velRef.current    = 0
  timeRef.current   = 0

  return <CanvasEngine {...props} draw={draw} deps={[rho_fluid, rho_obj, depth_m, isPlaying]} animated />
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, _dx: number, dy: number,
  color: string, label: string
) {
  ctx.strokeStyle = color
  ctx.fillStyle   = color
  ctx.lineWidth   = 2
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + dy); ctx.stroke()
  // head
  const dir = dy > 0 ? 1 : -1
  ctx.beginPath()
  ctx.moveTo(x, y + dy)
  ctx.lineTo(x - 5, y + dy - dir * 8)
  ctx.lineTo(x + 5, y + dy - dir * 8)
  ctx.closePath(); ctx.fill()
  // label
  ctx.font = `bold ${Math.max(8, 10)}px 'Roboto', sans-serif`
  ctx.textAlign = 'center'
  ctx.fillText(label, x, y + dy + dir * 14)
}
