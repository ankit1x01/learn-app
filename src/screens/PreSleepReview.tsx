import React, { useState, useMemo } from 'react';
import { getPreSleepReviewSet } from '../core/scheduler';
import { CONFIG } from '../lib/config';
import { TierBadge } from '../components/TierBadge';
import type { Screen } from '../types';
import type { Concept } from '../core/types';


export const PreSleepReview = ({ setScreen, concepts, onUpdateConcept }: { setScreen: (s: Screen) => void; concepts?: Concept[]; onUpdateConcept?: (id: string, updates: Partial<Concept>) => void }) => {
  const liveConcepts = concepts ?? CONFIG.concepts;
  const preSleepConcepts = useMemo(() => {
    // Get high-stakes Fragile/Conscious concepts not studied in last 4h
    // These are optimal for NREM consolidation during sleep
    return getPreSleepReviewSet(liveConcepts, 8);
  }, [liveConcepts]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const current = preSleepConcepts[currentIndex];
  const hour = new Date().getHours();
  const isOptimalTime = hour >= 20 && hour < 22; // 20:00–21:59

  if (!isOptimalTime) {
    return (
      <div className="pt-20 pb-36 px-4 max-w-md mx-auto min-h-screen flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <span className="material-symbols-rounded" style={{ fontSize: 48,  color: 'var(--color-on-surface-variant)', margin: '0 auto 1rem'  }}>bedtime</span>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>
            Pre-Sleep Review
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>
            Available 20:00 – 22:00 for optimal NREM consolidation
          </p>
        </div>
        <button
          onClick={() => setScreen('dashboard')}
          className="px-6 py-3 rounded-xl font-semibold text-sm"
          style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (preSleepConcepts.length === 0) {
    return (
      <div className="pt-20 pb-36 px-4 max-w-md mx-auto min-h-screen flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <span className="material-symbols-rounded" style={{ fontSize: 48,  color: 'var(--color-on-surface-variant)', margin: '0 auto 1rem'  }}>bedtime</span>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>
            All Caught Up
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>
            No high-stakes concepts need consolidation right now. Sleep well.
          </p>
        </div>
        <button
          onClick={() => setScreen('dashboard')}
          className="px-6 py-3 rounded-xl font-semibold text-sm"
          style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-36 px-4 max-w-md mx-auto min-h-screen flex flex-col items-center">
      <div className="text-center mb-12">
        <span className="material-symbols-rounded" style={{ fontSize: 32,  color: 'var(--color-on-surface-variant)', margin: '0 auto 1rem'  }}>bedtime</span>
        <h2 className="text-4xl font-light tracking-tight mb-2" style={{ color: 'var(--color-on-surface)' }}>
          Pre-Sleep Review
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
          Consolidate during NREM sleep
        </p>
      </div>

      <div className="card w-full p-8 rounded-[2.5rem] mb-10">
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-2" style={{ opacity: 0.6 }}>
            <span className="material-symbols-rounded" style={{ fontSize: 14,  color: 'var(--color-on-surface-variant)'  }}>bedtime</span>
            <span className="text-[12px] uppercase font-bold" style={{ color: 'var(--color-on-surface-variant)' }}>
              Pre-Sleep · {current?.subject ?? CONFIG.subjects[0]?.name}
            </span>
          </div>
          {current && <TierBadge tier={current.pyqTier} />}
        </div>

        {current && (
          <p className="text-[12px] uppercase tracking-widest mb-2" style={{ color: 'var(--color-on-surface-variant)' }}>
            {current.chapter} · Unit {current.unit}
          </p>
        )}
        <h1 className="text-2xl font-bold leading-tight mb-4" style={{ color: 'var(--color-on-surface)' }}>
          {current?.name ?? 'Concept Review'}
        </h1>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
          Review this high-stakes concept before sleep. Your brain will consolidate it during NREM.
        </p>

        {current && current.stakesFact && (
          <div
            className="p-3 rounded-lg mb-8"
            style={{
              background: 'rgba(185, 28, 28, 0.05)',
              border: '1px solid rgba(185, 28, 28, 0.2)',
              color: 'var(--color-on-surface)',
            }}
          >
            <p className="text-sm">{current.stakesFact}</p>
          </div>
        )}

        <div className="space-y-4 mb-12">
          <div style={{ borderBottom: '1px solid rgba(108,99,255,0.15)', paddingBottom: '1rem' }}>
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-on-surface-muted)' }}>
              Pattern Name
            </span>
            <p className="mt-2 text-sm" style={{ color: 'var(--color-on-surface)' }}>
              {current?.name}
            </p>
          </div>
          <div style={{ borderBottom: '1px solid rgba(108,99,255,0.15)', paddingBottom: '1rem' }}>
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-on-surface-muted)' }}>
              Key Challenge
            </span>
            <div className="h-12 mt-2" />
          </div>
        </div>

        <button
          onClick={() => {
            if (current && onUpdateConcept) {
              onUpdateConcept(current.id, { lastStudiedAt: Date.now() });
            }
            if (currentIndex < preSleepConcepts.length - 1) {
              setCurrentIndex(currentIndex + 1);
            } else {
              setScreen('complete');
            }
          }}
          className="w-full py-4 rounded-2xl text-[12px] font-bold uppercase tracking-[0.3em] transition-all"
          style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
        >
          {currentIndex < preSleepConcepts.length - 1 ? 'Next Concept' : 'Review Complete'}
        </button>
      </div>

      <div className="text-center space-y-4">
        <p className="text-sm leading-relaxed max-w-[280px]" style={{ color: 'var(--color-on-surface-variant)' }}>
          {currentIndex + 1} of {preSleepConcepts.length} critical concept{preSleepConcepts.length !== 1 ? 's' : ''} • Sleep consolidates memory through NREM theta–delta oscillations
        </p>
      </div>
    </div>
  );
};
