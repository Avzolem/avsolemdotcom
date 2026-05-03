'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { templates, type AsciiTemplate } from '@/lib/ascii/templates';
import { exportPng, buildHtmlEmbed, copyToClipboard } from '@/lib/ascii/exporters';
import { exportGif } from '@/lib/ascii/exporters/gif';
import { exportWebm } from '@/lib/ascii/exporters/webm';
import { encodeEmbedConfig, recompressImageDataUrl, type EmbedConfigV1 } from '@/lib/ascii/embed/config';
import { saveCreation, makeId, type SavedCreation } from '@/lib/ascii/storage/db';
import { artStyles, getArtStyle } from '@/lib/ascii/artStyles';
import { DEFAULT_FX, FX_PRESETS, type FxConfig, type FxDirection, type FxMode } from '@/lib/ascii/fx';
import type { Adjustments } from '@/lib/ascii/types';
import type { AsciiCanvasApi } from './AsciiCanvas';
import TemplatesDrawer from './TemplatesDrawer';
import LibraryDrawer from './LibraryDrawer';
import ControlPanel from './ControlPanel';
import EmbedModal from './EmbedModal';

const DEFAULT_ADJUST: Adjustments = {
  brightness: 0,
  contrast: 0,
  ditherStrength: 1,
  opacity: 1,
  colorPreset: 'template',
  customColor: '#c9a227',
};

const AsciiCanvas = dynamic(() => import('./AsciiCanvas'), { ssr: false });
const TemplateOverlay = dynamic(() => import('./TemplateOverlay'), { ssr: false });

const RATIOS = ['16:9', '4:3', '1:1', '3:4', '9:16'] as const;
type Ratio = (typeof RATIOS)[number];

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function captureThumbnail(canvas: HTMLCanvasElement | null, w = 320, h = 180): string {
  if (!canvas) return '';
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (!ctx) return '';
  ctx.drawImage(canvas, 0, 0, w, h);
  return c.toDataURL('image/png');
}

export default function AsciiStudioPage() {
  const [templateId, setTemplateId] = useState(templates[0].id);
  const [artStyleId, setArtStyleId] = useState<string | null>(null);
  const [adjust, setAdjust] = useState<Adjustments>(DEFAULT_ADJUST);
  const [fx, setFx] = useState<FxConfig>(DEFAULT_FX);
  const [source, setSource] = useState<HTMLImageElement | null>(null);
  const [sourceDataUrl, setSourceDataUrl] = useState<string | undefined>(undefined);
  const [ratio, setRatio] = useState<Ratio>('16:9');
  const [playing, setPlaying] = useState(true);
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [dragging, setDragging] = useState(false);
  const [exporting, setExporting] = useState<null | 'png' | 'gif' | 'webm' | 'embed' | 'iframe'>(null);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportMenu, setExportMenu] = useState(false);
  const [embedSnippet, setEmbedSnippet] = useState<string | null>(null);
  const [embedKind, setEmbedKind] = useState<'static' | 'iframe'>('static');
  const [embedMeta, setEmbedMeta] = useState<{ chars: number; sizeKb: number; warn: boolean } | null>(null);
  const [saving, setSaving] = useState(false);
  const [drawer, setDrawer] = useState<'library' | 'templates' | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [libraryRefreshKey, setLibraryRefreshKey] = useState(0);
  const [fpsValue, setFpsValue] = useState(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const apiRef = useRef<AsciiCanvasApi | null>(null);
  const exportMenuRef = useRef<HTMLDivElement | null>(null);

  const template = useMemo(
    () => templates.find((t) => t.id === templateId) ?? templates[0],
    [templateId],
  );
  const artStyle = useMemo(() => (artStyleId ? getArtStyle(artStyleId) ?? null : null), [artStyleId]);

  const handleFile = useCallback(async (file: File | null | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;
    const dataUrl = await fileToDataUrl(file);
    const img = await loadImage(dataUrl);
    setSource(img);
    setSourceDataUrl(dataUrl);
  }, []);

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          handleFile(item.getAsFile());
          break;
        }
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [handleFile]);

  const onTextChange = useCallback((id: string, value: string) => {
    setTexts((prev) => ({ ...prev, [id]: value }));
  }, []);

  const onCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
  }, []);

  const onCanvasApi = useCallback((api: AsciiCanvasApi) => {
    apiRef.current = api;
  }, []);

  const onFpsTick = useCallback((v: number) => setFpsValue(v), []);

  useEffect(() => {
    if (!exportMenu) return;
    const handler = (e: MouseEvent) => {
      if (!exportMenuRef.current?.contains(e.target as Node)) setExportMenu(false);
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [exportMenu]);

  const handlePickTemplate = useCallback((t: AsciiTemplate) => {
    setTemplateId(t.id);
    setTexts({});
    setArtStyleId(t.defaultArtStyleId ?? null);
    setFx(t.defaultFx ?? DEFAULT_FX);
  }, []);

  const handleLoadCreation = useCallback(async (item: SavedCreation) => {
    setTemplateId(item.templateId);
    setTexts(item.texts);
    setRatio(item.ratio as Ratio);
    if (item.sourceDataUrl) {
      const img = await loadImage(item.sourceDataUrl);
      setSource(img);
      setSourceDataUrl(item.sourceDataUrl);
    } else {
      setSource(null);
      setSourceDataUrl(undefined);
    }
  }, []);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const titleLayer = template.layout.layers.find((l) => l.id === 'title');
      const baseName = texts[titleLayer?.id ?? ''] ?? titleLayer?.text ?? template.name;
      const item: SavedCreation = {
        id: makeId(),
        name: `${baseName}`,
        templateId: template.id,
        texts,
        sourceDataUrl,
        thumbnail: captureThumbnail(canvasRef.current),
        ratio,
        createdAt: Date.now(),
      };
      await saveCreation(item);
      setLibraryRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      setSaving(false);
    }
  };

  const handleExportPng = async () => {
    if (!canvasRef.current || !overlayRef.current) return;
    setExportMenu(false);
    setExporting('png');
    try {
      await exportPng(canvasRef.current, overlayRef.current, {
        filename: `ascii-${template.id}-${Date.now()}`,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(null);
    }
  };

  const handleExportGif = async () => {
    if (!canvasRef.current) return;
    setExportMenu(false);
    setExporting('gif');
    setExportProgress(0);
    try {
      await exportGif(canvasRef.current, overlayRef.current, {
        filename: `ascii-${template.id}-${Date.now()}`,
        durationMs: 3000,
        fps: 18,
        scale: 0.6,
        onProgress: (p) => setExportProgress(p),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(null);
      setExportProgress(0);
    }
  };

  const handleExportEmbed = () => {
    setExportMenu(false);
    const grid = apiRef.current?.getGrid();
    const colors = apiRef.current?.getResolvedColors() ?? { fg: '#fff', bg: '#000' };
    if (!grid) return;
    const snippet = buildHtmlEmbed(grid, colors.fg, colors.bg);
    setEmbedKind('static');
    setEmbedMeta(null);
    setEmbedSnippet(snippet);
  };

  const handleExportWebm = async () => {
    if (!canvasRef.current) return;
    setExportMenu(false);
    setExporting('webm');
    setExportProgress(0);
    try {
      await exportWebm(canvasRef.current, overlayRef.current, {
        filename: `ascii-${template.id}-${Date.now()}`,
        durationMs: 6000,
        fps: 30,
        bitsPerSecond: 5_000_000,
        onProgress: (p) => setExportProgress(p),
      });
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'WEBM export failed');
    } finally {
      setExporting(null);
      setExportProgress(0);
    }
  };

  const handleExportIframe = async () => {
    setExportMenu(false);
    setExporting('iframe');
    try {
      let embeddedImage: string | undefined;
      if (sourceDataUrl) {
        embeddedImage = await recompressImageDataUrl(sourceDataUrl, {
          maxWidth: 1024,
          quality: 0.82,
          mimeType: 'image/jpeg',
        });
      }
      const config: EmbedConfigV1 = {
        v: 1,
        templateId: template.id,
        artStyleId: artStyleId,
        ratio,
        texts,
        adjust,
        fx,
        sourceDataUrl: embeddedImage,
      };
      const encoded = await encodeEmbedConfig(config);
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://avsolem.com';
      const url = `${origin}/embed/ascii#config=${encoded}`;
      const aspect = ratio.split(':').map(Number);
      const paddingTop = aspect.length === 2 ? `${(aspect[1] / aspect[0]) * 100}%` : '56.25%';
      const snippet = `<div style="position:relative;width:100%;padding-top:${paddingTop};">
  <iframe
    src="${url}"
    style="position:absolute;inset:0;width:100%;height:100%;border:0;"
    allow="autoplay"
    loading="lazy"
    title="ASCII Studio embed"
  ></iframe>
</div>`;
      const sizeKb = Math.round(snippet.length / 1024);
      setEmbedKind('iframe');
      setEmbedMeta({ chars: snippet.length, sizeKb, warn: sizeKb > 500 });
      setEmbedSnippet(snippet);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Live embed failed');
    } finally {
      setExporting(null);
    }
  };

  const handleCopyEmbed = async () => {
    if (!embedSnippet) return;
    try {
      await copyToClipboard(embedSnippet);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="ascii-shell-inner" data-panel-open={panelOpen}>
      <header className="ascii-bar ascii-bar--top">
        <nav>
          <button type="button" onClick={() => setDrawer('library')}>
            Library
          </button>
          <button
            type="button"
            data-active={drawer === 'templates'}
            onClick={() => setDrawer('templates')}
          >
            Templates
          </button>
        </nav>
        <nav>
          <button
            type="button"
            data-active={panelOpen}
            onClick={() => setPanelOpen((v) => !v)}
          >
            Customize
          </button>
          <button type="button" onClick={handleSave} data-active={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
          <div className="ascii-export-wrap" ref={exportMenuRef}>
            <button
              type="button"
              onClick={() => setExportMenu((v) => !v)}
              disabled={exporting !== null}
              data-active={exporting !== null || exportMenu}
            >
              {exporting === 'gif'
                ? `GIF ${Math.round(exportProgress * 100)}%`
                : exporting === 'webm'
                  ? `WEBM ${Math.round(exportProgress * 100)}%`
                  : exporting === 'png'
                    ? 'PNG…'
                    : exporting === 'iframe'
                      ? 'Embed…'
                      : 'Publish ▾'}
            </button>
            {exportMenu && (
              <div className="ascii-export-menu" role="menu">
                <button type="button" onClick={handleExportPng}>
                  <strong>PNG</strong>
                  <span>still image · current frame</span>
                </button>
                <button type="button" onClick={handleExportGif}>
                  <strong>GIF</strong>
                  <span>animated · 3s · 18fps</span>
                </button>
                <button type="button" onClick={handleExportWebm}>
                  <strong>WEBM</strong>
                  <span>video · 6s · 30fps</span>
                </button>
                <button type="button" onClick={handleExportIframe}>
                  <strong>Live embed</strong>
                  <span>iframe · animated · drop-in</span>
                </button>
                <button type="button" onClick={handleExportEmbed}>
                  <strong>Embed code</strong>
                  <span>static &lt;pre&gt; HTML</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>

      <div
        className="ascii-stage"
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          handleFile(file);
        }}
      >
        <div className="ascii-frame" data-ratio={ratio}>
          <AsciiCanvas
            source={source}
            template={template}
            artStyle={artStyle}
            adjust={adjust}
            fx={fx}
            playing={playing}
            onReady={onCanvasReady}
            onFps={onFpsTick}
            apiRef={onCanvasApi}
          />
          <div ref={overlayRef} className="ascii-overlay-host">
            <TemplateOverlay template={template} texts={texts} onTextChange={onTextChange} />
          </div>
          {!source && !dragging && (
            <div className="ascii-empty">
              <span>Drop image · paste · or click upload</span>
            </div>
          )}
          {dragging && <div className="ascii-drop-overlay">Drop to inject ASCII</div>}
        </div>
      </div>

      <footer className="ascii-bar ascii-bar--bottom">
        <div className="ascii-control-group">
          <span style={{ opacity: 0.6 }}>Template Preview / ASCII Injected</span>
          <span style={{ marginLeft: 16, color: 'var(--ascii-cream)' }}>
            Loaded template: {template.name}
            {artStyle && <span style={{ opacity: 0.6 }}> · {artStyle.name}</span>}
          </span>
        </div>
        <div className="ascii-control-group" style={{ gap: 12 }}>
          <div className="ascii-control-group">
            <span style={{ opacity: 0.5 }}>FPS</span>
            <span
              style={{
                color: fpsValue >= 50 ? '#6BD672' : fpsValue >= 24 ? 'var(--ascii-amber)' : '#d65a4a',
                fontWeight: 600,
                fontFeatureSettings: '"tnum"',
                minWidth: 24,
                textAlign: 'right',
              }}
            >
              {fpsValue || '—'}
            </span>
          </div>
          <div className="ascii-control-group">
            {RATIOS.map((r) => (
              <button
                key={r}
                type="button"
                className="ascii-chip"
                data-active={r === ratio}
                onClick={() => setRatio(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </footer>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <TemplatesDrawer
        open={drawer === 'templates'}
        current={templateId}
        onClose={() => setDrawer(null)}
        onPick={handlePickTemplate}
      />
      <LibraryDrawer
        open={drawer === 'library'}
        onClose={() => setDrawer(null)}
        onLoad={handleLoadCreation}
        refreshKey={libraryRefreshKey}
      />
      <EmbedModal
        snippet={embedSnippet}
        onClose={() => {
          setEmbedSnippet(null);
          setEmbedMeta(null);
        }}
        onCopy={handleCopyEmbed}
        title={embedKind === 'iframe' ? 'Live embed' : 'Embed code'}
        description={
          embedKind === 'iframe'
            ? 'Animated iframe — paste into any site (WordPress, Notion, React, plain HTML). Self-contained: no images stored on our servers.'
            : 'Self-contained <pre> — paste anywhere HTML renders.'
        }
        banner={
          embedKind === 'iframe' && embedMeta?.warn ? (
            <div className="ascii-embed-warning">
              ⚠ Snippet is {embedMeta.sizeKb} KB — the source image is encoded inside the URL. For lighter
              embeds, host the image on a CDN and reduce its resolution.
            </div>
          ) : null
        }
        meta={
          embedKind === 'iframe' && embedMeta
            ? `${embedMeta.chars.toLocaleString()} chars · ${embedMeta.sizeKb} KB`
            : undefined
        }
      />
      <ControlPanel
        open={panelOpen}
        artStyleId={artStyleId}
        setArtStyleId={setArtStyleId}
        adjust={adjust}
        setAdjust={setAdjust}
        fx={fx}
        setFx={setFx}
        ratio={ratio}
        setRatio={setRatio}
        onUploadClick={() => fileInputRef.current?.click()}
        onReset={() => {
          setAdjust(DEFAULT_ADJUST);
          setFx(DEFAULT_FX);
          setArtStyleId(null);
        }}
        onRandom={() => {
          const COLOR_PRESETS = ['template', 'grayscale', 'fullColor', 'matrix', 'amber', 'custom'] as const;
          const DIRS: FxDirection[] = ['up', 'down', 'left', 'right'];
          const animatedFx = FX_PRESETS.filter((p) => p.id !== 'none');
          const randomColor = '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
          setArtStyleId(Math.random() < 0.7 ? pick(artStyles).id : null);
          setAdjust({
            brightness: rand(-0.3, 0.3),
            contrast: rand(-0.2, 0.5),
            ditherStrength: rand(0.5, 1),
            opacity: rand(0.6, 1),
            colorPreset: pick(COLOR_PRESETS),
            customColor: randomColor,
          });
          setFx({
            mode: pick(animatedFx).id as FxMode,
            strength: rand(0.3, 0.8),
            speed: rand(0.5, 2.5),
            scale: rand(0.5, 2.2),
            direction: pick(DIRS),
          });
        }}
        fps={fpsValue}
        onToggle={() => setPanelOpen((v) => !v)}
      />
    </div>
  );
}
