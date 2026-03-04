import { Metadata } from 'next';
import SharedListView from '@/components/magic/SharedListView';

export const metadata: Metadata = {
  title: 'Shared List | Magic: The Gathering Manager',
  description: 'View shared Magic: The Gathering card list',
};

export default function SharedListPage({ params }: { params: Promise<{ token: string }> }) {
  return <SharedListView params={params} />;
}
