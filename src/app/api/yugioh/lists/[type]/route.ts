import { NextRequest, NextResponse } from 'next/server';
import * as cookie from 'cookie';
import { ListType } from '@/types/yugioh';
import {
  getOrCreateList,
  addCardToList,
  removeCardFromList,
  updateCardQuantity,
  updateCardDetails,
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
    const { cardId, cardName, cardImage, localImagePath, quantity, price, notes } = body;

    if (!cardId || !cardName || !cardImage) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    await addCardToList(type, {
      cardId,
      cardName,
      cardImage,
      localImagePath,
      quantity: quantity || 1,
      price,
      notes,
    });

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
    const cardId = searchParams.get('cardId');

    if (!cardId) {
      return NextResponse.json(
        { message: 'Card ID required' },
        { status: 400 }
      );
    }

    await removeCardFromList(type, parseInt(cardId));

    return NextResponse.json({ success: true });
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
    const { cardId, quantity, price, notes } = body;

    if (!cardId) {
      return NextResponse.json(
        { message: 'Card ID required' },
        { status: 400 }
      );
    }

    if (quantity !== undefined) {
      await updateCardQuantity(type, cardId, quantity);
    }

    if (price !== undefined || notes !== undefined) {
      await updateCardDetails(type, cardId, { price, notes });
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
