'use client';

import { useState } from 'react';
import { ListType } from '@/types/yugioh';
import { useYugiohLanguage } from '@/contexts/YugiohLanguageContext';
import styles from './ShareButton.module.scss';

interface ShareButtonProps {
  listType: ListType;
  listName: string;
}

export default function ShareButton({ listType, listName }: ShareButtonProps) {
  const { t } = useYugiohLanguage();
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
        alert(t('share.error'));
      }
    } catch (error) {
      console.error('Error sharing list:', error);
      alert(t('share.error'));
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
        alert(t('share.errorCopy'));
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
        title={t('share.buttonTitle')}
      >
        <span className={styles.icon}>🔗</span>
        {isLoading ? t('share.generating') : t('share.button')}
      </button>

      {showModal && shareUrl && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>{t('share.title', { listName })}</h3>

            <p className={styles.modalDescription}>
              {t('share.description')}
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
                {copied ? t('share.copied') : t('share.copyLink')}
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
                {t('share.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
