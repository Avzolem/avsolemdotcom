import { NextRequest, NextResponse } from 'next/server';
import { isDashboardAuthenticated } from '@/lib/auth/dashboard';
import { listCampaigns, createCampaign, deleteCampaign } from '@/lib/mongodb/models/Campaign';

export async function GET(request: NextRequest) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const campaigns = await listCampaigns();
  return NextResponse.json({ campaigns });
}

export async function POST(request: NextRequest) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
  const bodyMd = typeof body.body === 'string' ? body.body : '';
  if (!title || title.length > 200) return NextResponse.json({ error: 'Título requerido' }, { status: 400 });
  if (!subject || subject.length > 200) return NextResponse.json({ error: 'Asunto requerido' }, { status: 400 });
  if (!bodyMd.trim()) return NextResponse.json({ error: 'Cuerpo requerido' }, { status: 400 });
  const campaign = await createCampaign({ title, subject, body: bodyMd });
  return NextResponse.json({ campaign }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
  const ok = await deleteCampaign(id);
  return NextResponse.json({ ok });
}
