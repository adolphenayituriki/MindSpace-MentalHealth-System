import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeCarousel from '../components/onboarding/WelcomeCarousel';
import LanguageSelect from '../components/onboarding/LanguageSelect';
import QuickOnboard from '../components/onboarding/QuickOnboard';
import AuthScreen from '../components/auth/AuthScreen';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

const pageVariants = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState('welcome');
  const [onboardAnswers, setOnboardAnswers] = useState({});

  if (user?.onboardingComplete) {
    navigate('/dashboard');
    return null;
  }

  const handleWelcomeDone = () => {
    localStorage.setItem('mindspace_lang', 'rw');
    setStep('language');
  };

  const handleLanguage = (lang) => {
    localStorage.setItem('mindspace_lang', lang);
    setStep('onboard');
  };

  const handleOnboardComplete = (answers) => {
    setOnboardAnswers(answers);
    setStep('auth');
  };

  const handleAuthComplete = async () => {
    try {
      await authAPI.updateProfile({
        onboardingComplete: true,
        preferredTopics: onboardAnswers.topics || [],
      });
    } catch (_) { /* offline fallback */ }
    updateUser({ onboardingComplete: true });
    navigate('/dashboard');
  };

  return (
    <div className="onboarding-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          {step === 'welcome' && <WelcomeCarousel onComplete={handleWelcomeDone} />}
          {step === 'language' && <LanguageSelect onSelect={handleLanguage} defaultLang="rw" />}
          {step === 'onboard' && <QuickOnboard onComplete={handleOnboardComplete} />}
          {step === 'auth' && <AuthScreen onComplete={handleAuthComplete} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
