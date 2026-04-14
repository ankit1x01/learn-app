import React from 'react';
import { CONFIG } from '../lib/config';

export const StatusBar = () => {
  const now = new Date();
  const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  return (
    <div className="fixed top-0 left-0 w-full px-5 py-3 flex justify-between items-center z-[60] bg-[#F7F6F3]/90  border-b border-[#E8E5DF]">
      <span className="text-[12px] font-semibold text-[#A8A29E] tabular-nums">{time}</span>
      <span
        className="text-[13px] font-bold tracking-wide"
        style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: '#2563EB' }}
      >
        {CONFIG.name}
      </span>
    </div>
  );
};
