import type { AsciiTemplate } from './types';

const cyan = '#00FFFF';
const magenta = '#FF00FF';
const cream = '#F5E6FF';

export const hyperfluxTemplate: AsciiTemplate = {
  id: 'hyperflux',
  name: 'Hyperflux',
  category: 'cyber',
  ascii: {
    charset: 'standard',
    cols: 180,
    dither: 'floydSteinberg',
    ditherSteps: 6,
    invertMapping: false,
    brightness: 0,
    contrast: 0.2,
    colorMode: 'palette',
    bgColor: '#0d0226',
    fgColor: cyan,
    duotone: { low: '#1a0a3a', high: '#00FFFF' },
    fontFamily: 'var(--font-code), monospace',
    fontSizeRatio: 1.4,
    lineHeight: 1,
    letterSpacing: 0,
    cellOpacity: 1,
  },
  layout: {
    ratio: '16:9',
    bg: '#0d0226',
    layers: [
      {
        id: 'top',
        text: 'HYPERFLUX  ·  V.07  ·  CYBERSTUDIO',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)',
          fontSize: '10px', letterSpacing: '0.4em',
          color: magenta, fontFamily: 'var(--font-code), monospace',
        },
      },
      {
        id: 'title',
        text: 'NEONCORE',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'var(--font-code), monospace',
          fontWeight: 800,
          fontSize: 'clamp(56px, 9vw, 140px)',
          color: cream,
          letterSpacing: '0.06em',
          textShadow: '0 0 20px rgba(0,255,255,0.6), 0 0 40px rgba(255,0,255,0.4)',
          whiteSpace: 'nowrap',
        },
      },
      {
        id: 'sub',
        text: '// frequency response  001100',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, calc(-50% + 5rem))',
          fontSize: '11px', letterSpacing: '0.2em',
          color: cyan, fontFamily: 'var(--font-code), monospace',
        },
      },
      {
        id: 'left',
        text: 'CH.A 24bit/96k',
        editable: true,
        className: '',
        style: {
          position: 'absolute', bottom: '24px', left: '32px',
          fontSize: '10px', letterSpacing: '0.2em',
          color: magenta, fontFamily: 'var(--font-code), monospace',
        },
      },
      {
        id: 'right',
        text: '◆ STREAM LIVE',
        editable: true,
        className: '',
        style: {
          position: 'absolute', bottom: '24px', right: '32px',
          fontSize: '10px', letterSpacing: '0.3em',
          color: cyan, fontFamily: 'var(--font-code), monospace',
        },
      },
    ],
  },
};
