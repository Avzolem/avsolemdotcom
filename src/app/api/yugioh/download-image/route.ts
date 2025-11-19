import { NextRequest, NextResponse } from 'next/server';
import * as cookie from 'cookie';
import fs from 'fs/promises';
import path from 'path';

function isAuthenticated(request: NextRequest): boolean {
  const cookies = cookie.parse(request.headers.get('cookie') || '');
  return cookies.yugioh_auth === 'authenticated';
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { imageUrl, cardId } = await request.json();

    if (!imageUrl || !cardId) {
      return NextResponse.json(
        { message: 'Missing imageUrl or cardId' },
        { status: 400 }
      );
    }

    // Download image from YGOProDeck
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine file extension from URL
    const urlObj = new URL(imageUrl);
    const ext = path.extname(urlObj.pathname) || '.jpg';

    // Save to public directory
    const fileName = `${cardId}${ext}`;
    const publicPath = path.join(process.cwd(), 'public', 'images', 'yugioh', 'cards', fileName);

    await fs.writeFile(publicPath, buffer);

    // Return the local path
    const localPath = `/images/yugioh/cards/${fileName}`;

    return NextResponse.json({
      success: true,
      localPath,
    });
  } catch (error) {
    console.error('Error downloading image:', error);
    return NextResponse.json(
      { message: 'Failed to download image', error: String(error) },
      { status: 500 }
    );
  }
}
