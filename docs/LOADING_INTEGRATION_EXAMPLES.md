/**
 * Integration Examples for M3 Loading System
 * 
 * This file shows real-world usage patterns for the loading indicators
 * across different screen types in CHITTA.
 * 
 * Copy and adapt these patterns into your screens.
 */

// ============================================================================
// EXAMPLE 1: Dashboard - Session Builder with Progress Bar
// ============================================================================

/**
 * Location: src/screens/Dashboard.tsx
 * Pattern: Long-running operation with visible progress
 */
export const dashboardExample = `
import { useLoading } from '../lib/LoadingContext';

export function Dashboard({ setScreen, session, ...props }: DashboardProps) {
  const { startLoading, stopLoading, setProgress } = useLoading();

  const handleBuildSession = async () => {
    try {
      startLoading('Building your personalized session...', false);
      
      // Phase 1: Load concepts from DB
      setProgress(20);
      const indexedConcepts = await loadIndexedConcepts();
      
      // Phase 2: Apply scheduling algorithm
      setProgress(50);
      const scheduledQueue = applySchedulingAlgorithm(indexedConcepts);
      
      // Phase 3: Apply prediction error
      setProgress(75);
      applyPredictionErrorBonus(scheduledQueue);
      
      // Complete
      setProgress(100);
      await new Promise(r => setTimeout(r, 200)); // Brief pause for UX
      
      stopLoading();
      setScreen('session');
    } catch (error) {
      stopLoading();
      console.error('Failed to build session:', error);
    }
  };

  return (
    // ... your UI
    <button onClick={handleBuildSession}>Start Session</button>
  );
}
`;

// ============================================================================
// EXAMPLE 2: LiveSession - Answer Submission with Fullscreen Spinner
// ============================================================================

/**
 * Location: src/screens/LiveSession.tsx
 * Pattern: Modal operation (quick, non-progress)
 */
export const liveSessionExample = `
import { useLoading } from '../lib/LoadingContext';

export function LiveSession({ ...props }: LiveSessionProps) {
  const { startLoading, stopLoading } = useLoading();

  const handleSubmitAnswer = async (selectedOption: number) => {
    try {
      startLoading('Recording your response...', true);
      
      const responseTime = Date.now() - sessionStartTime;
      const wasCorrect = selectedOption === correctAnswer;
      
      // Update concept in DB
      await onUpdateConcept(currentConcept, {
        responseTime,
        confidence: selectedConfidence,
        answer: selectedOption,
        wasCorrect,
        stage: calculateNewStage(currentConcept, wasCorrect),
      });
      
      stopLoading();
      
      // Move to next question
      setQIndex(qIndex + 1);
    } catch (error) {
      stopLoading();
      console.error('Failed to save answer:', error);
    }
  };

  return (
    // ... your UI
    <button onClick={() => handleSubmitAnswer(selectedOption)}>Confirm</button>
  );
}
`;

// ============================================================================
// EXAMPLE 3: ConceptEncoding - Operation with Message
// ============================================================================

/**
 * Location: src/screens/ConceptEncoding.tsx
 * Pattern: Quick operation with user message
 */
export const conceptEncodingExample = `
import { useLoading } from '../lib/LoadingContext';

export function ConceptEncoding({ ...props }: ConceptEncodingProps) {
  const { startLoading, stopLoading } = useLoading();

  const handleEncodingDepthChange = async (depth: number) => {
    try {
      startLoading('Saving encoding depth...', true);
      
      await onUpdateConcept(currentConcept, {
        encodingDepth: depth,
        encodedAt: new Date(),
      });
      
      stopLoading();
      setEncodingDepth(depth);
    } catch (error) {
      stopLoading();
      console.error('Failed to save encoding depth:', error);
    }
  };

  return (
    // ... your UI
    <button onClick={() => handleEncodingDepthChange(2.4)}>
      Set Encoding Depth
    </button>
  );
}
`;

// ============================================================================
// EXAMPLE 4: TopicsBank - Data Loading
// ============================================================================

/**
 * Location: src/screens/TopicsBank.tsx
 * Pattern: Initial data load
 */
export const topicsBankExample = `
import { useLoading } from '../lib/LoadingContext';

export function TopicsBank({ ...props }: TopicsBankProps) {
  const { startLoading, stopLoading } = useLoading();
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const loadTopics = async () => {
      startLoading('Loading topics...', true);
      try {
        const loadedTopics = await searchTopicsFromDB('');
        setTopics(loadedTopics);
      } finally {
        stopLoading();
      }
    };
    
    loadTopics();
  }, []);

  return (
    // ... your UI
  );
}
`;

// ============================================================================
// EXAMPLE 5: SessionComplete - Multi-phase Operation
// ============================================================================

/**
 * Location: src/screens/SessionComplete.tsx
 * Pattern: Multi-phase analysis with progress
 */
export const sessionCompleteExample = `
import { useLoading } from '../lib/LoadingContext';

export function SessionComplete({ ...props }: SessionCompleteProps) {
  const { startLoading, stopLoading, setProgress } = useLoading();

  const handleSaveSessionAnalytics = async () => {
    try {
      startLoading('Analyzing session...', false);
      
      // Phase 1: Calculate stats
      setProgress(25);
      const stats = calculateSessionStats(session);
      
      // Phase 2: Update stability scores
      setProgress(50);
      await updateConceptStability(session, stats);
      
      // Phase 3: Save to cloud
      setProgress(75);
      await syncSessionToCloud(stats);
      
      // Phase 4: Update streaks
      setProgress(100);
      await updateStreaks(stats);
      
      stopLoading();
    } catch (error) {
      stopLoading();
      console.error('Failed to save session:', error);
    }
  };

  return (
    // ... your UI
    <button onClick={handleSaveSessionAnalytics}>Save & Continue</button>
  );
}
`;

// ============================================================================
// EXAMPLE 6: Batch Operations
// ============================================================================

/**
 * Pattern: Syncing multiple concepts with progress
 */
export const batchOperationExample = `
import { useLoading } from '../lib/LoadingContext';

export async function syncAllConceptsToCloud(concepts: Concept[]) {
  const { startLoading, stopLoading, setProgress } = useLoading();
  
  startLoading('Syncing concepts...', false);
  
  try {
    const total = concepts.length;
    
    for (let i = 0; i < concepts.length; i++) {
      await uploadConceptToCloud(concepts[i]);
      setProgress((i + 1 / total) * 100);
    }
    
    stopLoading();
  } catch (error) {
    stopLoading();
    throw error;
  }
}
`;

// ============================================================================
// EXAMPLE 7: Error Handling with Loading State
// ============================================================================

/**
 * Pattern: Cleanup on error with retry capability
 */
export const errorHandlingExample = `
import { useLoading } from '../lib/LoadingContext';

export async function handleComplexOperation() {
  const { startLoading, stopLoading } = useLoading();
  
  startLoading('Processing...', true);
  
  try {
    const result = await complexAsyncOperation();
    stopLoading();
    return result;
  } catch (error) {
    // IMPORTANT: Always clean up loading state
    stopLoading();
    
    // Show error to user
    showErrorMessage('Operation failed. Please try again.');
    
    console.error('Operation failed:', error);
    throw error;
  }
}
`;

// ============================================================================
// EXPORT EXAMPLES MAP
// ============================================================================

export const INTEGRATION_EXAMPLES = {
  dashboard: dashboardExample,
  liveSession: liveSessionExample,
  conceptEncoding: conceptEncodingExample,
  topicsBank: topicsBankExample,
  sessionComplete: sessionCompleteExample,
  batchOperation: batchOperationExample,
  errorHandling: errorHandlingExample,
};

export default INTEGRATION_EXAMPLES;
