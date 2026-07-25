import React, { useState } from 'react';
import { useApp } from '../services/appState';
import { mockRAG } from '../services/mockRAG';
import { 
  HelpCircle, CheckCircle2, XCircle, Award, RotateCcw, Sparkles 
} from 'lucide-react';

export function QuizGeneratorPage() {
  const { showToast } = useApp();
  const [quizzes, setQuizzes] = useState(mockRAG.quizzes);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const activeQuiz = quizzes[currentQuizIdx];

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === activeQuiz.correctOption) {
      setScore(score + 1);
      showToast('Correct Answer! +10 XP 🔥', 'success');
    } else {
      showToast('Incorrect option selected', 'error');
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    if (currentQuizIdx < quizzes.length - 1) {
      setCurrentQuizIdx(currentQuizIdx + 1);
    }
  };

  return (
    <div style={{ padding: '32px 36px', maxWidth: '960px', margin: '0 auto' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-teal"><HelpCircle size={14} /> AI Quiz Synthesizer</span>
            <span className="badge badge-amber"><Award size={14} /> Score: {score} / {quizzes.length}</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Dynamic MCQ Quiz Generator</h1>
          <p style={{ color: 'var(--text-muted)' }}>Auto-generated multiple choice question bank from indexed document vault.</p>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="glass-panel" style={{ padding: '36px', borderRadius: 'var(--radius-xl)', marginBottom: '28px', background: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
          <span>Question {currentQuizIdx + 1} of {quizzes.length}</span>
          <span className="badge badge-cyan">Source: {activeQuiz.doc}</span>
        </div>

        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px', lineHeight: 1.4 }}>
          {activeQuiz.question}
        </h3>

        {/* Options List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
          {activeQuiz.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = isAnswered && idx === activeQuiz.correctOption;
            const isWrong = isAnswered && isSelected && idx !== activeQuiz.correctOption;

            let bgColor = 'var(--bg-tertiary)';
            let borderColor = 'var(--glass-border)';
            if (isCorrect) {
              bgColor = 'rgba(16, 185, 129, 0.18)';
              borderColor = 'var(--accent-emerald)';
            } else if (isWrong) {
              bgColor = 'rgba(244, 63, 94, 0.18)';
              borderColor = 'var(--accent-rose)';
            }

            return (
              <div 
                key={idx}
                onClick={() => handleSelectOption(idx)}
                style={{
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: bgColor,
                  border: `1.5px solid ${borderColor}`,
                  cursor: isAnswered ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  fontSize: '0.98rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>

                {isCorrect && <CheckCircle2 size={20} style={{ color: 'var(--accent-emerald)' }} />}
                {isWrong && <XCircle size={20} style={{ color: 'var(--accent-rose)' }} />}
              </div>
            );
          })}
        </div>

        {/* Answer Grounding Explanation */}
        {isAnswered && (
          <div className="animate-fade-in" style={{ padding: '16px 20px', background: 'rgba(30, 41, 59, 0.7)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-cyan)', marginBottom: '24px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              GROUNDED DOCUMENT EXPLANATION
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
              {activeQuiz.explanation}
            </p>
          </div>
        )}

        {/* Next Question Control */}
        {isAnswered && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={handleNextQuestion}
              className="gradient-btn"
              style={{ padding: '10px 24px' }}
            >
              Next Question <Sparkles size={16} />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
