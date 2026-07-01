import { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n/i18n';
import { useMood } from '../../hooks/useMood';

const MOODS = [
  { value: 5, emoji: '\u{1F60A}', labelRw: 'Murakoze cyane', labelEn: 'Great' },
  { value: 4, emoji: '\u{1F642}', labelRw: 'Mesa', labelEn: 'Good' },
  { value: 3, emoji: '\u{1F610}', labelRw: 'Bisanzwe', labelEn: 'Okay' },
  { value: 2, emoji: '\u{1F614}', labelRw: 'Mbi', labelEn: 'Low' },
  { value: 1, emoji: '\u{1F622}', labelRw: 'Mbi cyane', labelEn: 'Very Low' },
];

export default function MoodTracker() {
  const { t, getLanguage } = useTranslation();
  const { logMood, streak, fetchMoods, moods, loading } = useMood();
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const [savedNote, setSavedNote] = useState('');
  const [done, setDone] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);
  const [animatingMood, setAnimatingMood] = useState(null);
  const [saving, setSaving] = useState(false);
  const lang = getLanguage();

  useEffect(() => {
    fetchMoods().catch(() => {});
  }, []);

  useEffect(() => {
    if (moods.length > 0) {
      const today = new Date().toISOString().slice(0, 10);
      const todayMood = moods.find(
        (m) => new Date(m.date).toISOString().slice(0, 10) === today
      );
      if (todayMood) {
        setSelected(todayMood.value);
        if (todayMood.note) {
          setNote(todayMood.note);
          setSavedNote(todayMood.note);
        }
      }
    }
  }, [moods]);

  const doSave = async (moodValue, moodEmoji, moodNote) => {
    setSaving(true);
    try {
      await logMood({
        value: moodValue ?? selected,
        emoji: moodEmoji ?? MOODS.find((m) => m.value === selected)?.emoji,
        note: moodNote || undefined,
      });
      setSavedNote(moodNote || '');
    } catch (_) {}
    setSaving(false);
  };

  const handleSelect = async (mood) => {
    if (loading || saving) return;
    setSelected(mood.value);
    setAnimatingMood(mood.value);
    setTimeout(() => setAnimatingMood(null), 300);
    setDone(false);
    setNoteSaved(false);
    await doSave(mood.value, mood.emoji, note);
    setDone(true);
    setTimeout(() => setDone(false), 2500);
  };

  const handleSaveNote = async () => {
    if (!selected || saving) return;
    setNoteSaved(false);
    await doSave(selected, null, note);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  };

  return (
    <div className="card card-accent">
      <div className="card-header">
        <div>
          <div className="card-title">How are you feeling?</div>
          <div className="card-subtitle">Tap to log your mood for today</div>
        </div>
        {streak > 0 && (
          <span className="streak-badge">
            {streak} day{streak !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="mood-selector">
        {MOODS.map((m) => {
          const isAnimating = animatingMood === m.value;
          return (
            <button
              key={m.value}
              className={`mood-btn ${selected === m.value ? 'selected' : ''} ${isAnimating ? 'animate' : ''}`}
              onClick={() => handleSelect(m)}
              disabled={loading || saving}
              title={lang === 'rw' ? m.labelRw : m.labelEn}
            >
              <span className="mood-emoji" style={{ transform: isAnimating ? 'scale(1.3)' : 'scale(1)', transition: 'transform 0.2s ease' }}>
                {m.emoji}
              </span>
              <span className="mood-label">
                {lang === 'rw' ? m.labelRw : m.labelEn}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mood-note-area">
        <textarea
          className="input textarea"
          placeholder="Add a note (optional)..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
        />
        {selected && (
          <button
            className="btn btn-sm btn-primary mood-note-save"
            onClick={handleSaveNote}
            disabled={saving || !note.trim()}
          >
            {saving ? 'Saving...' : 'Save Note'}
          </button>
        )}
      </div>

      {done && (
        <p className="success-text mt-1">
          {'\u2713'} Mood logged for today
        </p>
      )}
      {noteSaved && (
        <p className="success-text mt-1" style={{ fontSize: '0.8rem' }}>
          {'\u2713'} Note saved
        </p>
      )}
      {savedNote && selected && (
        <p className="mood-saved-note">
          {'\u{1F4DD}'} {savedNote}
        </p>
      )}
    </div>
  );
}
