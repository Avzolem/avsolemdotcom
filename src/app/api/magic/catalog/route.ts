import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/mongodb/models/MagicProduct';

// GET - Get all active/in-stock products (public)
export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching catalog:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
