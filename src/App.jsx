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
import { AuthPages } from './pages/AuthPages';
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

function AppContent() {
  const { currentPage, toastMessage } = useApp();

  const isPublicPage = ['landing', 'features', 'about', 'pricing', 'contact', 'login', 'register', 'forgot-password'].includes(currentPage);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing': return <LandingPage />;
      case 'features': return <FeaturesPage />;
      case 'about': return <AboutPage />;
      case 'pricing': return <PricingPage />;
      case 'contact': return <ContactPage />;
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
      case 'admin-dashboard': return <AdminDashboardPage />;
      default: return <NotFoundPage />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', overflowX: 'hidden', position: 'relative' }}>
      
      {/* 3D Thor Animated Scroll Video Background */}
      <BackgroundCanvas />

      {/* Sidebar Navigation for Dashboard area */}
      {!isPublicPage && <Sidebar />}

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Public Header Navbar */}
        {isPublicPage && <Navbar />}

        {/* Dashboard Topbar Navigation */}
        {!isPublicPage && <TopBar />}

        {/* Page Content View */}
        <main style={{ flex: 1 }}>
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
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
