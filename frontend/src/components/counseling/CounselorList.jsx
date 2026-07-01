import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { counselingAPI } from '../../services/api';
import { FaHeart, FaCheck } from 'react-icons/fa';

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: 'easeOut' },
  }),
};

export default function CounselorList() {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    counselingAPI.getCounselors().then((res) => {
      setCounselors(res.data?.counselors || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
    >
      <div className="card-title" style={{ marginBottom: '1rem' }}>
        Available Counselors
        {!loading && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.5rem' }}>({counselors.length})</span>}
      </div>
      {loading ? (
        <div className="loading-container"><div className="spinner" /><p>Loading counselors...</p></div>
      ) : counselors.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', opacity: 0.4 }}><FaHeart /></div>
          <p>No counselors available at the moment.</p>
        </div>
      ) : (
        <div className="counselor-grid">
          {counselors.map((c, i) => (
            <motion.div
              key={c._id}
              className="counselor-card"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -4, boxShadow: 'var(--shadow)' }}
            >
              <motion.div
                className="counselor-avatar"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              >
                {(c.fullName || '?').charAt(0)}
              </motion.div>
              <h4>{c.fullName || 'Counselor'}</h4>
              <p className="counselor-bio">{c.bio || ''}</p>
              {(c.specialization || []).length > 0 && (
                <div className="counselor-specialties">
                  {c.specialization.map((s) => (
                    <span key={s} className="topic-tag">{s}</span>
                  ))}
                </div>
              )}
              {c.isAvailable && (
                <motion.span
                  className="availability-badge"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 + 0.15 }}
                >
                  <FaCheck /> Available
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
