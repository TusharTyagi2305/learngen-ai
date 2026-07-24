import React from 'react';
import { useApp } from '../services/appState';
import { 
  Sparkles, ArrowRight, Brain, ShieldCheck, Database, Layers, 
  BookOpen, HelpCircle, CheckCircle2, Zap, Star, Lock
} from 'lucide-react';

export function LandingPage() {
  const { setCurrentPage } = useApp();

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Refined Sapphire & Teal Glowing Orbs (No Purple) */}
      <div className="glow-background" style={{ top: '-100px', left: '20%', width: '500px', height: '500px', background: 'var(--accent-blue)' }} />
      <div className="glow-background" style={{ top: '400px', right: '10%', width: '400px', height: '400px', background: 'var(--accent-teal)' }} />

      {/* HERO SECTION */}
      <section style={{ padding: '90px 24px 70px', textAlign: 'center', maxWidth: '1020px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div className="badge badge-teal animate-float" style={{ marginBottom: '22px', padding: '6px 16px', fontSize: '0.82rem' }}>
          <Sparkles size={14} /> Handcrafted RAG Studio for Students & Researchers
        </div>
        
        <h1 style={{ fontSize: '3.8rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '24px' }}>
          Master Complex Subjects Directly From <br />
          <span className="gradient-text">Your Own Notes & Research Papers</span>
        </h1>
        
        <p style={{ fontSize: '1.22rem', color: 'var(--text-muted)', maxWidth: '780px', margin: '0 auto 38px', lineHeight: 1.6 }}>
          LearnGen AI transforms PDFs, DOCX, and PPTX lectures into grounded AI study tutors, interactive 3D flashcards, dynamic MCQ quizzes, and adaptive learning roadmaps.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center' }}>
          <button onClick={() => setCurrentPage('dashboard')} className="gradient-btn" style={{ padding: '14px 30px', fontSize: '1.05rem', borderRadius: 'var(--radius-md)' }}>
            <Sparkles size={20} /> Open Workspace Free <ArrowRight size={20} />
          </button>
          <button onClick={() => setCurrentPage('features')} className="btn-secondary" style={{ padding: '14px 26px', fontSize: '1rem', borderRadius: 'var(--radius-md)' }}>
            Explore RAG Architecture
          </button>
        </div>

        {/* Hero Demo Glass Mockup */}
        <div className="glass-panel animate-fade-in" style={{ marginTop: '54px', padding: '18px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', textAlign: 'left', borderColor: 'rgba(37, 99, 235, 0.25)' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginLeft: '12px' }}>LearnGen AI RAG Studio — Document Grounded Context</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '16px', background: 'var(--bg-primary)', padding: '20px', borderRadius: 'var(--radius-md)' }}>
            {/* Left Doc Sidebar */}
            <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '8px', textTransform: 'uppercase' }}>Indexed Document Vault</div>
              <div style={{ padding: '8px 10px', background: 'var(--glass-hover)', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '6px', borderLeft: '3px solid var(--accent-cyan)' }}>
                📄 Quantum_Computing_Ch3.pdf
              </div>
              <div style={{ padding: '8px 10px', background: 'transparent', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                📄 Deep_Learning_Summary.docx
              </div>
            </div>

            {/* Right Chat Demo */}
            <div>
              <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>USER:</span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>What is the mathematical formulation of quantum superposition in qubits?</p>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-blue)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', fontWeight: 700 }}>AI TUTOR (GROUNDED):</span>
                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>✓ 99.8% Grounded</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  Based on <strong>Quantum_Computing_Ch3.pdf (Pg 12)</strong>, quantum superposition states that a qubit exists in a state |Ψ⟩ = α|0⟩ + β|1⟩ where |α|² + |β|² = 1.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section style={{ padding: '70px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>Built For Serious Academic & Enterprise Learning</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Full retrieval pipeline with zero hallucinations and exact citation tracking.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div className="glass-card" style={{ padding: '30px' }}>
            <div style={{ background: 'rgba(6, 182, 212, 0.15)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)', marginBottom: '18px' }}>
              <Database size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>ChromaDB Vector Retrieval</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Automatic 512-token dynamic chunking with 50-token overlap, embedded into 1536-dimensional space for instant top-K similarity search.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '30px' }}>
            <div style={{ background: 'rgba(13, 148, 136, 0.15)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-teal)', marginBottom: '18px' }}>
              <Layers size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Interactive 3D Flashcards</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Auto-generate study decks directly from uploaded lecture slides and research papers with spaced repetition tracking.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '30px' }}>
            <div style={{ background: 'rgba(37, 99, 235, 0.15)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)', marginBottom: '18px' }}>
              <HelpCircle size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Dynamic AI Quiz Engine</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Test your mastery with MCQ & short answer quizzes generated from document text, complete with step-by-step page citations.
            </p>
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section style={{ padding: '50px 24px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', textAlign: 'center' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>100K+</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Target Architecture Capacity</div>
          </div>
          <div>
            <div style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--accent-blue)' }}>&lt;40ms</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Vector Search Latency</div>
          </div>
          <div>
            <div style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>99.8%</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Context Citation Accuracy</div>
          </div>
          <div>
            <div style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--accent-amber)' }}>20+</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Production SaaS Modules</div>
          </div>
        </div>
      </section>
    </div>
  );
}
