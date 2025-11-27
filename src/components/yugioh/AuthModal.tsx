'use client';

import { useState } from 'react';
import { useYugiohLanguage } from '@/contexts/YugiohLanguageContext';
import { useYugiohAuth } from '@/contexts/YugiohAuthContext';
import { useToast } from '@/contexts/ToastContext';
import styles from './AuthModal.module.scss';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const { t, language } = useYugiohLanguage();
  const { signInWithGoogle, signInWithCredentials, register } = useYugiohAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setSubscribeNewsletter(false);
    setError(null);
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getErrorMessage = (errorCode: string): string => {
    const errorMap: Record<string, string> = {
      EMAIL_EXISTS: t('auth.error.emailExists'),
      INVALID_CREDENTIALS: t('auth.error.invalidCredentials'),
      MISSING_FIELDS: t('auth.error.missingFields'),
      WEAK_PASSWORD: t('auth.error.weakPassword'),
      INVALID_EMAIL: t('auth.error.invalidEmail'),
    };
    return errorMap[errorCode] || t('auth.error.generic');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'register') {
        // Validate passwords match
        if (password !== confirmPassword) {
          setError(t('auth.error.passwordMismatch'));
          setIsLoading(false);
          return;
        }

        // Validate password length
        if (password.length < 6) {
          setError(t('auth.error.weakPassword'));
          setIsLoading(false);
          return;
        }

        const result = await register(email, password, name, language, subscribeNewsletter);

        if (result.success) {
          showToast(t('auth.success.registered'), 'success');
          handleClose();
        } else {
          setError(getErrorMessage(result.error || 'UNKNOWN'));
        }
      } else {
        const result = await signInWithCredentials(email, password);

        if (result.success) {
          showToast(t('auth.success.loggedIn'), 'success');
          handleClose();
        } else {
          setError(getErrorMessage(result.error || 'INVALID_CREDENTIALS'));
        }
      }
    } catch (err) {
      setError(t('auth.error.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(t('auth.error.generic'));
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
          ✕
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>
            {mode === 'login' ? t('auth.welcomeBack') : t('auth.createYourAccount')}
          </h2>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`}
            onClick={() => switchMode('login')}
          >
            {t('auth.login')}
          </button>
          <button
            className={`${styles.tab} ${mode === 'register' ? styles.tabActive : ''}`}
            onClick={() => switchMode('register')}
          >
            {t('auth.register')}
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          {mode === 'register' && (
            <div className={styles.field}>
              <label htmlFor="name">{t('auth.name')}</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('auth.name')}
                required
                disabled={isLoading}
              />
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="email">{t('auth.email')}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.email')}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">{t('auth.password')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.password')}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>

          {mode === 'register' && (
            <>
              <div className={styles.field}>
                <label htmlFor="confirmPassword">{t('auth.confirmPassword')}</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('auth.confirmPassword')}
                  required
                  minLength={6}
                  disabled={isLoading}
                />
              </div>

              <div className={styles.checkbox}>
                <input
                  id="newsletter"
                  type="checkbox"
                  checked={subscribeNewsletter}
                  onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                  disabled={isLoading}
                />
                <label htmlFor="newsletter">
                  <span className={styles.checkboxLabel}>{t('auth.subscribeNewsletter')}</span>
                  <span className={styles.checkboxHint}>{t('auth.newsletterHint')}</span>
                </label>
              </div>
            </>
          )}

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? t('common.loading') : mode === 'login' ? t('auth.login') : t('auth.register')}
          </button>
        </form>

        <div className={styles.divider}>
          <span>{t('auth.orContinueWith')}</span>
        </div>

        <button
          type="button"
          className={styles.googleButton}
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <svg viewBox="0 0 24 24" className={styles.googleIcon}>
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {t('auth.signInWithGoogle')}
        </button>

        <p className={styles.switchMode}>
          {mode === 'login' ? (
            <>
              {t('auth.dontHaveAccount')}{' '}
              <button type="button" onClick={() => switchMode('register')}>
                {t('auth.createAccount')}
              </button>
            </>
          ) : (
            <>
              {t('auth.alreadyHaveAccount')}{' '}
              <button type="button" onClick={() => switchMode('login')}>
                {t('auth.login')}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
