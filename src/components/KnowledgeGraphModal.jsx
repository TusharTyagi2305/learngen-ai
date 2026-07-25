import React, { useState } from 'react';
import { useApp } from '../services/appState';
import { Network, X, Database, FileText, Sparkles, Layers, ArrowRight } from 'lucide-react';

export function KnowledgeGraphModal() {
  const { isKnowledgeGraphOpen, setIsKnowledgeGraphOpen, playSFX, openCitation } = useApp();
  const [selectedNode, setSelectedNode] = useState(null);

  if (!isKnowledgeGraphOpen) return null;

  const nodes = [
    // Documents
    { id: 'doc-1', label: 'Quantum_Computing_Ch3.pdf', type: 'doc', x: 220, y: 160, color: 'var(--accent-cyan)' },
    { id: 'doc-2', label: 'Deep_Learning_Summary.docx', type: 'doc', x: 540, y: 160, color: 'var(--accent-blue)' },
    { id: 'doc-3', label: 'Neural_Networks_Paper.pdf', type: 'doc', x: 380, y: 380, color: 'var(--accent-teal)' },

    // Concepts
    { id: 'c-1', label: 'Qubits & Superposition', type: 'concept', docId: 'doc-1', x: 120, y: 260, color: '#22d3ee', citation: { doc: 'Quantum_Computing_Ch3.pdf', page: 12, lines: '45-52', snippet: 'A qubit state |Ψ⟩ = α|0⟩ + β|1⟩ represents superposition until measured in computational basis.' } },
    { id: 'c-2', label: 'Vector Embeddings', type: 'concept', docId: 'doc-1', x: 340, y: 240, color: '#38bdf8', citation: { doc: 'Quantum_Computing_Ch3.pdf', page: 18, lines: '80-92', snippet: 'Dense 1536-dimensional vectors preserve semantic similarity across chunk boundaries.' } },
    { id: 'c-3', label: 'Backpropagation', type: 'concept', docId: 'doc-2', x: 650, y: 260, color: '#818cf8', citation: { doc: 'Deep_Learning_Summary.docx', page: 4, lines: '12-25', snippet: 'Gradient calculation applying chain rule backward through computational graph layers.' } },
    { id: 'c-4', label: 'Loss Functions', type: 'concept', docId: 'doc-2', x: 500, y: 300, color: '#a78bfa', citation: { doc: 'Deep_Learning_Summary.docx', page: 7, lines: '30-41', snippet: 'Cross-entropy loss quantifies divergence between target labels and model probabilities.' } },
    { id: 'c-5', label: 'ChromaDB HNSW Graph', type: 'concept', docId: 'doc-3', x: 250, y: 440, color: '#34d399', citation: { doc: 'Neural_Networks_Paper.pdf', page: 9, lines: '102-115', snippet: 'HNSW index graph enables O(log N) approximate nearest neighbor vector retrieval.' } },
    { id: 'c-6', label: 'Cosine Similarity', type: 'concept', docId: 'doc-3', x: 520, y: 440, color: '#fbbf24', citation: { doc: 'Neural_Networks_Paper.pdf', page: 14, lines: '150-162', snippet: 'Cosine distance measuring angular alignment between query and candidate document vectors.' } },
  ];

  const edges = [
    { from: 'doc-1', to: 'c-1' },
    { from: 'doc-1', to: 'c-2' },
    { from: 'doc-2', to: 'c-3' },
    { from: 'doc-2', to: 'c-4' },
    { from: 'doc-3', to: 'c-5' },
    { from: 'doc-3', to: 'c-6' },

    // Cross-document concept connections
    { from: 'c-2', to: 'c-5', cross: true },
    { from: 'c-2', to: 'c-6', cross: true },
    { from: 'c-4', to: 'c-6', cross: true },
  ];

  const handleNodeClick = (node) => {
    playSFX('click');
    setSelectedNode(node);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(16px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '24px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '1080px',
        height: '640px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        background: 'rgba(15, 23, 42, 0.95)'
      }}>
        
        {/* Modal Header */}
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          background: 'rgba(11, 15, 23, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(6, 182, 212, 0.2)', padding: '10px', borderRadius: '12px', color: 'var(--accent-cyan)' }}>
              <Network size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Document Knowledge Graph & Mind Map</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Interactive cross-document topic connections & semantic vector links</p>
            </div>
          </div>

          <button 
            onClick={() => { playSFX('click'); setIsKnowledgeGraphOpen(false); }}
            className="btn-secondary"
            style={{ padding: '8px', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: Graph Stage + Side Panel */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: selectedNode ? '1fr 340px' : '1fr', overflow: 'hidden' }}>
          
          {/* Interactive SVG Node Canvas */}
          <div style={{ position: 'relative', background: 'rgba(11, 15, 23, 0.8)', overflow: 'hidden' }}>
            <svg width="100%" height="100%" viewBox="0 0 760 520">
              <defs>
                <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="crossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.5" />
                </linearGradient>
              </defs>

              {/* Render Edges */}
              {edges.map((e, idx) => {
                const n1 = nodes.find(n => n.id === e.from);
                const n2 = nodes.find(n => n.id === e.to);
                if (!n1 || !n2) return null;
                return (
                  <line 
                    key={idx}
                    x1={n1.x} y1={n1.y}
                    x2={n2.x} y2={n2.y}
                    stroke={e.cross ? "url(#crossGrad)" : "url(#edgeGrad)"}
                    strokeWidth={e.cross ? 2 : 2.5}
                    strokeDasharray={e.cross ? "6,4" : "none"}
                  />
                );
              })}

              {/* Render Nodes */}
              {nodes.map(n => {
                const isSelected = selectedNode?.id === n.id;
                return (
                  <g 
                    key={n.id} 
                    transform={`translate(${n.x}, ${n.y})`}
                    onClick={() => handleNodeClick(n)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Node Glow */}
                    <circle 
                      r={n.type === 'doc' ? 24 : 18} 
                      fill={n.color} 
                      opacity={isSelected ? 0.9 : 0.25}
                      style={{ transition: 'all 0.3s ease' }}
                    />
                    
                    {/* Core Node Circle */}
                    <circle 
                      r={n.type === 'doc' ? 18 : 12} 
                      fill="rgba(15, 23, 42, 0.95)"
                      stroke={n.color}
                      strokeWidth={isSelected ? 3 : 2}
                    />

                    {/* Label Text */}
                    <text 
                      x="0" 
                      y={n.type === 'doc' ? 34 : 26} 
                      textAnchor="middle" 
                      fill="#fff" 
                      fontSize={n.type === 'doc' ? "12px" : "11px"}
                      fontWeight={isSelected ? "800" : "600"}
                      style={{ userSelect: 'none', pointerEvents: 'none' }}
                    >
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Side Details Inspector Panel */}
          {selectedNode && (
            <div className="animate-fade-in" style={{
              background: 'rgba(15, 23, 42, 0.95)',
              borderLeft: '1px solid var(--glass-border)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between'
            }}>
              <div>
                <span className="badge badge-teal" style={{ marginBottom: '12px' }}>
                  {selectedNode.type === 'doc' ? 'Document Vault Hub' : 'Extracted Vector Concept'}
                </span>

                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px' }}>
                  {selectedNode.label}
                </h4>

                {selectedNode.type === 'doc' ? (
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Indexed in ChromaDB collection with persistent vector HNSW graph. Contains extracted text chunks and citation metadata.
                  </p>
                ) : (
                  <div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.5 }}>
                      Grounding Snippet:
                    </p>
                    <div style={{ padding: '12px', background: 'rgba(30, 41, 59, 0.7)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-cyan)', fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                      "{selectedNode.citation.snippet}"
                    </div>
                  </div>
                )}
              </div>

              {selectedNode.citation && (
                <button 
                  onClick={() => { openCitation(selectedNode.citation); setIsKnowledgeGraphOpen(false); }}
                  className="gradient-btn"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.88rem' }}
                >
                  Inspect Citation Chunk <ArrowRight size={16} />
                </button>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
