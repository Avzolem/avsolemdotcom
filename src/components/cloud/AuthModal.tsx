'use client';

import { useState } from 'react';
import { X, Lock } from 'lucide-react';
import { useCloudAuth } from '@/contexts/CloudAuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useCloudAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(password);

    if (!result.success) {
      setError(result.error || 'Error de autenticacion');
    } else {
      onClose();
    }

    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="cloud-auth-modal" onClick={onClose}>
      <div className="cloud-auth-modal__content" onClick={(e) => e.stopPropagation()}>
        <button className="cloud-auth-modal__close" onClick={onClose}>
          <X size={24} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Lock size={48} style={{ color: '#3B82F6', marginBottom: '1rem' }} />
          <h2 className="cloud-auth-modal__title" style={{ marginBottom: '0.5rem' }}>
            Acceso Privado
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>
            Ingresa la contrasena para acceder
          </p>
        </div>

        <form className="cloud-auth-modal__form" onSubmit={handleSubmit}>
          <div className="cloud-auth-modal__field">
            <label htmlFor="password">Contrasena</label>
            <input
              id="password"
              type="password"
              className="cloud-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              required
            />
          </div>

          {error && <div className="cloud-auth-modal__error">{error}</div>}

          <button
            type="submit"
            className="cloud-btn cloud-btn--primary"
            disabled={isLoading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {isLoading ? <span className="cloud-spinner" /> : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
