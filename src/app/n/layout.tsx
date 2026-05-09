import type { Metadata } from 'next';
import { ForceDarkTheme } from '@/components/ForceDarkTheme';

export const metadata: Metadata = {
  title: 'notas',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

// Inline script renders into the HTML stream and executes synchronously while
// the browser parses, BEFORE any child content is painted. This prevents the
// brief flash of light theme that happened when ForceDarkTheme (a useEffect)
// only ran after hydration. ForceDarkTheme stays for client-side navigation
// (when arriving here via next/link, the script doesn't re-execute).
const FORCE_DARK_INLINE = `document.documentElement.setAttribute('data-theme','dark');document.documentElement.classList.add('dark');`;

export default function NoteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 antialiased">
      <script dangerouslySetInnerHTML={{ __html: FORCE_DARK_INLINE }} />
      <ForceDarkTheme />
      {children}
    </div>
  );
}
