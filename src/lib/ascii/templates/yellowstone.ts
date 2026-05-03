import type { AsciiTemplate } from './types';

const mustard = '#c69d2a';
const sepia = '#2a1c0c';
const earth = '#5d4218';

export const yellowstoneTemplate: AsciiTemplate = {
  id: 'yellowstone-poster',
  name: 'Yellowstone',
  category: 'poster',
  defaultArtStyleId: 'halftone',
  defaultFx: {
    mode: 'waves',
    strength: 0.4,
    speed: 0.7,
    scale: 1.6,
    direction: 'up',
  },
  ascii: {
    charset: 'halftone',
    cols: 160,
    dither: 'floydSteinberg',
    ditherSteps: 6,
    invertMapping: false,
    brightness: 0,
    contrast: 0.3,
    colorMode: 'mono',
    bgColor: mustard,
    fgColor: sepia,
    fontFamily: 'var(--font-code), monospace',
    fontSizeRatio: 1.4,
    lineHeight: 1,
    letterSpacing: 0,
    cellOpacity: 0.7,
  },
  layout: {
    ratio: '16:9',
    bg: mustard,
    layers: [
      // Coordenadas reales del parque, top-left, mono pequeñito
      {
        id: 'coords',
        text: '44.4280° N  ·  110.5885° W',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '24px', left: '32px',
          fontFamily: 'var(--font-code), monospace',
          fontSize: '10px', letterSpacing: '0.32em',
          color: sepia, opacity: 0.85,
        },
      },
      // Acreage / extensión, top-right
      {
        id: 'acreage',
        text: '8 991 KM²',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '24px', right: '32px',
          fontFamily: 'var(--font-code), monospace',
          fontSize: '10px', letterSpacing: '0.32em',
          color: sepia, opacity: 0.85,
        },
      },
      // Banda vertical izquierda con texto rotado
      {
        id: 'verticalBand',
        text: 'ESTABLISHED  ·  MDCCCLXXII  ·  WYO / MONT / IDA',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '50%', left: '40px',
          transform: 'translate(-50%, -50%) rotate(-90deg)',
          transformOrigin: 'center center',
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-code), monospace',
          fontSize: '11px', letterSpacing: '0.55em',
          color: sepia, opacity: 0.9,
          fontWeight: 700,
        },
      },
      // Línea vertical fina al lado del texto rotado
      {
        id: 'verticalRule',
        text: '',
        editable: false,
        className: '',
        style: {
          position: 'absolute', top: '15%', bottom: '15%', left: '64px',
          width: '1px', background: sepia, opacity: 0.5,
        },
      },
      // Título massive a la derecha, alineado al borde derecho
      {
        id: 'title',
        text: 'YELLOWSTONE',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '38%', right: '48px',
          transform: 'translateY(-50%)',
          fontFamily: 'var(--font-yellowstone-display), serif',
          fontWeight: 400,
          fontSize: 'clamp(56px, 11vw, 158px)',
          color: sepia,
          letterSpacing: '-0.015em',
          whiteSpace: 'nowrap',
          lineHeight: 0.92,
          textAlign: 'right',
        },
      },
      // Subtítulo italic, justo debajo y a la derecha del título
      {
        id: 'subtitle',
        text: 'the geyser republic',
        editable: true,
        className: '',
        style: {
          position: 'absolute', top: '48%', right: '52px',
          transform: 'translateY(-50%)',
          fontFamily: 'var(--font-aurelia-display), serif',
          fontStyle: 'italic',
          fontSize: '20px',
          color: earth, opacity: 0.95,
          letterSpacing: '0.02em',
          textAlign: 'right',
          whiteSpace: 'nowrap',
        },
      },
      // Picto de montañas ASCII bottom-right
      {
        id: 'peaks',
        text: '▲    ▲▲    ▲',
        editable: true,
        className: '',
        style: {
          position: 'absolute', bottom: '64px', right: '52px',
          fontFamily: 'var(--font-code), monospace',
          fontSize: '14px', letterSpacing: '0.3em',
          color: sepia, opacity: 0.85,
          textAlign: 'right',
        },
      },
      // Meta inferior horizontal (alineado al título, no centrado)
      {
        id: 'meta',
        text: 'GEYSERS  ·  BISON  ·  CANYONS  ·  HOT  SPRINGS',
        editable: true,
        className: '',
        style: {
          position: 'absolute', bottom: '32px', right: '52px',
          fontFamily: 'var(--font-code), monospace',
          fontSize: '10px', letterSpacing: '0.5em',
          color: sepia, opacity: 0.78,
          fontWeight: 700,
          textAlign: 'right',
          whiteSpace: 'nowrap',
        },
      },
      // Marca registrada decorativa bottom-left, balance del peaks
      {
        id: 'mark',
        text: 'PARK  №  01',
        editable: true,
        className: '',
        style: {
          position: 'absolute', bottom: '32px', left: '96px',
          fontFamily: 'var(--font-yellowstone-display), serif',
          fontSize: '14px', letterSpacing: '0.18em',
          color: sepia, opacity: 0.95,
        },
      },
    ],
  },
};
