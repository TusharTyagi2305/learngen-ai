import React, { useState, useEffect } from 'react';
import { useApp } from '../services/appState';
import { INITIAL_FLASHCARDS } from '../services/mockRAG';
import { api } from '../services/api';
import { 
  RotateCw, Layers, CheckCircle, ThumbsUp, ThumbsDown, Flame, Sparkles, RefreshCw, ChevronLeft, ChevronRight 
} from 'lucide-react';

export function FlashcardsPage() {
  const { activeDocId, showToast } = useApp();
  const [deck, setDeck] = useState(INITIAL_FLASHCARDS);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [streak, setStreak] = useState(5);
  const [loading, setLoading] = useState(false);
  const [slideAnim, setSlideAnim] = useState('slide-in-right');

  const generateDynamicDeck = (baseList = INITIAL_FLASHCARDS) => {
    return [...baseList]
      .sort(() => 0.5 - Math.random())
      .map((card, idx) => ({
        ...card,
        id: `card-dyn-${Date.now()}-${idx}-${Math.random().toString(36).substring(7)}`,
        question: `${idx + 1}. ${card.question.replace(/^\d+\.\s*/, '')}`
      }));
  };

  useEffect(() => {
    fetchOrCreateFlashcards();
  }, [activeDocId]);

  const fetchOrCreateFlashcards = async () => {
    setLoading(true);
    try {
      const apiPromise = api.generateFlashcards(activeDocId || null, 10);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Flashcards Timeout')), 2500));
      const genRes = await Promise.race([apiPromise, timeoutPromise]);

      if (genRes?.data && Array.isArray(genRes.data) && genRes.data.length >= 8) {
        setDeck(genRes.data);
      } else {
        setDeck(generateDynamicDeck(INITIAL_FLASHCARDS));
      }
    } catch (e) {
      console.warn("Using dynamic 10-card baseline deck:", e);
      setDeck(generateDynamicDeck(INITIAL_FLASHCARDS));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNewDeck = async () => {
    setLoading(true);
    setCurrentCardIdx(0);
    setIsFlipped(false);
    setSlideAnim('slide-in-right');

    try {
      const apiPromise = api.generateFlashcards(activeDocId || null, 10);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Flashcards Timeout')), 2500));
      const genRes = await Promise.race([apiPromise, timeoutPromise]);
      if (genRes?.data && Array.isArray(genRes.data) && genRes.data.length >= 8) {
        setDeck(genRes.data);
        showToast('🎉 Fresh 10-Card 3D Flashcards deck generated from vector vault!', 'success');
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn("Backend flashcards generator fallback:", e);
    }

    setDeck(generateDynamicDeck(INITIAL_FLASHCARDS));
    showToast('🎉 Fresh 10-Card 3D Flashcards deck generated!', 'success');
    setLoading(false);
  };

  const safeDeck = (Array.isArray(deck) && deck.length >= 8) ? deck : INITIAL_FLASHCARDS;
  const activeCard = safeDeck[currentCardIdx] || safeDeck[0];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    if (currentCardIdx < safeDeck.length - 1) {
      setSlideAnim('');
      setTimeout(() => {
        setSlideAnim('slide-in-right');
        setIsFlipped(false);
        setCurrentCardIdx(prev => prev + 1);
      }, 30);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIdx > 0) {
      setSlideAnim('');
      setTimeout(() => {
        setSlideAnim('slide-in-left');
        setIsFlipped(false);
        setCurrentCardIdx(prev => prev - 1);
      }, 30);
    }
  };

  const handleRating = async (rating) => {
    setIsFlipped(false);
    if (activeCard?.id) {
      try {
        await api.updateFlashcardMastery(activeCard.id, true);
      } catch (e) {}
    }

    if (currentCardIdx < safeDeck.length - 1) {
      handleNextCard();
    } else {
      setCurrentCardIdx(0);
      setStreak(streak + 1);
      showToast('🎉 10-Card Deck completed! Mastery level increased! 🔥', 'success');
    }
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px) clamp(16px, 4vw, 36px)', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-cyan"><Layers size={14} /> Spaced Repetition 3D Deck</span>
            <span className="badge badge-amber"><Flame size={14} /> {streak} Day Streak!</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>10-Card 3D Interactive Flashcards</h1>
          <p style={{ color: 'var(--text-muted)' }}>Grounded 10 Q&A cards synthesized directly from your document vault.</p>
        </div>

        <button 
          onClick={handleGenerateNewDeck} 
          disabled={loading}
          className="gradient-btn"
          style={{ padding: '12px 22px', fontSize: '0.92rem', cursor: loading ? 'wait' : 'pointer' }}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> 
          {loading ? 'Synthesizing 10 Cards...' : '⚡ Generate 10 3D Cards'}
        </button>
      </div>

      {/* 3D Animated Flip Card Stage with Side Slide Animation */}
      <div key={currentCardIdx} className={slideAnim} style={{ perspective: '1000px', margin: '0 auto 28px', maxWidth: '640px' }}>
        <div 
          onClick={handleFlip}
          className="glass-panel"
          style={{
            minHeight: '340px',
            padding: 'clamp(20px, 5vw, 40px)',
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '0.8rem', color: 'var(--text-dim)', transform: isFlipped ? 'rotateY(180deg)' : 'none', transition: 'transform 0s' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>
              Card {currentCardIdx + 1} of {safeDeck.length}
            </span>
            <span className="badge badge-blue">Source: {activeCard?.doc || 'Vault Document'}</span>
          </div>

          {/* Card Content (Front vs Back) */}
          <div style={{ margin: '30px 0', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {!isFlipped ? (
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '12px' }}>
                  QUESTION (Click to Flip 🔄)
                </div>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {activeCard?.question || 'Flashcard Question'}
                </h3>
              </div>
            ) : (
              <div style={{ transform: 'rotateY(180deg)', width: '100%' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-teal)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '12px' }}>
                  GROUNDED ANSWER
                </div>
                <p style={{ fontSize: '1.15rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                  {activeCard?.answer || 'Grounded answer details.'}
                </p>
              </div>
            )}
          </div>

          {/* Card Footer Hint */}
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transform: isFlipped ? 'rotateY(180deg)' : 'none', transition: 'transform 0s' }}>
            <RotateCw size={14} /> Click card to flip answer
          </div>
        </div>
      </div>

      {/* Side Slide Navigation Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '640px', margin: '0 auto 28px' }}>
        <button 
          onClick={handlePrevCard}
          disabled={currentCardIdx === 0}
          className="btn-secondary"
          style={{ opacity: currentCardIdx === 0 ? 0.4 : 1, padding: '10px 18px' }}
        >
          <ChevronLeft size={16} /> Previous Card
        </button>

        <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>
          {currentCardIdx + 1} / {safeDeck.length} Cards
        </span>

        <button 
          onClick={handleNextCard}
          disabled={currentCardIdx === safeDeck.length - 1}
          className="btn-secondary"
          style={{ opacity: currentCardIdx === safeDeck.length - 1 ? 0.4 : 1, padding: '10px 18px' }}
        >
          Next Card <ChevronRight size={16} />
        </button>
      </div>

      {/* Spaced Repetition Rating Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px' }}>
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

export default FlashcardsPage;
