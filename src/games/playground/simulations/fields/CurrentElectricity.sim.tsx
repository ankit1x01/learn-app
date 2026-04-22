import { useCallback } from 'react'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'
import { SimProps } from '../../types'

export function CurrentElectricitySim(props: SimProps) {
  const { controls } = props

  const mode = controls?.mode ?? 'series' // 'series' | 'parallel'
  const R1 = controls?.R1 ?? 2
  const R2 = controls?.R2 ?? 4
  const R3 = controls?.R3 ?? 6
  const V = controls?.V ?? 12

  // ---- Physics ----
  let Req = 0
  let Itotal = 0

  let I1 = 0, I2 = 0, I3 = 0
  let V1 = 0, V2 = 0, V3 = 0

  if (mode === 'series') {
    Req = R1 + R2 + R3
    Itotal = V / Req

    I1 = I2 = I3 = Itotal
    V1 = I1 * R1
    V2 = I2 * R2
    V3 = I3 * R3
  } else {
    Req = 1 / (1 / R1 + 1 / R2 + 1 / R3)
    Itotal = V / Req

    I1 = V / R1
    I2 = V / R2
    I3 = V / R3

    V1 = V2 = V3 = V
  }

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, t) => {
    const scale = Math.min(W, H)

    // ---- Background ----
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    const primary = '#6750A4'
    const wire = '#49454F'
    const active = '#6750A4'
    const font = Math.max(10, scale * 0.025)

    // Normalize speed so animation doesn't explode
    const normSpeed = Math.min(8, 1 + Itotal * 1.5)

    // ---- Helper: animated wire ----
    const drawWire = (x1: number, y1: number, x2: number, y2: number, speedMul = 1) => {
      ctx.strokeStyle = wire
      ctx.lineWidth = 3
      ctx.setLineDash([8, 6])
      ctx.lineDashOffset = -t * normSpeed * speedMul
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
      ctx.setLineDash([])
    }

    // ---- Resistor ----
    const drawResistor = (x: number, y: number, w: number, h: number, label: string) => {
      ctx.fillStyle = primary
      ctx.beginPath()
      ctx.roundRect(x, y, w, h, 4)
      ctx.fill()

      ctx.fillStyle = '#FFFFFF'
      ctx.font = `${font}px sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText(label, x + w / 2, y + h / 2 + 4)
    }

    // ---- Battery ----
    const bx = W * 0.1
    const by = H * 0.5
    ctx.strokeStyle = primary
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(bx, by - 20)
    ctx.lineTo(bx, by + 20)
    ctx.moveTo(bx + 8, by - 12)
    ctx.lineTo(bx + 8, by + 12)
    ctx.stroke()

    ctx.fillStyle = primary
    ctx.font = `${font}px sans-serif`
    ctx.fillText(`${V}V`, bx - 10, by - 30)

    // =========================
    // ===== SERIES MODE =======
    // =========================
    if (mode === 'series') {
      const y = H * 0.5
      const startX = W * 0.2
      const gap = scale * 0.12
      const rw = scale * 0.08
      const rh = scale * 0.05

      drawWire(bx + 20, by, startX, y)

      drawResistor(startX, y - rh / 2, rw, rh, `R1`)
      drawWire(startX + rw, y, startX + rw + gap, y)

      drawResistor(startX + rw + gap, y - rh / 2, rw, rh, `R2`)
      drawWire(startX + 2 * rw + gap, y, startX + 2 * rw + 2 * gap, y)

      drawResistor(startX + 2 * rw + 2 * gap, y - rh / 2, rw, rh, `R3`)
      drawWire(startX + 3 * rw + 2 * gap, y, startX + 3 * rw + 2 * gap + 60, y)

      ctx.fillStyle = primary
      ctx.fillText(`I = ${Itotal.toFixed(2)} A`, startX, y - 50)
    }

    // =========================
    // ===== PARALLEL MODE =====
    // =========================
    else {
      const topY = H * 0.3
      const bottomY = H * 0.7
      const leftX = W * 0.3
      const rightX = W * 0.7

      const rw = scale * 0.08
      const rh = scale * 0.05

      // rails
      drawWire(leftX, topY, leftX, bottomY)
      drawWire(rightX, topY, rightX, bottomY)

      // connect battery
      drawWire(bx + 20, by, leftX, by)
      drawWire(rightX, by, bx + 120, by)

      const branchYs = [topY + 40, (topY + bottomY) / 2, bottomY - 40]
      const currents = [I1, I2, I3]

      const maxI = Math.max(I1, I2, I3, 0.0001)

      branchYs.forEach((y, i) => {
        const speedMul = currents[i] / maxI // split animation

        drawWire(leftX, y, leftX + 40, y, speedMul)

        drawResistor(leftX + 40, y - rh / 2, rw, rh, `R${i + 1}`)

        drawWire(leftX + 40 + rw, y, rightX, y, speedMul)

        ctx.fillStyle = primary
        ctx.fillText(`I${i + 1} = ${currents[i].toFixed(2)} A`, leftX + 50, y - 30)
      })
    }

    // ---- Info Panel ----
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.beginPath()
    ctx.roundRect(W * 0.65, H * 0.1, scale * 0.3, scale * 0.18, 12)
    ctx.fill()

    ctx.strokeStyle = '#CAC4D0'
    ctx.stroke()

    ctx.fillStyle = primary
    ctx.font = `${font}px sans-serif`
    ctx.fillText(`Req = ${Req.toFixed(2)} Ω`, W * 0.67, H * 0.15)
    ctx.fillText(`I_total = ${Itotal.toFixed(2)} A`, W * 0.67, H * 0.18)

  }, [mode, R1, R2, R3, V, Req, Itotal, I1, I2, I3])

  return (
    <CanvasEngine
      {...props}
      draw={draw}
      deps={[mode, R1, R2, R3, V]}
      animated
    />
  )
}