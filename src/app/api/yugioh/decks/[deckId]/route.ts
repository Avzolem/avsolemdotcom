import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import {
  getDeckById,
  updateDeckMeta,
  updateDeckCards,
  addCardToDeck,
  removeCardFromDeck,
  deleteDeck,
} from '@/lib/mongodb/models/YugiohDeck';
import { DeckZone } from '@/types/yugioh';

async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
}

// GET: Get a single deck
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ deckId: string }> }
) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { deckId } = await params;
    const deck = await getDeckById(deckId, userId);

    if (!deck) {
      return NextResponse.json({ message: 'Deck not found' }, { status: 404 });
    }

    return NextResponse.json({ deck });
  } catch (error) {
    console.error('Error fetching deck:', error);
    return NextResponse.json({ message: 'Failed to fetch deck' }, { status: 500 });
  }
}

// PUT: Update a deck (metadata, add/remove cards, or full card update)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ deckId: string }> }
) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { deckId } = await params;
    const body = await request.json();
    const { action } = body;

    if (action === 'addCard') {
      const { card, zone, quantity } = body;
      if (!card || !zone) {
        return NextResponse.json({ message: 'Card and zone are required' }, { status: 400 });
      }
      const result = await addCardToDeck(deckId, userId, card, zone as DeckZone, quantity || 1);
      if (!result.success) {
        return NextResponse.json({ message: result.error }, { status: 400 });
      }
      return NextResponse.json({ success: true });
    }

    if (action === 'removeCard') {
      const { cardId, zone } = body;
      if (!cardId || !zone) {
        return NextResponse.json({ message: 'CardId and zone are required' }, { status: 400 });
      }
      const success = await removeCardFromDeck(deckId, userId, cardId, zone as DeckZone);
      if (!success) {
        return NextResponse.json({ message: 'Card not found in deck' }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    }

    if (action === 'updateCards') {
      const { cards } = body;
      if (!Array.isArray(cards)) {
        return NextResponse.json({ message: 'Cards array is required' }, { status: 400 });
      }
      const success = await updateDeckCards(deckId, userId, cards);
      if (!success) {
        return NextResponse.json({ message: 'Deck not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    }

    // Default: update metadata
    const { name, description } = body;
    const success = await updateDeckMeta(deckId, userId, { name, description });
    if (!success) {
      return NextResponse.json({ message: 'Deck not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating deck:', error);
    return NextResponse.json({ message: 'Failed to update deck' }, { status: 500 });
  }
}

// DELETE: Delete a deck
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ deckId: string }> }
) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { deckId } = await params;
    const success = await deleteDeck(deckId, userId);

    if (!success) {
      return NextResponse.json({ message: 'Deck not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting deck:', error);
    return NextResponse.json({ message: 'Failed to delete deck' }, { status: 500 });
  }
}
