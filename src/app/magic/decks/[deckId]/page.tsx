import { Metadata } from 'next';
import DeckBuilder from '@/components/magic/DeckBuilder';

export const metadata: Metadata = {
  title: 'Deck Builder | Magic: The Gathering Manager',
  description: 'Construye tu deck de Magic: The Gathering',
};

export default async function DeckEditorPage({
  params,
}: {
  params: Promise<{ deckId: string }>;
}) {
  const { deckId } = await params;
  return <DeckBuilder deckId={deckId} />;
}
