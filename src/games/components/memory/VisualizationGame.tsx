import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MemoryVisualizationConfig } from '../../types';

export function VisualizationGame({ config }: { config: MemoryVisualizationConfig }) {
  const [phase, setPhase] = useState<'encoding' | 'test'>('encoding');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const currentEncodingItem = config.items[currentIndex];

  const handleNextEncoding = () => {
    if (currentIndex < config.items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setPhase('test');
    }
  };

  const handleSelectDescription = (itemId: string) => {
    if (selectedItem === itemId) {
      setSelectedItem(null);
    } else {
      setSelectedItem(itemId);
    }
  };

  const handleSelectLabel = (label: string) => {
    if (!selectedItem) return;
    
    setMatches(prev => ({
      ...prev,
      [selectedItem]: label
    }));
    setSelectedItem(null);

    // Check if all matched
    if (Object.keys(matches).length + 1 === config.items.length) {
      setTimeout(() => setShowResults(true), 500);
    }
  };

  const [shuffledItems] = useState(() => {
     return [...config.items].sort(() => Math.random() - 0.5);
  });
  
  const [shuffledLabels] = useState(() => {
     return [...config.items].map(i => i.label).sort(() => Math.random() - 0.5);
  });

  const correctCount = config.items.filter(item => matches[item.id] === item.label).length;

  return (
    <div className="w-full h-full flex flex-col bg-surface p-6">
      <AnimatePresence mode="wait">
        {phase === 'encoding' ? (
          <motion.div 
            key="encoding"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center gap-12"
          >
            <div className="text-center space-y-4">
               <span className="material-symbols-rounded text-primary text-6xl">visibility</span>
               <h2 className="text-headline-medium text-on-surface">Mentally Visualize</h2>
               <p className="text-body-large text-on-surface-variant max-w-md">
                 Do not rush. Take 2 seconds to construct a colorful, weird, and vivid mental image of the following.
               </p>
            </div>

            <div className="card-elevated p-8 rounded-3xl w-full max-w-lg flex flex-col items-center text-center gap-6" style={{ boxShadow: 'var(--shadow-elevation-2)' }}>
              <div className="text-title-large text-primary">{currentEncodingItem.label}</div>
              <div className="text-headline-small text-on-surface">{currentEncodingItem.description}</div>
              {currentEncodingItem.imageUrl && (
                 <img src={currentEncodingItem.imageUrl} alt={currentEncodingItem.label} className="w-48 h-48 object-cover rounded-xl mt-4" />
              )}
            </div>

            <button className="btn-primary py-4 px-12 text-title-medium rounded-full" onClick={handleNextEncoding}>
               I have a strong picture
            </button>
            
            <div className="text-label-large text-on-surface-variant">
               {currentIndex + 1} of {config.items.length}
            </div>
          </motion.div>
        ) : !showResults ? (
          <motion.div 
            key="testing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col max-w-4xl mx-auto w-full gap-8 mt-12"
          >
             <div className="text-center">
                <h2 className="text-headline-small">Recall & Match</h2>
                <p className="text-body-medium text-on-surface-variant">Select a description, then tap its correct label based on your mental images.</p>
             </div>

             <div className="flex gap-8 flex-1">
                <div className="flex-1 flex flex-col gap-4">
                  <h3 className="text-title-medium text-primary">Descriptions</h3>
                  {shuffledItems.map(item => {
                    const isMatched = !!matches[item.id];
                    const isSelected = selectedItem === item.id;
                    const baseClass = "text-left p-4 rounded-2xl border transition-all";
                    const addedClass = isMatched 
                        ? 'opacity-30 border-transparent bg-surface-container' 
                        : isSelected 
                            ? 'border-primary bg-primary-container/20 ring-2 ring-primary' 
                            : 'border-outline-variant bg-surface-container-low hover:bg-surface-container-highest';
                    return (
                      <button 
                        key={item.id}
                        disabled={isMatched}
                        onClick={() => handleSelectDescription(item.id)}
                        className={`${baseClass} ${addedClass}`}
                      >
                         {item.description}
                      </button>
                    )
                  })}
                </div>

                <div className="flex-1 flex flex-col gap-4">
                  <h3 className="text-title-medium text-primary">Labels</h3>
                  {shuffledLabels.map(label => {
                    const isMatched = Object.values(matches).includes(label);
                    const baseClass = "p-4 rounded-2xl border transition-all text-center font-medium";
                    const addedClass = isMatched 
                        ? 'opacity-30 border-transparent bg-surface-container' 
                        : !selectedItem 
                            ? 'border-outline-variant opacity-50 cursor-not-allowed bg-surface-container-low' 
                            : 'border-primary bg-primary-container text-on-primary-container hover:brightness-110 shadow-sm cursor-pointer';
                    return (
                      <button 
                        key={label}
                        disabled={isMatched || !selectedItem}
                        onClick={() => handleSelectLabel(label)}
                        className={`${baseClass} ${addedClass}`}
                      >
                         {label}
                      </button>
                    )
                  })}
                </div>
             </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-8 text-center"
          >
            <div className="text-display-small font-bold text-primary">Visualization Score</div>
            <div className="text-headline-large">{correctCount} / {config.items.length}</div>
            <div className="text-body-large text-on-surface-variant max-w-md">
              {correctCount === config.items.length 
                  ? "Perfect! Your visual encoding was flawless." 
                  : "Keep practicing. Strong mental imagery takes time to develop."}
            </div>
            <button className="btn-primary-full mt-4" onClick={() => { setPhase('encoding'); setCurrentIndex(0); setMatches({}); setShowResults(false); }}>
              Retry Session
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
