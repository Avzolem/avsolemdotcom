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
        // Dark theme - Dark radial glow
        <div className="absolute inset-0 bg-[#020617]">
          {/* Dark Radial Glow Background */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `radial-gradient(circle 800px at 50% 200px, #3e3e3e, transparent)`,
            }}
          />
        </div>
      )}
    </div>
  );
}