import React from 'react';
import { useApp } from '../services/appState';
import { 
  Search, UploadCloud, Bell, Sun, Moon 
} from 'lucide-react';

export function TopBar() {
  const { 
    theme, toggleTheme, 
    userRole, setUserRole, 
    setIsUploadModalOpen, 
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
            onClick={() => { setUserRole('student'); showToast('Switched to Student Persona'); }}
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
            onClick={() => { setUserRole('teacher'); showToast('Switched to Teacher Persona'); }}
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
            onClick={() => { setUserRole('admin'); showToast('Switched to Admin Persona'); }}
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

        {/* Upload Modal Trigger */}
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="gradient-btn"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <UploadCloud size={16} /> Upload Document
        </button>

        {/* Theme Switcher */}
        <button 
          onClick={toggleTheme}
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
