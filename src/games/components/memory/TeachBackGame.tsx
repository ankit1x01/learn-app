import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MemoryTeachBackConfig } from '../../types';

export function TeachBackGame({ config }: { config: MemoryTeachBackConfig }) {
  const [text, setText] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const wordList = text.toLowerCase().match(/\b(\w+)\b/g) || [];
  
  const matchedKeywords = config.requiredKeywords.filter(kw => 
    wordList.includes(kw.toLowerCase()) || text.toLowerCase().includes(kw.toLowerCase())
  );
  
  const score = Math.round((matchedKeywords.length / config.requiredKeywords.length) * 100);

  return (
    <div className="w-full h-full flex flex-col bg-surface p-6">
      <AnimatePresence mode="wait">
        {!hasSubmitted ? (
          <motion.div 
            key="teaching"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col max-w-3xl mx-auto w-full gap-8 mt-4"
          >
            <div className="flex flex-col items-center text-center gap-4">
               <span className="material-symbols-rounded text-primary text-6xl">school</span>
               <h2 className="text-headline-medium text-on-surface">Teach-Back</h2>
               <div className="bg-primary-container text-on-primary-container py-2 px-6 rounded-full text-title-medium">
                 Persona: {config.persona}
               </div>
            </div>

            <div className="card-elevated p-8 rounded-3xl" style={{ boxShadow: 'var(--shadow-elevation-2)' }}>
              <div className="text-title-large text-primary mb-2">Concept: {config.concept}</div>
              <div className="text-body-large text-on-surface mb-6">{config.prompt}</div>
              
              <textarea 
                className="w-full h-48 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none text-body-large"
                placeholder="Start explaining like you're talking to them..."
                value={text}
                onChange={e => setText(e.target.value)}
              />
              
              <div className="flex justify-between items-center mt-4">
                 <div className="text-label-large text-on-surface-variant">
                    {wordList.length} words
                 </div>
                 <button 
                   className="btn-primary px-8" 
                   disabled={wordList.length < 10}
                   onClick={() => setHasSubmitted(true)}
                 >
                   Submit Explanation
                 </button>
              </div>
            </div>
            
            <div className="text-center text-body-medium text-on-surface-variant">
               Tip: Keep your sentences short and avoid complex jargon unless you explain it!
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-8 text-center max-w-2xl mx-auto w-full"
          >
            <div className="text-display-small font-bold text-primary">Feedback</div>
            
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-surface-container-highest" />
                <circle 
                  cx="96" cy="96" r="88" 
                  stroke="currentColor" 
                  strokeWidth="12" 
                  fill="transparent" 
                  strokeDasharray="552" 
                  strokeDashoffset={552 - (552 * score) / 100} 
                  className="text-primary transition-all duration-1000 ease-out" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-display-medium font-bold text-on-surface">{score}%</span>
              </div>
            </div>

            <div className="w-full card-outlined p-6 rounded-3xl text-left border-outline-variant">
               <h3 className="text-title-medium mb-4">Required Concepts Covered:</h3>
               <div className="flex flex-wrap gap-3">
                 {config.requiredKeywords.map(kw => {
                   const found = matchedKeywords.includes(kw);
                   return (
                     <div key={kw} className={`px-4 py-2 rounded-full text-label-large flex items-center gap-2 ${found ? 'bg-success-container text-on-success-container' : 'bg-error-container text-on-error-container'}`}>
                       <span className="material-symbols-rounded text-[18px]">
                         {found ? 'check' : 'close'}
                       </span>
                       {kw}
                     </div>
                   )
                 })}
               </div>
            </div>

            <div className="text-body-large text-on-surface-variant max-w-md mt-2">
              {score >= 80 ? "Excellent breakdown! You captured the essence clearly." : "You missed a few core ideas. Try teaching it again with those in mind!"}
            </div>

            <button className="btn-tonal mt-4" onClick={() => { setHasSubmitted(false); setText(''); }}>
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
