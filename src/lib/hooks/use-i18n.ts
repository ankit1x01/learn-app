export function useI18n() {
  return {
    locale: 'en-US',
    setLocale: (_locale: string) => {},
    t: (key: string, _options?: Record<string, unknown>) => key,
  };
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return children as React.ReactElement;
}

import React from 'react';
