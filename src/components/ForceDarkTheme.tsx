'use client';

import { useEffect } from 'react';

export function ForceDarkTheme() {
  useEffect(() => {
    const html = document.documentElement;
    const prevTheme = html.getAttribute('data-theme');
    const prevHadDarkClass = html.classList.contains('dark');

    html.setAttribute('data-theme', 'dark');
    html.classList.add('dark');

    return () => {
      if (prevTheme) html.setAttribute('data-theme', prevTheme);
      else html.removeAttribute('data-theme');
      if (!prevHadDarkClass) html.classList.remove('dark');
    };
  }, []);

  return null;
}
