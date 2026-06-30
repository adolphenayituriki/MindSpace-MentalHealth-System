import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('mindspace_dark') === 'true'
  );

  const toggleDark = () => {
    setDarkMode((prev) => {
      localStorage.setItem('mindspace_dark', !prev);
      return !prev;
    });
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDark }}>
      <div className={darkMode ? 'dark' : 'light'}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
}
