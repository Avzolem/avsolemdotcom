import { Metadata } from 'next';
import CardSearch from '@/components/magic/CardSearch';

const baseURL = 'https://avsolem.com';

export const metadata: Metadata = {
  title: 'Magic: The Gathering Manager | Avsolem',
  description:
    'Busca cartas de Magic: The Gathering, gestiona tu coleccion, lista de venta y wishlist. Obtien informacion completa incluyendo precios de Scryfall actualizados.',
  keywords: 'Magic, MTG, The Gathering, cartas, coleccion, card manager, deck builder, precios, Scryfall, Avsolem',
  authors: [{ name: 'Andres Aguilar', url: baseURL }],
  openGraph: {
    title: 'Magic: The Gathering Manager | Avsolem',
    description: 'Gestiona tu coleccion de cartas Magic: The Gathering - Busca, organiza y comparte tu coleccion.',
    url: `${baseURL}/magic`,
    siteName: 'Avsolem',
    images: [
      {
        url: `${baseURL}/images/og/magic.png`,
        width: 1200,
        height: 630,
        alt: 'Magic: The Gathering Manager',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Magic: The Gathering Manager | Avsolem',
    description: 'Gestiona tu coleccion de cartas Magic: The Gathering - Busca, organiza y comparte tu coleccion.',
    images: [`${baseURL}/images/og/magic.png`],
  },
};

export default function MagicPage() {
  return <CardSearch />;
}
