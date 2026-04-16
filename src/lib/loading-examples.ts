/**
 * Example loading patterns for common operations
 * Import and use useLoading() to control loading states throughout the app
 */

import { useLoading } from './LoadingContext';

/**
 * Example: Session building with progress
 * Usage in Dashboard or session builder:
 *
 * const { startLoading, stopLoading, setProgress } = useLoading();
 * 
 * const handleBuildSession = async () => {
 *   try {
 *     startLoading('Building your session...', false); // non-fullscreen progress bar
 *     
 *     // Simulate work with progress updates
 *     for (let i = 0; i <= 100; i += 10) {
 *       await new Promise(r => setTimeout(r, 100));
 *       setProgress(i);
 *     }
 *     
 *     stopLoading();
 *     setScreen('session');
 *   } catch (e) {
 *     stopLoading();
 *   }
 * };
 */

/**
 * Example: Async operation with fullscreen spinner
 * Usage in any screen for async operations:
 *
 * const { startLoading, stopLoading } = useLoading();
 * 
 * const handleSubmitAnswer = async () => {
 *   try {
 *     startLoading('Recording your response...', true); // fullscreen spinner
 *     
 *     await updateConcept(concept, answer);
 *     
 *     stopLoading();
 *     setQIndex(qIndex + 1);
 *   } catch (e) {
 *     stopLoading();
 *     console.error(e);
 *   }
 * };
 */

/**
 * Example: Data fetching with message
 * Usage in screens that fetch data:
 *
 * const { startLoading, stopLoading } = useLoading();
 * 
 * useEffect(() => {
 *   const loadData = async () => {
 *     startLoading('Loading concepts...', true);
 *     try {
 *       const data = await fetchConceptsFromDB();
 *       setConcepts(data);
 *     } finally {
 *       stopLoading();
 *     }
 *   };
 *   loadData();
 * }, []);
 */

export const LoadingExamples = {
  // Re-export from context for convenience
  useLoading,

  /**
   * Quick-start utilities
   */
  
  /**
   * Show fullscreen loading spinner for an async operation
   */
  async withFullscreenLoad<T>(message: string, operation: () => Promise<T>): Promise<T> {
    const { startLoading, stopLoading } = useLoading();
    startLoading(message, true);
    try {
      const result = await operation();
      stopLoading();
      return result;
    } catch (error) {
      stopLoading();
      throw error;
    }
  },

  /**
   * Show progress bar for a long-running operation
   */
  async withProgressLoad<T>(
    message: string,
    operation: (setProgress: (p: number) => void) => Promise<T>
  ): Promise<T> {
    const { startLoading, stopLoading, setProgress } = useLoading();
    startLoading(message, false);
    try {
      const result = await operation(setProgress);
      stopLoading();
      return result;
    } catch (error) {
      stopLoading();
      throw error;
    }
  },
};

export default LoadingExamples;
