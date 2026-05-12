import React, { useEffect } from 'react';

interface LaserProps {
  elementId: string;
  color: string;
}

export function Laser({ elementId, color }: LaserProps) {
  useEffect(() => {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Create laser effect
    const laser = document.createElement('div');
    laser.className = 'laser-effect';
    laser.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 3px solid ${color};
      border-radius: 8px;
      box-shadow: 0 0 20px ${color}, inset 0 0 20px ${color};
      pointer-events: none;
      z-index: 101;
      animation: laserPulse 1s ease-in-out;
    `;

    element.style.position = 'relative';
    element.appendChild(laser);

    return () => {
      laser.remove();
    };
  }, [elementId, color]);

  return null;
}
