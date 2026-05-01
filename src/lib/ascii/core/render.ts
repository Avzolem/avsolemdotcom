import type { AsciiGrid, RenderConfig, SampleResult, Charset } from '../types';
import { lumToChar } from './charsets';

export function buildGrid(
  sample: SampleResult,
  charset: Charset,
  invertMapping = false,
): AsciiGrid {
  const { cols, rows, luminance, rgba } = sample;
  const chars: string[] = new Array(cols * rows);
  const colors: string[] = new Array(cols * rows);
  const lums = new Float32Array(luminance.length);
  for (let i = 0; i < luminance.length; i++) {
    chars[i] = lumToChar(luminance[i], charset, invertMapping);
    const r = rgba[i * 4];
    const g = rgba[i * 4 + 1];
    const b = rgba[i * 4 + 2];
    colors[i] = `rgb(${r},${g},${b})`;
    lums[i] = luminance[i];
  }
  return { cols, rows, chars, colors, lums };
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [
    parseInt(v.slice(0, 2), 16) || 0,
    parseInt(v.slice(2, 4), 16) || 0,
    parseInt(v.slice(4, 6), 16) || 0,
  ];
}

function lerpDuotone(t: number, low: [number, number, number], high: [number, number, number]): string {
  const r = Math.round(low[0] + (high[0] - low[0]) * t);
  const g = Math.round(low[1] + (high[1] - low[1]) * t);
  const b = Math.round(low[2] + (high[2] - low[2]) * t);
  return `rgb(${r},${g},${b})`;
}

export interface DrawOptions {
  config: RenderConfig;
  width: number;
  height: number;
}

export function renderGrid(
  ctx: CanvasRenderingContext2D,
  grid: AsciiGrid,
  opts: DrawOptions,
): void {
  const { config, width, height } = opts;
  const { cols, rows, chars, colors, lums } = grid;

  ctx.save();
  ctx.fillStyle = config.bgColor;
  ctx.fillRect(0, 0, width, height);

  const cellW = width / cols;
  const cellH = height / rows;
  const fontPx = Math.min(cellW * 1.6, cellH * config.lineHeight);

  ctx.font = `${fontPx}px ${config.fontFamily}`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  const duotoneActive = config.colorMode === 'palette' && config.duotone;
  const lowRgb = duotoneActive ? hexToRgb(config.duotone!.low) : null;
  const highRgb = duotoneActive ? hexToRgb(config.duotone!.high) : null;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const idx = y * cols + x;
      const ch = chars[idx];
      if (!ch || ch === ' ') continue;
      if (duotoneActive && lums && lowRgb && highRgb) {
        ctx.fillStyle = lerpDuotone(lums[idx], lowRgb, highRgb);
      } else if (config.colorMode === 'original' && colors) {
        ctx.fillStyle = colors[idx];
      } else {
        ctx.fillStyle = config.fgColor;
      }
      ctx.fillText(ch, (x + 0.5) * cellW, (y + 0.5) * cellH);
    }
  }
  ctx.restore();
}

export function gridToText(grid: AsciiGrid): string {
  const lines: string[] = [];
  for (let y = 0; y < grid.rows; y++) {
    let line = '';
    for (let x = 0; x < grid.cols; x++) {
      line += grid.chars[y * grid.cols + x];
    }
    lines.push(line);
  }
  return lines.join('\n');
}
