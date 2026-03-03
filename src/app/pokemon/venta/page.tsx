import { Metadata } from 'next';
import CardList from '@/components/pokemon/CardList';

export const metadata: Metadata = {
  title: 'Cartas en Venta | Pokemon TCG Manager',
  description: 'Gestiona tus cartas Pokemon TCG disponibles para venta',
};

export default function VentaPage() {
  return <CardList type="for-sale" />;
}
