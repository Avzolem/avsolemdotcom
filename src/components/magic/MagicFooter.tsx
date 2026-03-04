'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMagicLanguage } from '@/contexts/MagicLanguageContext';
import styles from './MagicFooter.module.scss';

export default function MagicFooter() {
  const { t } = useMagicLanguage();
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
              <Link href="/magic" className={styles.link}>
                {t('footer.search')}
              </Link>
              <Link href="/magic/coleccion" className={styles.link}>
                {t('footer.collection')}
              </Link>
              <Link href="/magic/venta" className={styles.link}>
                {t('footer.forSale')}
              </Link>
              <Link href="/magic/wishlist" className={styles.link}>
                {t('footer.wishlist')}
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className={styles.section}>
            <h3 className={styles.heading}>{t('footer.resources')}</h3>
            <div className={styles.links}>
              <a
                href="https://scryfall.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Scryfall API {'\u2197'}
              </a>
              <a
                href="https://www.tcgplayer.com/magic-the-gathering"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                TCGPlayer {'\u2197'}
              </a>
              <a
                href="https://www.cardmarket.com/en/Magic"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Cardmarket {'\u2197'}
              </a>
              <Link
                href="/"
                className={styles.link}
              >
                {t('footer.backToHome')} {'\u2197'}
              </Link>
            </div>
          </div>

          {/* Magic Logo Column */}
          <div className={styles.logoColumn}>
            <Image
              src="/images/tcg/magic-logo-footer.webp"
              alt="Magic: The Gathering"
              width={200}
              height={60}
              className={styles.magicLogo}
              unoptimized
            />
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          <p>
            &copy; {currentYear} <Link href="/" className={styles.homeLink}>avsolem</Link>. {t('footer.copyrightSuffix')}
          </p>
          <p className={styles.disclaimer}>
            Magic: The Gathering is a registered trademark of Wizards of the Coast, LLC.
          </p>
        </div>
      </div>
    </footer>
  );
}
