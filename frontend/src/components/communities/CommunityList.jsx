import { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n/i18n';
import { communityAPI } from '../../services/api';
import { FaUsers } from 'react-icons/fa';

export default function CommunityList({ onSelect }) {
  const { getLanguage } = useTranslation();
  const [communities, setCommunities] = useState([]);
  const [mine, setMine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const lang = getLanguage();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      communityAPI.getAll(),
      communityAPI.getMine(),
    ]).then(([all, my]) => {
      setCommunities(all.data?.communities || []);
      setMine(my.data?.communities || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const mineIds = new Set(mine.map((c) => c._id));

  const handleJoin = async (id) => {
    setActionId(id);
    try {
      await communityAPI.join(id);
      setMine((prev) => [...prev, communities.find((c) => c._id === id)]);
    } catch (_) {}
    setActionId(null);
  };

  const handleLeave = async (id) => {
    setActionId(id);
    try {
      await communityAPI.leave(id);
      setMine((prev) => prev.filter((c) => c._id !== id));
    } catch (_) {}
    setActionId(null);
  };

  const nullSafe = (v) => v || '';

  if (loading) {
    return (
      <div className="card">
        <div className="card-title" style={{ marginBottom: '1rem' }}>{lang === 'rw' ? 'Amateraniro' : 'Peer Communities'}</div>
        <div className="loading-container"><div className="spinner" /><p>Loading communities...</p></div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-title" style={{ marginBottom: '1rem' }}>{lang === 'rw' ? 'Amateraniro' : 'Peer Communities'}</div>
      <div className="community-grid">
        {communities.map((c) => {
          const joined = mineIds.has(c._id);
          const busy = actionId === c._id;
          return (
            <div key={c._id} className="community-card">
              <h4>{lang === 'rw' ? nullSafe(c.nameRw) : nullSafe(c.name)}</h4>
              <p className="community-desc">
                {lang === 'rw' ? nullSafe(c.descriptionRw) : nullSafe(c.description)}
              </p>
              <div className="community-meta">
                <span>{c.memberCount || 0} {lang === 'rw' ? 'abanyamuryango' : 'members'}</span>
                <span className="topic-tag">{nullSafe(c.topic)}</span>
              </div>
              <div className="community-actions">
                {joined ? (
                  <>
                    <button className="btn btn-sm btn-primary" onClick={() => onSelect?.(c)}>
                      {lang === 'rw' ? 'Fungura' : 'Open'}
                    </button>
                    <button className="btn btn-sm btn-outline" onClick={() => handleLeave(c._id)} disabled={busy}>
                      {busy ? '...' : (lang === 'rw' ? 'Sohoka' : 'Leave')}
                    </button>
                  </>
                ) : (
                  <button className="btn btn-sm btn-secondary" onClick={() => handleJoin(c._id)} disabled={busy}>
                    {busy ? '...' : (lang === 'rw' ? 'Injira' : 'Join')}
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {communities.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', opacity: 0.4 }}><FaUsers /></div>
            <p>{lang === 'rw' ? 'Nta materaniro aboneka.' : 'No communities available yet.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
