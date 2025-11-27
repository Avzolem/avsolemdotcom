'use client';

import { SessionProvider } from 'next-auth/react';
import { YugiohLanguageProvider } from '@/contexts/YugiohLanguageContext';
import { YugiohAuthProvider } from '@/contexts/YugiohAuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import YugiohHeader from '@/components/yugioh/YugiohHeader';
import YugiohFooter from '@/components/yugioh/YugiohFooter';
import ToastContainer from '@/components/yugioh/ToastContainer';
import { Crimson_Text } from 'next/font/google';
import './yugioh-theme.scss';

const yugiohFont = Crimson_Text({
  weight: '700',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-yugioh',
});

export default function YugiohLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <YugiohLanguageProvider>
        <YugiohAuthProvider>
          <ToastProvider>
            <ToastContainer />
            <div className={`yugioh-layout ${yugiohFont.variable}`} suppressHydrationWarning>
              <YugiohHeader />
              <main className="yugioh-main">{children}</main>
              <YugiohFooter />
            </div>
          </ToastProvider>
        </YugiohAuthProvider>
      </YugiohLanguageProvider>
    </SessionProvider>
  );
}
