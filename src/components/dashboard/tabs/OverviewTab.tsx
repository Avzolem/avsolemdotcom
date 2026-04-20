'use client';

import { useEffect, useState } from 'react';
import { Users, FileText, FolderKanban, Mail } from 'lucide-react';

interface Overview {
  contacts: number;
  contactsToday: number;
  posts: number;
  projects: number;
}

export function OverviewTab() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/dashboard/contacts');
        if (res.ok) {
          const body = await res.json();
          const contacts = Array.isArray(body.contacts) ? body.contacts : [];
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);
          const contactsToday = contacts.filter(
            (c: { createdAt: string }) =>
              new Date(c.createdAt).getTime() >= todayStart.getTime()
          ).length;
          // Projects + posts counts are already static metadata — fetch from /api/dashboard/overview later;
          // for now pull via a lightweight endpoint. Placeholder: pass through contacts only.
          setData({ contacts: contacts.length, contactsToday, posts: 0, projects: 0 });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="text-sm text-gray-500">Cargando…</div>;
  }
  if (!data) {
    return <div className="text-sm text-red-400">Error cargando overview.</div>;
  }

  const tiles = [
    { label: 'Contactos', value: data.contacts, icon: Users, hint: `${data.contactsToday} hoy` },
    { label: 'Campañas', value: '—', icon: Mail, hint: 'P4b' },
    { label: 'Posts', value: '—', icon: FileText, hint: 'P4c' },
    { label: 'Proyectos', value: '—', icon: FolderKanban, hint: 'P4c' },
  ];

  return (
    <div className="max-w-4xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
    </div>
  );
}
