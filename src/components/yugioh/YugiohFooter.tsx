'use client';

import Link from 'next/link';
import styles from './YugiohFooter.module.scss';

export default function YugiohFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* About */}
          <div className={styles.section}>
            <h3 className={styles.heading}>Yu-Gi-Oh! Manager</h3>
            <p className={styles.text}>
              Gestiona tu colección de cartas, encuentra precios actualizados y
              organiza tus listas de forma fácil y rápida.
            </p>
          </div>

          {/* Links */}
          <div className={styles.section}>
            <h3 className={styles.heading}>Navegación</h3>
            <nav className={styles.links}>
              <Link href="/yugioh" className={styles.link}>
                Buscar Cartas
              </Link>
              <Link href="/yugioh/coleccion" className={styles.link}>
                Mi Colección
              </Link>
              <Link href="/yugioh/venta" className={styles.link}>
                En Venta
              </Link>
              <Link href="/yugioh/wishlist" className={styles.link}>
                Wishlist
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className={styles.section}>
            <h3 className={styles.heading}>Recursos</h3>
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
              <a
                href="/"
                className={styles.link}
              >
                Volver al Inicio ↗
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          <p>
            © {currentYear} Andrés Aguilar. Construido con ❤️ para coleccionistas.
          </p>
          <p className={styles.disclaimer}>
            Yu-Gi-Oh! es una marca registrada de Konami. Este sitio no está
            afiliado con Konami.
          </p>
        </div>
      </div>
    </footer>
  );
}
