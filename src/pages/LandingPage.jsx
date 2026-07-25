import React, { useState } from 'react';
import { useApp } from '../services/appState';
import { 
  Sparkles, ArrowRight, Brain, ShieldCheck, Database, Layers, 
  BookOpen, HelpCircle, CheckCircle2, Zap, Star, Lock, Send, Mail
} from 'lucide-react';

export function LandingPage() {
  const { setCurrentPage } = useApp();
  const [contactSubmitted, setContactSubmitted] = useState(false);

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* Refined Sapphire & Teal Ambient Background Orbs */}
      <div className="glow-background" style={{ top: '-100px', left: '20%', width: '500px', height: '500px', background: 'var(--accent-blue)' }} />
      <div className="glow-background" style={{ top: '600px', right: '10%', width: '450px', height: '450px', background: 'var(--accent-teal)' }} />
      <div className="glow-background" style={{ top: '1400px', left: '15%', width: '400px', height: '400px', background: 'var(--accent-cyan)' }} />

      {/* ==================== 1. HERO / HOME SECTION ==================== */}
      <section id="home" style={{ padding: '140px 24px 70px', textAlign: 'center', maxWidth: '1020px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
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
          <button 
            onClick={() => document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' })} 
            className="btn-secondary" 
            style={{ padding: '14px 26px', fontSize: '1rem', borderRadius: 'var(--radius-md)' }}
          >
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

      {/* STATS BANNER */}
      <section style={{ padding: '40px 24px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', textAlign: 'center' }}>
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


      {/* ==================== 2. FEATURES SECTION ==================== */}
      <section id="features" style={{ padding: '110px 24px 90px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>Comprehensive Modules</span>
          <h2 style={{ fontSize: '2.6rem', fontWeight: 800, marginBottom: '12px' }}>Complete RAG Platform Capabilities</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Engineered for zero hallucinations and exact context page tracking.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div className="glass-card" style={{ padding: '30px' }}>
            <div style={{ background: 'rgba(6, 182, 212, 0.15)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)', marginBottom: '18px' }}>
              <Database size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>1. Multi-Format Text Extraction</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              PyPDF2, python-docx, and python-pptx extract raw text, preserving tabular data and chapter page boundaries automatically.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '30px' }}>
            <div style={{ background: 'rgba(13, 148, 136, 0.15)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-teal)', marginBottom: '18px' }}>
              <Layers size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>2. Token Chunking & Overlap</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              RecursiveCharacterTextSplitter with 512 token chunk size and 50 token overlap maintains context continuity across boundaries.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '30px' }}>
            <div style={{ background: 'rgba(37, 99, 235, 0.15)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)', marginBottom: '18px' }}>
              <HelpCircle size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>3. Vector DB Indexing</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Persistent ChromaDB collection with HNSW index for ultra-low latency cosine similarity top-K retrieval.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '30px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)', marginBottom: '18px' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>4. Anti-Hallucination Guard</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Prompt template strictly constrains LLM generation to provided document context snippets with page-level citations.
            </p>
          </div>
        </div>
      </section>


      {/* ==================== 3. ARCHITECTURE SECTION ==================== */}
      <section id="architecture" style={{ padding: '110px 24px 90px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <span className="badge badge-teal" style={{ marginBottom: '12px' }}>Software Engineering Blueprint</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>System Architecture & Tech Stack</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Designed according to Senior Software Architect specifications for enterprise scaling.</p>
          </div>

          <div className="glass-panel" style={{ padding: '36px', background: 'var(--bg-primary)' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-main)' }}>Production Technology Blueprint</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '20px' }}>
              <div style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Frontend Layer</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>React 19 + Next.js</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Tailwind CSS, Framer Motion, TypeScript</div>
              </div>

              <div style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Backend Microservice</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>FastAPI Python 3.11</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>SQLAlchemy, Pydantic v2, JWT Auth</div>
              </div>

              <div style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-teal)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Vector DB Engine</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>ChromaDB Persistent Store</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>HNSW index, Cosine distance matching</div>
              </div>

              <div style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>AI Orchestrator</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>LangChain + Gemini API</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Text-embedding-3-small (1536d)</div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ==================== 4. PRICING SECTION ==================== */}
      <section id="pricing" style={{ padding: '110px 24px 90px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="badge badge-amber" style={{ marginBottom: '12px' }}>Transparent Plans</span>
          <h2 style={{ fontSize: '2.6rem', fontWeight: 800, marginBottom: '12px' }}>Simple Academic Pricing</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Choose the plan that fits your study velocity.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Student Plan */}
          <div className="glass-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.4rem' }}>Student Free</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '16px 0' }}>$0 <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>/ mo</span></div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li>✓ Up to 10 Document Uploads</li>
              <li>✓ Basic RAG AI Chat</li>
              <li>✓ 30 Flashcards per deck</li>
              <li>✓ Standard Vector Search Speed</li>
            </ul>
            <button onClick={() => setCurrentPage('dashboard')} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              Get Started Free
            </button>
          </div>

          {/* Pro Scholar Plan */}
          <div className="glass-card" style={{ padding: '32px', borderColor: 'var(--accent-blue)', background: 'rgba(37, 99, 235, 0.08)' }}>
            <span className="badge badge-teal" style={{ marginBottom: '8px' }}>Most Popular</span>
            <h3 style={{ fontSize: '1.4rem' }}>Pro Scholar</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '16px 0', color: 'var(--accent-blue)' }}>$12 <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>/ mo</span></div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
              <li>✓ Unlimited Document Uploads</li>
              <li>✓ High-Density Chunking & RAG</li>
              <li>✓ Unlimited Quizzes & Flashcards</li>
              <li>✓ Research Paper Synthesis</li>
              <li>✓ Priority Vector Latency (&lt;40ms)</li>
            </ul>
            <button onClick={() => setCurrentPage('dashboard')} className="gradient-btn" style={{ width: '100%', justifyContent: 'center' }}>
              Start Pro Free Trial
            </button>
          </div>

          {/* Institution Plan */}
          <div className="glass-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.4rem' }}>Campus / Admin</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '16px 0' }}>Custom</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li>✓ Dedicated ChromaDB Cluster</li>
              <li>✓ Role Based Access Control (RBAC)</li>
              <li>✓ Teacher & Admin Dashboards</li>
              <li>✓ Custom LLM API Integration</li>
            </ul>
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} 
              className="btn-secondary" 
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Contact Enterprise Sales
            </button>
          </div>
        </div>
      </section>


      {/* ==================== 5. CONTACT SECTION ==================== */}
      <section id="contact" style={{ padding: '110px 24px 90px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="glass-panel" style={{ padding: '36px', background: 'var(--bg-primary)' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px' }}>Get in Touch</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Have questions about LearnGen AI's RAG pipeline or enterprise deployment?</p>

            {!contactSubmitted ? (
              <form onSubmit={(e) => { e.preventDefault(); setContactSubmitted(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Your Name</label>
                  <input required type="text" placeholder="Tushar Sharma" className="input-field" />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Email Address</label>
                  <input required type="email" placeholder="tushar@example.com" className="input-field" />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Message</label>
                  <textarea required rows={4} placeholder="Tell us about your inquiry..." className="input-field" style={{ resize: 'vertical' }} />
                </div>
                <button type="submit" className="gradient-btn" style={{ justifyContent: 'center', padding: '12px' }}>
                  <Send size={16} /> Send Message
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--accent-emerald)' }}>
                <CheckCircle2 size={40} style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Message Received!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>Our technical team will respond within 24 hours.</p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
