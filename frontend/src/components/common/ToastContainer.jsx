import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../contexts/ToastContext';

const icons = {
  success: '\u2705',
  error: '\u274C',
  info: '\u2139\uFE0F',
  warning: '\u26A0\uFE0F',
};

const colors = {
  success: { bg: '#065F4620', border: '#065F46', text: '#065F46' },
  error: { bg: '#991B1B20', border: '#991B1B', text: '#991B1B' },
  info: { bg: '#0D948820', border: '#0D9488', text: '#0D9488' },
  warning: { bg: '#92400E20', border: '#92400E', text: '#92400E' },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map((t) => {
          const c = colors[t.type] || colors.info;
          return (
            <motion.div
              key={t.id}
              className="toast-item"
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{ background: c.bg, borderColor: c.border, color: c.text }}
              onClick={() => removeToast(t.id)}
            >
              <span className="toast-icon">{icons[t.type] || icons.info}</span>
              <span className="toast-message">{t.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
