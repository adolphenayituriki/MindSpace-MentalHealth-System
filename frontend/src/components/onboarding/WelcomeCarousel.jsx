import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
  {
    icon: '\u{1F33F}',
    title: 'Welcome to MindSpace',
    desc: 'Mental health support that is accessible, anonymous, and culturally grounded for every Rwandan.',
  },
  {
    icon: '\u{1F4CB}',
    title: 'Track Your Mood',
    desc: 'Log how you feel each day and watch your emotional patterns emerge. Small daily check-ins build self-awareness.',
  },
  {
    icon: '\u{1F9D1}\u200D\u2764\uFE0F',
    title: 'Talk to Someone',
    desc: 'Message a licensed counselor or join anonymous peer communities. You are never alone.',
  },
  {
    icon: '\u{1F4DD}',
    title: 'Reflect & Grow',
    desc: 'Write with culturally relevant prompts, access healing resources, and review your journey over time.',
  },
];

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

export default function WelcomeCarousel({ onComplete }) {
  const [slide, setSlide] = useState(0);
  const [dir, setDir] = useState(1);
  const isLast = slide === SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setDir(1);
      setSlide((s) => s + 1);
    }
  };

  return (
    <div className="onboarding-screen">
      <motion.div
        className="welcome-carousel"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <motion.button
          className="welcome-skip"
          onClick={onComplete}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="welcome-skip-label">Skip / Simbuka</span>
          <span className="welcome-skip-sub">Skip intro &amp; get started</span>
        </motion.button>

        <div className="welcome-slide">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={slide}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}
            >
              <motion.div
                className="welcome-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              >
                {SLIDES[slide].icon}
              </motion.div>
              <h2>{SLIDES[slide].title}</h2>
              <div className="heading-divider" aria-hidden="true">
                <span className="heading-divider-line" />
                <span className="heading-divider-icon" style={{ fontSize: '0.75rem' }}>{'\u{1F33F}'}</span>
                <span className="heading-divider-line" />
              </div>
              <p>{SLIDES[slide].desc}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="welcome-dots">
          {SLIDES.map((_, i) => (
            <motion.span
              key={i}
              className={`welcome-dot ${i === slide ? 'active' : ''}`}
              onClick={() => { setDir(i > slide ? 1 : -1); setSlide(i); }}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        <motion.button
          className="btn btn-primary btn-lg w-full"
          onClick={handleNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLast ? 'Get Started' : 'Next'}
        </motion.button>
      </motion.div>
    </div>
  );
}
