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
        // Light theme - Clean white background
        <div className="absolute inset-0 bg-[#fafafa]" />
      ) : (
        // Dark theme - Pure black background
        <div className="absolute inset-0 bg-black" />
      )}
    </div>
  );
}