/**
 * React hook — loads concept FSRS states from local DB on mount,
 * merges with the static DSA_CONCEPTS list, and exposes a persist function.
 */

import { useState, useEffect, useCallback, type Dispatch, type SetStateAction } from 'react';
import type { Concept } from '../core/types';
import { loadConceptStates, saveConceptState, initDB } from './store';

interface UseConceptStoreResult {
  concepts:          Concept[];
  setConcepts:       Dispatch<SetStateAction<Concept[]>>;
  onUpdateConcept:   (id: string, updates: Partial<Concept>) => void;
  dbReady:           boolean;
}

export function useConceptStore(initial: Concept[]): UseConceptStoreResult {
  const [concepts, setConcepts] = useState<Concept[]>(initial);
  const [dbReady, setDbReady]   = useState(false);

  // On mount: init DB then merge saved states into the static concept list
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await initDB();
      const stateMap = await loadConceptStates();
      if (cancelled) return;

      if (stateMap.size > 0) {
        setConcepts(prev =>
          prev.map(c => {
            const saved = stateMap.get(c.id);
            if (!saved) return c;
            return {
              ...c,
              stage:      saved.stage      as Concept['stage'],
              stability:  saved.stability,
              difficulty: saved.difficulty,
              lastTested: saved.lastTested,
              // queue is a runtime field not in Concept type — spread as any
              ...(saved.queue !== undefined && { queue: saved.queue }),
              // Neuroscience fields
              ...(saved.encodingDepth          !== undefined && { encodingDepth:          saved.encodingDepth as Concept['encodingDepth'] }),
              ...(saved.metacogAccuracy        !== undefined && { metacogAccuracy:        saved.metacogAccuracy }),
              ...(saved.overconfidenceFlag     !== undefined && { overconfidenceFlag:     saved.overconfidenceFlag }),
              ...(saved.predictionErrorHistory !== undefined && { predictionErrorHistory: saved.predictionErrorHistory }),
              ...(saved.lastStudiedAt          !== undefined && { lastStudiedAt:          saved.lastStudiedAt }),
            };
          })
        );
      }
      setDbReady(true);
    })();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update one concept in state AND persist to DB immediately
  const onUpdateConcept = useCallback((id: string, updates: Partial<Concept>) => {
    setConcepts(prev => {
      const next = prev.map(c => c.id === id ? { ...c, ...updates } : c);
      // Persist asynchronously — fire and forget
      const updated = next.find(c => c.id === id);
      if (updated) {
        saveConceptState(id, {
          stage:      updated.stage,
          stability:  updated.stability,
          difficulty: updated.difficulty,
          lastTested: updated.lastTested,
          queue:      (updated as Concept & { queue?: string }).queue ?? 'new',
          // Neuroscience fields
          encodingDepth:          updated.encodingDepth,
          metacogAccuracy:        updated.metacogAccuracy,
          overconfidenceFlag:     updated.overconfidenceFlag,
          predictionErrorHistory: updated.predictionErrorHistory,
          lastStudiedAt:          updated.lastStudiedAt,
        }).catch(console.error);
      }
      return next;
    });
  }, []);

  return { concepts, setConcepts, onUpdateConcept, dbReady };
}
