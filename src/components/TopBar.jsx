import React from 'react';
import { useApp } from '../services/appState';
import { 
  Search, UploadCloud, Bell, Sun, Moon, Volume2, VolumeX, Network, UserCheck, Shield 
} from 'lucide-react';

export function TopBar() {
  const { 
    theme, toggleTheme, 
    userRole, setUserRole, 
    soundEnabled, toggleSound, playSFX,
    setIsUploadModalOpen, 
    setIsKnowledgeGraphOpen,
    showToast 
  } = useApp();

  return (
    <header className="glass-panel" style={{
      padding: '14px 28px',
      margin: '16px 24px 0',
      display: 'flex',
      alignItems: 'center',
      justify: 'space-between',
      borderRadius: 'var(--radius-md)',
      zIndex: 100
    }}>
      
      {/* Search Input Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-tertiary)', padding: '8px 14px', borderRadius: 'var(--radius-sm)', width: '380px', border: '1px solid var(--glass-border)' }}>
        <Search size={16} style={{ color: 'var(--text-dim)' }} />
        <input 
          type="text" 
          placeholder="Search document chunks, concepts, or vector embeddings..." 
          style={{ background: 'none', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '0.88rem', width: '100%' }}
        />
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        
        {/* Persona Switcher Pill */}
        <div style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
          <button 
            onClick={() => { playSFX('click'); setUserRole('student'); showToast('Switched to Student Persona'); }}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: userRole === 'student' ? 'var(--accent-blue)' : 'transparent',
              color: userRole === 'student' ? '#fff' : 'var(--text-dim)'
            }}
          >
            Student
          </button>

          <button 
            onClick={() => { playSFX('click'); setUserRole('teacher'); showToast('Switched to Teacher Persona'); }}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: userRole === 'teacher' ? 'var(--accent-teal)' : 'transparent',
              color: userRole === 'teacher' ? '#fff' : 'var(--text-dim)'
            }}
          >
            Teacher
          </button>

          <button 
            onClick={() => { playSFX('click'); setUserRole('admin'); showToast('Switched to Admin Persona'); }}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: userRole === 'admin' ? 'var(--accent-amber)' : 'transparent',
              color: userRole === 'admin' ? '#fff' : 'var(--text-dim)'
            }}
          >
            Admin
          </button>
        </div>

        {/* Mind Map Knowledge Graph Modal Trigger */}
        <button 
          onClick={() => { playSFX('click'); setIsKnowledgeGraphOpen(true); }}
          className="btn-secondary"
          style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          title="Open Document Mind Map"
        >
          <Network size={16} style={{ color: 'var(--accent-cyan)' }} /> Mind Map
        </button>

        {/* Upload Modal Trigger */}
        <button 
          onClick={() => { playSFX('click'); setIsUploadModalOpen(true); }}
          className="gradient-btn"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <UploadCloud size={16} /> Upload Document
        </button>

        {/* Sound FX Toggle */}
        <button 
          onClick={toggleSound}
          className="btn-secondary"
          title={soundEnabled ? "Mute Sound Effects" : "Enable Sound Effects"}
          style={{ padding: '8px' }}
        >
          {soundEnabled ? <Volume2 size={18} style={{ color: 'var(--accent-teal)' }} /> : <VolumeX size={18} style={{ color: 'var(--text-dim)' }} />}
        </button>

        {/* Theme Switcher */}
        <button 
          onClick={() => { playSFX('click'); toggleTheme(); }}
          className="btn-secondary"
          title="Toggle Light/Dark Theme"
          style={{ padding: '8px' }}
        >
          {theme === 'dark' ? <Sun size={18} style={{ color: 'var(--accent-amber)' }} /> : <Moon size={18} style={{ color: 'var(--accent-blue)' }} />}
        </button>

      </div>

    </header>
  );
}
