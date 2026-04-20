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
import { TopicsScreen }       from './screens/TopicsScreen';
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
import { LoadingProvider, useLoading } from './lib/LoadingContext';
import { LoadingIndicator } from './components/LoadingIndicator';
import { LinearProgressTop } from './components/ProgressBar';
import { CONFIG, computeGlobalStats } from './lib/config';
import { buildSession as buildSessionCore } from './core/session-builder';
import { updateMetacogAccuracy } from './core/metacognition';
import { updateStabilityWithPredictionError } from './core/fsrs';
import type { Screen } from './types';
import { motion, AnimatePresence } from 'motion/react';

// --- Capacitor Plugins ---
import { StatusBar as CapStatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Keyboard } from '@capacitor/keyboard';
import { Network } from '@capacitor/network';
import { App as CapApp } from '@capacitor/app';

// ─── Main App ─────────────────────────────────────────────────────────────────

function AppContent() {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [courseDay, setCourseDay] = useState(1);
  const { concepts, onUpdateConcept, dbReady } = useConceptStore(CONFIG.concepts);

  // Initialize Capacitor Plugins
  React.useEffect(() => {
    const initNativeFeatures = async () => {
      try {
        // Native Status Bar to match app theme
        await CapStatusBar.setStyle({ style: Style.Light });
        await CapStatusBar.setBackgroundColor({ color: getComputedStyle(document.documentElement).getPropertyValue('--color-background').trim() });

        // Lock App to Portrait to prevent exam/game layouts from breaking
        await ScreenOrientation.lock({ orientation: 'portrait-primary' as any }).catch(() => {});

        // Hide Splash Screen once React is ready
        await SplashScreen.hide();

        // Keyboard tuning (prevent input overlaps)
        await Keyboard.setScroll({ isDisabled: false });
        
        // Listeners for App lifecycles
        await CapApp.addListener('appStateChange', ({ isActive }) => {
           console.log('App is active: ', isActive);
        });

        await Network.addListener('networkStatusChange', status => {
           console.log('Network connected: ', status.connected);
        });
      } catch (err) {
        console.warn("Capacitor plugins not available (likely running in web).", err);
      }
    };

    initNativeFeatures();

    return () => {
      CapApp.removeAllListeners().catch(() => {});
      Network.removeAllListeners().catch(() => {});
    };
  }, []);

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
  const { loading } = useLoading();

  return (
    <>
      <LinearProgressTop value={loading.progress || 0} show={loading.isLoading && !loading.fullscreen} />
      {loading.isLoading && loading.fullscreen && (
        <LoadingIndicator
          size="md"
          fullscreen
          message={loading.message}
        />
      )}
      <div className="min-h-screen selection:bg-[color:var(--color-primary-container)] selection:text-[color:var(--color-primary)] overflow-x-hidden" style={{ background: 'var(--color-background)' }}>

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
          {screen === 'topics'        && <TopicsScreen       setScreen={setScreen} />}
          {screen === 'course'        && <CourseDashboard   setScreen={setScreen} setCourseDay={setCourseDay} />}
          {screen === 'course-lesson' && <CourseLesson      setScreen={setScreen} courseDay={courseDay} setCourseDay={setCourseDay} />}
          {screen === 'demo-session'  && <DemoSession       setScreen={setScreen} />}
          {screen === 'games'         && <GamesScreen        onBack={() => setScreen('dashboard')} />}
        </motion.div>
      </AnimatePresence>

      <BottomNav current={screen} setScreen={setScreen} />
      </div>
    </>
  );
}

export default function App() {
  return (
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  );
}
