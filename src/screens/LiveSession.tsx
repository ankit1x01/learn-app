import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RATINGS, QUEUE_LABELS, subjectColor, subjectBg, subjectEmoji } from '../lib/config';
import { TierBadge } from '../components/TierBadge';
import { SharePromptSheet } from '../components/SharePromptSheet';
import type { Screen } from '../types';
import type { SessionItem, Concept } from '../core/types';
import {
  advanceStage, regressStage,
  updateStabilityOnSuccess, updateStabilityOnFailure,
  updateDifficulty, getNextReviewDays,
  getPredictionErrorMultiplier,
} from '../core/fsrs';
import { updateMetacogAccuracy, detectOverconfidence } from '../core/metacognition';
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  X,
  AlertCircle,
  HelpCircle,
  PieChart,
  Zap,
} from 'lucide-react';

const JKS = "'Plus Jakarta Sans', system-ui, sans-serif";

export const LiveSession = ({
  setScreen,
  session,
  qIndex,
  setQIndex,
  onUpdateConcept,
}: {
  setScreen: (s: Screen) => void;
  session: SessionItem[];
  qIndex: number;
  setQIndex: (i: number) => void;
  onUpdateConcept: (id: string, updates: Partial<Concept>) => void;
}) => {
  const [selected, setSelected]       = useState<string | null>(null);
  const [confirmed, setConfirmed]     = useState(false);
  const [showAI, setShowAI]           = useState(false);
  const [confidence, setConfidence]   = useState<1 | 2 | 3 | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const questionShownAt               = useRef<number>(Date.now());
  const [responseTimeMs, setResponseTimeMs] = useState<number | null>(null);

  const current = session[qIndex] ?? session[0];
  const { concept, queue, retrievability } = current;
  const isPreTest = current.isPreTest ?? false;
  const qLabel = QUEUE_LABELS[queue];

  const rPct = retrievability > 0 ? Math.round(retrievability * 100) : null;
  const selectedRating = RATINGS.find(r => r.id === selected);
  const progress = ((qIndex + 1) / session.length) * 100;

  useEffect(() => {
    setConfidence(null);
    setShowOptions(false);
    setSelected(null);
    setConfirmed(false);
    setResponseTimeMs(null);
    questionShownAt.current = Date.now();
  }, [qIndex]);

  const handleConfidenceTap = (level: 1 | 2 | 3) => {
    setConfidence(level);
    setShowOptions(true);
  };

  const handleSelect = (id: string) => {
    if (confirmed) return;
    if (responseTimeMs === null) setResponseTimeMs(Date.now() - questionShownAt.current);
    setSelected(id);
  };

  const handleNext = () => {
    if (selectedRating && confidence !== null) {
      const wasCorrect = selectedRating.outcome === 'correct';
      const wasPartial = selectedRating.outcome === 'partial';
      const wasWrong   = selectedRating.outcome === 'wrong';
      const curStability  = concept.stability  ?? 2;
      const curDifficulty = concept.difficulty ?? 0.5;
      const curStage      = concept.stage      ?? 'Unseen';

      const hadPriorError = Array.isArray(concept.predictionErrorHistory)
        && concept.predictionErrorHistory.length > 0
        && concept.predictionErrorHistory[concept.predictionErrorHistory.length - 1].preTestWrong === true;

      const newStage = wasCorrect ? advanceStage(curStage) : wasWrong ? regressStage(curStage) : curStage;

      let newStability: number;
      if (wasCorrect) {
        newStability = updateStabilityOnSuccess(curStability, retrievability, confidence);
        if (hadPriorError) newStability = Math.round(newStability * getPredictionErrorMultiplier(true) * 10) / 10;
      } else if (wasWrong) {
        newStability = updateStabilityOnFailure(curStability);
      } else {
        newStability = Math.max(1, Math.round(curStability * 0.85 * 10) / 10);
      }

      const newDifficulty       = updateDifficulty(curDifficulty, wasCorrect);
      const newMetacogAccuracy  = updateMetacogAccuracy(concept, confidence, wasCorrect || wasPartial);
      const newOverconfidenceFlag = detectOverconfidence({ ...concept, metacogAccuracy: newMetacogAccuracy });

      let newPredictionErrorHistory = concept.predictionErrorHistory ?? [];
      if (isPreTest) {
        newPredictionErrorHistory = [...newPredictionErrorHistory, { date: Date.now(), preTestWrong: !wasCorrect }];
      }

      onUpdateConcept(concept.id, {
        stage: newStage, stability: newStability, difficulty: newDifficulty,
        lastTested: 0, nextReview: getNextReviewDays(newStability),
        lastStudiedAt: Date.now(), metacogAccuracy: newMetacogAccuracy,
        overconfidenceFlag: newOverconfidenceFlag, predictionErrorHistory: newPredictionErrorHistory,
      });
    }

    const next = qIndex + 1;
    if (next >= session.length) {
      setQIndex(0); setScreen('complete');
    } else if (session[qIndex].queue === 'new') {
      setQIndex(next); setScreen('encoding');
    } else {
      setQIndex(next);
    }
  };

  // Queue badge colors
  const queueStyle: Record<string, { bg: string; color: string }> = {
    review:    { bg: '#FEF2F2', color: '#B91C1C' },
    new:       { bg: '#EFF6FF', color: '#1D4ED8' },
    strengthen:{ bg: '#F0FDF4', color: '#166534' },
    challenge: { bg: '#F5F3FF', color: '#6D28D9' },
  };
  const qs = queueStyle[queue] ?? { bg: '#F7F6F3', color: '#78716C' };

  return (
    <div className="pt-12 pb-8 max-w-md mx-auto min-h-screen flex flex-col bg-[#F7F6F3]">

      {/* ── Top progress bar ── */}
      <div className="h-1 bg-[#E8E5DF] w-full">
        <motion.div
          className="h-full bg-[#2563EB]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* ── Header row ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#E8E5DF]">
        <button
          onClick={() => setScreen('dashboard')}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#F7F6F3] border border-[#E8E5DF]"
        >
          <X size={16} className="text-[#78716C]" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[15px] font-bold text-[#1C1917]" style={{ fontFamily: JKS }}>
            Q{qIndex + 1}
          </span>
          <span className="text-[14px] text-[#A8A29E]">/ {session.length}</span>
        </div>

        {/* Question dots */}
        <div className="flex items-center gap-1">
          {session.slice(0, Math.min(session.length, 8)).map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === qIndex ? 14 : 6,
                height: 6,
                background: i < qIndex ? '#15803D' : i === qIndex ? '#2563EB' : '#E8E5DF',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">

        {/* ── Question Card ── */}
        <div className="card p-5 mb-4">
          {/* Meta badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
              style={{ fontFamily: JKS, background: '#F7F6F3', color: '#78716C', border: '1px solid #E8E5DF' }}
            >
              {subjectEmoji(concept.subject)} {concept.subject}
            </span>
            <span
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
              style={{ fontFamily: JKS, background: qs.bg, color: qs.color, border: `1px solid ${qs.bg}` }}
            >
              {qLabel.label}{rPct !== null ? ` · ${rPct}%` : ''}
            </span>
            <TierBadge tier={concept.pyqTier} />
            {isPreTest && (
              <span
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                style={{ fontFamily: JKS, background: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A' }}
              >
                PRE-TEST
              </span>
            )}
          </div>

          {/* Chapter path */}
          <p className="text-[12px] text-[#A8A29E] mb-3">{concept.chapter} · Unit {concept.unit}</p>

          {/* Concept name */}
          <h2 className="text-[20px] font-bold text-[#1C1917] leading-snug mb-3" style={{ fontFamily: JKS }}>
            {concept.name}
          </h2>

          {/* Instruction text — Nunito for comfortable reading */}
          <p className="prose">
            {isPreTest
              ? "You haven't studied this yet — attempt it cold. The mistake will make it stick."
              : queue === 'new'
              ? 'First encounter — study the pattern, then rate your understanding.'
              : queue === 'review'
              ? 'This was fading. Solve it from scratch without notes.'
              : queue === 'challenge'
              ? 'You had this automatic — verify it still is.'
              : 'Strengthen this pattern. Apply it to a fresh problem.'}
          </p>

          {/* Stakes fact */}
          {concept.stakesFact && (queue === 'new' || queue === 'strengthen') && (
            <div className="mt-4 px-3 py-2.5 rounded-xl flex items-start gap-2 bg-[#FEF2F2] border border-[#FECACA]">
              <AlertCircle size={13} className="text-[#B91C1C] shrink-0 mt-0.5" />
              <p className="text-[13px] text-[#991B1B] leading-snug font-reading">{concept.stakesFact}</p>
            </div>
          )}

          {/* AI Hint */}
          <button
            onClick={() => setShowAI(true)}
            className="mt-4 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-semibold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] transition-colors hover:bg-[#DBEAFE]"
            style={{ fontFamily: JKS }}
          >
            <Sparkles size={13} />
            AI Hint
          </button>
        </div>

        {/* ── Confidence Widget ── */}
        {!showOptions && (
          <div className="mb-4">
            <p className="text-[13px] font-semibold text-[#78716C] mb-3 text-center" style={{ fontFamily: JKS }}>
              How confident are you?
            </p>
            <div className="flex gap-2.5">
              {([
                { level: 1 as const, label: 'Unsure',  Icon: HelpCircle, bg: '#FEF2F2', border: '#FECACA',  color: '#B91C1C' },
                { level: 2 as const, label: 'Partial',  Icon: PieChart,   bg: '#FFFBEB', border: '#FDE68A', color: '#B45309' },
                { level: 3 as const, label: 'Certain',  Icon: Zap,        bg: '#F0FDF4', border: '#BBF7D0', color: '#15803D' },
              ]).map(({ level, label, Icon, bg, border, color }) => (
                <button
                  key={level}
                  onClick={() => handleConfidenceTap(level)}
                  className="flex-1 py-4 rounded-xl text-center transition-all duration-150 active:scale-95"
                  style={{ background: bg, border: `1.5px solid ${border}` }}
                >
                  <div className="flex justify-center mb-1.5">
                    <Icon size={20} style={{ color }} />
                  </div>
                  <div className="text-[12px] font-semibold" style={{ color, fontFamily: JKS }}>{label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Self-Assessment Options ── */}
        {showOptions && (
          <div className="space-y-2.5 mb-4">
            {/* Confidence indicator */}
            {confidence && (
              <div className="flex justify-center mb-1">
                <span
                  className="text-[12px] font-semibold px-3 py-1 rounded-full"
                  style={{
                    fontFamily: JKS,
                    background: confidence === 1 ? '#FEF2F2' : confidence === 2 ? '#FFFBEB' : '#F0FDF4',
                    color: confidence === 1 ? '#B91C1C' : confidence === 2 ? '#B45309' : '#15803D',
                    border: `1px solid ${confidence === 1 ? '#FECACA' : confidence === 2 ? '#FDE68A' : '#BBF7D0'}`,
                  }}
                >
                  {confidence === 1 ? 'Unsure' : confidence === 2 ? 'Partial' : 'Certain'}
                </span>
              </div>
            )}

            {RATINGS.map((r) => {
              const isSelected = selected === r.id;
              const borderColor = isSelected
                ? r.outcome === 'correct' ? '#15803D' : r.outcome === 'partial' ? '#B45309' : '#B91C1C'
                : '#E8E5DF';
              const bgColor = isSelected
                ? r.outcome === 'correct' ? '#F0FDF4' : r.outcome === 'partial' ? '#FFFBEB' : '#FEF2F2'
                : '#FFFFFF';

              return (
                <button
                  key={r.id}
                  onClick={() => !confirmed && handleSelect(r.id)}
                  className="w-full px-4 py-3.5 rounded-xl text-left transition-all duration-120 border"
                  style={{ background: bgColor, borderColor }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[20px]">{r.icon}</span>
                    <div className="flex-1">
                      <div className="text-[14px] font-semibold text-[#1C1917] font-reading">{r.label}</div>
                      <div className="text-[12px] text-[#A8A29E] mt-0.5 font-reading">{r.sub}</div>
                    </div>
                    {isSelected && (
                      r.outcome === 'correct'
                        ? <CheckCircle2 size={18} className="text-[#15803D]" />
                        : <XCircle size={18} style={{ color: r.outcome === 'partial' ? '#B45309' : '#B91C1C' }} />
                    )}
                  </div>
                </button>
              );
            })}

            <button
              onClick={() => selected && setConfirmed(true)}
              className={`btn-primary mt-1 ${!selected ? 'opacity-40 cursor-not-allowed' : ''}`}
              disabled={!selected}
            >
              Confirm <ArrowRight size={17} />
            </button>
          </div>
        )}
      </div>

      {/* ── AI Learn sheet ── */}
      <AnimatePresence>
        {showAI && (
          <SharePromptSheet
            conceptName={concept.name}
            subject={concept.subject}
            chapter={concept.chapter}
            onClose={() => setShowAI(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Result bottom sheet ── */}
      <AnimatePresence>
        {confirmed && selectedRating && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            className="fixed inset-x-0 bottom-0 z-[70] bg-white rounded-t-2xl"
            style={{ borderTop: '1px solid #E8E5DF', minHeight: '52%', maxWidth: 448, margin: '0 auto' }}
          >
            {/* Handle */}
            <div className="w-10 h-1 rounded-full bg-[#E8E5DF] mx-auto mt-3 mb-5" />

            <div className="px-5 pb-8">
              {/* Result header */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{
                    background: selectedRating.outcome === 'correct' ? '#F0FDF4' : selectedRating.outcome === 'partial' ? '#FFFBEB' : '#FEF2F2',
                  }}
                >
                  {selectedRating.outcome === 'correct'
                    ? <CheckCircle2 size={24} className="text-[#15803D]" />
                    : selectedRating.outcome === 'partial'
                    ? <CheckCircle2 size={24} className="text-[#B45309]" />
                    : <XCircle size={24} className="text-[#B91C1C]" />}
                </div>
                <div>
                  <h3
                    className="text-[18px] font-bold"
                    style={{
                      fontFamily: JKS,
                      color: selectedRating.outcome === 'correct' ? '#15803D' : selectedRating.outcome === 'partial' ? '#B45309' : '#B91C1C',
                    }}
                  >
                    {selectedRating.label}
                  </h3>
                  <p className="text-[12px] text-[#A8A29E]">
                    {selectedRating.outcome === 'correct' ? 'Stability ↑ · Difficulty ↓' : selectedRating.outcome === 'partial' ? 'Stability → · Difficulty →' : 'Stability ↓ · Difficulty ↑'}
                  </p>
                </div>
              </div>

              {/* Next step */}
              <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] mb-5">
                <p className="text-[12px] font-semibold text-[#2563EB] mb-1.5" style={{ fontFamily: JKS }}>
                  Next Step
                </p>
                <p className="prose" style={{ fontSize: '14px', lineHeight: '1.75' }}>
                  {selectedRating.outcome === 'correct'
                    ? `${concept.name} is moving toward Automatic. Next review in ${Math.round((concept.stability || 10) * 1.2)} days.`
                    : selectedRating.outcome === 'partial'
                    ? `Study the edge cases of ${concept.name}. Re-encode the trigger conditions.`
                    : `${concept.name} needs re-encoding. Go to the encoding phase now.`}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  className="flex-1 py-3.5 rounded-xl text-[14px] font-semibold text-[#78716C] bg-[#F7F6F3] border border-[#E8E5DF]"
                  style={{ fontFamily: JKS }}
                >
                  Flag for Review
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-3.5 rounded-xl text-[14px] font-semibold text-white bg-[#2563EB] flex items-center justify-center gap-2"
                  style={{ fontFamily: JKS }}
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
