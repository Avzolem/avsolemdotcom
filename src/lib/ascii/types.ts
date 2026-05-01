export type CharsetName = 'standard' | 'dense' | 'sparse' | 'halftone';

export type DitherMode = 'none' | 'threshold' | 'bayer4' | 'bayer8' | 'floydSteinberg';

export type ColorMode = 'mono' | 'original' | 'palette';

export type ColorPreset = 'template' | 'grayscale' | 'fullColor' | 'matrix' | 'amber' | 'custom';

export interface Adjustments {
  brightness: number;
  contrast: number;
  ditherStrength: number;
  opacity: number;
  colorPreset: ColorPreset;
  customColor: string;
}

export interface Charset {
  name: CharsetName | 'custom';
  chars: string;
}

export interface SampleResult {
  cols: number;
  rows: number;
  luminance: Float32Array;
  rgba: Uint8ClampedArray;
}

export interface AsciiGrid {
  cols: number;
  rows: number;
  chars: string[];
  colors?: string[];
  lums?: Float32Array;
}

export interface DuotonePalette {
  low: string;
  high: string;
}

export interface RenderConfig {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  bgColor: string;
  fgColor: string;
  colorMode: ColorMode;
  duotone?: DuotonePalette;
}
