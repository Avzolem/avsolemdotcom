import { NextResponse } from 'next/server';
import { getProfileSettings } from '@/lib/mongodb/models/Settings';

export const revalidate = 60;

export async function GET() {
  try {
    const profile = await getProfileSettings();
    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json({ profile: null });
  }
}
