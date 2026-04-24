// src/games/components/memory/SequencingGame.tsx
import React, { useState, useEffect } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { MemorySequencingConfig } from '../../types';
import { m3SpatialDefault } from '../../../lib/m3-motion';

export function SequencingGame({ config }: { config: MemorySequencingConfig }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasFinishedAudio, setHasFinishedAudio] = useState(false);
  const [items, setItems] = useState<typeof config.events>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Randomize initial order for testing phase
    setItems([...config.events].sort(() => Math.random() - 0.5));
  }, [config.events]);

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setHasFinishedAudio(true);
  };

  const validateSequence = () => {
    const isCorrect = items.every((item, index) => item.order === index + 1);
    setShowResults(true);
  };

  const isCorrect = items.every((item, index) => item.order === index + 1);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-surface overflow-y-auto">
      <AnimatePresence mode="wait">
        {!hasFinishedAudio ? (
          <motion.div
            key="listening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-12"
          >
            <div className="text-headline-small">Listen to the Sequence</div>
            <div className="relative w-48 h-48 bg-primary-container rounded-full flex items-center justify-center shadow-xl">
               <span className="material-symbols-rounded text-6xl text-primary animate-pulse">
                 graphic_eq
               </span>
               <audio 
                 autoPlay 
                 src={config.audioUrl} 
                 onEnded={handleAudioEnd}
                 onPlay={() => setIsPlaying(true)}
                 className="hidden"
               />
            </div>
            <div className="text-body-large text-on-surface-variant text-center max-w-sm">
              Remember the order of events or directions mentioned in the audio.
            </div>
          </motion.div>
        ) : !showResults ? (
          <motion.div
            key="ordering"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl flex flex-col gap-8"
          >
            <div className="text-headline-small text-center">Place in Correct Order</div>
            
            <Reorder.Group axis="y" values={items} onReorder={setItems} className="flex flex-col gap-3">
              {items.map((item) => (
                <Reorder.Item 
                  key={item.id} 
                  value={item}
                  className="card-elevated p-5 flex items-center gap-4 cursor-grab active:cursor-grabbing rounded-2xl border border-outline-variant bg-surface-container-low"
                  style={{ boxShadow: 'var(--shadow-elevation-1)' }}
                  whileDrag={{ scale: 1.05, boxShadow: 'var(--shadow-elevation-3)' }}
                >
                  <span className="material-symbols-rounded text-outline">drag_indicator</span>
                  <div className="flex-grow text-body-large font-medium">{item.label}</div>
                  <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container text-xs font-bold">
                    {items.indexOf(item) + 1}
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>

            <button className="btn-primary-full mt-4" onClick={validateSequence}>
              Validate Sequence
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-8 text-center"
          >
            <div className={`text-display-small font-bold ${isCorrect ? 'text-success' : 'text-error'}`}>
               {isCorrect ? 'Perfect Sequence!' : 'Sequence Incorrect'}
            </div>
            
            <div className="flex flex-col gap-2 w-full max-w-md">
               {items.map((item, index) => {
                 const itemIsCorrect = item.order === index + 1;
                 return (
                   <div key={item.id} className={`flex items-center gap-4 p-4 rounded-xl border ${itemIsCorrect ? 'border-success-container bg-success-container/30' : 'border-error-container bg-error-container/30'}`}>
                      <span className={`material-symbols-rounded ${itemIsCorrect ? 'text-success' : 'text-error'}`}>
                        {itemIsCorrect ? 'check_circle' : 'cancel'}
                      </span>
                      <div className="flex-grow text-left text-sm font-medium">{item.label}</div>
                      <div className="text-xs opacity-60">Should be #{item.order}</div>
                   </div>
                 );
               })}
            </div>

            <button className="btn-tonal mt-4" onClick={() => { setHasFinishedAudio(false); setShowResults(false); }}>
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
