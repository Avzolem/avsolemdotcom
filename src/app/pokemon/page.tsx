import { Metadata } from 'next';
import CardSearch from '@/components/pokemon/CardSearch';

const baseURL = 'https://avsolem.com';

export const metadata: Metadata = {
  title: 'Pokemon TCG Manager | Avsolem',
  description:
    'Busca cartas de Pokemon TCG, gestiona tu coleccion, lista de venta y wishlist. Obtien informacion completa incluyendo estadisticas, descripcion y precios actualizados.',
  keywords: 'Pokemon, TCG, cartas, coleccion, card manager, deck builder, precios, Avsolem',
  authors: [{ name: 'Andres Aguilar', url: baseURL }],
  openGraph: {
    title: 'Pokemon TCG Manager | Avsolem',
    description: 'Gestiona tu coleccion de cartas Pokemon TCG - Busca, organiza y comparte tu coleccion.',
    url: `${baseURL}/pokemon`,
    siteName: 'Avsolem',
    images: [
      {
        url: `${baseURL}/images/og/pokemon.png`,
        width: 1200,
        height: 630,
        alt: 'Pokemon TCG Manager',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokemon TCG Manager | Avsolem',
    description: 'Gestiona tu coleccion de cartas Pokemon TCG - Busca, organiza y comparte tu coleccion.',
    images: [`${baseURL}/images/og/pokemon.png`],
  },
};

export default function PokemonPage() {
  return <CardSearch />;
}
