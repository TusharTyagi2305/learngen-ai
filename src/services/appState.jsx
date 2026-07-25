import React, { createContext, useContext, useState } from 'react';
import { mockRAG } from './mockRAG';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('landing');
  const [theme, setTheme] = useState('dark');
  const [userRole, setUserRole] = useState('student'); // 'student', 'teacher', 'admin'

  // Active RAG Session State
  const [activeDocId, setActiveDocId] = useState(mockRAG.documents[0].id);
  const [activeCitation, setActiveCitation] = useState(null);
  
  // Modals & Popovers
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCitationDrawerOpen, setIsCitationDrawerOpen] = useState(false);

  // Global Toast Alert
  const [toastMessage, setToastMessage] = useState(null);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  };

  const showToast = (msg, type = 'info') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openCitation = (citation) => {
    setActiveCitation(citation);
    setIsCitationDrawerOpen(true);
  };

  return (
    <AppContext.Provider value={{
      currentPage, setCurrentPage,
      theme, toggleTheme,
      userRole, setUserRole,
      activeDocId, setActiveDocId,
      activeCitation, openCitation,
      isUploadModalOpen, setIsUploadModalOpen,
      isCitationDrawerOpen, setIsCitationDrawerOpen,
      toastMessage, showToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
