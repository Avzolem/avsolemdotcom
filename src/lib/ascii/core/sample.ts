import type { SampleResult } from '../types';

const CHAR_ASPECT = 0.5;

export interface SampleOptions {
  cols: number;
  brightness?: number;
  contrast?: number;
}

export function computeRows(srcW: number, srcH: number, cols: number): number {
  return Math.max(1, Math.round(cols * (srcH / srcW) * CHAR_ASPECT));
}

export function sampleSource(
  source: HTMLImageElement | HTMLVideoElement | ImageBitmap | HTMLCanvasElement,
  opts: SampleOptions,
): SampleResult {
  const srcW = 'naturalWidth' in source ? source.naturalWidth : (source as { width: number }).width;
  const srcH = 'naturalHeight' in source ? source.naturalHeight : (source as { height: number }).height;
  const cols = Math.max(8, Math.round(opts.cols));
  const rows = computeRows(srcW, srcH, cols);

  const canvas = document.createElement('canvas');
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source as CanvasImageSource, 0, 0, cols, rows);

  const imageData = ctx.getImageData(0, 0, cols, rows);
  const rgba = imageData.data;
  const luminance = new Float32Array(cols * rows);

  const brightness = opts.brightness ?? 0;
  const contrast = opts.contrast ?? 0;
  const cFactor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));

  for (let i = 0, j = 0; i < rgba.length; i += 4, j += 1) {
    const r = rgba[i];
    const g = rgba[i + 1];
    const b = rgba[i + 2];
    let lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    lum += brightness;
    lum = (cFactor * (lum - 0.5)) + 0.5;
    luminance[j] = Math.max(0, Math.min(1, lum));
  }

  return { cols, rows, luminance, rgba };
}
