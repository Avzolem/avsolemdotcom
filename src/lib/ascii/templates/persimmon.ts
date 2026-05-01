import type { AsciiTemplate } from './types';

const persimmon = '#FF6B35';
const ink = '#1a0a05';
const cream = '#FFF5E1';

export const persimmonTemplate: AsciiTemplate = {
  id: 'persimmon-poster',
  name: 'Persimmon Poster',
  category: 'poster',
  ascii: {
    charset: 'standard',
    cols: 140,
    dither: 'floydSteinberg',
    ditherSteps: 5,
    invertMapping: true,
    brightness: 0,
    contrast: 0.25,
    colorMode: 'mono',
    bgColor: persimmon,
    fgColor: ink,
    fontFamily: 'var(--font-code), monospace',
    fontSizeRatio: 1.4,
    lineHeight: 1,
    letterSpacing: 0,
    cellOpacity: 0.6,
  },
  layout: {
    ratio: '3:4',
    bg: persimmon,
    layers: [
      {
        id: 'top',
        text: 'POSTER № 84',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '24px', left: '32px',
          fontSize: '10px', letterSpacing: '0.4em',
          color: ink, fontFamily: 'var(--font-code), monospace',
        },
      },
      {
        id: 'price',
        text: '24×36 IN.',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '24px', right: '32px',
          fontSize: '10px', letterSpacing: '0.4em',
          color: ink, fontFamily: 'var(--font-code), monospace',
        },
      },
      {
        id: 'title',
        text: 'PERSIMMON',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '46%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'var(--font-code), monospace',
          fontWeight: 800,
          fontSize: 'clamp(48px, 9vw, 130px)',
          color: ink,
          letterSpacing: '-0.04em',
          whiteSpace: 'nowrap',
          lineHeight: 0.9,
        },
      },
      {
        id: 'subtitle',
        text: 'a soft fruit / a loud color',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '46%', left: '50%',
          transform: 'translate(-50%, calc(-50% + 4.5rem))',
          fontFamily: 'var(--font-aurelia-display), serif',
          fontStyle: 'italic',
          fontSize: '14px',
          color: ink, opacity: 0.85,
        },
      },
      {
        id: 'meta',
        text: '— A POSTER FOR THE SLOWER MORNINGS —',
        editable: true,
        className: '',
        style: {
          position: 'absolute', bottom: '120px', left: '50%', transform: 'translateX(-50%)',
          fontSize: '10px', letterSpacing: '0.3em',
          color: ink, fontFamily: 'var(--font-code), monospace',
          opacity: 0.7, textAlign: 'center',
        },
      },
      {
        id: 'studio',
        text: 'TYPESTUDIO',
        editable: true,
        className: '',
        style: {
          position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          fontFamily: 'var(--font-aurelia-display), serif',
          fontWeight: 600, fontSize: '14px',
          color: cream, letterSpacing: '0.4em',
        },
      },
    ],
  },
};
