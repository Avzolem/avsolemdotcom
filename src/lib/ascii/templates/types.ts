import type { CharsetName, ColorMode, DitherMode } from '../types';

export interface TemplateAsciiPreset {
  charset: CharsetName;
  cols: number;
  dither: DitherMode;
  ditherSteps?: number;
  threshold?: number;
  invertMapping?: boolean;
  brightness?: number;
  contrast?: number;
  colorMode: ColorMode;
  bgColor: string;
  fgColor: string;
  paletteColors?: string[];
  duotone?: { low: string; high: string };
  fontFamily: string;
  fontSizeRatio: number;
  lineHeight: number;
  letterSpacing: number;
  cellOpacity?: number;
}

export interface TemplateTextLayer {
  id: string;
  text: string;
  editable?: boolean;
  className: string;
  style?: Record<string, string | number>;
}

export interface TemplateLayout {
  ratio: '16:9' | '4:3' | '1:1' | '3:4' | '9:16';
  bg: string;
  layers: TemplateTextLayer[];
}

export interface AsciiTemplate {
  id: string;
  name: string;
  category: string;
  ascii: TemplateAsciiPreset;
  layout: TemplateLayout;
}
