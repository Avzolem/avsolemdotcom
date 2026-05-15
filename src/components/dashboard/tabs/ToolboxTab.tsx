'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Trash2,
  Loader2,
  ArrowUp,
  ArrowDown,
  Pencil,
  X,
  ExternalLink,
  Link as LinkIcon,
} from 'lucide-react';
import { ICON_KEYS, getIcon } from '@/lib/icons';

interface ToolboxItem {
  _id: string;
  name: string;
  icon: string;
  href: string;
  isExternal: boolean;
  order: number;
  enabled: boolean;
}

const EMPTY_FORM = { name: '', icon: 'link', href: '', enabled: true };

export function ToolboxTab() {
  const [items, setItems] = useState<ToolboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  async function load(opts: { silent?: boolean } = {}) {
    if (!opts.silent) setLoading(true);
    try {
      const res = await fetch('/api/dashboard/toolbox');
      if (res.ok) {
        const b = await res.json();
        setItems(b.items || []);
      }
    } finally {
      if (!opts.silent) setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowForm(true);
  }

  function openEdit(item: ToolboxItem) {
    setEditingId(item._id);
    setForm({ name: item.name, icon: item.icon, href: item.href, enabled: item.enabled });
    setError('');
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const url = editingId
        ? `/api/dashboard/toolbox/${editingId}`
        : '/api/dashboard/toolbox';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error || 'Error al guardar');
      }
      closeForm();
      await load({ silent: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function toggleEnabled(item: ToolboxItem) {
    const next = !item.enabled;
    setItems((prev) => prev.map((i) => (i._id === item._id ? { ...i, enabled: next } : i)));
    setBusy(true);
    try {
      const res = await fetch(`/api/dashboard/toolbox/${item._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: next }),
      });
      if (!res.ok) {
        setItems((prev) => prev.map((i) => (i._id === item._id ? { ...i, enabled: !next } : i)));
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(item: ToolboxItem) {
    if (!confirm(`¿Eliminar "${item.name}" del toolbox?`)) return;
    setBusy(true);
    try {
      await fetch(`/api/dashboard/toolbox/${item._id}`, { method: 'DELETE' });
      await load({ silent: true });
    } finally {
      setBusy(false);
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    setBusy(true);
    try {
      await fetch('/api/dashboard/toolbox/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: next.map((i) => i._id) }),
      });
    } finally {
      setBusy(false);
    }
  }

  const sortedIconKeys = useMemo(() => ICON_KEYS, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Mini-apps, perfiles y rincones que aparecen en el toolbox del home.
          Cambios se reflejan al refrescar el sitio.
        </p>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-900/40 text-cyan-300 hover:bg-cyan-900/60 text-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Nuevo
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-sm">
          Sin items aún. Da clic en <span className="text-cyan-300">Nuevo</span> para empezar.
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => {
            const Icon = getIcon(item.icon);
            return (
              <li
                key={item._id}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border ${
                  item.enabled
                    ? 'border-gray-800 bg-gray-900/40'
                    : 'border-gray-900 bg-gray-950/60 opacity-60'
                }`}
              >
                <div className="flex flex-col">
                  <button
                    onClick={() => move(index, -1)}
                    disabled={index === 0 || busy}
                    className="p-0.5 text-gray-500 hover:text-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Subir"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1 || busy}
                    className="p-0.5 text-gray-500 hover:text-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Bajar"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Icon className="w-5 h-5 text-gray-300" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-100 truncate">{item.name}</span>
                    <span
                      className={`text-[0.6rem] px-1.5 py-0.5 rounded ${
                        item.isExternal
                          ? 'bg-violet-900/40 text-violet-300'
                          : 'bg-emerald-900/40 text-emerald-300'
                      }`}
                    >
                      {item.isExternal ? 'externo' : 'interno'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 min-w-0">
                    {item.isExternal ? <ExternalLink className="w-3 h-3 shrink-0" /> : <LinkIcon className="w-3 h-3 shrink-0" />}
                    <span className="truncate" title={item.href}>{item.href}</span>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={item.enabled}
                  onClick={() => toggleEnabled(item)}
                  disabled={busy}
                  title={item.enabled ? 'Visible' : 'Oculto'}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 ${
                    item.enabled ? 'bg-cyan-600' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                      item.enabled ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>

                <button
                  onClick={() => openEdit(item)}
                  className="p-1.5 text-gray-400 hover:text-cyan-300 hover:bg-gray-800 rounded transition-colors"
                  title="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(item)}
                  disabled={busy}
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-100">
                {editingId ? 'Editar item' : 'Nuevo item'}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="p-1 text-gray-400 hover:text-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400">Nombre</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-3 py-2 rounded bg-gray-950 border border-gray-800 text-gray-100 text-sm focus:border-cyan-500 outline-none"
                placeholder="GitHub"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-400">Icono</label>
                <span className="text-[0.65rem] text-gray-500">{form.icon}</span>
              </div>
              <div className="grid grid-cols-8 gap-1.5 p-2 rounded bg-gray-950 border border-gray-800 max-h-44 overflow-y-auto">
                {sortedIconKeys.map((key) => {
                  const KeyIcon = getIcon(key);
                  const active = form.icon === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setForm({ ...form, icon: key })}
                      title={key}
                      className={`aspect-square flex items-center justify-center rounded transition-colors ${
                        active
                          ? 'bg-cyan-900/60 text-cyan-300 ring-1 ring-cyan-500/60'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-gray-100'
                      }`}
                    >
                      <KeyIcon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400">URL / ruta</label>
              <input
                type="text"
                value={form.href}
                onChange={(e) => setForm({ ...form, href: e.target.value })}
                required
                className="w-full px-3 py-2 rounded bg-gray-950 border border-gray-800 text-gray-100 text-sm focus:border-cyan-500 outline-none"
                placeholder="/ascii  ó  https://...  ó  mailto:..."
              />
              <p className="text-[0.65rem] text-gray-500">
                Empieza con <code>/</code>, <code>http</code>, <code>mailto:</code> o <code>tel:</code>.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Visible en el home</span>
              <button
                type="button"
                role="switch"
                aria-checked={form.enabled}
                onClick={() => setForm({ ...form, enabled: !form.enabled })}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  form.enabled ? 'bg-cyan-600' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                    form.enabled ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded px-3 py-2">
                {error}
              </div>
            )}

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 rounded text-sm text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={busy}
                className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? 'Guardar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
