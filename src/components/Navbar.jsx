import React from 'react';
import { useApp } from '../services/appState';
import { Brain, Moon, Sun, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

export function Navbar() {
  const { currentPage, setCurrentPage, theme, toggleTheme } = useApp();

  const isPublicPage = ['landing', 'features', 'about', 'pricing', 'contact', 'login', 'register', 'forgot-password'].includes(currentPage);
  if (!isPublicPage) return null;

  return (
    <header className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 100, borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '14px 28px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentPage('landing')} 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{ background: 'var(--gradient-primary)', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)' }}>
            <Brain style={{ color: '#fff', width: '24px', height: '24px' }} />
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }} className="gradient-text">
              LearnGen AI
            </span>
            <span className="badge badge-teal" style={{ marginLeft: '8px', fontSize: '0.65rem' }}>RAG 2.0</span>
          </div>
        </div>

        {/* Public Nav Links */}
        <nav style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          <button 
            onClick={() => setCurrentPage('landing')} 
            style={{ background: 'none', border: 'none', color: currentPage === 'landing' ? 'var(--accent-cyan)' : 'var(--text-muted)', fontWeight: 500, cursor: 'pointer' }}
          >
            Home
          </button>
          <button 
            onClick={() => setCurrentPage('features')} 
            style={{ background: 'none', border: 'none', color: currentPage === 'features' ? 'var(--accent-cyan)' : 'var(--text-muted)', fontWeight: 500, cursor: 'pointer' }}
          >
            Features
          </button>
          <button 
            onClick={() => setCurrentPage('about')} 
            style={{ background: 'none', border: 'none', color: currentPage === 'about' ? 'var(--accent-cyan)' : 'var(--text-muted)', fontWeight: 500, cursor: 'pointer' }}
          >
            Architecture
          </button>
          <button 
            onClick={() => setCurrentPage('pricing')} 
            style={{ background: 'none', border: 'none', color: currentPage === 'pricing' ? 'var(--accent-cyan)' : 'var(--text-muted)', fontWeight: 500, cursor: 'pointer' }}
          >
            Pricing
          </button>
          <button 
            onClick={() => setCurrentPage('contact')} 
            style={{ background: 'none', border: 'none', color: currentPage === 'contact' ? 'var(--accent-cyan)' : 'var(--text-muted)', fontWeight: 500, cursor: 'pointer' }}
          >
            Contact
          </button>
        </nav>

        {/* Right Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button 
            onClick={toggleTheme} 
            className="btn-secondary" 
            title="Toggle Light/Dark Theme"
            style={{ padding: '8px 12px' }}
          >
            {theme === 'dark' ? <Sun size={18} style={{ color: 'var(--accent-amber)' }} /> : <Moon size={18} style={{ color: 'var(--accent-blue)' }} />}
          </button>

          <button 
            onClick={() => setCurrentPage('login')} 
            className="btn-secondary"
          >
            Sign In
          </button>

          <button 
            onClick={() => setCurrentPage('dashboard')} 
            className="gradient-btn"
          >
            <Sparkles size={16} /> Open Workspace <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
