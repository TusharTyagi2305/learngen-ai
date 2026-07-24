import React, { useState } from 'react';
import { useApp } from '../services/appState';
import { queryRagEngine } from '../services/mockRAG';
import { 
  Send, Sparkles, ShieldCheck, FileText, Layers, ExternalLink, 
  HelpCircle, RefreshCw, BookOpen, ThumbsUp, Copy 
} from 'lucide-react';

export function AIChatPage() {
  const { documents, ragConfig, setActiveCitation, showToast } = useApp();
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello Tushar! I'm your LearnGen AI RAG Study Assistant. I answer questions strictly using your uploaded document vault. What would you like to explore today?",
      citations: [],
      timestamp: "10:42 AM"
    }
  ]);
  
  const [inputQuery, setInputQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSendMessage = (textToSend = inputQuery) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsSearching(true);

    setTimeout(() => {
      const ragResult = queryRagEngine(textToSend, documents, ragConfig);
      
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: ragResult.answer,
        citations: ragResult.citations,
        latency: ragResult.llmLatencyMs,
        hallucinationRisk: ragResult.hallucinationRisk,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsSearching(false);
    }, 800);
  };

  return (
    <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      
      {/* Top Studio Control Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            AI RAG Learning Studio <span className="badge badge-teal">Gemini 1.5 Pro RAG</span>
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Strictly grounded in {documents.length} active uploaded vault documents.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className="badge badge-emerald">
            <ShieldCheck size={14} /> Strict Grounding Active (T=0.2)
          </div>
        </div>
      </div>

      {/* Preset Prompt Template Pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          "Explain Quantum Superposition formulation",
          "What is Multi-Head Attention scaling factor?",
          "Summarize CAP Theorem trade-offs",
          "Key formula breakdown for exam prep"
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', whiteSpace: 'nowrap', padding: '6px 14px', borderRadius: '999px' }}
          >
            <Sparkles size={12} style={{ color: 'var(--accent-teal)' }} /> {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log Area */}
      <div className="glass-panel" style={{ flex: 1, overflowY: 'auto', padding: '20px', background: 'var(--bg-secondary)', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            
            <div style={{
              maxWidth: '80%',
              background: msg.sender === 'user' ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
              color: msg.sender === 'user' ? '#fff' : 'var(--text-main)',
              padding: '14px 18px',
              borderRadius: msg.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
              boxShadow: 'var(--shadow-card)',
              border: msg.sender === 'user' ? 'none' : '1px solid var(--glass-border)',
              borderLeft: msg.sender === 'ai' ? '3px solid var(--accent-blue)' : 'none'
            }}>
              <div style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>
                {msg.text}
              </div>

              {/* RAG Context Citation Tags */}
              {msg.citations && msg.citations.length > 0 && (
                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--glass-border)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>
                    Retrieved Grounding Sources ({msg.citations.length})
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {msg.citations.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveCitation(c)}
                        style={{
                          background: 'rgba(6, 182, 212, 0.15)',
                          border: '1px solid rgba(6, 182, 212, 0.3)',
                          color: 'var(--accent-cyan)',
                          fontSize: '0.75rem',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <FileText size={12} /> {c.documentTitle} (Pg {c.page})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px', padding: '0 4px' }}>
              {msg.timestamp} {msg.latency && `• ${msg.latency}ms • Hallucination Risk: ${msg.hallucinationRisk}`}
            </div>

          </div>
        ))}

        {isSearching && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <RefreshCw size={16} className="animate-spin" style={{ color: 'var(--accent-cyan)' }} />
            Retrieving ChromaDB vector embeddings & generating answer...
          </div>
        )}
      </div>

      {/* Message Input Box */}
      <div className="glass-panel" style={{ padding: '8px 12px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Ask anything about your uploaded notes and research papers..." 
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="input-field"
          style={{ border: 'none', background: 'transparent' }}
        />
        <button onClick={() => handleSendMessage()} className="gradient-btn" style={{ padding: '10px 18px' }}>
          <Send size={16} /> Send
        </button>
      </div>
    </div>
  );
}
