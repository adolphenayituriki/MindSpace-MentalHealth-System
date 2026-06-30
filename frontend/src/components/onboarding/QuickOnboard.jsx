import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../i18n/i18n';

const TOPICS = [
  'Anxiety', 'Depression', 'Grief', 'PTSD',
  'Burnout', 'Relationships', 'Trauma', 'Stress',
];

const FEELINGS = [
  { value: 5, emoji: '\u{1F60A}', label: 'Numeza neza cyane / Great' },
  { value: 4, emoji: '\u{1F642}', label: 'Numeza neza / Good' },
  { value: 3, emoji: '\u{1F610}', label: 'Bisanzwe / Okay' },
  { value: 2, emoji: '\u{1F614}', label: 'Ntakibirimo / Low' },
  { value: 1, emoji: '\u{1F622}', label: 'Byanze / Very Low' },
];

const REASONS = [
  { rw: 'Mfite agahinda n\'ibibazo by\'umutima', en: 'I carry grief and heart pain' },
  { rw: 'Mfite ubwoba n\'umuhangayiko', en: 'I deal with anxiety and worry' },
  { rw: 'Ntangwa n\'ibintu byankubye, ndashaka gukira', en: 'I want to heal from past wounds' },
  { rw: 'Ndananiwe n\'imirimo n\'ishuri', en: 'I am exhausted from work or school' },
  { rw: 'Ndashaka kumenya neza ibyiyumvo byanjye', en: 'I want to understand my emotions better' },
  { rw: 'Ndashaka ubufasha bw\'abajyanama', en: 'I am looking for someone to talk to' },
];

const stepVariants = {
  enter: { x: 60, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -60, opacity: 0 },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export default function QuickOnboard({ onComplete }) {
  const { t, getLanguage } = useTranslation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const lang = getLanguage();

  const questions = [
    { key: 'feeling', text: lang === 'rw' ? 'Wumva ute muri iki gihe?' : 'How have you been feeling lately?' },
    { key: 'reason', text: lang === 'rw' ? 'Ni iki kikuzanye hano?' : 'What brings you here?' },
    { key: 'topics', text: lang === 'rw' ? 'Ni iki ushaka ubufasha kuri?' : 'What would you like support with?', multi: true },
  ];

  const handleNext = (value) => {
    const updated = { ...answers, [questions[step].key]: value };
    setAnswers(updated);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(updated);
    }
  };

  const current = questions[step];

  return (
    <div className="onboarding-screen">
      <motion.div
        className="onboarding-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <motion.div className="step-tracker">
          {questions.map((_, i) => (
            <motion.span
              key={i}
              className={`step-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
              animate={i === step ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            />
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem' }}>
              {current.text}
            </h2>

            {step === 2 ? (
              <>
                <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>
                  Choose all that apply / Hitamo ibikugenga
                </p>
                <motion.div
                  className="topic-grid"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {TOPICS.map((t) => (
                    <motion.button
                      key={t}
                      className={`topic-chip ${(answers.topics || []).includes(t) ? 'selected' : ''}`}
                      onClick={() => {
                        const currentTopics = answers.topics || [];
                        const next = currentTopics.includes(t)
                          ? currentTopics.filter((x) => x !== t)
                          : [...currentTopics, t];
                        setAnswers((a) => ({ ...a, topics: next }));
                      }}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {t}
                    </motion.button>
                  ))}
                  {(answers.topics || []).length > 0 && (
                    <motion.button
                      className="btn btn-primary btn-sm w-full mt-2"
                      onClick={() => handleNext(answers.topics || [])}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Continue / Komeza
                    </motion.button>
                  )}
                </motion.div>
              </>
            ) : step === 1 ? (
              <motion.div
                className="reason-list"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {REASONS.map((r, i) => {
                  const label = lang === 'rw' ? r.rw : r.en;
                  return (
                    <motion.button
                      key={i}
                      className={`reason-btn ${answers.reason === label ? 'selected' : ''}`}
                      onClick={() => handleNext(label)}
                      variants={itemVariants}
                      whileHover={{ scale: 1.015, borderColor: 'var(--primary)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {label}
                    </motion.button>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                className="quick-responses"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {FEELINGS.map((f) => (
                  <motion.button
                    key={f.value}
                    className="quick-mood-btn"
                    onClick={() => handleNext(f.value)}
                    variants={itemVariants}
                    whileHover={{ scale: 1.15, borderColor: 'var(--primary)' }}
                    whileTap={{ scale: 0.9 }}
                    animate={answers.feeling === f.value ? { scale: [1, 1.2, 1], borderColor: 'var(--primary)' } : {}}
                    style={{
                      width: 60,
                      height: 60,
                      fontSize: '1.8rem',
                      borderColor: answers.feeling === f.value ? 'var(--primary)' : 'var(--border)',
                      background: answers.feeling === f.value ? 'var(--primary-light)' : undefined,
                    }}
                  >
                    {f.emoji}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
