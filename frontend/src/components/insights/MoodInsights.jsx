import { useState, useEffect } from 'react';
import { moodAPI } from '../../services/api';

export default function MoodInsights() {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    moodAPI.getInsights().then((res) => {
      setInsights(res.data?.insights);
    }).catch(() => {});
  }, []);

  if (!insights) {
    return (
      <div className="card">
        <div className="card-title" style={{ marginBottom: '0.5rem' }}>Mood Insights</div>
        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
          Log your mood for a few days to see insights here.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
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
