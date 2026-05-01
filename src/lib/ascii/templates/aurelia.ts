import type { AsciiTemplate } from './types';

const cream = '#FDF5E6';
const amberHigh = '#FFDFB2';
const amberLow = '#140C06';
const accent = '#C9A227';

export const aureliaTemplate: AsciiTemplate = {
  id: 'typography-inspiration',
  name: 'Typography Inspiration',
  category: 'editorial',
  ascii: {
    charset: 'standard',
    cols: 200,
    dither: 'floydSteinberg',
    ditherSteps: 8,
    invertMapping: false,
    brightness: 0,
    contrast: 0.15,
    colorMode: 'palette',
    bgColor: '#000000',
    fgColor: amberHigh,
    duotone: { low: amberLow, high: amberHigh },
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSizeRatio: 1.4,
    lineHeight: 1,
    letterSpacing: 0,
    cellOpacity: 1,
  },
  layout: {
    ratio: '16:9',
    bg: '#000000',
    layers: [
      {
        id: 'top-left',
        text: 'VISUAL JOURNAL',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '24px', left: '32px',
          fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase',
          color: accent, fontFamily: 'Inter, sans-serif',
        },
      },
      {
        id: 'top-center',
        text: 'TYPE FOUNDRY',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)',
          fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase',
          color: accent, fontFamily: 'Inter, sans-serif',
        },
      },
      {
        id: 'top-right',
        text: 'STUDIO DESIGN FONTS',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '24px', right: '32px',
          fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase',
          color: accent, fontFamily: 'Inter, sans-serif',
        },
      },
      {
        id: 'numeral',
        text: '04',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, calc(-50% - 9rem))',
          fontSize: '11px', letterSpacing: '0.3em',
          color: cream, fontFamily: 'Inter, sans-serif',
        },
      },
      {
        id: 'title',
        text: 'Aurelia',
        editable: true,
        className: 'aurelia-title',
        style: {
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'var(--font-aurelia-display), "Playfair Display", serif',
          fontWeight: 400,
          fontSize: 'clamp(72px, 12vw, 200px)',
          lineHeight: 1,
          color: cream,
          letterSpacing: '-0.025em',
          whiteSpace: 'nowrap',
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))',
          cursor: 'default',
          transition: 'transform 700ms ease',
        },
      },
      {
        id: 'subtitle-1',
        text: 'Aurelia Serif',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, calc(-50% + 6rem))',
          fontSize: '13px', color: cream,
          fontFamily: 'var(--font-aurelia-display), serif',
          fontStyle: 'italic',
        },
      },
      {
        id: 'subtitle-2',
        text: 'Available for Commercial Use',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, calc(-50% + 7.6rem))',
          fontSize: '11px', color: 'rgba(253, 245, 230, 0.7)',
          fontFamily: 'Inter, sans-serif',
        },
      },
      {
        id: 'subtitle-3',
        text: 'Acquire from TypeStudio',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, calc(-50% + 9rem))',
          fontSize: '11px', color: 'rgba(253, 245, 230, 0.7)',
          fontFamily: 'Inter, sans-serif',
        },
      },
      {
        id: 'handle',
        text: '@aurelia.studio',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, calc(-50% + 11rem))',
          fontSize: '10px', letterSpacing: '0.2em',
          color: accent, textTransform: 'uppercase',
          fontFamily: 'Inter, sans-serif',
        },
      },
      {
        id: 'archive',
        text: 'ARCHIVE →',
        editable: false,
        className: 'ascii-pill',
        style: { position: 'absolute', bottom: '24px', right: '32px' },
      },
    ],
  },
};
