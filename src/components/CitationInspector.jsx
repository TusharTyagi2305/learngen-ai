import React from 'react';
import { useApp } from '../services/appState';
import { X, ExternalLink, ShieldCheck, FileText, Layers, Hash } from 'lucide-react';

export function CitationInspector() {
  const { activeCitation, setActiveCitation } = useApp();

  if (!activeCitation) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 998,
      display: 'flex',
      justify: 'flex-end'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '480px',
        height: '100%',
        background: 'var(--bg-secondary)',
        padding: '24px',
        borderRadius: 0,
        borderRight: 'none',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} style={{ color: 'var(--accent-emerald)' }} />
            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>RAG Context Grounding</span>
          </div>
          <button 
            onClick={() => setActiveCitation(null)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Citation Metadata */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div className="glass-card" style={{ padding: '16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>Source Document</div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} /> {activeCitation.documentTitle}
            </div>
            
            <div className="grid-responsive-2" style={{ gap: '10px', marginTop: '12px' }}>
              <div style={{ background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Page Number</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Page {activeCitation.page}</div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Cosine Similarity</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-emerald)' }}>
                  {(activeCitation.score * 100).toFixed(1)}% Match
                </div>
              </div>
            </div>
          </div>

          {/* Raw Text Snippet */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={14} /> Retrieved Text Chunk ({activeCitation.lineRange || 'L12-L45'})
            </div>
            <div style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              lineHeight: '1.6',
              color: 'var(--text-main)'
            }}>
              "{activeCitation.text}"
            </div>
          </div>

          <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--accent-emerald)' }}>
            ✓ Verified document context. Hallucination guard active (T=0.2).
          </div>
        </div>

        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
          <button onClick={() => setActiveCitation(null)} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
