import React from 'react';
import { useApp } from '../services/appState';
import { 
  Search, UploadCloud, Bell, Sun, Moon, Shield, Menu 
} from 'lucide-react';

export function TopBar() {
  const { 
    user, theme, toggleTheme, 
    userRole, currentPage, setCurrentPage,
    setIsUploadModalOpen, setIsMobileMenuOpen,
    showToast 
  } = useApp();

  const activeRoleLower = (user?.role || userRole || 'student').toLowerCase();
  const isAdminUser = activeRoleLower === 'admin' || activeRoleLower === 'super_admin' || user?.is_super_admin;

  return (
    <header className="glass-panel topbar-container" style={{
      padding: '14px 28px',
      margin: '16px 24px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 'var(--radius-md)',
      zIndex: 100
    }}>

      {/* Mobile Drawer Hamburger Toggle Button */}
      <button 
        onClick={() => setIsMobileMenuOpen(prev => !prev)}
        className="btn-secondary mobile-only-flex"
        style={{ padding: '8px 10px', gap: '6px' }}
        title="Open Navigation Menu"
      >
        <Menu size={20} />
      </button>

      {/* Search Input Bar */}
      <div className="topbar-search-bar" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-tertiary)', padding: '8px 14px', borderRadius: 'var(--radius-sm)', width: '100%', maxWidth: '380px', border: '1px solid var(--glass-border)' }}>
        <Search size={16} style={{ color: 'var(--text-dim)' }} />
        <input 
          type="text" 
          placeholder="Search document chunks, concepts, or vector embeddings..." 
          style={{ background: 'none', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '0.88rem', width: '100%' }}
        />
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        
        {/* Admin Workbench Direct Button (Shown on user pages only) */}
        {isAdminUser && currentPage !== 'admin-dashboard' && (
          <button 
            onClick={() => setCurrentPage('admin-dashboard')}
            className="gradient-btn"
            style={{ 
              padding: '8px 14px', 
              fontSize: '0.82rem',
              background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
              boxShadow: '0 0 15px rgba(244, 63, 94, 0.4)'
            }}
          >
            <Shield size={16} /> Admin Control Panel
          </button>
        )}

        {/* Account Persona Verified Badge */}
        <div 
          onClick={() => showToast(`Account role is locked to ${activeRoleLower.toUpperCase()} (assigned at Sign In).`, 'info')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'var(--bg-tertiary)', 
            padding: '6px 14px', 
            borderRadius: 'var(--radius-sm)', 
            border: '1px solid var(--glass-border)',
            cursor: 'pointer'
          }}
          title="Role assigned during Sign In"
        >
          <Shield size={14} style={{ color: isAdminUser ? '#f43f5e' : 'var(--accent-blue)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', textTransform: 'capitalize' }}>
            {activeRoleLower} Persona
          </span>
          <span className="badge badge-teal" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>
            Verified
          </span>
        </div>

        {/* Upload Modal Trigger (Hidden in admin dashboard) */}
        {currentPage !== 'admin-dashboard' && (
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="gradient-btn"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <UploadCloud size={16} /> Upload Document
          </button>
        )}

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
