import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from '../../i18n/i18n';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.35, ease: 'easeOut' },
  }),
};

export default function ChatCards() {
  const { getLanguage } = useTranslation();
  const lang = getLanguage();

  return (
    <motion.div
      className="chat-cards"
      initial="hidden"
      animate="visible"
    >
      <motion.div
        custom={0}
        variants={cardVariants}
      >
        <Link to="/counseling" className="chat-card chat-card-counselor">
          <div className="chat-card-icon">{'\u{1F9D1}\u200D\u{2764}\uFE0F'}</div>
          <div className="chat-card-body">
            <h4>{lang === 'rw' ? 'Ganira n\'umujyanama' : 'Chat with Counselor'}</h4>
            <p>{lang === 'rw' ? 'Vugana n\'umujyanama w\'ubuzima mu ibanga.' : 'Speak privately with a professional counselor.'}</p>
          </div>
          <motion.span
            className="chat-card-arrow"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {'\u2192'}
          </motion.span>
        </Link>
      </motion.div>

      <motion.div
        custom={1}
        variants={cardVariants}
      >
        <Link to="/reflect" className="chat-card chat-card-ai">
          <div className="chat-card-icon">{'\u{1F4AC}'}</div>
          <div className="chat-card-body">
            <h4>{lang === 'rw' ? 'Ganira na AI' : 'Chat with AI'}</h4>
            <p>{lang === 'rw' ? 'Vugana n\'imikorere yacu y\'ubwenge buhangano kugirango ubone ubufasha bwihuse.' : 'Talk to our AI assistant for immediate support and reflection.'}</p>
          </div>
          <motion.span
            className="chat-card-arrow"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          >
            {'\u2192'}
          </motion.span>
        </Link>
      </motion.div>
    </motion.div>
  );
}
