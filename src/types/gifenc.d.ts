declare module 'gifenc' {
  export interface PaletteOptions {
    format?: 'rgb565' | 'rgb444' | 'rgba4444';
    oneBitAlpha?: boolean | number;
    clearAlpha?: boolean;
    clearAlphaThreshold?: number;
    clearAlphaColor?: number;
  }

  export interface FrameOptions {
    palette?: number[][];
    delay?: number;
    repeat?: number;
    transparent?: boolean;
    transparentIndex?: number;
    dispose?: number;
    first?: boolean;
  }

  export interface Encoder {
    writeFrame: (
      index: Uint8Array,
      width: number,
      height: number,
      opts?: FrameOptions,
    ) => void;
    finish: () => void;
    bytes: () => Uint8Array;
    bytesView: () => Uint8Array;
    reset: () => void;
  }

  export function GIFEncoder(opts?: { auto?: boolean; initialCapacity?: number }): Encoder;

  export function quantize(
    rgba: Uint8Array | Uint8ClampedArray,
    maxColors: number,
    opts?: PaletteOptions,
  ): number[][];

  export function applyPalette(
    rgba: Uint8Array | Uint8ClampedArray,
    palette: number[][],
    format?: 'rgb565' | 'rgb444' | 'rgba4444',
  ): Uint8Array;
}
