import React from 'react';
import { motion } from 'motion/react';
import type { Screen } from '../types';
import { Home, Timer, Library, Network, Zap } from 'lucide-react';

export const BottomNav = ({ current, setScreen }: { current: Screen; setScreen: (s: Screen) => void }) => {
  const navItems = [
    { id: 'dashboard', icon: Home,    label: 'Home'    },
    { id: 'session',   icon: Timer,   label: 'Session' },
    { id: 'topics',    icon: Library, label: 'Topics'  },
    { id: 'map',       icon: Network, label: 'Map'     },
    { id: 'elite',     icon: Zap,     label: 'Pro'     },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-[#E8E5DF]"
         style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="max-w-md mx-auto flex justify-around items-center h-[60px] px-2">
        {navItems.map((item) => {
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id as Screen)}
              className="relative flex flex-col items-center gap-[3px] transition-colors duration-150"
              style={{ minWidth: 52 }}
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-[1px] left-1/2 -translate-x-1/2 h-[2px] w-8 rounded-full bg-[#2563EB]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <item.icon
                size={22}
                strokeWidth={active ? 2.5 : 1.8}
                className={active ? 'text-[#2563EB]' : 'text-[#A8A29E]'}
              />
              <span
                className="text-[11px] font-semibold"
                style={{
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  color: active ? '#2563EB' : '#A8A29E',
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
