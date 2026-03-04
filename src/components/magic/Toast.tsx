'use client';

import { useEffect, ReactNode } from 'react';
import { useMagicLanguage } from '@/contexts/MagicLanguageContext';
import styles from './Toast.module.scss';

interface ToastProps {
  message: string | ReactNode;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  const { t } = useMagicLanguage();

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
          {type === 'success' && '\u2713'}
          {type === 'error' && '\u2715'}
          {type === 'info' && '\u2139'}
          {type === 'warning' && '\u26A0'}
        </span>
        <span className={styles.toastMessage}>{message}</span>
      </div>
      <button
        type="button"
        className={styles.toastClose}
        onClick={onClose}
        aria-label={t('toast.close')}
      >
        {'\u2715'}
      </button>
    </div>
  );
}
