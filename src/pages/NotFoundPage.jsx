import React from 'react';
import { useApp } from '../services/appState';
import { Brain, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  const { setCurrentPage } = useApp();

  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
      <div className="glass-panel" style={{ padding: '40px', maxWidth: '500px', background: 'var(--bg-secondary)' }}>
        <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--accent-purple)', marginBottom: '12px' }}>404</div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>Vector Path Not Found</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
          The requested page route does not exist in the LearnGen AI workspace embedding index.
        </p>
        <button onClick={() => setCurrentPage('dashboard')} className="gradient-btn">
          <ArrowLeft size={16} /> Return to Workspace Dashboard
        </button>
      </div>
    </div>
  );
}
