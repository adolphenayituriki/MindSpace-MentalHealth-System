import { useState } from 'react';
import { useTranslation } from '../../i18n/i18n';

export default function VideoPlayer({ resource, onBack }) {
  const { getLanguage } = useTranslation();
  const [showVideo, setShowVideo] = useState(false);
  const lang = getLanguage();

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
        <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
          {lang === 'rw' ? resource.descriptionRw : resource.description}
        </p>

        {resource.tags && (
          <div className="flex-row" style={{ justifyContent: 'center', gap: '0.35rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {resource.tags.map((t) => (
              <span key={t} className="topic-tag">{t}</span>
            ))}
          </div>
        )}

        {resource.embedUrl && (
          <div style={{
            position: 'relative',
            width: '100%',
            paddingBottom: '56.25%',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            background: 'var(--bg-muted)',
          }}>
            <iframe
              src={showVideo ? resource.embedUrl : undefined}
              title={resource.title}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {!showVideo && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                background: 'rgba(0,0,0,0.05)',
              }} onClick={() => setShowVideo(true)}>
                <span style={{ fontSize: '3rem' }}>{'\u25B6'}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Click to load video</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
