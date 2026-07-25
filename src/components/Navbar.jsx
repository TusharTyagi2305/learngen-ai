import React, { useState, useEffect } from 'react';
import { useApp } from '../services/appState';
import { Brain, Moon, Sun, ArrowRight, Sparkles } from 'lucide-react';

export function Navbar() {
  const { currentPage, setCurrentPage, theme, toggleTheme } = useApp();
  const [activeSection, setActiveSection] = useState('home');

  const isPublicPage = ['landing', 'features', 'about', 'pricing', 'contact', 'login', 'register', 'forgot-password'].includes(currentPage);
  if (!isPublicPage) return null;

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    if (currentPage !== 'landing') {
      setCurrentPage('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 100, borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '14px 28px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <div 
          onClick={() => scrollToSection('home')} 
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

        {/* Smooth Scroll Navigation Links */}
        <nav style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {[
            { id: 'home', label: 'Home' },
            { id: 'features', label: 'Features' },
            { id: 'architecture', label: 'Architecture' },
            { id: 'pricing', label: 'Pricing' },
            { id: 'contact', label: 'Contact' },
          ].map(nav => (
            <button 
              key={nav.id}
              onClick={() => scrollToSection(nav.id)} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: activeSection === nav.id ? 'var(--accent-cyan)' : 'var(--text-muted)', 
                fontWeight: activeSection === nav.id ? 700 : 500, 
                cursor: 'pointer',
                fontSize: '0.95rem',
                borderBottom: activeSection === nav.id ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                paddingBottom: '2px',
                transition: 'all 0.2s ease'
              }}
            >
              {nav.label}
            </button>
          ))}
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
