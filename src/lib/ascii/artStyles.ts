import type { CharsetName, DitherMode } from './types';

export interface ArtStyle {
  id: string;
  name: string;
  charset: CharsetName | 'custom';
  customCharset?: string;
  dither: DitherMode;
  ditherSteps?: number;
  invertMapping?: boolean;
  colsHint?: number;
}

export const artStyles: ArtStyle[] = [
  {
    id: 'classic',
    name: 'Classic ASCII',
    charset: 'standard',
    dither: 'floydSteinberg',
    ditherSteps: 8,
  },
  {
    id: 'halftone',
    name: 'Halftone',
    charset: 'halftone',
    dither: 'floydSteinberg',
    ditherSteps: 8,
  },
  {
    id: 'dither',
    name: 'Dither',
    charset: 'custom',
    customCharset: ' #',
    dither: 'floydSteinberg',
    ditherSteps: 2,
  },
  {
    id: 'braille',
    name: 'Braille',
    charset: 'custom',
    customCharset: ' ⠁⠃⠇⠏⠟⠿⡿⣿',
    dither: 'bayer8',
    ditherSteps: 8,
  },
  {
    id: 'dot-screen',
    name: 'Dot Screen',
    charset: 'custom',
    customCharset: ' ·∙•●',
    dither: 'bayer8',
    ditherSteps: 5,
  },
  {
    id: 'dot-cross',
    name: 'Dot Cross',
    charset: 'custom',
    customCharset: ' ·+✕✚',
    dither: 'bayer4',
    ditherSteps: 5,
  },
  {
    id: 'line',
    name: 'Line',
    charset: 'custom',
    customCharset: ' ─━│┃┄┅┆┇',
    dither: 'floydSteinberg',
    ditherSteps: 6,
  },
  {
    id: 'particles',
    name: 'Particles',
    charset: 'custom',
    customCharset: ' .*+',
    dither: 'floydSteinberg',
    ditherSteps: 4,
  },
  {
    id: 'alphabet',
    name: 'Alphabet',
    charset: 'custom',
    customCharset: ' ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    dither: 'floydSteinberg',
    ditherSteps: 8,
  },
  {
    id: 'retro',
    name: 'Retro Art',
    charset: 'custom',
    customCharset: ' ░▒▓█',
    dither: 'bayer4',
    ditherSteps: 4,
    colsHint: 100,
  },
  {
    id: 'terminal',
    name: 'Terminal',
    charset: 'custom',
    customCharset: ' 01',
    dither: 'threshold',
  },
];

export function getArtStyle(id: string): ArtStyle | undefined {
  return artStyles.find((s) => s.id === id);
}
