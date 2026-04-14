import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BarChart3, AlertTriangle, TrendingDown, Target, ChevronRight, Zap } from 'lucide-react';

import { Screen } from '../types';
import { Concept } from '../core/types';

interface Props { setScreen: (s: Screen) => void; concepts: Concept[]; }

interface ErrorCluster {
  chapter: string;
  subject: string;
  errorCount: number;
  concepts: string[];
  pattern: string;
  rootCause: string;
  remedy: string;
}

// Derive clusters from concept difficulty scores (higher difficulty = more errors)
const buildClusters = (concepts: Concept[]): ErrorCluster[] => {
  const byChapter: Record<string, Concept[]> = {};
  concepts.forEach(c => {
    if (!byChapter[c.chapter]) byChapter[c.chapter] = [];
    byChapter[c.chapter].push(c);
  });

  const clusters: ErrorCluster[] = [];
  Object.entries(byChapter).forEach(([chapter, cList]) => {
    const avgDiff = cList.reduce((s, c) => s + c.difficulty, 0) / cList.length;
    const fragile = cList.filter(c => c.stage === 'Fragile' || (c.difficulty > 0.5 && c.stage !== 'Automatic'));
    if (fragile.length === 0 && avgDiff < 0.45) return;

    const errorCount = Math.round(fragile.length * 2.5 + avgDiff * 4);
    if (errorCount < 1) return;

    const subject = cList[0].subject;

    const PATTERNS: Record<string, string[]> = {
      'Foundations':               ["Index off-by-one error", "Edge case missed (empty/single element)", "Loop boundary confusion", "Wrong return type"],
      'Arrays & Search':           ["Wrong two-pointer direction", "Binary search boundary off-by-one", "Window shrink condition wrong", "Prefix sum index shift error"],
      'Strings & Data Structures': ["Stack/queue confusion", "Pointer null-check missing", "Recursion base case wrong", "Bit operation operator precedence"],
      'Trees & Graphs':            ["DFS/BFS choice wrong", "Visited set not used → infinite loop", "Tree height vs depth confusion", "Graph cycle not handled"],
      'DP & Greedy':               ["State definition too narrow", "Recurrence direction wrong", "Greedy applied where DP needed", "Base case initialisation missing"],
    };
    const ROOT_CAUSES: Record<string, string[]> = {
      'Foundations':               ["Pattern not typed out from scratch", "Edge cases not listed before coding", "Base concept skipped as 'too easy'"],
      'Arrays & Search':           ["Template not memorised — rebuilding from scratch each time", "Trigger condition unclear", "Multiple pointers not tracked on paper first"],
      'Strings & Data Structures': ["Structure not drawn before coding", "Pointer moves not traced step by step", "Recursion tree not visualised"],
      'Trees & Graphs':            ["Tree/graph not drawn before coding", "Traversal order not chosen deliberately", "Edge cases (null node, disconnected graph) not listed"],
      'DP & Greedy':               ["State not defined before coding", "Recurrence not written before implementing", "Confused DP with greedy — no counter-example checked"],
    };
    const REMEDIES: Record<string, string> = {
      'Foundations':               "Retype the solution from scratch without notes. List all edge cases before starting.",
      'Arrays & Search':           "Write the template header (two pointers / window bounds) on paper first. Identify the exact trigger condition in words.",
      'Strings & Data Structures': "Draw the structure state at each step. Trace pointer moves by hand on a 5-element example.",
      'Trees & Graphs':            "Draw the tree or graph. Run the traversal by hand — write the node visit order before coding.",
      'DP & Greedy':               "Write state definition + recurrence + base case in English. Code only after all three are clear.",
    };

    const pIdx = Math.floor(avgDiff * PATTERNS[subject].length);
    const rIdx = Math.floor(Math.random() * ROOT_CAUSES[subject].length);

    clusters.push({
      chapter,
      subject,
      errorCount,
      concepts: fragile.map(c => c.name).slice(0, 3),
      pattern: PATTERNS[subject][Math.min(pIdx, PATTERNS[subject].length - 1)],
      rootCause: ROOT_CAUSES[subject][rIdx],
      remedy: REMEDIES[subject],
    });
  });

  return clusters.sort((a, b) => b.errorCount - a.errorCount);
};

const SUBJECT_COLORS: Record<string, string> = {
  'Foundations': 'text-[#94A3B8]', 'Arrays & Search': 'text-primary',
  'Strings & Data Structures': 'text-[#0E7490]', 'Trees & Graphs': 'text-[#15803D]', 'DP & Greedy': 'text-[#B45309]'
};
const SUBJECT_BG: Record<string, string> = {
  'Foundations': 'bg-[#94A3B8]/10', 'Arrays & Search': 'bg-primary/10',
  'Strings & Data Structures': 'bg-[#ECFEFF]', 'Trees & Graphs': 'bg-[#F0FDF4]', 'DP & Greedy': 'bg-[#FFFBEB]'
};

export const ErrorDashboard: React.FC<Props> = ({ setScreen, concepts }) => {
  const clusters = buildClusters(concepts);
  const [expanded, setExpanded] = useState<string | null>(null);

  const totalErrors = clusters.reduce((s, c) => s + c.errorCount, 0);
  const topRisk = clusters[0];

  if (clusters.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <Target size={40} className="text-[#15803D] mb-4" />
      <h2 className="text-2xl font-ui font-bold mb-2">No Error Clusters Found</h2>
      <p className="text-[#6B7280] text-sm mb-6">Complete more sessions to build your error profile.</p>
      <button onClick={() => setScreen('elite')} className="px-6 py-3 bg-primary text-background rounded-xl font-bold text-sm">← Back</button>
    </div>
  );

  return (
    <div className="pt-16 pb-32 px-6 max-w-md mx-auto">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 size={14} className="text-[#7C3AED]" />
          <span className="text-[12px] uppercase tracking-[0.3em] text-[#6B7280] font-bold">AI Pattern Analysis</span>
        </div>
        <h1 className="text-3xl font-ui font-bold tracking-tight mb-1">Error Clusters</h1>
        <p className="text-[#6B7280] text-xs">{totalErrors} detected errors · {clusters.length} patterns identified</p>
      </header>

      {/* Top risk */}
      {topRisk && (
        <div className="card rounded-2xl p-5 mb-6 border border-[#FECACA]">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} className="text-[#B91C1C]" />
            <span className="text-[12px] uppercase tracking-widest font-bold text-[#B91C1C]">Primary Risk</span>
          </div>
          <h3 className="font-ui font-bold text-lg mb-1">{topRisk.chapter}</h3>
          <p className="text-[12px] text-[#6B7280] uppercase tracking-widest mb-3">{topRisk.pattern}</p>
          <p className="text-sm text-[#374151] leading-relaxed mb-3">{topRisk.rootCause}</p>
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-[12px] uppercase tracking-widest text-primary font-bold mb-1">Prescribed Remedy</p>
            <p className="text-sm text-[#374151]">{topRisk.remedy}</p>
          </div>
          <button onClick={() => setScreen('session')}
            className="w-full mt-4 py-3 bg-error text-background rounded-xl font-bold text-[12px] uppercase tracking-widest flex items-center justify-center gap-2">
            <Zap size={12} fill="currentColor" /> Start 20-min Deep Dive
          </button>
        </div>
      )}

      {/* All clusters */}
      <div className="space-y-3">
        <h4 className="text-[12px] uppercase tracking-[0.3em] text-[#78716C] font-bold px-1">All Patterns</h4>
        {clusters.map((cluster, i) => {
          const severity = cluster.errorCount >= 6 ? 'error' : cluster.errorCount >= 3 ? 'tertiary' : 'on-surface-variant';
          const isOpen = expanded === cluster.chapter;
          return (
            <motion.div key={cluster.chapter}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="card rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : cluster.chapter)}
                className="w-full p-4 flex items-center gap-3 text-left">
                <div className={`px-2 py-1 rounded-lg text-sm font-ui font-bold min-w-[2rem] text-center ${
                  cluster.errorCount >= 6 ? 'bg-[#FEF2F2] text-[#B91C1C]' :
                  cluster.errorCount >= 3 ? 'bg-[#FFFBEB] text-[#B45309]' :
                  'bg-[#F0EEE9] text-[#6B7280]'
                }`}>
                  {cluster.errorCount}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{cluster.chapter}</p>
                  <p className={`text-[12px] font-label uppercase tracking-widest ${SUBJECT_COLORS[cluster.subject]}`}>{cluster.subject} · {cluster.pattern}</p>
                </div>
                <div className={`flex items-center gap-1 ${SUBJECT_BG[cluster.subject]} px-2 py-1 rounded-lg`}>
                  <TrendingDown size={10} className={SUBJECT_COLORS[cluster.subject]} />
                  <span className={`text-[12px] font-bold ${SUBJECT_COLORS[cluster.subject]}`}>{cluster.errorCount}x</span>
                </div>
                <ChevronRight size={14} className={`text-[#A8A29E] transition-transform ${isOpen ? 'rotate-90' : ''}`} />
              </button>

              {isOpen && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }}
                  className="px-4 pb-4 border-t border-[#E8E5DF]">
                  <div className="pt-3 space-y-3">
                    <div>
                      <p className="text-[12px] uppercase tracking-widest text-[#78716C] font-bold mb-1">Concepts Affected</p>
                      <div className="flex flex-wrap gap-2">
                        {cluster.concepts.map(c => (
                          <span key={c} className="px-2 py-1 bg-[#F0EEE9] rounded-lg text-[11px] text-[#6B7280]">{c}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[12px] uppercase tracking-widest text-[#78716C] font-bold mb-1">Root Cause</p>
                      <p className="text-sm text-[#6B7280]">{cluster.rootCause}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                      <p className="text-[12px] uppercase tracking-widest text-primary font-bold mb-1">Remedy</p>
                      <p className="text-sm text-[#6B7280]">{cluster.remedy}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
