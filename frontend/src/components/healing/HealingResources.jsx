import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../i18n/i18n';
import { healingAPI } from '../../services/api';
import Loading from '../common/Loading';
import BreathingExercise from './BreathingExercise';
import StepTool from './StepTool';
import VideoPlayer from './VideoPlayer';

const TYPE_ICONS = {
  breathing: '\u{1F9D8}',
  sound: '\u{1F50A}',
  sleep_tool: '\u{1F31C}',
  video: '\u{1F3AC}',
  article: '\u{1F4D6}',
  guided_exercise: '\u{1F338}',
};

const TYPE_LABELS = {
  breathing: { en: 'Breathing Exercises', rw: 'Guhumeka' },
  sound: { en: 'Soothing Sounds', rw: 'Amajwi Arituje' },
  sleep_tool: { en: 'Sleep Tools', rw: 'Ibitotsi' },
  video: { en: 'Videos', rw: 'Amashusho' },
  article: { en: 'Articles', rw: 'Inyandiko' },
  guided_exercise: { en: 'Guided Exercises', rw: 'Imyitozo' },
};

const groupVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

export default function HealingResources({ recommendedOnly }) {
  const { getLanguage } = useTranslation();
  const [resources, setResources] = useState([]);
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState('all');
  const [context, setContext] = useState(null);
  const [loading, setLoading] = useState(true);
  const lang = getLanguage();

  useEffect(() => {
    setLoading(true);
    const fetch = recommendedOnly
      ? healingAPI.getRecommended()
      : healingAPI.getAll(filter !== 'all' ? { type: filter } : {});
    fetch.then((res) => {
      setResources(res.data?.resources || []);
      if (res.data?.context) setContext(res.data.context);
    }).catch(() => {}).finally(() => {
      setLoading(false);
    });
  }, [filter, recommendedOnly]);

  if (active) {
    switch (active.type) {
      case 'breathing':
        return <BreathingExercise resource={active} onBack={() => setActive(null)} />;
      case 'sleep_tool':
      case 'guided_exercise':
      case 'article':
        return <StepTool resource={active} onBack={() => setActive(null)} />;
      case 'video':
      case 'sound':
        return <VideoPlayer resource={active} onBack={() => setActive(null)} />;
      default:
        return <StepTool resource={active} onBack={() => setActive(null)} />;
    }
  }

  const types = ['all', 'breathing', 'sound', 'sleep_tool', 'guided_exercise', 'video', 'article'];

  const grouped = {};
  resources.forEach((r) => {
    if (!grouped[r.type]) grouped[r.type] = [];
    grouped[r.type].push(r);
  });

  return (
    <motion.div
      className="healing-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {context && (
        <motion.div
          className="recommended-context"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p>
            {lang === 'rw'
              ? 'Dore ibikoresho by\'ubuvuzi byihariye byakugirira akamaro, bishingiye ku byiyumvo byawe vuba aha.'
              : 'Here are recommended healing resources based on your recent emotional patterns.'}
          </p>
        </motion.div>
      )}

      {!recommendedOnly && (
        <motion.div
          className="healing-filters"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {types.map((t) => (
            <motion.button
              key={t}
              className={`btn btn-sm ${filter === t ? 'btn-primary' : ''}`}
              onClick={() => setFilter(t)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t === 'all' ? (lang === 'rw' ? 'Byose' : 'All') : (TYPE_LABELS[t]?.[lang] || t)}
            </motion.button>
          ))}
        </motion.div>
      )}

      {loading && <Loading text="Loading resources..." />}

      {!loading && Object.entries(grouped).length === 0 && (
        <motion.div
          className="card"
          style={{ padding: '2.5rem 1rem', textAlign: 'center' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.4 }}>{'\u{1F33F}'}</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {lang === 'rw' ? 'Nta bikoresho bibonetse.' : 'No resources found.'}
          </p>
        </motion.div>
      )}

      <AnimatePresence>
        {Object.entries(grouped).map(([type, items]) => (
          <motion.section
            key={type}
            className="resource-group"
            variants={groupVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="resource-group-header">
              <span className="resource-group-icon">{TYPE_ICONS[type] || '\u{2764}'}</span>
              <h2>{TYPE_LABELS[type]?.[lang] || type}</h2>
              <span className="resource-group-count">{items.length}</span>
            </div>

            <div className="resource-items">
              {items.map((r) => (
                <motion.article
                  key={r._id}
                  className="resource-item-card"
                  onClick={() => setActive(r)}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01, borderColor: 'var(--primary)', boxShadow: 'var(--shadow-md)' }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="resource-item-icon">
                    {r.icon || TYPE_ICONS[r.type] || '\u{2764}'}
                  </div>
                  <div className="resource-item-body">
                    <h3>{lang === 'rw' && r.titleRw ? r.titleRw : r.title}</h3>
                    <p>{lang === 'rw' && r.descriptionRw ? r.descriptionRw : r.description}</p>
                    <div className="resource-item-footer">
                      {r.duration && <span className="resource-item-duration">{r.duration}</span>}
                      {r.isFeatured && <span className="resource-item-featured">{lang === 'rw' ? 'By\'ingenzi' : 'Featured'}</span>}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
