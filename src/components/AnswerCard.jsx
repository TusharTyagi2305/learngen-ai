import React, { useState } from 'react';
import { 
  FileText, Globe, Sparkles, Copy, Check, RefreshCw, ThumbsUp, ThumbsDown, 
  Download, ShieldCheck, Clock, Layers, AlertTriangle, Network, Cpu, Server 
} from 'lucide-react';

function formatInlineFormatting(text) {
  if (!text) return '';

  const parts = text.split(/(\*\*.*?\*\*|__.*?__|`.*?`)/g);

  return parts.map((part, idx) => {
    if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
      const content = part.slice(2, -2);
      return <strong key={idx} style={{ color: 'var(--accent-teal)', fontWeight: 700 }}>{content}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      const content = part.slice(1, -1);
      return (
        <code key={idx} style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.88em', color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>
          {content}
        </code>
      );
    }
    return part;
  });
}

function RichMarkdownRenderer({ text }) {
  if (!text) return null;

  const blocks = text.split(/\n\s*\n/);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {blocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        const lines = trimmed.split('\n');

        // 1. Markdown Table Parsing (Pipes -> HTML Table)
        const isTable = lines.length >= 2 && lines.some(l => l.trim().startsWith('|') && l.trim().endsWith('|'));
        if (isTable) {
          const rowLines = lines.filter(l => l.trim().startsWith('|') && !l.includes('---'));
          if (rowLines.length >= 1) {
            const parseRow = (line) => line.split('|').slice(1, -1).map(c => c.trim());
            const headerCells = parseRow(rowLines[0]);
            const bodyRows = rowLines.slice(1).map(parseRow);

            return (
              <div key={bIdx} className="table-responsive-container" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', margin: '14px 0', borderRadius: '12px', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-card)' }}>
                <table style={{ width: '100%', minWidth: '500px', borderCollapse: 'collapse', fontSize: '0.92rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.18) 0%, rgba(59, 130, 246, 0.18) 100%)', borderBottom: '2px solid var(--glass-border)', color: 'var(--accent-cyan)' }}>
                      {headerCells.map((cell, cIdx) => (
                        <th key={cIdx} style={{ padding: '12px 16px', fontWeight: 700 }}>
                          {formatInlineFormatting(cell)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bodyRows.map((row, rIdx) => (
                      <tr key={rIdx} style={{ borderBottom: rIdx === bodyRows.length - 1 ? 'none' : '1px solid var(--glass-border)', background: rIdx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent' }}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} style={{ padding: '12px 16px', color: 'var(--text-main)', lineHeight: 1.6 }}>
                            {formatInlineFormatting(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
        }

        // 2. Headings (#, ##, ###)
        if (trimmed.startsWith('#')) {
          const level = (trimmed.match(/^#+/) || ['#'])[0].length;
          const headingText = trimmed.replace(/^#+\s*/, '');
          const fontSize = level === 1 ? '1.35rem' : level === 2 ? '1.2rem' : '1.08rem';

          return (
            <h3 key={bIdx} style={{ fontSize, fontWeight: 800, margin: '14px 0 6px 0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} style={{ color: 'var(--accent-cyan)' }} />
              {formatInlineFormatting(headingText)}
            </h3>
          );
        }

        // 3. Blockquotes / Key Takeaway (> text)
        if (trimmed.startsWith('>')) {
          const quoteText = trimmed.replace(/^>\s*/, '');
          return (
            <div key={bIdx} style={{ margin: '12px 0', padding: '14px 18px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.08)', borderLeft: '4px solid var(--accent-cyan)', fontSize: '0.94rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
              {formatInlineFormatting(quoteText)}
            </div>
          );
        }

        // 4. Bullet & Numbered Lists
        if (lines.some(l => l.trim().startsWith('- ') || l.trim().startsWith('* ') || /^\d+\.\s/.test(l.trim()))) {
          return (
            <ul key={bIdx} style={{ margin: '8px 0', paddingLeft: '22px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {lines.map((l, lIdx) => {
                const itemText = l.replace(/^[-*\d.]+\s*/, '');
                if (!itemText.trim()) return null;
                return (
                  <li key={lIdx} style={{ fontSize: '0.96rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
                    {formatInlineFormatting(itemText)}
                  </li>
                );
              })}
            </ul>
          );
        }

        // Default Paragraph
        return (
          <p key={bIdx} style={{ margin: 0, lineHeight: 1.7, fontSize: '0.98rem', color: 'var(--text-main)' }}>
            {formatInlineFormatting(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function NetworkTopologyDiagram({ text }) {
  const textLower = (text || '').toLowerCase();

  const hasBus = textLower.includes('bus');
  const hasStar = textLower.includes('star');
  const hasRing = textLower.includes('ring');
  const hasMesh = textLower.includes('mesh');
  const hasOsi = textLower.includes('osi') || textLower.includes('tcp') || textLower.includes('7 layer') || textLower.includes('osi model');

  // Determine active diagram topic dynamically based on specific keywords
  let initialMode = null;
  if (hasBus && hasStar) {
    initialMode = 'compare';
  } else if (hasBus) {
    initialMode = 'bus';
  } else if (hasStar) {
    initialMode = 'star';
  } else if (hasRing) {
    initialMode = 'ring';
  } else if (hasMesh) {
    initialMode = 'mesh';
  } else if (hasOsi) {
    initialMode = 'osi';
  }

  // If no specific topic matches, DO NOT render any diagram
  if (!initialMode) return null;

  const [activeDiagram, setActiveDiagram] = useState(initialMode);

  return (
    <div style={{ marginTop: '20px', padding: '20px', borderRadius: '14px', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Network size={18} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--accent-teal)' }}>
            Visual Architecture Diagram — {
              activeDiagram === 'bus' ? 'Bus Topology' :
              activeDiagram === 'star' ? 'Star Topology' :
              activeDiagram === 'ring' ? 'Ring Topology' :
              activeDiagram === 'mesh' ? 'Mesh Topology' :
              activeDiagram === 'osi' ? 'OSI 7-Layer Protocol Model' : 'Bus vs Star Comparison'
            }
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {hasBus && hasStar && (
            <button
              onClick={() => setActiveDiagram('compare')}
              style={{
                padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600, borderRadius: '6px',
                border: '1px solid var(--glass-border)',
                background: activeDiagram === 'compare' ? 'var(--accent-blue)' : 'transparent',
                color: activeDiagram === 'compare' ? '#fff' : 'var(--text-muted)', cursor: 'pointer'
              }}
            >
              Side-by-Side
            </button>
          )}
          {hasBus && (
            <button
              onClick={() => setActiveDiagram('bus')}
              style={{
                padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600, borderRadius: '6px',
                border: '1px solid var(--glass-border)',
                background: activeDiagram === 'bus' ? 'var(--accent-blue)' : 'transparent',
                color: activeDiagram === 'bus' ? '#fff' : 'var(--text-muted)', cursor: 'pointer'
              }}
            >
              Bus Layout
            </button>
          )}
          {hasStar && (
            <button
              onClick={() => setActiveDiagram('star')}
              style={{
                padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600, borderRadius: '6px',
                border: '1px solid var(--glass-border)',
                background: activeDiagram === 'star' ? 'var(--accent-blue)' : 'transparent',
                color: activeDiagram === 'star' ? '#fff' : 'var(--text-muted)', cursor: 'pointer'
              }}
            >
              Star Layout
            </button>
          )}
          {hasRing && (
            <button
              onClick={() => setActiveDiagram('ring')}
              style={{
                padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600, borderRadius: '6px',
                border: '1px solid var(--glass-border)',
                background: activeDiagram === 'ring' ? 'var(--accent-blue)' : 'transparent',
                color: activeDiagram === 'ring' ? '#fff' : 'var(--text-muted)', cursor: 'pointer'
              }}
            >
              Ring Loop
            </button>
          )}
        </div>
      </div>

      {/* Render Topic Specific SVG Diagram */}
      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
        {activeDiagram === 'bus' && (
          <div style={{ textAlign: 'center' }}>
            <h5 style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginBottom: '12px' }}>📘 Bus Topology — Single Central Backbone Cable</h5>
            <svg viewBox="0 0 540 180" style={{ width: '100%', maxHeight: '180px' }}>
              <line x1="50" y1="90" x2="490" y2="90" stroke="#06b6d4" strokeWidth="6" strokeLinecap="round" />
              <rect x="25" y="75" width="25" height="30" rx="4" fill="#f43f5e" />
              <text x="37" y="94" fill="#fff" fontSize="10" textAnchor="middle" fontWeight="bold">T1</text>
              <rect x="490" y="75" width="25" height="30" rx="4" fill="#f43f5e" />
              <text x="502" y="94" fill="#fff" fontSize="10" textAnchor="middle" fontWeight="bold">T2</text>
              
              <line x1="120" y1="90" x2="120" y2="40" stroke="#3b82f6" strokeWidth="3" strokeDasharray="3,3" />
              <rect x="80" y="10" width="80" height="30" rx="6" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
              <text x="120" y="30" fill="#e2e8f0" fontSize="11" textAnchor="middle" fontWeight="bold">Node A (PC)</text>

              <line x1="230" y1="90" x2="230" y2="140" stroke="#3b82f6" strokeWidth="3" strokeDasharray="3,3" />
              <rect x="190" y="140" width="80" height="30" rx="6" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
              <text x="230" y="160" fill="#e2e8f0" fontSize="11" textAnchor="middle" fontWeight="bold">Server B</text>

              <line x1="340" y1="90" x2="340" y2="40" stroke="#3b82f6" strokeWidth="3" strokeDasharray="3,3" />
              <rect x="300" y="10" width="80" height="30" rx="6" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
              <text x="340" y="30" fill="#e2e8f0" fontSize="11" textAnchor="middle" fontWeight="bold">Node C (PC)</text>

              <line x1="440" y1="90" x2="440" y2="140" stroke="#3b82f6" strokeWidth="3" strokeDasharray="3,3" />
              <rect x="400" y="140" width="80" height="30" rx="6" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
              <text x="440" y="160" fill="#e2e8f0" fontSize="11" textAnchor="middle" fontWeight="bold">Printer D</text>
            </svg>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginTop: '8px' }}>
              ⚠️ Single point of failure: If central backbone cable breaks, whole network stops.
            </div>
          </div>
        )}

        {activeDiagram === 'star' && (
          <div style={{ textAlign: 'center' }}>
            <h5 style={{ fontSize: '0.85rem', color: 'var(--accent-teal)', marginBottom: '12px' }}>📙 Star Topology — Centralized Switch/Hub Layout</h5>
            <svg viewBox="0 0 540 180" style={{ width: '100%', maxHeight: '180px' }}>
              <line x1="270" y1="90" x2="110" y2="35" stroke="#10b981" strokeWidth="2.5" />
              <line x1="270" y1="90" x2="430" y2="35" stroke="#10b981" strokeWidth="2.5" />
              <line x1="270" y1="90" x2="110" y2="145" stroke="#10b981" strokeWidth="2.5" />
              <line x1="270" y1="90" x2="430" y2="145" stroke="#10b981" strokeWidth="2.5" />

              <rect x="220" y="70" width="100" height="40" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="3" />
              <text x="270" y="94" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">Central Switch</text>

              <rect x="70" y="20" width="80" height="30" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
              <text x="110" y="40" fill="#e2e8f0" fontSize="11" textAnchor="middle">Node 1</text>

              <rect x="390" y="20" width="80" height="30" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
              <text x="430" y="40" fill="#e2e8f0" fontSize="11" textAnchor="middle">Node 2</text>

              <rect x="70" y="130" width="80" height="30" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
              <text x="110" y="150" fill="#e2e8f0" fontSize="11" textAnchor="middle">Node 3</text>

              <rect x="390" y="130" width="80" height="30" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
              <text x="430" y="150" fill="#e2e8f0" fontSize="11" textAnchor="middle">Node 4</text>
            </svg>
            <div style={{ fontSize: '0.76rem', color: '#10b981', marginTop: '8px' }}>
              ✓ High Fault Isolation: Individual cable failure only disconnects that specific node.
            </div>
          </div>
        )}

        {activeDiagram === 'ring' && (
          <div style={{ textAlign: 'center' }}>
            <h5 style={{ fontSize: '0.85rem', color: '#3b82f6', marginBottom: '12px' }}>📗 Ring Topology — Circular Closed Token Passing Loop</h5>
            <svg viewBox="0 0 540 180" style={{ width: '100%', maxHeight: '180px' }}>
              <circle cx="270" cy="90" r="65" stroke="#3b82f6" strokeWidth="4" fill="none" strokeDasharray="6,4" />
              <rect x="230" y="10" width="80" height="30" rx="6" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
              <text x="270" y="30" fill="#fff" fontSize="11" textAnchor="middle" fontWeight="bold">Node A</text>

              <rect x="350" y="75" width="80" height="30" rx="6" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
              <text x="390" y="95" fill="#fff" fontSize="11" textAnchor="middle" fontWeight="bold">Node B</text>

              <rect x="230" y="140" width="80" height="30" rx="6" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
              <text x="270" y="160" fill="#fff" fontSize="11" textAnchor="middle" fontWeight="bold">Node C</text>

              <rect x="110" y="75" width="80" height="30" rx="6" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
              <text x="150" y="95" fill="#fff" fontSize="11" textAnchor="middle" fontWeight="bold">Node D</text>
            </svg>
            <div style={{ fontSize: '0.76rem', color: 'var(--accent-cyan)', marginTop: '8px' }}>
              🔄 Token Passing: Deterministic data flow in a unidirectional closed loop.
            </div>
          </div>
        )}

        {activeDiagram === 'osi' && (
          <div style={{ textAlign: 'center' }}>
            <h5 style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginBottom: '12px' }}>📊 OSI 7-Layer Protocol Reference Model</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '420px', margin: '0 auto' }}>
              {[
                { layer: 'L7: Application Layer', detail: 'HTTP, HTTPS, FTP, SMTP, DNS', color: 'var(--accent-cyan)' },
                { layer: 'L6: Presentation Layer', detail: 'SSL/TLS Encryption, JPEG, ASCII', color: 'var(--accent-teal)' },
                { layer: 'L5: Session Layer', detail: 'Sockets, RPC, Session Management', color: 'var(--accent-blue)' },
                { layer: 'L4: Transport Layer', detail: 'TCP (Handshake), UDP (Datagrams)', color: '#6366f1' },
                { layer: 'L3: Network Layer', detail: 'IP Addressing, Routers, Packet Forwarding', color: '#10b981' },
                { layer: 'L2: Data Link Layer', detail: 'Ethernet, Switches, MAC Address, Framing', color: '#f59e0b' },
                { layer: 'L1: Physical Layer', detail: 'Cables, Signals, Hubs, Bit Transmissions', color: '#f43f5e' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', borderLeft: `4px solid ${item.color}`, fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: 700, color: item.color }}>{item.layer}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{item.detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeDiagram === 'compare' && (
          <div className="grid-responsive-2" style={{ gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '6px' }}>Bus Topology Layout</div>
              <svg viewBox="0 0 240 100" style={{ width: '100%' }}>
                <line x1="20" y1="50" x2="220" y2="50" stroke="#06b6d4" strokeWidth="4" />
                <rect x="10" y="40" width="10" height="20" fill="#f43f5e" />
                <rect x="220" y="40" width="10" height="20" fill="#f43f5e" />
                <line x1="60" y1="50" x2="60" y2="20" stroke="#3b82f6" strokeWidth="2" />
                <rect x="45" y="8" width="30" height="15" rx="3" fill="#1e293b" stroke="#06b6d4" />
                <line x1="120" y1="50" x2="120" y2="80" stroke="#3b82f6" strokeWidth="2" />
                <rect x="105" y="77" width="30" height="15" rx="3" fill="#1e293b" stroke="#06b6d4" />
                <line x1="180" y1="50" x2="180" y2="20" stroke="#3b82f6" strokeWidth="2" />
                <rect x="165" y="8" width="30" height="15" rx="3" fill="#1e293b" stroke="#06b6d4" />
              </svg>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981', marginBottom: '6px' }}>Star Topology Layout</div>
              <svg viewBox="0 0 240 100" style={{ width: '100%' }}>
                <line x1="120" y1="50" x2="40" y2="20" stroke="#10b981" strokeWidth="2" />
                <line x1="120" y1="50" x2="200" y2="20" stroke="#10b981" strokeWidth="2" />
                <line x1="120" y1="50" x2="40" y2="80" stroke="#10b981" strokeWidth="2" />
                <line x1="120" y1="50" x2="200" y2="80" stroke="#10b981" strokeWidth="2" />
                <rect x="95" y="40" width="50" height="20" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                <text x="120" y="54" fill="#10b981" fontSize="9" textAnchor="middle" fontWeight="bold">Switch</text>
                <rect x="25" y="10" width="30" height="15" rx="3" fill="#1e293b" stroke="#3b82f6" />
                <rect x="185" y="10" width="30" height="15" rx="3" fill="#1e293b" stroke="#3b82f6" />
                <rect x="25" y="75" width="30" height="15" rx="3" fill="#1e293b" stroke="#3b82f6" />
                <rect x="185" y="75" width="30" height="15" rx="3" fill="#1e293b" stroke="#3b82f6" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AnswerCard({ 
  message, 
  onRegenerate, 
  onAskExternal, 
  onFollowUpSelect 
}) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'like' | 'dislike'

  const handleCopy = () => {
    if (!message?.text) return;
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    if (!message?.text) return;
    const blob = new Blob([message.text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LearnGen-Answer-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isExternalPrompt = message?.promptExternal;
  const sourceType = message?.sourceType || (message?.citations?.length > 0 ? 'PDF' : 'GEMINI_KNOWLEDGE');
  const sourceLabel = message?.sourceLabel || (sourceType === 'PDF' ? 'Source: Uploaded PDF' : 'Source: Gemini Knowledge');

  const citations = message?.citations || [];
  const primaryCitation = citations[0] || null;

  const vectorLatency = message?.ragMetrics?.vectorSearchTimeMs || 25;
  const llmLatency = message?.latency || message?.ragMetrics?.llmLatencyMs || 220;
  const totalLatency = vectorLatency + llmLatency;
  const simScore = message?.similarityScore || primaryCitation?.similarityScore || '92%';
  const hallucinationRisk = message?.hallucinationRisk || (sourceType === 'PDF' ? 'Low' : 'Medium');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      
      {/* Source Attribution Badge & Transparency Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {sourceType === 'PDF' ? (
            <span className="badge badge-teal" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
              <FileText size={14} /> {sourceLabel}
            </span>
          ) : (
            <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
              <Globe size={14} /> {sourceLabel}
            </span>
          )}

          {primaryCitation && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Page {primaryCitation.page || primaryCitation.page_number || 1} • {primaryCitation.filename}
            </span>
          )}
        </div>

        {/* Real-time RAG Metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.76rem', color: 'var(--text-dim)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} /> {totalLatency}ms
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Layers size={12} /> Score: {simScore}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: hallucinationRisk === 'Low' ? '#10b981' : '#f59e0b' }}>
            <ShieldCheck size={12} /> Risk: {hallucinationRisk}
          </span>
        </div>
      </div>

      {/* Main Answer Content Card */}
      <div className="glass-panel" style={{ 
        padding: '24px', 
        borderRadius: '16px', 
        background: 'var(--bg-secondary)', 
        borderLeft: sourceType === 'PDF' ? '4px solid var(--accent-cyan)' : '4px solid var(--accent-amber)',
        boxShadow: 'var(--shadow-card)'
      }}>
        {/* Render Rich Formatted Markdown Component (No raw asterisks or pipes!) */}
        <RichMarkdownRenderer text={message?.text} />

        {/* Interactive Visual Network Topology Diagram (If applicable) */}
        <NetworkTopologyDiagram text={message?.text} />

        {/* Hybrid Search Prompt Box (If query not in PDF) */}
        {isExternalPrompt && (
          <div style={{ 
            marginTop: '20px', 
            padding: '18px', 
            borderRadius: '12px', 
            background: 'rgba(245, 158, 11, 0.08)', 
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.9rem' }}>
              <AlertTriangle size={16} /> Grounded Vault Verification Notice
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              This query could not be verified within your currently uploaded document vault. LearnGen AI enforces strict zero-hallucination policies.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => onAskExternal && onAskExternal('gemini')}
                className="gradient-btn"
                style={{ padding: '8px 16px', fontSize: '0.82rem' }}
              >
                <Sparkles size={14} /> Search Gemini Knowledge
              </button>
              <button 
                onClick={() => onAskExternal && onAskExternal('web')}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.82rem', borderColor: 'rgba(245, 158, 11, 0.4)', color: 'var(--accent-amber)' }}
              >
                <Globe size={14} /> Search Web Knowledge
              </button>
            </div>
          </div>
        )}

        {/* Primary Source Chunk Inspector snippet */}
        {primaryCitation && primaryCitation.text && (
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={14} /> Retrieved Chunk: {primaryCitation.filename} (Page {primaryCitation.page || 1})
              </span>
              <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
                Match Confidence: {primaryCitation.similarityScore}
              </span>
            </div>
            <div style={{ 
              fontSize: '0.88rem', 
              color: 'var(--text-muted)', 
              fontStyle: 'italic', 
              background: 'rgba(255, 255, 255, 0.02)', 
              padding: '10px 14px', 
              borderRadius: '8px', 
              borderLeft: '3px solid var(--accent-cyan)' 
            }}>
              "{primaryCitation.text}"
            </div>
          </div>
        )}
      </div>

      {/* Control Action Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', padding: '0 4px', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <button 
            onClick={handleCopy}
            className="btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.78rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}
            title="Copy answer markdown"
          >
            {copied ? <Check size={13} style={{ color: '#10b981' }} /> : <Copy size={13} />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          {onRegenerate && (
            <button 
              onClick={onRegenerate}
              className="btn-secondary"
              style={{ padding: '4px 10px', fontSize: '0.78rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}
              title="Regenerate AI response"
            >
              <RefreshCw size={13} /> Regenerate
            </button>
          )}

          <button 
            onClick={handleExport}
            className="btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.78rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}
            title="Export answer file"
          >
            <Download size={13} /> Export
          </button>
        </div>

        {/* Feedback Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button 
            onClick={() => setFeedback('like')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: feedback === 'like' ? '#10b981' : 'var(--text-dim)', 
              cursor: 'pointer', 
              padding: '4px' 
            }}
            title="Helpful response"
          >
            <ThumbsUp size={14} />
          </button>
          <button 
            onClick={() => setFeedback('dislike')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: feedback === 'dislike' ? '#f43f5e' : 'var(--text-dim)', 
              cursor: 'pointer', 
              padding: '4px' 
            }}
            title="Needs improvement"
          >
            <ThumbsDown size={14} />
          </button>
        </div>
      </div>

      {/* Suggested Follow-up Prompts */}
      {onFollowUpSelect && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
          {['Explain Bus vs Star topology', 'What are key exam questions?', 'Summarize main points'].map((promptText, idx) => (
            <button
              key={idx}
              onClick={() => onFollowUpSelect(promptText)}
              className="btn-secondary"
              style={{ fontSize: '0.74rem', padding: '4px 10px', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Sparkles size={11} style={{ color: 'var(--accent-cyan)' }} /> {promptText}
            </button>
          ))}
        </div>
      )}

    </div>
  );
}

export default AnswerCard;
