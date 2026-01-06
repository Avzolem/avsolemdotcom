'use client';

import Link from 'next/link';
import { Cloud, LogOut, Upload, FolderPlus } from 'lucide-react';
import { useCloudAuth } from '@/contexts/CloudAuthContext';
import StorageQuota from './StorageQuota';

interface CloudHeaderProps {
  onUploadClick?: () => void;
  onNewFolderClick?: () => void;
}

export default function CloudHeader({ onUploadClick, onNewFolderClick }: CloudHeaderProps) {
  const { isAuthenticated, logout } = useCloudAuth();

  return (
    <header className="cloud-header">
      <Link href="/cloud" className="cloud-header__logo">
        <Cloud size={24} />
        <span>Cloudsolem</span>
      </Link>

      {isAuthenticated && (
        <div className="cloud-header__storage">
          <StorageQuota />
        </div>
      )}

      <nav className="cloud-header__nav">
        {isAuthenticated && (
          <>
            {onNewFolderClick && (
              <button onClick={onNewFolderClick} className="cloud-btn cloud-btn--secondary">
                <FolderPlus size={18} />
                <span className="cloud-hide-mobile">Nueva Carpeta</span>
              </button>
            )}

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
