import { useCallback } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/**
 * Prism Dispersion Simulation
 * Accurate Snell's Law implementation for multiple wavelengths.
 */
export function PrismSim(props: SimProps) {
  const { controls } = props

  const nBase = controls?.n ?? 1.5
  const apexDeg = controls?.A ?? 60
  const incidentDeg = controls?.angle ?? 0

  const apex = apexDeg * (Math.PI / 180)
  const angleInc = incidentDeg * (Math.PI / 180)

  const colors = [
    { c: '#EF4444', n: nBase + 0.04 }, // Violet
    { c: '#3B82F6', n: nBase + 0.025 },
    { c: '#10B981', n: nBase + 0.015 },
    { c: '#FACC15', n: nBase + 0.008 },
    { c: '#F97316', n: nBase + 0.003 },
    { c: '#DC2626', n: nBase },       // Red
  ]

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H) => {
    const scale = Math.min(W, H)
    const cx = W * 0.5, cy = H * 0.55
    const size = scale * 0.3

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#121212'
    ctx.fillRect(0, 0, W, H)

    // Helper: Ray-Line Intersection
    const getIntersection = (p1: any, p2: any, rayStart: any, rayDir: any) => {
      const x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y
      const x3 = rayStart.x, y3 = rayStart.y, x4 = rayStart.x + rayDir.x, y4 = rayStart.y + rayDir.y

      const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
      if (den === 0) return null

      const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den
      const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den

      if (t >= 0 && t <= 1 && u >= 0) {
        return { x: x1 + t * (x2 - x1), y: y1 + t * (y2 - y1), dist: u }
      }
      return null
    }

    // Normalise angle to (-π, π]
    const normalizeAngle = (a: number) => {
      while (a > Math.PI)  a -= 2 * Math.PI
      while (a <= -Math.PI) a += 2 * Math.PI
      return a
    }

    // Compute refracted ray angle using Snell's law with correct normal handling.
    // nAngle: outward face normal direction (radians, from +x axis).
    // rayAngle: incoming ray direction.
    // n1, n2: refractive indices (source → destination medium).
    // Returns { refracted: number } or { tir: true, reflected: number }.
    const snell = (rayAngle: number, nAngle: number, n1: number, n2: number) => {
      // Angle of incidence: angle between reversed ray and outward normal.
      // Reversed ray direction = rayAngle + π.
      const theta1 = Math.abs(normalizeAngle(normalizeAngle(rayAngle + Math.PI) - nAngle))
      const clampedTheta1 = Math.min(theta1, Math.PI / 2)

      const sinTheta2 = n1 * Math.sin(clampedTheta1) / n2
      if (Math.abs(sinTheta2) > 1) {
        // Total internal reflection: reflect ray about the inward normal.
        // Inward normal direction = nAngle + π.
        const inwardNormal = nAngle + Math.PI
        const reflected = normalizeAngle(2 * inwardNormal - rayAngle)
        return { tir: true as const, reflected }
      }

      const theta2 = Math.asin(sinTheta2)

      // Determine which side of the normal the incident ray came from,
      // so the refracted ray bends to the same side.
      const incidentSide = normalizeAngle(normalizeAngle(rayAngle + Math.PI) - nAngle)
      const sign = incidentSide >= 0 ? 1 : -1

      // Refracted ray goes in the direction of the inward normal rotated by θ2
      // on the same side as the incident ray.
      const inwardNormal = nAngle + Math.PI
      const refracted = normalizeAngle(inwardNormal + sign * theta2)
      return { tir: false as const, refracted }
    }

    // Prism geometry
    const pTop = { x: cx, y: cy - size * 0.6 }
    const halfBase = size * Math.tan(apex / 2)
    const pL = { x: cx - halfBase, y: cy + size * 0.4 }
    const pR = { x: cx + halfBase, y: cy + size * 0.4 }

    // Outward face normals (pointing away from the prism interior).
    // Left face (pTop→pL): face runs top-right to bottom-left.
    //   Face direction vector: (pL.x-pTop.x, pL.y-pTop.y).
    //   Outward normal (rotate face dir -90°, i.e. pointing left/outward).
    const leftFaceAngle = Math.atan2(pL.y - pTop.y, pL.x - pTop.x)
    const leftNormal  = leftFaceAngle - Math.PI / 2   // outward (left side)

    // Right face (pTop→pR): face runs top-left to bottom-right.
    //   Outward normal (rotate face dir +90°, i.e. pointing right/outward).
    const rightFaceAngle = Math.atan2(pR.y - pTop.y, pR.x - pTop.x)
    const rightNormal = rightFaceAngle + Math.PI / 2  // outward (right side)

    // Draw Prism
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(pTop.x, pTop.y); ctx.lineTo(pL.x, pL.y); ctx.lineTo(pR.x, pR.y); ctx.closePath(); ctx.stroke()
    ctx.fillStyle = 'rgba(103, 80, 164, 0.15)'; ctx.fill()

    // Ray start: horizontal ray from the left
    const rayStart = { x: cx - scale * 0.4, y: cy }
    const rayAngle0 = angleInc   // ray direction in radians from +x axis
    const rayDir = { x: Math.cos(rayAngle0), y: Math.sin(rayAngle0) }

    // Find first hit on left face
    const hit1 = getIntersection(pTop, pL, rayStart, rayDir)

    if (hit1) {
      // Incident ray
      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 3
      ctx.beginPath(); ctx.moveTo(rayStart.x, rayStart.y); ctx.lineTo(hit1.x, hit1.y); ctx.stroke()

      colors.forEach(col => {
        // Entry: air (n=1) → glass (n=col.n) at left face.
        // The outward normal of the left face points outward (into air, toward incident ray),
        // so n1=1 (air), n2=col.n (glass).
        const entry = snell(rayAngle0, leftNormal, 1, col.n)

        if (entry.tir) return  // shouldn't happen on entry from air, but guard anyway

        const dirInside = entry.refracted
        const dirVecInside = { x: Math.cos(dirInside), y: Math.sin(dirInside) }

        // Find second hit on right face
        const hit2 = getIntersection(pTop, pR, hit1, dirVecInside)
        if (!hit2) return

        ctx.strokeStyle = col.c; ctx.lineWidth = 2
        ctx.beginPath(); ctx.moveTo(hit1!.x, hit1!.y); ctx.lineTo(hit2.x, hit2.y); ctx.stroke()

        // Exit: glass (n=col.n) → air (n=1) at right face.
        // Outward normal of the right face points outward (into air, away from prism).
        const exit = snell(dirInside, rightNormal, col.n, 1)

        if (exit.tir) {
          // TIR: draw reflected ray inside the prism to base
          const reflDir = { x: Math.cos(exit.reflected), y: Math.sin(exit.reflected) }
          const hit3 = getIntersection(pL, pR, hit2, reflDir)
          ctx.strokeStyle = col.c
          ctx.setLineDash([4, 4])
          ctx.beginPath(); ctx.moveTo(hit2.x, hit2.y)
          if (hit3) {
            ctx.lineTo(hit3.x, hit3.y)
          } else {
            ctx.lineTo(hit2.x + reflDir.x * 300, hit2.y + reflDir.y * 300)
          }
          ctx.stroke()
          ctx.setLineDash([])
          return
        }

        const dirExit = exit.refracted
        ctx.beginPath(); ctx.moveTo(hit2.x, hit2.y)
        ctx.lineTo(hit2.x + Math.cos(dirExit) * 600, hit2.y + Math.sin(dirExit) * 600)
        ctx.stroke()
      })
    }

    // UI Labels
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'left'
    ctx.font = `bold ${Math.max(14, scale * 0.035)}px 'Roboto', sans-serif`
    ctx.fillText('Prism Dispersion', 24, 48)
    ctx.font = `${Math.max(11, scale * 0.025)}px 'Roboto', sans-serif`
    ctx.fillText(`n: ${nBase.toFixed(2)}`, 24, 76)
    ctx.fillText(`Apex: ${apexDeg}°`, 24, 100)

  }, [nBase, apex, angleInc, apexDeg])

  return <CanvasEngine {...props} draw={draw} deps={[nBase, apex, angleInc]} animated />
}
