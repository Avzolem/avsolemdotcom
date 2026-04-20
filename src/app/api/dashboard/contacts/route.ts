import { NextRequest, NextResponse } from 'next/server';
import { listContacts } from '@/lib/mongodb/models/Contact';
import { isDashboardAuthenticated } from '@/lib/auth/dashboard';

export async function GET(request: NextRequest) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const contacts = await listContacts();
    return NextResponse.json({ contacts });
  } catch (err) {
    console.error('dashboard/contacts GET error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
