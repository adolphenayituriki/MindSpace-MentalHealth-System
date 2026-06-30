import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../i18n/i18n';
import { useAuth } from '../../contexts/AuthContext';

const modeVariants = {
  enter: { x: 40, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -40, opacity: 0 },
};

export default function AuthScreen({ onComplete }) {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [mode, setMode] = useState('choose');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnonymous = async () => {
    setLoading(true);
    setError('');
    try {
      await login('anonymous', {
        language: localStorage.getItem('mindspace_lang') || 'rw',
      });
      onComplete?.();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canSubmitEmail = () => {
    if (!email.includes('@') || !email.includes('.')) return false;
    if (password.length < 6) return false;
    if (mode === 'register' && !name.trim()) return false;
    return true;
  };

  const handleEmail = async (isRegister) => {
    if (!canSubmitEmail()) {
      setError('Please fill in all fields correctly.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(isRegister ? 'register' : 'login', {
        email,
        password,
        displayName: name,
      });
      onComplete?.();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-screen">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <AnimatePresence mode="wait">
          {mode === 'choose' ? (
            <motion.div
              key="choose"
              variants={modeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
            >
              <motion.div
                className="auth-shield-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              >
                {'\u{1F6E1}\uFE0F'}
              </motion.div>
              <h2 style={{ marginBottom: '0.25rem' }}>You are safe here</h2>
              <p className="auth-subtitle">No account needed to get started</p>

              <motion.button
                className="btn btn-primary btn-lg w-full"
                onClick={handleAnonymous}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Please wait...' : 'Continue Anonymously'}
              </motion.button>

              <div className="auth-divider">or</div>

              <motion.button
                className="btn btn-secondary btn-lg w-full"
                onClick={() => setMode('login')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue with Email
              </motion.button>

              {error && <p className="error-text">{error}</p>}
            </motion.div>
          ) : (
            <motion.div
              key={mode}
              variants={modeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
            >
              <h2>{mode === 'register' ? 'Create Account' : 'Sign In'}</h2>

              {error && <p className="error-text">{error}</p>}

              {mode === 'register' && (
                <motion.input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.2 }}
                />
              )}
              <motion.input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                whileFocus={{ scale: 1.01 }}
              />
              <motion.input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                whileFocus={{ scale: 1.01 }}
              />

              <motion.button
                className="btn btn-primary btn-lg w-full"
                onClick={() => handleEmail(mode === 'register')}
                disabled={loading || !canSubmitEmail()}
                whileHover={canSubmitEmail() && !loading ? { scale: 1.02 } : {}}
                whileTap={canSubmitEmail() && !loading ? { scale: 0.98 } : {}}
              >
                {loading
                  ? 'Please wait...'
                  : mode === 'register'
                    ? 'Create Account'
                    : 'Sign In'}
              </motion.button>

              <p className="text-center text-muted" style={{ fontSize: '0.85rem' }}>
                {mode === 'register' ? (
                  <>Already have an account?{' '}<button className="link-btn" onClick={() => setMode('login')}>Sign In</button></>
                ) : (
                  <>No account?{' '}<button className="link-btn" onClick={() => setMode('register')}>Create one</button></>
                )}
              </p>

              <motion.button
                className="btn btn-ghost btn-sm w-full"
                onClick={() => setMode('choose')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Back
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
