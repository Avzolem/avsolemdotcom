import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.redirect('https://r-roms.github.io/', 301);
}