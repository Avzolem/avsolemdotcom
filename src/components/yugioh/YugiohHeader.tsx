'use client';

import { useState } from 'react';
import { useYugiohAuth } from '@/contexts/YugiohAuthContext';
import { useYugiohLanguage } from '@/contexts/YugiohLanguageContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import AdminLogin from './AdminLogin';
import styles from './YugiohHeader.module.scss';

export default function YugiohHeader() {
  const { isAuthenticated, logout } = useYugiohAuth();
  const { language, setLanguage, t } = useYugiohLanguage();
  const [showLogin, setShowLogin] = useState(false);
  const pathname = usePathname();

  const handleLoginClick = () => {
    console.log('Login button clicked');
    setShowLogin(true);
  };

  const navItems = [
    { href: '/yugioh', label: t('header.search'), icon: '🔍' },
    { href: '/yugioh/coleccion', label: t('header.collection'), icon: '🃏' },
    { href: '/yugioh/venta', label: t('header.forSale'), icon: '💰' },
    { href: '/yugioh/wishlist', label: t('header.wishlist'), icon: '⭐' },
  ];

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
                  {language === 'es' ? 'Gestiona tu colección de cartas' : 'Manage your card collection'}
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

          {/* Auth Status */}
          <div className={styles.authSection}>
            {/* Language Toggle */}
            <div className={styles.languageToggle}>
              <button
                onClick={() => setLanguage('en')}
                className={`${styles.langButton} ${language === 'en' ? styles.langButtonActive : ''}`}
                type="button"
              >
                English
              </button>
              <button
                onClick={() => setLanguage('es')}
                className={`${styles.langButton} ${language === 'es' ? styles.langButtonActive : ''}`}
                type="button"
              >
                Español
              </button>
            </div>

            {isAuthenticated ? (
              <div className={styles.authInfo}>
                <span className={styles.authBadge}>✓ Admin</span>
                <button onClick={logout} className={styles.btnLogout}>
                  {t('header.logout')}
                </button>
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className={styles.btnAdminIcon}
                type="button"
                title={t('header.adminAccess')}
              >
                🔐
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

      {/* Login Modal */}
      {showLogin && !isAuthenticated && (
        <div className={styles.modal} onClick={() => setShowLogin(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <AdminLogin onClose={() => setShowLogin(false)} />
          </div>
        </div>
      )}
    </>
  );
}
