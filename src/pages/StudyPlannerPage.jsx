import React, { useState } from 'react';
import { useApp } from '../services/appState';
import { Calendar, CheckCircle2, Circle, Clock, Plus, Sparkles, Target } from 'lucide-react';

export function StudyPlannerPage() {
  const { showToast } = useApp();

  const [milestones, setMilestones] = useState([
    { id: 1, title: "Master Quantum Superposition & Entanglement", date: "Today", completed: true, doc: "Quantum_Computing_Ch3.pdf" },
    { id: 2, title: "Review Multi-Head Attention Scaling Equations", date: "Tomorrow", completed: false, doc: "Deep_Learning_Architectures_Summary.docx" },
    { id: 3, title: "Complete CAP Theorem Scenario Quiz", date: "Jul 26", completed: false, doc: "Distributed_Systems_Cap_Theorem.pptx" },
    { id: 4, title: "Synthesize Transformer Residual Connections", date: "Jul 28", completed: false, doc: "Deep_Learning_Architectures_Summary.docx" },
  ]);

  const toggleMilestone = (id) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, completed: !m.completed } : m));
    showToast('Milestone updated', 'success');
  };

  const completedCount = milestones.filter(m => m.completed).length;
  const progressPercent = Math.round((completedCount / milestones.length) * 100);

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '6px' }}>AI Roadmap Generator</span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Adaptive Study Roadmap</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Auto-scheduled study targets customized according to your exam deadlines.
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{progressPercent}%</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{completedCount} of {milestones.length} Tasks Done</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--gradient-primary)', transition: 'width 0.3s ease' }} />
      </div>

      {/* Milestone List */}
      <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Upcoming Scheduled Targets</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {milestones.map(item => (
            <div 
              key={item.id}
              onClick={() => toggleMilestone(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                padding: '16px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                border: item.completed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--glass-border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {item.completed ? (
                  <CheckCircle2 size={22} style={{ color: 'var(--accent-emerald)' }} />
                ) : (
                  <Circle size={22} style={{ color: 'var(--text-dim)' }} />
                )}
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, textDecoration: item.completed ? 'line-through' : 'none', color: item.completed ? 'var(--text-dim)' : 'var(--text-main)' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Target Doc: {item.doc}
                  </div>
                </div>
              </div>

              <span className="badge badge-teal">{item.date}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export function ResearchAssistantPage() {
  const { documents, showToast } = useApp();
  const [researchQuery, setResearchQuery] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisResult, setSynthesisResult] = useState(null);

  const handleSynthesize = () => {
    if (!researchQuery.trim()) return;
    setIsSynthesizing(true);
    setTimeout(() => {
      setSynthesisResult({
        title: `Synthesis: "${researchQuery}"`,
        summary: "Across your 3 uploaded documents (Quantum, Deep Learning, Distributed Systems), the common underlying mathematical framework involves high-dimensional matrix projections and probability amplitudes.",
        keyTakeaways: [
          "Quantum qubits maintain amplitude states normalized to unity.",
          "Softmax scaling in Transformer attention prevents numerical instability.",
          "Network partitions in CAP theorem force consistency vs availability trade-offs."
        ]
      });
      setIsSynthesizing(false);
      showToast('Research synthesis complete!', 'success');
    }, 1200);
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Deep Research Paper Assistant</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Cross-document synthesis, research paper summaries, and citation bibliographies.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Multi-Document Cross Query</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            placeholder="e.g. Compare matrix operations between Quantum Computing and Deep Learning Attention..." 
            value={researchQuery}
            onChange={(e) => setResearchQuery(e.target.value)}
            className="input-field" 
          />
          <button onClick={handleSynthesize} className="gradient-btn" style={{ whiteSpace: 'nowrap' }}>
            <Sparkles size={16} /> Synthesize Papers
          </button>
        </div>
      </div>

      {synthesisResult && (
        <div className="glass-panel animate-fade-in" style={{ padding: '28px', background: 'var(--bg-secondary)' }}>
          <span className="badge badge-teal" style={{ marginBottom: '8px' }}>AI Research Synthesis</span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>{synthesisResult.title}</h2>
          <p style={{ color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '20px' }}>{synthesisResult.summary}</p>

          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--accent-cyan)' }}>Key Cross-Paper Findings:</h4>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            {synthesisResult.keyTakeaways.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
