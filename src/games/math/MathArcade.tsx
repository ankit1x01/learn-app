import { motion } from 'motion/react'
import { MATH_REGISTRY } from './registry'
import { MathSimulationType } from './types'

const CATEGORIES: { label: string; icon: string; color: string; bg: string; types: MathSimulationType[] }[] = [
  {
    label: 'Calculus',
    icon: 'functions',
    color: '#7C3AED',
    bg: '#F5F3FF',
    types: ['function_grapher', 'area_under_curve', 'tangent_normal', 'maxima_minima', 'differential_equation'],
  },
  {
    label: 'Coordinate Geometry',
    icon: 'scatter_plot',
    color: '#0284C7',
    bg: '#E0F2FE',
    types: ['straight_lines', 'conic_circle', 'conic_parabola', 'conic_ellipse', 'conic_hyperbola'],
  },
  {
    label: 'Vectors',
    icon: 'arrow_forward',
    color: '#F43F5E',
    bg: '#FFF1F2',
    types: ['vector_2d', 'vector_cross_product'],
  },
  {
    label: 'Trigonometry',
    icon: 'graphic_eq',
    color: '#059669',
    bg: '#ECFDF5',
    types: ['unit_circle', 'sine_wave', 'triangle_solver'],
  },
  {
    label: 'Complex Numbers',
    icon: 'blur_circular',
    color: '#D97706',
    bg: '#FFFBEB',
    types: ['argand_plane', 'roots_of_unity'],
  },
  {
    label: 'Matrices',
    icon: 'grid_on',
    color: '#6750A4',
    bg: '#F3EDFF',
    types: ['matrix_transform_2d'],
  },
  {
    label: 'Probability & Statistics',
    icon: 'bar_chart',
    color: '#0891B2',
    bg: '#ECFEFF',
    types: ['probability_tree', 'normal_distribution'],
  },
]

interface Props {
  onBack: () => void
}

export function MathArcade({ onBack }: Props) {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[var(--color-background)] overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center gap-3 px-4 pb-3 shrink-0"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 20px)' }}
      >
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-xl"
          style={{ background: 'var(--color-surface-container)' }}
          aria-label="Back"
        >
          <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--color-on-surface)' }}>
            arrow_back
          </span>
        </button>
        <div className="flex-1">
          <h1 className="text-[18px] font-black leading-tight" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
            Math Playground
          </h1>
          <p className="text-[12px]" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>
            {Object.keys(MATH_REGISTRY).length} simulations · JEE Advanced
          </p>
        </div>
      </div>

      {/* Category list */}
      <div className="flex-1 overflow-y-auto px-4 pb-28 space-y-5">
        {CATEGORIES.map((cat, ci) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ci * 0.08, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Category header */}
            <div className="flex items-center gap-2 mb-2 px-1">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: cat.bg }}>
                <span className="material-symbols-rounded" style={{ fontSize: 16, color: cat.color, fontVariationSettings: "'FILL' 1" }}>
                  {cat.icon}
                </span>
              </div>
              <span className="text-[13px] font-bold" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
                {cat.label}
              </span>
              <span className="text-[11px] ml-auto" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>
                {cat.types.length} sims
              </span>
            </div>

            {/* Sim cards */}
            <div className="grid grid-cols-2 gap-2">
              {cat.types.map((type, i) => {
                const plugin = MATH_REGISTRY[type]
                return (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: ci * 0.08 + i * 0.03, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="relative flex flex-col items-start p-3 rounded-2xl border border-solid text-left overflow-hidden"
                    style={{
                      background: 'var(--color-surface-container)',
                      borderColor: 'var(--color-outline-variant)',
                    }}
                  >
                    {/* Icon */}
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ background: cat.bg }}>
                      <span className="material-symbols-rounded" style={{ fontSize: 18, color: cat.color, fontVariationSettings: "'FILL' 1" }}>
                        {plugin.icon}
                      </span>
                    </div>
                    {/* Label */}
                    <p className="text-[12px] font-semibold leading-tight w-full" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>
                      {plugin.label}
                    </p>
                    {/* Coming soon */}
                    <p className="text-[10px] mt-0.5 font-medium" style={{ color: 'var(--color-on-surface-variant)', opacity: 0.6, fontFamily: 'Inter, system-ui' }}>
                      Coming soon
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
