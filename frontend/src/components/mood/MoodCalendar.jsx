import { useEffect } from 'react';
import { useMood } from '../../hooks/useMood';
import Loading from '../common/Loading';

const MOOD_COLORS = {
  5: '#059669',
  4: '#65A30D',
  3: '#D97706',
  2: '#EA580C',
  1: '#DC2626',
};

const LEGEND = [
  { color: '#059669', label: 'Great' },
  { color: '#65A30D', label: 'Good' },
  { color: '#D97706', label: 'Okay' },
  { color: '#EA580C', label: 'Low' },
  { color: '#DC2626', label: 'Very Low' },
];

export default function MoodCalendar() {
  const { moods, fetchMoods, loading } = useMood();

  useEffect(() => {
    fetchMoods(30).catch(() => {});
  }, []);

  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d;
  });

  const moodMap = {};
  moods.forEach((m) => {
    const key = new Date(m.date).toISOString().slice(0, 10);
    moodMap[key] = m;
  });

  const todayKey = new Date().toISOString().slice(0, 10);

  if (loading) {
    return (
      <div className="card card-accent">
        <Loading text="Loading mood calendar..." />
      </div>
    );
  }

  return (
    <div className="card card-accent">
      <div className="card-title" style={{ marginBottom: '0.75rem' }}>Mood Calendar</div>
      <div className="calendar-grid">
        {days.map((d) => {
          const key = d.toISOString().slice(0, 10);
          const mood = moodMap[key];
          const isToday = key === todayKey;

          return (
            <div
              key={key}
              className={`calendar-day ${mood ? 'has-data' : 'no-data'}`}
              style={{
                backgroundColor: mood ? MOOD_COLORS[mood.value] : undefined,
                border: isToday ? '2px solid var(--primary)' : undefined,
                boxShadow: isToday ? '0 0 0 2px var(--primary-light)' : undefined,
              }}
              title={mood ? `Mood: ${mood.value}/5` : 'No data'}
            >
              {d.getDate()}
            </div>
          );
        })}
      </div>
      <div className="legend-row">
        {LEGEND.map((l) => (
          <span key={l.label}>
            <span className="legend-dot" style={{ background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}
