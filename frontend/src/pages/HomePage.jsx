import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../i18n/i18n';
import { useAuth } from '../contexts/AuthContext';
import HomeChartFab from '../components/chat/HomeChartFab';

const features = [
  { icon: '\u{1F4CB}', title: 'Mood Tracking', desc: 'Log how you feel each day and watch your emotional patterns emerge. Small daily check-ins build self-awareness.' },
  { icon: '\u{1F4DD}', title: 'Guided Journaling', desc: 'Write with culturally relevant prompts that help you reflect. No blank page \u2014 just a gentle starting point.' },
  { icon: '\u{1F9E9}', title: 'Self-Assessments', desc: 'Take guided tests for relationship health, stress levels, and wellbeing. Get instant scores and recommendations.' },
  { icon: '\u{1F4DA}', title: 'Learning Center', desc: 'Access courses on marriage preparation, parenting, grief, retirement, and emotional wellbeing at your own pace.' },
  { icon: '\u{1F46B}', title: 'Peer Communities', desc: 'Join anonymous topic-based communities. Share, listen, and connect with others who understand.' },
  { icon: '\u{1F9D1}\u200D\u2764\uFE0F', title: 'Counselor Support', desc: 'Message a licensed counselor when you need more than a conversation. Book a session that fits your schedule.' },
  { icon: '\u{1F4CA}', title: 'Weekly Reflections', desc: 'Review your emotional patterns with weekly summaries. See your progress over time.' },
  { icon: '\u{1F6E1}\uFE0F', title: 'Crisis Resources', desc: 'Verified local hotlines, health centers, and NGOs \u2014 available in one tap when you need them most.' },
];

const quickHelpItems = [
  {
    icon: '\u{1F3E2}', title: 'Visit a Health Center',
    desc: 'Find verified mental health centers near you with opening hours and contact info.',
    link: '/healing', label: 'Find Centers',
  },
  {
    icon: '\u{1F4DE}', title: 'Crisis Hotline',
    desc: 'Immediate support from trained counselors. Confidential and free, 24/7.',
    link: '/crisis', label: 'Get Help Now',
  },
  {
    icon: '\u{1F9D1}\u200D\u2764\uFE0F', title: 'Talk to a Counselor',
    desc: 'Schedule a one-on-one session with a licensed mental health professional.',
    link: '/counseling', label: 'Start Chat',
  },
  {
    icon: '\u{1F4AD}', title: 'AI-Guided Reflection',
    desc: 'A private, judgment-free space to explore your thoughts with gentle guidance.',
    link: '/reflect', label: 'Reflect Now',
  },
  {
    icon: '\u{1F9E9}', title: 'Take an Assessment',
    desc: 'Evaluate relationship health, stress, or emotional wellbeing with a guided self-test.',
    link: '/assessments', label: 'Start Test',
  },
  {
    icon: '\u{1F4DA}', title: 'Explore Courses',
    desc: 'Learn at your own pace with courses designed for life\u2019s big transitions.',
    link: '/learning', label: 'Browse Courses',
  },
];

const footerSections = [
  {
    title: 'MindSpace', links: [
      { label: 'About Us', to: '/' }, { label: 'Our Mission', to: '/' }, { label: 'Team', to: '/' },
    ],
  },
  {
    title: 'Support', links: [
      { label: 'Help Center', to: '/' }, { label: 'Contact Us', to: '/' }, { label: 'FAQ', to: '/' },
    ],
  },
  {
    title: 'Legal', links: [
      { label: 'Privacy Policy', to: '/' }, { label: 'Terms of Service', to: '/' }, { label: 'Cookie Policy', to: '/' },
    ],
  },
];

const stagger = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
};

const accentColors = ['#0D9488', '#0891B2', '#6366F1', '#D97706', '#8B5CF6', '#EC4899'];

const heroSlides = [
  '/kigali.jpg',
  '/kigali1.jpg',
  '/kigali2.jpg',
  '/kigali3.jpg',
  '/image.jpg',
];

const partners = [
  { name: 'RBC', image: 'rbc.png' },
  { name: 'MOH Rwanda', image: 'moh.png' },
  { name: 'WHO Rwanda', image: 'WHO.png' },
  { name: 'Ibuka', image: 'ibuka.jpg' },
  { name: 'MINUBUMWE', image: 'minubumwe.jpg' },
];

const modalContent = {
  about: {
    title: 'About MindSpace',
    icon: '\u{1F33F}',
    body: [
      'MindSpace is a digital mental health platform built by Rwandans for Rwandans. We believe that mental health support should be accessible, anonymous, and culturally grounded \u2014 no matter who you are or where you live.',
      'Our platform connects users with mood tracking, guided journaling, peer support communities, professional counseling, and crisis resources \u2014 all in one secure space.',
      'We work closely with the Rwanda Biomedical Center (RBC), the Ministry of Health, and local healthcare providers to ensure our resources are accurate, relevant, and trustworthy.',
    ],
  },
  mission: {
    title: 'Our Mission',
    icon: '\u{1F4A1}',
    body: [
      'To break the silence around mental health in Rwanda by providing a free, anonymous, and culturally sensitive digital safe space where every Rwandan can understand, track, and improve their mental well-being.',
      'We envision a Rwanda where seeking mental health support is as natural as visiting a health center \u2014 where no one suffers in silence, and where every individual has the tools they need to thrive.',
      'Our approach is rooted in community, confidentiality, and cultural relevance \u2014 meeting people where they are, in the languages they speak.',
    ],
  },
};

export default function HomePage() {
  const { user } = useAuth();
  const [slideIdx, setSlideIdx] = useState(0);
  const [modalKey, setModalKey] = useState(null);
  const [scrollPct, setScrollPct] = useState(0);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(h > 0 ? Math.min((window.scrollY / h) * 100, 100) : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIdx((p) => (p + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const openModal = (key) => { setModalKey(key); setNavOpen(false); };
  const closeModal = () => setModalKey(null);

  useEffect(() => {
    if (modalKey) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [modalKey]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="home-page">
      {/* ─── SCROLL PROGRESS ─── */}
      <div className="scroll-progress"><div className="scroll-progress-bar" style={{ width: `${scrollPct}%` }} /></div>

      {/* ─── HEADER NAV ─── */}
      <header className="home-header">
        <div className="home-header-inner">
          <Link to="/" className="home-header-logo">
            <span className="home-header-emblem">{'\u{1F33F}'}</span>
            <span>MindSpace</span>
          </Link>
          <button className="home-header-toggle" onClick={() => setNavOpen((v) => !v)} aria-label="Toggle navigation" aria-expanded={navOpen}>
            <span className={`toggle-bar ${navOpen ? 'open' : ''}`} />
            <span className={`toggle-bar ${navOpen ? 'open' : ''}`} />
            <span className={`toggle-bar ${navOpen ? 'open' : ''}`} />
          </button>
          <nav className={`home-header-nav ${navOpen ? 'open' : ''}`}>
            <button className="home-header-link" onClick={() => openModal('about')}>About Us</button>
            <button className="home-header-link" onClick={() => openModal('mission')}>Our Mission</button>
            <Link to="/crisis" className="home-header-link" onClick={() => setNavOpen(false)}>Crisis</Link>
            <Link to="/healing" className="home-header-link" onClick={() => setNavOpen(false)}>Resources</Link>
          </nav>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="home-hero">
        <div className="home-hero-bg">
          <AnimatePresence>
            <motion.div
              key={slideIdx}
              className="hero-slide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              style={{ backgroundImage: `url(${heroSlides[slideIdx]})` }}
            />
          </AnimatePresence>
        </div>
        <div className="home-hero-bg-fallback" />
        <div className="hero-shapes">
          <div className="hero-shape hero-shape-1" />
          <div className="hero-shape hero-shape-2" />
          <div className="hero-shape hero-shape-3" />
          <svg className="hero-heart-lines" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 170 C40 120, 10 80, 10 50 C10 25, 30 10, 50 10 C70 10, 85 25, 100 45 C115 25, 130 10, 150 10 C170 10, 190 25, 190 50 C190 80, 160 120, 100 170Z"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.15" />
            <line x1="100" y1="45" x2="100" y2="135" stroke="currentColor" strokeWidth="1" opacity="0.1" />
            <line x1="35" y1="40" x2="88" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.08" />
            <line x1="165" y1="40" x2="112" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.08" />
            <line x1="40" y1="90" x2="95" y2="110" stroke="currentColor" strokeWidth="1" opacity="0.08" />
            <line x1="160" y1="90" x2="105" y2="110" stroke="currentColor" strokeWidth="1" opacity="0.08" />
            <circle cx="50" cy="30" r="2.5" fill="currentColor" opacity="0.2" />
            <circle cx="150" cy="30" r="2.5" fill="currentColor" opacity="0.2" />
            <circle cx="100" cy="45" r="2.5" fill="currentColor" opacity="0.2" />
            <circle cx="100" cy="170" r="3" fill="currentColor" opacity="0.25" />
            <circle cx="15" cy="55" r="2" fill="currentColor" opacity="0.15" />
            <circle cx="185" cy="55" r="2" fill="currentColor" opacity="0.15" />
          </svg>
        </div>
        <div className="home-hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="hero-emblem">{'\u{1F33F}'}</span>
            <span className="highlight">MindSpace</span>
          </motion.h1>
          <motion.p
            className="home-tagline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          >
            Mental health, relationship, and life transition support that is
            accessible, anonymous, and culturally grounded for every Rwandan.
          </motion.p>
          <motion.div
            className="home-hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
          >
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg hero-cta">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/onboarding" className="btn btn-primary btn-lg hero-cta">
                Get Started Free
              </Link>
            )}
            <Link to="/healing" className="btn btn-outline btn-lg hero-cta-outline">
              Explore Resources
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="home-section stats-section">
        <div className="section-heading">
          <span className="stats-eyebrow">Why MindSpace Exists</span>
          <h2>The Reality We Can't Ignore</h2>
        </div>
        <div className="stats-bar">
          <motion.div
            className="stat-item stat-gap"
            custom={0}
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            <span className="stat-figure">
              <span className="stat-emoji">{'\u{1F9E0}'}</span>
              <span className="stat-number">18.6%</span>
            </span>
            <span className="stat-label">of Rwandans face a mental health condition — yet most suffer in silence.</span>
          </motion.div>
          <motion.div
            className="stat-item stat-gap"
            custom={1}
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            <span className="stat-figure">
              <span className="stat-emoji">{'\u{1F4BA}'}</span>
              <span className="stat-number">~18</span>
            </span>
            <span className="stat-label">psychiatrists for over 14 million Rwandans. That's one for every 777K people.</span>
          </motion.div>
          <motion.div
            className="stat-item stat-gap"
            custom={2}
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            <span className="stat-figure">
              <span className="stat-emoji">{'\u{1F6B7}'}</span>
              <span className="stat-number">95%</span>
            </span>
            <span className="stat-label">of young Rwandans avoid clinical care — stigma is still the biggest barrier.</span>
          </motion.div>
          <motion.div
            className="stat-item stat-promise"
            custom={3}
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            <span className="stat-promise-badge">{'\u{2764}\uFE0F'} Our Promise</span>
            <span className="stat-figure">
              <span className="stat-emoji">{'\u{2705}'}</span>
              <span className="stat-number promise-number">100%</span>
            </span>
            <span className="stat-label">Free, anonymous, and confidential — always. No judgment. No cost. No data shared.</span>
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="home-section">
        <div className="section-heading">
          <h2>How MindSpace Works</h2>
          <p>Everything you need to support your mental health journey</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="feature-card"
              custom={i}
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
              style={{ '--accent': accentColors[i] }}
            >
              <span className="feature-icon" style={{ background: `${accentColors[i]}14` }}>
                {f.icon}
              </span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <Link to="/onboarding" className="feature-cta">
                Start &rarr;
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── QUICK HELP & SUPPORT ─── */}
      <section className="home-section">
        <div className="section-heading">
          <h2>Quick Help &amp; Support</h2>
          <p>Get the support you need, right when you need it</p>
        </div>
        <div className="quick-help-grid">
          {quickHelpItems.map((item, i) => (
            <motion.div
              key={item.title}
              custom={i}
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
            >
              <Link to={item.link} className="quick-help-card" style={{ '--accent': accentColors[i + 2] }}>
                <span className="quick-help-icon" style={{ background: `${accentColors[i + 2]}14` }}>
                  {item.icon}
                </span>
                <div className="quick-help-body">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <span className="quick-help-cta">{item.label} &rarr;</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="home-section home-cta-banner-section">
        <div className="home-cta-banner">
          <div className="home-cta-banner-bg" />
          <h2>Your well-being matters</h2>
          <p>Start your journey today. Free, anonymous, and built for Rwanda.</p>
          <Link to={user ? '/dashboard' : '/onboarding'} className="btn btn-primary btn-lg">
            {user ? 'Go to Dashboard' : 'Get Started Free'}
          </Link>
        </div>
      </section>

      {/* ─── PARTNERS ─── */}
      <section className="home-section home-partners-section">
        <div className="section-heading">
          <h2>Trusted Partners</h2>
          <p>Working together to make mental health support accessible to all Rwandans</p>
        </div>
        <div className="partners-grid">
          {partners.map((p, i) => (
            <motion.div
              key={p.name}
              className="partner-logo"
              custom={i}
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <img className="partner-img" src={`/partners/${p.image}`} alt={p.name} loading="lazy" />
              <span className="partner-name">{p.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="home-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-icon">{'\u{1F33F}'}</span>
              <span>MindSpace</span>
            </div>
            <p>
              Mental health, relationship, and life transition support for every
              Rwandan.
            </p>
            <div className="footer-social">
              <span className="footer-social-icon" title="Twitter">{'\u{1D54F}'}</span>
              <span className="footer-social-icon" title="Instagram">{'\u{1D4F8}'}</span>
              <span className="footer-social-icon" title="WhatsApp">{'\u{1F4AC}'}</span>
            </div>
          </div>
          <div className="footer-groups">
            {footerSections.map((group) => (
              <div key={group.title} className="footer-group">
                <h4>{group.title}</h4>
                <ul>
                    {group.links.map((l) => {
                      const modalKey = { 'About Us': 'about', 'Our Mission': 'mission' }[l.label];
                      return (
                        <li key={l.label}>
                          {modalKey ? (
                            <button className="footer-link-btn" onClick={() => openModal(modalKey)}>
                              {l.label}
                            </button>
                          ) : (
                            <Link to={l.to}>{l.label}</Link>
                          )}
                        </li>
                      );
                    })}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            Built by Rwandans for Rwandans in the languages Rwanda speaks
          </p>
          <p className="footer-credit">
            Mugabo Hussein &amp; Nayituriki Adolphe &middot; ICT Chamber &middot; 2026
          </p>
        </div>
      </footer>
      {/* ─── AI CHART FAB ─── */}
      <HomeChartFab />

      {/* ─── ABOUT / MISSION MODAL ─── */}
      <AnimatePresence>
        {modalKey && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={closeModal} aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <div className="modal-emblem">{modalContent[modalKey]?.icon}</div>
              <h2 className="modal-title">{modalContent[modalKey]?.title}</h2>
              <div className="modal-divider" />
              <div className="modal-body">
                {modalContent[modalKey]?.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
