import { useCallback } from 'react'
import { SimProps } from '../types'
import { CanvasEngine, CanvasEngineProps } from '../engines/CanvasEngine'

function SimpleSim({ title, simProps, formula }: { title: string, simProps: SimProps, formula: string }) {
  const controls = simProps.controls
  const draw = useCallback<CanvasEngineProps['draw']>((ctx, W, H) => {
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFBFE'; ctx.fillRect(0, 0, W, H)
    const fs = Math.max(12, Math.round(Math.min(W, H) * (0.03 * 1.5)))
    ctx.fillStyle = '#6750A4'; ctx.font = `bold ${fs + 4}px 'Roboto', sans-serif`; ctx.textAlign = 'center'
    ctx.fillText(title, W / 2, H / 2 - 20)
    ctx.fillStyle = '#49454F'; ctx.font = `${fs}px 'Roboto', sans-serif`
    ctx.fillText(formula, W / 2, H / 2 + 20)
    
    // Draw some params
    let y = H / 2 + 60
    ctx.font = `${Math.max(10, fs - 2)}px 'Roboto', sans-serif`
    for (const [k, v] of Object.entries(controls)) {
      ctx.fillText(`${k} = ${v}`, W / 2, y)
      y += 24
    }
  }, [title, controls, formula])
  return <CanvasEngine {...simProps} draw={draw} deps={[controls]} />
}

export const WheatstoneBridgeSim = (props: SimProps) => <SimpleSim title="Wheatstone Bridge" simProps={props} formula="P/Q = R/Rx" />
export const CurrentElectricitySim = (props: SimProps) => <SimpleSim title="Current Electricity" simProps={props} formula="V = IR" />
export const MagneticForceSim = (props: SimProps) => <SimpleSim title="Magnetic Force" simProps={props} formula="F = q(v × B)" />
export const PrismSim = (props: SimProps) => <SimpleSim title="Prism Dispersion" simProps={props} formula="n = sin((A+Dm)/2) / sin(A/2)" />
export const SelfInductanceSim = (props: SimProps) => <SimpleSim title="Self Inductance" simProps={props} formula="ε = -L(dI/dt)" />
export const MutualInductanceSim = (props: SimProps) => <SimpleSim title="Mutual Inductance" simProps={props} formula="ε_2 = -M(dI_1/dt)" />
export const BiotSavartSim = (props: SimProps) => <SimpleSim title="Biot-Savart Law" simProps={props} formula="dB = (μ₀/4π) * (I dl × r) / r³" />
export const SolenoidSim = (props: SimProps) => <SimpleSim title="Solenoid" simProps={props} formula="B = μ₀nI" />
export const ForceCurrentWireSim = (props: SimProps) => <SimpleSim title="Force on Current Wire" simProps={props} formula="F = I(L × B)" />
export const MagneticDipoleSim = (props: SimProps) => <SimpleSim title="Magnetic Dipole" simProps={props} formula="τ = m × B" />
export const EMWaveSim = (props: SimProps) => <SimpleSim title="Electromagnetic Wave" simProps={props} formula="c = 1 / √(μ₀ε₀)" />
export const NuclearDecaySim = (props: SimProps) => <SimpleSim title="Nuclear Decay" simProps={props} formula="N(t) = N₀e^(-λt)" />
export const XRaySim = (props: SimProps) => <SimpleSim title="X-Ray Production" simProps={props} formula="λ_min = hc / eV" />
export const DeBroglieSim = (props: SimProps) => <SimpleSim title="de Broglie Wavelength" simProps={props} formula="λ = h / p" />
export const BlockPulleyFrictionSim = (props: SimProps) => <SimpleSim title="Block Pulley Friction" simProps={props} formula="T - f = ma" />
export const ChargedEMFieldSim = (props: SimProps) => <SimpleSim title="Charged Particle in E & B Field" simProps={props} formula="F = q(E + v × B)" />
export const SpringCollisionEnergySim = (props: SimProps) => <SimpleSim title="Spring Collision Energy" simProps={props} formula="1/2mv² = 1/2kx²" />


