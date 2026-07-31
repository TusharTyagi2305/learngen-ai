import React from 'react';
import { AppProvider, useApp } from './services/appState';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { FileUploadModal } from './components/FileUploadModal';
import { CitationInspector } from './components/CitationInspector';
import { BackgroundCanvas } from './components/BackgroundCanvas';

import { LandingPage } from './pages/LandingPage';
import { FeaturesPage, AboutPage, PricingPage, ContactPage } from './pages/PublicPages';
import { AuthPages, AdminLoginPage } from './pages/AuthPages';
import { DashboardHome } from './pages/DashboardHome';
import { DocumentsPage } from './pages/DocumentsPage';
import { AIChatPage } from './pages/AIChatPage';
import { QuizGeneratorPage } from './pages/QuizGeneratorPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { StudyPlannerPage, ResearchAssistantPage } from './pages/StudyPlannerPage';
import { ProgressDashboardPage } from './pages/ProgressDashboardPage';
import { ProfilePage, SettingsPage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ShieldAlert } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '12px', color: 'var(--accent-rose)' }}>Workspace Interface Recovered</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            {this.state.error?.message || 'An unexpected rendering state occurred.'}
          </p>
          <button 
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }} 
            className="gradient-btn"
            style={{ margin: '0 auto' }}
          >
            Refresh & Launch Workspace
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AdminForbiddenView() {
  const { setCurrentPage } = useApp();
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '40px', textAlign: 'center', border: '1px solid var(--accent-rose)', borderRadius: '16px' }}>
        <div style={{ display: 'inline-flex', background: 'rgba(244, 63, 94, 0.15)', padding: '16px', borderRadius: '50%', marginBottom: '16px' }}>
          <ShieldAlert size={48} style={{ color: 'var(--accent-rose)' }} />
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>HTTP 403 Forbidden</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>
          Access Denied: You do not have active System Administrator privileges required to access the Admin Control Workbench.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button 
            onClick={() => setCurrentPage('login')} 
            className="gradient-btn"
            style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' }}
          >
            Unified Sign In Portal
          </button>
          <button 
            onClick={() => setCurrentPage('dashboard')} 
            className="glass-btn"
          >
            User Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { currentPage, user, setCurrentPage, toastMessage } = useApp();

  const isPublicPage = ['landing', 'features', 'about', 'pricing', 'contact', 'login', 'register', 'forgot-password', 'admin-login'].includes(currentPage);

  const isAdminUser = user?.role === 'admin' || user?.role === 'super_admin' || user?.is_super_admin;

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing': return <LandingPage />;
      case 'features': return <FeaturesPage />;
      case 'about': return <AboutPage />;
      case 'pricing': return <PricingPage />;
      case 'contact': return <ContactPage />;
      case 'admin-login':
      case 'login':
      case 'register':
      case 'forgot-password': return <AuthPages />;
      case 'dashboard': return <DashboardHome />;
      case 'documents': return <DocumentsPage />;
      case 'ai-chat': return <AIChatPage />;
      case 'quiz-generator': return <QuizGeneratorPage />;
      case 'flashcards': return <FlashcardsPage />;
      case 'study-planner': return <StudyPlannerPage />;
      case 'research-assistant': return <ResearchAssistantPage />;
      case 'progress-dashboard': return <ProgressDashboardPage />;
      case 'profile': return <ProfilePage />;
      case 'settings': return <SettingsPage />;
      case 'admin-dashboard': 
        return isAdminUser ? <AdminDashboardPage /> : <AdminForbiddenView />;
      default: return <NotFoundPage />;
    }
  };

  return (
    <ErrorBoundary>
      <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', overflowX: 'hidden', position: 'relative', background: 'transparent' }}>
        
        {/* 3D Animated Scroll Background - Home Page Only */}
        {currentPage === 'landing' && <BackgroundCanvas />}

        {/* Sidebar Navigation for Dashboard area */}
        {!isPublicPage && <Sidebar />}

        {/* Main Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: '100vh', marginLeft: isPublicPage ? 0 : '260px', background: 'transparent', position: 'relative', zIndex: 10 }}>
          {/* Public Header Navbar */}
          {isPublicPage && <Navbar />}

          {/* Dashboard Topbar Navigation */}
          {!isPublicPage && <TopBar />}

          {/* Page Content View */}
          <main style={{ flex: 1, paddingBottom: '32px' }}>
            {renderCurrentPage()}
          </main>
        </div>

        {/* Global Modals & Drawers */}
        <FileUploadModal />
        <CitationInspector />

        {/* Toast Alert Popups */}
        {toastMessage && (
          <div className="glass-panel animate-fade-in" style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            padding: '12px 20px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-secondary)',
            borderLeft: '4px solid var(--accent-cyan)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            fontSize: '0.88rem',
            fontWeight: 600,
            zIndex: 1000
          }}>
            {toastMessage.msg}
          </div>
        )}

      </div>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
