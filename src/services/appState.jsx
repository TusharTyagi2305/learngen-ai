import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_DOCUMENTS, INITIAL_FLASHCARDS, INITIAL_QUIZZES } from './mockRAG';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation & Role State
  const [currentPage, setCurrentPage] = useState('landing'); // landing, features, about, pricing, contact, login, register, forgot-password, dashboard, documents, ai-chat, quiz-generator, flashcards, study-planner, research-assistant, progress-dashboard, profile, settings, admin-dashboard, not-found
  const [currentRole, setCurrentRole] = useState('Student'); // Student, Teacher, Admin
  const [theme, setTheme] = useState('dark');

  // Search & Global State
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Quantum_Computing.pdf indexed successfully into ChromaDB.", time: "10m ago", read: false },
    { id: 2, text: "New AI Quiz 'Transformer Models' generated.", time: "1h ago", read: false },
    { id: 3, text: "Weekly study goal 80% completed!", time: "3h ago", read: true }
  ]);

  // Documents & RAG Datasets
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [flashcards, setFlashcards] = useState(INITIAL_FLASHCARDS);
  const [quizzes, setQuizzes] = useState(INITIAL_QUIZZES);

  // RAG Hyperparameters (Admin Config)
  const [ragConfig, setRagConfig] = useState({
    chunkSize: 512,
    chunkOverlap: 50,
    topK: 3,
    embeddingModel: "text-embedding-3-small (1536d)",
    llmModel: "Gemini 1.5 Pro / Flash RAG",
    temperature: 0.2,
    strictDocOnly: true
  });

  // Modal Dialog & Citation Inspector State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeCitation, setActiveCitation] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'info') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.className = newTheme;
  };

  const addDocument = (newDoc) => {
    setDocuments(prev => [newDoc, ...prev]);
    showToast(`Uploaded and indexed ${newDoc.title}`, 'success');
  };

  const addFlashcard = (card) => {
    setFlashcards(prev => [card, ...prev]);
    showToast(`Added new flashcard: "${card.question}"`, 'success');
  };

  const value = {
    currentPage,
    setCurrentPage,
    currentRole,
    setCurrentRole,
    theme,
    toggleTheme,
    searchQuery,
    setSearchQuery,
    notifications,
    setNotifications,
    documents,
    setDocuments,
    addDocument,
    flashcards,
    setFlashcards,
    addFlashcard,
    quizzes,
    setQuizzes,
    ragConfig,
    setRagConfig,
    isUploadModalOpen,
    setIsUploadModalOpen,
    activeCitation,
    setActiveCitation,
    toastMessage,
    showToast
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
