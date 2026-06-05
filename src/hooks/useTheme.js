import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    const saved = localStorage.getItem('thrum-theme');
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  const switchTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('thrum-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return { theme, switchTheme };
};