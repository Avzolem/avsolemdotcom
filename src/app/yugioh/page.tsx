import { Metadata } from 'next';
import CardSearch from '@/components/yugioh/CardSearch';

export const metadata: Metadata = {
  title: 'Yu-Gi-Oh! Card Search | Avsolem',
  description:
    'Busca cartas de Yu-Gi-Oh! y obtén información completa incluyendo estadísticas, descripción y precios actualizados.',
};

export default function YugiohPage() {
  return <CardSearch />;
}
