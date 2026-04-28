import React from 'react';


export const TierBadge = ({ tier }: { tier: 1 | 2 | 3 | 4 }) => {
  if (tier > 2) return null;
  return (
    <span
      className="px-2 py-0.5 rounded-full text-[12px] font-bold uppercase tracking-normal flex items-center gap-1"
      style={
        tier === 1
          ? { background: 'var(--color-warning-container)', color: 'var(--color-on-warning-container)' }
          : { background: 'var(--color-surface-container-high)', color: 'var(--color-on-surface-variant)' }
      }
    >
      {tier === 1 && <span className="material-symbols-rounded" style={{ fontSize: 8, fontVariationSettings: "'FILL' 1" }}>star</span>}
      T{tier}
    </span>
  );
};

export const GlassCard = ({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <div
    onClick={onClick}
    className={`card rounded-[1.5rem] p-5 ${className} ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}`}
  >
    {children}
  </div>
);
