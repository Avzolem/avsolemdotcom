export interface WebmExportOptions {
  filename: string;
  durationMs?: number;
  fps?: number;
  bitsPerSecond?: number;
  onProgress?: (progress: number) => void;
}

const CANDIDATE_MIME_TYPES = [
  'video/webm;codecs=vp9',
  'video/webm;codecs=vp8',
  'video/webm',
];

function pickMimeType(): string {
  if (typeof MediaRecorder === 'undefined') {
    throw new Error('MediaRecorder no está disponible en este navegador');
  }
  for (const mime of CANDIDATE_MIME_TYPES) {
    if (MediaRecorder.isTypeSupported(mime)) return mime;
  }
  throw new Error('Este navegador no soporta WEBM con MediaRecorder');
}

async function loadOverlayImage(
  overlay: HTMLElement,
  width: number,
  height: number,
): Promise<HTMLImageElement> {
  const rect = overlay.getBoundingClientRect();
  const clone = overlay.cloneNode(true) as HTMLElement;
  inlineStyles(overlay, clone);
  const xml = new XMLSerializer().serializeToString(clone);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${rect.width} ${rect.height}">
    <foreignObject width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml" style="width:${rect.width}px;height:${rect.height}px;position:relative;">${xml}</div>
    </foreignObject>
  </svg>`;
  const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('No se pudo renderizar el overlay'));
    img.src = dataUrl;
  });
}

export async function exportWebm(
  canvas: HTMLCanvasElement,
  overlay: HTMLElement | null,
  opts: WebmExportOptions,
): Promise<void> {
  const durationMs = opts.durationMs ?? 6000;
  const fps = opts.fps ?? 30;
  const mimeType = pickMimeType();

  const composite = document.createElement('canvas');
  composite.width = canvas.width;
  composite.height = canvas.height;
  const ctx = composite.getContext('2d');
  if (!ctx) throw new Error('No 2D context en composite canvas');

  const overlayImg = overlay ? await loadOverlayImage(overlay, canvas.width, canvas.height) : null;

  let stop = false;
  const drawComposite = () => {
    if (stop) return;
    ctx.drawImage(canvas, 0, 0);
    if (overlayImg) ctx.drawImage(overlayImg, 0, 0, composite.width, composite.height);
    requestAnimationFrame(drawComposite);
  };
  drawComposite();

  const stream = composite.captureStream(fps);
  const recorderOpts: MediaRecorderOptions = { mimeType };
  if (opts.bitsPerSecond) recorderOpts.videoBitsPerSecond = opts.bitsPerSecond;
  const recorder = new MediaRecorder(stream, recorderOpts);
  const chunks: Blob[] = [];

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  const finished = new Promise<void>((resolve, reject) => {
    recorder.onstop = () => {
      stop = true;
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(chunks, { type: 'video/webm' });
      try {
        triggerDownload(blob, `${opts.filename}.webm`);
        resolve();
      } catch (err) {
        reject(err);
      }
    };
    recorder.onerror = (e) => {
      stop = true;
      stream.getTracks().forEach((t) => t.stop());
      reject((e as ErrorEvent).error ?? new Error('MediaRecorder error'));
    };
  });

  recorder.start(100);
  const startedAt = performance.now();

  if (opts.onProgress) {
    const tick = () => {
      if (stop || recorder.state === 'inactive') return;
      const p = Math.min(1, (performance.now() - startedAt) / durationMs);
      opts.onProgress?.(p);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  await new Promise<void>((resolve) => setTimeout(resolve, durationMs));
  if (recorder.state !== 'inactive') recorder.stop();
  await finished;
  opts.onProgress?.(1);
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
