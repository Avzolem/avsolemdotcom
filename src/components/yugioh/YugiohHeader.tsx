'use client';

import { useState, useRef, useEffect } from 'react';
import { useYugiohAuth } from '@/contexts/YugiohAuthContext';
import { useYugiohLanguage } from '@/contexts/YugiohLanguageContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import AuthModal from './AuthModal';
import styles from './YugiohHeader.module.scss';

export default function YugiohHeader() {
  const { user, isAuthenticated, isLoading, logout } = useYugiohAuth();
  const { language, setLanguage, t } = useYugiohLanguage();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Check if user is admin
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      // Verify admin status via API
      fetch('/api/yugioh/admin')
        .then(res => {
          setIsAdmin(res.ok);
        })
        .catch(() => setIsAdmin(false));
    } else {
      setIsAdmin(false);
    }
  }, [isAuthenticated, user?.email]);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLoginClick = () => {
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    setShowUserMenu(false);
    await logout();
  };

  const navItems = [
    { href: '/yugioh', label: t('header.search'), icon: '🔍' },
    { href: '/yugioh/coleccion', label: t('header.collection'), icon: '🃏' },
    { href: '/yugioh/venta', label: t('header.forSale'), icon: '💰' },
    { href: '/yugioh/wishlist', label: t('header.wishlist'), icon: '⭐' },
    { href: '/yugioh/decks', label: t('header.decks'), icon: '📦' },
    { href: '/yugioh/catalogo', label: t('header.catalog'), icon: '🛒' },
    { href: '/yugioh/noticias', label: t('header.news'), icon: '📰' },
  ];

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.name) return '?';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          {/* Logo */}
          <div className={styles.logo}>
            <Link href="/yugioh" className={styles.logoLink}>
              <span className={styles.titleIcon}>
                <Image
                  src="/images/yugioh-logo-icon.png"
                  alt="Yu-Gi-Oh! Logo"
                  width={40}
                  height={40}
                  priority
                />
              </span>
              <div className={styles.titleGroup}>
                <h1 className={styles.title}>Yu-Gi-Oh! Manager</h1>
                <p className={styles.subtitle}>
                  {t('header.tagline')}
                </p>
              </div>
            </Link>
          </div>

          {/* Center Logo */}
          <div className={styles.centerLogo}>
            <Image
              src="/images/yugioh-logo.svg"
              alt="Yu-Gi-Oh!"
              width={200}
              height={60}
              className={styles.yugiohLogoCenter}
            />
          </div>

          {/* Auth Section */}
          <div className={styles.authSection}>
            {/* Language Toggle */}
            <div className={styles.languageToggle}>
              <button
                onClick={() => setLanguage('en')}
                className={`${styles.langButton} ${language === 'en' ? styles.langButtonActive : ''}`}
                type="button"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('es')}
                className={`${styles.langButton} ${language === 'es' ? styles.langButtonActive : ''}`}
                type="button"
              >
                ES
              </button>
            </div>

            {isLoading ? (
              <div className={styles.loadingAuth}>
                <span className={styles.spinner}></span>
              </div>
            ) : isAuthenticated && user ? (
              <div className={styles.userSection} ref={userMenuRef}>
                <button
                  className={styles.userButton}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  type="button"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || 'User'}
                      width={36}
                      height={36}
                      className={styles.userAvatar}
                    />
                  ) : (
                    <span className={styles.userInitials}>{getUserInitials()}</span>
                  )}
                  <span className={styles.userName}>{user.name?.split(' ')[0]}</span>
                  <span className={styles.chevron}>▼</span>
                </button>

                {showUserMenu && (
                  <div className={styles.userMenu}>
                    <div className={styles.userMenuHeader}>
                      <span className={styles.userMenuEmail}>{user.email}</span>
                      {isAdmin && <span className={styles.adminBadge}>Admin</span>}
                    </div>
                    <div className={styles.userMenuDivider}></div>
                    {isAdmin && (
                      <Link
                        href="/yugioh/admin"
                        className={`${styles.userMenuItem} ${styles.adminMenuItem}`}
                        onClick={() => setShowUserMenu(false)}
                      >
                        ⚙️ {language === 'es' ? 'Panel Admin' : 'Admin Panel'}
                      </Link>
                    )}
                    <Link
                      href="/yugioh/perfil"
                      className={styles.userMenuItem}
                      onClick={() => setShowUserMenu(false)}
                    >
                      👤 {t('userMenu.profile')}
                    </Link>
                    <button
                      className={styles.userMenuItem}
                      onClick={handleLogout}
                    >
                      🚪 {t('userMenu.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className={styles.btnLogin}
                type="button"
              >
                {t('auth.login')}
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <div className={styles.container}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${
                    isActive ? styles.navLinkActive : ''
                  }`}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
