import React from 'react'
import { motion } from 'framer-motion'

export interface ResponseOption {
  id: string
  label: string
  icon?: string // Material Symbols icon name
  shortcut?: string // keyboard shortcut
}

interface ResponseButtonsProps {
  options: ResponseOption[]
  onSelect: (id: string) => void
  disabled?: boolean
  orientation?: 'horizontal' | 'grid'
  columns?: number
}

export const ResponseButtons: React.FC<ResponseButtonsProps> = ({
  options,
  onSelect,
  disabled = false,
  orientation = 'grid',
  columns = 3,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return
      const option = options.find(o => o.shortcut === e.key)
      if (option) {
        onSelect(option.id)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [options, onSelect, disabled])

  const containerClass =
    orientation === 'horizontal'
      ? 'flex flex-wrap gap-3 justify-center'
      : `grid gap-3 justify-center`

  const gridStyle =
    orientation === 'grid' ? { gridTemplateColumns: `repeat(${columns}, minmax(100px, 1fr))` } : {}

  return (
    <div className={containerClass} style={gridStyle}>
      {options.map(option => (
        <motion.button
          key={option.id}
          onClick={() => !disabled && onSelect(option.id)}
          disabled={disabled}
          className="relative px-4 py-3 rounded-lg bg-surface-container-high text-on-surface font-semibold
                     border-2 border-outline hover:border-primary hover:bg-surface-container-highest
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
        >
          <div className="flex flex-col items-center gap-2">
            {option.icon && (
              <span className="material-symbols-rounded text-2xl">{option.icon}</span>
            )}
            <span>{option.label}</span>
            {option.shortcut && (
              <span className="text-xs text-on-surface-variant">({option.shortcut})</span>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  )
}
