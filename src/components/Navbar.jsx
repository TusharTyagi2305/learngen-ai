import React, { useState, useEffect } from 'react';
import { useApp } from '../services/appState';
import { Brain, Moon, Sun, ArrowRight, Sparkles, Menu, X } from 'lucide-react';

export function Navbar() {
  const { currentPage, setCurrentPage, theme, toggleTheme, user, showToast, logoutUser } = useApp();
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleOpenWorkspace = () => {
    setIsMobileMenuOpen(false);
    if (!user) {
      if (showToast) showToast('🔒 Please Sign Up or Sign In first to access your Workspace.', 'info');
      setCurrentPage('register');
    } else {
      setCurrentPage('dashboard');
    }
  };

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
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
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
    <header className="navbar-container" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      width: '100%',
      padding: isScrolled ? '12px 28px' : '18px 28px',
      background: theme === 'dark' 
        ? (isScrolled ? 'rgba(11, 15, 23, 0.85)' : 'rgba(11, 15, 23, 0.45)') 
        : (isScrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.5)'),
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        
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

        {/* Desktop Navigation Options */}
        <nav className="desktop-only-flex" style={{ gap: '28px', alignItems: 'center' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={toggleTheme} 
            className="btn-secondary" 
            title="Toggle Light/Dark Theme"
            style={{ padding: '8px 12px', background: 'rgba(255, 255, 255, 0.08)' }}
          >
            {theme === 'dark' ? <Sun size={18} style={{ color: 'var(--accent-amber)' }} /> : <Moon size={18} style={{ color: 'var(--accent-blue)' }} />}
          </button>

          {user ? (
            <>
              <button 
                onClick={() => { setCurrentPage('dashboard'); setIsMobileMenuOpen(false); }} 
                className="btn-secondary desktop-only-flex"
                style={{ background: 'rgba(255, 255, 255, 0.08)' }}
              >
                Dashboard
              </button>
              <button 
                onClick={() => { logoutUser(); setIsMobileMenuOpen(false); }} 
                className="btn-secondary desktop-only-flex"
                style={{ background: 'rgba(244, 63, 94, 0.1)', borderColor: 'rgba(244, 63, 94, 0.3)', color: 'var(--accent-rose)' }}
              >
                Log Out
              </button>
            </>
          ) : (
            <button 
              onClick={() => { setCurrentPage('login'); setIsMobileMenuOpen(false); }} 
              className="btn-secondary desktop-only-flex"
              style={{ background: 'rgba(255, 255, 255, 0.08)' }}
            >
              Sign In
            </button>
          )}

          <button 
            onClick={handleOpenWorkspace} 
            className="gradient-btn desktop-only-flex"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Sparkles size={16} /> Open Workspace <ArrowRight size={16} />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(prev => !prev)} 
            className="btn-secondary mobile-only-flex"
            style={{ padding: '8px' }}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="animate-fade-in" style={{
            width: '100%',
            marginTop: '16px',
            padding: '16px 0 8px',
            borderTop: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {user ? (
              // Authenticated User Mobile Menu
              <>
                {[
                  { id: 'dashboard', label: 'Dashboard' },
                  { id: 'profile', label: 'Profile' },
                  { id: 'settings', label: 'Settings' }
                ].map(nav => (
                  <button 
                    key={nav.id}
                    onClick={() => { setCurrentPage(nav.id); setIsMobileMenuOpen(false); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      color: 'var(--text-main)',
                      fontWeight: 500,
                      fontSize: '1rem',
                      padding: '8px 12px'
                    }}
                  >
                    {nav.label}
                  </button>
                ))}
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--glass-border)' }}>
                  <button 
                    onClick={() => { logoutUser(); setIsMobileMenuOpen(false); }} 
                    className="btn-secondary"
                    style={{ flex: 1, justifyContent: 'center', borderColor: 'rgba(244, 63, 94, 0.3)', color: 'var(--accent-rose)' }}
                  >
                    Log Out
                  </button>
                </div>
              </>
            ) : (
              // Public Mobile Menu
              <>
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
                      textAlign: 'left',
                      color: activeSection === nav.id ? 'var(--accent-cyan)' : 'var(--text-main)',
                      fontWeight: activeSection === nav.id ? 700 : 500,
                      fontSize: '1rem',
                      padding: '8px 12px'
                    }}
                  >
                    {nav.label}
                  </button>
                ))}
    
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--glass-border)' }}>
                  <button 
                    onClick={() => { setCurrentPage('login'); setIsMobileMenuOpen(false); }} 
                    className="btn-secondary"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={handleOpenWorkspace} 
                    className="gradient-btn"
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}
                  >
                    <Sparkles size={16} /> Open Workspace
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
