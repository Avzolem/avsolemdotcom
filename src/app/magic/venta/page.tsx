import { Metadata } from 'next';
import CardList from '@/components/magic/CardList';

export const metadata: Metadata = {
  title: 'Cartas en Venta | Magic: The Gathering Manager',
  description: 'Gestiona tus cartas Magic: The Gathering disponibles para venta',
};

export default function VentaPage() {
  return <CardList type="for-sale" />;
}
