import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { assessmentAPI } from '../services/api';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

function AssessmentCard({ assessment, onStart }) {
  const typeIcons = { relationship: '\u{1F91D}', stress: '\u{1F4A8}', wellbeing: '\u{1F33F}', readiness: '\u{1F3EB}', general: '\u{1F9E0}' };
  return (
    <motion.div className="feature-card" whileHover={{ y: -4 }} onClick={() => onStart(assessment)} style={{ cursor: 'pointer' }}>
      <span className="feature-icon" style={{ fontSize: '1.6rem' }}>{typeIcons[assessment.type] || '\u{1F9E0}'}</span>
      <h3>{assessment.title}</h3>
      <p>{assessment.description || `Estimated ${assessment.estimatedMinutes} min`}</p>
      <span className="feature-cta">Start Assessment {'\u2192'}</span>
    </motion.div>
  );
}

function QuestionCard({ question, value, onChange }) {
  if (question.type === 'likert5') {
    const labels = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
    return (
      <div className="assessment-question">
        <p className="assessment-q-text">{question.text}</p>
        <div className="assessment-likert">
          {[1, 2, 3, 4, 5].map((v) => (
            <button key={v} className={`assessment-likert-btn ${value === v ? 'active' : ''}`} onClick={() => onChange(v)}>
              <span className="likert-num">{v}</span>
              <span className="likert-label">{labels[v - 1]}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }
  if (question.type === 'yesno') {
    return (
      <div className="assessment-question">
        <p className="assessment-q-text">{question.text}</p>
        <div className="assessment-yesno">
          {[1, 0].map((v) => (
            <button key={v} className={`assessment-likert-btn ${value === v ? 'active' : ''}`} onClick={() => onChange(v)}>
              {v === 1 ? 'Yes' : 'No'}
            </button>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="assessment-question">
      <p className="assessment-q-text">{question.text}</p>
      <textarea className="form-input" rows={3} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="Type your answer..." />
    </div>
  );
}

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    Promise.all([assessmentAPI.getAll(), assessmentAPI.getResults()])
      .then(([a, r]) => { setAssessments(a.data.assessments); setResults(r.data.results || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const startAssessment = (assessment) => {
    setActive(assessment);
    setAnswers({});
    setResult(null);
  };

  const handleAnswer = useCallback((questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formatted = Object.entries(answers).map(([questionId, value]) => ({ questionId, value }));
      const res = await assessmentAPI.submit(active._id, formatted);
      setResult(res.data);
      setResults((prev) => [res.data.result, ...prev]);
    } catch (_) {}
    setSubmitting(false);
  };

  if (loading) return <LoadingSkeleton />;

  if (result) {
    const lvl = active.levels?.find((l) => l.label === result.level);
    return (
      <div className="page-container">
        <div className="page-header"><h1>Your Results</h1></div>
        <motion.div className="result-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="result-score-ring">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border)" strokeWidth="8" />
              <circle cx="60" cy="60" r="54" fill="none" stroke="var(--primary)" strokeWidth="8"
                strokeDasharray={`${(result.score / 100) * 339.3} 339.3`}
                strokeLinecap="round" transform="rotate(-90 60 60)" />
            </svg>
            <span className="result-score-text">{result.score}%</span>
          </div>
          {result.level && <h2 className="result-level">{result.level}</h2>}
          {lvl?.message && <p className="result-message">{lvl.message}</p>}
          {lvl?.recommendation && (
            <div className="result-recommendation">
              <strong>Recommendation:</strong>
              <p>{lvl.recommendation}</p>
            </div>
          )}
          <button className="btn btn-secondary" onClick={() => { setActive(null); setResult(null); }} style={{ marginTop: '1rem' }}>
            Back to Assessments
          </button>
        </motion.div>
      </div>
    );
  }

  if (active) {
    const questions = active.questions || [];
    const answered = Object.keys(answers).length;
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>{active.title}</h1>
          <button className="btn btn-ghost" onClick={() => setActive(null)}>{'\u2190'} Back</button>
        </div>
        <div className="assessment-progress-bar">
          <div className="assessment-progress-fill" style={{ width: `${(answered / questions.length) * 100}%` }} />
          <span>{answered} of {questions.length} answered</span>
        </div>
        <div className="assessment-questions">
          {questions.map((q, i) => (
            <motion.div key={q._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <QuestionCard question={q} value={answers[q._id]} onChange={(v) => handleAnswer(q._id, v)} />
            </motion.div>
          ))}
        </div>
        <motion.button
          className="btn btn-primary btn-lg"
          onClick={handleSubmit}
          disabled={answered < questions.length || submitting}
          whileTap={{ scale: 0.98 }}
          style={{ width: '100%', marginTop: '1.5rem' }}
        >
          {submitting ? 'Submitting...' : 'Submit Assessment'}
        </motion.button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Self-Assessments</h1>
        <p>Discover insights about yourself through guided questionnaires</p>
      </div>
      <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        {assessments.map((a) => <AssessmentCard key={a._id} assessment={a} onStart={startAssessment} />)}
      </div>
      {results.length > 0 && (
        <>
          <h2 style={{ marginTop: '2rem', fontSize: '1.1rem' }}>Past Results</h2>
          <div className="results-history">
            {results.map((r) => (
              <div key={r._id} className="result-history-item">
                <span>{r.assessment?.title || 'Assessment'}</span>
                <span className="result-history-score">{r.score}%</span>
                <span className="result-history-level" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{r.level || ''}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date(r.completedAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
