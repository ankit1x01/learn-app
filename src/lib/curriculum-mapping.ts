/**
 * Curriculum Mapping — Links teaching scenarios to learning concepts
 * Enables tracking of which scenarios teach which concepts
 */

import type { ScenarioName } from './teaching-scenarios';
import { masterDemoCurriculum } from './master-demo-scenario';

export interface CurriculumEntry {
  scenarioId: ScenarioName;
  title: string;
  description: string;
  conceptIds: string[]; // Which concepts this scenario teaches
  subject: 'CS' | 'Math' | 'Science' | 'History' | 'Language';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // in seconds
  tags: string[];
}

export const curriculumMap: CurriculumEntry[] = [
  masterDemoCurriculum as CurriculumEntry,
  {
    scenarioId: 'intro-variables',
    title: 'Introduction to Variables',
    description: 'Learn what variables are and how they store data in programming.',
    conceptIds: ['cs_001', 'cs_variables'],
    subject: 'CS',
    difficulty: 'beginner',
    estimatedDuration: 180,
    tags: ['programming', 'fundamentals', 'variables'],
  },
  {
    scenarioId: 'data-types',
    title: 'Understanding Data Types',
    description: 'Explore numbers, strings, and booleans—the foundation of data in programming.',
    conceptIds: ['cs_002', 'cs_datatypes'],
    subject: 'CS',
    difficulty: 'beginner',
    estimatedDuration: 300,
    tags: ['programming', 'data structures', 'types'],
  },
  {
    scenarioId: 'functions-intro',
    title: 'Functions and Code Reusability',
    description: 'Discover how functions organize code and promote reusability.',
    conceptIds: ['cs_003', 'cs_functions'],
    subject: 'CS',
    difficulty: 'intermediate',
    estimatedDuration: 240,
    tags: ['programming', 'functions', 'modularity'],
  },
  {
    scenarioId: 'algebra-basics',
    title: 'Solving Linear Equations',
    description: 'Master the fundamentals of algebra and equation solving.',
    conceptIds: ['math_001', 'math_algebra'],
    subject: 'Math',
    difficulty: 'beginner',
    estimatedDuration: 200,
    tags: ['algebra', 'equations', 'problem-solving'],
  },
  {
    scenarioId: 'cell-biology',
    title: 'Cell Structure and Function',
    description: 'Understand the basic components of cells and their roles.',
    conceptIds: ['science_001', 'science_biology', 'science_cells'],
    subject: 'Science',
    difficulty: 'intermediate',
    estimatedDuration: 240,
    tags: ['biology', 'cells', 'organelles'],
  },
  {
    scenarioId: 'industrial-revolution',
    title: 'The Industrial Revolution',
    description: 'Explore the transformative period that changed society forever.',
    conceptIds: ['history_001', 'history_industrialization'],
    subject: 'History',
    difficulty: 'intermediate',
    estimatedDuration: 220,
    tags: ['history', 'industrial', 'innovation'],
  },
];

/**
 * Get curriculum entry for a scenario
 */
export function getCurriculumEntry(scenarioId: ScenarioName): CurriculumEntry | null {
  return curriculumMap.find((entry) => entry.scenarioId === scenarioId) || null;
}

/**
 * Get all scenarios for a subject
 */
export function getScenariosBySubject(
  subject: CurriculumEntry['subject'],
): CurriculumEntry[] {
  return curriculumMap.filter((entry) => entry.subject === subject);
}

/**
 * Get all scenarios for a concept
 */
export function getScenariosByConceptId(conceptId: string): CurriculumEntry[] {
  return curriculumMap.filter((entry) => entry.conceptIds.includes(conceptId));
}

/**
 * Get scenarios by difficulty level
 */
export function getScenariosByDifficulty(
  difficulty: CurriculumEntry['difficulty'],
): CurriculumEntry[] {
  return curriculumMap.filter((entry) => entry.difficulty === difficulty);
}

/**
 * Get all concepts covered by teaching scenarios
 */
export function getAllCoveredConcepts(): Set<string> {
  const concepts = new Set<string>();
  curriculumMap.forEach((entry) => {
    entry.conceptIds.forEach((conceptId) => concepts.add(conceptId));
  });
  return concepts;
}
