# M3 Loading & Progress Indicators

Global loading state management with Material Design 3 components for CHITTA.

## Overview

The loading system provides:
- **LoadingIndicator**: M3 circular spinner (sm/md/lg) with fullscreen mode
- **ProgressBar**: Linear progress bar (deterministic & indeterminate modes)
- **LoadingContext**: Global state manager for loading states across the app
- **LoadingProvider**: React Context provider wrapping the entire app

## Quick Start

### 1. Use Hook in Any Component

```tsx
import { useLoading } from '../lib/LoadingContext';

export function MyScreen() {
  const { loading, startLoading, stopLoading, setProgress } = useLoading();

  const handleAsyncOp = async () => {
    try {
      startLoading('Processing...', true); // fullscreen spinner
      await someAsyncOperation();
      stopLoading();
    } catch (e) {
      stopLoading();
    }
  };

  return <button onClick={handleAsyncOp}>Start Operation</button>;
}
```

### 2. Display Modes

**Fullscreen Spinner** (for operations < 3 seconds)
```tsx
startLoading('Saving your answer...', true);
// Automatically shows in App.tsx
```

**Progress Bar** (for longer operations)
```tsx
startLoading('Building session...', false);

for (let i = 0; i <= 100; i += 10) {
  setProgress(i);
  await someWork();
}

stopLoading();
```

## API Reference

### `useLoading()` Hook

```tsx
interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number; // 0-100
  fullscreen?: boolean;
}

interface useLoadingReturn {
  loading: LoadingState;
  setLoading: (state: LoadingState | function) => void;
  startLoading: (message?: string, fullscreen?: boolean) => void;
  stopLoading: () => void;
  setProgress: (progress: number) => void;
}
```

## Common Patterns

### Pattern 1: Answer Submission (Fullscreen Spinner)

```tsx
// In LiveSession.tsx
const { startLoading, stopLoading } = useLoading();

const handleSubmitAnswer = async () => {
  try {
    startLoading('Recording your response...', true);
    
    await updateConcept(concept, {
      responseTime: Date.now() - startTime,
      confidence: selectedConfidence,
      answer: selectedOption,
      stage: newStage,
    });
    
    stopLoading();
    setQIndex(qIndex + 1);
  } catch (error) {
    stopLoading();
    console.error(error);
  }
};
```

### Pattern 2: Session Building (Progress Bar)

```tsx
// In Dashboard.tsx
const { startLoading, stopLoading, setProgress } = useLoading();

const handleBuildSession = async () => {
  try {
    startLoading('Building your personalized session...', false);
    
    // Phase 1: Load concepts
    setProgress(25);
    const concepts = await loadConceptsFromDB();
    
    // Phase 2: Build session
    setProgress(50);
    const session = buildSessionFromConcepts(concepts);
    
    // Phase 3: Apply scheduling
    setProgress(75);
    applyTimeOfDayScheduling(session);
    
    // Phase 4: Finalize
    setProgress(100);
    
    stopLoading();
    setScreen('session');
  } catch (error) {
    stopLoading();
  }
};
```

### Pattern 3: Data Migration (Long Job)

```tsx
// In App.tsx or initialization
const { startLoading, stopLoading, setProgress } = useLoading();

useEffect(() => {
  const migrateData = async () => {
    startLoading('Syncing your progress...', false);
    
    const total = allConcepts.length;
    let processed = 0;
    
    for (const concept of allConcepts) {
      await syncConceptToCloud(concept);
      processed++;
      setProgress((processed / total) * 100);
    }
    
    stopLoading();
  };
  
  migrateData();
}, []);
```

### Pattern 4: Indeterminate Progress

```tsx
// For operations where progress is unknown
const { startLoading, stopLoading } = useLoading();

const handleIndeterminateOp = async () => {
  startLoading('Processing...', true); // Shows spinner, not progress
  await unknownDurationOperation();
  stopLoading();
};
```

## UI Component Properties

### LoadingIndicator

```tsx
interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';           // Default: 'md'
  fullscreen?: boolean;                // Default: false
  message?: string;                    // Optional label
}

// Examples
<LoadingIndicator size="md" fullscreen message="Loading..." />
<LoadingIndicator size="sm" />
<LoadingIndicator size="lg" fullscreen />
```

### ProgressBar

```tsx
interface ProgressBarProps {
  value: number;                       // 0-100
  variant?: 'linear' | 'indeterminate'; // Default: 'linear'
  size?: 'sm' | 'md';                  // Default: 'md'
  label?: string;                      // Optional label
  position?: 'top' | 'bottom';         // Default: 'top'
}

// Examples
<ProgressBar value={65} variant="linear" label="Session Loading" />
<ProgressBar value={0} variant="indeterminate" size="sm" />
```

## Best Practices

1. **Always call stopLoading()** in catch blocks to prevent stuck states
2. **Use fullscreen for modal operations** (answers, confirmations)
3. **Use progress bar for user-visible work** (building sessions, syncing)
4. **Keep messages brief** (< 40 characters preferred)
5. **Set progress incrementally** (0, 25, 50, 75, 100 milestones)
6. **Nest operations carefully** (don't start new loading while one is active)

## Color Tokens (M3 Expressive)

The loading indicators use:
- **Spinner**: `var(--color-primary)` (#6750A4 Focus Violet)
- **Track**: `var(--color-on-surface)` with 12% opacity
- **Background (fullscreen)**: `rgba(0, 0, 0, 0.32)` (M3 scrim)
- **Container**: `var(--color-background)`

## Integration Checklist

- [x] LoadingProvider wraps App.tsx
- [x] Spinner and progress bar render globally
- [x] All async screens can import useLoading hook
- [x] Type-safe LoadingState interface
- [x] M3 motion presets for smooth animations
- [ ] Add loading states to Dashboard session builder
- [ ] Add loading states to LiveSession answer submission
- [ ] Add loading states to data sync operations
- [ ] Add loading states to ConceptEncoding depth changes

## Files

- `src/lib/LoadingContext.tsx` — State management
- `src/components/LoadingIndicator.tsx` — Spinner component
- `src/components/ProgressBar.tsx` — Progress bar component
- `src/lib/loading-examples.ts` — Usage patterns
- `src/lib/loading/index.ts` — Barrel export
