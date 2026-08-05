import React, { useState } from 'react';
import { useApp } from '../services/appState';
import { 
  CheckCircle2, Sparkles, Shield, Database, Cpu, Lock, 
  Mail, MessageSquare, Send, Zap, Server, Code
} from 'lucide-react';

export function FeaturesPage() {
  const { setCurrentPage } = useApp();

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="badge badge-teal" style={{ marginBottom: '12px' }}>System Architecture</span>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 800 }}>Complete RAG Platform Capabilities</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Designed according to enterprise Senior Architect specifications.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)', marginBottom: '8px' }}>1. Multi-Format Text Extraction</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>PyPDF2, python-docx, and python-pptx extract raw text, preserving tabular data and chapter page boundaries.</p>
        </div>
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-blue)', marginBottom: '8px' }}>2. Token Chunking & Overlap</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>RecursiveCharacterTextSplitter with 512 token chunk size and 50 token overlap maintains context continuity across boundaries.</p>
        </div>
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-emerald)', marginBottom: '8px' }}>3. Vector DB Indexing</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Persistent ChromaDB collection with HNSW index for ultra-low latency cosine similarity top-K retrieval.</p>
        </div>
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-amber)', marginBottom: '8px' }}>4. Context Injection & Anti-Hallucination</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Prompt template strictly constrains LLM generation to provided document context snippets with page-level citations.</p>
        </div>
      </div>
    </div>
  );
}

export function AboutPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 24px' }}>
      <div className="glass-panel" style={{ padding: '36px', background: 'var(--bg-secondary)' }}>
        <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>System Architecture Document</span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '16px' }}>About LearnGen AI Architecture</h1>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '20px' }}>
          LearnGen AI was designed as a production-grade software architecture for an AI SaaS platform scaling to 100,000+ active student users. Built with Next.js / React 19 frontend, FastAPI Python backend, SQLAlchemy, PostgreSQL for relational metadata, and ChromaDB for vector retrieval.
        </p>

        <h3 style={{ fontSize: '1.3rem', marginTop: '24px', marginBottom: '12px' }}>Technology Stack Blueprint</h3>
        <div className="grid-responsive-2" style={{ gap: '12px' }}>
          <div style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
            <strong style={{ color: 'var(--accent-cyan)' }}>Frontend:</strong> React 19, Next.js, Vanilla/Tailwind CSS
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
            <strong style={{ color: 'var(--accent-blue)' }}>Backend:</strong> FastAPI, Python 3.11, Pydantic v2, SQLAlchemy
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
            <strong style={{ color: 'var(--accent-emerald)' }}>Vector Database:</strong> ChromaDB Persistent Storage
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
            <strong style={{ color: 'var(--accent-amber)' }}>AI Engine:</strong> LangChain, Gemini 1.5 / OpenAI Embeddings
          </div>
        </div>
      </div>
    </div>
  );
}

export function PricingPage() {
  const { setCurrentPage } = useApp();

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '44px' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 800 }}>Simple, Transparent Academic Pricing</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Choose the tier that fits your study or institutional requirements.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
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
            Get Started
          </button>
        </div>

        {/* Pro Scholar Plan */}
        <div className="glass-card" style={{ padding: '32px', borderColor: 'var(--accent-blue)', background: 'rgba(37, 99, 235, 0.06)' }}>
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

        {/* Institution / Campus Plan */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.4rem' }}>Campus / Admin</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '16px 0' }}>Custom</div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <li>✓ Dedicated ChromaDB Cluster</li>
            <li>✓ Role Based Access Control (RBAC)</li>
            <li>✓ Student & Admin Dashboards</li>
            <li>✓ Custom LLM API Integration</li>
          </ul>
          <button onClick={() => setCurrentPage('contact')} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            Contact Enterprise Sales
          </button>
        </div>
      </div>
    </div>
  );
}

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 24px' }}>
      <div className="glass-panel" style={{ padding: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px' }}>Get in Touch</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Have questions about LearnGen AI's RAG pipeline or architecture?</p>

        {!submitted ? (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Name</label>
              <input required type="text" placeholder="Tushar Sharma" className="input-field" />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Email</label>
              <input required type="email" placeholder="tushar@example.com" className="input-field" />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Message</label>
              <textarea required rows={4} placeholder="Tell us about your inquiry..." className="input-field" style={{ resize: 'vertical' }} />
            </div>
            <button type="submit" className="gradient-btn" style={{ justifyContent: 'center' }}>
              <Send size={16} /> Send Message
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--accent-emerald)' }}>
            <CheckCircle2 size={40} style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Message Received!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Our team will respond within 24 hours.</p>
          </div>
        )}
      </div>
    </div>
  );
}
