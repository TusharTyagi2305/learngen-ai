import React, { useState } from 'react';
import { useApp } from '../services/appState';
import { 
  Search, Bell, Moon, Sun, Upload, Shield, User, ChevronRight, CheckCircle2, Sparkles 
} from 'lucide-react';

export function TopBar() {
  const { 
    currentPage, setCurrentPage, currentRole, theme, toggleTheme, 
    searchQuery, setSearchQuery, notifications, setIsUploadModalOpen 
  } = useApp();
  
  const [showNotifs, setShowNotifs] = useState(false);

  const isDashboardArea = !['landing', 'features', 'about', 'pricing', 'contact', 'login', 'register', 'forgot-password'].includes(currentPage);
  if (!isDashboardArea) return null;

  const pageTitles = {
    'dashboard': 'Dashboard Overview',
    'documents': 'Document Vault & Vectors',
    'ai-chat': 'AI RAG Studio',
    'quiz-generator': 'AI Quiz Generator',
    'flashcards': 'Interactive 3D Flashcards',
    'study-planner': 'AI Study Roadmap Planner',
    'research-assistant': 'Research Paper Assistant',
    'progress-dashboard': 'Analytics & Learning Metrics',
    'profile': 'Account Profile',
    'settings': 'Platform Settings',
    'admin-dashboard': 'Admin System Workbench'
  };

  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <header className="glass-panel" style={{
      borderRadius: 0,
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      padding: '12px 28px',
      display: 'flex',
      alignItems: 'center',
      justify: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 80
    }}>
      {/* Breadcrumbs & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Workspace</span>
        <ChevronRight size={14} style={{ color: 'var(--text-dim)' }} />
        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
          {pageTitles[currentPage] || 'LearnGen AI'}
        </span>
      </div>

      {/* Global Search Bar */}
      <div style={{ position: 'relative', width: '380px' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
        <input 
          type="text"
          placeholder="Search documents, concepts, or vector embeddings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field"
          style={{ paddingLeft: '36px', height: '38px', borderRadius: '999px', fontSize: '0.85rem' }}
        />
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
        {/* Quick Ingest Button */}
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
        >
          <Upload size={14} /> Upload PDF/DOCX
        </button>

        {/* Notifications Dropdown Toggle */}
        <button 
          onClick={() => setShowNotifs(!showNotifs)}
          className="btn-secondary"
          style={{ padding: '8px', position: 'relative' }}
          title="Notifications"
        >
          <Bell size={18} />
          {unreadNotifs > 0 && (
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              background: 'var(--accent-rose)',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 700,
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justify: 'center'
            }}>
              {unreadNotifs}
            </span>
          )}
        </button>

        {/* Notifications Popover */}
        {showNotifs && (
          <div className="glass-panel animate-fade-in" style={{
            position: 'absolute',
            top: '48px',
            right: '80px',
            width: '320px',
            background: 'var(--bg-secondary)',
            padding: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            zIndex: 200
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Activity Notifications</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', cursor: 'pointer' }}>Mark all read</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {notifications.map(n => (
                <div key={n.id} style={{ padding: '8px 10px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                  <div style={{ color: 'var(--text-main)', marginBottom: '2px' }}>{n.text}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{n.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Theme Switcher */}
        <button 
          onClick={toggleTheme}
          className="btn-secondary"
          style={{ padding: '8px' }}
          title="Toggle Dark/Light Mode"
        >
          {theme === 'dark' ? <Sun size={18} style={{ color: 'var(--accent-amber)' }} /> : <Moon size={18} style={{ color: 'var(--accent-purple)' }} />}
        </button>

        {/* Active Role Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'var(--bg-tertiary)', borderRadius: '999px', border: '1px solid var(--glass-border)' }}>
          <Shield size={14} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{currentRole}</span>
        </div>
      </div>
    </header>
  );
}
