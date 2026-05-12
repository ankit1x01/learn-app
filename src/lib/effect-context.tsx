import React, { createContext, useContext, useState, useCallback } from 'react';

export interface SpotlightEffect {
  elementId: string;
  dimOpacity: number;
}

export interface LaserEffect {
  elementId: string;
  color: string;
}

export interface FeedbackEffect {
  message: string;
  type: 'success' | 'failure' | 'hint' | 'info';
  duration: number;
}

interface EffectContextType {
  spotlight: SpotlightEffect | null;
  laser: LaserEffect | null;
  feedback: FeedbackEffect | null;
  setSpotlight: (effect: SpotlightEffect | null) => void;
  setLaser: (effect: LaserEffect | null) => void;
  setFeedback: (effect: FeedbackEffect | null) => void;
}

const EffectContext = createContext<EffectContextType | null>(null);

export function EffectProvider({ children }: { children: React.ReactNode }) {
  const [spotlight, setSpotlight] = useState<SpotlightEffect | null>(null);
  const [laser, setLaser] = useState<LaserEffect | null>(null);
  const [feedback, setFeedback] = useState<FeedbackEffect | null>(null);

  return (
    <EffectContext.Provider value={{ spotlight, laser, feedback, setSpotlight, setLaser, setFeedback }}>
      {children}
    </EffectContext.Provider>
  );
}

export function useEffects() {
  const context = useContext(EffectContext);
  if (!context) {
    throw new Error('useEffects must be used within EffectProvider');
  }
  return context;
}
