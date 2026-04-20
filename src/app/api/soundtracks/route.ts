import { NextResponse } from 'next/server';
import { listSoundtracks } from '@/lib/mongodb/models/Soundtrack';

export const revalidate = 300;

export async function GET() {
  try {
    const soundtracks = await listSoundtracks();
    return NextResponse.json({ soundtracks });
  } catch {
    return NextResponse.json({ soundtracks: [] });
  }
}
