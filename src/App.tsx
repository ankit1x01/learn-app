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
import { PreSleepReview }    from './screens/PreSleepReview';
import { CourseDashboard }   from './screens/CourseDashboard';
import { CourseLesson }      from './screens/CourseLesson';
import { DemoSession }       from './screens/DemoSession';
import { PromptPlayground }  from './screens/PromptPlayground';
import { TimelineDemo }      from './screens/TimelineDemo';
import AIEngineeringCourse    from './screens/AIEngineeringCourse';
import LocalAIChat            from './screens/LocalAIChat';
import { GamesScreen }       from './games/GamesScreen';
import { ShapeSlicerGame }   from './games/ShapeSlicerGame';
import { PhysicsPlayground } from './games/playground/PhysicsPlayground';
import { PhysicsArcade } from './games/playground/PhysicsArcade';
import { MathArcade } from './games/math/MathArcade';
import { ChemistryArcade } from './games/chemistry/ChemistryArcade';
import { StatusBar }          from './components/StatusBar';
import { BottomNav }          from './components/BottomNav';
import { LoadingProvider, useLoading } from './lib/LoadingContext';
import { LoadingIndicator } from './components/LoadingIndicator';
import { LinearProgressTop } from './components/ProgressBar';
import { CONFIG, computeGlobalStats } from './lib/config';
import { buildSession as buildSessionCore } from './core/session-builder';
import { updateMetacogAccuracy } from './core/metacognition';
import { updateStabilityWithPredictionError } from './core/fsrs';
import { generateGamesForSession, gameToSessionItem, mixGamesIntoSession } from './lib/game-session-bridge';
import { getAllQuizzesAsSessionItems, mixQuizzesIntoSession } from './lib/quiz-session-bridge';
import { gameContentStore } from './lib/game-content-store';
import { bundledGameContent } from './data/bundled-game-content';
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
        // Initialize game content store with bundled content
        await gameContentStore.init(bundledGameContent);

        // Native Status Bar to match app theme
        await CapStatusBar.setStyle({ style: Style.Light });
        await CapStatusBar.setBackgroundColor({ color: getComputedStyle(document.documentElement).getPropertyValue('--color-background').trim() });

        // Lock App to Portrait to prevent exam/game layouts from breaking
        await ScreenOrientation.lock({ orientation: 'portrait-primary' as any }).catch(() => {});

        // Hide Splash Screen once React is ready
        await SplashScreen.hide();

        // Keyboard tuning (prevent input overlaps)
        await Keyboard.setScroll({ isDisabled: false });

        // Global Android back button handler
        await CapApp.addListener('backButton', () => {
          // Navigate back based on current screen
          if (screen === 'session' || screen === 'encoding' || screen === 'map' || screen === 'recall' || screen === 'presleep' || screen === 'complete' || screen === 'course-lesson' || screen === 'ai-engineering' || screen === 'games' || screen === 'timeline-demo') {
            setScreen('dashboard');
          } else if (screen !== 'dashboard') {
            setScreen('dashboard');
          }
        });

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

    // Build base session with concepts (70%)
    const baseSession = buildSessionCore({ ...CONFIG, concepts: pool }, 20, new Date().getHours());

    // Generate and mix games into session (5% of session length)
    const gameCount = Math.max(1, Math.floor(baseSession.length * 0.05));
    const games = generateGamesForSession(pool, gameCount);
    const gameItems = games.map(gameToSessionItem);

    // Mix games into session alongside concepts
    const withGames = mixGamesIntoSession(baseSession, gameItems, 0.05);

    // Mix in quizzes (10% of session length)
    const quizItems = getAllQuizzesAsSessionItems();
    return mixQuizzesIntoSession(withGames as any, quizItems, 0.10);
  }, [dbReady, subjectFilter, concepts]);

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
          {screen === 'dashboard'  && <Dashboard        setScreen={setScreen} session={session as any} onSubjectClick={handleSubjectClick} onStartSession={handleNavToSession} globalStats={liveGlobalStats} />}
          {screen === 'session'    && <LiveSession       setScreen={setScreen} session={session} qIndex={qIndex} setQIndex={setQIndex} onUpdateConcept={onUpdateConcept} subjectFilter={subjectFilter} />}
          {screen === 'encoding'   && <ConceptEncoding   setScreen={setScreen} session={session as any} onUpdateConcept={onUpdateConcept} qIndex={qIndex} />}
          {screen === 'map'        && <ChittaMap         setScreen={setScreen} globalStats={liveGlobalStats} concepts={concepts} />}
          {screen === 'recall'     && <MorningRecall     setScreen={setScreen} concepts={concepts} />}
          {screen === 'presleep'   && <PreSleepReview    setScreen={setScreen} concepts={concepts} onUpdateConcept={onUpdateConcept} />}
          {screen === 'complete'   && <SessionComplete   setScreen={(s) => { if (s === 'dashboard') setSubjectFilter(null); setScreen(s); }} session={session as any} globalStats={liveGlobalStats} concepts={concepts} />}
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
          {screen === 'prompt-playground' && <PromptPlayground setScreen={setScreen} />}
          {screen === 'timeline-demo' && <TimelineDemo onBack={() => setScreen('dashboard')} />}
          {screen === 'ai-engineering' && <AIEngineeringCourse setScreen={setScreen} />}
          {screen === 'games'         && <GamesScreen        onBack={() => setScreen('dashboard')} setScreen={setScreen} />}
          {screen === 'shape-slicer'  && <ShapeSlicerGame onBack={() => setScreen('dashboard')} />}
          {screen === 'physics-sandbox' && <PhysicsPlayground type="collision_elastic" config={{ freePlay: false }} onBack={() => setScreen('dashboard')} />}
          {screen === 'kinematics-cannon' && <PhysicsPlayground type="projectile" config={{ freePlay: false }} onBack={() => setScreen('dashboard')} />}
          {screen === 'coulombs-collider' && <PhysicsPlayground type="electric_field" config={{ freePlay: false }} onBack={() => setScreen('dashboard')} />}
          {screen === 'physics-arcade'    && <PhysicsArcade    onBack={() => setScreen('dashboard')} />}
          {screen === 'math-arcade'       && <MathArcade       onBack={() => setScreen('dashboard')} />}
          {screen === 'chemistry-arcade'  && <ChemistryArcade  onBack={() => setScreen('dashboard')} />}
          {screen === 'local-ai'          && <LocalAIChat      onBack={() => setScreen('dashboard')} />}
        </motion.div>
      </AnimatePresence>

      <div style={{ display: ['games', 'shape-slicer', 'physics-sandbox', 'kinematics-cannon', 'coulombs-collider', 'physics-arcade', 'math-arcade', 'chemistry-arcade', 'timeline-demo', 'local-ai'].includes(screen) ? 'none' : 'block' }}>
        <BottomNav current={screen} setScreen={setScreen} />
      </div>
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
