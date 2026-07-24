import React, { useState } from 'react';
import { useApp } from '../services/appState';
import { Layers, RotateCw, CheckCircle2, ChevronLeft, ChevronRight, Plus, Sparkles } from 'lucide-react';

export function FlashcardsPage() {
  const { flashcards, setFlashcards, addFlashcard, showToast } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');

  const currentCard = flashcards[currentIndex] || flashcards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleCreateCard = (e) => {
    e.preventDefault();
    if (!newQ || !newA) return;
    addFlashcard({
      id: `fc-${Date.now()}`,
      deck: "Custom Vault Deck",
      question: newQ,
      answer: newA,
      difficulty: "Medium",
      mastered: false,
      sourceDoc: "User Notes"
    });
    setNewQ('');
    setNewA('');
    setShowAddModal(false);
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>3D Interactive AI Flashcards</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Spaced repetition study cards auto-generated from your document vault.
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="gradient-btn">
          <Plus size={16} /> Create Flashcard
        </button>
      </div>

      {/* 3D Flippable Card Stage */}
      {currentCard && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className={`flip-card ${isFlipped ? 'flipped' : ''}`}
            style={{ width: '100%', height: '320px', cursor: 'pointer' }}
          >
            <div className="flip-card-inner">
              
              {/* CARD FRONT (QUESTION) */}
              <div className="flip-card-front glass-panel" style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(37, 99, 235, 0.35)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-teal">{currentCard.deck}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Click to flip 🔄</span>
                </div>

                <div style={{ textAlign: 'center', margin: 'auto 0' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>Question</div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {currentCard.question}
                  </h2>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  <span>Source: {currentCard.sourceDoc}</span>
                  <span>Card {currentIndex + 1} of {flashcards.length}</span>
                </div>
              </div>

              {/* CARD BACK (ANSWER) */}
              <div className="flip-card-back glass-panel" style={{ background: 'var(--bg-tertiary)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-emerald">Mastery Answer</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Click to flip back 🔄</span>
                </div>

                <div style={{ textAlign: 'center', margin: 'auto 0' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>RAG Answer</div>
                  <p style={{ fontSize: '1.15rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                    {currentCard.answer}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                  <button onClick={(e) => { e.stopPropagation(); showToast('Marked as Easy', 'success'); handleNext(); }} className="badge badge-emerald" style={{ padding: '6px 14px', cursor: 'pointer' }}>
                    Easy 😊
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); showToast('Marked for Review', 'info'); handleNext(); }} className="badge badge-amber" style={{ padding: '6px 14px', cursor: 'pointer' }}>
                    Medium 🤔
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); showToast('Marked as Hard', 'rose'); handleNext(); }} className="badge badge-rose" style={{ padding: '6px 14px', cursor: 'pointer' }}>
                    Hard 😓
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={handlePrev} className="btn-secondary" style={{ padding: '10px 16px' }}>
              <ChevronLeft size={18} /> Previous
            </button>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {currentIndex + 1} / {flashcards.length}
            </span>
            <button onClick={handleNext} className="btn-secondary" style={{ padding: '10px 16px' }}>
              Next <ChevronRight size={18} />
            </button>
          </div>

        </div>
      )}

      {/* Quick Add Flashcard Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '28px', background: 'var(--bg-secondary)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Create New Flashcard</h3>
            <form onSubmit={handleCreateCard} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Question / Concept</label>
                <input required type="text" placeholder="e.g. What is Layer Normalization?" className="input-field" value={newQ} onChange={(e) => setNewQ(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Detailed Answer</label>
                <textarea required rows={3} placeholder="Enter answer snippet..." className="input-field" value={newA} onChange={(e) => setNewA(e.target.value)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="gradient-btn">Save Card</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
