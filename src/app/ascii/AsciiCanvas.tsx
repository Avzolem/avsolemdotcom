'use client';

import { useEffect, useRef } from 'react';
import { applyDither } from '@/lib/ascii/core/dither';
import { buildGrid, renderGrid } from '@/lib/ascii/core/render';
import { sampleSource } from '@/lib/ascii/core/sample';
import { customCharset, getCharset } from '@/lib/ascii/core/charsets';
import type { AsciiTemplate } from '@/lib/ascii/templates';
import type { ArtStyle } from '@/lib/ascii/artStyles';
import { applyFx, type FxConfig } from '@/lib/ascii/fx';
import type {
  Adjustments,
  AsciiGrid,
  Charset,
  ColorMode,
  ColorPreset,
  DitherMode,
  DuotonePalette,
  SampleResult,
} from '@/lib/ascii/types';

type AsciiSource = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap;

export interface AsciiCanvasApi {
  getGrid: () => AsciiGrid | null;
  getCanvas: () => HTMLCanvasElement | null;
  getResolvedColors: () => { fg: string; bg: string };
}

interface AsciiCanvasProps {
  source: AsciiSource | null;
  template: AsciiTemplate;
  artStyle?: ArtStyle | null;
  adjust: Adjustments;
  fx: FxConfig;
  playing: boolean;
  onReady?: (canvas: HTMLCanvasElement) => void;
  onFps?: (fps: number) => void;
  apiRef?: (api: AsciiCanvasApi) => void;
}

function makeNoiseSource(cols: number, rows: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = cols * 4;
  c.height = rows * 4;
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  const img = ctx.createImageData(c.width, c.height);
  for (let i = 0; i < img.data.length; i += 4) {
    const x = (i / 4) % c.width;
    const y = Math.floor((i / 4) / c.width);
    const cx = c.width / 2;
    const cy = c.height / 2;
    const d = Math.hypot(x - cx, y - cy) / Math.hypot(cx, cy);
    const n = Math.random() * 0.6 + (1 - d) * 0.6;
    const v = Math.floor(Math.max(0, Math.min(1, n)) * 255);
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

interface ResolvedConfig {
  cols: number;
  charset: Charset;
  dither: DitherMode;
  ditherSteps?: number;
  threshold?: number;
  invertMapping?: boolean;
  brightness?: number;
  contrast?: number;
  ditherStrength: number;
  colorMode: ColorMode;
  bgColor: string;
  fgColor: string;
  fontFamily: string;
  lineHeight: number;
  letterSpacing: number;
  cellOpacity: number;
  duotone?: DuotonePalette;
}

function applyColorPreset(
  cfg: ResolvedConfig,
  preset: ColorPreset,
  customColor: string,
): ResolvedConfig {
  if (preset === 'template') return cfg;
  if (preset === 'grayscale') {
    return { ...cfg, colorMode: 'mono', fgColor: '#f5f5f5', duotone: undefined };
  }
  if (preset === 'fullColor') {
    return { ...cfg, colorMode: 'original', duotone: undefined };
  }
  if (preset === 'matrix') {
    return { ...cfg, colorMode: 'mono', fgColor: '#00FF99', duotone: undefined };
  }
  if (preset === 'amber') {
    return {
      ...cfg,
      colorMode: 'palette',
      duotone: { low: '#140C06', high: '#FFDFB2' },
    };
  }
  if (preset === 'custom') {
    return { ...cfg, colorMode: 'mono', fgColor: customColor, duotone: undefined };
  }
  return cfg;
}

function resolveConfig(
  template: AsciiTemplate,
  style: ArtStyle | null | undefined,
  adjust: Adjustments,
): ResolvedConfig {
  const a = template.ascii;
  const charset: Charset = style
    ? (style.charset === 'custom'
      ? customCharset(style.customCharset ?? '')
      : getCharset(style.charset))
    : getCharset(a.charset);

  const base: ResolvedConfig = {
    cols: style?.colsHint ?? a.cols,
    charset,
    dither: style?.dither ?? a.dither,
    ditherSteps: style?.ditherSteps ?? a.ditherSteps,
    threshold: a.threshold,
    invertMapping: style?.invertMapping ?? a.invertMapping,
    brightness: (a.brightness ?? 0) + adjust.brightness,
    contrast: (a.contrast ?? 0) + adjust.contrast,
    ditherStrength: adjust.ditherStrength,
    colorMode: a.colorMode,
    bgColor: a.bgColor,
    fgColor: a.fgColor,
    fontFamily: a.fontFamily,
    lineHeight: a.lineHeight,
    letterSpacing: a.letterSpacing,
    cellOpacity: (a.cellOpacity ?? 1) * adjust.opacity,
    duotone: a.duotone,
  };
  return applyColorPreset(base, adjust.colorPreset, adjust.customColor);
}

export default function AsciiCanvas({
  source,
  template,
  artStyle,
  adjust,
  fx,
  playing,
  onReady,
  onFps,
  apiRef,
}: AsciiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sampleRef = useRef<SampleResult | null>(null);
  const rafRef = useRef<number | null>(null);
  const seedRef = useRef<Float32Array | null>(null);
  const fpsBucketRef = useRef({ count: 0, last: 0 });
  const gridRef = useRef<AsciiGrid | null>(null);
  const colorsRef = useRef<{ fg: string; bg: string }>({ fg: '#fff', bg: '#000' });

  useEffect(() => {
    apiRef?.({
      getGrid: () => gridRef.current,
      getCanvas: () => canvasRef.current,
      getResolvedColors: () => colorsRef.current,
    });
  }, [apiRef]);

  useEffect(() => {
    const cfg = resolveConfig(template, artStyle ?? null, adjust);
    const src = source ?? makeNoiseSource(cfg.cols, Math.round(cfg.cols * 0.56));
    const sample = sampleSource(src, {
      cols: cfg.cols,
      brightness: cfg.brightness,
      contrast: cfg.contrast,
    });
    sampleRef.current = sample;
    const seed = new Float32Array(sample.luminance.length);
    for (let i = 0; i < seed.length; i++) seed[i] = Math.random();
    seedRef.current = seed;
  }, [source, template, artStyle, adjust]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cancelled = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const drawFrame = (time: number) => {
      if (cancelled) return;
      const cfg = resolveConfig(template, artStyle ?? null, adjust);
      const sample = sampleRef.current;
      const seed = seedRef.current;
      if (!sample || !seed) {
        rafRef.current = requestAnimationFrame(drawFrame);
        return;
      }

      const bucket = fpsBucketRef.current;
      if (bucket.last === 0) bucket.last = time;
      bucket.count += 1;
      if (time - bucket.last >= 1000) {
        const measured = Math.round((bucket.count * 1000) / (time - bucket.last));
        onFps?.(measured);
        bucket.count = 0;
        bucket.last = time;
      }

      const lum = new Float32Array(sample.luminance.length);
      if (playing) {
        applyFx(lum, sample.luminance, sample.cols, sample.rows, time, seed, fx);
      } else {
        lum.set(sample.luminance);
      }

      const dithered = applyDither(
        lum,
        sample.cols,
        sample.rows,
        cfg.dither,
        cfg.threshold,
        cfg.ditherSteps,
        cfg.ditherStrength,
      );
      const grid = buildGrid(
        { ...sample, luminance: dithered },
        cfg.charset,
        cfg.invertMapping,
      );
      gridRef.current = grid;
      colorsRef.current = { fg: cfg.fgColor, bg: cfg.bgColor };

      ctx.globalAlpha = cfg.cellOpacity;
      renderGrid(ctx, grid, {
        config: {
          fontFamily: cfg.fontFamily,
          fontSize: 0,
          lineHeight: cfg.lineHeight,
          letterSpacing: cfg.letterSpacing,
          bgColor: cfg.bgColor,
          fgColor: cfg.fgColor,
          colorMode: cfg.colorMode,
          duotone: cfg.duotone,
        },
        width: canvas.width,
        height: canvas.height,
      });
      ctx.globalAlpha = 1;

      if (playing) {
        rafRef.current = requestAnimationFrame(drawFrame);
      }
    };

    rafRef.current = requestAnimationFrame(drawFrame);
    onReady?.(canvas);

    return () => {
      cancelled = true;
      ro.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [template, artStyle, adjust, fx, playing, onReady, onFps]);

  return <canvas ref={canvasRef} />;
}
