import React from 'react';
import { useApp } from '../services/appState';
import { 
  Brain, LayoutDashboard, FileText, MessageSquare, HelpCircle, 
  Layers, Calendar, Microscope, BarChart3, User, Settings, Shield, 
  Upload, LogOut, Sparkles, ChevronRight, Database, Bot, Server, 
  HardDrive, Users, Folder, Terminal, Activity, Sliders, Archive, ArrowLeft
} from 'lucide-react';

export function Sidebar() {
  const { 
    user, currentPage, setCurrentPage, 
    adminActiveTab, setAdminActiveTab,
    isMobileMenuOpen, setIsMobileMenuOpen,
    userRole, setIsUploadModalOpen, logoutUser 
  } = useApp();

  const isDashboardArea = !['landing', 'features', 'about', 'pricing', 'contact', 'login', 'register', 'forgot-password'].includes(currentPage);
  if (!isDashboardArea) return null;

  const currentRoleNormalized = (user?.role || userRole || 'student').toLowerCase();
  const isAdminUser = currentRoleNormalized === 'admin' || currentRoleNormalized === 'super_admin' || user?.is_super_admin;
  const userNavItems = [
    ...(isAdminUser ? [{ id: 'admin-dashboard', label: 'Admin Control Panel', icon: Shield, badge: 'ADMIN', isAdminBadge: true }] : []),
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

  const adminNavItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
    { id: 'documents', label: 'Document Analytics', icon: FileText },
    { id: 'vector', label: 'Vector DB Analytics', icon: Database },
    { id: 'rag', label: 'AI RAG Analytics', icon: Bot },
    { id: 'chat', label: 'Chat Analytics', icon: MessageSquare },
    { id: 'quizzes', label: 'Quiz & Flashcards', icon: HelpCircle },
    { id: 'health', label: 'System Health', icon: Server },
    { id: 'db_monitor', label: 'Database Monitor', icon: HardDrive },
    { id: 'vector_exp', label: 'Vector Explorer', icon: Layers },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'files', label: 'File Manager', icon: Folder },
    { id: 'logs', label: 'System Logs', icon: Terminal },
    { id: 'api_monitor', label: 'API Monitor', icon: Activity },
    { id: 'settings', label: 'Hyperparameters', icon: Sliders },
    { id: 'backup', label: 'Backup & Recovery', icon: Archive }
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      <div 
        className={`sidebar-overlay ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <aside className={`sidebar-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)' }}>
          <div onClick={() => { setCurrentPage(isAdminPage ? 'admin-dashboard' : 'dashboard'); setIsMobileMenuOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <div style={{ background: isAdminPage ? 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' : 'var(--gradient-primary)', padding: '6px', borderRadius: '10px' }}>
              {isAdminPage ? <Shield style={{ color: '#fff', width: '20px', height: '20px' }} /> : <Brain style={{ color: '#fff', width: '20px', height: '20px' }} />}
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }} className="gradient-text">
              {isAdminPage ? 'Admin Control' : 'LearnGen AI'}
            </span>
          </div>

          {/* Mobile Close Button */}
          {isMobileMenuOpen && (
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-secondary"
              style={{ padding: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}
            >
              ✕
            </button>
          )}
        </div>

      {/* Account Persona Badge */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-tertiary)' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Account Persona</div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--glass-border)'
        }}>
          <Shield size={16} style={{ 
            color: isAdminUser ? '#f43f5e' : 'var(--accent-blue)' 
          }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'capitalize', color: 'var(--text-main)' }}>
            {user?.role || 'Student'}
          </span>
          <span className="badge badge-rose" style={{ marginLeft: 'auto', fontSize: '0.65rem' }}>
            {isAdminPage ? 'ADMIN' : 'Locked'}
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <div style={{ padding: '14px 16px 6px' }}>
        {isAdminPage ? (
          <button 
            onClick={() => setCurrentPage('dashboard')}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem', padding: '8px', color: 'var(--accent-cyan)', borderColor: 'rgba(6,182,212,0.4)' }}
          >
            <ArrowLeft size={15} /> Switch to User Workspace
          </button>
        ) : (
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="gradient-btn" 
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Upload size={16} /> Ingest Document
          </button>
        )}
      </div>

      {/* Nav Menu Links */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '8px 8px 6px' }}>
          {isAdminPage ? 'Admin Control Modules' : 'Main Menu'}
        </div>

        {isAdminPage ? (
          /* ADMIN WORKBENCH NAVIGATION SUB-ITEMS */
          adminNavItems.map(item => {
            const Icon = item.icon;
            const isActive = adminActiveTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAdminActiveTab(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '9px 12px',
                  marginBottom: '3px',
                  borderRadius: 'var(--radius-sm)',
                  border: isActive ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid transparent',
                  background: isActive ? 'rgba(244, 63, 94, 0.18)' : 'transparent',
                  color: isActive ? '#f43f5e' : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 400,
                  cursor: 'pointer',
                  borderLeft: isActive ? '3px solid #f43f5e' : '3px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={17} style={{ color: isActive ? '#f43f5e' : 'var(--text-dim)' }} />
                <span style={{ fontSize: '0.85rem' }}>{item.label}</span>
              </button>
            );
          })
        ) : (
          /* STANDARD USER NAVIGATION ITEMS */
          userNavItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const isItemAdmin = item.id === 'admin-dashboard';
            const itemColor = isItemAdmin ? '#f43f5e' : isActive ? 'var(--accent-cyan)' : 'var(--text-muted)';
            const borderLeftColor = isItemAdmin ? '#f43f5e' : isActive ? 'var(--accent-cyan)' : 'transparent';
            const bgHover = isItemAdmin && isActive ? 'rgba(244, 63, 94, 0.18)' : isActive ? 'var(--glass-hover)' : 'transparent';

            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  marginBottom: '4px',
                  borderRadius: 'var(--radius-sm)',
                  border: isItemAdmin && isActive ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid transparent',
                  background: bgHover,
                  color: itemColor,
                  fontWeight: isActive ? 700 : 400,
                  cursor: 'pointer',
                  borderLeft: `3px solid ${borderLeftColor}`,
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={18} style={{ color: isItemAdmin ? '#f43f5e' : isActive ? 'var(--accent-cyan)' : 'var(--text-dim)' }} />
                  <span style={{ fontSize: '0.9rem', color: isItemAdmin ? '#f43f5e' : undefined }}>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`badge ${isItemAdmin ? 'badge-rose' : 'badge-teal'}`} style={{ fontSize: '0.65rem', padding: '1px 6px' }}>{item.badge}</span>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* User Profile Card Footer */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid var(--glass-border)', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: isAdminPage ? 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' : 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>
            {user?.avatar || 'TS'}
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{user?.name || 'User'}</div>
            <div style={{ fontSize: '0.72rem', color: isAdminPage ? '#f43f5e' : 'var(--accent-emerald)', textTransform: 'capitalize' }}>{(user?.role || 'student')} Plan</div>
          </div>
        </div>
        <button 
          onClick={logoutUser} 
          style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '4px' }}
          title="Log Out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
    </>
  );
}
