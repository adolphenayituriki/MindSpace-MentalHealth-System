import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from '../i18n/i18n';
import { useAuth } from '../contexts/AuthContext';

const features = [
  { icon: '\u{1F4CB}', title: 'Mood Tracking', desc: 'Log how you feel each day and watch your emotional patterns emerge. Small daily check-ins build self-awareness.' },
  { icon: '\u{1F4DD}', title: 'Guided Journaling', desc: 'Write with culturally relevant prompts that help you reflect. No blank page \u2014 just a gentle starting point.' },
  { icon: '\u{1F46B}', title: 'Peer Communities', desc: 'Join anonymous topic-based communities. Share, listen, and connect with others who understand.' },
  { icon: '\u{1F9D1}\u200D\u2764\uFE0F', title: 'Counselor Support', desc: 'Message a licensed counselor when you need more than a conversation. No booking, no waiting room.' },
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

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* ─── HERO ─── */}
      <section className="home-hero">
        <div className="home-hero-bg" />
        <div className="hero-shapes">
          <div className="hero-shape hero-shape-1" />
          <div className="hero-shape hero-shape-2" />
          <div className="hero-shape hero-shape-3" />
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
            Mental health support that is accessible, anonymous, and culturally
            grounded for every Rwandan.
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
      <section className="home-section">
        <div className="stats-bar">
          {[
            { icon: '\u{1F9E0}', number: '18.6%', label: 'of Rwandans face a mental health condition' },
            { icon: '\u{1F4BA}', number: '~18', label: 'psychiatrists for 14M+ Rwandans' },
            { icon: '\u{1F6B7}', number: '95%', label: 'of youth avoid clinical care' },
            { icon: '\u{2705}', number: '100%', label: 'Free and anonymous by default', highlight: true },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              className={`stat-item ${s.highlight ? 'stat-highlight' : ''}`}
              custom={i}
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-number">{s.number}</span>
              <span className="stat-label">{s.label}</span>
            </motion.div>
          ))}
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

      {/* ─── FOOTER ─── */}
      <footer className="home-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-icon">{'\u{1F33F}'}</span>
              <span>MindSpace</span>
            </div>
            <p>
              Mental health support that is accessible, anonymous, and culturally
              grounded for every Rwandan.
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
                  {group.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to}>{l.label}</Link>
                    </li>
                  ))}
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
    </div>
  );
}
