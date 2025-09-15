'use client';

import { useEffect, useState } from 'react';

export function ThemeBackground() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const updateTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(currentTheme as 'light' | 'dark');
    };

    updateTheme();

    // Listen for theme changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      {theme === 'light' ? (
        // Light theme - Clean beige background
        <div className="absolute inset-0 bg-beige-100" />
      ) : (
        // Dark theme - Black with lighter navy gradient
        <>
          <div className="absolute inset-0 bg-gray-950" />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-blue-950/40 to-transparent" />
          <div className="absolute inset-0"
               style={{
                 backgroundImage: 'radial-gradient(ellipse at top center, rgba(30, 58, 138, 0.7) 0%, rgba(30, 64, 175, 0.4) 30%, rgba(37, 99, 235, 0.2) 50%, transparent 70%)'
               }} />
        </>
      )}
    </div>
  );
}