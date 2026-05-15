'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Mail,
  FileText,
  FolderKanban,
  Music,
  Video,
  User,
  LogOut,
  ExternalLink,
  Wrench,
  KeyRound,
  BookOpen,
  Menu,
  X,
} from 'lucide-react';
import { useDashboardAuth } from '@/contexts/DashboardAuthContext';
import { OverviewTab } from './tabs/OverviewTab';
import { ContactsTab } from './tabs/ContactsTab';
import { CampaignsTab } from './tabs/CampaignsTab';
import { ContentTab } from './tabs/ContentTab';
import { SoundtrackTab } from './tabs/SoundtrackTab';
import { ProfileTab } from './tabs/ProfileTab';
import { VideosTab } from './tabs/VideosTab';
import { ToolboxTab } from './tabs/ToolboxTab';
import { EnvVarsTab } from './tabs/EnvVarsTab';
import { NoteTab } from './tabs/NoteTab';

type TabKey =
  | 'overview'
  | 'contacts'
  | 'campaigns'
  | 'blog'
  | 'projects'
  | 'soundtrack'
  | 'videos'
  | 'toolbox'
  | 'env'
  | 'note'
  | 'profile';

const TABS: Array<{ key: TabKey; label: string; icon: React.ComponentType<{ className?: string }>; status?: string }> = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'contacts', label: 'Contactos', icon: Users },
  { key: 'campaigns', label: 'Campañas', icon: Mail },
  { key: 'blog', label: 'Blog', icon: FileText },
  { key: 'projects', label: 'Proyectos', icon: FolderKanban },
  { key: 'soundtrack', label: 'Soundtrack', icon: Music },
  { key: 'videos', label: 'Videos', icon: Video },
  { key: 'toolbox', label: 'Toolbox', icon: Wrench },
  { key: 'env', label: 'Env Vars', icon: KeyRound },
  { key: 'note', label: 'Notas', icon: BookOpen },
  { key: 'profile', label: 'Perfil', icon: User },
];

export function DashboardShell() {
  const { logout } = useDashboardAuth();
  const [active, setActive] = useState<TabKey>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [desktopNavOpen, setDesktopNavOpen] = useState(true);

  const current = TABS.find((t) => t.key === active);

  useEffect(() => {
    const saved = localStorage.getItem('dashboard-nav-open');
    if (saved !== null) setDesktopNavOpen(saved === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('dashboard-nav-open', String(desktopNavOpen));
  }, [desktopNavOpen]);

  function selectTab(key: TabKey) {
    setActive(key);
    setMobileNavOpen(false);
  }

  function toggleNav() {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setDesktopNavOpen((v) => !v);
    } else {
      setMobileNavOpen((v) => !v);
    }
  }

  function closeSidebar() {
    setMobileNavOpen(false);
    setDesktopNavOpen(false);
  }

  return (
    <div className="dashboard-layout min-h-screen bg-gray-950 text-gray-100">
      {/* Backdrop (mobile only when drawer open) */}
      {mobileNavOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar — drawer on mobile, fixed on md+ */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-60 shrink-0
          border-r border-gray-800 bg-gray-900/95 md:bg-gray-900/60
          flex flex-col transform transition-transform duration-200 ease-out
          ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}
          ${desktopNavOpen ? 'md:translate-x-0' : 'md:-translate-x-full'}
        `}
      >
        <div className="px-5 pt-6 pb-4 border-b border-gray-800 flex items-center justify-between">
          <div>
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
          <button
            onClick={closeSidebar}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-gray-100"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => selectTab(tab.key)}
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
      <main
        className={`dashboard-main min-w-0 overflow-x-hidden bg-gray-950 transition-[margin] duration-200 ease-out ${
          desktopNavOpen ? 'md:ml-60' : 'md:ml-0'
        }`}
      >
        <header className="px-4 md:px-8 py-4 md:py-5 border-b border-gray-800 bg-gray-900/40 flex items-center gap-3">
          <button
            onClick={toggleNav}
            className={`p-1.5 -ml-1 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-gray-100 ${
              desktopNavOpen ? 'md:hidden' : ''
            }`}
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            {current?.icon && <current.icon className="w-5 h-5 text-cyan-400 shrink-0" />}
            <h1 className="text-lg md:text-xl font-semibold truncate">{current?.label}</h1>
          </div>
        </header>

        <div className="p-4 md:p-8">
          {active === 'overview' && <OverviewTab />}
          {active === 'contacts' && <ContactsTab />}
          {active === 'campaigns' && <CampaignsTab />}
          {active === 'blog' && <ContentTab kind="blog" />}
          {active === 'projects' && <ContentTab kind="project" />}
          {active === 'soundtrack' && <SoundtrackTab />}
          {active === 'videos' && <VideosTab />}
          {active === 'toolbox' && <ToolboxTab />}
          {active === 'env' && <EnvVarsTab />}
          {active === 'note' && <NoteTab />}
          {active === 'profile' && <ProfileTab />}
        </div>
      </main>
    </div>
  );
}
