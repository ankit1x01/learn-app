/**
 * ConceptPrediction: Active recall before the main MCQ
 * Shows concept brief + prediction question
 * Tracks prediction accuracy for learning analysis
 */

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ConceptBrief } from '../components/ConceptBrief';
import type { Concept } from '../core/types';
import type { PredictionMCQ } from '../lib/prediction-generator';

export const ConceptPrediction = ({
  concept,
  predictionMCQ,
  onNext,
}: {
  concept: Concept;
  predictionMCQ: PredictionMCQ;
  onNext: (userChoice: number, predictionTime: number) => void;
}) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const questionShownAt = useRef<number>(Date.now());

  const handleSelect = (index: number) => {
    if (!confirmed) {
      setSelected(index);
    }
  };

  const handleConfirm = () => {
    if (selected !== null) {
      const predictionTime = Date.now() - questionShownAt.current;
      setConfirmed(true);
      // Small delay to show selection feedback before advancing
      setTimeout(() => {
        onNext(selected, predictionTime);
      }, 300);
    }
  };

  return (
    <div className="pt-14 pb-24 px-4 max-w-md mx-auto">
      <ConceptBrief concept={concept} />

      {/* Divider */}
      <div className="my-6 border-t" style={{ borderColor: 'var(--color-surface-container)' }} />

      {/* Prediction Phase Label */}
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-on-surface-variant)' }}>
          <span className="material-symbols-rounded inline-block" style={{ fontSize: 14, marginRight: 4 }}>
            lightbulb
          </span>
          Make a Prediction
        </p>
        <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
          Think before seeing the full question. Your prediction helps identify knowledge gaps.
        </p>
      </div>

      {/* Prediction Question */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-5 leading-snug">
          {predictionMCQ.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {predictionMCQ.options.map((option, i) => (
            <motion.button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={confirmed}
              className={`w-full p-4 rounded-2xl text-left transition-all text-sm leading-relaxed border-2 ${
                selected === i
                  ? `border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-on-surface)]`
                  : `border-[var(--color-outline)] bg-[var(--color-surface)] text-[var(--color-on-surface)]`
              } ${confirmed ? 'cursor-default opacity-60' : 'cursor-pointer'}`}
              whileHover={!confirmed ? { scale: 1.02 } : {}}
              whileTap={!confirmed ? { scale: 0.98 } : {}}
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
                <span>{option}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        disabled={selected === null || confirmed}
        className={`w-full py-3 rounded-full font-bold text-sm transition-all ${
          selected !== null && !confirmed
            ? 'bg-[var(--color-primary)] text-white'
            : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] opacity-50 cursor-not-allowed'
        }`}
      >
        {confirmed ? 'Moving to main question...' : 'Confirm Prediction'}
      </button>

      {/* Help text */}
      <p className="text-xs mt-4 text-center" style={{ color: 'var(--color-on-surface-variant)' }}>
        Making a wrong prediction helps you learn more. No pressure!
      </p>
    </div>
  );
};
