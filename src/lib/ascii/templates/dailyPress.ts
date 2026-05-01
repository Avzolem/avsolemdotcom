import type { AsciiTemplate } from './types';

const paper = '#F4F1EA';
const ink = '#0a0a0a';
const accent = '#B22222';

export const dailyPressTemplate: AsciiTemplate = {
  id: 'daily-press',
  name: 'Daily Press',
  category: 'editorial',
  ascii: {
    charset: 'dense',
    cols: 160,
    dither: 'bayer4',
    ditherSteps: 5,
    invertMapping: true,
    brightness: 0.05,
    contrast: 0.1,
    colorMode: 'mono',
    bgColor: paper,
    fgColor: ink,
    fontFamily: 'var(--font-code), monospace',
    fontSizeRatio: 1.4,
    lineHeight: 1,
    letterSpacing: 0,
    cellOpacity: 0.6,
  },
  layout: {
    ratio: '4:3',
    bg: paper,
    layers: [
      {
        id: 'masthead',
        text: 'THE DAILY PRESS',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
          fontFamily: 'var(--font-aurelia-display), serif',
          fontWeight: 700, fontSize: '18px',
          color: ink, letterSpacing: '0.08em',
        },
      },
      {
        id: 'rule',
        text: '— ESTABLISHED 1898 —',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '46px', left: '50%', transform: 'translateX(-50%)',
          fontSize: '9px', letterSpacing: '0.4em',
          color: ink, fontFamily: 'var(--font-code), monospace',
          opacity: 0.7,
        },
      },
      {
        id: 'title',
        text: 'Gazette',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'var(--font-aurelia-display), serif',
          fontStyle: 'italic',
          fontWeight: 600,
          fontSize: 'clamp(64px, 14vw, 200px)',
          color: ink,
          letterSpacing: '-0.03em',
          whiteSpace: 'nowrap',
        },
      },
      {
        id: 'lede',
        text: 'A century of typography, printed daily.',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, calc(-50% + 6rem))',
          fontFamily: 'var(--font-aurelia-display), serif',
          fontStyle: 'italic', fontSize: '13px',
          color: ink, opacity: 0.85,
        },
      },
      {
        id: 'price',
        text: '· FIVE CENTS ·',
        editable: true,
        className: '',
        style: {
          position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          fontSize: '10px', letterSpacing: '0.4em',
          color: accent, fontFamily: 'var(--font-code), monospace',
        },
      },
      {
        id: 'date',
        text: 'VOL. 88',
        editable: true,
        className: '',
        style: {
          position: 'absolute', bottom: '24px', left: '32px',
          fontSize: '10px', letterSpacing: '0.3em',
          color: ink, fontFamily: 'var(--font-code), monospace',
          opacity: 0.7,
        },
      },
      {
        id: 'pages',
        text: '32 PAGES',
        editable: true,
        className: '',
        style: {
          position: 'absolute', bottom: '24px', right: '32px',
          fontSize: '10px', letterSpacing: '0.3em',
          color: ink, fontFamily: 'var(--font-code), monospace',
          opacity: 0.7,
        },
      },
    ],
  },
};
