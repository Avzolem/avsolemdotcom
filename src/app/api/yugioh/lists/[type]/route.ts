import { NextRequest, NextResponse } from 'next/server';
import * as cookie from 'cookie';
import { ListType } from '@/types/yugioh';
import {
  getOrCreateList,
  addCardToList,
  removeCardFromList,
  updateCardQuantity,
  updateCardDetails,
  updateCardField,
  clearList,
  getListValue,
} from '@/lib/mongodb/models/YugiohList';

function isAuthenticated(request: NextRequest): boolean {
  const cookies = cookie.parse(request.headers.get('cookie') || '');
  return cookies.yugioh_auth === 'authenticated';
}

function validateListType(type: string): type is ListType {
  return ['collection', 'for-sale', 'wishlist'].includes(type);
}

// GET: Get all cards from a list
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;

    if (!validateListType(type)) {
      return NextResponse.json({ message: 'Invalid list type' }, { status: 400 });
    }

    const list = await getOrCreateList(type);
    const totalValue = await getListValue(type);

    return NextResponse.json({
      list,
      totalValue,
    });
  } catch (error) {
    console.error('Error fetching list:', error);
    return NextResponse.json(
      { message: 'Failed to fetch list' },
      { status: 500 }
    );
  }
}

// POST: Add a card to a list
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { type } = await params;

    if (!validateListType(type)) {
      return NextResponse.json({ message: 'Invalid list type' }, { status: 400 });
    }

    const body = await request.json();
    const { cardId, cardName, cardImage, localImagePath, setCode, setName, setRarity, quantity, price, notes } = body;

    if (!cardId || !cardName || !cardImage || !setCode || !setName || !setRarity) {
      return NextResponse.json(
        { message: 'Missing required fields (cardId, cardName, cardImage, setCode, setName, setRarity required)' },
        { status: 400 }
      );
    }

    // Add to the requested list
    await addCardToList(type, {
      cardId,
      cardName,
      cardImage,
      localImagePath,
      setCode,
      setName,
      setRarity,
      quantity: quantity || 1,
      price,
      notes,
    });

    // If adding to for-sale, also add to collection with isForSale: true
    if (type === 'for-sale') {
      // Check if card already exists in collection
      const collection = await getOrCreateList('collection');
      const existingCard = collection.cards.find((c) => c.setCode === setCode);

      if (existingCard) {
        // Update isForSale to true
        await updateCardField('collection', setCode, 'isForSale', true);
      } else {
        // Add to collection with isForSale: true
        await addCardToList('collection', {
          cardId,
          cardName,
          cardImage,
          localImagePath,
          setCode,
          setName,
          setRarity,
          quantity: quantity || 1,
          price,
          notes,
          isForSale: true,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding card to list:', error);
    return NextResponse.json(
      { message: 'Failed to add card' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a card from a list
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { type } = await params;

    if (!validateListType(type)) {
      return NextResponse.json({ message: 'Invalid list type' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const setCode = searchParams.get('setCode');

    if (!setCode) {
      return NextResponse.json(
        { message: 'Set Code required' },
        { status: 400 }
      );
    }

    const deletedFrom: ListType[] = [type];

    // Get card info before deleting (for the response)
    const list = await getOrCreateList(type);
    const card = list.cards.find((c) => c.setCode === setCode);

    // Remove from the requested list
    await removeCardFromList(type, setCode);

    // Bidirectional sync logic
    if (type === 'for-sale') {
      // If deleting from for-sale, update isForSale to false in collection
      const collection = await getOrCreateList('collection');
      const cardInCollection = collection.cards.find((c) => c.setCode === setCode);

      if (cardInCollection) {
        await updateCardField('collection', setCode, 'isForSale', false);
      }
    } else if (type === 'collection') {
      // If deleting from collection, also remove from for-sale if it exists there
      const forSaleList = await getOrCreateList('for-sale');
      const cardInForSale = forSaleList.cards.find((c) => c.setCode === setCode);

      if (cardInForSale) {
        await removeCardFromList('for-sale', setCode);
        deletedFrom.push('for-sale');
      }
    }

    return NextResponse.json({
      success: true,
      deletedFrom,
      cardName: card?.cardName,
      setCode,
    });
  } catch (error) {
    console.error('Error removing card from list:', error);
    return NextResponse.json(
      { message: 'Failed to remove card' },
      { status: 500 }
    );
  }
}

// PATCH: Update card quantity or details
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { type } = await params;

    if (!validateListType(type)) {
      return NextResponse.json({ message: 'Invalid list type' }, { status: 400 });
    }

    const body = await request.json();
    const { setCode, quantity, price, notes } = body;

    if (!setCode) {
      return NextResponse.json(
        { message: 'Set Code required' },
        { status: 400 }
      );
    }

    if (quantity !== undefined) {
      await updateCardQuantity(type, setCode, quantity);
    }

    if (price !== undefined || notes !== undefined) {
      await updateCardDetails(type, setCode, { price, notes });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating card:', error);
    return NextResponse.json(
      { message: 'Failed to update card' },
      { status: 500 }
    );
  }
}
