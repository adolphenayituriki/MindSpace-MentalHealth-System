import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../i18n/i18n';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const ADMIN_NAV = [
  { to: '/', label: 'Home', icon: '\u{1F3E0}', desc: 'Go to homepage' },
  { to: '/dashboard', label: 'Dashboard', icon: '\u{1F4CA}', desc: 'Platform overview & stats' },
  { to: '/admin', label: 'Admin Panel', icon: '\u{2699}\uFE0F', desc: 'Manage users, resources & more' },
];

const ADMIN_BOTTOM = [
  { to: '/crisis', label: 'Crisis Support', icon: '\u{1F6E1}', desc: 'Emergency resources' },
];

const COUNSELOR_NAV = [
  { to: '/', label: 'Home', icon: '\u{1F3E0}', desc: 'Go to homepage' },
  { to: '/dashboard', label: 'Dashboard', icon: '\u{1F4CB}', desc: 'Your counseling overview' },
  { to: '/counseling', label: 'Counseling', icon: '\u{1F9D1}\u200D\u{2764}\uFE0F', desc: 'Sessions & messages' },
  { to: '/communities', label: 'Communities', icon: '\u{1F46B}', desc: 'Support groups' },
  { to: '/healing', label: 'Healing', icon: '\u{1F33F}', desc: 'Resources & tools' },
  { to: '/insights', label: 'Insights', icon: '\u{1F4CA}', desc: 'Track progress' },
];

const COUNSELOR_BOTTOM = [
  { to: '/crisis', label: 'Crisis Support', icon: '\u{1F6E1}', desc: 'Emergency resources' },
  { to: '/admin', label: 'Settings', icon: '\u{2699}\uFE0F', desc: 'Profile & availability' },
];

const USER_NAV = [
  { to: '/', label: 'Home', icon: '\u{1F3E0}', desc: 'Go to homepage' },
  { to: '/dashboard', label: 'Dashboard', icon: '\u{1F4CB}', desc: 'Your daily overview' },
  { to: '/reflect', label: 'Reflect', icon: '\u{1F4AD}', desc: 'Guided reflection chat' },
  { to: '/mood', label: 'Mood', icon: '\u{1F60A}', desc: 'Track your feelings' },
  { to: '/healing', label: 'Heal', icon: '\u{1F33F}', desc: 'Self-care resources' },
  { to: '/journal', label: 'Journal', icon: '\u{1F4DD}', desc: 'Write your thoughts' },
  { to: '/communities', label: 'Communities', icon: '\u{1F46B}', desc: 'Connect with others' },
  { to: '/counseling', label: 'Counseling', icon: '\u{1F9D1}\u200D\u{2764}\uFE0F', desc: 'Talk to a counselor' },
  { to: '/insights', label: 'Insights', icon: '\u{1F4CA}', desc: 'See your patterns' },
];

const USER_BOTTOM = [
  { to: '/crisis', label: 'Crisis Support', icon: '\u{1F6E1}', desc: 'Get help now' },
];

const overlayVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.035, duration: 0.2, ease: 'easeOut' },
  }),
};

function SidebarLink({ to, icon, label, desc, active, onClick }) {
  return (
    <Link
      to={to}
      className={`sidebar-link ${active ? 'active' : ''}`}
      onClick={onClick}
      title={desc}
    >
      <span className="sidebar-link-icon">{icon}</span>
      <span className="sidebar-link-label">
        <span>{label}</span>
        <span className="sidebar-link-desc">{desc}</span>
      </span>
    </Link>
  );
}

function NavSection({ title, items, startIdx, activePath, onClose }) {
  return (
    <div className="sidebar-section">
      {title && <div className="sidebar-section-title">{title}</div>}
      {items.map((l, i) => (
        <motion.div
          key={l.to}
          custom={startIdx + i}
          variants={navItemVariants}
          initial="hidden"
          animate="visible"
        >
          <SidebarLink
            to={l.to}
            icon={l.icon}
            label={l.label}
            desc={l.desc}
            active={activePath === l.to}
            onClick={onClose}
          />
        </motion.div>
      ))}
    </div>
  );
}

function MobileNav({ items, activePath, color }) {
  return (
    <nav className="mobile-nav">
      {items.map((item) => {
        const isActive = activePath === item.to;
        return (
          <Link key={item.to} to={item.to} className="mobile-nav-link">
            <span className="mobile-nav-icon" style={{
              background: isActive ? `${color}18` : 'transparent',
              color: isActive ? (color || 'var(--primary)') : 'var(--text-muted)',
            }}>{item.icon}</span>
            {isActive && <span className="mobile-nav-label" style={{ color: color || 'var(--primary)' }}>{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Sidebar() {
  const { setLanguage, getLanguage } = useTranslation();
  const { user, logout } = useAuth();
  const { darkMode, toggleDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMore, setShowMore] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') closeMenu(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [closeMenu]);

  const toggleLang = () => {
    const next = getLanguage() === 'rw' ? 'en' : 'rw';
    setLanguage(next);
  };

  const isAdmin = user?.role === 'admin';
  const isCounselor = user?.role === 'counselor';
  const navItems = isAdmin ? ADMIN_NAV : isCounselor ? COUNSELOR_NAV : USER_NAV;
  const bottomItems = isAdmin ? ADMIN_BOTTOM : isCounselor ? COUNSELOR_BOTTOM : USER_BOTTOM;
  const activePath = location.pathname;
  const accentColor = isAdmin ? '#EF4444' : isCounselor ? '#6366F1' : '#0D9488';

  if (isMobile) {
    return (
      <>
        <header className="mobile-topbar">
          <Link to="/" className="mobile-topbar-logo">
            MindSpace
          </Link>
          <motion.button
            className="hamburger"
            onClick={() => setShowMore((v) => !v)}
            aria-label="More options"
            whileTap={{ scale: 0.9 }}
          >
            <span /><span /><span />
          </motion.button>
        </header>

        <MobileNav items={navItems} activePath={activePath} color={accentColor} />

        <AnimatePresence>
          {showMore && (
            <motion.div
              className="sidebar-overlay visible"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.2 }}
              onClick={() => setShowMore(false)}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        <aside className={`sidebar mobile-drawer ${showMore ? 'open' : ''}`}>
          <div className="sidebar-header">
            <Link to="/" className="sidebar-logo" onClick={() => setShowMore(false)}>
              MindSpace
            </Link>
            <motion.button
              className="hamburger open"
              onClick={() => setShowMore(false)}
              aria-label="Close menu"
              whileTap={{ scale: 0.9 }}
            >
              <span /><span /><span />
            </motion.button>
          </div>

          <nav className="sidebar-nav">
            <NavSection items={bottomItems} startIdx={0} activePath={activePath} onClose={() => setShowMore(false)} />
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-controls">
              <motion.button
                className="sidebar-icon-btn"
                onClick={toggleLang}
                title="Switch language"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {getLanguage() === 'rw' ? 'EN' : 'RW'}
              </motion.button>
              <motion.button
                className="sidebar-icon-btn"
                onClick={toggleDark}
                title={darkMode ? 'Light mode' : 'Dark mode'}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {darkMode ? '\u2600' : '\u263E'}
              </motion.button>
            </div>

            <motion.div
              className="sidebar-user"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              <div className="sidebar-avatar" style={{
                background: accentColor,
              }}>
                {(user?.displayName || 'G').charAt(0)}
              </div>
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">{user?.displayName || 'Guest'}</span>
                <span className="sidebar-user-tag" style={{ textTransform: 'capitalize' }}>
                  {isAdmin ? 'Admin' : isCounselor ? 'Counselor' : user?.isAnonymous ? 'Anonymous' : 'User'}
                </span>
              </div>
              <motion.button
                className="sidebar-logout"
                onClick={() => { logout(); navigate('/'); setShowMore(false); }}
                title="Log out"
                whileHover={{ backgroundColor: 'rgba(239,68,68,0.12)', borderColor: 'var(--danger)' }}
                whileTap={{ scale: 0.97 }}
              >
                <span>{'\u{23FB}'}</span>
                <span>{getLanguage() === 'rw' ? 'Sohoka' : 'Logout'}</span>
              </motion.button>
            </motion.div>
          </div>
        </aside>
      </>
    );
  }

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            MindSpace
          </Link>
        </div>

        <nav className="sidebar-nav">
          {isAdmin && (
            <div className="sidebar-role-banner" style={{ background: '#EF444418', color: '#EF4444', borderBottom: '1px solid #EF444420' }}>
              {'\u{1F6E1}\uFE0F'} Admin Panel
            </div>
          )}
          {isCounselor && (
            <div className="sidebar-role-banner" style={{ background: '#6366F118', color: '#6366F1', borderBottom: '1px solid #6366F120' }}>
              {'\u{1F9D1}\u200D\u2695\uFE0F'} Counselor Workspace
            </div>
          )}

          <NavSection items={navItems} startIdx={0} activePath={activePath} onClose={() => {}} />

          {isAdmin && (
            <NavSection
              title="Management"
              items={[
                { to: '/admin?tab=users', label: 'Users', icon: '\u{1F465}', desc: 'Manage accounts & roles' },
                { to: '/admin?tab=healing', label: 'Healing', icon: '\u{1F33F}', desc: 'Manage resources' },
                { to: '/admin?tab=counselors', label: 'Counselors', icon: '\u{1F9D1}\u200D\u2695\uFE0F', desc: 'Manage counselors' },
                { to: '/admin?tab=crisis', label: 'Crisis', icon: '\u{1F6E1}\uFE0F', desc: 'Manage crisis resources' },
                { to: '/admin?tab=communities', label: 'Communities', icon: '\u{1F3E0}', desc: 'Manage communities' },
              ]}
              startIdx={navItems.length}
              activePath={activePath}
              onClose={() => {}}
            />
          )}

          {isCounselor && (
            <NavSection
              title="Resources"
              items={[
                { to: '/healing', label: 'Healing Tools', icon: '\u{1F33F}', desc: 'Self-care resources' },
              ]}
              startIdx={navItems.length}
              activePath={activePath}
              onClose={() => {}}
            />
          )}
        </nav>

        <div className="sidebar-footer">
          <NavSection items={bottomItems} startIdx={0} activePath={activePath} onClose={() => {}} />

          <div className="sidebar-controls">
            <motion.button
              className="sidebar-icon-btn"
              onClick={toggleLang}
              title="Switch language"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {getLanguage() === 'rw' ? 'EN' : 'RW'}
            </motion.button>
            <motion.button
              className="sidebar-icon-btn"
              onClick={toggleDark}
              title={darkMode ? 'Light mode' : 'Dark mode'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {darkMode ? '\u2600' : '\u263E'}
            </motion.button>
          </div>

          <motion.div
            className="sidebar-user"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.3 }}
          >
            <div className="sidebar-avatar" style={{
              background: accentColor,
            }}>
              {(user?.displayName || 'G').charAt(0)}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.displayName || 'Guest'}</span>
              <span className="sidebar-user-tag" style={{ textTransform: 'capitalize' }}>
                {isAdmin ? 'Admin' : isCounselor ? 'Counselor' : user?.isAnonymous ? 'Anonymous' : 'User'}
              </span>
            </div>
            <motion.button
              className="sidebar-logout"
              onClick={() => { logout(); navigate('/'); }}
              title="Log out"
              whileHover={{ backgroundColor: 'rgba(239,68,68,0.12)', borderColor: 'var(--danger)' }}
              whileTap={{ scale: 0.97 }}
            >
              <span>{'\u{23FB}'}</span>
              <span>{getLanguage() === 'rw' ? 'Sohoka' : 'Logout'}</span>
            </motion.button>
          </motion.div>
        </div>
      </aside>
    </>
  );
}
