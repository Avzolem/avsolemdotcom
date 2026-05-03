import type { Adjustments } from '../types';
import type { FxConfig } from '../fx';

export interface EmbedConfigV1 {
  v: 1;
  templateId: string;
  artStyleId: string | null;
  ratio: string;
  texts: Record<string, string>;
  adjust: Adjustments;
  fx: FxConfig;
  sourceDataUrl?: string;
}

const FORMAT = 'deflate-raw';

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(s: string): Uint8Array {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=');
  const binary = atob(padded);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

async function streamToBytes(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      total += value.length;
    }
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.length;
  }
  return out;
}

export async function encodeEmbedConfig(config: EmbedConfigV1): Promise<string> {
  const json = JSON.stringify(config);
  const input = new TextEncoder().encode(json);
  const cs = new CompressionStream(FORMAT);
  const compressed = new Blob([input as BlobPart]).stream().pipeThrough(cs);
  const bytes = await streamToBytes(compressed);
  return bytesToBase64Url(bytes);
}

export async function decodeEmbedConfig(encoded: string): Promise<EmbedConfigV1 | null> {
  try {
    const bytes = base64UrlToBytes(encoded);
    const ds = new DecompressionStream(FORMAT);
    const decompressed = new Blob([bytes as BlobPart]).stream().pipeThrough(ds);
    const out = await streamToBytes(decompressed);
    const text = new TextDecoder().decode(out);
    const obj = JSON.parse(text);
    if (obj && obj.v === 1) return obj as EmbedConfigV1;
    return null;
  } catch {
    return null;
  }
}

export interface RecompressOptions {
  maxWidth?: number;
  quality?: number;
  mimeType?: string;
}

export async function recompressImageDataUrl(
  dataUrl: string,
  opts: RecompressOptions = {},
): Promise<string> {
  const maxWidth = opts.maxWidth ?? 1024;
  const quality = opts.quality ?? 0.82;
  const mimeType = opts.mimeType ?? 'image/jpeg';

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error('No se pudo cargar la imagen para recomprimir'));
    i.src = dataUrl;
  });

  const ratio = img.width > maxWidth ? maxWidth / img.width : 1;
  const w = Math.round(img.width * ratio);
  const h = Math.round(img.height * ratio);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No 2D context para recompresión');
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL(mimeType, quality);
}

export function approxEmbedBytes(encoded: string): number {
  return encoded.length;
}
