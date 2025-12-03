import { NextResponse } from 'next/server';
import { getActiveProducts } from '@/lib/mongodb/models/Product';

// GET - Get all active products (public)
export async function GET() {
  try {
    const products = await getActiveProducts();
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching catalog:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
