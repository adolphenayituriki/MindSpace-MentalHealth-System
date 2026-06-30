import { useState } from 'react';
import { useTranslation } from '../../i18n/i18n';

export default function StepTool({ resource, onBack }) {
  const { getLanguage } = useTranslation();
  const [step, setStep] = useState(0);
  const lang = getLanguage();

  const steps = lang === 'rw' && resource.stepsRw ? resource.stepsRw : resource.steps || [];

  return (
    <div className="card">
      <div className="flex-between mb-2">
        <button className="btn btn-sm btn-ghost" onClick={onBack}>
          &larr; Back
        </button>
        <span className="topic-tag">{resource.duration}</span>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{resource.icon}</div>
        <div className="card-title mb-1">{lang === 'rw' ? resource.titleRw : resource.title}</div>
        <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          {lang === 'rw' ? resource.descriptionRw : resource.description}
        </p>

        {steps.length > 0 && (
          <>
            <div className="step-tracker" style={{ marginBottom: '1.5rem' }}>
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`step-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
                />
              ))}
            </div>

            <div style={{
              background: 'var(--bg-muted)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              marginBottom: '1rem',
              minHeight: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'slideUp 0.25s ease',
            }}>
              <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--text)' }}>
                {steps[step]}
              </p>
            </div>

            <div className="flex-row" style={{ justifyContent: 'center', gap: '0.5rem' }}>
              <button
                className="btn btn-sm"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                Previous
              </button>
              <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                {step + 1} / {steps.length}
              </span>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => {
                  if (step < steps.length - 1) setStep((s) => s + 1);
                  else setStep(0);
                }}
              >
                {step < steps.length - 1 ? 'Next' : 'Done'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
