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
        // Dark theme - Black with navy gradient
        <>
          <div className="absolute inset-0 bg-navy-900" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-600/40 via-navy-800/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-radial from-navy-500/30 via-transparent to-transparent"
               style={{
                 backgroundImage: 'radial-gradient(ellipse at top center, rgba(14, 25, 41, 0.5) 0%, rgba(10, 25, 47, 0.3) 40%, transparent 70%)'
               }} />
        </>
      )}
    </div>
  );
}