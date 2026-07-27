import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockRAG } from './mockRAG';
import { api } from './api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('landing');
  const [theme, setTheme] = useState('dark');
  const [userRole, setUserRole] = useState('student'); // 'student', 'teacher', 'admin'
  const [documents, setDocuments] = useState(mockRAG.documents);
  const [quizzes, setQuizzes] = useState(mockRAG.quizzes);
  const [flashcards, setFlashcards] = useState(mockRAG.flashcards);

  // RAG Hyperparameters
  const [ragConfig, setRagConfig] = useState({
    chunkSize: 512,
    overlap: 50,
    topK: 3,
    temperature: 0.2
  });

  // Active RAG Session State
  const [activeDocId, setActiveDocId] = useState(mockRAG.documents[0]?.id || 'doc-1');
  const [activeCitation, setActiveCitation] = useState(null);
  
  // Modals & Popovers
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCitationDrawerOpen, setIsCitationDrawerOpen] = useState(false);

  // Global Toast Alert
  const [toastMessage, setToastMessage] = useState(null);

  // Sync with Live FastAPI Backend on load
  useEffect(() => {
    async function loadBackendData() {
      try {
        const docRes = await api.getDocuments();
        if (docRes?.data && Array.isArray(docRes.data) && docRes.data.length > 0) {
          setDocuments(docRes.data);
        }

        const quizRes = await api.getQuizzes();
        if (quizRes?.data && Array.isArray(quizRes.data) && quizRes.data.length > 0) {
          setQuizzes(quizRes.data);
        }

        const fcRes = await api.getFlashcards();
        if (fcRes?.data && Array.isArray(fcRes.data) && fcRes.data.length > 0) {
          setFlashcards(fcRes.data);
        }

        const configRes = await api.getAdminConfig();
        if (configRes?.data) {
          setRagConfig(configRes.data);
        }
      } catch (err) {
        // Smooth fallback to local mock data
        console.log("[AppProvider] Using initial cached vault data.");
      }
    }
    loadBackendData();
  }, []);

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
      userRole, setUserRole, currentRole: userRole,
      documents, setDocuments,
      quizzes, setQuizzes,
      flashcards, setFlashcards,
      ragConfig, setRagConfig,
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
