import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import {
  getOrCreateList,
  addCardToList,
  removeCardFromList,
  updateCardField,
} from '@/lib/mongodb/models/YugiohList';

/**
 * POST: Toggle el estado isForSale de una carta en Colección
 * Si isForSale pasa a true → agrega a for-sale
 * Si isForSale pasa a false → elimina de for-sale
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { setCode } = await request.json();

    if (!setCode) {
      return NextResponse.json({ message: 'Set code required' }, { status: 400 });
    }

    // Get collection list
    const collectionList = await getOrCreateList('collection', userId);
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
    await updateCardField('collection', userId, setCode, 'isForSale', newIsForSale);

    // Sync with for-sale list
    if (newIsForSale) {
      // Add to for-sale list
      await addCardToList('for-sale', userId, {
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
      await removeCardFromList('for-sale', userId, setCode);
    }

    // Get updated collection
    const updatedCollection = await getOrCreateList('collection', userId);
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
