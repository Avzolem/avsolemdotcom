import { Metadata } from 'next';
import CardList from '@/components/yugioh/CardList';

export const metadata: Metadata = {
  title: 'Wishlist | Yu-Gi-Oh! Manager',
  description: 'Lista de cartas Yu-Gi-Oh! que deseas conseguir',
};

export default function WishlistPage() {
  return <CardList type="wishlist" />;
}
