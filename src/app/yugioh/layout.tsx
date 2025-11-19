'use client';

import { YugiohAuthProvider } from '@/contexts/YugiohAuthContext';
import YugiohHeader from '@/components/yugioh/YugiohHeader';
import YugiohFooter from '@/components/yugioh/YugiohFooter';
import './yugioh-theme.scss';

export default function YugiohLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <YugiohAuthProvider>
      <div className="yugioh-layout" suppressHydrationWarning>
        <YugiohHeader />
        <main className="yugioh-main">{children}</main>
        <YugiohFooter />
      </div>
    </YugiohAuthProvider>
  );
}
