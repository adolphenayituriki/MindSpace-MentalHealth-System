import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from '../../i18n/i18n';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FaHome, FaChartBar, FaCog, FaExclamationTriangle, FaUser, FaComments, FaPuzzlePiece, FaBookOpen, FaUsers, FaLeaf, FaChartLine, FaSmile, FaPenFancy, FaHeart, FaShieldAlt, FaMoon, FaSun, FaSignOutAlt } from 'react-icons/fa';

const iconMap = {
  home: <FaHome />, dashboard: <FaChartBar />, admin: <FaCog />,
  crisis: <FaExclamationTriangle />, profile: <FaUser />,
  counseling: <FaComments />, assessments: <FaPuzzlePiece />,
  learn: <FaBookOpen />, communities: <FaUsers />,
  healing: <FaLeaf />, insights: <FaChartLine />,
  reflect: <FaHeart />, mood: <FaSmile />, journal: <FaPenFancy />,
  heal: <FaLeaf />, settings: <FaCog />,
};

const ADMIN_NAV = [
  { to: '/', label: 'Home', icon: 'home', desc: 'Go to homepage' },
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard', desc: 'Platform overview & stats' },
  { to: '/admin', label: 'Admin Panel', icon: 'admin', desc: 'Manage users, resources & more' },
];

const ADMIN_BOTTOM = [
  { to: '/crisis', label: 'Crisis Support', icon: 'crisis', desc: 'Emergency resources' },
  { to: '/profile', label: 'Profile', icon: 'profile', desc: 'Your profile & settings' },
];

const COUNSELOR_NAV = [
  { to: '/', label: 'Home', icon: 'home', desc: 'Go to homepage' },
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard', desc: 'Your counseling overview' },
  { to: '/counseling', label: 'Counseling', icon: 'counseling', desc: 'Sessions & messages' },
  { to: '/assessments', label: 'Assessments', icon: 'assessments', desc: 'Self-assessment tools' },
  { to: '/learning', label: 'Learn', icon: 'learn', desc: 'Courses & training' },
  { to: '/communities', label: 'Communities', icon: 'communities', desc: 'Support groups' },
  { to: '/healing', label: 'Healing', icon: 'healing', desc: 'Resources & tools' },
  { to: '/insights', label: 'Insights', icon: 'insights', desc: 'Track progress' },
];

const COUNSELOR_BOTTOM = [
  { to: '/crisis', label: 'Crisis Support', icon: 'crisis', desc: 'Emergency resources' },
  { to: '/profile', label: 'Profile', icon: 'profile', desc: 'Your profile & settings' },
  { to: '/admin', label: 'Settings', icon: 'settings', desc: 'Profile & availability' },
];

const USER_NAV = [
  { to: '/', label: 'Home', icon: 'home', desc: 'Go to homepage' },
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard', desc: 'Your daily overview' },
  { to: '/reflect', label: 'Reflect', icon: 'reflect', desc: 'Guided reflection chat' },
  { to: '/mood', label: 'Mood', icon: 'mood', desc: 'Track your feelings' },
  { to: '/healing', label: 'Heal', icon: 'heal', desc: 'Self-care resources' },
  { to: '/journal', label: 'Journal', icon: 'journal', desc: 'Write your thoughts' },
  { to: '/assessments', label: 'Assessments', icon: 'assessments', desc: 'Self-assessment tests' },
  { to: '/learning', label: 'Learn', icon: 'learn', desc: 'Courses & training' },
  { to: '/communities', label: 'Communities', icon: 'communities', desc: 'Connect with others' },
  { to: '/counseling', label: 'Counseling', icon: 'counseling', desc: 'Talk to a counselor' },
  { to: '/insights', label: 'Insights', icon: 'insights', desc: 'See your patterns' },
];

const USER_BOTTOM = [
  { to: '/crisis', label: 'Crisis Support', icon: 'crisis', desc: 'Get help now' },
  { to: '/profile', label: 'Profile', icon: 'profile', desc: 'Your profile & settings' },
];

function SidebarLink({ to, icon, label, desc, active, onClick, collapsed, onExpand }) {
  const handleClick = (e) => {
    if (collapsed && onExpand) {
      onExpand();
    }
    if (onClick) onClick();
  };

  return (
    <Link
      to={to}
      className={`sidebar-link ${active ? 'active' : ''}`}
      onClick={handleClick}
      title={desc}
    >
      <span className="sidebar-link-icon">{iconMap[icon] || icon}</span>
      <span className="sidebar-link-label">
        <span>{label}</span>
        <span className="sidebar-link-desc">{desc}</span>
      </span>
    </Link>
  );
}

function NavSection({ title, items, activePath, onClose, collapsed, onExpand }) {
  return (
    <div className="sidebar-section">
      {title && <div className="sidebar-section-title">{title}</div>}
      {items.map((l) => (
        <SidebarLink
          key={l.to}
          to={l.to}
          icon={l.icon}
          label={l.label}
          desc={l.desc}
          active={activePath === l.to}
          onClick={onClose}
          collapsed={collapsed}
          onExpand={onExpand}
        />
      ))}
    </div>
  );
}

export default function Sidebar() {
  const { setLanguage, getLanguage } = useTranslation();
  const { user, logout } = useAuth();
  const { darkMode, toggleDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const close = useCallback(() => { if (isMobile) setExpanded(false); }, [isMobile]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setExpanded(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { close(); }, [location.pathname, close]);

  useEffect(() => {
    document.body.style.overflow = (isMobile && expanded) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobile, expanded]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [close]);

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
  const showExpanded = expanded && !isMobile;
  const sidebarExpanded = expanded || (!isMobile && !expanded ? false : expanded);

  return (
    <>
      {/* Mobile top bar */}
      <header className="mobile-topbar">
        <motion.button
          className="hamburger"
          onClick={() => setExpanded((v) => !v)}
          aria-label="Toggle menu"
          whileTap={{ scale: 0.9 }}
        >
          <span /><span /><span />
        </motion.button>
        <Link to="/" className="mobile-topbar-logo">MindSpace</Link>
      </header>

      {/* Mobile overlay */}
      {isMobile && expanded && (
        <div className="sidebar-overlay visible" onClick={close} aria-hidden="true" />
      )}

      {/* Sidebar - always visible on both desktop and mobile */}
      <aside className={`sidebar ${!expanded ? 'sidebar-collapsed' : ''} ${isMobile ? 'sidebar-mobile' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo" onClick={close}>MindSpace</Link>
          {!isMobile && (
            <motion.button
              className="sidebar-collapse-btn"
              onClick={() => setExpanded((v) => !v)}
              title={expanded ? 'Collapse' : 'Expand'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {expanded ? '\u25C0' : '\u25B6'}
            </motion.button>
          )}
        </div>

        <nav className="sidebar-nav">
          {isAdmin && (
            <div className="sidebar-role-banner" style={{ background: '#EF444418', color: '#EF4444', borderBottom: '1px solid #EF444420' }}>
              <FaShieldAlt style={{ marginRight: 6 }} /> Admin Panel
            </div>
          )}
          {isCounselor && (
            <div className="sidebar-role-banner" style={{ background: '#6366F118', color: '#6366F1', borderBottom: '1px solid #6366F120' }}>
              <FaHeart style={{ marginRight: 6 }} /> Counselor Workspace
            </div>
          )}

          <NavSection items={navItems} activePath={activePath} onClose={close} collapsed={!expanded} onExpand={() => setExpanded(true)} />

          {isAdmin && (
            <NavSection
              title="Management"
              items={[
                { to: '/admin?tab=users', label: 'Users', icon: 'profile', desc: 'Manage accounts & roles' },
                { to: '/admin?tab=healing', label: 'Healing', icon: 'healing', desc: 'Manage resources' },
                { to: '/admin?tab=counselors', label: 'Counselors', icon: 'counseling', desc: 'Manage counselors' },
                { to: '/admin?tab=crisis', label: 'Crisis', icon: 'crisis', desc: 'Manage crisis resources' },
                { to: '/admin?tab=communities', label: 'Communities', icon: 'communities', desc: 'Manage communities' },
              ]}
              activePath={activePath}
              onClose={close}
              collapsed={!expanded}
              onExpand={() => setExpanded(true)}
            />
          )}

          {isCounselor && (
            <NavSection
              title="Resources"
              items={[
                { to: '/healing', label: 'Healing Tools', icon: <FaLeaf />, desc: 'Self-care resources' },
              ]}
              activePath={activePath}
              onClose={close}
              collapsed={!expanded}
              onExpand={() => setExpanded(true)}
            />
          )}
        </nav>

        <div className="sidebar-footer">
          <NavSection items={bottomItems} activePath={activePath} onClose={close} collapsed={!expanded} onExpand={() => setExpanded(true)} />

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
              {darkMode ? <FaSun /> : <FaMoon />}
            </motion.button>
          </div>

          <motion.div
            className="sidebar-user"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.3 }}
          >
            <div className="sidebar-avatar" style={{ background: accentColor }}>
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
              onClick={() => { logout(); navigate('/'); close(); }}
              title="Log out"
              whileHover={{ backgroundColor: 'rgba(239,68,68,0.12)', borderColor: 'var(--danger)' }}
              whileTap={{ scale: 0.97 }}
            >
              <FaSignOutAlt />
              <span>{getLanguage() === 'rw' ? 'Sohoka' : 'Logout'}</span>
            </motion.button>
          </motion.div>
        </div>
      </aside>
    </>
  );
}
