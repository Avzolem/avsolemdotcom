'use client';

import { SessionProvider } from 'next-auth/react';
import { MagicLanguageProvider } from '@/contexts/MagicLanguageContext';
import { MagicAuthProvider } from '@/contexts/MagicAuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import MagicHeader from '@/components/magic/MagicHeader';
import MagicFooter from '@/components/magic/MagicFooter';
import ToastContainer from '@/components/magic/ToastContainer';
import './magic-theme.scss';

export default function MagicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <MagicLanguageProvider>
        <MagicAuthProvider>
          <ToastProvider>
            <ToastContainer />
            <div className="magic-layout" suppressHydrationWarning>
              <MagicHeader />
              <main className="magic-main">{children}</main>
              <MagicFooter />
            </div>
          </ToastProvider>
        </MagicAuthProvider>
      </MagicLanguageProvider>
    </SessionProvider>
  );
}
