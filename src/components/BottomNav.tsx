import React from 'react';
import { motion } from 'motion/react';

import type { Screen } from '../types';
import { m3SpatialFast } from '../lib/m3-motion';

const navItems: { id: Screen; icon: string; label: string }[] = [
  { id: 'dashboard', icon: 'home',      label: 'Home'    },
  { id: 'session',   icon: 'timer',     label: 'Session' },
  { id: 'topics',    icon: 'book',      label: 'Topics'  },
  { id: 'map',       icon: 'account_tree', label: 'Map'     },
  { id: 'elite',     icon: 'terminal',     label: 'Pro'      },
];

export const BottomNav = ({
  current,
  setScreen,
}: {
  current: Screen;
  setScreen: (s: Screen) => void;
}) => {
  return (
    <nav
      className="fixed bottom-0 left-0 w-full z-50 border-t"
      role="navigation"
      aria-label="Main Navigation"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        background: 'var(--color-surface-container-high)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="max-w-md mx-auto flex justify-around items-center h-[80px] px-2" role="tablist">
        {navItems.map(({ id, icon, label }) => {
          const active = current === id;
          return (
            <button
              key={id}
              role="tab"
              onClick={() => setScreen(id)}
              aria-label={label}
              aria-selected={active}
              aria-current={active ? 'page' : undefined}
              className="relative flex flex-col items-center gap-1 py-2 w-16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-xl"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              {/* M3 Active Indicator Pill: 64×32px */}
              <div className="relative w-16 h-8 flex items-center justify-center">
                {active && (
                  <motion.div
                    layoutId="nav-indicator-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'var(--color-secondary-container)' }}
                    transition={m3SpatialFast}
                  />
                )}
                <span
                  className="material-symbols-rounded"
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    fontSize: 24,
                    fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                    color: active
                      ? 'var(--color-on-secondary-container)'
                      : 'var(--color-on-surface-variant)',
                  }}
                >
                  {icon}
                </span>
              </div>
              <span
                style={{
                  fontSize: '12px',
                  fontFamily: 'var(--font-ui)',
                  fontWeight: active ? 700 : 500,
                  color: active
                    ? 'var(--color-on-surface)'
                    : 'var(--color-on-surface-variant)',
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
