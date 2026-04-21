'use client';

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Lock, Upload, Trash2, Play, Loader2, RefreshCw } from 'lucide-react';

interface VideoItem {
  key: string;
  size: number;
  lastModified: string | null;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function fileName(key: string): string {
  const name = key.split('/').pop() || key;
  return name.replace(/^[a-f0-9]{16}-/, '');
}

export function VideosTab() {
  const [items, setItems] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const [playingLoading, setPlayingLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/dashboard/videos');
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error || 'Error al cargar');
      }
      const b = await res.json();
      setItems(b.items || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleUpload(file: File) {
    setUploading(true);
    setUploadProgress(0);
    setError('');
    try {
      const res = await fetch('/api/dashboard/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || 'video/mp4',
          size: file.size,
        }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error || 'No se pudo firmar la subida');
      }
      const { uploadUrl } = await res.json();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type || 'video/mp4');
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setUploadProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Upload failed: ${xhr.status}`));
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(file);
      });

      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function handlePlay(key: string) {
    if (playingKey === key && playingUrl) {
      setPlayingKey(null);
      setPlayingUrl(null);
      return;
    }
    setPlayingLoading(true);
    setPlayingKey(key);
    try {
      const res = await fetch(`/api/dashboard/videos/sign?key=${encodeURIComponent(key)}`);
      if (!res.ok) throw new Error('No se pudo firmar');
      const b = await res.json();
      setPlayingUrl(b.url);
    } catch (err) {
      setError((err as Error).message);
      setPlayingKey(null);
    } finally {
      setPlayingLoading(false);
    }
  }

  async function handleDelete(key: string) {
    if (!confirm(`¿Eliminar ${fileName(key)}? No se puede deshacer.`)) return;
    try {
      await fetch(`/api/dashboard/videos?key=${encodeURIComponent(key)}`, { method: 'DELETE' });
      if (playingKey === key) {
        setPlayingKey(null);
        setPlayingUrl(null);
      }
      load();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="max-w-5xl flex flex-col gap-5">
      <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-900/60 border border-gray-800 rounded-lg px-3 py-2">
        <Lock className="w-3.5 h-3.5 text-cyan-400" />
        Privado — los videos se guardan en Cloudflare R2 y sólo se acceden con tu sesión del dashboard.
      </div>

      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleUpload(f);
          }}
          disabled={uploading}
          className="hidden"
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-sm font-medium"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? `Subiendo ${uploadProgress}%` : 'Subir video'}
        </button>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refrescar
        </button>
        <div className="text-xs text-gray-500 font-mono">{items.length} total</div>
      </div>

      {error && <div className="text-sm text-red-400">{error}</div>}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Cargando…
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/30 p-10 text-center text-gray-500 text-sm">
          Sin videos aún. Sube el primero.
        </div>
      ) : (
        <div className="rounded-xl border border-gray-800 bg-gray-900/40 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-800/60 text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Archivo</th>
                <th className="px-4 py-3 text-left font-medium">Tamaño</th>
                <th className="px-4 py-3 text-left font-medium">Subido</th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <Fragment key={it.key}>
                  <tr className="border-t border-gray-800 hover:bg-gray-900/80">
                    <td className="px-4 py-3 font-medium text-white truncate max-w-sm">
                      {fileName(it.key)}
                    </td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{formatSize(it.size)}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                      {it.lastModified ? new Date(it.lastModified).toLocaleString('es-MX') : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handlePlay(it.key)}
                          className="px-2.5 py-1 rounded text-xs font-medium text-cyan-400 hover:bg-cyan-900/30 inline-flex items-center gap-1"
                        >
                          <Play className="w-3.5 h-3.5" />
                          {playingKey === it.key ? 'Cerrar' : 'Reproducir'}
                        </button>
                        <button
                          onClick={() => handleDelete(it.key)}
                          className="p-1.5 rounded text-gray-500 hover:bg-red-900/30 hover:text-red-400"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {playingKey === it.key && (
                    <tr className="bg-black">
                      <td colSpan={4} className="p-4">
                        {playingLoading ? (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Firmando URL…
                          </div>
                        ) : playingUrl ? (
                          <video
                            src={playingUrl}
                            controls
                            autoPlay
                            className="w-full max-h-[70vh] rounded-lg bg-black"
                          />
                        ) : null}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
