'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Plus, Trash2, Loader2, Check, ExternalLink, FileText, FolderKanban } from 'lucide-react';
import Link from 'next/link';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface Item {
  slug: string;
  frontmatter: Record<string, unknown>;
  body: string;
  updatedAt: string;
}

interface ContentTabProps {
  kind: 'blog' | 'project';
}

const BLANK_FRONTMATTER_PROJECT: Record<string, unknown> = {
  title: '',
  title_es: '',
  publishedAt: new Date().toISOString().split('T')[0],
  summary: '',
  summary_es: '',
  images: [],
  team: [
    {
      name: 'Andrés Aguilar',
      role: 'Full Stack Developer',
      avatar: '/images/andres.jpeg',
      linkedIn: 'https://www.linkedin.com/in/avsolem/',
    },
  ],
  category: 'Web App',
  tags: [],
  link: '',
};

const BLANK_FRONTMATTER_BLOG: Record<string, unknown> = {
  title: '',
  publishedAt: new Date().toISOString().split('T')[0],
  summary: '',
  image: '',
  tags: [],
};

export function ContentTab({ kind }: ContentTabProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editing, setEditing] = useState<Item | null>(null);
  const [slug, setSlug] = useState('');
  const [fmJson, setFmJson] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/content?kind=${kind}`);
      if (res.ok) {
        const b = await res.json();
        setItems(b.items || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [kind]);

  function startNew() {
    const blank = kind === 'blog' ? BLANK_FRONTMATTER_BLOG : BLANK_FRONTMATTER_PROJECT;
    setEditing({ slug: '', frontmatter: blank, body: '', updatedAt: '' });
    setSlug('');
    setFmJson(JSON.stringify(blank, null, 2));
    setBody(kind === 'blog'
      ? '# Nuevo post\n\nEscribe tu contenido aquí…'
      : '## Overview\n\nBreve descripción del proyecto.\n\n## Features\n\n- Punto 1\n- Punto 2\n\n## Stack\n\n- React\n- Next.js');
  }

  function startEdit(item: Item) {
    setEditing(item);
    setSlug(item.slug);
    setFmJson(JSON.stringify(item.frontmatter, null, 2));
    setBody(item.body);
  }

  async function handleSave() {
    setSaving(true); setError('');
    try {
      let frontmatter: Record<string, unknown>;
      try {
        frontmatter = JSON.parse(fmJson);
      } catch {
        throw new Error('Frontmatter JSON inválido');
      }
      const res = await fetch(`/api/dashboard/content?kind=${kind}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, frontmatter, body }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error || 'Error al guardar');
      }
      setEditing(null);
      load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(s: string) {
    if (!confirm(`¿Eliminar "${s}"? El archivo .mdx se borra del filesystem.`)) return;
    await fetch(`/api/dashboard/content?kind=${kind}&slug=${encodeURIComponent(s)}`, { method: 'DELETE' });
    load();
  }

  if (editing) {
    const Icon = kind === 'blog' ? FileText : FolderKanban;
    return (
      <div className="max-w-5xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg font-semibold">
              {editing.slug ? `Editando ${editing.slug}` : 'Nuevo'}
            </h2>
          </div>
          <button
            onClick={() => setEditing(null)}
            className="text-sm text-gray-400 hover:text-white"
          >
            Cancelar
          </button>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
            Slug (URL)
          </label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase())}
            disabled={!!editing.slug}
            placeholder="mi-proyecto-nuevo"
            className="w-full px-3 py-2 text-sm rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white placeholder:text-gray-500 disabled:opacity-60"
          />
          {editing.slug && (
            <div className="text-xs text-gray-500 mt-1">El slug no se puede cambiar al editar.</div>
          )}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
            Frontmatter (JSON)
          </label>
          <textarea
            value={fmJson}
            onChange={(e) => setFmJson(e.target.value)}
            rows={12}
            className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-gray-950 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-gray-300"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
            Cuerpo (markdown)
          </label>
          <div data-color-mode="dark">
            <MDEditor value={body} onChange={(v) => setBody(v || '')} height={500} />
          </div>
        </div>

        {error && <div className="text-sm text-red-400">{error}</div>}

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving || !slug.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-sm font-medium"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Guardar
          </button>
          <div className="text-xs text-gray-500">
            Escribe al filesystem. Funciona local; en Vercel hay que commit a git.
          </div>
        </div>
      </div>
    );
  }

  const basePath = kind === 'blog' ? '/blog' : '/work';

  return (
    <div className="max-w-5xl flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Nuevo
        </button>
        <div className="text-xs text-gray-500 font-mono">{items.length} total</div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Cargando…
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/30 p-10 text-center text-gray-500 text-sm">
          Sin {kind === 'blog' ? 'posts' : 'proyectos'} aún.
        </div>
      ) : (
        <div className="rounded-xl border border-gray-800 bg-gray-900/40 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-800/60 text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Título</th>
                <th className="px-4 py-3 text-left font-medium">Slug</th>
                <th className="px-4 py-3 text-left font-medium">Publicado</th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.slug} className="border-t border-gray-800 hover:bg-gray-900/80">
                  <td className="px-4 py-3 font-medium text-white">
                    {String(it.frontmatter.title || '—')}
                  </td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{it.slug}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                    {String(it.frontmatter.publishedAt || '—')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Link
                        href={`${basePath}/${it.slug}`}
                        target="_blank"
                        className="p-1.5 rounded text-gray-500 hover:bg-gray-800 hover:text-cyan-400"
                        aria-label="Ver"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => startEdit(it)}
                        className="px-2.5 py-1 rounded text-xs font-medium text-cyan-400 hover:bg-cyan-900/30"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(it.slug)}
                        className="p-1.5 rounded text-gray-500 hover:bg-red-900/30 hover:text-red-400"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
