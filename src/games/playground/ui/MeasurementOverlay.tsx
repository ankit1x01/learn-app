interface Measurement {
  label: string
  value: string
  color?: string
}

interface Props {
  measurements: Measurement[]
  visible: boolean
}

export function MeasurementOverlay({ measurements, visible }: Props) {
  if (!visible || measurements.length === 0) return null
  return (
    <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
      {measurements.map((m, i) => (
        <div
          key={i}
          className="flex items-center gap-1.5 bg-[var(--color-surface)]/90 px-2 py-1 rounded-[var(--radius-m3-sm)]"
          style={{ boxShadow: 'var(--shadow-elevation-1)' }}
        >
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: m.color ?? 'var(--color-primary)' }}
          />
          <span className="text-[11px] font-medium text-[var(--color-on-surface)]">
            {m.label}: <span className="text-[var(--color-primary)]">{m.value}</span>
          </span>
        </div>
      ))}
    </div>
  )
}
