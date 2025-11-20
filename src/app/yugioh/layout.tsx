'use client';

import { YugiohAuthProvider } from '@/contexts/YugiohAuthContext';
import YugiohHeader from '@/components/yugioh/YugiohHeader';
import YugiohFooter from '@/components/yugioh/YugiohFooter';
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
    <YugiohAuthProvider>
      <div className={`yugioh-layout ${yugiohFont.variable}`} suppressHydrationWarning>
        <YugiohHeader />
        <main className="yugioh-main">{children}</main>
        <YugiohFooter />
      </div>
    </YugiohAuthProvider>
  );
}
