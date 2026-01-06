'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, File, Video, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

interface FileUploaderProps {
  folderId?: string | null;
  onUploadComplete?: () => void;
  onClose: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function FileUploader({ folderId, onUploadComplete, onClose }: FileUploaderProps) {
  const { showToast } = useToast();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  }, []);

  const addFiles = (newFiles: File[]) => {
    const uploadFiles: UploadFile[] = newFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'pending',
    }));
    setFiles(prev => [...prev, ...uploadFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const uploadFile = async (uploadFile: UploadFile) => {
    // Update status to uploading
    setFiles(prev =>
      prev.map(f => (f.id === uploadFile.id ? { ...f, status: 'uploading' as const } : f))
    );

    try {
      // 1. Get signed upload params
      const signatureResponse = await fetch('/api/cloud/upload/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: folderId }),
      });

      if (!signatureResponse.ok) {
        throw new Error('Failed to get upload signature');
      }

      const { signature, timestamp, apiKey, cloudName, folder } = await signatureResponse.json();

      // 2. Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', uploadFile.file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', folder);

      // Use XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();

      await new Promise<void>((resolve, reject) => {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setFiles(prev =>
              prev.map(f => (f.id === uploadFile.id ? { ...f, progress } : f))
            );
          }
        };

        xhr.onload = async () => {
          if (xhr.status === 200) {
            const result = JSON.parse(xhr.responseText);

            // Update to processing
            setFiles(prev =>
              prev.map(f =>
                f.id === uploadFile.id ? { ...f, status: 'processing' as const, progress: 100 } : f
              )
            );

            // 3. Save to database
            const completeResponse = await fetch('/api/cloud/upload/complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...result,
                folderId,
              }),
            });

            if (completeResponse.ok) {
              setFiles(prev =>
                prev.map(f =>
                  f.id === uploadFile.id ? { ...f, status: 'complete' as const } : f
                )
              );
              showToast(`"${uploadFile.name}" subido correctamente`, 'success');
              resolve();
            } else {
              throw new Error('Failed to save file');
            }
          } else {
            reject(new Error('Upload failed'));
          }
        };

        xhr.onerror = () => reject(new Error('Network error'));

        const resourceType = uploadFile.file.type.startsWith('video/')
          ? 'video'
          : uploadFile.file.type.startsWith('image/')
          ? 'image'
          : 'raw';

        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`);
        xhr.send(formData);
      });
    } catch (error) {
      console.error('Upload error:', error);
      setFiles(prev =>
        prev.map(f =>
          f.id === uploadFile.id
            ? { ...f, status: 'error' as const, error: 'Error al subir archivo' }
            : f
        )
      );
      showToast(`Error al subir "${uploadFile.name}"`, 'error');
    }
  };

  const uploadAll = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    for (const file of pendingFiles) {
      await uploadFile(file);
    }
    onUploadComplete?.();
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('video/')) return <Video size={24} />;
    if (file.type.startsWith('image/')) return <ImageIcon size={24} />;
    return <File size={24} />;
  };

  const pendingCount = files.filter(f => f.status === 'pending').length;
  const completedCount = files.filter(f => f.status === 'complete').length;

  return (
    <div className="cloud-auth-modal">
      <div
        className="cloud-auth-modal__content"
        style={{ maxWidth: 600 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="cloud-auth-modal__close" onClick={onClose}>
          <X size={24} />
        </button>

        <h2 className="cloud-auth-modal__title">Subir Archivos</h2>

        {/* Drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? '#3B82F6' : '#334155'}`,
            borderRadius: 12,
            padding: '2rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: isDragging ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            transition: 'all 0.2s ease',
            marginBottom: '1.5rem',
          }}
        >
          <Upload size={40} style={{ color: '#94A3B8', marginBottom: '0.75rem' }} />
          <p style={{ color: '#F8FAFC', marginBottom: '0.25rem' }}>
            Arrastra archivos aqui o haz clic para seleccionar
          </p>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>
            Videos, imagenes y otros archivos
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept="video/*,image/*"
        />

        {/* File list */}
        {files.length > 0 && (
          <div style={{ marginBottom: '1.5rem', maxHeight: 300, overflowY: 'auto' }}>
            {files.map(file => (
              <div
                key={file.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  background: '#1E293B',
                  borderRadius: 8,
                  marginBottom: '0.5rem',
                }}
              >
                <div style={{ color: '#94A3B8' }}>{getFileIcon(file.file)}</div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      color: '#F8FAFC',
                      fontSize: '0.875rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {file.name}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>
                      {formatBytes(file.size)}
                    </span>
                    {file.status === 'uploading' && (
                      <span style={{ color: '#3B82F6', fontSize: '0.75rem' }}>
                        {file.progress}%
                      </span>
                    )}
                    {file.status === 'processing' && (
                      <span style={{ color: '#F59E0B', fontSize: '0.75rem' }}>
                        Procesando...
                      </span>
                    )}
                    {file.status === 'error' && (
                      <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>
                        {file.error}
                      </span>
                    )}
                  </div>
                  {(file.status === 'uploading' || file.status === 'processing') && (
                    <div
                      style={{
                        height: 4,
                        background: '#0F172A',
                        borderRadius: 2,
                        marginTop: 4,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${file.progress}%`,
                          background: file.status === 'processing' ? '#F59E0B' : '#3B82F6',
                          transition: 'width 0.2s ease',
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  {file.status === 'complete' && (
                    <CheckCircle size={20} style={{ color: '#22C55E' }} />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle size={20} style={{ color: '#EF4444' }} />
                  )}
                  {file.status === 'pending' && (
                    <button
                      onClick={() => removeFile(file.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        padding: 4,
                      }}
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button className="cloud-btn cloud-btn--secondary" onClick={onClose}>
            Cerrar
          </button>
          {pendingCount > 0 && (
            <button className="cloud-btn cloud-btn--primary" onClick={uploadAll}>
              Subir {pendingCount} archivo{pendingCount !== 1 ? 's' : ''}
            </button>
          )}
        </div>

        {completedCount > 0 && (
          <p
            style={{
              textAlign: 'center',
              color: '#22C55E',
              fontSize: '0.875rem',
              marginTop: '1rem',
            }}
          >
            {completedCount} archivo{completedCount !== 1 ? 's' : ''} subido
            {completedCount !== 1 ? 's' : ''} correctamente
          </p>
        )}
      </div>
    </div>
  );
}
