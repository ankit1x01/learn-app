export type Screen = 'dashboard' | 'session' | 'encoding' | 'map' | 'recall' | 'complete'
                   | 'elite' | 'stress' | 'ghana' | 'distractor' | 'errors' | 'mock' | 'preexam' | 'topics'
                   | 'course' | 'course-lesson' | 'demo-session' | 'games' | 'shape-slicer' | 'physics-sandbox' | 'kinematics-cannon' | 'coulombs-collider' | 'prompt-playground' | 'ai-engineering'
                   | 'physics-arcade' | 'math-arcade' | 'chemistry-arcade'
                   | 'presleep' | 'timeline-demo';

// Prompt Playground Types
export type CoursePackId = 'foundation' | 'patterns' | 'advanced' | 'domain';

export interface CoursePack {
  id: CoursePackId;
  name: string;
  description: string;
  chapterCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
  color: string;
}

export interface PackProgress {
  packId: CoursePackId;
  currentChapter: number;
  chaptersCompleted: number[];
  lastAccessed: number;
}

export interface Template {
  id: string;
  pack: CoursePackId;
  chapter: number;
  chapterTitle: string;
  title: string;
  technique: string;
  techniqueColor: string;
  lesson: string;
  system: string;
  user: string;
  highlight?: string;
}
