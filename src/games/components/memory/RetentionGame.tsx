// src/games/components/memory/RetentionGame.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MemoryRetentionConfig } from '../../types';
import { m3SpatialDefault, m3EffectsEase } from '../../../lib/m3-motion';

export function RetentionGame({ config }: { config: MemoryRetentionConfig }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasFinishedAudio, setHasFinishedAudio] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setHasFinishedAudio(true);
  };

  const handleAnswer = (questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
    if (currentQuestionIndex < config.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const score = config.questions.reduce((acc, q) => acc + (answers[q.id] === q.answer ? 1 : 0), 0);

  return (
    <div className="w-full h-full flex flex-col bg-surface">
      <audio
        ref={audioRef}
        src={config.audioUrl}
        onEnded={handleAudioEnd}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Game Content */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {!hasFinishedAudio ? (
            <motion.div
              key="listening"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center gap-12"
            >
            <div className="text-headline-small text-on-surface text-center">Listen Carefully</div>
            
            {/* Pulsing Waveform Placeholder */}
            <div className="relative flex items-center justify-center w-64 h-64">
               {[...Array(5)].map((_, i) => (
                 <motion.div
                   key={i}
                   className="absolute rounded-full border-2 border-primary"
                   initial={{ width: 100, height: 100, opacity: 0.5 }}
                   animate={isPlaying ? {
                     width: [100, 250],
                     height: [100, 250],
                     opacity: [0.5, 0],
                   } : {}}
                   transition={{
                     duration: 2,
                     repeat: Infinity,
                     delay: i * 0.4,
                     ease: "easeOut"
                   }}
                 />
               ))}
               <div className="z-10 bg-primary-container p-8 rounded-full shadow-lg">
                 <span className="material-symbols-rounded text-6xl text-primary">
                    {isPlaying ? 'pause' : 'play_arrow'}
                 </span>
                 <button 
                   className="absolute inset-0 opacity-0 cursor-pointer" 
                   onClick={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()}
                 />
               </div>
            </div>

            <div className="text-body-large text-on-surface-variant max-w-sm text-center">
              Pay attention to details, numbers, and colors mentioned in the passage.
            </div>
          </motion.div>
        ) : !showResults ? (
          <motion.div
            key="questions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl flex flex-col gap-8"
          >
            <div className="flex justify-between items-center px-2">
               <div className="text-title-medium">Question {currentQuestionIndex + 1} of {config.questions.length}</div>
               <div className={`px-3 py-1 rounded-full text-xs font-bold ${config.questions[currentQuestionIndex].difficulty === 'high' ? 'bg-error-container text-on-error-container' : 'bg-success-container text-on-success-container'}`}>
                 {config.questions[currentQuestionIndex].difficulty.toUpperCase()} DIFFICULTY
               </div>
            </div>

            <div className="card-outlined p-8 rounded-3xl" style={{ borderColor: 'var(--color-outline-variant)' }}>
              <div className="text-body-large font-medium mb-8">
                {config.questions[currentQuestionIndex].prompt}
              </div>
              <div className="grid grid-cols-1 gap-4">
                {config.questions[currentQuestionIndex].options.map(option => (
                  <button
                    key={option}
                    className="btn-tonal text-left h-auto py-4 px-6 rounded-2xl justify-start font-normal text-body-medium hover:bg-primary-container/50 transition-colors"
                    onClick={() => handleAnswer(config.questions[currentQuestionIndex].id, option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
               <motion.div 
                 className="h-full bg-primary"
                 initial={{ width: 0 }}
                 animate={{ width: `${((currentQuestionIndex) / config.questions.length) * 100}%` }}
               />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-8 text-center"
          >
            <div className="text-display-small font-bold text-primary">Retention Score</div>
            <div className="text-headline-large">{score} / {config.questions.length}</div>
            <div className="text-body-large text-on-surface-variant max-w-md">
              {score === config.questions.length ? "Perfect! Your attention to detail is remarkable." : 
               score > config.questions.length / 2 ? "Good job. Try to focus more on quantitative details next time." : 
               "Keep practicing. Retaining secondary details is a key memory skill."}
            </div>
            <button className="btn-primary-full mt-4" onClick={() => { setHasFinishedAudio(false); setShowResults(false); setCurrentQuestionIndex(0); setAnswers({}); }}>
              Retry Session
            </button>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}
