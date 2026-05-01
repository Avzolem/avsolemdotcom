import type { AsciiTemplate } from './types';

const space = '#050a1a';
const star = '#e8e4d0';
const gold = '#d4af37';
const blue = '#7090c0';

export const stellarTemplate: AsciiTemplate = {
  id: 'stellar-atlas',
  name: 'Stellar Atlas',
  category: 'cosmic',
  ascii: {
    charset: 'sparse',
    cols: 200,
    dither: 'bayer8',
    ditherSteps: 4,
    invertMapping: false,
    brightness: -0.15,
    contrast: 0.4,
    colorMode: 'palette',
    bgColor: space,
    fgColor: star,
    duotone: { low: '#10162a', high: star },
    fontFamily: 'var(--font-code), monospace',
    fontSizeRatio: 1.4,
    lineHeight: 1,
    letterSpacing: 0,
    cellOpacity: 0.95,
  },
  layout: {
    ratio: '16:9',
    bg: space,
    layers: [
      {
        id: 'top',
        text: '★  STELLAR ATLAS  ·  CARTOGRAPHIC EDITIONS  ·  Vol. III',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)',
          fontSize: '10px', letterSpacing: '0.3em',
          color: gold, fontFamily: 'var(--font-code), monospace',
        },
      },
      {
        id: 'title',
        text: 'Nocturne',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'var(--font-aurelia-display), serif',
          fontWeight: 400,
          fontSize: 'clamp(72px, 12vw, 200px)',
          color: star,
          letterSpacing: '-0.025em',
          whiteSpace: 'nowrap',
          filter: 'drop-shadow(0 0 24px rgba(232,228,208,0.3))',
        },
      },
      {
        id: 'coord',
        text: '23°.42  ·  +18°.06',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, calc(-50% + 5.5rem))',
          fontSize: '11px', letterSpacing: '0.3em',
          color: blue, fontFamily: 'var(--font-code), monospace',
        },
      },
      {
        id: 'epoch',
        text: 'EPOCH 2026.04',
        editable: true,
        className: '',
        style: {
          position: 'absolute', bottom: '24px', left: '32px',
          fontSize: '10px', letterSpacing: '0.3em',
          color: gold, fontFamily: 'var(--font-code), monospace',
        },
      },
      {
        id: 'plate',
        text: 'PLATE 047',
        editable: true,
        className: '',
        style: {
          position: 'absolute', bottom: '24px', right: '32px',
          fontSize: '10px', letterSpacing: '0.3em',
          color: gold, fontFamily: 'var(--font-code), monospace',
        },
      },
    ],
  },
};
