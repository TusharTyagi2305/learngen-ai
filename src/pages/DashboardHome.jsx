import React, { useRef } from 'react';
import { useApp } from '../services/appState';
import { 
  FileText, MessageSquare, HelpCircle, Layers, Calendar, 
  Sparkles, Upload, ArrowRight, Zap, Shield, CheckCircle2, Database 
} from 'lucide-react';
import { WeeklyStudyChart, LearningProgressChart } from '../components/Charts';
import MagicBento, { ParticleCard, GlobalSpotlight } from '../components/MagicBento';

export function DashboardHome() {
  const { user, setCurrentPage, documents, setIsUploadModalOpen, currentRole, getUserSummaryStats } = useApp();
  const safeDocs = Array.isArray(documents) ? documents : [];
  const stats = getUserSummaryStats();

  const dashboardCards = [
    { title: 'AI RAG Studio', description: 'Grounded chat with citations', icon: MessageSquare, route: 'ai-chat', color: '#001529', label: 'Interactive' },
    { title: 'Document Vault', description: `${safeDocs.length} Vector Index Collections`, icon: Database, route: 'documents', color: '#001529', label: 'Storage' },
    { title: 'AI Quiz Engine', description: 'Test concept mastery', icon: HelpCircle, route: 'quiz-generator', color: '#001529', label: 'Assessment' },
    { title: '3D Flashcards', description: 'Spaced repetition decks', icon: Layers, route: 'flashcards', color: '#001529', label: 'Retention' }
  ];

  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className="bento-section" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px', position: 'relative' }}>
      <GlobalSpotlight gridRef={containerRef} glowColor="6, 182, 212" />
      
      {/* Welcome Banner */}
      <ParticleCard particleCount={12} enableTilt={true} enableMagnetism={true} clickEffect={true} glowColor="6, 182, 212" className="magic-bento-card magic-bento-card--border-glow" style={{
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(13, 148, 136, 0.12) 100%)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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
      </ParticleCard>

      {/* Quick Access Feature Grid Cards */}
      <MagicBento 
        cards={dashboardCards} 
        gridClassName="dashboard-grid" 
        enableStars={true} 
        spotlightRadius={400} 
        glowColor="6, 182, 212" 
        textAutoHide={false}
      />

      {/* Main Analytics & Activity Grid */}
      <div className="grid-responsive-chat">
        
        {/* Left Column: Recent Documents & Analytics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Recent Ingested Files Card */}
          <ParticleCard particleCount={8} enableTilt={true} enableMagnetism={true} clickEffect={true} glowColor="6, 182, 212" className="magic-bento-card magic-bento-card--border-glow" style={{ padding: '20px', minHeight: 'auto' }}>
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
                  <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                      <FileText size={20} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {doc.type || doc.file_type || 'PDF'} • {doc.size || doc.file_size || '1.2 MB'} • {doc.chunksCount ?? doc.chunks_count ?? 0} chunks indexed
                        </div>
                      </div>
                    </div>
                    <span className="badge badge-emerald" style={{ flexShrink: 0 }}>{doc.status}</span>
                  </div>
                ))
              )}
            </div>
          </ParticleCard>

          {/* Weekly Study Hours Card */}
          <ParticleCard particleCount={8} enableTilt={true} enableMagnetism={true} clickEffect={true} glowColor="6, 182, 212" className="magic-bento-card magic-bento-card--border-glow" style={{ padding: '20px', minHeight: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Weekly Study & RAG Query Hours</h3>
              <span className="badge badge-cyan">{stats.totalStudyHours} hrs total</span>
            </div>
            <WeeklyStudyChart />
          </ParticleCard>
        </div>

        {/* Right Sidebar Column: Progress & Daily Goal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Learning Progress Trend Card */}
          <ParticleCard particleCount={12} enableTilt={true} enableMagnetism={true} clickEffect={true} glowColor="6, 182, 212" className="magic-bento-card magic-bento-card--border-glow" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px' }}>Learning Progress Trend</h3>
            <LearningProgressChart />
            <div style={{ marginTop: '16px', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              🎯 <strong>Daily Study Goal:</strong> {stats.todayStudyHours} / 5 hours completed today. Keep up the streak!
            </div>
          </ParticleCard>

          {/* System Performance Status */}
          <ParticleCard particleCount={6} enableTilt={true} enableMagnetism={true} clickEffect={true} glowColor="6, 182, 212" className="magic-bento-card magic-bento-card--border-glow" style={{ padding: '20px', minHeight: 'auto' }}>
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
          </ParticleCard>

        </div>

      </div>
    </div>
  );
}
