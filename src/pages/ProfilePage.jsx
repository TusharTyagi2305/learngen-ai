import React, { useState } from 'react';
import { useApp } from '../services/appState';
import { User, Mail, Shield, Key, Bell, Sun, Moon, CheckCircle2, Lock } from 'lucide-react';

export function ProfilePage() {
  const { currentRole } = useApp();

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Account Profile</h1>

      <div className="glass-panel" style={{ padding: '28px', background: 'var(--bg-secondary)', display: 'flex', gap: '24px', alignItems: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2rem', fontWeight: 800 }}>
          TS
        </div>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Tushar Sharma</h2>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>tushar@example.com</div>
          <span className="badge badge-purple">Role: {currentRole} Persona</span>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '28px', background: 'var(--bg-secondary)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Personal Details</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Full Name</label>
            <input type="text" defaultValue="Tushar Sharma" className="input-field" />
          </div>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Academic Institution</label>
            <input type="text" defaultValue="Department of Computer Science & Engineering" className="input-field" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SettingsPage() {
  const { theme, toggleTheme, ragConfig, setRagConfig, showToast } = useApp();
  const [apiKey, setApiKey] = useState('sk-gemini-v1-987a65b4321');

  const handleSaveSettings = () => {
    showToast('Settings & API Configuration Saved!', 'success');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Platform Settings & Keys</h1>

      <div className="glass-panel" style={{ padding: '28px', background: 'var(--bg-secondary)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Visual Theme Preference</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Active Interface Theme</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Currently set to {theme.toUpperCase()} mode.</div>
          </div>
          <button onClick={toggleTheme} className="btn-secondary">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />} Toggle Theme
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '28px', background: 'var(--bg-secondary)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>AI API Keys Configuration</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Gemini / OpenAI API Key</label>
            <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="input-field" />
          </div>
          <button onClick={handleSaveSettings} className="gradient-btn" style={{ alignSelf: 'flex-start' }}>
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
