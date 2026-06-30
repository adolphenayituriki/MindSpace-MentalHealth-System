import { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n/i18n';
import { crisisAPI } from '../../services/api';

export default function CrisisResources() {
  const { getLanguage } = useTranslation();
  const [resources, setResources] = useState([]);
  const [hotlines, setHotlines] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const lang = getLanguage();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      crisisAPI.getResources(),
      crisisAPI.getHotlines(),
      crisisAPI.getCenters(),
    ]).then(([r, h, c]) => {
      setResources(r.data?.resources || []);
      setHotlines(h.data?.hotlines || []);
      setCenters(c.data?.centers || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const nullSafe = (v) => v || '';

  if (loading) {
    return (
      <div className="crisis-page">
        <div className="card emergency-section" style={{ borderColor: 'var(--danger)' }}>
          <h2>Need Help Right Now?</h2>
          <div className="emergency-numbers">
            <a href="tel:112" className="emergency-btn">112 &mdash; Emergency</a>
            <a href="tel:3002" className="emergency-btn">3002 &mdash; Mental Health</a>
            <a href="tel:3425" className="emergency-btn">3425 &mdash; GBV Support</a>
          </div>
        </div>
        <div className="loading-container"><div className="spinner" /><p>Loading resources...</p></div>
      </div>
    );
  }

  const isEmpty = resources.length === 0 && hotlines.length === 0 && centers.length === 0;

  return (
    <div className="crisis-page">
      <div className="card emergency-section" style={{ borderColor: 'var(--danger)' }}>
        <h2>Need Help Right Now?</h2>
        <div className="emergency-numbers">
          <a href="tel:112" className="emergency-btn">112 &mdash; Emergency</a>
          <a href="tel:3002" className="emergency-btn">3002 &mdash; Mental Health</a>
          <a href="tel:3425" className="emergency-btn">3425 &mdash; GBV Support</a>
        </div>
      </div>

      {isEmpty && (
        <div className="card">
          <div className="empty-state">
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', opacity: 0.4 }}>{'\u{1F6E1}\uFE0F'}</div>
            <p>{lang === 'rw' ? 'Nta bikoresho bibonetse.' : 'No resources available yet.'}</p>
          </div>
        </div>
      )}

      {hotlines.length > 0 && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: '0.75rem' }}>{lang === 'rw' ? 'Terefone z\'ubutabazi' : 'Hotlines'}</div>
          <div className="resource-list">
            {hotlines.map((r) => (
              <div key={r._id} className="resource-item">
                <h4>{lang === 'rw' ? nullSafe(r.nameRw || r.name) : nullSafe(r.name)}</h4>
                <p>{lang === 'rw' ? nullSafe(r.descriptionRw || r.description) : nullSafe(r.description)}</p>
                <a href={`tel:${r.phone}`} className="phone-link">{r.phone}</a>
              </div>
            ))}
          </div>
        </div>
      )}

      {centers.length > 0 && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: '0.75rem' }}>{lang === 'rw' ? 'Ibigo nderabuzima' : 'Health Centers & NGOs'}</div>
          <div className="resource-list">
            {centers.map((r) => (
              <div key={r._id} className="resource-item">
                <h4>{lang === 'rw' ? nullSafe(r.nameRw || r.name) : nullSafe(r.name)}</h4>
                {r.location && <p>{lang === 'rw' ? 'Aho biherereye' : 'Location'}: {r.location}</p>}
                <p>{lang === 'rw' ? nullSafe(r.descriptionRw || r.description) : nullSafe(r.description)}</p>
                {r.phone && <a href={`tel:${r.phone}`} className="phone-link">{r.phone}</a>}
              </div>
            ))}
          </div>
        </div>
      )}

      {resources.length > 0 && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: '0.75rem' }}>{lang === 'rw' ? 'Ibindi bikoresho' : 'All Resources'}</div>
          <div className="resource-list">
            {resources.map((r) => (
              <div key={r._id} className="resource-item">
                <h4>{lang === 'rw' ? nullSafe(r.nameRw || r.name) : nullSafe(r.name)}</h4>
                <span className="topic-tag" style={{ marginBottom: '0.25rem' }}>{r.type}</span>
                <p>{lang === 'rw' ? nullSafe(r.descriptionRw || r.description) : nullSafe(r.description)}</p>
                {r.phone && <a href={`tel:${r.phone}`} className="phone-link">{r.phone}</a>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
