import React, { useMemo } from 'react';
import { getMorningRecallSet } from '../core/scheduler';
import { isDue } from '../core/fsrs';
import { CONFIG } from '../lib/config';
import { TierBadge } from '../components/TierBadge';
import type { Screen } from '../types';
import type { Concept } from '../core/types';
import { Brain } from 'lucide-react';

export const MorningRecall = ({ setScreen, concepts }: { setScreen: (s: Screen) => void; concepts?: Concept[] }) => {
  const liveConcepts = concepts ?? CONFIG.concepts;
  const recallConcepts = useMemo(() => {
    // Layer 7 — use sleep-optimised recall set (studied 6–14h ago, Fragile/Conscious, stakes-sorted)
    const morningSet = getMorningRecallSet(liveConcepts, 10);
    // Fall back to due-today concepts if no morning set (e.g. first session of the day)
    if (morningSet.length > 0) return morningSet;
    return liveConcepts.filter(c => c.stage !== 'Unseen' && isDue(c)).slice(0, 5);
  }, [liveConcepts]);
  const current = recallConcepts[0];

  return (
    <div className="pt-20 pb-36 px-4 max-w-md mx-auto min-h-screen flex flex-col items-center">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-ui font-light tracking-tighter mb-2" style={{ color: 'var(--color-on-surface)' }}>
          {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}
        </h2>
        <div className="h-px w-12 mx-auto" style={{ background: 'rgba(108,99,255,0.3)' }} />
      </div>

      <div className="card w-full p-8 rounded-[2.5rem] mb-10">
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-2" style={{ opacity: 0.5 }}>
            <Brain size={14} className="text-primary" />
            <span className="text-[12px] uppercase  font-bold">
              Morning Recall · {current?.subject ?? CONFIG.subjects[0]?.name}
            </span>
          </div>
          {current && <TierBadge tier={current.pyqTier} />}
        </div>

        {current && (
          <p className="text-[12px] uppercase tracking-widest mb-2" style={{ color: 'var(--color-on-surface-variant)' }}>
            {current.chapter} · Unit {current.unit}
          </p>
        )}
        <h1 className="text-2xl font-ui font-black leading-tight mb-4">{current?.name ?? 'Pattern Recall'}</h1>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
          Write the trigger conditions, the template, and one example problem where you'd use this.
        </p>

        <div className="space-y-5 mb-12">
          {['Trigger condition', 'Code template', 'Example problem'].map((label, i) => (
            <div key={i} className="pb-4" style={{ borderBottom: '1px solid rgba(108,99,255,0.15)' }}>
              <span className="text-[12px] font-bold uppercase tracking-normal" style={{ color: 'var(--color-on-surface-muted)' }}>{label}</span>
              <div className="h-7 mt-1" />
            </div>
          ))}
        </div>

        <button
          onClick={() => setScreen('complete')}
          className="w-full py-4 rounded-2xl text-[12px] font-bold uppercase tracking-[0.3em] transition-all"
          style={{ border: '1px solid rgba(108,99,255,0.2)', color: 'rgba(108,99,255,0.7)' }}
        >
          Reveal Answer
        </button>
      </div>

      <div className="text-center space-y-4">
        <p className="text-sm leading-relaxed max-w-[240px]" style={{ color: 'var(--color-on-surface-variant)' }}>
          {recallConcepts.length} concepts to recall · Your <span className="text-primary italic">chitta</span> consolidated patterns during sleep 🌙
        </p>
        <div className="flex justify-center gap-2 pt-2">
          {Array.from({ length: Math.max(recallConcepts.length, 1) }).map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all"
              style={{
                width: i === 0 ? 16 : 6,
                height: 6,
                background: i === 0 ? 'var(--color-subject-chemistry)' : 'rgba(255,255,255,0.08)',
                boxShadow: i === 0 ? '0 0 10px rgba(108,99,255,0.5)' : 'none',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
