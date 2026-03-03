import { Metadata } from 'next';
import SharedListView from '@/components/pokemon/SharedListView';

export const metadata: Metadata = {
  title: 'Lista Compartida | Pokemon TCG Manager',
  description: 'Ver lista compartida de cartas Pokemon TCG',
};

export default function SharedListPage({ params }: { params: Promise<{ token: string }> }) {
  return <SharedListView params={params} />;
}
