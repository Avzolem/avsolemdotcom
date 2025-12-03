import '@/app/globals.css';

import classNames from "classnames";
import { headers } from 'next/headers';
import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';

import { Footer, Header, RouteGuard, Providers } from '@/components';
import { baseURL, effects, fonts, style, dataStyle, home } from '@/resources';
import { ClientWarningSuppress } from '@/components/ClientWarningSuppress';
import { ThemeBackground } from '@/components/ThemeBackground';
import styles from './layout.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: home.title,
    description: home.description,
    metadataBase: new URL(baseURL),
    alternates: {
      canonical: baseURL,
    },
    openGraph: {
      title: home.title,
      description: home.description,
      url: baseURL,
      siteName: home.title,
      images: [
        {
          url: home.image || `/api/og/generate?title=${encodeURIComponent(home.title)}`,
          width: 1200,
          height: 630,
          alt: home.title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: home.title,
      description: home.description,
      images: [home.image || `/api/og/generate?title=${encodeURIComponent(home.title)}`],
    },
    keywords: home.keywords,
    authors: [{ name: 'Andrés Aguilar', url: baseURL }],
    creator: 'Andrés Aguilar',
    publisher: 'Andrés Aguilar',
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || headersList.get('referer') || '';
  const isYugiohRoute = pathname.includes('/yugioh');
  const isRomsRoute = pathname.includes('/roms');

  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={classNames(
        fonts.heading.variable,
        fonts.body.variable,
        fonts.label.variable,
        fonts.code.variable,
      )}
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💾</text></svg>" />
        <link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💾</text></svg>" />
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const root = document.documentElement;

                  // Resolve theme
                  const resolveTheme = (themeValue) => {
                    if (!themeValue || themeValue === 'system') {
                      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    }
                    return themeValue;
                  };

                  // Apply saved theme
                  const savedTheme = localStorage.getItem('theme');
                  const resolvedTheme = resolveTheme(savedTheme);
                  root.setAttribute('data-theme', resolvedTheme);
                  if (resolvedTheme === 'dark') {
                    root.classList.add('dark');
                  } else {
                    root.classList.remove('dark');
                  }
                } catch (e) {
                  console.error('Failed to initialize theme:', e);
                  document.documentElement.setAttribute('data-theme', 'dark');
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="m-0 p-0 theme-transition bg-[var(--background)] text-[var(--foreground)] min-h-screen">
        <ClientWarningSuppress />
        <ThemeBackground />
        <Providers>
          <div className="flex flex-col items-center min-h-screen w-full relative z-[1]">
            {isYugiohRoute ? (
              children
            ) : isRomsRoute ? (
              <div className="w-full min-h-screen">
                {children}
              </div>
            ) : (
              <>
                <div className={`h-16 w-full ${styles.hideOnMobile}`} />
                <Header />
                <div className="flex-1 w-full flex justify-center p-4 lg:p-8">
                  <div className="flex justify-center w-full">
                    <RouteGuard>
                      {children}
                    </RouteGuard>
                  </div>
                </div>
                <Footer />
              </>
            )}
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
