'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  FileText,
  FolderKanban,
  Mail,
  StickyNote,
  Wrench,
  Inbox,
  AtSign,
  HardDrive,
  Gamepad2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Overview {
  contacts: { total: number; today: number };
  newsletter: { subscribers: number };
  campaigns: { total: number; sent: number; draft: number };
  notes: { total: number; enabled: number; protected: number };
  posts: { total: number };
  projects: { total: number };
  toolbox: { total: number; enabled: number };
  tcgUsers: { total: number; byProvider: Record<string, number> };
  r2: { bytes: number; objects: number; freeBytes: number } | null;
  recentContacts: Array<{ name: string; email: string; createdAt: string }>;
}

interface Tile {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  hint: string;
}

function formatBytesShort(bytes: number): string {
  if (bytes < 1e6) return `${(bytes / 1e3).toFixed(1)} KB`;
  if (bytes < 1e9) return `${(bytes / 1e6).toFixed(1)} MB`;
  return `${(bytes / 1e9).toFixed(1)} GB`;
}

function formatRelative(iso: string): string {
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'ahora';
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `hace ${days} d`;
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

export function OverviewTab() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/dashboard/overview');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setData(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="text-sm text-gray-500">Cargando…</div>;
  }
  if (error || !data) {
    return <div className="text-sm text-red-400">Error cargando overview: {error}</div>;
  }

  const tiles: Tile[] = [
    {
      label: 'Contactos',
      value: data.contacts.total,
      icon: Users,
      hint: data.contacts.today > 0 ? `+${data.contacts.today} hoy` : 'sin nuevos hoy',
    },
    {
      label: 'Suscriptores',
      value: data.newsletter.subscribers,
      icon: AtSign,
      hint: 'newsletter',
    },
    {
      label: 'Campañas',
      value: data.campaigns.total,
      icon: Mail,
      hint:
        data.campaigns.total === 0
          ? 'sin campañas'
          : `${data.campaigns.sent} enviadas · ${data.campaigns.draft} borradores`,
    },
    {
      label: 'Notas',
      value: data.notes.total,
      icon: StickyNote,
      hint:
        data.notes.total === 0
          ? 'sin notas'
          : `${data.notes.enabled} activas · ${data.notes.protected} con contraseña`,
    },
    {
      label: 'Posts',
      value: data.posts.total,
      icon: FileText,
      hint: '/blog',
    },
    {
      label: 'Proyectos',
      value: data.projects.total,
      icon: FolderKanban,
      hint: '/work',
    },
    {
      label: 'Toolbox',
      value: data.toolbox.total,
      icon: Wrench,
      hint:
        data.toolbox.total === 0
          ? 'sin items'
          : `${data.toolbox.enabled} visibles`,
    },
    {
      label: 'TCG Users',
      value: data.tcgUsers.total,
      icon: Gamepad2,
      hint:
        data.tcgUsers.total === 0
          ? 'sin registros'
          : Object.entries(data.tcgUsers.byProvider)
              .map(([p, n]) => `${n} ${p}`)
              .join(' · '),
    },
  ];

  if (data.r2) {
    const usedG = data.r2.bytes / 1e9;
    const limitG = data.r2.freeBytes / 1e9;
    const value = (
      <span className="flex items-baseline gap-1">
        <span>{formatBytesShort(data.r2.bytes)}</span>
        <span className="text-base font-normal text-gray-500">/ {limitG} GB</span>
      </span>
    );
    tiles.push({
      label: 'R2 Storage',
      value,
      icon: HardDrive,
      hint: `${data.r2.objects} objetos · ${((usedG / limitG) * 100).toFixed(1)}% del free tier`,
    });
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <div
              key={t.label}
              className="rounded-xl border border-gray-800 bg-gray-900/40 p-5 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-500">
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </div>
              <div className="text-3xl font-bold text-white">{t.value}</div>
              <div className="text-xs text-gray-500">{t.hint}</div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-500 mb-4">
          <Inbox className="w-3.5 h-3.5" />
          Contactos recientes
        </div>
        {data.recentContacts.length === 0 ? (
          <div className="text-sm text-gray-500">Aún no hay contactos.</div>
        ) : (
          <ul className="divide-y divide-gray-800">
            {data.recentContacts.map((c, i) => (
              <li key={`${c.email}-${i}`} className="py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm text-white truncate">{c.name}</div>
                  <div className="text-xs text-gray-500 truncate">{c.email}</div>
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">
                  {formatRelative(c.createdAt)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
