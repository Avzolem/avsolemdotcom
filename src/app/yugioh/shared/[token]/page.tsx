import { Metadata } from 'next';
import SharedListView from '@/components/yugioh/SharedListView';

export const metadata: Metadata = {
  title: 'Lista Compartida | Yu-Gi-Oh! Manager',
  description: 'Ver lista compartida de cartas Yu-Gi-Oh!',
};

export default function SharedListPage({ params }: { params: Promise<{ token: string }> }) {
  return <SharedListView params={params} />;
}
