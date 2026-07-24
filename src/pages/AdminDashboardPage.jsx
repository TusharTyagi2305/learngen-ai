import React from 'react';
import { useApp } from '../services/appState';
import { Shield, Database, Cpu, Sliders, Server, Users, Key, Activity } from 'lucide-react';

export function AdminDashboardPage() {
  const { ragConfig, setRagConfig, showToast } = useApp();

  const handleSliderChange = (field, val) => {
    setRagConfig(prev => ({ ...prev, [field]: val }));
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="badge badge-teal" style={{ marginBottom: '6px' }}>System Admin Workbench</span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>RAG Engine & Vector DB Admin Workbench</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Fine-tune retrieval hyperparameters, manage ChromaDB collections, and monitor system metrics.
          </p>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Active Vector Collections</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-blue)', margin: '4px 0' }}>12 Collections</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ChromaDB Persistent Mode</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Total Vector Embeddings</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)', margin: '4px 0' }}>142,850 Chunks</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1536d Cosine HNSW</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Active SaaS Users</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)', margin: '4px 0' }}>100,000+</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Students, Teachers & Admins</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Daily Token Consumption</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-amber)', margin: '4px 0' }}>4.2M Tokens</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FastAPI Gateway</div>
        </div>
      </div>

      {/* RAG Hyperparameter Tuning Controls */}
      <div className="glass-panel" style={{ padding: '28px', background: 'var(--bg-secondary)' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={20} style={{ color: 'var(--accent-blue)' }} /> RAG Pipeline Hyperparameter Controls
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
          
          {/* Chunk Size */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Chunk Size (Tokens)</label>
              <span className="badge badge-blue">{ragConfig.chunkSize} tokens</span>
            </div>
            <input 
              type="range" min="128" max="2048" step="128" 
              value={ragConfig.chunkSize} 
              onChange={(e) => handleSliderChange('chunkSize', Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-blue)' }}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>Optimal range: 512–1024 for academic papers</div>
          </div>

          {/* Chunk Overlap */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Chunk Overlap (Tokens)</label>
              <span className="badge badge-cyan">{ragConfig.chunkOverlap} tokens</span>
            </div>
            <input 
              type="range" min="0" max="200" step="10" 
              value={ragConfig.chunkOverlap} 
              onChange={(e) => handleSliderChange('chunkOverlap', Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>Prevents context fragmentation at chunk boundaries</div>
          </div>

          {/* Top-K Similarity Search */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Top-K Vector Search Count</label>
              <span className="badge badge-emerald">Top {ragConfig.topK} Chunks</span>
            </div>
            <input 
              type="range" min="1" max="10" step="1" 
              value={ragConfig.topK} 
              onChange={(e) => handleSliderChange('topK', Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-emerald)' }}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>Number of highest similarity vector matches injected into prompt context</div>
          </div>

          {/* LLM Temperature */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>LLM Generation Temperature</label>
              <span className="badge badge-amber">T = {ragConfig.temperature}</span>
            </div>
            <input 
              type="range" min="0.0" max="1.0" step="0.05" 
              value={ragConfig.temperature} 
              onChange={(e) => handleSliderChange('temperature', Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-amber)' }}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>Lower temperature (0.1–0.2) strictly prevents hallucinations</div>
          </div>

        </div>

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
          <button onClick={() => showToast('Applied RAG hyperparameters to vector engine', 'success')} className="gradient-btn">
            Apply Hyperparameters to Live ChromaDB Pipeline
          </button>
        </div>
      </div>

    </div>
  );
}
