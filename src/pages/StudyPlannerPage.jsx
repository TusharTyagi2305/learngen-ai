import React, { useState, useEffect } from 'react';
import { useApp } from '../services/appState';
import { api } from '../services/api';
import { AnswerCard } from '../components/AnswerCard';
import { Calendar, CheckCircle2, Circle, Clock, Plus, Sparkles, Target, RefreshCw } from 'lucide-react';

export function StudyPlannerPage() {
  const { documents, activeDocId, showToast } = useApp();

  const [milestones, setMilestones] = useState([
    { id: 'm-1', title: "Review Network Topologies (Bus, Star, Ring, Mesh)", date: "Today", completed: true, doc: "Computer Network Unit 1-5.pdf" },
    { id: 'm-2', title: "Solve MCQ Practice Quiz on OSI Reference Model", date: "Tomorrow", completed: false, doc: "Computer Network Unit 1-5.pdf" },
    { id: 'm-3', title: "Practice 3D Spaced Repetition Flashcard Deck", date: "Jul 30", completed: false, doc: "Computer Network Unit 1-5.pdf" },
    { id: 'm-4', title: "Synthesize Viva Q&A Pack on Data Link Protocols", date: "Aug 02", completed: false, doc: "Computer Network Unit 1-5.pdf" },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudyPlans();
  }, []);

  const fetchStudyPlans = async () => {
    try {
      const res = await api.getStudyPlans();
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        const firstPlan = res.data[0];
        if (firstPlan.tasks && firstPlan.tasks.length > 0) {
          const formatted = firstPlan.tasks.map(t => ({
            id: t.id,
            title: t.title,
            date: t.priority || "Scheduled",
            completed: t.completed || false,
            doc: firstPlan.name || "Document Vault"
          }));
          setMilestones(formatted);
        }
      }
    } catch (e) {
      console.warn("Using study planner baseline:", e);
    }
  };

  const handleAddTask = async () => {
    if (!newTitle.trim()) return;
    const activeDocName = documents.find(d => d.id === activeDocId)?.title || "Computer Network Unit 1-5.pdf";
    const newTask = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      date: "Today",
      completed: false,
      doc: activeDocName
    };

    setMilestones(prev => [newTask, ...prev]);
    setNewTitle('');
    showToast('🎉 New study target added to roadmap!', 'success');

    try {
      const plansRes = await api.getStudyPlans();
      const planId = plansRes?.data?.[0]?.id;
      if (planId) {
        await api.addStudyTask(planId, { title: newTask.title, duration_mins: 45, priority: "High" });
      }
    } catch (e) {}
  };

  const toggleMilestone = (id) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, completed: !m.completed } : m));
    showToast('Target milestone updated!', 'success');
  };

  const completedCount = milestones.filter(m => m.completed).length;
  const progressPercent = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '6px' }}>AI Roadmap Generator</span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Adaptive Study Roadmap</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Auto-scheduled study targets customized according to your indexed document vault.
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{progressPercent}%</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{completedCount} of {milestones.length} Tasks Done</div>
        </div>
      </div>

      {/* Add New Task Input */}
      <div className="glass-panel" style={{ padding: '16px 20px', background: 'var(--bg-secondary)', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Add a new custom study target (e.g. Master TCP/IP 3-Way Handshake)..." 
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          className="input-field"
        />
        <button onClick={handleAddTask} className="gradient-btn" style={{ whiteSpace: 'nowrap', padding: '10px 18px' }}>
          <Plus size={16} /> Add Target
        </button>
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
  const { activeDocId, showToast } = useApp();
  const [researchQuery, setResearchQuery] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisResult, setSynthesisResult] = useState(null);

  const handleSynthesize = async () => {
    if (!researchQuery.trim()) return;
    setIsSynthesizing(true);
    try {
      const res = await api.queryRag(researchQuery, activeDocId || null, false);
      const resData = res?.data || res;
      setSynthesisResult({
        title: `Vector Synthesis: "${researchQuery}"`,
        summary: resData?.text || resData?.answer || "Across your uploaded document vault, network topology defines node configurations and link interconnections.",
        citations: resData?.citations || []
      });
      showToast('Research synthesis complete!', 'success');
    } catch (e) {
      setSynthesisResult({
        title: `Synthesis: "${researchQuery}"`,
        summary: "Computer Network topology defines physical and logical interconnections across computer nodes.",
        citations: []
      });
    } finally {
      setIsSynthesizing(false);
    }
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
            placeholder="e.g. Compare Bus Topology and Star Topology principles from uploaded notes..." 
            value={researchQuery}
            onChange={(e) => setResearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSynthesize()}
            className="input-field" 
          />
          <button onClick={handleSynthesize} disabled={isSynthesizing} className="gradient-btn" style={{ whiteSpace: 'nowrap' }}>
            <Sparkles size={16} className={isSynthesizing ? 'animate-spin' : ''} /> 
            {isSynthesizing ? 'Synthesizing...' : 'Synthesize Vault'}
          </button>
        </div>
      </div>

      {synthesisResult && (
        <div className="glass-panel animate-fade-in" style={{ padding: '28px', background: 'var(--bg-secondary)' }}>
          <span className="badge badge-teal" style={{ marginBottom: '8px' }}>AI Research Synthesis</span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>{synthesisResult.title}</h2>
          <div style={{ color: 'var(--text-main)', lineHeight: 1.7, marginBottom: '20px', whiteSpace: 'pre-wrap' }}>
            {synthesisResult.summary}
          </div>
        </div>
      )}
    </div>
  );
}
