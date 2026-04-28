// src/games/components/memory/SynthesisGame.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MemorySynthesisConfig } from '../../types';
import { m3SpatialDefault, m3EffectsEase } from '../../../lib/m3-motion';

export function SynthesisGame({ config }: { config: MemorySynthesisConfig }) {
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSelect = (val: boolean) => {
    setSelectedAnswer(val);
    setShowFeedback(true);
  };

  const isCorrect = selectedAnswer === config.conclusion.isValid;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-surface overflow-hidden relative">
      <div className="text-headline-small mb-12 text-center">Synthesize the Evidence</div>

      {/* Evidence Bubbles */}
      <div className="relative w-full max-w-2xl h-64 mb-12 flex justify-center items-center gap-8">
        {config.premises.map((premise, i) => (
          <motion.div
            key={premise.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              y: [0, -10, 0],
            }}
            transition={{ 
              delay: i * 0.3, 
              duration: 0.6,
              y: { repeat: Infinity, duration: 3 + i, ease: "easeInOut" }
            }}
            className="w-48 h-48 rounded-full bg-excellence-container flex items-center justify-center text-center p-6 shadow-xl border-4 border-white/50"
          >
            <div className="text-sm font-medium text-on-excellence-container">
              {premise.text}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-lg bg-surface-container-low p-8 rounded-[32px] border border-outline-variant shadow-lg z-10">
        <div className="text-label-medium text-primary mb-2 uppercase tracking-widest">The Prompt</div>
        <div className="text-title-large font-bold mb-8">
          {config.question}
        </div>

        <div className="text-body-medium text-on-surface-variant italic mb-6 p-4 bg-white/50 rounded-2xl border border-dashed border-outline-variant">
          Conclusion: "{config.conclusion.text}"
        </div>

        <div className="flex gap-4">
          <button 
            disabled={showFeedback}
            onClick={() => handleSelect(true)}
            className={`flex-1 h-16 rounded-2xl font-bold transition-all ${
              showFeedback && config.conclusion.isValid ? 'bg-success text-on-success' : 
              showFeedback && selectedAnswer === true && !config.conclusion.isValid ? 'bg-error text-on-error' :
              'btn-tonal'
            }`}
          >
            VALID
          </button>
          <button 
            disabled={showFeedback}
            onClick={() => handleSelect(false)}
            className={`flex-1 h-16 rounded-2xl font-bold transition-all ${
              showFeedback && !config.conclusion.isValid ? 'bg-success text-on-success' : 
              showFeedback && selectedAnswer === false && config.conclusion.isValid ? 'bg-error text-on-error' :
              'btn-tonal'
            }`}
          >
            INVALID
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-12 flex flex-col items-center gap-4"
          >
            <div className={`text-headline-medium font-bold ${isCorrect ? 'text-success' : 'text-error'}`}>
              {isCorrect ? 'Logical Mastermind!' : 'Logical Error'}
            </div>
            <div className="text-body-medium text-on-surface-variant">
              {isCorrect ? 'You correctly synthesized the disparate facts.' : 'Re-examine the premises and their logical connection.'}
            </div>
            <button className="btn-text mt-2" onClick={() => setShowFeedback(false)}>Continue</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
