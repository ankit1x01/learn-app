import React, { useEffect } from 'react';

interface SpotlightProps {
  elementId: string;
  dimOpacity: number;
}

export function Spotlight({ elementId, dimOpacity }: SpotlightProps) {
  useEffect(() => {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'spotlight-overlay';
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, ${dimOpacity});
      border-radius: 8px;
      pointer-events: none;
      z-index: 100;
      animation: fadeIn 0.3s ease-in;
    `;

    element.style.position = 'relative';
    element.appendChild(overlay);

    return () => {
      overlay.remove();
    };
  }, [elementId, dimOpacity]);

  return null;
}
