'use client';

import { useEffect, useState, use } from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import VideoPlayer from '@/components/cloud/VideoPlayer';
import { useCloudAuth } from '@/contexts/CloudAuthContext';

interface StreamData {
  url: string;
  format: string;
  expiresAt: string;
  file: {
    name: string;
    duration?: number;
    width?: number;
    height?: number;
  };
}

export default function StreamPage({ params }: { params: Promise<{ fileId: string }> }) {
  const resolvedParams = use(params);
  const { isAuthenticated, isLoading: authLoading } = useCloudAuth();
  const [streamData, setStreamData] = useState<StreamData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    const fetchStreamUrl = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/cloud/stream/${resolvedParams.fileId}`);
        if (!response.ok) {
          throw new Error('Failed to load video');
        }
        const data = await response.json();
        setStreamData(data);
      } catch (err) {
        setError('No se pudo cargar el video');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreamUrl();
  }, [resolvedParams.fileId, isAuthenticated, authLoading]);

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="cloud-spinner" style={{ width: 48, height: 48 }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <AlertCircle size={48} style={{ color: '#EF4444', marginBottom: '1rem' }} />
          <h1 style={{ color: '#F8FAFC', marginBottom: '0.5rem' }}>Acceso denegado</h1>
          <p style={{ color: '#94A3B8', marginBottom: '1.5rem' }}>Debes ingresar la contrasena para ver este video.</p>
          <Link href="/cloud" className="cloud-btn cloud-btn--primary">
            Ir a Cloud
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <span className="cloud-spinner" style={{ width: 48, height: 48 }} />
          <p style={{ color: '#94A3B8', marginTop: '1rem' }}>Cargando video...</p>
        </div>
      </div>
    );
  }

  if (error || !streamData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <AlertCircle size={48} style={{ color: '#EF4444', marginBottom: '1rem' }} />
          <h1 style={{ color: '#F8FAFC', marginBottom: '0.5rem' }}>Error</h1>
          <p style={{ color: '#94A3B8', marginBottom: '1.5rem' }}>{error || 'Video no encontrado'}</p>
          <Link href="/cloud" className="cloud-btn cloud-btn--primary">
            Volver a Cloud
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '1rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto 1rem' }}>
        <Link
          href="/cloud"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#94A3B8',
            textDecoration: 'none',
            fontSize: '0.875rem',
          }}
        >
          <ArrowLeft size={18} />
          Volver a archivos
        </Link>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto 1rem' }}>
        <h1 style={{ color: '#F8FAFC', fontSize: '1.25rem', fontWeight: 600 }}>
          {streamData.file.name}
        </h1>
      </div>

      <VideoPlayer
        src={streamData.url}
        title={streamData.file.name}
        duration={streamData.file.duration}
      />
    </div>
  );
}
