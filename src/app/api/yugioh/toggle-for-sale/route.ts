import { NextRequest, NextResponse } from 'next/server';
import * as cookie from 'cookie';
import {
  getOrCreateList,
  addCardToList,
  removeCardFromList,
  updateCardField,
} from '@/lib/mongodb/models/YugiohList';

function isAuthenticated(request: NextRequest): boolean {
  const cookies = cookie.parse(request.headers.get('cookie') || '');
  return cookies.yugioh_auth === 'authenticated';
}

/**
 * POST: Toggle el estado isForSale de una carta en Colección
 * Si isForSale pasa a true → agrega a for-sale
 * Si isForSale pasa a false → elimina de for-sale
 */
export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { setCode } = await request.json();

    if (!setCode) {
      return NextResponse.json({ message: 'Set code required' }, { status: 400 });
    }

    // Get collection list
    const collectionList = await getOrCreateList('collection');
    const card = collectionList.cards.find((c) => c.setCode === setCode);

    if (!card) {
      return NextResponse.json(
        { message: 'Card not found in collection' },
        { status: 404 }
      );
    }

    // Toggle isForSale
    const newIsForSale = !card.isForSale;

    // Update in collection
    await updateCardField('collection', setCode, 'isForSale', newIsForSale);

    // Sync with for-sale list
    if (newIsForSale) {
      // Add to for-sale list
      await addCardToList('for-sale', {
        cardId: card.cardId,
        cardName: card.cardName,
        cardImage: card.cardImage,
        localImagePath: card.localImagePath,
        setCode: card.setCode,
        setName: card.setName,
        setRarity: card.setRarity,
        quantity: card.quantity,
        price: card.price,
        notes: card.notes,
      });
    } else {
      // Remove from for-sale list
      await removeCardFromList('for-sale', setCode);
    }

    // Get updated collection
    const updatedCollection = await getOrCreateList('collection');
    const updatedCard = updatedCollection.cards.find((c) => c.setCode === setCode);

    return NextResponse.json({
      success: true,
      isForSale: newIsForSale,
      card: updatedCard,
    });
  } catch (error) {
    console.error('Error toggling for-sale status:', error);
    return NextResponse.json(
      { message: 'Failed to toggle for-sale status' },
      { status: 500 }
    );
  }
}
