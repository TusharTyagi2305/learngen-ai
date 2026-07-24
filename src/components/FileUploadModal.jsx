import React, { useState } from 'react';
import { useApp } from '../services/appState';
import { Upload, X, FileText, CheckCircle2, Cpu, Database, Sparkles } from 'lucide-react';

export function FileUploadModal() {
  const { isUploadModalOpen, setIsUploadModalOpen, addDocument } = useApp();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);

  if (!isUploadModalOpen) return null;

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleStartIngestion = () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setProcessStep(1);

    setTimeout(() => setProcessStep(2), 800);
    setTimeout(() => setProcessStep(3), 1600);
    setTimeout(() => setProcessStep(4), 2400);

    setTimeout(() => {
      const ext = selectedFile.name.split('.').pop().toUpperCase();
      addDocument({
        id: `doc-${Date.now()}`,
        title: selectedFile.name,
        type: ext || 'PDF',
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
        pages: Math.floor(Math.random() * 30) + 10,
        chunksCount: Math.floor(Math.random() * 80) + 40,
        uploadedAt: new Date().toISOString().split('T')[0],
        status: 'Indexed',
        vectorCollection: `user_vault_v${Math.floor(Math.random()*10)}`,
        summary: `Auto-generated RAG summary for ${selectedFile.name}. Document parsed into high-density semantic vector chunks.`,
        chunks: [
          {
            id: `chunk-${Date.now()}-1`,
            page: 1,
            lineRange: "L1-L40",
            text: `Extracted key concepts from ${selectedFile.name}: Main themes include foundational theory, experimental setup, and operational parameters.`,
            score: 0.95
          }
        ]
      });

      setIsProcessing(false);
      setProcessStep(0);
      setSelectedFile(null);
      setIsUploadModalOpen(false);
    }, 3200);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 999,
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '540px',
        background: 'var(--bg-secondary)',
        padding: '28px',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button 
          onClick={() => setIsUploadModalOpen(false)}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '1.3rem', marginBottom: '4px' }}>RAG Document Ingestion</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Upload study files to parse, chunk, embed, and index into your ChromaDB vector collection.
        </p>

        {/* Drag and Drop Zone */}
        {!isProcessing ? (
          <div>
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              style={{
                border: '2px dashed var(--accent-blue)',
                borderRadius: 'var(--radius-md)',
                padding: '32px 20px',
                textAlign: 'center',
                background: 'rgba(59, 130, 246, 0.05)',
                cursor: 'pointer',
                marginBottom: '16px'
              }}
              onClick={() => document.getElementById('file-input-id').click()}
            >
              <Upload size={36} style={{ color: 'var(--accent-blue)', marginBottom: '12px' }} />
              <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>
                {selectedFile ? selectedFile.name : 'Drag & Drop files here or click to browse'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Supports PDF, DOCX, PPTX, TXT, Notes, Books (Max 50MB)
              </div>
              <input 
                id="file-input-id" 
                type="file" 
                style={{ display: 'none' }} 
                accept=".pdf,.docx,.pptx,.txt"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </div>

            {selectedFile && (
              <div style={{ padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} style={{ color: 'var(--accent-cyan)' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{selectedFile.name}</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{(selectedFile.size / 1024).toFixed(0)} KB</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setIsUploadModalOpen(false)} className="btn-secondary">Cancel</button>
              <button 
                onClick={handleStartIngestion} 
                disabled={!selectedFile}
                className="gradient-btn"
                style={{ opacity: selectedFile ? 1 : 0.5 }}
              >
                <Sparkles size={16} /> Process & Vector Index
              </button>
            </div>
          </div>
        ) : (
          /* Live RAG Ingestion Pipeline Animation */
          <div style={{ padding: '10px 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: processStep >= 1 ? 1 : 0.4 }}>
                <FileText size={20} style={{ color: 'var(--accent-blue)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>1. Text & Layout Extraction</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Parsing raw PDF text stream & formatting tables...</div>
                </div>
                {processStep > 1 && <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: processStep >= 2 ? 1 : 0.4 }}>
                <Cpu size={20} style={{ color: 'var(--accent-teal)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>2. Dynamic Chunking (512 tokens / 50 overlap)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Generating overlapping semantically aware text blocks...</div>
                </div>
                {processStep > 2 && <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: processStep >= 3 ? 1 : 0.4 }}>
                <Sparkles size={20} style={{ color: 'var(--accent-cyan)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>3. Dense Embedding Generation</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mapping chunks into 1536-dimensional vector space...</div>
                </div>
                {processStep > 3 && <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: processStep >= 4 ? 1 : 0.4 }}>
                <Database size={20} style={{ color: 'var(--accent-emerald)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>4. Vector Storage Ingestion (ChromaDB)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Writing HNSW index into target vector collection...</div>
                </div>
                {processStep > 4 && <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
