import { NextRequest, NextResponse } from 'next/server';

/**
 * Search for a Yu-Gi-Oh! card by Set Code
 * Uses YGOPRODeck API exclusively (most reliable and up-to-date)
 *
 * @route GET /api/yugioh/search-setcode?code={setCode}
 * @param code - Set code (e.g., LOB-EN001, SDK-001)
 * @returns Card name, set info, and rarity if found
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const setCode = searchParams.get('code');

    if (!setCode) {
      return NextResponse.json(
        { error: 'Set code is required' },
        { status: 400 }
      );
    }

    const cleanSetCode = setCode.trim().toUpperCase();
    console.log('🔍 API: Searching by set code:', cleanSetCode);

    // Use YGOPRODeck API (updated Sept 2025, supports 1007+ sets)
    const ygoprodeckResponse = await fetch(
      `https://db.ygoprodeck.com/api/v7/cardsetsinfo.php?setcode=${cleanSetCode}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!ygoprodeckResponse.ok) {
      console.log('❌ API: YGOPRODeck returned error:', ygoprodeckResponse.status);
      return NextResponse.json(
        {
          success: false,
          error: `No se encontró ninguna carta con el Set Code: ${cleanSetCode}`,
        },
        { status: 404 }
      );
    }

    const data = await ygoprodeckResponse.json();

    if (data && data.name) {
      console.log('✅ API: Found via YGOPRODeck:', data.name);
      return NextResponse.json({
        success: true,
        cardName: data.name,
        setCode: data.set_code,
        setName: data.set_name,
        setRarity: data.set_rarity,
        setPrice: data.set_price,
        source: 'ygoprodeck',
      });
    }

    // No card found
    console.log('❌ API: No card found with set code:', cleanSetCode);
    return NextResponse.json(
      {
        success: false,
        error: `No se encontró ninguna carta con el Set Code: ${cleanSetCode}`,
      },
      { status: 404 }
    );

  } catch (error) {
    console.error('❌ API: Error searching by set code:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al buscar la carta por Set Code',
      },
      { status: 500 }
    );
  }
}
