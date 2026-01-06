'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { RouteGuard } from './RouteGuard';

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isYugiohRoute = pathname?.startsWith('/yugioh');
  const isRomsRoute = pathname?.startsWith('/roms');
  const isCloudRoute = pathname?.startsWith('/cloud');

  // Yu-Gi-Oh, ROMs, and Cloud have their own layouts - no header/footer
  if (isYugiohRoute || isRomsRoute || isCloudRoute) {
    return (
      <div className="w-full min-h-screen">
        {children}
      </div>
    );
  }

  // Default layout with header and footer
  return (
    <>
      <Header />
      <div className="flex-1 w-full flex justify-center p-4 lg:p-8 pt-20 lg:pt-24">
        <div className="flex justify-center w-full">
          <RouteGuard>
            {children}
          </RouteGuard>
        </div>
      </div>
      <Footer />
    </>
  );
}
