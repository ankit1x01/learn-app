// src/games/playground/PhysicsArcade.tsx
// Browse screen — lists all simulations from the registry grouped by category

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { SIMULATION_REGISTRY } from './registry'
import { SimulationType } from './types'
import { PhysicsPlayground } from './PhysicsPlayground'

// ── Category grouping ──────────────────────────────────────────────────────────
const CATEGORIES: { label: string; icon: string; color: string; bg: string; types: SimulationType[] }[] = [
  {
    label: 'Mechanics',
    icon: 'sports_baseball',
    color: '#F43F5E',
    bg: '#FFF1F2',
    types: ['projectile', 'collision_elastic', 'collision_inelastic', 'spring_mass', 'pendulum', 'atwood_machine', 'rolling', 'inclined_plane', 'circular_motion', 'orbit'],
  },
  {
    label: 'Electromagnetism',
    icon: 'electric_bolt',
    color: '#6750A4',
    bg: '#F3EDFF',
    types: ['electric_field', 'capacitor', 'gauss_sphere', 'magnetic_force', 'biot_savart', 'solenoid', 'lcr_circuit', 'em_wave'],
  },
  {
    label: 'Optics',
    icon: 'flare',
    color: '#0284C7',
    bg: '#E0F2FE',
    types: ['mirror_ray', 'lens_ray', 'prism', 'ydse', 'single_slit', 'standing_wave'],
  },
  {
    label: 'Modern Physics',
    icon: 'hub',
    color: '#059669',
    bg: '#ECFDF5',
    types: ['bohr_atom', 'photoelectric'],
  },
]

interface Props {
  onBack: () => void
}

export function PhysicsArcade({ onBack }: Props) {
  const [active, setActive] = useState<SimulationType | null>(null)

  if (active) {
    return (
      <div className="h-screen flex flex-col bg-[var(--color-background)]">
        <PhysicsPlayground
          type={active}
          config={{ freePlay: false }}
          onBack={() => setActive(null)}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[var(--color-background)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-3 shrink-0">
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
            Physics Playground
          </h1>
          <p className="text-[12px]" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>
            {Object.keys(SIMULATION_REGISTRY).length} simulations · JEE Advanced puzzles
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
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: cat.bg }}
              >
                <span
                  className="material-symbols-rounded"
                  style={{ fontSize: 16, color: cat.color, fontVariationSettings: "'FILL' 1" }}
                >
                  {cat.icon}
                </span>
              </div>
              <span className="text-[13px] font-bold" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
                {cat.label}
              </span>
              <span className="text-[11px] ml-auto" style={{ color: 'var(--color-on-surface-muted)', fontFamily: 'Inter, system-ui' }}>
                {cat.types.length} sims
              </span>
            </div>

            {/* Sim cards */}
            <div className="grid grid-cols-2 gap-2">
              {cat.types.map((type, i) => {
                const plugin  = SIMULATION_REGISTRY[type]
                const isReady = plugin.puzzles.length > 0
                return (
                  <motion.button
                    key={type}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: ci * 0.08 + i * 0.03, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => setActive(type)}
                    className="relative flex flex-col items-start p-3 rounded-2xl border border-solid text-left active:scale-[0.97] transition-transform overflow-hidden"
                    style={{
                      background: isReady ? cat.bg : 'var(--color-surface-container)',
                      borderColor: isReady ? cat.color + '30' : 'var(--color-border)',
                      opacity: 1,
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
                      style={{ background: isReady ? cat.color + '18' : 'var(--color-surface-container-high)' }}
                    >
                      <span
                        className="material-symbols-rounded"
                        style={{
                          fontSize: 18,
                          color: isReady ? cat.color : 'var(--color-on-surface-muted)',
                          fontVariationSettings: "'FILL' 1",
                        }}
                      >
                        {plugin.icon}
                      </span>
                    </div>

                    {/* Label */}
                    <p
                      className="text-[12px] font-semibold leading-tight w-full"
                      style={{
                        color: isReady ? 'var(--color-on-surface)' : 'var(--color-on-surface-muted)',
                        fontFamily: 'Inter, system-ui',
                      }}
                    >
                      {plugin.label}
                    </p>

                    {/* Puzzle count or Coming soon */}
                    <p
                      className="text-[10px] mt-0.5 font-medium"
                      style={{
                        color: isReady ? cat.color : 'var(--color-on-surface-muted)',
                        fontFamily: 'Inter, system-ui',
                      }}
                    >
                      {isReady ? `${plugin.puzzles.length} puzzles` : 'Coming soon'}
                    </p>

                    {/* Ready badge */}
                    {isReady && (
                      <div
                        className="absolute top-2 right-2 w-2 h-2 rounded-full"
                        style={{ background: cat.color }}
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
