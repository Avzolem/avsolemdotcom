'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useYugiohAuth } from '@/contexts/YugiohAuthContext';
import { useYugiohLanguage } from '@/contexts/YugiohLanguageContext';
import { useToast } from '@/contexts/ToastContext';
import styles from './perfil.module.scss';

interface UserStats {
  totalCards: number;
  collectionValue: number;
  forSaleValue: number;
  wishlistCount: number;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  image?: string;
  provider: string;
  newsletterSubscribed: boolean;
  language: 'es' | 'en';
  createdAt: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout } = useYugiohAuth();
  const { t, language, setLanguage } = useYugiohLanguage();
  const { showToast } = useToast();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/yugioh');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/yugioh/user');
      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        setStats(data.stats);
        setNewsletterSubscribed(data.user.newsletterSubscribed);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletterToggle = async () => {
    setSaving(true);
    try {
      const newValue = !newsletterSubscribed;
      const response = await fetch('/api/yugioh/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsletterSubscribed: newValue }),
      });

      if (response.ok) {
        setNewsletterSubscribed(newValue);
        showToast(
          newValue ? t('newsletter.subscribed') : t('newsletter.notSubscribed'),
          'success'
        );
      }
    } catch (error) {
      showToast(t('common.error'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLanguageChange = async (newLang: 'es' | 'en') => {
    setLanguage(newLang);
    try {
      await fetch('/api/yugioh/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: newLang }),
      });
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/yugioh/user', {
        method: 'DELETE',
      });

      if (response.ok) {
        await logout();
        router.push('/yugioh');
      } else {
        showToast(t('common.error'), 'error');
      }
    } catch (error) {
      showToast(t('common.error'), 'error');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getUserInitials = () => {
    if (!profile?.name) return '?';
    const names = profile.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return profile.name.substring(0, 2).toUpperCase();
  };

  if (isLoading || loading) {
    return (
      <div className={styles.loading}>
        <span className={styles.spinner}></span>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (!isAuthenticated || !profile) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>{t('profile.title')}</h1>

      <div className={styles.grid}>
        {/* Profile Card */}
        <div className={styles.card}>
          <div className={styles.profileHeader}>
            {profile.image ? (
              <Image
                src={profile.image}
                alt={profile.name}
                width={80}
                height={80}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarFallback}>{getUserInitials()}</div>
            )}
            <div className={styles.profileInfo}>
              <h2 className={styles.userName}>{profile.name}</h2>
              <p className={styles.userEmail}>{profile.email}</p>
              <span className={styles.providerBadge}>
                {profile.provider === 'google' ? 'Google' : 'Email'}
              </span>
            </div>
          </div>
          <div className={styles.memberSince}>
            <span className={styles.label}>{t('profile.memberSince')}</span>
            <span className={styles.value}>{formatDate(profile.createdAt)}</span>
          </div>
        </div>

        {/* Stats Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{t('profile.stats')}</h3>
          {stats && (
            <div className={styles.statsGrid}>
              <div className={styles.stat}>
                <span className={styles.statIcon}>🃏</span>
                <span className={styles.statValue}>{stats.totalCards}</span>
                <span className={styles.statLabel}>{t('profile.totalCards')}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statIcon}>💰</span>
                <span className={styles.statValue}>{formatCurrency(stats.collectionValue)}</span>
                <span className={styles.statLabel}>{t('profile.collectionValue')}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statIcon}>🏷️</span>
                <span className={styles.statValue}>{formatCurrency(stats.forSaleValue)}</span>
                <span className={styles.statLabel}>{t('profile.forSaleValue')}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statIcon}>⭐</span>
                <span className={styles.statValue}>{stats.wishlistCount}</span>
                <span className={styles.statLabel}>{t('profile.wishlistCount')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Preferences Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{t('profile.preferences')}</h3>

          <div className={styles.preference}>
            <div className={styles.preferenceInfo}>
              <span className={styles.preferenceLabel}>{t('profile.language')}</span>
            </div>
            <div className={styles.languageToggle}>
              <button
                className={`${styles.langButton} ${language === 'en' ? styles.langButtonActive : ''}`}
                onClick={() => handleLanguageChange('en')}
              >
                EN
              </button>
              <button
                className={`${styles.langButton} ${language === 'es' ? styles.langButtonActive : ''}`}
                onClick={() => handleLanguageChange('es')}
              >
                ES
              </button>
            </div>
          </div>

          <div className={styles.preference}>
            <div className={styles.preferenceInfo}>
              <span className={styles.preferenceLabel}>{t('profile.newsletter')}</span>
              <span className={styles.preferenceDesc}>{t('profile.newsletterDesc')}</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={newsletterSubscribed}
                onChange={handleNewsletterToggle}
                disabled={saving}
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className={`${styles.card} ${styles.dangerCard}`}>
          <h3 className={styles.cardTitle}>{t('profile.deleteAccount')}</h3>
          <p className={styles.dangerText}>{t('profile.deleteWarning')}</p>

          {!showDeleteConfirm ? (
            <button
              className={styles.deleteButton}
              onClick={() => setShowDeleteConfirm(true)}
            >
              {t('profile.deleteAccount')}
            </button>
          ) : (
            <div className={styles.confirmDelete}>
              <p className={styles.confirmText}>{t('profile.deleteConfirm')}</p>
              <div className={styles.confirmButtons}>
                <button
                  className={styles.cancelButton}
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  {t('common.cancel')}
                </button>
                <button
                  className={styles.confirmDeleteButton}
                  onClick={handleDeleteAccount}
                >
                  {t('common.confirm')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
