import React, { useState, useRef } from 'react';
import { useApp } from '../services/appState';
import { 
  FileText, Upload, Trash2, Eye, Database, Layers, 
  Sparkles, Search, Filter, CheckCircle2 
} from 'lucide-react';
import { ParticleCard, GlobalSpotlight } from '../components/MagicBento';

export function DocumentsPage() {
  const { documents, setDocuments, setIsUploadModalOpen, setActiveCitation } = useApp();
  const [filterType, setFilterType] = useState('ALL');
  const [docSearch, setDocSearch] = useState('');
  const containerRef = useRef(null);

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = (doc.title || '').toLowerCase().includes(docSearch.toLowerCase());
    const docType = doc.type || doc.file_type || 'PDF';
    const matchesFilter = filterType === 'ALL' || docType === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDeleteDoc = (id) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div ref={containerRef} className="bento-section" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
      <GlobalSpotlight gridRef={containerRef} glowColor="6, 182, 212" />
      
      {/* Top Header */}
      <ParticleCard particleCount={8} enableTilt={true} enableMagnetism={true} clickEffect={true} glowColor="6, 182, 212" className="magic-bento-card magic-bento-card--border-glow" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Document Vault & Vector Index</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage uploaded PDFs, DOCX, PPTX, and notes indexed in ChromaDB vector collections.
          </p>
        </div>
        <button onClick={() => setIsUploadModalOpen(true)} className="gradient-btn">
          <Upload size={16} /> Upload New Document
        </button>
      </ParticleCard>

      {/* Filter & Search Bar */}
      <ParticleCard particleCount={6} enableTilt={true} enableMagnetism={true} clickEffect={true} glowColor="6, 182, 212" className="magic-bento-card magic-bento-card--border-glow" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '320px', flex: '1 1 auto' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input 
            type="text" 
            placeholder="Search document titles or topics..." 
            value={docSearch}
            onChange={(e) => setDocSearch(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '36px', height: '36px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['ALL', 'PDF', 'DOCX', 'PPTX'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              style={{
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: '1px solid var(--glass-border)',
                background: filterType === t ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
                color: filterType === t ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </ParticleCard>

      {/* Documents Table */}
      <ParticleCard particleCount={12} enableTilt={true} enableMagnetism={true} clickEffect={true} glowColor="6, 182, 212" className="magic-bento-card magic-bento-card--border-glow table-responsive-container" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-dim)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 20px' }}>Document Name</th>
                <th style={{ padding: '14px 16px' }}>Type</th>
                <th style={{ padding: '14px 16px' }}>Size / Pages</th>
                <th style={{ padding: '14px 16px' }}>Chunks Indexed</th>
                <th style={{ padding: '14px 16px' }}>Upload Date</th>
                <th style={{ padding: '14px 16px' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map(doc => (
                <tr key={doc.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s ease' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FileText size={18} style={{ color: 'var(--accent-cyan)' }} />
                      <span>{doc.title}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>{doc.type || doc.file_type || 'PDF'}</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                    {doc.size || doc.file_size || '1.2 MB'} ({doc.pages || 1} pgs)
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--accent-blue)' }}>
                    {doc.chunksCount ?? doc.chunks_count ?? 0} chunks
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-dim)' }}>
                    {doc.uploadedAt || 'Recently'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className="badge badge-emerald">✓ {doc.status}</span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      {doc.chunks && doc.chunks[0] && (
                        <button 
                          onClick={() => setActiveCitation({ ...doc.chunks[0], documentTitle: doc.title })}
                          className="btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          title="Inspect Chunks"
                        >
                          <Eye size={14} /> Chunks
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteDoc(doc.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', padding: '4px' }}
                        title="Delete Document"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ParticleCard>
    </div>
  );
}
