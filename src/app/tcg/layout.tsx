import { Metadata } from 'next';
import { ForceDarkTheme } from '@/components/ForceDarkTheme';

export const metadata: Metadata = {
  title: 'TCG Hub | Trading Card Games',
  description: 'Your portal to Trading Card Game managers. Yu-Gi-Oh!, Pokémon TCG, Magic: The Gathering, Digimon, One Piece and more.',
  openGraph: {
    title: 'TCG Hub | Trading Card Games',
    description: 'Your portal to Trading Card Game managers',
    url: 'https://avsolem.com/tcg',
    siteName: 'Avsolem',
    type: 'website',
  },
};

export default function TcgLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ForceDarkTheme />
      {children}
    </>
  );
}
