import { Metadata } from 'next';
import CardList from '@/components/magic/CardList';

export const metadata: Metadata = {
  title: 'Mi Coleccion | Magic: The Gathering Manager',
  description: 'Gestiona tu coleccion personal de cartas Magic: The Gathering',
};

export default function ColeccionPage() {
  return <CardList type="collection" />;
}
