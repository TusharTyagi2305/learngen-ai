import React, { useState } from 'react';
import { useApp } from '../services/appState';
import { mockRAG } from '../services/mockRAG';
import { 
  RotateCw, Layers, CheckCircle, ThumbsUp, ThumbsDown, Flame, Sparkles 
} from 'lucide-react';

export function FlashcardsPage() {
  const { showToast } = useApp();
  const [deck, setDeck] = useState(mockRAG.flashcards);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [streak, setStreak] = useState(5);

  const activeCard = deck[currentCardIdx];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRating = (rating) => {
    setIsFlipped(false);
    if (currentCardIdx < deck.length - 1) {
      setCurrentCardIdx(currentCardIdx + 1);
    } else {
      setCurrentCardIdx(0);
      setStreak(streak + 1);
      showToast('Deck completed! Mastery level increased! 🔥', 'success');
    }
  };

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-cyan"><Layers size={14} /> Spaced Repetition 3D Deck</span>
            <span className="badge badge-amber"><Flame size={14} /> {streak} Day Streak!</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>3D Interactive Flashcards</h1>
          <p style={{ color: 'var(--text-muted)' }}>Grounded Q&A cards synthesized directly from your document vault.</p>
        </div>
      </div>

      {/* 3D Animated Flip Card Stage */}
      <div style={{ perspective: '1000px', margin: '0 auto 36px', maxWidth: '640px' }}>
        <div 
          onClick={handleFlip}
          className="glass-panel"
          style={{
            minHeight: '340px',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            cursor: 'pointer',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            borderColor: isFlipped ? 'var(--accent-teal)' : 'var(--accent-blue)',
            background: 'var(--bg-secondary)',
            textAlign: 'center',
            position: 'relative'
          }}
        >
          {/* Card Top Metadata */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            <span>Card {currentCardIdx + 1} of {deck.length}</span>
            <span className="badge badge-blue">Source: {activeCard.doc}</span>
          </div>

          {/* Card Content (Front vs Back) */}
          <div style={{ margin: '30px 0' }}>
            {!isFlipped ? (
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '12px' }}>
                  QUESTION (Click to Flip 🔄)
                </div>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {activeCard.question}
                </h3>
              </div>
            ) : (
              <div style={{ transform: 'rotateY(180deg)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-teal)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '12px' }}>
                  GROUNDED ANSWER
                </div>
                <p style={{ fontSize: '1.15rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                  {activeCard.answer}
                </p>
              </div>
            )}
          </div>

          {/* Card Footer Hint */}
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <RotateCw size={14} /> Click card to flip answer
          </div>
        </div>
      </div>

      {/* Spaced Repetition Rating Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <button 
          onClick={() => handleRating('hard')}
          className="btn-secondary"
          style={{ borderColor: 'rgba(244, 63, 94, 0.3)', color: '#fb7185', padding: '12px 24px' }}
        >
          <ThumbsDown size={16} /> Hard (Review Soon)
        </button>

        <button 
          onClick={() => handleRating('good')}
          className="gradient-btn"
          style={{ padding: '12px 28px' }}
        >
          <ThumbsUp size={16} /> Easy (Mastered)
        </button>
      </div>

    </div>
  );
}
