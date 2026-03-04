import { Metadata } from 'next';
import DeckList from '@/components/magic/DeckList';

export const metadata: Metadata = {
  title: 'Mis Decks | Magic: The Gathering Manager',
  description: 'Crea y gestiona tus decks de Magic: The Gathering',
};

export default function DecksPage() {
  return <DeckList />;
}
