import { NextRequest, NextResponse } from 'next/server';

/**
 * Search for a Yu-Gi-Oh! card by Set Code
 * Uses YGOPRODeck API exclusively (most reliable and up-to-date)
 *
 * Supports automatic fallback for non-English set codes:
 * - If a code with -SP, -FR, -IT, -PT, etc. is not found
 * - Automatically tries the -EN version as fallback
 *
 * @route GET /api/yugioh/search-setcode?code={setCode}
 * @param code - Set code (e.g., LOB-EN001, SDK-001, SDCK-SP049)
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

    // Detect non-English language codes (SP, FR, IT, PT, DE, etc.)
    const nonEnglishPattern = /^(.+)-(SP|FR|IT|PT|DE|AE|KR|JP)(\d+.*)$/i;
    const match = cleanSetCode.match(nonEnglishPattern);

    // Try original code first
    const ygoprodeckResponse = await fetch(
      `https://db.ygoprodeck.com/api/v7/cardsetsinfo.php?setcode=${cleanSetCode}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (ygoprodeckResponse.ok) {
      const data = await ygoprodeckResponse.json();
      if (data && data.name) {
        return NextResponse.json({
          success: true,
          cardName: data.name,
          setCode: data.set_code,
          setName: data.set_name,
          setRarity: data.set_rarity,
          setPrice: data.set_price,
          source: 'ygoprodeck',
          usedFallback: false,
        });
      }
    }

    // If original code failed and it's a non-English code, try EN fallback
    if (match) {
      const prefix = match[1];
      const langCode = match[2];
      const suffix = match[3];
      const fallbackCode = `${prefix}-EN${suffix}`;

      const fallbackResponse = await fetch(
        `https://db.ygoprodeck.com/api/v7/cardsetsinfo.php?setcode=${fallbackCode}`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        if (fallbackData && fallbackData.name) {
          return NextResponse.json({
            success: true,
            cardName: fallbackData.name,
            setCode: fallbackData.set_code,
            setName: fallbackData.set_name,
            setRarity: fallbackData.set_rarity,
            setPrice: fallbackData.set_price,
            source: 'ygoprodeck',
            usedFallback: true,
            originalCode: cleanSetCode,
            fallbackCode: fallbackCode,
          });
        }
      }
    }

    // No card found with original or fallback code
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
