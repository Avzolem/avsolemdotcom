'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Cloud, Upload, FolderPlus, Play, Trash2, MoreVertical, Pencil, Folder, Home, ChevronRight } from 'lucide-react';
import CloudHeader from '@/components/cloud/CloudHeader';
import CloudFooter from '@/components/cloud/CloudFooter';
import AuthModal from '@/components/cloud/AuthModal';
import FileUploader from '@/components/cloud/FileUploader';
import { useCloudAuth } from '@/contexts/CloudAuthContext';
import { useToast } from '@/contexts/ToastContext';

interface CloudFile {
  _id: string;
  name: string;
  size: number;
  cloudinaryResourceType: string;
  cloudinaryFormat: string;
  thumbnailUrl?: string;
  duration?: number;
  folderId?: string | null;
  createdAt: string;
}

interface CloudFolder {
  _id: string;
  name: string;
  parentId: string | null;
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
  const { showToast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [files, setFiles] = useState<CloudFile[]>([]);
  const [folders, setFolders] = useState<CloudFolder[]>([]);
  const [allFolders, setAllFolders] = useState<CloudFolder[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<CloudFolder[]>([]);
  const [activeFolderMenu, setActiveFolderMenu] = useState<string | null>(null);
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState('');

  const fetchAllFolders = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await fetch('/api/cloud/folders');
      if (response.ok) {
        const data = await response.json();
        setAllFolders(data.folders || []);
      }
    } catch (error) {
      console.error('Failed to fetch folders:', error);
    }
  }, [isAuthenticated]);

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

  const fetchFoldersInCurrent = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const url = currentFolderId
        ? `/api/cloud/folders?parentId=${currentFolderId}`
        : '/api/cloud/folders';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setFolders(data.folders || []);
      }
    } catch (error) {
      console.error('Failed to fetch folders:', error);
    }
  }, [isAuthenticated, currentFolderId]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFiles();
      fetchAllFolders();
    }
  }, [isAuthenticated, fetchFiles, fetchAllFolders]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFoldersInCurrent();
    }
  }, [isAuthenticated, currentFolderId, fetchFoldersInCurrent]);

  // Build folder path (breadcrumb)
  useEffect(() => {
    if (!currentFolderId) {
      setFolderPath([]);
      return;
    }
    const buildPath = (folderId: string): CloudFolder[] => {
      const folder = allFolders.find(f => f._id === folderId);
      if (!folder) return [];
      if (folder.parentId) {
        return [...buildPath(folder.parentId), folder];
      }
      return [folder];
    };
    setFolderPath(buildPath(currentFolderId));
  }, [currentFolderId, allFolders]);

  const handleUploadComplete = () => {
    fetchFiles();
  };

  const handleDelete = async (fileId: string, fileName: string) => {
    if (!confirm('Estas seguro de eliminar este archivo?')) return;

    try {
      const response = await fetch(`/api/cloud/files/${fileId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setFiles(prev => prev.filter(f => f._id !== fileId));
        showToast(`"${fileName}" eliminado correctamente`, 'success');
      } else {
        showToast('Error al eliminar el archivo', 'error');
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
      showToast('Error al eliminar el archivo', 'error');
    }
    setActiveMenu(null);
  };

  const handlePlay = (fileId: string) => {
    window.location.href = `/cloud/stream/${fileId}`;
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const response = await fetch('/api/cloud/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFolderName.trim(),
          parentId: currentFolderId,
        }),
      });
      if (response.ok) {
        showToast(`Carpeta "${newFolderName.trim()}" creada`, 'success');
        setNewFolderName('');
        setShowNewFolder(false);
        fetchFoldersInCurrent();
        fetchAllFolders();
      } else {
        showToast('Error al crear la carpeta', 'error');
      }
    } catch (error) {
      console.error('Failed to create folder:', error);
      showToast('Error al crear la carpeta', 'error');
    }
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
        showToast('Archivo renombrado', 'success');
      } else {
        showToast('Error al renombrar', 'error');
      }
    } catch (error) {
      console.error('Failed to rename file:', error);
      showToast('Error al renombrar', 'error');
    }
    setEditingFile(null);
    setEditName('');
  };

  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolderId(folderId);
  };

  const handleDeleteFolder = async (folderId: string, folderName: string) => {
    if (!confirm('Estas seguro de eliminar esta carpeta y todos sus archivos?')) return;

    try {
      const response = await fetch(`/api/cloud/folders/${folderId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setFolders(prev => prev.filter(f => f._id !== folderId));
        setAllFolders(prev => prev.filter(f => f._id !== folderId));
        fetchFiles(); // Refresh files as some may have been deleted
        showToast(`Carpeta "${folderName}" eliminada`, 'success');
      } else {
        showToast('Error al eliminar la carpeta', 'error');
      }
    } catch (error) {
      console.error('Failed to delete folder:', error);
      showToast('Error al eliminar la carpeta', 'error');
    }
    setActiveFolderMenu(null);
  };

  const startRenameFolder = (folder: CloudFolder) => {
    setEditingFolder(folder._id);
    setEditFolderName(folder.name);
    setActiveFolderMenu(null);
  };

  const handleRenameFolder = async (folderId: string) => {
    if (!editFolderName.trim()) return;

    try {
      const response = await fetch(`/api/cloud/folders/${folderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editFolderName.trim() }),
      });
      if (response.ok) {
        const newName = editFolderName.trim();
        setFolders(prev => prev.map(f =>
          f._id === folderId ? { ...f, name: newName } : f
        ));
        setAllFolders(prev => prev.map(f =>
          f._id === folderId ? { ...f, name: newName } : f
        ));
        showToast('Carpeta renombrada', 'success');
      } else {
        showToast('Error al renombrar', 'error');
      }
    } catch (error) {
      console.error('Failed to rename folder:', error);
      showToast('Error al renombrar', 'error');
    }
    setEditingFolder(null);
    setEditFolderName('');
  };

  // Filter files for current folder (memoized for performance)
  const currentFiles = useMemo(() =>
    files.filter(f => (f.folderId || null) === currentFolderId),
    [files, currentFolderId]
  );

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (activeMenu) setActiveMenu(null);
      if (activeFolderMenu) setActiveFolderMenu(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenu, activeFolderMenu]);

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

  // Authenticated - show dashboard with sidebar
  return (
    <>
      <CloudHeader
        onUploadClick={() => setShowUploader(true)}
        onNewFolderClick={() => setShowNewFolder(true)}
      />
      <main className="cloud-main">
        <div className="cloud-content">
          {/* Sidebar */}
          <aside className="cloud-sidebar">
            <div className="cloud-sidebar__title">Navegacion</div>
            <ul className="cloud-tree">
              <li className="cloud-tree__item">
                <button
                  className={`cloud-tree__button ${currentFolderId === null ? 'cloud-tree__button--active' : ''}`}
                  onClick={() => navigateToFolder(null)}
                >
                  <Home size={18} />
                  <span className="cloud-tree__label">Inicio</span>
                  <span className="cloud-tree__count">{files.filter(f => !f.folderId).length}</span>
                </button>
              </li>
              {allFolders.filter(f => !f.parentId).map(folder => (
                <li key={folder._id} className="cloud-tree__item">
                  <button
                    className={`cloud-tree__button ${currentFolderId === folder._id ? 'cloud-tree__button--active' : ''}`}
                    onClick={() => navigateToFolder(folder._id)}
                  >
                    <Folder size={18} />
                    <span className="cloud-tree__label">{folder.name}</span>
                  </button>
                  {/* Nested folders */}
                  {allFolders.filter(f => f.parentId === folder._id).length > 0 && (
                    <ul className="cloud-tree__children">
                      {allFolders.filter(f => f.parentId === folder._id).map(subFolder => (
                        <li key={subFolder._id} className="cloud-tree__item">
                          <button
                            className={`cloud-tree__button ${currentFolderId === subFolder._id ? 'cloud-tree__button--active' : ''}`}
                            onClick={() => navigateToFolder(subFolder._id)}
                          >
                            <Folder size={16} />
                            <span className="cloud-tree__label">{subFolder.name}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </aside>

          {/* Main content */}
          <div className="cloud-main-content">
            {/* Breadcrumb */}
            {folderPath.length > 0 && (
              <nav className="cloud-breadcrumb">
                <span className="cloud-breadcrumb__item">
                  <span className="cloud-breadcrumb__link" onClick={() => navigateToFolder(null)}>
                    Inicio
                  </span>
                </span>
                {folderPath.map((folder, index) => (
                  <span key={folder._id} className="cloud-breadcrumb__item">
                    <ChevronRight size={16} className="cloud-breadcrumb__separator" />
                    {index === folderPath.length - 1 ? (
                      <span>{folder.name}</span>
                    ) : (
                      <span className="cloud-breadcrumb__link" onClick={() => navigateToFolder(folder._id)}>
                        {folder.name}
                      </span>
                    )}
                  </span>
                ))}
              </nav>
            )}

            {/* Loading files */}
            {isLoadingFiles && (
              <div className="cloud-empty">
                <span className="cloud-spinner" style={{ width: 40, height: 40 }} />
                <p className="cloud-empty__text" style={{ marginTop: '1rem' }}>Cargando archivos...</p>
              </div>
            )}

            {/* Folders */}
            {!isLoadingFiles && folders.length > 0 && (
              <div className="cloud-files" style={{ marginBottom: '1.5rem' }}>
                {folders.map(folder => (
                  <div
                    key={folder._id}
                    className="cloud-folder"
                    onClick={() => navigateToFolder(folder._id)}
                  >
                    <div className="cloud-folder__icon">
                      <Folder size={24} />
                    </div>
                    <div className="cloud-folder__info">
                      {editingFolder === folder._id ? (
                        <form
                          onSubmit={(e) => { e.preventDefault(); handleRenameFolder(folder._id); }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="text"
                            value={editFolderName}
                            onChange={(e) => setEditFolderName(e.target.value)}
                            className="cloud-input"
                            style={{ padding: '4px 8px', fontSize: '0.875rem', width: '100%' }}
                            autoFocus
                            onBlur={() => handleRenameFolder(folder._id)}
                          />
                        </form>
                      ) : (
                        <>
                          <p className="cloud-folder__name">{folder.name}</p>
                          <p className="cloud-folder__meta">
                            {files.filter(f => f.folderId === folder._id).length} archivos
                          </p>
                        </>
                      )}
                    </div>
                    <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setActiveFolderMenu(activeFolderMenu === folder._id ? null : folder._id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#94A3B8',
                          cursor: 'pointer',
                          padding: 8,
                        }}
                      >
                        <MoreVertical size={18} />
                      </button>
                      {activeFolderMenu === folder._id && (
                        <div className="cloud-dropdown">
                          <button className="cloud-dropdown__item" onClick={() => startRenameFolder(folder)}>
                            <Pencil size={16} /> Renombrar
                          </button>
                          <button className="cloud-dropdown__item cloud-dropdown__item--danger" onClick={() => handleDeleteFolder(folder._id, folder.name)}>
                            <Trash2 size={16} /> Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!isLoadingFiles && folders.length === 0 && currentFiles.length === 0 && (
              <div className="cloud-empty">
                <div className="cloud-empty__icon">
                  <Cloud size={80} />
                </div>
                <h2 className="cloud-empty__title">
                  {currentFolderId ? 'Carpeta vacia' : 'Tu nube esta vacia'}
                </h2>
                <p className="cloud-empty__text">
                  {currentFolderId
                    ? 'Esta carpeta no tiene archivos. Sube archivos o crea subcarpetas.'
                    : 'Sube tus primeros archivos para comenzar a usar tu almacenamiento personal.'}
                </p>
              </div>
            )}

            {/* File grid */}
            {!isLoadingFiles && currentFiles.length > 0 && (
              <div className="cloud-files">
                {currentFiles.map(file => (
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
                              <button className="cloud-dropdown__item cloud-dropdown__item--danger" onClick={() => handleDelete(file._id, file.name)}>
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
          </div>
        </div>
      </main>
      <CloudFooter />

      {/* Upload modal */}
      {showUploader && (
        <FileUploader
          folderId={currentFolderId}
          onUploadComplete={handleUploadComplete}
          onClose={() => setShowUploader(false)}
        />
      )}

      {/* New folder modal */}
      {showNewFolder && (
        <div className="cloud-auth-modal" onClick={() => setShowNewFolder(false)}>
          <div
            className="cloud-auth-modal__content"
            style={{ maxWidth: 400 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="cloud-auth-modal__title">Nueva Carpeta</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleCreateFolder(); }}>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Nombre de la carpeta"
                className="cloud-input"
                style={{ width: '100%', marginBottom: '1rem' }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="cloud-btn cloud-btn--secondary"
                  onClick={() => setShowNewFolder(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="cloud-btn cloud-btn--primary"
                  disabled={!newFolderName.trim()}
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
