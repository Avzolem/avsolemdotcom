import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Diablo | Play Online',
  description: 'Play the classic Diablo 1 directly in your browser. Powered by DiabloWeb and DevilutionX.',
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
  return children;
}
