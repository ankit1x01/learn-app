import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'

interface MatrixGridProps {
  matrix: number[][]
  editable?: boolean
  cellWidth?: string
  onCellChange?: (row: number, col: number, value: number) => void
  highlightCells?: Array<[number, number]>
  isLocked?: boolean
}

export const MatrixGrid: React.FC<MatrixGridProps> = ({
  matrix,
  editable = false,
  cellWidth = '60px',
  onCellChange,
  highlightCells = [],
  isLocked = false,
}) => {
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)

  const handleCellChange = useCallback(
    (row: number, col: number, newValue: string) => {
      if (!editable || isLocked) return
      const numValue = newValue === '' ? 0 : parseFloat(newValue) || 0
      onCellChange?.(row, col, numValue)
    },
    [editable, isLocked, onCellChange],
  )

  const isHighlighted = (row: number, col: number) =>
    highlightCells.some(([r, c]) => r === row && c === col)

  return (
    <div className="flex justify-center">
      <div
        className="border-2 border-primary rounded-lg p-4 bg-surface-container-low"
        style={{
          display: 'inline-block',
        }}
      >
        {matrix.map((row, rowIdx) => (
          <div key={`row-${rowIdx}`} className="flex gap-2 mb-2 last:mb-0">
            {row.map((cell, colIdx) => (
              <motion.input
                key={`cell-${rowIdx}-${colIdx}`}
                type="text"
                inputMode="numeric"
                value={cell === 0 && editable ? '' : cell}
                onChange={e => handleCellChange(rowIdx, colIdx, e.target.value)}
                onClick={() => editable && setSelectedCell([rowIdx, colIdx])}
                disabled={!editable || isLocked}
                className={`
                  w-14 h-14 text-center font-mono font-bold rounded-md
                  border-2 transition-all
                  ${isHighlighted(rowIdx, colIdx) ? 'border-success bg-success/10' : 'border-outline'}
                  ${selectedCell?.[0] === rowIdx && selectedCell?.[1] === colIdx ? 'border-primary ring-2 ring-primary/50' : ''}
                  ${!editable || isLocked ? 'bg-surface-container cursor-not-allowed' : 'bg-background'}
                  focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30
                  disabled:opacity-70
                `}
                style={{ width: cellWidth, height: cellWidth }}
                whileFocus={{ scale: 1.05 }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
