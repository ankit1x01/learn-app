/**
 * Checkpoint — Interactive challenge/quiz with answer validation and feedback
 * Full implementation for game pauses with learning outcomes tracking
 */

import React, { useState } from 'react';

export interface CheckpointProps {
  prompt?: string;
  options?: string[];
  expectedAnswer?: string | number;
  allowContinue?: boolean;
  onAnswer?: (answer: string | number, isCorrect: boolean) => void;
  onSkip?: () => void;
}

type FeedbackState = 'idle' | 'submitted' | 'correct' | 'incorrect';

/**
 * Checkpoint component for interactive learning moments
 * Pauses playback, validates answer, provides feedback, then resumes
 */
export function Checkpoint({
  prompt,
  options,
  expectedAnswer,
  allowContinue = true,
  onAnswer,
  onSkip,
}: CheckpointProps) {
  const [selected, setSelected] = useState<string | number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSubmit = () => {
    if (selected === null) return;

    setFeedback('submitted');

    // Check if answer is correct
    const isCorrect = selected === expectedAnswer || String(selected) === String(expectedAnswer);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setShowExplanation(!isCorrect || true);

    // Notify parent after brief delay
    setTimeout(() => {
      onAnswer?.(selected, isCorrect);
    }, 1200);
  };

  const handleContinue = () => {
    if (feedback === 'correct') {
      onAnswer?.(selected!, true);
    } else {
      setFeedback('idle');
      setSelected(null);
      setShowExplanation(false);
    }
  };

  const isAnswered = feedback !== 'idle';

  return (
    <div
      style={{
        padding: '24px',
        background: feedback === 'correct' ? '#E8F5E9' : feedback === 'incorrect' ? '#FFEBEE' : '#F5F5F5',
        borderRadius: '12px',
        maxWidth: '600px',
        border: feedback === 'correct' ? '2px solid #4CAF50' : feedback === 'incorrect' ? '2px solid #F44336' : '2px solid #ddd',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Question */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '24px' }}>❓</span>
          <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Checkpoint</p>
        </div>
        {prompt && (
          <p style={{ fontSize: '16px', fontWeight: '500', marginTop: '12px', color: '#333' }}>
            {prompt}
          </p>
        )}
      </div>

      {/* Options */}
      {options && (
        <div style={{ marginBottom: '24px' }}>
          {options.map((option, idx) => {
            const isSelectedOption = selected === idx;
            const isCorrectOption = idx === expectedAnswer || String(idx) === String(expectedAnswer);
            const showAsCorrect = isAnswered && isCorrectOption;
            const showAsWrong = isAnswered && isSelectedOption && !isCorrectOption;

            return (
              <label
                key={idx}
                style={{
                  display: 'block',
                  padding: '12px',
                  marginBottom: '8px',
                  background: showAsCorrect ? '#C8E6C9' : showAsWrong ? '#FFCDD2' : isSelectedOption ? '#E1BEE7' : '#fafafa',
                  border: `2px solid ${
                    showAsCorrect ? '#4CAF50' : showAsWrong ? '#F44336' : isSelectedOption ? '#9C27B0' : '#ddd'
                  }`,
                  borderRadius: '8px',
                  cursor: isAnswered ? 'default' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: isAnswered && !isSelectedOption && !isCorrectOption ? 0.5 : 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="radio"
                    name="checkpoint"
                    value={idx}
                    checked={isSelectedOption}
                    onChange={() => !isAnswered && setSelected(idx)}
                    disabled={isAnswered}
                    style={{ cursor: isAnswered ? 'default' : 'pointer' }}
                  />
                  <span style={{ flex: 1, fontSize: '15px', color: showAsWrong ? '#C62828' : showAsCorrect ? '#1B5E20' : '#333' }}>
                    {option}
                  </span>
                  {showAsCorrect && <span style={{ fontSize: '18px' }}>✓</span>}
                  {showAsWrong && <span style={{ fontSize: '18px' }}>✗</span>}
                </div>
              </label>
            );
          })}
        </div>
      )}

      {/* Feedback */}
      {isAnswered && (
        <div
          style={{
            padding: '12px',
            background: feedback === 'correct' ? '#A5D6A7' : '#EF9A9A',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: feedback === 'correct' ? '#1B5E20' : '#B71C1C',
          }}
        >
          {feedback === 'correct' ? '🎉 Excellent! Your answer is correct.' : '📚 Not quite. Review the explanation below.'}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {!isAnswered ? (
          <>
            <button
              onClick={handleSubmit}
              disabled={selected === null}
              style={{
                padding: '10px 20px',
                backgroundColor: selected === null ? '#ccc' : '#6750a4',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: selected === null ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              Submit Answer
            </button>
            {allowContinue && onSkip && (
              <button
                onClick={onSkip}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#9E9E9E',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Skip
              </button>
            )}
          </>
        ) : (
          <button
            onClick={handleContinue}
            style={{
              padding: '10px 20px',
              backgroundColor: feedback === 'correct' ? '#4CAF50' : '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              flex: 1,
            }}
          >
            {feedback === 'correct' ? 'Continue' : 'Try Again'}
          </button>
        )}
      </div>
    </div>
  );
}
