import { useState, useEffect } from 'react';
import { journalAPI } from '../../services/api';
import { useTranslation } from '../../i18n/i18n';
import Loading from '../common/Loading';

export default function JournalPrompt({ onSelect }) {
  const { getLanguage } = useTranslation();
  const [prompts, setPrompts] = useState([]);
  const [featured, setFeatured] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    journalAPI.getPrompts(getLanguage()).then((res) => {
      const list = res.data?.prompts || [];
      setPrompts(list);
      if (list.length > 0) {
        setFeatured(list[Math.floor(Math.random() * list.length)]);
      }
    }).catch(() => {}).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading text="Loading prompts..." />;

  return (
    <div className="journal-prompts">
      {featured && (
        <div className="journal-featured-prompt" onClick={onSelect}>
          <span className="journal-featured-icon">{'\u{1F4AD}'}</span>
          <p>{featured}</p>
          <span className="journal-featured-cta">Write &rarr;</span>
        </div>
      )}

      {prompts.length > 0 && (
        <div className="prompts-strip">
          {prompts.map((p, i) => (
            <button key={i} className="prompt-chip" onClick={onSelect}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
