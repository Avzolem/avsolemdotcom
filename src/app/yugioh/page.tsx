import { Metadata } from 'next';
import CardSearch from '@/components/yugioh/CardSearch';

const baseURL = 'https://avsolem.com';

export const metadata: Metadata = {
  title: 'Yu-Gi-Oh! Card Manager | Avsolem',
  description:
    'Busca cartas de Yu-Gi-Oh!, gestiona tu colección, lista de venta y wishlist. Obtén información completa incluyendo estadísticas, descripción y precios actualizados.',
  keywords: 'Yu-Gi-Oh, cartas, colección, TCG, card manager, deck builder, precios, Avsolem',
  authors: [{ name: 'Andrés Aguilar', url: baseURL }],
  openGraph: {
    title: 'Yu-Gi-Oh! Card Manager | Avsolem',
    description: 'Gestiona tu colección de cartas Yu-Gi-Oh! - Busca, organiza y comparte tu colección.',
    url: `${baseURL}/yugioh`,
    siteName: 'Avsolem',
    images: [
      {
        url: `${baseURL}/images/og/yugioh.png`,
        width: 1200,
        height: 630,
        alt: 'Yu-Gi-Oh! Card Manager',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yu-Gi-Oh! Card Manager | Avsolem',
    description: 'Gestiona tu colección de cartas Yu-Gi-Oh! - Busca, organiza y comparte tu colección.',
    images: [`${baseURL}/images/og/yugioh.png`],
  },
};

export default function YugiohPage() {
  return <CardSearch />;
}
