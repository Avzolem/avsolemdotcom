export type FxMode =
  | 'none'
  | 'cycle'
  | 'noise'
  | 'waves'
  | 'intervals'
  | 'beam'
  | 'glitch'
  | 'crt'
  | 'matrix';

export type FxDirection = 'up' | 'down' | 'left' | 'right';

export interface FxConfig {
  mode: FxMode;
  strength: number;
  speed: number;
  scale: number;
  direction: FxDirection;
}

export const FX_PRESETS: { id: FxMode; name: string }[] = [
  { id: 'none', name: 'None' },
  { id: 'cycle', name: 'Cycle' },
  { id: 'noise', name: 'Noise Field' },
  { id: 'waves', name: 'Waves' },
  { id: 'intervals', name: 'Intervals' },
  { id: 'beam', name: 'Beam Sweep' },
  { id: 'glitch', name: 'Glitch' },
  { id: 'crt', name: 'CRT Monitor' },
  { id: 'matrix', name: 'Matrix Rain' },
];

function dirVec(d: FxDirection): { x: number; y: number } {
  switch (d) {
    case 'up': return { x: 0, y: -1 };
    case 'down': return { x: 0, y: 1 };
    case 'left': return { x: -1, y: 0 };
    case 'right': return { x: 1, y: 0 };
  }
}

// Hash-based value noise (cheap, deterministic, smoothed)
function hash2(x: number, y: number): number {
  const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return s - Math.floor(s);
}
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}
function valueNoise(x: number, y: number): number {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);
  const u = smoothstep(xf), v = smoothstep(yf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

export function applyFx(
  out: Float32Array,
  base: Float32Array,
  cols: number,
  rows: number,
  timeMs: number,
  seed: Float32Array,
  cfg: FxConfig,
): void {
  if (cfg.mode === 'none' || cfg.strength === 0) {
    out.set(base);
    return;
  }

  const t = timeMs * 0.001 * cfg.speed;
  const s = cfg.strength;
  const scale = Math.max(0.05, cfg.scale);
  const dir = dirVec(cfg.direction);

  switch (cfg.mode) {
    case 'cycle': {
      const phase = t * 0.8;
      for (let i = 0; i < base.length; i++) {
        const wobble = Math.sin(phase + seed[i] * Math.PI * 2) * 0.06 * s;
        out[i] = clamp(base[i] + wobble);
      }
      return;
    }

    case 'noise': {
      const sx = scale * 0.05;
      const ox = dir.x * t;
      const oy = dir.y * t;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const n = valueNoise(x * sx + ox, y * sx + oy);
          out[i] = clamp(base[i] + (n - 0.5) * 1.2 * s);
        }
      }
      return;
    }

    case 'waves': {
      const freq = scale * 0.25;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const w = Math.sin((x * dir.x + y * dir.y) * freq + t * 3) * 0.4 * s;
          out[i] = clamp(base[i] + w);
        }
      }
      return;
    }

    case 'intervals': {
      const spacing = Math.max(2, Math.round(8 / scale));
      const horizontal = dir.x !== 0;
      const offset = (t * 8) % spacing;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const pos = horizontal ? x : y;
          const phase = ((pos - offset * dir.x - offset * dir.y) + spacing * 100) % spacing;
          const band = phase < 1.5 ? 1 - phase / 1.5 : 0;
          out[i] = clamp(base[i] + band * 0.6 * s);
        }
      }
      return;
    }

    case 'beam': {
      const span = dir.x !== 0 ? cols : rows;
      const period = (span / Math.max(0.1, cfg.speed)) * 0.04;
      const center = ((t / period) % span);
      const sigma = Math.max(2, span / (8 * scale));
      const sigma2 = sigma * sigma;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const pos = dir.x !== 0 ? x : y;
          const d = pos - center;
          const beam = Math.exp(-(d * d) / sigma2);
          out[i] = clamp(base[i] + beam * 0.9 * s);
        }
      }
      return;
    }

    case 'glitch': {
      // Per-row random shift (changes every 80ms)
      const tick = Math.floor(timeMs / 80);
      const shifts = new Int16Array(rows);
      for (let y = 0; y < rows; y++) {
        const r = hash2(y, tick) - 0.5;
        shifts[y] = Math.round(r * cols * 0.15 * s);
      }
      const ribbonProb = 0.06 * s;
      for (let y = 0; y < rows; y++) {
        const ribbon = hash2(y * 13, tick * 7) < ribbonProb;
        const shift = shifts[y];
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          let sx = x - shift;
          if (sx < 0) sx += cols;
          if (sx >= cols) sx -= cols;
          let v = base[y * cols + sx];
          if (ribbon) v = 1 - v;
          out[i] = v;
        }
      }
      return;
    }

    case 'crt': {
      const rollSpeed = t * 12;
      const rollHeight = Math.max(2, rows / (2 * scale));
      const rollPos = (rollSpeed * dir.y) % rows;
      for (let y = 0; y < rows; y++) {
        const scanline = (y % 2 === 0) ? 1 : (1 - 0.35 * s);
        const dy = ((y - rollPos) + rows) % rows;
        const roll = dy < rollHeight ? (1 - dy / rollHeight) * 0.3 * s : 0;
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          out[i] = clamp(base[i] * scanline + roll);
        }
      }
      return;
    }

    case 'matrix': {
      // Per column, a head drop position falls down at speed
      const fallSpeed = cfg.speed * 12;
      const trail = Math.max(3, Math.round(rows * 0.25 / scale));
      for (let x = 0; x < cols; x++) {
        const colSeed = seed[x] * 1000;
        const head = ((t * fallSpeed + colSeed) % (rows + trail)) - trail;
        for (let y = 0; y < rows; y++) {
          const i = y * cols + x;
          let mod = 0;
          const dy = y - head;
          if (dy >= 0 && dy <= trail) {
            const t01 = 1 - dy / trail;
            mod = t01 * 1.0 * s;
          }
          out[i] = clamp(base[i] * (1 - 0.4 * s) + mod);
        }
      }
      return;
    }
  }
}

function clamp(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export const DEFAULT_FX: FxConfig = {
  mode: 'noise',
  strength: 0.45,
  speed: 1,
  scale: 1,
  direction: 'right',
};
