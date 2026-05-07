'use client';

import { SessionProvider } from 'next-auth/react';
import { PokemonLanguageProvider } from '@/contexts/PokemonLanguageContext';
import { PokemonAuthProvider } from '@/contexts/PokemonAuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import PokemonHeader from '@/components/pokemon/PokemonHeader';
import PokemonFooter from '@/components/pokemon/PokemonFooter';
import ToastContainer from '@/components/pokemon/ToastContainer';
import { ForceDarkTheme } from '@/components/ForceDarkTheme';
import './pokemon-theme.scss';

export default function PokemonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <PokemonLanguageProvider>
        <PokemonAuthProvider>
          <ToastProvider>
            <ForceDarkTheme />
            <ToastContainer />
            <div className="pokemon-layout" suppressHydrationWarning>
              <PokemonHeader />
              <main className="pokemon-main">{children}</main>
              <PokemonFooter />
            </div>
          </ToastProvider>
        </PokemonAuthProvider>
      </PokemonLanguageProvider>
    </SessionProvider>
  );
}
