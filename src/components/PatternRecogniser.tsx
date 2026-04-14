import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, ChevronRight, RotateCcw } from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────

interface PatternMatch {
  pattern: string;
  confidence: number; // 0–100
  why: string;
  examples: string[];
  color: string;
}

interface KeywordEntry {
  keywords: string[];
  patterns: string[];
  confidence: number;
  color: string;
}

// Primary keyword → pattern map (from DSA Shortcut Guide)
const KEYWORD_MAP: KeywordEntry[] = [
  {
    keywords: ['top k', 'k largest', 'k smallest', 'k closest', 'k frequent'],
    patterns: ['Heap (Priority Queue)'],
    confidence: 95,
    color: '#F59E0B',
  },
  {
    keywords: ['longest substring', 'shortest substring', 'minimum window', 'at most k', 'exactly k', 'maximum window'],
    patterns: ['Sliding Window'],
    confidence: 90,
    color: '#38BDF8',
  },
  {
    keywords: ['subarray sum', 'sum equals k', 'range sum', 'prefix sum'],
    patterns: ['Prefix Sum + Hash Map'],
    confidence: 95,
    color: '#38BDF8',
  },
  {
    keywords: ['maximum subarray', 'max subarray', 'kadane'],
    patterns: ["Kadane's Algorithm"],
    confidence: 99,
    color: '#10B981',
  },
  {
    keywords: ['two numbers sum', 'pair sum', 'two sum', 'complement'],
    patterns: ['Hash Map', 'Two Pointers'],
    confidence: 95,
    color: '#A78BFA',
  },
  {
    keywords: ['sorted array', 'sorted input', 'binary search', 'search in sorted', 'rotated sorted', 'find target'],
    patterns: ['Binary Search'],
    confidence: 99,
    color: '#60A5FA',
  },
  {
    keywords: ['number of ways', 'count paths', 'how many', 'count combinations'],
    patterns: ['Dynamic Programming'],
    confidence: 95,
    color: '#F472B6',
  },
  {
    keywords: ['minimum cost', 'maximum value', 'minimum steps', 'optimal', 'maximize profit', 'minimize'],
    patterns: ['DP', 'Greedy'],
    confidence: 85,
    color: '#F472B6',
  },
  {
    keywords: ['path in grid', 'grid traversal', 'island', 'matrix path', '2d grid'],
    patterns: ['DP (2D)', 'DFS/BFS'],
    confidence: 90,
    color: '#F472B6',
  },
  {
    keywords: ['all permutations', 'all combinations', 'all subsets', 'generate all', 'enumerate'],
    patterns: ['Backtracking'],
    confidence: 99,
    color: '#FB923C',
  },
  {
    keywords: ['connected components', 'union', 'find', 'disjoint', 'belongs to same group'],
    patterns: ['Union-Find (DSU)'],
    confidence: 95,
    color: '#34D399',
  },
  {
    keywords: ['cycle in graph', 'detect cycle', 'has cycle'],
    patterns: ['DFS', 'Union-Find'],
    confidence: 95,
    color: '#34D399',
  },
  {
    keywords: ['shortest path unweighted', 'minimum hops', 'level order', 'nearest', 'level by level'],
    patterns: ['BFS'],
    confidence: 99,
    color: '#34D399',
  },
  {
    keywords: ['shortest path weighted', 'dijkstra', 'minimum distance weighted', 'weighted graph'],
    patterns: ["Dijkstra's Algorithm"],
    confidence: 95,
    color: '#34D399',
  },
  {
    keywords: ['tree traversal', 'inorder', 'preorder', 'postorder', 'dfs tree'],
    patterns: ['DFS (recursive)'],
    confidence: 90,
    color: '#34D399',
  },
  {
    keywords: ['parentheses', 'brackets', 'valid brackets', 'matching', 'balanced'],
    patterns: ['Stack'],
    confidence: 95,
    color: '#94A3B8',
  },
  {
    keywords: ['next greater', 'next smaller', 'previous greater', 'stock span', 'monotonic'],
    patterns: ['Monotonic Stack'],
    confidence: 99,
    color: '#94A3B8',
  },
  {
    keywords: ['meeting rooms', 'interval overlap', 'merge intervals', 'scheduling', 'non-overlapping'],
    patterns: ['Greedy (Sort + Sweep)'],
    confidence: 97,
    color: '#F59E0B',
  },
  {
    keywords: ['palindrome', 'symmetric', 'reverse equals original'],
    patterns: ['Two Pointers (outside-in)', 'DP'],
    confidence: 90,
    color: '#A78BFA',
  },
  {
    keywords: ['anagram', 'character count', 'frequency map', 'permutation of string'],
    patterns: ['Hash Map (frequency)'],
    confidence: 99,
    color: '#A78BFA',
  },
  {
    keywords: ['trie', 'prefix', 'autocomplete', 'word search', 'word dictionary'],
    patterns: ['Trie'],
    confidence: 95,
    color: '#FB923C',
  },
  {
    keywords: ['course schedule', 'dependencies', 'prerequisite', 'order tasks', 'topological'],
    patterns: ['Topological Sort'],
    confidence: 99,
    color: '#34D399',
  },
  {
    keywords: ['lru cache', 'most recently used', 'cache eviction'],
    patterns: ['Hash Map + Doubly Linked List'],
    confidence: 99,
    color: '#A78BFA',
  },
  {
    keywords: ['in-place', 'no extra space', 'constant space', 'remove duplicates'],
    patterns: ['Two Pointers'],
    confidence: 90,
    color: '#A78BFA',
  },
  {
    keywords: ['coin change', 'minimum coins', 'unbounded knapsack'],
    patterns: ['Unbounded Knapsack DP'],
    confidence: 99,
    color: '#F472B6',
  },
  {
    keywords: ['partition', '0/1 knapsack', 'subset sum', 'equal partition'],
    patterns: ['0/1 Knapsack DP'],
    confidence: 99,
    color: '#F472B6',
  },
  {
    keywords: ['longest increasing subsequence', 'lis', 'longest increasing'],
    patterns: ['LIS DP', 'Binary Search (patience sort)'],
    confidence: 99,
    color: '#F472B6',
  },
  {
    keywords: ['longest common subsequence', 'edit distance', 'lcs', 'common substring'],
    patterns: ['2D DP'],
    confidence: 99,
    color: '#F472B6',
  },
  {
    keywords: ['buy sell stock', 'stocks', 'profit maximize'],
    patterns: ['State Machine DP'],
    confidence: 97,
    color: '#F472B6',
  },
  {
    keywords: ['house robber', 'adjacent elements', 'skip adjacent'],
    patterns: ['Linear DP'],
    confidence: 99,
    color: '#F472B6',
  },
  {
    keywords: ['word break', 'segment string', 'dictionary words'],
    patterns: ['DP', 'Trie'],
    confidence: 95,
    color: '#F472B6',
  },
  {
    keywords: ['contiguous', 'subarray', 'sliding'],
    patterns: ['Sliding Window', 'Prefix Sum'],
    confidence: 87,
    color: '#38BDF8',
  },
];

// Constraint-based algorithm selection
interface ConstraintEntry {
  label: string;          // e.g. "n ≤ 10"
  nMax: number;
  complexity: string;
  algorithms: string[];
  color: string;
}

const CONSTRAINTS: ConstraintEntry[] = [
  { label: 'n ≤ 10',         nMax: 10,        complexity: 'O(n!) or O(2ⁿ)',    algorithms: ['Brute Force', 'Backtracking'],                           color: '#FB923C' },
  { label: 'n ≤ 20',         nMax: 20,        complexity: 'O(2ⁿ)',             algorithms: ['Bit Manipulation', 'Backtracking with pruning'],         color: '#FB923C' },
  { label: 'n ≤ 100',        nMax: 100,       complexity: 'O(n³)',             algorithms: ['Floyd-Warshall', '3D DP'],                               color: '#F59E0B' },
  { label: 'n ≤ 1,000',      nMax: 1000,      complexity: 'O(n²)',             algorithms: ['Nested Loops', '2D DP'],                                 color: '#F59E0B' },
  { label: 'n ≤ 10,000',     nMax: 10000,     complexity: 'O(n²)',             algorithms: ['Nested Loops (maybe TLE)', 'consider O(n log n)'],       color: '#F59E0B' },
  { label: 'n ≤ 100,000',    nMax: 100000,    complexity: 'O(n log n)',        algorithms: ['Sorting', 'Binary Search', 'Heap', 'Segment Tree'],      color: '#A78BFA' },
  { label: 'n ≤ 1,000,000',  nMax: 1000000,   complexity: 'O(n)',              algorithms: ['Hash Map', 'Two Pointers', 'Linear DP', 'Prefix Sum'],   color: '#38BDF8' },
  { label: 'n ≤ 10,000,000', nMax: 10000000,  complexity: 'O(n)',              algorithms: ['Linear scan', 'careful optimization'],                  color: '#34D399' },
  { label: 'n > 10⁸',        nMax: Infinity,  complexity: 'O(log n) or O(1)', algorithms: ['Math / Formula', 'Binary Search on Answer'],            color: '#10B981' },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  problemName: string;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const PatternRecogniser: React.FC<Props> = ({ problemName, onClose }) => {
  const [mode, setMode] = useState<'keywords' | 'constraint'>('keywords');
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [constraintInput, setConstraintInput]   = useState('');

  // All unique displayable keyword chips (de-duped)
  const allChips = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    KEYWORD_MAP.forEach(e => e.keywords.forEach(k => {
      if (!seen.has(k)) { seen.add(k); out.push(k); }
    }));
    return out;
  }, []);

  const toggleKw = (kw: string) => {
    setSelectedKeywords(prev => {
      const next = new Set(prev);
      next.has(kw) ? next.delete(kw) : next.add(kw);
      return next;
    });
  };

  // Compute pattern matches from selected keywords
  const keywordMatches = useMemo((): PatternMatch[] => {
    if (selectedKeywords.size === 0) return [];
    const scoreMap = new Map<string, { total: number; count: number; why: string[]; color: string; examples: string[] }>();

    KEYWORD_MAP.forEach(entry => {
      const hit = entry.keywords.filter(k => selectedKeywords.has(k));
      if (hit.length === 0) return;
      entry.patterns.forEach(pattern => {
        const prev = scoreMap.get(pattern) ?? { total: 0, count: 0, why: [], color: entry.color, examples: [] };
        scoreMap.set(pattern, {
          total: prev.total + entry.confidence * hit.length,
          count: prev.count + hit.length,
          why: [...new Set([...prev.why, ...hit.map(k => `"${k}"`)])],
          color: entry.color,
          examples: prev.examples,
        });
      });
    });

    return Array.from(scoreMap.entries())
      .map(([pattern, v]) => ({
        pattern,
        confidence: Math.min(99, Math.round(v.total / v.count)),
        why: `Triggered by: ${v.why.slice(0, 3).join(', ')}`,
        examples: v.examples,
        color: v.color,
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 4);
  }, [selectedKeywords]);

  // Compute constraint match
  const constraintMatch = useMemo((): ConstraintEntry | null => {
    const n = parseFloat(constraintInput.replace(/[^0-9.e^]/gi, '').replace('^', 'e'));
    if (isNaN(n) || n <= 0) return null;
    return CONSTRAINTS.find(c => n <= c.nMax) ?? CONSTRAINTS[CONSTRAINTS.length - 1];
  }, [constraintInput]);

  const hasResults = mode === 'keywords' ? keywordMatches.length > 0 : constraintMatch !== null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex flex-col justify-end"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#F7F6F3]/95 " />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        className="relative z-10 bg-surface rounded-t-[2.5rem] border-t border-[#E8E5DF] shadow-[0_-20px_60px_rgba(0,0,0,0.5)] max-h-[90vh] flex flex-col"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-[#F0EEE9]" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-6 pb-3 pt-2 shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={12} className="text-[#F59E0B]" fill="currentColor" />
              <span className="text-[12px] uppercase tracking-widest text-[#F59E0B] font-bold">Pattern Recogniser</span>
            </div>
            <h2 className="font-ui font-bold text-lg leading-tight truncate">{problemName}</h2>
            <p className="text-[11px] text-[#6B7280] mt-0.5">Identify the DSA pattern to apply</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-[#F0EEE9] hover:bg-[#F0EEE9] transition-colors mt-1 shrink-0">
            <X size={16} className="text-[#6B7280]" />
          </button>
        </div>

        {/* Mode tabs */}
        <div className="px-6 mb-4 shrink-0">
          <div className="flex gap-2 p-1 bg-[#F0EEE9] rounded-2xl">
            {(['keywords', 'constraint'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${
                  mode === m ? 'bg-[#F59E0B] text-background' : 'text-[#6B7280] hover:text-[#374151]'
                }`}
              >
                {m === 'keywords' ? '🔍 Keywords' : '📊 Constraint n'}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-6 pb-8">

          {/* ── KEYWORD MODE ── */}
          {mode === 'keywords' && (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[12px] uppercase tracking-widest text-[#78716C] font-bold">
                  Tap keywords you see in the problem
                </p>
                {selectedKeywords.size > 0 && (
                  <button
                    onClick={() => setSelectedKeywords(new Set())}
                    className="flex items-center gap-1 text-[12px] text-[#78716C] hover:text-[#6B7280]"
                  >
                    <RotateCcw size={10} />
                    Clear
                  </button>
                )}
              </div>

              {/* Keyword chips */}
              <div className="flex flex-wrap gap-2 mb-5">
                {allChips.map(kw => {
                  const active = selectedKeywords.has(kw);
                  const entry = KEYWORD_MAP.find(e => e.keywords.includes(kw));
                  return (
                    <button
                      key={kw}
                      onClick={() => toggleKw(kw)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all border ${
                        active
                          ? 'border-transparent text-background font-bold'
                          : 'bg-[#F0EEE9] border-[#E8E5DF] text-[#6B7280] hover:border-[#E8E5DF]'
                      }`}
                      style={active ? { backgroundColor: entry?.color ?? '#F59E0B' } : undefined}
                    >
                      {kw}
                    </button>
                  );
                })}
              </div>

              {/* Results */}
              <AnimatePresence>
                {keywordMatches.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <p className="text-[12px] uppercase tracking-widest text-[#78716C] font-bold mb-3">
                      {keywordMatches.length} pattern{keywordMatches.length !== 1 ? 's' : ''} detected
                    </p>
                    {keywordMatches.map((match, i) => (
                      <PatternCard key={match.pattern} match={match} rank={i} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {selectedKeywords.size > 0 && keywordMatches.length === 0 && (
                <p className="text-center text-[#78716C] text-sm py-4">No pattern detected for selected keywords.</p>
              )}

              {selectedKeywords.size === 0 && (
                <div className="text-center py-6">
                  <p className="text-[#A8A29E] text-sm leading-relaxed">
                    Select keywords from the problem statement<br />
                    to identify which pattern applies
                  </p>
                </div>
              )}
            </>
          )}

          {/* ── CONSTRAINT MODE ── */}
          {mode === 'constraint' && (
            <>
              <p className="text-[12px] uppercase tracking-widest text-[#78716C] font-bold mb-3">
                Enter the input size n from constraints
              </p>

              {/* Input */}
              <div className="relative mb-5">
                <input
                  value={constraintInput}
                  onChange={e => setConstraintInput(e.target.value)}
                  placeholder="e.g. 100000 or 1e5"
                  className="w-full bg-[#F0EEE9] border border-[#E8E5DF] rounded-xl px-4 py-3 text-sm text-[#1C1917] placeholder:text-[#78716C] focus:outline-none focus:border-[#F59E0B]/40 font-mono"
                  inputMode="numeric"
                />
              </div>

              {/* Quick n presets */}
              <div className="flex flex-wrap gap-2 mb-5">
                {['10', '100', '1000', '10000', '100000', '1000000', '1e8'].map(v => (
                  <button
                    key={v}
                    onClick={() => setConstraintInput(v)}
                    className={`px-3 py-1 rounded-full text-[11px] font-mono border transition-all ${
                      constraintInput === v
                        ? 'border-[#F59E0B]/50 text-[#F59E0B] bg-[#F59E0B]/10'
                        : 'border-[#E8E5DF] text-[#6B7280] bg-[#F0EEE9] hover:border-[#E8E5DF]'
                    }`}
                  >
                    n={v}
                  </button>
                ))}
              </div>

              {/* Result */}
              <AnimatePresence>
                {constraintMatch && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div
                      className="rounded-2xl border p-4 mb-4"
                      style={{ borderColor: `${constraintMatch.color}30`, backgroundColor: `${constraintMatch.color}08` }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className="font-ui font-bold text-lg"
                          style={{ color: constraintMatch.color }}
                        >
                          {constraintMatch.label}
                        </span>
                        <span
                          className="text-[12px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest font-mono"
                          style={{ color: constraintMatch.color, backgroundColor: `${constraintMatch.color}15` }}
                        >
                          {constraintMatch.complexity}
                        </span>
                      </div>
                      <p className="text-[12px] uppercase tracking-widest text-[#78716C] font-bold mb-2">
                        Algorithms to Consider
                      </p>
                      <div className="space-y-1.5">
                        {constraintMatch.algorithms.map((algo, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <ChevronRight size={12} style={{ color: constraintMatch.color }} />
                            <span className="text-sm text-[#292524]">{algo}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Complexity reference */}
                    <div className="bg-[#F0EEE9] border border-[#E8E5DF] rounded-2xl p-4">
                      <p className="text-[12px] uppercase tracking-widest text-[#78716C] font-bold mb-3">
                        Time Limit Reference
                      </p>
                      <div className="space-y-1.5 font-mono text-[11px]">
                        {[
                          { ops: '10⁵',  time: '~instant',    ok: true  },
                          { ops: '10⁶',  time: '~0.01s',      ok: true  },
                          { ops: '10⁷',  time: '~0.1s',       ok: true  },
                          { ops: '10⁸',  time: '~1s (limit)', ok: true  },
                          { ops: '10⁹',  time: '~10s (TLE!)', ok: false },
                        ].map(row => (
                          <div key={row.ops} className="flex justify-between">
                            <span className="text-[#6B7280]">{row.ops} ops</span>
                            <span className={row.ok ? 'text-[#6B7280]' : 'text-red-400'}>{row.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!constraintMatch && constraintInput.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-[#A8A29E] text-sm leading-relaxed">
                    Type the input size from the problem constraints<br />
                    to see which complexity class to target
                  </p>
                </div>
              )}
            </>
          )}

        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Pattern Card ─────────────────────────────────────────────────────────────

const PatternCard: React.FC<{ match: PatternMatch; rank: number }> = ({ match, rank }) => {
  const barWidth = match.confidence;
  return (
    <div
      className="rounded-2xl border p-4"
      style={{
        borderColor: rank === 0 ? `${match.color}40` : `${match.color}15`,
        backgroundColor: rank === 0 ? `${match.color}10` : `${match.color}05`,
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {rank === 0 && <span className="text-[12px]">🎯</span>}
          <span
            className="font-ui font-bold text-sm"
            style={{ color: match.color }}
          >
            {match.pattern}
          </span>
        </div>
        <span
          className="text-[11px] font-bold font-mono shrink-0 ml-2"
          style={{ color: match.color }}
        >
          {match.confidence}%
        </span>
      </div>

      {/* Confidence bar */}
      <div className="h-1 bg-[#F0EEE9] rounded-full mb-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${barWidth}%` }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="h-full rounded-full"
          style={{ backgroundColor: match.color }}
        />
      </div>

      <p className="text-[11px] text-[#6B7280] leading-snug">{match.why}</p>
    </div>
  );
};
