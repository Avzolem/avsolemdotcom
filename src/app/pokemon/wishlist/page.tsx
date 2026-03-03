import { Metadata } from 'next';
import CardList from '@/components/pokemon/CardList';

export const metadata: Metadata = {
  title: 'Wishlist | Pokemon TCG Manager',
  description: 'Lista de cartas Pokemon TCG que deseas conseguir',
};

export default function WishlistPage() {
  return <CardList type="wishlist" />;
}
