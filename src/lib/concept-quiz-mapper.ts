/**
 * Maps AI Engineering concepts to quiz topics
 * Extracts MCQs from quiz content based on concept
 */

import type { Concept } from '../core/types';
import { quizContent } from '../data/ai-engineering/quiz-content';

export interface QuizMCQ {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  stage: 'pre' | 'post';
}

/**
 * Map concept IDs to quiz topic paths
 * Key: concept ID
 * Value: topic path in quiz-content.ts
 */
const CONCEPT_TO_QUIZ_PATH: Record<string, string> = {
  // LLM Mastery examples (these exist in quiz content)
  'ai_agt_3': '16-multi-agent-and-swarms/03-communication-protocols',
  'ai_agt_1': '16-multi-agent-and-swarms/01-why-multi-agent',
  'ai_llm_1': '11-llm-engineering/17-agent-framework-tradeoffs',

  // For concepts without quiz content, return undefined
  // This is fine - we just skip the quiz MCQ for that concept
};

/**
 * Get quiz MCQs for a concept
 * Returns 2-3 questions (mix of pre and post)
 * Returns empty array if no quiz content exists for this concept
 */
export function getQuizMCQsForConcept(concept: Concept): QuizMCQ[] {
  const quizPath = CONCEPT_TO_QUIZ_PATH[concept.id];
  if (!quizPath) {
    return []; // No quiz content for this concept
  }

  const quizData = quizContent[quizPath];
  if (!quizData || !quizData.questions) {
    return []; // Quiz path doesn't exist
  }

  const questions = quizData.questions;

  // Prefer post questions (harder), fall back to pre
  const postQuestions = questions.filter(q => q.stage === 'post');
  const preQuestions = questions.filter(q => q.stage === 'pre');

  // Select 2-3 questions: prefer 2 post + 1 pre if available
  const selected: typeof questions = [];

  if (postQuestions.length >= 2) {
    // Take 2 post questions
    selected.push(postQuestions[0], postQuestions[1]);
    if (preQuestions.length > 0) {
      selected.push(preQuestions[0]); // Add 1 pre for variety
    }
  } else if (postQuestions.length === 1) {
    // 1 post + 2 pre
    selected.push(postQuestions[0]);
    selected.push(preQuestions[0], preQuestions[1] ?? preQuestions[0]);
  } else if (preQuestions.length >= 2) {
    // Only pre questions available
    selected.push(preQuestions[0], preQuestions[1]);
  } else {
    // Only 1 question total
    selected.push(questions[0]);
  }

  // Convert to QuizMCQ format
  return selected.map((q, idx) => ({
    id: `quiz-${concept.id}-${idx}`,
    question: q.question,
    options: q.options,
    correct: q.correct,
    explanation: q.explanation,
    stage: q.stage,
  }));
}

/**
 * Get all concepts that have quiz content
 * Useful for testing/debugging
 */
export function getConceptsWithQuizContent(): string[] {
  return Object.keys(CONCEPT_TO_QUIZ_PATH);
}

/**
 * Add quiz content mapping for a concept
 * Call this during concept initialization if needed
 */
export function mapConceptToQuiz(conceptId: string, quizPath: string): void {
  CONCEPT_TO_QUIZ_PATH[conceptId] = quizPath;
}
