import { Metadata } from 'next';
import DeckBuilder from '@/components/yugioh/DeckBuilder';

export const metadata: Metadata = {
  title: 'Deck Builder | Yu-Gi-Oh! Manager',
  description: 'Construye tu deck de Yu-Gi-Oh!',
};

export default async function DeckEditorPage({
  params,
}: {
  params: Promise<{ deckId: string }>;
}) {
  const { deckId } = await params;
  return <DeckBuilder deckId={deckId} />;
}
