import { GIFEncoder, quantize, applyPalette } from 'gifenc';

export interface GifExportOptions {
  filename: string;
  durationMs?: number;
  fps?: number;
  scale?: number;
  onProgress?: (progress: number) => void;
}

interface FrameSource {
  canvas: HTMLCanvasElement;
  overlay?: HTMLElement | null;
  overlayDataUrl?: string;
}

async function snapshot(
  source: FrameSource,
  width: number,
  height: number,
  cachedOverlayImg: HTMLImageElement | null,
): Promise<{ data: Uint8ClampedArray; overlayImg: HTMLImageElement | null }> {
  const c = document.createElement('canvas');
  c.width = width;
  c.height = height;
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('No 2D context');
  ctx.drawImage(source.canvas, 0, 0, width, height);
  let overlayImg = cachedOverlayImg;
  if (source.overlayDataUrl) {
    if (!overlayImg) {
      overlayImg = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('overlay image failed'));
        img.src = source.overlayDataUrl!;
      });
    }
    ctx.drawImage(overlayImg, 0, 0, width, height);
  }
  const imageData = ctx.getImageData(0, 0, width, height);
  return { data: imageData.data, overlayImg };
}

export async function exportGif(
  canvas: HTMLCanvasElement,
  overlay: HTMLElement | null,
  opts: GifExportOptions,
): Promise<void> {
  const durationMs = opts.durationMs ?? 3000;
  const fps = opts.fps ?? 18;
  const scale = opts.scale ?? 0.6;
  const totalFrames = Math.max(1, Math.round((durationMs / 1000) * fps));
  const frameDelay = Math.round(1000 / fps);

  const width = Math.max(2, Math.round(canvas.width * scale));
  const height = Math.max(2, Math.round(canvas.height * scale));

  // Render overlay once to an SVG data URL — overlay text is static across frames
  let overlayDataUrl: string | undefined;
  if (overlay) {
    overlayDataUrl = await overlayToDataUrl(overlay, canvas.width, canvas.height);
  }

  const enc = GIFEncoder();
  const frameSource: FrameSource = { canvas, overlay, overlayDataUrl };

  let cachedOverlayImg: HTMLImageElement | null = null;
  for (let i = 0; i < totalFrames; i++) {
    const snap = await snapshot(frameSource, width, height, cachedOverlayImg);
    cachedOverlayImg = snap.overlayImg;
    const palette = quantize(snap.data, 256, { format: 'rgba4444' });
    const indexed = applyPalette(snap.data, palette, 'rgba4444');
    enc.writeFrame(indexed, width, height, { palette, delay: frameDelay });
    opts.onProgress?.((i + 1) / totalFrames);
    // Wait for next animation frame so the source canvas has time to redraw
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }
  enc.finish();

  const buffer = enc.bytes();
  const copy = new Uint8Array(buffer.byteLength);
  copy.set(buffer);
  const blob = new Blob([copy.buffer], { type: 'image/gif' });
  triggerDownload(blob, `${opts.filename}.gif`);
}

async function overlayToDataUrl(overlay: HTMLElement, w: number, h: number): Promise<string> {
  const rect = overlay.getBoundingClientRect();
  const clone = overlay.cloneNode(true) as HTMLElement;
  inlineStyles(overlay, clone);
  const xml = new XMLSerializer().serializeToString(clone);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${rect.width} ${rect.height}">
    <foreignObject width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml" style="width:${rect.width}px;height:${rect.height}px;position:relative;">${xml}</div>
    </foreignObject>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function inlineStyles(src: Element, dst: Element) {
  const srcEl = src as HTMLElement;
  const dstEl = dst as HTMLElement;
  if (srcEl.nodeType === 1 && dstEl.style) {
    const computed = window.getComputedStyle(srcEl);
    let cssText = '';
    for (let i = 0; i < computed.length; i++) {
      const prop = computed[i];
      cssText += `${prop}:${computed.getPropertyValue(prop)};`;
    }
    dstEl.setAttribute('style', cssText);
  }
  const srcChildren = Array.from(src.children);
  const dstChildren = Array.from(dst.children);
  for (let i = 0; i < srcChildren.length; i++) {
    if (dstChildren[i]) inlineStyles(srcChildren[i], dstChildren[i]);
  }
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
