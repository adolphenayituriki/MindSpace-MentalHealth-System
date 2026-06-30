import { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n/i18n';
import { journalAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

export default function JournalEntry({ entry, onSaved, onDeleted }) {
  const { t, getLanguage } = useTranslation();
  const [content, setContent] = useState(entry?.content || '');
  const [title, setTitle] = useState(entry?.title || '');
  const [prompt, setPrompt] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!entry) {
      journalAPI.getPrompts(getLanguage()).then((res) => {
        const prompts = res.data?.prompts || [];
        setPrompt(prompts[Math.floor(Math.random() * prompts.length)] || '');
      }).catch(() => {});
    }
  }, []);

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      if (entry) {
        await journalAPI.update(entry._id, { title, content });
      } else {
        await journalAPI.create({ title, content, prompt });
      }
      onSaved?.();
    } catch (_) {
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!entry) return;
    await journalAPI.delete(entry._id);
    onDeleted?.(entry._id);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">{entry ? 'Edit Entry' : 'New Entry'}</div>
        {entry && (
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>
            {formatDate(entry.createdAt)}
          </span>
        )}
      </div>

      <div className="journal-entry-form">
        {prompt && !entry && (
          <div className="journal-prompt-banner">{prompt}</div>
        )}

        <input
          className="input journal-title-input"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="input textarea journal-content-area"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your thoughts..."
        />

        <div className="journal-actions">
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving || !content.trim()}
          >
            {saving ? 'Saving...' : 'Save Entry'}
          </button>
          {entry && (
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
