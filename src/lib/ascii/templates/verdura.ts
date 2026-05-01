import type { AsciiTemplate } from './types';

const dark = '#0d1f17';
const moss = '#7a8c50';
const sage = '#cfd9b8';
const cream = '#f3ead0';

export const verduraTemplate: AsciiTemplate = {
  id: 'verdura',
  name: 'Verdura',
  category: 'botanic',
  ascii: {
    charset: 'halftone',
    cols: 170,
    dither: 'floydSteinberg',
    ditherSteps: 7,
    invertMapping: false,
    brightness: -0.05,
    contrast: 0.2,
    colorMode: 'palette',
    bgColor: dark,
    fgColor: sage,
    duotone: { low: '#0a1a12', high: sage },
    fontFamily: 'var(--font-code), monospace',
    fontSizeRatio: 1.4,
    lineHeight: 1,
    letterSpacing: 0,
    cellOpacity: 0.85,
  },
  layout: {
    ratio: '16:9',
    bg: dark,
    layers: [
      {
        id: 'top-l',
        text: 'BOTANIC INDEX  Nº.12',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '24px', left: '32px',
          fontSize: '10px', letterSpacing: '0.3em',
          color: moss, fontFamily: 'var(--font-code), monospace',
        },
      },
      {
        id: 'top-r',
        text: 'GARDEN PRESS',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '24px', right: '32px',
          fontSize: '10px', letterSpacing: '0.3em',
          color: moss, fontFamily: 'var(--font-code), monospace',
        },
      },
      {
        id: 'title',
        text: 'Verdura',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'var(--font-aurelia-display), serif',
          fontStyle: 'italic',
          fontWeight: 500,
          fontSize: 'clamp(64px, 11vw, 180px)',
          color: cream,
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
        },
      },
      {
        id: 'sub-1',
        text: 'a study of greens',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, calc(-50% + 5rem))',
          fontFamily: 'var(--font-aurelia-display), serif',
          fontStyle: 'italic', fontSize: '13px',
          color: cream,
        },
      },
      {
        id: 'sub-2',
        text: 'Spring 2026',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, calc(-50% + 6.8rem))',
          fontSize: '10px', letterSpacing: '0.3em',
          color: moss, fontFamily: 'var(--font-code), monospace',
        },
      },
      {
        id: 'leaf',
        text: 'ASCII INJECTED',
        editable: false,
        className: '',
        style: {
          position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          fontSize: '9px', letterSpacing: '0.4em',
          color: moss, fontFamily: 'var(--font-code), monospace',
          opacity: 0.7,
        },
      },
    ],
  },
};
