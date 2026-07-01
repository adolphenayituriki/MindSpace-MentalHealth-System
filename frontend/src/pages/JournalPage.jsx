import { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/i18n';
import { useAuth } from '../contexts/AuthContext';
import { journalAPI } from '../services/api';
import JournalEntry from '../components/journal/JournalEntry';
import JournalPrompt from '../components/journal/JournalPrompt';
import Loading from '../components/common/Loading';
import { formatDate } from '../utils/helpers';
import { FaSmile, FaMeh, FaFrown, FaTired, FaPenFancy } from 'react-icons/fa';

const MOOD_EMOJIS = { 5: <FaSmile />, 4: <FaSmile />, 3: <FaMeh />, 2: <FaFrown />, 1: <FaTired /> };

export default function JournalPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async (p = 1) => {
    setLoading(true);
    try {
      const res = await journalAPI.getAll(p);
      setEntries(res.data?.entries || []);
      setTotalPages(res.data?.pages || 1);
      setPage(res.data?.page || 1);
    } catch (_) {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEntries(); }, []);

  const handleSaved = () => { setCreating(false); setEditing(null); fetchEntries(); };
  const handleDeleted = () => { fetchEntries(); };

  if (creating) {
    return (
      <div>
        <div className="mb-2">
          <button className="btn btn-sm btn-ghost" onClick={() => setCreating(false)}>
            &larr; {t('common.back')}
          </button>
        </div>
        <JournalEntry onSaved={handleSaved} />
      </div>
    );
  }

  if (editing) {
    return (
      <div>
        <div className="mb-2">
          <button className="btn btn-sm btn-ghost" onClick={() => setEditing(null)}>
            &larr; {t('common.back')}
          </button>
        </div>
        <JournalEntry entry={editing} onSaved={handleSaved} onDeleted={handleDeleted} />
      </div>
    );
  }

  return (
    <div className="journal-page">
      <div className="page-header">
        <div>
          <h1>{t('journal.title')}</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'} &middot;{' '}
            {user?.displayName || 'Friend'}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setCreating(true)}>
          + {t('journal.new')}
        </button>
      </div>

      <JournalPrompt onSelect={() => setCreating(true)} />

      {loading ? <Loading text="Loading entries..." /> : (
      <div className="entries-list">
        {entries.map((e) => (
          <div key={e._id} className="entry-card" onClick={() => setEditing(e)}>
            <div className="entry-card-head">
              {e.mood && <span className="entry-mood-badge">{MOOD_EMOJIS[e.mood]}</span>}
              <div className="entry-card-info">
                <h4>{e.title || 'Untitled'}</h4>
                <span className="entry-date">{formatDate(e.createdAt)}</span>
              </div>
            </div>
            <p>{e.content?.slice(0, 150)}{e.content?.length > 150 ? '...' : ''}</p>
          </div>
        ))}
        {entries.length === 0 && (
          <div className="empty-msg">
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', opacity: 0.4 }}><FaPenFancy /></div>
            <p>No entries yet. Tap the prompt above or write something new.</p>
          </div>
        )}
      </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : ''}`}
              onClick={() => fetchEntries(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
