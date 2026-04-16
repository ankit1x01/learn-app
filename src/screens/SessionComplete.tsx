import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { isDue } from '../core/fsrs';
import { CONFIG, totalConcepts } from '../lib/config';
import type { Screen } from '../types';
import type { SessionItem, SubjectStats } from '../core/types';
import { TrendingUp, Calendar, ArrowRight, CheckCircle2, Award, Flame, BarChart2, GitBranch, Layers, Link2, Zap, Share2 } from 'lucide-react';
import { Share } from '@capacitor/share';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const SUBJECT_ICONS: Record<string, React.ElementType> = {
  'Foundations':               Layers,
  'Arrays & Search':           BarChart2,
  'Strings & Data Structures': Link2,
  'Trees & Graphs':            GitBranch,
  'DP & Greedy':               Zap,
};

const JKS = "'Plus Jakarta Sans', system-ui, sans-serif";

export const SessionComplete = ({
  setScreen,
  session,
  globalStats,
}: {
  setScreen: (s: Screen) => void;
  session: SessionItem[];
  globalStats: Record<string, SubjectStats>;
}) => {
  const subjectBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    CONFIG.subjects.forEach(s => { counts[s.name] = 0; });
    session.forEach(s => { counts[s.concept.subject] = (counts[s.concept.subject] ?? 0) + 1; });
    const pct: Record<string, number> = {};
    CONFIG.subjects.forEach(s => {
      pct[s.name] = Math.round(((counts[s.name] ?? 0) / session.length) * 100);
    });
    return { counts, pct };
  }, [session]);

  const totalAutomatic = Object.values(globalStats).reduce((s, x) => s + x.auto, 0);

  const handleShare = async () => {
    Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
    await Share.share({
      title: 'CHITTA Spaced Repetition',
      text: `I just completed a hardcore learning session! I now have ${totalAutomatic} concepts fully locked into my automatic long-term memory for NEET 2026. Join me on CHITTA!`,
      url: 'https://chitta.app/',
    }).catch(() => {});
  };

  return (
    <div className="pt-14 pb-28 px-4 max-w-md mx-auto">

      {/* ── Top Nav Actions ── */}
      <div className="flex w-full justify-between items-center mb-6">
        <h2 className="text-xl font-bold mb-3" style={{ fontFamily: JKS, color: 'var(--color-on-surface)' }}>Overview</h2>
        <button onClick={handleShare} className="p-2.5 text-[var(--color-on-surface-variant)] rounded-full active:scale-95 transition-transform" style={{ background: 'var(--color-surface-variant)' }} aria-label="Share Overall Progress">
          <Share2 size={18} />
        </button>
      </div>

      {/* ── Hero card ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="card p-6 mb-4 text-center mt-5"
        style={{ background: 'var(--color-success-container)', border: '1px solid var(--color-success-container)' }}
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white border mx-auto mb-3" style={{ borderColor: 'var(--color-success-container)' }}>
          <Award size={28} style={{ color: 'var(--color-success)' }} />
        </div>
        <p className="text-[13px] font-semibold mb-1" style={{ fontFamily: JKS, color: 'var(--color-success)' }}>
          Session Complete
        </p>
        <h1 className="text-[52px] font-bold tabular-nums leading-none mb-1" style={{ fontFamily: JKS, color: 'var(--color-on-surface)' }}>
          94<span className="text-[24px] font-medium" style={{ color: 'var(--color-on-surface-muted)' }}>%</span>
        </h1>
        <p className="text-[13px]" style={{ color: 'var(--color-on-surface-muted)' }}>Focus Intensity · Excellent</p>
      </motion.div>

      {/* ── Mastery progress ── */}
      <div className="card p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-success-container)' }}>
            <TrendingUp size={15} style={{ color: 'var(--color-success)' }} />
          </div>
          <span className="text-[13px] font-semibold" style={{ fontFamily: JKS, color: 'var(--color-on-surface-muted)' }}>
            Total Mastered
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-[36px] font-bold tabular-nums" style={{ fontFamily: JKS, color: 'var(--color-on-surface)' }}>
            {totalAutomatic}
          </span>
          <span className="text-[14px] font-semibold flex items-center gap-1" style={{ color: 'var(--color-success)' }}>
            +12 today <Flame size={13} style={{ color: 'var(--color-warning)' }} />
          </span>
          <span className="ml-auto text-[12px]" style={{ color: 'var(--color-on-surface-muted)' }}>/ {totalConcepts}</span>
        </div>
        <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--color-success)' }}
            initial={{ width: 0 }}
            animate={{ width: `${(totalAutomatic / totalConcepts) * 100}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* ── Subject mix ── */}
      <div className="card p-5 mb-4">
        <p className="text-[13px] font-semibold mb-3" style={{ fontFamily: JKS, color: 'var(--color-on-surface-muted)' }}>
          Subject Mix
        </p>
        <div className="flex gap-2">
          {CONFIG.subjects.map(s => {
            const Icon = SUBJECT_ICONS[s.name] ?? BarChart2;
            return (
              <div
                key={s.name}
                className="flex-1 text-center py-3 rounded-xl border"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="flex justify-center mb-1">
                  <Icon size={16} className={s.color} />
                </div>
                <div className="text-[16px] font-bold tabular-nums" style={{ fontFamily: JKS, color: 'var(--color-on-surface)' }}>
                  {subjectBreakdown.pct[s.name]}%
                </div>
                <div className="text-[11px]" style={{ color: 'var(--color-on-surface-muted)' }}>{subjectBreakdown.counts[s.name]}Q</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Questions',  value: session.length, color: 'var(--color-on-surface)' },
          { label: 'Accuracy',   value: '72%',          color: '#2563EB' },
          { label: 'Mastered',   value: '+12',           color: '#15803D' },
          { label: 'Need Review',value: '+4',            color: '#B45309' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            className="card p-4"
          >
            <p className="text-[12px] text-[#A8A29E] mb-1" style={{ fontFamily: JKS }}>{stat.label}</p>
            <span className="text-[28px] font-bold tabular-nums" style={{ color: stat.color, fontFamily: JKS }}>
              {stat.value}
            </span>
          </motion.div>
        ))}
      </div>

      {/* ── AI Insight ── */}
      <div className="card p-4 mb-4" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-[#BFDBFE] shrink-0">
            <CheckCircle2 size={18} className="text-[#2563EB]" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#2563EB] mb-1" style={{ fontFamily: JKS }}>
              AI Insight
            </p>
            <p className="prose" style={{ fontSize: '14px', lineHeight: '1.75' }}>
              Patterns rated <strong>"Got Stuck"</strong> have been re-queued. Focus on encoding the trigger conditions — not just recognising the pattern name.
            </p>
          </div>
        </div>
      </div>

      {/* ── Tomorrow preview ── */}
      {(() => {
        const dueCount = CONFIG.concepts.filter(c => isDue(c)).length;
        const newCount = CONFIG.concepts.filter(c => c.stage === 'Unseen' && c.pyqTier === 1).length;
        return (
          <div className="card p-4 mb-5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#FFFBEB] border border-[#FDE68A] shrink-0">
              <Calendar size={16} className="text-[#B45309]" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#1C1917]" style={{ fontFamily: JKS }}>
                {dueCount + Math.min(newCount, 6)} concepts queued tomorrow
              </p>
              <p className="text-[12px] text-[#B45309]">{dueCount} due for review · {Math.min(newCount, 6)} new Tier 1</p>
            </div>
          </div>
        );
      })()}

      {/* ── CTA ── */}
      <button
        onClick={() => setScreen('dashboard')}
        className="btn-primary"
      >
        Back to Dashboard <ArrowRight size={16} />
      </button>
    </div>
  );
};
