import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isDashboardAuthenticated } from '@/lib/auth/dashboard';
import { reorderToolboxItems } from '@/lib/mongodb/models/ToolboxItem';

export async function POST(request: NextRequest) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.ids)) {
    return NextResponse.json({ error: 'ids[] requerido' }, { status: 400 });
  }
  await reorderToolboxItems(body.ids);
  revalidatePath('/');
  return NextResponse.json({ ok: true });
}
