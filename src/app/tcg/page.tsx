'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './tcg.module.scss';

interface TCGame {
  name: string;
  slug: string;
  logo: string;
  logoWidth: number;
  logoHeight: number;
  href: string;
  accentColor: string;
  accentColorRGB: string;
  active: boolean;
  description: string;
}

const games: TCGame[] = [
  {
    name: 'Yu-Gi-Oh!',
    slug: 'yugioh',
    logo: '/images/yugioh-logo.svg',
    logoWidth: 280,
    logoHeight: 100,
    href: '/yugioh',
    accentColor: '#FFD700',
    accentColorRGB: '255, 215, 0',
    active: true,
    description: 'Search, collect & build decks',
  },
  {
    name: 'Pokémon TCG',
    slug: 'pokemon',
    logo: '/images/tcg/pokemon-logo.png',
    logoWidth: 280,
    logoHeight: 143,
    href: '/pokemon',
    accentColor: '#FFCB05',
    accentColorRGB: '255, 203, 5',
    active: true,
    description: 'Build decks & track your collection',
  },
  {
    name: 'Magic: The Gathering',
    slug: 'mtg',
    logo: '/images/tcg/mtg-logo.png',
    logoWidth: 280,
    logoHeight: 80,
    href: '/magic',
    accentColor: '#D4AF37',
    accentColorRGB: '212, 175, 55',
    active: true,
    description: 'Deck builder & card catalog',
  },
  {
    name: 'Digimon Card Game',
    slug: 'digimon',
    logo: '/images/tcg/digimon-logo.png',
    logoWidth: 280,
    logoHeight: 80,
    href: '/digimon',
    accentColor: '#0073CF',
    accentColorRGB: '0, 115, 207',
    active: false,
    description: 'Digital monster card manager',
  },
  {
    name: 'One Piece Card Game',
    slug: 'onepiece',
    logo: '/images/tcg/onepiece-logo.webp',
    logoWidth: 280,
    logoHeight: 100,
    href: '/onepiece',
    accentColor: '#D71920',
    accentColorRGB: '215, 25, 32',
    active: false,
    description: 'Pirate card battle manager',
  },
];

export default function TcgPage() {
  return (
    <div className={styles.page}>
      <div className={styles.bgPattern} />
      <div className={styles.bgGlow} />

      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← avsolem.com
        </Link>
        <h1 className={styles.title}>TCG Hub</h1>
        <p className={styles.subtitle}>
          Your portal to Trading Card Game managers
        </p>
      </header>

      <main className={styles.grid}>
        {games.map((game) => {
          const cardStyle = {
            '--accent': game.accentColor,
            '--accent-rgb': game.accentColorRGB,
          } as React.CSSProperties;

          if (game.active) {
            return (
              <Link
                key={game.slug}
                href={game.href}
                className={styles.gameCard}
                style={cardStyle}
              >
                <div className={styles.cardGlow} />
                <div className={styles.cardAccent} />
                <div className={styles.cardContent}>
                  <div className={styles.logoContainer}>
                    <Image
                      src={game.logo}
                      alt={game.name}
                      width={game.logoWidth}
                      height={game.logoHeight}
                      className={styles.gameLogo}
                      priority
                    />
                  </div>
                  <p className={styles.gameDescription}>{game.description}</p>
                </div>
              </Link>
            );
          }

          return (
            <div
              key={game.slug}
              className={`${styles.gameCard} ${styles.comingSoon}`}
              style={cardStyle}
            >
              <div className={styles.cardGlow} />
              <div className={styles.cardContent}>
                <div className={styles.logoContainer}>
                  <Image
                    src={game.logo}
                    alt={game.name}
                    width={game.logoWidth}
                    height={game.logoHeight}
                    className={styles.gameLogo}
                  />
                </div>
                <p className={styles.gameDescription}>{game.description}</p>
              </div>
              <div className={styles.comingSoonOverlay}>
                <span className={styles.comingSoonBadge}>Coming Soon</span>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
