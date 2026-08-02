/**
 * LearnGen AI — Centralized Production API Client
 * Connects Frontend UI to Python FastAPI Backend (https://learngen-ai-backend.onrender.com/api/v1)
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://learngen-ai-backend.onrender.com/api/v1";

// Token storage helpers
export const getAccessToken = () => localStorage.getItem("access_token");
export const setAccessToken = (token) => localStorage.setItem("access_token", token);
export const removeAccessToken = () => localStorage.removeItem("access_token");

async function request(endpoint, options = {}) {
  const token = getAccessToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || data.detail || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (error) {
    console.warn(`[API Client] Endpoint ${endpoint} fallback:`, error.message);
    throw error;
  }
}

export const api = {
  // Auth API
  register: (userData) => request("/auth/register", { method: "POST", body: JSON.stringify(userData) }),
  resendOtp: (data) => request("/auth/resend-otp", { method: "POST", body: JSON.stringify(data) }),
  verifyOtp: (data) => request("/auth/verify-otp", { method: "POST", body: JSON.stringify(data) }),
  login: (credentials) => request("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  adminLogin: (credentials) => request("/auth/admin-login", { method: "POST", body: JSON.stringify(credentials) }),
  getMe: () => request("/auth/me"),
  logout: () => request("/auth/logout", { method: "POST" }),

  // User Profile & Settings API
  getProfile: () => request("/users/profile"),
  getDashboard: () => request("/users/dashboard"),
  getSettings: () => request("/users/settings"),

  // Document Management API
  getDocuments: () => request("/documents"),
  uploadDocument: async (file) => {
    const token = getAccessToken();
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    return res.json();
  },
  deleteDocument: (docId) => request(`/documents/${docId}`, { method: "DELETE" }),
  renameDocument: (docId, title) => request(`/documents/${docId}`, { method: "PATCH", body: JSON.stringify({ title }) }),

  // AI RAG Chat Studio API
  getChatSessions: () => request("/chats"),
  createChatSession: (title) => request(`/chats?title=${encodeURIComponent(title || "New Study Chat")}`, { method: "POST" }),
  getChatHistory: (sessionId) => request(`/chats/${sessionId}/messages`),
  sendChatMessage: (sessionId, text, docId, searchExternal = false) => request(`/chats/${sessionId}/messages`, { method: "POST", body: JSON.stringify({ text, doc_id: docId, search_external: searchExternal }) }),
  queryRag: (text, docId, searchExternal = false) => request("/chats/query", { method: "POST", body: JSON.stringify({ text, doc_id: docId, search_external: searchExternal }) }),

  // Quiz Engine API
  getQuizzes: () => request("/quizzes"),
  generateQuiz: (docId, numQuestions = 5) => request(`/quizzes/generate?${docId ? `doc_id=${docId}&` : ''}num_questions=${numQuestions}`, { method: "POST" }),
  submitQuiz: (quizId, answers) => request(`/quizzes/${quizId}/submit`, { method: "POST", body: JSON.stringify({ answers }) }),

  // Flashcards API
  getFlashcards: () => request("/flashcards"),
  generateFlashcards: (docId, numCards = 5) => request(`/flashcards/generate?${docId ? `doc_id=${docId}&` : ''}num_cards=${numCards}`, { method: "POST" }),
  updateFlashcardMastery: (cardId, mastered) => request(`/flashcards/${cardId}/mastery`, { method: "PATCH", body: JSON.stringify({ mastered }) }),

  // Study Planner API
  getStudyPlans: () => request("/study-plans"),
  addStudyTask: (planId, taskData) => request(`/study-plans/${planId}/tasks`, { method: "POST", body: JSON.stringify(taskData) }),

  // Progress & Analytics API
  getWeeklyProgress: () => request("/progress/weekly"),
  getProgressSummary: () => request("/progress/summary"),

  // Admin Workbench API
  getAdminStats: () => request("/admin/stats"),
  getAdminConfig: () => request("/admin/config"),
  updateAdminConfig: (configData) => request("/admin/config", { method: "PATCH", body: JSON.stringify(configData) }),
  promoteUser: (userId) => request(`/admin/users/${userId}/promote`, { method: "POST" }),
  demoteUser: (userId) => request(`/admin/users/${userId}/demote`, { method: "POST" }),
};

export default api;
