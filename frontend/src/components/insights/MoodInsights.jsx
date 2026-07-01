import { useState, useEffect } from 'react';
import { moodAPI } from '../../services/api';
import Loading from '../common/Loading';

export default function MoodInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    moodAPI.getInsights().then((res) => {
      setInsights(res.data?.insights);
    }).catch(() => {}).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="card card-accent">
        <Loading text="Loading insights..." />
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="card card-accent">
        <div className="card-title" style={{ marginBottom: '0.5rem' }}>Mood Insights</div>
        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
          Log your mood for a few days to see insights here.
        </p>
      </div>
    );
  }

  return (
    <div className="card card-accent">
      <div className="card-title" style={{ marginBottom: '0.75rem' }}>Mood Insights</div>
      <div className="insights-grid">
        <div className="insight-stat">
          <span className="stat-val">{insights.average}</span>
          <span className="stat-lbl">Avg Mood</span>
        </div>
        <div className="insight-stat">
          <span className="stat-val">{insights.total}</span>
          <span className="stat-lbl">Days Logged</span>
        </div>
        <div className="insight-stat">
          <span className="stat-val">{insights.best}/5</span>
          <span className="stat-lbl">Best Day</span>
        </div>
        <div className="insight-stat">
          <span className="stat-val">{insights.worst}/5</span>
          <span className="stat-lbl">Lowest Day</span>
        </div>
      </div>
    </div>
  );
}
