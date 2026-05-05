import React from 'react'
import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

interface LatexDisplayProps {
  latex: string
  block?: boolean
  className?: string
}

export const LatexDisplay: React.FC<LatexDisplayProps> = ({ latex, block = false, className = '' }) => {
  try {
    if (block) {
      return <BlockMath math={latex} />
    }
    return <InlineMath math={latex} />
  } catch (e) {
    // Fallback for invalid LaTeX
    return <span className={className}>{latex}</span>
  }
}
