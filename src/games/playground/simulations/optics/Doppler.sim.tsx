import { useCallback, useRef } from 'react'
import { SimProps } from '../../types'
import { CanvasEngine, CanvasEngineProps } from '../../engines/CanvasEngine'

/** Doppler Effect — moving source/observer with live frequency shift */
export function DopplerSim(props: SimProps) {
  const { controls, isPlaying } = props
  const f0   = controls['f0']   ?? 440    // Hz source freq
  const vs   = controls['vs']   ?? 30     // m/s source velocity
  const v_sound = controls['v_sound'] ?? 340  // m/s sound speed

  const f_obs_approach = f0 * v_sound / (v_sound - vs)
  const f_obs_recede   = f0 * v_sound / (v_sound + vs)

  const timeRef   = useRef(0)
  const srcXRef   = useRef<number | null>(null) // initialised to W*0.1 on first draw

  // SCALE: pixels per metre for the simulation.
  // Canvas is treated as representing a ~340 m wide scene so that 1 period of
  // the wavefront (λ = v_sound / f0 ≈ 0.77 m at 440 Hz) is clearly visible.
  // We map the canvas normalised x ∈ [0,1] to 340 m, giving SCALE = W / 340.
  // Computed inside draw because W is not available outside.
  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H, dt) => {
    // dt from CanvasEngine is in milliseconds; convert to seconds.
    const dt_s = dt / 1000
    // SCALE: pixels per metre (so v_sound pixels/s = v_sound_pps).
    const SCALE = W / 340            // ~1 pixel per metre at 340px wide
    const v_sound_pps = v_sound * SCALE   // pixels per second
    const vs_pps      = vs      * SCALE   // pixels per second

    // Initialise source position in pixels on first draw
    if (srcXRef.current === null) srcXRef.current = W * 0.1

    if (isPlaying) {
      timeRef.current += dt_s
      srcXRef.current += vs_pps * dt_s   // move source in pixels
      if (srcXRef.current > W * 1.1) srcXRef.current = -W * 0.1
    }
    const t  = timeRef.current
    const sx = srcXRef.current        // already in pixels

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'; ctx.fillRect(0, 0, W, H)
    const cy = H / 2, fs = Math.max(10, Math.round(Math.min(W, H) * (0.028 * 1.5)))

    // Source (car)
    ctx.fillStyle = '#6750A4'
    ctx.beginPath(); ctx.roundRect(sx - 20, cy - 14, 40, 28, 6); ctx.fill()
    ctx.fillStyle = '#F43F5E'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText('🔊', sx, cy + 6)

    // Sound wavefronts (circles emanating from source, compressed in front)
    // srcEmitX: source was vs_pps pixels/s earlier, so at emission time i/f0 seconds ago
    //   it was at srcXRef.current - vs_pps * (i/f0) pixels.
    // radius: wavefront has been expanding at v_sound_pps pixels/s for (t - tEmit) seconds.
    const nWaves = 6
    for (let i = 1; i <= nWaves; i++) {
      const tEmit = t - i * (1 / f0)
      if (tEmit < 0) continue
      const srcEmitX = srcXRef.current - vs_pps * (i / f0)   // pixels
      const radius   = (t - tEmit) * v_sound_pps              // pixels
      ctx.strokeStyle = `rgba(99,102,241,${(nWaves - i + 1) / nWaves * 0.6})`
      ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.arc(srcEmitX, cy, Math.max(2, radius), 0, Math.PI * 2); ctx.stroke()
    }

    // Observer (left)
    const obsX = Math.min(W, H) * (0.1 * 1.5)
    ctx.fillStyle = '#F59E0B'
    ctx.beginPath(); ctx.arc(obsX, cy, 14, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#FFF'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText('👂', obsX, cy + 6)

    // Observer (right)
    const obsX2 = Math.min(W, H) * (0.9 * 1.5)
    ctx.fillStyle = '#10B981'
    ctx.beginPath(); ctx.arc(obsX2, cy, 14, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#FFF'; ctx.fillText('👂', obsX2, cy + 6)

    // Labels
    ctx.fillStyle = '#F59E0B'; ctx.font = `bold ${fs}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(`f_obs = ${f_obs_approach.toFixed(1)} Hz`, obsX, cy - 28)
    ctx.fillText('(approaching)', obsX, cy - 14)
    ctx.fillStyle = '#10B981'
    ctx.fillText(`f_obs = ${f_obs_recede.toFixed(1)} Hz`, obsX2, cy - 28)
    ctx.fillText('(receding)', obsX2, cy - 14)

    // Source info
    ctx.fillStyle = '#6750A4'; ctx.font = `${fs}px 'Roboto', sans-serif`
    ctx.fillText(`f₀=${f0}Hz  v_s=${vs}m/s`, sx, cy + 30)

    // Direction arrow
    ctx.strokeStyle = '#F43F5E'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(sx + 20, cy); ctx.lineTo(sx + 40, cy); ctx.stroke()
    ctx.fillStyle = '#F43F5E'
    ctx.beginPath(); ctx.moveTo(sx + 40, cy); ctx.lineTo(sx + 32, cy - 5); ctx.lineTo(sx + 32, cy + 5); ctx.closePath(); ctx.fill()

    // Formula bar
    ctx.fillStyle = '#EADDFF'
    ctx.beginPath(); ctx.roundRect(8, H - 30, W - 16, 24, 6); ctx.fill()
    ctx.fillStyle = '#21005D'; ctx.font = `bold ${Math.max(9, fs - 1)}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(`f_obs = f₀·v/(v∓v_s)  |  approach: ${f_obs_approach.toFixed(1)} Hz  |  recede: ${f_obs_recede.toFixed(1)} Hz`, W / 2, H - 14)
  }, [f0, vs, v_sound, f_obs_approach, f_obs_recede, isPlaying])

  timeRef.current = 0; srcXRef.current = null  // reset to pixel-init on next draw
  return <CanvasEngine {...props} draw={draw} deps={[f0, vs, v_sound, isPlaying]} animated />
}
