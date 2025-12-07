'use client';

import { useEffect, ReactNode } from 'react';
import { useYugiohLanguage } from '@/contexts/YugiohLanguageContext';
import styles from './Toast.module.scss';

interface ToastProps {
  message: string | ReactNode;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  const { t } = useYugiohLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.toastContent}>
        <span className={styles.toastIcon}>
          {type === 'success' && '✓'}
          {type === 'error' && '✕'}
          {type === 'info' && 'ℹ'}
        </span>
        <span className={styles.toastMessage}>{message}</span>
      </div>
      <button
        type="button"
        className={styles.toastClose}
        onClick={onClose}
        aria-label={t('toast.close')}
      >
        ✕
      </button>
    </div>
  );
}
