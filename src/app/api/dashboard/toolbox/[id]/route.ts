import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isDashboardAuthenticated } from '@/lib/auth/dashboard';
import { updateToolboxItem, deleteToolboxItem } from '@/lib/mongodb/models/ToolboxItem';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });

  const patch: Parameters<typeof updateToolboxItem>[1] = {};
  if (typeof body.name === 'string') patch.name = body.name;
  if (typeof body.icon === 'string') patch.icon = body.icon;
  if (typeof body.href === 'string') {
    if (!/^(\/|https?:|mailto:|tel:)/i.test(body.href.trim())) {
      return NextResponse.json({ error: 'href debe empezar con /, http, mailto: o tel:' }, { status: 400 });
    }
    patch.href = body.href;
  }
  if (typeof body.enabled === 'boolean') patch.enabled = body.enabled;

  const item = await updateToolboxItem(id, patch);
  if (!item) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  revalidatePath('/');
  return NextResponse.json({ item });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const { id } = await params;
  const ok = await deleteToolboxItem(id);
  if (!ok) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  revalidatePath('/');
  return NextResponse.json({ ok: true });
}
