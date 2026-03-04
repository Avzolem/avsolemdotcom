'use client';

import { useState, useRef, useEffect } from 'react';
import { useMagicAuth } from '@/contexts/MagicAuthContext';
import { useMagicLanguage } from '@/contexts/MagicLanguageContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import AuthModal from '@/components/magic/AuthModal';
import styles from './MagicHeader.module.scss';

export default function MagicHeader() {
  const { user, isAuthenticated, isLoading, logout } = useMagicAuth();
  const { language, setLanguage, t } = useMagicLanguage();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Check if user is admin
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      fetch('/api/magic/admin')
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
    { href: '/magic', label: t('header.search'), icon: '\uD83D\uDD0D' },
    { href: '/magic/coleccion', label: t('header.collection'), icon: '\uD83D\uDCDA' },
    { href: '/magic/venta', label: t('header.forSale'), icon: '\uD83D\uDCB0' },
    { href: '/magic/wishlist', label: t('header.wishlist'), icon: '\u2B50' },
    { href: '/magic/decks', label: t('header.decks'), icon: '\u2694\uFE0F' },
    { href: '/magic/catalogo', label: t('header.catalog'), icon: '\uD83D\uDED2' },
    { href: '/magic/noticias', label: t('header.news'), icon: '\uD83D\uDCF0' },
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
            <Link href="/magic" className={styles.logoLink}>
              <Image
                src="/images/tcg/magic-icon.png"
                alt="MTG"
                width={40}
                height={40}
                className={styles.titleIcon}
                unoptimized
              />
              <div className={styles.titleGroup}>
                <h1 className={styles.title}>Magic The Gathering Manager</h1>
                <p className={styles.subtitle}>
                  {t('header.tagline')}
                </p>
              </div>
            </Link>
          </div>

          {/* Center Logo */}
          <div className={styles.centerLogo}>
            <Image
              src="/images/tcg/magic-logo.png"
              alt="Magic: The Gathering"
              width={200}
              height={74}
              className={styles.magicLogoCenter}
              unoptimized
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
                  <span className={styles.chevron}>{'\u25BC'}</span>
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
                        href="/magic/admin"
                        className={`${styles.userMenuItem} ${styles.adminMenuItem}`}
                        onClick={() => setShowUserMenu(false)}
                      >
                        {'\u2699\uFE0F'} {language === 'es' ? 'Panel Admin' : 'Admin Panel'}
                      </Link>
                    )}
                    <Link
                      href="/magic/perfil"
                      className={styles.userMenuItem}
                      onClick={() => setShowUserMenu(false)}
                    >
                      {'\uD83D\uDC64'} {t('userMenu.profile')}
                    </Link>
                    <button
                      className={styles.userMenuItem}
                      onClick={handleLogout}
                    >
                      {'\uD83D\uDEAA'} {t('userMenu.logout')}
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
