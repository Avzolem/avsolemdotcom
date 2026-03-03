import { NextRequest, NextResponse } from 'next/server';
import { searchCardsFullDetails, getCardById } from '@/lib/services/pokemontcg';

// Detect if a query looks like a card ID (e.g., "swsh3-20", "base1-4", "sv03.5-006")
function looksLikeCardId(query: string): boolean {
  return /^[a-z0-9.\-]+-[a-z0-9]+$/i.test(query.trim());
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || undefined;
    const category = searchParams.get('category') || undefined;
    const type = searchParams.get('type') || undefined;
    const hp = searchParams.get('hp') ? Number(searchParams.get('hp')) : undefined;
    const rarity = searchParams.get('rarity') || undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 50;

    if (!name && !category && !type && !hp && !rarity) {
      return NextResponse.json({ data: [] });
    }

    // If name looks like a card ID, try direct fetch first
    if (name && looksLikeCardId(name)) {
      const card = await getCardById(name);
      if (card) {
        return NextResponse.json({ data: [card] });
      }
    }

    const cards = await searchCardsFullDetails({
      name,
      category,
      type,
      hp,
      rarity,
      limit,
    });

    return NextResponse.json({ data: cards });
  } catch (error) {
    console.error('Pokemon search API error:', error);
    return NextResponse.json(
      { error: 'Error searching cards' },
      { status: 500 }
    );
  }
}
