import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('mindspace_dark') === 'true'
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.background = '#0B1121';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.background = '#F8FAFC';
    }
  }, [darkMode]);

  const toggleDark = () => {
    setDarkMode((prev) => {
      localStorage.setItem('mindspace_dark', !prev);
      return !prev;
    });
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDark }}>
      <div className={darkMode ? 'dark' : ''}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
}
