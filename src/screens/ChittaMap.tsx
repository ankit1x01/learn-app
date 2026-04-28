import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { calculateR } from '../core/fsrs';
import { getForgettingCurve } from '../core/scheduler';
import { CONFIG, subjectIcon } from '../lib/config';
import { TierBadge } from '../components/TierBadge';
import type { Screen } from '../types';
import type { Stage, Concept, SubjectStats } from '../core/types';


export const ChittaMap = ({
  setScreen,
  globalStats,
}: {
  setScreen: (s: Screen) => void;
  globalStats: Record<string, SubjectStats>;
}) => {
  const [selectedNode, setSelectedNode] = useState<Concept | null>(null);
  const [filter, setFilter] = useState<string>('All');

  const allConcepts = CONFIG.concepts;
  const filterOptions = ['All', ...CONFIG.subjects.map(s => s.name)];

  const visible = useMemo(() =>
    allConcepts.filter(c => filter === 'All' || c.subject === filter),
    [filter, allConcepts]
  );

  const stageColor: Record<Stage, string> = {
    Automatic:  'bg-[color:var(--color-success)]',
    ExamReady:  'bg-[color:var(--color-warning)]',
    Conscious:  'bg-[color:var(--color-primary)]',
    Fragile:    'bg-[color:var(--color-error)] animate-pulse',
    Unseen:     'bg-[color:var(--color-surface-variant)]',
  };
  const stageSize: Record<Stage, string> = {
    Automatic:  'w-4 h-4',
    ExamReady:  'w-5 h-5',
    Conscious:  'w-3 h-3',
    Fragile:    'w-3 h-3',
    Unseen:     'w-2 h-2',
  };

  const getPos = (c: Concept, i: number) => {
    const subjectIdx = CONFIG.subjects.findIndex(s => s.name === c.subject);
    const sectorDeg  = 360 / CONFIG.subjects.length;
    const offset     = subjectIdx * sectorDeg;
    const angle      = (offset + i * 22) * (Math.PI / 180);
    const radius     = 0.25 + (c.pyqTier === 1 ? 0.05 : c.pyqTier === 2 ? 0.1 : 0.15);
    return {
      left: `${50 + radius * 100 * Math.cos(angle)}%`,
      top:  `${50 + radius * 100 * Math.sin(angle)}%`,
    };
  };

  const counts = Object.values(globalStats).reduce(
    (acc, s) => ({ auto: acc.auto + s.auto, conscious: acc.conscious + s.conscious, fragile: acc.fragile + s.fragile, unseen: acc.unseen + s.unseen }),
    { auto: 0, conscious: 0, fragile: 0, unseen: 0 }
  );

  return (
    <div className="h-screen w-full relative overflow-hidden" style={{ background: 'var(--color-background)' }}>
      {/* Filter pills */}
      <div className="absolute top-16 left-0 w-full px-4 flex gap-2 overflow-x-auto no-scrollbar z-20 py-3">
        {filterOptions.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-[12px] font-bold uppercase tracking-widest transition-all shrink-0 ${
              filter === f
                ? 'text-white'
                : 'text-[var(--color-on-surface-variant)] border border-[var(--color-border)]'
            }`}
            style={filter === f ? { background: 'var(--color-primary)' } : { background: 'var(--color-surface-container-lowest)' }}
          >
            {f === 'All' ? f : <div className="flex items-center gap-1.5"><span className="material-symbols-rounded" style={{ fontSize: 16 }}>{subjectIcon(f)}</span>{f}</div>}
          </button>
        ))}
      </div>

      {/* Nodes */}
      <div className="absolute inset-0">
        {visible.map((concept, i) => (
          <div
            key={concept.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-150 transition-transform"
            style={getPos(concept, i)}
            onClick={() => setSelectedNode(concept)}
          >
            <div className={`rounded-full ${stageSize[concept.stage]} ${stageColor[concept.stage]}`} />
          </div>
        ))}
      </div>

      {/* Node detail */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-72"
            onClick={() => setSelectedNode(null)}
          >
            <div className="card rounded-[1.5rem] p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-ui font-bold text-lg leading-tight">{selectedNode.name}</h3>
                <span className="material-symbols-rounded text-[var(--color-on-surface-variant)] shrink-0 ml-2" style={{ fontSize: 16 }}>info</span>
              </div>
              <p className="text-[12px] text-[#6B7280] uppercase tracking-widest mb-3">{selectedNode.chapter} · Unit {selectedNode.unit}</p>
              <div className="flex gap-2 mb-4">
                <span className="inline-block px-2 py-1 rounded-md text-[12px] font-bold uppercase tracking-normal" style={{ 
                  background: selectedNode.stage === 'Automatic' ? 'var(--color-success-container)' :
                              selectedNode.stage === 'Conscious' ? 'var(--color-primary-container)' :
                              selectedNode.stage === 'Fragile'   ? 'var(--color-error-container)' :
                              'var(--color-surface-variant)',
                  color:      selectedNode.stage === 'Automatic' ? 'var(--color-on-success-container)' :
                              selectedNode.stage === 'Conscious' ? 'var(--color-on-primary-container)' :
                              selectedNode.stage === 'Fragile'   ? 'var(--color-on-error-container)' :
                              'var(--color-on-surface-variant)'
                }}>
                  {selectedNode.stage}
                </span>
                <TierBadge tier={selectedNode.pyqTier} />
              </div>
              <div className="space-y-2.5 text-[11px]">
                {[
                  { label: 'Retrievability', value: selectedNode.stage !== 'Unseen' ? `${Math.round(calculateR(selectedNode.stability, selectedNode.lastTested) * 100)}%` : '—' },
                  { label: 'Stability (S)',  value: selectedNode.stability > 0 ? `${selectedNode.stability}d` : '—' },
                  { label: 'Next Review',   value: selectedNode.nextReview >= 0 ? `${selectedNode.nextReview}d` : 'Now' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-[var(--color-on-surface-variant)] uppercase tracking-widest">{label}</span>
                    <span className="font-bold">{value}</span>
                  </div>
                ))}
              </div>

              {/* Forgetting Curve Chart */}
              {selectedNode.stage !== 'Unseen' && (
                <div className="mt-5 pt-4 border-t border-[var(--color-border)]">
                  <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-[var(--color-on-surface-variant)] mb-3">Memory Projection (14 days)</p>
                  <div className="flex items-end justify-between h-12 gap-[2px]">
                    {getForgettingCurve(selectedNode, 14).map((d, i) => (
                      <div key={i} className="flex-1 group relative">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${d.r * 100}%` }}
                          className="w-full rounded-t-[2px]"
                          style={{
                            background: d.r > 0.9 ? 'var(--color-success)' : d.r > 0.7 ? 'var(--color-primary)' : 'var(--color-error)',
                            opacity: 0.3 + (d.r * 0.7)
                          }}
                        />
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-[var(--color-on-surface)] text-[var(--color-surface)] text-[8px] px-1 py-0.5 rounded whitespace-nowrap z-50">
                          Day {i}: {Math.round(d.r * 100)}%
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-1.5 text-[8px] font-bold text-[var(--color-on-surface-muted)] uppercase tracking-tighter">
                    <span>Today</span>
                    <span>Next 2 Weeks</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => { setSelectedNode(null); setScreen('recall'); }}
                className="w-full mt-5 py-3 text-primary text-[12px] font-bold uppercase tracking-[0.2em] border-t border-[var(--color-border)] pt-4"
              >
                Enter Deep Dive <span className="material-symbols-rounded" style={{ fontSize: 14 }}>chevron_right</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-28 left-4 right-4">
        <div className="card rounded-2xl p-4 flex justify-around items-center">
          {[
            { color: 'var(--color-success)',             label: 'Auto',     value: counts.auto     },
            { color: 'var(--color-primary)',             label: 'Conscious', value: counts.conscious },
            { color: 'var(--color-error)',               label: 'Fragile',  value: counts.fragile  },
            { color: 'var(--color-surface-variant)',     label: 'Unseen',   value: counts.unseen   },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
              <div className="text-right">
                <div className="font-ui font-bold text-sm">{s.value}</div>
                <div className="text-[12px] text-[var(--color-on-surface-variant)] uppercase tracking-normal">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
