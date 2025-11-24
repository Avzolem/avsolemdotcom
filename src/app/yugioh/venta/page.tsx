import { Metadata } from 'next';
import CardList from '@/components/yugioh/CardList';

export const metadata: Metadata = {
  title: 'Cartas en Venta | Yu-Gi-Oh! Manager',
  description: 'Gestiona tus cartas Yu-Gi-Oh! disponibles para venta',
};

export default function VentaPage() {
  return <CardList type="for-sale" />;
}
