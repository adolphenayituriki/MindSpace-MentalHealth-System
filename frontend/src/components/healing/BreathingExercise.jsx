import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../i18n/i18n';

const PHASES = [
  { key: 'inhale', duration: 4 },
  { key: 'hold', duration: 7 },
  { key: 'exhale', duration: 8 },
];

export default function BreathingExercise({ resource, onBack }) {
  const { getLanguage } = useTranslation();
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [count, setCount] = useState(PHASES[0].duration);
  const [active, setActive] = useState(false);
  const [rounds, setRounds] = useState(0);
  const intervalRef = useRef(null);

  const lang = getLanguage();
  const phaseNames = {
    inhale: { en: 'Breathe In', rw: 'Humeka' },
    hold: { en: 'Hold', rw: 'Fata' },
    exhale: { en: 'Breathe Out', rw: 'Sohora' },
  };

  useEffect(() => {
    if (!active) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          const next = (phaseIndex + 1) % PHASES.length;
          setPhaseIndex(next);
          if (next === 0) setRounds((r) => r + 1);
          return PHASES[next].duration;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [active, phaseIndex]);

  const handleToggle = () => {
    if (!active) {
      setPhaseIndex(0);
      setCount(PHASES[0].duration);
      setRounds(0);
    }
    setActive((v) => !v);
  };

  const phase = PHASES[phaseIndex];
  const progress = (phase.duration - count) / phase.duration;
  const size = 200 + (phaseIndex === 0 ? count * 8 : phaseIndex === 2 ? count * 4 : 0);

  return (
    <div className="card">
      <div className="flex-between mb-2">
        <button className="btn btn-sm btn-ghost" onClick={onBack}>
          &larr; Back
        </button>
        <span className="topic-tag">{resource.duration}</span>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div className="card-title mb-1">{lang === 'rw' ? resource.titleRw : resource.title}</div>
        <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          {lang === 'rw' ? resource.descriptionRw : resource.description}
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: `conic-gradient(var(--primary) ${progress * 360}deg, var(--bg-muted) ${progress * 360}deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            boxShadow: active ? '0 0 30px rgba(13,148,136,0.2)' : 'none',
          }}>
            <div style={{
              width: size - 20,
              height: size - 20,
              borderRadius: '50%',
              background: 'var(--bg-card)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem',
            }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                {count}
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {phaseNames[phase.key][lang] || phaseNames[phase.key].en}
              </span>
              {active && (
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Round {rounds + 1}
                </span>
              )}
            </div>
          </div>

          <button
            className={`btn btn-lg ${active ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleToggle}
          >
            {active ? 'Stop' : 'Start'}
          </button>
        </div>

        {(resource.steps || resource.stepsRw) && (
          <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
            <p className="card-subtitle mb-1" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
              {lang === 'rw' ? 'Intambwe' : 'Steps'}
            </p>
            <ol style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              {(lang === 'rw' && resource.stepsRw ? resource.stepsRw : resource.steps).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
