/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useConceptStore } from './db/useConceptStore';
import { EliteHub }           from './screens/EliteHub';
import { GhanaPatha }         from './screens/GhanaPatha';
import { StressMode }         from './screens/StressMode';
import { DistractorTraining } from './screens/DistractorTraining';
import { ErrorDashboard }     from './screens/ErrorDashboard';
import { MockTest }           from './screens/MockTest';
import { PreExamProtocol }    from './screens/PreExamProtocol';
import { TopicsBank }         from './screens/TopicsBank';
import { Dashboard }          from './screens/Dashboard';
import { LiveSession }        from './screens/LiveSession';
import { ConceptEncoding }    from './screens/ConceptEncoding';
import { ChittaMap }          from './screens/ChittaMap';
import { MorningRecall }      from './screens/MorningRecall';
import { SessionComplete }    from './screens/SessionComplete';
import { CourseDashboard }   from './screens/CourseDashboard';
import { CourseLesson }      from './screens/CourseLesson';
import { DemoSession }       from './screens/DemoSession';
import { GamesScreen }       from './games/GamesScreen';
import { StatusBar }          from './components/StatusBar';
import { BottomNav }          from './components/BottomNav';
import { CONFIG, computeGlobalStats } from './lib/config';
import { buildSession as buildSessionCore } from './core/session-builder';
import { updateMetacogAccuracy } from './core/metacognition';
import { updateStabilityWithPredictionError } from './core/fsrs';
import type { Screen } from './types';
import { motion, AnimatePresence } from 'motion/react';

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [courseDay, setCourseDay] = useState(1);
  const { concepts, onUpdateConcept, dbReady } = useConceptStore(CONFIG.concepts);

  const liveGlobalStats = useMemo(() => computeGlobalStats(concepts), [concepts]);

  const handleSubjectClick = (subject: string) => {
    setSubjectFilter(subject);
    setQIndex(0);
    setScreen('session');
  };

  const handleNavToSession = () => {
    setSubjectFilter(null);
    setQIndex(0);
    setScreen('session');
  };

  const handleNavToDashboard = () => {
    setSubjectFilter(null);
    setQIndex(0);
    setScreen('dashboard');
  };

  const session = useMemo(() => {
    const pool = subjectFilter
      ? concepts.filter(c => c.subject === subjectFilter)
      : concepts;
    return buildSessionCore({ ...CONFIG, concepts: pool }, 20, new Date().getHours());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbReady, subjectFilter]);

  const totalAutomatic = concepts.filter(c => c.stage === 'Automatic' || c.stage === 'ExamReady').length;

  return (
    <div className="min-h-screen bg-[#F7F6F3] selection:bg-[#BFDBFE] selection:text-[#1D4ED8] overflow-x-hidden">
      <StatusBar />

      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {screen === 'dashboard'  && <Dashboard        setScreen={setScreen} session={session} onSubjectClick={handleSubjectClick} onStartSession={handleNavToSession} globalStats={liveGlobalStats} />}
          {screen === 'session'    && <LiveSession       setScreen={setScreen} session={session} qIndex={qIndex} setQIndex={setQIndex} onUpdateConcept={onUpdateConcept} />}
          {screen === 'encoding'   && <ConceptEncoding   setScreen={setScreen} session={session} onUpdateConcept={onUpdateConcept} qIndex={qIndex} />}
          {screen === 'map'        && <ChittaMap         setScreen={setScreen} globalStats={liveGlobalStats} />}
          {screen === 'recall'     && <MorningRecall     setScreen={setScreen} />}
          {screen === 'complete'   && <SessionComplete   setScreen={(s) => { if (s === 'dashboard') setSubjectFilter(null); setScreen(s); }} session={session} globalStats={liveGlobalStats} />}
          {screen === 'elite'      && <EliteHub          setScreen={setScreen} chittaScore={totalAutomatic} />}
          {screen === 'ghana'      && <GhanaPatha        setScreen={setScreen} concepts={concepts} onUpdateConcept={onUpdateConcept} />}
          {screen === 'stress'     && <StressMode        setScreen={setScreen} concepts={concepts} />}
          {screen === 'distractor' && <DistractorTraining setScreen={setScreen} concepts={concepts} />}
          {screen === 'errors'     && <ErrorDashboard    setScreen={setScreen} concepts={concepts} />}
          {screen === 'mock'       && <MockTest          setScreen={setScreen} concepts={concepts} />}
          {screen === 'preexam'    && <PreExamProtocol   setScreen={setScreen} />}
          {screen === 'topics'        && <TopicsBank        setScreen={setScreen} initialSearch={searchQuery} />}
          {screen === 'course'        && <CourseDashboard   setScreen={setScreen} setCourseDay={setCourseDay} />}
          {screen === 'course-lesson' && <CourseLesson      setScreen={setScreen} courseDay={courseDay} setCourseDay={setCourseDay} />}
          {screen === 'demo-session'  && <DemoSession       setScreen={setScreen} />}
          {screen === 'games'         && <GamesScreen        onBack={() => setScreen('dashboard')} />}
        </motion.div>
      </AnimatePresence>

      <BottomNav current={screen} setScreen={setScreen} />
    </div>
  );
}
