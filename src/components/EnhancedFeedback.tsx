/**
 * EnhancedFeedback: Shows why answers were correct/incorrect + connections
 * Displayed after prediction + quiz MCQs are answered
 */

import React from 'react';
import { motion } from 'motion/react';
import type { Concept } from '../core/types';

export const EnhancedFeedback = ({
  concept,
  predictionAccuracy,
  quizAnswers,
  onContinue,
}: {
  concept: Concept;
  predictionAccuracy: boolean | null;
  quizAnswers: Array<{ mcqId: string; selected: number; confidence: 1 | 2 | 3; correct: boolean }>;
  onContinue: () => void;
}) => {
  const totalCorrect = (predictionAccuracy ? 1 : 0) + quizAnswers.filter(a => a.correct).length;
  const totalQuestions = (predictionAccuracy !== null ? 1 : 0) + quizAnswers.length;
  const accuracy = Math.round((totalCorrect / totalQuestions) * 100);

  // Determine feedback tone
  const getAccuracyMessage = () => {
    if (accuracy === 100) return "🎯 Perfect! You've mastered this concept.";
    if (accuracy >= 75) return "✓ Great understanding! Minor gaps remain.";
    if (accuracy >= 50) return "🤔 Good start, but some confusion exists.";
    return "⚠️ Significant gaps detected. Study more.";
  };

  return (
    <div className="pt-14 pb-24 px-4 max-w-md mx-auto">
      {/* Results Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8 p-5 rounded-3xl"
        style={{
          background: accuracy >= 75 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(251, 146, 60, 0.1)',
          border: `2px solid ${accuracy >= 75 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(251, 146, 60, 0.3)'}`,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold" style={{ color: accuracy >= 75 ? '#16a34a' : '#ea580c' }}>
            {getAccuracyMessage()}
          </p>
          <div className="text-2xl font-black">{accuracy}%</div>
        </div>
        <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
          {totalCorrect} of {totalQuestions} correct
        </p>
      </motion.div>

      {/* Concept Name */}
      <h2 className="text-2xl font-bold mb-6 leading-snug">
        {concept.name}
      </h2>

      {/* Key Insights */}
      <div className="space-y-4 mb-8">
        {predictionAccuracy !== null && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-2xl"
            style={{
              background: predictionAccuracy ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              borderLeft: `4px solid ${predictionAccuracy ? '#22c55e' : '#ef4444'}`,
            }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-on-surface-variant)' }}>
              Prediction
            </p>
            <p className="text-sm">
              {predictionAccuracy ? '✓ Your prediction was correct!' : '✗ Prediction didn\'t match reality.'}
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--color-on-surface-variant)' }}>
              {predictionAccuracy
                ? 'Your intuition was solid. This shows good conceptual understanding.'
                : 'Wrong predictions reveal gaps. Review this concept carefully.'}
            </p>
          </motion.div>
        )}

        {quizAnswers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-2xl"
            style={{
              background: 'rgba(59, 130, 246, 0.08)',
              borderLeft: '4px solid #3b82f6',
            }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-on-surface-variant)' }}>
              Quiz Performance
            </p>
            <p className="text-sm">
              {quizAnswers.filter(a => a.correct).length} of {quizAnswers.length} questions correct
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--color-on-surface-variant)' }}>
              {quizAnswers.some(a => !a.correct) ? 'Review the explanations for incorrect answers.' : 'Excellent! You understood all angles of this concept.'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Stakes/Motivation */}
      {concept.stakesFact && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-2xl mb-8"
          style={{ background: 'rgba(108, 99, 255, 0.08)', borderLeft: '4px solid rgb(108, 99, 255)' }}
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-on-surface-variant)' }}>
            Why This Matters
          </p>
          <p className="text-sm leading-relaxed">
            {concept.stakesFact}
          </p>
        </motion.div>
      )}

      {/* Related Concepts */}
      {concept.relatedIds && concept.relatedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-on-surface-variant)' }}>
            Connected Concepts
          </p>
          <div className="flex flex-wrap gap-2">
            {concept.relatedIds.slice(0, 3).map((id) => (
              <div
                key={id}
                className="px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{
                  background: 'var(--color-surface-container)',
                  color: 'var(--color-on-surface-variant)',
                }}
              >
                → {id.replace('ai_', '')}
              </div>
            ))}
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--color-on-surface-variant)' }}>
            These concepts strengthen each other. Review them within 2 hours for maximum retention.
          </p>
        </motion.div>
      )}

      {/* Continue Button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={onContinue}
        className="w-full py-3 rounded-full font-bold text-sm bg-[var(--color-primary)] text-white"
      >
        Next Concept →
      </motion.button>
    </div>
  );
};
