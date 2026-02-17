import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { getUserDecks, createDeck } from '@/lib/mongodb/models/YugiohDeck';

// GET: List all decks for the authenticated user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ decks: [] });
    }

    const decks = await getUserDecks(userId);
    return NextResponse.json({ decks });
  } catch (error) {
    console.error('Error fetching decks:', error);
    return NextResponse.json({ message: 'Failed to fetch decks' }, { status: 500 });
  }
}

// POST: Create a new deck
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, description } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ message: 'Deck name is required' }, { status: 400 });
    }

    const result = await createDeck(userId, name.trim(), description?.trim());

    if ('error' in result) {
      return NextResponse.json({ message: result.error }, { status: 400 });
    }

    return NextResponse.json({ deck: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating deck:', error);
    return NextResponse.json({ message: 'Failed to create deck' }, { status: 500 });
  }
}
