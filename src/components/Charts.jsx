import React from 'react';
import { useApp } from '../services/appState';

// Weekly Study Hours Bar Chart Component
export function WeeklyStudyChart({ weeklyData }) {
  const { getUserWeeklyData } = useApp();
  const data = weeklyData || getUserWeeklyData();
  
  const maxHours = Math.max(4, ...data.map(d => d.hours || 0));

  return (
    <div style={{ padding: '10px 0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', gap: '12px' }}>
        {data.map((item, idx) => {
          const heightPercent = (item.hours / maxHours) * 100;
          return (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>{item.hours}h</div>
              <div 
                style={{
                  width: '100%',
                  height: `${Math.max(8, heightPercent)}%`,
                  background: idx === (new Date().getDay() + 6) % 7 ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
                  borderRadius: '6px 6px 2px 2px',
                  transition: 'height 0.5s ease',
                  border: '1px solid var(--glass-border)'
                }}
                title={`${item.day}: ${item.hours} hrs study (${item.queries || 0} RAG queries)`}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{item.day}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Learning Progress Area Trend Chart
export function LearningProgressChart({ weeklyData }) {
  const { getUserWeeklyData } = useApp();
  const data = weeklyData || getUserWeeklyData();
  
  const maxH = Math.max(3, ...data.map(d => d.hours || 0));
  const points = data.map((item, idx) => {
    const x = (idx / Math.max(1, data.length - 1)) * 300;
    const y = 100 - ((item.hours / maxH) * 75);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  
  const pathD = `M0,110 L${points.join(' L')} L300,120 L0,120 Z`;
  const strokeD = `M${points.join(' L')}`;

  return (
    <div style={{ width: '100%', height: '140px', position: 'relative' }}>
      <svg width="100%" height="120" viewBox="0 0 300 120" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={pathD} fill="url(#areaGrad)" />
        <path d={strokeD} fill="none" stroke="var(--accent-cyan)" strokeWidth="3" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
        <span>Week 1</span>
        <span>Week 2</span>
        <span>Week 3</span>
        <span>Week 4 (Current)</span>
      </div>
    </div>
  );
}

// Weak Topics Breakdown Progress Bars
export function WeakTopicsList({ topics: propTopics }) {
  const { getUserSummaryStats } = useApp();
  const stats = getUserSummaryStats();
  const topics = propTopics || stats.weakTopics;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {topics.map((t, idx) => (
        <div key={idx}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
            <span style={{ fontWeight: 500 }}>{t.name}</span>
            <span style={{ fontWeight: 700, color: t.color }}>{t.accuracy}% Accuracy</span>
          </div>
          <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${t.accuracy}%`, height: '100%', background: t.color, borderRadius: '4px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

