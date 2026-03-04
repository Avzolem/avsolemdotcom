import { NextRequest, NextResponse } from 'next/server';
import { searchCardsWithFilters, getCardById } from '@/lib/services/scryfall';

// Detect if a query looks like a Scryfall UUID
function looksLikeCardId(query: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(query.trim());
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || searchParams.get('name') || undefined;
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const color = searchParams.get('color') || undefined;
    const type = searchParams.get('type') || undefined;
    const cmc = searchParams.get('cmc') ? Number(searchParams.get('cmc')) : undefined;
    const cmcOp = searchParams.get('cmcOp') || undefined;
    const rarity = searchParams.get('rarity') || undefined;
    const set = searchParams.get('set') || undefined;
    const format = searchParams.get('format') || undefined;

    if (!query && !color && !type && cmc === undefined && !rarity && !set && !format) {
      return NextResponse.json({ data: [], totalCards: 0, hasMore: false });
    }

    // If query looks like a Scryfall UUID, try direct fetch first
    if (query && looksLikeCardId(query)) {
      const card = await getCardById(query);
      if (card) {
        return NextResponse.json({ data: [card], totalCards: 1, hasMore: false });
      }
    }

    // Parse colors - can be comma-separated or single value
    const colors = color ? color.split(',').filter(Boolean) : undefined;

    // Build CMC range based on operator
    let cmcMin: number | undefined;
    let cmcMax: number | undefined;
    if (cmc !== undefined) {
      switch (cmcOp) {
        case 'lte':
          cmcMax = cmc;
          break;
        case 'gte':
          cmcMin = cmc;
          break;
        case 'eq':
        default:
          cmcMin = cmc;
          cmcMax = cmc;
          break;
      }
    }

    const result = await searchCardsWithFilters({
      name: query,
      type,
      colors,
      cmcMin,
      cmcMax,
      rarity,
      set,
      format,
      page,
    });

    return NextResponse.json({
      data: result.cards,
      totalCards: result.totalCards,
      hasMore: result.hasMore,
    });
  } catch (error) {
    console.error('Magic search API error:', error);
    return NextResponse.json(
      { error: 'Error searching cards' },
      { status: 500 }
    );
  }
}
