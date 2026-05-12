// src/games/components/memory/NameRecallGame.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MemoryNameRecallConfig } from '../../types';
import { m3SpatialDefault, m3EffectsEase } from '../../../lib/m3-motion';

type SessionMode = 'learning' | 'recall' | 'results';

export function NameRecallGame({ config }: { config: MemoryNameRecallConfig }) {
  const [mode, setMode] = useState<SessionMode>('learning');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [assignments, setAssignments] = useState<Record<string, string>>({}); // faceId -> name
  const [feedback, setFeedback] = useState<Record<string, 'correct' | 'wrong' | null>>({});

  const handleNextCard = () => {
    if (currentIndex < config.people.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setMode('recall');
    }
  };

  const handleDropName = (personId: string, name: string) => {
    setAssignments(prev => ({ ...prev, [personId]: name }));
  };

  const handleSubmit = () => {
    const newFeedback: Record<string, 'correct' | 'wrong'> = {};
    config.people.forEach(person => {
      newFeedback[person.id] = assignments[person.id] === person.name ? 'correct' : 'wrong';
    });
    setFeedback(newFeedback);
    setMode('results');
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-surface overflow-y-auto">
      {/* Game Content */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
        {mode === 'learning' && (
          <motion.div
            key="learning"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center gap-8 w-full max-w-md"
          >
            <div className="text-headline-small text-center">Learning Phase</div>
            <div className="card-elevated w-full p-8 flex flex-col items-center gap-6 rounded-3xl" style={{ background: 'var(--color-surface-container-low)' }}>
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-container">
                <img src={config.people[currentIndex].faceUrl} alt="Face" className="w-full h-full object-cover" />
              </div>
              <div className="text-center">
                <div className="text-title-large font-bold mb-2">{config.people[currentIndex].name}</div>
                <div className="text-body-large text-on-surface-variant italic">
                  "{config.people[currentIndex].detail}"
                </div>
              </div>
              {config.mnemonicPairs.find(p => p.name === config.people[currentIndex].name) && (
                 <div className="text-label-medium bg-excellence-container text-on-excellence-container px-4 py-2 rounded-full">
                    Mnemonic: {config.mnemonicPairs.find(p => p.name === config.people[currentIndex].name)?.mnemonic}
                 </div>
              )}
            </div>
            <button className="btn-primary-full w-full" onClick={handleNextCard}>
              {currentIndex < config.people.length - 1 ? 'Next Person' : 'Start Recall'}
            </button>
            <div className="text-label-small">{currentIndex + 1} / {config.people.length}</div>
          </motion.div>
        )}

        {mode === 'recall' && (
          <motion.div
            key="recall"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-8 w-full max-w-4xl"
          >
            <div className="text-headline-small">Who is who?</div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
              {config.people.map(person => (
                <div
                  key={person.id}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const name = e.dataTransfer.getData('name');
                    handleDropName(person.id, name);
                  }}
                  className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-lowest"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden">
                    <img src={person.faceUrl} alt="Face" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-h-[40px] w-full flex items-center justify-center bg-primary-container rounded-lg text-sm font-medium p-2 text-center">
                    {assignments[person.id] || "Drag Name Here"}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-3 p-6 bg-surface-container-high rounded-3xl w-full">
              {config.people.filter(p => !Object.values(assignments).includes(p.name)).map(person => (
                <div
                  key={person.name}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('name', person.name)}
                  className="px-6 py-3 bg-primary text-on-primary rounded-full cursor-grab active:cursor-grabbing font-medium shadow-md"
                >
                  {person.name}
                </div>
              ))}
              {config.people.filter(p => !Object.values(assignments).includes(p.name)).length === 0 && (
                <button className="btn-primary" onClick={handleSubmit}>Submit Recall</button>
              )}
            </div>
            <button className="btn-text" onClick={() => setAssignments({})}>Reset Names</button>
          </motion.div>
        )}

        {mode === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-8 w-full max-w-2xl"
          >
            <div className="text-headline-small">Recall Summary</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
              {config.people.map(person => {
                const isCorrect = feedback[person.id] === 'correct';
                return (
                  <div key={person.id} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 ${isCorrect ? 'border-success bg-success-container' : 'border-error bg-error-container'}`}>
                    <div className="w-20 h-20 rounded-full overflow-hidden">
                      <img src={person.faceUrl} alt="Face" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-xs font-bold">{person.name}</div>
                    <div className={`text-[10px] ${isCorrect ? 'text-on-success-container' : 'text-on-error-container'}`}>
                      {isCorrect ? 'Correct!' : `You: ${assignments[person.id] || 'None'}`}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-title-large font-bold">
              Final Score: {Object.values(feedback).filter(f => f === 'correct').length} / {config.people.length}
            </div>
            <button className="btn-tonal" onClick={() => { setMode('learning'); setCurrentIndex(0); setAssignments({}); }}>Try Again</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}
