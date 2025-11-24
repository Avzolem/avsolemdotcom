import '@once-ui-system/core/css/styles.css';
import '@once-ui-system/core/css/tokens.css';
import '@/resources/custom.css';
import './theme-overrides.css';
import './globals.css';

import classNames from "classnames";
import { headers } from 'next/headers';
import { Analytics } from '@vercel/analytics/react';

import { Background, Flex, Meta, opacity, SpacingToken } from "@once-ui-system/core";
import { Footer, Header, RouteGuard, Providers } from '@/components';
import { baseURL, effects, fonts, style, dataStyle, home } from '@/resources';
import { ClientWarningSuppress } from '@/components/ClientWarningSuppress';
import { ThemeBackground } from '@/components/ThemeBackground';
import styles from './layout.module.scss';

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
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
                  const defaultTheme = 'system';
                  
                  // Set defaults from config
                  const config = ${JSON.stringify({
                    brand: style.brand,
                    accent: style.accent,
                    neutral: style.neutral,
                    solid: style.solid,
                    'solid-style': style.solidStyle,
                    border: style.border,
                    surface: style.surface,
                    transition: style.transition,
                    scaling: style.scaling,
                    'viz-style': dataStyle.variant,
                  })};
                  
                  // Apply default values
                  Object.entries(config).forEach(([key, value]) => {
                    root.setAttribute('data-' + key, value);
                  });
                  
                  // Resolve theme
                  const resolveTheme = (themeValue) => {
                    if (!themeValue || themeValue === 'system') {
                      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    }
                    return themeValue;
                  };
                  
                  // Apply saved theme
                  const savedTheme = localStorage.getItem('data-theme');
                  const resolvedTheme = resolveTheme(savedTheme);
                  root.setAttribute('data-theme', resolvedTheme);
                  
                  // Apply any saved style overrides
                  const styleKeys = Object.keys(config);
                  styleKeys.forEach(key => {
                    const value = localStorage.getItem('data-' + key);
                    if (value) {
                      root.setAttribute('data-' + key, value);
                    }
                  });
                } catch (e) {
                  console.error('Failed to initialize theme:', e);
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body style={{margin: 0, padding: 0}} className="theme-transition">
        <ClientWarningSuppress />
        <ThemeBackground />
        <Providers>
          <Flex fillWidth as="div" background="transparent" style={{minHeight: "100vh", position: "relative", zIndex: 1}} direction="column" horizontal="center">
          <Background
            position="fixed"
            style={{pointerEvents: "none" as const}}
            mask={{
              x: effects.mask.x,
              y: effects.mask.y,
              radius: effects.mask.radius,
              cursor: effects.mask.cursor,
            }}
            gradient={{
              display: effects.gradient.display,
              opacity: effects.gradient.opacity as opacity,
              x: effects.gradient.x,
              y: effects.gradient.y,
              width: effects.gradient.width,
              height: effects.gradient.height,
              tilt: effects.gradient.tilt,
              colorStart: effects.gradient.colorStart,
              colorEnd: effects.gradient.colorEnd,
            }}
            dots={{
              display: effects.dots.display,
              opacity: effects.dots.opacity as opacity,
              size: effects.dots.size as SpacingToken,
              color: effects.dots.color,
            }}
            grid={{
              display: effects.grid.display,
              opacity: effects.grid.opacity as opacity,
              color: effects.grid.color,
              width: effects.grid.width,
              height: effects.grid.height,
            }}
            lines={{
              display: effects.lines.display,
              opacity: effects.lines.opacity as opacity,
              size: effects.lines.size as SpacingToken,
              thickness: effects.lines.thickness,
              angle: effects.lines.angle,
              color: effects.lines.color,
            }}
          />
          {isYugiohRoute ? (
            children
          ) : isRomsRoute ? (
            <div style={{ width: '100%', minHeight: '100vh' }}>
              {children}
            </div>
          ) : (
            <>
              <Flex fillWidth minHeight="16" className={styles.hideOnMobile}/>
              <Header />
              <Flex
                zIndex={0}
                fillWidth
                padding="l"
                horizontal="center"
                flex={1}
              >
                <Flex horizontal="center" fillWidth minHeight="0">
                  <RouteGuard>
                    {children}
                  </RouteGuard>
                </Flex>
              </Flex>
              <Footer/>
            </>
          )}
          </Flex>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
