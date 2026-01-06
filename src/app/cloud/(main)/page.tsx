'use client';

import { useState, useEffect, useCallback } from 'react';
import { Cloud, Upload, FolderPlus, Play, Download, Trash2, MoreVertical, Pencil } from 'lucide-react';
import CloudHeader from '@/components/cloud/CloudHeader';
import CloudFooter from '@/components/cloud/CloudFooter';
import AuthModal from '@/components/cloud/AuthModal';
import FileUploader from '@/components/cloud/FileUploader';
import StorageQuota from '@/components/cloud/StorageQuota';
import { useCloudAuth } from '@/contexts/CloudAuthContext';

interface CloudFile {
  _id: string;
  name: string;
  size: number;
  cloudinaryResourceType: string;
  cloudinaryFormat: string;
  thumbnailUrl?: string;
  duration?: number;
  createdAt: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function CloudPage() {
  const { isAuthenticated, isLoading } = useCloudAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [files, setFiles] = useState<CloudFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const fetchFiles = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoadingFiles(true);
    try {
      const response = await fetch('/api/cloud/files');
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files || []);
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      setIsLoadingFiles(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFiles();
    }
  }, [isAuthenticated, fetchFiles]);

  const handleUploadComplete = () => {
    fetchFiles();
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm('Estas seguro de eliminar este archivo?')) return;

    try {
      const response = await fetch(`/api/cloud/files/${fileId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setFiles(prev => prev.filter(f => f._id !== fileId));
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
    setActiveMenu(null);
  };

  const handlePlay = (fileId: string) => {
    window.location.href = `/cloud/stream/${fileId}`;
  };

  const startRename = (file: CloudFile) => {
    setEditingFile(file._id);
    setEditName(file.name);
    setActiveMenu(null);
  };

  const handleRename = async (fileId: string) => {
    if (!editName.trim()) return;

    try {
      const response = await fetch(`/api/cloud/files/${fileId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim() }),
      });
      if (response.ok) {
        setFiles(prev => prev.map(f =>
          f._id === fileId ? { ...f, name: editName.trim() } : f
        ));
      }
    } catch (error) {
      console.error('Failed to rename file:', error);
    }
    setEditingFile(null);
    setEditName('');
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <CloudHeader />
        <main className="cloud-main">
          <div className="cloud-empty">
            <span className="cloud-spinner" style={{ width: 48, height: 48 }} />
            <p className="cloud-empty__text" style={{ marginTop: '1rem' }}>Cargando...</p>
          </div>
        </main>
        <CloudFooter />
      </>
    );
  }

  // Not authenticated - show login prompt
  if (!isAuthenticated) {
    return (
      <>
        <CloudHeader />
        <main className="cloud-main">
          <div className="cloud-empty">
            <div className="cloud-empty__icon">
              <Cloud size={80} />
            </div>
            <h1 className="cloud-empty__title">Cloud Storage Personal</h1>
            <p className="cloud-empty__text">
              Almacena y reproduce tus videos desde cualquier dispositivo.
              Inicia sesion para acceder a tu espacio en la nube.
            </p>
            <button
              className="cloud-btn cloud-btn--primary"
              onClick={() => setShowAuthModal(true)}
              style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}
            >
              Iniciar Sesion
            </button>
          </div>
        </main>
        <CloudFooter />
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  // Authenticated - show dashboard
  return (
    <>
      <CloudHeader onUploadClick={() => setShowUploader(true)} />
      <main className="cloud-main">
        {/* Action bar */}
        <div style={{
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className="cloud-btn cloud-btn--primary"
              onClick={() => setShowUploader(true)}
            >
              <Upload size={18} />
              Subir Archivos
            </button>
            <button className="cloud-btn cloud-btn--secondary">
              <FolderPlus size={18} />
              Nueva Carpeta
            </button>
          </div>
          <StorageQuota />
        </div>

        {/* Loading files */}
        {isLoadingFiles && (
          <div className="cloud-empty">
            <span className="cloud-spinner" style={{ width: 40, height: 40 }} />
            <p className="cloud-empty__text" style={{ marginTop: '1rem' }}>Cargando archivos...</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoadingFiles && files.length === 0 && (
          <div className="cloud-empty">
            <div className="cloud-empty__icon">
              <Cloud size={80} />
            </div>
            <h2 className="cloud-empty__title">Tu nube esta vacia</h2>
            <p className="cloud-empty__text">
              Sube tus primeros archivos para comenzar a usar tu almacenamiento personal.
            </p>
          </div>
        )}

        {/* File grid */}
        {!isLoadingFiles && files.length > 0 && (
          <div className="cloud-files">
            {files.map(file => (
              <div
                key={file._id}
                className="cloud-file"
                onClick={() => file.cloudinaryResourceType === 'video' && handlePlay(file._id)}
              >
                <div className="cloud-file__thumbnail">
                  {file.thumbnailUrl ? (
                    <img src={file.thumbnailUrl} alt={file.name} />
                  ) : (
                    <span className="cloud-file__thumbnail--icon">
                      {file.cloudinaryResourceType === 'video' ? '🎬' : '📄'}
                    </span>
                  )}
                  {file.duration && (
                    <span className="cloud-file__duration">
                      {formatDuration(file.duration)}
                    </span>
                  )}
                </div>
                <div className="cloud-file__info">
                  {editingFile === file._id ? (
                    <form
                      onSubmit={(e) => { e.preventDefault(); handleRename(file._id); }}
                      style={{ display: 'flex', gap: 4 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="cloud-input"
                        style={{ flex: 1, padding: '4px 8px', fontSize: '0.875rem' }}
                        autoFocus
                        onBlur={() => handleRename(file._id)}
                      />
                    </form>
                  ) : (
                    <p className="cloud-file__name" title={file.name}>{file.name}</p>
                  )}
                  <div className="cloud-file__meta">
                    <span>{formatBytes(file.size)}</span>
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === file._id ? null : file._id);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#94A3B8',
                          cursor: 'pointer',
                          padding: 4,
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>
                      {activeMenu === file._id && (
                        <div className="cloud-dropdown" onClick={(e) => e.stopPropagation()}>
                          {file.cloudinaryResourceType === 'video' && (
                            <button className="cloud-dropdown__item" onClick={() => handlePlay(file._id)}>
                              <Play size={16} /> Reproducir
                            </button>
                          )}
                          <button className="cloud-dropdown__item" onClick={() => startRename(file)}>
                            <Pencil size={16} /> Renombrar
                          </button>
                          <button className="cloud-dropdown__item cloud-dropdown__item--danger" onClick={() => handleDelete(file._id)}>
                            <Trash2 size={16} /> Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <CloudFooter />

      {/* Upload modal */}
      {showUploader && (
        <FileUploader
          onUploadComplete={handleUploadComplete}
          onClose={() => setShowUploader(false)}
        />
      )}
    </>
  );
}
