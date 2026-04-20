'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Plus, Send, Trash2, Loader2, Mail, Check, AlertTriangle, Calendar,
} from 'lucide-react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface Campaign {
  _id: string;
  title: string;
  subject: string;
  body: string;
  status: 'draft' | 'sending' | 'sent' | 'failed';
  createdAt: string;
  sentAt?: string | null;
  recipientsCount?: number;
  successCount?: number;
  failureCount?: number;
}

type Mode = 'list' | 'editor';

export function CampaignsTab() {
  const [mode, setMode] = useState<Mode>('list');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState(`# Hola {name}\n\nTe escribo desde **avsolem.com** porque recientemente lancé...\n\n- Detalle 1\n- Detalle 2\n\n[Échale un ojo](https://avsolem.com)`);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/campaigns');
      if (res.ok) {
        const body = await res.json();
        setCampaigns(body.campaigns || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/dashboard/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, subject, body }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error || 'Error');
      }
      setTitle(''); setSubject('');
      setMode('list');
      load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSend(c: Campaign) {
    if (!confirm(`¿Enviar "${c.title}" a TODOS los contactos? Esto no se puede deshacer.`)) return;
    setSendingId(c._id);
    setError('');
    try {
      const res = await fetch(`/api/dashboard/campaigns/${c._id}/send`, { method: 'POST' });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Error al enviar');
      alert(`Enviados: ${body.success} · Fallidos: ${body.failure}`);
      load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSendingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta campaña?')) return;
    await fetch(`/api/dashboard/campaigns?id=${id}`, { method: 'DELETE' });
    load();
  }

  if (mode === 'editor') {
    return (
      <div className="max-w-4xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Nueva campaña</h2>
          <button
            onClick={() => setMode('list')}
            className="text-sm text-gray-400 hover:text-white"
          >
            Cancelar
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
              Título (interno)
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Lanzamiento Fletpaq"
              className="w-full px-3 py-2 text-sm rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white placeholder:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
              Asunto (se ve en la bandeja)
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Nuevo proyecto en avsolem.com"
              className="w-full px-3 py-2 text-sm rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white placeholder:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
              Cuerpo (markdown) — usa <code className="text-cyan-400">{'{name}'}</code> para el nombre del contacto
            </label>
            <div data-color-mode="dark">
              <MDEditor value={body} onChange={(v) => setBody(v || '')} height={350} />
            </div>
          </div>
          {error && <div className="text-sm text-red-400">{error}</div>}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving || !title.trim() || !subject.trim() || !body.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Guardar borrador
            </button>
            <div className="text-xs text-gray-500">
              Se guarda como draft. La envías desde la lista.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMode('editor')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Nueva campaña
        </button>
        <div className="text-xs text-gray-500 font-mono">
          {campaigns.length} total
        </div>
      </div>
      {error && <div className="text-sm text-red-400">{error}</div>}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Cargando…
        </div>
      ) : campaigns.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/30 p-10 text-center text-gray-500 text-sm">
          Sin campañas aún. Crea la primera.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {campaigns.map((c) => {
            const isSending = sendingId === c._id;
            return (
              <div
                key={c._id}
                className="rounded-xl border border-gray-800 bg-gray-900/40 p-5 flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white truncate">{c.title}</h3>
                    <StatusBadge status={c.status} />
                  </div>
                  <div className="text-sm text-gray-400 truncate">{c.subject}</div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(c.createdAt).toLocaleDateString('es-MX')}
                    </span>
                    {c.sentAt && (
                      <>
                        <span className="inline-flex items-center gap-1 text-emerald-500">
                          <Check className="w-3 h-3" />
                          {c.successCount ?? 0} enviados
                        </span>
                        {(c.failureCount ?? 0) > 0 && (
                          <span className="inline-flex items-center gap-1 text-amber-500">
                            <AlertTriangle className="w-3 h-3" />
                            {c.failureCount} fallidos
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {c.status !== 'sent' && (
                    <button
                      onClick={() => handleSend(c)}
                      disabled={isSending}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-medium"
                    >
                      {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      Enviar
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-red-900/30 hover:text-red-400"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Campaign['status'] }) {
  const map: Record<Campaign['status'], { label: string; cls: string; Icon: typeof Check }> = {
    draft: { label: 'Borrador', cls: 'bg-gray-800 text-gray-400', Icon: Mail },
    sending: { label: 'Enviando', cls: 'bg-amber-900/40 text-amber-300', Icon: Loader2 },
    sent: { label: 'Enviada', cls: 'bg-emerald-900/40 text-emerald-300', Icon: Check },
    failed: { label: 'Fallida', cls: 'bg-red-900/40 text-red-300', Icon: AlertTriangle },
  };
  const m = map[status];
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.65rem] font-mono ${m.cls}`}>
      <m.Icon className={`w-3 h-3 ${status === 'sending' ? 'animate-spin' : ''}`} />
      {m.label}
    </span>
  );
}
