import React from 'react';
import { motion } from 'motion/react';
import { Home, Timer, BookOpen, GitBranch, Zap } from 'lucide-react';
import type { Screen } from '../types';
import { m3SpatialFast } from '../lib/m3-motion';

const navItems: { id: Screen; Icon: React.ElementType; label: string }[] = [
  { id: 'dashboard', Icon: Home,      label: 'Home'    },
  { id: 'session',   Icon: Timer,     label: 'Session' },
  { id: 'topics',    Icon: BookOpen,  label: 'Topics'  },
  { id: 'map',       Icon: GitBranch, label: 'Map'     },
  { id: 'elite',     Icon: Zap,       label: 'Pro'     },
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
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        background: 'var(--color-surface-container-high)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="max-w-md mx-auto flex justify-around items-center h-[80px] px-2">
        {navItems.map(({ id, Icon, label }) => {
          const active = current === id;
          return (
            <button
              key={id}
              onClick={() => setScreen(id)}
              className="relative flex flex-col items-center gap-1 py-2 w-16"
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
                <Icon
                  size={24}
                  strokeWidth={active ? 2 : 1.5}
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    color: active
                      ? 'var(--color-on-secondary-container)'
                      : 'var(--color-on-surface-variant)',
                  }}
                />
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
