import { Metadata } from 'next';
import DeckBuilder from '@/components/pokemon/DeckBuilder';

export const metadata: Metadata = {
  title: 'Deck Builder | Pokemon TCG Manager',
  description: 'Construye tu deck de Pokemon TCG',
};

export default async function DeckEditorPage({
  params,
}: {
  params: Promise<{ deckId: string }>;
}) {
  const { deckId } = await params;
  return <DeckBuilder deckId={deckId} />;
}
