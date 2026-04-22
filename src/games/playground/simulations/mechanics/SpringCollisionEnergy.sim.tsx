import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/**
 * Spring + Collision + Energy Simulation
 * Setup: Block m collides with spring k.
 */
export function SpringCollisionEnergySim(props: SimProps) {
  const { controls, isPlaying } = props

  const m = controls?.m ?? 2
  const k = controls?.k ?? 200
  const v0 = controls?.v0 ?? 5

  const posRef    = useRef(-300) // Position relative to spring start
  const velRef    = useRef(v0)
  const initERef  = useRef<number | null>(null) // reference total energy (set on first frame)

  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    const scale = Math.min(W, H)
    const pxPerMeter = 100

    if (!isPlaying) {
      posRef.current = -W * 0.4 // Start from left
      velRef.current = v0
      initERef.current = null   // reset reference energy on pause/reset
    }

    const wallX = W * 0.85
    const baseY = H * 0.65
    const blockSize = scale * 0.12
    const springLen = scale * 0.35

    const springStartX = wallX - springLen
    const blockX = springStartX + posRef.current
    const blockFrontX = blockX + blockSize
    
    // Compression logic
    const compressionPx = Math.max(0, blockFrontX - springStartX)
    const compression = compressionPx / pxPerMeter

    if (isPlaying) {
      // Physics: F = -kx
      const force = -k * compression
      const acceleration = force / m
      
      velRef.current += acceleration * dt
      posRef.current += velRef.current * dt * pxPerMeter

      // Prevent block from going through the wall
      if (blockFrontX > wallX) {
        posRef.current = wallX - blockSize - springStartX
        velRef.current = 0
      }
    }

    // Energies
    const K = 0.5 * m * velRef.current**2
    const U = 0.5 * k * compression**2
    const TotalE = K + U

    // Latch the reference energy on the first playing frame (initial KE)
    if (isPlaying && initERef.current === null && TotalE > 0.001) {
      initERef.current = TotalE
    }
    const E0 = initERef.current ?? Math.max(TotalE, 0.001)
    const barDenom = Math.max(E0, 0.001) // denominator for bar scaling

    // Render
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'
    ctx.fillRect(0, 0, W, H)

    const primary = '#6750A4'
    const error = '#B3261E'
    const fontSmall = Math.max(10, Math.round(scale * 0.025))

    // Wall
    ctx.fillStyle = '#CAC4D0'
    ctx.fillRect(wallX, baseY - scale * 0.2, 12, scale * 0.2 + 8)

    // Floor
    ctx.fillStyle = '#EADDFF'
    ctx.fillRect(0, baseY, W, 8)

    // Spring (Coiled)
    const coils = 12
    const currentSpringLen = wallX - blockFrontX
    const step = currentSpringLen / coils
    
    ctx.strokeStyle = '#958DA5'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(wallX, baseY - blockSize / 2)
    for (let i = 0; i <= coils; i++) {
      const sx = wallX - i * step
      const sy = (baseY - blockSize / 2) + (i % 2 === 0 ? -1 : 1) * (scale * 0.03)
      ctx.lineTo(sx, i === 0 || i === coils ? (baseY - blockSize / 2) : sy)
    }
    ctx.stroke()

    // Block
    ctx.fillStyle = primary
    ctx.beginPath(); ctx.roundRect(blockX, baseY - blockSize, blockSize, blockSize, 6); ctx.fill()
    ctx.fillStyle = '#FFFFFF'
    ctx.font = `bold ${fontSmall}px 'Roboto', sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText('m', blockX + blockSize / 2, baseY - blockSize / 2 + 5)

    // Energy Bars
    const barW    = scale * 0.04
    const barMaxH = scale * 0.2
    const barX    = W * 0.1
    const barY    = H * 0.3
    const totalColor = '#10B981'

    const kH = (K / barDenom) * barMaxH
    const uH = (U / barDenom) * barMaxH
    const tH = Math.min((TotalE / barDenom) * barMaxH, barMaxH) // capped at max height

    // KE bar
    ctx.fillStyle = primary
    ctx.fillRect(barX, barY - kH, barW, kH)
    ctx.textAlign = 'center'
    ctx.font = `bold ${fontSmall}px 'Roboto', sans-serif`
    ctx.fillText('K', barX + barW / 2, barY + 16)

    // PE bar
    ctx.fillStyle = error
    ctx.fillRect(barX + barW * 1.5, barY - uH, barW, uH)
    ctx.fillText('U', barX + barW * 1.5 + barW / 2, barY + 16)

    // Total E bar
    ctx.fillStyle = totalColor
    ctx.fillRect(barX + barW * 3, barY - tH, barW, tH)
    ctx.fillText('E', barX + barW * 3 + barW / 2, barY + 16)

    // Reference line (E0) — shows ideal conservation level
    ctx.strokeStyle = totalColor + 'AA'
    ctx.lineWidth   = 1.5
    ctx.setLineDash([4, 3])
    ctx.beginPath()
    ctx.moveTo(barX - 4, barY - barMaxH)
    ctx.lineTo(barX + barW * 4 + 8, barY - barMaxH)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = totalColor
    ctx.font = `${Math.max(8, fontSmall - 1)}px 'Roboto', sans-serif`
    ctx.textAlign = 'left'
    ctx.fillText('E₀', barX + barW * 4 + 10, barY - barMaxH + 4)

    // Numeric readout panel (bottom-left below bars)
    const numY = barY + 30
    ctx.font = `${fontSmall}px 'Roboto', sans-serif`
    ctx.textAlign = 'left'
    ctx.fillStyle = primary
    ctx.fillText(`KE: ${K.toFixed(2)} J`, barX, numY)
    ctx.fillStyle = error
    ctx.fillText(`PE: ${U.toFixed(2)} J`, barX, numY + fontSmall + 2)
    ctx.fillStyle = totalColor
    ctx.fillText(`Total: ${TotalE.toFixed(2)} J`, barX, numY + (fontSmall + 2) * 2)

    // Vector Force
    if (compression > 0) {
      const fX = blockX
      const fY = baseY - blockSize / 2
      ctx.strokeStyle = '#0061A4'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(fX, fY); ctx.lineTo(fX - 40, fY); ctx.stroke()
      ctx.fillStyle = '#0061A4'
      ctx.beginPath(); ctx.moveTo(fX - 40, fY); ctx.lineTo(fX - 32, fY - 5); ctx.lineTo(fX - 32, fY + 5); ctx.fill()
      ctx.font = `${fontSmall}px 'Roboto', sans-serif`
      ctx.fillText(`F=${(k * compression).toFixed(1)}N`, fX - 20, fY - 10)
    }

    // Info Panel
    const panelW = scale * 0.3
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.beginPath(); ctx.roundRect(W - panelW - 20, 20, panelW, scale * 0.18, 12); ctx.fill()
    ctx.strokeStyle = '#CAC4D0'
    ctx.lineWidth = 1; ctx.stroke()
    ctx.fillStyle = primary
    ctx.textAlign = 'left'
    ctx.font = `bold ${Math.max(12, Math.round(scale * 0.035))}px 'Roboto', sans-serif`
    ctx.fillText(`v: ${velRef.current.toFixed(1)} m/s`, W - panelW + 5, 50)
    ctx.font = `${fontSmall}px 'Roboto', sans-serif`
    ctx.fillText(`x: ${compression.toFixed(2)} m`, W - panelW + 5, 75)
    ctx.fillStyle = totalColor
    ctx.fillText(`Total E: ${TotalE.toFixed(2)} J`, W - panelW + 5, 100)

  }, [m, k, v0, isPlaying])

  return <CanvasEngine {...props} draw={draw} deps={[m, k, v0, isPlaying]} animated />
}