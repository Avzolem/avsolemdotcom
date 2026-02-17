import { Metadata } from 'next';
import DeckList from '@/components/yugioh/DeckList';

export const metadata: Metadata = {
  title: 'Mis Decks | Yu-Gi-Oh! Manager',
  description: 'Crea y gestiona tus decks de Yu-Gi-Oh!',
};

export default function DecksPage() {
  return <DeckList />;
}
