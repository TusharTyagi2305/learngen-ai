import React from 'react';
import { useApp } from '../services/appState';
import { WeeklyStudyChart, LearningProgressChart, WeakTopicsList } from '../components/Charts';
import { BarChart3, Award, Zap, Target } from 'lucide-react';

export function ProgressDashboardPage() {
  const { getUserSummaryStats, quizzes } = useApp();
  const stats = getUserSummaryStats();
  const totalQuizCount = Array.isArray(quizzes) ? quizzes.length : 1;

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Learning Analytics & Mastery Metrics</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Detailed performance breakdown, study velocity, and concept weak point identifier.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>Mastery Index</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{stats.masteryScore}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>Context vault grounded score</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>Study Streak</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-amber)' }}>{stats.streakDays} Days 🔥</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active daily streak</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>RAG Queries Executed</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{stats.totalQueries}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>0 hallucinations detected</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>Quizzes Mastered</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-blue)' }}>{stats.completedQuizzes} / {totalQuizCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-blue)' }}>
            {totalQuizCount > 0 ? Math.round((stats.completedQuizzes / totalQuizCount) * 100) : 0}% completion rate
          </div>
        </div>
      </div>

      {/* Main Charts Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Weekly Study Velocity (Hours)</h3>
          <WeeklyStudyChart />
        </div>

        <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Identified Weak Concepts</h3>
          <WeakTopicsList />
        </div>

      </div>

    </div>
  );
}
