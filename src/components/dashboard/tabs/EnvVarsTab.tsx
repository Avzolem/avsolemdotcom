'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Eye,
  EyeOff,
  Copy,
  Check,
  Pencil,
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight,
  X,
} from 'lucide-react';

interface EnvItem {
  _id: string;
  project: string;
  source: string;
  name: string;
  value: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const SOURCE_OPTIONS = ['.env', '.env.local', '.env.production', '.env.development'];

export function EnvVarsTab() {
  const [items, setItems] = useState<EnvItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<EnvItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);

  async function load(opts: { silent?: boolean } = {}) {
    if (!opts.silent) setLoading(true);
    try {
      const res = await fetch('/api/dashboard/env');
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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.project.toLowerCase().includes(q) ||
        i.value.toLowerCase().includes(q) ||
        (i.description || '').toLowerCase().includes(q)
    );
  }, [items, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, EnvItem[]>();
    for (const i of filtered) {
      const arr = map.get(i.project) || [];
      arr.push(i);
      map.set(i.project, arr);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  function toggleReveal(id: string) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function copyValue(item: EnvItem) {
    try {
      await navigator.clipboard.writeText(item.value);
      setCopied(item._id);
      setTimeout(() => setCopied((c) => (c === item._id ? null : c)), 1500);
    } catch {
      // no-op
    }
  }

  function toggleCollapse(project: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(project)) next.delete(project);
      else next.add(project);
      return next;
    });
  }

  async function handleDelete(item: EnvItem) {
    if (!confirm(`Borrar ${item.name} de ${item.project}?`)) return;
    setBusy(true);
    try {
      await fetch(`/api/dashboard/env/${item._id}`, { method: 'DELETE' });
      await load({ silent: true });
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmit(form: {
    project: string;
    source: string;
    name: string;
    value: string;
    description: string;
  }) {
    setBusy(true);
    try {
      if (editing) {
        const res = await fetch(`/api/dashboard/env/${editing._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          const b = await res.json().catch(() => ({}));
          alert(b.error || 'Error al guardar');
          return;
        }
      } else {
        const res = await fetch('/api/dashboard/env', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          const b = await res.json().catch(() => ({}));
          alert(b.error || 'Error al crear');
          return;
        }
      }
      setEditing(null);
      setCreating(false);
      await load({ silent: true });
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <div className="text-gray-400">Cargando...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, proyecto, valor..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
        <div className="text-xs text-gray-500">
          {filtered.length} de {items.length}
        </div>
        <button
          onClick={() => {
            setCreating(true);
            setEditing(null);
          }}
          className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Nueva variable
        </button>
      </div>

      {grouped.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-sm">
          {items.length === 0
            ? 'Sin variables todavía. Corré el seed o creá una nueva.'
            : 'Sin resultados para esa búsqueda.'}
        </div>
      ) : (
        <div className="space-y-3">
          {grouped.map(([project, vars]) => {
            const isCollapsed = collapsed.has(project);
            return (
              <div key={project} className="rounded-lg border border-gray-800 bg-gray-900/40">
                <button
                  onClick={() => toggleCollapse(project)}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-800/40 transition-colors"
                >
                  {isCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="font-mono text-sm text-cyan-300">{project}</span>
                  <span className="text-xs text-gray-500">
                    {vars.length} variable{vars.length !== 1 ? 's' : ''}
                  </span>
                </button>
                {!isCollapsed && (
                  <div className="border-t border-gray-800 divide-y divide-gray-800/60">
                    {vars.map((v) => {
                      const isRevealed = revealed.has(v._id);
                      return (
                        <div
                          key={v._id}
                          className="px-4 py-3 hover:bg-gray-800/30 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-sm text-white truncate">
                                  {v.name}
                                </span>
                                <span className="text-[0.6rem] uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 font-mono">
                                  {v.source}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <code className="flex-1 text-xs text-gray-300 font-mono bg-gray-950/60 px-2 py-1 rounded break-all">
                                  {isRevealed ? v.value : '•'.repeat(Math.min(v.value.length, 32))}
                                </code>
                              </div>
                              {v.description && (
                                <div className="text-xs text-gray-500 mt-1">{v.description}</div>
                              )}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => toggleReveal(v._id)}
                                className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
                                title={isRevealed ? 'Ocultar' : 'Mostrar'}
                              >
                                {isRevealed ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => copyValue(v)}
                                className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
                                title="Copiar"
                              >
                                {copied === v._id ? (
                                  <Check className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  setEditing(v);
                                  setCreating(false);
                                }}
                                className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
                                title="Editar"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(v)}
                                disabled={busy}
                                className="p-1.5 rounded hover:bg-red-900/40 text-gray-400 hover:text-red-300 disabled:opacity-50"
                                title="Borrar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {(creating || editing) && (
        <EnvVarModal
          initial={editing}
          projects={Array.from(new Set(items.map((i) => i.project))).sort()}
          busy={busy}
          onCancel={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

function EnvVarModal({
  initial,
  projects,
  busy,
  onCancel,
  onSubmit,
}: {
  initial: EnvItem | null;
  projects: string[];
  busy: boolean;
  onCancel: () => void;
  onSubmit: (data: {
    project: string;
    source: string;
    name: string;
    value: string;
    description: string;
  }) => Promise<void>;
}) {
  const [project, setProject] = useState(initial?.project || projects[0] || '');
  const [projectMode, setProjectMode] = useState<'pick' | 'new'>('pick');
  const [newProject, setNewProject] = useState('');
  const [source, setSource] = useState(initial?.source || '.env.local');
  const [name, setName] = useState(initial?.name || '');
  const [value, setValue] = useState(initial?.value || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [showValue, setShowValue] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const finalProject = projectMode === 'new' ? newProject.trim() : project;
    if (!finalProject) {
      alert('Proyecto requerido');
      return;
    }
    onSubmit({ project: finalProject, source, name, value, description });
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <form
        onSubmit={handleSave}
        className="w-full max-w-lg rounded-xl bg-gray-900 border border-gray-700 shadow-2xl"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="text-base font-semibold text-white">
            {initial ? 'Editar variable' : 'Nueva variable'}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded hover:bg-gray-800 text-gray-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Proyecto</label>
            <div className="flex gap-2 mb-1">
              <button
                type="button"
                onClick={() => setProjectMode('pick')}
                className={`text-xs px-2 py-1 rounded ${
                  projectMode === 'pick'
                    ? 'bg-cyan-900/40 text-cyan-300'
                    : 'bg-gray-800 text-gray-400'
                }`}
              >
                Existente
              </button>
              <button
                type="button"
                onClick={() => setProjectMode('new')}
                className={`text-xs px-2 py-1 rounded ${
                  projectMode === 'new'
                    ? 'bg-cyan-900/40 text-cyan-300'
                    : 'bg-gray-800 text-gray-400'
                }`}
              >
                Nuevo
              </button>
            </div>
            {projectMode === 'pick' ? (
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white"
              >
                {projects.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
                placeholder="nombre-proyecto"
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white font-mono"
              />
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white"
            >
              {SOURCE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Nombre</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="MONGODB_URI"
              required
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Valor</label>
            <div className="relative">
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={3}
                required
                className={`w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white font-mono pr-10 resize-y ${
                  showValue ? '' : 'text-transparent caret-white'
                }`}
                style={!showValue ? { WebkitTextSecurity: 'disc' } as React.CSSProperties : {}}
              />
              <button
                type="button"
                onClick={() => setShowValue((v) => !v)}
                className="absolute right-2 top-2 p-1 rounded hover:bg-gray-700 text-gray-400"
              >
                {showValue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Descripción (opcional)</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Para qué sirve, dónde se usa..."
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={busy}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium disabled:opacity-50"
          >
            {busy ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
