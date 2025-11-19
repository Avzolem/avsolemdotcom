'use client';

import { useState } from 'react';
import { ListType } from '@/types/yugioh';
import styles from './ShareButton.module.scss';

interface ShareButtonProps {
  listType: ListType;
  listName: string;
}

export default function ShareButton({ listType, listName }: ShareButtonProps) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/yugioh/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listType, expiresInDays: 7 }),
      });

      if (response.ok) {
        const data = await response.json();
        setShareUrl(data.shareUrl);
        setShowModal(true);
      } else {
        alert('Error al crear enlace para compartir');
      }
    } catch (error) {
      console.error('Error sharing list:', error);
      alert('Error al crear enlace para compartir');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        alert('Error al copiar');
      }
    }
  };

  return (
    <>
      <button
        type="button"
        className={styles.btnShare}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleShare();
        }}
        disabled={isLoading}
        title="Compartir lista"
      >
        <span className={styles.icon}>🔗</span>
        {isLoading ? 'Generando...' : 'Compartir'}
      </button>

      {showModal && shareUrl && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Compartir {listName}</h3>

            <p className={styles.modalDescription}>
              Cualquiera con este enlace podrá ver tu lista. El enlace expira en 7 días.
            </p>

            <div className={styles.urlBox}>
              <input
                type="text"
                value={shareUrl}
                readOnly
                className={styles.urlInput}
              />
              <button
                type="button"
                className={styles.btnCopy}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCopy();
                }}
              >
                {copied ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.btnClose}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowModal(false);
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
