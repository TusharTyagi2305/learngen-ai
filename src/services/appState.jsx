import React, { createContext, useContext, useState } from 'react';
import { mockRAG } from './mockRAG';
import { soundFX } from './soundFx';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('landing');
  const [theme, setTheme] = useState('dark');
  const [userRole, setUserRole] = useState('student'); // 'student', 'teacher', 'admin'
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active RAG Session State
  const [activeDocId, setActiveDocId] = useState(mockRAG.documents[0].id);
  const [activeCitation, setActiveCitation] = useState(null);
  
  // Modals & Popovers
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCitationDrawerOpen, setIsCitationDrawerOpen] = useState(false);
  const [isKnowledgeGraphOpen, setIsKnowledgeGraphOpen] = useState(false);

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

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      soundFX.playClick();
    }
  };

  const playSFX = (type) => {
    if (!soundEnabled) return;
    if (type === 'flip') soundFX.playPageFlip();
    else if (type === 'success') soundFX.playSuccess();
    else if (type === 'click') soundFX.playClick();
  };

  const showToast = (msg, type = 'info') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openCitation = (citation) => {
    setActiveCitation(citation);
    setIsCitationDrawerOpen(true);
    playSFX('click');
  };

  return (
    <AppContext.Provider value={{
      currentPage, setCurrentPage,
      theme, toggleTheme,
      userRole, setUserRole,
      soundEnabled, toggleSound, playSFX,
      activeDocId, setActiveDocId,
      activeCitation, openCitation,
      isUploadModalOpen, setIsUploadModalOpen,
      isCitationDrawerOpen, setIsCitationDrawerOpen,
      isKnowledgeGraphOpen, setIsKnowledgeGraphOpen,
      toastMessage, showToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
