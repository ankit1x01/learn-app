/**
 * QuizMCQ: Displays a single quiz MCQ with options
 * User selects answer + indicates confidence
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';

export interface QuizMCQData {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  stage?: 'pre' | 'post';
}

export const QuizMCQ = ({
  mcq,
  index,
  total,
  selected,
  confidence,
  confirmed,
  onSelect,
  onConfidence,
  onConfirm,
}: {
  mcq: QuizMCQData;
  index: number;
  total: number;
  selected: number | null;
  confidence: 1 | 2 | 3 | null;
  confirmed: boolean;
  onSelect: (optionIndex: number) => void;
  onConfidence: (level: 1 | 2 | 3) => void;
  onConfirm: () => void;
}) => {
  return (
    <div className="space-y-6 py-2">
      {/* Question counter */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-on-surface-variant)' }}>
          MCQ {index + 1} of {total}
        </span>
        {mcq.stage && (
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
            mcq.stage === 'post' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {mcq.stage.toUpperCase()}
          </span>
        )}
      </div>

      {/* Question */}
      <h3 className="text-lg font-bold leading-snug">
        {mcq.question}
      </h3>

      {/* Options */}
      <div className="space-y-2">
        {mcq.options.map((option, i) => (
          <motion.button
            key={i}
            onClick={() => onSelect(i)}
            disabled={confirmed}
            className={`w-full p-3.5 rounded-2xl text-left transition-all text-sm border-2 ${
              selected === i
                ? `border-[var(--color-primary)] bg-[var(--color-primary)]/10`
                : `border-[var(--color-outline)] bg-[var(--color-surface)]`
            } ${confirmed ? 'cursor-default opacity-50' : 'cursor-pointer'}`}
            whileHover={!confirmed ? { scale: 1.01 } : {}}
            whileTap={!confirmed ? { scale: 0.99 } : {}}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${
                  selected === i
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                    : 'border-[var(--color-outline)]'
                }`}
              >
                {selected === i && (
                  <span className="material-symbols-rounded text-white" style={{ fontSize: 16 }}>
                    check
                  </span>
                )}
              </div>
              <span className="flex-1">{option}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Confidence selector */}
      {selected !== null && !confirmed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl" style={{ background: 'var(--color-surface-container)' }}
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-on-surface-variant)' }}>
            How confident are you?
          </p>
          <div className="flex gap-2">
            {([1, 2, 3] as const).map((level) => (
              <button
                key={level}
                onClick={() => onConfidence(level)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  confidence === level
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-white text-[var(--color-on-surface-variant)] border border-[var(--color-outline)]'
                }`}
              >
                {level === 1 ? '🤔 Unsure' : level === 2 ? '🤷 Partial' : '✓ Certain'}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Confirm button */}
      {selected !== null && !confirmed && confidence !== null && (
        <button
          onClick={onConfirm}
          className="w-full py-3 rounded-full font-bold text-sm bg-[var(--color-primary)] text-white"
        >
          Confirm Answer
        </button>
      )}

      {confirmed && (
        <div className="p-4 rounded-2xl" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#16a34a' }}>
            Answer submitted
          </p>
          <p className="text-sm text-[var(--color-on-surface)]">
            {selected === mcq.correct ? '✓ Correct!' : '✗ Incorrect'}
          </p>
        </div>
      )}
    </div>
  );
};
