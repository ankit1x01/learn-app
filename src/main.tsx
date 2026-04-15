import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import App from './App.tsx';
import './index.css';

// Global Haptics Interceptor: Fires a light physical tap for all app buttons and interactive elements
if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', (e) => {
    const target = e.target as HTMLElement;
    // Give native haptic feedback to buttons, links, or clickable utilities
    if (target.closest('button, a, [role="button"], .cursor-pointer, .card')) {
      Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
    }
  }, { passive: true });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
