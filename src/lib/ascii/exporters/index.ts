export interface ExportOptions {
  filename: string;
}

export async function exportPng(canvas: HTMLCanvasElement, overlay: HTMLElement, opts: ExportOptions): Promise<void> {
  const composite = document.createElement('canvas');
  composite.width = canvas.width;
  composite.height = canvas.height;
  const ctx = composite.getContext('2d');
  if (!ctx) throw new Error('No 2D context');

  ctx.drawImage(canvas, 0, 0);

  const overlayRect = overlay.getBoundingClientRect();
  const scale = canvas.width / overlayRect.width;

  const svgString = await overlayToSvg(overlay, overlayRect.width, overlayRect.height);
  const img = new Image();
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to render overlay'));
    img.src = url;
  });
  ctx.drawImage(img, 0, 0, overlayRect.width * scale, overlayRect.height * scale);

  const blob = await new Promise<Blob | null>((resolve) => composite.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Could not encode PNG');
  triggerDownload(blob, `${opts.filename}.png`);
}

async function overlayToSvg(overlay: HTMLElement, w: number, h: number): Promise<string> {
  // Inline computed styles into a foreignObject SVG.
  const clone = overlay.cloneNode(true) as HTMLElement;
  inlineStyles(overlay, clone);
  const xml = new XMLSerializer().serializeToString(clone);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <foreignObject width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml" style="width:${w}px;height:${h}px;position:relative;">${xml}</div>
    </foreignObject>
  </svg>`;
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

export function exportText(text: string, opts: ExportOptions): void {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  triggerDownload(blob, `${opts.filename}.txt`);
}

export interface EmbedGrid {
  cols: number;
  rows: number;
  chars: string[];
}

export function gridToString(grid: EmbedGrid): string {
  const lines: string[] = [];
  for (let y = 0; y < grid.rows; y++) {
    let line = '';
    for (let x = 0; x < grid.cols; x++) line += grid.chars[y * grid.cols + x];
    lines.push(line);
  }
  return lines.join('\n');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function buildHtmlEmbed(grid: EmbedGrid, fg: string, bg: string): string {
  const text = escapeHtml(gridToString(grid));
  const styles = [
    `font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace`,
    `font-size:10px`,
    `line-height:1`,
    `letter-spacing:0`,
    `color:${fg}`,
    `background:${bg}`,
    `margin:0`,
    `padding:24px`,
    `white-space:pre`,
    `overflow:auto`,
    `border-radius:4px`,
  ].join(';');
  return `<pre style="${styles}">${text}</pre>`;
}

export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
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
