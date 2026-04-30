/**
 * Feedback Toast — Display success/failure/hint messages during games
 * Stub implementation for Phase 3 UI Layers
 */

import React from 'react';

export type FeedbackType = 'success' | 'failure' | 'hint' | 'info';

export interface FeedbackProps {
  message: string;
  type?: FeedbackType;
  duration?: number;
  onDismiss?: () => void;
}

const colorMap: Record<FeedbackType, string> = {
  success: '#4CAF50',
  failure: '#F44336',
  hint: '#FF9800',
  info: '#2196F3',
};

const iconMap: Record<FeedbackType, string> = {
  success: 'check_circle',
  failure: 'error',
  hint: 'lightbulb',
  info: 'info',
};

/**
 * Feedback component for showing result messages during game playback
 * Auto-dismisses after duration or when user clicks
 */
export function Feedback({
  message,
  type = 'info',
  duration = 3000,
  onDismiss,
}: FeedbackProps) {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        padding: '12px 16px',
        backgroundColor: colorMap[type],
        color: 'white',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 1000,
        maxWidth: '300px',
        cursor: 'pointer',
      }}
      onClick={() => {
        setVisible(false);
        onDismiss?.();
      }}
    >
      <span className="material-symbols-rounded" style={{ fontSize: '20px' }}>
        {iconMap[type]}
      </span>
      <span style={{ flex: 1 }}>{message}</span>
    </div>
  );
}
