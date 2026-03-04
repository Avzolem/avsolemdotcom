import { Metadata } from 'next';
import CardList from '@/components/magic/CardList';

export const metadata: Metadata = {
  title: 'Wishlist | Magic: The Gathering Manager',
  description: 'Lista de cartas Magic: The Gathering que deseas conseguir',
};

export default function WishlistPage() {
  return <CardList type="wishlist" />;
}
