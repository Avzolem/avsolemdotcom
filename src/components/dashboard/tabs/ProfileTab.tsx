'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Loader2, Check, Circle } from 'lucide-react';

interface Profile {
  avatar?: string;
  availability?: 'available' | 'busy' | 'not-available';
  availabilityNote?: string;
}

const AVAIL_OPTIONS: Array<{
  key: NonNullable<Profile['availability']>;
  label: string;
  color: string;
}> = [
  { key: 'available', label: 'Disponible', color: 'text-emerald-400' },
  { key: 'busy', label: 'Ocupado', color: 'text-amber-400' },
  { key: 'not-available', label: 'No disponible', color: 'text-gray-500' },
];

export function ProfileTab() {
  const [profile, setProfile] = useState<Profile>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/dashboard/profile');
        if (res.ok) {
          const b = await res.json();
          setProfile(b.profile || {});
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function save(patch: Partial<Profile>) {
    setSaving(true); setError('');
    try {
      const res = await fetch('/api/dashboard/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error || 'Error');
      }
      const b = await res.json();
      setProfile(b.profile || {});
      setSavedAt(Date.now());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-sm text-gray-500">Cargando…</div>;

  const avatarSrc = profile.avatar?.trim() || '/images/andres.jpeg';

  return (
    <div className="max-w-2xl flex flex-col gap-6">
      {/* Avatar */}
      <section className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Foto de perfil</h3>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-700 shrink-0">
            <Image src={avatarSrc} alt="Avatar" fill className="object-cover" />
          </div>
          <div className="flex-1">
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
              URL de la imagen
            </label>
            <input
              value={profile.avatar ?? ''}
              onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
              placeholder="/images/andres.jpeg o URL absoluta"
              className="w-full px-3 py-2 text-sm rounded-lg bg-gray-950 border border-gray-700 text-white placeholder:text-gray-500"
            />
            <div className="text-xs text-gray-500 mt-1">
              Cloudinary, ruta local, o cualquier URL pública.
            </div>
            <button
              onClick={() => save({ avatar: profile.avatar })}
              disabled={saving}
              className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-medium"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Guardar foto
            </button>
          </div>
        </div>
      </section>

      {/* Availability */}
      <section className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Disponibilidad</h3>
        <div className="flex flex-wrap gap-2">
          {AVAIL_OPTIONS.map((opt) => {
            const active = profile.availability === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => save({ availability: opt.key })}
                disabled={saving}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                  active
                    ? 'border-cyan-500 bg-cyan-900/30 text-white'
                    : 'border-gray-700 bg-gray-950 text-gray-400 hover:border-gray-600'
                }`}
              >
                <Circle className={`w-3 h-3 fill-current ${opt.color}`} />
                {opt.label}
              </button>
            );
          })}
        </div>
        <div className="mt-4">
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
            Nota (opcional)
          </label>
          <input
            value={profile.availabilityNote ?? ''}
            onChange={(e) => setProfile({ ...profile, availabilityNote: e.target.value })}
            onBlur={() => save({ availabilityNote: profile.availabilityNote ?? '' })}
            placeholder="p.ej. Respondo en 24h"
            className="w-full px-3 py-2 text-sm rounded-lg bg-gray-950 border border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>
      </section>

      {error && <div className="text-sm text-red-400">{error}</div>}
      {savedAt && Date.now() - savedAt < 2500 && (
        <div className="inline-flex items-center gap-2 text-sm text-emerald-400">
          <Check className="w-4 h-4" />
          Guardado
        </div>
      )}
    </div>
  );
}
