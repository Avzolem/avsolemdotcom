'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Mail,
  FileText,
  FolderKanban,
  Music,
  User,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useDashboardAuth } from '@/contexts/DashboardAuthContext';
import { OverviewTab } from './tabs/OverviewTab';
import { ContactsTab } from './tabs/ContactsTab';
import { CampaignsTab } from './tabs/CampaignsTab';
import { ContentTab } from './tabs/ContentTab';
import { SoundtrackTab } from './tabs/SoundtrackTab';
import { ProfileTab } from './tabs/ProfileTab';

type TabKey =
  | 'overview'
  | 'contacts'
  | 'campaigns'
  | 'blog'
  | 'projects'
  | 'soundtrack'
  | 'profile';

const TABS: Array<{ key: TabKey; label: string; icon: React.ComponentType<{ className?: string }>; status?: string }> = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'contacts', label: 'Contactos', icon: Users },
  { key: 'campaigns', label: 'Campañas', icon: Mail },
  { key: 'blog', label: 'Blog', icon: FileText },
  { key: 'projects', label: 'Proyectos', icon: FolderKanban },
  { key: 'soundtrack', label: 'Soundtrack', icon: Music },
  { key: 'profile', label: 'Perfil', icon: User },
];

export function DashboardShell() {
  const { logout } = useDashboardAuth();
  const [active, setActive] = useState<TabKey>('overview');

  const current = TABS.find((t) => t.key === active);

  return (
    <div className="dashboard-layout min-h-screen bg-gray-950 text-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-gray-800 bg-gray-900/60 flex flex-col">
        <div className="px-5 pt-6 pb-4 border-b border-gray-800">
          <Image
            src="/images/logo/avsolem-light.webp"
            alt="avsolem."
            width={385}
            height={68}
            className="h-6 w-auto"
            priority
          />
          <div className="text-[0.65rem] uppercase tracking-widest text-gray-500 mt-2">
            Dashboard
          </div>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-cyan-900/40 text-cyan-300'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </span>
                {tab.status && (
                  <span className="text-[0.6rem] px-1.5 py-0.5 rounded bg-gray-800 text-gray-500 font-mono">
                    {tab.status}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-800 flex flex-col gap-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Ver sitio
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-900/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="dashboard-main flex-1 overflow-x-hidden bg-gray-950">
        <header className="px-8 py-5 border-b border-gray-800 bg-gray-900/40">
          <div className="flex items-center gap-2">
            {current?.icon && <current.icon className="w-5 h-5 text-cyan-400" />}
            <h1 className="text-xl font-semibold">{current?.label}</h1>
          </div>
        </header>

        <div className="p-8">
          {active === 'overview' && <OverviewTab />}
          {active === 'contacts' && <ContactsTab />}
          {active === 'campaigns' && <CampaignsTab />}
          {active === 'blog' && <ContentTab kind="blog" />}
          {active === 'projects' && <ContentTab kind="project" />}
          {active === 'soundtrack' && <SoundtrackTab />}
          {active === 'profile' && <ProfileTab />}
        </div>
      </main>
    </div>
  );
}
