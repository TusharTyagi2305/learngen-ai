import React, { useState } from 'react';
import { useApp } from '../services/appState';
import { Brain, Lock, Mail, User, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function AuthPages() {
  const { currentPage, setCurrentPage, setCurrentRole } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRoleState] = useState('Student');
  const [resetSent, setResetSent] = useState(false);

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setCurrentRole(role);
    setCurrentPage('dashboard');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '36px', background: 'var(--bg-secondary)' }}>
        
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', background: 'var(--gradient-primary)', padding: '10px', borderRadius: '14px', marginBottom: '12px' }}>
            <Brain style={{ color: '#fff', width: '28px', height: '28px' }} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            {currentPage === 'login' && 'Welcome Back to LearnGen'}
            {currentPage === 'register' && 'Create Your LearnGen Account'}
            {currentPage === 'forgot-password' && 'Reset Password'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {currentPage === 'login' && 'Sign in to access your RAG document vault and AI study tools.'}
            {currentPage === 'register' && 'Join 100,000+ students & researchers building RAG knowledge vaults.'}
            {currentPage === 'forgot-password' && 'Enter your email to receive a password reset token.'}
          </p>
        </div>

        {/* FORGOT PASSWORD VIEW */}
        {currentPage === 'forgot-password' ? (
          <div>
            {!resetSent ? (
              <form onSubmit={(e) => { e.preventDefault(); setResetSent(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Account Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                    <input 
                      type="email" 
                      required 
                      placeholder="student@university.edu" 
                      className="input-field"
                      style={{ paddingLeft: '36px' }} 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <button type="submit" className="gradient-btn" style={{ justifyContent: 'center' }}>
                  Send Password Reset Link
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <CheckCircle2 size={36} style={{ color: 'var(--accent-emerald)', margin: '0 auto 8px' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Reset Link Dispatched!</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Check email inbox for your JWT verification reset token.</p>
              </div>
            )}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button onClick={() => setCurrentPage('login')} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.85rem', cursor: 'pointer' }}>
                ← Return to Login
              </button>
            </div>
          </div>
        ) : (
          /* LOGIN & REGISTER FORMS */
          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Persona Selector */}
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Account Persona</label>
              <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: 'var(--radius-sm)' }}>
                {['Student', 'Teacher', 'Admin'].map(r => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRoleState(r)}
                    style={{
                      flex: 1,
                      padding: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      background: role === r ? 'var(--accent-blue)' : 'transparent',
                      color: role === r ? '#fff' : 'var(--text-muted)'
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input 
                  type="email" 
                  required 
                  placeholder="tushar@university.edu" 
                  className="input-field" 
                  style={{ paddingLeft: '36px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Password</label>
                {currentPage === 'login' && (
                  <button type="button" onClick={() => setCurrentPage('forgot-password')} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.78rem', cursor: 'pointer' }}>
                    Forgot?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••••••" 
                  className="input-field" 
                  style={{ paddingLeft: '36px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="gradient-btn" style={{ justifyContent: 'center', padding: '12px' }}>
              {currentPage === 'login' ? 'Sign In to Workspace' : 'Create Free Student Account'} <ArrowRight size={16} />
            </button>

            {/* Social OAuth Simulation */}
            <div style={{ position: 'relative', textAlign: 'center', margin: '8px 0' }}>
              <div style={{ borderBottom: '1px solid var(--glass-border)', position: 'absolute', top: '50%', left: 0, right: 0 }} />
              <span style={{ position: 'relative', background: 'var(--bg-secondary)', padding: '0 10px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>OR</span>
            </div>

            <button type="button" onClick={handleAuthSubmit} className="btn-secondary" style={{ justifyContent: 'center' }}>
              Continue with Google OAuth 2.0
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {currentPage === 'login' ? (
                <>Don't have an account? <button type="button" onClick={() => setCurrentPage('register')} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontWeight: 600, cursor: 'pointer' }}>Register</button></>
              ) : (
                <>Already have an account? <button type="button" onClick={() => setCurrentPage('login')} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontWeight: 600, cursor: 'pointer' }}>Sign In</button></>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
