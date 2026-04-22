import { SimProps } from '../types'

export function StubEngine({ type }: SimProps & { type: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-[var(--color-on-surface-variant)]">
      <span className="material-symbols-rounded text-5xl" style={{ fontSize: 48 }}>science</span>
      <p className="text-sm font-medium">{type.replace(/_/g, ' ')}</p>
      <p className="text-xs opacity-60">Simulation coming soon</p>
    </div>
  )
}
