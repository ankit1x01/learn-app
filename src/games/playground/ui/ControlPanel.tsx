import { ControlDef } from '../types'

interface Props {
  controls: ControlDef[]
  values: Record<string, number>
  onChange: (id: string, value: number) => void
  disabled?: boolean
}

export function ControlPanel({ controls, values, onChange, disabled }: Props) {
  return (
    <div className="flex flex-col gap-3 px-4 py-3 bg-[var(--color-surface-container)] rounded-[var(--radius-m3-lg)]">
      {controls.map(ctrl => (
        <div key={ctrl.id} className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-[var(--color-on-surface-variant)]">
              {ctrl.label}
            </span>
            <span className="text-xs font-bold text-[var(--color-primary)] min-w-[52px] text-right">
              {values[ctrl.id]?.toFixed(ctrl.step < 1 ? 2 : 0)} {ctrl.unit}
            </span>
          </div>
          <input
            type="range"
            min={ctrl.min}
            max={ctrl.max}
            step={ctrl.step}
            value={values[ctrl.id] ?? ctrl.default}
            disabled={disabled}
            onChange={e => onChange(ctrl.id, parseFloat(e.target.value))}
            className="w-full accent-[var(--color-primary)] h-1"
          />
          <div className="flex justify-between">
            <span className="text-[10px] text-[var(--color-outline)]">{ctrl.min}{ctrl.unit}</span>
            <span className="text-[10px] text-[var(--color-outline)]">{ctrl.max}{ctrl.unit}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
