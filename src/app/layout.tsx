import '@/app/globals.css';

import classNames from "classnames";
import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';

import { Providers } from '@/components';
import { baseURL, fonts, home } from '@/resources';
import { ThemeBackground } from '@/components/ThemeBackground';
import { LayoutContent } from '@/components/LayoutContent';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <ThemeBackground />
        <Providers>
          <div className="flex flex-col items-center min-h-screen w-full relative z-[1]">
            <LayoutContent>{children}</LayoutContent>
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
