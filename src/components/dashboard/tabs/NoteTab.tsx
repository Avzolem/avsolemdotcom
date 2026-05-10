'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ChevronLeft, Eye, EyeOff, Lock, LockOpen, Plus, Save, Trash2, ExternalLink } from 'lucide-react';
import type { Block } from '@blocknote/core';

const NoteEditor = dynamic(
  () => import('../note/NoteEditor').then((m) => m.NoteEditor),
  { ssr: false, loading: () => <EditorSkeleton /> }
);

interface NotePageItem {
  _id?: string;
  slug: string;
  title: string;
  blocks: unknown[];
  enabled: boolean;
  order: number;
  passwordHash?: string | null;
  updatedAt: string;
}

function EditorSkeleton() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gray-700 border-t-cyan-400 rounded-full animate-spin" />
    </div>
  );
}

export function NoteTab() {
  const [pages, setPages] = useState<NotePageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<NotePageItem | null>(null);
  const [creating, setCreating] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/n', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setPages(data.items || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  async function handleToggleEnabled(page: NotePageItem) {
    setPages((prev) =>
      prev.map((p) => (p.slug === page.slug ? { ...p, enabled: !p.enabled } : p))
    );
    const res = await fetch(`/api/dashboard/n/${page.slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !page.enabled }),
    });
    if (!res.ok) {
      reload();
    }
  }

  async function handleDelete(page: NotePageItem) {
    if (!confirm(`¿Borrar la página "${page.title}"? Esta acción no se puede deshacer.`)) return;
    const res = await fetch(`/api/dashboard/n/${page.slug}`, { method: 'DELETE' });
    if (res.ok) {
      reload();
    } else {
      alert('Error al borrar');
    }
  }

  if (editing) {
    return (
      <NoteEditView
        page={editing}
        onClose={() => {
          setEditing(null);
          reload();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-100">Pagina de Notas</h2>
          <p className="text-sm text-gray-500">
            Editor estilo Notion. Las páginas habilitadas aparecen en{' '}
            <code className="text-cyan-400">/n</code> con contraseña.
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva página
        </button>
      </div>

      {creating && (
        <CreatePageForm
          onCancel={() => setCreating(false)}
          onCreated={(page) => {
            setCreating(false);
            reload();
            setEditing(page);
          }}
        />
      )}

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="w-6 h-6 border-2 border-gray-700 border-t-cyan-400 rounded-full animate-spin" />
        </div>
      ) : pages.length === 0 ? (
        <div className="py-16 text-center text-gray-500">
          Aún no tienes páginas. Crea la primera con el botón de arriba.
        </div>
      ) : (
        <div className="border border-gray-800 rounded-lg divide-y divide-gray-800 overflow-hidden">
          {pages.map((page) => (
            <div
              key={page.slug}
              className="flex items-center justify-between gap-4 p-4 hover:bg-gray-900/50 transition-colors"
            >
              <button
                onClick={() => setEditing(page)}
                className="flex-1 text-left flex flex-col gap-0.5"
              >
                <span className="text-gray-100 font-medium flex items-center gap-2">
                  {page.title}
                  {page.passwordHash && (
                    <Lock className="w-3 h-3 text-amber-400" />
                  )}
                </span>
                <span className="text-xs text-gray-500 font-mono">/n/{page.slug}</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleEnabled(page)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    page.enabled
                      ? 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-900/60'
                      : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
                  }`}
                  title={page.enabled ? 'Publicada — click para ocultar' : 'Oculta — click para publicar'}
                >
                  {page.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  {page.enabled ? 'Publicada' : 'Oculta'}
                </button>
                {page.enabled && (
                  <a
                    href={`/n/${page.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded text-gray-500 hover:text-cyan-400 hover:bg-gray-800 transition-colors"
                    title="Abrir página"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => handleDelete(page)}
                  className="p-1.5 rounded text-gray-500 hover:text-red-400 hover:bg-gray-800 transition-colors"
                  title="Borrar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CreatePageForm({
  onCancel,
  onCreated,
}: {
  onCancel: () => void;
  onCreated: (page: NotePageItem) => void;
}) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function autoSlug(value: string) {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const finalSlug = slug || autoSlug(title);
    const res = await fetch('/api/dashboard/n', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), slug: finalSlug }),
    });
    setSubmitting(false);
    if (res.ok) {
      const data = await res.json();
      onCreated(data.page);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data?.error || 'Error al crear');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 border border-gray-800 rounded-lg p-5 flex flex-col gap-4"
    >
      <div>
        <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
          Título
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slug) setSlug(autoSlug(e.target.value));
          }}
          autoFocus
          required
          className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:border-cyan-600"
        />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
          Slug (URL)
        </label>
        <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded px-3 py-2">
          <span className="text-gray-500 text-sm">/n/</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(autoSlug(e.target.value))}
            required
            className="flex-1 bg-transparent text-gray-100 focus:outline-none font-mono text-sm"
          />
        </div>
      </div>
      {error && <div className="text-sm text-red-400">{error}</div>}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-sm font-medium transition-colors"
        >
          {submitting ? 'Creando…' : 'Crear y editar'}
        </button>
      </div>
    </form>
  );
}

function NoteEditView({ page, onClose }: { page: NotePageItem; onClose: () => void }) {
  const [title, setTitle] = useState(page.title);
  const [blocks, setBlocks] = useState<unknown[]>(page.blocks || []);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasPassword, setHasPassword] = useState<boolean>(!!page.passwordHash);
  const [showPasswordPanel, setShowPasswordPanel] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [pwBusy, setPwBusy] = useState(false);
  const [pwMsg, setPwMsg] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/dashboard/n/${page.slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), blocks }),
    });
    setSaving(false);
    if (res.ok) {
      setSavedAt(new Date());
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data?.error || 'Error al guardar');
    }
  }

  async function handleSetPassword() {
    if (!pwInput.trim()) return;
    setPwBusy(true);
    setPwMsg(null);
    const res = await fetch(`/api/dashboard/n/${page.slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwInput }),
    });
    setPwBusy(false);
    if (res.ok) {
      setHasPassword(true);
      setPwInput('');
      setPwMsg('Contraseña guardada');
      setTimeout(() => setPwMsg(null), 2000);
    } else {
      const data = await res.json().catch(() => ({}));
      setPwMsg(data?.error || 'Error');
    }
  }

  async function handleClearPassword() {
    if (!confirm('¿Quitar la contraseña? La nota quedará accesible para cualquiera con el URL.')) return;
    setPwBusy(true);
    setPwMsg(null);
    const res = await fetch(`/api/dashboard/n/${page.slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clearPassword: true }),
    });
    setPwBusy(false);
    if (res.ok) {
      setHasPassword(false);
      setPwMsg('Contraseña eliminada');
      setTimeout(() => setPwMsg(null), 2000);
    } else {
      const data = await res.json().catch(() => ({}));
      setPwMsg(data?.error || 'Error');
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver
        </button>
        <div className="flex items-center gap-3">
          {savedAt && (
            <span className="text-xs text-gray-500">
              Guardado {savedAt.toLocaleTimeString()}
            </span>
          )}
          {error && <span className="text-xs text-red-400">{error}</span>}
          <button
            onClick={() => setShowPasswordPanel((s) => !s)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm transition-colors ${
              hasPassword
                ? 'bg-amber-900/30 text-amber-300 hover:bg-amber-900/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
            }`}
            title={hasPassword ? 'Tiene contraseña' : 'Sin contraseña'}
          >
            {hasPassword ? <Lock className="w-4 h-4" /> : <LockOpen className="w-4 h-4" />}
            {hasPassword ? 'Protegida' : 'Sin password'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-sm font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>

      {showPasswordPanel && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col gap-3">
          <div className="text-sm text-gray-300">
            {hasPassword
              ? 'Esta nota está protegida con contraseña. Puedes cambiarla o quitarla.'
              : 'Esta nota es accesible con solo el URL. Define una contraseña si quieres protegerla.'}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
              placeholder={hasPassword ? 'Nueva contraseña…' : 'Contraseña…'}
              className="flex-1 px-3 py-2 rounded bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:border-cyan-600"
            />
            <button
              onClick={handleSetPassword}
              disabled={pwBusy || !pwInput.trim()}
              className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-sm font-medium transition-colors"
            >
              {hasPassword ? 'Cambiar' : 'Activar'}
            </button>
            {hasPassword && (
              <button
                onClick={handleClearPassword}
                disabled={pwBusy}
                className="px-3 py-2 rounded bg-red-900/40 hover:bg-red-900/60 text-red-300 text-sm font-medium transition-colors"
              >
                Quitar
              </button>
            )}
          </div>
          {pwMsg && <div className="text-xs text-gray-400">{pwMsg}</div>}
        </div>
      )}

      {/* Negative margins cancel the DashboardShell's p-4 md:p-8 wrapper vertically,
          so the article's py-10 sm:py-16 matches the public /n/[slug] rhythm. */}
      <article className="-my-4 md:-my-8 max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 w-full">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Título de la nota"
          className="w-full bg-transparent text-3xl sm:text-4xl font-light text-gray-100 mb-8 sm:mb-10 break-words focus:outline-none"
          placeholder="Título…"
        />
        <div className="bg-gray-900 rounded-lg p-4 sm:p-6">
          <NoteEditor
            initialBlocks={blocks}
            onChange={(b) => setBlocks(b as Block[])}
          />
        </div>
      </article>
    </div>
  );
}
