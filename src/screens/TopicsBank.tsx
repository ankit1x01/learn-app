import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, ChevronRight, ExternalLink, X, Layers, Sparkles, ScanSearch, CheckCircle2, Circle, StickyNote, Image, BarChart3, Ruler, FileText, Link2, RefreshCw, Settings2, Package, AppWindow, Mountain, Lightbulb, TreePine, Network, Zap, Leaf, ScrollText, Star } from 'lucide-react';
import dsaData from '../data/dsa_data.json';
import { SharePromptSheet } from '../components/SharePromptSheet';
import { PatternRecogniser } from '../components/PatternRecogniser';
import { ContentSheet } from '../components/ContentSheet';
import { loadTopicsRead, markTopicRead, unmarkTopicRead, loadContentSummary } from '../db/store';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Problem {
  name: string;
  link: string;
  resources: string[];
  practices: string[];
}

interface Topic {
  topic: string;
  problems: Problem[];
}

interface Group {
  group: string;
  topics: Topic[];
}

type Screen = 'dashboard' | 'session' | 'encoding' | 'map' | 'recall' | 'complete'
            | 'elite' | 'stress' | 'ghana' | 'distractor' | 'errors' | 'mock' | 'preexam' | 'topics';

interface Props {
  setScreen: (s: Screen) => void;
  initialSearch?: string;
}

// ─── Group metadata ──────────────────────────────────────────────────────────

const GROUP_META: Record<number, { icon: React.ElementType; color: string; bg: string; tier: 1 | 2 | 3 }> = {
  0:  { icon: Layers,     color: 'text-[#6B7280]',  bg: 'bg-[#F3F4F6]',  tier: 1 },
  1:  { icon: BarChart3,  color: 'text-[#6B7280]',  bg: 'bg-[#F3F4F6]',  tier: 1 },
  2:  { icon: Ruler,      color: 'text-[#1D4ED8]',  bg: 'bg-[#EFF6FF]',  tier: 1 },
  3:  { icon: Search,     color: 'text-[#1D4ED8]',  bg: 'bg-[#EFF6FF]',  tier: 1 },
  4:  { icon: FileText,   color: 'text-[#0E7490]',  bg: 'bg-[#ECFEFF]',  tier: 2 },
  5:  { icon: Link2,      color: 'text-[#0E7490]',  bg: 'bg-[#ECFEFF]',  tier: 2 },
  6:  { icon: RefreshCw,  color: 'text-[#0E7490]',  bg: 'bg-[#ECFEFF]',  tier: 2 },
  7:  { icon: Settings2,  color: 'text-[#0E7490]',  bg: 'bg-[#ECFEFF]',  tier: 2 },
  8:  { icon: Package,    color: 'text-[#0E7490]',  bg: 'bg-[#ECFEFF]',  tier: 2 },
  9:  { icon: AppWindow,  color: 'text-[#1D4ED8]',  bg: 'bg-[#EFF6FF]',  tier: 1 },
  10: { icon: Mountain,   color: 'text-[#166534]',  bg: 'bg-[#F0FDF4]',  tier: 2 },
  11: { icon: Lightbulb,  color: 'text-[#B45309]',  bg: 'bg-[#FFFBEB]',  tier: 2 },
  12: { icon: TreePine,   color: 'text-[#166534]',  bg: 'bg-[#F0FDF4]',  tier: 1 },
  13: { icon: ScanSearch, color: 'text-[#166534]',  bg: 'bg-[#F0FDF4]',  tier: 2 },
  14: { icon: Network,    color: 'text-[#166534]',  bg: 'bg-[#F0FDF4]',  tier: 1 },
  15: { icon: Zap,        color: 'text-[#B45309]',  bg: 'bg-[#FFFBEB]',  tier: 1 },
  16: { icon: Leaf,       color: 'text-[#166534]',  bg: 'bg-[#F0FDF4]',  tier: 3 },
  17: { icon: ScrollText, color: 'text-[#B45309]',  bg: 'bg-[#FFFBEB]',  tier: 3 },
};

// pyqTier per problem (same logic as generation script)
const GROUP_TIER: Record<number, 1 | 2 | 3> = {
  0:1, 1:1, 2:1, 3:1, 9:1, 12:1, 14:1, 15:1,
  4:2, 5:2, 6:2, 7:2, 8:2, 10:2, 11:2, 13:2,
  16:3, 17:3,
};

const TIER_LABEL: Record<1|2|3, string> = { 1: 'Core', 2: 'Important', 3: 'Advanced' };
const TIER_COLOR: Record<1|2|3, string> = {
  1: 'text-[#B45309] bg-[#FFFBEB]',
  2: 'text-[#1D4ED8] bg-[#EFF6FF]',
  3: 'text-[#6B7280] bg-[#F3F4F6]',
};

// ─── Stats helpers ────────────────────────────────────────────────────────────

const data = dsaData as Group[];

const STATS = (() => {
  let t1 = 0, t2 = 0, t3 = 0, total = 0;
  data.forEach((g, i) => {
    const tier = GROUP_TIER[i] ?? 2;
    const count = g.topics.reduce((s, t) => s + t.problems.length, 0);
    total += count;
    if (tier === 1) t1 += count;
    else if (tier === 2) t2 += count;
    else t3 += count;
  });
  return { total, t1, t2, t3 };
})();

// ─── Components ──────────────────────────────────────────────────────────────

const TierPill = ({ tier }: { tier: 1 | 2 | 3 }) => (
  <span className={`px-2 py-0.5 rounded-full text-[12px] font-bold uppercase tracking-normal ${TIER_COLOR[tier]}`}>
    {TIER_LABEL[tier]}
  </span>
);

// ─── Main Screen ─────────────────────────────────────────────────────────────

export const TopicsBank: React.FC<Props> = ({ setScreen, initialSearch = '' }) => {
  const [search, setSearch]           = useState(initialSearch);
  const [tierFilter, setTierFilter]   = useState<1|2|3|0>(0); // 0 = all
  const [openGroups, setOpenGroups]   = useState<Set<number>>(new Set());
  const [openTopics, setOpenTopics]   = useState<Set<string>>(new Set());

  // ── Offline DB state ──────────────────────────────────────────────────────
  const [topicsRead, setTopicsRead]   = useState<Set<string>>(new Set());
  // Map<problemName → {note, imageCount}>
  const [contentMap, setContentMap]   = useState<Map<string, { note: string; imageCount: number }>>(new Map());

  useEffect(() => {
    // Load read status
    loadTopicsRead().then(s => setTopicsRead(s)).catch(console.error);
    // Load content summaries for all problems
    const allKeys = (dsaData as Group[]).flatMap(g =>
      g.topics.flatMap(t => t.problems.map(p => p.name))
    );
    loadContentSummary(allKeys).then(m => setContentMap(m)).catch(console.error);
  }, []);

  const handleToggleRead = async (topicKey: string) => {
    if (topicsRead.has(topicKey)) {
      await unmarkTopicRead(topicKey);
      setTopicsRead(prev => { const n = new Set(prev); n.delete(topicKey); return n; });
    } else {
      await markTopicRead(topicKey);
      setTopicsRead(prev => new Set([...prev, topicKey]));
    }
  };

  const refreshContent = async (refKey: string) => {
    const fresh = await loadContentSummary([refKey]);
    setContentMap(prev => {
      const next = new Map(prev);
      const val = fresh.get(refKey);
      if (val) next.set(refKey, val);
      else next.delete(refKey);
      return next;
    });
  };

  const toggleGroup = (i: number) =>
    setOpenGroups(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });

  const toggleTopic = (key: string) =>
    setOpenTopics(s => { const n = new Set(s); n.has(key) ? n.delete(key) : n.add(key); return n; });

  const q = search.trim().toLowerCase();

  // Filter data
  const filtered = useMemo(() => {
    return data.map((group, gi) => {
      const tier = GROUP_TIER[gi] ?? 2;
      if (tierFilter !== 0 && tier !== tierFilter) return null;

      const topics = group.topics.map(topic => {
        const problems = topic.problems.filter(p =>
          !q || p.name.toLowerCase().includes(q) || topic.topic.toLowerCase().includes(q) || group.group.toLowerCase().includes(q)
        );
        if (problems.length === 0 && q) return null;
        return { ...topic, problems };
      }).filter(Boolean) as (Topic & { problems: Problem[] })[];

      if (topics.length === 0) return null;
      return { group, gi, tier, topics };
    }).filter(Boolean) as { group: Group; gi: number; tier: 1|2|3; topics: (Topic & { problems: Problem[] })[] }[];
  }, [q, tierFilter]);

  // Auto-open groups when searching
  const effectiveOpenGroups = useMemo(() => {
    if (q) {
      const s = new Set<number>();
      filtered.forEach(f => s.add(f.gi));
      return s;
    }
    return openGroups;
  }, [q, filtered, openGroups]);

  const effectiveOpenTopics = useMemo(() => {
    if (q) {
      const s = new Set<string>();
      filtered.forEach(f => f.topics.forEach(t => s.add(`${f.gi}-${t.topic}`)));
      return s;
    }
    return openTopics;
  }, [q, filtered, openTopics]);

  const totalVisible = filtered.reduce((s, f) => s + f.topics.reduce((ss, t) => ss + t.problems.length, 0), 0);

  return (
    <div className="pt-16 pb-32 max-w-md mx-auto">

      {/* ── Sticky header ── */}
      <div className="sticky top-14 z-30 bg-[#F7F6F3]/95  px-6 pt-4 pb-3 border-b border-[#E8E5DF]">
        {/* Title */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-ui font-bold">Problem Bank</h1>
            <p className="text-[12px] text-[#6B7280] font-medium">
              {STATS.total} problems · {data.length} groups
            </p>
          </div>
          <div className="flex gap-2 text-center">
            <div className="px-2.5 py-1.5 rounded-lg bg-[#FFFBEB] border border-[#FDE68A]">
              <div className="text-[13px] font-bold text-[#B45309]">{STATS.t1}</div>
              <div className="text-[12px] text-[#B45309] font-medium">Core</div>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE]">
              <div className="text-[13px] font-bold text-[#1D4ED8]">{STATS.t2}</div>
              <div className="text-[12px] text-[#1D4ED8] font-medium">Imp</div>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg bg-[#F3F4F6] border border-[#E5E7EB]">
              <div className="text-[13px] font-bold text-[#6B7280]">{STATS.t3}</div>
              <div className="text-[12px] text-[#6B7280] font-medium">Adv</div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search problems, topics..."
            className="w-full bg-white border border-[#E8E5DF] rounded-xl pl-9 pr-9 py-2.5 text-[14px] text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#2563EB]"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C]">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Tier filter pills */}
        <div className="flex gap-2">
          {([0, 1, 2, 3] as const).map(t => (
            <button
              key={t}
              onClick={() => setTierFilter(prev => prev === t ? 0 : t)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                tierFilter === t
                  ? t === 0 ? 'bg-[#1C1917] text-white'
                  : t === 1 ? 'bg-[#B45309] text-white'
                  : t === 2 ? 'bg-[#1D4ED8] text-white'
                  : 'bg-[#6B7280] text-white'
                  : 'bg-[#F0EEE9] text-[#6B7280] border border-[#E8E5DF]'
              }`}
            >
              {t === 0 ? 'All' : t === 1 ? 'Core' : t === 2 ? 'Important' : 'Advanced'}
            </button>
          ))}
          {(q || tierFilter !== 0) && (
            <span className="ml-auto text-[12px] text-[#78716C] self-center font-medium">
              {totalVisible} shown
            </span>
          )}
        </div>
      </div>

      {/* ── Group list ── */}
      <div className="px-4 pt-4 space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#78716C] text-[14px]">
            No problems match "{search}"
          </div>
        )}

        {filtered.map(({ group, gi, tier, topics }) => {
          const meta = GROUP_META[gi] ?? { icon: Layers, color: 'text-primary', bg: 'bg-primary/10', tier: 2 as const };
          const isOpen = effectiveOpenGroups.has(gi);
          const groupProblemCount = topics.reduce((s, t) => s + t.problems.length, 0);

          return (
            <div key={gi} className="card rounded-2xl overflow-hidden">
              {/* Group header */}
              <button
                onClick={() => toggleGroup(gi)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-[#F7F6F3] transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${meta.bg}`}>
                  <meta.icon size={16} className={meta.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm leading-tight">{group.group}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[12px] text-[#6B7280]">
                      {topics.length} topic{topics.length !== 1 ? 's' : ''} · {groupProblemCount} problems
                    </span>
                    <TierPill tier={tier} />
                  </div>
                </div>
                {/* Progress bar — fraction of total */}
                <div className="shrink-0 flex items-center gap-2">
                  <div className="w-12 h-1 bg-[#E8E5DF] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${meta.color.replace('text-', 'bg-')}`}
                      style={{ width: `${(groupProblemCount / STATS.total) * 100 * 5}%`, maxWidth: '100%' }}
                    />
                  </div>
                  {isOpen
                    ? <ChevronDown size={14} className="text-[#78716C]" />
                    : <ChevronRight size={14} className="text-[#78716C]" />}
                </div>
              </button>

              {/* Topics */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-[#E8E5DF]">
                      {topics.map((topic, ti) => {
                        const topicKey = `${gi}-${topic.topic}`;
                        const isTopicOpen = effectiveOpenTopics.has(topicKey);

                        return (
                          <div key={ti} className="border-b border-[#F0EEE9] last:border-0">
                            {/* Topic row */}
                            <div className="flex items-center">
                              <button
                                onClick={() => toggleTopic(topicKey)}
                                className="flex-1 flex items-center gap-3 px-5 py-3 text-left hover:bg-[#F7F6F3] transition-colors"
                              >
                                <Layers size={12} className={`shrink-0 ${meta.color}`} />
                                <span className="flex-1 text-[13px] text-[#374151] font-medium leading-snug">{topic.topic}</span>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className={`px-2 py-0.5 rounded-full text-[12px] font-bold ${meta.bg} ${meta.color}`}>
                                    {topic.problems.length}
                                  </span>
                                  {isTopicOpen
                                    ? <ChevronDown size={12} className="text-[#A8A29E]" />
                                    : <ChevronRight size={12} className="text-[#A8A29E]" />}
                                </div>
                              </button>
                              {/* Mark topic as read */}
                              <button
                                onClick={() => handleToggleRead(topicKey)}
                                className="shrink-0 px-3 py-3 hover:bg-[#F7F6F3] transition-colors"
                                title={topicsRead.has(topicKey) ? 'Mark unread' : 'Mark as read'}
                              >
                                {topicsRead.has(topicKey)
                                  ? <CheckCircle2 size={16} className="text-[#15803D]" />
                                  : <Circle size={16} className="text-[#A8A29E]" />}
                              </button>
                            </div>

                            {/* Problems */}
                            <AnimatePresence>
                              {isTopicOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.15 }}
                                  className="overflow-hidden"
                                >
                                  <div className="pb-2">
                                    {topic.problems.map((problem, pi) => (
                                      <ProblemRow
                                        key={pi}
                                        problem={problem}
                                        tier={tier}
                                        meta={meta}
                                        index={pi}
                                        subject={group.group}
                                        chapter={topic.topic}
                                        content={contentMap.get(problem.name)}
                                        onContentChange={() => refreshContent(problem.name)}
                                      />
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* ── Bottom summary ── */}
      <div className="px-6 mt-6">
        <div className="card rounded-2xl p-4">
          <p className="text-[12px] uppercase tracking-widest text-[#78716C] font-bold mb-3">Frequency Distribution</p>
          <div className="space-y-2">
            {([1, 2, 3] as const).map(t => {
              const count = t === 1 ? STATS.t1 : t === 2 ? STATS.t2 : STATS.t3;
              const pct = Math.round((count / STATS.total) * 100);
              return (
                <div key={t}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className={TIER_COLOR[t].split(' ')[0]}>{TIER_LABEL[t]}</span>
                    <span className="text-[#6B7280]">{count} problems · {pct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#E8E5DF] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        t === 1 ? 'bg-[#B45309]' : t === 2 ? 'bg-[#1D4ED8]' : 'bg-[#9CA3AF]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[12px] text-[#A8A29E] mt-3 leading-relaxed">
            Core = must-know patterns asked in every interview loop.
            Important = asked frequently. Advanced = competitive / rare.
          </p>
        </div>
      </div>

    </div>
  );
};

// ─── Problem Row ──────────────────────────────────────────────────────────────

const ProblemRow: React.FC<{
  problem: Problem;
  tier: 1 | 2 | 3;
  meta: { color: string; bg: string };
  index: number;
  subject: string;
  chapter: string;
  content?: { note: string; imageCount: number };
  onContentChange: () => void;
}> = ({ problem, tier, meta, index, subject, chapter, content, onContentChange }) => {
  const [expanded, setExpanded]       = useState(false);
  const [showAI, setShowAI]           = useState(false);
  const [showPattern, setShowPattern] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const hasResources = problem.resources.length > 0;
  const hasNote  = !!(content?.note);
  const imgCount = content?.imageCount ?? 0;

  return (
    <div className="mx-5 mb-1">
      <div className={`flex items-start gap-1 rounded-xl transition-colors ${expanded ? 'bg-[#F0EEE9]' : ''}`}>
        {/* Main row */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex-1 flex items-start gap-3 py-2.5 pl-3 pr-1 text-left"
        >
          <span className="text-[11px] text-[#A8A29E] font-mono mt-0.5 w-5 shrink-0 text-right">
            {index + 1}
          </span>
          <span className="flex-1 text-[13px] text-[#1C1917] leading-snug font-reading">{problem.name}</span>
          <div className="flex items-center gap-1.5 shrink-0">
            {tier === 1 && <span className="text-[12px] font-bold text-[#F59E0B]">⭐</span>}
            {hasNote && <StickyNote size={10} className="text-[#0E7490]" />}
            {imgCount > 0 && <Image size={10} className="text-[#7C3AED]" />}
            {hasResources && (
              <span className={`text-[12px] font-bold ${meta.color} opacity-60`}>{problem.resources.length}R</span>
            )}
            <ChevronDown
              size={11}
              className={`text-[#A8A29E] transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </div>
        </button>

        {/* Notes button */}
        <button
          onClick={() => setShowContent(true)}
          className={`shrink-0 mt-1.5 p-1.5 rounded-lg transition-opacity hover:opacity-80 ${
            hasNote || imgCount > 0 ? 'bg-[#ECFEFF]' : 'bg-[#F0EEE9]'
          }`}
          title="Notes & Images"
        >
          <StickyNote size={12} className={hasNote || imgCount > 0 ? 'text-[#0E7490]' : 'text-[#78716C]'} />
        </button>

        {/* Pattern button */}
        <button
          onClick={() => setShowPattern(true)}
          className="shrink-0 mt-1.5 p-1.5 rounded-lg bg-[#F59E0B]/10 hover:opacity-80 transition-opacity"
          title="Recognise Pattern"
        >
          <ScanSearch size={12} className="text-[#F59E0B]" />
        </button>

        {/* AI button */}
        <button
          onClick={() => setShowAI(true)}
          className={`shrink-0 mt-1.5 mr-2 p-1.5 rounded-lg ${meta.bg} hover:opacity-80 transition-opacity`}
          title="Learn with AI"
        >
          <Sparkles size={12} className={meta.color} />
        </button>
      </div>

      {/* Expanded: resources */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="ml-8 pb-2 space-y-1">
              {hasResources
                ? problem.resources.map((url, i) => (
                    <ResourceLink key={i} url={url} index={i} color={meta.color} />
                  ))
                : <p className="text-[11px] text-[#A8A29E] py-1">No resources linked yet.</p>
              }
              {/* Action buttons inside expanded */}
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                <button
                  onClick={() => { setExpanded(false); setShowContent(true); }}
                  className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-[#ECFEFF] border border-[#A5F3FC]"
                >
                  <StickyNote size={10} className="text-[#0E7490]" />
                  <span className="text-[12px] font-bold uppercase tracking-normal text-[#0E7490]">
                    Notes{imgCount > 0 ? ` +${imgCount}` : ''}
                  </span>
                </button>
                <button
                  onClick={() => { setExpanded(false); setShowPattern(true); }}
                  className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/10"
                >
                  <ScanSearch size={10} className="text-[#F59E0B]" />
                  <span className="text-[12px] font-bold uppercase tracking-normal text-[#F59E0B]">
                    Pattern
                  </span>
                </button>
                <button
                  onClick={() => { setExpanded(false); setShowAI(true); }}
                  className={`col-span-2 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg ${meta.bg} border border-[#E8E5DF]`}
                >
                  <Sparkles size={11} className={meta.color} />
                  <span className={`text-[12px] font-bold uppercase tracking-widest ${meta.color}`}>
                    AI Learn
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Sheet */}
      <AnimatePresence>
        {showAI && (
          <SharePromptSheet
            conceptName={problem.name}
            subject={subject}
            chapter={chapter}
            onClose={() => setShowAI(false)}
          />
        )}
      </AnimatePresence>

      {/* Pattern Recogniser Sheet */}
      <AnimatePresence>
        {showPattern && (
          <PatternRecogniser
            problemName={problem.name}
            onClose={() => setShowPattern(false)}
          />
        )}
      </AnimatePresence>

      {/* Notes & Images Sheet */}
      <AnimatePresence>
        {showContent && (
          <ContentSheet
            refKey={problem.name}
            label={problem.name}
            onClose={() => { setShowContent(false); onContentChange(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Resource Link ────────────────────────────────────────────────────────────

const ResourceLink: React.FC<{ url: string; index: number; color: string }> = ({ url, index, color }) => {
  const label = url.includes('youtu') ? `▶ Video ${index + 1}`
    : url.includes('leetcode') ? '🔗 LeetCode'
    : url.includes('takeuforward') ? '📘 TUF Article'
    : `🔗 Resource ${index + 1}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 text-[11px] ${color} opacity-70 hover:opacity-100 transition-opacity py-0.5`}
    >
      <ExternalLink size={10} className="shrink-0" />
      <span className="truncate">{label}</span>
    </a>
  );
};
