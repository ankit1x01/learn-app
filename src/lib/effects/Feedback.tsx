import React, { useEffect } from 'react';

interface FeedbackProps {
  message: string;
  type: 'success' | 'failure' | 'hint' | 'info';
  duration: number;
  onComplete?: () => void;
}

export function Feedback({ message, type, duration, onComplete }: FeedbackProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  const bgColor = {
    success: '#4CAF50',
    failure: '#f44336',
    hint: '#FF9800',
    info: '#2196F3',
  }[type];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: bgColor,
        color: 'white',
        padding: '16px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 500,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      {message}
    </div>
  );
}
