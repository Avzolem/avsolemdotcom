import { Metadata } from 'next';
import CardList from '@/components/yugioh/CardList';

export const metadata: Metadata = {
  title: 'Mi Colección | Yu-Gi-Oh! Manager',
  description: 'Gestiona tu colección personal de cartas Yu-Gi-Oh!',
};

export default function ColeccionPage() {
  return <CardList type="collection" title="Mi Colección" />;
}
