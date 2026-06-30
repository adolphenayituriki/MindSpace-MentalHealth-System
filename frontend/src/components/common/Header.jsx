import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../../i18n/i18n';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function Header() {
  const { setLanguage, getLanguage } = useTranslation();
  const { user } = useAuth();
  const { darkMode, toggleDark } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/reflect', label: 'Reflect' },
    { to: '/mood', label: 'Mood' },
    { to: '/healing', label: 'Heal' },
    { to: '/journal', label: 'Journal' },
    { to: '/communities', label: 'Communities' },
    { to: '/counseling', label: 'Counseling' },
    { to: '/insights', label: 'Insights' },
  ];

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
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

  const navLinks = links.map((l) => (
    <Link
      key={l.to}
      to={l.to}
      className={`nav-link ${location.pathname === l.to ? 'active' : ''}`}
      onClick={closeMenu}
    >
      {l.label}
    </Link>
  ));

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo" onClick={closeMenu}>
          MindSpace
        </Link>

        <nav className="nav-desktop">{navLinks}</nav>

        <div className="header-actions">
          <button className="lang-toggle" onClick={toggleLang} title="Switch language">
            {getLanguage() === 'rw' ? 'EN' : 'RW'}
          </button>
          <button
            className="theme-toggle"
            onClick={toggleDark}
            title={darkMode ? 'Light mode' : 'Dark mode'}
            aria-label="Toggle theme"
          >
            {darkMode ? '\u2600' : '\u263E'}
          </button>
          <span className="user-badge">
            {user?.displayName || 'Guest'}
          </span>
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div
        className={`mobile-overlay ${menuOpen ? 'visible' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          <span className="mobile-nav-title">Menu</span>
          <button className="hamburger open" onClick={closeMenu} aria-label="Close menu">
            <span /><span /><span />
          </button>
        </div>
        <div className="mobile-nav-links">{navLinks}</div>
        <div className="mobile-nav-footer">
          <span className="user-badge" style={{ margin: '0 auto' }}>
            {user?.displayName || 'Guest'}
          </span>
        </div>
      </nav>
    </header>
  );
}
