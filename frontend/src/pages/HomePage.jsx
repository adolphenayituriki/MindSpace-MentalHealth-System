import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, setLanguage as setAppLanguage, getLanguage } from '../i18n/i18n';
import { useAuth } from '../contexts/AuthContext';
import HomeChartFab from '../components/chat/HomeChartFab';
import { FaClipboardList, FaPenFancy, FaPuzzlePiece, FaBookOpen, FaUsers, FaHeart, FaChartLine, FaShieldAlt, FaHospital, FaPhone, FaRegComments, FaBrain, FaLeaf, FaUserMd, FaBan, FaCheckCircle, FaHandHoldingHeart } from 'react-icons/fa';

const features = [
  { icon: <FaClipboardList />, title: 'Mood Tracking', desc: 'Log how you feel each day and watch your emotional patterns emerge. Small daily check-ins build self-awareness.' },
  { icon: <FaPenFancy />, title: 'Guided Journaling', desc: 'Write with culturally relevant prompts that help you reflect. No blank page \u2014 just a gentle starting point.' },
  { icon: <FaPuzzlePiece />, title: 'Self-Assessments', desc: 'Take guided tests for relationship health, stress levels, and wellbeing. Get instant scores and recommendations.' },
  { icon: <FaBookOpen />, title: 'Learning Center', desc: 'Access courses on marriage preparation, parenting, grief, retirement, and emotional wellbeing at your own pace.' },
  { icon: <FaUsers />, title: 'Peer Communities', desc: 'Join anonymous topic-based communities. Share, listen, and connect with others who understand.' },
  { icon: <FaHeart />, title: 'Counselor Support', desc: 'Message a licensed counselor when you need more than a conversation. Book a session that fits your schedule.' },
  { icon: <FaChartLine />, title: 'Weekly Reflections', desc: 'Review your emotional patterns with weekly summaries. See your progress over time.' },
  { icon: <FaShieldAlt />, title: 'Crisis Resources', desc: 'Verified local hotlines, health centers, and NGOs \u2014 available in one tap when you need them most.' },
];

const quickHelpItems = [
  {
    icon: <FaHospital />, title: 'Visit a Health Center',
    desc: 'Find verified mental health centers near you with opening hours and contact info.',
    link: '/healing', label: 'Find Centers',
  },
  {
    icon: <FaPhone />, title: 'Crisis Hotline',
    desc: 'Immediate support from trained counselors. Confidential and free, 24/7.',
    link: '/crisis', label: 'Get Help Now',
  },
  {
    icon: <FaHeart />, title: 'Talk to a Counselor',
    desc: 'Schedule a one-on-one session with a licensed mental health professional.',
    link: '/counseling', label: 'Start Chat',
  },
  {
    icon: <FaBrain />, title: 'AI-Guided Reflection',
    desc: 'A private, judgment-free space to explore your thoughts with gentle guidance.',
    link: '/reflect', label: 'Reflect Now',
  },
  {
    icon: <FaPuzzlePiece />, title: 'Take an Assessment',
    desc: 'Evaluate relationship health, stress, or emotional wellbeing with a guided self-test.',
    link: '/assessments', label: 'Start Test',
  },
  {
    icon: <FaBookOpen />, title: 'Explore Courses',
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

const accentColors = ['#0D9488', '#0891B2', '#6366F1', '#D97706', '#8B5CF6', '#EC4899', '#0EA5E9', '#F59E0B'];

const heroSlides = [
  '/kigali.jpg',
  '/kigali1.jpg',
  '/kigali2.jpg',
  '/kigali3.jpg',
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
    icon: <FaLeaf />,
    body: [
      'MindSpace is a digital mental health platform built by Rwandans for Rwandans. We believe that mental health support should be accessible, anonymous, and culturally grounded \u2014 no matter who you are or where you live.',
      'Our platform connects users with mood tracking, guided journaling, peer support communities, professional counseling, and crisis resources \u2014 all in one secure space.',
      'We work closely with the Rwanda Biomedical Center (RBC), the Ministry of Health, and local healthcare providers to ensure our resources are accurate, relevant, and trustworthy.',
    ],
  },
  mission: {
    title: 'Our Mission',
    icon: <FaBrain />,
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
  const [lang, setLang] = useState(getLanguage());

  const toggleLang = () => {
    const next = lang === 'rw' ? 'en' : 'rw';
    setAppLanguage(next);
    setLang(next);
    window.location.reload();
  };

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
            <span className="home-header-emblem"><FaLeaf /></span>
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
            <button className="lang-toggle" onClick={toggleLang} title={`Switch to ${lang === 'rw' ? 'English' : 'Kinyarwanda'}`}>
              <span className={`lang-toggle-opt ${lang === 'rw' ? 'active' : ''}`}>RW</span>
              <span className="lang-toggle-divider">/</span>
              <span className={`lang-toggle-opt ${lang === 'en' ? 'active' : ''}`}>EN</span>
            </button>
          </nav>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="home-hero" aria-label="Hero banner">
        <div className="home-hero-bg" aria-hidden="true">
          <AnimatePresence>
            <motion.div
              key={slideIdx}
              className="hero-slide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              style={{ backgroundImage: `url(${heroSlides[slideIdx]})` }}
              role="img"
              aria-label={`Background image ${slideIdx + 1} of ${heroSlides.length}`}
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
            <span className="hero-emblem"><FaLeaf /></span>
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
            className="hero-trust"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: 'easeOut' }}
          >
            <span className="hero-trust-dot" />
            Trusted by thousands across Rwanda &middot; 100% free &amp; anonymous
          </motion.div>
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
        <div className="hero-scroll-indicator" aria-hidden="true">
          <span className="hero-scroll-text">Scroll</span>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 3v12M5 11l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="home-section stats-section">
        <div className="section-heading">
          <span className="stats-eyebrow">Why MindSpace Exists</span>
          <h2>The Reality We Can't Ignore</h2>
          <div className="heading-divider" aria-hidden="true">
            <span className="heading-divider-line" />
            <span className="heading-divider-icon"><FaLeaf /></span>
            <span className="heading-divider-line" />
          </div>
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
              <span className="stat-emoji"><FaBrain /></span>
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
              <span className="stat-emoji"><FaUserMd /></span>
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
              <span className="stat-emoji"><FaBan /></span>
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
            <span className="stat-promise-badge"><FaHandHoldingHeart /> Our Promise</span>
            <span className="stat-figure">
              <span className="stat-emoji"><FaCheckCircle /></span>
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
          <div className="heading-divider" aria-hidden="true">
            <span className="heading-divider-line" />
            <span className="heading-divider-icon"><FaLeaf /></span>
            <span className="heading-divider-line" />
          </div>
          <p>Everything you need to support your mental health journey</p>
        </div>
        <div className="features-grid">
          {features.flatMap((f, i) => [
            i === 4 ? (
              <div key="zigzag" className="features-zigzag" aria-hidden="true">
                <svg viewBox="0 0 960 12" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                  <path d="M0 6 L30 0 L60 6 L90 0 L120 6 L150 0 L180 6 L210 0 L240 6 L270 0 L300 6 L330 0 L360 6 L390 0 L420 6 L450 0 L480 6 L510 0 L540 6 L570 0 L600 6 L630 0 L660 6 L690 0 L720 6 L750 0 L780 6 L810 0 L840 6 L870 0 L900 6 L930 0 L960 6"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    className="zigzag-path" />
                </svg>
              </div>
            ) : [],
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
            <span className="feature-step">{i + 1}</span>
            <span className="feature-icon" style={{ background: `${accentColors[i]}14` }}>
              {f.icon}
            </span>
            <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <div className="feature-divider" />
              <Link to="/onboarding" className="feature-cta">
                Start &rarr;
              </Link>
            </motion.div>,
          ])}
        </div>
      </section>

      {/* ─── QUICK HELP & SUPPORT ─── */}
      <section className="home-section">
        <div className="section-heading">
          <h2>Quick Help &amp; Support</h2>
          <div className="heading-divider" aria-hidden="true">
            <span className="heading-divider-line" />
            <span className="heading-divider-icon"><FaLeaf /></span>
            <span className="heading-divider-line" />
          </div>
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
          <div className="heading-divider" aria-hidden="true">
            <span className="heading-divider-line" />
            <span className="heading-divider-icon"><FaLeaf /></span>
            <span className="heading-divider-line" />
          </div>
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
              <span className="footer-logo-icon"><FaLeaf /></span>
              <span>MindSpace</span>
            </div>
            <p>
              Mental health, relationship, and life transition support for every
              Rwandan.
            </p>
            <div className="footer-social">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" title="Twitter" aria-label="Twitter">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" title="Instagram" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://wa.me" target="_blank" rel="noopener noreferrer" className="footer-social-icon" title="WhatsApp" aria-label="WhatsApp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
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
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-accent" />
              <button className="modal-close" onClick={closeModal} aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <div className="modal-emblem-wrap">
                <div className="modal-emblem-glow" />
                <div className="modal-emblem">{modalContent[modalKey]?.icon}</div>
              </div>
              <h2 className="modal-title">{modalContent[modalKey]?.title}</h2>
              <div className="heading-divider" aria-hidden="true" style={{ margin: '0.5rem auto 1.25rem' }}>
                <span className="heading-divider-line" />
                <span className="heading-divider-icon" style={{ fontSize: '0.85rem' }}>{modalContent[modalKey]?.icon}</span>
                <span className="heading-divider-line" />
              </div>
              <div className="modal-body">
                {modalContent[modalKey]?.body.map((p, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 + i * 0.08, ease: 'easeOut' }}
                  >
                    {p}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
