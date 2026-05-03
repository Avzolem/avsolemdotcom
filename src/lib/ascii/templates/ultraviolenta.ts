import type { AsciiTemplate } from './types';

const purple = '#0f0220';
const neon = '#e879f9';
const lila = '#fce7ff';
const asciiViolet = '#6500a8';
const gray = '#a8a3a8';

export const ultraviolentaTemplate: AsciiTemplate = {
  id: 'ultraviolenta-poster',
  name: 'Ultraviolenta',
  category: 'poster',
  defaultArtStyleId: 'retro',
  defaultFx: {
    mode: 'glitch',
    strength: 0.6,
    speed: 1.2,
    scale: 1,
    direction: 'right',
  },
  ascii: {
    charset: 'standard',
    cols: 130,
    dither: 'bayer4',
    ditherSteps: 4,
    invertMapping: false,
    brightness: -0.05,
    contrast: 0.4,
    colorMode: 'mono',
    bgColor: purple,
    fgColor: asciiViolet,
    fontFamily: 'var(--font-code), monospace',
    fontSizeRatio: 1.4,
    lineHeight: 1,
    letterSpacing: 0,
    cellOpacity: 0.85,
  },
  layout: {
    ratio: '3:4',
    bg: purple,
    layers: [
      {
        id: 'cat',
        text: 'RIOT  Nº  XIII',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '24px', left: '32px',
          fontSize: '10px', letterSpacing: '0.42em',
          color: gray, opacity: 0.85,
          fontFamily: 'var(--font-code), monospace',
          fontWeight: 700,
        },
      },
      {
        id: 'wave',
        text: 'UV · 380 nm',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '24px', right: '32px',
          fontSize: '10px', letterSpacing: '0.42em',
          color: gray, opacity: 0.85,
          fontFamily: 'var(--font-code), monospace',
          fontWeight: 700,
        },
      },
      {
        id: 'ruleTop',
        text: '',
        editable: false,
        className: '',
        style: {
          position: 'absolute', top: '64px', left: '32px', right: '32px',
          height: '1px', background: neon, opacity: 0.55,
          boxShadow: `0 0 6px ${neon}`,
        },
      },
      {
        id: 'kicker',
        text: 'MANIFESTO  /  FREQUENCY  /  RIOT',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '88px', left: '50%', transform: 'translateX(-50%)',
          fontSize: '10px', letterSpacing: '0.5em',
          color: lila, opacity: 0.7,
          fontFamily: 'var(--font-code), monospace',
          whiteSpace: 'nowrap',
        },
      },
      {
        id: 'title',
        text: 'ULTRAVIOLENTA',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '46%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'var(--font-ultraviolenta-display), system-ui',
          fontWeight: 400,
          fontSize: 'clamp(26px, 5.6vw, 64px)',
          color: lila,
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',
          lineHeight: 0.9,
        },
      },
      {
        id: 'subtitle',
        text: '— y voraz —',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '46%', left: '50%',
          transform: 'translate(-50%, calc(-50% + 3.5rem))',
          fontFamily: 'var(--font-aurelia-display), serif',
          fontStyle: 'italic',
          fontSize: '17px',
          color: lila, opacity: 0.92,
          letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
        },
      },
      {
        id: 'meta',
        text: 'DISTURBIO  ·  DISIDENCIA  ·  DISTORSIÓN',
        editable: true,
        className: '',
        style: {
          position: 'absolute', bottom: '108px', left: '50%', transform: 'translateX(-50%)',
          fontSize: '10px', letterSpacing: '0.55em',
          color: gray, opacity: 0.85,
          fontFamily: 'var(--font-code), monospace',
          fontWeight: 700,
          whiteSpace: 'nowrap',
        },
      },
      {
        id: 'ruleBottom',
        text: '',
        editable: false,
        className: '',
        style: {
          position: 'absolute', bottom: '78px', left: '32px', right: '32px',
          height: '1px', background: neon, opacity: 0.55,
          boxShadow: `0 0 6px ${neon}`,
        },
      },
      {
        id: 'sigil',
        text: '⚡',
        editable: false,
        className: '',
        style: {
          position: 'absolute', bottom: '38px', left: '32px',
          fontSize: '22px', color: gray, opacity: 0.85,
        },
      },
      {
        id: 'sigilRight',
        text: '⚡',
        editable: false,
        className: '',
        style: {
          position: 'absolute', bottom: '38px', right: '32px',
          fontSize: '22px', color: gray, opacity: 0.85,
        },
      },
    ],
  },
};
