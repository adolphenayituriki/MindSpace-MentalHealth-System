import { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n/i18n';
import { insightsAPI } from '../../services/api';

export default function WeeklyReflection() {
  const { getLanguage } = useTranslation();
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    insightsAPI.getWeekly(getLanguage())
      .then((res) => setInsight(res.data?.insight))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="card card-accent">
        <div className="card-title" style={{ marginBottom: '0.5rem' }}>Weekly Reflection</div>
        <p className="text-muted" style={{ fontSize: '0.85rem' }}>Loading...</p>
      </div>
    );
  }

  if (!insight) return null;

  return (
    <div className="card card-accent">
      <div className="card-title" style={{ marginBottom: '0.75rem' }}>Weekly Reflection</div>
      {insight.aiReflection && (
        <div className="weekly-reflection">{insight.aiReflection}</div>
      )}

      <div className="weekly-stats">
        <div className="stat-row">
          <span>Week of</span>
          <span style={{ fontWeight: 600 }}>{insight.weekStarting}</span>
        </div>
        <div className="stat-row">
          <span>Moods logged</span>
          <span style={{ fontWeight: 600 }}>{insight.entryCount}</span>
        </div>
        <div className="stat-row">
          <span>Journal entries</span>
          <span style={{ fontWeight: 600 }}>{insight.journalCount}</span>
        </div>
        {insight.weeklyAverage && (
          <div className="stat-row">
            <span>Average mood</span>
            <span style={{ fontWeight: 600 }}>{insight.weeklyAverage}/5</span>
          </div>
        )}
        <div className="stat-row">
          <span>Trend</span>
          <span className={`trend-${insight.trend || 'stable'}`} style={{ fontWeight: 600 }}>
            {insight.trend === 'improving' ? 'Improving' : insight.trend === 'declining' ? 'Declining' : 'Stable'}
          </span>
        </div>
      </div>

      {insight.journals && insight.journals.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Recent Journal Entries</p>
          {insight.journals.slice(0, 3).map((j) => (
            <div key={j.id} className="entry-card" style={{ cursor: 'default', marginBottom: '0.35rem' }}>
              <strong>{j.title || 'Untitled'}</strong>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.15rem', fontSize: '0.82rem' }}>{j.preview}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
