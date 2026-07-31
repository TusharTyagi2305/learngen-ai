import React from 'react';
import { useApp } from '../services/appState';
import { 
  FileText, MessageSquare, HelpCircle, Layers, Calendar, 
  Sparkles, Upload, ArrowRight, Zap, Shield, CheckCircle2, Database 
} from 'lucide-react';
import { WeeklyStudyChart, LearningProgressChart } from '../components/Charts';

export function DashboardHome() {
  const { user, setCurrentPage, documents, setIsUploadModalOpen, currentRole, getUserSummaryStats } = useApp();
  const safeDocs = Array.isArray(documents) ? documents : [];
  const stats = getUserSummaryStats();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
      
      {/* Welcome Banner */}
      <div className="glass-panel" style={{
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(13, 148, 136, 0.12) 100%)',
        border: '1px solid rgba(37, 99, 235, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between'
      }}>
        <div>
          <span className="badge badge-teal" style={{ marginBottom: '8px', textTransform: 'capitalize' }}>RAG Workspace • Active Persona: {user?.role || currentRole || 'student'}</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>Welcome back, {user?.name || 'Learner'} 👋</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Your RAG Vector Vault has <strong>{safeDocs.length} active documents</strong> ready for context-grounded AI learning.
          </p>
        </div>
        <button onClick={() => setIsUploadModalOpen(true)} className="gradient-btn" style={{ padding: '12px 20px' }}>
          <Upload size={18} /> Upload New Document
        </button>
      </div>

      {/* Quick Access Feature Grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div 
          onClick={() => setCurrentPage('ai-chat')}
          className="glass-card" 
          style={{ padding: '20px', cursor: 'pointer', borderColor: 'rgba(6, 182, 212, 0.3)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '10px', borderRadius: '10px', color: 'var(--accent-cyan)' }}>
              <MessageSquare size={20} />
            </div>
            <ArrowRight size={16} style={{ color: 'var(--text-dim)' }} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>AI RAG Studio</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Grounded chat with citations</p>
        </div>

        <div 
          onClick={() => setCurrentPage('documents')}
          className="glass-card" 
          style={{ padding: '20px', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ background: 'rgba(37, 99, 235, 0.15)', padding: '10px', borderRadius: '10px', color: 'var(--accent-blue)' }}>
              <Database size={20} />
            </div>
            <ArrowRight size={16} style={{ color: 'var(--text-dim)' }} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>Document Vault</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{safeDocs.length} Vector Index Collections</p>
        </div>

        <div 
          onClick={() => setCurrentPage('quiz-generator')}
          className="glass-card" 
          style={{ padding: '20px', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ background: 'rgba(13, 148, 136, 0.15)', padding: '10px', borderRadius: '10px', color: 'var(--accent-teal)' }}>
              <HelpCircle size={20} />
            </div>
            <ArrowRight size={16} style={{ color: 'var(--text-dim)' }} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>AI Quiz Engine</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Test concept mastery</p>
        </div>

        <div 
          onClick={() => setCurrentPage('flashcards')}
          className="glass-card" 
          style={{ padding: '20px', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '10px', borderRadius: '10px', color: 'var(--accent-emerald)' }}>
              <Layers size={20} />
            </div>
            <ArrowRight size={16} style={{ color: 'var(--text-dim)' }} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>3D Flashcards</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Spaced repetition decks</p>
        </div>
      </div>

      {/* Main Analytics & Activity Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        
        {/* Left Column: Recent Documents & Analytics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Recent Ingested Files Card */}
          <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Vector Ingested Files</h3>
              <button onClick={() => setCurrentPage('documents')} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.82rem', cursor: 'pointer' }}>
                View All ({safeDocs.length}) →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {safeDocs.length === 0 ? (
                <div style={{ padding: '24px 16px', textAlign: 'center', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                  <Upload size={28} style={{ color: 'var(--accent-cyan)', marginBottom: '8px' }} />
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>No documents in your vault yet</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Upload your lecture notes, PDFs, or research papers to unlock AI RAG Studio chat, quiz synthesis, and 3D flashcards.
                  </div>
                  <button onClick={() => setIsUploadModalOpen(true)} className="gradient-btn" style={{ fontSize: '0.8rem', padding: '6px 14px', margin: '0 auto' }}>
                    Upload First Document
                  </button>
                </div>
              ) : (
                safeDocs.slice(0, 3).map(doc => (
                  <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <FileText size={20} style={{ color: 'var(--accent-cyan)' }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{doc.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          {doc.type || doc.file_type || 'PDF'} • {doc.size || doc.file_size || '1.2 MB'} • {doc.chunksCount ?? doc.chunks_count ?? 0} chunks indexed
                        </div>
                      </div>
                    </div>
                    <span className="badge badge-emerald">{doc.status}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Weekly Hours Graph Card */}
          <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Weekly Study & RAG Query Hours</h3>
              <span className="badge badge-cyan">{stats.totalStudyHours} hrs total</span>
            </div>
            <WeeklyStudyChart />
          </div>
        </div>

        {/* Right Sidebar Column: Progress & Daily Goal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-secondary)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px' }}>Learning Progress Trend</h3>
            <LearningProgressChart />
            <div style={{ marginTop: '16px', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              🎯 <strong>Daily Study Goal:</strong> {stats.todayStudyHours} / 5 hours completed today. Keep up the streak!
            </div>
          </div>

          {/* System Performance Status */}
          <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-secondary)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px' }}>RAG Engine Health</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Vector Store (ChromaDB):</span>
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>Active (HNSW)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Search Latency:</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>38 ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Embedding Dimensions:</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>1536 (OpenAI/Gemini)</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
