import { Link } from 'react-router-dom';
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
    icon: '\u{1F3E2}',
    title: 'Visit a Health Center',
    desc: 'Find verified mental health centers near you with opening hours and contact info.',
    link: '/healing',
    label: 'Find Centers',
  },
  {
    icon: '\u{1F4DE}',
    title: 'Crisis Hotline',
    desc: 'Immediate support from trained counselors. Confidential and free, 24/7.',
    link: '/crisis',
    label: 'Get Help Now',
  },
  {
    icon: '\u{1F9D1}\u200D\u2764\uFE0F',
    title: 'Talk to a Counselor',
    desc: 'Schedule a one-on-one session with a licensed mental health professional.',
    link: '/counseling',
    label: 'Start Chat',
  },
  {
    icon: '\u{1F4AD}',
    title: 'AI-Guided Reflection',
    desc: 'A private, judgment-free space to explore your thoughts with gentle guidance.',
    link: '/reflect',
    label: 'Reflect Now',
  },
];

const footerSections = [
  {
    title: 'MindSpace',
    links: [
      { label: 'About Us', to: '/' },
      { label: 'Our Mission', to: '/' },
      { label: 'Team', to: '/' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', to: '/' },
      { label: 'Contact Us', to: '/' },
      { label: 'FAQ', to: '/' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/' },
      { label: 'Terms of Service', to: '/' },
      { label: 'Cookie Policy', to: '/' },
    ],
  },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* ─── HERO ─── */}
      <section className="home-hero">
        <div className="home-hero-bg" />
        <div className="home-hero-content">
          <h1>
            <span className="highlight">MindSpace</span>
          </h1>
          <p className="home-tagline">
            Mental health support that is accessible, anonymous, and culturally
            grounded for every Rwandan.
          </p>
          <div className="home-hero-actions">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/onboarding" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
            )}
            <Link to="/healing" className="btn btn-outline btn-lg">
              Explore Resources
            </Link>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="home-section">
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-icon">{'\u{1F9E0}'}</span>
            <span className="stat-number">18.6%</span>
            <span className="stat-label">of Rwandans face a mental health condition</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">{'\u{1F4BA}'}</span>
            <span className="stat-number">~18</span>
            <span className="stat-label">psychiatrists for 14M+ Rwandans</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">{'\u{1F6B7}'}</span>
            <span className="stat-number">95%</span>
            <span className="stat-label">of youth avoid clinical care</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">{'\u{2705}'}</span>
            <span className="stat-number">100%</span>
            <span className="stat-label">Free and anonymous by default</span>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="home-section">
        <div className="section-heading">
          <h2>How MindSpace Works</h2>
          <p>Everything you need to support your mental health journey</p>
        </div>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <Link to="/onboarding" className="feature-cta">Start &rarr;</Link>
            </div>
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
          {quickHelpItems.map((item) => (
            <Link key={item.title} to={item.link} className="quick-help-card">
              <span className="quick-help-icon">{item.icon}</span>
              <div className="quick-help-body">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <span className="quick-help-cta">{item.label} &rarr;</span>
              </div>
            </Link>
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
              Mental health support that is accessible, anonymous, and culturally
              grounded for every Rwandan.
            </p>
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
