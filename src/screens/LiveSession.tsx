import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toast } from '@capacitor/toast';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { RATINGS, QUEUE_LABELS, subjectColor, subjectBg, subjectIcon } from '../lib/config';
import { TierBadge } from '../components/TierBadge';
import { ConceptPrediction } from './ConceptPrediction';
import { QuizMCQ } from '../components/QuizMCQ';
import type { QuizMCQData } from '../components/QuizMCQ';
import { EnhancedFeedback } from '../components/EnhancedFeedback';
import type { Screen } from '../types';
import type { SessionItem, Concept } from '../core/types';
import type { SessionItemWithQuiz } from '../lib/quiz-session-bridge';
import type { SessionItemWithGame } from '../lib/game-session-bridge';
import {
  advanceStage, regressStage,
  updateStabilityOnSuccess, updateStabilityOnFailure,
  updateDifficulty, getNextReviewDays,
  getPredictionErrorMultiplier,
  updateFSRSFromQuiz,
  updateFSRSFromGamePerformance,
} from '../core/fsrs';
import { gamePerformanceStore } from '../lib/game-performance-store';
import { updateMetacogAccuracy, detectOverconfidence, detectCognitiveFatigue, getAdaptiveSessionLength } from '../core/metacognition';
import { recordTodayLogin } from '../db/store';


const JKS = "'Plus Jakarta Sans', system-ui, sans-serif";

export const LiveSession = ({
  setScreen,
  session,
  qIndex,
  setQIndex,
  onUpdateConcept,
  subjectFilter,
}: {
  setScreen: (s: Screen) => void;
  session: (SessionItem | SessionItemWithQuiz | SessionItemWithGame)[];
  qIndex: number;
  setQIndex: (i: number) => void;
  onUpdateConcept: (id: string, updates: Partial<Concept>) => void;
  subjectFilter: string | null;
}) => {
  const [selected, setSelected]       = useState<string | null>(null);
  const [confirmed, setConfirmed]     = useState(false);
  const [confidence, setConfidence]   = useState<1 | 2 | 3 | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const questionShownAt               = useRef<number>(Date.now());
  const [responseTimeMs, setResponseTimeMs] = useState<number | null>(null);
  const [sessionResponseTimes, setSessionResponseTimes] = useState<Record<number, number>>({});

  // ── Prediction Flow (Phase 4.1) ────────────────────────────────────────
  const [showingPrediction, setShowingPrediction] = useState(false);
  const [predictionAnswered, setPredictionAnswered] = useState(false);
  const [predictionTimeMs, setPredictionTimeMs] = useState<number | null>(null);

  // ── Quiz MCQ Flow (Phase 4.2) ──────────────────────────────────────────
  const [quizMCQIndex, setQuizMCQIndex] = useState(0);
  const [quizMCQSelected, setQuizMCQSelected] = useState<number | null>(null);
  const [quizMCQConfidence, setQuizMCQConfidence] = useState<1 | 2 | 3 | null>(null);
  const [quizMCQConfirmed, setQuizMCQConfirmed] = useState(false);
  const [quizMCQAnswers, setQuizMCQAnswers] = useState<Array<{ mcqId: string; selected: number; confidence: 1 | 2 | 3; correct: boolean }>>([]);

  // ── Feedback Phase (Phase 4.3) ─────────────────────────────────────────
  const [showingFeedback, setShowingFeedback] = useState(false);

  const current = session[qIndex] ?? session[0];

  useEffect(() => {
    if (!current) {
      const t = setTimeout(() => setScreen('dashboard'), 1500);
      return () => clearTimeout(t);
    }
  }, [current, setScreen]);

  useEffect(() => {
    // Deliberate session start: record the login/streak advance
    recordTodayLogin().catch(console.error);
  }, []);

  if (!current) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-4" style={{ background: 'var(--color-background)' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'var(--color-primary-container)' }}>
          <span className="material-symbols-rounded" style={{ fontSize: 28,  color: 'var(--color-primary)'  }}>check_circle</span>
        </div>
        <p className="text-[16px] font-bold text-center" style={{ color: 'var(--color-on-surface)', fontFamily: JKS }}>
          All caught up!
        </p>
        <p className="text-[13px] text-center" style={{ color: 'var(--color-on-surface-variant)' }}>
          No concepts due right now. Come back later or start a new topic.
        </p>
      </div>
    );
  }

  const isQuizItem = (current as any).type === 'quiz';
  const isGameItem = (current as any).type === 'game';
  const { concept, queue, retrievability } = (!isQuizItem && !isGameItem) ? current : { concept: null, queue: current.queue, retrievability: current.retrievability };
  const quiz = isQuizItem ? (current as SessionItemWithQuiz).quiz : null;
  const game = isGameItem ? (current as SessionItemWithGame).game : null;
  const isPreTest = current.isPreTest ?? false;
  const qLabel = QUEUE_LABELS[queue];

  const rPct = retrievability > 0 ? Math.round(retrievability * 100) : null;
  const selectedRating = RATINGS.find(r => r.id === selected);
  const progress = ((qIndex + 1) / session.length) * 100;

  useEffect(() => {
    console.log('🔄 Effect running: qIndex =', qIndex);
    setConfidence(null);
    setShowOptions(false);
    setSelected(null);
    setConfirmed(false);
    setResponseTimeMs(null);
    questionShownAt.current = Date.now();

    // Reset prediction flow state when question changes
    setPredictionAnswered(false);
    setPredictionTimeMs(null);

    // Reset quiz MCQ flow when question changes
    setQuizMCQIndex(0);
    setQuizMCQSelected(null);
    setQuizMCQConfidence(null);
    setQuizMCQConfirmed(false);
    setQuizMCQAnswers([]);

    // Reset feedback when question changes
    setShowingFeedback(false);

    // Show prediction if this item has a prediction MCQ and it hasn't been answered yet
    const hasUnstartedPrediction = current?.predictionMCQ && !predictionAnswered;
    setShowingPrediction(hasUnstartedPrediction ?? false);
  }, [qIndex]);

  const handlePredictionAnswered = (userChoice: number, predictionTime: number) => {
    console.log('🔵 Prediction answered:', { userChoice, predictionTime, conceptId: concept?.id });

    // Track prediction accuracy
    if (current?.predictionMCQ) {
      const wasCorrect = userChoice === current.predictionMCQ.correct;
      console.log('✓ Prediction correct:', wasCorrect);

      // Update session item with prediction result
      const updatedCurrent = {
        ...current,
        predictionAccuracy: wasCorrect,
        predictionTimeMs: predictionTime,
      };

      // If it's a concept item, update FSRS with prediction error
      if (concept && !isQuizItem && !isGameItem) {
        let newPredictionErrorHistory = concept.predictionErrorHistory ?? [];
        newPredictionErrorHistory = [...newPredictionErrorHistory, {
          date: Date.now(),
          preTestWrong: !wasCorrect
        }];

        onUpdateConcept(concept.id, {
          predictionErrorHistory: newPredictionErrorHistory,
        });
      }
    }

    // Move to next phase: quiz MCQs or feedback
    setPredictionTimeMs(predictionTime);
    setPredictionAnswered(true);
    setShowingPrediction(false);

    // If no quiz MCQs exist for this concept, skip directly to feedback
    if (!current?.quizMCQs || current.quizMCQs.length === 0) {
      console.log('⏭️ No quiz MCQs, skipping to feedback');
      setTimeout(() => {
        setShowingFeedback(true);
      }, 500);
    } else {
      console.log('📋 Quiz MCQs found:', current.quizMCQs.length);
    }
  };

  const handleQuizMCQSelect = (optionIndex: number) => {
    if (!quizMCQConfirmed) {
      setQuizMCQSelected(optionIndex);
    }
  };

  const handleQuizMCQConfidence = (level: 1 | 2 | 3) => {
    setQuizMCQConfidence(level);
  };

  const handleFeedbackContinue = () => {
    console.log('➡️ Feedback continue, moving to next concept');
    // Move to next concept
    const next = qIndex + 1;
    if (next >= session.length) {
      console.log('✅ Session complete');
      setQIndex(0);
      setScreen('complete');
    } else {
      console.log('📍 Moving to concept', next + 1);
      setQIndex(next);
    }
  };

  const handleQuizMCQConfirm = () => {
    if (quizMCQSelected !== null && quizMCQConfidence !== null && current?.quizMCQs && current.quizMCQs.length > quizMCQIndex) {
      const mcq = current.quizMCQs[quizMCQIndex];
      const wasCorrect = quizMCQSelected === mcq.correct;

      // Record answer
      setQuizMCQAnswers([
        ...quizMCQAnswers,
        {
          mcqId: mcq.id,
          selected: quizMCQSelected,
          confidence: quizMCQConfidence,
          correct: wasCorrect,
        }
      ]);

      setQuizMCQConfirmed(true);

      // Move to next MCQ or end quiz flow
      const nextIndex = quizMCQIndex + 1;
      if (nextIndex < current.quizMCQs.length) {
        setTimeout(() => {
          setQuizMCQIndex(nextIndex);
          setQuizMCQSelected(null);
          setQuizMCQConfidence(null);
          setQuizMCQConfirmed(false);
        }, 1000);
      } else {
        // All quiz MCQs answered, show feedback
        setTimeout(() => {
          setShowingFeedback(true);
        }, 1000);
      }
    }
  };

  const handleConfidenceTap = (level: 1 | 2 | 3) => {
    setConfidence(level);
    setShowOptions(true);
  };

  const handleSelect = (id: string) => {
    if (confirmed) return;
    if (responseTimeMs === null) setResponseTimeMs(Date.now() - questionShownAt.current);
    setSelected(id);
  };

  const handleNext = async () => {
    if (selectedRating && confidence !== null) {
      const wasCorrect = selectedRating.outcome === 'correct';
      const wasPartial = selectedRating.outcome === 'partial';
      const wasWrong   = selectedRating.outcome === 'wrong';

      if (isGameItem && game) {
        // Create pseudo-concept ID for game tracking
        const gameConceptId = `game_${game.type}_${game.conceptId}`;
        const gameStats = JSON.parse(localStorage.getItem('game_stats') || '{}');
        // Find existing concept stability/difficulty
        const parentConcept = (current as SessionItemWithGame).concept;
        const curStage      = parentConcept?.stage ?? 'Unseen';
        const curStability  = parentConcept?.stability ?? 0;
        const curDifficulty = parentConcept?.difficulty ?? 0.5;

        // Game scoring: 75% for attempted, 100% for mastered
        const percentage = selected === 'game_mastered' ? 100 : 75;
        const gameResult = updateFSRSFromQuiz(curStage as any, curStability, curDifficulty, percentage, 1);

        // PERSIST TO CONCEPT STORE
        onUpdateConcept(game.conceptId, {
          stage: gameResult.stage as any,
          stability: gameResult.stability,
          difficulty: gameResult.difficulty,
          lastTested: Date.now(),
          lastStudiedAt: Date.now(),
          nextReview: getNextReviewDays(gameResult.stability),
        });

        // Also save to localStorage for historical game-specific tracking
        gameStats[gameConceptId] = {
          gameType: game.type,
          conceptId: game.conceptId,
          lastTested: Date.now(),
          stability: gameResult.stability,
          difficulty: gameResult.difficulty,
          stage: gameResult.stage,
          performance: percentage,
        };
        localStorage.setItem('game_stats', JSON.stringify(gameStats));

        // Track game performance in new pipeline
        try {
          await gamePerformanceStore.createPerformance(
            gameConceptId,
            game.conceptId,
            game.type,
            percentage,
            0 // timeSpent will be calculated by game component in future
          );
        } catch (err) {
          console.warn('Failed to save game performance:', err);
        }

        if (selected === 'game_mastered') {
          Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => {});
          Toast.show({ text: `Game Mastered! +${Math.round(gameResult.stability)} days` }).catch(() => {});
        } else {
          Haptics.notification({ type: 'WARNING' as any }).catch(() => {});
          Toast.show({ text: 'Game attempted. Keep practicing!' }).catch(() => {});
        }
      } else if (isQuizItem && quiz) {
        // Create pseudo-concept ID for quiz tracking
        const quizConceptId = `quiz_${quiz.lessonId}_${quiz.question.question.substring(0, 20)}`;
        const quizStats = JSON.parse(localStorage.getItem('quiz_stats') || '{}');
        const existingQuiz = quizStats[quizConceptId];

        // Quiz scoring: percentage based on correctness
        const percentage = wasCorrect ? 100 : 0;
        const quizResult = updateFSRSFromQuiz(existingQuiz?.stage ?? 'Unseen', existingQuiz?.stability ?? 0, existingQuiz?.difficulty ?? 0.5, percentage, 1);

        // Save to localStorage for persistence
        quizStats[quizConceptId] = {
          lessonId: quiz.lessonId,
          lessonName: quiz.lessonName,
          lastTested: Date.now(),
          stability: quizResult.stability,
          difficulty: quizResult.difficulty,
          stage: quizResult.stage,
          score: percentage,
        };
        localStorage.setItem('quiz_stats', JSON.stringify(quizStats));

        if (wasCorrect) {
          Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => {});
          Toast.show({ text: `Quiz Mastered! +${Math.round(quizResult.stability)} days` }).catch(() => {});
        } else {
          Haptics.notification({ type: 'WARNING' as any }).catch(() => {});
          Toast.show({ text: 'Quiz missed. Will review in 1 day.' }).catch(() => {});
        }
      } else if (concept) {
        // Concept scoring: existing FSRS logic
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
          lastTested: Date.now(),
          nextReview: getNextReviewDays(newStability),
          lastStudiedAt: Date.now(), metacogAccuracy: newMetacogAccuracy,
          overconfidenceFlag: newOverconfidenceFlag, predictionErrorHistory: newPredictionErrorHistory,
        });

        if (wasCorrect) {
          Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => {});
          Toast.show({ text: `Concepts Updated! Mastered +${Math.round(newStability)} days` }).catch(() => {});
        }
      }
    } else if (selectedRating && selectedRating.outcome !== 'correct' && confidence !== null) {
      Haptics.notification({ type: 'WARNING' as any }).catch(() => {});
    }

    // BUG-004: Record response time and detect cognitive fatigue
    const newSessionResponseTimes = { ...sessionResponseTimes, [qIndex]: responseTimeMs ?? 0 };
    setSessionResponseTimes(newSessionResponseTimes);
    const answeredItems = session.slice(0, qIndex + 1).map((item, i) => ({
      ...item,
      responseTimeMs: newSessionResponseTimes[i] ?? 0
    })) as SessionItem[];
    const fatigue = detectCognitiveFatigue(answeredItems);
    const adaptiveLength = getAdaptiveSessionLength(fatigue, session.length);

    const next = qIndex + 1;
    if (next >= adaptiveLength || next >= session.length) {
      if (fatigue === 'fatigued') {
         Toast.show({ text: 'High fatigue detected. Session completed early for rest.' }).catch(() => {});
      }
      setQIndex(0); setScreen('complete');
    } else if (session[qIndex].queue === 'new' && !isQuizItem && !isGameItem) {
      setQIndex(next); setScreen('encoding');
    } else {
      setQIndex(next);
    }
  };

  // Queue badge colors
  const queueStyle: Record<string, { bg: string; color: string }> = {
    review:    { bg: 'var(--color-error-container)', color: 'var(--color-on-error-container)' },
    new:       { bg: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' },
    strengthen:{ bg: 'var(--color-success-container)', color: 'var(--color-on-success-container)' },
    challenge: { bg: 'var(--color-subject-chemistry-container)', color: 'var(--color-subject-chemistry)' },
  };
  const qs = queueStyle[queue] ?? { bg: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)' };

  // Show prediction flow if needed
  if (showingPrediction && current?.predictionMCQ && concept) {
    console.log('🎯 Showing prediction');
    return (
      <>
        <ConceptPrediction
          concept={concept}
          predictionMCQ={current.predictionMCQ}
          onNext={handlePredictionAnswered}
        />
      </>
    );
  }

  // Show feedback if quiz MCQs are all answered
  if (showingFeedback && concept && !isQuizItem && !isGameItem) {
    console.log('📊 Showing feedback');
    return (
      <EnhancedFeedback
        concept={concept}
        predictionAccuracy={current?.predictionAccuracy ?? null}
        quizAnswers={quizMCQAnswers}
        onContinue={handleFeedbackContinue}
      />
    );
  }

  // Show quiz MCQ flow if prediction is answered and there are quiz MCQs
  if (predictionAnswered && current?.quizMCQs && current.quizMCQs.length > 0 && quizMCQIndex < current.quizMCQs.length) {
    console.log('📝 Showing quiz MCQ', quizMCQIndex + 1, 'of', current.quizMCQs.length);
    const currentMCQ = current.quizMCQs[quizMCQIndex];
    return (
      <div className="pt-14 pb-24 px-4 max-w-md mx-auto">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-on-surface-variant)' }}>
              Question Phase
            </span>
            <span className="text-xs font-bold" style={{ color: 'var(--color-on-surface-variant)' }}>
              {quizMCQIndex + 1}/{current.quizMCQs.length}
            </span>
          </div>
          <div className="h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-primary)] transition-all"
              style={{ width: `${((quizMCQIndex + 1) / current.quizMCQs.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Concept brief reminder */}
        <div className="mb-6 p-3 rounded-lg" style={{ background: 'var(--color-surface-container)' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-on-surface-variant)' }}>
            Topic: {concept?.name}
          </p>
        </div>

        {/* MCQ */}
        <QuizMCQ
          mcq={currentMCQ}
          index={quizMCQIndex}
          total={current.quizMCQs.length}
          selected={quizMCQSelected}
          confidence={quizMCQConfidence}
          confirmed={quizMCQConfirmed}
          onSelect={handleQuizMCQSelect}
          onConfidence={handleQuizMCQConfidence}
          onConfirm={handleQuizMCQConfirm}
        />
      </div>
    );
  }

  return (
    <div className="pt-12 pb-24 max-w-md mx-auto min-h-screen flex flex-col" style={{ background: 'var(--color-background)' }}>

      {/* ── Top progress bar ── */}
      <div className="h-1 bg-[var(--color-border)] w-full">
        <motion.div
          className="h-full bg-[var(--color-primary)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* ── Header row ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={() => setScreen('dashboard')}
          className="w-9 h-9 rounded-xl flex items-center justify-center border" style={{ background: 'var(--color-surface-container)', borderColor: 'var(--color-border)' }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 16,  color: 'var(--color-on-surface-muted)'  }}>close</span>
        </button>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold" style={{ fontFamily: JKS, color: 'var(--color-on-surface)' }}>
              Q{qIndex + 1}
            </span>
            <span className="text-[14px]" style={{ color: 'var(--color-on-surface-muted)' }}>/ {session.length}</span>
          </div>
          {subjectFilter && (
            <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: 'var(--color-primary)' }}>
              {subjectFilter}
            </span>
          )}
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
                background: i < qIndex ? 'var(--color-success)' : i === qIndex ? 'var(--color-primary)' : 'var(--color-border)',
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
            {isGameItem && game ? (
              <>
                <span
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                  style={{ fontFamily: JKS, background: '#DBEAFE', color: '#0369A1', border: '1px solid #BAE6FD' }}
                >
                  <span className="flex items-center gap-1"><span className="material-symbols-rounded" style={{ fontSize: 12 }}>sports_esports</span> Game</span>
                </span>
                <span
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                  style={{ fontFamily: JKS, background: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)', border: '1px solid var(--color-border)' }}
                >
                  {game.difficulty.toUpperCase()}
                </span>
              </>
            ) : isQuizItem && quiz ? (
              <>
                <span
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                  style={{ fontFamily: JKS, background: '#F3E8FF', color: '#6B21A8', border: '1px solid #E9D5FF' }}
                >
                  <span className="flex items-center gap-1"><span className="material-symbols-rounded" style={{ fontSize: 12 }}>quiz</span> Quiz</span>
                </span>
                <span
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                  style={{ fontFamily: JKS, background: qs.bg, color: qs.color, border: `1px solid ${qs.bg}` }}
                >
                  {qLabel.label}{rPct !== null ? ` · ${rPct}%` : ''}
                </span>
              </>
            ) : (
              <>
                <span
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                  style={{ fontFamily: JKS, background: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)', border: '1px solid var(--color-border)' }}
                >
                  {concept && <span className="material-symbols-rounded" style={{ fontSize: 16 }}>{subjectIcon(concept.subject)}</span>} {concept?.subject}
                </span>
                <span
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                  style={{ fontFamily: JKS, background: qs.bg, color: qs.color, border: `1px solid ${qs.bg}` }}
                >
                  {qLabel.label}{rPct !== null ? ` · ${rPct}%` : ''}
                </span>
                {concept && <TierBadge tier={concept.pyqTier} />}
              </>
            )}
            {isPreTest && (
              <span
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                style={{ fontFamily: JKS, background: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A' }}
              >
                PRE-TEST
              </span>
            )}
          </div>

          {/* Chapter path, lesson path, or game context */}
          {isGameItem && game ? (
            <p className="text-[12px] text-[var(--color-border)] mb-3">{game.concept.chapter}</p>
          ) : isQuizItem && quiz ? (
            <p className="text-[12px] text-[var(--color-border)] mb-3">{quiz.lessonName}</p>
          ) : (
            <p className="text-[12px] text-[var(--color-border)] mb-3">{concept?.chapter} · Unit {concept?.unit}</p>
          )}

          {/* Question text (concept name, quiz question, or game challenge) */}
          <h2 className="text-[20px] font-bold text-[var(--color-on-surface)] leading-snug mb-3" style={{ fontFamily: JKS }}>
            {isGameItem && game ? game.concept.name : isQuizItem && quiz ? quiz.question.question : concept?.name}
          </h2>

          {/* Instruction text */}
          <p className="prose">
            {isGameItem
              ? `${game?.description} The challenge will help strengthen your understanding.`
              : isQuizItem
              ? 'Answer the question below. Your response will be used to schedule next review.'
              : isPreTest
              ? "You haven't studied this yet — attempt it cold. The mistake will make it stick."
              : queue === 'new'
              ? 'First encounter — study the pattern, then rate your understanding.'
              : queue === 'review'
              ? 'This was fading. Solve it from scratch without notes.'
              : queue === 'challenge'
              ? 'You had this automatic — verify it still is.'
              : 'Strengthen this pattern. Apply it to a fresh problem.'}
          </p>

          {!isQuizItem && concept && concept.stakesFact && (queue === 'new' || queue === 'strengthen') && (
            <div className="mt-4 px-3 py-2.5 rounded-xl flex items-start gap-2 bg-[#FEF2F2] border border-[#FECACA]">
              <span className="material-symbols-rounded text-[#B91C1C] shrink-0 mt-0.5" style={{ fontSize: 13 }}>error</span>
              <p className="text-[13px] text-[#991B1B] leading-snug font-reading">{concept.stakesFact}</p>
            </div>
          )}
        </div>

        {/* ── Confidence Widget (for concepts only) ── */}
        {!showOptions && !isGameItem && (
          <div className="mb-4">
            <p className="text-[13px] font-semibold text-[var(--color-on-surface-variant)] mb-3 text-center" style={{ fontFamily: JKS }}>
              How confident are you?
            </p>
            <div className="flex gap-2.5">
              {([
                { level: 1 as const, label: 'Unsure',  Icon: 'help',  bg: '#FEF2F2', border: '#FECACA',  color: '#B91C1C' },
                { level: 2 as const, label: 'Partial',  Icon: 'pie_chart',   bg: '#FFFBEB', border: '#FDE68A', color: '#B45309' },
                { level: 3 as const, label: 'Certain',  Icon: 'bolt',        bg: '#F0FDF4', border: '#BBF7D0', color: '#15803D' },
              ]).map(({ level, label, Icon, bg, border, color }) => (
                <button
                  key={level}
                  onClick={() => handleConfidenceTap(level)}
                  className="flex-1 py-4 rounded-xl text-center transition-all duration-150 active:scale-95"
                  style={{ background: bg, border: `1.5px solid ${border}` }}
                >
                  <div className="flex justify-center mb-1.5">
                    <span className="material-symbols-rounded" style={{ fontSize: 20, color }}>{Icon}</span>
                  </div>
                  <div className="text-[12px] font-semibold" style={{ color, fontFamily: JKS }}>{label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Game Challenge Widget ── */}
        {!showOptions && isGameItem && game && (
          <div className="mb-4 space-y-3">
            <p className="text-[13px] font-semibold text-[var(--color-on-surface-variant)] text-center" style={{ fontFamily: JKS }}>
              Mark this challenge
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => { setSelected('game_attempted'); handleConfidenceTap(2); }}
                className="flex-1 py-3.5 rounded-xl text-center transition-all duration-150 active:scale-95"
                style={{ background: '#DBEAFE', border: '1.5px solid #BAE6FD' }}
              >
                <div className="text-[12px] font-semibold" style={{ color: '#0369A1', fontFamily: JKS }}>
                  ✓ Attempted
                </div>
              </button>
              <button
                onClick={() => { setSelected('game_mastered'); handleConfidenceTap(3); }}
                className="flex-1 py-3.5 rounded-xl text-center transition-all duration-150 active:scale-95"
                style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0' }}
              >
                <div className="text-[12px] font-semibold" style={{ color: '#15803D', fontFamily: JKS }}>
                  ✓✓ Mastered
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ── Options (Quiz MCQs or Self-Assessment) ── */}
        {showOptions && (
          <div className="space-y-2.5 mb-4">
            {/* Confidence indicator for concepts only */}
            {!isQuizItem && confidence && (
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

            {isQuizItem && quiz ? (
              // Quiz MCQ rendering
              quiz.question.options.map((option, idx) => {
                const optionId = `option_${idx}`;
                const isSelected = selected === optionId;
                const isCorrect = idx === quiz.question.correct;
                const borderColor = isSelected
                  ? isCorrect ? '#15803D' : '#B91C1C'
                  : 'var(--color-border)';
                const bgColor = isSelected
                  ? isCorrect ? '#F0FDF4' : '#FEF2F2'
                  : '#FFFFFF';

                return (
                  <button
                    key={optionId}
                    onClick={() => !confirmed && handleSelect(optionId)}
                    className="w-full px-4 py-3.5 rounded-xl text-left transition-all duration-120 border"
                    style={{ background: bgColor, borderColor }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[16px] font-bold text-[var(--color-on-surface-variant)]">{String.fromCharCode(65 + idx)}</span>
                      <div className="flex-1">
                        <div className="text-[14px] text-[var(--color-on-surface)] font-reading">{option}</div>
                      </div>
                      {isSelected && (
                        isCorrect
                          ? <span className="material-symbols-rounded text-[#15803D]" style={{ fontSize: 18 }}>check_circle</span>
                          : <span className="material-symbols-rounded text-[#B91C1C]" style={{ fontSize: 18 }}>cancel</span>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              // Concept self-assessment rendering
              RATINGS.map((r) => {
                const isSelected = selected === r.id;
                const borderColor = isSelected
                  ? r.outcome === 'correct' ? '#15803D' : r.outcome === 'partial' ? '#B45309' : '#B91C1C'
                  : 'var(--color-border)';
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
                      <span className="material-symbols-rounded" style={{ fontSize: 20 }}>{r.icon}</span>
                      <div className="flex-1">
                        <div className="text-[14px] font-semibold text-[var(--color-on-surface)] font-reading">{r.label}</div>
                        <div className="text-[12px] text-[var(--color-border)] mt-0.5 font-reading">{r.sub}</div>
                      </div>
                      {isSelected && (
                        r.outcome === 'correct'
                          ? <span className="material-symbols-rounded text-[#15803D]" style={{ fontSize: 18 }}>check_circle</span>
                          : <span className="material-symbols-rounded" style={{ fontSize: 18,  color: r.outcome === 'partial' ? '#B45309' : '#B91C1C'  }}>cancel</span>
                      )}
                    </div>
                  </button>
                );
              })
            )}

            <button
              onClick={() => selected && setConfirmed(true)}
              className={`btn-primary mt-1 ${!selected ? 'opacity-40 cursor-not-allowed' : ''}`}
              disabled={!selected}
            >
              Confirm <span className="material-symbols-rounded" style={{ fontSize: 17 }}>arrow_forward</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Result bottom sheet ── */}
      <AnimatePresence>
        {confirmed && selectedRating && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            className="fixed inset-x-0 bottom-0 z-[70] bg-white rounded-t-2xl overflow-y-auto max-h-[80vh]"
            style={{ borderTop: '1px solid var(--color-border)', maxWidth: 448, margin: '0 auto' }}
          >
            {/* Handle */}
            <div className="w-10 h-1 rounded-full bg-[var(--color-border)] mx-auto mt-3 mb-5 sticky top-0" />

            <div className="px-5 pb-8">
              {/* Result header */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: selectedRating.outcome === 'correct' ? '#F0FDF4' : selectedRating.outcome === 'partial' ? '#FFFBEB' : '#FEF2F2',
                  }}
                >
                  {selectedRating.outcome === 'correct'
                    ? <span className="material-symbols-rounded text-[#15803D]" style={{ fontSize: 24 }}>check_circle</span>
                    : selectedRating.outcome === 'partial'
                    ? <span className="material-symbols-rounded text-[#B45309]" style={{ fontSize: 24 }}>check_circle</span>
                    : <span className="material-symbols-rounded text-[#B91C1C]" style={{ fontSize: 24 }}>cancel</span>}
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
                  <p className="text-[12px] text-[var(--color-border)]">
                    {isGameItem
                      ? selected === 'game_mastered'
                        ? 'Will review in 10 days'
                        : 'Will review in 2 days'
                      : isQuizItem
                      ? selectedRating.outcome === 'correct'
                        ? 'Will review in 7 days'
                        : 'Will review in 1 day'
                      : selectedRating.outcome === 'correct'
                      ? 'Stability ↑ · Difficulty ↓'
                      : selectedRating.outcome === 'partial'
                      ? 'Stability → · Difficulty →'
                      : 'Stability ↓ · Difficulty ↑'}
                  </p>
                </div>
              </div>

              {/* Game feedback, quiz explanation, or concept next step */}
              {isGameItem && game ? (
                <div className="p-4 rounded-xl bg-[#DBEAFE] border border-[#BAE6FD] mb-5">
                  <p className="text-[12px] font-semibold text-[#0369A1] mb-2" style={{ fontFamily: JKS }}>
                    {selected === 'game_mastered' ? '✓ Great Work!' : '✓ Nice Attempt!'}
                  </p>
                  <p className="prose text-[14px] leading-relaxed text-[var(--color-on-surface)]">
                    {selected === 'game_mastered'
                      ? `You've mastered the ${game.type.replace('-', ' ')} challenge for ${game.concept.name}. The pattern is now deeply embedded.`
                      : `You attempted the ${game.type.replace('-', ' ')} challenge. Keep practicing ${game.concept.name} to achieve mastery.`}
                  </p>
                </div>
              ) : isQuizItem && quiz ? (
                <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] mb-5">
                  <p className="text-[12px] font-semibold text-[#2563EB] mb-2" style={{ fontFamily: JKS }}>
                    Explanation
                  </p>
                  <p className="prose text-[14px] leading-relaxed text-[var(--color-on-surface)]">
                    {quiz.question.explanation}
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] mb-5">
                  <p className="text-[12px] font-semibold text-[#2563EB] mb-1.5" style={{ fontFamily: JKS }}>
                    Next Step
                  </p>
                  <p className="prose" style={{ fontSize: '14px', lineHeight: '1.75' }}>
                    {selectedRating.outcome === 'correct'
                      ? `${concept?.name} is moving toward Automatic. Next review in ${Math.round((concept?.stability || 10) * 1.2)} days.`
                      : selectedRating.outcome === 'partial'
                      ? `Study the edge cases of ${concept?.name}. Re-encode the trigger conditions.`
                      : `${concept?.name} needs re-encoding. Go to the encoding phase now.`}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  className="flex-1 py-3.5 rounded-xl text-[14px] font-semibold text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container)] border border-[var(--color-border)]"
                  style={{ fontFamily: JKS }}
                >
                  Flag for Review
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-3.5 rounded-xl text-[14px] font-semibold text-white bg-[#2563EB] flex items-center justify-center gap-2"
                  style={{ fontFamily: JKS }}
                >
                  Next <span className="material-symbols-rounded" style={{ fontSize: 16 }}>arrow_forward</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
