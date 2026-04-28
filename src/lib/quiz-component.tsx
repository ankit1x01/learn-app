import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { saveQuizStatsForFSRS, getQuizFeedbackMessage } from '@/lib/quiz-fsrs-bridge';
import type { QuizQuestion, QuizData } from '@/data/ai-engineering/quiz-content';

interface QuizComponentProps {
  quizData: QuizData;
  lessonId: string;
  onComplete?: (stats: QuizStats) => void;
}

interface QuizStats {
  correctCount: number;
  totalCount: number;
  percentage: number;
  difficulty: number; // 1-5 scale based on performance
  stability: number; // How confident learner is
}

interface QuestionState {
  answered: boolean;
  selectedIndex: number | null;
  isCorrect: boolean;
}

const m3Colors = {
  primary: '#6750A4',
  secondary: '#625B71',
  success: '#146C2E',
  error: '#B3261E',
  background: '#FFFBFE',
  onBackground: '#1C1B1F',
  surfaceContainer: '#F3EDF7',
  outline: '#79747E',
};

export default function QuizComponent({ quizData, lessonId, onComplete }: QuizComponentProps) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [questionStates, setQuestionStates] = useState<QuestionState[]>(
    quizData.questions.map(() => ({ answered: false, selectedIndex: null, isCorrect: false }))
  );
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quizData.questions[currentQuestionIdx];
  const currentState = questionStates[currentQuestionIdx];

  const handleAnswer = useCallback((selectedIndex: number) => {
    if (currentState.answered) return;

    const isCorrect = selectedIndex === currentQuestion.correct;
    const newStates = [...questionStates];
    newStates[currentQuestionIdx] = {
      answered: true,
      selectedIndex,
      isCorrect,
    };
    setQuestionStates(newStates);
  }, [currentQuestion, currentQuestionIdx, currentState, questionStates]);

  const handleNext = useCallback(() => {
    if (currentQuestionIdx < quizData.questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      // Quiz complete - calculate stats and show results
      const correctCount = questionStates.filter(s => s.isCorrect).length;
      const totalCount = quizData.questions.length;
      const percentage = Math.round((correctCount / totalCount) * 100);

      // FSRS difficulty: higher if more mistakes
      // FSRS stability: confidence in the knowledge
      const difficulty = Math.min(10, Math.max(1, (totalCount - correctCount) + 1));
      const stability = percentage >= 80 ? 4 : percentage >= 60 ? 3 : 2;

      const stats: QuizStats = {
        correctCount,
        totalCount,
        percentage,
        difficulty,
        stability,
      };

      // Save to localStorage with FSRS bridge
      saveQuizStatsForFSRS(lessonId, stats);

      setShowResults(true);
      onComplete?.(stats);
    }
  }, [currentQuestionIdx, quizData.questions.length, questionStates, lessonId, onComplete]);

  const handleRestart = () => {
    setCurrentQuestionIdx(0);
    setQuestionStates(quizData.questions.map(() => ({ answered: false, selectedIndex: null, isCorrect: false })));
    setShowResults(false);
  };

  const correctCount = questionStates.filter(s => s.isCorrect).length;
  const percentage = Math.round((correctCount / questionStates.length) * 100);

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg p-6 mb-4"
        style={{
          backgroundColor: percentage >= 80 ? 'rgba(20, 108, 46, 0.1)' : 'rgba(179, 38, 30, 0.1)',
          border: `2px solid ${percentage >= 80 ? m3Colors.success : m3Colors.error}`,
        }}
      >
        <div className="text-center mb-6">
          <div className="text-4xl font-bold mb-2" style={{ color: percentage >= 80 ? m3Colors.success : m3Colors.error }}>
            {percentage}%
          </div>
          <p className="text-lg font-semibold" style={{ color: m3Colors.onBackground }}>
            {correctCount} of {questionStates.length} Correct
          </p>
          <p className="text-sm mt-2" style={{ color: m3Colors.outline }}>
            {percentage >= 80 ? '🎉 Excellent! Ready to move on.' : percentage >= 60 ? '👍 Good effort! Review the explanations.' : '📖 Take time to review this lesson.'}
          </p>

          {/* FSRS Update Message */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 px-4 py-2 rounded-lg"
            style={{
              backgroundColor: percentage >= 80 ? 'rgba(20, 108, 46, 0.15)' : 'rgba(179, 38, 30, 0.15)',
              borderLeft: `4px solid ${percentage >= 80 ? m3Colors.success : m3Colors.error}`,
            }}
          >
            <p className="text-xs font-medium" style={{ color: m3Colors.onBackground }}>
              {percentage >= 80 ? '📈 FSRS Stability increased' : '📊 FSRS metrics updated'}
            </p>
            <p className="text-xs mt-1" style={{ color: m3Colors.outline }}>
              This quiz performance will improve your spaced repetition schedule
            </p>
          </motion.div>
        </div>

        {/* Show incorrect answers for review */}
        {correctCount < questionStates.length && (
          <div className="mb-6 space-y-3">
            <p className="font-semibold text-sm" style={{ color: m3Colors.onBackground }}>
              Review your answers:
            </p>
            {quizData.questions.map((q, idx) => {
              if (questionStates[idx].isCorrect) return null;
              return (
                <div key={idx} className="p-3 rounded-lg" style={{ backgroundColor: m3Colors.surfaceContainer }}>
                  <p className="text-sm font-medium mb-2" style={{ color: m3Colors.error }}>
                    Q{idx + 1}: {q.question}
                  </p>
                  <p className="text-xs mb-1" style={{ color: m3Colors.outline }}>
                    Your answer: {q.options[questionStates[idx].selectedIndex || 0]}
                  </p>
                  <p className="text-xs" style={{ color: m3Colors.success }}>
                    Correct: {q.options[q.correct]}
                  </p>
                  <p className="text-xs mt-1 italic" style={{ color: m3Colors.onBackground }}>
                    {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleRestart}
            className="flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all"
            style={{
              backgroundColor: m3Colors.primary,
              color: 'white',
            }}
          >
            Retake Quiz
          </button>
          {percentage >= 80 && (
            <button
              onClick={() => {
                const lessonStats = JSON.parse(localStorage.getItem('completedLessons') || '{}');
                lessonStats[lessonId] = true;
                localStorage.setItem('completedLessons', JSON.stringify(lessonStats));
              }}
              className="flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all"
              style={{
                backgroundColor: m3Colors.success,
                color: 'white',
              }}
            >
              Mark Complete
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium" style={{ color: m3Colors.onBackground }}>
            Question {currentQuestionIdx + 1} of {quizData.questions.length}
          </span>
          <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: m3Colors.surfaceContainer, color: m3Colors.outline }}>
            {currentQuestion.stage === 'pre' ? '📖 Pre-Lesson' : '✓ Post-Lesson'}
          </span>
        </div>
        <div className="h-2 rounded-full" style={{ backgroundColor: m3Colors.surfaceContainer, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIdx + 1) / quizData.questions.length) * 100}%` }}
            className="h-full"
            style={{ backgroundColor: m3Colors.primary }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: m3Colors.onBackground }}>
          {currentQuestion.question}
        </h3>

        {/* Options */}
        <div className="space-y-2">
          <AnimatePresence>
            {currentQuestion.options.map((option, idx) => {
              const isSelected = currentState.selectedIndex === idx;
              const isCorrectOption = idx === currentQuestion.correct;
              const showCorrect = currentState.answered && isCorrectOption;
              const showIncorrect = currentState.answered && isSelected && !isCorrectOption;

              return (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleAnswer(idx)}
                  disabled={currentState.answered}
                  className="w-full p-4 rounded-lg text-left font-medium transition-all active:scale-95"
                  style={{
                    backgroundColor: showCorrect
                      ? `rgba(20, 108, 46, 0.2)`
                      : showIncorrect
                        ? `rgba(179, 38, 30, 0.2)`
                        : isSelected
                          ? m3Colors.primary
                          : m3Colors.surfaceContainer,
                    color: isSelected && !currentState.answered ? 'white' : m3Colors.onBackground,
                    border: `2px solid ${
                      showCorrect
                        ? m3Colors.success
                        : showIncorrect
                          ? m3Colors.error
                          : isSelected && !currentState.answered
                            ? m3Colors.primary
                            : 'transparent'
                    }`,
                    cursor: currentState.answered ? 'default' : 'pointer',
                    opacity: currentState.answered && !isSelected && !isCorrectOption ? 0.5 : 1,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showCorrect && <span className="text-lg">✓</span>}
                    {showIncorrect && <span className="text-lg">✗</span>}
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Explanation (shown after answer) */}
      <AnimatePresence>
        {currentState.answered && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 rounded-lg"
            style={{
              backgroundColor: m3Colors.surfaceContainer,
              borderLeft: `4px solid ${m3Colors.primary}`,
            }}
          >
            <p className="text-sm font-semibold mb-2" style={{ color: m3Colors.onBackground }}>
              💡 Explanation:
            </p>
            <p className="text-sm" style={{ color: m3Colors.onBackground }}>
              {currentQuestion.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={!currentState.answered}
        className="w-full px-4 py-3 rounded-lg font-semibold transition-all active:scale-95"
        style={{
          backgroundColor: currentState.answered ? m3Colors.primary : m3Colors.surfaceContainer,
          color: currentState.answered ? 'white' : m3Colors.outline,
          cursor: currentState.answered ? 'pointer' : 'not-allowed',
        }}
      >
        {currentQuestionIdx === quizData.questions.length - 1 ? 'See Results' : 'Next Question'}
      </button>
    </motion.div>
  );
}
