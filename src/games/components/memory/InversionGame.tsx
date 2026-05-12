import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MemoryInversionConfig } from '../../types';

export function InversionGame({ config }: { config: MemoryInversionConfig }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean, explanation: string } | null>(null);
  const [showResults, setShowResults] = useState(false);

  const currentStatement = config.statements[currentIndex];

  const handleChoice = (choseTrap: boolean) => {
    const isCorrect = choseTrap === currentStatement.isTrap;
    if (isCorrect) setScore(prev => prev + 1);
    
    setFeedback({
      isCorrect,
      explanation: currentStatement.explanation
    });
  };

  const handleNext = () => {
    setFeedback(null);
    if (currentIndex < config.statements.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-surface p-6">
      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div 
            key="gameplay"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col max-w-2xl mx-auto w-full items-center justify-center gap-8"
          >
            <div className="text-center space-y-2">
               <span className="material-symbols-rounded text-primary text-5xl">warning</span>
               <h2 className="text-headline-small text-on-surface">Trap Finder</h2>
               <p className="text-body-medium text-on-surface-variant text-center max-w-md">
                 Spot the absolute wording traps and conceptual inversions. 
                 Decide if the statement is fully True, or a Trap.
               </p>
               <div className="text-label-large font-medium mt-4">
                 {currentIndex + 1} / {config.statements.length}
               </div>
            </div>

            <div className="w-full relative min-h-[300px] flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                 {!feedback ? (
                    <motion.div 
                      key="card"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.1, opacity: 0 }}
                      className="absolute inset-0 w-full"
                    >
                      <div className="card-elevated p-8 rounded-3xl h-full flex flex-col justify-center items-center text-center shadow-lg border border-surface-container-highest">
                        <div className="text-headline-small text-on-surface leading-tight">
                           "{currentStatement.text}"
                        </div>
                      </div>
                      
                      <div className="flex w-full justify-between gap-6 px-4 absolute -bottom-16">
                         <button 
                           className="flex-1 btn-tonal py-4 flex flex-col items-center justify-center rounded-2xl bg-surface-container hover:bg-error-container hover:text-on-error-container group transition-colors"
                           onClick={() => handleChoice(true)}
                         >
                            <span className="material-symbols-rounded text-3xl mb-1 text-error group-hover:text-on-error-container">report</span>
                            <span className="font-bold">It's a Trap</span>
                         </button>
                         <button 
                           className="flex-1 btn-tonal py-4 flex flex-col items-center justify-center rounded-2xl bg-surface-container hover:bg-success-container hover:text-on-success-container group transition-colors"
                           onClick={() => handleChoice(false)}
                         >
                            <span className="material-symbols-rounded text-3xl mb-1 text-success group-hover:text-on-success-container">check_circle</span>
                            <span className="font-bold">Valid & True</span>
                         </button>
                      </div>
                    </motion.div>
                 ) : (
                    <motion.div 
                      key="feedback"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className={`absolute inset-0 w-full card-elevated p-8 rounded-3xl h-full flex flex-col justify-between shadow-lg border ${feedback.isCorrect ? 'bg-success-container/20 border-success' : 'bg-error-container/20 border-error'}`}
                    >
                      <div className="text-center">
                         <span className={`material-symbols-rounded text-6xl mb-4 ${feedback.isCorrect ? 'text-success' : 'text-error'}`}>
                            {feedback.isCorrect ? 'check_circle' : 'cancel'}
                         </span>
                         <div className="text-title-large mb-4">
                            {feedback.isCorrect ? 'Correct!' : 'Gotcha!'}
                         </div>
                         <div className="text-body-large text-on-surface">
                            {feedback.explanation}
                         </div>
                      </div>
                      <button className="btn-primary mt-6 w-full" onClick={handleNext}>
                         Continue
                      </button>
                    </motion.div>
                 )}
              </AnimatePresence>
            </div>
            {/* spacer to prevent layout overlap */}
            <div className="h-24" /> 
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-6 text-center max-w-md mx-auto w-full"
          >
            <div className="text-display-small font-bold text-primary">Trap Detection Score</div>
            
            <div className="text-headline-large mb-2">{score} / {config.statements.length}</div>
            
            <div className="text-body-large text-on-surface-variant max-w-md">
              {score === config.statements.length ? "Incredible. You saw right through their wording." : score > config.statements.length / 2 ? "Good job. But keep practicing to spot every subtle trap." : "The examiners got you this time! Review the traps and try again."}
            </div>

            <button className="btn-tonal w-full py-3 mt-4" onClick={() => { setCurrentIndex(0); setScore(0); setFeedback(null); setShowResults(false); }}>
              Retry Session
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
