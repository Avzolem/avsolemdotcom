import { Metadata } from 'next';
import CardList from '@/components/pokemon/CardList';

export const metadata: Metadata = {
  title: 'Mi Coleccion | Pokemon TCG Manager',
  description: 'Gestiona tu coleccion personal de cartas Pokemon TCG',
};

export default function ColeccionPage() {
  return <CardList type="collection" />;
}
