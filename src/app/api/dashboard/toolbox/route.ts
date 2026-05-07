import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isDashboardAuthenticated } from '@/lib/auth/dashboard';
import {
  listAllToolboxItems,
  createToolboxItem,
} from '@/lib/mongodb/models/ToolboxItem';

export async function GET(request: NextRequest) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const items = await listAllToolboxItems();
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const icon = typeof body.icon === 'string' ? body.icon.trim() : '';
  const href = typeof body.href === 'string' ? body.href.trim() : '';
  const enabled = body.enabled !== false;

  if (!name) return NextResponse.json({ error: 'name requerido' }, { status: 400 });
  if (!icon) return NextResponse.json({ error: 'icon requerido' }, { status: 400 });
  if (!href || !/^(\/|https?:|mailto:|tel:)/i.test(href)) {
    return NextResponse.json({ error: 'href debe empezar con /, http, mailto: o tel:' }, { status: 400 });
  }

  const item = await createToolboxItem({ name, icon, href, enabled });
  revalidatePath('/');
  return NextResponse.json({ item });
}
