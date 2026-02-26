"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./roms.module.scss";

interface Console {
  name: string;
  year: number;
  image: string;
  url: string;
}

interface Company {
  name: string;
  consoles: Console[];
}

const companies: Company[] = [
  {
    name: "Nintendo",
    consoles: [
      { name: "NES", year: 1983, image: "/images/consoles/Nintendo Entertainment System.png", url: "https://myrient.erista.me/files/No-Intro/Nintendo%20-%20Nintendo%20Entertainment%20System%20(Headered)/" },
      { name: "Game Boy", year: 1989, image: "/images/consoles/Nintendo Game Boy.png", url: "https://myrient.erista.me/files/No-Intro/Nintendo%20-%20Game%20Boy/" },
      { name: "SNES", year: 1990, image: "/images/consoles/Super Nintendo Entertainment System.png", url: "https://myrient.erista.me/files/No-Intro/Nintendo%20-%20Super%20Nintendo%20Entertainment%20System/" },
      { name: "Virtual Boy", year: 1995, image: "/images/consoles/Nintendo Virtual Boy.png", url: "https://myrient.erista.me/files/No-Intro/Nintendo%20-%20Virtual%20Boy/" },
      { name: "Nintendo 64", year: 1996, image: "/images/consoles/Nintendo 64.png", url: "https://myrient.erista.me/files/No-Intro/Nintendo%20-%20Nintendo%2064%20(BigEndian)/" },
      { name: "Game Boy Color", year: 1998, image: "/images/consoles/Nintendo Game Boy Color.png", url: "https://myrient.erista.me/files/No-Intro/Nintendo%20-%20Game%20Boy%20Color/" },
      { name: "Game Boy Advance", year: 2001, image: "/images/consoles/Nintendo Game Boy Advance.png", url: "https://myrient.erista.me/files/No-Intro/Nintendo%20-%20Game%20Boy%20Advance/" },
      { name: "GameCube", year: 2001, image: "/images/consoles/Nintendo GameCube.png", url: "https://myrient.erista.me/files/Redump/Nintendo%20-%20GameCube%20-%20NKit%20RVZ%20[zstd-19-128k]/" },
      { name: "Nintendo DS", year: 2004, image: "/images/consoles/Nintendo DS.png", url: "https://myrient.erista.me/files/No-Intro/Nintendo%20-%20Nintendo%20DS%20(Decrypted)/" },
      { name: "Wii", year: 2006, image: "/images/consoles/Nintendo Wii.png", url: "https://myrient.erista.me/files/Redump/Nintendo%20-%20Wii%20-%20NKit%20RVZ%20[zstd-19-128k]/" },
      { name: "Nintendo 3DS", year: 2011, image: "/images/consoles/Nintendo 3DS.png", url: "https://myrient.erista.me/files/No-Intro/Nintendo%20-%20Nintendo%203DS%20(Decrypted)/" },
      { name: "Wii U", year: 2012, image: "/images/consoles/Nintendo Wii U.png", url: "https://myrient.erista.me/files/Internet%20Archive/teamgt19/nintendo-wii-u-usa-full-set-wua-format-embedded-dlc-updates/" },
      { name: "Nintendo Switch", year: 2017, image: "/images/consoles/Nintendo Switch.png", url: "https://romslab.com/" },
      { name: "Nintendo Switch Alter 1", year: 2017, image: "/images/consoles/Nintendo Switch.png", url: "https://nswgame.com/" },
      { name: "Nintendo Switch Alter 2", year: 2017, image: "/images/consoles/Nintendo Switch.png", url: "https://eggnsemulator.com/nintendo-switch-roms/" },
      { name: "Nintendo Switch Alter 3", year: 2017, image: "/images/consoles/Nintendo Switch.png", url: "https://nxbrew.net/" },
    ],
  },
  {
    name: "Sony PlayStation",
    consoles: [
      { name: "PlayStation", year: 1994, image: "/images/consoles/Sony Playstation.png", url: "https://myrient.erista.me/files/Redump/Sony%20-%20PlayStation/" },
      { name: "PlayStation 2", year: 2000, image: "/images/consoles/Sony Playstation 2.png", url: "https://myrient.erista.me/files/Redump/Sony%20-%20PlayStation%202/" },
      { name: "PSP", year: 2004, image: "/images/consoles/Sony PSP.png", url: "https://myrient.erista.me/files/Redump/Sony%20-%20PlayStation%20Portable/" },
      { name: "PlayStation 3", year: 2006, image: "/images/consoles/Sony Playstation 3.png", url: "https://myrient.erista.me/files/Redump/Sony%20-%20PlayStation%203/" },
      { name: "PS Vita", year: 2011, image: "/images/consoles/Sony PS Vita.png", url: "https://myrient.erista.me/files/No-Intro/Sony%20-%20PlayStation%20Vita%20(PSN)%20(Content)/" },
      { name: "PlayStation 4", year: 2013, image: "/images/consoles/Sony Playstation 4.png", url: "https://romsfun.com/roms/playstation-4/" },
    ],
  },
  {
    name: "Microsoft",
    consoles: [
      { name: "Xbox", year: 2001, image: "/images/consoles/Microsoft Xbox.png", url: "https://myrient.erista.me/files/Redump/Microsoft%20-%20Xbox/" },
      { name: "Xbox 360", year: 2005, image: "/images/consoles/Microsoft Xbox 360.png", url: "https://myrient.erista.me/files/Redump/Microsoft%20-%20Xbox%20360/" },
    ],
  },
  {
    name: "Sega",
    consoles: [
      { name: "Dreamcast", year: 1998, image: "/images/consoles/Sega Dreamcast.png", url: "https://myrient.erista.me/files/Redump/Sega%20-%20Dreamcast/" },
      { name: "Sega Saturn", year: 1994, image: "/images/consoles/Sega Saturn.png", url: "https://myrient.erista.me/files/Redump/Sega%20-%20Saturn/" },
    ],
  },
];

export default function RomsPage() {
  return (
    <div className={styles.page}>
      <Link href="/" className={styles.backButton}>
        Regresar a avsolem.com
      </Link>
      <div className={styles.container}>
        <h1 className={styles.title}>💾 ROMS INDEX</h1>

        {companies.map((company) => (
          <section key={company.name} className={styles.section}>
            {company.name === "Nintendo" ? (
              <div className={styles.companyTitleLogo}>
                <Image
                  src="/images/nintendo-logo.svg"
                  alt="Nintendo"
                  width={300}
                  height={80}
                  className={styles.nintendoLogo}
                />
              </div>
            ) : company.name === "Sony PlayStation" ? (
              <div className={styles.companyTitleLogo}>
                <Image
                  src="/images/playstation-logo.svg"
                  alt="PlayStation"
                  width={300}
                  height={80}
                  className={styles.playstationLogo}
                />
              </div>
            ) : company.name === "Microsoft" ? (
              <div className={styles.companyTitleLogo}>
                <Image
                  src="/images/microsoft-logo.svg"
                  alt="Microsoft"
                  width={300}
                  height={80}
                  className={styles.microsoftLogo}
                />
              </div>
            ) : company.name === "Sega" ? (
              <div className={styles.companyTitleLogo}>
                <Image
                  src="/images/sega-logo.svg"
                  alt="Sega"
                  width={300}
                  height={80}
                  className={styles.segaLogo}
                />
              </div>
            ) : (
              <h2 className={styles.companyTitle}>{company.name}</h2>
            )}

            <div className={styles.grid}>
              {company.consoles.map((console) => (
                <div key={`${company.name}-${console.name}`} className={styles.consoleCard}>
                  <a href={console.url} target="_blank" rel="noopener noreferrer" className={styles.consoleButton}>
                    <Image
                      src={console.image}
                      alt={console.name}
                      fill
                      className={styles.consoleImage}
                      loading="lazy"
                      sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 180px"
                    />
                  </a>
                  <div className={styles.consoleInfo}>
                    <h3 className={styles.consoleName}>{console.name}</h3>
                    <span className={styles.consoleYear}>{console.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className={styles.fanTranslateSection}>
          <h2 className={styles.fanTranslateTitle}>Fan Translate Roms</h2>
          <a
            href="https://tradusquare.es/traducciones/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.fanTranslateButton}
          >
            <Image
              src="/images/consoles/fan-translate.png"
              alt="Fan Translate"
              fill
              className={styles.translateImage}
              loading="lazy"
              sizes="180px"
            />
          </a>
        </section>
      </div>
    </div>
  );
}
