'use client';

import Link from 'next/link';
import { Cloud, LogOut, Upload, FolderOpen } from 'lucide-react';
import { useCloudAuth } from '@/contexts/CloudAuthContext';

interface CloudHeaderProps {
  onUploadClick?: () => void;
}

export default function CloudHeader({ onUploadClick }: CloudHeaderProps) {
  const { isAuthenticated, logout } = useCloudAuth();

  return (
    <header className="cloud-header">
      <Link href="/cloud" className="cloud-header__logo">
        <Cloud size={28} />
        <span>Cloud</span>
      </Link>

      <nav className="cloud-header__nav">
        {isAuthenticated && (
          <>
            <Link href="/cloud" className="cloud-btn cloud-btn--ghost">
              <FolderOpen size={18} />
              <span className="cloud-hide-mobile">Archivos</span>
            </Link>

            {onUploadClick && (
              <button onClick={onUploadClick} className="cloud-btn cloud-btn--primary">
                <Upload size={18} />
                <span className="cloud-hide-mobile">Subir</span>
              </button>
            )}

            <button
              onClick={logout}
              className="cloud-btn cloud-btn--ghost"
              title="Cerrar sesion"
            >
              <LogOut size={18} />
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
