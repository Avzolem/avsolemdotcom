import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'notas',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function NoteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 antialiased">
      {children}
    </div>
  );
}
