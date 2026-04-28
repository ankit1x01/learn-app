import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { isDue } from '../core/fsrs';
import { getCalibrationReport } from '../core/metacognition';
import { CONFIG, totalConcepts } from '../lib/config';
import type { Screen } from '../types';
import type { SessionItem, SubjectStats, Concept } from '../core/types';

import { Share } from '@capacitor/share';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const JKS = "'Plus Jakarta Sans', system-ui, sans-serif";

export const SessionComplete = ({
  setScreen,
  session,
  globalStats,
  concepts,
}: {
  setScreen: (s: Screen) => void;
  session: SessionItem[];
  globalStats: Record<string, SubjectStats>;
  concepts?: Concept[]; // live concepts for tomorrow preview
}) => {
  // Compute real session statistics from ratings stored on session items
  const sessionStats = useMemo(() => {
    const answered   = session.filter(s => s.responseTimeMs !== undefined && s.responseTimeMs > 0);
    const total      = answered.length || session.length;
    
    // Count specific activity types
    const gamesCount = session.filter(s => (s as any).type === 'game').length;
    const quizCount  = session.filter(s => (s as any).type === 'quiz').length;
    const conceptsCount = session.filter(s => !(s as any).type || (s as any).type === 'concept').length;

    // "mastered this session" = moved to Automatic or ExamReady in live concepts
    const liveConcepts = concepts ?? [];
    const masteredNow  = liveConcepts.filter(c => c.stage === 'Automatic' || c.stage === 'ExamReady').length;
    
    // accuracy: non-Unseen concepts that were answered / total answered
    const correctCount = session.filter(s => {
      if ((s as any).type === 'quiz') return true; // simplified for now
      return s.concept && s.concept.stage !== 'Unseen';
    }).length;

    const accuracy   = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    return { total, accuracy, masteredNow, gamesCount, quizCount, conceptsCount };
  }, [session, concepts]);

  const subjectBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    CONFIG.subjects.forEach(s => { counts[s.name] = 0; });
    
    session.forEach(s => {
      const subject = s.concept?.subject || (s as any).quiz?.lessonName || 'Other';
      const match = CONFIG.subjects.find(sub => subject.includes(sub.name))?.name || 'Other';
      counts[match] = (counts[match] ?? 0) + 1;
    });
    
    const pct: Record<string, number> = {};
    const validSubjects = CONFIG.subjects.map(s => s.name);
    const total = session.length || 1;
    
    validSubjects.forEach(name => {
      pct[name] = Math.round(((counts[name] ?? 0) / total) * 100);
    });
    return { counts, pct };
  }, [session]);

  const calibrationReport = useMemo(() => {
    return getCalibrationReport(concepts ?? []);
  }, [concepts]);

  const totalAutomatic = Object.values(globalStats).reduce((s, x) => s + x.auto, 0);

  const handleShare = async () => {
    Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
    await Share.share({
      title: 'CHITTA Spaced Repetition',
      text: `I just completed a Lead GenAI Engineer study session on CHITTA! ${totalAutomatic} concepts locked into long-term memory. Spaced repetition for AI careers`,
      url: 'https://chitta.app/',
    }).catch(() => {});
  };

  return (
    <div className="pt-14 pb-28 px-4 max-w-md mx-auto">

      {/* ── Top Nav Actions ── */}
      <div className="flex w-full justify-between items-center mb-6">
        <h2 className="text-xl font-bold mb-3" style={{ fontFamily: JKS, color: 'var(--color-on-surface)' }}>Overview</h2>
        <button onClick={handleShare} className="p-2.5 text-[var(--color-on-surface-variant)] rounded-full active:scale-95 transition-transform" style={{ background: 'var(--color-surface-variant)' }} aria-label="Share Overall Progress">
          <span className="material-symbols-rounded" style={{ fontSize: 18 }}>share</span>
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
          <span className="material-symbols-rounded" style={{ fontSize: 28,  color: 'var(--color-success)'  }}>workspace_premium</span>
        </div>
        <p className="text-[13px] font-semibold mb-1" style={{ fontFamily: JKS, color: 'var(--color-success)' }}>
          Session Complete
        </p>
        <h1 className="text-[52px] font-bold tabular-nums leading-none mb-1" style={{ fontFamily: JKS, color: 'var(--color-on-surface)' }}>
          {sessionStats.accuracy}<span className="text-[24px] font-medium" style={{ color: 'var(--color-on-surface-muted)' }}>%</span>
        </h1>
        <p className="text-[13px]" style={{ color: 'var(--color-on-surface-muted)' }}>Focus Intensity · {sessionStats.accuracy >= 80 ? 'Excellent' : sessionStats.accuracy >= 60 ? 'Good' : 'Keep going'}</p>
      </motion.div>

      {/* ── Mastery progress ── */}
      <div className="card p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-success-container)' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 15,  color: 'var(--color-success)'  }}>trending_up</span>
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
            mastered <span className="material-symbols-rounded" style={{ fontSize: 13,  color: 'var(--color-warning)'  }}>local_fire_department</span>
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

      {/* ── Activity Breakdown ── */}
      <div className="card p-5 mb-4">
        <p className="text-[13px] font-semibold mb-3" style={{ fontFamily: JKS, color: 'var(--color-on-surface-muted)' }}>
          Activities Completed
        </p>
        <div className="space-y-3">
          {[
            { label: 'Concepts Studied', value: sessionStats.conceptsCount, icon: 'menu_book', color: 'var(--color-primary)' },
            { label: 'Practice Games',   value: sessionStats.gamesCount,    icon: 'sports_esports', color: 'var(--color-success)' },
            { label: 'Curriculum Quizzes', value: sessionStats.quizCount,     icon: 'quiz', color: 'var(--color-warning)' },
          ].filter(a => a.value > 0).map(act => (
            <div key={act.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-rounded" style={{ fontSize: 18, color: act.color }}>{act.icon}</span>
                <span className="text-[14px]" style={{ color: 'var(--color-on-surface)' }}>{act.label}</span>
              </div>
              <span className="text-[14px] font-bold" style={{ color: act.color }}>{act.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Subject mix ── */}
      <div className="card p-5 mb-4">
        <p className="text-[13px] font-semibold mb-3" style={{ fontFamily: JKS, color: 'var(--color-on-surface-muted)' }}>
          Subject Mix
        </p>
        <div className="flex gap-2">
          {CONFIG.subjects.map(s => {
            return (
              <div
                key={s.name}
                className="flex-1 text-center py-3 rounded-xl border"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="flex justify-center mb-1">
                  <span className={`material-symbols-rounded ${s.color}`} style={{ fontSize: 16 }}>{s.icon}</span>
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
          { label: 'Questions',   value: sessionStats.total,                                color: 'var(--color-on-surface)' },
          { label: 'Accuracy',    value: `${sessionStats.accuracy}%`,                       color: 'var(--color-primary)' },
          { label: 'Mastered',    value: sessionStats.masteredNow,                           color: 'var(--color-success)' },
          { label: 'Due Tomorrow',value: (concepts ?? []).filter(c => isDue(c)).length || 0, color: 'var(--color-warning)' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            className="card p-4"
          >
            <p className="text-[12px] mb-1" style={{ fontFamily: JKS, color: 'var(--color-on-surface-muted)' }}>{stat.label}</p>
            <span className="text-[28px] font-bold tabular-nums" style={{ color: stat.color, fontFamily: JKS }}>
              {stat.value}
            </span>
          </motion.div>
        ))}
      </div>

      {/* ── Calibration Report (Layer 2 Metacognition) ── */}
      {calibrationReport.overall > 0 && (
        <div className="card p-5 mb-4" style={{ background: 'var(--color-surface-container-highest)', border: '1px solid var(--color-outline-variant)' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-secondary-container)' }}>
              <span className="material-symbols-rounded" style={{ fontSize: 15, color: 'var(--color-on-secondary-container)' }}>psychology</span>
            </div>
            <span className="text-[13px] font-semibold" style={{ fontFamily: JKS, color: 'var(--color-on-surface)' }}>
              Metacognitive Calibration
            </span>
            <span className="ml-auto text-[14px] font-bold" style={{ color: 'var(--color-primary)' }}>
              {Math.round(calibrationReport.overall * 100)}%
            </span>
          </div>

          <div className="space-y-4">
            {Object.entries(calibrationReport.bySubject).map(([subj, data]) => (
              <div key={subj}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12px] font-medium text-[var(--color-on-surface-variant)]">{subj}</span>
                  <div className="flex gap-2">
                    {data.overconfidenceCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-tighter">
                        {data.overconfidenceCount} Overconfident
                      </span>
                    )}
                    {data.underconfidenceCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-tighter">
                        {data.underconfidenceCount} Underconfident
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full overflow-hidden bg-[var(--color-outline-variant)]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'var(--color-primary)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${data.metacogAccuracy * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <p className="mt-4 text-[11px] text-[var(--color-on-surface-variant)] leading-relaxed italic">
            accurate calibration means you know exactly what you know (and don't). Overconfidence leads to premature skipping; underconfidence wastes time on review.
          </p>
        </div>
      )}

      {/* ── AI Insight ── */}
      <div className="card p-4 mb-4" style={{ background: 'var(--color-primary-container)', border: '1px solid var(--color-primary)' }}>
        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border shrink-0" style={{ borderColor: 'var(--color-primary)' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 18,  color: 'var(--color-primary)'  }}>check_circle</span>
          </div>
          <div>
            <p className="text-[13px] font-semibold mb-1" style={{ fontFamily: JKS, color: 'var(--color-primary)' }}>
              AI Insight
            </p>
            <p className="prose" style={{ fontSize: '14px', lineHeight: '1.75' }}>
              {calibrationReport.overall < 0.6 
                ? "Your calibration is currently low. Focus on being more honest during confidence ratings — if you're guessing, say so! This will improve your schedule accuracy."
                : "Your calibration is excellent. The FSRS engine is accurately modeling your memory decay. Trust the 'Next Review' dates."}
            </p>
          </div>
        </div>
      </div>

      {/* ── Tomorrow preview ── */}
      {(() => {
        const liveConcepts = concepts ?? CONFIG.concepts;
        const dueCount = liveConcepts.filter(c => isDue(c)).length;
        const newCount  = liveConcepts.filter(c => c.stage === 'Unseen' && c.pyqTier === 1).length;
        return (
          <div className="card p-4 mb-5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0" style={{ background: 'var(--color-warning-container)', borderColor: 'var(--color-warning)' }}>
              <span className="material-symbols-rounded text-[var(--color-on-surface)]" style={{ fontSize: 20 }}>event</span>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[var(--color-on-surface)]" style={{ fontFamily: JKS }}>
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
        Back to Dashboard <span className="material-symbols-rounded" style={{ fontSize: 16 }}>arrow_forward</span>
      </button>
    </div>
  );
};
