import type { DitherMode } from '../types';

const BAYER4 = [
  0, 8, 2, 10,
  12, 4, 14, 6,
  3, 11, 1, 9,
  15, 7, 13, 5,
].map((v) => (v + 0.5) / 16);

const BAYER8 = [
  0, 32, 8, 40, 2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44, 4, 36, 14, 46, 6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
  3, 35, 11, 43, 1, 33, 9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47, 7, 39, 13, 45, 5, 37,
  63, 31, 55, 23, 61, 29, 53, 21,
].map((v) => (v + 0.5) / 64);

export function applyDither(
  luminance: Float32Array,
  cols: number,
  rows: number,
  mode: DitherMode,
  threshold = 0.5,
  steps = 8,
  strength = 1,
): Float32Array {
  if (mode === 'none') return luminance;

  const out = new Float32Array(luminance.length);
  if (mode === 'threshold') {
    for (let i = 0; i < luminance.length; i++) {
      out[i] = luminance[i] >= threshold ? 1 : 0;
    }
    return out;
  }

  if (mode === 'floydSteinberg') {
    const buf = new Float32Array(luminance);
    const levels = Math.max(2, steps);
    const fsStrength = Math.max(0, Math.min(1, strength));
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const idx = y * cols + x;
        const old = buf[idx];
        const q = Math.round(Math.max(0, Math.min(1, old)) * (levels - 1)) / (levels - 1);
        out[idx] = q;
        const err = (old - q) * fsStrength;
        if (x + 1 < cols) buf[idx + 1] += err * 7 / 16;
        if (y + 1 < rows) {
          if (x > 0) buf[idx + cols - 1] += err * 3 / 16;
          buf[idx + cols] += err * 5 / 16;
          if (x + 1 < cols) buf[idx + cols + 1] += err * 1 / 16;
        }
      }
    }
    return out;
  }

  const matrix = mode === 'bayer4' ? BAYER4 : BAYER8;
  const size = mode === 'bayer4' ? 4 : 8;
  const levels = Math.max(2, steps);
  const step = 1 / (levels - 1);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const idx = y * cols + x;
      const t = matrix[(y % size) * size + (x % size)];
      const v = luminance[idx] + (t - 0.5) * step;
      const q = Math.round(Math.max(0, Math.min(1, v)) * (levels - 1)) / (levels - 1);
      out[idx] = q;
    }
  }
  return out;
}
