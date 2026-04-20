import { NextRequest, NextResponse } from 'next/server';
import { isDashboardAuthenticated } from '@/lib/auth/dashboard';
import { getProfileSettings, upsertProfileSettings } from '@/lib/mongodb/models/Settings';

export async function GET(request: NextRequest) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const profile = await getProfileSettings();
  return NextResponse.json({ profile });
}

export async function POST(request: NextRequest) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });

  const patch: Record<string, unknown> = {};
  if (typeof body.avatar === 'string') patch.avatar = body.avatar.trim();
  if (body.availability === 'available' || body.availability === 'busy' || body.availability === 'not-available') {
    patch.availability = body.availability;
  }
  if (typeof body.availabilityNote === 'string') {
    patch.availabilityNote = body.availabilityNote.trim().slice(0, 200);
  }

  const profile = await upsertProfileSettings(patch);
  return NextResponse.json({ profile });
}
