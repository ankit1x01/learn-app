/**
 * Bridge between Quiz questions and Session items.
 * Converts AI Engineering course quizzes into SessionItems for study sessions.
 */

import type { SessionItem, Queue, Concept } from '@/core/types';
import type { QuizQuestion, QuizData } from '@/data/ai-engineering/quiz-content';
import { getQuizContent, quizContent } from '@/data/ai-engineering/quiz-content';

/**
 * Extended SessionItem that can hold either a Concept or a Quiz question.
 */
export interface SessionItemWithQuiz extends Omit<SessionItem, 'concept'> {
  concept?: Concept;
  quiz?: {
    question: QuizQuestion;
    lessonId: string;
    lessonName: string;
  };
  type: 'concept' | 'quiz';
}

/**
 * Convert a quiz question into a session-compatible format.
 *
 * @param question The quiz question
 * @param lessonId Lesson identifier
 * @param lessonName Display name
 * @returns SessionItem formatted quiz question
 */
export function quizQuestionToSessionItem(
  question: QuizQuestion,
  lessonId: string,
  lessonName: string
): SessionItemWithQuiz {
  return {
    type: 'quiz',
    quiz: { question, lessonId, lessonName },
    queue: question.stage === 'pre' ? 'new' : 'review',
    retrievability: question.stage === 'pre' ? 0 : 0.5,
    isPreTest: question.stage === 'pre',
  };
}

/**
 * Get all available quizzes from AI Engineering course.
 * Can optionally filter by lesson IDs.
 *
 * @param lessonIds Optional array of lesson IDs to filter
 * @returns Array of session items from quizzes
 */
export function getAllQuizzesAsSessionItems(lessonIds?: string[]): SessionItemWithQuiz[] {
  const items: SessionItemWithQuiz[] = [];

  for (const [lessonPath, data] of Object.entries(quizContent)) {
    if (lessonIds && lessonIds.length > 0 && !lessonIds.some(id => lessonPath.includes(id))) {
      continue;
    }
    
    // Extract a readable lesson name from path
    const pathParts = lessonPath.split('/');
    const lessonNameRaw = pathParts[pathParts.length - 1] || 'Unknown Lesson';
    const lessonName = lessonNameRaw
      .replace(/^\d+-/, '') // remove leading numbers like 01-
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
      
    // Using the path as the lessonId for simplicity
    for (const q of data.questions) {
      items.push(quizQuestionToSessionItem(q, lessonPath, lessonName));
    }
  }

  return items;
}

/**
 * Mix quiz questions into a session at a specified ratio.
 *
 * @param sessionItems Original session items
 * @param quizItems Quiz questions to mix in
 * @param quizRatio Ratio of quiz questions (0-0.5, where 0.2 = 20% quizzes, 80% concepts)
 * @returns Mixed session with quizzes
 */
export function mixQuizzesIntoSession(
  sessionItems: SessionItem[],
  quizItems: SessionItemWithQuiz[],
  quizRatio: number = 0.1 // 10% quizzes by default
): SessionItemWithQuiz[] {
  if (quizItems.length === 0) {
    return sessionItems.map(item => ({ ...item, type: 'concept' as const }));
  }

  const quizSlots = Math.max(1, Math.floor(sessionItems.length * quizRatio));
  const quizToAdd = quizItems.slice(0, quizSlots);

  const mixed: SessionItemWithQuiz[] = [
    ...sessionItems.map(item => ({ ...item, type: 'concept' as const })),
    ...quizToAdd,
  ];

  // Shuffle to interleave quizzes throughout session
  return shuffleWithConstraint(mixed);
}

/**
 * Shuffle items while maintaining spacing of quiz questions.
 * Ensures quizzes aren't clustered together.
 */
function shuffleWithConstraint(items: SessionItemWithQuiz[]): SessionItemWithQuiz[] {
  const result = [...items];
  const quizIndices = result
    .map((item, idx) => (item.type === 'quiz' ? idx : -1))
    .filter(idx => idx !== -1);

  // If quizzes are too close, spread them out
  for (let i = 1; i < quizIndices.length; i++) {
    const gap = quizIndices[i] - quizIndices[i - 1];
    if (gap < 3 && quizIndices[i] > 2) {
      // Move quiz to a less crowded position
      const [quiz] = result.splice(quizIndices[i], 1);
      const insertPos = Math.min(quizIndices[i - 1] + 4, result.length - 1);
      result.splice(insertPos, 0, quiz);
    }
  }

  return result;
}

/**
 * Extract quiz questions from a lesson.
 * Returns questions formatted for session display.
 */
export function getQuizQuestionsForLesson(
  lessonPath: string,
  lessonId: string,
  lessonName: string
): SessionItemWithQuiz[] {
  const quizData = getQuizContent(lessonPath);
  if (!quizData) return [];

  return quizData.questions.map(q => quizQuestionToSessionItem(q, lessonId, lessonName));
}

/**
 * Create a mini-quiz session from a specific lesson.
 * Returns only quiz questions from that lesson.
 */
export function createQuizSessionFromLesson(
  lessonPath: string,
  lessonId: string,
  lessonName: string,
  preTestOnly: boolean = false
): SessionItemWithQuiz[] {
  const quizData = getQuizContent(lessonPath);
  if (!quizData) return [];

  let questions = quizData.questions;
  if (preTestOnly) {
    questions = questions.filter(q => q.stage === 'pre');
  }

  return questions.map(q => quizQuestionToSessionItem(q, lessonId, lessonName));
}

/**
 * Convert quiz session item back to regular session item (for storage).
 */
export function sessionItemWithQuizToSessionItem(item: SessionItemWithQuiz): SessionItem {
  if (item.type === 'concept' && item.concept) {
    return {
      concept: item.concept,
      queue: item.queue,
      retrievability: item.retrievability,
      statedConfidence: item.statedConfidence,
      isPreTest: item.isPreTest,
    };
  }
  // This shouldn't happen - quiz items need special handling in LiveSession
  throw new Error('Cannot convert quiz-only item to SessionItem');
}
