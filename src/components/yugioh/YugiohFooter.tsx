'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useYugiohLanguage } from '@/contexts/YugiohLanguageContext';
import styles from './YugiohFooter.module.scss';

export default function YugiohFooter() {
  const { t } = useYugiohLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* About */}
          <div className={styles.section}>
            <h3 className={styles.heading}>{t('footer.title')}</h3>
            <p className={styles.text}>
              {t('footer.description')}
            </p>
          </div>

          {/* Links */}
          <div className={styles.section}>
            <h3 className={styles.heading}>{t('footer.navigation')}</h3>
            <nav className={styles.links}>
              <Link href="/yugioh" className={styles.link}>
                {t('footer.search')}
              </Link>
              <Link href="/yugioh/coleccion" className={styles.link}>
                {t('footer.collection')}
              </Link>
              <Link href="/yugioh/venta" className={styles.link}>
                {t('footer.forSale')}
              </Link>
              <Link href="/yugioh/wishlist" className={styles.link}>
                {t('footer.wishlist')}
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className={styles.section}>
            <h3 className={styles.heading}>{t('footer.resources')}</h3>
            <div className={styles.links}>
              <a
                href="https://ygoprodeck.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                YGOPRODeck API ↗
              </a>
              <a
                href="https://www.tcgplayer.com/yugioh"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                TCGPlayer ↗
              </a>
              <Link
                href="/"
                className={styles.link}
              >
                {t('footer.backToHome')} ↗
              </Link>
            </div>
          </div>

          {/* Yu-Gi-Oh Logo */}
          <div className={styles.logoColumn}>
            <Image
              src="/images/yugioh-logo.svg"
              alt="Yu-Gi-Oh!"
              width={180}
              height={60}
              className={styles.yugiohLogo}
            />
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          <p>
            © {currentYear} <Link href="/" className={styles.homeLink}>avsolem</Link>. {t('footer.copyrightSuffix')}
          </p>
          <p className={styles.disclaimer}>
            {t('footer.disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
}
