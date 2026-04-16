import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number; // 0-100 for deterministic progress
  fullscreen?: boolean;
}

interface LoadingContextType {
  loading: LoadingState;
  setLoading: (state: LoadingState | ((prev: LoadingState) => LoadingState)) => void;
  startLoading: (message?: string, fullscreen?: boolean) => void;
  stopLoading: () => void;
  setProgress: (progress: number) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    message: undefined,
    progress: 0,
    fullscreen: false,
  });

  const startLoading = (message?: string, fullscreen = false) => {
    setLoading({
      isLoading: true,
      message,
      progress: 0,
      fullscreen,
    });
  };

  const stopLoading = () => {
    setLoading({
      isLoading: false,
      message: undefined,
      progress: 0,
      fullscreen: false,
    });
  };

  const setProgress = (progress: number) => {
    setLoading(prev => ({
      ...prev,
      progress: Math.min(100, Math.max(0, progress)),
    }));
  };

  return (
    <LoadingContext.Provider
      value={{
        loading,
        setLoading,
        startLoading,
        stopLoading,
        setProgress,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
}
