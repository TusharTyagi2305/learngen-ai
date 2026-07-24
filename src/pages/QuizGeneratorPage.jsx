import React, { useState } from 'react';
import { useApp } from '../services/appState';
import { HelpCircle, Sparkles, CheckCircle2, XCircle, Clock, BookOpen, Trophy } from 'lucide-react';

export function QuizGeneratorPage() {
  const { quizzes, documents, showToast } = useApp();
  
  const [selectedQuiz, setSelectedQuiz] = useState(quizzes[0]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelectOption = (qId, optionIdx) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    selectedQuiz.questions.forEach(q => {
      if (userAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });
    const finalScore = Math.round((correctCount / selectedQuiz.questions.length) * 100);
    setScore(finalScore);
    setIsSubmitted(true);
    showToast(`Quiz completed! You scored ${finalScore}%`, 'success');
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>AI Document Quiz Generator</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Auto-generated concept verification quizzes from your RAG vector vault documents.
          </p>
        </div>
        <button onClick={() => showToast('Generated new AI Quiz deck', 'info')} className="gradient-btn">
          <Sparkles size={16} /> Generate New Quiz Deck
        </button>
      </div>

      {/* Quiz Card View */}
      <div className="glass-panel" style={{ padding: '28px', background: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
          <div>
            <span className="badge badge-cyan" style={{ marginBottom: '6px' }}>Source: {selectedQuiz.document}</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{selectedQuiz.title}</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-amber)', fontSize: '0.88rem' }}>
            <Clock size={16} /> {selectedQuiz.timeLimitMin} min limit
          </div>
        </div>

        {/* Question List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {selectedQuiz.questions.map((q, idx) => {
            const selectedOpt = userAnswers[q.id];
            return (
              <div key={q.id} style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '14px', display: 'flex', gap: '10px' }}>
                  <span style={{ color: 'var(--accent-cyan)' }}>Q{idx + 1}.</span> {q.question}
                </h3>

                {/* MCQ Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {q.options.map((opt, optIdx) => {
                    let border = '1px solid var(--glass-border)';
                    let bg = 'var(--bg-secondary)';

                    if (selectedOpt === optIdx) {
                      border = '2px solid var(--accent-blue)';
                      bg = 'rgba(59, 130, 246, 0.15)';
                    }

                    if (isSubmitted) {
                      if (optIdx === q.correctIndex) {
                        border = '2px solid var(--accent-emerald)';
                        bg = 'rgba(16, 185, 129, 0.15)';
                      } else if (selectedOpt === optIdx && selectedOpt !== q.correctIndex) {
                        border = '2px solid var(--accent-rose)';
                        bg = 'rgba(244, 63, 94, 0.15)';
                      }
                    }

                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        style={{
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-sm)',
                          border,
                          background: bg,
                          cursor: isSubmitted ? 'default' : 'pointer',
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'space-between',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span>{opt}</span>
                        {isSubmitted && optIdx === q.correctIndex && <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />}
                        {isSubmitted && selectedOpt === optIdx && selectedOpt !== q.correctIndex && <XCircle size={18} style={{ color: 'var(--accent-rose)' }} />}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Snippet post submit */}
                {isSubmitted && (
                  <div style={{ marginTop: '14px', padding: '12px', background: 'var(--glass-hover)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    💡 <strong>Document Grounding Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit / Score Footer */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {!isSubmitted ? (
            <button onClick={handleSubmitQuiz} className="gradient-btn" style={{ padding: '12px 24px' }}>
              Submit Answers for Verification
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 800, color: score >= 70 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                <Trophy size={24} /> Final Score: {score}%
              </div>
              <button onClick={() => { setIsSubmitted(false); setUserAnswers({}); }} className="btn-secondary">
                Retake Quiz
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
