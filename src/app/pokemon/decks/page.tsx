import { Metadata } from 'next';
import DeckList from '@/components/pokemon/DeckList';

export const metadata: Metadata = {
  title: 'Mis Decks | Pokemon TCG Manager',
  description: 'Crea y gestiona tus decks de Pokemon TCG',
};

export default function DecksPage() {
  return <DeckList />;
}
