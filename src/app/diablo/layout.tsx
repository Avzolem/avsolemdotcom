import { Metadata } from 'next';
import { Cinzel_Decorative } from 'next/font/google';

const cinzelDecorative = Cinzel_Decorative({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-diablo',
});

export const metadata: Metadata = {
  title: 'Diablo | Play Online',
  description: 'Play the classic Diablo 1 directly in your browser. Powered by Avsolem and DevilutionX.',
  openGraph: {
    title: 'Diablo | Play Online',
    description: 'Play the classic Diablo 1 directly in your browser',
    type: 'website',
  },
};

export default function DiabloLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={cinzelDecorative.variable}>
      {children}
    </div>
  );
}
