import React, { useState, useEffect } from 'react';
import { useApp } from '../services/appState';
import { Brain, Moon, Sun, ArrowRight, Sparkles, Volume2, VolumeX } from 'lucide-react';

export function Navbar() {
  const { currentPage, setCurrentPage, theme, toggleTheme, soundEnabled, toggleSound, playSFX } = useApp();
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  const isPublicPage = ['landing', 'features', 'about', 'pricing', 'contact', 'login', 'register', 'forgot-password'].includes(currentPage);
  if (!isPublicPage) return null;

  // Active Section ScrollSpy Listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      const sections = ['home', 'features', 'architecture', 'pricing', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          if (scrollPosition >= section.offsetTop) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    playSFX('click');
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
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      width: '100%',
      padding: isScrolled ? '12px 28px' : '18px 28px',
      background: theme === 'dark' 
        ? (isScrolled ? 'rgba(11, 15, 23, 0.35)' : 'rgba(11, 15, 23, 0.15)') 
        : (isScrolled ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.2)'),
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
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

        {/* Sheer Navigation Options with Active State */}
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
                paddingBottom: '4px',
                transition: 'all 0.2s ease'
              }}
            >
              {nav.label}
            </button>
          ))}
        </nav>

        {/* Right Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Sound FX Toggle Button */}
          <button 
            onClick={toggleSound} 
            className="btn-secondary" 
            title={soundEnabled ? "Mute 3D Sound Effects" : "Enable 3D Sound Effects"}
            style={{ padding: '8px 12px', background: 'rgba(255, 255, 255, 0.08)' }}
          >
            {soundEnabled ? <Volume2 size={18} style={{ color: 'var(--accent-teal)' }} /> : <VolumeX size={18} style={{ color: 'var(--text-dim)' }} />}
          </button>

          {/* Theme Toggle Button */}
          <button 
            onClick={() => { playSFX('click'); toggleTheme(); }} 
            className="btn-secondary" 
            title="Toggle Light/Dark Theme"
            style={{ padding: '8px 12px', background: 'rgba(255, 255, 255, 0.08)' }}
          >
            {theme === 'dark' ? <Sun size={18} style={{ color: 'var(--accent-amber)' }} /> : <Moon size={18} style={{ color: 'var(--accent-blue)' }} />}
          </button>

          <button 
            onClick={() => { playSFX('click'); setCurrentPage('login'); }} 
            className="btn-secondary"
            style={{ background: 'rgba(255, 255, 255, 0.08)' }}
          >
            Sign In
          </button>

          <button 
            onClick={() => { playSFX('click'); setCurrentPage('dashboard'); }} 
            className="gradient-btn"
          >
            <Sparkles size={16} /> Open Workspace <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </header>
  );
}
