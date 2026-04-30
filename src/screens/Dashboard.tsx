import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { m3SpatialDefault, m3SpatialFast, m3EffectsEase } from '../lib/m3-motion';
import { CONFIG, examReadiness, totalConcepts, totalExamQ, subjectBar } from '../lib/config';
import { ShapePlaced } from '../components/M3Shapes';
import type { Screen } from '../types';
import type { SessionItem, SubjectStats } from '../core/types';
import { getTimeOfDayNudge } from '../core/scheduler';
import { loadCourseProgress, peekStreak, loadPortfolio, savePortfolioItem } from '../db/store';
import type { PortfolioProgress, PortfolioStatus } from '../db/store';
import { COURSE_LESSONS } from '../data/course/lessons';
import { AI_PORTFOLIO_PROJECTS } from '../data/ai_engineer/portfolio';




export const Dashboard = ({
  setScreen,
  session,
  onSubjectClick,
  onStartSession,
  globalStats,
}: {
  setScreen: (s: Screen) => void;
  session: SessionItem[];
  onSubjectClick: (s: string) => void;
  onStartSession: () => void;
  globalStats: Record<string, SubjectStats>;
}) => {
  const stats = globalStats;
  const [courseCompleted, setCourseCompleted] = useState(0);
  const [selectedPill, setSelectedPill] = useState<string | null>(null);
  const [liveStreak, setLiveStreak] = useState<number>(0);
  const [portfolio, setPortfolio] = useState<Record<string, PortfolioProgress>>({});

  useEffect(() => {
    loadCourseProgress().then(map => setCourseCompleted(map.size));
    peekStreak().then(setLiveStreak).catch(console.error);
    loadPortfolio().then(setPortfolio).catch(console.error);
  }, []);

  const handlePortfolioToggle = async (id: string) => {
    const current = portfolio[id];
    const nextStatus: PortfolioStatus = !current ? 'in_progress' : current.status === 'not_started' ? 'in_progress' : current.status === 'in_progress' ? 'completed' : 'not_started';
    const progress: PortfolioProgress = {
      status: nextStatus,
      startedAt: nextStatus !== 'not_started' ? (current?.startedAt ?? Date.now()) : undefined,
      completedAt: nextStatus === 'completed' ? Date.now() : undefined,
    };
    await savePortfolioItem(id, progress);
    setPortfolio(prev => ({ ...prev, [id]: progress }));
  };
  const totalAutomatic = Object.values(stats).reduce((sum, s) => sum + s.auto, 0);
  const totalConscious = Object.values(stats).reduce((sum, s) => sum + s.conscious, 0);
  const totalFading    = Object.values(stats).reduce((sum, s) => sum + s.fragile, 0);

  const subjectReadiness = CONFIG.subjects.map(sub => ({
    ...sub,
    stats: stats[sub.name] ?? { auto: 0, conscious: 0, fragile: 0, unseen: sub.totalConcepts },
    ready: examReadiness(
      stats[sub.name] ?? { auto: 0, conscious: 0, fragile: 0, unseen: sub.totalConcepts },
      sub.totalConcepts,
      sub.examQuestions
    ),
  }));
  const totalReady = subjectReadiness.reduce((s, x) => s + x.ready, 0);

  // SVG ring math
  const R = 44;
  const C = 2 * Math.PI * R;
  const autoFill  = totalConcepts > 0 ? (totalAutomatic / totalConcepts) * C : 0;
  const conscFill = totalConcepts > 0 ? ((totalAutomatic + totalConscious) / totalConcepts) * C : 0;

  const hour = new Date().getHours();
  const nudge = getTimeOfDayNudge(hour);
  const isMorning = hour >= 6 && hour < 12;

  const computedDaysRemaining = CONFIG.examDate 
    ? Math.max(0, Math.ceil((new Date(CONFIG.examDate).getTime() - Date.now()) / 86400000))
    : CONFIG.daysRemaining ?? '—';

  return (
    <div className="pt-14 pb-28 px-4 max-w-md mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center justify-between pt-5 pb-4">
        <div>
          <p className="text-[12px] font-medium mb-0.5 font-ui" style={{ color: 'var(--color-on-surface-muted)' }}>
            Welcome back
          </p>
          <h1 className="text-headline-emphasized leading-tight" style={{ color: 'var(--color-on-surface)' }}>
            नमस्ते, {CONFIG.studentName}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="streak-badge">
            <span className="material-symbols-rounded" style={{ fontSize: 12 }}>local_fire_department</span>
            <span>{liveStreak} day</span>
          </div>
          <div
            className="rounded-full px-3 py-1.5 flex items-center gap-1.5"
            style={{ background: 'var(--color-primary-container)', border: '1px solid var(--color-primary-border)' }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 11,  color: 'var(--color-primary)'  }}>schedule</span>
            <span className="text-[12px] font-bold font-ui" style={{ color: 'var(--color-primary)' }}>
              {computedDaysRemaining}d
            </span>
          </div>
        </div>
      </div>

      {/* ── 3 Stat Pills (Interactive) ── */}
      <div className="flex gap-2.5 mb-6 relative">
        {[
          { label: 'Mastered',  value: totalAutomatic, color: 'var(--color-success)', bg: 'var(--color-success-container)', border: 'var(--color-success-container)', help: totalAutomatic === 0 ? 'Start your first session to earn mastery' : null, icon: 'workspace_premium' },
          { label: 'Learning',  value: totalConscious, color: 'var(--color-primary)', bg: 'var(--color-primary-container)', border: 'var(--color-primary-border)', help: totalConscious === 0 ? 'Complete 2 more sessions to grow' : null, icon: 'auto_stories' },
          { label: 'Fading',    value: totalFading,    color: 'var(--color-warning)', bg: 'var(--color-warning-container)', border: 'var(--color-warning-container)', help: totalFading === 0 ? 'No concepts due for review yet' : null, icon: 'schedule' },
        ].map((s, i) => (
          <motion.button
            key={s.label}
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: selectedPill === s.label ? 1.05 : 1 }}
            transition={{ ...m3SpatialDefault, delay: i * 0.05, scale: { duration: 0.3 } }}
            onClick={() => setSelectedPill(selectedPill === s.label ? null : s.label)}
            className="flex-1 rounded-m3-lg rounded-tl-sm p-3 text-center cursor-pointer transition-all active:scale-95 hover:shadow-md relative overflow-hidden group"
            style={{ 
              background: s.bg, 
              border: `2px solid ${selectedPill === s.label ? s.color : s.border}`,
              opacity: selectedPill === null || selectedPill === s.label ? 1 : 0.65,
              boxShadow: selectedPill === s.label 
                ? `0 8px 16px ${s.color}30, 0 2px 8px ${s.color}20` 
                : 'inset 0 1px 2px rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.08)'
            }}
            title={s.help || undefined}
          >
            {/* Ripple background on hover */}
            <motion.div 
              className="absolute inset-0 opacity-0 group-hover:opacity-20" 
              style={{ background: s.color }}
              initial={{ scale: 0 }}
              whileHover={{ scale: 1.5 }}
              transition={{ duration: 0.4 }}
            />
            
            {/* Content */}
            <div className="relative z-10">
              {s.value > 0 && (
                <div className="absolute -top-1 -right-1" style={{ lineHeight: 1 }}>
                  <span
                    className="material-symbols-rounded"
                    style={{ fontSize: 16, color: s.color, fontVariationSettings: "'FILL' 1, 'wght' 500" }}
                  >
                    {s.icon}
                  </span>
                </div>
              )}
              <motion.span 
                className="text-[24px] font-bold block tabular-nums font-ui"
                animate={{ scale: selectedPill === s.label ? 1.1 : 1, y: selectedPill === s.label ? -2 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ color: s.color }}
              >
                {s.value}
              </motion.span>
              <span className="text-[12px] font-medium font-ui" style={{ color: s.color, opacity: 0.85 }}>{s.label}</span>
              {s.help && selectedPill === s.label && (
                <motion.span 
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-[10px] font-ui mt-1.5 block" 
                  style={{ color: s.color, opacity: 0.8, fontWeight: 500 }}
                >
                  {s.help}
                </motion.span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

     {/* ── AI Engineering Course ── */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...m3SpatialDefault, delay: 0.6 }}
        onClick={() => setScreen('ai-engineering')}
        className="mt-6 w-full mx-4 mb-4 px-4 py-4 rounded-m3-xl flex items-center gap-3 border border-solid bg-gradient-to-br from-[#8B5CF6]/5 to-[#EC4899]/5 hover:shadow-md transition-all active:scale-95"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="w-12 h-12 rounded-m3-lg flex items-center justify-center shrink-0 bg-[#8B5CF6]/20">
          <span className="material-symbols-rounded" style={{ fontSize: 24, color: '#8B5CF6' }}>psychology</span>
        </div>
        <div className="flex-1 text-left">
          <p className="text-[14px] font-bold mb-0.5" style={{ color: 'var(--color-on-surface)' }}>
            AI Engineering Path
          </p>
          <p className="text-[12px]" style={{ color: 'var(--color-on-surface-variant)' }}>
            260+ lessons • Build from scratch
          </p>
        </div>
        <span className="material-symbols-rounded" style={{ fontSize: 16,  color: 'var(--color-on-surface-muted)'  }}>chevron_right</span>
      </motion.button>

      {/* ── Start Session Card (Primary CTA) ── */}
      <motion.button 
        onClick={onStartSession}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...m3SpatialDefault, delay: 0.2 }}
        className="w-full text-left rounded-m3-xl p-5 mb-6 relative overflow-hidden border border-solid transition-all hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 block"
        style={{ 
          background: 'var(--color-surface-container-low)', 
          borderColor: 'var(--color-primary-border)',
          boxShadow: '0 8px 24px rgba(103, 80, 164, 0.12), inset 0 1px 2px rgba(255,255,255,0.4)'
        }}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 opacity-30" style={{
          background: 'linear-gradient(135deg, rgba(103, 80, 164, 0.05) 0%, rgba(103, 80, 164, 0) 100%)'
        }} />
        
        <div className="relative z-10 flex items-start justify-between mb-4">
          <div>
            <h3 className="text-title-emphasized" style={{ color: 'var(--color-on-surface)' }}>
              Today's Challenge
            </h3>
            <p className="text-[13px] mt-0.5 font-body" style={{ color: 'var(--color-on-surface-variant)' }}>
              {session.length === 0
                ? 'No patterns queued. Start fresh?'
                : `${session.length} pattern${session.length === 1 ? '' : 's'} queued`}
            </p>
          </div>
          <motion.div 
            className="w-10 h-10 rounded-m3-lg flex items-center justify-center" 
            style={{ background: 'var(--color-primary-container)' }}
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 18,  color: 'var(--color-primary)'  }}>my_location</span>
          </motion.div>
        </div>

        {/* Session composition bar with stagger animation */}
        <div className="h-2.5 w-full rounded-full overflow-hidden flex mb-2" style={{ background: 'var(--color-border)' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${CONFIG.sessionComposition.review * 100}%` }} 
            transition={{ ...m3SpatialDefault, delay: 0.1 }}
            style={{ background: '#B91C1C' }} 
            className="h-full rounded-l-full"
          />
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${CONFIG.sessionComposition.new * 100}%` }} 
            transition={{ ...m3SpatialDefault, delay: 0.15 }}
            style={{ background: 'var(--color-primary)' }} 
            className="h-full"
          />
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${CONFIG.sessionComposition.strengthen * 100}%` }} 
            transition={{ ...m3SpatialDefault, delay: 0.2 }}
            style={{ background: '#15803D' }} 
            className="h-full rounded-r-full"
          />
        </div>
        <div className="flex gap-4 mb-5">
          {[
            { label: 'Review',    pct: CONFIG.sessionComposition.review,    color: '#B91C1C' },
            { label: 'New',       pct: CONFIG.sessionComposition.new,       color: 'var(--color-primary)' },
            { label: 'Strengthen',pct: CONFIG.sessionComposition.strengthen,color: '#15803D' },
          ].map(q => (
            <div key={q.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: q.color }} />
              <span className="text-[12px] font-medium font-ui" style={{ color: 'var(--color-on-surface-variant)' }}>
                {q.label} {Math.round(q.pct * 100)}%
              </span>
            </div>
          ))}
        </div>

        <motion.div
          className="w-full py-[15px] rounded-m3-xl font-bold font-ui text-[15px] flex justify-center items-center gap-2 transition-all active:scale-[0.98] hover:shadow-lg relative overflow-hidden group"
          style={{ 
            background: 'var(--color-primary)', 
            color: 'var(--color-on-primary)', 
            boxShadow: '0px 4px 8px 1px rgba(103, 80, 164, 0.3), 0px 2px 4px 0px rgba(0, 0, 0, 0.15)'
          }}
          whileHover={{ y: -2 }}
        >
          {/* Button shine effect */}
          <motion.div 
            className="absolute inset-0 opacity-0 group-hover:opacity-20"
            style={{ background: 'rgba(255,255,255,0.3)' }}
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
          />
          <span className="material-symbols-rounded" style={{ fontSize: 17, fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
          <span className="relative z-10">Start Session</span>
        </motion.div>
      </motion.button>

      {/* ── Pre-Sleep Review (20:00–22:00 only) ── */}
      {new Date().getHours() >= 20 && new Date().getHours() < 22 && (
        <motion.button
          onClick={() => setScreen('presleep')}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3SpatialDefault, delay: 0.3 }}
          className="w-full text-left rounded-m3-xl p-5 mb-6 mx-4 relative overflow-hidden border border-solid transition-all hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1"
          style={{
            background: 'rgba(88, 28, 135, 0.08)',
            borderColor: 'rgba(88, 28, 135, 0.3)',
            boxShadow: '0 4px 12px rgba(88, 28, 135, 0.1)',
          }}
        >
          <div className="relative z-10 flex items-start gap-3">
            <span
              className="material-symbols-rounded shrink-0"
              style={{ fontSize: 22, color: 'rgb(88, 28, 135)', fontVariationSettings: "'FILL' 1, 'wght' 500" }}
            >
              bedtime
            </span>
            <div>
              <h3 className="text-base font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>
                Pre-Sleep Review
              </h3>
              <p className="text-[13px]" style={{ color: 'var(--color-on-surface-variant)' }}>
                Consolidate high-stakes concepts
              </p>
            </div>
          </div>
        </motion.button>
      )}

      {/* ── Mastery Ring Card ── */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={m3SpatialDefault}
        className="rounded-m3-xl p-5 mb-4 mx-4 relative overflow-hidden border border-solid transition-all hover:shadow-lg hover:-translate-y-1"
        style={{ 
          background: 'var(--color-surface-lowest)', 
          borderColor: 'var(--color-border)',
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5), 0 4px 12px rgba(0,0,0,0.08)'
        }}
      >
        {/* Subtle gradient background */}
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
          background: 'linear-gradient(135deg, rgba(21, 128, 61, 0.03) 0%, rgba(103, 80, 164, 0.03) 100%)'
        }} />
        
        <ShapePlaced position="top-left" shape="blob" color="var(--color-primary)" opacity={0.08} size={40} animate={false} />
        <ShapePlaced position="bottom-right" shape="flower" color="var(--color-success)" opacity={0.08} size={36} animate={false} />
        <div className="flex items-center gap-5 relative z-10">
          {/* Ring */}
          <div className="relative shrink-0" style={{ width: 110, height: 110 }}>
            <svg width="110" height="110" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
              {/* Track */}
              <circle cx="50" cy="50" r={R} fill="none" stroke="var(--color-border)" strokeWidth="7" />
              {/* Conscious fill (primary) */}
              <motion.circle 
                cx="50" cy="50" r={R} fill="none" stroke="var(--color-primary-border)" strokeWidth="7"
                strokeDasharray={`${conscFill} ${C}`} strokeLinecap="round"
                initial={{ strokeDasharray: `0 ${C}` }}
                animate={{ strokeDasharray: `${conscFill} ${C}` }}
                transition={{ ...m3EffectsEase, delay: 0.3 }}
              />
              {/* Auto fill (green) */}
              <motion.circle 
                cx="50" cy="50" r={R} fill="none" stroke="var(--color-success)" strokeWidth="7"
                strokeDasharray={`${autoFill} ${C}`} strokeLinecap="round"
                initial={{ strokeDasharray: `0 ${C}` }}
                animate={{ strokeDasharray: `${autoFill} ${C}` }}
                transition={{ ...m3EffectsEase, delay: 0.2 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <motion.span 
                className="text-[28px] font-bold tabular-nums leading-none font-ui" 
                style={{ color: 'var(--color-on-surface)' }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...m3SpatialDefault, delay: 0.3 }}
              >
                {totalAutomatic}
              </motion.span>
              <span className="text-[11px] font-medium leading-none mt-0.5 font-ui" style={{ color: 'var(--color-on-surface-muted)' }}>
                / {totalConcepts}
              </span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="flex-1 space-y-3">
            <p className="text-[12px] font-semibold font-ui" style={{ color: 'var(--color-on-surface-variant)' }}>
              Mastery Breakdown
            </p>
            {[
              { label: 'Mastered',  value: totalAutomatic, pct: Math.round((totalAutomatic / totalConcepts) * 100), color: 'var(--color-success)', track: 'var(--color-success-container)' },
              { label: 'Learning',  value: totalConscious, pct: Math.round((totalConscious / totalConcepts) * 100),  color: 'var(--color-primary)', track: 'var(--color-primary-container)' },
              { label: 'Fading',    value: totalFading,    pct: Math.round((totalFading / totalConcepts) * 100),     color: 'var(--color-warning)', track: 'var(--color-warning-container)' },
            ].map(s => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-medium text-[var(--color-on-surface-variant)] font-ui">{s.label}</span>
                  <span className="text-[13px] font-bold tabular-nums font-ui" style={{ color: s.color }}>
                    {s.value}
                  </span>
                </div>
                <div className="h-[5px] w-full rounded-full overflow-hidden bg-[var(--color-surface-variant)]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct}%` }}
                    transition={m3EffectsEase}
                    className="h-full rounded-full"
                    style={{ background: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Exam Readiness Card (with Progress Ring) ── */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...m3SpatialDefault, delay: 0.1 }}
        className="rounded-m3-xl p-5 mb-4 mx-4 relative overflow-hidden border border-solid transition-all hover:shadow-lg hover:-translate-y-1"
        style={{ 
          background: 'var(--color-surface-lowest)', 
          borderColor: 'var(--color-border)',
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5), 0 4px 12px rgba(0,0,0,0.08)'
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
          background: 'linear-gradient(135deg, rgba(21, 128, 61, 0.05) 0%, rgba(103, 80, 164, 0.03) 100%)'
        }} />
        
        <ShapePlaced position="bottom-left" shape="clover" color="var(--color-warning)" opacity={0.1} size={44} animate={true} />
        <div className="flex items-center gap-2 mb-4 relative z-10">
          <motion.div 
            className="w-8 h-8 rounded-lg flex items-center justify-center" 
            style={{ background: 'var(--color-success-container)' }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 15,  color: 'var(--color-success)'  }}>trending_up</span>
          </motion.div>
          <span className="text-[13px] font-semibold font-ui" style={{ color: 'var(--color-on-surface-variant)' }}>
            Exam Readiness
          </span>
          <span className="ml-auto text-[12px] font-ui" style={{ color: 'var(--color-on-surface-muted)' }}>/ {totalExamQ} Qs</span>
        </div>

        {/* Progress Ring + Main Stats */}
        <div className="flex items-center gap-5 mb-4 relative z-10">
          <div className="relative shrink-0" style={{ width: 90, height: 90 }}>
            <svg width="90" height="90" viewBox="0 0 90 90" style={{ transform: 'rotate(-90deg)' }}>
              {/* Track */}
              <circle cx="45" cy="45" r="38" fill="none" stroke="var(--color-border)" strokeWidth="5" />
              {/* Progress fill */}
              <motion.circle 
                cx="45" 
                cy="45" 
                r="38" 
                fill="none" 
                stroke="var(--color-success)" 
                strokeWidth="5"
                strokeDasharray={`${(totalReady / CONFIG.examScoreTarget) * (2 * Math.PI * 38)} ${2 * Math.PI * 38}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[24px] font-bold tabular-nums leading-none font-ui" style={{ color: 'var(--color-success)' }}>
                {totalReady}
              </span>
              <span className="text-[10px] font-medium leading-none mt-0.5 font-ui" style={{ color: 'var(--color-on-surface-muted)' }}>
                / {CONFIG.examScoreTarget}
              </span>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-3">
              <span className="text-[14px] font-body" style={{ color: 'var(--color-on-surface-variant)' }}>estimated correct</span>
              <p className="text-[12px] font-ui mt-0.5" style={{ color: 'var(--color-on-surface-muted)' }}>
                {totalReady >= CONFIG.examScoreTarget ? '✓ Target reached!' : `${CONFIG.examScoreTarget - totalReady} more to goal`}
              </p>
            </div>
          </div>
        </div>

        {/* Subject Progress Pills */}
        <div className="flex gap-2">
          {subjectReadiness.map(s => (
            <div
              key={s.name}
              className="flex-1 text-center py-2.5 rounded-m3-lg border border-solid"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-container)' }}
            >
              <div className="mb-1 flex items-center justify-center">
                <span
                  className="material-symbols-rounded"
                  style={{ fontSize: 22, color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
                >
                  {s.icon}
                </span>
              </div>
              <div className="text-[16px] font-bold tabular-nums font-ui" style={{ color: 'var(--color-on-surface)' }}>{s.ready}</div>
              <div className="text-[11px] font-body" style={{ color: 'var(--color-on-surface-muted)' }}>/{s.examQuestions}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Time-of-Day Nudge ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ ...m3SpatialDefault, delay: 0.15 }}
        className="flex items-center gap-3 px-4 py-3.5 rounded-m3-lg mb-4 mx-4 relative overflow-hidden border border-solid transition-all hover:shadow-md hover:-translate-y-1"
        style={{
          background: isMorning 
            ? 'linear-gradient(135deg, var(--color-success-container) 0%, rgba(21, 128, 61, 0.5) 100%)' 
            : 'linear-gradient(135deg, var(--color-primary-container) 0%, rgba(103, 80, 164, 0.5) 100%)',
          borderColor: isMorning ? 'var(--color-success)' : 'var(--color-primary)',
          borderWidth: '1.5px',
          boxShadow: `inset 0 1px 2px rgba(255,255,255,0.3), 0 4px 12px ${isMorning ? 'rgba(21, 128, 61, 0.15)' : 'rgba(103, 80, 164, 0.15)'}`
        }}
      >
        <ShapePlaced position="bottom-right" shape="star" color={isMorning ? 'var(--color-success)' : 'var(--color-primary)'} opacity={0.2} size={40} animate={true} />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ flexShrink: 0 }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 16,  color: isMorning ? 'var(--color-success)' : 'var(--color-primary)'  }}>schedule</span>
        </motion.div>
        <div className="flex-1 relative z-10">
          <p className="text-[13px] font-medium font-body" style={{ color: isMorning ? 'var(--color-success)' : 'var(--color-primary)' }}>
            <span className="font-bold">Pro tip:</span> {isMorning ? 'Perfect for learning new material' : 'Great for consolidating existing knowledge'}
          </p>
          <p className="text-[12px] font-body mt-0.5" style={{ color: isMorning ? 'rgba(21, 128, 61, 0.8)' : 'rgba(103, 80, 164, 0.8)' }}>
            Best for {nudge}
          </p>
        </div>
      </motion.div>

      {/* ── Daily Games ── */}
      <div className="flex flex-col gap-4 px-4 w-full mb-4 max-w-[calc(100%-32px)]">
          <div className="grid grid-cols-2 gap-3 w-full">
            <motion.button
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...m3SpatialDefault, delay: 0.3 }}
              onClick={() => setScreen('games')}
              className="col-span-2 flex items-center justify-start px-4 py-4 rounded-m3-lg border border-solid transition-all hover:shadow-md hover:-translate-y-1"
              style={{ background: 'var(--color-surface-lowest)', borderColor: 'var(--color-border)' }}
            >
              <div className="w-10 h-10 rounded-m3-lg flex items-center justify-center mr-3" style={{ background: 'var(--color-primary-container)' }}>
                <span className="material-symbols-rounded" style={{ fontSize: 20,  color: 'var(--color-primary)'  }}>sports_esports</span>
              </div>
              <div className="text-left">
                <p className="text-[14px] font-semibold font-ui" style={{ color: 'var(--color-on-surface)' }}>Games</p>
                <p className="text-[11px] font-body" style={{ color: 'var(--color-on-surface-variant)' }}>7 simulations</p>
              </div>
            </motion.button>
  
            <motion.button
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...m3SpatialDefault, delay: 0.35 }}
              onClick={() => setScreen('shape-slicer')}
              className="flex flex-col items-center justify-center px-2 py-4 rounded-m3-lg border border-solid transition-all hover:shadow-md hover:-translate-y-1 bg-[#EADDFF] border-[#D0BCFF]"
            >
              <div className="w-10 h-10 rounded-m3-lg flex items-center justify-center mb-2 bg-[#6750A4]">
                <span className="material-symbols-rounded text-white block">view_in_ar</span>
              </div>
              <p className="text-[12px] font-semibold font-ui text-[#21005D] text-center">3D Geometry</p>
              <p className="text-[10px] font-body text-[#4A4458] text-center">Sandbox</p>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...m3SpatialDefault, delay: 0.37 }}
              onClick={() => setScreen('physics-sandbox')}
              className="flex flex-col items-center justify-center px-2 py-4 rounded-m3-lg border border-solid transition-all hover:shadow-md hover:-translate-y-1 bg-[#ECE6F0] border-[#CAC4D0]"
            >
              <div className="w-10 h-10 rounded-m3-lg flex items-center justify-center mb-2 bg-[#49454F]">
                <span className="material-symbols-rounded text-white block">explore</span>
              </div>
              <p className="text-[12px] font-semibold font-ui text-[#1D192B] text-center">Physics</p>
              <p className="text-[10px] font-body text-[#49454F] text-center">Collisions</p>
            </motion.button>
  
            <motion.button
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...m3SpatialDefault, delay: 0.4 }}
              onClick={() => setScreen('kinematics-cannon')}
              className="flex flex-col items-center justify-center px-2 py-4 rounded-m3-lg border border-solid transition-all hover:shadow-md hover:-translate-y-1 bg-[#D3E3FD] border-[#B4CGFA]"
            >
              <div className="w-10 h-10 rounded-m3-lg flex items-center justify-center mb-2 bg-[#004A77]">
                 <span className="material-symbols-rounded text-white block">crisis_alert</span>
              </div>
              <p className="text-[12px] font-semibold font-ui text-[#001D35] text-center">Kinematics</p>
              <p className="text-[10px] font-body text-[#4A4458] text-center">Cannon</p>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...m3SpatialDefault, delay: 0.43 }}
              onClick={() => setScreen('coulombs-collider')}
              className="flex flex-col items-center justify-center px-2 py-4 rounded-m3-lg border border-solid transition-all hover:shadow-md hover:-translate-y-1 bg-[#F9DEDC] border-[#F2B8B5]"
            >
              <div className="w-10 h-10 rounded-m3-lg flex items-center justify-center mb-2 bg-[#8C1D18]">
                 <span className="material-symbols-rounded text-white block">bolt</span>
              </div>
              <p className="text-[12px] font-semibold font-ui text-[#410E0B] text-center">Coulomb's</p>
              <p className="text-[10px] font-body text-[#410E0B] text-center">Collider</p>
            </motion.button>
          </div>
        </div>

      {/* ── Courses ── */}
      <div className="mb-6 px-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-[13px] font-semibold font-ui" style={{ color: 'var(--color-on-surface-variant)' }}>
            My Courses
          </p>
          <span className="material-symbols-rounded" style={{ fontSize: 14,  color: 'var(--color-on-surface-muted)'  }}>school</span>
        </div>

        <div className="space-y-2.5">
          {/* How to Learn Anything */}
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...m3SpatialDefault, delay: 0.35 }}
            onClick={() => setScreen('course')}
            className="w-full rounded-m3-xl p-4 text-left flex items-center gap-3 border border-solid relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-1"
            style={{ background: 'var(--color-surface-container)', borderColor: 'var(--color-primary-border)' }}
          >
            <ShapePlaced position="top-right" shape="flower" color="var(--color-primary)" opacity={0.08} size={28} />
            <div className="w-11 h-11 rounded-m3-lg flex items-center justify-center shrink-0" style={{ background: 'var(--color-primary-container)' }}>
              <span className="material-symbols-rounded" style={{ fontSize: 20,  color: 'var(--color-primary)'  }}>psychology</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold mb-0.5 font-ui" style={{ color: 'var(--color-on-surface)' }}>
                How to Learn Anything
              </p>
              <p className="text-[12px] mb-2 font-body" style={{ color: 'var(--color-on-surface-variant)' }}>
                {courseCompleted}/{COURSE_LESSONS.length} lessons · Meta-learning system
              </p>
              <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--color-primary-border)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${COURSE_LESSONS.length > 0 ? Math.round((courseCompleted / COURSE_LESSONS.length) * 100) : 0}%` }}
                  transition={{ ...m3EffectsEase, delay: 0.2 }}
                  className="h-full rounded-full"
                  style={{ background: 'var(--color-primary)' }}
                />
              </div>
            </div>
            <span className="material-symbols-rounded shrink-0" style={{ fontSize: 16,  color: 'var(--color-on-surface-muted)'  }}>chevron_right</span>
          </motion.button>

          {/* Subject courses */}
          {CONFIG.subjects.map((sub, i) => {
            const subStats = stats[sub.name] ?? { auto: 0, conscious: 0, fragile: 0, unseen: sub.totalConcepts };
            const done = subStats.auto + subStats.conscious;
            const pct  = Math.round((done / sub.totalConcepts) * 100);
            const shapes = ['diamond', 'pill', 'arch', 'wave', 'triangle'] as const;
            const shapeIndex = i % shapes.length;
            return (
              <motion.button
                key={sub.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...m3SpatialDefault, delay: 0.4 + (i * 0.05) }}
                onClick={() => onSubjectClick(sub.name)}
                className="w-full rounded-m3-xl p-4 text-left flex items-center gap-3 border border-solid relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-1"
                style={{ background: 'var(--color-surface-container)', borderColor: 'var(--color-border)' }}
              >
                <ShapePlaced position="top-right" shape={shapes[shapeIndex]} color={sub.color} opacity={0.1} size={32} />
                <div
                  className="w-11 h-11 rounded-m3-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)' }}
                >
                  <span className={`material-symbols-rounded ${sub.color}`} style={{ fontSize: 20 }}>{sub.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold mb-0.5 font-ui" style={{ color: 'var(--color-on-surface)' }}>
                    {sub.name}
                  </p>
                  <p className="text-[12px] mb-2 font-body" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {done}/{sub.totalConcepts} problems · {sub.examQuestions} exam Qs
                  </p>
                  <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ ...m3EffectsEase, delay: 0.3 }}
                      className={`h-full rounded-full ${sub.barColor}`}
                    />
                  </div>
                </div>
                <span className="material-symbols-rounded shrink-0" style={{ fontSize: 16,  color: 'var(--color-on-surface-muted)'  }}>chevron_right</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Portfolio Projects ── */}
      <div className="mb-6 px-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-[13px] font-semibold font-ui" style={{ color: 'var(--color-on-surface-variant)' }}>
            Portfolio Projects
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-bold tabular-nums font-ui" style={{ color: 'var(--color-success)' }}>
              {AI_PORTFOLIO_PROJECTS.filter(p => portfolio[p.id]?.status === 'completed').length}
            </span>
            <span className="text-[12px] font-ui" style={{ color: 'var(--color-on-surface-muted)' }}>/ {AI_PORTFOLIO_PROJECTS.length}</span>
          </div>
        </div>

        <div className="space-y-2.5">
          {AI_PORTFOLIO_PROJECTS.map((project, i) => {
            const status = portfolio[project.id]?.status ?? 'not_started';
            const statusIcon = status === 'completed' ? 'check_circle' : status === 'in_progress' ? 'pending' : 'circle';
            const statusColor = status === 'completed' ? '#15803D' : status === 'in_progress' ? '#F59E0B' : 'var(--color-on-surface-muted)';
            const fill = status === 'completed' ? "'FILL' 1" : status === 'in_progress' ? "'FILL' 1" : "'FILL' 0";
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...m3SpatialDefault, delay: 0.5 + (i * 0.04) }}
                className="rounded-m3-xl p-4 flex items-center gap-3 border border-solid relative overflow-hidden transition-all hover:shadow-md"
                style={{ background: status === 'completed' ? '#15803D08' : 'var(--color-surface-container)', borderColor: status === 'completed' ? '#15803D30' : 'var(--color-border)' }}
              >
                <div
                  className="w-11 h-11 rounded-m3-lg flex items-center justify-center shrink-0"
                  style={{ background: project.bgColor }}
                >
                  <span className="material-symbols-rounded" style={{ fontSize: 22, color: project.color }}>{project.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold mb-0.5 font-ui" style={{ color: 'var(--color-on-surface)' }}>
                    {project.name}
                  </p>
                  <p className="text-[11px] font-body leading-snug line-clamp-2" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {project.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ color: project.color, background: project.bgColor }}>
                      ~{project.estimatedHours}h
                    </span>
                    {Array.from({ length: project.difficulty }, (_, j) => (
                      <span key={j} className="w-1.5 h-1.5 rounded-full" style={{ background: j < project.difficulty ? project.color : 'var(--color-border)' }} />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handlePortfolioToggle(project.id)}
                  className="shrink-0 p-1 rounded-full transition-all active:scale-90"
                >
                  <span
                    className="material-symbols-rounded"
                    style={{ fontSize: 24, color: statusColor, fontVariationSettings: `${fill}, 'wght' 400, 'GRAD' 0, 'opsz' 24` }}
                  >
                    {statusIcon}
                  </span>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Subject Progress ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <p className="text-[13px] font-semibold mb-3 px-1 font-ui" style={{ color: 'var(--color-on-surface-variant)' }}>
          Subject Progress
        </p>
        <div className="overflow-hidden rounded-m3-xl border border-solid" style={{ background: 'var(--color-surface-container-high)', borderColor: 'var(--color-border)' }}>
          {subjectReadiness.map((sub, i) => {
            const autoPC  = Math.round((sub.stats.auto / sub.totalConcepts) * 100);
            const conscPC = Math.round((sub.stats.conscious / sub.totalConcepts) * 100);
            const isLast  = i === subjectReadiness.length - 1;
            const shapes = ['star', 'triangle', 'pill', 'wave', 'arch'] as const;
            const shapeIndex = i % shapes.length;
            return (
              <motion.button
                key={sub.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...m3SpatialDefault, delay: i * 0.05 }}
                onClick={() => onSubjectClick(sub.name)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all hover:opacity-90"
                style={{ 
                  borderBottom: isLast ? 'none' : '1px solid var(--color-outline-variant)', 
                  background: 'var(--color-surface-container-high)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <ShapePlaced position="bottom-right" shape={shapes[shapeIndex]} color="#6750A4" opacity={0.08} size={40} />
                {/* Icon */}
                <div className="w-10 h-10 rounded-m3-lg flex items-center justify-center shrink-0" style={{ background: 'var(--color-background)', border: '1px solid var(--color-border)' }}>
                  <span
                    className="material-symbols-rounded"
                    style={{ fontSize: 22, color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
                  >
                    {sub.icon}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[14px] font-semibold font-ui" style={{ color: 'var(--color-on-surface)' }}>
                      {sub.name}
                    </span>
                    <span className="text-[13px] font-bold tabular-nums text-[#15803D] font-ui">
                      {autoPC}%
                    </span>
                  </div>
                  <p className="text-[12px] mb-1.5 font-body" style={{ color: 'var(--color-on-surface-muted)' }}>
                    {sub.totalConcepts} concepts · ~{sub.ready}/{sub.examQuestions} solved
                  </p>
                  <div className="h-1.5 w-full rounded-full overflow-hidden flex" style={{ background: 'var(--color-border)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${autoPC}%` }}
                      transition={{ ...m3EffectsEase, delay: 0.1 }}
                      className={`h-full ${subjectBar(sub.name)} rounded-l-full`} 
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${conscPC}%` }}
                      transition={{ ...m3EffectsEase, delay: 0.2 }}
                      className="h-full rounded-r-full"
                      style={{ background: 'var(--color-primary-border)' }}
                    />
                  </div>
                </div>

                <span className="material-symbols-rounded shrink-0" style={{ fontSize: 16,  color: 'var(--color-on-surface-muted)'  }}>chevron_right</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

 
    </div>
  );
}
