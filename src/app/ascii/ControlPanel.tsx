'use client';

import type { Dispatch, SetStateAction } from 'react';
import { artStyles, type ArtStyle } from '@/lib/ascii/artStyles';
import { FX_PRESETS, type FxConfig, type FxDirection, type FxMode } from '@/lib/ascii/fx';
import type { Adjustments, ColorPreset } from '@/lib/ascii/types';

const RATIOS = ['16:9', '4:3', '1:1', '3:4', '9:16'] as const;
type Ratio = (typeof RATIOS)[number];

interface Props {
  open: boolean;
  artStyleId: string | null;
  setArtStyleId: Dispatch<SetStateAction<string | null>>;
  adjust: Adjustments;
  setAdjust: Dispatch<SetStateAction<Adjustments>>;
  fx: FxConfig;
  setFx: Dispatch<SetStateAction<FxConfig>>;
  ratio: Ratio;
  setRatio: Dispatch<SetStateAction<Ratio>>;
  onUploadClick: () => void;
  onReset: () => void;
  onRandom: () => void;
  fps: number;
  onToggle: () => void;
}

const COLOR_PRESETS: { id: ColorPreset; name: string; swatch?: string }[] = [
  { id: 'template', name: 'Template' },
  { id: 'grayscale', name: 'Grayscale', swatch: '#f5f5f5' },
  { id: 'fullColor', name: 'Full Color' },
  { id: 'matrix', name: 'Matrix Green', swatch: '#00FF99' },
  { id: 'amber', name: 'Amber Mo.', swatch: '#FFDFB2' },
  { id: 'custom', name: 'Custom' },
];

export default function ControlPanel({
  open, artStyleId, setArtStyleId, adjust, setAdjust, fx, setFx,
  ratio, setRatio, onUploadClick, onReset, onRandom, fps, onToggle,
}: Props) {
  const updateAdjust = (patch: Partial<Adjustments>) =>
    setAdjust((prev) => ({ ...prev, ...patch }));
  const updateFx = (patch: Partial<FxConfig>) =>
    setFx((prev) => ({ ...prev, ...patch }));

  return (
    <>
      <button
        type="button"
        className="ascii-panel-handle"
        data-open={open}
        onClick={onToggle}
        aria-label={open ? 'Close panel' : 'Open panel'}
      >
        {open ? '›' : '‹'}
      </button>

    <aside className="ascii-panel" data-open={open} aria-hidden={!open}>
      <header className="ascii-panel-head">
        <span className="ascii-panel-logo">ASCII</span>
        <div className="ascii-panel-head-actions">
          <button type="button" onClick={onRandom} className="ascii-panel-reset" title="Randomize all settings">
            Random
          </button>
          <button type="button" onClick={onReset} className="ascii-panel-reset" title="Reset all adjustments">
            Reset
          </button>
        </div>
      </header>
      <p className="ascii-panel-tagline">
        ASCII editor for art, video, live cam and webgl exports
      </p>

      <Section label="Source">
        <button type="button" className="ascii-panel-drop" onClick={onUploadClick}>
          <strong>Drop image / video</strong>
          <span>or click to browse</span>
          <em>JPG · PNG · GIF · WEBP · MP4</em>
        </button>
      </Section>

      <Section label="Aspect Ratio">
        <div className="ascii-panel-row">
          {RATIOS.map((r) => (
            <button
              key={r}
              type="button"
              className="ascii-panel-chip ascii-panel-chip--small"
              data-active={r === ratio}
              onClick={() => setRatio(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </Section>

      <Section label="Art Style">
        <div className="ascii-panel-grid">
          {artStyles.map((s: ArtStyle) => (
            <button
              key={s.id}
              type="button"
              className="ascii-panel-chip"
              data-active={artStyleId === s.id}
              onClick={() => setArtStyleId((prev) => (prev === s.id ? null : s.id))}
            >
              {s.name}
            </button>
          ))}
        </div>
      </Section>

      <Section label="Color Mode">
        <div className="ascii-panel-grid">
          {COLOR_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className="ascii-panel-chip ascii-panel-chip--color"
              data-active={adjust.colorPreset === p.id}
              onClick={() => updateAdjust({ colorPreset: p.id })}
            >
              {p.swatch && (
                <span className="ascii-panel-swatch" style={{ background: p.swatch }} />
              )}
              {p.name}
            </button>
          ))}
        </div>
        {adjust.colorPreset === 'custom' && (
          <div className="ascii-panel-custom-color">
            <label htmlFor="ascii-custom-color">Custom color</label>
            <div className="ascii-panel-color-row">
              <input
                id="ascii-custom-color"
                type="color"
                value={adjust.customColor}
                onChange={(e) => updateAdjust({ customColor: e.target.value })}
              />
              <input
                type="text"
                value={adjust.customColor}
                onChange={(e) => updateAdjust({ customColor: e.target.value })}
              />
            </div>
          </div>
        )}
      </Section>

      <Section label="Adjustments">
        <Slider label="Brightness" min={-1} max={1} step={0.01}
          value={adjust.brightness} onChange={(v) => updateAdjust({ brightness: v })} />
        <Slider label="Contrast" min={-1} max={1} step={0.01}
          value={adjust.contrast} onChange={(v) => updateAdjust({ contrast: v })} />
        <Slider label="Dither Strength" min={0} max={1} step={0.01}
          value={adjust.ditherStrength} onChange={(v) => updateAdjust({ ditherStrength: v })} />
        <Slider label="Opacity" min={0} max={1} step={0.01}
          value={adjust.opacity} onChange={(v) => updateAdjust({ opacity: v })} />
      </Section>

      <Section label="FX Preset">
        <div className="ascii-panel-grid">
          {FX_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className="ascii-panel-chip"
              data-active={fx.mode === p.id}
              onClick={() => updateFx({ mode: p.id as FxMode })}
            >
              {p.name}
            </button>
          ))}
        </div>
        {fx.mode !== 'none' && (
          <>
            <Slider label="FX Strength" min={0} max={1} step={0.01}
              value={fx.strength} onChange={(v) => updateFx({ strength: v })} />
            <Slider label="FX Speed" min={0} max={3} step={0.05}
              value={fx.speed} onChange={(v) => updateFx({ speed: v })} />
            <Slider label="FX Scale" min={0.25} max={3} step={0.05}
              value={fx.scale} onChange={(v) => updateFx({ scale: v })} />
            <DirectionPicker value={fx.direction} onChange={(d) => updateFx({ direction: d })} />
          </>
        )}
      </Section>

      <Section label="Performance">
        <div className="ascii-panel-fps">
          <span>FPS</span>
          <strong data-low={fps > 0 && fps < 24} data-mid={fps >= 24 && fps < 50}>{fps || '—'}</strong>
          <em>{fps === 0 ? '' : fps >= 50 ? 'smooth' : fps >= 24 ? 'ok' : 'laggy'}</em>
        </div>
      </Section>
    </aside>
    </>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="ascii-panel-section">
      <h3>{label}</h3>
      {children}
    </section>
  );
}

interface SliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}

function DirectionPicker({ value, onChange }: { value: FxDirection; onChange: (d: FxDirection) => void }) {
  const dirs: { id: FxDirection; arrow: string }[] = [
    { id: 'up', arrow: '↑' },
    { id: 'down', arrow: '↓' },
    { id: 'left', arrow: '←' },
    { id: 'right', arrow: '→' },
  ];
  return (
    <div className="ascii-panel-direction">
      <span>Direction</span>
      <div className="ascii-panel-direction-row">
        {dirs.map((d) => (
          <button
            key={d.id}
            type="button"
            data-active={value === d.id}
            onClick={() => onChange(d.id)}
            aria-label={d.id}
          >
            {d.arrow}
          </button>
        ))}
      </div>
    </div>
  );
}

function Slider({ label, min, max, step, value, onChange }: SliderProps) {
  return (
    <div className="ascii-panel-slider">
      <div className="ascii-panel-slider-head">
        <span>{label}</span>
        <button
          type="button"
          className="ascii-panel-slider-value"
          onClick={() => onChange(min < 0 ? 0 : (label === 'Opacity' || label === 'Dither Strength') ? 1 : 0)}
          title="Reset"
        >
          {value.toFixed(2)}
        </button>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}
