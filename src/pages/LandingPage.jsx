import React, { useState } from 'react';
import { useApp } from '../services/appState';
import { 
  Sparkles, ArrowRight, Brain, ShieldCheck, Database, Layers, 
  BookOpen, HelpCircle, CheckCircle2, Zap, Star, Lock, Send, Mail,
  ChevronLeft, ChevronRight, Server, Cpu, Code2, Users, DollarSign, Award
} from 'lucide-react';

export function LandingPage() {
  const { setCurrentPage, user, showToast } = useApp();
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleOpenWorkspace = () => {
    if (!user) {
      if (showToast) showToast('🔒 Please Sign Up or Sign In first to access your Workspace.', 'info');
      setCurrentPage('register');
    } else {
      setCurrentPage('dashboard');
    }
  };

  // ==================== 1. FEATURES CAROUSEL STATE ====================
  const [featureIdx, setFeatureIdx] = useState(0);
  const [featureDir, setFeatureDir] = useState('next');

  const featureSlides = [
    {
      id: 1,
      title: "1. Multi-Format Text Extraction",
      badge: "Ingestion Engine",
      icon: Database,
      color: "var(--accent-cyan)",
      bgIcon: "rgba(6, 182, 212, 0.25)",
      description: "PyPDF2, python-docx, and python-pptx extract raw text, preserving tabular data and chapter page boundaries automatically.",
      detail: "Supports PDF, DOCX, PPTX, TXT, research papers, and handwritten notes up to 50MB per file with automatic metadata tagging."
    },
    {
      id: 2,
      title: "2. Token Chunking & Overlap",
      badge: "Semantic Splitter",
      icon: Layers,
      color: "var(--accent-teal)",
      bgIcon: "rgba(20, 184, 166, 0.25)",
      description: "RecursiveCharacterTextSplitter with 512 token chunk size and 50 token overlap maintains context continuity across boundaries.",
      detail: "Ensures sentence integrity and semantic completeness before sending text blocks to dense embedding vector models."
    },
    {
      id: 3,
      title: "3. Vector DB Indexing",
      badge: "ChromaDB Store",
      icon: HelpCircle,
      color: "var(--accent-blue)",
      bgIcon: "rgba(59, 130, 246, 0.25)",
      description: "Persistent ChromaDB collection with HNSW index for ultra-low latency cosine similarity top-K retrieval.",
      detail: "Indexes 1536-dimensional vector embeddings with sub-40ms search response time for rapid AI query grounding."
    },
    {
      id: 4,
      title: "4. Anti-Hallucination Guard",
      badge: "Strict Context Injection",
      icon: ShieldCheck,
      color: "var(--accent-emerald)",
      bgIcon: "rgba(16, 185, 129, 0.25)",
      description: "Prompt template strictly constrains LLM generation to provided document context snippets with page-level citations.",
      detail: "Maintains >99.8% citation accuracy, eliminating ungrounded LLM hallucinations with temperature T=0.2 enforcement."
    }
  ];

  // ==================== 2. ARCHITECTURE CAROUSEL STATE ====================
  const [archIdx, setArchIdx] = useState(0);
  const [archDir, setArchDir] = useState('next');

  const archSlides = [
    {
      id: 1,
      title: "Frontend Application Layer",
      badge: "UI / UX Infrastructure",
      icon: Code2,
      color: "var(--accent-cyan)",
      bgIcon: "rgba(6, 182, 212, 0.25)",
      subtitle: "React 19 + Next.js App Router",
      tech: ["React 19", "Next.js", "Tailwind CSS", "Framer Motion", "TypeScript"],
      description: "Responsive SPA web application with server-side rendering, smooth glassmorphism design, interactive 3D canvas backgrounds, and sub-second page transitions."
    },
    {
      id: 2,
      title: "Backend Microservices API",
      badge: "RESTful Async Backend",
      icon: Server,
      color: "var(--accent-blue)",
      bgIcon: "rgba(59, 130, 246, 0.25)",
      subtitle: "FastAPI Python 3.11 API",
      tech: ["FastAPI", "Python 3.11", "SQLAlchemy", "Pydantic v2", "PyJWT"],
      description: "Asynchronous high-concurrency API server handling file parsing, user document vault management, JWT authentication, and background worker queues."
    },
    {
      id: 3,
      title: "Vector Database Storage Engine",
      badge: "Dense Vector Vault",
      icon: Database,
      color: "var(--accent-teal)",
      bgIcon: "rgba(20, 184, 166, 0.25)",
      subtitle: "ChromaDB Persistent Store",
      tech: ["ChromaDB", "HNSW Index", "Cosine Distance", "1536 Dimensions"],
      description: "Scalable vector index running Hierarchical Navigable Small World graphs for ultra-fast top-K nearest neighbor search with sub-40ms response times."
    },
    {
      id: 4,
      title: "AI Orchestration & LLM Engine",
      badge: "RAG Pipeline Core",
      icon: Cpu,
      color: "var(--accent-emerald)",
      bgIcon: "rgba(16, 185, 129, 0.25)",
      subtitle: "LangChain + Gemini API",
      tech: ["LangChain", "Gemini 1.5 Pro", "text-embedding-3", "Citation Extractor"],
      description: "Context injection engine enforcing temperature control T=0.2, citation bounding, flashcard synthesis, and dynamic MCQ quiz generation."
    }
  ];

  // ==================== 3. PRICING CAROUSEL STATE ====================
  const [pricingIdx, setPricingIdx] = useState(0);
  const [pricingDir, setPricingDir] = useState('next');

  const pricingSlides = [
    {
      id: 1,
      title: "Student Free",
      price: "$0",
      period: "/ month",
      badge: "Starter Academic",
      icon: Zap,
      color: "var(--accent-cyan)",
      bgIcon: "rgba(6, 182, 212, 0.25)",
      features: [
        "Up to 10 Document Uploads",
        "Basic RAG AI Grounded Chat",
        "30 Interactive 3D Flashcards per deck",
        "Standard Vector Search Speed",
        "Community Support Access"
      ],
      btnText: "Get Started Free",
      isPopular: false
    },
    {
      id: 2,
      title: "Pro Scholar",
      price: "$12",
      period: "/ month",
      badge: "★ Most Popular",
      icon: Star,
      color: "var(--accent-blue)",
      bgIcon: "rgba(59, 130, 246, 0.3)",
      features: [
        "Unlimited Document Uploads (PDF/DOCX/PPTX)",
        "High-Density Token Chunking & RAG",
        "Unlimited MCQ Quizzes & 3D Flashcards",
        "Deep Research Paper Synthesis",
        "Priority Vector Search Latency (<40ms)",
        "Export Notes & Quiz Analytics"
      ],
      btnText: "Start Pro Free Trial",
      isPopular: true
    },
    {
      id: 3,
      title: "Campus / Admin",
      price: "Custom",
      period: "institutional rate",
      badge: "Enterprise & Campus",
      icon: Users,
      color: "var(--accent-amber)",
      bgIcon: "rgba(245, 158, 11, 0.25)",
      features: [
        "Dedicated Multi-Tenant ChromaDB Cluster",
        "Role-Based Access Control (RBAC)",
        "Student & Admin Analytics Workbench",
        "Custom LLM API Key Integration",
        "SLA 99.9% Uptime Guarantee",
        "Dedicated Technical Architect Support"
      ],
      btnText: "Contact Enterprise Sales",
      isPopular: false
    }
  ];

  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: 'transparent' }}>
      
      {/* ==================== 1. HERO / HOME SECTION ==================== */}
      <section id="home" style={{ padding: 'clamp(80px, 15vw, 140px) 24px clamp(40px, 10vw, 70px)', textAlign: 'center', maxWidth: '1020px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div className="badge badge-teal animate-float" style={{ marginBottom: '22px', padding: '6px 16px', fontSize: '0.82rem' }}>
          <Sparkles size={14} /> Handcrafted 3D RAG Studio for Students & Researchers
        </div>
        
        <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.8rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '24px' }}>
          Master Complex Subjects Directly From <br />
          <span className="gradient-text">Your Own Notes & Research Papers</span>
        </h1>
        
        <p style={{ fontSize: '1.22rem', color: 'var(--text-muted)', maxWidth: '780px', margin: '0 auto 38px', lineHeight: 1.6, textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>
          LearnGen AI transforms PDFs, DOCX, and PPTX lectures into grounded AI study tutors, interactive 3D flashcards, dynamic MCQ quizzes, and adaptive learning roadmaps.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleOpenWorkspace} className="gradient-btn" style={{ padding: '14px 30px', fontSize: '1.05rem', borderRadius: 'var(--radius-md)' }}>
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
        <div className="glass-panel animate-fade-in" style={{ marginTop: '54px', padding: '18px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', textAlign: 'left', borderColor: 'rgba(59, 130, 246, 0.35)', background: 'rgba(15, 23, 42, 0.45)' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginLeft: '12px' }}>LearnGen AI RAG Studio — Document Grounded Context</span>
          </div>

          <div className="grid-responsive-chat" style={{ background: 'rgba(11, 15, 23, 0.55)', padding: '20px', borderRadius: 'var(--radius-md)' }}>
            {/* Left Doc Sidebar */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '8px', textTransform: 'uppercase' }}>Indexed Document Vault</div>
              <div style={{ padding: '8px 10px', background: 'rgba(6, 182, 212, 0.15)', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '6px', borderLeft: '3px solid var(--accent-cyan)' }}>
                📄 Quantum_Computing_Ch3.pdf
              </div>
              <div style={{ padding: '8px 10px', background: 'transparent', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                📄 Deep_Learning_Summary.docx
              </div>
            </div>

            {/* Right Chat Demo */}
            <div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>USER:</span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>What is the mathematical formulation of quantum superposition in qubits?</p>
              </div>
              <div style={{ background: 'rgba(30, 41, 59, 0.7)', padding: '14px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-blue)' }}>
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
      <section style={{ padding: '40px 24px', background: 'rgba(15, 23, 42, 0.35)', backdropFilter: 'blur(10px)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', textAlign: 'center' }}>
        <div className="grid-responsive-4" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div>
            <div style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--accent-cyan)', textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>100K+</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Target Architecture Capacity</div>
          </div>
          <div>
            <div style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--accent-blue)', textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>&lt;40ms</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Vector Search Latency</div>
          </div>
          <div>
            <div style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--accent-emerald)', textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>99.8%</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Context Citation Accuracy</div>
          </div>
          <div>
            <div style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--accent-amber)', textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>20+</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Production SaaS Modules</div>
          </div>
        </div>
      </section>


      {/* ==================== 2. FEATURES SECTION (3D BOOK PAGE FLIP CAROUSEL) ==================== */}
      <section id="features" style={{ padding: 'clamp(60px, 10vw, 110px) 24px clamp(50px, 8vw, 90px)', maxWidth: '1280px', margin: '0 auto', background: 'transparent' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <span className="badge badge-teal" style={{ marginBottom: '12px' }}>3D Page Flip Module Deck</span>
          <h2 style={{ fontSize: '2.6rem', fontWeight: 800, marginBottom: '12px' }}>Complete RAG Platform Capabilities</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Click side pages to flip through features like a 3D book.</p>
        </div>

        {/* 3D BOOK PAGE FLIP STAGE */}
        {(() => {
          const pIdx = (featureIdx - 1 + featureSlides.length) % featureSlides.length;
          const cIdx = featureIdx;
          const nIdx = (featureIdx + 1) % featureSlides.length;

          const pSlide = featureSlides[pIdx];
          const cSlide = featureSlides[cIdx];
          const nSlide = featureSlides[nIdx];

          const PIcon = pSlide.icon;
          const CIcon = cSlide.icon;
          const NIcon = nSlide.icon;

          return (
            <div style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '100%', perspective: '1200px', position: 'relative', padding: '10px 0' }}>
                
                {/* PREV ATTACHED PAGE */}
                <div 
                  onClick={() => { setFeatureDir('prev'); setFeatureIdx(pIdx); }}
                  className="glass-card desktop-only-block" 
                  style={{
                    flex: '0 0 320px', padding: '28px 24px', background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(12px)',
                    borderColor: 'rgba(255, 255, 255, 0.2)', opacity: 0.78,
                    transform: 'perspective(1000px) rotateY(22deg) scale(0.92)', transformOrigin: 'right center',
                    marginRight: '-45px', zIndex: 5, cursor: 'pointer', boxShadow: '-15px 15px 35px rgba(0, 0, 0, 0.6)',
                    transition: 'all 0.65s cubic-bezier(0.25, 1, 0.5, 1)', userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ background: pSlide.bgIcon, padding: '10px', borderRadius: '10px', color: pSlide.color }}>
                      <PIcon size={22} />
                    </div>
                    <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>◄ PREV PAGE</span>
                  </div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>{pSlide.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{pSlide.description}</p>
                </div>

                {/* CURRENT SPOTLIGHT PAGE */}
                <div 
                  key={`feat-${cSlide.id}-${featureDir}`}
                  className={`glass-card ${featureDir === 'next' ? 'animate-slide-next' : 'animate-slide-prev'}`}
                  style={{
                    flex: '1 1 100%', width: '100%', maxWidth: '660px', minWidth: 0, padding: '28px 20px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(24px)',
                    borderColor: cSlide.color, boxShadow: `0 25px 60px -10px ${cSlide.bgIcon}`,
                    transform: 'none', zIndex: 20, boxSizing: 'border-box'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ background: cSlide.bgIcon, padding: '14px', borderRadius: '14px', color: cSlide.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CIcon size={32} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="badge badge-teal" style={{ padding: '5px 12px', fontSize: '0.78rem' }}>{cSlide.badge}</span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 600 }}>Page {cIdx + 1} of {featureSlides.length}</span>
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '14px', color: '#ffffff' }}>{cSlide.title}</h3>
                  <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '20px' }}>{cSlide.description}</p>
                  <div style={{ padding: '14px 18px', background: 'rgba(30, 41, 59, 0.75)', borderRadius: 'var(--radius-sm)', borderLeft: `4px solid ${cSlide.color}`, fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    ⚡ <strong>Architect Spec:</strong> {cSlide.detail}
                  </div>
                </div>

                {/* NEXT ATTACHED PAGE */}
                <div 
                  onClick={() => { setFeatureDir('next'); setFeatureIdx(nIdx); }}
                  className="glass-card desktop-only-block" 
                  style={{
                    flex: '0 0 320px', padding: '28px 24px', background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(12px)',
                    borderColor: 'rgba(255, 255, 255, 0.2)', opacity: 0.78,
                    transform: 'perspective(1000px) rotateY(-22deg) scale(0.92)', transformOrigin: 'left center',
                    marginLeft: '-45px', zIndex: 5, cursor: 'pointer', boxShadow: '15px 15px 35px rgba(0, 0, 0, 0.6)',
                    transition: 'all 0.65s cubic-bezier(0.25, 1, 0.5, 1)', userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>NEXT PAGE ►</span>
                    <div style={{ background: nSlide.bgIcon, padding: '10px', borderRadius: '10px', color: nSlide.color }}>
                      <NIcon size={22} />
                    </div>
                  </div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>{nSlide.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{nSlide.description}</p>
                </div>

              </div>

              {/* CONTROLS */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '36px' }}>
                <button onClick={() => { setFeatureDir('prev'); setFeatureIdx(pIdx); }} className="btn-secondary" style={{ padding: '9px 18px', fontSize: '0.88rem' }}>
                  <ChevronLeft size={16} /> Flip Left Page
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {featureSlides.map((_, idx) => (
                    <button key={idx} onClick={() => { setFeatureDir(idx > featureIdx ? 'next' : 'prev'); setFeatureIdx(idx); }} style={{ width: featureIdx === idx ? '32px' : '10px', height: '10px', borderRadius: '999px', border: 'none', background: featureIdx === idx ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.25)', cursor: 'pointer', transition: 'all 0.3s ease' }} />
                  ))}
                </div>
                <button onClick={() => { setFeatureDir('next'); setFeatureIdx(nIdx); }} className="btn-secondary" style={{ padding: '9px 18px', fontSize: '0.88rem' }}>
                  Flip Right Page <ChevronRight size={16} />
                </button>
              </div>
            </div>
          );
        })()}
      </section>


      {/* ==================== 3. ARCHITECTURE SECTION (3D BOOK PAGE FLIP CAROUSEL) ==================== */}
      <section id="architecture" style={{ padding: 'clamp(60px, 10vw, 110px) 24px clamp(50px, 8vw, 90px)', maxWidth: '1280px', margin: '0 auto', background: 'transparent' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <span className="badge badge-teal" style={{ marginBottom: '12px' }}>Software Engineering Blueprint Deck</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>System Architecture & Tech Stack</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Designed according to Senior Software Architect specifications for enterprise scaling.</p>
        </div>

        {/* 3D ARCHITECTURE PAGE FLIP STAGE */}
        {(() => {
          const pIdx = (archIdx - 1 + archSlides.length) % archSlides.length;
          const cIdx = archIdx;
          const nIdx = (archIdx + 1) % archSlides.length;

          const pSlide = archSlides[pIdx];
          const cSlide = archSlides[cIdx];
          const nSlide = archSlides[nIdx];

          const PIcon = pSlide.icon;
          const CIcon = cSlide.icon;
          const NIcon = nSlide.icon;

          return (
            <div style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '100%', perspective: '1200px', position: 'relative', padding: '10px 0' }}>
                
                {/* PREV ATTACHED PAGE */}
                <div 
                  onClick={() => { setArchDir('prev'); setArchIdx(pIdx); }}
                  className="glass-card desktop-only-block" 
                  style={{
                    flex: '0 0 320px', padding: '28px 24px', background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(12px)',
                    borderColor: 'rgba(255, 255, 255, 0.2)', opacity: 0.78,
                    transform: 'perspective(1000px) rotateY(22deg) scale(0.92)', transformOrigin: 'right center',
                    marginRight: '-45px', zIndex: 5, cursor: 'pointer', boxShadow: '-15px 15px 35px rgba(0, 0, 0, 0.6)',
                    transition: 'all 0.65s cubic-bezier(0.25, 1, 0.5, 1)', userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ background: pSlide.bgIcon, padding: '10px', borderRadius: '10px', color: pSlide.color }}>
                      <PIcon size={22} />
                    </div>
                    <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>◄ PREV ARCH</span>
                  </div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>{pSlide.title}</h4>
                  <div style={{ fontSize: '0.78rem', color: pSlide.color, fontWeight: 600, marginBottom: '8px' }}>{pSlide.subtitle}</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{pSlide.description}</p>
                </div>

                {/* CURRENT SPOTLIGHT ARCH PAGE */}
                <div 
                  key={`arch-${cSlide.id}-${archDir}`}
                  className={`glass-card ${archDir === 'next' ? 'animate-slide-next' : 'animate-slide-prev'}`}
                  style={{
                    flex: '1 1 100%', width: '100%', maxWidth: '660px', minWidth: 0, padding: '28px 20px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(24px)',
                    borderColor: cSlide.color, boxShadow: `0 25px 60px -10px ${cSlide.bgIcon}`,
                    transform: 'none', zIndex: 20, boxSizing: 'border-box'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ background: cSlide.bgIcon, padding: '14px', borderRadius: '14px', color: cSlide.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CIcon size={32} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="badge badge-teal" style={{ padding: '5px 12px', fontSize: '0.78rem' }}>{cSlide.badge}</span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 600 }}>Layer {cIdx + 1} of {archSlides.length}</span>
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '4px', color: '#ffffff' }}>{cSlide.title}</h3>
                  <div style={{ fontSize: '0.95rem', color: cSlide.color, fontWeight: 700, marginBottom: '14px' }}>{cSlide.subtitle}</div>
                  
                  <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '20px' }}>{cSlide.description}</p>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {cSlide.tech.map((t, idx) => (
                      <span key={idx} style={{ padding: '6px 12px', background: 'rgba(30, 41, 59, 0.75)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', border: '1px solid var(--glass-border)' }}>
                        ⚡ {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* NEXT ATTACHED PAGE */}
                <div 
                  onClick={() => { setArchDir('next'); setArchIdx(nIdx); }}
                  className="glass-card desktop-only-block" 
                  style={{
                    flex: '0 0 320px', padding: '28px 24px', background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(12px)',
                    borderColor: 'rgba(255, 255, 255, 0.2)', opacity: 0.78,
                    transform: 'perspective(1000px) rotateY(-22deg) scale(0.92)', transformOrigin: 'left center',
                    marginLeft: '-45px', zIndex: 5, cursor: 'pointer', boxShadow: '15px 15px 35px rgba(0, 0, 0, 0.6)',
                    transition: 'all 0.65s cubic-bezier(0.25, 1, 0.5, 1)', userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>NEXT ARCH ►</span>
                    <div style={{ background: nSlide.bgIcon, padding: '10px', borderRadius: '10px', color: nSlide.color }}>
                      <NIcon size={22} />
                    </div>
                  </div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>{nSlide.title}</h4>
                  <div style={{ fontSize: '0.78rem', color: nSlide.color, fontWeight: 600, marginBottom: '8px' }}>{nSlide.subtitle}</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{nSlide.description}</p>
                </div>

              </div>

              {/* ARCH CONTROLS */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '36px' }}>
                <button onClick={() => { setArchDir('prev'); setArchIdx(pIdx); }} className="btn-secondary" style={{ padding: '9px 18px', fontSize: '0.88rem' }}>
                  <ChevronLeft size={16} /> Flip Left Layer
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {archSlides.map((_, idx) => (
                    <button key={idx} onClick={() => { setArchDir(idx > archIdx ? 'next' : 'prev'); setArchIdx(idx); }} style={{ width: archIdx === idx ? '32px' : '10px', height: '10px', borderRadius: '999px', border: 'none', background: archIdx === idx ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.25)', cursor: 'pointer', transition: 'all 0.3s ease' }} />
                  ))}
                </div>
                <button onClick={() => { setArchDir('next'); setArchIdx(nIdx); }} className="btn-secondary" style={{ padding: '9px 18px', fontSize: '0.88rem' }}>
                  Flip Right Layer <ChevronRight size={16} />
                </button>
              </div>
            </div>
          );
        })()}
      </section>


      {/* ==================== 4. PRICING SECTION (3D BOOK PAGE FLIP CAROUSEL) ==================== */}
      <section id="pricing" style={{ padding: 'clamp(60px, 10vw, 110px) 24px clamp(50px, 8vw, 90px)', maxWidth: '1280px', margin: '0 auto', background: 'transparent' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <span className="badge badge-amber" style={{ marginBottom: '12px' }}>3D Academic Plans Deck</span>
          <h2 style={{ fontSize: '2.6rem', fontWeight: 800, marginBottom: '12px' }}>Simple Academic Pricing</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Flip through plans to choose the right fit for your study velocity.</p>
        </div>

        {/* 3D PRICING PAGE FLIP STAGE */}
        {(() => {
          const pIdx = (pricingIdx - 1 + pricingSlides.length) % pricingSlides.length;
          const cIdx = pricingIdx;
          const nIdx = (pricingIdx + 1) % pricingSlides.length;

          const pSlide = pricingSlides[pIdx];
          const cSlide = pricingSlides[cIdx];
          const nSlide = pricingSlides[nIdx];

          const PIcon = pSlide.icon;
          const CIcon = cSlide.icon;
          const NIcon = nSlide.icon;

          return (
            <div style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '100%', perspective: '1200px', position: 'relative', padding: '20px 0' }}>
                
                {/* PREV ATTACHED PLAN */}
                <div 
                  onClick={() => { setPricingDir('prev'); setPricingIdx(pIdx); }}
                  className="glass-card desktop-only-block" 
                  style={{
                    flex: '0 0 320px', padding: '28px 24px', background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(12px)',
                    borderColor: 'rgba(255, 255, 255, 0.2)', opacity: 0.78,
                    transform: 'perspective(1000px) rotateY(22deg) scale(0.92)', transformOrigin: 'right center',
                    marginRight: '-45px', zIndex: 5, cursor: 'pointer', boxShadow: '-15px 15px 35px rgba(0, 0, 0, 0.6)',
                    transition: 'all 0.65s cubic-bezier(0.25, 1, 0.5, 1)', userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ background: pSlide.bgIcon, padding: '10px', borderRadius: '10px', color: pSlide.color }}>
                      <PIcon size={22} />
                    </div>
                    <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>◄ PREV PLAN</span>
                  </div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>{pSlide.title}</h4>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: pSlide.color, marginBottom: '8px' }}>{pSlide.price}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{pSlide.features[0]}</div>
                </div>

                {/* CURRENT SPOTLIGHT PRICING PLAN */}
                <div 
                  key={`price-${cSlide.id}-${pricingDir}`}
                  className={`glass-card ${pricingDir === 'next' ? 'animate-slide-next' : 'animate-slide-prev'}`}
                  style={{
                    flex: '1 1 100%', width: '100%', maxWidth: '660px', minWidth: 0, padding: '42px', background: 'rgba(15, 23, 42, 0.88)', backdropFilter: 'blur(24px)',
                    borderColor: cSlide.color, boxShadow: `0 25px 60px -10px ${cSlide.bgIcon}`,
                    transform: 'perspective(1000px) rotateY(0deg) scale(1.04)', zIndex: 20, boxSizing: 'border-box'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ background: cSlide.bgIcon, padding: '14px', borderRadius: '14px', color: cSlide.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CIcon size={32} />
                    </div>
                    <span className="badge badge-teal" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>{cSlide.badge}</span>
                  </div>

                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>{cSlide.title}</h3>
                  
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '14px 0 22px' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: cSlide.color }}>{cSlide.price}</span>
                    <span style={{ fontSize: '1.05rem', color: 'var(--text-dim)' }}>{cSlide.period}</span>
                  </div>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px', fontSize: '0.92rem', color: 'var(--text-main)' }}>
                    {cSlide.features.map((feat, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle2 size={18} style={{ color: cSlide.color, flexShrink: 0 }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={handleOpenWorkspace} 
                    className={cSlide.isPopular ? "gradient-btn" : "btn-secondary"} 
                    style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '1rem', borderRadius: 'var(--radius-sm)' }}
                  >
                    {cSlide.btnText}
                  </button>
                </div>

                {/* NEXT ATTACHED PLAN */}
                <div 
                  onClick={() => { setPricingDir('next'); setPricingIdx(nIdx); }}
                  className="glass-card desktop-only-block" 
                  style={{
                    flex: '0 0 320px', padding: '28px 24px', background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(12px)',
                    borderColor: 'rgba(255, 255, 255, 0.2)', opacity: 0.78,
                    transform: 'perspective(1000px) rotateY(-22deg) scale(0.92)', transformOrigin: 'left center',
                    marginLeft: '-45px', zIndex: 5, cursor: 'pointer', boxShadow: '15px 15px 35px rgba(0, 0, 0, 0.6)',
                    transition: 'all 0.65s cubic-bezier(0.25, 1, 0.5, 1)', userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>NEXT PLAN ►</span>
                    <div style={{ background: nSlide.bgIcon, padding: '10px', borderRadius: '10px', color: nSlide.color }}>
                      <NIcon size={22} />
                    </div>
                  </div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>{nSlide.title}</h4>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: nSlide.color, marginBottom: '8px' }}>{nSlide.price}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{nSlide.features[0]}</div>
                </div>

              </div>

              {/* PRICING CONTROLS */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '36px' }}>
                <button onClick={() => { setPricingDir('prev'); setPricingIdx(pIdx); }} className="btn-secondary" style={{ padding: '9px 18px', fontSize: '0.88rem' }}>
                  <ChevronLeft size={16} /> Flip Left Plan
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {pricingSlides.map((_, idx) => (
                    <button key={idx} onClick={() => { setPricingDir(idx > pricingIdx ? 'next' : 'prev'); setPricingIdx(idx); }} style={{ width: pricingIdx === idx ? '32px' : '10px', height: '10px', borderRadius: '999px', border: 'none', background: pricingIdx === idx ? 'var(--accent-amber)' : 'rgba(255, 255, 255, 0.25)', cursor: 'pointer', transition: 'all 0.3s ease' }} />
                  ))}
                </div>
                <button onClick={() => { setPricingDir('next'); setPricingIdx(nIdx); }} className="btn-secondary" style={{ padding: '9px 18px', fontSize: '0.88rem' }}>
                  Flip Right Plan <ChevronRight size={16} />
                </button>
              </div>
            </div>
          );
        })()}
      </section>


      {/* ==================== 5. CONTACT SECTION WITH CRYSTAL CLEAR BACKGROUND ==================== */}
      <section id="contact" style={{ padding: 'clamp(60px, 10vw, 110px) 24px clamp(60px, 12vw, 120px)', background: 'transparent' }}>
        <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <div className="glass-panel" style={{ padding: '36px', background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255, 255, 255, 0.15)' }}>
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
