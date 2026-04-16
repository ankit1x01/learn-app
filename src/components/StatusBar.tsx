import React from 'react';
import { CONFIG } from '../lib/config';

export const StatusBar = () => {
  const now = new Date();
  const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  return (
    <div
      className="fixed top-0 left-0 w-full px-5 py-3 flex justify-between items-center z-[60] border-b"
      style={{
        background: 'var(--color-surface-container-high)',
        borderColor: 'var(--color-border)',
      }}
    >
      <span className="text-[12px] font-semibold tabular-nums" style={{ color: 'var(--color-on-surface-variant)' }}>
        {time}
      </span>
      <span
        className="text-[13px] font-bold tracking-wide"
        style={{ fontFamily: 'var(--font-ui)', color: 'var(--color-primary)' }}
      >
        {CONFIG.name}
      </span>
    </div>
  );
};
