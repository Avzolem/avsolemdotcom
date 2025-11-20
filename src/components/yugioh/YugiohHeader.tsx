'use client';

import { useState } from 'react';
import { useYugiohAuth } from '@/contexts/YugiohAuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import AdminLogin from './AdminLogin';
import styles from './YugiohHeader.module.scss';

export default function YugiohHeader() {
  const { isAuthenticated, logout } = useYugiohAuth();
  const [showLogin, setShowLogin] = useState(false);
  const pathname = usePathname();

  const handleLoginClick = () => {
    console.log('Login button clicked');
    setShowLogin(true);
  };

  const navItems = [
    { href: '/yugioh', label: 'Buscar', icon: '🔍' },
    { href: '/yugioh/coleccion', label: 'Colección', icon: '🃏' },
    { href: '/yugioh/venta', label: 'En Venta', icon: '💰' },
    { href: '/yugioh/wishlist', label: 'Wishlist', icon: '⭐' },
  ];

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          {/* Logo */}
          <div className={styles.logo}>
            <Link href="/yugioh">
              <h1 className={styles.title}>
                <span className={styles.titleIcon}>
                  <Image
                    src="/images/yugioh-logo-icon.png"
                    alt="Yu-Gi-Oh! Logo"
                    width={40}
                    height={40}
                    priority
                  />
                </span>
                Yu-Gi-Oh! Manager
              </h1>
              <p className={styles.subtitle}>Gestiona tu colección de cartas</p>
            </Link>
          </div>

          {/* Auth Status */}
          <div className={styles.authSection}>
            {isAuthenticated ? (
              <div className={styles.authInfo}>
                <span className={styles.authBadge}>✓ Admin</span>
                <button onClick={logout} className={styles.btnLogout}>
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className={styles.btnLogin}
                type="button"
              >
                🔐 Acceso Admin
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
