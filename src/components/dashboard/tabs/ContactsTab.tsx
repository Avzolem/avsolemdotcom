'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Download, Mail, Phone, Building2, Loader2 } from 'lucide-react';

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
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
        <div className="rounded-xl border border-gray-800 bg-gray-900/40 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-800/60 text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Nombre</th>
                <th className="px-4 py-3 text-left font-medium">Correo</th>
                <th className="px-4 py-3 text-left font-medium">Empresa</th>
                <th className="px-4 py-3 text-left font-medium">Celular</th>
                <th className="px-4 py-3 text-left font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c._id || `${c.email}-${c.createdAt}`}
                  className="border-t border-gray-800 hover:bg-gray-900/80"
                >
                  <td className="px-4 py-3 font-medium text-white">{c.name}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`mailto:${c.email}`}
                      className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {c.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {c.company ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-gray-500" />
                        {c.company}
                      </span>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {c.phone ? (
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
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                    {new Date(c.createdAt).toLocaleString('es-MX', {
                      timeZone: 'America/Chihuahua',
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
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
