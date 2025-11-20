import { useEffect, useState } from 'react';
import styles from '../styles/ThemeToggle.module.css';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme || (prefersDark ? 'dark' : 'light');
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    const favicon = document.getElementById('favicon');
    if (favicon) {
      favicon.href = theme === 'light' ? '/favicon-light.svg' : '/favicon-dark.svg';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <button onClick={toggleTheme} className={styles.toggleButton} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
      <span key={theme} className={styles.icon}>
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
    </button>
  );
};