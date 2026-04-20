'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Loader2, Check, Music } from 'lucide-react';

interface Soundtrack {
  _id: string;
  month: string;
  title: string;
  artist: string;
  youtubeId: string;
  description?: string;
}

function extractYouTubeId(input: string): string {
  // Accept: raw ID, youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID
  const raw = input.trim();
  if (/^[a-zA-Z0-9_-]{6,20}$/.test(raw) && !raw.includes('/')) return raw;
  const short = raw.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (short) return short[1];
  const watch = raw.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watch) return watch[1];
  const embed = raw.match(/embed\/([a-zA-Z0-9_-]+)/);
  if (embed) return embed[1];
  return raw;
}

export function SoundtrackTab() {
  const [items, setItems] = useState<Soundtrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const [month, setMonth] = useState(defaultMonth);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [ytInput, setYtInput] = useState('');
  const [description, setDescription] = useState('');

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/soundtracks');
      if (res.ok) {
        const b = await res.json();
        setItems(b.soundtracks || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    setSaving(true); setError('');
    try {
      const youtubeId = extractYouTubeId(ytInput);
      const res = await fetch('/api/dashboard/soundtracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, title, artist, youtubeId, description }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error || 'Error');
      }
      setTitle(''); setArtist(''); setYtInput(''); setDescription('');
      load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(m: string) {
    if (!confirm(`¿Eliminar soundtrack de ${m}?`)) return;
    await fetch(`/api/dashboard/soundtracks?month=${encodeURIComponent(m)}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="max-w-4xl flex flex-col gap-6">
      {/* Add new */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-violet-400 mb-3">
          <Plus className="w-3.5 h-3.5" />
          Nuevo mes
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="2026-04"
            className="px-3 py-2 text-sm rounded-lg bg-gray-950 border border-gray-700 text-white placeholder:text-gray-500"
          />
          <input
            value={ytInput}
            onChange={(e) => setYtInput(e.target.value)}
            placeholder="URL o ID de YouTube"
            className="px-3 py-2 text-sm rounded-lg bg-gray-950 border border-gray-700 text-white placeholder:text-gray-500"
          />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título del track"
            className="px-3 py-2 text-sm rounded-lg bg-gray-950 border border-gray-700 text-white placeholder:text-gray-500"
          />
          <input
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Artista"
            className="px-3 py-2 text-sm rounded-lg bg-gray-950 border border-gray-700 text-white placeholder:text-gray-500"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nota (opcional)"
            className="md:col-span-2 px-3 py-2 text-sm rounded-lg bg-gray-950 border border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>
        {error && <div className="text-sm text-red-400 mt-3">{error}</div>}
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={handleSave}
            disabled={saving || !title.trim() || !artist.trim() || !ytInput.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Guardar
          </button>
          <div className="text-xs text-gray-500">
            Si el mes ya existe, lo sobrescribe.
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Cargando…
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/30 p-10 text-center text-gray-500 text-sm">
          Sin soundtracks aún. Agrega el del mes.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((s) => (
            <div
              key={s._id}
              className="rounded-xl border border-gray-800 bg-gray-900/40 p-4 flex items-center gap-4"
            >
              <div className="w-32 aspect-video bg-black rounded overflow-hidden shrink-0">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${s.youtubeId}`}
                  title={s.title}
                  className="w-full h-full"
                  allow="encrypted-media"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Music className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-xs font-mono text-violet-400">{s.month}</span>
                </div>
                <div className="font-semibold text-white mt-1 truncate">{s.title}</div>
                <div className="text-sm text-gray-400 truncate">{s.artist}</div>
                {s.description && (
                  <div className="text-xs text-gray-500 mt-1 line-clamp-2">{s.description}</div>
                )}
              </div>
              <button
                onClick={() => handleDelete(s.month)}
                className="p-2 rounded text-gray-500 hover:bg-red-900/30 hover:text-red-400"
                aria-label="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
