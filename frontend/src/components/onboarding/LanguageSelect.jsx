import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function LanguageSelect({ onSelect, defaultLang }) {
  return (
    <div className="onboarding-screen">
      <motion.div
        className="onboarding-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 150, damping: 12 }}
        >
          MindSpace
        </motion.h1>
        <motion.p
          className="brand-sub"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          Your mind deserves care
        </motion.p>
        <motion.p
          className="brand-desc"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          Making mental health support accessible, stigma-free, and culturally
          grounded for every Rwandan.
        </motion.p>
        <motion.p
          style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          Choose your language / Hitamo ururimi
        </motion.p>
        <motion.div
          className="lang-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.button
            className={`lang-btn ${!defaultLang || defaultLang === 'rw' ? 'lang-btn--default' : ''}`}
            onClick={() => onSelect('rw')}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="lang-name">Kinyarwanda</span>
            <span className="lang-sub">Rurimi rwacu &middot; Default</span>
          </motion.button>
          <motion.button
            className={`lang-btn ${defaultLang === 'en' ? 'lang-btn--default' : ''}`}
            onClick={() => onSelect('en')}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="lang-name">English</span>
            <span className="lang-sub">Language of choice</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
