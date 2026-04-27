import { useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import type { CoursePackId, PackProgress } from '../../types';

const PROGRESS_KEY = 'prompt_playground_progress';

export function usePackProgress() {
  const [progress, setProgress] = useState<Record<CoursePackId, PackProgress>>({
    foundation: { packId: 'foundation', currentChapter: 1, chaptersCompleted: [], lastAccessed: Date.now() },
    patterns: { packId: 'patterns', currentChapter: 1, chaptersCompleted: [], lastAccessed: Date.now() },
    advanced: { packId: 'advanced', currentChapter: 1, chaptersCompleted: [], lastAccessed: Date.now() },
    domain: { packId: 'domain', currentChapter: 1, chaptersCompleted: [], lastAccessed: Date.now() },
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load progress from Capacitor Preferences
  useEffect(() => {
    (async () => {
      try {
        const result = await Preferences.get({ key: PROGRESS_KEY });
        if (result.value) {
          setProgress(JSON.parse(result.value));
        }
      } catch (e) {
        console.error('Failed to load progress:', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Save progress to Capacitor Preferences
  const updateProgress = async (packId: CoursePackId, updates: Partial<PackProgress>) => {
    const updated = {
      ...progress,
      [packId]: { ...progress[packId], ...updates, lastAccessed: Date.now() },
    };
    setProgress(updated);
    try {
      await Preferences.set({ key: PROGRESS_KEY, value: JSON.stringify(updated) });
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  };

  // Mark chapter as completed
  const completeChapter = async (packId: CoursePackId, chapter: number) => {
    const current = progress[packId];
    const completed = new Set(current.chaptersCompleted);
    completed.add(chapter);
    await updateProgress(packId, { chaptersCompleted: Array.from(completed) });
  };

  // Advance to next chapter
  const advanceToNextChapter = async (packId: CoursePackId) => {
    const current = progress[packId];
    await updateProgress(packId, { currentChapter: current.currentChapter + 1 });
  };

  return { progress, isLoading, updateProgress, completeChapter, advanceToNextChapter };
}
