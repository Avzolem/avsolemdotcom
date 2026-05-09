'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Download,
  Mail,
  Phone,
  Building2,
  Loader2,
  Pencil,
  Trash2,
  Check,
  X,
} from 'lucide-react';

interface Contact {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  createdAt: string;
}

function toCSV(contacts: Contact[]): string {
  const headers = ['name', 'email', 'phone', 'company', 'createdAt'];
  const escape = (s: string) => `"${(s ?? '').replace(/"/g, '""')}"`;
  const rows = contacts.map((c) =>
    [c.name, c.email, c.phone || '', c.company || '', c.createdAt]
      .map(escape)
      .join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}

export function ContactsTab() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Contact | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/dashboard/contacts');
        if (!res.ok) {
          throw new Error('No se pudo cargar');
        }
        const body = await res.json();
        setContacts(Array.isArray(body.contacts) ? body.contacts : []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter((c) =>
      [c.name, c.email, c.company, c.phone]
        .filter(Boolean)
        .some((f) => (f as string).toLowerCase().includes(q))
    );
  }, [contacts, query]);

  function downloadCSV() {
    const csv = toCSV(filtered);
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function startEdit(c: Contact) {
    setEditingId(c._id ?? null);
    setEditDraft({ ...c });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft(null);
  }

  async function saveEdit() {
    if (!editDraft || !editingId) return;
    setSavingId(editingId);
    try {
      const res = await fetch(`/api/dashboard/contacts/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editDraft.name,
          email: editDraft.email,
          phone: editDraft.phone || '',
          company: editDraft.company || '',
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Error al guardar');
      }
      setContacts((prev) =>
        prev.map((c) => (c._id === editingId ? { ...c, ...editDraft } : c))
      );
      cancelEdit();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSavingId(null);
    }
  }

  async function removeContact(id: string) {
    if (!confirm('¿Eliminar este contacto? Esta acción no se puede deshacer.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/dashboard/contacts/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Error al eliminar');
      }
      setContacts((prev) => prev.filter((c) => c._id !== id));
      if (editingId === id) cancelEdit();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Loader2 className="w-4 h-4 animate-spin" />
        Cargando contactos…
      </div>
    );
  }
  if (error) {
    return <div className="text-sm text-red-400">{error}</div>;
  }

  const inputClass =
    'w-full px-2 py-1 text-sm rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white placeholder:text-gray-600';

  return (
    <div className="max-w-5xl flex flex-col gap-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, correo, empresa…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white placeholder:text-gray-500"
          />
        </div>
        <div className="text-xs text-gray-500 font-mono">
          {filtered.length} / {contacts.length}
        </div>
        <button
          onClick={downloadCSV}
          disabled={filtered.length === 0}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors ml-auto"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/30 p-10 text-center text-gray-500 text-sm">
          {contacts.length === 0
            ? 'Sin contactos aún. Cuando alguien llene el formulario del home, aparecerá aquí.'
            : 'Ningún contacto coincide con la búsqueda.'}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-800 bg-gray-900/40 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-gray-800/60 text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-4 py-3 text-left font-medium w-[22%]">Nombre</th>
                <th className="px-4 py-3 text-left font-medium">Correo</th>
                <th className="px-4 py-3 text-left font-medium">Empresa</th>
                <th className="px-4 py-3 text-left font-medium">Celular</th>
                <th className="px-4 py-3 text-left font-medium w-[110px] whitespace-nowrap">Fecha</th>
                <th className="px-4 py-3 text-right font-medium w-24">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const isEditing = editingId === c._id;
                const isSaving = savingId === c._id;
                const isDeleting = deletingId === c._id;
                return (
                  <tr
                    key={c._id || `${c.email}-${c.createdAt}`}
                    className="border-t border-gray-800 hover:bg-gray-900/80"
                  >
                    <td className="px-4 py-3 font-medium text-white">
                      {isEditing && editDraft ? (
                        <input
                          className={inputClass}
                          value={editDraft.name}
                          onChange={(e) =>
                            setEditDraft({ ...editDraft, name: e.target.value })
                          }
                        />
                      ) : (
                        c.name
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing && editDraft ? (
                        <input
                          type="email"
                          className={inputClass}
                          value={editDraft.email}
                          onChange={(e) =>
                            setEditDraft({ ...editDraft, email: e.target.value })
                          }
                        />
                      ) : (
                        <a
                          href={`mailto:${c.email}`}
                          className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          {c.email}
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {isEditing && editDraft ? (
                        <input
                          className={inputClass}
                          placeholder="—"
                          value={editDraft.company || ''}
                          onChange={(e) =>
                            setEditDraft({ ...editDraft, company: e.target.value })
                          }
                        />
                      ) : c.company ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-gray-500" />
                          {c.company}
                        </span>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {isEditing && editDraft ? (
                        <input
                          className={inputClass}
                          placeholder="—"
                          value={editDraft.phone || ''}
                          onChange={(e) =>
                            setEditDraft({ ...editDraft, phone: e.target.value })
                          }
                        />
                      ) : c.phone ? (
                        <a
                          href={`tel:${c.phone}`}
                          className="inline-flex items-center gap-1.5 hover:text-cyan-300"
                        >
                          <Phone className="w-3.5 h-3.5 text-gray-500" />
                          {c.phone}
                        </a>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleString('es-MX', {
                        timeZone: 'America/Chihuahua',
                        year: '2-digit',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        {isEditing ? (
                          <>
                            <button
                              onClick={saveEdit}
                              disabled={isSaving}
                              title="Guardar"
                              className="p-1.5 rounded hover:bg-cyan-500/20 text-cyan-400 disabled:opacity-50"
                            >
                              {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={cancelEdit}
                              disabled={isSaving}
                              title="Cancelar"
                              className="p-1.5 rounded hover:bg-gray-700 text-gray-400 disabled:opacity-50"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(c)}
                              disabled={!c._id}
                              title="Editar"
                              className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white disabled:opacity-30"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => c._id && removeContact(c._id)}
                              disabled={!c._id || isDeleting}
                              title="Eliminar"
                              className="p-1.5 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 disabled:opacity-30"
                            >
                              {isDeleting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
