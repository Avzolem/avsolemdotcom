'use client';

import { useEffect, useState } from 'react';
import '@/styles/crt.css';

const KONAMI = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

export function KonamiCRT() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let buf: string[] = [];
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && document.documentElement.classList.contains('crt-active')) {
        document.documentElement.classList.remove('crt-active');
        setActive(false);
        buf = [];
        return;
      }
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      buf = [...buf, key].slice(-KONAMI.length);
      if (buf.length === KONAMI.length && buf.every((k, i) => k === KONAMI[i])) {
        document.documentElement.classList.toggle('crt-active');
        setActive(document.documentElement.classList.contains('crt-active'));
        buf = [];
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      document.documentElement.classList.remove('crt-active');
    };
  }, []);

  if (!active) return null;
  return <div className="crt-indicator">◉ CRT MODE · ESC to exit</div>;
}
