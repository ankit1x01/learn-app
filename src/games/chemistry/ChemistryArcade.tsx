import { motion } from 'motion/react'
import { CHEM_REGISTRY } from './registry'
import { ChemSimulationType } from './types'

const CATEGORIES: { label: string; icon: string; color: string; bg: string; types: ChemSimulationType[] }[] = [
  {
    label: 'Gases & States of Matter',
    icon: 'bubble_chart',
    color: '#0891B2',
    bg: '#ECFEFF',
    types: ['gas_laws', 'maxwell_boltzmann', 'phase_diagram'],
  },
  {
    label: 'Atomic Structure',
    icon: 'hub',
    color: '#7C3AED',
    bg: '#F5F3FF',
    types: ['atomic_orbital', 'energy_levels'],
  },
  {
    label: 'Equilibrium',
    icon: 'balance',
    color: '#059669',
    bg: '#ECFDF5',
    types: ['chemical_equilibrium', 'titration_curve', 'buffer_solution'],
  },
  {
    label: 'Chemical Kinetics',
    icon: 'trending_down',
    color: '#F43F5E',
    bg: '#FFF1F2',
    types: ['reaction_kinetics', 'arrhenius'],
  },
  {
    label: 'Electrochemistry',
    icon: 'electric_bolt',
    color: '#D97706',
    bg: '#FFFBEB',
    types: ['electrochemical_cell', 'electrolysis'],
  },
  {
    label: 'Solutions & Thermochemistry',
    icon: 'thermostat',
    color: '#DC2626',
    bg: '#FEF2F2',
    types: ['colligative_properties', 'hess_law'],
  },
  {
    label: 'Structure & Bonding',
    icon: 'blur_on',
    color: '#6750A4',
    bg: '#F3EDFF',
    types: ['crystal_structure', 'vsepr_geometry', 'molecular_orbital', 'periodic_trends'],
  },
]

interface Props {
  onBack: () => void
}

export function ChemistryArcade({ onBack }: Props) {
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
            Chemistry Lab
          </h1>
          <p className="text-[12px]" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>
            {Object.keys(CHEM_REGISTRY).length} simulations · Physical Chemistry
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
                const plugin = CHEM_REGISTRY[type]
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
