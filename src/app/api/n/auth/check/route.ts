import { NextRequest, NextResponse } from 'next/server';
import { isNoteAuthenticated } from '@/lib/auth/note';

export async function GET(request: NextRequest) {
  if (isNoteAuthenticated(request)) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
