'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePokemonLanguage } from '@/contexts/PokemonLanguageContext';
import styles from './PokemonFooter.module.scss';

export default function PokemonFooter() {
  const { t } = usePokemonLanguage();
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
              <Link href="/pokemon" className={styles.link}>
                {t('footer.search')}
              </Link>
              <Link href="/pokemon/coleccion" className={styles.link}>
                {t('footer.collection')}
              </Link>
              <Link href="/pokemon/venta" className={styles.link}>
                {t('footer.forSale')}
              </Link>
              <Link href="/pokemon/wishlist" className={styles.link}>
                {t('footer.wishlist')}
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className={styles.section}>
            <h3 className={styles.heading}>{t('footer.resources')}</h3>
            <div className={styles.links}>
              <a
                href="https://pokemontcg.io"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Pokemon TCG API ↗
              </a>
              <a
                href="https://www.tcgplayer.com/pokemon"
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

          {/* Pokemon Logo Column */}
          <div className={styles.logoColumn}>
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/The_Pok%C3%A9mon_Company_International_logo.svg/1280px-The_Pok%C3%A9mon_Company_International_logo.svg.png"
              alt="The Pokemon Company International"
              width={200}
              height={60}
              className={styles.pokemonLogo}
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
            Pokemon is a registered trademark of Nintendo, Creatures, Inc. and GAME FREAK, inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
