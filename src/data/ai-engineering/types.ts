// Types for AI Engineering course structure

export interface Lesson {
  id: string;
  number: number;
  name: string;
  path: string; // relative path to lesson folder
  docPath?: string;
  codePaths: string[];
  quizPath?: string;
  videoUrl?: string; // YouTube, Vimeo, or other video URL
  estimatedMinutes?: number; // Estimated time to complete in minutes
}

export interface Phase {
  id: string;
  number: number;
  name: string;
  path: string; // relative path to phase folder
  lessons: Lesson[];
}

export interface CourseStructure {
  phases: Phase[];
}
