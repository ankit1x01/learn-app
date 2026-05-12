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
  explanation?: string;
  hint?: string;
  conceptId?: string;
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
  explanation,
  hint,
  conceptId,
  onAnswer,
  onSkip,
}: CheckpointProps) {
  const [selected, setSelected] = useState<string | number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const [confidence, setConfidence] = useState<'low' | 'medium' | 'high'>('medium');
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = () => {
    if (selected === null) return;

    setFeedback('submitted');

    const isCorrect = selected === expectedAnswer || String(selected) === String(expectedAnswer);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setAttempts((value) => value + 1);
  };

  const handleContinue = () => {
    if (feedback === 'correct') {
      onAnswer?.(selected!, true);
    } else {
      setFeedback('idle');
      setSelected(null);
    }
  };

  const isAnswered = feedback !== 'idle';

  return (
    <div
      style={{
        padding: '24px',
        background: '#FFFCF6',
        borderRadius: '18px',
        maxWidth: '600px',
        border: feedback === 'correct' ? '1px solid #86EFAC' : feedback === 'incorrect' ? '1px solid #FCA5A5' : '1px solid #E5D8C8',
        boxShadow: '0 18px 45px rgba(58, 42, 20, 0.15)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Question */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 24, color: '#0F766E' }}>quiz</span>
            <p style={{ fontSize: '18px', fontWeight: 950, margin: 0, color: '#1F2933' }}>Learning Checkpoint</p>
          </div>
          {conceptId && (
            <span style={{ padding: '5px 8px', borderRadius: '999px', background: '#F5F3FF', color: '#5B21B6', fontSize: '11px', fontWeight: 850 }}>
              {conceptId}
            </span>
          )}
        </div>
        {prompt && (
          <p style={{ fontSize: '17px', fontWeight: 800, marginTop: '12px', color: '#1F2933', lineHeight: 1.45 }}>
            {prompt}
          </p>
        )}
        {hint && feedback !== 'correct' && (
          <div style={{ marginTop: '12px', padding: '10px 12px', borderRadius: '12px', background: '#F0FDFA', border: '1px solid #CCFBF1', color: '#115E59', fontSize: '13px', lineHeight: 1.45 }}>
            <strong>Hint:</strong> {hint}
          </div>
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
                  padding: '13px',
                  marginBottom: '9px',
                  background: showAsCorrect ? '#DCFCE7' : showAsWrong ? '#FEE2E2' : isSelectedOption ? '#EEF2FF' : '#FFFFFF',
                  border: `1px solid ${
                    showAsCorrect ? '#22C55E' : showAsWrong ? '#EF4444' : isSelectedOption ? '#6366F1' : '#E7E5E4'
                  }`,
                  borderRadius: '13px',
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
                  <span style={{ flex: 1, fontSize: '14px', fontWeight: 700, color: showAsWrong ? '#991B1B' : showAsCorrect ? '#166534' : '#292524' }}>
                    {option}
                  </span>
                  {showAsCorrect && <span className="material-symbols-rounded" style={{ fontSize: 18, color: '#16A34A' }}>check_circle</span>}
                  {showAsWrong && <span className="material-symbols-rounded" style={{ fontSize: 18, color: '#DC2626' }}>cancel</span>}
                </div>
              </label>
            );
          })}
        </div>
      )}

      {/* Feedback */}
      {!isAnswered && (
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '11px', color: '#78716C', fontWeight: 900, marginBottom: '8px' }}>CONFIDENCE</div>
          <div style={{ display: 'flex', gap: '7px' }}>
            {(['low', 'medium', 'high'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setConfidence(level)}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '10px',
                  border: confidence === level ? '1px solid #0F766E' : '1px solid #E7E5E4',
                  background: confidence === level ? '#ECFDF5' : '#FFFFFF',
                  color: confidence === level ? '#0F766E' : '#57534E',
                  fontSize: '12px',
                  fontWeight: 850,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      )}

      {isAnswered && (
        <div
          style={{
            padding: '13px',
            background: feedback === 'correct' ? '#DCFCE7' : '#FEF3C7',
            border: `1px solid ${feedback === 'correct' ? '#86EFAC' : '#FCD34D'}`,
            borderRadius: '13px',
            marginBottom: '16px',
            fontSize: '13px',
            fontWeight: 750,
            color: feedback === 'correct' ? '#14532D' : '#78350F',
            lineHeight: 1.55,
          }}
        >
          <div style={{ fontWeight: 950, marginBottom: '4px' }}>
            {feedback === 'correct' ? 'Correct. Lock that in.' : attempts >= 2 ? 'Still not quite. Use the explanation and try once more.' : 'Not quite. Good moment to adjust the idea.'}
          </div>
          {explanation || 'Review the concept, compare the options, and choose the answer that best matches the principle.'}
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
                backgroundColor: selected === null ? '#D6D3D1' : '#0F766E',
                color: 'white',
                border: 'none',
                borderRadius: '11px',
                cursor: selected === null ? 'not-allowed' : 'pointer',
                fontWeight: 900,
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
                  backgroundColor: '#FFFFFF',
                  color: '#57534E',
                  border: '1px solid #D6D3D1',
                  borderRadius: '11px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 800,
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
              backgroundColor: feedback === 'correct' ? '#15803D' : '#B45309',
              color: 'white',
              border: 'none',
              borderRadius: '11px',
              cursor: 'pointer',
              fontWeight: 900,
              fontSize: '14px',
              flex: 1,
            }}
          >
            {feedback === 'correct' ? 'Continue Lesson' : 'Try Again'}
          </button>
        )}
      </div>
    </div>
  );
}
