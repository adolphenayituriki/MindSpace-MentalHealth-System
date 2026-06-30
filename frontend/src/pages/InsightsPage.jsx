import { useTranslation } from '../i18n/i18n';
import MoodInsights from '../components/insights/MoodInsights';
import WeeklyReflection from '../components/insights/WeeklyReflection';

export default function InsightsPage() {
  const { getLanguage } = useTranslation();
  const lang = getLanguage();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{lang === 'rw' ? 'Ibyiyumvo' : 'Insights'}</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
            {lang === 'rw' ? 'Reba ibyiyumvo byawe mu gihe' : 'Review your emotional patterns over time'}
          </p>
        </div>
      </div>
      <div className="dashboard-grid">
        <MoodInsights />
        <WeeklyReflection />
      </div>
    </div>
  );
}
