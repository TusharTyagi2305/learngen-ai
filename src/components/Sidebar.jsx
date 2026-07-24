import React from 'react';
import { useApp } from '../services/appState';
import { 
  Brain, LayoutDashboard, FileText, MessageSquare, HelpCircle, 
  Layers, Calendar, Microscope, BarChart3, User, Settings, Shield, 
  Upload, LogOut, Sparkles, ChevronRight
} from 'lucide-react';

export function Sidebar() {
  const { currentPage, setCurrentPage, currentRole, setCurrentRole, setIsUploadModalOpen } = useApp();

  const isDashboardArea = !['landing', 'features', 'about', 'pricing', 'contact', 'login', 'register', 'forgot-password'].includes(currentPage);
  if (!isDashboardArea) return null;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'documents', label: 'Document Vault', icon: FileText, badge: 'RAG' },
    { id: 'ai-chat', label: 'AI RAG Studio', icon: MessageSquare, badge: 'Live' },
    { id: 'quiz-generator', label: 'Quiz Generator', icon: HelpCircle },
    { id: 'flashcards', label: '3D Flashcards', icon: Layers },
    { id: 'study-planner', label: 'Study Planner', icon: Calendar },
    { id: 'research-assistant', label: 'Research Assistant', icon: Microscope },
    { id: 'progress-dashboard', label: 'Analytics & Progress', icon: BarChart3 },
    { id: 'profile', label: 'User Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (currentRole === 'Admin' || currentRole === 'Teacher') {
    navItems.push({ id: 'admin-dashboard', label: 'Admin Workbench', icon: Shield, badge: 'Admin' });
  }

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--glass-border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 90
    }}>
      {/* Brand Header */}
      <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)' }}>
        <div onClick={() => setCurrentPage('landing')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div style={{ background: 'var(--gradient-primary)', padding: '6px', borderRadius: '10px' }}>
            <Brain style={{ color: '#fff', width: '20px', height: '20px' }} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }} className="gradient-text">
            LearnGen AI
          </span>
        </div>
      </div>

      {/* Role Switcher Selector */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-tertiary)' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Active Persona</div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['Student', 'Teacher', 'Admin'].map(role => (
            <button
              key={role}
              onClick={() => setCurrentRole(role)}
              style={{
                flex: 1,
                padding: '4px 6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                background: currentRole === role ? 'var(--accent-blue)' : 'transparent',
                color: currentRole === role ? '#fff' : 'var(--text-muted)'
              }}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Upload CTA Button */}
      <div style={{ padding: '16px 16px 8px' }}>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="gradient-btn" 
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Upload size={16} /> Ingest Document
        </button>
      </div>

      {/* Nav Menu Links */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '8px 8px 6px' }}>Main Menu</div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                padding: '10px 12px',
                marginBottom: '4px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: isActive ? 'var(--glass-hover)' : 'transparent',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                borderLeft: isActive ? '3px solid var(--accent-cyan)' : '3px solid transparent',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} style={{ color: isActive ? 'var(--accent-cyan)' : 'var(--text-dim)' }} />
                <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
              </div>
              {item.badge && (
                <span className="badge badge-teal" style={{ fontSize: '0.6rem', padding: '1px 6px' }}>{item.badge}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* User Profile Card Footer */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid var(--glass-border)', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>
            TS
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Tushar Sharma</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)' }}>{currentRole} Plan</div>
          </div>
        </div>
        <button 
          onClick={() => setCurrentPage('landing')} 
          style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '4px' }}
          title="Log Out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
